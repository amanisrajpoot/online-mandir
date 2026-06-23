"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export interface RatingProps {
  value: number
  max?: number
  readOnly?: boolean
  onChange?: (value: number) => void
  className?: string
  size?: "sm" | "default" | "lg"
  showLabel?: boolean
  label?: string
}

export function Rating({
  value,
  max = 5,
  readOnly = true,
  onChange,
  className,
  size = "default",
  showLabel = false,
  label,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const sizeClasses = {
    sm: "h-3 w-3",
    default: "h-4 w-4",
    lg: "h-6 w-6",
  }

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverValue(index)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(null)
    }
  }

  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index)
    }
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div 
        className="flex gap-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: max }).map((_, i) => {
          const itemValue = i + 1
          const isFilled = itemValue <= displayValue
          // Handle partial stars (only works for readOnly)
          const isPartial = readOnly && itemValue > Math.floor(displayValue) && itemValue <= Math.ceil(displayValue)
          const percentFilled = isPartial ? (displayValue % 1) * 100 : 0

          return (
            <div
              key={i}
              className={cn(
                "relative cursor-pointer transition-transform",
                !readOnly && "hover:scale-110",
                readOnly && "cursor-default"
              )}
              onMouseEnter={() => handleMouseEnter(itemValue)}
              onClick={() => handleClick(itemValue)}
            >
              {/* Background empty star */}
              <Star 
                className={cn(
                  sizeClasses[size], 
                  "text-[var(--color-mandir-border)]"
                )} 
              />
              
              {/* Foreground filled star */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: isFilled ? '100%' : isPartial ? `${percentFilled}%` : '0%' }}
              >
                <Star 
                  className={cn(
                    sizeClasses[size], 
                    "fill-[var(--color-temple-gold)] text-[var(--color-temple-gold)]"
                  )} 
                />
              </div>
            </div>
          )
        })}
      </div>
      
      {showLabel && (
        <span className="text-sm font-medium text-[var(--color-mandir-text)] ml-1">
          {label || value.toFixed(1)}
        </span>
      )}
    </div>
  )
}
