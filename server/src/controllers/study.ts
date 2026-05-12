import type { Request, Response } from 'express'
import * as studyService from '../services/study.js'
import { createUserClient } from '../lib/supabase.js'

function getAuth(req: Request) {
  const r = req as unknown as { userId: string; token: string }
  return { supabase: createUserClient(r.token), userId: r.userId }
}

export async function getAll(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const items = await studyService.listStudyPlan(supabase)
  res.json(items)
}

export async function create(req: Request, res: Response) {
  const { supabase, userId } = getAuth(req)
  const item = await studyService.createStudyItem(supabase, userId, req.body)
  res.status(201).json(item)
}

export async function toggle(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const id = req.params.id as string
  const updated = await studyService.toggleItem(supabase, id)
  if (!updated) {
    res.status(404).json({ error: 'Elemento de estudio no encontrado' })
    return
  }
  res.json(updated)
}
