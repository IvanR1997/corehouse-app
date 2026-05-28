import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/dal'

export default async function DashboardPage() {
  const user = await requireAuth()

  if (user.role === 'ADMIN') redirect('/admin/clients')
  if (user.role === 'TRAINER') redirect('/trainer/schedule')
  redirect('/client/sessions')
}
