"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ArrowLeft, Sparkles } from "lucide-react"
import { SevaCard } from "@/components/home/SevaCard"

// Hardcoded fallback (same as STATIC_SEVAS but all 10)
// Hardcoded fallback with relief causes first and dedicated authentic images
const STATIC_SEVAS = [
  { category: "nepal-flood-relief", title: "नेपाल बाढ़ राहत • Nepal Flood Relief", subtitle: "Emergency Flash Flood Relief & Humanitarian Aid", image_url: "/images/nepal-flood/nepal-flood-hero.jpg", impact_statement: "₹101 feeds a survivor • ₹501 sends emergency nutrition & blankets", donors_count: 1840, is_urgent: true, type: "disaster" },
  { category: "wayanad-relief", title: "वायनाड भूस्खलन एवं बाढ़ राहत • Wayanad Disaster Relief", subtitle: "Emergency Landslide & Flood Relief in Kerala", image_url: "/images/donations/wayanad-relief.jpg", impact_statement: "₹101 provides 1 warm meal • ₹1,001 sends emergency family essentials", donors_count: 340, is_urgent: true, type: "disaster" },
  { category: "assam-flood-relief", title: "असम ब्रह्मपुत्र बाढ़ राहत • Assam Flood Relief", subtitle: "Urgent Monsoon Flood Relief & Boat Rescue Rations", image_url: "/images/donations/assam-flood-relief.jpg", impact_statement: "₹101 supplies drinking water & biscuits • ₹1,001 sends flood medical kit", donors_count: 195, is_urgent: true, type: "disaster" },
  { category: "bhandara", title: "भंडारा • Bhandara", subtitle: "Annadanam — Feed the Hungry", image_url: "/images/donations/bhandara-annadanam.jpg", impact_statement: "₹101 feeds 10 people • ₹501 feeds 50 people", donors_count: 1248, type: "seva" },
  { category: "gau-seva", title: "गौ सेवा • Gau Seva", subtitle: "Cow Protection & Care", image_url: "/images/donations/gau-seva.png", impact_statement: "₹101 feeds a cow for a day", donors_count: 984, type: "seva" },
  { category: "vriddha-seva", title: "वृद्ध आश्रम सेवा • Vriddha Seva", subtitle: "Care for the Elderly", image_url: "/images/donations/vriddha-seva.png", impact_statement: "₹101 provides a day's nutritious meal • ₹251 covers medical checkups", donors_count: 543, type: "seva" },
  { category: "mandir-seva", title: "मंदिर सेवा • Mandir Seva", subtitle: "Temple Restoration & Maintenance", image_url: "/images/donations/mandir-seva.jpg", impact_statement: "₹101 sponsors sanctum oil & diya • ₹501 restores ancient stone carving", donors_count: 788, type: "seva" },
  { category: "nadi-seva", title: "नदी सेवा • Nadi Seva", subtitle: "Sacred River Cleanup", image_url: "/images/donations/nadi-seva.jpg", impact_statement: "₹101 clears 50m of sacred riverbank • ₹501 equips ghat cleanup team", donors_count: 427, type: "seva" },
]

interface DonatePageProps {
  sevas: any[]
}

export function DonatePage({ sevas }: DonatePageProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | "disaster" | "seva">("all")

  // Filter out deactivated categories from incoming DB sevas if present
  const validSevas = (sevas || []).filter(s => ![
    'janwar-seva', 'gav-seva', 'vidya-daan', 'vriksha-seva', 'swasthya-seva'
  ].includes(s.category))

  // Enforce relief causes ALWAYS first on the All Causes view
  const sortedSevas = [...validSevas].sort((a, b) => {
    const aIsRelief = a.category?.includes("relief") || a.type === "disaster" ? 0 : 1
    const bIsRelief = b.category?.includes("relief") || b.type === "disaster" ? 0 : 1
    if (aIsRelief !== bIsRelief) return aIsRelief - bIsRelief
    return (a.display_order || 99) - (b.display_order || 99)
  })

  const baseSevas = sortedSevas.length > 0 ? sortedSevas : STATIC_SEVAS

  const displaySevas = baseSevas.filter(item => {
    if (activeTab === "all") return true
    const isDisaster = item.category?.includes("relief") || item.type === "disaster"
    if (activeTab === "disaster") return isDisaster
    if (activeTab === "seva") return !isDisaster
    return true
  })

  return (
    <div className="min-h-screen bg-[var(--color-mandir-bg)]">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-sacred-red)]/90 via-[var(--color-saffron-600)] to-[var(--color-temple-gold)] py-14 md:py-20">
        {/* Decorative mandala bg */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        <div className="absolute -bottom-1 left-0 right-0 h-12 bg-[var(--color-mandir-bg)]" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4" />
              पुण्य का अवसर • A Chance to Earn Merit
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold font-[var(--font-heading)] text-white mb-4 leading-tight"
          >
            मानव सेवा एवं धर्म दान
            <span className="block text-2xl md:text-3xl font-normal opacity-90 mt-1">
              Humanitarian Relief & Divine Seva — Devotion in Action
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-base md:text-lg max-w-2xl mx-auto"
          >
            True devotion manifests in selfless service to humanity. Support emergency disaster relief, feed the hungry, heal the sick, and shield vulnerable lives across our communities.
          </motion.p>

          {/* Total impact stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-8 text-white"
          >
            {[
              { value: "1,840+", label: "Donors & Changemakers" },
              { value: "₹14.8 Lakhs+", label: "Relief & Seva Raised" },
              { value: "8", label: "Active Causes & Missions" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold">{stat.value}</div>
                <div className="text-xs text-white/70 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Seva Grid */}
      <section className="container mx-auto px-4 max-w-6xl py-12">
        {/* Urgent Emergency Spotlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-2xl overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-xl border border-red-400/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">
              <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
              🚨 Urgent Disaster Relief Mission
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold font-[var(--font-heading)]">
              Nepal Is Devastated. Stand With Flood Victims.
            </h3>
            <p className="text-white/90 text-sm md:text-base leading-relaxed">
              Flash floods have wiped out entire villages in Nepal overnight. Over 10,000 meals distributed so far. Stand with the victims and send immediate relief.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/nepal-flood-relief"
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-white text-red-700 hover:bg-red-50 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Support Nepal Relief &rarr;
            </Link>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              Choose Your Seva & Relief Fund
            </h2>
            <p className="text-sm text-[var(--color-mandir-text-muted)] mt-1">
              {displaySevas.length} active causes — direct impact, 100% verified & transparent
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] rounded-xl shadow-xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[var(--color-sacred-red)] text-white shadow-xs"
                  : "text-[var(--color-mandir-text-muted)] hover:text-[var(--color-mandir-text)]"
              }`}
            >
              All Causes ({baseSevas.length})
            </button>
            <button
              onClick={() => setActiveTab("disaster")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "disaster"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-[var(--color-mandir-text-muted)] hover:text-red-600"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Disaster Relief ({baseSevas.filter(s => s.category?.includes("relief") || s.type === "disaster").length})
            </button>
            <button
              onClick={() => setActiveTab("seva")}
              className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "seva"
                  ? "bg-[var(--color-saffron-600)] text-white shadow-xs"
                  : "text-[var(--color-mandir-text-muted)] hover:text-[var(--color-mandir-text)]"
              }`}
            >
              Sacred Seva ({baseSevas.filter(s => !s.category?.includes("relief") && s.type !== "disaster").length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {displaySevas.map((seva, i) => (
            <SevaCard
              key={seva.category}
              category={seva.category}
              title={seva.title}
              subtitle={seva.subtitle}
              imageUrl={seva.image_url}
              impactStatement={seva.impact_statement || ""}
              donorsCount={seva.donors_count || 0}
              index={i}
              variant="full"
            />
          ))}
        </div>

        {/* Trust section */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[var(--color-saffron-50)] to-[var(--color-temple-gold-light)]/30 dark:from-[var(--color-saffron-500)]/10 dark:to-[var(--color-temple-gold)]/10 border border-[var(--color-saffron-500)]/20 p-6 md:p-8">
          <h3 className="text-lg font-bold font-[var(--font-heading)] text-center text-[var(--color-mandir-text)] mb-6">
            Why Donate Through Vandanam?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { emoji: "✅", title: "100% Transparent", desc: "Track where every rupee goes" },
              { emoji: "🔒", title: "Secure Payments", desc: "UPI, Cards, Net Banking via Cashfree" },
              { emoji: "📩", title: "Instant Receipt", desc: "Email confirmation after donation" },
              { emoji: "🙏", title: "Verified Causes", desc: "All sevas are vetted & active" },
            ].map((item) => (
              <div key={item.title} className="space-y-1">
                <div className="text-2xl">{item.emoji}</div>
                <div className="text-sm font-bold text-[var(--color-mandir-text)]">{item.title}</div>
                <div className="text-xs text-[var(--color-mandir-text-muted)]">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
