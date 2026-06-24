import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Plus, Trash2 } from "lucide-react"

export interface PujaPackage {
  id: string;
  name: string;
  members_text: string;
  max_members: number;
  base_price: number;
  sale_price: number;
}

interface PujaPackagesInputProps {
  packages: PujaPackage[];
  onChange: (packages: PujaPackage[]) => void;
}

export function PujaPackagesInput({ packages, onChange }: PujaPackagesInputProps) {
  const addPackage = () => {
    onChange([
      ...packages,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        members_text: "For 1 Member",
        max_members: 1,
        base_price: 0,
        sale_price: 0
      }
    ])
  }

  const removePackage = (index: number) => {
    const newPackages = [...packages]
    newPackages.splice(index, 1)
    onChange(newPackages)
  }

  const updatePackage = (index: number, field: keyof PujaPackage, value: any) => {
    const newPackages = [...packages]
    newPackages[index] = { ...newPackages[index], [field]: value }
    onChange(newPackages)
  }

  return (
    <div className="space-y-4">
      {packages.map((pkg, index) => (
        <div key={pkg.id || index} className="p-4 border border-[var(--color-mandir-border)] rounded-md bg-[var(--color-mandir-surface)] relative">
          <button 
            type="button" 
            onClick={() => removePackage(index)}
            className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="text-xs font-medium text-[var(--color-mandir-text-muted)]">Package Name *</label>
              <Input 
                value={pkg.name} 
                onChange={(e) => updatePackage(index, 'name', e.target.value)} 
                placeholder="e.g. अकेले के लिए*"
                className="mt-1 h-9"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-mandir-text-muted)]">Members Text *</label>
              <Input 
                value={pkg.members_text} 
                onChange={(e) => updatePackage(index, 'members_text', e.target.value)} 
                placeholder="e.g. For 1 Member"
                className="mt-1 h-9"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-mandir-text-muted)]">Max Members Allowed *</label>
              <Input 
                type="number"
                value={pkg.max_members || 1} 
                onChange={(e) => updatePackage(index, 'max_members', parseInt(e.target.value) || 1)} 
                className="mt-1 h-9"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-mandir-text-muted)]">Base Price (₹) *</label>
              <Input 
                type="number"
                value={pkg.base_price || 0} 
                onChange={(e) => updatePackage(index, 'base_price', parseInt(e.target.value) || 0)} 
                className="mt-1 h-9"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-mandir-text-muted)]">Sale Price (₹) *</label>
              <Input 
                type="number"
                value={pkg.sale_price || 0} 
                onChange={(e) => updatePackage(index, 'sale_price', parseInt(e.target.value) || 0)} 
                className="mt-1 h-9"
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={addPackage}
        className="w-full border-dashed border-2 text-[var(--color-saffron-500)] border-[var(--color-saffron-200)] hover:bg-[var(--color-saffron-50)]"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Package
      </Button>
    </div>
  )
}
