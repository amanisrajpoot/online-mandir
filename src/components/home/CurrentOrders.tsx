"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Bell } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export function CurrentOrders() {
  const [orders, setOrders] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState<any>(null)
  const supabase = createClient()

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (!user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['booked', 'assigned', 'in_progress'])
          .order('created_at', { ascending: false })
          .limit(2)
        
        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error("Error fetching current orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [supabase.auth])

  if (loading || !user || orders.length === 0) return null

  return (
    <section className="w-full py-4 relative z-10 -mt-10 mb-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                <Card className="bg-gradient-to-r from-[var(--color-mandir-surface)] to-[#2a1b38] border-[#4a326b] shadow-xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-auspicious-green)]" />
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-auspicious-green)]/20 text-[var(--color-auspicious-green)] border border-[var(--color-auspicious-green)]/30">
                      <Bell className="h-6 w-6 animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-semibold truncate pr-2 text-white">
                          Your {order.order_type === 'puja' ? 'Puja' : 'Chadhava'} is scheduled
                        </h4>
                        <Badge variant="success" className="shrink-0 text-[10px] h-5">
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--color-mandir-text-muted)] truncate">
                        Order ID: {order.razorpay_order_id.substring(0, 12)}...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
