"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  position?: "bottom" | "right";
}

export function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  className,
  position = "bottom" 
}: DrawerProps) {
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

  const variants = {
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" }
    },
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" }
    }
  };

  const positioningClasses = {
    bottom: "inset-x-0 bottom-0 mt-24 rounded-t-2xl sm:max-w-lg sm:mx-auto sm:w-full",
    right: "inset-y-0 right-0 w-full sm:w-96 rounded-l-2xl"
  };

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
          <div className="fixed inset-0 z-50 pointer-events-none">
            <motion.div
              initial={variants[position].initial}
              animate={variants[position].animate}
              exit={variants[position].exit}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "absolute flex flex-col bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] shadow-2xl pointer-events-auto border-[var(--color-mandir-border)]",
                positioningClasses[position],
                position === "bottom" ? "border-t max-h-[90vh]" : "border-l",
                className
              )}
            >
              {position === "bottom" && (
                <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-[var(--color-mandir-border)]" />
              )}
              
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
              
              <div className="flex-1 overflow-y-auto p-6 pt-0">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
