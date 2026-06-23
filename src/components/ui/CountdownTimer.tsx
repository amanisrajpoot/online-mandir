"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface CountdownTimerProps {
  targetDate: string | Date
  className?: string
  showLabels?: boolean
  compact?: boolean
  onComplete?: () => void
}

export function CountdownTimer({ 
  targetDate, 
  className, 
  showLabels = true,
  compact = false,
  onComplete
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = React.useState(false)

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()
      
      if (difference <= 0) {
        setIsExpired(true)
        if (onComplete) onComplete()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
      
      // Stop timer if expired
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (isExpired) {
    return (
      <div className={cn("text-sm font-medium text-[var(--color-sacred-red)]", className)}>
        Booking Closed
      </div>
    )
  }

  const TimeBlock = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className={cn(
        "flex items-center justify-center rounded-md bg-[var(--color-mandir-surface)] font-mono font-bold text-[var(--color-saffron-400)] shadow-inner",
        compact ? "h-8 w-8 text-sm" : "h-12 w-12 text-lg sm:h-14 sm:w-14 sm:text-xl border border-[var(--color-mandir-border)]"
      )}>
        {value.toString().padStart(2, '0')}
      </div>
      {showLabels && (
        <span className="mt-1 text-[10px] uppercase tracking-wider text-[var(--color-mandir-text-muted)]">
          {label}
        </span>
      )}
    </div>
  )

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {timeLeft.days > 0 && (
        <>
          <TimeBlock value={timeLeft.days} label="Days" />
          <span className="text-[var(--color-mandir-text-muted)] pb-4">:</span>
        </>
      )}
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <span className={cn("text-[var(--color-mandir-text-muted)]", showLabels && "pb-4")}>:</span>
      <TimeBlock value={timeLeft.minutes} label="Mins" />
      <span className={cn("text-[var(--color-mandir-text-muted)]", showLabels && "pb-4")}>:</span>
      <TimeBlock value={timeLeft.seconds} label="Secs" />
    </div>
  )
}
