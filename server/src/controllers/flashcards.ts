import type { Request, Response } from 'express'
import * as flashcardsService from '../services/flashcards.js'
import { createUserClient } from '../lib/supabase.js'

function getAuth(req: Request) {
  const r = req as unknown as { userId: string; token: string }
  return { supabase: createUserClient(r.token), userId: r.userId }
}

export async function getAll(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const cards = await flashcardsService.listFlashcards(supabase)
  res.json(cards)
}

export async function create(req: Request, res: Response) {
  const { supabase, userId } = getAuth(req)
  const card = await flashcardsService.createFlashcard(supabase, userId, req.body)
  res.status(201).json(card)
}

export async function patch(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const id = req.params.id as string
  const updated = await flashcardsService.patchFlashcard(supabase, id, req.body)
  if (!updated) {
    res.status(404).json({ error: 'Flashcard no encontrada' })
    return
  }
  res.json(updated)
}
