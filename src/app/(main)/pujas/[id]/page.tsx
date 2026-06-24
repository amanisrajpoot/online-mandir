"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  Package, 
  ShieldCheck,
  ChevronDown,
  Share2,
  Phone,
  Sparkles
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Accordion } from "@/components/ui/Accordion"
import { Skeleton } from "@/components/ui/Skeleton"
import Link from "next/link"
import { StatusTimeline } from "@/components/ui/StatusTimeline"
import { encodeId, decodeId } from "@/lib/utils"

export default function PujaDetailPage() {
  const params = useParams()
  const id = decodeId(params.id as string)
  
  const [puja, setPuja] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchPuja = async () => {
      try {
        const { data, error } = await supabase
          .from('pujas')
          .select(`
            *,
            temples (*)
          `)
          .eq('id', id)
          .single()
        
        if (error) throw error
        setPuja(data)
      } catch (error) {
        console.error("Error fetching puja details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPuja()
    }
  }, [id, supabase])

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <Skeleton className="w-full h-64 md:h-96 rounded-2xl mb-8" />
        <Skeleton className="w-32 h-6 mb-4" />
        <Skeleton className="w-3/4 h-10 mb-4" />
        <Skeleton className="w-full h-24 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-64" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-64 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!puja) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-mandir-text)] mb-4">Puja Not Found</h2>
        <p className="text-[var(--color-mandir-text-muted)] mb-8">The puja you are looking for does not exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  const processSteps = [
    {
      title: "Booking Received",
      description: "Your order is confirmed and sent to the temple.",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      title: "Sankalp Taken",
      description: "Panditji takes Sankalp with your Name & Gotra.",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      title: "Puja Performed",
      description: "Rituals are completed as per Vedic traditions.",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      title: "Video Uploaded",
      description: "Personalized video proof is shared with you.",
      icon: <PlayCircle className="w-4 h-4" />,
    },
    {
      title: "Prasad Dispatched",
      description: "Blessed prasad is packed and shipped via courier.",
      icon: <Package className="w-4 h-4" />,
    }
  ]

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={puja.image_url || "/images/puja_ganesh.png"} 
          alt={puja.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-mandir-bg)] via-[var(--color-mandir-bg)]/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 max-w-6xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-black/50 backdrop-blur-md border-white/10 text-white">
            {puja.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold font-[var(--font-heading)] text-white mb-2 leading-tight">
            {puja.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90">
            <span className="flex items-center">
              <MapPin className="mr-1.5 h-4 w-4 text-[var(--color-saffron-400)]" />
              {puja.temples?.name}, {puja.temples?.location}
            </span>
            <span className="flex items-center">
              <Calendar className="mr-1.5 h-4 w-4 text-[var(--color-saffron-400)]" />
              Book by {new Date(puja.booking_deadline).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Problem Statement Box (FOMO/Relatable) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[var(--color-sacred-red)]/10 to-[var(--color-saffron-500)]/10 border border-[var(--color-saffron-500)]/20 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-mandir-text)] mb-2 relative z-10">
                Is this Puja for you?
              </h3>
              <p className="text-[var(--color-mandir-text-muted)] italic relative z-10">
                &quot;{puja.problem_statement}&quot;
              </p>
            </motion.div>

            {/* What's Included */}
            <section>
              <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-6 flex items-center">
                <Sparkles className="w-5 h-5 text-[var(--color-saffron-500)] mr-2" />
                What&apos;s Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {puja.whats_included?.map((item: string, index: number) => (
                  <div key={index} className="flex items-start bg-[var(--color-mandir-surface)] p-4 rounded-xl border border-[var(--color-mandir-border)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-auspicious-green)] mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-[var(--color-mandir-text)]">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Puja Benefits */}
            <section>
              <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-6">
                Benefits
              </h2>
              <ul className="space-y-3">
                {puja.benefits?.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-saffron-500)] mr-3 mt-2 shrink-0" />
                    <span className="text-[var(--color-mandir-text-muted)]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* How it works (Timeline) */}
            <section>
              <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-6">
                How it works
              </h2>
              <div className="bg-[var(--color-mandir-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--color-mandir-border)]">
                <div className="flex flex-col gap-6">
                  {processSteps.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-saffron-500)]/10 text-[var(--color-saffron-500)] flex items-center justify-center shrink-0 border border-[var(--color-saffron-500)]/20">
                        {step.icon}
                      </div>
                      <div className="pt-2">
                        <div className="font-bold text-lg text-[var(--color-mandir-text)] leading-tight">{step.title}</div>
                        <div className="text-[var(--color-mandir-text-muted)] mt-1">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Temple Details */}
            <section>
              <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-6">
                About the Temple
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 bg-[var(--color-mandir-surface)] rounded-2xl p-4 sm:p-6 border border-[var(--color-mandir-border)]">
                <div className="w-full sm:w-1/3 h-40 sm:h-auto rounded-xl overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={puja.temples?.image_url} 
                    alt={puja.temples?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-2">
                    {puja.temples?.name}
                  </h3>
                  <div className="flex items-center text-sm font-medium text-[var(--color-saffron-500)] mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {puja.temples?.location}
                  </div>
                  <p className="text-sm text-[var(--color-mandir-text-muted)] line-clamp-4">
                    {puja.temples?.description}
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Accordion */}
            <section>
              <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-6">
                Frequently Asked Questions
              </h2>
              <Accordion 
                items={[
                  {
                    id: "faq-1",
                    title: "Will I be able to see the puja live?",
                    content: "We do not provide live streaming due to temple guidelines. However, a personalized video of the Sankalp being taken in your name by the head priest will be shared with you within 24 hours of completion."
                  },
                  {
                    id: "faq-2",
                    title: "How long does it take to receive Prasad?",
                    content: "Prasad is dispatched within 2-3 days of puja completion. It usually takes 5-7 working days to reach anywhere in India via standard courier."
                  },
                  {
                    id: "faq-3",
                    title: "What details are needed for Sankalp?",
                    content: "We need your Full Name, Gotra (optional), and the names of up to 3 family members you want to include in the prayer. You can provide these details during the checkout process."
                  }
                ]}
              />
            </section>
            
          </div>

          {/* Booking Card - Right Column (Sticky on Desktop) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[var(--color-mandir-surface)] rounded-2xl border border-[var(--color-mandir-border)] shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-500)] p-4 text-center">
                <span className="text-white font-bold tracking-wide uppercase text-sm">Divine Blessings Package</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-[var(--color-mandir-text)]">₹{puja.sale_price}</span>
                  <span className="text-lg text-[var(--color-mandir-text-muted)] line-through">₹{puja.base_price}</span>
                  <Badge variant="success" className="ml-auto">
                    {Math.round(((puja.base_price - puja.sale_price) / puja.base_price) * 100)}% OFF
                  </Badge>
                </div>
                
                <p className="text-xs text-[var(--color-mandir-text-muted)] mb-6 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Prices include taxes and standard shipping
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-auspicious-green)] mr-2 shrink-0" />
                    Personalized Video Sankalp
                  </div>
                  <div className="flex items-center text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-auspicious-green)] mr-2 shrink-0" />
                    Authentic Temple Prasad
                  </div>
                  <div className="flex items-center text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-auspicious-green)] mr-2 shrink-0" />
                    Dedicated Support
                  </div>
                </div>

                <Link href={`/pujas/${encodeId(puja.id)}/book`} className="block w-full">
                  <Button variant="gradient" className="w-full py-6 text-lg rounded-xl shadow-lg hover:shadow-[var(--color-saffron-500)]/30 transition-all">
                    Book Puja Now
                  </Button>
                </Link>
                
                <p className="text-center text-xs text-[var(--color-mandir-text-muted)] mt-4">
                  Secure payments via Razorpay
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Mobile Sticky Booking Footer */}
      <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 p-4 bg-[var(--color-mandir-bg)]/90 backdrop-blur-md border-t border-[var(--color-mandir-border)] lg:hidden flex items-center justify-between z-40 pb-safe">
        <div>
          <div className="text-sm text-[var(--color-mandir-text-muted)] line-through">₹{puja.base_price}</div>
          <div className="text-xl font-bold text-[var(--color-mandir-text)]">₹{puja.sale_price}</div>
        </div>
        <Link href={`/pujas/${encodeId(puja.id)}/book`}>
          <Button variant="gradient" className="rounded-full px-8 shadow-lg">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
