import * as store from '../data/store.js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { StudyPlanItem } from '../types/index.js'

export async function listStudyPlan(supabase: SupabaseClient): Promise<StudyPlanItem[]> {
  return store.getStudyPlan(supabase)
}

export async function createStudyItem(supabase: SupabaseClient, userId: string, data: Omit<StudyPlanItem, 'id' | 'completed'>): Promise<StudyPlanItem> {
  return store.addStudyItem(supabase, userId, data)
}

export async function toggleItem(supabase: SupabaseClient, id: string): Promise<StudyPlanItem | null> {
  return store.toggleStudyItem(supabase, id)
}
