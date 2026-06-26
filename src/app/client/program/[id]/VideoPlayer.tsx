'use client'

import { useState } from 'react'

type EmbedInfo = { type: 'youtube'; id: string } | { type: 'gdrive'; id: string } | null

function getEmbedInfo(url: string): EmbedInfo {
  try {
    const u = new URL(url)
    // Google Drive
    if (u.hostname.includes('drive.google.com')) {
      const match = u.pathname.match(/\/file\/d\/([^/]+)/)
      if (match) return { type: 'gdrive', id: match[1] }
      const id = u.searchParams.get('id')
      if (id) return { type: 'gdrive', id }
    }
    // YouTube Shorts
    if (u.pathname.includes('/shorts/')) return { type: 'youtube', id: u.pathname.split('/shorts/')[1].split('?')[0] }
    // YouTube regular
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return { type: 'youtube', id: v }
    }
    if (u.hostname === 'youtu.be') return { type: 'youtube', id: u.pathname.slice(1).split('?')[0] }
  } catch {}
  return null
}

function getEmbedSrc(info: NonNullable<EmbedInfo>): string {
  if (info.type === 'gdrive') return `https://drive.google.com/file/d/${info.id}/preview`
  return `https://www.youtube.com/embed/${info.id}?autoplay=1&rel=0`
}

export function VideoPlayer({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false)
  const embedInfo = getEmbedInfo(url)

  if (open && embedInfo) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-border-subtle mb-3" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={getEmbedSrc(embedInfo)}
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
