"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  MapPin, 
  Sparkles, 
  Flower2, 
  Image as ImageIcon, 
  ShoppingBag,
  Menu,
  X,
  Calendar,
  Target,
  Map
} from "lucide-react"

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Temples', href: '/admin/temples', icon: MapPin },
  { name: 'Pujas', href: '/admin/pujas', icon: Sparkles },
  { name: 'Chadhava', href: '/admin/chadhava', icon: Flower2 },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Countdowns', href: '/admin/countdowns', icon: Calendar },
  { name: 'Promos', href: '/admin/promos', icon: Target },
  { name: 'Layout', href: '/admin/layout-preview', icon: Map },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--color-mandir-bg)]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-mandir-surface)] border-r border-[var(--color-mandir-border)] transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-mandir-border)]">
          <Link href="/admin/dashboard" className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-saffron-500)] flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Admin Panel
          </Link>
          <button 
            className="lg:hidden text-[var(--color-mandir-text)] hover:text-[var(--color-saffron-500)]"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[var(--color-saffron-500)]/10 text-[var(--color-saffron-500)]' 
                    : 'text-[var(--color-mandir-text)] hover:bg-[var(--color-mandir-card-hover)] hover:text-[var(--color-saffron-400)]'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-[var(--color-saffron-500)]' : 'text-[var(--color-mandir-text-muted)]'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-[var(--color-mandir-border)]">
          <Link href="/" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[var(--color-mandir-surface)] border border-[var(--color-mandir-border)] rounded-lg hover:bg-[var(--color-mandir-card-hover)] transition-colors">
            Back to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden h-16 flex items-center px-4 border-b border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[var(--color-mandir-text)] hover:text-[var(--color-saffron-500)] p-2 -ml-2 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-2 text-lg font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
            Admin Panel
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
