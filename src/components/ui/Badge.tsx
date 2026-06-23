import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-saffron-500)] text-white",
        secondary:
          "border-transparent bg-[var(--color-mandir-surface)] text-[var(--color-saffron-300)]",
        destructive:
          "border-transparent bg-[var(--color-sacred-red)] text-white",
        outline: "text-[var(--color-mandir-text)] border-[var(--color-mandir-border)]",
        success: "border-transparent bg-[var(--color-auspicious-green)] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
