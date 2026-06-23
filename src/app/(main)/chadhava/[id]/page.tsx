"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  MapPin, 
  CheckCircle2, 
  Flower2, 
  ShieldCheck,
  Video,
  Truck
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { StatusTimeline } from "@/components/ui/StatusTimeline"
import Link from "next/link"

export default function ChadhavaDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [item, setItem] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data, error } = await supabase
          .from('chadhava_items')
          .select(`
            *,
            temples (*)
          `)
          .eq('id', id)
          .single()
        
        if (error) throw error
        setItem(data)
      } catch (error) {
        console.error("Error fetching chadhava details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchItem()
    }
  }, [id, supabase])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
        <Skeleton className="w-full h-64 md:h-96 rounded-3xl mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="w-1/3 h-6" />
            <Skeleton className="w-3/4 h-10" />
            <Skeleton className="w-full h-24" />
          </div>
          <Skeleton className="w-full h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Flower2 className="h-16 w-16 text-[var(--color-mandir-text-muted)] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[var(--color-mandir-text)] mb-4">Offering Not Found</h2>
        <p className="text-[var(--color-mandir-text-muted)] mb-8">The chadhava item you are looking for does not exist.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  const processSteps = [
    {
      title: "Select & Pay",
      description: "Choose your offering and complete payment securely.",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      title: "Offering Performed",
      description: "Your item is offered to the deity by temple priests.",
      icon: <Flower2 className="w-4 h-4" />,
    },
    {
      title: "Video Proof",
      description: "A short video of the offering is shared with you.",
      icon: <Video className="w-4 h-4" />,
    },
    {
      title: "Blessings Received",
      description: "Receive the divine blessings directly in your heart.",
      icon: <ShieldCheck className="w-4 h-4" />,
    }
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-5xl pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Column - Image */}
        <div className="order-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-64 sm:h-96 lg:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-mandir-border)] lg:sticky lg:top-24"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={item.image_url || "https://images.unsplash.com/photo-1598007412759-994df554ce81?q=80&w=1200&auto=format&fit=crop"} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white shadow-lg border border-white/20">
                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                {item.temples?.name}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Details */}
        <div className="order-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[var(--color-saffron-500)]/10 text-[var(--color-saffron-500)] border border-[var(--color-saffron-500)]/20 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase">
                Sacred Offering
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-4 leading-tight">
              {item.title}
            </h1>
            <p className="text-[var(--color-mandir-text-muted)] text-base sm:text-lg leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="bg-[var(--color-mandir-surface)] rounded-2xl p-6 border border-[var(--color-mandir-border)] shadow-lg">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-[var(--color-mandir-text)] tracking-tight">₹{item.price}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 rounded-full bg-[var(--color-auspicious-green)]/10 flex items-center justify-center mr-3 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-auspicious-green)]" />
                </div>
                <span className="text-[var(--color-mandir-text)]">Guaranteed offering at the temple</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 rounded-full bg-[var(--color-auspicious-green)]/10 flex items-center justify-center mr-3 shrink-0">
                  <Video className="w-4 h-4 text-[var(--color-auspicious-green)]" />
                </div>
                <span className="text-[var(--color-mandir-text)]">Video proof shared via WhatsApp</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-8 h-8 rounded-full bg-[var(--color-auspicious-green)]/10 flex items-center justify-center mr-3 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-auspicious-green)]" />
                </div>
                <span className="text-[var(--color-mandir-text)]">100% Authentic & Verified</span>
              </div>
            </div>

            <Link href={`/chadhava/${item.id}/book`} className="block w-full hidden lg:block">
              <Button variant="gradient" className="w-full py-6 text-lg rounded-xl shadow-lg hover:shadow-[var(--color-saffron-500)]/30 transition-all">
                Offer Now
              </Button>
            </Link>
          </div>

          <div className="bg-[var(--color-mandir-surface)] rounded-2xl p-6 border border-[var(--color-mandir-border)]">
            <h3 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-6">
              How it works
            </h3>
            <div className="flex flex-col gap-4">
              {processSteps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-saffron-500)]/10 text-[var(--color-saffron-500)] flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--color-mandir-text)]">{step.title}</div>
                    <div className="text-sm text-[var(--color-mandir-text-muted)]">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[var(--color-mandir-surface)] to-[var(--color-mandir-surface)]/50 rounded-2xl p-6 border border-[var(--color-mandir-border)]">
            <h3 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-4">
              About {item.temples?.name}
            </h3>
            <p className="text-sm text-[var(--color-mandir-text-muted)] line-clamp-3 mb-4">
              {item.temples?.description}
            </p>
            <Link href={`/temples/${item.temples?.id}`} className="text-[var(--color-saffron-400)] text-sm font-medium hover:underline">
              Read more about the temple
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Booking Footer */}
      <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 p-4 bg-[var(--color-mandir-bg)]/90 backdrop-blur-md border-t border-[var(--color-mandir-border)] lg:hidden flex items-center justify-between z-40 pb-safe">
        <div>
          <div className="text-xs text-[var(--color-mandir-text-muted)] font-medium">Total Amount</div>
          <div className="text-xl font-bold text-[var(--color-mandir-text)]">₹{item.price}</div>
        </div>
        <Link href={`/chadhava/${item.id}/book`}>
          <Button variant="gradient" className="rounded-full px-8 shadow-lg">
            Offer Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
