"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft,
  User,
  ShoppingBag,
  MapPin,
  Video,
  Upload,
  CheckCircle2,
  Package
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { toast } from "@/components/ui/Toast"

export default function AdminOrderDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const supabase = createClient()
  
  const [loading, setLoading] = React.useState(true)
  const [order, setOrder] = React.useState<any>(null)
  const [sankalp, setSankalp] = React.useState<any>(null)
  const [delivery, setDelivery] = React.useState<any>(null)
  
  // Forms
  const [videoUrl, setVideoUrl] = React.useState("")
  const [updating, setUpdating] = React.useState(false)

  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // 1. Fetch Order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            users (name, phone, email),
            pujas (*),
            chadhava_items (*)
          `)
          .eq('id', id)
          .single()
          
        if (orderError) throw orderError
        setOrder(orderData)
        setVideoUrl(orderData.video_url || "")

        // 2. If Puja, fetch Sankalp & Delivery
        if (orderData.order_type === 'puja') {
          const { data: sankalpData } = await supabase
            .from('sankalp_details')
            .select('*')
            .eq('order_id', id)
            .single()
            
          setSankalp(sankalpData)

          const { data: deliveryData } = await supabase
            .from('prasad_delivery')
            .select('*')
            .eq('order_id', id)
            .single()
            
          setDelivery(deliveryData)
        }

      } catch (error) {
        console.error("Error fetching order details:", error)
        toast({ type: "error", title: "Failed to load order" })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOrderDetails()
    }
  }, [id, supabase])

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      setOrder({ ...order, status: newStatus })
      toast({ type: "success", title: "Status Updated", description: `Order status changed to ${newStatus}` })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({ type: "error", title: "Update Failed" })
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveVideoUrl = async () => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ video_url: videoUrl, status: 'video_uploaded' })
        .eq('id', id)

      if (error) throw error
      
      setOrder({ ...order, video_url: videoUrl, status: 'video_uploaded' })
      toast({ type: "success", title: "Video Saved", description: "Proof video link updated." })
    } catch (error) {
      console.error("Error saving video:", error)
      toast({ type: "error", title: "Save Failed" })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="p-8">Loading order details...</div>
  if (!order) return <div className="p-8">Order not found.</div>

  const isPuja = order.order_type === 'puja'
  const serviceDetails = isPuja ? order.pujas : order.chadhava_items

  return (
    <div className="p-4 sm:p-8 w-full max-w-5xl mx-auto pb-24">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-[var(--color-mandir-surface)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[var(--color-mandir-text)]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] flex items-center gap-3">
            Order Details
            <Badge variant="outline" className={`capitalize ${
              order.status === 'completed' ? 'text-[var(--color-auspicious-green)] border-[var(--color-auspicious-green)]' : 
              'text-[var(--color-saffron-500)] border-[var(--color-saffron-500)]'
            }`}>
              {order.status.replace('_', ' ')}
            </Badge>
          </h1>
          <p className="text-sm font-mono text-[var(--color-mandir-text-muted)] mt-1">ID: {order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Service Info */}
          <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
              <CardTitle className="text-lg flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-[var(--color-saffron-500)]" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={serviceDetails?.image_url} 
                  alt={serviceDetails?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Badge variant={isPuja ? 'secondary' : 'default'} className="mb-2">
                  {order.order_type.toUpperCase()}
                </Badge>
                <h3 className="font-bold text-lg text-[var(--color-mandir-text)]">{serviceDetails?.title}</h3>
                {order.package_details && (
                  <div className="text-sm font-medium text-[var(--color-saffron-600)] mt-1">
                    Package: {order.package_details.name}
                  </div>
                )}
                <div className="text-2xl font-bold text-[var(--color-mandir-text)] mt-2">₹{order.amount}</div>
                <div className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
                  Payment Ref: {order.razorpay_payment_id || order.cashfree_order_id}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sankalp Details (if Puja) */}
          {isPuja && sankalp && (
            <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
              <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
                <CardTitle className="text-lg flex items-center">
                  <User className="w-5 h-5 mr-2 text-[var(--color-saffron-500)]" />
                  Sankalp Details (For Panditji)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[var(--color-mandir-text-muted)]">Full Name</div>
                  <div className="font-medium text-lg">{sankalp.full_name}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-mandir-text-muted)]">Gotra</div>
                  <div className="font-medium">{sankalp.gotra || 'Not provided'}</div>
                </div>
                {sankalp.family_members && sankalp.family_members.length > 0 && (
                  <div className="col-span-2">
                    <div className="text-xs text-[var(--color-mandir-text-muted)]">Family Members</div>
                    <div className="font-medium">{sankalp.family_members.join(', ')}</div>
                  </div>
                )}
                {sankalp.additional_members && sankalp.additional_members.length > 0 && (
                  <div className="col-span-2">
                    <div className="text-xs text-[var(--color-mandir-text-muted)]">Additional Members</div>
                    <div className="font-medium">{sankalp.additional_members.join(', ')}</div>
                  </div>
                )}
                {sankalp.problem_description && (
                  <div className="col-span-2 p-3 bg-[var(--color-mandir-bg)] rounded-md border border-[var(--color-mandir-border)]">
                    <div className="text-xs text-[var(--color-mandir-text-muted)] mb-1">Special Request / Problem</div>
                    <div className="text-sm italic">&quot;{sankalp.problem_description}&quot;</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Video Upload Section */}
          <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
              <CardTitle className="text-lg flex items-center">
                <Video className="w-5 h-5 mr-2 text-[var(--color-saffron-500)]" />
                Proof of Service (Video URL)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="https://youtube.com/... or Google Drive link"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveVideoUrl} disabled={updating} variant="gradient">
                  <Upload className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
              <p className="text-xs text-[var(--color-mandir-text-muted)] mt-2">
                Providing this URL will automatically update the status to "Video Uploaded" and notify the user.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Status & Customer */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Action Panel */}
          <Card className="border-[var(--color-saffron-500)]/50 shadow-[0_0_15px_rgba(251,146,60,0.1)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)] bg-gradient-to-r from-[var(--color-mandir-surface)] to-[#2a1b38]">
              <CardTitle className="text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <Button 
                variant="outline" 
                className={`w-full justify-start ${order.status === 'in_progress' ? 'border-[var(--color-saffron-500)] text-[var(--color-saffron-500)]' : ''}`}
                onClick={() => handleUpdateStatus('in_progress')}
                disabled={updating}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark In Progress
              </Button>
              {isPuja && (
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${order.status === 'prasad_shipped' ? 'border-[var(--color-saffron-500)] text-[var(--color-saffron-500)]' : ''}`}
                  onClick={() => handleUpdateStatus('prasad_shipped')}
                  disabled={updating}
                >
                  <Package className="w-4 h-4 mr-2" /> Mark Prasad Shipped
                </Button>
              )}
              <Button 
                variant="outline" 
                className={`w-full justify-start border-[var(--color-auspicious-green)]/50 hover:bg-[var(--color-auspicious-green)]/10 text-[var(--color-auspicious-green)]`}
                onClick={() => handleUpdateStatus('completed')}
                disabled={updating}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
              </Button>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2 text-[var(--color-saffron-500)]" />
                Customer Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm">
              <div>
                <div className="text-[var(--color-mandir-text-muted)] text-xs">Name</div>
                <div className="font-medium">{order.users?.name || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-[var(--color-mandir-text-muted)] text-xs">WhatsApp / Phone</div>
                <div className="font-medium">{order.users?.phone || '-'}</div>
                <a href={`https://wa.me/${order.users?.phone?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-auspicious-green)] hover:underline mt-1 inline-block">
                  Open in WhatsApp
                </a>
              </div>
              <div>
                <div className="text-[var(--color-mandir-text-muted)] text-xs">Email</div>
                <div className="font-medium">{order.users?.email || '-'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address (if Puja) */}
          {isPuja && delivery && (
            <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
              <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-[var(--color-saffron-500)]" />
                  Prasad Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <p className="whitespace-pre-wrap">{delivery.address}</p>
                <p className="mt-2 text-[var(--color-mandir-text-muted)]">Alt Phone: {delivery.phone}</p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
