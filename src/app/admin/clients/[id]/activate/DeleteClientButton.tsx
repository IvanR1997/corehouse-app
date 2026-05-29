'use client'

import { useTransition } from 'react'
import { deleteClient } from '@/app/actions/clients'

export function DeleteClientButton({ clientId }: { clientId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm('Da li ste sigurni da želite da obrišete ovog klijenta? Ova akcija je nepovratna.')) return
    startTransition(() => deleteClient(clientId))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 disabled:opacity-50 transition-all duration-200"
    >
      {isPending ? 'Brisanje...' : 'Obriši klijenta'}
    </button>
  )
}
