import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Calendar, Sparkles } from "lucide-react"
import { encodeId } from "@/lib/utils"

export const metadata = {
  title: 'Hindu Festivals & Celebrations | Vandanam',
  description: 'Explore upcoming Hindu festivals, book special festive pujas, and make auspicious chadhavas on Vandanam.',
}

export default async function FestivalsPage() {
  const supabase = await createClient()

  const { data: festivals, error } = await supabase
    .from('festival_countdown')
    .select('*')
    .eq('is_active', true)
    .order('target_date', { ascending: true })

  if (error) {
    console.error("Error fetching festivals:", error)
  }

  const upcomingFestivals = festivals?.filter(f => new Date(f.target_date) > new Date()) || []

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)] mb-4">
          Festivals & Celebrations
        </h1>
        <p className="text-[var(--color-mandir-text-muted)] text-lg max-w-2xl">
          Discover upcoming Hindu festivals and immerse yourself in the divine celebrations. Book special pujas or make auspicious offerings.
        </p>
      </div>

      {upcomingFestivals.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-mandir-surface)] rounded-2xl border border-[var(--color-mandir-border)]">
          <Calendar className="w-12 h-12 text-[var(--color-mandir-text-muted)] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[var(--color-mandir-text)]">No Upcoming Festivals</h3>
          <p className="text-[var(--color-mandir-text-muted)] mt-2">Check back later for new festive updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {upcomingFestivals.map((festival) => (
            <Link key={festival.id} href={`/festivals/${encodeId(festival.id)}`} className="block group">
              <div className="relative overflow-hidden rounded-2xl border border-[var(--color-saffron-500)]/30 bg-gradient-to-br from-[var(--color-mandir-surface)] to-[var(--color-saffron-100)] shadow-md transition-all hover:-translate-y-1 hover:shadow-xl group-hover:border-[var(--color-saffron-400)]">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                    <Image
                      src={festival.image_url || '/images/hero_banner_panchang.png'}
                      alt={festival.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[var(--color-mandir-surface)] to-transparent md:from-transparent md:to-[var(--color-mandir-surface)]" />
                  </div>
                  
                  <div className="p-6 md:p-8 relative z-10 w-full md:w-3/5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-[var(--color-saffron-500)]" />
                      <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)]">
                        {festival.name}
                      </h2>
                    </div>
                    
                    <div className="flex items-center text-sm font-medium text-[var(--color-saffron-500)] mb-4">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(festival.target_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    
                    <p className="text-[var(--color-mandir-text-muted)] mb-6 line-clamp-3">
                      {festival.description}
                    </p>
                    
                    <div className="mt-auto">
                      <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[var(--color-saffron-500)] text-white hover:bg-[var(--color-saffron-600)] h-10 px-4 py-2">
                        Explore Festival →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
