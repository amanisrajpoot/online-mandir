"use client"

import * as React from "react"
import { UploadCloud, X, Image as ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ImageUploadProps {
  value?: string | string[]
  onChange: (value: string | string[]) => void
  onRemove: (value: string) => void
  disabled?: boolean
  multiple?: boolean
  className?: string
  previewClassName?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  multiple = false,
  className,
  previewClassName
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload to Supabase Storage
    // For this mock, we'll just use a placeholder URL
    const mockUrl = "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=600&auto=format&fit=crop"
    
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : value ? [value] : []
      onChange([...currentValues, mockUrl])
    } else {
      onChange(mockUrl)
    }
  }

  if (!isMounted) {
    return null
  }

  const valuesArray = Array.isArray(value) ? value : value ? [value] : []

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {valuesArray.map((url) => (
          <div key={url} className={cn("relative h-40 w-40 overflow-hidden rounded-md border border-[var(--color-mandir-border)]", previewClassName)}>
            <div className="absolute right-2 top-2 z-10">
              <button
                type="button"
                onClick={() => onRemove(url)}
                disabled={disabled}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-[var(--color-sacred-red)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full object-cover"
              alt="Image preview"
              src={url}
            />
          </div>
        ))}
      </div>
      
      {(!multiple && valuesArray.length === 0) || multiple ? (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] py-10 transition-colors hover:bg-[var(--color-mandir-card-hover)]",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-[var(--color-mandir-text-muted)]">
            <UploadCloud className="h-8 w-8 text-[var(--color-saffron-400)]" />
            <span className="text-sm">Click to upload image</span>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleUpload}
            disabled={disabled}
            multiple={multiple}
          />
        </label>
      ) : null}
    </div>
  )
}
