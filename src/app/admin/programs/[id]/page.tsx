import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { ProgramBuilder } from './ProgramBuilder'

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('ADMIN')
  const { id } = await params

  const [program, allVideos] = await Promise.all([
    db.program.findUnique({
      where: { id },
      include: {
        trainings: {
          orderBy: { order: 'asc' },
          include: {
            sections: {
              orderBy: { order: 'asc' },
              include: {
                exercises: {
                  orderBy: { order: 'asc' },
                  include: { video: true },
                },
              },
            },
          },
        },
      },
    }),
    db.video.findMany({
      orderBy: [{ category: 'asc' }, { title: 'asc' }],
      select: { id: true, title: true, category: true, url: true },
    }),
  ])

  if (!program) notFound()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/programs" className="text-sm text-orange-500 hover:underline">← Nazad na programe</Link>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary mt-2">{program.title}</h1>
          {program.description && <p className="text-sm text-text-muted mt-1">{program.description}</p>}
        </div>
        <Link
          href={`/admin/programs/${id}/access`}
          className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-elevated/50 transition-colors whitespace-nowrap"
        >
          Upravljaj pristupom →
        </Link>
      </div>

      <ProgramBuilder program={program} allVideos={allVideos} />
    </div>
  )
}
