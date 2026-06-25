"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Clock } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/Skeleton"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { encodeId } from "@/lib/utils"

export function TrendingPujas() {
  const [pujas, setPujas] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchPujas = async () => {
      try {
        const { data, error } = await supabase
          .from('pujas')
          .select(`
            *,
            temples (name, location)
          `)
          .limit(3)
        
        if (error) throw error
        setPujas(data || [])
      } catch (error) {
        console.error("Error fetching pujas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPujas()
  }, [])

  return (
    <section className="w-full py-8 bg-[var(--color-mandir-surface)]/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-[var(--color-saffron-500)] mr-2" />
            <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              प्रमुख पूजा • Trending Pujas
            </h2>
          </div>
          <Link href="/pujas" className="text-sm font-medium text-[var(--color-saffron-400)] hover:text-[var(--color-saffron-500)] flex items-center transition-colors">
            सभी देखें | View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-md">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5 mb-4" />
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-24 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual content
            pujas.map((puja, index) => (
              <motion.div
                key={puja.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full flex flex-col group border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-500)]/50 transition-colors">
                  <div className="relative h-48 overflow-hidden bg-[var(--color-mandir-surface)]">
                    <Image 
                      src={puja.image_url || "/images/puja_ganesh.png"} 
                      alt={puja.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="secondary" className="bg-black/50 backdrop-blur-md border-none text-white">
                        {puja.category}
                      </Badge>
                    </div>
                    {puja.booking_deadline && new Date(puja.booking_deadline) > new Date() && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-[var(--color-saffron-300)] border border-white/10 shadow-lg">
                          <Clock className="mr-1.5 h-3 w-3" />
                          बुकिंग जल्द बंद होगी | Booking closes soon
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="mb-1 text-xs font-medium text-[var(--color-saffron-500)]">
                      {puja.temples?.name}
                    </div>
                    
                    <h3 className="mb-2 text-lg font-bold font-[var(--font-heading)] leading-tight line-clamp-2">
                      {puja.title}
                    </h3>
                    
                    <p className="mb-4 text-sm text-[var(--color-mandir-text-muted)] line-clamp-2 flex-1">
                      {puja.problem_statement}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-[var(--color-mandir-border)] flex items-center justify-between">
                      <div>
                        <div className="text-xs text-[var(--color-mandir-text-muted)] line-through">
                          ₹{puja.base_price}
                        </div>
                        <div className="text-lg font-bold text-[var(--color-mandir-text)]">
                          ₹{puja.sale_price}
                        </div>
                      </div>
                      
                      <Link href={`/pujas/${encodeId(puja.id)}`}>
                        <Button size="sm" variant="outline" className="rounded-full group-hover:bg-[var(--color-saffron-500)] group-hover:text-white group-hover:border-[var(--color-saffron-500)] transition-all">
                          बुक करें | Book Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
