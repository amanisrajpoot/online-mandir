"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Flower2, ArrowRight } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/Skeleton"
import { Card, CardContent } from "@/components/ui/Card"
import { encodeId } from "@/lib/utils"

export function ChadhavaQuickSelect() {
  const [items, setItems] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('chadhava_items')
          .select(`
            *,
            temples (name)
          `)
          .limit(4)
        
        if (error) throw error
        setItems(data || [])
      } catch (error) {
        console.error("Error fetching chadhava items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Flower2 className="h-6 w-6 text-[var(--color-saffron-500)] mr-2" />
            <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              चढ़ावा अर्पित करें • Offer Chadhava
            </h2>
          </div>
          <Link href="/chadhava" className="text-sm font-medium text-[var(--color-saffron-400)] hover:text-[var(--color-saffron-500)] flex items-center transition-colors">
            सभी देखें | View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-sm">
                <Skeleton className="h-32 w-full rounded-none" />
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual content
            items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/chadhava/${encodeId(item.id)}`}>
                  <Card className="overflow-hidden h-full group border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-400)] transition-colors hover:shadow-[0_0_15px_rgba(251,146,60,0.15)] bg-[var(--color-mandir-surface)]/80 backdrop-blur-sm">
                    <div className="relative h-28 sm:h-36 overflow-hidden">
                      <Image 
                        src={item.image_url || "/images/chadhava_pushp.png"} 
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                        <div className="text-[10px] font-medium text-[var(--color-saffron-600)] truncate bg-[var(--color-mandir-card)]/80 px-1.5 py-0.5 rounded backdrop-blur-sm border border-[var(--color-mandir-border)]">
                          {item.temples?.name}
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-3 relative z-10 -mt-2">
                      <h3 className="text-sm sm:text-base font-semibold font-[var(--font-heading)] leading-tight truncate group-hover:text-[var(--color-saffron-400)] transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-bold text-[var(--color-mandir-text)]">₹{item.price}</span>
                        <span className="text-[10px] uppercase font-bold text-[var(--color-saffron-500)] tracking-wider">अर्पित करें | Offer</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
