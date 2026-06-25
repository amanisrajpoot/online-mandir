import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { encodeId } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vandanam.online'

  // Initialize Supabase client for public data fetching
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch dynamic content
  const [pujasRes, chadhavaRes, templesRes] = await Promise.all([
    supabase.from('pujas').select('id, updated_at, is_active').eq('is_active', true),
    supabase.from('chadhava_items').select('id, updated_at, is_active').eq('is_active', true),
    supabase.from('temples').select('id, updated_at, is_active').eq('is_active', true)
  ])

  const pujas = pujasRes.data || []
  const chadhava = chadhavaRes.data || []
  const temples = templesRes.data || []

  // Static routes
  const staticRoutes = [
    '',
    '/pujas',
    '/chadhava',
    '/temples',
    '/about',
    '/contact',
    '/faqs',
    '/terms',
    '/privacy',
    '/refund-policy',
    '/cancellation-policy'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Puja routes
  const pujaRoutes = pujas.map((puja) => ({
    url: `${baseUrl}/pujas/${encodeId(puja.id)}`,
    lastModified: new Date(puja.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Dynamic Chadhava routes
  const chadhavaRoutes = chadhava.map((item) => ({
    url: `${baseUrl}/chadhava/${encodeId(item.id)}`,
    lastModified: new Date(item.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic Temple routes
  const templeRoutes = temples.map((temple) => ({
    url: `${baseUrl}/temples/${encodeId(temple.id)}`,
    lastModified: new Date(temple.updated_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...pujaRoutes, ...chadhavaRoutes, ...templeRoutes]
}
