import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { updateVideo } from '@/app/actions/videos'
import { VideoForm } from '../../VideoForm'

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('ADMIN')
  const { id } = await params

  const video = await db.video.findUnique({ where: { id } })
  if (!video) notFound()

  const boundAction = updateVideo.bind(null, id)

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/admin/videos" className="text-sm text-orange-500 hover:underline">← Nazad na biblioteku</Link>
        <h1 className="text-2xl font-bold text-text-primary mt-2">Uredi snimak</h1>
      </div>
      <VideoForm
        action={boundAction}
        defaultValues={{ title: video.title, url: video.url, category: video.category, description: video.description ?? '' }}
        submitLabel="Sačuvaj izmjene"
      />
    </div>
  )
}
