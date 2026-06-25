import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/profile',
          '/login',
          '/verify',
          '/profile-setup',
          '/book',
          '/api'
        ],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      }
    ],
    sitemap: 'https://www.vandanam.online/sitemap.xml',
  }
}
