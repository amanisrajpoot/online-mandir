"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const dbOrderId = searchParams.get("order_id")
  const cfOrderId = searchParams.get("cf_id")

  const [status, setStatus] = React.useState<"loading" | "success" | "failed">("loading")

  React.useEffect(() => {
    const verifyPayment = async () => {
      if (!cfOrderId) {
        setStatus("failed")
        return
      }

      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: cfOrderId })
        })

        const data = await res.json()
        if (data.success) {
          setStatus("success")
        } else {
          setStatus("failed")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("failed")
      }
    }

    verifyPayment()
  }, [cfOrderId])

  return (
    <Card className="border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] shadow-2xl">
      <CardContent className="pt-12 pb-12 flex flex-col items-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-[var(--color-saffron-500)] mb-6" />
            <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-2">Verifying Payment</h1>
            <p className="text-[var(--color-mandir-text-muted)]">Please wait while we confirm your transaction with the bank...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-[var(--color-auspicious-green)]/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-[var(--color-auspicious-green)]" />
            </div>
            <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-2">Booking Confirmed! 🙏</h1>
            <p className="text-[var(--color-mandir-text-muted)] mb-8">Your payment was successful and your order has been scheduled. May you be blessed.</p>
            <Button 
              variant="gradient" 
              className="w-full"
              onClick={() => router.push('/profile?tab=orders')}
            >
              Track My Order
            </Button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-20 h-20 bg-[var(--color-sacred-red)]/10 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-12 w-12 text-[var(--color-sacred-red)]" />
            </div>
            <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-2">Payment Failed</h1>
            <p className="text-[var(--color-mandir-text-muted)] mb-8">We could not verify your payment. If money was deducted, it will be refunded within 5-7 business days.</p>
            <div className="flex gap-4 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push('/')}
              >
                Go Home
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1"
                onClick={() => router.push('/profile?tab=orders')}
              >
                View Orders
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <React.Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-12 w-12 animate-spin text-[var(--color-saffron-500)]" /></div>}>
        <ConfirmationContent />
      </React.Suspense>
    </div>
  )
}
