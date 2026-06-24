"use client"

import * as React from "react"
import { UploadCloud, X, Image as ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/Toast"

export interface ImageUploadProps {
  value?: string | string[]
  onChange: (value: string | string[]) => void
  onRemove: (value: string) => void
  disabled?: boolean
  multiple?: boolean
  className?: string
  previewClassName?: string
  bucket?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  multiple = false,
  className,
  previewClassName,
  bucket = "media"
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const supabase = createClient()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files
      if (!files || files.length === 0) return

      setIsUploading(true)

      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl)
        }
      }

      if (multiple) {
        const currentValues = Array.isArray(value) ? value : value ? [value] : []
        onChange([...currentValues, ...uploadedUrls])
      } else {
        onChange(uploadedUrls[0])
      }
      
      toast({ type: "success", title: "Upload successful" })
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast({ type: "error", title: "Upload failed", description: error.message || "An error occurred during upload." })
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ''
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
            {isUploading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-[var(--color-saffron-500)]" />
            ) : (
              <UploadCloud className="h-8 w-8 text-[var(--color-saffron-400)]" />
            )}
            <span className="text-sm">{isUploading ? "Uploading..." : "Click to upload image"}</span>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleUpload}
            disabled={disabled || isUploading}
            multiple={multiple}
          />
        </label>
      ) : null}
    </div>
  )
}
