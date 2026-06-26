import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

const categoryLabel: Record<string, string> = {
  MOBILNOST: 'Mobilnost', CORE: 'Core', NOGE: 'Noge', LEDJA: 'Leđa',
  GRUDI: 'Grudi', RAMENA: 'Ramena', BICEPS: 'Biceps', TRICEPS: 'Triceps',
  KARDIO: 'Kardio', OSTALO: 'Ostalo',
}

export default async function ClientProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole('CLIENT')
  const { id } = await params

  const [program, access] = await Promise.all([
    db.program.findUnique({
      where: { id, isPublished: true },
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
    db.programAccess.findUnique({
      where: { userId_programId: { userId: user.id, programId: id } },
    }),
  ])

  if (!program) notFound()
  if (!access) redirect('/client/program')

  return (
    <div>
      <div className="mb-8">
        <Link href="/client/program" className="text-sm text-orange-500 hover:underline">
          ← Nazad na programe
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-3">{program.title}</h1>
        {program.description && (
          <p className="text-text-muted mt-2 max-w-2xl">{program.description}</p>
        )}
      </div>

      {program.trainings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-surface-card py-16 text-center">
          <p className="text-text-muted">Program je u pripremi, uskoro će biti dostupan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {program.trainings.map((training) => (
            <div key={training.id} className="rounded-xl border border-border-subtle overflow-hidden">
              {/* Training header */}
              <div className="flex items-center gap-4 px-5 py-4 bg-surface-elevated">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-zinc-950">
                  {training.order}
                </span>
                <h2 className="text-base font-bold text-text-primary">{training.title}</h2>
              </div>

              {/* Sections */}
              <div className="bg-surface-card divide-y divide-border-subtle">
                {training.sections.map((section) => (
                  <div key={section.id}>
                    {/* Section label */}
                    <div className="px-5 py-2 bg-surface-elevated/40">
                      <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                        {section.title}
                      </span>
                    </div>

                    {/* Exercises — 2-column layout on desktop */}
                    <div className="px-5 py-3 grid gap-3 sm:grid-cols-2">
                      {section.exercises.map((ex) => (
                        <div
                          key={ex.id}
                          className="flex items-start gap-4 rounded-lg border border-border-subtle bg-surface p-4"
                        >
                          {/* Thumbnail / play button placeholder */}
                          <a
                            href={ex.video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-surface-elevated border border-border-subtle hover:border-orange-500/50 transition-colors group"
                            title="Pogledaj video"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform">
                              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                          </a>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-text-primary text-sm leading-snug">{ex.video.title}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-semibold text-orange-400">
                                {ex.setsReps}
                              </span>
                              <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-text-muted">
                                {categoryLabel[ex.video.category] ?? ex.video.category}
                              </span>
                            </div>
                            {ex.note && (
                              <p className="text-xs text-text-muted mt-1.5 italic">{ex.note}</p>
                            )}
                            <a
                              href={ex.video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-block text-xs font-medium text-orange-500 hover:underline"
                            >
                              Pogledaj video →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
