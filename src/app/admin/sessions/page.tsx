import Link from 'next/link'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { DeleteSessionButton } from './DeleteSessionButton'
import { SessionsDayAccordion } from './SessionsDayAccordion'

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat('sr-RS', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function toDateKey(date: Date) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Belgrade' }).format(new Date(date))
}

export default async function AdminSessionsPage() {
  await requireRole('ADMIN')

  const sessions = await db.session.findMany({
    include: {
      trainer: { select: { name: true } },
      bookings: {
        where: { cancelledAt: null },
        include: { client: { select: { name: true } } },
      },
      _count: { select: { bookings: true } },
    },
    orderBy: { startTime: 'asc' },
  })

  const now = new Date()
  const upcoming = sessions.filter((s) => new Date(s.startTime) > now)
  const past = sessions.filter((s) => new Date(s.startTime) <= now).reverse()

  // Group upcoming by date
  const groupMap = new Map<string, typeof upcoming>()
  for (const s of upcoming) {
    const key = toDateKey(new Date(s.startTime))
    if (!groupMap.has(key)) groupMap.set(key, [])
    groupMap.get(key)!.push(s)
  }

  const groups = Array.from(groupMap.entries()).map(([dateKey, daySessions]) => ({
    dateKey,
    label: formatDayLabel(new Date(dateKey)),
    sessions: daySessions.map((s) => ({
      id: s.id,
      type: s.type,
      startTime: s.startTime,
      maxCapacity: s.maxCapacity,
      bookingCount: s._count.bookings,
      trainerName: s.trainer?.name ?? null,
      clientNames: s.bookings.map((b) => b.client.name),
    })),
  }))

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Svi termini</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {upcoming.length} nadolazećih · {past.length} prošlih
          </p>
        </div>
        <Link
          href="/admin/sessions/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-600 transition-colors self-start sm:self-auto"
        >
          + Novi termin
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-16 text-center">
          <p className="text-zinc-400">Nema termina u sistemu.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                Nadolazeći
              </p>
              <SessionsDayAccordion groups={groups} />
            </section>
          )}

          {past.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                Prošli
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-zinc-800">
                    {past.map((session) => (
                      <tr key={session.id} className="opacity-50 hover:opacity-70 transition-opacity">
                        <td className="px-3 md:px-5 py-3 font-medium text-zinc-200 whitespace-nowrap">
                          {new Intl.DateTimeFormat('sr-RS', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Belgrade' }).format(new Date(session.startTime))}
                          <span className="ml-2 text-xs font-normal text-zinc-500">
                            {new Intl.DateTimeFormat('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(session.startTime))}
                          </span>
                        </td>
                        <td className="px-3 md:px-5 py-3 hidden md:table-cell">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            session.type === 'GROUP' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'
                          }`}>
                            {session.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
                          </span>
                        </td>
                        <td className="px-3 md:px-5 py-3 text-zinc-500 text-xs hidden md:table-cell">{session.trainer?.name ?? '—'}</td>
                        <td className="px-3 md:px-5 py-3 text-xs text-zinc-500 hidden md:table-cell">
                          {session._count.bookings}/{session.maxCapacity}
                        </td>
                        <td className="px-3 md:px-5 py-3 text-right">
                          <DeleteSessionButton sessionId={session.id} bookingCount={session._count.bookings} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
