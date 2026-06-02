'use client'

import { useState, useMemo } from 'react'
import { useActionState } from 'react'
import { createSession } from '@/app/actions/sessions'
import { SubmitButton } from '@/components/ui/Button'

const TODAY = new Date().toISOString().slice(0, 10)

function getTimeSlots(dateStr: string): string[] {
  if (!dateStr) return []
  const day = new Date(dateStr + 'T00:00:00').getDay() // 0=ned, 6=sub
  if (day === 0) return []
  if (day === 6)
    return ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
  return [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
  ]
}

export default function NewSessionPage() {
  const [state, action] = useActionState(createSession, undefined)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const timeSlots = useMemo(() => getTimeSlots(date), [date])
  const isSunday = date ? new Date(date + 'T00:00:00').getDay() === 0 : false
  const startTime = date && time ? `${date}T${time}` : ''

  const handleDateChange = (val: string) => {
    setDate(val)
    setTime('')
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Novi termin</h1>
        <p className="text-sm text-text-muted mt-1">Zakažite novi trening termin</p>
      </div>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div className="rounded-xl border border-border-subtle bg-surface-card p-6 shadow-sm">
        <form action={action} className="space-y-5">
          <input type="hidden" name="startTime" value={startTime} />

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-1">
              Tip treninga
            </label>
            <select
              id="type"
              name="type"
              required
              className="block w-full rounded-lg border border-border-subtle bg-surface-card text-text-primary px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="GROUP">Vođeni (max 15 klijenata)</option>
              <option value="PERSONAL">Personalni (1 na 1)</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">
              Datum
            </label>
            <input
              id="date"
              type="date"
              required
              min={TODAY}
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="block w-full rounded-lg border border-border-subtle bg-surface-card text-text-primary px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {isSunday && (
              <p className="mt-1.5 text-xs text-red-500">Nedeljom ne radimo. Odaberite drugi dan.</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-text-secondary mb-1">
              Vreme
            </label>
            <select
              id="time"
              required
              disabled={!date || isSunday || timeSlots.length === 0}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block w-full rounded-lg border border-border-subtle bg-surface-card text-text-primary px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-surface-elevated disabled:text-text-muted"
            >
              <option value="">— Odaberite vreme —</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {date && !isSunday && (
              <p className="mt-1.5 text-xs text-text-muted">
                {new Date(date + 'T00:00:00').getDay() === 6
                  ? 'Subota: 10:00 – 17:00'
                  : 'Pon–Pet: 08:00 – 21:00'}
              </p>
            )}
          </div>

          <SubmitButton pendingText="Kreiram..." >Kreiraj termin</SubmitButton>
        </form>
      </div>
    </div>
  )
}
