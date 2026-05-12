import { Router } from 'express'
import * as controller from '../controllers/flashcards.js'
import {
  validate,
  createFlashcardSchema,
  updateFlashcardSchema,
} from '../middleware/validation.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(controller.getAll))
router.post('/', validate(createFlashcardSchema), asyncHandler(controller.create))
router.patch('/:id', validate(updateFlashcardSchema), asyncHandler(controller.patch))

export default router
