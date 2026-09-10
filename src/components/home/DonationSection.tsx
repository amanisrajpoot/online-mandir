"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ArrowRight, Flame } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/Skeleton"
import { SevaCard } from "./SevaCard"

// Spiritual sevas only — disaster relief is shown separately in UrgentReliefBanner
const RELIEF_CATEGORIES = ['nepal-flood-relief', 'wayanad-relief', 'assam-flood-relief']
const EXCLUDED_CATEGORIES = [...RELIEF_CATEGORIES, 'janwar-seva', 'gav-seva', 'vidya-daan', 'vriksha-seva', 'swasthya-seva']

const STATIC_SEVAS = [
  { category: "bhandara", title: "भंडारा • Bhandara", subtitle: "Annadanam — Feed the Hungry", image_url: "/images/donations/bhandara-annadanam.jpg", impactStatement: "₹101 feeds 10 pilgrims with a hot meal", donors_count: 1248 },
  { category: "gau-seva", title: "गौ सेवा • Gau Seva", subtitle: "Desi Cow Protection & Care", image_url: "/images/donations/gau-seva.png", impactStatement: "₹101 feeds a rescued cow for a day", donors_count: 984 },
  { category: "mandir-seva", title: "मंदिर सेवा • Mandir Seva", subtitle: "Ancient Temple Restoration", image_url: "/images/donations/mandir-seva.jpg", impactStatement: "₹101 lights sanctuary lamps for 10 days", donors_count: 788 },
  { category: "nadi-seva", title: "नदी सेवा • Nadi Seva", subtitle: "Sacred River & Ghat Cleanup", image_url: "/images/donations/nadi-seva.jpg", impactStatement: "₹101 clears 50m of sacred riverbank", donors_count: 427 },
  { category: "vriddha-seva", title: "वृद्ध सेवा • Vriddha Seva", subtitle: "Elderly Dignity & Care Homes", image_url: "/images/donations/vriddha-seva.png", impactStatement: "₹101 feeds an elder for a day", donors_count: 543 },
]

export function DonationSection() {
  const [sevas, setSevas] = React.useState<any[]>(STATIC_SEVAS)
  const [loading, setLoading] = React.useState(false)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchSevas = async () => {
      try {
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .limit(8)

        // Only show spiritual sevas — exclude disaster relief (shown in UrgentReliefBanner) and deactivated causes
        const validData = (data || []).filter(s => !EXCLUDED_CATEGORIES.includes(s.category)).slice(0, 5)

        if (error || validData.length === 0) {
          setSevas(STATIC_SEVAS)
        } else {
          setSevas(validData)
        }
      } catch {
        setSevas(STATIC_SEVAS)
      } finally {
        setLoading(false)
      }
    }
    fetchSevas()
  }, [])

  return (
    <section className="w-full py-8 bg-gradient-to-b from-[var(--color-saffron-50)]/20 to-[var(--color-saffron-50)]/40 dark:from-[var(--color-saffron-500)]/5 dark:to-[var(--color-saffron-500)]/8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1.5 bg-[var(--color-saffron-500)]/10 text-[var(--color-saffron-500)] text-xs font-bold px-2.5 py-1 rounded-full border border-[var(--color-saffron-500)]/20">
                <Flame className="w-3 h-3" />
                Nitya Seva — Ongoing Spiritual Causes
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              दिव्य सेवा एवं दान
            </h2>
            <p className="text-sm text-[var(--color-mandir-text-muted)] mt-1">
              Sacred Sevas — Bhandara, Gau Seva, Mandir Sanrakshan &amp; More. Earn Merit. Transform Lives.
            </p>
          </div>
          <Link
            href="/donate"
            className="hidden md:flex items-center gap-1 text-sm font-medium text-[var(--color-saffron-400)] hover:text-[var(--color-saffron-500)] transition-colors shrink-0"
          >
            सभी सेवाएं | View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[var(--color-mandir-border)] p-5 space-y-3 bg-[var(--color-mandir-card)]">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))
            : sevas.map((seva, i) => (
                <SevaCard
                  key={seva.category || i}
                  category={seva.category}
                  title={seva.title}
                  subtitle={seva.subtitle}
                  imageUrl={seva.image_url}
                  impactStatement={seva.impact_statement || seva.impactStatement}
                  donorsCount={seva.donors_count}
                  index={i}
                  variant="full"
                />
              ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-5 flex justify-center md:hidden">
          <Link href="/donate">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-sacred-red)] to-[var(--color-saffron-500)] text-white rounded-full text-sm font-bold shadow-lg"
            >
              <Heart className="w-4 h-4 fill-white" />
              सभी सेवाएं देखें | View All Sevas
            </motion.button>
          </Link>
        </div>


      </div>
    </section>
  )
}
