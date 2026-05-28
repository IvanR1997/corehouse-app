'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { register } from '@/app/actions/auth'
import { SubmitButton } from '@/components/ui/Button'

export default function RegisterPage() {
  const [state, action] = useActionState(register, undefined)

  return (
    <>
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">Registracija</h2>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
            Ime i prezime
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Vaše ime"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="vasa@adresa.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
            Lozinka
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Minimum 6 karaktera"
          />
        </div>

        <SubmitButton pendingText="Registracija...">Registruj se</SubmitButton>
      </form>

      <p className="mt-4 text-xs text-zinc-400 text-center">
        Novi nalog se registruje kao klijent. Kontaktirajte admin za aktivaciju paketa.
      </p>

      <p className="mt-4 text-center text-sm text-zinc-500">
        Već imate nalog?{' '}
        <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600">
          Prijavite se
        </Link>
      </p>
    </>
  )
}
