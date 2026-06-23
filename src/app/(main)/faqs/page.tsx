export default function FaqsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pb-32">
      <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6 text-[var(--color-mandir-text)]">
        <div>
          <h3 className="text-xl font-bold mb-2">How does online Puja work?</h3>
          <p className="text-[var(--color-mandir-text-muted)]">When you book a puja on Vandanam, our partner pandits perform the rituals in the temple on your behalf using your Sankalp details. A video recording is shared with you upon completion.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">How long does Prasad delivery take?</h3>
          <p className="text-[var(--color-mandir-text-muted)]">Prasad is usually dispatched within 24 hours of the puja completion. Delivery within India typically takes 4-7 business days.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Is the payment secure?</h3>
          <p className="text-[var(--color-mandir-text-muted)]">Yes, all payments are processed securely via Cashfree using bank-grade encryption.</p>
        </div>
      </div>
    </div>
  )
}
