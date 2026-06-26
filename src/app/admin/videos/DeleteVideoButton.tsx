'use client'

import { useTransition } from 'react'
import { deleteVideo } from '@/app/actions/videos'

export function DeleteVideoButton({ id, inUse }: { id: string; inUse: boolean }) {
  const [isPending, startTransition] = useTransition()

  if (inUse) {
    return <span className="px-3 py-1.5 text-xs text-text-muted/40">Obrišite</span>
  }

  return (
    <button
      onClick={() => {
        if (!confirm('Obrisati snimak?')) return
        startTransition(async () => {
          const result = await deleteVideo(id)
          if (result?.error) alert(result.error)
        })
      }}
      disabled={isPending}
      className="rounded-md px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Obrišite'}
    </button>
  )
}
