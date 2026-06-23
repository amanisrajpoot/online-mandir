"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Calendar } from "lucide-react"

import { Carousel } from "@/components/ui/Carousel"
import { Button } from "@/components/ui/Button"

const BANNERS = [
  {
    id: 1,
    title: "Maha Shivratri Special",
    subtitle: "Book authentic Rudrabhishek at Kashi Vishwanath",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop",
    link: "/pujas?category=Festival",
    cta: "Book Now"
  },
  {
    id: 2,
    title: "Navratri Devi Darshan",
    subtitle: "Offer Chadhava at 9 Shaktipeeths",
    image: "https://images.unsplash.com/photo-1561359313-0639aad3a644?q=80&w=1200&auto=format&fit=crop",
    link: "/chadhava",
    cta: "Offer Chadhava"
  },
  {
    id: 3,
    title: "Daily Panchang",
    subtitle: "Check today's auspicious timings",
    image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=1200&auto=format&fit=crop",
    link: "#panchang",
    cta: "View Panchang"
  }
]

export function HeroBanner() {
  const carouselItems = BANNERS.map((banner) => (
    <div key={banner.id} className="relative h-full w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${banner.image})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-mandir-bg)] via-[var(--color-mandir-bg)]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-mandir-bg)]/80 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:justify-center md:w-2/3 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mb-2 inline-flex items-center rounded-full bg-[var(--color-saffron-500)]/20 px-3 py-1 text-xs font-medium text-[var(--color-saffron-400)] backdrop-blur-sm border border-[var(--color-saffron-500)]/30">
            <Sparkles className="mr-1.5 h-3 w-3" />
            Featured
          </div>
          <h2 className="mb-2 font-[var(--font-heading)] text-2xl font-bold text-white sm:text-4xl md:text-5xl leading-tight">
            {banner.title}
          </h2>
          <p className="mb-6 text-sm text-gray-300 sm:text-base max-w-md">
            {banner.subtitle}
          </p>
          <Link href={banner.link}>
            <Button variant="gradient" className="rounded-full px-8 shadow-lg">
              {banner.cta}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  ))

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mt-6">
      <Carousel 
        items={carouselItems} 
        autoPlay={true}
        interval={6000}
        className="h-[350px] sm:h-[400px] md:h-[450px] shadow-2xl border border-[var(--color-mandir-border)]"
      />
    </section>
  )
}
