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
  clientNames: string[]
}

type DayGroup = {
  label: string
  dateKey: string
  sessions: Session[]
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('sr-RS', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Belgrade' }).format(new Date(date))
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
          <div key={group.dateKey} className="rounded-xl border border-border-subtle bg-surface-card shadow-sm overflow-hidden">
            {/* Day header */}
            <button
              onClick={() => toggle(group.dateKey)}
              className="w-full flex items-center justify-between px-3 md:px-5 py-4 hover:bg-surface-elevated/50 transition-colors text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="font-semibold text-text-primary capitalize">{group.label}</span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs text-text-muted">
                    {group.sessions.length} {group.sessions.length === 1 ? 'termin' : 'termina'}
                  </span>
                  <span className="text-xs text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{totalBookings}/{totalCapacity} mesta</span>
                </div>
              </div>
              <span className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            {/* Sessions */}
            {isOpen && (
              <div className="border-t border-border-subtle px-3 md:px-5 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {group.sessions.map((session) => {
                    const isFull = session.bookingCount >= session.maxCapacity
                    const fillPct = Math.round((session.bookingCount / session.maxCapacity) * 100)

                    return (
                      <div
                        key={session.id}
                        className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-4 flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-2xl font-bold text-text-primary">
                            {formatTime(session.startTime)}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            session.type === 'GROUP'
                              ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-purple-500/15 text-purple-400'
                          }`}>
                            {session.type === 'GROUP' ? 'Vođeni' : 'Personalni'}
                          </span>
                        </div>

                        {session.trainerName && (
                          <p className="text-xs text-text-muted">{session.trainerName}</p>
                        )}

                        {session.clientNames.length > 0 && (
                          <div className="space-y-1">
                            {session.clientNames.map((name) => (
                              <p key={name} className="text-xs text-text-secondary font-medium">👤 {name}</p>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="flex-1 rounded-full bg-surface-elevated h-1.5">
                            <div
                              className={`rounded-full h-1.5 ${isFull ? 'bg-red-400' : 'bg-orange-400'}`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-muted shrink-0">
                            {session.bookingCount}/{session.maxCapacity}
                          </span>
                          <span className={`text-xs font-medium shrink-0 ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                            {isFull ? 'Pun' : 'Dostupan'}
                          </span>
                        </div>

                        <div className="pt-1 border-t border-border-subtle">
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
