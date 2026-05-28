import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { MarkNotificationReadButton, MarkAllNotificationsReadButton } from './NotificationActions'

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('sr-RS', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
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
          <h1 className="text-2xl font-bold text-zinc-900">Obaveštenja</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {unread.length} nepročitanih · {read.length} pročitanih
          </p>
        </div>
        {unread.length > 0 && <MarkAllNotificationsReadButton />}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <p className="text-zinc-500">Nema obaveštenja.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead
                  ? 'border-orange-200 bg-orange-50/40'
                  : 'border-zinc-200 bg-white opacity-60'
              }`}
            >
              <div>
                {!n.isRead && (
                  <span className="inline-block rounded-full bg-orange-400 w-2 h-2 mr-2 mb-0.5 align-middle" />
                )}
                <span className="text-sm text-zinc-800">{n.message}</span>
                <p className="text-xs text-zinc-400 mt-1">{formatDateTime(n.createdAt)}</p>
              </div>
              {!n.isRead && <MarkNotificationReadButton notificationId={n.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
