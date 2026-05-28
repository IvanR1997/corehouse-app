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
      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
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
      className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:border-red-200 hover:text-red-500 disabled:opacity-50 transition-colors"
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
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg w-fit mb-4">
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
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
          Paket dodijeljen. Aktivirajte ga ispod.
        </div>
      )}

      {packages.length === 0 ? (
        <p className="text-sm text-zinc-400">Nema paketa za ovaj tip treninga.</p>
      ) : (
        <form action={action} className="space-y-3">
          <input type="hidden" name="tab" value={activeTab} />
          <div>
            <label htmlFor="packageId" className="block text-sm font-medium text-zinc-700 mb-1.5">
              Odaberi paket
            </label>
            <select
              id="packageId"
              name="packageId"
              required
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} — {pkg.totalSessions} {pkg.totalSessions === 1 ? 'trening' : 'treninga'}
                  {pkg.description ? ` (${pkg.description})` : ''}
                </option>
              ))}
            </select>
          </div>
          <SubmitButton pendingText="Dodijeljujem...">Dodijeli</SubmitButton>
        </form>
      )}
    </div>
  )
}
