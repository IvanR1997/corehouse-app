import { requireRole } from '@/lib/dal'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('CLIENT')

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar userName={user.name} role="CLIENT" />
      <main className="flex-1 px-4 md:px-6 py-6 pb-24 md:pb-8 overflow-auto">
        <TopBar userName={user.name} role="CLIENT" />
        {children}
      </main>
    </div>
  )
}
