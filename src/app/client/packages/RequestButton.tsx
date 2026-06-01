'use client'

import { useState, useTransition } from 'react'
import { requestPackage } from '@/app/actions/packageRequests'

export function RequestButton({ packageId }: { packageId: string }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success?: true; error?: string } | null>(null)

  if (result?.success) {
    return (
      <div className="w-full rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-sm font-medium text-green-400">
        ✓ Zahtev je poslat! Uskoro ćete biti kontaktirani.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {result?.error && (
        <p className="text-xs text-red-400 text-center">{result.error}</p>
      )}
      <button
        onClick={() =>
          startTransition(async () => {
            const res = await requestPackage(packageId)
            setResult(res)
          })
        }
        disabled={isPending}
        className="w-full rounded-xl bg-[#EEEE22] text-zinc-950 py-3 text-sm font-bold hover:bg-[#d4d400] disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Slanje...' : 'Zatraži paket'}
      </button>
    </div>
  )
}
