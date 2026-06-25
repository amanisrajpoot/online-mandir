import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { decodeId } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const decodedId = decodeId(id)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: puja } = await supabase
    .from('pujas')
    .select('*, temples(name, location)')
    .eq('id', decodedId)
    .single()

  if (!puja) {
    return {
      title: 'Puja Not Found',
      description: 'The requested puja could not be found.',
    }
  }

  const title = `${puja.title} at ${puja.temples?.name || 'Sacred Temple'}`
  const description = puja.description?.substring(0, 160) || `Book ${puja.title} online at ${puja.temples?.name}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [puja.image_url || '/images/prasad_thali.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [puja.image_url || '/images/prasad_thali.png'],
    },
  }
}

export default async function PujaLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const decodedId = decodeId(id)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: puja } = await supabase
    .from('pujas')
    .select('*, temples(name, location)')
    .eq('id', decodedId)
    .single()

  let jsonLd = null
  if (puja) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": puja.title,
      "description": puja.description || `Book ${puja.title} online.`,
      "image": puja.image_url ? [puja.image_url] : undefined,
      "offers": {
        "@type": "Offer",
        "price": puja.price || "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `https://www.vandanam.online/pujas/${id}`
      },
      "brand": {
        "@type": "Brand",
        "name": puja.temples?.name || "Vandanam"
      }
    }
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  )
}
