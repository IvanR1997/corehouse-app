import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { ExerciseCard } from './ExerciseCard'

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

  const totalExercises = program.trainings.flatMap((t) => t.sections.flatMap((s) => s.exercises)).length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/client/program" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-orange-500 transition-colors mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Nazad na programe
        </Link>

        <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-400">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{program.title}</h1>
              {program.description && (
                <p className="text-text-muted mt-1.5 max-w-2xl">{program.description}</p>
              )}
              <div className="flex gap-4 mt-3">
                <span className="text-xs text-text-muted">
                  <span className="font-semibold text-text-secondary">{program.trainings.length}</span> treninga
                </span>
                <span className="text-xs text-text-muted">
                  <span className="font-semibold text-text-secondary">{totalExercises}</span> vežbi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {program.trainings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-subtle bg-surface-card py-16 text-center">
          <p className="text-text-muted">Program je u pripremi, uskoro će biti dostupan.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {program.trainings.map((training) => (
            <div key={training.id} className="rounded-2xl border border-border-subtle overflow-hidden">
              {/* Training header */}
              <div className="flex items-center gap-4 px-5 py-4 bg-surface-elevated border-b border-border-subtle">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-zinc-950">
                  {training.order}
                </span>
                <div>
                  <h2 className="font-bold text-text-primary">{training.title}</h2>
                  <p className="text-xs text-text-muted">
                    {training.sections.length} {training.sections.length === 1 ? 'sekcija' : 'sekcija'} · {training.sections.reduce((a, s) => a + s.exercises.length, 0)} vežbi
                  </p>
                </div>
              </div>

              {/* Sections */}
              <div className="bg-surface-card divide-y divide-border-subtle">
                {training.sections.map((section) => (
                  <div key={section.id} className="px-5 py-4">
                    {/* Section label */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px flex-1 bg-border-subtle" />
                      <span className="text-xs font-bold uppercase tracking-widest text-orange-500/70 px-2">
                        {section.title}
                      </span>
                      <div className="h-px flex-1 bg-border-subtle" />
                    </div>

                    {/* Exercises — 2-column layout on desktop */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {section.exercises.map((ex) => (
                        <ExerciseCard
                          key={ex.id}
                          url={ex.video.url}
                          title={ex.video.title}
                          category={categoryLabel[ex.video.category] ?? ex.video.category}
                          setsReps={ex.setsReps}
                          note={ex.note}
                        />
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
