import { Metadata } from 'next'
import { constructDynamicMetadata } from '@/lib/seo'

export const metadata: Metadata = constructDynamicMetadata({
  title: 'Book Online Puja Services | Sacred Temples of India',
  description: 'Book authentic Vedic pujas, Havans, and Archanas at renowned temples across India. Complete with personalized Sankalp and video proof on WhatsApp.',
  path: '/pujas',
  subtitle: 'Vedic Pujas at Kashi, Ujjain, Ayodhya & more',
  badge: 'Online Mandir Pujas',
  type: 'puja',
  highlight: 'Personalized Sankalp • Video Proof on WhatsApp',
})

export default function PujasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
