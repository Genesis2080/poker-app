import type { Session, Hand, StudyPlanItem, Flashcard } from '../types/index.js'
import { getDefaultFlashcards } from './seed.js'

interface StoreData {
  sessions: Session[]
  hands: Hand[]
  studyPlan: StudyPlanItem[]
  flashcards: Flashcard[]
}

const store: StoreData = {
  sessions: [],
  hands: [],
  studyPlan: [],
  flashcards: getDefaultFlashcards(),
}

export function getSessions(): Session[] {
  return [...store.sessions]
}

export function getSessionById(id: string): Session | undefined {
  return store.sessions.find((s) => s.id === id)
}

export function addSession(session: Session): Session {
  store.sessions.push(session)
  return session
}

export function deleteSession(id: string): boolean {
  const index = store.sessions.findIndex((s) => s.id === id)
  if (index === -1) return false
  store.sessions.splice(index, 1)
  return true
}

export function getHands(): Hand[] {
  return [...store.hands]
}

export function getHandById(id: string): Hand | undefined {
  return store.hands.find((h) => h.id === id)
}

export function addHand(hand: Hand): Hand {
  store.hands.push(hand)
  return hand
}

export function updateHand(id: string, updates: Partial<Hand>): Hand | null {
  const index = store.hands.findIndex((h) => h.id === id)
  if (index === -1) return null
  store.hands[index] = { ...store.hands[index], ...updates }
  return store.hands[index]
}

export function deleteHand(id: string): boolean {
  const index = store.hands.findIndex((h) => h.id === id)
  if (index === -1) return false
  store.hands.splice(index, 1)
  return true
}

export function getStudyPlan(): StudyPlanItem[] {
  return [...store.studyPlan]
}

export function addStudyItem(item: StudyPlanItem): StudyPlanItem {
  store.studyPlan.push(item)
  return item
}

export function toggleStudyItem(id: string): StudyPlanItem | null {
  const item = store.studyPlan.find((s) => s.id === id)
  if (!item) return null
  item.completed = !item.completed
  return item
}

export function getFlashcards(): Flashcard[] {
  return [...store.flashcards]
}

export function addFlashcard(card: Flashcard): Flashcard {
  store.flashcards.push(card)
  return card
}

export function updateFlashcard(id: string, updates: Partial<Flashcard>): Flashcard | null {
  const index = store.flashcards.findIndex((f) => f.id === id)
  if (index === -1) return null
  store.flashcards[index] = { ...store.flashcards[index], ...updates }
  return store.flashcards[index]
}
