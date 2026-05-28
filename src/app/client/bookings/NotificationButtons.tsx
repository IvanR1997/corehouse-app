'use client'

import { useTransition } from 'react'
import { markNotificationRead, markAllNotificationsRead } from '@/app/actions/bookings'

export function MarkReadButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => markNotificationRead(bookingId))}
      disabled={isPending}
      className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Označi kao pročitano'}
    </button>
  )
}

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => markAllNotificationsRead())}
      disabled={isPending}
      className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
    >
      {isPending ? 'Označavam...' : 'Sve pročitano'}
    </button>
  )
}
