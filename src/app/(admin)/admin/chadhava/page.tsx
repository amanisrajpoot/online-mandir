"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Search, Flower2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { toast } from "@/components/ui/Toast"
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal"

export default function AdminChadhavaList() {
  const supabase = createClient()
  const [items, setItems] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('chadhava_items')
        .select(`*, temples(name)`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("Error fetching chadhava items:", error)
      toast({ type: "error", title: "Failed to load chadhava items" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const { error } = await supabase.from('chadhava_items').delete().eq('id', deleteId)
      if (error) throw error
      
      toast({ type: "success", title: "Item deleted" })
      setItems(items.filter(i => i.id !== deleteId))
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({ type: "error", title: "Failed to delete" })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const filteredItems = items.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.temples?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)]">Manage Chadhava</h1>
          <p className="text-[var(--color-mandir-text-muted)]">Create and edit offerings available for temples.</p>
        </div>
        <Link href="/admin/chadhava/new">
          <Button variant="gradient">
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </Link>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-mandir-text-muted)]" />
        <Input 
          placeholder="Search by title or temple..." 
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
                  <th className="px-6 py-4 font-medium">Item Details</th>
                  <th className="px-6 py-4 font-medium">Temple</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-mandir-border)]">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--color-mandir-text-muted)]">Loading items...</td></tr>
                ) : filteredItems.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--color-mandir-text-muted)]">No items found.</td></tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--color-mandir-card-hover)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-[var(--color-mandir-bg)]">
                            {item.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Flower2 className="w-5 h-5 text-[var(--color-mandir-text-muted)]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[var(--color-mandir-text)]">{item.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-mandir-text-muted)]">{item.temples?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[var(--color-mandir-text)]">₹{item.price}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/chadhava/${item.id}/edit`}>
                            <Button variant="outline" size="sm" className="h-8">
                              <Pencil className="w-4 h-4 mr-1" /> Edit
                            </Button>
                          </Link>
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

      <ConfirmDeleteModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Chadhava Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </div>
  )
}
