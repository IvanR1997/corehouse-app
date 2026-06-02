'use client'

import { useTransition } from 'react'
import { deleteSession } from '@/app/actions/sessions'

export function DeleteSessionButton({
  sessionId,
  bookingCount,
}: {
  sessionId: string
  bookingCount: number
}) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    const warning =
      bookingCount > 0
        ? `Ovaj termin ima ${bookingCount} rezervaciju/a. Brisanjem termina brišu se i rezervacije. Nastavi?`
        : 'Obrisati ovaj termin?'
    if (!confirm(warning)) return
    startTransition(async () => {
      const result = await deleteSession(sessionId)
      if (result?.error) alert(result.error)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-text-muted hover:border-red-200 hover:text-red-500 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Ukloni'}
    </button>
  )
}
