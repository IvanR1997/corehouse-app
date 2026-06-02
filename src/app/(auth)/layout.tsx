import Image from 'next/image'
import logo from '../../../public/logo.jpg'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src={logo} alt="CoreHouse" className="h-28 w-auto object-contain" />
        </div>
        <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-xl px-6 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}
