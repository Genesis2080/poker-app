import * as store from '../data/store.js'
import type { AppStats } from '../types/index.js'

export function computeStats(): AppStats {
  const sessions = store.getSessions()
  const hands = store.getHands()

  const totalSessions = sessions.length
  const totalInvested = sessions.reduce((sum, s) => sum + s.buyIn, 0)
  const totalWon = sessions.reduce((sum, s) => sum + s.cashOut, 0)
  const roi = totalInvested > 0 ? Math.round(((totalWon - totalInvested) / totalInvested) * 10000) / 100 : 0

  const totalHands = hands.length
  const wins = hands.filter((h) => h.result === 'win').length
  const winRate = totalHands > 0 ? Math.round((wins / totalHands) * 100) : 0

  return { totalHands, winRate, totalSessions, totalInvested, totalWon, roi }
}
