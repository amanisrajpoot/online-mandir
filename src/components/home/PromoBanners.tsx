"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/Card"

export function PromoBanners({ position }: { position: string }) {
  const [promos, setPromos] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchPromos = async () => {
      try {
        const { data, error } = await supabase
          .from('promo_banners')
          .select('*')
          .eq('is_active', true)
          .eq('position', position)
          .order('sort_order', { ascending: true })
        
        if (error) throw error
        setPromos(data || [])
      } catch (error) {
        console.error("Error fetching promos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromos()
  }, [position, supabase])

  if (loading || promos.length === 0) {
    return null
  }

  // Group by display style to render correctly
  const fullWidth = promos.filter(p => p.display_style === 'full-width')
  const halfWidth = promos.filter(p => p.display_style === 'half-width')
  const grids = promos.filter(p => p.display_style === 'grid')

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Full Width Banners */}
        {fullWidth.length > 0 && (
          <div className="space-y-6">
            {fullWidth.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={promo.link || "#"}>
                  <Card className="overflow-hidden border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] relative group">
                    <div className="relative h-48 sm:h-64 w-full">
                      <Image 
                        src={promo.image_url} 
                        alt={promo.title}
                        fill
                        sizes="100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl sm:text-3xl font-bold font-[var(--font-heading)] text-white drop-shadow-md">
                          {promo.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Half Width Banners (rendered in 2 columns) */}
        {halfWidth.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {halfWidth.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={promo.link || "#"}>
                  <Card className="overflow-hidden border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] relative group">
                    <div className="relative h-40 sm:h-48 w-full">
                      <Image 
                        src={promo.image_url} 
                        alt={promo.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg sm:text-xl font-bold font-[var(--font-heading)] text-white drop-shadow-md">
                          {promo.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Grid Banners (rendered in 3 or 4 columns) */}
        {grids.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {grids.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href={promo.link || "#"}>
                  <Card className="overflow-hidden border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] relative group h-full">
                    <div className="relative aspect-square w-full">
                      <Image 
                        src={promo.image_url} 
                        alt={promo.title}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-center">
                        <h3 className="text-sm sm:text-base font-bold font-[var(--font-heading)] text-white drop-shadow-md leading-tight">
                          {promo.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
