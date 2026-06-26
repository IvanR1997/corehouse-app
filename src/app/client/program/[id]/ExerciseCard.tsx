'use client'

import { useState } from 'react'

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.pathname.includes('/shorts/')) return u.pathname.split('/shorts/')[1].split('?')[0]
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0]
  } catch {}
  return null
}

function getThumbnail(url: string): string | null {
  const id = getYouTubeId(url)
  if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
  return null
}

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
  const thumbnail = getThumbnail(url)

  return (
    <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
      {/* Compact row */}
      <div className="flex items-center gap-3 p-3">
        {/* Thumbnail / play button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-14 w-24 shrink-0 items-center justify-center rounded-lg overflow-hidden border border-border-subtle hover:border-orange-500/60 transition-colors group"
          title={open ? 'Zatvori video' : 'Pogledaj video'}
        >
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt={title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-surface-elevated" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          {/* Icon */}
          <div className="relative z-10">
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white drop-shadow">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564A1.313 1.313 0 018.25 14.437V9.563z" clipRule="evenodd" />
              </svg>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 group-hover:scale-110 transition-transform shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-zinc-950 ml-0.5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>

        {/* Title + category */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="font-semibold text-text-primary text-sm leading-snug truncate">{title}</p>
          <span className="mt-1 inline-block rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-text-muted">
            {category}
          </span>
        </div>

        {/* Sets/reps + note — desna strana, fiksna širina */}
        <div className="shrink-0 text-right w-16">
          <span className="block rounded-md bg-orange-500/15 px-2 py-1.5 text-sm font-bold text-orange-400 tabular-nums text-center">
            {setsReps}
          </span>
          {note && (
            <span className="mt-1 block rounded-md bg-surface-elevated border border-border-subtle px-1.5 py-1 text-[10px] font-medium text-text-secondary leading-tight text-center break-words">
              {note}
            </span>
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
