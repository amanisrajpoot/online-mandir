"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, Clock, Package, Video, Truck, CreditCard, Ban } from "lucide-react"

import { cn } from "@/lib/utils"

export type OrderStatusType = 'booked' | 'assigned' | 'in_progress' | 'completed' | 'video_uploaded' | 'prasad_shipped' | 'delivered' | 'cancelled'

export interface StatusTimelineProps {
  currentStatus: OrderStatusType
  className?: string
  includePrasad?: boolean
  includeVideo?: boolean
}

export function StatusTimeline({ 
  currentStatus, 
  className,
  includePrasad = true,
  includeVideo = true
}: StatusTimelineProps) {
  
  // Define all possible states
  const allStates: { id: OrderStatusType; title: string; icon: React.ReactNode; isError?: boolean }[] = [
    { id: 'booked', title: 'Order Confirmed', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'assigned', title: 'Pandit Assigned', icon: <Check className="w-4 h-4" /> },
    { id: 'in_progress', title: 'Puja In Progress', icon: <Clock className="w-4 h-4" /> },
    { id: 'completed', title: 'Puja Completed', icon: <Check className="w-4 h-4" /> },
    ...(includeVideo ? [{ id: 'video_uploaded', title: 'Video Uploaded', icon: <Video className="w-4 h-4" /> } as const] : []),
    ...(includePrasad ? [
      { id: 'prasad_shipped', title: 'Prasad Shipped', icon: <Truck className="w-4 h-4" /> } as const,
      { id: 'delivered', title: 'Prasad Delivered', icon: <Package className="w-4 h-4" /> } as const
    ] : [])
  ]

  // If cancelled, show a different timeline
  if (currentStatus === 'cancelled') {
    return (
      <div className={cn("w-full py-4", className)}>
        <div className="flex items-center space-x-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-sacred-red)] bg-[var(--color-sacred-red)]/10 text-[var(--color-sacred-red)]">
            <Ban className="h-4 w-4" />
          </div>
          <div className="text-sm font-medium text-[var(--color-sacred-red)]">Order Cancelled</div>
        </div>
      </div>
    )
  }

  const currentIndex = allStates.findIndex(s => s.id === currentStatus)

  return (
    <div className={cn("w-full py-2", className)}>
      <div className="flex flex-col space-y-8">
        {allStates.map((step, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex
          
          return (
            <div key={step.id} className="relative flex items-start space-x-4">
              {/* Connector line */}
              {index < allStates.length - 1 && (
                <div className="absolute left-4 top-8 bottom-[-32px] w-0.5 -translate-x-1/2 bg-[var(--color-mandir-border)]">
                  <motion.div 
                    className="h-full w-full bg-[var(--color-auspicious-green)]"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: index < currentIndex ? 1 : 0 }}
                    style={{ transformOrigin: "top" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
              
              {/* Step indicator */}
              <div className="z-10 relative mt-0.5">
                <motion.div 
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300",
                    isCompleted 
                      ? "border-[var(--color-auspicious-green)] bg-[var(--color-auspicious-green)] text-white" 
                      : "border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text-muted)]"
                  )}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                >
                  {step.icon}
                </motion.div>
                
                {/* Pulse ring for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[var(--color-auspicious-green)] opacity-50"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </div>
              
              {/* Step content */}
              <div className="flex flex-col pt-1.5">
                <div 
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCompleted ? "text-[var(--color-mandir-text)]" : "text-[var(--color-mandir-text-muted)]",
                    isCurrent && "text-[var(--color-auspicious-green)]"
                  )}
                >
                  {step.title}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
