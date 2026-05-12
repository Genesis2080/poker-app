import type { Request, Response, NextFunction } from 'express'
import { createUserClient } from '../lib/supabase.js'

export interface AuthenticatedRequest extends Request {
  userId: string
  token: string
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Se requiere autenticación' })
    return
  }

  const token = authHeader.slice(7)
  const supabase = createUserClient(token)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    res.status(401).json({ error: 'Token inválido o expirado' })
    return
  }

  const authReq = req as AuthenticatedRequest
  authReq.userId = user.id
  authReq.token = token
  next()
}
