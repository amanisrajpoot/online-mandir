"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Map } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { encodeId } from "@/lib/utils"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"

export default function TemplesPage() {
  const [temples, setTemples] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const supabase = createClient()

  React.useEffect(() => {
    const fetchTemples = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('temples')
          .select('*')
          
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        setTemples(data || [])
      } catch (error) {
        console.error("Error fetching temples:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemples()
  }, [searchQuery, supabase])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-heading)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)] inline-flex items-center gap-2">
          <Map className="h-8 w-8 text-[var(--color-saffron-500)]" />
          Ancient Temples
        </h1>
        <p className="mt-2 text-[var(--color-mandir-text-muted)] max-w-2xl mx-auto">
          Explore India&apos;s most revered temples and connect with the divine.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-mandir-text-muted)]" />
          <Input 
            placeholder="Search by temple name or location..." 
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Temples Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-80 animate-pulse bg-[var(--color-mandir-surface)] border-none" />
          ))}
        </div>
      ) : temples.length === 0 ? (
        <div className="text-center py-20">
          <Map className="h-12 w-12 text-[var(--color-mandir-text-muted)] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[var(--color-mandir-text)]">No temples found</h3>
          <p className="text-[var(--color-mandir-text-muted)] mt-2">We couldn&apos;t find any temples matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {temples.map((temple, i) => (
            <motion.div
              key={temple.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/temples/${encodeId(temple.id)}`} className="block">
                <Card className="overflow-hidden h-full group border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-500)]/50 transition-colors bg-[var(--color-mandir-surface)]">
                  <div className="relative h-56 overflow-hidden">
                    <Image 
                      src={temple.image_url || "/images/kashi_vishwanath_temple.png"} 
                      alt={temple.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white shadow-lg border border-white/20 mb-2">
                        <MapPin className="mr-1.5 h-3.5 w-3.5" />
                        {temple.location}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold font-[var(--font-heading)] leading-tight mb-1 group-hover:text-[var(--color-saffron-400)] transition-colors">
                      {temple.name}
                    </h3>
                    <p className="text-sm font-medium text-[var(--color-saffron-500)] mb-3">
                      {temple.deity}
                    </p>
                    
                    <p className="text-sm text-[var(--color-mandir-text-muted)] line-clamp-3">
                      {temple.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* SEO Content Section */}
      <article className="mt-20 pt-10 border-t border-[var(--color-mandir-border)]">
        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-4">
          Discover India's Most Sacred Temples
        </h2>
        <div className="space-y-4 text-[var(--color-mandir-text-muted)] leading-relaxed">
          <p>
            India is a land of profound spirituality, home to thousands of ancient and powerful temples. Each mandir carries a unique history, architectural brilliance, and divine energy that has attracted devotees for centuries. Through Vandanam, you can explore the history, significance, and deities of these prominent temples from the comfort of your home.
          </p>
          <p>
            Whether it's the jyotirlingas like Mahakaleshwar and Kashi Vishwanath, or the revered Shakti Peethas like Mata Vaishno Devi, our comprehensive temple directory provides you with the spiritual context you need. We bring the divine presence closer to you by offering online puja booking and chadhava services directly connected to these sacred sites.
          </p>
          <p>
            Browse our directory to learn more about temple timings, spiritual significance, and the various rituals performed. Vandanam is your trusted digital companion for all your spiritual and devotional needs across India's holiest shrines.
          </p>
        </div>
      </article>
    </div>
  )
}
