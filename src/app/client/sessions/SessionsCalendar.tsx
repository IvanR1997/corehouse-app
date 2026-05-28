'use client'

import { useState, useMemo } from 'react'
import { BookingButton } from './BookingButton'
import { BookSlotButton } from './BookSlotButton'

export type SessionData = {
  id: string
  type: 'GROUP' | 'PERSONAL'
  startTime: string
  maxCapacity: number
  trainerName: string
  bookingCount: number
  isBooked: boolean
  canBook: boolean
  missingPackage: boolean
}

type Props = {
  sessions: SessionData[]
  hasGroupPackage: boolean
  hasPersonalPackage: boolean
}

const DAYS = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned']
const MONTHS = [
  'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
  'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
]

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getTimeSlotsForDate(date: Date, now: Date): string[] {
  const day = date.getDay()
  if (day === 0) return []

  const allSlots =
    day === 6
      ? ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
      : ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
         '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

  if (isSameDay(date, now)) {
    return allSlots.filter((slot) => parseInt(slot) > now.getHours())
  }

  return allSlots
}

function sessionForSlot(sessions: SessionData[], slot: string): SessionData | undefined {
  const [h, m] = slot.split(':').map(Number)
  return sessions.find((s) => {
    const d = new Date(s.startTime)
    return d.getHours() === h && d.getMinutes() === m
  })
}

function Calendar({
  sessions,
  sessionType,
  hasPackage,
}: {
  sessions: SessionData[]
  sessionType: 'GROUP' | 'PERSONAL'
  hasPackage: boolean
}) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, SessionData[]>()
    for (const s of sessions) {
      const key = toDateKey(new Date(s.startTime))
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    return map
  }, [sessions])

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    let startDow = firstDay.getDay() - 1
    if (startDow < 0) startDow = 6

    const days: (Date | null)[] = []
    for (let i = 0; i < startDow; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
    while (days.length % 7 !== 0) days.push(null)
    return days
  }, [currentMonth])

  const selectedSessions = useMemo(() => {
    if (!selectedDate) return []
    return (sessionsByDate.get(toDateKey(selectedDate)) ?? [])
      .slice()
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }, [selectedDate, sessionsByDate])

  const selectedSlots = useMemo(
    () => (selectedDate ? getTimeSlotsForDate(selectedDate, new Date()) : []),
    [selectedDate]
  )

  return (
    <div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden">
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
            }
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 text-lg"
          >
            ‹
          </button>
          <h2 className="font-semibold text-white">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}.
          </h2>
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
            }
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 text-lg"
          >
            ›
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-zinc-700">
          {DAYS.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium text-zinc-400">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            if (!day) return <div key={i} className="h-12" />

            const dayStart = new Date(day)
            dayStart.setHours(0, 0, 0, 0)
            const isSunday = day.getDay() === 0
            const isPast = dayStart < today
            const isClickable = !isPast && !isSunday
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
            const hasSessions = sessionsByDate.has(toDateKey(day))

            return (
              <button
                key={i}
                onClick={() =>
                  isClickable &&
                  setSelectedDate((prev) => (prev && isSameDay(prev, day) ? null : day))
                }
                disabled={!isClickable}
                className={[
                  'h-12 flex flex-col items-center justify-center gap-0.5 text-sm transition-colors',
                  isSelected
                    ? 'bg-orange-500 text-zinc-950'
                    : isToday
                    ? 'text-orange-500 font-semibold'
                    : 'text-zinc-200',
                  isClickable && !isSelected ? 'hover:bg-zinc-800/50 cursor-pointer' : '',
                  !isClickable ? 'opacity-30 cursor-default' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span>{day.getDate()}</span>
                {hasSessions && isClickable && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white/80' : 'bg-orange-400'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots for selected date */}
      <div className="mt-6">
        {!selectedDate ? (
          <div className="rounded-xl border border-dashed border-zinc-700 py-14 text-center">
            <p className="text-zinc-400 text-sm">Izaberite datum da vidite dostupne termine</p>
          </div>
        ) : (
          <>
            <h3 className="text-base font-semibold text-white mb-4">
              {selectedDate.toLocaleDateString('sr-RS', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h3>
            {(() => {
                const alreadyBookedToday = selectedSessions.some((s) => s.isBooked)
                return (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {selectedSlots.map((slot) => {
                      const session = sessionForSlot(selectedSessions, slot)
                      const isFull = session ? session.bookingCount >= session.maxCapacity : false
                      const blockedByDayLimit = alreadyBookedToday && !session?.isBooked

                      return (
                        <div key={slot} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-white">{slot}</span>
                            {isFull && <span className="text-xs font-medium text-red-400">Popunjeno</span>}
                          </div>

                          {blockedByDayLimit ? (
                            <span className="block w-full rounded-lg bg-zinc-800 px-4 py-2 text-center text-xs text-zinc-400">
                              Jedan termin po danu
                            </span>
                          ) : session ? (
                            <BookingButton
                              sessionId={session.id}
                              isBooked={session.isBooked}
                              canBook={session.canBook}
                              isFull={isFull}
                              missingPackage={session.missingPackage}
                              packageType={session.type}
                            />
                          ) : (
                            <BookSlotButton
                              startTime={(() => {
                                const [h, m] = slot.split(':').map(Number)
                                const d = new Date(selectedDate)
                                d.setHours(h, m, 0, 0)
                                return d.toISOString()
                              })()}
                              type={sessionType}
                              canBook={hasPackage}
                              missingPackage={!hasPackage}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}

          </>
        )}
      </div>
    </div>
  )
}

export function SessionsCalendar({ sessions, hasGroupPackage, hasPersonalPackage }: Props) {
  const [activeTab, setActiveTab] = useState<'GROUP' | 'PERSONAL'>(
    hasGroupPackage ? 'GROUP' : 'PERSONAL'
  )

  const groupSessions = useMemo(() => sessions.filter((s) => s.type === 'GROUP'), [sessions])
  const personalSessions = useMemo(() => sessions.filter((s) => s.type === 'PERSONAL'), [sessions])

  const tabs = [
    { key: 'GROUP' as const, label: 'Vođeni treninzi', has: hasGroupPackage },
    { key: 'PERSONAL' as const, label: 'Personalni treninzi', has: hasPersonalPackage },
  ]

  return (
    <div>
      <div className="flex gap-2 mb-6 p-1 bg-zinc-800 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={[
              'px-5 py-2 rounded-lg text-sm font-semibold transition-colors',
              activeTab === tab.key
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200',
            ].join(' ')}
          >
            {tab.label}
            {!tab.has && (
              <span className="ml-1.5 text-xs font-normal text-zinc-400">(nema paket)</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'GROUP' ? (
        <Calendar key="group" sessions={groupSessions} sessionType="GROUP" hasPackage={hasGroupPackage} />
      ) : (
        <Calendar key="personal" sessions={personalSessions} sessionType="PERSONAL" hasPackage={hasPersonalPackage} />
      )}
    </div>
  )
}
