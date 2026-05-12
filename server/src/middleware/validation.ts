import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export const createSessionSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  modality: z.enum(['cash', 'tournament', 'spins']),
  tournamentName: z.string().optional(),
  buyIn: z.number().positive('El buy-in debe ser positivo'),
  cashOut: z.number().min(0, 'El cash-out no puede ser negativo'),
  timePlayedMinutes: z.number().int().positive('El tiempo debe ser positivo'),
  notes: z.string().optional(),
})

export const createHandSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  position: z.string().min(1, 'La posición es requerida'),
  result: z.enum(['win', 'loss', 'even']),
  heroHand: z.string().min(1, 'Las cartas son requeridas'),
  villainRange: z.union([z.string(), z.array(z.string())]).default(''),
  preflopAction: z.string().default(''),
  street: z.string().default('preflop'),
  board: z.string().default(''),
  notes: z.string().default(''),
  tags: z.array(z.string()).default([]),
  heroName: z.string().default('Hero'),
  heroStack: z.number().default(0),
  potSize: z.number().default(0),
  potWon: z.number().default(0),
  stakes: z.string().default(''),
  tableName: z.string().default(''),
  tableFormat: z.string().default('6-max'),
  gameType: z.string().default('cash'),
})

export const updateHandSchema = z.object({
  date: z.string().optional(),
  position: z.string().optional(),
  result: z.enum(['win', 'loss', 'even']).optional(),
  heroHand: z.string().optional(),
  villainRange: z.union([z.string(), z.array(z.string())]).optional(),
  preflopAction: z.string().optional(),
  street: z.string().optional(),
  board: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  heroName: z.string().optional(),
  heroStack: z.number().optional(),
  potSize: z.number().optional(),
  potWon: z.number().optional(),
  stakes: z.string().optional(),
  tableName: z.string().optional(),
  tableFormat: z.string().optional(),
  gameType: z.string().optional(),
})

export const createStudySchema = z.object({
  topic: z.string().min(1, 'El tema es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  street: z.enum(['preflop', 'flop', 'turn', 'river', 'general']),
  category: z.string().min(1, 'La categoría es requerida'),
  priority: z.enum(['high', 'medium', 'low']),
})

export const createFlashcardSchema = z.object({
  question: z.string().min(1, 'La pregunta es requerida'),
  answer: z.string().min(1, 'La respuesta es requerida'),
  category: z.string().min(1, 'La categoría es requerida'),
  difficulty: z.number().int().min(1).max(5),
  interval: z.number().default(0),
  easeFactor: z.number().default(2.5),
  nextReview: z.number().default(() => Date.now()),
  reviews: z.number().default(0),
})

export const updateFlashcardSchema = z.object({
  question: z.string().optional(),
  answer: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  interval: z.number().optional(),
  easeFactor: z.number().optional(),
  nextReview: z.number().optional(),
  reviews: z.number().optional(),
})

export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({
        error: 'Error de validación',
        details: result.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      })
      return
    }
    req.body = result.data
    next()
  }
}
