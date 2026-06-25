import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Why We Offer Bhasma at Mahakaleshwar | Vandanam',
  description: 'Understand the profound meaning behind the famous Bhasma Aarti at Ujjain Mahakaleshwar and the significance of offering sacred ash to Lord Shiva.',
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Why We Offer Bhasma at Mahakaleshwar",
  "image": [
    "https://www.vandanam.online/images/temple_mahakaleshwar.jpg"
  ],
  "datePublished": "2024-03-20T08:00:00+08:00",
  "dateModified": "2024-03-20T09:20:00+08:00",
  "author": [{
    "@type": "Organization",
    "name": "Vandanam Spiritual Team",
    "url": "https://www.vandanam.online/about"
  }]
}

export default function BhasmaArticle() {
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
          Why We Offer Bhasma at Mahakaleshwar
        </h1>
        <div className="flex items-center text-sm text-[var(--color-mandir-text-muted)]">
          <span>Published by Vandanam Editorial</span>
          <span className="mx-2">•</span>
          <time dateTime="2024-03-20">March 20, 2024</time>
        </div>
      </header>

      <div className="prose prose-orange lg:prose-lg max-w-none text-[var(--color-mandir-text)] leading-relaxed space-y-6">
        <p>
          The Mahakaleshwar Jyotirlinga in Ujjain, Madhya Pradesh, is world-renowned for a highly unique and powerful ritual: the **Bhasma Aarti**. Conducted every day before dawn, the presiding deity, Lord Shiva, is awakened and adorned with sacred ash (Bhasma). But what is the profound spiritual and philosophical meaning behind this act?
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">The Lord of Time and Death</h2>
        <p>
          "Mahakal" translates to the Lord of Time, or the Supreme Conqueror of Death. In Hindu philosophy, everything in the material universe is temporary. Eventually, all matter decays, burns, and turns to ash. By adorning himself with ash, Lord Mahakaleshwar reminds his devotees of the ultimate, unavoidable truth of existence: mortality. 
        </p>
        <p>
          However, this is not meant to be a morbid realization. Instead, it teaches detachment. When a devotee offers ash to Shiva or applies it to their own forehead, they are accepting the temporary nature of the physical body and focusing their mind on the eternal, indestructible soul (Atman).
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">The Purest Substance</h2>
        <p>
          In Sanatana Dharma, Bhasma is considered the purest of all substances. Fire consumes all impurities, and what is left behind (ash) cannot be burnt any further. It cannot be corrupted, rotted, or destroyed. Offering Bhasma symbolizes surrendering one's ego, desires, and sins into the fire of knowledge, presenting the purified soul to God.
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">The Bhasma Aarti Ritual</h2>
        <p>
          Historically, it is believed that the ash used in the Bhasma Aarti was brought fresh from a funeral pyre (Chita Bhasma). Today, in accordance with changing times and regulations, the ash is often prepared using cow dung, sacred wood (Samidha), peepal, and other pure ingredients, though the spiritual essence of the ritual remains untouched.
        </p>
        <p>
          During the Aarti, the priests rapidly rub the ash over the Lingam accompanied by the fierce and reverberating sounds of damarus, conch shells, and Vedic chanting. The energy generated in the sanctum sanctorum during this time is said to be unparalleled, removing fear, sickness, and negative planetary influences (Doshas) from the lives of the devotees.
        </p>

        <div className="bg-[var(--color-mandir-surface)] p-6 rounded-2xl border border-[var(--color-saffron-500)]/30 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold font-[var(--font-heading)] text-lg mb-1">Offer Bhasma Chadhava</h3>
            <p className="text-sm text-[var(--color-mandir-text-muted)]">Have authentic Bhasma offered to Mahakaleshwar on your behalf.</p>
          </div>
          <Link href="/chadhava" className="bg-[var(--color-saffron-500)] text-white px-6 py-2 rounded-full font-medium hover:bg-[var(--color-saffron-600)] transition-colors whitespace-nowrap">
            Offer Online
          </Link>
        </div>
      </div>
    </article>
  )
}
