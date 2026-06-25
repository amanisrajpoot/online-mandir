import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Understanding the Different Types of Chadhava Offerings | Vandanam',
  description: 'Learn about the spiritual meaning behind different types of Chadhava like Pushp, Vastra, Bhog, and Deep Daan offered in Hindu temples.',
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Understanding the Different Types of Chadhava Offerings",
  "image": [
    "https://www.vandanam.online/images/chadhava_pushp.jpg"
  ],
  "datePublished": "2024-03-10T08:00:00+08:00",
  "dateModified": "2024-03-10T09:20:00+08:00",
  "author": [{
    "@type": "Organization",
    "name": "Vandanam Spiritual Team",
    "url": "https://www.vandanam.online/about"
  }]
}

export default function ChadhavaArticle() {
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
          Understanding the Different Types of Chadhava Offerings
        </h1>
        <div className="flex items-center text-sm text-[var(--color-mandir-text-muted)]">
          <span>Published by Vandanam Editorial</span>
          <span className="mx-2">•</span>
          <time dateTime="2024-03-10">March 10, 2024</time>
        </div>
      </header>

      <div className="prose prose-orange lg:prose-lg max-w-none text-[var(--color-mandir-text)] leading-relaxed space-y-6">
        <p>
          "Chadhava" refers to the sacred offerings presented to the deities in Hindu temples. It is an expression of deep devotion, gratitude, and surrender. Offering Chadhava is not about giving something to God, who is already the creator of everything, but rather a symbolic gesture of letting go of one's ego and receiving divine grace.
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">Common Types of Chadhava</h2>
        <p>
          While different deities have specific preferences according to scriptures, there are several universal forms of offerings made in Sanatana Dharma:
        </p>

        <ul className="list-none space-y-6 mt-6">
          <li className="bg-[var(--color-mandir-surface)] p-6 rounded-xl border border-[var(--color-mandir-border)]">
            <h3 className="font-bold font-[var(--font-heading)] text-xl text-[var(--color-saffron-500)] mb-2">Pushp (Flowers)</h3>
            <p className="text-[var(--color-mandir-text-muted)] text-base m-0">Flowers represent the blooming of the soul and the offering of our inner beauty to the divine. Specific flowers are dear to specific deities: Lotus for Goddess Lakshmi, Red Hibiscus for Maa Kali and Lord Ganesha, and Bilva Patra for Lord Shiva.</p>
          </li>
          
          <li className="bg-[var(--color-mandir-surface)] p-6 rounded-xl border border-[var(--color-mandir-border)]">
            <h3 className="font-bold font-[var(--font-heading)] text-xl text-[var(--color-saffron-500)] mb-2">Vastra (Clothing)</h3>
            <p className="text-[var(--color-mandir-text-muted)] text-base m-0">Offering Vastra, such as a Chunri to a Goddess or a Dhoti to a God, symbolizes respect, honor, and the seeking of protection. It is a way of enveloping the divine in our love and devotion.</p>
          </li>

          <li className="bg-[var(--color-mandir-surface)] p-6 rounded-xl border border-[var(--color-mandir-border)]">
            <h3 className="font-bold font-[var(--font-heading)] text-xl text-[var(--color-saffron-500)] mb-2">Bhog / Naivedya (Food)</h3>
            <p className="text-[var(--color-mandir-text-muted)] text-base m-0">Food is offered to the deity, spiritually consumed by them, and then distributed back to devotees as 'Prasad'. It symbolizes the surrender of our physical sustenance to the creator.</p>
          </li>

          <li className="bg-[var(--color-mandir-surface)] p-6 rounded-xl border border-[var(--color-mandir-border)]">
            <h3 className="font-bold font-[var(--font-heading)] text-xl text-[var(--color-saffron-500)] mb-2">Deep Daan (Lamps)</h3>
            <p className="text-[var(--color-mandir-text-muted)] text-base m-0">Lighting a diya (lamp) represents the dispelling of ignorance and darkness by the light of divine knowledge. It is a prayer for enlightenment and guidance on the right path.</p>
          </li>
        </ul>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">Offering Chadhava Online</h2>
        <p>
          With platforms like Vandanam, you can now offer these sacred Chadhavas at prominent temples across India without being physically present. The temple priests procure pure, authentic items on your behalf and offer them to the deity with your Sankalp.
        </p>

        <div className="bg-[var(--color-mandir-surface)] p-6 rounded-2xl border border-[var(--color-saffron-500)]/30 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold font-[var(--font-heading)] text-lg mb-1">Make an Offering Today</h3>
            <p className="text-sm text-[var(--color-mandir-text-muted)]">Offer Pushp, Vastra, or Bhog to your beloved deities.</p>
          </div>
          <Link href="/chadhava" className="bg-[var(--color-saffron-500)] text-white px-6 py-2 rounded-full font-medium hover:bg-[var(--color-saffron-600)] transition-colors whitespace-nowrap">
            View Chadhavas
          </Link>
        </div>
      </div>
    </article>
  )
}
