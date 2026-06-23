"use client"

import * as React from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

// A simplified Select component since we can't easily install radix-ui/react-select due to dependencies
// In a full production app, we would use the real Radix UI component.

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, onValueChange, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full appearance-none rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] px-3 py-2 text-sm text-[var(--color-mandir-text)] ring-offset-background focus:outline-none focus:ring-2 focus:ring-[var(--color-saffron-500)] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            className
          )}
          onChange={(e) => {
             if (onValueChange) onValueChange(e.target.value);
             if (props.onChange) props.onChange(e);
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-5 w-5 opacity-50 pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
