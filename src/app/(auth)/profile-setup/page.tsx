"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'

function ProfileSetupContent() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'details' | 'verify'>('details')
  const [otp, setOtp] = useState('')
  const [phoneNeedsVerification, setPhoneNeedsVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      if (user.phone) {
        setPhone(user.phone)
        setPhoneNeedsVerification(false)
      } else {
        setPhoneNeedsVerification(true)
      }
      
      // Try to fetch existing name
      const { data: profile } = await supabase.from('users').select('name').eq('id', user.id).single()
      if (profile?.name) setName(profile.name)
    }
    checkUser()
  }, [router, supabase])

  const completeProfileSave = async (userId: string, userName: string, userPhone: string) => {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        name: userName,
        phone: userPhone,
      })

    if (error) throw error

    toast({
      type: 'success',
      title: 'Profile Updated',
      description: 'Your profile has been set up successfully.',
    })
    
    const redirectUrl = searchParams.get('redirect')
    if (redirectUrl) {
      router.push(redirectUrl)
    } else {
      router.push('/')
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      let formattedPhone = phone.replace(/\s+/g, '')
      if (formattedPhone.length === 10) {
        formattedPhone = '+91' + formattedPhone
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone
      }

      if (phoneNeedsVerification && user.phone !== formattedPhone) {
        // We need to verify this new phone number by natively linking it
        const { error: updateError } = await supabase.auth.updateUser({
          phone: formattedPhone
        })
        
        if (updateError) {
          if (updateError.message.toLowerCase().includes("registered") || updateError.message.toLowerCase().includes("taken")) {
            toast({
              type: 'error',
              title: 'Phone Number Taken',
              description: 'This phone number belongs to an existing account. Please log out and log in using your phone number instead to access that account.',
            })
            setIsLoading(false)
            return
          }
          throw updateError
        }
        
        // OTP sent successfully
        setStep('verify')
        toast({
          type: 'success',
          title: 'Verification Required',
          description: `We've sent a code to ${formattedPhone} to verify ownership.`,
        })
      } else {
        // User logged in via phone or didn't change it, save directly
        await completeProfileSave(user.id, name, formattedPhone)
      }
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Error',
        description: error.message || 'Could not save your profile. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    let formattedPhone = phone.replace(/\s+/g, '')
    if (formattedPhone.length === 10) {
      formattedPhone = '+91' + formattedPhone
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone
    }

    try {
      const { data: { user }, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'phone_change'
      })

      if (verifyError) throw verifyError
      if (!user) throw new Error("Verification failed")

      // Verified and linked natively! Now save to public.users
      await completeProfileSave(user.id, name, formattedPhone)
      
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md relative z-10"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
          Complete Your Profile
        </h1>
        <p className="mt-2 text-[var(--color-mandir-text-muted)]">Just a few details to personalize your experience</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 'details' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ravi Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isLoading || !phoneNeedsVerification}
                />
                {!phoneNeedsVerification && (
                  <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
                    Phone number verified via login.
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full mt-4" 
                variant="gradient"
                disabled={isLoading || !name || !phone}
              >
                {isLoading ? 'Saving...' : (phoneNeedsVerification ? 'Save & Verify Phone' : 'Complete Setup')}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium">Verification Code</label>
                <p className="text-xs text-[var(--color-mandir-text-muted)] mb-2">
                  Enter the code sent to {phone} to link this number to your account.
                </p>
                <Input
                  id="otp"
                  type="text"
                  placeholder="12345678"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={8}
                  required
                  disabled={isLoading}
                  className="text-center text-2xl tracking-widest font-mono"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                variant="gradient"
                disabled={isLoading || otp.length < 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Finish'}
              </Button>
              <div className="mt-4 text-center">
                <button 
                  type="button" 
                  onClick={() => { setStep('details'); setOtp(''); }} 
                  className="text-sm text-[var(--color-saffron-400)] hover:underline"
                >
                  Change Phone Number
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      {step === 'details' && (
        <div className="mt-6 text-center">
          <Button variant="ghost" className="text-sm text-[var(--color-mandir-text-muted)]" onClick={() => supabase.auth.signOut().then(() => { window.location.href = '/login' })}>
            Sign Out
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default function ProfileSetupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-[var(--color-saffron-500)] border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProfileSetupContent />
    </Suspense>
  )
}
