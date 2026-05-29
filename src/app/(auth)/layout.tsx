import Image from 'next/image'
import logo from '../../../public/logo.jpg'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src={logo} alt="CoreHouse" className="h-24 w-auto object-contain" />
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 py-8 px-6 shadow-sm rounded-xl border border-zinc-800">
          {children}
        </div>
      </div>
    </div>
  )
}
