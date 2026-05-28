'use client'

import { useState, useMemo } from 'react'
import { useActionState } from 'react'
import { createSession } from '@/app/actions/sessions'
import { SubmitButton } from '@/components/ui/Button'

const TODAY = new Date().toISOString().slice(0, 10)

function getTimeSlots(dateStr: string): string[] {
  if (!dateStr) return []
  const day = new Date(dateStr + 'T00:00:00').getDay()
  if (day === 0) return []
  if (day === 6)
    return ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
  return [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
  ]
}

type Client = { id: string; name: string; email: string }

export function AdminNewSessionForm({ clients }: { clients: Client[] }) {
  const [state, action] = useActionState(createSession, undefined)
  const [type, setType] = useState<'PERSONAL' | 'GROUP'>('PERSONAL')
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
    <>
      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <form action={action} className="space-y-5">
          <input type="hidden" name="startTime" value={startTime} />

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-zinc-700 mb-1">
              Tip treninga
            </label>
            <select
              id="type"
              name="type"
              required
              value={type}
              onChange={(e) => setType(e.target.value as 'PERSONAL' | 'GROUP')}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="PERSONAL">Personalni (1 na 1)</option>
              <option value="GROUP">Vođeni (max 15 klijenata)</option>
            </select>
          </div>

          {type === 'PERSONAL' && (
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-zinc-700 mb-1">
                Klijent
              </label>
              <select
                id="clientId"
                name="clientId"
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">— Bez dodele klijentu —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-zinc-700 mb-1">
              Datum
            </label>
            <input
              id="date"
              type="date"
              required
              min={TODAY}
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {isSunday && (
              <p className="mt-1.5 text-xs text-red-500">Nedeljom ne radimo. Odaberite drugi dan.</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-zinc-700 mb-1">
              Vreme
            </label>
            <select
              id="time"
              required
              disabled={!date || isSunday || timeSlots.length === 0}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-zinc-50 disabled:text-zinc-400"
            >
              <option value="">— Odaberite vreme —</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {date && !isSunday && (
              <p className="mt-1.5 text-xs text-zinc-400">
                {new Date(date + 'T00:00:00').getDay() === 6
                  ? 'Subota: 10:00 – 17:00'
                  : 'Pon–Pet: 08:00 – 21:00'}
              </p>
            )}
          </div>

          <SubmitButton pendingText="Kreiram...">Kreiraj termin</SubmitButton>
        </form>
      </div>
    </>
  )
}
