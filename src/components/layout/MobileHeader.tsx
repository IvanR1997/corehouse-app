import Image from 'next/image'
import Link from 'next/link'
import logo from '../../../public/logo.jpg'
import { ThemeToggle } from '@/components/ThemeToggle'

export function MobileHeader() {
  return (
    <div className="md:hidden flex items-center justify-between py-3 mb-4 border-b border-border-subtle -mx-4 px-4">
      <Link href="/dashboard">
        <Image src={logo} alt="CoreHouse" className="h-10 w-auto object-contain" />
      </Link>
      <ThemeToggle />
    </div>
  )
}
