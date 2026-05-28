'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/session'

const LoginSchema = z.object({
  email: z.string().email('Unesite validan email.'),
  password: z.string().min(1, 'Lozinka je obavezna.'),
})

const RegisterSchema = z.object({
  name: z.string().min(2, 'Ime mora imati najmanje 2 karaktera.'),
  email: z.string().email('Unesite validan email.'),
  password: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera.'),
})

export type AuthState = { error?: string } | undefined

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  const { email, password } = validated.data
  const user = await db.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Pogrešan email ili lozinka.' }
  }

  await createSession(user.id, user.role)
  redirect('/dashboard')
}

export async function register(state: AuthState, formData: FormData): Promise<AuthState> {
  const validated = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  const { name, email, password } = validated.data
  const existing = await db.user.findUnique({ where: { email } })

  if (existing) {
    return { error: 'Nalog sa ovim emailom već postoji.' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await db.user.create({
    data: { name, email, password: hashedPassword, role: 'CLIENT' },
  })

  await createSession(user.id, user.role)
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
