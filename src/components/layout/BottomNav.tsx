"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, Flower2, PlaySquare, User } from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Mandir Puja",
    href: "/pujas",
    icon: Grid,
  },
  {
    name: "Chadhava",
    href: "/chadhava",
    icon: Flower2,
  },
  {
    name: "Content",
    href: "/content",
    icon: PlaySquare,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  // Don't show bottom nav on auth pages or admin pages
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/verify') || 
    pathname.startsWith('/profile-setup') ||
    pathname.startsWith('/admin')
  ) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)]/90 backdrop-blur-lg pb-safe">
      <nav className="flex h-16 w-full items-center justify-around px-2 sm:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = 
            pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))
            
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-16 h-full transition-colors",
                isActive 
                  ? "text-[var(--color-saffron-400)]" 
                  : "text-[var(--color-mandir-text-muted)] hover:text-[var(--color-mandir-text)]"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110")} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-saffron-400)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-saffron-500)]"></span>
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
