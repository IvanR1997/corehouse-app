import { requireRole } from '@/lib/dal'
import { Navbar } from '@/components/layout/Navbar'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('CLIENT')

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar userName={user.name} role="CLIENT" />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
