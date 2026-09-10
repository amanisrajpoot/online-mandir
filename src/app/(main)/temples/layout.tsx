import { Metadata } from 'next'
import { constructDynamicMetadata } from '@/lib/seo'

export const metadata: Metadata = constructDynamicMetadata({
  title: 'Sacred Temples of India | Darshan, Pujas & Chadhava',
  description: 'Explore ancient and holy temples across India. Learn their sacred history, book online pujas and offer chadhava directly at holy sanctums.',
  path: '/temples',
  subtitle: '12 Jyotirlingas, Shaktipeeths & Historic Mandirs',
  badge: 'Sacred Temples of India',
  type: 'temple',
  highlight: 'Explore Sacred Tirthas & Book Rituals',
})

export default function TemplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
