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

export function VideoPlayer({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false)
  const ytId = getYouTubeId(url)

  if (!ytId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-surface-elevated border border-border-subtle hover:border-orange-500/50 transition-colors group"
      >
        <PlayIcon />
      </a>
    )
  }

  if (open) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-border-subtle mb-3" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-surface-elevated border border-border-subtle hover:border-orange-500/50 transition-colors group"
      title="Pogledaj video"
    >
      <PlayIcon />
    </button>
  )
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform">
      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
  )
}
