'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

export type BookingState = { error?: string; success?: boolean } | undefined

function packageExpiry(activatedAt: Date) {
  const exp = new Date(activatedAt)
  exp.setMonth(exp.getMonth() + 1)
  return exp
}

function activePackageWhere(userId: string, type: string) {
  const monthAgo = new Date()
  monthAgo.setMonth(monthAgo.getMonth() - 1)
  return {
    userId,
    isActive: true,
    remainingSessions: { gt: 0 },
    package: { type },
    activatedAt: { gte: monthAgo },
  } as const
}

export async function createBooking(sessionId: string): Promise<BookingState> {
  const user = await requireRole('CLIENT')

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { _count: { select: { bookings: true } } },
  })

  if (!session) return { error: 'Termin nije pronađen.' }
  if (session.startTime < new Date()) return { error: 'Ne možete rezervisati prošli termin.' }

  const clientPackage = await db.clientPackage.findFirst({
    where: activePackageWhere(user.id, session.type),
  })

  if (!clientPackage) {
    return {
      error: `Nemate aktivan ${session.type === 'GROUP' ? 'vođeni' : 'personalni'} paket sa preostalim terminima.`,
    }
  }

  if (session._count.bookings >= session.maxCapacity) return { error: 'Termin je popunjen.' }

  const existing = await db.booking.findFirst({
    where: { clientId: user.id, sessionId, cancelledAt: null },
  })
  if (existing) return { error: 'Već ste rezervisali ovaj termin.' }

  const dayStart = new Date(session.startTime); dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(session.startTime); dayEnd.setHours(23, 59, 59, 999)
  const bookingToday = await db.booking.findFirst({
    where: { clientId: user.id, cancelledAt: null, session: { startTime: { gte: dayStart, lte: dayEnd } } },
  })
  if (bookingToday) return { error: 'Već imate termin zakazan za ovaj dan.' }

  await db.$transaction([
    db.booking.create({ data: { clientId: user.id, sessionId } }),
    db.clientPackage.update({
      where: { id: clientPackage.id },
      data: { remainingSessions: { decrement: 1 } },
    }),
  ])

  revalidatePath('/client/sessions')
  revalidatePath('/client/bookings')
  return { success: true }
}

export async function bookSlot(
  startTime: string,
  type: 'GROUP' | 'PERSONAL'
): Promise<BookingState> {
  const user = await requireRole('CLIENT')

  const startDate = new Date(startTime)
  if (startDate <= new Date()) return { error: 'Ne možete rezervisati prošli termin.' }

  const clientPackage = await db.clientPackage.findFirst({
    where: activePackageWhere(user.id, type),
  })

  if (!clientPackage)
    return { error: `Nemate aktivan ${type === 'GROUP' ? 'vođeni' : 'personalni'} paket sa preostalim terminima.` }

  const maxCapacity = type === 'GROUP' ? 15 : 1

  let session = await db.session.findFirst({
    where: { startTime: startDate, type },
    include: { _count: { select: { bookings: true } } },
  })

  if (!session) {
    session = await db.session.create({
      data: { type, startTime: startDate, maxCapacity },
      include: { _count: { select: { bookings: true } } },
    })
  }

  if (session._count.bookings >= session.maxCapacity) return { error: 'Termin je popunjen.' }

  const existing = await db.booking.findFirst({
    where: { clientId: user.id, sessionId: session.id, cancelledAt: null },
  })
  if (existing) return { error: 'Već ste rezervisali ovaj termin.' }

  const slotDayStart = new Date(startDate); slotDayStart.setHours(0, 0, 0, 0)
  const slotDayEnd = new Date(startDate); slotDayEnd.setHours(23, 59, 59, 999)
  const bookingToday = await db.booking.findFirst({
    where: { clientId: user.id, cancelledAt: null, session: { startTime: { gte: slotDayStart, lte: slotDayEnd } } },
  })
  if (bookingToday) return { error: 'Već imate termin zakazan za ovaj dan.' }

  await db.$transaction([
    db.booking.create({ data: { clientId: user.id, sessionId: session.id } }),
    db.clientPackage.update({
      where: { id: clientPackage.id },
      data: { remainingSessions: { decrement: 1 } },
    }),
  ])

  revalidatePath('/client/sessions')
  revalidatePath('/client/bookings')
  return { success: true }
}

export async function cancelBooking(bookingId: string): Promise<BookingState> {
  const user = await requireRole('CLIENT')

  const booking = await db.booking.findUnique({
    where: { id: bookingId, clientId: user.id },
    include: { session: true },
  })

  if (!booking) return { error: 'Rezervacija nije pronađena.' }
  if (booking.cancelledAt) return { error: 'Rezervacija je već otkazana.' }
  if (booking.session.startTime <= new Date()) return { error: 'Ne možete otkazati prošli termin.' }

  const hoursUntil = (booking.session.startTime.getTime() - Date.now()) / (1000 * 60 * 60)
  const isLate = hoursUntil < 24

  const formatDT = (d: Date) =>
    new Intl.DateTimeFormat('sr-RS', {
      weekday: 'short', day: '2-digit', month: '2-digit',
      year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(d)

  if (isLate) {
    await db.booking.update({
      where: { id: bookingId },
      data: { cancelledAt: new Date(), lateCancellation: true },
    })
    await db.adminNotification.create({
      data: {
        message: `${user.name} otkazao termin ${formatDT(booking.session.startTime)} — manje od 24h pre. Termin se računa kao iskorišćen.`,
      },
    })
  } else {
    await db.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { cancelledAt: new Date(), lateCancellation: false },
      })
      const clientPackage = await tx.clientPackage.findFirst({
        where: { userId: user.id, isActive: true, package: { type: booking.session.type } },
        orderBy: { activatedAt: 'desc' },
      })
      if (clientPackage) {
        await tx.clientPackage.update({
          where: { id: clientPackage.id },
          data: { remainingSessions: { increment: 1 } },
        })
      }
      await tx.adminNotification.create({
        data: { message: `${user.name} otkazao termin ${formatDT(booking.session.startTime)}.` },
      })
    })
  }

  revalidatePath('/client/bookings')
  revalidatePath('/client/sessions')
  revalidatePath('/admin/notifications')
  return { success: true }
}

export async function markNotificationRead(bookingId: string) {
  const user = await requireRole('CLIENT')
  await db.booking.updateMany({
    where: { id: bookingId, clientId: user.id },
    data: { notificationRead: true },
  })
  revalidatePath('/client/bookings')
}

export async function markAllNotificationsRead() {
  const user = await requireRole('CLIENT')
  await db.booking.updateMany({
    where: { clientId: user.id, notificationRead: false },
    data: { notificationRead: true },
  })
  revalidatePath('/client/bookings')
}
