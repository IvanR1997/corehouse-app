import Link from 'next/link'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

export default async function ClientProgramPage() {
  const user = await requireRole('CLIENT')

  const programs = await db.program.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { trainings: true } },
      access: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
  })

  const unlocked = programs.filter((p) => p.access.length > 0)
  const locked = programs.filter((p) => p.access.length === 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Online programi</h1>
        <p className="text-sm text-text-muted mt-1">Vaši personalizovani trening programi</p>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-subtle bg-surface-card py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-elevated">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
          </div>
          <p className="font-medium text-text-primary mb-1">Nema dostupnih programa</p>
          <p className="text-sm text-text-muted">Kontaktirajte trenera za aktivaciju programa.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Unlocked programs */}
          {unlocked.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">Dostupni programi</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unlocked.map((program) => (
                  <Link
                    key={program.id}
                    href={`/client/program/${program.id}`}
                    className="group relative rounded-2xl border border-border-subtle bg-surface-card p-6 flex flex-col gap-4 hover:border-orange-500/40 hover:bg-surface-elevated/30 transition-all"
                  >
                    {/* Accent bar */}
                    <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">Aktivno</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-text-primary text-base group-hover:text-orange-400 transition-colors">{program.title}</h3>
                      {program.description && (
                        <p className="text-sm text-text-muted mt-1 line-clamp-2">{program.description}</p>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-text-muted">{program._count.trainings} {program._count.trainings === 1 ? 'trening' : 'treninga'}</span>
                      <span className="text-xs font-semibold text-orange-500 group-hover:translate-x-0.5 transition-transform">Otvori →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Locked programs */}
          {locked.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">Zaključani programi</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {locked.map((program) => (
                  <div
                    key={program.id}
                    className="relative rounded-2xl border border-border-subtle bg-surface-card/50 p-6 flex flex-col gap-4 opacity-60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-text-muted">
                          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-text-muted">Zaključano</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-text-primary text-base">{program.title}</h3>
                      {program.description && (
                        <p className="text-sm text-text-muted mt-1 line-clamp-2">{program.description}</p>
                      )}
                    </div>

                    <div className="mt-auto">
                      <p className="text-xs text-text-muted">Kontaktirajte trenera za aktivaciju</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
