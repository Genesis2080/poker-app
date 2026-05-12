import type { Session, Hand, StudyPlanItem, Flashcard } from '../types'
import type { AppStats } from '../types'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: { field: string; message: string }[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, body?.error || res.statusText, body?.details)
  }

  return res.json() as Promise<T>
}

type CreateSessionPayload = Omit<Session, 'id'>
type CreateHandPayload = Omit<Hand, 'id'>
type CreateStudyPayload = Omit<StudyPlanItem, 'id' | 'completed'>
type CreateFlashcardPayload = Omit<Flashcard, 'id'>

export const api = {
  sessions: {
    list: () => request<Session[]>('/sessions'),
    getById: (id: string) => request<Session>(`/sessions/${id}`),
    create: (data: CreateSessionPayload) =>
      request<Session>('/sessions', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/sessions/${id}`, { method: 'DELETE' }),
  },

  hands: {
    list: () => request<Hand[]>('/hands'),
    getById: (id: string) => request<Hand>(`/hands/${id}`),
    create: (data: CreateHandPayload) =>
      request<Hand>('/hands', { method: 'POST', body: JSON.stringify(data) }),
    patch: (id: string, data: Partial<Hand>) =>
      request<Hand>(`/hands/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/hands/${id}`, { method: 'DELETE' }),
  },

  study: {
    list: () => request<StudyPlanItem[]>('/study'),
    create: (data: CreateStudyPayload) =>
      request<StudyPlanItem>('/study', { method: 'POST', body: JSON.stringify(data) }),
    toggle: (id: string) =>
      request<StudyPlanItem>(`/study/${id}/toggle`, { method: 'PATCH' }),
  },

  flashcards: {
    list: () => request<Flashcard[]>('/flashcards'),
    create: (data: CreateFlashcardPayload) =>
      request<Flashcard>('/flashcards', { method: 'POST', body: JSON.stringify(data) }),
    patch: (id: string, data: Partial<Flashcard>) =>
      request<Flashcard>(`/flashcards/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  stats: {
    get: () => request<AppStats>('/stats'),
  },
}
