"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, ArrowRight } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/Skeleton"
import { encodeId } from "@/lib/utils"

export function TempleCarousel() {
  const [temples, setTemples] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchTemples = async () => {
      try {
        const { data, error } = await supabase
          .from('temples')
          .select('*')
          .limit(5)
        
        if (error) throw error
        setTemples(data || [])
      } catch (error) {
        console.error("Error fetching temples:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemples()
  }, [])

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
            प्रसिद्ध मंदिर • Famous Temples
          </h2>
          <Link href="/temples" className="text-sm font-medium text-[var(--color-saffron-400)] hover:text-[var(--color-saffron-500)] flex items-center transition-colors">
            सभी देखें | View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[280px] sm:min-w-[320px] shrink-0 snap-center">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-3">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              // Actual content
              temples.map((temple, index) => (
                <motion.div 
                  key={temple.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[280px] sm:min-w-[320px] shrink-0 snap-center group"
                >
                  <Link href={`/temples/${encodeId(temple.id)}`} className="block">
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-3 border border-[var(--color-mandir-border)] shadow-md group-hover:shadow-lg group-hover:shadow-[var(--color-saffron-500)]/10 transition-all duration-300">
                      <Image 
                        src={temple.image_url} 
                        alt={temple.name} 
                        fill
                        sizes="(max-width: 640px) 280px, 320px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-2 py-1 text-[10px] font-medium text-white mb-2">
                          <MapPin className="mr-1 h-3 w-3" />
                          {temple.location}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold font-[var(--font-heading)] text-[var(--color-mandir-text)] group-hover:text-[var(--color-saffron-400)] transition-colors">
                      {temple.name}
                    </h3>
                    <p className="text-sm text-[var(--color-mandir-text-muted)]">
                      {temple.deity}
                    </p>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
