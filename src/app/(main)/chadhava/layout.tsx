import { Metadata } from 'next'
import { constructDynamicMetadata } from '@/lib/seo'

export const metadata: Metadata = constructDynamicMetadata({
  title: 'Offer Chadhava Online | Prasad, Flowers & Vastra Offerings',
  description: 'Offer sacred chadhava, bilva patra, flowers, and holy bhog to deities at holy sanctums across India. Receive personalized video proof on WhatsApp.',
  path: '/chadhava',
  subtitle: 'Sacred Offerings at Prominent Temples',
  badge: 'Divine Chadhava Offerings',
  type: 'chadhava',
  highlight: 'Personalized Offerings with Video Proof on WhatsApp',
})

export default function ChadhavaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
