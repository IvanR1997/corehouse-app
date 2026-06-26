'use client'

import { useActionState, useTransition, useState } from 'react'
import {
  addTraining, deleteTraining,
  addSection, deleteSection,
  addExercise, deleteExercise,
} from '@/app/actions/programs'

const categoryLabel: Record<string, string> = {
  MOBILNOST: 'Mobilnost', CORE: 'Core', NOGE: 'Noge', LEDJA: 'Leđa',
  GRUDI: 'Grudi', RAMENA: 'Ramena', BICEPS: 'Biceps', TRICEPS: 'Triceps',
  KARDIO: 'Kardio', OSTALO: 'Ostalo',
}

const inputCls = 'flex-1 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'

type Video = { id: string; title: string; category: string; url: string }
type Exercise = { id: string; order: number; setsReps: string; note: string | null; video: Video }
type Section = { id: string; order: number; title: string; exercises: Exercise[] }
type Training = { id: string; order: number; title: string; sections: Section[] }
type Program = { id: string; title: string; trainings: Training[] }

// ─── Add Training ─────────────────────────────────────────────────────────────

function AddTrainingForm({ programId }: { programId: string }) {
  const boundAction = addTraining.bind(null, programId)
  const [state, action] = useActionState(boundAction, undefined)
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-xl border border-dashed border-border-subtle py-3 text-sm text-text-muted hover:border-orange-500 hover:text-orange-500 transition-colors"
        >
          + Dodaj trening
        </button>
      ) : (
        <div className="rounded-xl border border-border-subtle bg-surface-card p-4">
          {state?.error && <p className="text-sm text-red-400 mb-2">{state.error}</p>}
          <form action={async (fd) => { await action(fd); setOpen(false) }} className="flex gap-2">
            <input name="title" type="text" required autoFocus placeholder="npr. Trening 1 – Kvadricepsi & Ramena" className={inputCls} />
            <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-400 whitespace-nowrap">Dodaj</button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-muted hover:bg-surface-elevated/50">Otkaži</button>
          </form>
        </div>
      )}
    </div>
  )
}

// ─── Add Section ──────────────────────────────────────────────────────────────

const SECTION_PRESETS = ['MOBILNOST', 'CORE', 'SUPER SET', 'NOGE', 'LEDJA', 'GRUDI', 'RAMENA', 'BICEPS', 'TRICEPS', 'KARDIO']

function AddSectionForm({ trainingId, programId }: { trainingId: string; programId: string }) {
  const boundAction = addSection.bind(null, trainingId, programId)
  const [state, action] = useActionState(boundAction, undefined)
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-3">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-lg border border-dashed border-border-subtle py-2 text-xs text-text-muted hover:border-orange-500 hover:text-orange-500 transition-colors"
        >
          + Dodaj sekciju
        </button>
      ) : (
        <div className="rounded-lg border border-border-subtle bg-surface p-3">
          {state?.error && <p className="text-xs text-red-400 mb-2">{state.error}</p>}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SECTION_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={(e) => {
                  const form = e.currentTarget.closest('form')!
                  const input = form.querySelector<HTMLInputElement>('[name="title"]')!
                  input.value = p
                }}
                className="rounded-full bg-surface-elevated px-2.5 py-0.5 text-xs text-text-muted hover:bg-orange-500/20 hover:text-orange-400 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
          <form action={async (fd) => { await action(fd); setOpen(false) }} className="flex gap-2">
            <input name="title" type="text" required autoFocus placeholder="Naziv sekcije" className={inputCls} />
            <button type="submit" className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-orange-400">Dodaj</button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border-subtle px-2 py-2 text-xs text-text-muted">✕</button>
          </form>
        </div>
      )}
    </div>
  )
}

// ─── Add Exercise ─────────────────────────────────────────────────────────────

function AddExerciseForm({ sectionId, programId, allVideos }: { sectionId: string; programId: string; allVideos: Video[] }) {
  const boundAction = addExercise.bind(null, sectionId, programId)
  const [state, action] = useActionState(boundAction, undefined)
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('')

  const categories = [...new Set(allVideos.map((v) => v.category))]
  const filtered = category ? allVideos.filter((v) => v.category === category) : allVideos

  return (
    <div className="mt-2">
      {!open ? (
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-orange-500 transition-colors py-1">
          <span className="w-4 h-4 rounded-full bg-surface-elevated flex items-center justify-center">+</span>
          Dodaj vježbu
        </button>
      ) : (
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3 mt-2">
          {state?.error && <p className="text-xs text-red-400 mb-2">{state.error}</p>}
          <form action={async (fd) => { await action(fd); setOpen(false) }} className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-muted mb-1">Kategorija</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full rounded-md border border-border-subtle bg-surface px-2 py-1.5 text-xs text-text-primary focus:border-orange-500 focus:outline-none">
                  <option value="">Sve</option>
                  {categories.map((c) => <option key={c} value={c}>{categoryLabel[c] ?? c}</option>)}
                </select>
              </div>
              <div className="flex-[2]">
                <label className="block text-xs font-medium text-text-muted mb-1">Snimak</label>
                <select name="videoId" required className="block w-full rounded-md border border-border-subtle bg-surface px-2 py-1.5 text-xs text-text-primary focus:border-orange-500 focus:outline-none">
                  <option value="">Odaberite snimak</option>
                  {filtered.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-muted mb-1">Serije × Ponavljanja</label>
                <input name="setsReps" type="text" required placeholder="npr. 3x15" className="block w-full rounded-md border border-border-subtle bg-surface px-2 py-1.5 text-xs text-text-primary focus:border-orange-500 focus:outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-muted mb-1">Napomena (opciono)</label>
                <input name="note" type="text" placeholder="npr. Pazi na kolena" className="block w-full rounded-md border border-border-subtle bg-surface px-2 py-1.5 text-xs text-text-primary focus:border-orange-500 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-orange-400">Dodaj vježbu</button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border-subtle px-3 py-1.5 text-xs text-text-muted">Otkaži</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

// ─── Delete button ────────────────────────────────────────────────────────────

function DeleteBtn({ onDelete, label = 'Obrisati' }: { onDelete: () => void; label?: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => { if (confirm(`${label}?`)) startTransition(onDelete) }}
      disabled={isPending}
      className="rounded p-1 text-text-muted hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
    >
      {isPending ? '...' : '✕'}
    </button>
  )
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export function ProgramBuilder({ program, allVideos }: { program: Program; allVideos: Video[] }) {
  if (allVideos.length === 0) {
    return (
      <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-6 text-center">
        <p className="text-sm font-medium text-orange-400 mb-1">Biblioteka snimaka je prazna</p>
        <p className="text-xs text-text-muted mb-4">Dodajte snimke u video biblioteku pre izgradnje programa.</p>
        <a href="/admin/videos/new" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition-colors inline-block">
          Dodaj prvi snimak
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {program.trainings.map((training) => (
        <div key={training.id} className="rounded-xl border border-border-subtle overflow-hidden">
          {/* Training header */}
          <div className="flex items-center justify-between px-5 py-4 bg-surface-elevated">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-zinc-950">
                {training.order}
              </span>
              <h3 className="font-bold text-text-primary">{training.title}</h3>
            </div>
            <DeleteBtn label="Obrisati ovaj trening i sve vježbe" onDelete={() => deleteTraining(training.id, program.id)} />
          </div>

          <div className="bg-surface-card p-5 space-y-4">
            {training.sections.map((section) => (
              <div key={section.id} className="rounded-lg border border-border-subtle overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-surface-elevated/50">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted">{section.title}</span>
                  <DeleteBtn label="Obrisati sekciju" onDelete={() => deleteSection(section.id, program.id)} />
                </div>
                <div className="px-4 py-2 divide-y divide-border-subtle">
                  {section.exercises.length === 0 ? (
                    <p className="text-xs text-text-muted py-2">Nema vježbi — dodajte ispod.</p>
                  ) : section.exercises.map((ex) => (
                    <div key={ex.id} className="flex items-start justify-between py-2.5">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-text-primary">{ex.video.title}</p>
                          <span className="rounded-full bg-orange-500/15 px-1.5 py-0.5 text-xs font-semibold text-orange-400">
                            {ex.setsReps}
                          </span>
                        </div>
                        {ex.note && <p className="text-xs text-text-muted mt-0.5">{ex.note}</p>}
                        <a href={ex.video.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-500 hover:underline mt-0.5 inline-block">Video →</a>
                      </div>
                      <DeleteBtn label="Obrisati vježbu" onDelete={() => deleteExercise(ex.id, program.id)} />
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-3">
                  <AddExerciseForm sectionId={section.id} programId={program.id} allVideos={allVideos} />
                </div>
              </div>
            ))}
            <AddSectionForm trainingId={training.id} programId={program.id} />
          </div>
        </div>
      ))}

      <AddTrainingForm programId={program.id} />
    </div>
  )
}
