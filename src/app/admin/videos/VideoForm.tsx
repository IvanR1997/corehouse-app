'use client'

import { useActionState } from 'react'
import { SubmitButton } from '@/components/ui/Button'

const CATEGORIES = [
  { value: 'MOBILNOST', label: 'Mobilnost' },
  { value: 'CORE', label: 'Core' },
  { value: 'NOGE', label: 'Noge' },
  { value: 'LEDJA', label: 'Leđa' },
  { value: 'GRUDI', label: 'Grudi' },
  { value: 'RAMENA', label: 'Ramena' },
  { value: 'BICEPS', label: 'Biceps' },
  { value: 'TRICEPS', label: 'Triceps' },
  { value: 'KARDIO', label: 'Kardio' },
  { value: 'OSTALO', label: 'Ostalo' },
]

const inputCls = 'block w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'

type Action = (state: { error?: string; success?: boolean } | undefined, formData: FormData) => Promise<{ error?: string; success?: boolean } | undefined>

type Props = {
  action: Action
  defaultValues?: { title?: string; url?: string; category?: string; description?: string }
  submitLabel?: string
}

export function VideoForm({ action, defaultValues = {}, submitLabel = 'Sačuvaj' }: Props) {
  const [state, formAction] = useActionState(action, undefined)

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-card p-6 shadow-sm">
      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          Snimak je sačuvan.
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Naziv vježbe</label>
          <input name="title" type="text" required defaultValue={defaultValues.title} placeholder="npr. Plank na pilates lopti" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">URL snimka</label>
          <input name="url" type="url" required defaultValue={defaultValues.url} placeholder="https://youtube.com/watch?v=..." className={inputCls} />
          <p className="text-xs text-text-muted mt-1">YouTube, Vimeo ili direktni link</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Kategorija</label>
          <select name="category" required defaultValue={defaultValues.category} className={inputCls}>
            <option value="">Odaberite kategoriju</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Napomena <span className="text-text-muted font-normal">(opcionalno)</span>
          </label>
          <input name="description" type="text" defaultValue={defaultValues.description} placeholder="npr. Pazi na položaj kičme" className={inputCls} />
        </div>
        <SubmitButton pendingText="Čuvam...">{submitLabel}</SubmitButton>
      </form>
    </div>
  )
}
