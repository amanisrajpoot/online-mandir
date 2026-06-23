"use client"

import * as React from "react"
import { load } from "@cashfreepayments/cashfree-js"

interface CashfreeCheckoutProps {
  paymentSessionId: string
}

export function CashfreeCheckout({ paymentSessionId }: CashfreeCheckoutProps) {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const handlePayment = async () => {
      try {
        const cashfree = await load({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "PRODUCTION" ? "production" : "sandbox"
        })

        const checkoutOptions = {
          paymentSessionId: paymentSessionId,
          redirectTarget: "_self", // Redirects to Cashfree, then to our return_url
        }

        await cashfree.checkout(checkoutOptions)
        
      } catch (error) {
        console.error("Cashfree Checkout Error:", error)
        setLoading(false)
      }
    }

    if (paymentSessionId) {
      handlePayment()
    }
  }, [paymentSessionId])

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
      {loading ? (
        <>
          <div className="w-16 h-16 border-4 border-[var(--color-saffron-500)] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h3 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-2">Connecting to Secure Payment Gateway</h3>
          <p className="text-[var(--color-mandir-text-muted)]">Please do not close or refresh this window.</p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-[var(--color-sacred-red)]/10 text-[var(--color-sacred-red)] flex items-center justify-center mb-6 text-2xl">!</div>
          <h3 className="text-xl font-bold text-[var(--color-mandir-text)] mb-2">Payment Connection Failed</h3>
          <p className="text-[var(--color-mandir-text-muted)]">We couldn't connect to the payment gateway. Please try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-[var(--color-saffron-500)] text-white rounded-lg"
          >
            Retry
          </button>
        </>
      )}
    </div>
  )
}
