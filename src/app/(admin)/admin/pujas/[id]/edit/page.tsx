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
import { DynamicListInput } from "@/components/admin/DynamicListInput"
import { PujaPackagesInput, PujaPackage } from "@/components/admin/PujaPackagesInput"
import Link from "next/link"

export default function AdminPujaEdit() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  
  const [loading, setLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [temples, setTemples] = React.useState<any[]>([])

  const [formData, setFormData] = React.useState({
    title: "",
    category: "",
    temple_id: "",
    problem_statement: "",
    packages: [] as PujaPackage[],
    benefits: [] as string[],
    whats_included: [] as string[],
    ritual_process: [] as string[],
    image_url: "",
  })

  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [templesRes, pujaRes] = await Promise.all([
          supabase.from('temples').select('id, name').order('name'),
          supabase.from('pujas').select('*').eq('id', id).single()
        ])

        if (templesRes.data) setTemples(templesRes.data)
        
        if (pujaRes.data) {
          setFormData({
            title: pujaRes.data.title || "",
            category: pujaRes.data.category || "",
            temple_id: pujaRes.data.temple_id || "",
            problem_statement: pujaRes.data.problem_statement || "",
            packages: pujaRes.data.packages || [],
            benefits: pujaRes.data.benefits || [],
            whats_included: pujaRes.data.whats_included || [],
            ritual_process: pujaRes.data.ritual_process || [],
            image_url: pujaRes.data.image_url || "",
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({ type: "error", title: "Failed to load puja" })
        router.push('/admin/pujas')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) fetchInitialData()
  }, [id, supabase, router])

  const handleSave = async () => {
    if (!formData.title || !formData.temple_id || formData.packages.length === 0) {
      toast({ type: "error", title: "Missing fields", description: "Please fill in all required fields and add at least one package." })
      return
    }

    // Set legacy base_price and sale_price to the first package's prices for backward compatibility
    const defaultPackage = formData.packages[0]
    const dataToSave = {
      ...formData,
      base_price: defaultPackage?.base_price || 0,
      sale_price: defaultPackage?.sale_price || 0
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.from('pujas').update(dataToSave).eq('id', id)
      
      if (error) throw error
      
      toast({ type: "success", title: "Puja updated successfully" })
      router.push('/admin/pujas')
    } catch (error: any) {
      console.error("Error updating puja:", error)
      toast({ type: "error", title: "Failed to update", description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-4 sm:p-8 w-full max-w-5xl mx-auto pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/pujas" className="mr-4 p-2 rounded-full hover:bg-[var(--color-mandir-surface)] transition-colors">
            <ArrowLeft className="h-5 w-5 text-[var(--color-mandir-text)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">
              Edit Puja
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
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Puja Title *</label>
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
                  <label className="text-sm font-medium text-[var(--color-mandir-text)]">Category *</label>
                  <select 
                    className="w-full h-10 mt-1 rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] px-3 text-sm focus:ring-1 focus:ring-[var(--color-saffron-500)]"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Health">Health</option>
                    <option value="Wealth">Wealth</option>
                    <option value="Marriage">Marriage</option>
                    <option value="Career">Career</option>
                    <option value="Education">Education</option>
                    <option value="Protection">Protection</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Target Problem Statement</label>
                <Textarea 
                  value={formData.problem_statement}
                  onChange={(e) => setFormData({...formData, problem_statement: e.target.value})}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)] mb-2 block">Packages *</label>
                <PujaPackagesInput 
                  packages={formData.packages}
                  onChange={(pkgs) => setFormData({...formData, packages: pkgs})}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
            <CardHeader className="pb-3 border-b border-[var(--color-mandir-border)]">
              <CardTitle className="text-lg">Puja Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <DynamicListInput 
                label="Benefits (What devotee gets)"
                placeholder="e.g. Removes obstacles"
                value={formData.benefits}
                onChange={(val) => setFormData({...formData, benefits: val})}
              />
              <DynamicListInput 
                label="What's Included"
                placeholder="e.g. Personalized Sankalp"
                value={formData.whats_included}
                onChange={(val) => setFormData({...formData, whats_included: val})}
              />
              <DynamicListInput 
                label="Ritual Process"
                placeholder="e.g. Ganesh Sthapana"
                value={formData.ritual_process}
                onChange={(val) => setFormData({...formData, ritual_process: val})}
              />
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
        </div>
      </div>
    </div>
  )
}
