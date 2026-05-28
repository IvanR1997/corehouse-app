'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

export async function markAdminNotificationRead(notificationId: string) {
  await requireRole('ADMIN')
  await db.adminNotification.update({ where: { id: notificationId }, data: { isRead: true } })
  revalidatePath('/admin/notifications')
}

export async function markAllAdminNotificationsRead() {
  await requireRole('ADMIN')
  await db.adminNotification.updateMany({ where: { isRead: false }, data: { isRead: true } })
  revalidatePath('/admin/notifications')
}
