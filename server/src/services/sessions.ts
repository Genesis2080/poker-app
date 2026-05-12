import * as store from '../data/store.js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Session } from '../types/index.js'

export async function listSessions(supabase: SupabaseClient): Promise<Session[]> {
  return store.getSessions(supabase)
}

export async function getSession(supabase: SupabaseClient, id: string): Promise<Session | null> {
  return store.getSessionById(supabase, id)
}

export async function createSession(supabase: SupabaseClient, userId: string, data: Omit<Session, 'id'>): Promise<Session> {
  return store.addSession(supabase, userId, data)
}

export async function removeSession(supabase: SupabaseClient, id: string): Promise<boolean> {
  return store.deleteSession(supabase, id)
}
