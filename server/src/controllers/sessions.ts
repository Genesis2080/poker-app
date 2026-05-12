import type { Request, Response } from 'express'
import * as sessionsService from '../services/sessions.js'
import { createUserClient } from '../lib/supabase.js'

function getAuth(req: Request) {
  const r = req as unknown as { userId: string; token: string }
  return { supabase: createUserClient(r.token), userId: r.userId }
}

export async function getAll(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const sessions = await sessionsService.listSessions(supabase)
  res.json(sessions)
}

export async function getById(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const id = req.params.id as string
  const session = await sessionsService.getSession(supabase, id)
  if (!session) {
    res.status(404).json({ error: 'Sesión no encontrada' })
    return
  }
  res.json(session)
}

export async function create(req: Request, res: Response) {
  const { supabase, userId } = getAuth(req)
  const session = await sessionsService.createSession(supabase, userId, req.body)
  res.status(201).json(session)
}

export async function remove(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const id = req.params.id as string
  const deleted = await sessionsService.removeSession(supabase, id)
  if (!deleted) {
    res.status(404).json({ error: 'Sesión no encontrada' })
    return
  }
  res.json({ message: 'Sesión eliminada correctamente' })
}
