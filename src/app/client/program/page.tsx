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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Online programi</h1>
        <p className="text-sm text-text-muted mt-1">Vaši dostupni trening programi</p>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-surface-card py-16 text-center">
          <p className="text-text-muted">Trenutno nema dostupnih programa.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const hasAccess = program.access.length > 0
            return (
              <div
                key={program.id}
                className="rounded-xl border border-border-subtle bg-surface-card p-5 shadow-sm flex flex-col"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-text-primary">{program.title}</h3>
                  {!hasAccess && (
                    <span className="ml-2 rounded-full bg-surface-elevated p-1" title="Zaključano">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-text-muted">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>

                {program.description && (
                  <p className="text-sm text-text-muted mb-3">{program.description}</p>
                )}

                <div className="mt-auto">
                  <p className="text-xs text-text-muted mb-3">{program._count.trainings} treninga</p>

                  {hasAccess ? (
                    <Link
                      href={`/client/program/${program.id}`}
                      className="block w-full rounded-lg bg-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition-colors"
                    >
                      Otvori program →
                    </Link>
                  ) : (
                    <div className="rounded-lg border border-border-subtle bg-surface-elevated px-4 py-2.5 text-center text-sm text-text-muted">
                      Zaključano — kontaktirajte trenera
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
