"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = React.useState<any[]>([])

  React.useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Simple auth check for demo purposes
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // In a real app, verify if user has admin role
        
        // Fetch stats
        const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
        const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
        const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['booked', 'assigned', 'in_progress'])
        
        const { data: revenueData } = await supabase.from('orders').select('amount').eq('status', 'completed')
        const totalRevenue = revenueData?.reduce((sum, order) => sum + order.amount, 0) || 0

        setStats({
          totalUsers: usersCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue,
          pendingOrders: pendingCount || 0
        })

        // Fetch recent orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            users (name, phone)
          `)
          .order('created_at', { ascending: false })
          .limit(5)

        if (ordersError) throw ordersError;

        // Fetch related items manually since item_id doesn't have an explicit foreign key
        const enrichedOrders = await Promise.all((ordersData || []).map(async (order) => {
          if (order.order_type === 'puja') {
            const { data: puja } = await supabase.from('pujas').select('title').eq('id', order.item_id).single()
            return { ...order, pujas: puja }
          } else {
            const { data: item } = await supabase.from('chadhava_items').select('title').eq('id', order.item_id).single()
            return { ...order, chadhava_items: item }
          }
        }))

        setRecentOrders(enrichedOrders)

      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [supabase, router])

  if (loading) return <div className="p-8">Loading dashboard...</div>

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">Admin Dashboard</h1>
        <p className="text-[var(--color-mandir-text-muted)]">Overview of platform metrics and recent activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-saffron-500)]/10 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-[var(--color-saffron-500)]" />
              </div>
              <Badge variant="outline" className="text-xs bg-[var(--color-auspicious-green)]/10 text-[var(--color-auspicious-green)] border-none">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </Badge>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-mandir-text-muted)] mb-1">Total Revenue</h3>
            <div className="text-2xl font-bold text-[var(--color-mandir-text)]">₹{stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-temple-gold)]/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[var(--color-temple-gold)]" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-mandir-text-muted)] mb-1">Total Orders</h3>
            <div className="text-2xl font-bold text-[var(--color-mandir-text)]">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-mandir-text-muted)] mb-1">Total Devotees</h3>
            <div className="text-2xl font-bold text-[var(--color-mandir-text)]">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-sacred-red)]/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[var(--color-sacred-red)]" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-mandir-text-muted)] mb-1">Pending Actions</h3>
            <div className="text-2xl font-bold text-[var(--color-mandir-text)]">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--color-mandir-border)] pb-4">
          <CardTitle className="text-xl">Recent Orders</CardTitle>
          <Link href="/admin/orders" className="text-sm text-[var(--color-saffron-500)] hover:underline">
            View All
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--color-mandir-text-muted)] uppercase bg-[var(--color-mandir-bg)]/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Devotee</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-mandir-border)]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--color-mandir-card-hover)] transition-colors">
                    <td className="px-6 py-4 font-medium font-mono text-xs">
                      {(order.cashfree_order_id || order.razorpay_order_id || '').substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={order.order_type === 'puja' ? 'secondary' : 'default'} className="text-[10px]">
                        {order.order_type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--color-mandir-text)]">{order.users?.name || 'Unknown'}</div>
                      <div className="text-xs text-[var(--color-mandir-text-muted)]">{order.users?.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{order.amount}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`text-xs capitalize ${
                        order.status === 'completed' ? 'text-[var(--color-auspicious-green)] border-[var(--color-auspicious-green)]' : 
                        order.status === 'booked' ? 'text-blue-400 border-blue-400' : 
                        order.status === 'pending' ? 'text-[var(--color-sacred-red)] border-[var(--color-sacred-red)]' : 
                        'text-[var(--color-saffron-500)] border-[var(--color-saffron-500)]'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-[var(--color-saffron-400)] hover:text-[var(--color-saffron-500)]">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <div className="text-center py-8 text-[var(--color-mandir-text-muted)]">
                No orders found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
