import type { Request, Response } from 'express'
import * as statsService from '../services/stats.js'

export function get(_req: Request, res: Response) {
  const stats = statsService.computeStats()
  res.json(stats)
}
