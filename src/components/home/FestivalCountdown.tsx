"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calendar as CalendarIcon, Sparkles } from "lucide-react"

import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { Card, CardContent } from "@/components/ui/Card"

// In a real app, this would be fetched from the database
const UPCOMING_FESTIVAL = {
  name: "Maha Shivratri",
  date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
  description: "The Great Night of Shiva. Book your Rudrabhishek now to ensure your Sankalp is included.",
  image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop"
}

export function FestivalCountdown() {
  return (
    <section className="w-full py-8 mb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border border-[var(--color-saffron-500)]/30 bg-gradient-to-br from-[var(--color-mandir-surface)] via-[var(--color-mandir-surface)] to-[#3a1c0d] shadow-[0_0_30px_rgba(249,115,22,0.15)] relative">
            {/* Background elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[var(--color-saffron-500)]/10 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[var(--color-temple-gold)]/10 blur-[80px] pointer-events-none" />
            
            <CardContent className="p-0 sm:flex items-center">
              <div className="w-full sm:w-2/5 h-48 sm:h-auto sm:self-stretch relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={UPCOMING_FESTIVAL.image} 
                  alt={UPCOMING_FESTIVAL.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[var(--color-mandir-surface)] sm:from-transparent to-transparent via-transparent sm:via-[var(--color-mandir-surface)]/80 sm:to-[var(--color-mandir-surface)] sm:left-auto sm:right-0 sm:w-32" />
                
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center shadow-lg">
                  <CalendarIcon className="w-4 h-4 text-[var(--color-saffron-400)] mr-2" />
                  <span className="text-xs font-medium text-white uppercase tracking-wider">Upcoming Festival</span>
                </div>
              </div>
              
              <div className="w-full sm:w-3/5 p-6 sm:p-8 lg:p-12 relative z-10 flex flex-col justify-center">
                <div className="flex items-center mb-2">
                  <Sparkles className="w-5 h-5 text-[var(--color-saffron-500)] mr-2" />
                  <h3 className="text-2xl sm:text-3xl font-bold font-[var(--font-heading)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)]">
                    {UPCOMING_FESTIVAL.name}
                  </h3>
                </div>
                
                <p className="text-[var(--color-mandir-text-muted)] mb-6 text-sm sm:text-base max-w-md">
                  {UPCOMING_FESTIVAL.description}
                </p>
                
                <div className="bg-black/20 rounded-xl p-4 sm:p-6 border border-white/5 inline-block self-start">
                  <div className="text-xs text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-3 font-semibold">
                    Time remaining to book
                  </div>
                  <CountdownTimer 
                    targetDate={UPCOMING_FESTIVAL.date} 
                    className="gap-2 sm:gap-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
