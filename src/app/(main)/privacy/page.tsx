export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pb-32">
      <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-[var(--color-mandir-text-muted)]">
        <p>Your privacy is important to us. This policy outlines how Vandanam (a brand under Aradhya) collects, uses, and protects your data.</p>
        
        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">1. Information We Collect</h3>
        <p>We collect your name, phone number, address, and astrological details (like Gotra) solely for the purpose of executing spiritual services and delivering prasad.</p>
        
        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">2. Payment Information</h3>
        <p>We do not store your credit card or bank details. All payment processing is securely handled by our PCI-DSS compliant partner, Cashfree.</p>
        
        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">3. Data Sharing</h3>
        <p>We only share your details (Name, Gotra) with the assigned pandit for the Sankalp. We do not sell your personal data to third-party marketers.</p>
      </div>
    </div>
  )
}
