export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-mandir-bg)] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-[var(--color-saffron-500)]/10 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] h-[50%] w-[50%] rounded-full bg-[var(--color-temple-gold)]/10 blur-[100px]" />
      </div>
      {children}
    </div>
  )
}
