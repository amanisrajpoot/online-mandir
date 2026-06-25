"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()

  // Don't show footer on auth pages, admin pages, or mobile (due to bottom nav)
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/verify') || 
    pathname.startsWith('/profile-setup') ||
    pathname.startsWith('/admin')
  ) {
    return null
  }

  return (
    <footer className="hidden md:block w-full border-t border-[var(--color-mandir-border)] bg-[var(--color-mandir-bg)] py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-temple-gold)] to-[var(--color-saffron-500)] text-white shadow-md">
                <span className="font-bold text-sm">ॐ</span>
              </div>
              <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)]">
                Vandanam
              </span>
            </Link>
            <p className="text-sm text-[var(--color-mandir-text-muted)] max-w-xs">
              Connecting devotees with ancient temples through digital pujas, authentic chadhava, and spiritual content.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-[var(--color-mandir-text)] mb-4 font-[var(--font-heading)]">Services</h4>
            <ul className="space-y-2 text-sm text-[var(--color-mandir-text-muted)]">
              <li><Link href="/about" className="hover:text-[var(--color-saffron-400)] transition-colors">About Us</Link></li>
              <li><Link href="/pujas" className="hover:text-[var(--color-saffron-400)] transition-colors">Book a Puja</Link></li>
              <li><Link href="/chadhava" className="hover:text-[var(--color-saffron-400)] transition-colors">Offer Chadhava</Link></li>
              <li><Link href="/temples" className="hover:text-[var(--color-saffron-400)] transition-colors">Temple Directory</Link></li>
              <li><Link href="/astrology" className="hover:text-[var(--color-saffron-400)] transition-colors">Astrology (Coming Soon)</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-[var(--color-mandir-text)] mb-4 font-[var(--font-heading)]">Support</h4>
            <ul className="space-y-2 text-sm text-[var(--color-mandir-text-muted)]">
              <li><Link href="/profile?tab=orders" className="hover:text-[var(--color-saffron-400)] transition-colors">Track Order</Link></li>
              <li><Link href="/faqs" className="hover:text-[var(--color-saffron-400)] transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--color-saffron-400)] transition-colors">Contact Us</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-[var(--color-saffron-400)] transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-[var(--color-mandir-text)] mb-4 font-[var(--font-heading)]">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--color-mandir-text-muted)]">
              <li><Link href="/terms" className="hover:text-[var(--color-saffron-400)] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--color-saffron-400)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[var(--color-saffron-400)] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-[var(--color-mandir-border)] pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-[var(--color-mandir-text-muted)]">
            &copy; {new Date().getFullYear()} Vandanam (a brand under Aradhya). All rights reserved.
          </p>
          <div className="text-xs text-[var(--color-mandir-text-muted)] mt-4 md:mt-0">
            Designed for Spiritual Fulfillment
          </div>
        </div>
      </div>
    </footer>
  )
}
