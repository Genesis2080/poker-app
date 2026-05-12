import type { Request, Response } from 'express'
import * as sessionsService from '../services/sessions.js'

export function getAll(_req: Request, res: Response) {
  const sessions = sessionsService.listSessions()
  res.json(sessions)
}

export function getById(req: Request<{ id: string }>, res: Response) {
  const session = sessionsService.getSession(req.params.id)
  if (!session) {
    res.status(404).json({ error: 'Sesión no encontrada' })
    return
  }
  res.json(session)
}

export function create(req: Request, res: Response) {
  const session = sessionsService.createSession(req.body)
  res.status(201).json(session)
}

export function remove(req: Request<{ id: string }>, res: Response) {
  const deleted = sessionsService.removeSession(req.params.id)
  if (!deleted) {
    res.status(404).json({ error: 'Sesión no encontrada' })
    return
  }
  res.json({ message: 'Sesión eliminada correctamente' })
}
