import * as React from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { PujaCard } from "@/components/pujas/PujaCard"
import { ChadhavaCard } from "@/components/chadhava/ChadhavaCard"
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { Calendar, Sparkles, Gift } from "lucide-react"

import { decodeId } from "@/lib/utils"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const supabase = await createClient()
  const resolvedParams = await params
  const festivalId = decodeId(resolvedParams.id)
  const { data: festival } = await supabase
    .from('festival_countdown')
    .select('name, description')
    .eq('id', festivalId)
    .single()

  if (!festival) return { title: 'Festival Not Found | Vandanam' }

  return {
    title: `${festival.name} | Special Pujas & Offerings | Vandanam`,
    description: festival.description,
  }
}

export default async function FestivalDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const supabase = await createClient()
  const resolvedParams = await params
  const festivalId = decodeId(resolvedParams.id)

  // 1. Fetch Festival
  const { data: festival, error: festivalError } = await supabase
    .from('festival_countdown')
    .select('*')
    .eq('id', festivalId)
    .single()

  if (festivalError || !festival) {
    console.error("Festival fetch error:", festivalError, "ID:", festivalId)
    notFound()
  }

  let pujas = []
  let chadhavas = []

  // 2. Safely Fetch Pujas (Failproof: Catch schema errors if festival_id is not added yet)
  try {
    const { data: relatedPujas, error: pujasError } = await supabase
      .from('pujas')
      .select('*, temples(name, location)')
      .eq('festival_id', festival.id)
      
    if (!pujasError && relatedPujas) {
      pujas = relatedPujas
    }
  } catch (err) {
    console.warn("Could not fetch pujas by festival_id. Schema might not be updated yet.")
  }

  // 3. Safely Fetch Chadhavas (Failproof: Catch schema errors if festival_id is not added yet)
  try {
    const { data: relatedChadhavas, error: chadhavasError } = await supabase
      .from('chadhava_items')
      .select('*, temples(name, location)')
      .eq('festival_id', festival.id)
      
    if (!chadhavasError && relatedChadhavas) {
      chadhavas = relatedChadhavas
    }
  } catch (err) {
    console.warn("Could not fetch chadhavas by festival_id. Schema might not be updated yet.")
  }

  const isPast = new Date(festival.target_date) < new Date()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center">
        <Image
          src={festival.image_url || '/images/hero_banner_panchang.png'}
          alt={festival.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[var(--color-mandir-bg)] via-black/40 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 shadow-lg">
            <Calendar className="w-4 h-4 text-[var(--color-temple-gold)]" />
            <span className="text-sm font-medium text-white tracking-wider uppercase">
              {new Date(festival.target_date).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[var(--font-heading)] drop-shadow-lg">
            {festival.name}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 drop-shadow">
            {festival.description}
          </p>

          {!isPast && (
            <div className="inline-block bg-[var(--color-mandir-bg)]/20 backdrop-blur-md border border-[var(--color-temple-gold)]/30 rounded-2xl p-6 shadow-xl">
              <div className="text-sm text-[var(--color-temple-gold)] uppercase tracking-widest font-semibold mb-3">
                Festivities Begin In
              </div>
              <CountdownTimer targetDate={festival.target_date} className="gap-4 text-white" />
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 container mx-auto px-4 max-w-6xl flex-grow">
        
        {/* Pujas Section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <Sparkles className="w-6 h-6 text-[var(--color-saffron-500)] mr-3" />
            <h2 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              Special Festive Pujas
            </h2>
          </div>
          
          {pujas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pujas.map((puja: any) => (
                <PujaCard key={puja.id} puja={puja} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--color-mandir-surface)] rounded-2xl border border-dashed border-[var(--color-mandir-border)]">
              <p className="text-[var(--color-mandir-text-muted)] italic">
                No special pujas are currently listed for this festival. Please check back closer to the date.
              </p>
            </div>
          )}
        </div>

        {/* Chadhava Section */}
        <div>
          <div className="flex items-center mb-8">
            <Gift className="w-6 h-6 text-[var(--color-saffron-500)] mr-3" />
            <h2 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              Auspicious Offerings (Chadhava)
            </h2>
          </div>
          
          {chadhavas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {chadhavas.map((chadhava: any) => (
                <ChadhavaCard key={chadhava.id} item={chadhava} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--color-mandir-surface)] rounded-2xl border border-dashed border-[var(--color-mandir-border)]">
              <p className="text-[var(--color-mandir-text-muted)] italic">
                No specific offerings are currently listed for this festival. You can still make general offerings at our temples.
              </p>
            </div>
          )}
        </div>

      </section>
    </div>
  )
}
