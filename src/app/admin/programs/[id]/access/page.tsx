import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { AccessToggleButton } from './AccessToggleButton'

export default async function ProgramAccessPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('ADMIN')
  const { id } = await params

  const [program, clients] = await Promise.all([
    db.program.findUnique({
      where: { id },
      include: {
        access: { select: { userId: true } },
      },
    }),
    db.user.findMany({
      where: { role: 'CLIENT' },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true },
    }),
  ])

  if (!program) notFound()

  const accessSet = new Set(program.access.map((a) => a.userId))

  return (
    <div>
      <div className="mb-6">
        <Link href={`/admin/programs/${id}`} className="text-sm text-orange-500 hover:underline">
          ← Nazad na program
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary mt-2">Pristup: {program.title}</h1>
        <p className="text-sm text-text-muted mt-1">
          {accessSet.size} od {clients.length} klijenata ima pristup
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-surface-card py-16 text-center">
          <p className="text-text-muted">Nema registrovanih klijenata.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border-subtle overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-elevated">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Klijent</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Email</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-muted">Akcija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface-card">
              {clients.map((client) => {
                const has = accessSet.has(client.id)
                return (
                  <tr key={client.id}>
                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">{client.name}</td>
                    <td className="px-5 py-3.5 text-sm text-text-muted">{client.email}</td>
                    <td className="px-5 py-3.5 text-right">
                      {has ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Aktivan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-text-muted">
                          Zaključano
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <AccessToggleButton userId={client.id} programId={id} hasAccess={has} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
