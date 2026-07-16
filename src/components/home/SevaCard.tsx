"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface SevaCardProps {
  category: string
  title: string
  subtitle: string
  imageUrl?: string
  impactStatement: string
  donorsCount?: number
  index?: number
  variant?: "compact" | "full"
}

export function SevaCard({
  category,
  title,
  subtitle,
  imageUrl,
  impactStatement,
  donorsCount = 0,
  index = 0,
  variant = "full",
}: SevaCardProps) {
  const isCompact = variant === "compact"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 200 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link href={`/donate/${category}`} className="block h-full group">
        <div
          className={`
            relative h-full rounded-2xl overflow-hidden border border-[var(--color-mandir-border)]
            bg-[var(--color-mandir-card)] 
            hover:border-[var(--color-saffron-500)]/60 
            hover:shadow-[0_8px_40px_rgba(249,115,22,0.18)]
            transition-all duration-300 cursor-pointer
            ${isCompact ? "p-4" : "p-5"}
          `}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-saffron-500)]/0 via-transparent to-[var(--color-temple-gold)]/0 group-hover:from-[var(--color-saffron-500)]/5 group-hover:to-[var(--color-temple-gold)]/5 transition-all duration-500 pointer-events-none rounded-2xl" />

          {/* Image */}
          <div
            className={`
              relative w-full overflow-hidden rounded-t-2xl -mx-5 -mt-5 mb-4 bg-[var(--color-mandir-bg)]
              ${isCompact ? "h-24" : "h-32"}
            `}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--color-saffron-50)] to-[var(--color-temple-gold-light)]/30 dark:from-[var(--color-saffron-500)]/10 dark:to-[var(--color-temple-gold)]/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-[var(--color-saffron-300)]" />
              </div>
            )}
            
            {/* Gradient overlay for text readability if needed later */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Title */}
          <h3
            className={`
              font-bold font-[var(--font-heading)] leading-tight 
              group-hover:text-[var(--color-saffron-500)] transition-colors
              ${isCompact ? "text-sm mb-0.5" : "text-base mb-1"}
            `}
          >
            {title}
          </h3>

          {!isCompact && (
            <p className="text-xs text-[var(--color-mandir-text-muted)] mb-3 line-clamp-1">
              {subtitle}
            </p>
          )}

          {/* Impact */}
          {!isCompact && (
            <p className="text-[11px] text-[var(--color-auspicious-green)] font-medium leading-snug line-clamp-2 mb-3">
              {impactStatement}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-2">
            {donorsCount > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-[var(--color-mandir-text-muted)]">
                <Heart className="w-3 h-3 text-[var(--color-sacred-red)] fill-[var(--color-sacred-red)]" />
                <span>{donorsCount.toLocaleString("en-IN")} donors</span>
              </div>
            )}
            <span
              className={`
                ml-auto text-[10px] font-bold uppercase tracking-wider 
                text-[var(--color-saffron-500)] group-hover:text-[var(--color-saffron-600)]
                transition-colors
              `}
            >
              दान करें →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
