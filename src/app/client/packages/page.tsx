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

export default async function ClientPackagesPage() {
  const user = await requireRole('CLIENT')

  const clientPackages = await db.clientPackage.findMany({
    where: { userId: user.id },
    include: { package: true },
    orderBy: [{ isActive: 'desc' }, { activatedAt: 'desc' }],
  })

  const active = clientPackages.filter((p) => p.isActive)
  const inactive = clientPackages.filter((p) => !p.isActive)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Moji paketi</h1>
        <p className="text-sm text-zinc-500 mt-1">Pregled vaših aktivnih i neaktivnih paketa</p>
      </div>

      {clientPackages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <p className="text-zinc-500">Nemate paketa. Kontaktirajte admin.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
                Aktivni paketi
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {active.map((cp) => (
                  <PackageCard key={cp.id} cp={cp} />
                ))}
              </div>
            </section>
          )}

          {inactive.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
                Neaktivni paketi
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {inactive.map((cp) => (
                  <PackageCard key={cp.id} cp={cp} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
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
        cp.isActive ? 'border-zinc-200 bg-white shadow-sm' : 'border-dashed border-zinc-200 bg-zinc-50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-zinc-900">{cp.package.name}</p>
          <span
            className={`text-xs font-medium rounded-full px-2 py-0.5 ${
              cp.package.type === 'GROUP'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {cp.package.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
          </span>
          {cp.package.description && (
            <p className="text-xs text-zinc-500 mt-1">{cp.package.description}</p>
          )}
        </div>
        {cp.isActive ? (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            Aktivan
          </span>
        ) : (
          <span className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-semibold text-zinc-500">
            Čeka aktivaciju
          </span>
        )}
      </div>

      {cp.isActive && (
        <>
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Preostalo termina</span>
            <span className="font-medium text-zinc-800">
              {cp.remainingSessions} / {cp.package.totalSessions}
            </span>
          </div>
          <div className="w-full rounded-full bg-zinc-100 h-2">
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
