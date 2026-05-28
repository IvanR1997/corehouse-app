'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

export type PackageState = { error?: string; success?: boolean } | undefined

export async function activatePackage(clientPackageId: string): Promise<PackageState> {
  await requireRole('ADMIN')

  const clientPackage = await db.clientPackage.findUnique({
    where: { id: clientPackageId },
  })

  if (!clientPackage) return { error: 'Paket nije pronađen.' }
  if (clientPackage.isActive) return { error: 'Paket je već aktivan.' }

  await db.clientPackage.update({
    where: { id: clientPackageId },
    data: { isActive: true, activatedAt: new Date() },
  })

  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${clientPackage.userId}/activate`)
  return { success: true }
}

export async function assignPackage(
  userId: string,
  _state: PackageState,
  formData: FormData
): Promise<PackageState> {
  await requireRole('ADMIN')

  const packageId = formData.get('packageId') as string
  if (!packageId) return { error: 'Odaberite paket.' }

  const pkg = await db.package.findUnique({ where: { id: packageId } })
  if (!pkg) return { error: 'Paket nije pronađen.' }

  await db.clientPackage.create({
    data: {
      userId,
      packageId,
      remainingSessions: pkg.totalSessions,
      isActive: false,
    },
  })

  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${userId}/activate`)
  return { success: true }
}

export async function deletePackage(packageId: string): Promise<PackageState> {
  await requireRole('ADMIN')

  const assignedCount = await db.clientPackage.count({ where: { packageId } })
  if (assignedCount > 0)
    return { error: `Paket je dodeljen ${assignedCount} klijentu/ima i ne može se obrisati.` }

  await db.package.delete({ where: { id: packageId } })

  revalidatePath('/admin/packages')
  return { success: true }
}

export async function removeClientPackage(clientPackageId: string): Promise<PackageState> {
  await requireRole('ADMIN')

  const clientPackage = await db.clientPackage.findUnique({
    where: { id: clientPackageId },
  })

  if (!clientPackage) return { error: 'Paket nije pronađen.' }

  await db.clientPackage.delete({ where: { id: clientPackageId } })

  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${clientPackage.userId}/activate`)
  return { success: true }
}
