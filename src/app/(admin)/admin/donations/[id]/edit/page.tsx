"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "@/components/ui/Toast"
import { ImageUpload } from "@/components/ui/ImageUpload"
import Link from "next/link"

export default function AdminDonationEdit({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const supabase = createClient()
  const [isSaving, setIsSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const [formData, setFormData] = React.useState({
    category: "",
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    min_amount: 1,
    impact_statement: "",
    display_order: 99,
    suggested_amounts: "51, 101, 251, 501, 1001, 2101, 5100" 
  })

  // Unwrap params in useEffect
  const unwrappedParams = React.use(params as Promise<{ id: string }>)
  const id = unwrappedParams.id

  React.useEffect(() => {
    const fetchDonation = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        
        if (data) {
          setFormData({
            category: data.category || "",
            title: data.title || "",
            subtitle: data.subtitle || "",
            description: data.description || "",
            image_url: data.image_url || "",
            min_amount: data.min_amount || 1,
            impact_statement: data.impact_statement || "",
            display_order: data.display_order || 99,
            suggested_amounts: data.suggested_amounts ? data.suggested_amounts.join(', ') : "51, 101, 251, 501, 1001"
          })
        }
      } catch (error) {
        console.error("Error fetching donation:", error)
        toast({ type: "error", title: "Failed to load donation" })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchDonation()
    }
  }, [id, supabase])

  const handleSave = async () => {
    if (!formData.category || !formData.title) {
      toast({ type: "error", title: "Missing fields", description: "Category slug and title are required." })
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        ...formData,
        suggested_amounts: formData.suggested_amounts.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
      }

      const { error } = await supabase
        .from('donations')
        .update(payload)
        .eq('id', id)
      
      if (error) throw error
      
      toast({ type: "success", title: "Donation category updated" })
      router.push('/admin/donations')
    } catch (error: any) {
      console.error("Error updating donation:", error)
      toast({ type: "error", title: "Failed to update", description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/donations" className="mr-4 p-2 rounded-full hover:bg-[var(--color-mandir-surface)] transition-colors">
            <ArrowLeft className="h-5 w-5 text-[var(--color-mandir-text)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              Edit Donation Category
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-mandir-text)]">Title * (e.g. भंडारा • Bhandara)</label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-mandir-text)]">Category Slug * (e.g. bhandara)</label>
                  <Input 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Subtitle</label>
                <Input 
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="mt-1"
                />
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

          <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
              <CardTitle className="text-lg">Donation Amounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Suggested Amounts (Comma separated)</label>
                <Input 
                  value={formData.suggested_amounts}
                  onChange={(e) => setFormData({...formData, suggested_amounts: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Minimum Amount (₹)</label>
                <Input 
                  type="number"
                  value={formData.min_amount}
                  onChange={(e) => setFormData({...formData, min_amount: parseInt(e.target.value) || 1})}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
              <CardTitle className="text-lg">Settings & Impact</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Cover Image</label>
                <div className="mt-1">
                  <ImageUpload
                    value={formData.image_url ? [formData.image_url] : []}
                    onChange={(url) => setFormData({...formData, image_url: Array.isArray(url) ? url[0] : url})}
                    onRemove={() => setFormData({...formData, image_url: ""})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Impact Statement</label>
                <Textarea 
                  value={formData.impact_statement}
                  onChange={(e) => setFormData({...formData, impact_statement: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Display Order</label>
                <Input 
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 99})}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
