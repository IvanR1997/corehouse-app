import Link from 'next/link'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { DeleteVideoButton } from './DeleteVideoButton'

export const categoryLabel: Record<string, string> = {
  MOBILNOST: 'Mobilnost', CORE: 'Core', NOGE: 'Noge', LEDJA: 'Leđa',
  GRUDI: 'Grudi', RAMENA: 'Ramena', BICEPS: 'Biceps', TRICEPS: 'Triceps',
  KARDIO: 'Kardio', OSTALO: 'Ostalo',
}

const categoryColor: Record<string, string> = {
  MOBILNOST: 'bg-teal-500/15 text-teal-400',
  CORE: 'bg-yellow-500/15 text-yellow-400',
  NOGE: 'bg-orange-500/15 text-orange-400',
  LEDJA: 'bg-stone-500/15 text-stone-400',
  GRUDI: 'bg-red-500/15 text-red-400',
  RAMENA: 'bg-blue-500/15 text-blue-400',
  BICEPS: 'bg-purple-500/15 text-purple-400',
  TRICEPS: 'bg-violet-500/15 text-violet-400',
  KARDIO: 'bg-pink-500/15 text-pink-400',
  OSTALO: 'bg-zinc-500/15 text-zinc-400',
}

export default async function AdminVideosPage() {
  await requireRole('ADMIN')

  const videos = await db.video.findMany({
    orderBy: [{ category: 'asc' }, { title: 'asc' }],
    include: { _count: { select: { exercises: true } } },
  })

  const byCategory = videos.reduce<Record<string, typeof videos>>((acc, v) => {
    acc[v.category] = acc[v.category] ?? []
    acc[v.category].push(v)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">Video biblioteka</h1>
          <p className="text-sm text-text-muted mt-1">
            {videos.length} snimaka u {Object.keys(byCategory).length} kategorija
          </p>
        </div>
        <Link
          href="/admin/videos/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition-colors whitespace-nowrap"
        >
          + Dodaj snimak
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-surface-card py-16 text-center">
          <p className="text-text-muted mb-4">Biblioteka je prazna.</p>
          <Link href="/admin/videos/new" className="text-sm font-medium text-orange-500 hover:underline">
            Dodajte prvi snimak →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(categoryLabel).map(([cat, label]) => {
            const catVideos = byCategory[cat]
            if (!catVideos) return null
            return (
              <section key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">{label}</h2>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryColor[cat]}`}>
                    {catVideos.length}
                  </span>
                </div>
                <div className="rounded-xl border border-border-subtle bg-surface-card shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border-subtle">
                      {catVideos.map((video) => (
                        <tr key={video.id} className="hover:bg-surface-elevated/30 transition-colors">
                          <td className="px-3 md:px-5 py-3.5">
                            <p className="font-medium text-text-primary">{video.title}</p>
                            {video.description && (
                              <p className="text-xs text-text-muted mt-0.5">{video.description}</p>
                            )}
                          </td>
                          <td className="px-3 md:px-5 py-3.5 hidden md:table-cell">
                            <span className="text-xs text-text-muted">
                              {video._count.exercises > 0
                                ? `Korišćen u ${video._count.exercises} vježbi`
                                : 'Nije korišćen'}
                            </span>
                          </td>
                          <td className="px-3 md:px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md px-3 py-1.5 text-xs font-medium text-orange-500 hover:bg-orange-500/10 transition-colors"
                              >
                                Video
                              </a>
                              <Link
                                href={`/admin/videos/${video.id}/edit`}
                                className="rounded-md px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-surface-elevated/50 transition-colors"
                              >
                                Uredi
                              </Link>
                              <DeleteVideoButton id={video.id} inUse={video._count.exercises > 0} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
