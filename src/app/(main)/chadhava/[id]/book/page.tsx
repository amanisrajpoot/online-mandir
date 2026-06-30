"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  CheckCircle2, 
  MapPin, 
  ArrowLeft,
  User,
  Flower2
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Stepper } from "@/components/ui/Stepper"
import { toast } from "@/components/ui/Toast"
import { CashfreeCheckout } from "@/components/payment/CashfreeCheckout"

export default function ChadhavaBookingPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [item, setItem] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [paymentSessionId, setPaymentSessionId] = React.useState("")
  const supabase = createClient()

  // Form State
  const [offeringData, setOfferingData] = React.useState({
    fullName: "",
    specialMessage: "",
    phone: ""
  })

  React.useEffect(() => {
    const fetchItemAndUser = async () => {
      try {
        // Check Auth
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push(`/login?next=/chadhava/${id}/book`)
          return
        }

        // Fetch user profile for default data
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setOfferingData(prev => ({ 
            ...prev, 
            fullName: profile.name || "",
            phone: profile.phone || ""
          }))
        }

        // Fetch Item Details
        const { data, error } = await supabase
          .from('chadhava_items')
          .select(`*, temples (*)`)
          .eq('id', id)
          .single()
        
        if (error) throw error
        setItem(data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          type: "error",
          title: "Error",
          description: "Could not load offering details. Please try again."
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchItemAndUser()
    }
  }, [id, supabase, router])

  const handleNextStep = () => {
    // Basic validation
    if (currentStep === 0) {
      if (!offeringData.fullName || !offeringData.phone) {
        toast({ type: "error", title: "Required Fields", description: "Please enter your full name and WhatsApp number." })
        return
      }
    }

    if (currentStep < 1) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.back()
    }
  }

  const handlePayment = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chadhava',
          itemId: id,
          amount: item.price,
          customerName: offeringData.fullName,
          customerPhone: offeringData.phone,
          sankalpDetails: {
            name: offeringData.fullName,
            wish: offeringData.specialMessage,
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create order");

      setPaymentSessionId(data.paymentSessionId);
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        type: "error",
        title: "Payment Initialization Failed",
        description: error.message || "Something went wrong. Please try again."
      })
      setIsSubmitting(false)
    }
  }

  if (loading || !item) {
    return <div className="flex justify-center items-center h-[50vh]">Loading...</div>
  }

  const steps = [
    { id: "step-0", title: "Devotee Details" },
    { id: "step-1", title: "Review & Pay" }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-24">
      <div className="flex items-center mb-8">
        <button 
          onClick={handlePrevStep}
          className="mr-4 p-2 rounded-full hover:bg-[var(--color-mandir-surface)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[var(--color-mandir-text)]" />
        </button>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
          Complete Your Offering
        </h1>
      </div>

      {/* Item Summary Card */}
      <Card className="mb-8 bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)] shadow-md">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2 border-[var(--color-saffron-500)]/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={item.image_url || "/images/chadhava_pushp.png"} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-medium text-[var(--color-saffron-400)] mb-1 flex items-center justify-center sm:justify-start">
              <MapPin className="h-3 w-3 mr-1" />
              {item.temples?.name}
            </div>
            <h2 className="text-xl font-bold text-[var(--color-mandir-text)] mb-2">{item.title}</h2>
            <div className="text-2xl font-bold text-[var(--color-saffron-600)]">
              ₹{item.price}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {paymentSessionId ? (
        <CashfreeCheckout paymentSessionId={paymentSessionId} />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          
          {/* Step 0: Devotee Details */}
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <User className="h-5 w-5 mr-2 text-[var(--color-saffron-500)]" />
                    Devotee Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[var(--color-mandir-text-muted)] mb-4">
                    The offering will be made in this name.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name (required)</label>
                    <Input 
                      placeholder="e.g. Rahul Sharma" 
                      value={offeringData.fullName}
                      onChange={e => setOfferingData({...offeringData, fullName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">WhatsApp Number (required for video proof)</label>
                    <Input 
                      placeholder="10-digit mobile number" 
                      value={offeringData.phone}
                      onChange={e => setOfferingData({...offeringData, phone: e.target.value})}
                      type="tel"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Flower2 className="h-4 w-4 mr-1" /> Special Message / Prayer (optional)
                    </label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-bg)] px-3 py-2 text-sm text-[var(--color-mandir-text)] placeholder:text-[var(--color-mandir-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-saffron-500)] disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Any specific prayer while offering..."
                      value={offeringData.specialMessage}
                      onChange={e => setOfferingData({...offeringData, specialMessage: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 1: Review & Pay */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Devotee Details</CardTitle>
                      <button onClick={() => setCurrentStep(0)} className="text-xs text-[var(--color-saffron-500)] hover:underline">Edit</button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <div className="text-[var(--color-mandir-text-muted)]">Name</div>
                        <div className="font-medium text-[var(--color-mandir-text)]">{offeringData.fullName}</div>
                      </div>
                      <div>
                        <div className="text-[var(--color-mandir-text-muted)]">WhatsApp</div>
                        <div className="font-medium text-[var(--color-mandir-text)]">{offeringData.phone}</div>
                      </div>
                      {offeringData.specialMessage && (
                        <div className="col-span-2">
                          <div className="text-[var(--color-mandir-text-muted)]">Prayer</div>
                          <div className="font-medium text-[var(--color-mandir-text)] italic">&quot;{offeringData.specialMessage}&quot;</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-[var(--color-auspicious-green)]/30 bg-[var(--color-auspicious-green)]/5">
                  <CardContent className="p-4 flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-auspicious-green)] mr-3 mt-0.5 shrink-0" />
                    <p className="text-sm text-[var(--color-mandir-text)]">
                      By proceeding, you agree to our Terms of Service. A video proof of your offering will be shared on the provided WhatsApp number.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex gap-4 hidden lg:flex">
            {currentStep < 1 ? (
              <Button 
                variant="gradient" 
                className="w-full py-6 text-lg"
                onClick={handleNextStep}
              >
                Continue to Payment
              </Button>
            ) : (
              <Button 
                variant="gradient" 
                className="w-full py-6 text-lg"
                onClick={handlePayment}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : `Pay ₹${item.price} Securely`}
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Price Summary (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader className="border-b border-[var(--color-mandir-border)]">
                <CardTitle>Price Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between text-sm text-[var(--color-mandir-text)]">
                  <span>Chadhava Amount</span>
                  <span>₹{item.price}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--color-mandir-text)]">
                  <span>Taxes (GST 18%)</span>
                  <span>Inclusive</span>
                </div>
                <div className="border-t border-[var(--color-mandir-border)] pt-4 flex justify-between items-center mt-2">
                  <span className="font-bold text-[var(--color-mandir-text)] text-lg">Total Amount</span>
                  <span className="font-bold text-[var(--color-mandir-text)] text-2xl">₹{item.price}</span>
                </div>
                <div className="text-xs text-center text-[var(--color-mandir-text-muted)] mt-4 pt-4 border-t border-[var(--color-mandir-border)]/50">
                  Secured by Cashfree. 100% Safe Payments.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 p-4 bg-[var(--color-mandir-bg)]/90 backdrop-blur-md border-t border-[var(--color-mandir-border)] lg:hidden flex items-center justify-between z-40 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <div>
          <div className="text-xs text-[var(--color-mandir-text-muted)] font-medium">Total Payable</div>
          <div className="text-xl font-bold text-[var(--color-mandir-text)]">₹{item.price}</div>
        </div>
        
        {currentStep < 1 ? (
          <Button 
            variant="gradient" 
            className="rounded-full px-8 shadow-lg"
            onClick={handleNextStep}
          >
            Continue
          </Button>
        ) : (
          <Button 
            variant="gradient" 
            className="rounded-full px-8 shadow-lg"
            onClick={handlePayment}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wait..." : "Pay Now"}
          </Button>
        )}
      </div>
      </>
      )}
    </div>
  )
}
