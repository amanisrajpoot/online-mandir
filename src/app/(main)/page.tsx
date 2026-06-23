import { HeroBanner } from "@/components/home/HeroBanner"
import { CurrentOrders } from "@/components/home/CurrentOrders"
import { TempleCarousel } from "@/components/home/TempleCarousel"
import { TrendingPujas } from "@/components/home/TrendingPujas"
import { FestivalCountdown } from "@/components/home/FestivalCountdown"
import { ChadhavaQuickSelect } from "@/components/home/ChadhavaQuickSelect"
import { PanchangWidget } from "@/components/home/PanchangWidget"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <CurrentOrders />
      <TempleCarousel />
      <TrendingPujas />
      <FestivalCountdown />
      <ChadhavaQuickSelect />
      <PanchangWidget />
      
      {/* Extra padding at the bottom for mobile nav */}
      <div className="h-16 md:h-0"></div>
    </div>
  )
}
