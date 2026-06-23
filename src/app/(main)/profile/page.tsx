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
  const [editPhone, setEditPhone] = React.useState("")

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
          setEditPhone(profileData.phone || "")
        }

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            pujas (*),
            chadhava_items (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!ordersError && ordersData) {
          setOrders(ordersData)
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
      const { error } = await supabase
        .from('users')
        .update({
          name: editName,
          phone: editPhone
        })
        .eq('id', user.id)

      if (error) throw error
      
      setProfile({ ...profile, name: editName, phone: editPhone })
      toast({ type: "success", title: "Profile Updated" })
    } catch (error: any) {
      toast({ type: "error", title: "Update Failed", description: error.message })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
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
                          value={user?.email}
                          disabled
                          className="bg-[var(--color-mandir-bg)] opacity-70"
                        />
                        <p className="text-xs flex items-center text-[var(--color-auspicious-green)] mt-1">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Email verified
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-mandir-text-muted)]">WhatsApp Number</label>
                        <Input 
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                        />
                      </div>
                      
                      <Button type="submit" variant="gradient" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
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
