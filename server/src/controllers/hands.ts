import type { Request, Response } from 'express'
import * as handsService from '../services/hands.js'
import { createUserClient } from '../lib/supabase.js'

function getAuth(req: Request) {
  const r = req as unknown as { userId: string; token: string }
  return { supabase: createUserClient(r.token), userId: r.userId }
}

export async function getAll(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const hands = await handsService.listHands(supabase)
  res.json(hands)
}

export async function getById(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const id = req.params.id as string
  const hand = await handsService.getHand(supabase, id)
  if (!hand) {
    res.status(404).json({ error: 'Mano no encontrada' })
    return
  }
  res.json(hand)
}

export async function create(req: Request, res: Response) {
  const { supabase, userId } = getAuth(req)
  const hand = await handsService.createHand(supabase, userId, req.body)
  res.status(201).json(hand)
}

export async function patch(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const id = req.params.id as string
  const updated = await handsService.patchHand(supabase, id, req.body)
  if (!updated) {
    res.status(404).json({ error: 'Mano no encontrada' })
    return
  }
  res.json(updated)
}

export async function remove(req: Request, res: Response) {
  const { supabase } = getAuth(req)
  const id = req.params.id as string
  const deleted = await handsService.removeHand(supabase, id)
  if (!deleted) {
    res.status(404).json({ error: 'Mano no encontrada' })
    return
  }
  res.json({ message: 'Mano eliminada correctamente' })
}
