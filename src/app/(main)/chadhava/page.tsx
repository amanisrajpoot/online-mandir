"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Flower2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { encodeId } from "@/lib/utils"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function ChadhavaPage() {
  const [items, setItems] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { t } = useLanguage()
  const supabase = createClient()

  React.useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('chadhava_items')
          .select(`
            *,
            temples (name, location)
          `)
          
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        setItems(data || [])
      } catch (error) {
        console.error("Error fetching chadhava items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [searchQuery, supabase])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-heading)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)] inline-flex items-center gap-2 whitespace-pre-wrap">
          <Flower2 className="h-8 w-8 text-[var(--color-saffron-500)]" />
          {t("Offer Chadhava")}
        </h1>
        <p className="mt-2 text-[var(--color-mandir-text-muted)] max-w-2xl mx-auto whitespace-pre-wrap">
          {t("Offer sacred items to the deity from the comfort of your home.")}
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-mandir-text-muted)]" />
          <Input 
            placeholder={t("Search")} 
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Items List */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="h-64 animate-pulse bg-[var(--color-mandir-surface)] border-none" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Flower2 className="h-12 w-12 text-[var(--color-mandir-text-muted)] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[var(--color-mandir-text)]">{t("No offerings found")}</h3>
          <p className="text-[var(--color-mandir-text-muted)] mt-2">{t("Try a different search term")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/chadhava/${encodeId(item.id)}`} className="block">
                <Card className="overflow-hidden h-full group border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-400)] transition-all hover:shadow-[0_0_15px_rgba(251,146,60,0.15)] bg-[var(--color-mandir-surface)]">
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image_url || "/images/chadhava_pushp.png"} 
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-[10px] sm:text-xs font-medium text-[var(--color-saffron-600)] truncate bg-[var(--color-mandir-card)]/80 px-2 py-1 rounded backdrop-blur-md border border-[var(--color-mandir-border)] inline-flex items-center">
                        <MapPin className="w-3 h-3 mr-1 shrink-0" />
                        {item.temples?.name}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold font-[var(--font-heading)] leading-tight mb-1 group-hover:text-[var(--color-saffron-400)] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-[var(--color-mandir-text-muted)] line-clamp-2 mb-3 h-8">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-[var(--color-mandir-border)] pt-2">
                      <span className="text-base sm:text-lg font-bold text-[var(--color-mandir-text)]">₹{item.price}</span>
                      <span className="text-xs uppercase font-bold text-[var(--color-saffron-500)] tracking-wider">{t("Offer")}</span>
                    </div>
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
          The Significance of Online Temple Chadhava
        </h2>
        <div className="space-y-4 text-[var(--color-mandir-text-muted)] leading-relaxed">
          <p>
            Offering Chadhava (sacred offerings) is a profound act of devotion in Sanatana Dharma. Through Vandanam, you can now offer Pushp (flowers), Vastra (clothing), Deep Daan (lamps), and Bhog (food) to your beloved deities across India's most prominent temples, without the need to travel.
          </p>
          <p>
            Our dedicated temple partners ensure that your offerings are presented to the deity with the highest purity and devotion. When you select a Chadhava item, it is sourced locally by the temple priests and offered on your behalf. Whether you wish to offer a silk saree to Goddess Mahalakshmi or Bhasma to Lord Mahakaleshwar, we make it spiritually enriching and accessible.
          </p>
          <p>
            Participating in these rituals brings peace, prosperity, and a deep sense of connection to the divine. We provide transparent updates on your offerings, ensuring your devotion reaches the sanctum sanctorum exactly as you intended.
          </p>
        </div>
      </article>
    </div>
  )
}
