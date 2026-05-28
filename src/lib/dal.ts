import 'server-only'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { getSession } from './session'
import { db } from './db'

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  if (!session?.userId) return null

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  })

  return user
})

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(role: 'ADMIN' | 'TRAINER' | 'CLIENT') {
  const user = await requireAuth()
  if (user.role !== role) redirect('/dashboard')
  return user
}

export async function requireAnyRole(roles: Array<'ADMIN' | 'TRAINER' | 'CLIENT'>) {
  const user = await requireAuth()
  if (!roles.includes(user.role as 'ADMIN' | 'TRAINER' | 'CLIENT')) {
    redirect('/dashboard')
  }
  return user as typeof user & { role: 'ADMIN' | 'TRAINER' | 'CLIENT' }
}
