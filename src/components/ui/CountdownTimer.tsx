"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface CountdownTimerProps {
  targetDate: string | Date
  endDate?: string | Date
  className?: string
  showLabels?: boolean
  compact?: boolean
  onComplete?: () => void
  onPhaseChange?: (phase: 'starts_in' | 'ends_in' | 'ended') => void
}

export function CountdownTimer({ 
  targetDate, 
  endDate,
  className, 
  showLabels = true,
  compact = false,
  onComplete,
  onPhaseChange
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [phase, setPhase] = React.useState<'starts_in' | 'ends_in' | 'ended'>(() => {
    // Determine initial phase synchronously to avoid flickers
    const now = +new Date()
    const start = +new Date(targetDate)
    const end = endDate ? +new Date(endDate) : 0
    if (start - now <= 0) {
      return (end > now) ? 'ends_in' : 'ended'
    }
    return 'starts_in'
  })

  // Call onPhaseChange only once when component mounts or when phase actually changes
  const initialPhaseReported = React.useRef(false)
  
  React.useEffect(() => {
    if (!initialPhaseReported.current && onPhaseChange) {
      onPhaseChange(phase)
      initialPhaseReported.current = true
    }
  }, [phase, onPhaseChange])

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = +new Date()
      const start = +new Date(targetDate)
      const end = endDate ? +new Date(endDate) : 0
      
      let difference = start - now
      let currentPhase: 'starts_in' | 'ends_in' | 'ended' = 'starts_in'

      // If past start date
      if (difference <= 0) {
        if (end > now) {
          // In the active phase, count down to end
          difference = end - now
          currentPhase = 'ends_in'
        } else {
          // Completely expired
          difference = 0
          currentPhase = 'ended'
        }
      }

      return {
        phase: currentPhase,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    // Initial calculation (only update time left, phase is handled by useState init)
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      
      setTimeLeft(newTimeLeft)
      
      if (newTimeLeft.phase !== phase) {
        setPhase(newTimeLeft.phase)
        if (onPhaseChange) onPhaseChange(newTimeLeft.phase)
      }
      
      // Stop timer if expired
      if (newTimeLeft.phase === 'ended') {
        clearInterval(timer)
        if (onComplete) onComplete()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, endDate, phase]) // Removed onPhaseChange from dependencies to prevent infinite loops

  if (phase === 'ended') {
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
