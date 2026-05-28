import { requireRole } from '@/lib/dal'
import { db } from '@/lib/db'
import { Navbar } from '@/components/layout/Navbar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('ADMIN')
  const notificationCount = await db.adminNotification.count({ where: { isRead: false } })

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar userName={user.name} role="ADMIN" notificationCount={notificationCount} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
