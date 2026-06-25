import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offer Chadhava Online',
  description: 'Offer sacred chadhava, prasad, and vastra to deities at prominent temples across India from the comfort of your home.',
}

export default function ChadhavaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
