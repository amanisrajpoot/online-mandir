"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Package, Video, MapPin, Calendar, Clock, Download } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { StatusTimeline } from "@/components/ui/StatusTimeline"
import { Button } from "@/components/ui/Button"

export function OrderCard({ order }: { order: any }) {
  const isPuja = order.order_type === 'puja'
  const details = isPuja ? order.pujas : order.chadhava_items
  
  if (!details) return null

  // Determine status step
  let currentStep = 0
  const status = order.status
  if (status === 'assigned') currentStep = 1
  else if (status === 'in_progress') currentStep = 2
  else if (status === 'video_uploaded') currentStep = 3
  else if (status === 'prasad_shipped') currentStep = 4
  else if (status === 'completed') currentStep = 5

  const processSteps = isPuja ? [
    { title: "Booked", description: "Order confirmed" },
    { title: "Sankalp", description: "Sankalp details verified" },
    { title: "Puja", description: "Puja in progress" },
    { title: "Video", description: "Video proof uploaded" },
    { title: "Prasad", description: "Prasad dispatched" }
  ] : [
    { title: "Booked", description: "Order confirmed" },
    { title: "Assigned", description: "Sent to temple" },
    { title: "Offered", description: "Chadhava offered" },
    { title: "Video", description: "Video proof sent" },
    { title: "Completed", description: "Blessings received" }
  ]

  return (
    <Card className="mb-6 overflow-hidden border-[var(--color-mandir-border)] shadow-md hover:shadow-lg transition-shadow bg-[var(--color-mandir-surface)]">
      <div className="flex flex-col sm:flex-row">
        {/* Left/Top: Image and basic details */}
        <div className="w-full sm:w-1/3 md:w-1/4 h-48 sm:h-auto relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={details.image_url || "/images/prasad_thali.png"} 
            alt={details.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge variant={isPuja ? "secondary" : "default"} className={isPuja ? "bg-black/60 text-white" : "bg-[var(--color-saffron-500)]"}>
              {isPuja ? "Mandir Puja" : "Chadhava"}
            </Badge>
          </div>
        </div>

        {/* Right/Bottom: Order details and tracking */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          <div className="flex justify-between items-start mb-2 gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] leading-tight">
                {details.title}
              </h3>
              <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1 flex items-center">
                Order ID: {order.razorpay_order_id}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-lg text-[var(--color-mandir-text)]">₹{order.amount}</div>
              <div className="text-xs text-[var(--color-mandir-text-muted)]">
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          <div className="mt-6 mb-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-[var(--color-mandir-text)]">Tracking Status</h4>
              <Badge variant="outline" className="text-xs capitalize border-[var(--color-saffron-500)] text-[var(--color-saffron-500)]">
                {status.replace('_', ' ')}
              </Badge>
            </div>
            
            <StatusTimeline 
              currentStatus={order.status as any} 
              includePrasad={isPuja}
              includeVideo={true}
            />
          </div>

          <div className="mt-auto pt-6 flex flex-wrap gap-3">
            {order.video_url && (
              <a href={order.video_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2 border-[var(--color-auspicious-green)] text-[var(--color-auspicious-green)] hover:bg-[var(--color-auspicious-green)]/10">
                  <Video className="w-4 h-4" /> Watch Video Proof
                </Button>
              </a>
            )}
            <Button variant="ghost" size="sm" className="flex-1 flex items-center gap-2">
              <Download className="w-4 h-4" /> Invoice
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
