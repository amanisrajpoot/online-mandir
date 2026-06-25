import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sacred Temples of India',
  description: 'Explore ancient and powerful temples across India. Learn about their history and book online spiritual services directly from the temples.',
}

export default function TemplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
