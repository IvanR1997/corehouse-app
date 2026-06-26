'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/dal'

const CATEGORIES = ['MOBILNOST', 'CORE', 'NOGE', 'LEDJA', 'GRUDI', 'RAMENA', 'BICEPS', 'TRICEPS', 'KARDIO', 'OSTALO'] as const

const VideoSchema = z.object({
  title: z.string().min(2, 'Naziv je obavezan.'),
  url: z.string().url('Unesite validan URL.'),
  category: z.enum(CATEGORIES),
  description: z.string().optional(),
})

export type VideoState = { error?: string; success?: boolean } | undefined

export async function createVideo(state: VideoState, formData: FormData): Promise<VideoState> {
  await requireRole('ADMIN')

  const validated = VideoSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    category: formData.get('category'),
    description: formData.get('description') || undefined,
  })

  if (!validated.success) return { error: validated.error.errors[0].message }

  await db.video.create({ data: validated.data })
  revalidatePath('/admin/videos')
  return { success: true }
}

export async function updateVideo(id: string, state: VideoState, formData: FormData): Promise<VideoState> {
  await requireRole('ADMIN')

  const validated = VideoSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    category: formData.get('category'),
    description: formData.get('description') || undefined,
  })

  if (!validated.success) return { error: validated.error.errors[0].message }

  await db.video.update({ where: { id }, data: validated.data })
  revalidatePath('/admin/videos')
  return { success: true }
}

export async function deleteVideo(id: string) {
  await requireRole('ADMIN')

  const inUse = await db.programExercise.count({ where: { videoId: id } })
  if (inUse > 0) return { error: 'Snimak se koristi u programu.' }

  await db.video.delete({ where: { id } })
  revalidatePath('/admin/videos')
  return { success: true }
}
