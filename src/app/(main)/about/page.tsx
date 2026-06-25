import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | Vandanam',
  description: 'Learn about Vandanam, our mission to connect devotees with authentic temple rituals, and our trusted network of pandits across India.',
}

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "Vandanam",
    "url": "https://www.vandanam.online",
    "logo": "https://www.vandanam.online/icon.png",
    "description": "Vandanam connects devotees worldwide with ancient Indian temples through digital pujas, authentic chadhava offerings, and spiritual content.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    }
  }
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      
      <h1 className="text-4xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-6 text-center">About Vandanam</h1>
      <p className="text-xl text-[var(--color-saffron-500)] text-center font-medium mb-12">Bridging the Gap Between Devotion and Distance</p>
      
      <div className="space-y-8 text-[var(--color-mandir-text)] leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold font-[var(--font-heading)] mb-4">Our Mission</h2>
          <p className="text-[var(--color-mandir-text-muted)]">
            At Vandanam, we believe that physical distance should never be a barrier to spiritual fulfillment. In today's fast-paced world, millions of devotees find it challenging to visit sacred temples and perform rituals. Our mission is to democratize access to divine blessings by providing a trusted, transparent, and seamless platform for booking authentic online pujas and offering chadhava at India's most revered temples.
          </p>
        </section>

        <section className="bg-[var(--color-mandir-surface)] p-8 rounded-2xl border border-[var(--color-mandir-border)] my-8">
          <h2 className="text-2xl font-bold font-[var(--font-heading)] mb-4">Authenticity Above All</h2>
          <p className="text-[var(--color-mandir-text-muted)] mb-4">
            We understand the sanctity of your faith. That is why we have partnered exclusively with verified, experienced pandits who serve directly at the prominent temples. 
          </p>
          <ul className="list-disc list-inside space-y-2 text-[var(--color-mandir-text-muted)]">
            <li><strong>Verified Pandits:</strong> Every ritual is performed by authentic temple priests.</li>
            <li><strong>Personalized Sankalp:</strong> Pujas are performed exactly as per Vedic traditions with your name and gotra.</li>
            <li><strong>Video Proof:</strong> We share a video recording of your personalized puja to ensure complete transparency.</li>
            <li><strong>Blessed Prasad:</strong> Prasad from the puja is securely packaged and delivered directly to your doorstep.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-[var(--font-heading)] mb-4">The Vandanam Promise</h2>
          <p className="text-[var(--color-mandir-text-muted)]">
            Whether you are seeking the blessings of Lord Shiva at Mahakaleshwar, the divine grace of Mata Vaishno Devi, or offering Chadhava at Kashi Vishwanath, Vandanam acts as your digital bridge to the divine. We are building the future of spiritual technology—combining the profound traditions of Sanatana Dharma with the convenience of modern accessibility.
          </p>
        </section>
      </div>
    </div>
  )
}
