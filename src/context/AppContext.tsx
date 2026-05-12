import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Hand, StudyPlanItem, Flashcard, AppStats, Session, AuthUser } from '../types'
import { createDefaultFlashcards } from '../data/flashcards'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

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
  login: (email: string, password: string) => Promise<string | null>
  register: (email: string, password: string, username: string) => Promise<string | null>
  logout: () => Promise<void>
  loading: boolean
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

function toAuthUser(sbUser: User): AuthUser {
  return {
    email: sbUser.email || '',
    username: sbUser.user_metadata?.username || sbUser.email?.split('@')[0] || 'User',
  }
}

function loadData(): AppData {
  const saved = localStorage.getItem('practice-app-data')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (!parsed.flashcards || parsed.flashcards.length === 0) {
        parsed.flashcards = createDefaultFlashcards()
      }
      return parsed
    } catch (e) {
      console.error('Failed to load data:', e)
    }
  }
  return defaultData
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const isAuthenticated = user !== null

  // Solo restaurar sesión de Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(toAuthUser(session.user))
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(toAuthUser(session.user))
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    localStorage.setItem('practice-app-data', JSON.stringify(data))
  }, [data])

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message || null
  }

  const register = async (email: string, password: string, username: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
    return error?.message || null
  }

  const logout = async () => {
    await supabase.auth.signOut()
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
        loading,
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
