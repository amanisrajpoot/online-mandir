"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  Filter,
  MoreVertical,
  CheckCircle2,
  Video
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { toast } from "@/components/ui/Toast"

export default function AdminOrdersList() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = React.useState(true)
  const [orders, setOrders] = React.useState<any[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  React.useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          users (name, phone),
          pujas (title),
          chadhava_items (title)
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query
      if (error) throw error
      
      // Client-side search for simplicity in this demo
      let filteredData = data || []
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase()
        filteredData = filteredData.filter(o => 
          o.razorpay_order_id.toLowerCase().includes(lowerQ) ||
          (o.users?.name || '').toLowerCase().includes(lowerQ) ||
          (o.users?.phone || '').includes(lowerQ)
        )
      }

      setOrders(filteredData)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({ type: "error", title: "Failed to load orders" })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrders()
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      
      toast({ type: "success", title: "Status Updated", description: `Order status changed to ${newStatus}` })
      fetchOrders()
    } catch (error) {
      console.error("Error updating status:", error)
      toast({ type: "error", title: "Update Failed" })
    }
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">Manage Orders</h1>
          <p className="text-[var(--color-mandir-text-muted)]">Track and update user bookings and offerings.</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-mandir-text-muted)]" />
          <Input 
            placeholder="Search by Order ID, Name, or Phone..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="hidden">Search</button>
        </form>
        
        <div className="flex gap-2">
          <select 
            className="h-10 rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] px-3 py-2 text-sm text-[var(--color-mandir-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-saffron-500)]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="video_uploaded">Video Uploaded</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--color-mandir-text-muted)] uppercase bg-[var(--color-mandir-bg)]/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Order Details</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-mandir-border)]">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--color-mandir-text-muted)]">Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--color-mandir-text-muted)]">No orders found matching criteria.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--color-mandir-card-hover)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs mb-1">{order.razorpay_order_id}</div>
                        <div className="text-xs text-[var(--color-mandir-text-muted)]">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[var(--color-mandir-text)]">{order.users?.name || 'Unknown'}</div>
                        <div className="text-xs text-[var(--color-mandir-text-muted)]">{order.users?.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={order.order_type === 'puja' ? 'secondary' : 'default'} className="text-[10px] mb-1">
                          {order.order_type.toUpperCase()}
                        </Badge>
                        <div className="font-medium text-[var(--color-mandir-text)] line-clamp-1 max-w-[200px]">
                          {order.order_type === 'puja' ? order.pujas?.title : order.chadhava_items?.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          className={`text-xs capitalize px-2 py-1 rounded-md font-medium border ${
                            order.status === 'completed' ? 'text-[var(--color-auspicious-green)] border-[var(--color-auspicious-green)] bg-[var(--color-auspicious-green)]/10' : 
                            order.status === 'booked' ? 'text-blue-400 border-blue-400 bg-blue-400/10' : 
                            'text-[var(--color-saffron-500)] border-[var(--color-saffron-500)] bg-[var(--color-saffron-500)]/10'
                          }`}
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="booked">Booked</option>
                          <option value="assigned">Assigned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="video_uploaded">Video Uploaded</option>
                          <option value="prasad_shipped">Prasad Shipped</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="h-8">Details</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
