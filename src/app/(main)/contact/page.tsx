import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Vandanam',
  description: 'Get in touch with Vandanam for any queries regarding online puja bookings, chadhava offerings, or support.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pb-32">
      <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-8">Contact Us</h1>
      <div className="space-y-6 text-[var(--color-mandir-text)]">
        <p className="text-[var(--color-mandir-text-muted)] mb-8">Have a question or need support? We're here to help.</p>
        
        <div className="bg-[var(--color-mandir-surface)] p-6 rounded-xl border border-[var(--color-mandir-border)]">
          <h3 className="text-xl font-bold mb-4">Customer Support</h3>
          <p className="mb-2"><strong>Email:</strong> support@devmandir.app</p>
          <p className="mb-2"><strong>WhatsApp:</strong> +91 98765 43210</p>
          <p><strong>Hours:</strong> Mon-Sat, 9:00 AM - 7:00 PM IST</p>
        </div>
      </div>
    </div>
  )
}
