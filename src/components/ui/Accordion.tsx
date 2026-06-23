"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export interface AccordionProps {
  items: {
    id: string
    title: string | React.ReactNode
    content: React.ReactNode
  }[]
  className?: string
  allowMultiple?: boolean
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      if (!allowMultiple) {
        newOpenItems.clear()
      }
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id)
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] transition-colors"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between p-4 text-left font-medium transition-colors hover:bg-[var(--color-mandir-card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-saffron-500)]"
            >
              <span className="text-[var(--color-mandir-text)]">{item.title}</span>
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 shrink-0 text-[var(--color-mandir-text-muted)]"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="border-t border-[var(--color-mandir-border)] p-4 text-[var(--color-mandir-text-muted)]">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
