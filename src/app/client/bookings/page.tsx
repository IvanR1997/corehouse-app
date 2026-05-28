import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { MarkReadButton, MarkAllReadButton } from './NotificationButtons'
import { CancelBookingButton } from './CancelBookingButton'

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('sr-RS', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default async function ClientBookingsPage() {
  const user = await requireRole('CLIENT')

  const bookings = await db.booking.findMany({
    where: { clientId: user.id },
    include: {
      session: {
        include: { trainer: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const now = new Date()
  const unreadCount = bookings.filter((b) => !b.notificationRead && !b.cancelledAt).length
  const activeBookings = bookings.filter((b) => !b.cancelledAt)
  const cancelledBookings = bookings.filter((b) => b.cancelledAt)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Moje rezervacije</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-orange-500 mt-1">
              {unreadCount} {unreadCount === 1 ? 'nova notifikacija' : 'novih notifikacija'}
            </p>
          )}
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <p className="text-zinc-500">Nemate rezervacija.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active bookings */}
          {activeBookings.length > 0 && (
            <section>
              <div className="space-y-3">
                {activeBookings.map((booking) => {
                  const isPast = booking.session.startTime <= now
                  const hoursUntil = (booking.session.startTime.getTime() - now.getTime()) / (1000 * 60 * 60)
                  const canCancel = !isPast

                  return (
                    <div
                      key={booking.id}
                      className={`rounded-xl border bg-white p-5 transition-colors ${
                        !booking.notificationRead
                          ? 'border-orange-200 bg-orange-50/30'
                          : 'border-zinc-200'
                      } ${isPast ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              booking.session.type === 'GROUP'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {booking.session.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
                            </span>
                            {isPast && (
                              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">Završen</span>
                            )}
                            {!booking.notificationRead && !isPast && (
                              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">Novo</span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-zinc-800">
                            {formatDateTime(booking.session.startTime)}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Rezervisano: {formatDateTime(booking.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!booking.notificationRead && !isPast && (
                            <MarkReadButton bookingId={booking.id} />
                          )}
                          {canCancel && (
                            <CancelBookingButton bookingId={booking.id} hoursUntil={hoursUntil} />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Cancelled bookings */}
          {cancelledBookings.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Otkazani termini</h2>
              <div className="space-y-3">
                {cancelledBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`rounded-xl border p-5 ${
                      booking.lateCancellation
                        ? 'border-red-100 bg-red-50/40'
                        : 'border-zinc-200 bg-zinc-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            booking.session.type === 'GROUP'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {booking.session.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
                          </span>
                          {booking.lateCancellation ? (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                              Kasno otkazivanje — termin potrošen
                            </span>
                          ) : (
                            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-500">Otkazano</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-zinc-700">
                          {formatDateTime(booking.session.startTime)}
                        </p>
                        {booking.cancelledAt && (
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Otkazano: {formatDateTime(booking.cancelledAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
