"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Filter, Sparkles, MapPin } from "lucide-react"

import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { encodeId } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { StarRating } from "@/components/ui/StarRating"
import Link from "next/link"

export default function PujasPage() {
  const [pujas, setPujas] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [category, setCategory] = React.useState("All")
  const supabase = createClient()

  React.useEffect(() => {
    const fetchPujas = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('pujas')
          .select(`
            *,
            temples (name, location)
          `)
          
        if (category !== "All") {
          query = query.eq('category', category)
        }
        
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        setPujas(data || [])
      } catch (error) {
        console.error("Error fetching pujas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPujas()
  }, [category, searchQuery, supabase])

  const categories = ["All", "Health", "Marriage", "Wealth", "Festival", "Career"]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-heading)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)] inline-flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-[var(--color-saffron-500)]" />
          Mandir Pujas
        </h1>
        <p className="mt-2 text-[var(--color-mandir-text-muted)] max-w-2xl mx-auto">
          Book authentic pujas at ancient temples. Resolving doshas and bringing prosperity.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-mandir-text-muted)]" />
          <Input 
            placeholder="Search pujas for specific problems..." 
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 hide-scrollbar scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
              className={category === cat ? "bg-[var(--color-saffron-500)] shrink-0" : "shrink-0"}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Puja List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-[400px] animate-pulse bg-[var(--color-mandir-surface)] border-none" />
          ))}
        </div>
      ) : pujas.length === 0 ? (
        <div className="text-center py-20">
          <Sparkles className="h-12 w-12 text-[var(--color-mandir-text-muted)] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[var(--color-mandir-text)]">No pujas found</h3>
          <p className="text-[var(--color-mandir-text-muted)] mt-2">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pujas.map((puja, i) => (
            <motion.div
              key={puja.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden h-full flex flex-col group border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-500)]/50 transition-colors bg-[var(--color-mandir-surface)]">
                <Link href={`/pujas/${encodeId(puja.id)}`} className="flex-1 flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-[var(--color-mandir-bg)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={puja.image_url || "/images/puja_ganesh.png"} 
                      alt={puja.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="secondary" className="bg-black/60 backdrop-blur-md border-white/10 text-white">
                        {puja.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="mb-2 flex items-center text-xs font-medium text-[var(--color-saffron-500)]">
                      <MapPin className="mr-1 h-3 w-3" />
                      {puja.temples?.name}, {puja.temples?.location}
                    </div>
                    
                    <h3 className="mb-1 text-lg font-bold font-[var(--font-heading)] leading-tight group-hover:text-[var(--color-saffron-500)] transition-colors">
                      {puja.title}
                    </h3>
                    
                    <div className="mb-2">
                      <StarRating rating={4.9} totalReviews={87} showText size={14} />
                    </div>
                    
                    <p className="mb-4 text-sm text-[var(--color-mandir-text-muted)] line-clamp-2 flex-1">
                      {puja.problem_statement}
                    </p>
                  </CardContent>
                </Link>
                
                <div className="px-5 pb-5 mt-auto border-t border-[var(--color-mandir-border)] pt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[var(--color-mandir-text-muted)] line-through">
                        ₹{puja.base_price}
                      </div>
                      <div className="text-lg font-bold text-[var(--color-mandir-text)]">
                        ₹{puja.sale_price}
                      </div>
                    </div>
                    
                    <Link href={`/pujas/${encodeId(puja.id)}/book`}>
                      <Button variant="gradient" className="rounded-full px-6">
                        Book
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
          ))}
        </div>
      )}

      {/* SEO Content Section */}
      <article className="mt-20 pt-10 border-t border-[var(--color-mandir-border)]">
        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-4">
          Why Book Online Pujas with Vandanam?
        </h2>
        <div className="space-y-4 text-[var(--color-mandir-text-muted)] leading-relaxed">
          <p>
            In today's fast-paced world, performing sacred rituals at ancient temples is not always geographically or practically possible. Vandanam bridges this gap by offering a seamless, transparent platform for booking authentic online pujas at India's most revered temples. Whether you are looking for a Rudrabhishek at Mahakaleshwar, a Mangal Dosh Nivaran, or a Satyanarayan Puja, our platform connects you with verified temple priests.
          </p>
          <p>
            Every puja booked through our platform is performed with the utmost devotion and strict adherence to Vedic principles. We ensure that your personalized Sankalp (name and gotra) is chanted by the pandit during the ceremony. To maintain complete transparency, you will receive a video recording of the ritual, and the blessed Prasad will be delivered directly to your home.
          </p>
          <p>
            Experience the divine blessings of Kashi Vishwanath, Siddhivinayak, and Mata Vaishno Devi from the comfort of your home. Book your online puja today and step closer to spiritual fulfillment.
          </p>
        </div>
      </article>
    </div>
  )
}
