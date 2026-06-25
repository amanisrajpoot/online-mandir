import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The 12 Jyotirlingas: A Spiritual Journey | Vandanam',
  description: 'A comprehensive guide to the 12 sacred Jyotirlingas of Lord Shiva spread across India, their locations, and mythological significance.',
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The 12 Jyotirlingas: A Spiritual Journey",
  "image": [
    "https://www.vandanam.online/images/temple_omkareshwar.jpg"
  ],
  "datePublished": "2024-03-15T08:00:00+08:00",
  "dateModified": "2024-03-15T09:20:00+08:00",
  "author": [{
    "@type": "Organization",
    "name": "Vandanam Spiritual Team",
    "url": "https://www.vandanam.online/about"
  }]
}

export default function JyotirlingaArticle() {
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
          The 12 Jyotirlingas: A Spiritual Journey
        </h1>
        <div className="flex items-center text-sm text-[var(--color-mandir-text-muted)]">
          <span>Published by Vandanam Editorial</span>
          <span className="mx-2">•</span>
          <time dateTime="2024-03-15">March 15, 2024</time>
        </div>
      </header>

      <div className="prose prose-orange lg:prose-lg max-w-none text-[var(--color-mandir-text)] leading-relaxed space-y-6">
        <p>
          In Hindu mythology, a Jyotirlinga is a devotional representation of Lord Shiva. "Jyoti" means 'radiance' and "lingam" the 'Image or Sign' of Shiva. According to the Shiva Purana, there are 64 original Jyotirlinga shrines in India and Nepal, 12 of which are considered most sacred and are called the Maha Jyotirlingas. 
        </p>
        <p>
          It is believed that Lord Shiva manifested himself as a towering column of light at these twelve places. Embarking on a pilgrimage to these 12 shrines is considered one of the highest spiritual achievements for a devotee.
        </p>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">The 12 Sacred Shrines</h2>
        <ol className="list-decimal list-inside space-y-4 text-[var(--color-mandir-text-muted)]">
          <li><strong>Somnath (Gujarat):</strong> Considered the first Jyotirlinga. It has been destroyed and rebuilt many times, standing as a symbol of eternal resilience.</li>
          <li><strong>Mallikarjuna (Andhra Pradesh):</strong> Located on the Shri Shaila Mountain, it is unique as it is both a Jyotirlinga and a Shakti Peetha.</li>
          <li><strong>Mahakaleshwar (Madhya Pradesh):</strong> Located in Ujjain, this is the only south-facing (Dakshinamukhi) Jyotirlinga. It is famous for its daily Bhasma Aarti.</li>
          <li><strong>Omkareshwar (Madhya Pradesh):</strong> Situated on an island in the Narmada river shaped like the sacred Hindu symbol "Om".</li>
          <li><strong>Kedarnath (Uttarakhand):</strong> Nestled in the snow-capped Himalayas, it is the northernmost Jyotirlinga and accessible only for six months a year.</li>
          <li><strong>Bhimashankar (Maharashtra):</strong> Located near Pune, it is associated with the destruction of the demon Tripurasura.</li>
          <li><strong>Kashi Vishwanath (Uttar Pradesh):</strong> Situated in Varanasi, it is the holiest of Shiva temples, deeply associated with Moksha (liberation).</li>
          <li><strong>Trimbakeshwar (Maharashtra):</strong> Located near Nashik, this linga has three faces embodying Lord Brahma, Lord Vishnu, and Lord Rudra.</li>
          <li><strong>Vaidyanath (Jharkhand):</strong> Also known as Baba Dham, it is where Ravana sacrificed his ten heads to please Lord Shiva.</li>
          <li><strong>Nageshwar (Gujarat):</strong> Located near Dwarka, representing protection from all types of poisons.</li>
          <li><strong>Rameshwaram (Tamil Nadu):</strong> The southernmost Jyotirlinga. It is believed to have been established by Lord Rama before his battle with Ravana.</li>
          <li><strong>Grishneshwar (Maharashtra):</strong> Located near the Ellora Caves, it is the last of the 12 Jyotirlingas.</li>
        </ol>

        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mt-8 mb-4">Connect with the Jyotirlingas Digitally</h2>
        <p>
          Visiting all 12 Jyotirlingas requires significant time and travel. Through Vandanam, you can maintain your spiritual connection with these sacred sites by booking online pujas and offering chadhava, facilitated by authenticated temple priests.
        </p>

        <div className="bg-[var(--color-mandir-surface)] p-6 rounded-2xl border border-[var(--color-saffron-500)]/30 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold font-[var(--font-heading)] text-lg mb-1">Explore Jyotirlinga Temples</h3>
            <p className="text-sm text-[var(--color-mandir-text-muted)]">View our directory to book services at prominent Jyotirlingas.</p>
          </div>
          <Link href="/temples" className="bg-[var(--color-saffron-500)] text-white px-6 py-2 rounded-full font-medium hover:bg-[var(--color-saffron-600)] transition-colors whitespace-nowrap">
            Explore Temples
          </Link>
        </div>
      </div>
    </article>
  )
}
