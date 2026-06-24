"use client"

import * as React from "react"
import { Plus, Pencil, Trash2, Power, PowerOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Badge } from "@/components/ui/Badge"
import { toast } from "@/components/ui/Toast"
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal"
import { Modal } from "@/components/ui/Modal"
import { ImageUpload } from "@/components/ui/ImageUpload"

export default function AdminCountdownsList() {
  const supabase = createClient()
  const [countdowns, setCountdowns] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<any>(null)

  React.useEffect(() => {
    fetchCountdowns()
  }, [])

  const fetchCountdowns = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('festival_countdown')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      setCountdowns(data || [])
    } catch (error) {
      console.error("Error fetching countdowns:", error)
      toast({ type: "error", title: "Failed to load countdowns" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const { error } = await supabase.from('festival_countdown').delete().eq('id', deleteId)
      if (error) throw error
      
      toast({ type: "success", title: "Countdown deleted" })
      setCountdowns(countdowns.filter(c => c.id !== deleteId))
    } catch (error) {
      console.error("Error deleting countdown:", error)
      toast({ type: "error", title: "Failed to delete" })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('festival_countdown').update({ is_active: !currentStatus }).eq('id', id)
      if (error) throw error
      
      setCountdowns(countdowns.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c))
      toast({ type: "success", title: "Status updated" })
    } catch (error) {
      console.error("Error toggling status:", error)
      toast({ type: "error", title: "Failed to update status" })
    }
  }

  const handleEditOpen = (item: any = null) => {
    if (item) {
      setEditingItem({ ...item })
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setEditingItem({
        name: "",
        description: "",
        image_url: "",
        target_date: tomorrow.toISOString().slice(0, 16),
        position: "after_hero",
        display_style: "full-width",
        sort_order: countdowns.length + 1,
        is_active: true
      })
    }
    setEditModalOpen(true)
  }

  const handleSaveItem = async () => {
    if (!editingItem.name || !editingItem.image_url || !editingItem.target_date) {
      toast({ type: "error", title: "Missing fields", description: "Name, Image, and Target Date are required." })
      return
    }

    setIsSaving(true)
    try {
      const payload = { ...editingItem }
      if (payload.target_date.length === 16) {
        payload.target_date = new Date(payload.target_date).toISOString()
      }

      if (editingItem.id) {
        const { error } = await supabase.from('festival_countdown').update(payload).eq('id', editingItem.id)
        if (error) throw error
        toast({ type: "success", title: "Countdown updated" })
      } else {
        const { error } = await supabase.from('festival_countdown').insert([payload])
        if (error) throw error
        toast({ type: "success", title: "Countdown created" })
      }
      setEditModalOpen(false)
      fetchCountdowns()
    } catch (error: any) {
      console.error("Error saving countdown:", error)
      toast({ type: "error", title: "Failed to save", description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const getFormatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      const d = new Date(dateString)
      // Return YYYY-MM-DDThh:mm format for datetime-local input
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    } catch (e) {
      return ""
    }
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto pb-24">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">Countdowns</h1>
          <p className="text-[var(--color-mandir-text-muted)]">Manage festival and event countdowns.</p>
        </div>
        <Button variant="gradient" onClick={() => handleEditOpen()}>
          <Plus className="w-4 h-4 mr-2" /> Add Countdown
        </Button>
      </div>

      <Card className="bg-[var(--color-mandir-surface)] border-[var(--color-mandir-border)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--color-mandir-text-muted)] uppercase bg-[var(--color-mandir-bg)]/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Layout</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-mandir-border)]">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--color-mandir-text-muted)]">Loading countdowns...</td></tr>
                ) : countdowns.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--color-mandir-text-muted)]">No countdowns found.</td></tr>
                ) : (
                  countdowns.map((item) => (
                    <tr key={item.id} className={`hover:bg-[var(--color-mandir-card-hover)] transition-colors ${!item.is_active ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-16 rounded-md overflow-hidden shrink-0 bg-[var(--color-mandir-bg)] relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-[var(--color-mandir-text)]">{item.name}</div>
                            <div className="text-xs text-[var(--color-mandir-text-muted)] mt-1">
                              Target: {new Date(item.target_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[var(--color-mandir-text)] font-medium">Pos: {item.position}</div>
                        <div className="text-xs text-[var(--color-mandir-text-muted)]">Style: {item.display_style}</div>
                        <div className="text-xs text-[var(--color-mandir-text-muted)]">Order: {item.sort_order}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleActive(item.id, item.is_active)}
                          className={`p-2 rounded-full ${item.is_active ? 'text-[var(--color-auspicious-green)] bg-[var(--color-auspicious-green)]/10' : 'text-gray-400 bg-gray-400/10'}`}
                        >
                          {item.is_active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-8" onClick={() => handleEditOpen(item)}>
                            <Pencil className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-[var(--color-sacred-red)] hover:text-white hover:bg-[var(--color-sacred-red)] hover:border-[var(--color-sacred-red)]"
                            onClick={() => setDeleteId(item.id)}
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

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={editingItem?.id ? "Edit Countdown" : "Create Countdown"}>
        {editingItem && (
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-mandir-text)]">Event Name *</label>
              <Input 
                value={editingItem.name} 
                onChange={e => setEditingItem({...editingItem, name: e.target.value})} 
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-mandir-text)]">Description</label>
              <Textarea 
                value={editingItem.description} 
                onChange={e => setEditingItem({...editingItem, description: e.target.value})} 
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-mandir-text)]">Target Date & Time *</label>
              <Input 
                type="datetime-local"
                value={getFormatDate(editingItem.target_date)} 
                onChange={e => setEditingItem({...editingItem, target_date: e.target.value})} 
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Position</label>
                <select 
                  value={editingItem.position} 
                  onChange={e => setEditingItem({...editingItem, position: e.target.value})}
                  className="mt-1 flex h-10 w-full rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-bg)] px-3 py-2 text-sm text-[var(--color-mandir-text)]"
                >
                  <option value="after_hero">After Hero</option>
                  <option value="after_temples">After Temples</option>
                  <option value="after_pujas">After Pujas</option>
                  <option value="above_footer">Above Footer</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Display Style</label>
                <select 
                  value={editingItem.display_style} 
                  onChange={e => setEditingItem({...editingItem, display_style: e.target.value})}
                  className="mt-1 flex h-10 w-full rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-bg)] px-3 py-2 text-sm text-[var(--color-mandir-text)]"
                >
                  <option value="full-width">Full Width</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-mandir-text)]">Sort Order</label>
                <Input 
                  type="number"
                  value={editingItem.sort_order} 
                  onChange={e => setEditingItem({...editingItem, sort_order: parseInt(e.target.value) || 0})} 
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-mandir-text)] mb-2 block">Background Image *</label>
              <ImageUpload
                value={editingItem.image_url ? [editingItem.image_url] : []}
                onChange={(url) => setEditingItem({...editingItem, image_url: Array.isArray(url) ? url[0] : url})}
                onRemove={() => setEditingItem({...editingItem, image_url: ""})}
              />
            </div>
            <div className="pt-4 flex justify-end gap-2 border-t border-[var(--color-mandir-border)]">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button variant="gradient" onClick={handleSaveItem} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Countdown"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDeleteModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Countdown"
        description="Are you sure you want to delete this countdown banner? This action cannot be undone."
      />
    </div>
  )
}
