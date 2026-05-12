import * as store from '../data/store.js'
import type { Flashcard } from '../types/index.js'

export function listFlashcards(): Flashcard[] {
  return store.getFlashcards()
}

export function createFlashcard(data: Omit<Flashcard, 'id'>): Flashcard {
  const card: Flashcard = { ...data, id: crypto.randomUUID() }
  store.addFlashcard(card)
  return card
}

export function patchFlashcard(id: string, updates: Partial<Flashcard>): Flashcard | null {
  return store.updateFlashcard(id, updates)
}
