"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calendar as CalendarIcon, Sparkles } from "lucide-react"

import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { Card, CardContent } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"

export function FestivalCountdown({ position }: { position: string }) {
  const [countdowns, setCountdowns] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchCountdowns = async () => {
      try {
        const { data, error } = await supabase
          .from('festival_countdown')
          .select('*')
          .eq('is_active', true)
          .eq('position', position)
          .order('sort_order', { ascending: true })
        
        if (error) throw error
        setCountdowns(data || [])
      } catch (error) {
        console.error("Error fetching countdowns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountdowns()
  }, [position, supabase])

  if (loading || countdowns.length === 0) {
    return null
  }

  return (
    <section className="w-full py-8 mb-4">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 gap-6">
          {countdowns.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={event.display_style === 'compact' ? 'max-w-3xl mx-auto w-full' : 'w-full'}
            >
              <Card className="overflow-hidden border border-[var(--color-saffron-500)]/30 bg-gradient-to-br from-[var(--color-mandir-surface)] via-[var(--color-mandir-surface)] to-[#3a1c0d] shadow-[0_0_30px_rgba(249,115,22,0.15)] relative">
                {/* Background elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[var(--color-saffron-500)]/10 blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[var(--color-temple-gold)]/10 blur-[80px] pointer-events-none" />
                
                <CardContent className={`p-0 sm:flex ${event.display_style === 'compact' ? 'flex-row' : 'items-center'}`}>
                  <div className={`relative ${event.display_style === 'compact' ? 'w-1/3 h-auto' : 'w-full sm:w-2/5 h-48 sm:h-auto sm:self-stretch'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={event.image_url} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[var(--color-mandir-surface)] sm:from-transparent to-transparent via-transparent sm:via-[var(--color-mandir-surface)]/80 sm:to-[var(--color-mandir-surface)] ${event.display_style === 'compact' ? 'hidden' : 'sm:left-auto sm:right-0 sm:w-32'}`} />
                    
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center shadow-lg">
                      <CalendarIcon className="w-4 h-4 text-[var(--color-saffron-400)] mr-2" />
                      <span className="text-xs font-medium text-white uppercase tracking-wider">Upcoming</span>
                    </div>
                  </div>
                  
                  <div className={`p-6 sm:p-8 lg:p-12 relative z-10 flex flex-col justify-center ${event.display_style === 'compact' ? 'w-2/3' : 'w-full sm:w-3/5'}`}>
                    <div className="flex items-center mb-2">
                      <Sparkles className="w-5 h-5 text-[var(--color-saffron-500)] mr-2" />
                      <h3 className={`font-bold font-[var(--font-heading)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)] ${event.display_style === 'compact' ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}>
                        {event.name}
                      </h3>
                    </div>
                    
                    {event.description && (
                      <p className={`text-[var(--color-mandir-text-muted)] mb-6 ${event.display_style === 'compact' ? 'text-sm' : 'text-sm sm:text-base'} max-w-md`}>
                        {event.description}
                      </p>
                    )}
                    
                    <div className="bg-black/20 rounded-xl p-4 sm:p-6 border border-white/5 inline-block self-start">
                      <div className="text-xs text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-3 font-semibold">
                        Time remaining
                      </div>
                      <CountdownTimer 
                        targetDate={event.target_date} 
                        className="gap-2 sm:gap-4"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
