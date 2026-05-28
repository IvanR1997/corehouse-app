'use client'

import { useTransition } from 'react'
import { deletePackage } from '@/app/actions/packages'

export function DeletePackageButton({
  packageId,
  assignedCount,
}: {
  packageId: string
  assignedCount: number
}) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    if (assignedCount > 0) {
      alert(`Paket je dodeljen ${assignedCount} klijentu/ima i ne može se obrisati.`)
      return
    }
    if (!confirm('Obrisati ovaj paket?')) return
    startTransition(async () => {
      const result = await deletePackage(packageId)
      if (result?.error) alert(result.error)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending || assignedCount > 0}
      title={assignedCount > 0 ? 'Paket je dodeljen klijentima' : 'Ukloni paket'}
      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:border-red-200 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? '...' : 'Ukloni'}
    </button>
  )
}
