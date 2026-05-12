import * as store from '../data/store.js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Flashcard } from '../types/index.js'

export async function listFlashcards(supabase: SupabaseClient): Promise<Flashcard[]> {
  return store.getFlashcards(supabase)
}

export async function createFlashcard(supabase: SupabaseClient, userId: string, data: Omit<Flashcard, 'id'>): Promise<Flashcard> {
  return store.addFlashcard(supabase, userId, data)
}

export async function patchFlashcard(supabase: SupabaseClient, id: string, updates: Partial<Flashcard>): Promise<Flashcard | null> {
  return store.updateFlashcard(supabase, id, updates)
}
