import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Navratri Special: Worshipping the 9 Forms of Maa Durga | Vandanam',
  description: 'A spiritual guide to the nine nights of Navratri, exploring the significance of the Navadurga and how to seek their blessings.',
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Navratri Special: Worshipping the 9 Forms of Maa Durga",
  "image": [
    "https://www.vandanam.online/images/temple_vaishnodevi.jpg"
  ],
  "datePublished": "2024-03-25T08:00:00+08:00",
  "dateModified": "2024-03-25T09:20:00+08:00",
  "author": [{
    "@type": "Organization",
    "name": "Vandanam Spiritual Team",
    "url": "https://www.vandanam.online/about"
  }]
}

export default function NavratriArticle() {
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
          Navratri Special: Worshipping the 9 Forms of Maa Durga
        </h1>
        <div className="flex items-center text-sm text-[var(--color-mandir-text-muted)]">
          <span>Published by Vandanam Editorial</span>
          <span className="mx-2">•</span>
          <time dateTime="2024-03-25">March 25, 2024</time>
        </div>
      </header>

      <div className="prose prose-orange lg:prose-lg max-w-none text-[var(--color-mandir-text)] leading-relaxed space-y-6">
        <p>
          Navratri, literally translating to 'Nine Nights', is one of the most vibrant and spiritually significant festivals in Sanatana Dharma. It celebrates the victory of good over evil and the supreme cosmic energy—the Divine Mother, Devi Durga. During these nine days, devotees worship the nine distinct manifestations of the Goddess, collectively known as the <strong>Navadurga</strong>.
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">The Nine Divine Forms</h2>
        
        <ul className="list-none space-y-6 mt-6">
          <li>
            <strong className="text-lg text-[var(--color-saffron-500)] font-[var(--font-heading)]">Day 1: Shailaputri</strong>
            <p className="mt-1">The 'Daughter of the Mountain' (Himalayas). Riding a bull and carrying a trident and lotus, she embodies absolute purity and nature. She represents the root chakra (Muladhara).</p>
          </li>
          <li>
            <strong className="text-lg text-[var(--color-saffron-500)] font-[var(--font-heading)]">Day 2: Brahmacharini</strong>
            <p className="mt-1">The unmarried form of Goddess Parvati who performed severe penance to obtain Lord Shiva. Worshipping her brings emotional strength, peace, and prosperity.</p>
          </li>
          <li>
            <strong className="text-lg text-[var(--color-saffron-500)] font-[var(--font-heading)]">Day 3: Chandraghanta</strong>
            <p className="mt-1">Adorned with a half-moon shaped like a bell (Ghanta) on her forehead, this fierce, ten-armed form is worshipped for bravery and courage to fight inner and outer demons.</p>
          </li>
          <li>
            <strong className="text-lg text-[var(--color-saffron-500)] font-[var(--font-heading)]">Day 4: Kushmanda</strong>
            <p className="mt-1">The creator of the universe. It is believed she generated the cosmos with a mere smile. She resides in the sun and provides light and energy to the solar system.</p>
          </li>
          <li>
            <strong className="text-lg text-[var(--color-saffron-500)] font-[var(--font-heading)]">Day 5: Skandamata</strong>
            <p className="mt-1">The mother of Skanda (Lord Kartikeya). Depicted holding her infant son, worshipping her brings the dual blessings of the Mother Goddess and the Commander of the Gods.</p>
          </li>
          <li>
            <strong className="text-lg text-[var(--color-saffron-500)] font-[var(--font-heading)]">Day 6: Katyayani</strong>
            <p className="mt-1">Born to Sage Katyayana, this is the fierce warrior form of Durga that was invoked to destroy the demon Mahishasura. She blesses devotees with a harmonious married life.</p>
          </li>
          <li>
            <strong className="text-lg text-[var(--color-saffron-500)] font-[var(--font-heading)]">Day 7: Kalaratri</strong>
            <p className="mt-1">The fiercest and darkest form of the Goddess. She destroys ignorance and removes darkness. Despite her fearsome appearance, she always grants auspicious results to her devotees.</p>
          </li>
          <li>
            <strong className="text-lg text-[var(--color-saffron-500)] font-[var(--font-heading)]">Day 8: Mahagauri</strong>
            <p className="mt-1">Radiantly white and immensely peaceful, she represents purity, calmness, and wisdom. Worshipping her washes away all past sins.</p>
          </li>
          <li>
            <strong className="text-lg text-[var(--color-saffron-500)] font-[var(--font-heading)]">Day 9: Siddhidatri</strong>
            <p className="mt-1">The bestower of all mystical powers (Siddhis). Sitting on a lotus, she grants ultimate spiritual wisdom and the realization of the self.</p>
          </li>
        </ul>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">Seeking Devi's Blessings</h2>
        <p>
          During Navratri, special pujas, yagyas (fire rituals), and Kanya Pujan are performed. Even if you cannot visit a prominent Shakti Peetha like Mata Vaishno Devi or Kamakhya, you can still participate in the divine festivities through online pujas.
        </p>

        <div className="bg-[var(--color-mandir-surface)] p-6 rounded-2xl border border-[var(--color-saffron-500)]/30 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold font-[var(--font-heading)] text-lg mb-1">Book a Navratri Durga Puja</h3>
            <p className="text-sm text-[var(--color-mandir-text-muted)]">Invoke the blessings of the Divine Mother for your family's protection.</p>
          </div>
          <Link href="/pujas" className="bg-[var(--color-saffron-500)] text-white px-6 py-2 rounded-full font-medium hover:bg-[var(--color-saffron-600)] transition-colors whitespace-nowrap">
            View Pujas
          </Link>
        </div>
      </div>
    </article>
  )
}
