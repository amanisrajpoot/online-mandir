"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Share2, 
  Lock, 
  Phone, 
  Mail, 
  User as UserIcon, 
  MessageSquare, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  HelpCircle
} from "lucide-react"
import { CashfreeCheckout } from "@/components/payment/CashfreeCheckout"
import { createClient } from "@/lib/supabase/client"

interface NepalFloodReliefPageProps {
  initialDonorsCount?: number
  initialTotalRaised?: number
}

// Preset donation options with tangible on-ground impact
const DONATION_TIERS = [
  { amount: 101, label: "₹101", impact: "Provides 1 warm cooked meal and clean drinking water for a displaced survivor", popular: false },
  { amount: 251, label: "₹251", impact: "Feeds a family for 2 days (Cooked hot meals & bottled water)", popular: false },
  { amount: 501, label: "₹501", impact: "Warm blankets & essential nutrition pack for children", popular: false },
  { amount: 1001, label: "₹1,001", impact: "Emergency First Aid & critical medical assistance kit", popular: true },
  { amount: 2001, label: "₹2,001", impact: "Waterproof family shelter kit & heavy-duty tarpaulins", popular: false },
  { amount: 5001, label: "₹5,001", impact: "Sustained ration & hygiene pack for 5 displaced families", popular: false },
  { amount: 11000, label: "₹11,000", impact: "Sets up a community relief kitchen in a cut-off village", popular: false },
  { amount: 21000, label: "₹21,000", impact: "Mobile medical doctor camp & critical medicines dispatch", popular: false },
  { amount: 51000, label: "₹51,000", impact: "Disaster rehabilitation patron — shelter & relief truck", popular: false },
]

// Scraped local ground images from Nepal flood crisis
const GALLERY_IMAGES = [
  {
    src: "/images/nepal-flood/nepal-flood-hero.jpg",
    title: "Stranded families seeking emergency shelter",
    location: "Timure Relief Camp, Rasuwa",
    caption: "Thousands of villagers escaped with only the clothes on their backs after flash floods wiped out homes along the Trishuli river."
  },
  {
    src: "/images/nepal-flood/nepal-ground-action.jpeg",
    title: "On-ground relief teams distributing food kits",
    location: "Syabrubesi, Nepal-China Border Region",
    caption: "Our field volunteers delivering fresh hot meals, dry rations, and potable water bottles to cut-off Himalayan villages."
  },
  {
    src: "/images/nepal-flood/nepal-flood-6.jpeg",
    title: "Overnight flood devastation along riverbanks",
    location: "Bhotekoshi River Basin",
    caption: "Entire hillside settlements and mountain roads severed overnight by raging debris and surging flash waters."
  },
  {
    src: "/images/nepal-flood/nepal-flood-4.jpg",
    title: "Emergency tent camps in high terrain",
    location: "Rasuwa Outskirts",
    caption: "Displaced mothers and children huddled in makeshift tents, awaiting warm clothes and clean drinking water."
  },
  {
    src: "/images/nepal-flood/nepal-flood-8.jpeg",
    title: "Medical assistance & first-aid camp",
    location: "Timure Border Sector",
    caption: "Treating injured survivors, distributing water purification tablets, and administering emergency first-aid."
  },
  {
    src: "/images/nepal-flood/nepal-flood-7.jpeg",
    title: "Critical supplies dispatch line",
    location: "Nuwakot Relief Depot",
    caption: "Volunteers loading essential tarpaulins, dry grains, and infant formula for dispatch to inaccessible valley zones."
  },
  {
    src: "/images/nepal-flood/nepal-flood-1-2.jpg",
    title: "Child rescue and nourishment drive",
    location: "Syabrubesi Temporary Shelter",
    caption: "Ensuring children receive immediate warm meals, clean milk, and psychological care following the disaster."
  },
  {
    src: "/images/nepal-flood/nepal-flood-3.jpeg",
    title: "Elderly survivors receiving daily care",
    location: "Timure Community Kitchen",
    caption: "Providing hot meals and chronic medicines to elderly villagers whose ancestral houses were washed away."
  },
  {
    src: "/images/nepal-flood/nepal-flood-5.jpeg",
    title: "Submerged access roads and infrastructure",
    location: "Trishuli Highway Section",
    caption: "Rescue teams navigating treacherous landslide rubble to reach isolated family clusters."
  },
  {
    src: "/images/nepal-flood/nepal-flood-1.jpg",
    title: "Community solidarity & field kitchen",
    location: "Nepal Field Operations Camp",
    caption: "Continuous bhandara and relief distribution ensuring no family goes to sleep hungry tonight."
  }
]

export function NepalFloodReliefPage({
  initialDonorsCount = 1840,
  initialTotalRaised = 924500
}: NepalFloodReliefPageProps) {
  const supabase = createClient()

  // Form State
  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(1001)
  const [customAmount, setCustomAmount] = React.useState("")
  const [isCustom, setIsCustom] = React.useState(false)
  
  const [donorName, setDonorName] = React.useState("")
  const [donorPhone, setDonorPhone] = React.useState("")
  const [donorEmail, setDonorEmail] = React.useState("")
  const [donorMessage, setDonorMessage] = React.useState("")
  const [isAnonymous, setIsAnonymous] = React.useState(false)
  const [joinCommunity, setJoinCommunity] = React.useState(true)

  // Auth & UI State
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [paymentSessionId, setPaymentSessionId] = React.useState("")
  const [copiedLink, setCopiedLink] = React.useState(false)

  // Lightbox State
  const [activePhotoIndex, setActivePhotoIndex] = React.useState<number | null>(null)

  // Check if user is already logged in (to pre-fill if available)
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser(user)
        if (!donorEmail && user.email) setDonorEmail(user.email)
        if (!donorPhone && user.phone) setDonorPhone(user.phone)
      }
    })
  }, [supabase])

  const finalAmount = isCustom ? parseInt(customAmount) || 0 : selectedAmount || 0

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
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
      title: "Urgent: Nepal Flood Relief Fund",
      text: "Entire villages in Nepal have vanished in devastating flash floods. Please join me in sending immediate food, clean water, and emergency medical kits to the survivors.",
      url: typeof window !== "undefined" ? window.location.href : "https://vandanam.online/nepal-flood-relief"
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled share
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

    if (finalAmount < 10) {
      setError("Please select or enter a donation amount of at least ₹10.")
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
          itemId: "nepal-flood-relief",
          amount: finalAmount,
          customerName: isAnonymous ? "Compassionate Donor" : (donorName.trim() || currentUser?.email?.split("@")[0] || "Relief Supporter"),
          customerPhone: cleanPhone,
          customerEmail: donorEmail.trim() || currentUser?.email || "donor@vandanam.online",
          donorName: isAnonymous ? null : (donorName.trim() || null),
          donorMessage: (donorMessage.trim() || "") + (joinCommunity ? " | JOIN_COMMUNITY:YES" : ""),
          isAnonymous,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate donation payment. Please try again.")
      }

      if (data.paymentSessionId) {
        setPaymentSessionId(data.paymentSessionId)
      } else {
        throw new Error("Invalid payment session returned. Please try again.")
      }
    } catch (err: any) {
      console.error("Donation Error:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // If Cashfree Checkout is triggered, mount the checkout view
  if (paymentSessionId) {
    return (
      <div className="min-h-screen bg-[var(--color-mandir-bg)] py-12 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              🚨 Nepal Flood Relief Fund
            </span>
            <h2 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              Completing Donation of ₹{finalAmount.toLocaleString("en-IN")}
            </h2>
            <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
              Receipt will be sent to +91 {donorPhone.replace(/\D/g, "").slice(-10)}
            </p>
          </div>
          <CashfreeCheckout paymentSessionId={paymentSessionId} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-mandir-bg)] text-[var(--color-mandir-text)] selection:bg-red-500 selection:text-white">
      {/* Top Emergency Ticker */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white text-xs md:text-sm font-semibold py-2.5 px-4 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
            </span>
            <span className="font-bold tracking-wide uppercase text-yellow-200">Critical Relief:</span>
            <span className="truncate">Active flood relief camps in Timure, Syabrubesi & Rasuwa. Immediate aid dispatched daily.</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs transition-colors flex-shrink-0 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copiedLink ? "Link Copied!" : "Share Crisis"}</span>
          </button>
        </div>
      </div>

      {/* Main Hero & Donation Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
        {/* Background Atmospheric Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-red-600/15 via-amber-500/5 to-transparent pointer-events-none blur-3xl -z-10" />

        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6 flex items-center justify-between text-xs text-[var(--color-mandir-text-muted)]">
            <Link 
              href="/donate" 
              className="inline-flex items-center gap-1 hover:text-[var(--color-saffron-500)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to all humanitarian causes
            </Link>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% Direct Field Distribution
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Devastation Context & Ground Media (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Campaign Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" /> Emergency Humanitarian Appeal
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                  Himalayan Border Disaster
                </span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-[var(--font-heading)] leading-tight tracking-tight text-[var(--color-mandir-text)]">
                  Nepal Is Devastated. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">
                    Entire Villages Have Vanished.
                  </span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-[var(--color-mandir-text-muted)] leading-relaxed">
                  Catastrophic flash floods swept through the Nepal-China border region overnight along the Trishuli and Bhotekoshi rivers. Hundreds dead, thousands missing, and survivors left with nothing but the clothes they escaped in.
                </p>
              </div>

              {/* Hero Image Showcase with Ground Action Pill */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-mandir-border)] group">
                <img
                  src="/images/nepal-flood/nepal-flood-hero.jpg"
                  alt="Nepal Flash Flood Devastation and Relief"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
                
                {/* On-ground photo caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
                    <span>📍 Timure & Syabrubesi Ground Zero</span>
                    <button 
                      onClick={() => setActivePhotoIndex(0)}
                      className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" /> View 10 Field Photos
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-white/90 line-clamp-2">
                    "Villages swept away along river systems. Displaced families urgently need hot food, clean water, and shelter essentials."
                  </p>
                </div>
              </div>

              {/* Key Impact Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] rounded-2xl p-4 shadow-sm">
                <div className="text-center p-2">
                  <div className="text-2xl md:text-3xl font-extrabold text-red-600 dark:text-red-400">10,000+</div>
                  <div className="text-xs text-[var(--color-mandir-text-muted)] font-medium mt-0.5">Meals Distributed</div>
                </div>
                <div className="text-center p-2 border-l border-[var(--color-mandir-border)]">
                  <div className="text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400">500+</div>
                  <div className="text-xs text-[var(--color-mandir-text-muted)] font-medium mt-0.5">Children Protected</div>
                </div>
                <div className="text-center p-2 sm:border-l border-[var(--color-mandir-border)]">
                  <div className="text-2xl md:text-3xl font-extrabold text-rose-600 dark:text-rose-400">200+</div>
                  <div className="text-xs text-[var(--color-mandir-text-muted)] font-medium mt-0.5">Medical Aid Cases</div>
                </div>
                <div className="text-center p-2 border-l border-[var(--color-mandir-border)]">
                  <div className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">30+</div>
                  <div className="text-xs text-[var(--color-mandir-text-muted)] font-medium mt-0.5">Villages Reached</div>
                </div>
              </div>

              {/* Mission & Ground Partners */}
              <div className="bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] rounded-2xl p-5 md:p-6 space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--color-mandir-text-muted)] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--color-saffron-500)]" /> Verified On-Ground Coalition
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-mandir-text-muted)] leading-relaxed">
                  Our emergency relief wing has mobilized directly to stand with families whose lives were shattered. Operating on the frontlines alongside trusted field partners:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Dreamer Trust", "Uday Foundation Mumbai", "KindKarma", "Vandanam Relief Wing"].map((partner) => (
                    <span 
                      key={partner} 
                      className="px-3 py-1 rounded-lg bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)] text-xs font-semibold text-[var(--color-mandir-text)]"
                    >
                      ✓ {partner}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Unified Login-Free Donation Form (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-20 bg-[var(--color-mandir-card)] border-2 border-red-500/30 dark:border-red-500/40 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
                
                {/* Visual Top Ribbon */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

                {/* Form Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" /> Instant Relief Daan
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Direct Field Distribution
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
                    Send Immediate Emergency Help
                  </h2>
                  <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
                    Your contribution directly supplies meals, medicines & dry tents tonight.
                  </p>
                </div>

                {/* Optional Community / Login Prompt */}
                {!currentUser ? (
                  <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-[var(--color-mandir-text)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Already a Vandanam member?</span>
                    </div>
                    <Link
                      href="/login?returnUrl=/nepal-flood-relief"
                      className="text-amber-700 dark:text-amber-400 font-bold hover:underline whitespace-nowrap"
                    >
                      Log in to auto-fill &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-[var(--color-mandir-text)] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Logged in as <strong>{currentUser.email}</strong>
                    </span>
                  </div>
                )}

                <form onSubmit={handleDonate} className="space-y-5">
                  
                  {/* Step 1: Amount Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-mandir-text-muted)] mb-2.5">
                      1. Select Donation Amount (INR ₹)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {DONATION_TIERS.slice(0, 8).map((tier) => (
                        <button
                          key={tier.amount}
                          type="button"
                          onClick={() => handleAmountSelect(tier.amount)}
                          className={`
                            py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer
                            ${selectedAmount === tier.amount && !isCustom
                              ? "bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20 scale-[1.02]"
                              : "bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)] text-[var(--color-mandir-text)] hover:border-red-500/50"
                            }
                          `}
                        >
                          {tier.label}
                          {tier.popular && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                              Impact
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount Input */}
                    <div className="mt-2.5 relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-mandir-text-muted)]">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Or enter any custom amount (e.g. 1500)"
                        value={customAmount}
                        onChange={handleCustomChange}
                        min="10"
                        className={`
                          w-full pl-8 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--color-mandir-bg)] 
                          border text-[var(--color-mandir-text)] outline-none transition-all
                          ${isCustom ? "border-red-500 ring-2 ring-red-500/20" : "border-[var(--color-mandir-border)] hover:border-red-400"}
                        `}
                      />
                    </div>

                    {/* Active Tier Impact Statement */}
                    <div className="mt-2.5 p-2.5 rounded-lg bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)] text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 flex-shrink-0 fill-current" />
                      <span>
                        {isCustom 
                          ? `Your contribution of ₹${finalAmount || 0} provides direct life-saving sustenance to victims.`
                          : DONATION_TIERS.find(t => t.amount === selectedAmount)?.impact
                        }
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Donor Details (Guest Friendly) */}
                  <div className="space-y-3 pt-2 border-t border-[var(--color-mandir-border)]">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-mandir-text-muted)]">
                      2. Donor Contact & Receipt Details
                    </label>

                    {/* Full Name */}
                    <div>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mandir-text-muted)]" />
                        <input
                          type="text"
                          required={!isAnonymous}
                          disabled={isAnonymous}
                          placeholder={isAnonymous ? "Anonymous Donor (Name hidden)" : "Full Name *"}
                          value={isAnonymous ? "" : donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)] text-[var(--color-mandir-text)] disabled:opacity-60 outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* WhatsApp / Phone (Required for Cashfree & Updates) */}
                    <div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mandir-text-muted)]" />
                        <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-mandir-text-muted)]">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit WhatsApp number *"
                          maxLength={10}
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value.replace(/\D/g, ""))}
                          className="w-full pl-16 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)] text-[var(--color-mandir-text)] outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-[var(--color-mandir-text-muted)] mt-1 ml-1">
                        Instant payment receipt & on-ground field distribution proof sent via WhatsApp.
                      </p>
                    </div>

                    {/* Email (Optional for 80G Certificate) */}
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mandir-text-muted)]" />
                        <input
                          type="email"
                          placeholder="Email address (for official receipt)"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)] text-[var(--color-mandir-text)] outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Optional Message / Prayer */}
                    <div>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[var(--color-mandir-text-muted)]" />
                        <textarea
                          placeholder="Words of solidarity or prayer for the survivors (optional)..."
                          rows={2}
                          value={donorMessage}
                          onChange={(e) => setDonorMessage(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)] text-[var(--color-mandir-text)] outline-none focus:border-red-500 transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {/* Toggles: Anonymous & Community Opt-in */}
                    <div className="space-y-2 pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--color-mandir-text-muted)]">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                        />
                        <span>Make my donation anonymous (hide name on public donor roll)</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--color-mandir-text)]">
                        <input
                          type="checkbox"
                          checked={joinCommunity}
                          onChange={(e) => setJoinCommunity(e.target.checked)}
                          className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                        />
                        <span>
                          <strong>Join the Relief Community:</strong> Send me on-ground rescue photos & notify me of future humanitarian relief efforts.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || finalAmount < 10}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Initiating Secure Payment...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 fill-white" />
                        <span>Donate ₹{finalAmount.toLocaleString("en-IN")}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  {/* Trust Footer */}
                  <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--color-mandir-text-muted)] pt-1">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Encrypted
                    </span>
                    <span>•</span>
                    <span>UPI, Cards, NetBanking</span>
                    <span>•</span>
                    <span>80G Eligible</span>
                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Field Photography & Ground Devastation Gallery */}
      <section className="py-16 bg-[var(--color-mandir-card)] border-y border-[var(--color-mandir-border)]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                On-Ground Photographic Evidence
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-heading)] mt-1">
                Dispatches from Timure & Syabrubesi
              </h2>
              <p className="text-sm text-[var(--color-mandir-text-muted)] mt-1">
                Verified images of flood damage, stranded families, and active relief camp operations.
              </p>
            </div>
            <div className="text-xs text-[var(--color-mandir-text-muted)]">
              Click any photo for expanded on-ground details
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {GALLERY_IMAGES.map((photo, index) => (
              <motion.div
                key={photo.src}
                whileHover={{ y: -4 }}
                onClick={() => setActivePhotoIndex(index)}
                className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer border border-[var(--color-mandir-border)] bg-[var(--color-mandir-bg)]"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <p className="text-[11px] font-bold line-clamp-1">{photo.title}</p>
                  <p className="text-[9px] text-amber-300 line-clamp-1">{photo.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative & Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          
          <div className="text-center space-y-4">
            <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">
              The Reality on the Ground
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-heading)]">
              Why Your Immediate Support Cannot Wait
            </h2>
          </div>

          <div className="prose dark:prose-invert max-w-none text-base sm:text-lg text-[var(--color-mandir-text-muted)] leading-relaxed space-y-6">
            <p>
              When catastrophic flash floods tore through the Trishuli and Bhotekoshi river systems in northern Nepal, mountain slopes collapsed and entire settlements washed away in minutes. Thousands of families across Rasuwa, Nuwakot, and cut-off border villages were left stranded in the bitter cold without food, potable water, or medical supplies.
            </p>
            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-rose-500/10 border-l-4 border-red-600 italic text-[var(--color-mandir-text)]">
              "What began as our daily commitment to feeding the hungry and serving humanity has extended, in this moment of crisis, to the families of Nepal who need us most urgently. Disaster relief cannot wait for tomorrow — your support today can be the reason a child or mother in Nepal eats tonight."
            </div>
            <p>
              Working on the ground alongside our partner organizations — <strong>Dreamer Trust</strong>, <strong>Uday Foundation Mumbai</strong>, and <strong>KindKarma</strong> — our teams in Timure and Syabrubesi are delivering hot cooked meals, purified drinking water, baby nutrition, and emergency tarpaulins to families sheltering in temporary high-altitude relief camps.
            </p>
          </div>

          {/* 3 Key Pillars of Relief */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 rounded-2xl bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] space-y-3">
              <div className="text-3xl">🍲</div>
              <h3 className="font-bold text-lg text-[var(--color-mandir-text)]">Emergency Food & Water</h3>
              <p className="text-xs text-[var(--color-mandir-text-muted)] leading-relaxed">
                Operating high-capacity field community kitchens in Timure serving over 2,000 warm, nutritious meals every single day along with clean bottled water.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] space-y-3">
              <div className="text-3xl">⛺</div>
              <h3 className="font-bold text-lg text-[var(--color-mandir-text)]">Shelter & Cold Protection</h3>
              <p className="text-xs text-[var(--color-mandir-text-muted)] leading-relaxed">
                Distributing heavy-duty waterproof tarpaulins, thermal fleece blankets, and warm jackets to protect infants and the elderly from hypothermia.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--color-mandir-card)] border border-[var(--color-mandir-border)] space-y-3">
              <div className="text-3xl">🩺</div>
              <h3 className="font-bold text-lg text-[var(--color-mandir-text)]">Medical Aid & First Aid</h3>
              <p className="text-xs text-[var(--color-mandir-text-muted)] leading-relaxed">
                Field medics treating wound infections, distributing chlorine water purification tablets, anti-diarrheal medicine, and basic emergency healthcare.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-[var(--color-mandir-card)] border-t border-[var(--color-mandir-border)]">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-heading)]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[var(--color-mandir-text-muted)] mt-1">
              Transparency, delivery timelines, and tax exemption details
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Do I need to sign up or create an account to donate?",
                a: "No account creation is required to donate. Simply enter your basic contact details for the official tax receipt, or optionally sign in if you wish to save your profile and follow on-ground relief updates."
              },
              {
                q: "How will my donation reach the victims in Nepal?",
                a: "Our relief coalition (along with Dreamer Trust, Uday Foundation Mumbai, and KindKarma) has established active physical distribution bases in Timure and Syabrubesi. Funds are immediately deployed for bulk purchases of grain, cooking fuel, blankets, and medical kits in Kathmandu and dispatched directly to the mountain relief camps."
              },
              {
                q: "What payment methods are supported?",
                a: "We support all major Indian payment methods through Cashfree PG: UPI (Google Pay, PhonePe, Paytm, BHIM), all Debit & Credit Cards, and NetBanking across 50+ banks."
              },
              {
                q: "Will I get a receipt for my donation?",
                a: "Yes! An instant payment receipt is generated upon successful payment. If you provided your phone or email, a copy will also be delivered to you via WhatsApp / email with an eligible 80G tax deduction acknowledgment."
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)] space-y-2"
              >
                <h3 className="font-bold text-sm text-[var(--color-mandir-text)] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  {item.q}
                </h3>
                <p className="text-xs text-[var(--color-mandir-text-muted)] leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Photo Gallery */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl w-full flex flex-col items-center">
              {/* Close Button */}
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full bg-white/10 backdrop-blur-sm cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Lightbox Image */}
              <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
                <img
                  src={GALLERY_IMAGES[activePhotoIndex].src}
                  alt={GALLERY_IMAGES[activePhotoIndex].title}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />

                {/* Left & Right Nav */}
                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev! > 0 ? prev! - 1 : GALLERY_IMAGES.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 p-2.5 rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev! < GALLERY_IMAGES.length - 1 ? prev! + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 p-2.5 rounded-full transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Caption & Location */}
              <div className="mt-4 text-center text-white space-y-1 max-w-xl">
                <div className="text-xs font-semibold text-amber-400">
                  {GALLERY_IMAGES[activePhotoIndex].location} ({activePhotoIndex + 1} of {GALLERY_IMAGES.length})
                </div>
                <h4 className="text-base font-bold">{GALLERY_IMAGES[activePhotoIndex].title}</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {GALLERY_IMAGES[activePhotoIndex].caption}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
