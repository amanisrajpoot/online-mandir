export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pb-32">
      <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-8">Terms & Conditions</h1>
      <div className="space-y-6 text-[var(--color-mandir-text-muted)]">
        <p>Welcome to Vandanam (a brand under Aradhya). By accessing or using our platform, you agree to be bound by these terms.</p>
        
        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">1. Services Provided</h3>
        <p>Vandanam acts as a facilitator between devotees and temples/pandits. We ensure the timely execution of digital pujas and delivery of prasad as requested.</p>
        
        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">2. User Responsibilities</h3>
        <p>Users must provide accurate information (Name, Gotra, Address) while booking. We are not responsible for delays in prasad delivery due to incorrect addresses.</p>
        
        <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mt-6 mb-2">3. Video Proofs</h3>
        <p>Video proofs are recorded for authenticity and shared privately via WhatsApp or email. They remain the intellectual property of the respective temples.</p>
      </div>
    </div>
  )
}
