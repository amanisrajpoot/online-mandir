"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error("Main Route Error Boundary caught:", error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center space-y-6 bg-[var(--color-mandir-surface)] p-8 rounded-2xl border border-[var(--color-mandir-border)] shadow-2xl">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
          Something went wrong!
        </h2>
        
        <p className="text-[var(--color-mandir-text-muted)] text-sm">
          We apologize for the inconvenience. An unexpected error has occurred while fetching this page.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => reset()}
            variant="default"
            className="w-full sm:w-auto bg-[var(--color-saffron-500)] hover:bg-[var(--color-saffron-600)] text-white"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
