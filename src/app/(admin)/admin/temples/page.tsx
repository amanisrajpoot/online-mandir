"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Search, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { toast } from "@/components/ui/Toast"
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal"

export default function AdminTemplesList() {
  const supabase = createClient()
  const [temples, setTemples] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchTemples()
  }, [])

  const fetchTemples = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTemples(data || [])
    } catch (error) {
      console.error("Error fetching temples:", error)
      toast({ type: "error", title: "Failed to load temples" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const { error } = await supabase.from('temples').delete().eq('id', deleteId)
      if (error) throw error
      
      toast({ type: "success", title: "Temple deleted" })
      setTemples(temples.filter(t => t.id !== deleteId))
    } catch (error) {
      console.error("Error deleting temple:", error)
      toast({ type: "error", title: "Failed to delete" })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const filteredTemples = temples.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">Manage Temples</h1>
          <p className="text-[var(--color-mandir-text-muted)]">View and manage all temples on the platform.</p>
        </div>
        <Link href="/admin/temples/new">
          <Button variant="gradient">
            <Plus className="w-4 h-4 mr-2" /> Add Temple
          </Button>
        </Link>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-mandir-text-muted)]" />
        <Input 
          placeholder="Search temples..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--color-mandir-text-muted)] uppercase bg-[var(--color-mandir-bg)]/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Temple</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Deity</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-mandir-border)]">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--color-mandir-text-muted)]">Loading temples...</td></tr>
                ) : filteredTemples.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--color-mandir-text-muted)]">No temples found.</td></tr>
                ) : (
                  filteredTemples.map((temple) => (
                    <tr key={temple.id} className="hover:bg-[var(--color-mandir-card-hover)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-[var(--color-mandir-bg)]">
                            {temple.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={temple.image_url} alt={temple.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-[var(--color-mandir-text-muted)]" />
                              </div>
                            )}
                          </div>
                          <div className="font-medium text-[var(--color-mandir-text)]">{temple.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-mandir-text-muted)]">{temple.location}</td>
                      <td className="px-6 py-4">{temple.deity}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/temples/${temple.id}/edit`}>
                            <Button variant="outline" size="sm" className="h-8">
                              <Pencil className="w-4 h-4 mr-1" /> Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-[var(--color-sacred-red)] hover:text-white hover:bg-[var(--color-sacred-red)] hover:border-[var(--color-sacred-red)]"
                            onClick={() => setDeleteId(temple.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      <ConfirmDeleteModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Temple"
        description="Are you sure you want to delete this temple? This will permanently delete all associated pujas and chadhava items. This action cannot be undone."
      />
    </div>
  )
}
