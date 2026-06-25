import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The Significance of Rudrabhishek Puja | Vandanam',
  description: 'Learn about the immense spiritual benefits and the correct procedure of performing Rudrabhishek Puja for Lord Shiva.',
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Significance of Rudrabhishek Puja",
  "image": [
    "https://www.vandanam.online/images/puja_rudrabhishek.jpg"
  ],
  "datePublished": "2024-03-01T08:00:00+08:00",
  "dateModified": "2024-03-01T09:20:00+08:00",
  "author": [{
    "@type": "Organization",
    "name": "Vandanam Spiritual Team",
    "url": "https://www.vandanam.online/about"
  }]
}

export default function RudrabhishekArticle() {
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
          The Spiritual Significance of Rudrabhishek Puja
        </h1>
        <div className="flex items-center text-sm text-[var(--color-mandir-text-muted)]">
          <span>Published by Vandanam Editorial</span>
          <span className="mx-2">•</span>
          <time dateTime="2024-03-01">March 1, 2024</time>
        </div>
      </header>

      <div className="prose prose-orange lg:prose-lg max-w-none text-[var(--color-mandir-text)] leading-relaxed space-y-6">
        <p>
          Rudrabhishek is one of the most powerful and significant rituals dedicated to Lord Shiva. In Sanatana Dharma, "Rudra" refers to the fierce, yet compassionate manifestation of Lord Shiva, who annihilates sorrow, disease, and evil from our lives. "Abhishek" means a sacred bath. Therefore, Rudrabhishek involves bathing the Shiva Lingam with sacred offerings while chanting powerful Vedic mantras.
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">Why is Rudrabhishek Performed?</h2>
        <p>
          According to the Shiva Purana, performing Rudrabhishek brings unimaginable blessings. It is believed to be the ultimate remedy (Upaya) for removing severe astrological doshas (like Kaal Sarp Dosh), overcoming chronic health issues, and achieving peace of mind.
        </p>
        <ul className="list-disc list-inside space-y-2 text-[var(--color-mandir-text-muted)] mb-6">
          <li><strong>Health & Vitality:</strong> Blesses the devotee with physical and mental wellness.</li>
          <li><strong>Wealth & Success:</strong> Removes obstacles in career and business.</li>
          <li><strong>Spiritual Growth:</strong> Awakens inner consciousness and deepens the connection with the divine.</li>
        </ul>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">The Sacred Ingredients (Dravyas)</h2>
        <p>
          The Abhishek is performed using various sacred ingredients, each symbolizing a specific prayer or desire:
        </p>
        <ul className="list-disc list-inside space-y-2 text-[var(--color-mandir-text-muted)] mb-6">
          <li><strong>Jal (Water):</strong> For peace of mind and spiritual cleansing.</li>
          <li><strong>Dudh (Milk):</strong> For longevity and the birth of a child.</li>
          <li><strong>Ghee:</strong> For financial prosperity and victory over enemies.</li>
          <li><strong>Shahad (Honey):</strong> To bring sweetness in life and remove miseries.</li>
          <li><strong>Ganna Ras (Sugarcane Juice):</strong> For unlimited wealth and happiness.</li>
        </ul>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">How Can You Participate?</h2>
        <p>
          While witnessing a Rudrabhishek in person at jyotirlingas like Mahakaleshwar or Kashi Vishwanath is a lifetime experience, it is not always possible. Vandanam brings this sacred ritual directly to you. Our verified temple priests perform the Rudrabhishek strictly as per Vedic injunctions with your personalized Sankalp (name and gotra).
        </p>

        <div className="bg-[var(--color-mandir-surface)] p-6 rounded-2xl border border-[var(--color-saffron-500)]/30 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold font-[var(--font-heading)] text-lg mb-1">Book a Rudrabhishek Online</h3>
            <p className="text-sm text-[var(--color-mandir-text-muted)]">Have authentic temple priests perform this powerful puja for your family.</p>
          </div>
          <Link href="/pujas" className="bg-[var(--color-saffron-500)] text-white px-6 py-2 rounded-full font-medium hover:bg-[var(--color-saffron-600)] transition-colors whitespace-nowrap">
            View Pujas
          </Link>
        </div>
      </div>
    </article>
  )
}
