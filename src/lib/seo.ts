import { Metadata } from "next"

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.vandanam.online"
export const SITE_NAME = "Vandanam"

export interface DynamicSeoOptions {
  title: string
  description?: string
  path: string
  badge?: string
  subtitle?: string
  type?: "puja" | "temple" | "festival" | "donation" | "chadhava" | "astrology" | "website"
  highlight?: string
  customImage?: string
  keywords?: string[]
}

/**
 * Generates an absolute URL for the dynamic OG image generator API.
 */
export function getOgImageUrl({
  title,
  subtitle,
  badge,
  type = "puja",
  highlight,
}: {
  title: string
  subtitle?: string
  badge?: string
  type?: string
  highlight?: string
}): string {
  const params = new URLSearchParams()
  params.set("title", title.trim())
  if (subtitle) params.set("subtitle", subtitle.trim())
  if (badge) params.set("badge", badge.trim())
  if (type) params.set("type", type.trim())
  if (highlight) params.set("highlight", highlight.trim())

  return `${SITE_URL}/api/og?${params.toString()}`
}

/**
 * Constructs a fully compliant Next.js Metadata object with dynamic OpenGraph
 * and Twitter cards formatted specifically for WhatsApp, Facebook, Twitter, and LinkedIn crawlers.
 */
export function constructDynamicMetadata({
  title,
  description = "Connect with divine spirituality through our trusted online platform for authentic temple pujas, chadhava, and astrology services across India's sacred temples.",
  path,
  badge,
  subtitle,
  type = "puja",
  highlight,
  customImage,
  keywords = [],
}: DynamicSeoOptions): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  const canonicalUrl = `${SITE_URL}${cleanPath}`
  
  // Use custom image if provided and valid, otherwise generate dynamic 1200x630 card
  const ogImageUrl = customImage && customImage.startsWith("http")
    ? customImage
    : getOgImageUrl({
        title,
        subtitle: subtitle || (type === "puja" ? "Personalized Puja with Panditji" : "Sacred Spiritual Seva"),
        badge: badge || (type === "puja" ? "Special Temple Puja" : "Sacred Seva"),
        type,
        highlight,
      })

  const truncatedDesc = description.length > 180 ? `${description.slice(0, 177)}...` : description

  return {
    title,
    description: truncatedDesc,
    keywords: [
      ...keywords,
      "online puja", "temple puja online", "vandanam", "hindu rituals online",
      "puja sankalp", "pandit booking"
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: truncatedDesc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: truncatedDesc,
      images: [ogImageUrl],
    },
  }
}
