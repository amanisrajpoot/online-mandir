"use client"

import * as React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { LayoutDashboard, Image as ImageIcon, Calendar, Target, Plus, MoveVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export default function LayoutPreviewPage() {
  const supabase = createClient()
  const [loading, setLoading] = React.useState(true)
  
  const [heroBanners, setHeroBanners] = React.useState<any[]>([])
  const [countdowns, setCountdowns] = React.useState<any[]>([])
  const [promos, setPromos] = React.useState<any[]>([])

  React.useEffect(() => {
    fetchLayoutData()
  }, [])

  const fetchLayoutData = async () => {
    setLoading(true)
    try {
      const [bannersRes, countdownsRes, promosRes] = await Promise.all([
        supabase.from('hero_banners').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('festival_countdown').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('promo_banners').select('*').eq('is_active', true).order('sort_order', { ascending: true })
      ])

      setHeroBanners(bannersRes.data || [])
      setCountdowns(countdownsRes.data || [])
      setPromos(promosRes.data || [])
    } catch (error) {
      console.error("Error fetching layout data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Helpers to get items by position
  const getItemsForSlot = (position: string) => {
    const items = [
      ...countdowns.filter(c => c.position === position).map(c => ({ ...c, _type: 'countdown' })),
      ...promos.filter(p => p.position === position).map(p => ({ ...p, _type: 'promo' }))
    ]
    // They will be rendered in source order by the components, or you could sort them if needed.
    return items
  }

  // UI Component for rendering a slot's contents
  const SlotContent = ({ position, title }: { position: string, title: string }) => {
    const items = getItemsForSlot(position)

    return (
      <div className="relative py-4 my-2 border-2 border-dashed border-[var(--color-saffron-500)]/30 rounded-xl bg-[var(--color-saffron-500)]/5">
        <div className="absolute -top-3 left-6 bg-[var(--color-mandir-bg)] px-2 text-xs font-semibold text-[var(--color-saffron-500)] uppercase tracking-wider flex items-center">
          <MoveVertical className="w-3 h-3 mr-1" /> Dynamic Slot: {title}
        </div>
        
        {items.length === 0 ? (
          <div className="px-6 py-4 text-center text-sm text-[var(--color-mandir-text-muted)] italic">
            Empty Slot (No active promos or countdowns)
          </div>
        ) : (
          <div className="px-6 py-4 space-y-3">
            {items.map((item, idx) => (
              <div key={`${item._type}-${item.id}`} className="flex items-center gap-4 p-3 bg-[var(--color-mandir-surface)] border border-[var(--color-mandir-border)] rounded-lg shadow-sm">
                <div className="w-16 h-12 shrink-0 bg-black/10 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate text-[var(--color-mandir-text)]">
                      {item.title || item.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 h-4">
                      {item.display_style}
                    </Badge>
                  </div>
                  <div className="text-xs text-[var(--color-mandir-text-muted)] mt-1 flex items-center gap-2">
                    {item._type === 'countdown' ? (
                      <><Calendar className="w-3 h-3 text-blue-500" /> Countdown</>
                    ) : (
                      <><Target className="w-3 h-3 text-green-500" /> Promo Banner</>
                    )}
                  </div>
                </div>
                <Link 
                  href={item._type === 'countdown' ? '/admin/countdowns' : '/admin/promos'} 
                  className="px-3 py-1 text-xs font-medium bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)] rounded hover:border-[var(--color-saffron-400)] transition-colors text-[var(--color-mandir-text)]"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // UI Component for rendering a fixed hardcoded section
  const FixedSection = ({ title, icon: Icon, height = "h-24" }: { title: string, icon: any, height?: string }) => (
    <div className={`w-full ${height} bg-[var(--color-mandir-surface)] border border-[var(--color-mandir-border)] rounded-xl flex items-center justify-center text-[var(--color-mandir-text-muted)] shadow-sm relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />
      <div className="flex items-center gap-2 z-10">
        <Icon className="w-5 h-5 text-[var(--color-saffron-400)]" />
        <span className="font-bold font-[var(--font-heading)] text-lg">{title}</span>
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
        <Badge variant="secondary" className="bg-gray-500/10 text-gray-500 text-[10px] uppercase">Fixed Core Section</Badge>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center text-[var(--color-mandir-text-muted)]">
        Loading Layout Map...
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">Homepage Layout Builder</h1>
        <p className="text-[var(--color-mandir-text-muted)] mt-1">Visualize how your dynamic components stack on the homepage.</p>
      </div>

      <div className="bg-[var(--color-mandir-bg)] p-6 rounded-2xl border border-[var(--color-mandir-border)] space-y-6">
        
        {/* HEADER */}
        <div className="w-full h-14 bg-[var(--color-mandir-surface)] border-b border-[var(--color-mandir-border)] rounded-t-xl flex items-center px-6 sticky top-0 z-20 shadow-sm">
          <div className="font-bold text-[var(--color-saffron-500)] text-lg">Online Mandir Header</div>
        </div>

        {/* HERO SECTION */}
        <div className="relative">
          <FixedSection title={`Hero Carousel (${heroBanners.length} Slides)`} icon={ImageIcon} height="h-32" />
          <Link href="/admin/banners" className="absolute bottom-2 right-2 px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur border border-white/20 rounded hover:bg-white/20 transition-colors">
            Manage
          </Link>
        </div>

        {/* DYNAMIC SLOT: AFTER HERO */}
        <SlotContent position="after_hero" title="After Hero" />

        {/* ORDERS & TEMPLES */}
        <FixedSection title="Current Orders & Temples Carousel" icon={LayoutDashboard} />

        {/* DYNAMIC SLOT: AFTER TEMPLES */}
        <SlotContent position="after_temples" title="After Temples" />

        {/* PUJAS */}
        <FixedSection title="Trending Pujas" icon={LayoutDashboard} />

        {/* DYNAMIC SLOT: AFTER PUJAS */}
        <SlotContent position="after_pujas" title="After Pujas" />

        {/* BOTTOM SECTIONS */}
        <FixedSection title="Chadhava Quick Select & Panchang" icon={LayoutDashboard} />



        {/* FOOTER */}
        <div className="w-full h-24 bg-[var(--color-mandir-surface)] border-t border-[var(--color-mandir-border)] rounded-b-xl flex items-center justify-center text-[var(--color-mandir-text-muted)] opacity-70">
          Footer
        </div>

      </div>
    </div>
  )
}
