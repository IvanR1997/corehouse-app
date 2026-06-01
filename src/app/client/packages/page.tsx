import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { RequestButton } from './RequestButton'

function formatDate(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

function formatPrice(price: number | null | undefined) {
  if (price == null) return '— RSD'
  return `${price.toLocaleString('sr-RS')} RSD`
}

export default async function ClientPackagesPage() {
  const user = await requireRole('CLIENT')

  const [allPackages, clientPackages] = await Promise.all([
    db.package.findMany({
      orderBy: [{ type: 'asc' }, { totalSessions: 'asc' }],
    }),
    db.clientPackage.findMany({
      where: { userId: user.id },
      include: { package: true },
      orderBy: [{ isActive: 'desc' }, { activatedAt: 'desc' }],
    }),
  ])

  const activeGroupPackage = clientPackages.find((cp) => cp.isActive && cp.package.type === 'GROUP')
  const activePersonalPackage = clientPackages.find((cp) => cp.isActive && cp.package.type === 'PERSONAL')

  const groupPackages = allPackages.filter((p) => p.type === 'GROUP')
  const personalPackages = allPackages.filter((p) => p.type === 'PERSONAL')

  const active = clientPackages.filter((p) => p.isActive)
  const inactive = clientPackages.filter((p) => !p.isActive)

  return (
    <div className="space-y-10">
      {/* Available Packages */}
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Dostupni paketi</h1>
          <p className="text-sm text-zinc-500 mt-1">Odaberite paket koji vam odgovara</p>
        </div>

        <div className="space-y-8">
          {(
            [
              { key: 'GROUP' as const, label: 'Vođeni treninzi', packages: groupPackages, activePackage: activeGroupPackage },
              { key: 'PERSONAL' as const, label: 'Personalni treninzi', packages: personalPackages, activePackage: activePersonalPackage },
            ]
          ).map(({ key, label, packages: pkgs, activePackage }) => (
            <div key={key}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
                {label}
              </h2>

              {pkgs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-8 text-center">
                  <p className="text-sm text-zinc-500">Nema dostupnih paketa.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {pkgs.map((pkg) => (
                    <div key={pkg.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-white">{pkg.name}</p>
                          <span
                            className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                              key === 'GROUP'
                                ? 'bg-blue-500/15 text-blue-400'
                                : 'bg-purple-500/15 text-purple-400'
                            }`}
                          >
                            {key === 'GROUP' ? 'Vođeni' : 'Personalni'}
                          </span>
                          {pkg.description && (
                            <p className="text-xs text-zinc-500 mt-1">{pkg.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">
                          {pkg.totalSessions} {pkg.totalSessions === 1 ? 'trening' : 'treninga'}
                        </span>
                        <span className="font-semibold text-white">{formatPrice(pkg.price)}</span>
                      </div>

                      {activePackage ? (
                        <div className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-center text-sm text-zinc-400">
                          Već imate aktivan paket
                        </div>
                      ) : (
                        <RequestButton packageId={pkg.id} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* My Packages */}
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Moji paketi</h1>
          <p className="text-sm text-zinc-500 mt-1">Pregled vaših aktivnih i neaktivnih paketa</p>
        </div>

        {clientPackages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-16 text-center">
            <p className="text-zinc-500">Nemate paketa. Kontaktirajte admin.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {active.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
                  Aktivni paketi
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {active.map((cp) => (
                    <PackageCard key={cp.id} cp={cp} />
                  ))}
                </div>
              </div>
            )}

            {inactive.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
                  Neaktivni paketi
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {inactive.map((cp) => (
                    <PackageCard key={cp.id} cp={cp} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

type PackageCardProps = {
  cp: {
    id: string
    remainingSessions: number
    isActive: boolean
    activatedAt: Date | null
    package: {
      name: string
      description: string | null
      type: string
      totalSessions: number
    }
  }
}

function PackageCard({ cp }: PackageCardProps) {
  const pct = Math.round((cp.remainingSessions / cp.package.totalSessions) * 100)

  return (
    <div
      className={`rounded-xl border p-5 ${
        cp.isActive ? 'border-zinc-800 bg-zinc-900 shadow-sm' : 'border-dashed border-zinc-800 bg-zinc-800/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-white">{cp.package.name}</p>
          <span
            className={`text-xs font-medium rounded-full px-2 py-0.5 ${
              cp.package.type === 'GROUP'
                ? 'bg-blue-500/15 text-blue-400'
                : 'bg-purple-500/15 text-purple-400'
            }`}
          >
            {cp.package.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
          </span>
          {cp.package.description && (
            <p className="text-xs text-zinc-500 mt-1">{cp.package.description}</p>
          )}
        </div>
        {cp.isActive ? (
          <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-semibold text-green-400">
            Aktivan
          </span>
        ) : (
          <span className="rounded-full bg-zinc-700 px-2.5 py-0.5 text-xs font-semibold text-zinc-300">
            Čeka aktivaciju
          </span>
        )}
      </div>

      {cp.isActive && (
        <>
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Preostalo termina</span>
            <span className="font-medium text-zinc-100">
              {cp.remainingSessions} / {cp.package.totalSessions}
            </span>
          </div>
          <div className="w-full rounded-full bg-zinc-800 h-2">
            <div
              className="rounded-full bg-orange-400 h-2 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {cp.activatedAt && (
            <p className="text-xs text-zinc-400 mt-2">Aktivirano: {formatDate(cp.activatedAt)}</p>
          )}
        </>
      )}
    </div>
  )
}
