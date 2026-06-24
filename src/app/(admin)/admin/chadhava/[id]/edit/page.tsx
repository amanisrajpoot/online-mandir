"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "@/components/ui/Toast"
import { ImageUpload } from "@/components/ui/ImageUpload"
import Link from "next/link"

export default function AdminChadhavaEdit() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  
  const [loading, setLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [temples, setTemples] = React.useState<any[]>([])

  const [formData, setFormData] = React.useState({
    title: "",
    temple_id: "",
    description: "",
    price: 0,
    image_url: "",
  })

  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [templesRes, itemRes] = await Promise.all([
          supabase.from('temples').select('id, name').order('name'),
          supabase.from('chadhava_items').select('*').eq('id', id).single()
        ])

        if (templesRes.data) setTemples(templesRes.data)
        
        if (itemRes.data) {
          setFormData({
            title: itemRes.data.title || "",
            temple_id: itemRes.data.temple_id || "",
            description: itemRes.data.description || "",
            price: itemRes.data.price || 0,
            image_url: itemRes.data.image_url || "",
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({ type: "error", title: "Failed to load item" })
        router.push('/admin/chadhava')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) fetchInitialData()
  }, [id, supabase, router])

  const handleSave = async () => {
    if (!formData.title || !formData.temple_id || !formData.price) {
      toast({ type: "error", title: "Missing fields", description: "Please fill in all required fields." })
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.from('chadhava_items').update(formData).eq('id', id)
      
      if (error) throw error
      
      toast({ type: "success", title: "Item updated successfully" })
      router.push('/admin/chadhava')
    } catch (error: any) {
      console.error("Error updating item:", error)
      toast({ type: "error", title: "Failed to update", description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/chadhava" className="mr-4 p-2 rounded-full hover:bg-[var(--color-mandir-surface)] transition-colors">
            <ArrowLeft className="h-5 w-5 text-[var(--color-mandir-text)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              Edit Chadhava Item
            </h1>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} variant="gradient">
          <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
              <CardTitle className="text-lg">Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Item Title *</label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-mandir-text)]">Temple *</label>
                  <select 
                    className="w-full h-10 mt-1 rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] px-3 text-sm focus:ring-1 focus:ring-[var(--color-saffron-500)]"
                    value={formData.temple_id}
                    onChange={(e) => setFormData({...formData, temple_id: e.target.value})}
                  >
                    {temples.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-mandir-text)]">Price (₹) *</label>
                  <Input 
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Description</label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
              <CardTitle className="text-lg">Image</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ImageUpload
                value={formData.image_url ? [formData.image_url] : []}
                onChange={(url) => setFormData({...formData, image_url: Array.isArray(url) ? url[0] : url})}
                onRemove={() => setFormData({...formData, image_url: ""})}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
