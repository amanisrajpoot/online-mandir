"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'

export default function ProfileSetupPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkUser()
  }, [router, supabase])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error("No user found")

      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name,
          phone,
        })

      if (error) {
        throw error
      }

      toast({
        type: 'success',
        title: 'Profile Updated',
        description: 'Your profile has been set up successfully.',
      })
      
      router.push('/')
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Profile Setup Failed',
        description: error.message || 'Could not save your profile. Please try again.',
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
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
          Complete Your Profile
        </h1>
        <p className="mt-2 text-[var(--color-mandir-text-muted)]">Just a few details to personalize your experience</p>
      </div>

      <Card>
        <CardContent className="pt-6">
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
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full mt-4" 
              variant="gradient"
              disabled={isLoading || !name || !phone}
            >
              {isLoading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
