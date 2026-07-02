import { HeroBanner } from "@/components/home/HeroBanner"
import { FestivalCountdown } from "@/components/home/FestivalCountdown"
import { PromoBanners } from "@/components/home/PromoBanners"
import Script from "next/script"
import dynamic from "next/dynamic"

const CurrentOrders = dynamic(() => import("@/components/home/CurrentOrders").then(mod => mod.CurrentOrders))
const TempleCarousel = dynamic(() => import("@/components/home/TempleCarousel").then(mod => mod.TempleCarousel))
const TrendingPujas = dynamic(() => import("@/components/home/TrendingPujas").then(mod => mod.TrendingPujas))
const ChadhavaQuickSelect = dynamic(() => import("@/components/home/ChadhavaQuickSelect").then(mod => mod.ChadhavaQuickSelect))
const PanchangWidget = dynamic(() => import("@/components/home/PanchangWidget").then(mod => mod.PanchangWidget))

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vandanam",
    "url": "https://www.vandanam.online",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.vandanam.online/pujas?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="sr-only">Vandanam - Online Puja, Chadhava & Spiritual Services</h1>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeroBanner />
      <FestivalCountdown position="after_hero" />
      <PromoBanners position="after_hero" />
      
      <CurrentOrders />
      <TempleCarousel />
      <FestivalCountdown position="after_temples" />
      <PromoBanners position="after_temples" />
      
      <TrendingPujas />
      <FestivalCountdown position="after_pujas" />
      <PromoBanners position="after_pujas" />
      
      <ChadhavaQuickSelect />
      <PanchangWidget />
      
      <PromoBanners position="above_footer" />
      
      {/* Extra padding at the bottom for mobile nav */}
      <div className="h-16 md:h-0"></div>
    </div>
  )
}
