"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [banners, setBanners] = React.useState<any[]>([])
  const { t } = useLanguage()
  const supabase = createClient()

  React.useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      if (data && data.length > 0) {
        setBanners(data)
      } else {
        // Fallback just in case db is empty
        setBanners([{
          id: 'fallback',
          title: t("Maha Shivratri"),
          subtitle: t("Book your Rudrabhishek now"),
          image_url: "/images/hero_banner_shivratri.png",
          link: "/pujas",
          cta_text: t("Book Now")
        }])
      }
    }
    fetchBanners()
  }, [supabase])

  React.useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (banners.length === 0) return <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-[var(--color-mandir-surface)] animate-pulse rounded-2xl"></div>

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-black group h-[300px] md:h-[400px] lg:h-[500px]">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <Image
            src={banners[currentSlide].image_url}
            alt={banners[currentSlide].title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 z-10 w-full md:w-2/3">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold font-[var(--font-heading)] text-white leading-tight mb-4 drop-shadow-lg whitespace-pre-wrap"
            >
              {banners[currentSlide].title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg md:text-xl text-[var(--color-mandir-text-muted)] mb-8 max-w-xl font-medium"
            >
              {banners[currentSlide].subtitle}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link href={banners[currentSlide].link}>
                <Button size="lg" variant="gradient" className="text-white px-8 py-6 text-lg rounded-full font-bold shadow-[0_0_20px_rgba(251,146,60,0.3)] hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] hover:scale-105 transition-all">
                  {banners[currentSlide].cta_text} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--color-saffron-500)]"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--color-saffron-500)]"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? "bg-[var(--color-saffron-500)] w-6" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
