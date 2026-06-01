import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'
import { ApproveButton, RejectButton } from './RequestActions'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const statusConfig = {
  PENDING: { label: 'Na čekanju', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  APPROVED: { label: 'Odobren', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  REJECTED: { label: 'Odbijen', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

export default async function AdminRequestsPage() {
  await requireRole('ADMIN')

  const requests = await db.packageRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      package: { select: { id: true, name: true, type: true } },
    },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-white">Zahtevi za pakete</h1>
        <p className="text-sm text-zinc-400 mt-1">
          {requests.filter((r) => r.status === 'PENDING').length} na čekanju · {requests.length} ukupno
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-16 text-center">
          <p className="text-zinc-400">Nema zahteva za pakete.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/50">
                <th className="px-3 md:px-5 py-3 text-left font-semibold text-zinc-400">Klijent</th>
                <th className="px-3 md:px-5 py-3 text-left font-semibold text-zinc-400">Paket</th>
                <th className="px-3 md:px-5 py-3 text-left font-semibold text-zinc-400 hidden md:table-cell">Datum</th>
                <th className="px-3 md:px-5 py-3 text-left font-semibold text-zinc-400">Status</th>
                <th className="px-3 md:px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {requests.map((req) => {
                const status = statusConfig[req.status]
                return (
                  <tr key={req.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-3 md:px-5 py-4">
                      <p className="font-medium text-white">{req.user.name}</p>
                      <p className="text-xs text-zinc-500">{req.user.email}</p>
                    </td>
                    <td className="px-3 md:px-5 py-4">
                      <p className="text-zinc-200">{req.package.name}</p>
                      <span
                        className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                          req.package.type === 'GROUP'
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-purple-500/15 text-purple-400'
                        }`}
                      >
                        {req.package.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
                      </span>
                    </td>
                    <td className="px-3 md:px-5 py-4 text-zinc-500 text-xs hidden md:table-cell">
                      {formatDate(req.createdAt)}
                    </td>
                    <td className="px-3 md:px-5 py-4">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-3 md:px-5 py-4 text-right">
                      {req.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <ApproveButton requestId={req.id} />
                          <RejectButton requestId={req.id} />
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
