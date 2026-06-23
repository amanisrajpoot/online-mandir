"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Info, AlertCircle, X, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "default" | "success" | "error" | "warning"

interface Toast {
  id: string
  title?: string
  description?: string
  type: ToastType
  duration?: number
}

// Simple pub/sub system for toasts
type Listener = (toast: Omit<Toast, "id">) => void
let listeners: Listener[] = []

export const toast = (props: Omit<Toast, "id">) => {
  listeners.forEach((listener) => listener(props))
}

const icons = {
  default: Info,
  success: Check,
  error: XCircle,
  warning: AlertCircle,
}

const colors = {
  default: "bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)] text-[var(--color-mandir-text)]",
  success: "bg-[var(--color-auspicious-green)]/10 border-[var(--color-auspicious-green)]/20 text-[var(--color-auspicious-green)]",
  error: "bg-[var(--color-sacred-red)]/10 border-[var(--color-sacred-red)]/20 text-[var(--color-sacred-red)]",
  warning: "bg-[var(--color-saffron-500)]/10 border-[var(--color-saffron-500)]/20 text-[var(--color-saffron-500)]",
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  React.useEffect(() => {
    const listener: Listener = (newToast) => {
      const id = Math.random().toString(36).substring(2, 9)
      const toastWithId = { ...newToast, id, duration: newToast.duration || 5000 }
      
      setToasts((prev) => [...prev, toastWithId])
      
      if (toastWithId.duration !== Infinity) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, toastWithId.duration)
      }
    }
    
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={cn(
                "group pointer-events-auto relative mb-4 flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
                colors[toast.type]
              )}
            >
              <div className="flex gap-3">
                <Icon className="h-5 w-5 mt-0.5" />
                <div className="flex flex-col gap-1">
                  {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
                  {toast.description && (
                    <div className="text-sm opacity-90">{toast.description}</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
