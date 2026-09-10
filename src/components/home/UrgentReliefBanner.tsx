"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle, Heart, ArrowRight, Users, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Static content (copy, images, badges) — numbers come from DB
const RELIEF_CONFIG = [
  {
    category: "nepal-flood-relief",
    flag: "🇳🇵",
    badge: "FLASH FLOODS — ACTIVE",
    title: "Nepal Flood Relief",
    hindiTitle: "नेपाल बाढ़ राहत",
    location: "Koshi Basin, Terai, Nepal",
    description: "Catastrophic flash floods have displaced thousands of families. Survivors need food, water & shelter — urgently.",
    image: "/images/nepal-flood/nepal-flood-hero.jpg",
    impactStat: "₹101 feeds a survivor for a day",
    // fallback values (used only if DB fetch fails)
    raised: 24500,
    goal: 1000000,
    donors: 23,
  },
  {
    category: "wayanad-relief",
    flag: "🇮🇳",
    badge: "LANDSLIDE — ONGOING",
    title: "Wayanad Relief",
    hindiTitle: "वायनाड भूस्खलन राहत",
    location: "Chooralmala & Mundakkai, Kerala",
    description: "Midnight landslides erased entire villages in the Western Ghats. 400+ lives lost. Survivors rebuilding from nothing.",
    image: "/images/donations/wayanad-relief.jpg",
    impactStat: "₹101 provides 1 warm meal",
    raised: 15200,
    goal: 500000,
    donors: 18,
  },
  {
    category: "assam-flood-relief",
    flag: "🇮🇳",
    badge: "BRAHMAPUTRA FLOODS",
    title: "Assam Flood Relief",
    hindiTitle: "असम बाढ़ राहत",
    location: "Brahmaputra Basin, Assam",
    description: "1.5 million marooned. Char island villages completely cut off. Boat rescues and water purification underway.",
    image: "/images/donations/assam-flood-relief.jpg",
    impactStat: "₹101 supplies clean drinking water",
    raised: 9800,
    goal: 300000,
    donors: 11,
  },
]

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n.toLocaleString("en-IN")}`
}
export function UrgentReliefBanner() {
  const supabase = createClient()
  const [causes, setCauses] = React.useState(RELIEF_CONFIG)

  React.useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("donations")
        .select("category, donors_count, total_raised, goal_amount")
        .in("category", ["nepal-flood-relief", "wayanad-relief", "assam-flood-relief"])

      if (data && data.length > 0) {
        setCauses(
          RELIEF_CONFIG.map((cfg) => {
            const live = data.find((d) => d.category === cfg.category)
            return live
              ? {
                ...cfg,
                raised: Number(live.total_raised) || cfg.raised,
                goal: Number(live.goal_amount) || cfg.goal,
                donors: Number(live.donors_count) || cfg.donors,
              }
              : cfg
          })
        )
      }
    }
    load()
  }, [])

  return (
    <section className="w-full py-10 md:py-14 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, rgba(127,29,29,0.08), rgba(127,29,29,0.03), transparent)" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(239,68,68,0.05)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(249,115,22,0.05)" }} />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <AlertTriangle className="w-3.5 h-3.5" />
              ACTIVE HUMANITARIAN CRISIS
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] leading-tight">
                आपदा राहत कोष
                <span className="block text-xl md:text-2xl mt-1 font-medium" style={{ color: "rgba(239,68,68,0.8)" }}>
                  Emergency Disaster Relief — Lives Depend On It
                </span>
              </h2>
              <p className="mt-2 text-sm text-[var(--color-mandir-text-muted)] max-w-xl">
                Real crises. Real people. Your contribution reaches verified on-ground relief teams within hours — no middlemen, no admin cuts.
              </p>
            </div>
            <Link
              href="/donate"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold shrink-0 whitespace-nowrap transition-colors"
              style={{ color: "#ef4444" }}
            >
              सभी कारण देखें <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Relief Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {causes.map((cause, i) => {
            const pct = Math.min(Math.round((cause.raised / cause.goal) * 100), 100)
            return (
              <motion.div
                key={cause.category}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 180 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/donate/${cause.category}`} className="block h-full">
                  <div
                    className="relative h-full rounded-2xl overflow-hidden bg-[var(--color-mandir-card)] shadow-md transition-all duration-300"
                    style={{ border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    {/* Hero Image */}
                    <div className="relative h-44 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cause.image}
                        alt={cause.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.25), transparent)" }} />

                      {/* Urgency Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          {cause.badge}
                        </span>
                      </div>

                      {/* Title overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white/75 text-[11px] font-medium mb-0.5">
                          {cause.flag} {cause.location}
                        </p>
                        <h3 className="text-white font-bold text-lg leading-tight font-[var(--font-heading)]">
                          {cause.hindiTitle} • {cause.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <p className="text-sm text-[var(--color-mandir-text-muted)] leading-relaxed mb-4 line-clamp-3">
                        {cause.description}
                      </p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-bold text-[var(--color-mandir-text)]">{formatINR(cause.raised)} raised</span>
                          <span className="text-[var(--color-mandir-text-muted)]">{pct}% of goal</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-mandir-border)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(to right, #dc2626, #f97316)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(pct, 2)}%` }}
                            transition={{ duration: 1, delay: i * 0.15 + 0.3, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-mandir-text-muted)]">
                          <Users className="w-3.5 h-3.5 text-red-400" />
                          <span>
                            <strong className="text-[var(--color-mandir-text)]">{cause.donors.toLocaleString("en-IN")}</strong> changemakers
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "#16a34a" }}>
                          <TrendingUp className="w-3 h-3" />
                          {cause.impactStat}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-bold shadow-lg transition-shadow" style={{ background: "linear-gradient(to right, #dc2626, #e11d48)" }}>
                          <Heart className="w-4 h-4 fill-white" />
                          अभी दान करें — Donate Now
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-5 flex justify-center md:hidden">
          <Link href="/donate">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-full text-sm font-bold shadow-lg"
              style={{ background: "#dc2626" }}
            >
              <AlertTriangle className="w-4 h-4" />
              सभी राहत कोष देखें | View All Relief Causes
            </motion.button>
          </Link>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[var(--color-mandir-text-muted)]"
        >
          {[
            "✅ 100% Funds to Ground — Zero Admin Cuts",
            "🔒 Secure UPI / Card / NetBanking",
            "📋 80G Tax Exemption Eligible",
            "📸 Verified Photo Dispatches to Donors",
          ].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
