import * as store from '../data/store.js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Hand } from '../types/index.js'

export async function listHands(supabase: SupabaseClient): Promise<Hand[]> {
  return store.getHands(supabase)
}

export async function getHand(supabase: SupabaseClient, id: string): Promise<Hand | null> {
  return store.getHandById(supabase, id)
}

export async function createHand(supabase: SupabaseClient, userId: string, data: Omit<Hand, 'id'>): Promise<Hand> {
  return store.addHand(supabase, userId, data)
}

export async function patchHand(supabase: SupabaseClient, id: string, updates: Partial<Hand>): Promise<Hand | null> {
  return store.updateHand(supabase, id, updates)
}

export async function removeHand(supabase: SupabaseClient, id: string): Promise<boolean> {
  return store.deleteHand(supabase, id)
}
