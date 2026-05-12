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

async function request<T>(path: string, options?: RequestInit & { token?: string }): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (options?.token) {
    headers['Authorization'] = `Bearer ${options.token}`
  }

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers,
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
    list: (token?: string) => request<Session[]>('/sessions', { token }),
    getById: (id: string, token?: string) => request<Session>(`/sessions/${id}`, { token }),
    create: (data: CreateSessionPayload, token?: string) =>
      request<Session>('/sessions', { method: 'POST', body: JSON.stringify(data), token }),
    delete: (id: string, token?: string) =>
      request<{ message: string }>(`/sessions/${id}`, { method: 'DELETE', token }),
  },

  hands: {
    list: (token?: string) => request<Hand[]>('/hands', { token }),
    getById: (id: string, token?: string) => request<Hand>(`/hands/${id}`, { token }),
    create: (data: CreateHandPayload, token?: string) =>
      request<Hand>('/hands', { method: 'POST', body: JSON.stringify(data), token }),
    patch: (id: string, data: Partial<Hand>, token?: string) =>
      request<Hand>(`/hands/${id}`, { method: 'PATCH', body: JSON.stringify(data), token }),
    delete: (id: string, token?: string) =>
      request<{ message: string }>(`/hands/${id}`, { method: 'DELETE', token }),
  },

  study: {
    list: (token?: string) => request<StudyPlanItem[]>('/study', { token }),
    create: (data: CreateStudyPayload, token?: string) =>
      request<StudyPlanItem>('/study', { method: 'POST', body: JSON.stringify(data), token }),
    toggle: (id: string, token?: string) =>
      request<StudyPlanItem>(`/study/${id}/toggle`, { method: 'PATCH', token }),
  },

  flashcards: {
    list: (token?: string) => request<Flashcard[]>('/flashcards', { token }),
    create: (data: CreateFlashcardPayload, token?: string) =>
      request<Flashcard>('/flashcards', { method: 'POST', body: JSON.stringify(data), token }),
    patch: (id: string, data: Partial<Flashcard>, token?: string) =>
      request<Flashcard>(`/flashcards/${id}`, { method: 'PATCH', body: JSON.stringify(data), token }),
  },

  stats: {
    get: (token?: string) => request<AppStats>('/stats', { token }),
  },
}
