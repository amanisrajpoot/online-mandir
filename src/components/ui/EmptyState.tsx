"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./Button"

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-mandir-surface)] border border-[var(--color-mandir-border)]"
      >
        <Icon className="h-10 w-10 text-[var(--color-saffron-400)] opacity-80" />
      </motion.div>
      
      <motion.h3 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-2 text-xl font-semibold font-[var(--font-heading)] text-[var(--color-mandir-text)]"
      >
        {title}
      </motion.h3>
      
      {description && (
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 max-w-sm text-sm text-[var(--color-mandir-text-muted)]"
        >
          {description}
        </motion.p>
      )}
      
      {actionLabel && onAction && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={onAction} variant="outline" className="mt-2">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
