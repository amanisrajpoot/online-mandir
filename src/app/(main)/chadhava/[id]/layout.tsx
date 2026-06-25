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

  const { data: item } = await supabase
    .from('chadhava_items')
    .select('*, temples(name, location)')
    .eq('id', decodedId)
    .single()

  if (!item) {
    return {
      title: 'Chadhava Item Not Found',
      description: 'The requested chadhava offering could not be found.',
    }
  }

  const title = `Offer ${item.title} at ${item.temples?.name || 'Sacred Temple'}`
  const description = item.description?.substring(0, 160) || `Offer ${item.title} online at ${item.temples?.name}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [item.image_url || '/images/prasad_thali.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.image_url || '/images/prasad_thali.png'],
    },
  }
}

export default async function ChadhavaLayout({
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

  const { data: item } = await supabase
    .from('chadhava_items')
    .select('*, temples(name, location)')
    .eq('id', decodedId)
    .single()

  let jsonLd = null
  if (item) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": item.title,
      "description": item.description || `Offer ${item.title} online.`,
      "image": item.image_url ? [item.image_url] : undefined,
      "offers": {
        "@type": "Offer",
        "price": item.price || "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `https://www.vandanam.online/chadhava/${id}`
      },
      "brand": {
        "@type": "Brand",
        "name": item.temples?.name || "Vandanam"
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
