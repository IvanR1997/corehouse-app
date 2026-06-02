'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import darkLogo from '../../public/logo.jpg'
import lightLogo from '../../public/beli-logo.png'

export function ThemeLogo({ className }: { className?: string }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <Image src={darkLogo} alt="CoreHouse" className={className} />

  return (
    <Image
      src={theme === 'light' ? lightLogo : darkLogo}
      alt="CoreHouse"
      className={className}
    />
  )
}
