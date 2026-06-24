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

export default function AdminTempleNew() {
  const router = useRouter()
  const supabase = createClient()
  const [isSaving, setIsSaving] = React.useState(false)

  const [formData, setFormData] = React.useState({
    name: "",
    location: "",
    deity: "",
    description: "",
    image_url: "",
    gallery_urls: [] as string[]
  })

  const handleSave = async () => {
    if (!formData.name || !formData.location || !formData.deity) {
      toast({ type: "error", title: "Missing fields", description: "Please fill in all required fields." })
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.from('temples').insert([formData])
      
      if (error) throw error
      
      toast({ type: "success", title: "Temple created successfully" })
      router.push('/admin/temples')
    } catch (error: any) {
      console.error("Error saving temple:", error)
      toast({ type: "error", title: "Failed to save", description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/temples" className="mr-4 p-2 rounded-full hover:bg-[var(--color-mandir-surface)] transition-colors">
            <ArrowLeft className="h-5 w-5 text-[var(--color-mandir-text)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              Add New Temple
            </h1>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} variant="gradient">
          <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Temple"}
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
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Temple Name *</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Kashi Vishwanath" 
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-mandir-text)]">Location *</label>
                  <Input 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Varanasi, UP" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-mandir-text)]">Main Deity *</label>
                  <Input 
                    value={formData.deity}
                    onChange={(e) => setFormData({...formData, deity: e.target.value})}
                    placeholder="e.g. Lord Shiva" 
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Description</label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Write a brief description..." 
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
              <CardTitle className="text-lg">Main Image</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ImageUpload
                value={formData.image_url ? [formData.image_url] : []}
                onChange={(url) => setFormData({...formData, image_url: Array.isArray(url) ? url[0] : url})}
                onRemove={() => setFormData({...formData, image_url: ""})}
              />
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
              <CardTitle className="text-lg">Gallery Images</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ImageUpload
                multiple
                value={formData.gallery_urls}
                onChange={(urls) => setFormData({...formData, gallery_urls: urls as string[]})}
                onRemove={(url) => setFormData({
                  ...formData, 
                  gallery_urls: formData.gallery_urls.filter((u) => u !== url)
                })}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
