'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import logo from '../../../public/logo.jpg'

type Props = {
  userName: string
  role: 'ADMIN' | 'TRAINER' | 'CLIENT'
  notificationCount?: number
}

const roleLinks: Record<string, { href: string; label: string; icon: React.ReactNode }[]> = {
  CLIENT: [
    { href: '/client/sessions', label: 'Termini', icon: <CalendarIcon /> },
    { href: '/client/bookings', label: 'Rezervacije', icon: <BookingIcon /> },
    { href: '/client/packages', label: 'Paketi', icon: <PackageIcon /> },
  ],
  TRAINER: [
    { href: '/trainer/schedule', label: 'Raspored', icon: <CalendarIcon /> },
    { href: '/trainer/sessions/new', label: 'Novi termin', icon: <PlusIcon /> },
  ],
  ADMIN: [
    { href: '/admin/clients', label: 'Klijenti', icon: <UsersIcon /> },
    { href: '/admin/sessions', label: 'Termini', icon: <CalendarIcon /> },
    { href: '/admin/packages', label: 'Paketi', icon: <PackageIcon /> },
    { href: '/admin/notifications', label: 'Obaveštenja', icon: <BellIcon /> },
  ],
}

export function Sidebar({ role, notificationCount = 0 }: Props) {
  const pathname = usePathname()
  const links = roleLinks[role] ?? []

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 min-h-screen bg-zinc-950 border-r border-zinc-800 flex-col shrink-0">
        <div className="p-4 border-b border-zinc-800">
          <Link href="/dashboard">
            <Image src={logo} alt="CoreHouse" className="w-full h-auto object-contain" />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => {
            const isActive = pathname.startsWith(l.href)
            const hasNotification = l.href === '/admin/notifications' && notificationCount > 0

            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'bg-[#EEEE22] text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-950 hover:bg-[#EEEE22]'
                }`}
              >
                <span className={isActive ? 'text-zinc-950' : 'text-zinc-500'}>{l.icon}</span>
                {l.label}
                {hasNotification && (
                  <span className="absolute right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 flex">
        {links.map((l) => {
          const isActive = pathname.startsWith(l.href)
          const hasNotification = l.href === '/admin/notifications' && notificationCount > 0

          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors relative ${
                isActive ? 'text-[#EEEE22]' : 'text-zinc-500'
              }`}
            >
              {l.icon}
              <span className="truncate max-w-[60px] text-center">{l.label}</span>
              {hasNotification && (
                <span className="absolute top-2 right-1/4 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function PackageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function BookingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
