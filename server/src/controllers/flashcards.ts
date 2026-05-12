import type { Request, Response } from 'express'
import * as flashcardsService from '../services/flashcards.js'

export function getAll(_req: Request, res: Response) {
  const cards = flashcardsService.listFlashcards()
  res.json(cards)
}

export function create(req: Request, res: Response) {
  const card = flashcardsService.createFlashcard(req.body)
  res.status(201).json(card)
}

export function patch(req: Request<{ id: string }>, res: Response) {
  const updated = flashcardsService.patchFlashcard(req.params.id, req.body)
  if (!updated) {
    res.status(404).json({ error: 'Flashcard no encontrada' })
    return
  }
  res.json(updated)
}
