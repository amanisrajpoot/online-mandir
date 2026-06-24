"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { ArrowLeft } from 'lucide-react'

export default function VerifyPage() {
  const [identifier, setIdentifier] = useState('')
  const [authType, setAuthType] = useState<'email'|'sms'>('email')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const storedIdentifier = sessionStorage.getItem('auth_identifier')
    const storedType = sessionStorage.getItem('auth_type') as 'email' | 'phone' | null
    
    // Fallback for older sessions
    const fallbackEmail = sessionStorage.getItem('auth_email')
    
    if (!storedIdentifier && !fallbackEmail) {
      router.push('/login')
    } else {
      setIdentifier(storedIdentifier || fallbackEmail || '')
      if (storedType === 'phone') {
        setAuthType('sms')
      } else {
        setAuthType('email')
      }
    }
  }, [router])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let result;
      if (authType === 'email') {
        result = await supabase.auth.verifyOtp({
          email: identifier,
          token: otp,
          type: 'email',
        })
      } else {
        result = await supabase.auth.verifyOtp({
          phone: identifier,
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
      sessionStorage.removeItem('auth_email') // clean up old key if exists
      const redirectUrl = sessionStorage.getItem('auth_redirect')
      sessionStorage.removeItem('auth_redirect')
      
      if (!profile?.name) {
        // If they have a redirect URL but need profile setup, we could pass it along
        // but for now, profile setup is mandatory before booking.
        // We'll pass it to profile-setup so it can redirect after completion.
        if (redirectUrl) {
          router.push(`/profile-setup?redirect=${encodeURIComponent(redirectUrl)}`)
        } else {
          router.push('/profile-setup')
        }
      } else {
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

  const handleBack = () => {
    router.push('/login')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md relative z-10"
    >
      <button 
        onClick={handleBack}
        className="mb-6 flex items-center text-sm font-medium text-[var(--color-mandir-text-muted)] hover:text-[var(--color-saffron-400)] transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Login
      </button>

      <Card>
        <CardHeader>
          <CardTitle>Verify Your Identity</CardTitle>
          <CardDescription>
            We've sent a code to <span className="font-semibold text-[var(--color-mandir-text)]">{identifier}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          </form>
          
          <div className="mt-4 text-center">
            <button className="text-sm text-[var(--color-saffron-400)] hover:underline">
              Didn't receive the code? Resend
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
