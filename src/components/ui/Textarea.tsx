import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] px-3 py-2 text-sm text-[var(--color-mandir-text)] ring-offset-background placeholder:text-[var(--color-mandir-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-saffron-500)] focus-visible:border-[var(--color-saffron-500)] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
