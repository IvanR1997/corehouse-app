'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { SubmitButton } from '@/components/ui/Button'

export default function LoginPage() {
  const [state, action] = useActionState(login, undefined)

  return (
    <>
      <h2 className="text-xl font-bold text-white mb-6 text-center">Prijava</h2>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <form action={action} className="space-y-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-9 pr-3 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#EEEE22] focus:outline-none focus:ring-1 focus:ring-[#EEEE22]"
            placeholder="Email adresa"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-9 pr-3 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#EEEE22] focus:outline-none focus:ring-1 focus:ring-[#EEEE22]"
            placeholder="Lozinka"
          />
        </div>

        <div className="pt-1">
          <SubmitButton pendingText="Prijava...">Prijavi se</SubmitButton>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Nemate nalog?{' '}
        <Link href="/register" className="font-medium text-[#EEEE22] hover:underline">
          Registrujte se
        </Link>
      </p>
    </>
  )
}
