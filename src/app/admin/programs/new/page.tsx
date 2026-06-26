'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { createProgram } from '@/app/actions/programs'
import { SubmitButton } from '@/components/ui/Button'

const inputCls = 'block w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'

export default function NewProgramPage() {
  const [state, action] = useActionState(createProgram, undefined)

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/admin/programs" className="text-sm text-orange-500 hover:underline">← Nazad na programe</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-2">Novi program</h1>
        <p className="text-sm text-text-muted mt-1">Treninzi i vježbe se dodaju u sljedećem koraku.</p>
      </div>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div className="rounded-xl border border-border-subtle bg-surface-card p-6 shadow-sm">
        <form action={action} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Naziv programa</label>
            <input name="title" type="text" required placeholder="npr. 12-nedeljni program snage" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Opis <span className="text-text-muted font-normal">(opcionalno)</span>
            </label>
            <textarea name="description" rows={3} placeholder="Kratki opis programa..." className={`${inputCls} resize-none`} />
          </div>
          <SubmitButton pendingText="Kreiram...">Kreiraj i dodaj treninge →</SubmitButton>
        </form>
      </div>
    </div>
  )
}
