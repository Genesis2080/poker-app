import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Hand, StudyPlanItem, Flashcard, Session, AuthUser } from '../types'
import { createDefaultFlashcards } from '../data/flashcards'
import { INITIAL_STUDY_PLAN } from '../data/studyPlan'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { api, ApiError } from '../api/client'

interface AppData {
  hands: Hand[]
  studyPlan: StudyPlanItem[]
  flashcards: Flashcard[]
  sessions: Session[]
}

interface AppContextType {
  data: AppData
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (email: string, password: string, username: string) => Promise<string | null>
  logout: () => Promise<void>
  authLoading: boolean
  dataLoading: boolean
  dataError: string | null
  retryLoadData: () => Promise<void>
  addHand: (hand: Omit<Hand, 'id'>) => Promise<void>
  updateHand: (id: string, updates: Partial<Hand>) => Promise<void>
  deleteHand: (id: string) => Promise<void>
  addStudyItem: (item: Omit<StudyPlanItem, 'id' | 'completed'>) => Promise<void>
  toggleStudyItem: (id: string) => Promise<void>
  addFlashcard: (card: Omit<Flashcard, 'id'>) => Promise<void>
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<void>
  addSession: (session: Omit<Session, 'id'>) => Promise<void>
  deleteSession: (id: string) => Promise<void>
}

const emptyData: AppData = {
  hands: [],
  studyPlan: [],
  flashcards: [],
  sessions: [],
}

const AppContext = createContext<AppContextType | undefined>(undefined)

function toAuthUser(sbUser: User): AuthUser {
  return {
    email: sbUser.email || '',
    username: sbUser.user_metadata?.username || sbUser.email?.split('@')[0] || 'User',
  }
}

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || ''
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState<string | null>(null)

  // Restaurar sesión de Supabase
  const [sessionRestored, setSessionRestored] = useState(false)
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(toAuthUser(session.user))
      }
      setAuthLoading(false)
      setSessionRestored(true)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(toAuthUser(session.user))
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadAllData = useCallback(async () => {
    setDataLoading(true)
    setDataError(null)
    try {
      const token = await getToken()
      if (!token) throw new ApiError(401, 'No hay sesión activa')

      const [sessions, hands, studyPlan, flashcards] = await Promise.all([
        api.sessions.list(token),
        api.hands.list(token),
        api.study.list(token),
        api.flashcards.list(token),
      ])

      let finalFlashcards = flashcards
      if (flashcards.length === 0) {
        const defaults = createDefaultFlashcards()
        finalFlashcards = await Promise.all(
          defaults.map((card) => api.flashcards.create(card, token))
        )
      }

      let finalStudyPlan = studyPlan
      if (studyPlan.length === 0) {
        const allItems = Object.values(INITIAL_STUDY_PLAN).flat()
        finalStudyPlan = await Promise.all(
          allItems.map((item) => api.study.create(item, token))
        )
      }

      setData({ sessions, hands, studyPlan: finalStudyPlan, flashcards: finalFlashcards })
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Error al cargar datos'
      setDataError(msg)
    } finally {
      setDataLoading(false)
    }
  }, [])

  // Load data once auth is restored and user is authenticated
  useEffect(() => {
    if (sessionRestored && user) {
      loadAllData()
    }
  }, [sessionRestored, user, loadAllData])

  // Auth
  const isAuthenticated = user !== null

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message || null
  }, [])

  const register = useCallback(async (email: string, password: string, username: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
    return error?.message || null
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  // Helper: get token and call api
  const withToken = useCallback(async <T,>(fn: (token: string) => Promise<T>): Promise<T> => {
    const token = await getToken()
    if (!token) throw new ApiError(401, 'No hay sesión activa')
    return fn(token)
  }, [])

  // CRUD: Sessions
  const addSession = useCallback(async (payload: Omit<Session, 'id'>) => {
    const created = await withToken((t) => api.sessions.create(payload, t))
    setData((prev) => ({ ...prev, sessions: [created, ...prev.sessions] }))
  }, [withToken])

  const deleteSession = useCallback(async (id: string) => {
    await withToken((t) => api.sessions.delete(id, t))
    setData((prev) => ({ ...prev, sessions: prev.sessions.filter((s) => s.id !== id) }))
  }, [withToken])

  // CRUD: Hands
  const addHand = useCallback(async (payload: Omit<Hand, 'id'>) => {
    const created = await withToken((t) => api.hands.create(payload, t))
    setData((prev) => ({ ...prev, hands: [created, ...prev.hands] }))
  }, [withToken])

  const updateHand = useCallback(async (id: string, updates: Partial<Hand>) => {
    const updated = await withToken((t) => api.hands.patch(id, updates, t))
    setData((prev) => ({
      ...prev,
      hands: prev.hands.map((h) => (h.id === id ? updated : h)),
    }))
  }, [withToken])

  const deleteHand = useCallback(async (id: string) => {
    await withToken((t) => api.hands.delete(id, t))
    setData((prev) => ({ ...prev, hands: prev.hands.filter((h) => h.id !== id) }))
  }, [withToken])

  // CRUD: Study
  const addStudyItem = useCallback(async (payload: Omit<StudyPlanItem, 'id' | 'completed'>) => {
    const created = await withToken((t) => api.study.create(payload, t))
    setData((prev) => ({ ...prev, studyPlan: [...prev.studyPlan, created] }))
  }, [withToken])

  const toggleStudyItem = useCallback(async (id: string) => {
    const updated = await withToken((t) => api.study.toggle(id, t))
    setData((prev) => ({
      ...prev,
      studyPlan: prev.studyPlan.map((item) =>
        item.id === id ? updated : item
      ),
    }))
  }, [withToken])

  // CRUD: Flashcards
  const addFlashcard = useCallback(async (payload: Omit<Flashcard, 'id'>) => {
    const created = await withToken((t) => api.flashcards.create(payload, t))
    setData((prev) => ({ ...prev, flashcards: [...prev.flashcards, created] }))
  }, [withToken])

  const updateFlashcard = useCallback(async (id: string, updates: Partial<Flashcard>) => {
    const updated = await withToken((t) => api.flashcards.patch(id, updates, t))
    setData((prev) => ({
      ...prev,
      flashcards: prev.flashcards.map((f) => (f.id === id ? updated : f)),
    }))
  }, [withToken])

  return (
    <AppContext.Provider
      value={{
        data,
        user,
        isAuthenticated,
        login,
        register,
        logout,
        authLoading,
        dataLoading,
        dataError,
        retryLoadData: loadAllData,
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
