'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { register } from '@/app/actions/auth'
import { SubmitButton } from '@/components/ui/Button'

export default function RegisterPage() {
  const [state, action] = useActionState(register, undefined)

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
            name="name"
            type="text"
            autoComplete="name"
            required
            className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:border-[#EEEE22]/50 focus:outline-none focus:ring-1 focus:ring-[#EEEE22]/30 transition-colors"
            placeholder="Ime i prezime"
          />
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
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
            autoComplete="new-password"
            required
            minLength={6}
            className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:border-[#EEEE22]/50 focus:outline-none focus:ring-1 focus:ring-[#EEEE22]/30 transition-colors"
            placeholder="Lozinka (min. 6 karaktera)"
          />
        </div>

        <div className="pt-2">
          <SubmitButton pendingText="Registracija...">Registruj se</SubmitButton>
        </div>
      </form>

      <p className="mt-4 text-xs text-zinc-700 text-center">
        Novi nalog se registruje kao klijent.
      </p>

      <p className="mt-3 text-center text-sm text-zinc-600">
        Već imate nalog?{' '}
        <Link href="/login" className="text-[#EEEE22]/80 hover:text-[#EEEE22] transition-colors">
          Prijavite se
        </Link>
      </p>
    </>
  )
}
