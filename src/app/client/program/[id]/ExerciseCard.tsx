'use client'

import { useState } from 'react'

function getEmbedSrc(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('drive.google.com')) {
      const match = u.pathname.match(/\/file\/d\/([^/]+)/)
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`
      const id = u.searchParams.get('id')
      if (id) return `https://drive.google.com/file/d/${id}/preview`
    }
    if (u.pathname.includes('/shorts/')) {
      const id = u.pathname.split('/shorts/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${id}?rel=0`
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}?rel=0`
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1).split('?')[0]}?rel=0`
    }
  } catch {}
  return null
}

type Props = {
  url: string
  title: string
  category: string
  setsReps: string
  note?: string | null
}

export function ExerciseCard({ url, title, category, setsReps, note }: Props) {
  const [open, setOpen] = useState(false)
  const embedSrc = getEmbedSrc(url)

  return (
    <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
      {/* Compact row */}
      <div className="flex items-center gap-3 p-4">
        {/* Play button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-surface-elevated border border-border-subtle hover:border-orange-500/50 transition-colors group"
          title={open ? 'Zatvori video' : 'Pogledaj video'}
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564A1.313 1.313 0 018.25 14.437V9.563z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Title + category */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text-primary text-sm leading-snug">{title}</p>
          <span className="mt-1 inline-block rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-text-muted">
            {category}
          </span>
        </div>

        {/* Sets/reps + note — desna strana */}
        <div className="shrink-0 text-right">
          <span className="block rounded-lg bg-orange-500/15 px-3 py-2 text-base font-bold text-orange-400 tabular-nums">
            {setsReps}
          </span>
          {note && (
            <p className="text-xs text-text-muted mt-1.5 italic leading-tight max-w-[130px]">{note}</p>
          )}
        </div>
      </div>

      {/* Expandable video */}
      {open && (
        <div className="border-t border-border-subtle" style={{ aspectRatio: '16/9' }}>
          {embedSrc ? (
            <iframe
              src={embedSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-text-muted">Video nije dostupan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
