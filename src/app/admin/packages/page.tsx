import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { DeletePackageButton } from './DeletePackageButton'
import { CreatePackageForm } from './CreatePackageForm'

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
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">Paketi</h1>
          <p className="text-sm text-text-muted mt-1">Upravljanje paketima treninga</p>
        </div>
        <CreatePackageForm />
      </div>

      <div className="space-y-8">
        {(
          [
            { key: 'GROUP', label: 'Vođeni treninzi' },
            { key: 'PERSONAL', label: 'Personalni treninzi' },
          ] as const
        ).map(({ key, label }) => (
          <section key={key}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted mb-3">
              {label}
            </h2>

            {grouped[key].length === 0 ? (
              <div className="rounded-xl border border-dashed border-border-subtle bg-surface-card py-8 text-center">
                <p className="text-sm text-text-muted">Nema paketa.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border-subtle bg-surface-card shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle bg-surface-elevated/50">
                      <th className="px-3 md:px-5 py-3 text-left font-semibold text-text-muted">Naziv</th>
                      <th className="px-3 md:px-5 py-3 text-left font-semibold text-text-muted">Treninga</th>
                      <th className="px-3 md:px-5 py-3 text-left font-semibold text-text-muted">Cena</th>
                      <th className="px-3 md:px-5 py-3 text-left font-semibold text-text-muted hidden md:table-cell">Opis</th>
                      <th className="px-3 md:px-5 py-3 text-left font-semibold text-text-muted hidden md:table-cell">Dodeljeno</th>
                      <th className="px-3 md:px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {grouped[key].map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-surface-elevated/30 transition-colors">
                        <td className="px-3 md:px-5 py-4 font-medium text-text-primary">{pkg.name}</td>
                        <td className="px-3 md:px-5 py-4 text-text-secondary">{pkg.totalSessions}</td>
                        <td className="px-3 md:px-5 py-4 text-text-secondary font-medium whitespace-nowrap">
                          {pkg.price ? `${pkg.price.toLocaleString('sr-RS')} RSD` : <span className="text-text-muted">—</span>}
                        </td>
                        <td className="px-3 md:px-5 py-4 text-text-muted text-xs hidden md:table-cell">
                          {pkg.description ?? '—'}
                        </td>
                        <td className="px-3 md:px-5 py-4 hidden md:table-cell">
                          <span className={`text-xs font-medium ${pkg._count.clientPackages > 0 ? 'text-text-secondary' : 'text-text-muted'}`}>
                            {pkg._count.clientPackages} klijenata
                          </span>
                        </td>
                        <td className="px-3 md:px-5 py-4 text-right">
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
