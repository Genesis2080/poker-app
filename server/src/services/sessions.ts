import * as store from '../data/store.js'
import type { Session } from '../types/index.js'

export function listSessions(): Session[] {
  return store.getSessions()
}

export function getSession(id: string): Session | null {
  return store.getSessionById(id) ?? null
}

export function createSession(data: Omit<Session, 'id'>): Session {
  const session: Session = { ...data, id: crypto.randomUUID() }
  store.addSession(session)
  return session
}

export function removeSession(id: string): boolean {
  return store.deleteSession(id)
}
