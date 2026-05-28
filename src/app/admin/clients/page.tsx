import Link from 'next/link'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

function formatDate(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

function expiresAt(activatedAt: Date) {
  const d = new Date(activatedAt)
  d.setMonth(d.getMonth() + 1)
  return d
}

function expiryLabel(activatedAt: Date | null) {
  if (!activatedAt) return null
  const exp = expiresAt(activatedAt)
  const now = new Date()
  const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) return { text: 'Istekao', className: 'text-red-500 font-medium' }
  if (daysLeft <= 5) return { text: `${formatDate(exp)} (${daysLeft}d)`, className: 'text-amber-500 font-medium' }
  return { text: formatDate(exp), className: 'text-zinc-600' }
}

export default async function AdminClientsPage() {
  await requireRole('ADMIN')

  const clients = await db.user.findMany({
    where: { role: 'CLIENT' },
    include: {
      packages: {
        include: { package: true },
        orderBy: [{ isActive: 'desc' }, { activatedAt: 'desc' }],
      },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Klijenti</h1>
        <p className="text-sm text-zinc-500 mt-1">{clients.length} registrovanih klijenata</p>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <p className="text-zinc-500">Nema registrovanih klijenata.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-5 py-3 text-left font-semibold text-zinc-500">Klijent</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-500">Email</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-500 whitespace-nowrap">Aktivan paket</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-500">Iskorišćeno</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-500">Uplata</th>
                <th className="px-5 py-3 text-left font-semibold text-zinc-500">Ističe</th>
                <th className="px-5 py-3 text-right font-semibold text-zinc-500">Akcija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {clients.map((client) => {
                const activePackages = client.packages.filter((p) => p.isActive)
                const hasInactive = client.packages.some((p) => !p.isActive)

                return (
                  <tr key={client.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-semibold text-orange-600">
                          {client.name[0]}
                        </div>
                        <span className="font-medium text-zinc-900 whitespace-nowrap">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-500">{client.email}</td>

                    {/* Aktivan paket */}
                    <td className="px-5 py-4">
                      {activePackages.length === 0 ? (
                        <span className="text-xs text-zinc-400">
                          {hasInactive ? 'čeka aktivaciju' : 'bez paketa'}
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {activePackages.map((p) => (
                            <span
                              key={p.id}
                              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                                p.package.type === 'GROUP'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {p.package.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Iskorišćeno */}
                    <td className="px-5 py-4">
                      {activePackages.length === 0 ? (
                        <span className="text-xs text-zinc-300">—</span>
                      ) : (
                        <div className="space-y-2">
                          {activePackages.map((p) => {
                            const used = p.package.totalSessions - p.remainingSessions
                            const pct = Math.round((used / p.package.totalSessions) * 100)
                            return (
                              <div key={p.id} className="flex items-center gap-2">
                                <div className="w-20 rounded-full bg-zinc-100 h-1.5">
                                  <div
                                    className="rounded-full bg-orange-400 h-1.5"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-600">
                                  {used} / {p.package.totalSessions}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </td>

                    {/* Uplata */}
                    <td className="px-5 py-4">
                      {activePackages.length === 0 ? (
                        <span className="text-xs text-zinc-300">—</span>
                      ) : (
                        <div className="space-y-1">
                          {activePackages.map((p) => (
                            <p key={p.id} className="text-xs text-zinc-600">
                              {formatDate(p.activatedAt)}
                            </p>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Ističe */}
                    <td className="px-5 py-4">
                      {activePackages.length === 0 ? (
                        <span className="text-xs text-zinc-300">—</span>
                      ) : (
                        <div className="space-y-1">
                          {activePackages.map((p) => {
                            const label = expiryLabel(p.activatedAt)
                            return (
                              <p key={p.id} className={`text-xs ${label?.className ?? 'text-zinc-300'}`}>
                                {label?.text ?? '—'}
                              </p>
                            )
                          })}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/clients/${client.id}/activate`}
                        className="rounded-md bg-orange-50 border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 transition-colors"
                      >
                        Upravljaj paketima
                      </Link>
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
