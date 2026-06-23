"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className={cn(
                "w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] shadow-2xl pointer-events-auto",
                className
              )}
            >
              <div className="flex flex-col space-y-1.5 p-6 pb-4">
                <div className="flex items-center justify-between">
                  {title && (
                    <h2 className="text-xl font-semibold leading-none tracking-tight font-[var(--font-heading)]">
                      {title}
                    </h2>
                  )}
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 transition-colors hover:bg-[var(--color-mandir-card-hover)] focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                {description && (
                  <p className="text-sm text-[var(--color-mandir-text-muted)]">
                    {description}
                  </p>
                )}
              </div>
              <div className="p-6 pt-0">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
