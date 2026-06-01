'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { SubmitButton } from '@/components/ui/Button'

export default function LoginPage() {
  const [state, action] = useActionState(login, undefined)

  return (
    <>
      {state?.error && (
        <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 text-center">
          {state.error}
        </div>
      )}

      <form action={action} className="space-y-3">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:border-[#EEEE22]/50 focus:outline-none focus:ring-1 focus:ring-[#EEEE22]/30 transition-colors"
            placeholder="Email adresa"
          />
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:border-[#EEEE22]/50 focus:outline-none focus:ring-1 focus:ring-[#EEEE22]/30 transition-colors"
            placeholder="Lozinka"
          />
        </div>

        <div className="pt-2">
          <SubmitButton pendingText="Prijava...">Prijavi se</SubmitButton>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        Nemate nalog?{' '}
        <Link href="/register" className="text-[#EEEE22]/80 hover:text-[#EEEE22] transition-colors">
          Registrujte se
        </Link>
      </p>
    </>
  )
}
