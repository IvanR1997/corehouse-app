'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

// ─── Program ─────────────────────────────────────────────────────────────────

export type ProgramState = { error?: string } | undefined

export async function createProgram(state: ProgramState, formData: FormData): Promise<ProgramState> {
  await requireRole('ADMIN')

  const title = (formData.get('title') as string)?.trim()
  if (!title) return { error: 'Naziv programa je obavezan.' }

  const program = await db.program.create({
    data: {
      title,
      description: (formData.get('description') as string) || undefined,
    },
  })

  revalidatePath('/admin/programs')
  redirect(`/admin/programs/${program.id}`)
}

export async function deleteProgram(id: string) {
  await requireRole('ADMIN')
  await db.program.delete({ where: { id } })
  revalidatePath('/admin/programs')
}

// ─── Trainings ────────────────────────────────────────────────────────────────

export type TrainingState = { error?: string } | undefined

export async function addTraining(programId: string, state: TrainingState, formData: FormData): Promise<TrainingState> {
  await requireRole('ADMIN')

  const title = (formData.get('title') as string)?.trim()
  if (!title) return { error: 'Naziv treninga je obavezan.' }

  const last = await db.programTraining.findFirst({
    where: { programId },
    orderBy: { order: 'desc' },
  })

  await db.programTraining.create({ data: { programId, title, order: (last?.order ?? 0) + 1 } })
  revalidatePath(`/admin/programs/${programId}`)
  return {}
}

export async function deleteTraining(id: string, programId: string) {
  await requireRole('ADMIN')
  await db.programTraining.delete({ where: { id } })
  revalidatePath(`/admin/programs/${programId}`)
}

// ─── Sections ─────────────────────────────────────────────────────────────────

export type SectionState = { error?: string } | undefined

export async function addSection(trainingId: string, programId: string, state: SectionState, formData: FormData): Promise<SectionState> {
  await requireRole('ADMIN')

  const title = (formData.get('title') as string)?.trim()
  if (!title) return { error: 'Naziv sekcije je obavezan.' }

  const last = await db.programSection.findFirst({
    where: { trainingId },
    orderBy: { order: 'desc' },
  })

  await db.programSection.create({ data: { trainingId, title, order: (last?.order ?? 0) + 1 } })
  revalidatePath(`/admin/programs/${programId}`)
  return {}
}

export async function deleteSection(id: string, programId: string) {
  await requireRole('ADMIN')
  await db.programSection.delete({ where: { id } })
  revalidatePath(`/admin/programs/${programId}`)
}

// ─── Exercises ────────────────────────────────────────────────────────────────

const ExerciseSchema = z.object({
  videoId: z.string().min(1, 'Odaberite snimak.'),
  setsReps: z.string().min(1, 'Unesite serije/ponavljanja.'),
  note: z.string().optional(),
})

export type ExerciseState = { error?: string } | undefined

export async function addExercise(sectionId: string, programId: string, state: ExerciseState, formData: FormData): Promise<ExerciseState> {
  await requireRole('ADMIN')

  const validated = ExerciseSchema.safeParse({
    videoId: formData.get('videoId'),
    setsReps: formData.get('setsReps'),
    note: formData.get('note') || undefined,
  })

  if (!validated.success) return { error: validated.error.errors[0].message }

  const last = await db.programExercise.findFirst({
    where: { sectionId },
    orderBy: { order: 'desc' },
  })

  await db.programExercise.create({
    data: { sectionId, order: (last?.order ?? 0) + 1, ...validated.data },
  })

  revalidatePath(`/admin/programs/${programId}`)
  return {}
}

export async function deleteExercise(id: string, programId: string) {
  await requireRole('ADMIN')
  await db.programExercise.delete({ where: { id } })
  revalidatePath(`/admin/programs/${programId}`)
}

// ─── Access ───────────────────────────────────────────────────────────────────

export async function grantProgramAccess(userId: string, programId: string) {
  await requireRole('ADMIN')

  await db.programAccess.upsert({
    where: { userId_programId: { userId, programId } },
    update: {},
    create: { userId, programId },
  })

  revalidatePath(`/admin/programs/${programId}/access`)
  revalidatePath('/admin/clients')
  return { success: true }
}

export async function revokeProgramAccess(userId: string, programId: string) {
  await requireRole('ADMIN')
  await db.programAccess.deleteMany({ where: { userId, programId } })
  revalidatePath(`/admin/programs/${programId}/access`)
  return { success: true }
}
