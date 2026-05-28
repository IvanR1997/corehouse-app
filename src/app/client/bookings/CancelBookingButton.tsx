'use client'

import { useTransition } from 'react'
import { cancelBooking } from '@/app/actions/bookings'

export function CancelBookingButton({
  bookingId,
  hoursUntil,
}: {
  bookingId: string
  hoursUntil: number
}) {
  const [isPending, startTransition] = useTransition()
  const isLate = hoursUntil < 24

  const handleClick = () => {
    const warning = isLate
      ? `Termin je za manje od 24h. Otkazivanjem se termin računa kao iskorišćen i neće biti vraćen na paket. Nastavi?`
      : `Otkazati ovaj termin?`
    if (!confirm(warning)) return
    startTransition(async () => {
      const result = await cancelBooking(bookingId)
      if (result?.error) alert(result.error)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:border-red-200 hover:text-red-500 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : 'Otkaži'}
    </button>
  )
}
