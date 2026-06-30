"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Sparkles, 
  Flower2, 
  Clock,
  Navigation
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { Card, CardContent } from "@/components/ui/Card"
import Link from "next/link"
import { encodeId, decodeId } from "@/lib/utils"

export default function TempleDetailPage() {
  const params = useParams()
  const id = decodeId(params.id as string)
  
  const [temple, setTemple] = React.useState<any>(null)
  const [pujas, setPujas] = React.useState<any[]>([])
  const [chadhava, setChadhava] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchTempleData = async () => {
      try {
        // Fetch temple details
        const { data: templeData, error: templeError } = await supabase
          .from('temples')
          .select('*')
          .eq('id', id)
          .single()
        
        if (templeError) throw templeError
        setTemple(templeData)

        // Fetch related pujas
        const { data: pujasData } = await supabase
          .from('pujas')
          .select('*')
          .eq('temple_id', id)
          .limit(3)
        
        setPujas(pujasData || [])

        // Fetch related chadhava
        const { data: chadhavaData } = await supabase
          .from('chadhava_items')
          .select('*')
          .eq('temple_id', id)
          .limit(4)
        
        setChadhava(chadhavaData || [])

      } catch (error) {
        console.error("Error fetching temple details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTempleData()
    }
  }, [id, supabase])

  if (loading) {
    return (
      <div className="w-full animate-pulse">
        <Skeleton className="w-full h-[400px] rounded-b-3xl mb-8" />
        <div className="container mx-auto px-4 max-w-5xl">
          <Skeleton className="w-1/2 h-10 mb-4" />
          <Skeleton className="w-1/3 h-6 mb-8" />
          <Skeleton className="w-full h-32 mb-12" />
          
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="w-full h-64 rounded-2xl" />
            <Skeleton className="w-full h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!temple) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <MapPin className="h-16 w-16 text-[var(--color-mandir-text-muted)] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[var(--color-mandir-text)] mb-4">Temple Not Found</h2>
        <p className="text-[var(--color-mandir-text-muted)] mb-8">The temple you are looking for does not exist in our directory.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* Hero Header */}
      <div className="relative w-full h-[40vh] min-h-[300px] max-h-[500px] mb-8 sm:mb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={temple.image_url || "/images/kashi_vishwanath_temple.png"} 
          alt={temple.name}
          className="w-full h-full object-cover rounded-b-[2rem] sm:rounded-b-[3rem] shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-mandir-bg)] via-[var(--color-mandir-bg)]/50 to-transparent rounded-b-[2rem] sm:rounded-b-[3rem]" />
        
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 flex justify-center px-4">
          <div className="bg-[var(--color-mandir-surface)]/90 backdrop-blur-xl border border-[var(--color-mandir-border)] shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full bg-[var(--color-saffron-500)]/10 px-3 py-1 text-xs font-medium text-[var(--color-saffron-500)] border border-[var(--color-saffron-500)]/20 mb-4">
              {temple.deity}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-3">
              {temple.name}
            </h1>
            <div className="flex items-center justify-center text-[var(--color-mandir-text-muted)] font-medium">
              <MapPin className="h-4 w-4 mr-1.5" />
              {temple.location}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-32 sm:mt-24">
        
        {/* Description Section */}
        <div className="bg-[var(--color-mandir-surface)] rounded-3xl p-6 sm:p-10 border border-[var(--color-mandir-border)] shadow-lg mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-48 h-48" />
          </div>
          
          <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-4 relative z-10">
            About the Temple
          </h2>
          <p className="text-[var(--color-mandir-text-muted)] text-base sm:text-lg leading-relaxed relative z-10 whitespace-pre-wrap">
            {temple.description}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8 relative z-10">
            <div className="flex items-center bg-[var(--color-mandir-bg)] px-4 py-2 rounded-xl border border-[var(--color-mandir-border)]">
              <Clock className="w-4 h-4 text-[var(--color-saffron-400)] mr-2" />
              <span className="text-sm font-medium">Open 5:00 AM - 9:00 PM</span>
            </div>
            <div className="flex items-center bg-[var(--color-mandir-bg)] px-4 py-2 rounded-xl border border-[var(--color-mandir-border)] cursor-pointer hover:bg-[var(--color-mandir-card-hover)] transition-colors">
              <Navigation className="w-4 h-4 text-[var(--color-saffron-400)] mr-2" />
              <span className="text-sm font-medium">Get Directions</span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Pujas Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] flex items-center">
                <Sparkles className="w-6 h-6 text-[var(--color-saffron-500)] mr-2" />
                Available Pujas
              </h2>
            </div>
            
            <div className="space-y-4">
              {pujas.length > 0 ? pujas.map((puja) => (
                <Link key={puja.id} href={`/pujas/${encodeId(puja.id)}`}>
                  <Card className="group border border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-500)]/50 transition-colors bg-[var(--color-mandir-surface)]">
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={puja.image_url || "/images/puja_ganesh.png"} 
                          alt={puja.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold font-[var(--font-heading)] leading-tight mb-1 group-hover:text-[var(--color-saffron-400)] transition-colors line-clamp-1">
                          {puja.title}
                        </h3>
                        <p className="text-xs text-[var(--color-mandir-text-muted)] line-clamp-1 mb-2">
                          {puja.problem_statement}
                        </p>
                        <div className="font-bold text-sm text-[var(--color-mandir-text)]">
                          ₹{puja.sale_price}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )) : (
                <div className="bg-[var(--color-mandir-surface)] rounded-xl p-8 text-center border border-[var(--color-mandir-border)]">
                  <p className="text-[var(--color-mandir-text-muted)]">No online pujas are currently available for this temple.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chadhava Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] flex items-center">
                <Flower2 className="w-6 h-6 text-[var(--color-saffron-500)] mr-2" />
                Offer Chadhava
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {chadhava.length > 0 ? chadhava.map((item) => (
                <Link key={item.id} href={`/chadhava/${encodeId(item.id)}`}>
                  <Card className="h-full group border border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-500)]/50 transition-colors bg-[var(--color-mandir-surface)] text-center">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[var(--color-mandir-border)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.image_url || "/images/chadhava_pushp.png"} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="text-sm font-bold font-[var(--font-heading)] leading-tight mb-1 group-hover:text-[var(--color-saffron-400)] transition-colors line-clamp-1 w-full">
                        {item.title}
                      </h3>
                      <div className="font-bold text-sm text-[var(--color-saffron-500)] mt-auto pt-2">
                        ₹{item.price}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )) : (
                <div className="col-span-2 bg-[var(--color-mandir-surface)] rounded-xl p-8 text-center border border-[var(--color-mandir-border)]">
                  <p className="text-[var(--color-mandir-text-muted)]">No chadhava offerings are currently available for this temple.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
