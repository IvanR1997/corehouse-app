'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAnyRole, requireRole } from '@/lib/dal'

const CreateSessionSchema = z.object({
  type: z.enum(['PERSONAL', 'GROUP']),
  startTime: z.string().min(1, 'Datum i vreme su obavezni.'),
  trainerId: z.string().optional(),
  clientId: z.string().optional(),
})

export type SessionState = { error?: string } | undefined

export async function createSession(state: SessionState, formData: FormData): Promise<SessionState> {
  const user = await requireAnyRole(['TRAINER', 'ADMIN', 'CLIENT'])

  const validated = CreateSessionSchema.safeParse({
    type: formData.get('type'),
    startTime: formData.get('startTime'),
    trainerId: formData.get('trainerId') || undefined,
    clientId: formData.get('clientId') || undefined,
  })

  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  const { type, startTime, trainerId, clientId } = validated.data

  if (type === 'GROUP' && user.role === 'CLIENT') {
    return { error: 'Klijenti mogu kreirati samo personalne treninge.' }
  }

  const resolvedTrainerId = user.role === 'TRAINER' ? user.id : (trainerId ?? null)

  const startDate = new Date(startTime)
  if (startDate <= new Date()) {
    return { error: 'Termin mora biti u budućnosti.' }
  }

  await db.session.create({
    data: {
      type,
      trainerId: resolvedTrainerId,
      startTime: startDate,
      maxCapacity: type === 'GROUP' ? 15 : 1,
    },
  })

  if (clientId && user.role === 'ADMIN') {
    const session = await db.session.findFirst({
      where: { startTime: startDate, type },
      select: { id: true },
    })
    if (session) {
      const alreadyBooked = await db.booking.findUnique({
        where: { clientId_sessionId: { clientId, sessionId: session.id } },
      })
      if (!alreadyBooked) {
        await db.booking.create({ data: { clientId, sessionId: session.id } })
        const clientPackage = await db.clientPackage.findFirst({
          where: { userId: clientId, isActive: true, remainingSessions: { gt: 0 }, package: { type } },
        })
        if (clientPackage) {
          await db.clientPackage.update({
            where: { id: clientPackage.id },
            data: { remainingSessions: { decrement: 1 } },
          })
        }
      }
    }
    revalidatePath('/client/bookings')
  }

  revalidatePath('/trainer/schedule')
  revalidatePath('/admin/sessions')
  revalidatePath('/client/sessions')

  if (user.role === 'TRAINER') redirect('/trainer/schedule')
  if (user.role === 'ADMIN') redirect('/admin/sessions')
  redirect('/client/sessions')
}

export async function deleteSession(sessionId: string): Promise<{ error?: string } | undefined> {
  await requireRole('ADMIN')

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { _count: { select: { bookings: true } } },
  })

  if (!session) return { error: 'Termin nije pronađen.' }

  await db.session.delete({ where: { id: sessionId } })

  revalidatePath('/admin/sessions')
  revalidatePath('/client/sessions')
  revalidatePath('/trainer/schedule')
}
