import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Hand, StudyPlanItem, Flashcard, AppStats, Session, AuthUser } from '../types'
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
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  register: (username: string, password: string) => boolean
  logout: () => void
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

const AUTH_KEY = 'practice-app-auth'

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

function loadUser(): AuthUser | null {
  const raw = localStorage.getItem('practice-app-user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'h' + Math.abs(hash).toString(36)
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData)
  const [user, setUser] = useState<AuthUser | null>(null)
  const isAuthenticated = user !== null

  useEffect(() => {
    const saved = localStorage.getItem('practice-app-data')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
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

  useEffect(() => {
    const u = loadUser()
    if (u) setUser(u)
  }, [])

  const login = (username: string, password: string): boolean => {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return false
    const users: Record<string, string> = JSON.parse(raw)
    const storedHash = users[username]
    if (!storedHash) return false
    if (storedHash !== hashPassword(password)) return false
    setUser({ username })
    localStorage.setItem('practice-app-user', JSON.stringify({ username }))
    return true
  }

  const register = (username: string, password: string): boolean => {
    const raw = localStorage.getItem(AUTH_KEY)
    const users: Record<string, string> = raw ? JSON.parse(raw) : {}
    if (users[username]) return false
    users[username] = hashPassword(password)
    localStorage.setItem(AUTH_KEY, JSON.stringify(users))
    setUser({ username })
    localStorage.setItem('practice-app-user', JSON.stringify({ username }))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('practice-app-user')
  }

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
        user,
        isAuthenticated,
        login,
        register,
        logout,
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
