import * as store from '../data/store.js'
import type { Hand } from '../types/index.js'

export function listHands(): Hand[] {
  return store.getHands()
}

export function getHand(id: string): Hand | null {
  return store.getHandById(id) ?? null
}

export function createHand(data: Omit<Hand, 'id'>): Hand {
  const hand: Hand = { ...data, id: crypto.randomUUID() }
  store.addHand(hand)
  return hand
}

export function patchHand(id: string, updates: Partial<Hand>): Hand | null {
  return store.updateHand(id, updates)
}

export function removeHand(id: string): boolean {
  return store.deleteHand(id)
}
