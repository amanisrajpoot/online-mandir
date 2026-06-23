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
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('auth_email')
    if (!storedEmail) {
      router.push('/login')
    } else {
      setEmail(storedEmail)
    }
  }, [router])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })

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

      sessionStorage.removeItem('auth_email')
      
      if (!profile?.name) {
        router.push('/profile-setup')
      } else {
        router.push('/')
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
            We've sent a 6-digit code to <span className="font-semibold text-[var(--color-mandir-text)]">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">One-Time Password</label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
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
