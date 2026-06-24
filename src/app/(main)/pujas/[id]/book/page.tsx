"use client"

import * as React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { encodeId, decodeId } from "@/lib/utils"
import { motion } from "framer-motion"
import { 
  CheckCircle2, 
  MapPin, 
  ArrowLeft,
  User,
  Users,
  MapPin as AddressIcon
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Stepper } from "@/components/ui/Stepper"
import { toast } from "@/components/ui/Toast"
import { CashfreeCheckout } from "@/components/payment/CashfreeCheckout"

export default function PujaBookingPage() {
  const params = useParams()
  const router = useRouter()
  const id = decodeId(params.id as string)
  
  const [puja, setPuja] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const searchParams = useSearchParams()
  const packageId = searchParams.get('packageId')
  const [selectedPackage, setSelectedPackage] = React.useState<any>(null)
  const [paymentSessionId, setPaymentSessionId] = React.useState("")
  const supabase = createClient()

  // Form State
  const [sankalpData, setSankalpData] = React.useState({
    fullName: "",
    gotra: "",
    problem: "",
    additionalMembers: [] as string[]
  })

  const [addressData, setAddressData] = React.useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  })

  const [optInPrasad, setOptInPrasad] = React.useState(false)

  React.useEffect(() => {
    const fetchPujaAndUser = async () => {
      try {
        // Check Auth
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push(`/login?next=/pujas/${encodeId(id)}/book`)
          return
        }

        // Fetch user profile for default data
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setSankalpData(prev => ({ ...prev, fullName: profile.name || "" }))
          setAddressData(prev => ({ ...prev, phone: profile.phone || "" }))
        }

        // Fetch Puja Details
        const { data, error } = await supabase
          .from('pujas')
          .select(`*, temples (*)`)
          .eq('id', id)
          .single()
        
        if (error) throw error
        setPuja(data)
        
        // Select package
        let pkg = null;
        if (data.packages && packageId) {
          pkg = data.packages.find((p: any) => p.id === packageId) || data.packages[0];
        } else if (data.packages && data.packages.length > 0) {
          pkg = data.packages[0]
        }
        setSelectedPackage(pkg)

        // Initialize additional members array based on package
        const maxTotal = pkg ? pkg.max_members : 1
        const maxAdditional = maxTotal > 20 ? 10 : Math.max(0, maxTotal - 1)
        if (maxAdditional > 0) {
          setSankalpData(prev => ({ 
            ...prev, 
            additionalMembers: Array(maxAdditional > 20 ? 2 : 1).fill("") // Default start with 1 or 2
          }))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          type: "error",
          title: "Error",
          description: "Could not load puja details. Please try again."
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPujaAndUser()
    }
  }, [id, supabase, router])

  const handleNextStep = () => {
    // Basic validation
    if (currentStep === 0) {
      if (!sankalpData.fullName) {
        toast({ type: "error", title: "Required Field", description: "Please enter your full name for the Sankalp." })
        return
      }
    } else if (currentStep === 1) {
      const isPrasadFree = (selectedPackage?.sale_price || puja.sale_price) >= 500
      const includePrasad = isPrasadFree || optInPrasad
      
      if (includePrasad && (!addressData.street || !addressData.city || !addressData.state || !addressData.pincode || !addressData.phone)) {
        toast({ type: "error", title: "Required Fields", description: "Please fill all address fields for Prasad delivery." })
        return
      }
    }

    if (currentStep < 2) {
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
        const prasadCost = ((selectedPackage?.sale_price || puja.sale_price) >= 500) ? 0 : (optInPrasad ? 99 : 0)
        const finalPayableAmount = (selectedPackage?.sale_price || puja.sale_price) + prasadCost
        const isPrasadFree = (selectedPackage?.sale_price || puja.sale_price) >= 500
        const includePrasad = isPrasadFree || optInPrasad

        const response = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'puja',
            itemId: id,
            amount: finalPayableAmount,
            customerName: sankalpData.fullName,
            packageId: selectedPackage?.id,
            customerPhone: addressData.phone,
            sankalpDetails: {
              name: sankalpData.fullName,
              gotra: sankalpData.gotra,
              wish: sankalpData.problem,
              additional_members: sankalpData.additionalMembers.filter(n => n.trim() !== "")
            },
            deliveryAddress: includePrasad ? {
              name: sankalpData.fullName,
              phone: addressData.phone,
              address_line: addressData.street,
              city: addressData.city,
              state: addressData.state,
              pincode: addressData.pincode
            } : null
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

  if (loading || !puja) {
    return <div className="flex justify-center items-center h-[50vh]">Loading...</div>
  }

  const steps = [
    { id: "step-0", title: "Sankalp Details" },
    { id: "step-1", title: "Prasad Delivery" },
    { id: "step-2", title: "Review & Pay" }
  ]

  const displayPrice = selectedPackage?.sale_price || puja.sale_price
  const displayBasePrice = selectedPackage?.base_price || puja.base_price
  const PRASAD_DELIVERY_COST = 99
  const isPrasadFree = displayPrice >= 500
  const includePrasad = isPrasadFree || optInPrasad
  const prasadCost = isPrasadFree ? 0 : (optInPrasad ? PRASAD_DELIVERY_COST : 0)
  const finalPayableAmount = displayPrice + prasadCost

  const displayName = selectedPackage ? `${puja.title} - ${selectedPackage.name}` : puja.title
  const maxTotalMembers = selectedPackage?.max_members || 1
  const maxAdditionalMembers = maxTotalMembers > 20 ? 10 : Math.max(0, maxTotalMembers - 1)
  const isLargeGroup = maxTotalMembers > 20

  const handleAddMember = () => {
    if (sankalpData.additionalMembers.length < maxAdditionalMembers) {
      setSankalpData(prev => ({
        ...prev,
        additionalMembers: [...prev.additionalMembers, ""]
      }))
    }
  }

  const handleUpdateMember = (index: number, value: string) => {
    const newMembers = [...sankalpData.additionalMembers]
    newMembers[index] = value
    setSankalpData(prev => ({ ...prev, additionalMembers: newMembers }))
  }

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
          Complete Your Booking
        </h1>
      </div>

      {/* Puja Summary Card */}
      <Card className="mb-8 bg-gradient-to-r from-[var(--color-mandir-surface)] to-[#2a1b38] border-[#4a326b]">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2 border-[var(--color-saffron-500)]/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={puja.image_url || "/images/puja_ganesh.png"} 
              alt={puja.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-medium text-[var(--color-saffron-400)] mb-1 flex items-center justify-center sm:justify-start">
              <MapPin className="h-3 w-3 mr-1" />
              {puja.temples?.name}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{displayName}</h2>
            <div className="text-2xl font-bold text-[var(--color-temple-gold)]">
              ₹{displayPrice}
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
          
          {/* Step 0: Sankalp Details */}
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
                    Sankalp Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[var(--color-mandir-text-muted)] mb-4">
                    The Pandit will chant these details to dedicate the merit of the puja to you.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Full Name (required)</label>
                    <Input 
                      placeholder="e.g. Rahul Sharma" 
                      value={sankalpData.fullName}
                      onChange={e => setSankalpData({...sankalpData, fullName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gotra (optional)</label>
                    <Input 
                      placeholder="e.g. Kashyap" 
                      value={sankalpData.gotra}
                      onChange={e => setSankalpData({...sankalpData, gotra: e.target.value})}
                    />
                  </div>

                  {maxAdditionalMembers > 0 && (
                    <div className="space-y-4 border-t border-[var(--color-mandir-border)] pt-4 mt-4">
                      <label className="text-sm font-medium flex items-center justify-between">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" /> 
                          Additional Family Members
                        </span>
                        <span className="text-xs text-[var(--color-mandir-text-muted)] bg-[var(--color-mandir-bg)] px-2 py-1 rounded-md">
                          {sankalpData.additionalMembers.length} / {maxAdditionalMembers} added
                        </span>
                      </label>
                      
                      {isLargeGroup && (
                        <div className="text-xs text-[var(--color-saffron-600)] bg-[var(--color-saffron-50)] p-2 rounded border border-[var(--color-saffron-200)]">
                          For large groups (over 20 people), please provide the names of up to 10 primary family members (elders/heads of family).
                        </div>
                      )}
                      
                      {sankalpData.additionalMembers.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm text-[var(--color-mandir-text-muted)] w-4">{idx + 1}.</span>
                          <Input 
                            placeholder="Full Name" 
                            value={member}
                            onChange={e => handleUpdateMember(idx, e.target.value)}
                          />
                        </div>
                      ))}
                      
                      {sankalpData.additionalMembers.length < maxAdditionalMembers && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAddMember}
                          className="w-full border-dashed text-[var(--color-saffron-500)]"
                        >
                          + Add Another Member
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 border-t border-[var(--color-mandir-border)] pt-4 mt-4">
                    <label className="text-sm font-medium">Special Request / Problem (optional)</label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-bg)] px-3 py-2 text-sm text-[var(--color-mandir-text)] placeholder:text-[var(--color-mandir-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-saffron-500)] disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Briefly describe what you are praying for..."
                      value={sankalpData.problem}
                      onChange={e => setSankalpData({...sankalpData, problem: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 1: Prasad Delivery */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <AddressIcon className="h-5 w-5 mr-2 text-[var(--color-saffron-500)]" />
                    Prasad Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isPrasadFree && (
                    <div className="flex items-start space-x-3 p-4 bg-[var(--color-mandir-surface)] border border-[var(--color-mandir-border)] rounded-xl mb-4">
                      <input 
                        type="checkbox" 
                        id="optInPrasad"
                        checked={optInPrasad}
                        onChange={(e) => setOptInPrasad(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[var(--color-saffron-500)] rounded border-[var(--color-mandir-border)] focus:ring-[var(--color-saffron-500)] bg-[var(--color-mandir-bg)]"
                      />
                      <div className="flex-1">
                        <label htmlFor="optInPrasad" className="text-sm font-medium text-[var(--color-mandir-text)] cursor-pointer">
                          Add Physical Prasad Delivery (+₹{PRASAD_DELIVERY_COST})
                        </label>
                        <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
                          Receive the holy prasad directly from the temple to your doorstep.
                        </p>
                      </div>
                    </div>
                  )}

                  {includePrasad ? (
                    <>
                      <p className="text-sm text-[var(--color-mandir-text-muted)] mb-4">
                        Blessed prasad will be securely shipped to this address via courier.
                      </p>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Street Address / Flat No.</label>
                        <Input 
                          placeholder="123, Devotion Heights, Main Street" 
                          value={addressData.street}
                          onChange={e => setAddressData({...addressData, street: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">City</label>
                          <Input 
                            placeholder="Mumbai" 
                            value={addressData.city}
                            onChange={e => setAddressData({...addressData, city: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">State</label>
                          <Input 
                            placeholder="Maharashtra" 
                            value={addressData.state}
                            onChange={e => setAddressData({...addressData, state: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Pincode</label>
                          <Input 
                            placeholder="400001" 
                            value={addressData.pincode}
                            onChange={e => setAddressData({...addressData, pincode: e.target.value})}
                            maxLength={6}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <Input 
                            placeholder="10-digit number" 
                            value={addressData.phone}
                            onChange={e => setAddressData({...addressData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-[var(--color-mandir-text-muted)]">
                      <p>You have chosen to skip Prasad delivery.</p>
                      <Button 
                        variant="ghost" 
                        className="mt-4 text-[var(--color-saffron-500)]"
                        onClick={() => setOptInPrasad(true)}
                      >
                        Add Prasad Delivery for ₹{PRASAD_DELIVERY_COST}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Review & Pay */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Sankalp Details</CardTitle>
                      <button onClick={() => setCurrentStep(0)} className="text-xs text-[var(--color-saffron-500)] hover:underline">Edit</button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <div className="text-[var(--color-mandir-text-muted)]">Name</div>
                        <div className="font-medium text-[var(--color-mandir-text)]">{sankalpData.fullName}</div>
                      </div>
                      <div>
                        <div className="text-[var(--color-mandir-text-muted)]">Gotra</div>
                        <div className="font-medium text-[var(--color-mandir-text)]">{sankalpData.gotra || "Not provided"}</div>
                      </div>
                      {sankalpData.additionalMembers.filter(n => n.trim() !== "").length > 0 && (
                        <div className="col-span-2">
                          <div className="text-[var(--color-mandir-text-muted)]">Additional Members</div>
                          <div className="font-medium text-[var(--color-mandir-text)]">
                            {sankalpData.additionalMembers.filter(n => n.trim() !== "").join(", ")}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Delivery Address</CardTitle>
                      <button onClick={() => setCurrentStep(1)} className="text-xs text-[var(--color-saffron-500)] hover:underline">Edit</button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 text-sm">
                    {includePrasad ? (
                      <>
                        <div className="font-medium text-[var(--color-mandir-text)]">{sankalpData.fullName}</div>
                        <div className="text-[var(--color-mandir-text-muted)] mt-1">
                          {addressData.street}<br/>
                          {addressData.city}, {addressData.state} - {addressData.pincode}<br/>
                          Phone: {addressData.phone}
                        </div>
                      </>
                    ) : (
                      <div className="text-[var(--color-mandir-text-muted)]">Prasad delivery skipped.</div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="border-[var(--color-auspicious-green)]/30 bg-[var(--color-auspicious-green)]/5">
                  <CardContent className="p-4 flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-auspicious-green)] mr-3 mt-0.5 shrink-0" />
                    <p className="text-sm text-[var(--color-mandir-text)]">
                      By proceeding, you agree to our Terms of Service. A personalized video of your Sankalp will be shared with you on WhatsApp within 24 hours of the puja.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex gap-4 hidden lg:flex">
            {currentStep < 2 ? (
              <Button 
                variant="gradient" 
                className="w-full py-6 text-lg"
                onClick={handleNextStep}
              >
                Continue to {currentStep === 0 ? "Delivery Details" : "Payment"}
              </Button>
            ) : (
              <Button 
                variant="gradient" 
                className="w-full py-6 text-lg"
                onClick={handlePayment}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : `Pay ₹${finalPayableAmount} Securely`}
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
                  <span>Puja Dakshina</span>
                  <span>₹{displayBasePrice}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--color-auspicious-green)]">
                  <span>Divine Discount</span>
                  <span>-₹{displayBasePrice - displayPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--color-mandir-text)]">
                  <span>Prasad Delivery (India)</span>
                  {isPrasadFree ? (
                    <span className="text-[var(--color-auspicious-green)]">FREE</span>
                  ) : optInPrasad ? (
                    <span>+₹{PRASAD_DELIVERY_COST}</span>
                  ) : (
                    <span className="text-[var(--color-mandir-text-muted)]">Not Included</span>
                  )}
                </div>
                <div className="flex justify-between text-sm text-[var(--color-mandir-text)]">
                  <span>Taxes (GST 18%)</span>
                  <span>Inclusive</span>
                </div>
                <div className="border-t border-[var(--color-mandir-border)] pt-4 flex justify-between items-center mt-2">
                  <span className="font-bold text-[var(--color-mandir-text)] text-lg">Total Amount</span>
                  <span className="font-bold text-[var(--color-mandir-text)] text-2xl">₹{finalPayableAmount}</span>
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
          <div className="text-xl font-bold text-[var(--color-mandir-text)]">₹{finalPayableAmount}</div>
        </div>
        
        {currentStep < 2 ? (
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
