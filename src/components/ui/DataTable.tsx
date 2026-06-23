import * as React from "react"
import { cn } from "@/lib/utils"

export interface DataTableProps<T> {
  columns: {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => React.ReactNode
    className?: string
  }[]
  data: T[]
  className?: string
  emptyMessage?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T>({ 
  columns, 
  data, 
  className,
  emptyMessage = "No data available.",
  onRowClick
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto rounded-md border border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)]", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b border-[var(--color-mandir-border)] bg-[var(--color-mandir-surface)] text-[var(--color-mandir-text-muted)]">
          <tr className="transition-colors hover:bg-[var(--color-mandir-card-hover)]/50 data-[state=selected]:bg-muted">
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={cn("h-12 px-4 text-left align-middle font-medium", column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0 text-[var(--color-mandir-text)]">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="h-24 text-center text-[var(--color-mandir-text-muted)] align-middle"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr 
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  "border-b border-[var(--color-mandir-border)] transition-colors hover:bg-[var(--color-mandir-card-hover)]",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={cn("p-4 align-middle", column.className)}
                  >
                    {column.cell 
                      ? column.cell(item) 
                      : column.accessorKey 
                        ? String(item[column.accessorKey] || "") 
                        : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
