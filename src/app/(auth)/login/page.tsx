"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      toast({
        type: 'success',
        title: 'OTP Sent Successfully',
        description: 'Please check your email for the verification code.',
      })
      
      // Store email and redirect intent for verification page
      sessionStorage.setItem('auth_email', email)
      const redirectUrl = searchParams.get('redirect')
      if (redirectUrl) {
        sessionStorage.setItem('auth_redirect', redirectUrl)
      } else {
        sessionStorage.removeItem('auth_redirect')
      }
      
      router.push('/verify')
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
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your email to receive a secure sign-in link and OTP.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="devotee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
