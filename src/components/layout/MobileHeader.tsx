import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ThemeLogo } from '@/components/ThemeLogo'

export function MobileHeader() {
  return (
    <div className="md:hidden flex items-center justify-between py-3 mb-4 border-b border-border-subtle -mx-4 px-4">
      <Link href="/dashboard">
        <ThemeLogo className="h-10 w-auto object-contain" />
      </Link>
      <ThemeToggle />
    </div>
  )
}
