"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, Bell } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./Button"
import { toast } from "./Toast"

export interface ComingSoonProps {
  title: string
  description?: string
  className?: string
}

export function ComingSoon({ title, description, className }: ComingSoonProps) {
  const [notified, setNotified] = React.useState(false)

  const handleNotifyMe = () => {
    setNotified(true)
    toast({
      type: "success",
      title: "Added to waitlist!",
      description: "We'll notify you as soon as this feature is ready.",
    })
  }

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[60vh] p-8 text-center", className)}>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 blur-3xl rounded-full bg-[var(--color-saffron-500)]/20" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] shadow-2xl">
          <Sparkles className="h-12 w-12 text-[var(--color-temple-gold)]" />
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-4 text-3xl font-bold font-[var(--font-heading)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)]"
      >
        {title}
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8 max-w-md text-lg text-[var(--color-mandir-text-muted)]"
      >
        {description || "We're working hard to bring this sacred experience to you. It will be available very soon."}
      </motion.p>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <Button 
          variant={notified ? "secondary" : "default"} 
          size="lg" 
          onClick={handleNotifyMe}
          disabled={notified}
          className="rounded-full shadow-lg"
        >
          {notified ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              You're on the list
            </>
          ) : (
            <>
              <Bell className="mr-2 h-5 w-5" />
              Notify Me When Ready
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
