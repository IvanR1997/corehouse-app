'use client'

import { useTransition } from 'react'
import { approvePackageRequest, rejectPackageRequest } from '@/app/actions/packageRequests'

export function ApproveButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const result = await approvePackageRequest(requestId)
          if ('error' in result) alert(result.error)
        })
      }
      disabled={isPending}
      className="rounded-lg bg-green-500/15 border border-green-500/30 px-3 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500/25 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Odobri'}
    </button>
  )
}

export function RejectButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const result = await rejectPackageRequest(requestId)
          if ('error' in result) alert(result.error)
        })
      }
      disabled={isPending}
      className="rounded-lg bg-red-500/15 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Odbij'}
    </button>
  )
}
