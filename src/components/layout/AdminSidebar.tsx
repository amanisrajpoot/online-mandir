"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  MapPin, 
  Sparkles, 
  Flower2, 
  ShoppingCart, 
  Image as ImageIcon,
  Calendar,
  Tag,
  LogOut
} from "lucide-react"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const ADMIN_NAV_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Temples", href: "/admin/temples", icon: MapPin },
  { name: "Pujas", href: "/admin/pujas", icon: Sparkles },
  { name: "Chadhava", href: "/admin/chadhava", icon: Flower2 },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
  { name: "Panchang", href: "/admin/panchang", icon: Calendar },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Only show on admin pages
  if (!pathname.startsWith('/admin')) {
    return null
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] transition-transform sm:translate-x-0 hidden sm:block">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        <Link href="/admin/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[var(--color-temple-gold)] to-[var(--color-saffron-500)] text-white shadow-md">
            <span className="font-bold text-sm">ॐ</span>
          </div>
          <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)]">
            Vandanam Admin
          </span>
        </Link>
        
        <ul className="space-y-2 font-medium">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-lg p-2 transition-colors",
                    isActive 
                      ? "bg-[var(--color-saffron-500)] text-white" 
                      : "text-[var(--color-mandir-text-muted)] hover:bg-[var(--color-mandir-card-hover)] hover:text-[var(--color-mandir-text)]"
                  )}
                >
                  <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-[var(--color-mandir-text-muted)] group-hover:text-[var(--color-saffron-400)]")} />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        
        <div className="mt-auto pt-4 border-t border-[var(--color-mandir-border)]">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center rounded-lg p-2 text-[var(--color-mandir-text-muted)] transition-colors hover:bg-[var(--color-sacred-red)]/10 hover:text-[var(--color-sacred-red)]"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
