"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Heart, ArrowRight, Home, Loader2, XCircle } from "lucide-react"

function DonationConfirmationContent() {
  const params = useSearchParams()
  const orderId = params.get("order_id")
  const cfOrderId = params.get("cf_id")

  const [status, setStatus] = React.useState<"loading" | "success" | "failed">("loading")
  const [confettiParts] = React.useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      color: ["#f97316", "#d4a843", "#dc2626", "#16a34a", "#7c3aed"][Math.floor(Math.random() * 5)],
      size: 6 + Math.random() * 8,
    }))
  )

  React.useEffect(() => {
    const verifyPayment = async () => {
      if (!cfOrderId) {
        setStatus("failed")
        return
      }

      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: cfOrderId, type: "donation" })
        })

        const data = await res.json()
        if (data.success) {
          setStatus("success")
        } else {
          setStatus("failed")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("failed")
      }
    }

    verifyPayment()
  }, [cfOrderId])

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="h-16 w-16 animate-spin text-[var(--color-saffron-500)] mb-6" />
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-2">Verifying Payment...</h1>
        <p className="text-[var(--color-mandir-text-muted)]">Please wait while we confirm your donation transaction.</p>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-[var(--color-sacred-red)]/10 rounded-full flex items-center justify-center mb-6">
          <XCircle className="h-12 w-12 text-[var(--color-sacred-red)]" />
        </div>
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-2">Donation Failed</h1>
        <p className="text-[var(--color-mandir-text-muted)] mb-8 text-center max-w-md">We could not verify your payment. If money was deducted, it will be automatically refunded by your bank within 5-7 business days.</p>
        <div className="flex gap-4">
          <Link href="/donate">
            <button className="px-6 py-2.5 rounded-xl border border-[var(--color-mandir-border)] text-sm font-semibold text-[var(--color-mandir-text)] hover:border-[var(--color-saffron-400)] transition-colors">
              Try Again
            </button>
          </Link>
          <Link href="/">
            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-saffron-600)] to-[var(--color-saffron-400)] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all">
              Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-mandir-bg)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Confetti particles */}
      {confettiParts.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 rounded-sm pointer-events-none"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: 360 * 3 }}
          transition={{ duration: 3 + Math.random() * 2, delay: p.delay, ease: "linear" }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative z-10 w-full max-w-md py-12"
      >
        <div className="rounded-3xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-card)] shadow-2xl overflow-hidden">
          {/* Top gradient banner */}
          <div className="bg-gradient-to-r from-[var(--color-auspicious-green)] to-[var(--color-auspicious-green)]/70 px-8 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-2xl font-extrabold font-[var(--font-heading)] text-white">
              आपका दान सफल रहा! 🙏
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Your donation was successful. Thank you for your generosity!
            </p>
          </div>

          <div className="p-8 space-y-6 text-center">
            {/* Quote */}
            <div className="rounded-2xl bg-[var(--color-saffron-50)] dark:bg-[var(--color-saffron-500)]/10 border border-[var(--color-saffron-500)]/20 px-6 py-4">
              <p className="text-sm font-semibold text-[var(--color-saffron-600)] dark:text-[var(--color-saffron-400)] italic">
                "अन्नं परमं ब्रह्म" — Food is the Supreme Divine
              </p>
              <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
                Your act of giving creates ripples of positive karma
              </p>
            </div>

            {/* Heart animation */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex justify-center"
            >
              <Heart className="w-10 h-10 text-[var(--color-sacred-red)] fill-[var(--color-sacred-red)]" />
            </motion.div>

            <div className="space-y-2">
              <p className="text-sm text-[var(--color-mandir-text-muted)]">
                A confirmation and donation receipt has been sent to your email.
              </p>
              {orderId && (
                <p className="text-xs text-[var(--color-mandir-text-muted)] font-mono">
                  Order: {orderId.slice(0, 8).toUpperCase()}…
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/donate" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--color-mandir-border)] text-sm font-semibold text-[var(--color-mandir-text)] hover:border-[var(--color-saffron-400)] transition-colors">
                  <Heart className="w-4 h-4 text-[var(--color-saffron-500)]" />
                  Donate Again
                </button>
              </Link>
              <Link href="/" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--color-saffron-600)] to-[var(--color-saffron-400)] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all">
                  <Home className="w-4 h-4" />
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function DonationConfirmationPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[70vh] flex justify-center items-center"><Loader2 className="h-12 w-12 animate-spin text-[var(--color-saffron-500)]" /></div>}>
      <DonationConfirmationContent />
    </React.Suspense>
  )
}
