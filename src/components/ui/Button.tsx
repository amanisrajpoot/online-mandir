import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-button)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-saffron-500)] text-white hover:bg-[var(--color-saffron-600)] shadow-md hover:shadow-lg transition-all",
        destructive: "bg-[var(--color-sacred-red)] text-white hover:bg-[var(--color-sacred-red)]/90",
        outline: "border border-[var(--color-saffron-500)] text-[var(--color-saffron-500)] hover:bg-[var(--color-saffron-50)] hover:text-[var(--color-saffron-600)]",
        secondary: "bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text)] hover:bg-[var(--color-mandir-card-hover)]",
        ghost: "hover:bg-[var(--color-mandir-surface)] hover:text-[var(--color-saffron-400)]",
        link: "text-[var(--color-saffron-400)] underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-[var(--color-saffron-600)] to-[var(--color-saffron-400)] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-14 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
