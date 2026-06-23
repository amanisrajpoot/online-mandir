export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout flex min-h-screen bg-[var(--color-mandir-bg)]">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
