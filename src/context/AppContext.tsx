import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Hand, StudyPlanItem, Flashcard, AppStats, Session } from '../types'
import { createDefaultFlashcards } from '../data/flashcards'

interface AppData {
  hands: Hand[]
  studyPlan: StudyPlanItem[]
  flashcards: Flashcard[]
  sessions: Session[]
  stats: AppStats
}

interface AppContextType {
  data: AppData
  setData: React.Dispatch<React.SetStateAction<AppData>>
  addHand: (hand: Hand) => void
  updateHand: (id: string, updates: Partial<Hand>) => void
  deleteHand: (id: string) => void
  addStudyItem: (item: StudyPlanItem) => void
  toggleStudyItem: (id: string) => void
  addFlashcard: (card: Flashcard) => void
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void
  addSession: (session: Session) => void
  deleteSession: (id: string) => void
}

const defaultData: AppData = {
  hands: [],
  studyPlan: [],
  flashcards: createDefaultFlashcards(),
  sessions: [],
  stats: {
    totalHands: 0,
    winRate: 0,
    vpip: 0,
    pfr: 0,
    threeBet: 0,
    cbet: 0,
    totalSessions: 0,
    totalInvested: 0,
    totalWon: 0,
    roi: 0,
  },
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData)

  useEffect(() => {
    const saved = localStorage.getItem('practice-app-data')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Si no tiene flashcards, cargar las por defecto
        if (!parsed.flashcards || parsed.flashcards.length === 0) {
          parsed.flashcards = createDefaultFlashcards()
        }
        setData(parsed)
      } catch (e) {
        console.error('Failed to load data:', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('practice-app-data', JSON.stringify(data))
  }, [data])

  const addHand = (hand: Hand) => {
    setData((prev) => ({
      ...prev,
      hands: [hand, ...prev.hands],
    }))
  }

  const updateHand = (id: string, updates: Partial<Hand>) => {
    setData((prev) => ({
      ...prev,
      hands: prev.hands.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }))
  }

  const deleteHand = (id: string) => {
    setData((prev) => ({
      ...prev,
      hands: prev.hands.filter((h) => h.id !== id),
    }))
  }

  const addStudyItem = (item: StudyPlanItem) => {
    setData((prev) => ({
      ...prev,
      studyPlan: [...prev.studyPlan, item],
    }))
  }

  const toggleStudyItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      studyPlan: prev.studyPlan.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }))
  }

  const addFlashcard = (card: Flashcard) => {
    setData((prev) => ({
      ...prev,
      flashcards: [...prev.flashcards, card],
    }))
  }

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setData((prev) => ({
      ...prev,
      flashcards: prev.flashcards.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    }))
  }

  const addSession = (session: Session) => {
    setData((prev) => {
      const newSessions = [session, ...prev.sessions]
      const totalInvested = newSessions.reduce((sum, s) => sum + s.buyIn, 0)
      const totalWon = newSessions.reduce((sum, s) => sum + s.cashOut, 0)
      const roi = totalInvested > 0 ? ((totalWon - totalInvested) / totalInvested) * 100 : 0
      
      return {
        ...prev,
        sessions: newSessions,
        stats: {
          ...prev.stats,
          totalSessions: newSessions.length,
          totalInvested,
          totalWon,
          roi: Math.round(roi * 100) / 100,
        }
      }
    })
  }

  const deleteSession = (id: string) => {
    setData((prev) => {
      const newSessions = prev.sessions.filter((s) => s.id !== id)
      const totalInvested = newSessions.reduce((sum, s) => sum + s.buyIn, 0)
      const totalWon = newSessions.reduce((sum, s) => sum + s.cashOut, 0)
      const roi = totalInvested > 0 ? ((totalWon - totalInvested) / totalInvested) * 100 : 0
      
      return {
        ...prev,
        sessions: newSessions,
        stats: {
          ...prev.stats,
          totalSessions: newSessions.length,
          totalInvested,
          totalWon,
          roi: Math.round(roi * 100) / 100,
        }
      }
    })
  }

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        addHand,
        updateHand,
        deleteHand,
        addStudyItem,
        toggleStudyItem,
        addFlashcard,
        updateFlashcard,
        addSession,
        deleteSession,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}