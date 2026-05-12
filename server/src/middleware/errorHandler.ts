import type { Request, Response, NextFunction } from 'express'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Error]', err)
  const message = process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : err.message
  res.status(500).json({ error: message })
}
