import Link from 'next/link'
import { requireRole } from '@/lib/dal'
import { createVideo } from '@/app/actions/videos'
import { VideoForm } from '../VideoForm'

export default async function NewVideoPage() {
  await requireRole('ADMIN')

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/admin/videos" className="text-sm text-orange-500 hover:underline">← Nazad na biblioteku</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-2">Novi snimak</h1>
      </div>
      <VideoForm action={createVideo} submitLabel="Dodaj snimak" />
    </div>
  )
}
