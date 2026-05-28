export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-orange-500 tracking-tight">
          CoreHouse
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">Teretana & Fitness Centar</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-zinc-200">
          {children}
        </div>
      </div>
    </div>
  )
}
