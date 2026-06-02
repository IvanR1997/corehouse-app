'use client'

import { useActionState, useState } from 'react'
import { createPackage } from '@/app/actions/packages'
import { SubmitButton } from '@/components/ui/Button'

export function CreatePackageForm() {
  const [state, action] = useActionState(createPackage, undefined)
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-[#EEEE22] px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-[#d4d400] transition-colors"
      >
        + Novi paket
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">Novi paket</h3>
        <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary text-sm">Otkaži</button>
      </div>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm text-green-400">
          Paket je kreiran.
        </div>
      )}

      <form action={action} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Naziv *</label>
          <input name="name" required placeholder="npr. Vođeni 8" className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-[#EEEE22]/50 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Tip *</label>
          <select name="type" required className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary focus:border-[#EEEE22]/50 focus:outline-none">
            <option value="GROUP">Vođeni</option>
            <option value="PERSONAL">Personalni</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Broj treninga *</label>
          <input name="totalSessions" type="number" min="1" required placeholder="npr. 8" className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-[#EEEE22]/50 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Cena (RSD)</label>
          <input name="price" type="number" min="0" placeholder="npr. 8000" className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-[#EEEE22]/50 focus:outline-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-text-muted mb-1">Opis</label>
          <input name="description" placeholder="npr. Uključuje 4 opravke" className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-[#EEEE22]/50 focus:outline-none" />
        </div>
        <div className="sm:col-span-2">
          <SubmitButton pendingText="Kreiram...">Kreiraj paket</SubmitButton>
        </div>
      </form>
    </div>
  )
}
