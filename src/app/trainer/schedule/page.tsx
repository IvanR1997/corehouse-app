import Link from 'next/link'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

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

export default async function TrainerSchedulePage() {
  const user = await requireRole('TRAINER')

  const sessions = await db.session.findMany({
    where: { trainerId: user.id },
    include: {
      _count: { select: { bookings: true } },
      bookings: {
        include: { client: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { startTime: 'asc' },
  })

  const upcoming = sessions.filter((s) => new Date(s.startTime) > new Date())
  const past = sessions.filter((s) => new Date(s.startTime) <= new Date())

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Moj raspored</h1>
          <p className="text-sm text-zinc-500 mt-1">{upcoming.length} nadolazećih termina</p>
        </div>
        <Link
          href="/trainer/sessions/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          + Novi termin
        </Link>
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <p className="text-zinc-500 mb-4">Nemate zakazanih termina.</p>
          <Link
            href="/trainer/sessions/new"
            className="text-orange-500 text-sm font-medium hover:underline"
          >
            Dodajte novi termin →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
                Nadolazeći
              </h2>
              <div className="space-y-3">
                {upcoming.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
                Prošli
              </h2>
              <div className="space-y-3 opacity-60">
                {past.map((session) => (
                  <SessionCard key={session.id} session={session} isPast />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

type SessionCardProps = {
  session: {
    id: string
    type: string
    startTime: Date
    maxCapacity: number
    _count: { bookings: number }
    bookings: { client: { name: string; email: string } }[]
  }
  isPast?: boolean
}

function SessionCard({ session, isPast }: SessionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                session.type === 'GROUP'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {session.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
            </span>
            {isPast && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500">
                Završen
              </span>
            )}
          </div>
          <p className="font-semibold text-zinc-800">{formatDateTime(session.startTime)}</p>
        </div>
        <span className="text-sm text-zinc-500">
          {session._count.bookings} / {session.maxCapacity}
        </span>
      </div>

      {session.bookings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-100">
          <p className="text-xs font-medium text-zinc-500 mb-2">Klijenti:</p>
          <div className="space-y-1">
            {session.bookings.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-semibold text-orange-600">
                  {b.client.name[0]}
                </div>
                <span className="text-sm text-zinc-700">{b.client.name}</span>
                <span className="text-xs text-zinc-400">{b.client.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
