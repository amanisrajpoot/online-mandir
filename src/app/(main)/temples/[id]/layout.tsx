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

  const { data: temple } = await supabase
    .from('temples')
    .select('*')
    .eq('id', decodedId)
    .single()

  if (!temple) {
    return {
      title: 'Temple Not Found',
      description: 'The requested temple could not be found.',
    }
  }

  const title = `${temple.name} | Book Pujas & Offer Chadhava`
  const description = temple.description?.substring(0, 160) || `Explore ${temple.name} in ${temple.location}. Book pujas and offer chadhava online.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [temple.image_url || '/images/temple_placeholder.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [temple.image_url || '/images/temple_placeholder.png'],
    },
  }
}

export default async function TempleLayout({
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

  const { data: temple } = await supabase
    .from('temples')
    .select('*')
    .eq('id', decodedId)
    .single()

  let jsonLd = null
  let breadcrumbLd = null
  if (temple) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "HinduTemple",
      "name": temple.name,
      "description": temple.description,
      "image": temple.image_url ? [temple.image_url] : undefined,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": temple.location
      }
    }

    breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.vandanam.online"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Temples",
          "item": "https://www.vandanam.online/temples"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": temple.name,
          "item": `https://www.vandanam.online/temples/${id}`
        }
      ]
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
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      {children}
    </>
  )
}
