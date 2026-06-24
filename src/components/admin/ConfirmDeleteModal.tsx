"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  isLoading?: boolean
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center text-center p-2">
        <div className="h-12 w-12 rounded-full bg-[var(--color-sacred-red)]/10 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-[var(--color-sacred-red)]" />
        </div>
        
        <h2 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-2">
          {title}
        </h2>
        
        <p className="text-sm text-[var(--color-mandir-text-muted)] mb-6">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:flex-1 bg-[var(--color-sacred-red)] hover:bg-[var(--color-sacred-red)]/90 text-white border-none"
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
