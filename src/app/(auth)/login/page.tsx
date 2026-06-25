"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'

function LoginContent() {
  const [identifier, setIdentifier] = useState('')
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const isEmail = identifier.includes('@')
    let formattedIdentifier = identifier.trim()
    
    // For phone numbers, ensure they start with + and country code
    if (!isEmail) {
      formattedIdentifier = formattedIdentifier.replace(/\s+/g, '')
      if (formattedIdentifier.length === 10) {
        formattedIdentifier = '+91' + formattedIdentifier
      } else if (!formattedIdentifier.startsWith('+')) {
        formattedIdentifier = '+' + formattedIdentifier
      }
    }

    try {
      let error;
      
      if (isEmail) {
        const res = await supabase.auth.signInWithOtp({
          email: formattedIdentifier,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        error = res.error
      } else {
        const res = await supabase.auth.signInWithOtp({
          phone: formattedIdentifier,
        })
        error = res.error
      }

      if (error) {
        throw error
      }

      toast({
        type: 'success',
        title: 'OTP Sent Successfully',
        description: `Please check your ${isEmail ? 'email' : 'phone'} for the verification code.`,
      })
      
      // Store identifier for callback fallback (if needed)
      sessionStorage.setItem('auth_identifier', formattedIdentifier)
      sessionStorage.setItem('auth_type', isEmail ? 'email' : 'phone')
      
      const redirectUrl = searchParams.get('redirect')
      if (redirectUrl) {
        sessionStorage.setItem('auth_redirect', redirectUrl)
      } else {
        sessionStorage.removeItem('auth_redirect')
      }
      
      setStep('verify')
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Authentication Failed',
        description: error.message || 'Could not send OTP. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const isEmail = identifier.includes('@')
    let formattedIdentifier = identifier.trim()
    
    if (!isEmail) {
      formattedIdentifier = formattedIdentifier.replace(/\s+/g, '')
      if (formattedIdentifier.length === 10) {
        formattedIdentifier = '+91' + formattedIdentifier
      } else if (!formattedIdentifier.startsWith('+')) {
        formattedIdentifier = '+' + formattedIdentifier
      }
    }

    try {
      let result;
      if (isEmail) {
        result = await supabase.auth.verifyOtp({
          email: formattedIdentifier,
          token: otp,
          type: 'email',
        })
      } else {
        result = await supabase.auth.verifyOtp({
          phone: formattedIdentifier,
          token: otp,
          type: 'sms',
        })
      }
      
      const { data, error } = result;

      if (error) {
        throw error
      }

      toast({
        type: 'success',
        title: 'Verification Successful',
        description: 'Welcome to Vandanam!',
      })
      
      // Check if user has completed profile setup
      const { data: profile } = await supabase
        .from('users')
        .select('name')
        .eq('id', data.user?.id)
        .single()

      sessionStorage.removeItem('auth_identifier')
      sessionStorage.removeItem('auth_type')
      const redirectUrl = sessionStorage.getItem('auth_redirect')
      sessionStorage.removeItem('auth_redirect')
      
      if (!profile?.name) {
        router.refresh()
        if (redirectUrl) {
          router.push(`/profile-setup?redirect=${encodeURIComponent(redirectUrl)}`)
        } else {
          router.push('/profile-setup')
        }
      } else {
        router.refresh()
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          router.push('/')
        }
      }
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md relative z-10"
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-[var(--font-heading)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-temple-gold)] to-[var(--color-saffron-400)]">
          Vandanam
        </h1>
        <p className="mt-2 text-[var(--color-mandir-text-muted)]">Your digital gateway to the divine</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{step === 'request' ? 'Welcome Back' : 'Verify Your Identity'}</CardTitle>
          <CardDescription>
            {step === 'request' 
              ? 'Enter your email or phone number to receive a secure sign-in OTP.' 
              : `We've sent a code to ${identifier}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mounted ? (
            step === 'request' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="identifier" className="text-sm font-medium">Email or Phone Number</label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="devotee@example.com or 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="gradient"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending OTP...' : 'Get OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">One-Time Password</label>
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
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Button>
                <div className="mt-4 text-center">
                  <button 
                    type="button" 
                    onClick={() => { setStep('request'); setOtp(''); }} 
                    className="text-sm text-[var(--color-saffron-400)] hover:underline"
                  >
                    Change Email/Phone
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="h-[120px] flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[var(--color-saffron-500)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <p className="mt-6 text-center text-xs text-[var(--color-mandir-text-muted)]">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-[var(--color-saffron-500)] border-t-transparent rounded-full animate-spin"></div></div>}>
      <LoginContent />
    </Suspense>
  )
}
