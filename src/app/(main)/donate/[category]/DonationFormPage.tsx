"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Heart, Shield, Users, ChevronRight, Pencil } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
import { CashfreeCheckout } from "@/components/payment/CashfreeCheckout"

interface Seva {
  category: string
  title: string
  subtitle: string
  description: string
  image_url?: string
  suggested_amounts: number[]
  min_amount: number
  impact_statement: string
  donors_count?: number
}

interface DonationFormPageProps {
  seva: Seva
}

export function DonationFormPage({ seva }: DonationFormPageProps) {
  const router = useRouter()
  const supabase = createClient()

  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(seva.suggested_amounts?.[1] || 101)
  const [customAmount, setCustomAmount] = React.useState("")
  const [isCustom, setIsCustom] = React.useState(false)
  const [donorName, setDonorName] = React.useState("")
  const [donorPhone, setDonorPhone] = React.useState("")
  const [donorMessage, setDonorMessage] = React.useState("")
  const [isAnonymous, setIsAnonymous] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [paymentSessionId, setPaymentSessionId] = React.useState("")

  const finalAmount = isCustom ? parseInt(customAmount) || 0 : selectedAmount || 0

  const handleAmountSelect = (amt: number) => {
    setSelectedAmount(amt)
    setIsCustom(false)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val)
    setIsCustom(true)
    setSelectedAmount(null)
  }

  const handleDonate = async () => {
    setError("")

    if (finalAmount < (seva.min_amount || 1)) {
      setError(`Minimum donation amount is ₹${seva.min_amount || 1}`)
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user && !donorPhone) {
      setError("Please enter your mobile number so we can send you the receipt.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "donation",
          itemId: seva.category,
          amount: finalAmount,
          customerName: isAnonymous ? "Anonymous Donor" : (donorName || user?.email?.split("@")[0] || "Devotee"),
          customerPhone: donorPhone || user?.phone || "9999999999",
          customerEmail: user?.email || "donor@vandanam.online",
          donorName: isAnonymous ? null : donorName,
          donorMessage,
          isAnonymous,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to initiate payment")

      // Render Cashfree checkout
      if (data.paymentSessionId) {
        setPaymentSessionId(data.paymentSessionId)
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-mandir-bg)]">
      {/* Back button */}
      <div className="container mx-auto px-4 max-w-5xl pt-6">
        <Link
          href="/donate"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-mandir-text-muted)] hover:text-[var(--color-saffron-500)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all sevas
        </Link>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — Info Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden bg-[var(--color-mandir-bg)] p-8 shadow-xl border border-[var(--color-mandir-border)]"
          >
            {seva.image_url && (
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={seva.image_url} alt={seva.title} className="w-full h-full object-cover opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-saffron-600)]/90 via-[var(--color-saffron-500)]/90 to-[var(--color-temple-gold)]/90" />
              </div>
            )}
            
            <div className="relative z-10 text-white">
              <h1 className="text-2xl md:text-3xl font-extrabold font-[var(--font-heading)] leading-tight mb-1">
                {seva.title}
              </h1>
              <p className="text-white/80 text-sm mb-4">{seva.subtitle}</p>

              {/* Donors badge */}
              {(seva.donors_count || 0) > 0 && (
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-xs font-semibold">
                  <Users className="w-3 h-3" />
                  {(seva.donors_count || 0).toLocaleString("en-IN")} donors have contributed
                </div>
              )}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-card)] p-6"
          >
            <h2 className="font-bold font-[var(--font-heading)] text-lg text-[var(--color-mandir-text)] mb-3">
              About this Seva
            </h2>
            <p className="text-sm text-[var(--color-mandir-text-muted)] leading-relaxed">
              {seva.description}
            </p>

            {/* Impact statement */}
            {seva.impact_statement && (
              <div className="mt-4 rounded-xl bg-[var(--color-auspicious-green)]/10 border border-[var(--color-auspicious-green)]/20 p-3">
                <p className="text-sm font-semibold text-[var(--color-auspicious-green)]">
                  💚 Your Impact
                </p>
                <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1">{seva.impact_statement}</p>
              </div>
            )}
          </motion.div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: "🔒", text: "Secure 256-bit encryption" },
              { icon: "✅", text: "100% to the cause" },
              { icon: "📩", text: "Email receipt" },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-1.5 text-xs text-[var(--color-mandir-text-muted)] bg-[var(--color-mandir-surface)] border border-[var(--color-mandir-border)] px-3 py-1.5 rounded-full"
              >
                <span>{b.icon}</span> {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Donation Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          {paymentSessionId ? (
            <div className="sticky top-20">
              <CashfreeCheckout paymentSessionId={paymentSessionId} />
            </div>
          ) : (
            <div className="sticky top-20 rounded-3xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-card)] p-6 shadow-xl space-y-5">
              <h2 className="font-bold font-[var(--font-heading)] text-xl text-[var(--color-mandir-text)]">
                Select Amount
              </h2>

            {/* Preset amounts */}
            <div className="grid grid-cols-3 gap-2">
              {(seva.suggested_amounts || [51, 101, 251, 501, 1001, 2101, 5100]).map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAmountSelect(amt)}
                  className={`
                    rounded-xl py-2.5 px-2 text-sm font-bold border transition-all duration-200
                    ${!isCustom && selectedAmount === amt
                      ? "bg-[var(--color-saffron-500)] text-white border-[var(--color-saffron-500)] shadow-[0_0_12px_rgba(249,115,22,0.4)] scale-105"
                      : "bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-400)]"
                    }
                  `}
                >
                  ₹{amt.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-1.5">
                Or enter custom amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-mandir-text-muted)] font-bold">₹</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder={`Min ₹${seva.min_amount || 1}`}
                  className={`
                    w-full pl-7 pr-4 py-2.5 rounded-xl border text-sm bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] outline-none transition-all
                    ${isCustom ? "border-[var(--color-saffron-500)] ring-2 ring-[var(--color-saffron-500)]/20" : "border-[var(--color-mandir-border)] focus:border-[var(--color-saffron-500)]"}
                  `}
                />
              </div>
            </div>

            {/* Donor name & phone */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-1.5">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  disabled={isAnonymous}
                  placeholder="e.g., Ram Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-mandir-border)] text-sm bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] focus:border-[var(--color-saffron-500)] outline-none transition-all disabled:opacity-40"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded accent-[var(--color-saffron-500)]"
                  />
                  <span className="text-xs text-[var(--color-mandir-text-muted)]">Donate anonymously</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-1.5">
                  Mobile Number (required for receipt)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-mandir-text-muted)] font-medium text-sm">+91</span>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    placeholder="10-digit number"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--color-mandir-border)] text-sm bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] focus:border-[var(--color-saffron-500)] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-1.5">
                Message / Sankalp (optional)
              </label>
              <textarea
                rows={2}
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder="e.g., 'In memory of my parents' or 'For family prosperity'"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-mandir-border)] text-sm bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] focus:border-[var(--color-saffron-500)] outline-none transition-all resize-none"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-[var(--color-sacred-red)]/10 border border-[var(--color-sacred-red)]/20 px-4 py-2.5 text-xs text-[var(--color-sacred-red)] font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Amount preview */}
            {finalAmount > 0 && (
              <div className="rounded-xl bg-[var(--color-saffron-500)]/5 border border-[var(--color-saffron-500)]/20 px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-[var(--color-mandir-text-muted)]">Donating</span>
                <span className="text-xl font-extrabold text-[var(--color-saffron-500)]">
                  ₹{finalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* Donate CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDonate}
              disabled={loading || finalAmount < (seva.min_amount || 1)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-sacred-red)] via-[var(--color-saffron-600)] to-[var(--color-saffron-500)] text-white font-bold text-base shadow-lg hover:shadow-[0_8px_30px_rgba(249,115,22,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white" />
                  दान करें | Donate Now
                </>
              )}
            </motion.button>

            <p className="text-[10px] text-center text-[var(--color-mandir-text-muted)]">
              By donating you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[var(--color-saffron-500)]">
                Terms
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="underline hover:text-[var(--color-saffron-500)]">
                Privacy Policy
              </Link>
            </p>
          </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
