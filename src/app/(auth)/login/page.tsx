'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { SubmitButton } from '@/components/ui/Button'

export default function LoginPage() {
  const [state, action] = useActionState(login, undefined)

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-6">Prijava</h2>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-200 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="vasa@adresa.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-200 mb-1">
            Lozinka
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="••••••••"
          />
        </div>

        <SubmitButton pendingText="Prijava...">Prijavi se</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Nemate nalog?{' '}
        <Link href="/register" className="font-medium text-orange-500 hover:text-orange-600">
          Registrujte se
        </Link>
      </p>
    </>
  )
}
