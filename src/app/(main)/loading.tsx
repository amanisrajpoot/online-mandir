import * as React from "react"
import { Loader2 } from "lucide-react"

export default function MainLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full blur-xl bg-[var(--color-saffron-500)]/20 animate-pulse" />
        
        {/* Spinner */}
        <Loader2 className="w-12 h-12 text-[var(--color-saffron-500)] animate-spin relative z-10" />
      </div>
      
      <p className="mt-6 text-[var(--color-saffron-600)] font-medium text-lg animate-pulse">
        Loading...
      </p>
      <p className="mt-2 text-[var(--color-mandir-text-muted)] text-sm max-w-xs text-center">
        Preparing your spiritual journey
      </p>
    </div>
  )
}
