import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { MarkNotificationReadButton, MarkAllNotificationsReadButton } from './NotificationActions'

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('sr-RS', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Belgrade',
  }).format(new Date(date))
}

export default async function AdminNotificationsPage() {
  await requireRole('ADMIN')

  const notifications = await db.adminNotification.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const unread = notifications.filter((n) => !n.isRead)
  const read = notifications.filter((n) => n.isRead)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Obaveštenja</h1>
          <p className="text-sm text-text-muted mt-1">
            {unread.length} nepročitanih · {read.length} pročitanih
          </p>
        </div>
        {unread.length > 0 && <MarkAllNotificationsReadButton />}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-surface-card py-16 text-center">
          <p className="text-text-muted">Nema obaveštenja.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead
                  ? 'border-orange-500/30 bg-orange-500/10'
                  : 'border-border-subtle bg-surface-card opacity-60'
              }`}
            >
              <div>
                {!n.isRead && (
                  <span className="inline-block rounded-full bg-orange-400 w-2 h-2 mr-2 mb-0.5 align-middle" />
                )}
                <span className="text-sm text-text-secondary">{n.message}</span>
                <p className="text-xs text-text-muted mt-1">{formatDateTime(n.createdAt)}</p>
              </div>
              {!n.isRead && <MarkNotificationReadButton notificationId={n.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
