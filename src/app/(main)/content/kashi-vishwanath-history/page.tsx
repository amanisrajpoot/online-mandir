import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The History and Significance of Kashi Vishwanath Temple | Vandanam',
  description: 'Explore the rich history, spiritual significance, and the mystical energy of the Kashi Vishwanath Temple in Varanasi.',
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The History and Significance of Kashi Vishwanath Temple",
  "image": [
    "https://www.vandanam.online/images/temple_kashi.jpg"
  ],
  "datePublished": "2024-03-05T08:00:00+08:00",
  "dateModified": "2024-03-05T09:20:00+08:00",
  "author": [{
    "@type": "Organization",
    "name": "Vandanam Spiritual Team",
    "url": "https://www.vandanam.online/about"
  }]
}

export default function KashiArticle() {
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
          The History and Significance of Kashi Vishwanath Temple
        </h1>
        <div className="flex items-center text-sm text-[var(--color-mandir-text-muted)]">
          <span>Published by Vandanam Editorial</span>
          <span className="mx-2">•</span>
          <time dateTime="2024-03-05">March 5, 2024</time>
        </div>
      </header>

      <div className="prose prose-orange lg:prose-lg max-w-none text-[var(--color-mandir-text)] leading-relaxed space-y-6">
        <p>
          Situated on the western bank of the holy river Ganges in Varanasi, the Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is one of the twelve Jyotirlingas, the holiest of Shiva temples. The main deity is known by the name Vishwanath or Vishweshwara meaning Ruler of the Universe. 
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">The Mythological Significance</h2>
        <p>
          According to the Shiva Purana, Lord Brahma and Lord Vishnu once had an argument about supreme creation. To test them, Lord Shiva pierced the three worlds as a huge endless pillar of light, the Jyotirlinga. Kashi is believed to be the place where this light manifested. It is said that the city of Kashi rests on the trident (Trishul) of Lord Shiva.
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">A History of Resilience</h2>
        <p>
          The temple has been mentioned in the Puranas including the Kashi Khanda (section) of Skanda Purana. The original Vishwanath temple was destroyed and rebuilt several times over the centuries. The current structure was built by the Maratha ruler, Ahilya Bai Holkar of Indore in 1780. Later, Maharaja Ranjit Singh donated gold to cover the two domes of the temple.
        </p>
        
        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">Spiritual Liberation (Moksha)</h2>
        <p>
          Hindus believe that dying in Kashi and being cremated on the banks of the Ganges liberates a soul from the cycle of birth and death. The Kashi Vishwanath temple is central to this belief. It is a deeply held conviction that Lord Shiva himself whispers the mantra of salvation into the ears of people who die naturally in Kashi.
        </p>

        <div className="bg-[var(--color-mandir-surface)] p-6 rounded-2xl border border-[var(--color-saffron-500)]/30 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold font-[var(--font-heading)] text-lg mb-1">Offer Chadhava at Kashi</h3>
            <p className="text-sm text-[var(--color-mandir-text-muted)]">Offer Pushp, Vastra, or Bhog directly to Baba Vishwanath.</p>
          </div>
          <Link href="/chadhava" className="bg-[var(--color-saffron-500)] text-white px-6 py-2 rounded-full font-medium hover:bg-[var(--color-saffron-600)] transition-colors whitespace-nowrap">
            Offer Now
          </Link>
        </div>
      </div>
    </article>
  )
}
