'use server'

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

export async function deleteClient(clientId: string) {
  await requireRole('ADMIN')

  await db.user.delete({ where: { id: clientId } })

  redirect('/admin/clients')
}
