'use client'

import { useTransition } from 'react'
import { grantProgramAccess, revokeProgramAccess } from '@/app/actions/programs'

export function AccessToggleButton({
  userId,
  programId,
  hasAccess,
}: {
  userId: string
  programId: string
  hasAccess: boolean
}) {
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(() => {
      if (hasAccess) {
        revokeProgramAccess(userId, programId)
      } else {
        grantProgramAccess(userId, programId)
      }
    })
  }

  if (hasAccess) {
    return (
      <button
        onClick={toggle}
        disabled={isPending}
        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Čekaj...' : 'Oduzmi pristup'}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-orange-400 disabled:opacity-50 transition-colors"
    >
      {isPending ? 'Čekaj...' : 'Daj pristup'}
    </button>
  )
}
