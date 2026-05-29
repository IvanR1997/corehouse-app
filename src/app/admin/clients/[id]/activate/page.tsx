import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { ActivatePackageButton, AssignPackageForm, RemovePackageButton } from './PackageActions'
import { DeleteClientButton } from './DeleteClientButton'

function formatDate(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export default async function ActivateClientPackagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole('ADMIN')
  const { id } = await params

  const [client, packages] = await Promise.all([
    db.user.findUnique({
      where: { id, role: 'CLIENT' },
      include: {
        packages: {
          include: { package: true },
          orderBy: [{ isActive: 'desc' }, { activatedAt: 'desc' }],
        },
      },
    }),
    db.package.findMany({ orderBy: [{ type: 'asc' }, { totalSessions: 'asc' }] }),
  ])

  if (!client) notFound()

  const groupPackages = packages.filter((p) => p.type === 'GROUP')
  const personalPackages = packages.filter((p) => p.type === 'PERSONAL')

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <a href="/admin/clients" className="text-sm text-orange-500 hover:underline">
            ← Nazad na klijente
          </a>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1">Paketi za {client.name}</h1>
          <p className="text-sm text-zinc-400">{client.email}</p>
        </div>
        <DeleteClientButton clientId={client.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-3">
            Dodeli novi paket
          </h2>
          <AssignPackageForm
            userId={client.id}
            groupPackages={groupPackages}
            personalPackages={personalPackages}
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-3">
            Paketi klijenta
          </h2>

          {client.packages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-8 text-center">
              <p className="text-sm text-zinc-400">Klijent nema paketa.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {client.packages.map((cp) => (
                <div
                  key={cp.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-white">{cp.package.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          cp.package.type === 'GROUP'
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-purple-500/15 text-purple-400'
                        }`}
                      >
                        {cp.package.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Preostalo: {cp.remainingSessions} / {cp.package.totalSessions} termina
                    </p>
                    {cp.activatedAt && (
                      <p className="text-xs text-zinc-500">Aktivirano: {formatDate(cp.activatedAt)}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cp.isActive ? (
                      <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-semibold text-green-400">
                        Aktivan
                      </span>
                    ) : (
                      <ActivatePackageButton clientPackageId={cp.id} />
                    )}
                    <RemovePackageButton clientPackageId={cp.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

