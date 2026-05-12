import type { Request, Response } from 'express'
import * as studyService from '../services/study.js'

export function getAll(_req: Request, res: Response) {
  const items = studyService.listStudyPlan()
  res.json(items)
}

export function create(req: Request, res: Response) {
  const item = studyService.createStudyItem(req.body)
  res.status(201).json(item)
}

export function toggle(req: Request<{ id: string }>, res: Response) {
  const updated = studyService.toggleItem(req.params.id)
  if (!updated) {
    res.status(404).json({ error: 'Elemento de estudio no encontrado' })
    return
  }
  res.json(updated)
}
