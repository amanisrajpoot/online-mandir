"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Bell, LogOut, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = React.useState<any>(null)
  const supabase = createClient()

  React.useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Don't show top nav on auth pages or admin pages
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/verify') || 
    pathname.startsWith('/profile-setup') ||
    pathname.startsWith('/admin')
  ) {
    return null
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-mandir-border)] bg-[var(--color-mandir-bg)]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-temple-gold)] to-[var(--color-saffron-500)] text-white shadow-md">
            <span className="font-bold text-sm">ॐ</span>
          </div>
          <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)]">
            Vandanam
          </span>
        </Link>

        {/* Desktop Navigation (Hidden on mobile where BottomNav is used) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={cn("text-sm font-medium transition-colors hover:text-[var(--color-saffron-400)]", pathname === '/' ? "text-[var(--color-saffron-400)]" : "text-[var(--color-mandir-text)]")}>
            Home
          </Link>
          <Link href="/pujas" className={cn("text-sm font-medium transition-colors hover:text-[var(--color-saffron-400)]", pathname.startsWith('/pujas') ? "text-[var(--color-saffron-400)]" : "text-[var(--color-mandir-text)]")}>
            Mandir Puja
          </Link>
          <Link href="/chadhava" className={cn("text-sm font-medium transition-colors hover:text-[var(--color-saffron-400)]", pathname.startsWith('/chadhava') ? "text-[var(--color-saffron-400)]" : "text-[var(--color-mandir-text)]")}>
            Chadhava
          </Link>
          <Link href="/content" className={cn("text-sm font-medium transition-colors hover:text-[var(--color-saffron-400)]", pathname.startsWith('/content') ? "text-[var(--color-saffron-400)]" : "text-[var(--color-mandir-text)]")}>
            Content
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 text-[var(--color-mandir-text-muted)] hover:bg-[var(--color-mandir-surface)] hover:text-[var(--color-saffron-400)] transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--color-sacred-red)] ring-2 ring-[var(--color-mandir-bg)]"></span>
          </button>
          
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full">
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="default" size="sm" className="rounded-full bg-gradient-to-r from-[var(--color-saffron-600)] to-[var(--color-saffron-400)] shadow-md hover:shadow-lg hover:scale-105 transition-all">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
