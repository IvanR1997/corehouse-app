'use client'

import { useState, useTransition, useActionState } from 'react'
import { activatePackage, assignPackage, removeClientPackage } from '@/app/actions/packages'
import { SubmitButton } from '@/components/ui/Button'

export function ActivatePackageButton({ clientPackageId }: { clientPackageId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const result = await activatePackage(clientPackageId)
          if (result?.error) alert(result.error)
        })
      }
      disabled={isPending}
      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-600 disabled:opacity-50 transition-colors"
    >
      {isPending ? 'Aktiviram...' : 'Aktiviraj'}
    </button>
  )
}

export function RemovePackageButton({ clientPackageId }: { clientPackageId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (!confirm('Ukloniti ovaj paket?')) return
        startTransition(async () => {
          const result = await removeClientPackage(clientPackageId)
          if (result?.error) alert(result.error)
        })
      }}
      disabled={isPending}
      className="rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-muted hover:border-red-200 hover:text-red-500 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Ukloni'}
    </button>
  )
}

type Package = { id: string; name: string; description: string | null; type: string; totalSessions: number }

type AssignFormProps = {
  userId: string
  groupPackages: Package[]
  personalPackages: Package[]
}

export function AssignPackageForm({ userId, groupPackages, personalPackages }: AssignFormProps) {
  const [activeTab, setActiveTab] = useState<'GROUP' | 'PERSONAL'>('GROUP')
  const boundAction = assignPackage.bind(null, userId)
  const [state, action] = useActionState(boundAction, undefined)

  const packages = activeTab === 'GROUP' ? groupPackages : personalPackages

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-card p-5">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-elevated rounded-lg w-fit mb-4">
        {[
          { key: 'GROUP' as const, label: 'Vođeni' },
          { key: 'PERSONAL' as const, label: 'Personalni' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              'px-4 py-1.5 rounded-md text-sm font-semibold transition-colors',
              activeTab === tab.key
                ? 'bg-surface-card text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-500/15 border border-red-200 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="mb-4 rounded-lg bg-green-500/15 border border-green-200 px-4 py-3 text-sm text-green-400">
          Paket dodijeljen. Aktivirajte ga ispod.
        </div>
      )}

      {packages.length === 0 ? (
        <p className="text-sm text-text-muted">Nema paketa za ovaj tip treninga.</p>
      ) : (
        <form action={action} className="space-y-3">
          <input type="hidden" name="tab" value={activeTab} />
          <div>
            <label htmlFor="packageId" className="block text-sm font-medium text-text-secondary mb-1.5">
              Odaberi paket
            </label>
            <select
              id="packageId"
              name="packageId"
              required
              className="block w-full rounded-lg border border-border-subtle bg-surface-card px-3 py-2.5 text-sm text-text-primary focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} — {pkg.totalSessions} {pkg.totalSessions === 1 ? 'trening' : 'treninga'}
                  {pkg.description ? ` (${pkg.description})` : ''}
                </option>
              ))}
            </select>
          </div>
          <SubmitButton pendingText="Dodeljujem...">Dodeli</SubmitButton>
        </form>
      )}
    </div>
  )
}
