"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ArrowLeft, Sparkles } from "lucide-react"
import { SevaCard } from "@/components/home/SevaCard"

// Hardcoded fallback (same as STATIC_SEVAS but all 10)
const STATIC_SEVAS = [
  { category: "bhandara", title: "भंडारा • Bhandara", subtitle: "Annadanam — Feed the Hungry", image_url: "/images/donations/bhandara.png", impact_statement: "₹101 feeds 10 people • ₹501 feeds 50 people", donors_count: 1248 },
  { category: "gau-seva", title: "गौ सेवा • Gau Seva", subtitle: "Cow Protection & Care", image_url: "/images/donations/gau-seva.png", impact_statement: "₹101 feeds a cow for a day", donors_count: 984 },
  { category: "janwar-seva", title: "जानवर सेवा • Janwar Seva", subtitle: "Stray Animal Rescue & Welfare", image_url: "/images/donations/janwar-seva.png", impact_statement: "₹101 feeds 20 strays", donors_count: 762 },
  { category: "gav-seva", title: "गाँव सेवा • Gav Seva", subtitle: "Village Development & Rural Uplift", image_url: "/images/donations/bhandara.png", impact_statement: "₹1001 installs a hand pump", donors_count: 341 },
  { category: "vriddha-seva", title: "वृद्ध आश्रम सेवा • Vriddha Seva", subtitle: "Care for the Elderly", image_url: "/images/donations/vriddha-seva.png", impact_statement: "₹251 feeds an elder for a month", donors_count: 543 },
  { category: "vidya-daan", title: "विद्या दान • Vidya Daan", subtitle: "Education for Children", image_url: "/images/donations/vidya-daan.png", impact_statement: "₹501 covers a child's books for a year", donors_count: 891 },
  { category: "vriksha-seva", title: "वृक्ष सेवा • Vriksha Seva", subtitle: "Plant a Sacred Tree", image_url: "/images/donations/bhandara.png", impact_statement: "₹51 plants 1 tree • ₹501 plants 11 trees", donors_count: 1102 },
  { category: "nadi-seva", title: "नदी सेवा • Nadi Seva", subtitle: "Sacred River Cleanup", image_url: "/images/donations/bhandara.png", impact_statement: "₹101 cleans 100m of riverbank", donors_count: 427 },
  { category: "swasthya-seva", title: "स्वास्थ्य सेवा • Swasthya Seva", subtitle: "Free Medical Aid & Health Camps", image_url: "/images/donations/bhandara.png", impact_statement: "₹251 provides medicines for a family", donors_count: 619 },
  { category: "mandir-seva", title: "मंदिर सेवा • Mandir Seva", subtitle: "Temple Restoration & Maintenance", image_url: "/images/donations/bhandara.png", impact_statement: "₹501 repairs a portion of a temple wall", donors_count: 788 },
]

interface DonatePageProps {
  sevas: any[]
}

export function DonatePage({ sevas }: DonatePageProps) {
  const displaySevas = sevas.length > 0 ? sevas : STATIC_SEVAS

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
            सेवा दान करें
            <span className="block text-2xl md:text-3xl font-normal opacity-90 mt-1">
              Donate & Serve — Earn Divine Blessings
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto"
          >
            Choose a cause close to your heart. Every act of giving — big or small — creates ripples of positive change and earns immeasurable spiritual merit.
          </motion.p>

          {/* Total impact stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-8 text-white"
          >
            {[
              { value: "8,500+", label: "Donors" },
              { value: "₹42 Lakhs", label: "Raised" },
              { value: "10", label: "Active Sevas" },
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              Choose Your Seva
            </h2>
            <p className="text-sm text-[var(--color-mandir-text-muted)] mt-1">
              {displaySevas.length} trending causes — all verified & transparent
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--color-mandir-text-muted)]">
            <Heart className="w-3.5 h-3.5 text-[var(--color-sacred-red)] fill-[var(--color-sacred-red)]" />
            <span>8,500+ donors trust us</span>
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
