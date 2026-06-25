import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Prepare for an Online Puja at Home | Vandanam',
  description: 'A step-by-step guide on how to prepare yourself and your home to receive the maximum spiritual benefits from an online temple puja.',
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Prepare for an Online Puja at Home",
  "image": [
    "https://www.vandanam.online/images/puja_preparation.jpg"
  ],
  "datePublished": "2024-03-12T08:00:00+08:00",
  "dateModified": "2024-03-12T09:20:00+08:00",
  "author": [{
    "@type": "Organization",
    "name": "Vandanam Spiritual Team",
    "url": "https://www.vandanam.online/about"
  }]
}

export default function PrepArticle() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      
      <Link href="/content" className="inline-flex items-center text-sm font-medium text-[var(--color-mandir-text-muted)] hover:text-[var(--color-saffron-500)] mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Articles
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] leading-tight mb-4">
          How to Prepare for an Online Puja at Home
        </h1>
        <div className="flex items-center text-sm text-[var(--color-mandir-text-muted)]">
          <span>Published by Vandanam Editorial</span>
          <span className="mx-2">•</span>
          <time dateTime="2024-03-12">March 12, 2024</time>
        </div>
      </header>

      <div className="prose prose-orange lg:prose-lg max-w-none text-[var(--color-mandir-text)] leading-relaxed space-y-6">
        <p>
          Online pujas bring the divine energy of India's most sacred temples directly into your living room. While the physical rituals are performed by verified pandits at the temple, your mental and spiritual participation is equally crucial for the Sankalp (intention) to bear fruit. Here is a guide on how to prepare yourself and your home for an online puja session.
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">1. Physical Purification (Snan)</h2>
        <p>
          Just as you would if you were visiting the temple in person, take a bath before the puja begins. Wear clean, washed clothes—preferably traditional attire like a dhoti-kurta for men and a saree or suit for women. Avoid wearing black or dark blue colors if possible, as lighter, auspicious colors like yellow, red, and white are preferred during rituals.
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">2. Prepare Your Home Shrine (Mandir)</h2>
        <p>
          Clean the area where you will be sitting to watch the video or join the live stream. If you have a home mandir, sit near it. Light a diya (lamp) and some incense sticks (agarbatti) to purify the atmosphere and create a serene, temple-like environment in your home.
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">3. Mental Preparation (Sankalp)</h2>
        <p>
          The most important part of any puja is the Sankalp—the firm intention or prayer behind the ritual. Before the puja starts, sit quietly for a few minutes. Close your eyes, take deep breaths, and focus on the deity. Clearly visualize the problem you want resolved or the blessing you are seeking. When the pandit takes your name and gotra during the video, mentally echo the prayer.
        </p>
        
        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">4. During the Puja</h2>
        <p>
          When you receive the video of your puja from Vandanam, sit in a quiet place to watch it. Do not treat it like a casual video. Maintain a respectful posture (sit cross-legged if possible), keep your hands folded in prayer, and focus entirely on the mantras being chanted. Fasting on the day of the puja is optional but highly recommended for greater spiritual discipline.
        </p>

        <div className="bg-[var(--color-mandir-surface)] p-6 rounded-2xl border border-[var(--color-saffron-500)]/30 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold font-[var(--font-heading)] text-lg mb-1">Ready to book a Puja?</h3>
            <p className="text-sm text-[var(--color-mandir-text-muted)]">Explore our list of authentic temple pujas across India.</p>
          </div>
          <Link href="/pujas" className="bg-[var(--color-saffron-500)] text-white px-6 py-2 rounded-full font-medium hover:bg-[var(--color-saffron-600)] transition-colors whitespace-nowrap">
            View All Pujas
          </Link>
        </div>
      </div>
    </article>
  )
}
