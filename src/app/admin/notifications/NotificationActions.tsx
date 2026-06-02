'use client'

import { useTransition } from 'react'
import { markAdminNotificationRead, markAllAdminNotificationsRead } from '@/app/actions/notifications'

export function MarkNotificationReadButton({ notificationId }: { notificationId: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(() => markAdminNotificationRead(notificationId))}
      disabled={isPending}
      className="shrink-0 rounded-lg border border-border-subtle px-3 py-1.5 text-xs text-text-muted hover:bg-surface-elevated/50 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Pročitano'}
    </button>
  )
}

export function MarkAllNotificationsReadButton() {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(() => markAllAdminNotificationsRead())}
      disabled={isPending}
      className="rounded-lg border border-border-subtle px-4 py-2 text-sm text-text-secondary hover:bg-surface-elevated/50 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Označi sve kao pročitano'}
    </button>
  )
}
