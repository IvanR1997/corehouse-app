import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { DeletePackageButton } from './DeletePackageButton'

export default async function AdminPackagesPage() {
  await requireRole('ADMIN')

  const packages = await db.package.findMany({
    include: { _count: { select: { clientPackages: true } } },
    orderBy: [{ type: 'asc' }, { totalSessions: 'asc' }],
  })

  const grouped = {
    GROUP: packages.filter((p) => p.type === 'GROUP'),
    PERSONAL: packages.filter((p) => p.type === 'PERSONAL'),
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Paketi</h1>
        <p className="text-sm text-zinc-500 mt-1">Upravljanje paketima treninga</p>
      </div>

      <div className="space-y-8">
        {(
          [
            { key: 'GROUP', label: 'Vođeni treninzi' },
            { key: 'PERSONAL', label: 'Personalni treninzi' },
          ] as const
        ).map(({ key, label }) => (
          <section key={key}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
              {label}
            </h2>

            {grouped[key].length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-8 text-center">
                <p className="text-sm text-zinc-500">Nema paketa.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50">
                      <th className="px-5 py-3 text-left font-semibold text-zinc-500">Naziv</th>
                      <th className="px-5 py-3 text-left font-semibold text-zinc-500">Treninga</th>
                      <th className="px-5 py-3 text-left font-semibold text-zinc-500">Opis</th>
                      <th className="px-5 py-3 text-left font-semibold text-zinc-500">Dodeljeno</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {grouped[key].map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-zinc-900">{pkg.name}</td>
                        <td className="px-5 py-4 text-zinc-600">{pkg.totalSessions}</td>
                        <td className="px-5 py-4 text-zinc-400 text-xs">
                          {pkg.description ?? '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-medium ${pkg._count.clientPackages > 0 ? 'text-zinc-700' : 'text-zinc-400'}`}>
                            {pkg._count.clientPackages} klijenata
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <DeletePackageButton
                            packageId={pkg.id}
                            assignedCount={pkg._count.clientPackages}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
