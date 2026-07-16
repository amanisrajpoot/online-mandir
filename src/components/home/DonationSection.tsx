"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ArrowRight, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/Skeleton"
import { SevaCard } from "./SevaCard"

// Static fallback if DB not yet seeded
const STATIC_SEVAS = [
  { category: "bhandara", title: "भंडारा • Bhandara", subtitle: "Annadanam — Feed the Hungry", image_url: "/images/donations/bhandara.png", impactStatement: "₹101 feeds 10 people", donors_count: 1248 },
  { category: "gau-seva", title: "गौ सेवा • Gau Seva", subtitle: "Cow Protection & Care", image_url: "/images/donations/gau-seva.png", impactStatement: "₹101 feeds a cow for a day", donors_count: 984 },
  { category: "janwar-seva", title: "जानवर सेवा • Janwar Seva", subtitle: "Stray Animal Rescue", image_url: "/images/donations/janwar-seva.png", impactStatement: "₹101 feeds 20 strays", donors_count: 762 },
  { category: "vriddha-seva", title: "वृद्ध आश्रम सेवा • Vriddha Seva", subtitle: "Care for the Elderly", image_url: "/images/donations/vriddha-seva.png", impactStatement: "₹251 feeds an elder for a month", donors_count: 543 },
  { category: "vidya-daan", title: "विद्या दान • Vidya Daan", subtitle: "Education for Children", image_url: "/images/donations/vidya-daan.png", impactStatement: "₹501 covers a child's books", donors_count: 891 },
]

export function DonationSection() {
  const [sevas, setSevas] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchSevas = async () => {
      try {
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .limit(5)

        if (error || !data || data.length === 0) {
          setSevas(STATIC_SEVAS)
        } else {
          setSevas(data)
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
    <section className="w-full py-8 bg-gradient-to-b from-transparent to-[var(--color-saffron-50)]/30 dark:to-[var(--color-saffron-500)]/5">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1.5 bg-[var(--color-sacred-red)]/10 text-[var(--color-sacred-red)] text-xs font-bold px-2.5 py-1 rounded-full border border-[var(--color-sacred-red)]/20">
                <Sparkles className="w-3 h-3" />
                Trending Sevas
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              सेवा दान करें
            </h2>
            <p className="text-sm text-[var(--color-mandir-text-muted)] mt-1">
              Donate to meaningful causes — earn divine blessings
            </p>
          </div>
          <Link
            href="/donate"
            className="hidden md:flex items-center gap-1 text-sm font-medium text-[var(--color-saffron-400)] hover:text-[var(--color-saffron-500)] transition-colors shrink-0"
          >
            सभी देखें | View All <ArrowRight className="ml-1 h-4 w-4" />
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
