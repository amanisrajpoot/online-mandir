"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Heart, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle,
  Share2,
  Lock,
  Phone,
  Mail,
  User as UserIcon
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { CashfreeCheckout } from "@/components/payment/CashfreeCheckout"
import { CAUSES_DATA, CauseDetail } from "@/lib/donationCausesData"

interface Seva {
  category: string
  title: string
  subtitle: string
  description: string
  image_url?: string
  suggested_amounts?: number[]
  min_amount?: number
  impact_statement?: string
  donors_count?: number
  total_raised?: number
}

interface DonationFormPageProps {
  seva: Seva
}

export function DonationFormPage({ seva }: DonationFormPageProps) {
  const supabase = createClient()
  const richCause: CauseDetail | undefined = CAUSES_DATA[seva.category]

  // Amounts
  const initialAmounts = richCause?.donationTiers?.map(t => t.amount) || seva.suggested_amounts || [101, 251, 501, 1001, 2001, 5001, 11000]
  const defaultSelected = initialAmounts.includes(1001) ? 1001 : (initialAmounts.includes(501) ? 501 : initialAmounts[0])

  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(defaultSelected)
  const [customAmount, setCustomAmount] = React.useState("")
  const [isCustom, setIsCustom] = React.useState(false)

  // Donor form
  const [donorName, setDonorName] = React.useState("")
  const [donorEmail, setDonorEmail] = React.useState("")
  const [donorPhone, setDonorPhone] = React.useState("")
  const [donorMessage, setDonorMessage] = React.useState("")
  const [isAnonymous, setIsAnonymous] = React.useState(false)
  const [joinCommunity, setJoinCommunity] = React.useState(true)

  // Status & payment
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [paymentSessionId, setPaymentSessionId] = React.useState("")
  const [copiedLink, setCopiedLink] = React.useState(false)

  // Lightbox
  const [activePhotoIndex, setActivePhotoIndex] = React.useState<number | null>(null)
  
  // Accordion
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0)

  // Pre-fill user details if logged in
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        if (!donorEmail && user.email) setDonorEmail(user.email)
        if (!donorPhone && user.phone) setDonorPhone(user.phone)
      }
    })
  }, [supabase])

  const finalAmount = isCustom ? parseInt(customAmount) || 0 : selectedAmount || 0

  // Calculate current dynamic impact
  const currentTier = richCause?.donationTiers?.find(t => t.amount === finalAmount)
  const dynamicImpact = currentTier?.impact || (
    finalAmount > 0 
      ? `Your generous contribution of ₹${finalAmount.toLocaleString("en-IN")} brings tangible relief and divine blessings.`
      : (seva.impact_statement || "Every contribution directly serves the cause.")
  )

  const handleAmountSelect = (amt: number) => {
    setSelectedAmount(amt)
    setIsCustom(false)
    setCustomAmount("")
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setIsCustom(true)
    setSelectedAmount(null)
  }

  const handleShare = async () => {
    const shareData = {
      title: `${seva.title} — Vandanam Seva`,
      text: `${seva.subtitle}. Join hands and contribute to support this vital mission.`,
      url: typeof window !== "undefined" ? window.location.href : `https://vandanam.online/donate/${seva.category}`
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User dismissed
      }
    } else {
      navigator.clipboard.writeText(shareData.url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const min = seva.min_amount || 10
    if (finalAmount < min) {
      setError(`Please enter a donation amount of at least ₹${min}.`)
      return
    }

    const cleanPhone = donorPhone.replace(/\D/g, "")
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number so we can send your instant tax receipt.")
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
          customerName: isAnonymous ? "Anonymous Donor" : (donorName.trim() || "Devotee"),
          customerPhone: cleanPhone,
          customerEmail: donorEmail.trim() || "donor@vandanam.online",
          donorName: isAnonymous ? null : donorName.trim(),
          donorMessage: donorMessage.trim(),
          isAnonymous,
          notes: {
            joinCommunity,
            sourceCategory: seva.category
          }
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to initiate payment. Please try again.")

      if (data.paymentSessionId) {
        setPaymentSessionId(data.paymentSessionId)
      } else {
        throw new Error("Payment gateway session could not be created.")
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const galleryList = richCause?.gallery || (seva.image_url ? [{
    src: seva.image_url,
    title: seva.title,
    location: "Field Operations Center",
    caption: seva.subtitle
  }] : [])

  const isRelief = richCause?.type === "disaster" || seva.category.includes("relief")

  return (
    <div className="min-h-screen bg-[var(--color-mandir-bg)] text-[var(--color-mandir-text)]">
      {/* Top Breadcrumb & Status Ribbon */}
      <div className="border-b border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)]/70 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 max-w-6xl py-3 flex items-center justify-between">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-mandir-text-muted)] hover:text-[var(--color-saffron-500)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>सभी सेवाएं • All Causes</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isRelief ? "bg-red-500/10 text-red-600 border border-red-500/20" : "bg-[var(--color-saffron-500)]/10 text-[var(--color-saffron-600)] border border-[var(--color-saffron-500)]/20"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isRelief ? "bg-red-500 animate-ping" : "bg-[var(--color-saffron-500)] animate-pulse"}`} />
              {richCause?.badge || (isRelief ? "🚨 Urgent Disaster Relief" : "🙏 Verified Sacred Seva")}
            </span>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-400)] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-mandir-surface)] via-[var(--color-mandir-bg)] to-[var(--color-mandir-bg)] pt-8 pb-12 border-b border-[var(--color-mandir-border)]">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Partner Badges */}
          {richCause?.partnerBadges && richCause.partnerBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-mandir-text-muted)]">Verified Partners:</span>
              {richCause.partnerBadges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] text-[var(--color-mandir-text)]">
                  <ShieldCheck className="w-3 h-3 text-[var(--color-auspicious-green)]" />
                  {badge}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-3xl md:text-5xl font-extrabold font-[var(--font-heading)] leading-tight">
                {seva.title}
              </h1>
              <p className="text-base md:text-xl text-[var(--color-mandir-text-muted)] leading-relaxed">
                {seva.subtitle}
              </p>

              {/* Tax & Verification banner */}
              <div className="p-3.5 rounded-xl bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] text-xs font-medium text-[var(--color-mandir-text-muted)] flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-[var(--color-auspicious-green)] font-bold">
                  <CheckCircle2 className="w-4 h-4" /> 100% Direct Field Distribution
                </span>
                <span>•</span>
                <span>80G Tax Exemption Certificate Issued</span>
                <span>•</span>
                <span>Instant WhatsApp & Email Receipt</span>
              </div>
            </div>

            {/* Raised / Donors card */}
            <div className="lg:col-span-4 bg-[var(--color-mandir-card)] p-6 rounded-2xl border border-[var(--color-mandir-border)] shadow-md space-y-4">
              {isRelief ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl md:text-3xl font-extrabold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
                        ₹{(seva.total_raised || richCause?.totalRaised || 184500).toLocaleString("en-IN")}
                      </div>
                      <div className="text-xs text-[var(--color-mandir-text-muted)] uppercase tracking-wider font-semibold">Total Relief Raised</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-extrabold font-[var(--font-heading)] text-[var(--color-saffron-500)]">
                        {(seva.donors_count || richCause?.donorsCount || 340).toLocaleString("en-IN")}
                      </div>
                      <div className="text-xs text-[var(--color-mandir-text-muted)] uppercase tracking-wider font-semibold">Relief Donors</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[var(--color-mandir-border)] h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-sacred-red)] to-[var(--color-saffron-500)] h-full w-[74%] rounded-full" />
                  </div>
                  <p className="text-xs text-[var(--color-mandir-text-muted)] text-center">
                    Continuous relief mission • Direct on-ground deployment
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl md:text-3xl font-extrabold font-[var(--font-heading)] text-[var(--color-saffron-500)]">
                        {(seva.donors_count || richCause?.donorsCount || 850).toLocaleString("en-IN")}
                      </div>
                      <div className="text-xs text-[var(--color-mandir-text-muted)] uppercase tracking-wider font-semibold">Devotees & Contributors</div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-auspicious-green)]/10 text-[var(--color-auspicious-green)] text-xs font-bold border border-[var(--color-auspicious-green)]/20">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-auspicious-green)] animate-pulse" />
                        Nitya Seva Active
                      </div>
                      <div className="text-[11px] text-[var(--color-mandir-text-muted)] mt-1">100% Non-Profit Seva</div>
                    </div>
                  </div>

                  {/* Sacred status banner */}
                  <div className="w-full bg-[var(--color-mandir-surface)] p-2.5 rounded-xl border border-[var(--color-mandir-border)] text-xs text-center text-[var(--color-mandir-text-muted)] flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--color-saffron-500)]" />
                    <span>Sacred Mahadaan Tradition • Dedicated Daily</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 4 Impact Counters */}
          {richCause?.impactCounters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
              {richCause.impactCounters.map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] text-center space-y-1">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className="text-xl md:text-2xl font-extrabold text-[var(--color-mandir-text)] font-[var(--font-heading)]">{stat.value}</div>
                  <div className="text-xs text-[var(--color-mandir-text-muted)] font-medium leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content & Donation Form Layout */}
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Deep Content, Story, Allocations, Timeline, Gallery, FAQs */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Story & Context */}
            <section className="space-y-4 rounded-2xl p-6 bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)]">
              <h2 className="text-2xl font-extrabold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
                {richCause?.story?.headline || "About this Seva & Mission"}
              </h2>
              {richCause?.story?.subheadline && (
                <p className="text-sm font-semibold text-[var(--color-saffron-600)]">
                  {richCause.story.subheadline}
                </p>
              )}

              <div className="space-y-3 text-sm md:text-base text-[var(--color-mandir-text-muted)] leading-relaxed">
                {(richCause?.story?.paragraphs || [seva.description]).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Quote if available */}
              {richCause?.story?.quote && (
                <blockquote className="my-4 border-l-4 border-[var(--color-saffron-500)] pl-4 py-2 bg-[var(--color-mandir-surface)] rounded-r-xl italic text-sm text-[var(--color-mandir-text)]">
                  &ldquo;{richCause.story.quote.text}&rdquo;
                  <span className="block mt-1 text-xs font-bold text-[var(--color-mandir-text-muted)] not-italic">
                    — {richCause.story.quote.author}
                  </span>
                </blockquote>
              )}

              {/* Key Bullet Highlights */}
              {richCause?.story?.keyPoints && (
                <div className="pt-2 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-mandir-text)]">Key Operations:</h4>
                  <ul className="space-y-2">
                    {richCause.story.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-[var(--color-mandir-text)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-auspicious-green)] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Where Does Your Donation Go? (Transparent Breakdown) */}
            {richCause?.allocation && (
              <section className="space-y-4 rounded-2xl p-6 bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-[var(--font-heading)]">Where Does Your Contribution Go?</h3>
                  <span className="text-xs font-semibold text-[var(--color-auspicious-green)] bg-[var(--color-auspicious-green)]/10 px-2.5 py-1 rounded-full">
                    100% Transparent
                  </span>
                </div>
                <div className="space-y-4 pt-2">
                  {richCause.allocation.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs md:text-sm font-bold">
                        <span>{item.title}</span>
                        <span className="text-[var(--color-saffron-600)]">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-[var(--color-mandir-border)] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[var(--color-saffron-500)] to-[var(--color-temple-gold)] h-full rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-[var(--color-mandir-text-muted)]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* On-Ground Photographic Evidence Gallery */}
            <section className="space-y-4 rounded-2xl p-6 bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-[var(--font-heading)]">On-Ground Evidence & Field Dispatches</h3>
                  <p className="text-xs text-[var(--color-mandir-text-muted)] mt-0.5">Click any photograph to view full verified report</p>
                </div>
                <Sparkles className="w-4 h-4 text-[var(--color-saffron-500)]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {galleryList.map((photo, index) => (
                  <div 
                    key={index}
                    onClick={() => setActivePhotoIndex(index)}
                    className="group relative rounded-xl overflow-hidden border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] cursor-pointer shadow-xs hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-mandir-surface)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={photo.src} 
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-xs font-bold leading-tight line-clamp-1">{photo.title}</div>
                        <div className="text-[11px] text-white/80 flex items-center gap-1 mt-0.5">
                          <span>📍</span> {photo.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Direct Impact Timeline */}
            {richCause?.timeline && (
              <section className="space-y-4 rounded-2xl p-6 bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)]">
                <h3 className="text-xl font-bold font-[var(--font-heading)]">How Your Contribution Reaches the Ground</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {richCause.timeline.map((step, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[var(--color-mandir-surface)] border border-[var(--color-mandir-border)] space-y-2 relative">
                      <div className="text-2xl font-black text-[var(--color-saffron-500)]/30 font-[var(--font-heading)]">{step.step}</div>
                      <h5 className="text-sm font-bold text-[var(--color-mandir-text)]">{step.title}</h5>
                      <p className="text-xs text-[var(--color-mandir-text-muted)] leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs Accordion */}
            {richCause?.faqs && (
              <section className="space-y-4 rounded-2xl p-6 bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)]">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[var(--color-saffron-500)]" />
                  <h3 className="text-xl font-bold font-[var(--font-heading)]">Frequently Asked Questions</h3>
                </div>

                <div className="divide-y divide-[var(--color-mandir-border)]">
                  {richCause.faqs.map((faq, i) => (
                    <div key={i} className="py-3.5">
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                        className="w-full flex items-center justify-between text-left font-bold text-sm text-[var(--color-mandir-text)] hover:text-[var(--color-saffron-600)] transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <span className="text-xs ml-2 text-[var(--color-mandir-text-muted)]">
                          {openFaqIndex === i ? "−" : "+"}
                        </span>
                      </button>
                      {openFaqIndex === i && (
                        <p className="mt-2 text-xs md:text-sm text-[var(--color-mandir-text-muted)] leading-relaxed">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Sticky Donation Card */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            {paymentSessionId ? (
              <div className="rounded-3xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-card)] p-6 shadow-2xl">
                <CashfreeCheckout paymentSessionId={paymentSessionId} />
              </div>
            ) : (
              <div className="rounded-3xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-card)] p-6 md:p-8 shadow-xl space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
                    Select Contribution
                  </h3>
                  <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
                    Every rupee directly supports verified on-ground operations
                  </p>
                </div>

                {/* Amount Tiers Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {initialAmounts.map((amt) => {
                    const isSelected = !isCustom && selectedAmount === amt
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`py-2.5 px-2 rounded-xl text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[var(--color-sacred-red)] text-white border-[var(--color-sacred-red)] shadow-md scale-105"
                            : "bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-400)]"
                        }`}
                      >
                        ₹{amt.toLocaleString("en-IN")}
                      </button>
                    )
                  })}
                </div>

                {/* Custom Amount Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-mandir-text-muted)] mb-1.5">
                    Or Enter Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[var(--color-mandir-text-muted)]">₹</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={handleCustomChange}
                      placeholder={`Min ₹${seva.min_amount || 10}`}
                      className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] outline-none transition-all ${
                        isCustom ? "border-[var(--color-sacred-red)] ring-2 ring-[var(--color-sacred-red)]/20" : "border-[var(--color-mandir-border)] focus:border-[var(--color-sacred-red)]"
                      }`}
                    />
                  </div>
                </div>

                {/* Dynamic Live Impact Card */}
                <div className="rounded-xl p-3.5 bg-[var(--color-auspicious-green)]/10 border border-[var(--color-auspicious-green)]/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-auspicious-green)] uppercase tracking-wider">
                    <span>💚</span> Your Direct Impact:
                  </div>
                  <p className="text-xs md:text-sm font-medium text-[var(--color-mandir-text)] mt-1 leading-snug">
                    {dynamicImpact}
                  </p>
                </div>

                {/* Donor Form Inputs */}
                <form onSubmit={handleDonate} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-1">
                      Full Name {isAnonymous && "(Hidden)"}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mandir-text-muted)]" />
                      <input
                        type="text"
                        disabled={isAnonymous}
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder={isAnonymous ? "Anonymous Donor" : "e.g., Rajesh Sharma"}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] text-sm outline-none focus:border-[var(--color-saffron-500)] disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anon"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-[var(--color-mandir-border)] text-[var(--color-sacred-red)] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="anon" className="text-xs text-[var(--color-mandir-text-muted)] cursor-pointer">
                      Donate anonymously (name will not appear on public donor lists)
                    </label>
                  </div>

                  {/* Phone (Required for instant receipt) */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-1">
                      WhatsApp / Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mandir-text-muted)]" />
                      <input
                        type="tel"
                        required
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] text-sm outline-none focus:border-[var(--color-saffron-500)]"
                      />
                    </div>
                    <p className="text-[11px] text-[var(--color-mandir-text-muted)] mt-1">Instant 80G tax receipt will be sent here</p>
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mandir-text-muted)]" />
                      <input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="donor@example.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] text-sm outline-none focus:border-[var(--color-saffron-500)]"
                      />
                    </div>
                  </div>

                  {/* Sankalp / Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-mandir-text-muted)] uppercase tracking-wider mb-1">
                      Sankalp / Prayer Note (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      placeholder="e.g., In memory of beloved parents / For family wellness"
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] text-sm outline-none focus:border-[var(--color-saffron-500)] resize-none"
                    />
                  </div>

                  {/* Community Opt-in */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="community"
                      checked={joinCommunity}
                      onChange={(e) => setJoinCommunity(e.target.checked)}
                      className="mt-0.5 rounded border-[var(--color-mandir-border)] text-[var(--color-sacred-red)] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="community" className="text-xs text-[var(--color-mandir-text-muted)] cursor-pointer">
                      Send me on-ground photographic updates & field relief reports on WhatsApp
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[var(--color-sacred-red)] via-rose-600 to-[var(--color-saffron-500)] hover:opacity-95 text-white font-extrabold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{loading ? "Processing..." : `Donate ₹${finalAmount.toLocaleString("en-IN")}`}</span>
                  </button>
                </form>

                {/* Trust Badges Footer */}
                <div className="pt-2 border-t border-[var(--color-mandir-border)] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[var(--color-mandir-text-muted)]">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[var(--color-auspicious-green)]" /> 256-Bit Encrypted
                  </span>
                  <span>•</span>
                  <span>UPI / Cards / NetBanking</span>
                  <span>•</span>
                  <span>80G Receipt</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && galleryList[activePhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl w-full bg-[var(--color-mandir-card)] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next controls */}
              {galleryList.length > 1 && (
                <>
                  <button
                    onClick={() => setActivePhotoIndex((activePhotoIndex - 1 + galleryList.length) % galleryList.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setActivePhotoIndex((activePhotoIndex + 1) % galleryList.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Modal Image */}
              <div className="relative aspect-[16/10] w-full bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryList[activePhotoIndex].src}
                  alt={galleryList[activePhotoIndex].title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Modal Caption Info */}
              <div className="p-5 bg-[var(--color-mandir-card)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base md:text-lg text-[var(--color-mandir-text)]">
                    {galleryList[activePhotoIndex].title}
                  </h4>
                  <span className="text-xs text-[var(--color-mandir-text-muted)] font-mono">
                    {activePhotoIndex + 1} of {galleryList.length}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-saffron-600)] font-semibold flex items-center gap-1">
                  <span>📍</span> {galleryList[activePhotoIndex].location}
                </p>
                <p className="text-xs md:text-sm text-[var(--color-mandir-text-muted)]">
                  {galleryList[activePhotoIndex].caption}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
