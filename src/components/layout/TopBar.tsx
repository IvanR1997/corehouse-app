import { logout } from '@/app/actions/auth'
import { ThemeToggle } from '@/components/ThemeToggle'

type Props = {
  userName: string
  role: 'ADMIN' | 'TRAINER' | 'CLIENT'
}

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-red-500/15 text-red-400',
  TRAINER: 'bg-blue-500/15 text-blue-400',
  CLIENT: 'bg-green-500/15 text-green-400',
}

const roleLabel: Record<string, string> = {
  ADMIN: 'Admin',
  TRAINER: 'Trener',
  CLIENT: 'Klijent',
}

export function TopBar({ userName, role }: Props) {
  return (
    <div className="hidden md:flex items-center justify-end gap-3 mb-6">
      <ThemeToggle />
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge[role]}`}>
        {roleLabel[role]}
      </span>
      <span className="text-sm text-text-secondary font-medium">{userName}</span>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-md px-3 py-1.5 text-sm text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors"
        >
          Odjavi se
        </button>
      </form>
    </div>
  )
}
