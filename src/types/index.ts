export interface Card {
  rank: string
  suit: string
  full: string
}

export interface Player {
  id: string
  name: string
  seat: number
  stack: number
  cards?: Card[]
  position?: string
  isHero?: boolean
  isButton?: boolean
}

export interface Hand {
  id: string
  date: string
  position: string
  result: 'win' | 'loss' | 'even'
  heroHand: string
  villainRange: string | string[]
  preflopAction: string
  street: string
  board: string
  notes: string
  tags: string[]
  heroName: string
  heroStack: number
  potSize: number
  potWon: number
  stakes: string
  tableName: string
  tableFormat: string
  gameType: string
  rawText?: string
}

export interface StudyPlanItem {
  id: string
  topic: string
  description: string
  street: 'preflop' | 'flop' | 'turn' | 'river' | 'general'
  category: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

export interface Flashcard {
  id: string
  question: string
  answer: string
  category: string
  difficulty: number
  interval: number
  easeFactor: number
  nextReview: number
  reviews: number
}

export type GameModality = 'cash' | 'tournament' | 'spins'

export interface Session {
  id: string
  date: string
  modality: GameModality
  tournamentName?: string
  buyIn: number
  cashOut: number
  timePlayedMinutes: number
  notes?: string
}

export interface AppStats {
  totalHands: number
  winRate: number
  vpip: number
  pfr: number
  threeBet: number
  cbet: number
  totalSessions: number
  totalInvested: number
  totalWon: number
  roi: number
}