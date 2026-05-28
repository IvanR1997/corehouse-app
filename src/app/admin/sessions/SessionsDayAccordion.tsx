'use client'

import { useState } from 'react'
import { DeleteSessionButton } from './DeleteSessionButton'

type Session = {
  id: string
  type: string
  startTime: Date
  maxCapacity: number
  bookingCount: number
  trainerName: string | null
}

type DayGroup = {
  label: string
  dateKey: string
  sessions: Session[]
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('sr-RS', { hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}

export function SessionsDayAccordion({ groups }: { groups: DayGroup[] }) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => new Set(groups[0] ? [groups[0].dateKey] : []))

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => {
        const isOpen = openKeys.has(group.dateKey)
        const totalBookings = group.sessions.reduce((sum, s) => sum + s.bookingCount, 0)
        const totalCapacity = group.sessions.reduce((sum, s) => sum + s.maxCapacity, 0)

        return (
          <div key={group.dateKey} className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
            {/* Day header */}
            <button
              onClick={() => toggle(group.dateKey)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-zinc-900 capitalize">{group.label}</span>
                <span className="text-xs text-zinc-400">
                  {group.sessions.length} {group.sessions.length === 1 ? 'termin' : 'termina'}
                </span>
                <span className="text-xs text-zinc-300">·</span>
                <span className="text-xs text-zinc-400">{totalBookings}/{totalCapacity} mesta</span>
              </div>
              <span className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            {/* Sessions */}
            {isOpen && (
              <div className="border-t border-zinc-100 px-5 py-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.sessions.map((session) => {
                    const isFull = session.bookingCount >= session.maxCapacity
                    const fillPct = Math.round((session.bookingCount / session.maxCapacity) * 100)

                    return (
                      <div
                        key={session.id}
                        className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-2xl font-bold text-zinc-900">
                            {formatTime(session.startTime)}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            session.type === 'GROUP'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {session.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
                          </span>
                        </div>

                        {session.trainerName && (
                          <p className="text-xs text-zinc-400">{session.trainerName}</p>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="flex-1 rounded-full bg-zinc-200 h-1.5">
                            <div
                              className={`rounded-full h-1.5 ${isFull ? 'bg-red-400' : 'bg-orange-400'}`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500 shrink-0">
                            {session.bookingCount}/{session.maxCapacity}
                          </span>
                          <span className={`text-xs font-medium shrink-0 ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                            {isFull ? 'Pun' : 'Dostupan'}
                          </span>
                        </div>

                        <div className="pt-1 border-t border-zinc-200">
                          <DeleteSessionButton
                            sessionId={session.id}
                            bookingCount={session.bookingCount}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
