import type { Request, Response } from 'express'
import * as handsService from '../services/hands.js'

export function getAll(_req: Request, res: Response) {
  const hands = handsService.listHands()
  res.json(hands)
}

export function getById(req: Request<{ id: string }>, res: Response) {
  const hand = handsService.getHand(req.params.id)
  if (!hand) {
    res.status(404).json({ error: 'Mano no encontrada' })
    return
  }
  res.json(hand)
}

export function create(req: Request, res: Response) {
  const hand = handsService.createHand(req.body)
  res.status(201).json(hand)
}

export function patch(req: Request<{ id: string }>, res: Response) {
  const updated = handsService.patchHand(req.params.id, req.body)
  if (!updated) {
    res.status(404).json({ error: 'Mano no encontrada' })
    return
  }
  res.json(updated)
}

export function remove(req: Request<{ id: string }>, res: Response) {
  const deleted = handsService.removeHand(req.params.id)
  if (!deleted) {
    res.status(404).json({ error: 'Mano no encontrada' })
    return
  }
  res.json({ message: 'Mano eliminada correctamente' })
}
