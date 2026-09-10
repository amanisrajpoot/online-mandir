import { ComingSoon } from "@/components/ui/ComingSoon"
import { constructDynamicMetadata } from "@/lib/seo"

export const metadata = constructDynamicMetadata({
  title: 'Vedic Astrology Consultations & Kundli Predictions | Vandanam',
  description: 'Connect with verified Vedic astrologers for authentic Kundli matching, Tarot, horoscope analysis, and remedial pujas.',
  path: '/astrology',
  subtitle: 'Personalized Horoscope & Kundli Consultations',
  badge: 'Vedic Jyotish & Astrology',
  type: 'astrology',
  highlight: 'Verified Astrologers & Remedial Pujas',
})

export default function AstrologyPage() {
  return (
    <div className="container mx-auto px-4 py-12 pb-24 h-[calc(100vh-140px)]">
      <ComingSoon 
        title="Vedic Astrology Consultations"
        description="Chat or call with verified astrologers for personalized Kundli reading, Tarot, and Horoscope predictions. Coming soon!"
      />
    </div>
  )
}
