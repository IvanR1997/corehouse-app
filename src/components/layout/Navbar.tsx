import Link from 'next/link'
import { logout } from '@/app/actions/auth'

type Props = {
  userName: string
  role: 'ADMIN' | 'TRAINER' | 'CLIENT'
  notificationCount?: number
}

const roleLinks: Record<string, { href: string; label: string }[]> = {
  CLIENT: [
    { href: '/client/sessions', label: 'Termini' },
    { href: '/client/bookings', label: 'Moje rezervacije' },
    { href: '/client/packages', label: 'Moji paketi' },
  ],
  TRAINER: [
    { href: '/trainer/schedule', label: 'Moj raspored' },
    { href: '/trainer/sessions/new', label: 'Novi termin' },
  ],
  ADMIN: [
    { href: '/admin/clients', label: 'Klijenti' },
    { href: '/admin/sessions', label: 'Termini' },
    { href: '/admin/packages', label: 'Paketi' },
    { href: '/admin/notifications', label: 'Obaveštenja' },
  ],
}

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  TRAINER: 'bg-blue-100 text-blue-700',
  CLIENT: 'bg-green-100 text-green-700',
}

const roleLabel: Record<string, string> = {
  ADMIN: 'Admin',
  TRAINER: 'Trener',
  CLIENT: 'Klijent',
}

export function Navbar({ userName, role, notificationCount = 0 }: Props) {
  const links = roleLinks[role] ?? []

  return (
    <nav className="border-b border-zinc-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold text-orange-500">
            CoreHouse
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                {l.label}
                {l.href === '/admin/notifications' && notificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge[role]}`}>
            {roleLabel[role]}
          </span>
          <span className="text-sm text-zinc-700 font-medium hidden sm:block">{userName}</span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
            >
              Odjavi se
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
