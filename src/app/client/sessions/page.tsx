import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { SessionsCalendar } from './SessionsCalendar'
import type { SessionData } from './SessionsCalendar'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function PackageBanner({
  name,
  remaining,
  total,
  activatedAt,
}: {
  name: string
  remaining: number
  total: number
  activatedAt: Date | null
}) {
  const pct = Math.round(((total - remaining) / total) * 100)

  const expiresAt = activatedAt ? (() => { const d = new Date(activatedAt); d.setMonth(d.getMonth() + 1); return d })() : null
  const expiryText = expiresAt ? `Važi do ${formatDate(expiresAt)}` : null

  if (remaining === 1) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-red-400">{name}</p>
          <p className="text-xs text-red-400 mt-0.5">
            Imate još <strong>1 termin</strong> — kontaktirajte nas za produženje paketa.
          </p>
          {expiryText && <p className="text-xs text-red-400 mt-0.5">{expiryText}</p>}
        </div>
        <span className="text-2xl font-bold text-red-500">1</span>
      </div>
    )
  }

  if (remaining <= 5) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm font-semibold text-amber-400">{name}</p>
            <div className="text-right">
              <span className="text-sm font-bold text-amber-400">{remaining} preostalih</span>
              {expiryText && <p className="text-xs text-amber-400">{expiryText}</p>}
            </div>
          </div>
          <div className="w-full rounded-full bg-amber-500/15 h-1.5">
            <div className="rounded-full bg-amber-400 h-1.5" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-card px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-semibold text-text-primary">{name}</p>
          <div className="text-right">
            <span className="text-sm font-medium text-text-secondary">{remaining} / {total}</span>
            {expiryText && <p className="text-xs text-text-muted">{expiryText}</p>}
          </div>
        </div>
        <div className="w-full rounded-full bg-surface-elevated h-1.5">
          <div className="rounded-full bg-orange-400 h-1.5" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

export default async function ClientSessionsPage() {
  const user = await requireRole('CLIENT')

  const monthAgo = new Date()
  monthAgo.setMonth(monthAgo.getMonth() - 1)

  const [sessions, userBookingIds, activePackages] = await Promise.all([
    db.session.findMany({
      where: { startTime: { gt: new Date() } },
      include: {
        trainer: { select: { name: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { startTime: 'asc' },
    }),
    db.booking.findMany({
      where: { clientId: user.id, cancelledAt: null },
      select: { sessionId: true },
    }),
    db.clientPackage.findMany({
      where: {
        userId: user.id,
        isActive: true,
        remainingSessions: { gt: 0 },
        activatedAt: { gte: monthAgo },
      },
      include: { package: { select: { type: true, name: true, totalSessions: true } } },
    }),
  ])

  const bookedSessionIds = new Set(userBookingIds.map((b) => b.sessionId))
  const hasPersonalPackage = activePackages.some((p) => p.package.type === 'PERSONAL')
  const hasGroupPackage = activePackages.some((p) => p.package.type === 'GROUP')

  const getExpiry = (type: string) => {
    const pkg = activePackages.find((p) => p.package.type === type && p.activatedAt)
    if (!pkg?.activatedAt) return null
    const d = new Date(pkg.activatedAt)
    d.setMonth(d.getMonth() + 1)
    return d.toISOString()
  }
  const groupPackageExpiry = getExpiry('GROUP')
  const personalPackageExpiry = getExpiry('PERSONAL')

  const sessionData: SessionData[] = sessions.map((session) => {
    const isBooked = bookedSessionIds.has(session.id)
    const isFull = session._count.bookings >= session.maxCapacity
    const canBook =
      !isBooked && !isFull && (session.type === 'GROUP' ? hasGroupPackage : hasPersonalPackage)
    const missingPackage =
      !isBooked && !isFull && (session.type === 'GROUP' ? !hasGroupPackage : !hasPersonalPackage)

    return {
      id: session.id,
      type: session.type as 'GROUP' | 'PERSONAL',
      startTime: session.startTime.toISOString(),
      maxCapacity: session.maxCapacity,
      trainerName: session.trainer?.name ?? '',
      bookingCount: session._count.bookings,
      isBooked,
      canBook,
      missingPackage,
    }
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Dostupni termini</h1>
        <p className="text-sm text-text-muted mt-1">
          Izaberite tip treninga, pa datum i termin
        </p>
      </div>

      {activePackages.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {activePackages.map((p) => (
            <PackageBanner
              key={p.id}
              name={p.package.name}
              remaining={p.remainingSessions}
              total={p.package.totalSessions}
              activatedAt={p.activatedAt}
            />
          ))}
        </div>
      )}

      <SessionsCalendar
        sessions={sessionData}
        hasGroupPackage={hasGroupPackage}
        hasPersonalPackage={hasPersonalPackage}
        groupPackageExpiry={groupPackageExpiry}
        personalPackageExpiry={personalPackageExpiry}
      />
    </div>
  )
}
