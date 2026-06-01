'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

export async function requestPackage(packageId: string): Promise<{ success: true } | { error: string }> {
  const user = await requireRole('CLIENT')

  const pkg = await db.package.findUnique({ where: { id: packageId } })
  if (!pkg) return { error: 'Paket nije pronađen.' }

  const existing = await db.packageRequest.findFirst({
    where: { userId: user.id, packageId, status: 'PENDING' },
  })
  if (existing) return { error: 'Već ste poslali zahtev za ovaj paket.' }

  await db.packageRequest.create({
    data: { userId: user.id, packageId, status: 'PENDING' },
  })

  await db.adminNotification.create({
    data: { message: `${user.name} je zatražio/la paket ${pkg.name}.` },
  })

  revalidatePath('/client/packages')
  return { success: true }
}

export async function approvePackageRequest(requestId: string): Promise<{ success: true } | { error: string }> {
  await requireRole('ADMIN')

  const request = await db.packageRequest.findUnique({
    where: { id: requestId },
    include: { user: true, package: true },
  })
  if (!request) return { error: 'Zahtev nije pronađen.' }

  await db.packageRequest.update({
    where: { id: requestId },
    data: { status: 'APPROVED' },
  })

  await db.adminNotification.create({
    data: { message: `Zahtev za paket ${request.package.name} od ${request.user.name} je odobren.` },
  })

  revalidatePath('/admin/requests')
  return { success: true }
}

export async function rejectPackageRequest(requestId: string): Promise<{ success: true } | { error: string }> {
  await requireRole('ADMIN')

  const request = await db.packageRequest.findUnique({ where: { id: requestId } })
  if (!request) return { error: 'Zahtev nije pronađen.' }

  await db.packageRequest.update({
    where: { id: requestId },
    data: { status: 'REJECTED' },
  })

  revalidatePath('/admin/requests')
  return { success: true }
}
