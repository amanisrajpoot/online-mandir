"use client"

import * as React from "react"
import { Printer } from "lucide-react"

export function PrintReceiptClient() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button 
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg shadow transition-colors"
    >
      <Printer className="w-4 h-4" />
      Print / Download
    </button>
  )
}
