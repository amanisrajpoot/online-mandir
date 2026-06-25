import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | Vandanam',
  description: 'Understand the refund policies for our online puja and chadhava services at Vandanam.',
}

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pb-32">
      <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-8">Refund Policy</h1>
      <div className="space-y-6 text-[var(--color-mandir-text-muted)]">
        <p>Vandanam (a brand under Aradhya) strives to provide a fulfilling spiritual experience. If you are not satisfied, please review our refund policy.</p>

        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">1. Eligible Refunds</h3>
        <p>Refunds are initiated automatically for bookings canceled at least 36 hours prior to the scheduled puja. If a transaction fails but money is deducted, it will be refunded within 5-7 business days.</p>

        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">2. Non-Refundable Scenarios</h3>
        <p>Once a puja has been performed and video proof is generated, the service is considered fulfilled, and no refunds can be issued. Prasad items are perishable and cannot be returned.</p>

        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">3. Processing Time</h3>
        <p>Approved refunds are credited back to the original payment method (Bank Account, UPI, or Card) within 7 to 10 working days.</p>
      </div>
    </div>
  )
}
