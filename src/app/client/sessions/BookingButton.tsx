'use client'

import { useTransition } from 'react'
import { createBooking } from '@/app/actions/bookings'

type Props = {
  sessionId: string
  isBooked: boolean
  canBook: boolean
  isFull: boolean
  missingPackage: boolean
  packageType: string
}

export function BookingButton({ sessionId, isBooked, canBook, isFull, missingPackage, packageType }: Props) {
  const [isPending, startTransition] = useTransition()

  if (isBooked) {
    return (
      <span className="block w-full rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-center text-sm font-medium text-green-700">
        ✓ Rezervisano
      </span>
    )
  }

  if (isFull) {
    return (
      <span className="block w-full rounded-lg bg-zinc-100 px-4 py-2 text-center text-sm text-zinc-400">
        Popunjeno
      </span>
    )
  }

  if (missingPackage) {
    return (
      <span className="block w-full rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-center text-xs text-amber-700">
        Potreban {packageType === 'GROUP' ? 'vođeni' : 'personalni'} paket
      </span>
    )
  }

  const handleClick = () => {
    startTransition(async () => {
      const result = await createBooking(sessionId)
      if (result?.error) {
        alert(result.error)
      }
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
