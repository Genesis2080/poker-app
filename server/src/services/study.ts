import * as store from '../data/store.js'
import type { StudyPlanItem } from '../types/index.js'

export function listStudyPlan(): StudyPlanItem[] {
  return store.getStudyPlan()
}

export function createStudyItem(data: Omit<StudyPlanItem, 'id' | 'completed'>): StudyPlanItem {
  const item: StudyPlanItem = { ...data, id: crypto.randomUUID(), completed: false }
  store.addStudyItem(item)
  return item
}

export function toggleItem(id: string): StudyPlanItem | null {
  return store.toggleStudyItem(id)
}
