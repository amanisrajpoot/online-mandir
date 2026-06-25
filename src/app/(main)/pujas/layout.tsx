import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Online Puja Services',
  description: 'Book authentic temple pujas online. Our expert pandits perform sacred rituals at renowned temples across India on your behalf.',
}

export default function PujasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
