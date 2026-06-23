"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StepperProps {
  steps: {
    id: string
    title: string
    description?: string
  }[]
  currentStep: number
  className?: string
  direction?: "horizontal" | "vertical"
}

export function Stepper({ steps, currentStep, className, direction = "horizontal" }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div 
        className={cn(
          "flex",
          direction === "horizontal" ? "flex-row items-center justify-between" : "flex-col space-y-6"
        )}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          
          return (
            <div 
              key={step.id} 
              className={cn(
                "relative flex",
                direction === "horizontal" ? "flex-col items-center flex-1 text-center" : "flex-row items-start space-x-4"
              )}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "absolute bg-[var(--color-mandir-border)]",
                    direction === "horizontal" 
                      ? "top-4 left-[50%] right-[-50%] h-0.5 -translate-y-1/2" 
                      : "left-4 top-8 bottom-[-24px] w-0.5 -translate-x-1/2"
                  )}
                >
                  <motion.div 
                    className="h-full w-full bg-[var(--color-saffron-500)]"
                    initial={{ scaleX: 0, scaleY: 0 }}
                    animate={{ 
                      scaleX: direction === "horizontal" ? (isCompleted ? 1 : 0) : 1,
                      scaleY: direction === "vertical" ? (isCompleted ? 1 : 0) : 1
                    }}
                    style={{ transformOrigin: direction === "horizontal" ? "left" : "top" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              )}
              
              {/* Step indicator */}
              <div className="z-10 relative">
                <motion.div 
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    isCompleted 
                      ? "border-[var(--color-saffron-500)] bg-[var(--color-saffron-500)] text-white" 
                      : isCurrent
                        ? "border-[var(--color-saffron-500)] bg-[var(--color-mandir-surface)] text-[var(--color-saffron-500)] shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                        : "border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text-muted)]"
                  )}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                </motion.div>
                
                {/* Pulse ring for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[var(--color-saffron-500)] opacity-50"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </div>
              
              {/* Step content */}
              <div 
                className={cn(
                  "flex flex-col",
                  direction === "horizontal" ? "mt-3 space-y-1" : "pt-1 space-y-1"
                )}
              >
                <div 
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCompleted || isCurrent ? "text-[var(--color-mandir-text)]" : "text-[var(--color-mandir-text-muted)]"
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-[var(--color-mandir-text-muted)]">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
