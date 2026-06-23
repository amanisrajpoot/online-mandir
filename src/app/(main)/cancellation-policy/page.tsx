export default function CancellationPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pb-32">
      <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-8">Cancellation Policy</h1>
      <div className="space-y-6 text-[var(--color-mandir-text-muted)]">
        <p>At Vandanam (a brand under Aradhya), we understand that plans can change. Below is our cancellation policy for Pujas and Chadhava offerings.</p>

        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">1. Cancellation before Puja Execution</h3>
        <p>If you wish to cancel your booking, you must do so at least 36 hours before the scheduled puja time. A full refund will be processed to your original payment method.</p>

        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">2. Cancellation within 24 Hours</h3>
        <p>Cancellations made within 36 hours of the scheduled time are not eligible for a refund, as the temple authorities typically purchase the samagri (materials) and allocate the pandits in advance.</p>

        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">3. How to Cancel</h3>
        <p>You can cancel your order directly from the "Track Order" section in your Profile, or by contacting our customer support team.</p>
      </div>
    </div>
  )
}
