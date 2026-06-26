import Link from 'next/link'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { DeleteProgramButton } from './DeleteProgramButton'

export default async function AdminProgramsPage() {
  await requireRole('ADMIN')

  const programs = await db.program.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { trainings: true, access: true } } },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">Online programi</h1>
          <p className="text-sm text-text-muted mt-1">{programs.length} programa</p>
        </div>
        <Link
          href="/admin/programs/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition-colors whitespace-nowrap"
        >
          + Novi program
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-surface-card py-16 text-center">
          <p className="text-text-muted mb-4">Nema kreiranih programa.</p>
          <Link href="/admin/programs/new" className="text-sm font-medium text-orange-500 hover:underline">
            Kreirajte prvi program →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div key={program.id} className="rounded-xl border border-border-subtle bg-surface-card p-5 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-text-primary">{program.title}</h3>
                <DeleteProgramButton id={program.id} />
              </div>
              {program.description && (
                <p className="text-sm text-text-muted mb-3">{program.description}</p>
              )}
              <div className="flex gap-3 text-xs text-text-muted mb-4 mt-auto">
                <span>{program._count.trainings} treninga</span>
                <span>·</span>
                <span>{program._count.access} klijenata</span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/programs/${program.id}`}
                  className="flex-1 rounded-lg border border-border-subtle px-3 py-2 text-center text-xs font-medium text-text-secondary hover:bg-surface-elevated/50 transition-colors"
                >
                  Uredi sadržaj
                </Link>
                <Link
                  href={`/admin/programs/${program.id}/access`}
                  className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-center text-xs font-semibold text-zinc-950 hover:bg-orange-400 transition-colors"
                >
                  Pristup ({program._count.access})
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
