"use client"

import * as React from "react"
import { Plus, X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface DynamicListInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  label?: string
}

export function DynamicListInput({ value = [], onChange, placeholder, label }: DynamicListInputProps) {
  const [items, setItems] = React.useState<string[]>(value.length > 0 ? value : [""])

  React.useEffect(() => {
    // Sync external changes if needed, but primarily driven internally
    if (value && value.length > 0 && JSON.stringify(value) !== JSON.stringify(items.filter(Boolean))) {
      setItems(value)
    }
  }, [value])

  const notifyChange = (newItems: string[]) => {
    // Only pass non-empty strings up to parent
    onChange(newItems.filter(item => item.trim() !== ""))
  }

  const handleAdd = () => {
    const newItems = [...items, ""]
    setItems(newItems)
  }

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    if (newItems.length === 0) newItems.push("") // keep at least one empty input
    setItems(newItems)
    notifyChange(newItems)
  }

  const handleChange = (index: number, val: string) => {
    const newItems = [...items]
    newItems[index] = val
    setItems(newItems)
    notifyChange(newItems)
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-[var(--color-mandir-text)]">{label}</label>}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-[var(--color-mandir-text-muted)] cursor-move shrink-0 opacity-50" />
            <Input
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={placeholder || "Enter item..."}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemove(index)}
              className="shrink-0 h-10 w-10 text-[var(--color-sacred-red)] hover:text-white hover:bg-[var(--color-sacred-red)] hover:border-[var(--color-sacred-red)] transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="mt-2 text-[var(--color-saffron-500)] border-[var(--color-saffron-500)]/50 hover:bg-[var(--color-saffron-500)]/10"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Item
      </Button>
    </div>
  )
}
