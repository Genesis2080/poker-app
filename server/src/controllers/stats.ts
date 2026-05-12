import type { Request, Response } from 'express'
import * as statsService from '../services/stats.js'
import { createUserClient } from '../lib/supabase.js'

export async function get(req: Request, res: Response) {
  const token = (req as unknown as { token: string }).token
  const stats = await statsService.computeStats(createUserClient(token))
  res.json(stats)
}
