'use client'

import { useTransition } from 'react'
import { bookSlot } from '@/app/actions/bookings'

type Props = {
  startTime: string
  type: 'GROUP' | 'PERSONAL'
  canBook: boolean
  missingPackage: boolean
}

export function BookSlotButton({ startTime, type, canBook, missingPackage }: Props) {
  const [isPending, startTransition] = useTransition()

  if (missingPackage) {
    return (
      <span className="block w-full rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-center text-xs text-amber-700">
        Potreban {type === 'GROUP' ? 'vođeni' : 'personalni'} paket
      </span>
    )
  }

  const handleClick = () => {
    startTransition(async () => {
      const result = await bookSlot(startTime, type)
      if (result?.error) alert(result.error)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending || !canBook}
      className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? 'Rezervišem...' : 'Rezerviši'}
    </button>
  )
}
