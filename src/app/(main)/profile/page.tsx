"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Heart,
  ChevronRight,
  ShieldCheck
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { toast } from "@/components/ui/Toast"
import { OrderCard } from "@/components/profile/OrderCard"

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<div className="flex justify-center items-center h-[50vh]">Loading profile...</div>}>
      <ProfileContent />
    </React.Suspense>
  )
}

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'profile'
  
  const [activeTab, setActiveTab] = React.useState(defaultTab)
  const [user, setUser] = React.useState<any>(null)
  const [profile, setProfile] = React.useState<any>(null)
  const [orders, setOrders] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const supabase = createClient()

  // Form states
  const [editName, setEditName] = React.useState("")
  const [editEmail, setEditEmail] = React.useState("")
  const [editPhone, setEditPhone] = React.useState("")

  // OTP states
  const [otpMode, setOtpMode] = React.useState<'email' | 'phone' | null>(null)
  const [otp, setOtp] = React.useState("")

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }
        
        setUser(user)

        // Fetch profile
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileData) {
          setProfile(profileData)
          setEditName(profileData.name || "")
          setEditPhone(user.phone || profileData.phone || "")
          setEditEmail(user.email || "")
        }

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!ordersError && ordersData) {
          const enrichedOrders = await Promise.all(ordersData.map(async (order) => {
            if (order.order_type === 'puja') {
              const { data: puja } = await supabase.from('pujas').select('*').eq('id', order.item_id).single()
              return { ...order, pujas: puja }
            } else if (order.order_type === 'chadhava') {
              const { data: item } = await supabase.from('chadhava_items').select('*').eq('id', order.item_id).single()
              return { ...order, chadhava_items: item }
            }
            return order
          }))
          setOrders(enrichedOrders)
        }

      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      let emailChanged = editEmail !== (user.email || "")
      let formattedPhone = editPhone.replace(/\s+/g, '')
      if (formattedPhone && formattedPhone.length === 10) {
        formattedPhone = '+91' + formattedPhone
      } else if (formattedPhone && !formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone
      }
      let phoneChanged = formattedPhone !== (user.phone || "")

      if (emailChanged && phoneChanged) {
        toast({ type: 'error', title: 'Action not allowed', description: 'Please update your email and phone number one at a time.' })
        setSaving(false)
        return
      }

      if (emailChanged) {
        const { error } = await supabase.auth.updateUser({ email: editEmail })
        if (error) {
          if (error.message.toLowerCase().includes('registered') || error.message.toLowerCase().includes('taken')) {
            toast({ type: 'error', title: 'Email Taken', description: 'This email is already associated with another account. Please log in with that account instead.' })
            setSaving(false)
            return
          }
          throw error
        }
        setOtpMode('email')
        toast({ type: 'success', title: 'Verification sent', description: `An OTP was sent to ${editEmail}.` })
        setSaving(false)
        return
      }

      if (phoneChanged) {
        const { error } = await supabase.auth.updateUser({ phone: formattedPhone })
        if (error) {
           if (error.message.toLowerCase().includes('registered') || error.message.toLowerCase().includes('taken')) {
             toast({ type: 'error', title: 'Phone Taken', description: 'This phone is already associated with another account. Please log in with that account instead.' })
             setSaving(false)
             return
           }
           throw error
        }
        setOtpMode('phone')
        toast({ type: 'success', title: 'Verification sent', description: `An OTP was sent to ${formattedPhone}.` })
        setSaving(false)
        return
      }

      // If neither email nor phone changed, just update public.users
      const { error } = await supabase
        .from('users')
        .update({
          name: editName,
        })
        .eq('id', user.id)

      if (error) throw error
      
      setProfile({ ...profile, name: editName })
      toast({ type: "success", title: "Profile Updated" })
    } catch (error: any) {
      toast({ type: "error", title: "Update Failed", description: error.message })
    } finally {
      setSaving(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const type = otpMode === 'email' ? 'email_change' : 'phone_change'
      let identifier = otpMode === 'email' ? editEmail : editPhone
      if (otpMode === 'phone') {
        identifier = identifier.replace(/\s+/g, '')
        if (identifier.length === 10) identifier = '+91' + identifier
        else if (!identifier.startsWith('+')) identifier = '+' + identifier
      }

      const verifyParams: any = {
        token: otp,
        type: type
      }
      if (otpMode === 'email') verifyParams.email = identifier
      else verifyParams.phone = identifier

      const { data: { user }, error } = await supabase.auth.verifyOtp(verifyParams)

      if (error) throw error
      if (!user) throw new Error("Verification failed")

      // Sync public.users
      const { error: dbError } = await supabase
        .from('users')
        .update({
          name: editName,
          ...(otpMode === 'phone' && { phone: identifier })
        })
        .eq('id', user.id)

      if (dbError) throw dbError

      setUser(user)
      setProfile({ ...profile, name: editName, ...(otpMode === 'phone' && { phone: identifier }) })
      setOtpMode(null)
      setOtp("")
      toast({ type: "success", title: "Profile Updated", description: `Your ${otpMode} was successfully verified and updated.` })
      
    } catch (error: any) {
      toast({ type: 'error', title: 'Verification Failed', description: error.message || 'Invalid OTP. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]">Loading...</div>
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[var(--color-mandir-surface)] rounded-2xl border border-[var(--color-mandir-border)] shadow-md overflow-hidden sticky top-24">
            <div className="p-6 bg-gradient-to-b from-[var(--color-saffron-500)]/10 to-transparent text-center border-b border-[var(--color-mandir-border)]">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--color-temple-gold)] to-[var(--color-saffron-500)] flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : <User />}
              </div>
              <h2 className="text-lg font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
                {profile?.name || "Devotee"}
              </h2>
              <p className="text-xs text-[var(--color-mandir-text-muted)] truncate">
                {user?.email}
              </p>
            </div>
            
            <div className="p-2 flex flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-colors text-sm font-medium ${
                      isActive 
                        ? "bg-[var(--color-saffron-500)] text-white shadow-md" 
                        : "text-[var(--color-mandir-text-muted)] hover:bg-[var(--color-mandir-card-hover)] hover:text-[var(--color-mandir-text)]"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`w-4 h-4 mr-3 ${isActive ? "text-white" : ""}`} />
                      {tab.label}
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                )
              })}
              
              <div className="h-px bg-[var(--color-mandir-border)] my-2 mx-3"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-xl transition-colors text-sm font-medium text-[var(--color-sacred-red)] hover:bg-[var(--color-sacred-red)]/10"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-[var(--font-heading)]">Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {otpMode ? (
                      <form onSubmit={handleVerifyOtp} className="space-y-6 max-w-md">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--color-mandir-text-muted)]">Verification Code</label>
                          <p className="text-xs text-[var(--color-mandir-text-muted)] mb-2">
                            Enter the code sent to <span className="font-medium text-[var(--color-mandir-text)]">{otpMode === 'email' ? editEmail : editPhone}</span> to verify this change.
                          </p>
                          <Input
                            type="text"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={8}
                            required
                            disabled={saving}
                            className="text-center text-2xl tracking-widest font-mono"
                          />
                        </div>
                        <Button type="submit" variant="gradient" className="w-full" disabled={saving || otp.length < 6}>
                          {saving ? "Verifying..." : "Verify & Save"}
                        </Button>
                        <div className="mt-4 text-center">
                          <button 
                            type="button" 
                            onClick={() => { setOtpMode(null); setOtp(''); }} 
                            className="text-sm text-[var(--color-saffron-400)] hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--color-mandir-text-muted)]">Full Name</label>
                          <Input 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--color-mandir-text-muted)]">Email Address</label>
                          <Input 
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder={user?.email ? "" : "Enter your email address"}
                          />
                          {user?.email === editEmail && user?.email ? (
                            <p className="text-xs flex items-center text-[var(--color-auspicious-green)] mt-1">
                              <ShieldCheck className="w-3 h-3 mr-1" /> Email verified
                            </p>
                          ) : editEmail !== (user?.email || "") ? (
                            <p className="text-xs text-[var(--color-saffron-500)] mt-1">
                              Requires verification via OTP.
                            </p>
                          ) : (
                            <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
                              You logged in via phone number. Link an email to secure your account.
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--color-mandir-text-muted)]">WhatsApp Number</label>
                          <Input 
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="10-digit mobile number"
                          />
                          {user?.phone === editPhone && user?.phone ? (
                            <p className="text-xs flex items-center text-[var(--color-auspicious-green)] mt-1">
                              <ShieldCheck className="w-3 h-3 mr-1" /> Phone verified
                            </p>
                          ) : editPhone !== (user?.phone || "") && editPhone.length >= 10 ? (
                            <p className="text-xs text-[var(--color-saffron-500)] mt-1">
                              Requires verification via OTP.
                            </p>
                          ) : !user?.phone ? (
                            <p className="text-xs text-[var(--color-sacred-red)] mt-1 font-medium">
                              This phone number is unverified. Please verify a phone number to secure your account.
                            </p>
                          ) : (
                            <p className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
                              Update your number to trigger a verification code.
                            </p>
                          )}
                        </div>
                        
                        <Button type="submit" variant="gradient" disabled={saving || (editEmail === (user?.email || "") && editPhone === (user?.phone || "") && editName === profile?.name)}>
                          {saving ? "Saving..." : (editEmail !== (user?.email || "") || editPhone !== (user?.phone || "")) ? "Verify & Save Changes" : "Save Changes"}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-6">
                  My Bookings & Offerings
                </h2>
                
                {orders.length === 0 ? (
                  <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)] text-center py-16">
                    <CardContent>
                      <ShoppingBag className="w-16 h-16 mx-auto text-[var(--color-mandir-text-muted)] mb-4" />
                      <h3 className="text-xl font-medium text-[var(--color-mandir-text)] mb-2">No orders yet</h3>
                      <p className="text-[var(--color-mandir-text-muted)] mb-6">You haven't booked any pujas or offered chadhava yet.</p>
                      <Button onClick={() => router.push('/pujas')} variant="gradient">
                        Browse Pujas
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Other tabs placeholder */}
            {(activeTab === 'favorites' || activeTab === 'settings') && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center h-64 text-[var(--color-mandir-text-muted)]"
              >
                {activeTab === 'favorites' ? <Heart className="w-12 h-12 mb-4 opacity-50" /> : <Settings className="w-12 h-12 mb-4 opacity-50" />}
                <p>This feature is coming soon.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
