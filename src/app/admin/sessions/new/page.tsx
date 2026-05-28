import Link from 'next/link'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { AdminNewSessionForm } from './AdminNewSessionForm'

export default async function AdminNewSessionPage() {
  await requireRole('ADMIN')

  const clients = await db.user.findMany({
    where: { role: 'CLIENT' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link
          href="/admin/sessions"
          className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          ← Nazad na termine
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 mt-2">Novi termin</h1>
        <p className="text-sm text-zinc-500 mt-1">Zakažite novi trening termin</p>
      </div>

      <AdminNewSessionForm clients={clients} />
    </div>
  )
}
