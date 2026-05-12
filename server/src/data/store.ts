import type { SupabaseClient } from '@supabase/supabase-js'
import type { Session, Hand, StudyPlanItem, Flashcard } from '../types/index.js'

// ── Helpers ──

function rowToSession(row: any): Session {
  return {
    id: row.id,
    date: row.date,
    modality: row.modality,
    tournamentName: row.tournament_name ?? undefined,
    buyIn: Number(row.buy_in),
    cashOut: Number(row.cash_out),
    timePlayedMinutes: row.time_played_minutes,
    notes: row.notes ?? undefined,
  }
}

function sessionToRow(session: Partial<Session> & { user_id: string }) {
  return {
    user_id: session.user_id,
    date: session.date,
    modality: session.modality,
    tournament_name: 'tournamentName' in session ? session.tournamentName : undefined,
    buy_in: session.buyIn,
    cash_out: session.cashOut,
    time_played_minutes: session.timePlayedMinutes,
    notes: session.notes,
  }
}

function rowToHand(row: any): Hand {
  return {
    id: row.id,
    date: row.date,
    position: row.position,
    result: row.result,
    heroHand: row.hero_hand,
    villainRange: row.villain_range,
    preflopAction: row.preflop_action ?? '',
    street: row.street ?? 'preflop',
    board: row.board ?? '',
    notes: row.notes ?? '',
    tags: row.tags ?? [],
    heroName: row.hero_name ?? 'Hero',
    heroStack: Number(row.hero_stack ?? 0),
    potSize: Number(row.pot_size ?? 0),
    potWon: Number(row.pot_won ?? 0),
    stakes: row.stakes ?? '',
    tableName: row.table_name ?? '',
    tableFormat: row.table_format ?? '6-max',
    gameType: row.game_type ?? 'cash',
    rawText: row.raw_text ?? undefined,
  }
}

function handToRow(hand: Partial<Hand> & { user_id: string }) {
  return {
    user_id: hand.user_id,
    date: hand.date,
    position: hand.position,
    result: hand.result,
    hero_hand: hand.heroHand,
    villain_range: 'villainRange' in hand ? hand.villainRange : undefined,
    preflop_action: 'preflopAction' in hand ? hand.preflopAction : undefined,
    street: 'street' in hand ? hand.street : undefined,
    board: 'board' in hand ? hand.board : undefined,
    notes: 'notes' in hand ? hand.notes : undefined,
    tags: 'tags' in hand ? hand.tags : undefined,
    hero_name: 'heroName' in hand ? hand.heroName : undefined,
    hero_stack: 'heroStack' in hand ? hand.heroStack : undefined,
    pot_size: 'potSize' in hand ? hand.potSize : undefined,
    pot_won: 'potWon' in hand ? hand.potWon : undefined,
    stakes: 'stakes' in hand ? hand.stakes : undefined,
    table_name: 'tableName' in hand ? hand.tableName : undefined,
    table_format: 'tableFormat' in hand ? hand.tableFormat : undefined,
    game_type: 'gameType' in hand ? hand.gameType : undefined,
    raw_text: 'rawText' in hand ? hand.rawText : undefined,
  }
}

function rowToStudyItem(row: any): StudyPlanItem {
  return {
    id: row.id,
    topic: row.topic,
    description: row.description,
    street: row.street,
    category: row.category,
    completed: row.completed ?? false,
    priority: row.priority ?? 'medium',
  }
}

function studyItemToRow(item: Partial<StudyPlanItem> & { user_id: string }) {
  return {
    user_id: item.user_id,
    topic: item.topic,
    description: item.description,
    street: item.street,
    category: item.category,
    completed: 'completed' in item ? item.completed : false,
    priority: 'priority' in item ? item.priority : 'medium',
  }
}

function rowToFlashcard(row: any): Flashcard {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    difficulty: row.difficulty,
    interval: Number(row.interval ?? 0),
    easeFactor: Number(row.ease_factor ?? 2.5),
    nextReview: Number(row.next_review ?? 0),
    reviews: row.reviews ?? 0,
  }
}

function flashcardToRow(card: Partial<Flashcard> & { user_id: string }) {
  return {
    user_id: card.user_id,
    question: card.question,
    answer: card.answer,
    category: card.category,
    difficulty: card.difficulty,
    interval: 'interval' in card ? card.interval : 0,
    ease_factor: 'easeFactor' in card ? card.easeFactor : 2.5,
    next_review: 'nextReview' in card ? card.nextReview : 0,
    reviews: 'reviews' in card ? card.reviews : 0,
  }
}

// ── Sessions ──

export async function getSessions(supabase: SupabaseClient): Promise<Session[]> {
  const { data, error } = await supabase
    .from('sessions').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(rowToSession)
}

export async function getSessionById(supabase: SupabaseClient, id: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions').select('*').eq('id', id).single()
  if (error) return null
  return rowToSession(data)
}

export async function addSession(supabase: SupabaseClient, userId: string, data: Omit<Session, 'id'>): Promise<Session> {
  const { data: inserted, error } = await supabase
    .from('sessions').insert(sessionToRow({ ...data, user_id: userId })).select().single()
  if (error) throw error
  return rowToSession(inserted)
}

export async function deleteSession(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  return !error
}

// ── Hands ──

export async function getHands(supabase: SupabaseClient): Promise<Hand[]> {
  const { data, error } = await supabase
    .from('hands').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(rowToHand)
}

export async function getHandById(supabase: SupabaseClient, id: string): Promise<Hand | null> {
  const { data, error } = await supabase
    .from('hands').select('*').eq('id', id).single()
  if (error) return null
  return rowToHand(data)
}

export async function addHand(supabase: SupabaseClient, userId: string, data: Omit<Hand, 'id'>): Promise<Hand> {
  const { data: inserted, error } = await supabase
    .from('hands').insert(handToRow({ ...data, user_id: userId })).select().single()
  if (error) throw error
  return rowToHand(inserted)
}

export async function updateHand(supabase: SupabaseClient, id: string, updates: Partial<Hand>): Promise<Hand | null> {
  const { data: updated, error } = await supabase
    .from('hands').update(handToRow(updates as any)).eq('id', id).select().single()
  if (error) return null
  return rowToHand(updated)
}

export async function deleteHand(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from('hands').delete().eq('id', id)
  return !error
}

// ── Study Plan ──

export async function getStudyPlan(supabase: SupabaseClient): Promise<StudyPlanItem[]> {
  const { data, error } = await supabase
    .from('study_plan').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(rowToStudyItem)
}

export async function addStudyItem(supabase: SupabaseClient, userId: string, data: Omit<StudyPlanItem, 'id' | 'completed'>): Promise<StudyPlanItem> {
  const { data: inserted, error } = await supabase
    .from('study_plan').insert(studyItemToRow({ ...data, user_id: userId })).select().single()
  if (error) throw error
  return rowToStudyItem(inserted)
}

export async function toggleStudyItem(supabase: SupabaseClient, id: string): Promise<StudyPlanItem | null> {
  const { data: current } = await supabase.from('study_plan').select('completed').eq('id', id).single()
  if (!current) return null
  const { data: updated, error } = await supabase
    .from('study_plan').update({ completed: !current.completed }).eq('id', id).select().single()
  if (error) return null
  return rowToStudyItem(updated)
}

// ── Flashcards ──

export async function getFlashcards(supabase: SupabaseClient): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from('flashcards').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(rowToFlashcard)
}

export async function addFlashcard(supabase: SupabaseClient, userId: string, data: Omit<Flashcard, 'id'>): Promise<Flashcard> {
  const { data: inserted, error } = await supabase
    .from('flashcards').insert(flashcardToRow({ ...data, user_id: userId })).select().single()
  if (error) throw error
  return rowToFlashcard(inserted)
}

export async function updateFlashcard(supabase: SupabaseClient, id: string, updates: Partial<Flashcard>): Promise<Flashcard | null> {
  const { data: updated, error } = await supabase
    .from('flashcards').update(flashcardToRow(updates as any)).eq('id', id).select().single()
  if (error) return null
  return rowToFlashcard(updated)
}
