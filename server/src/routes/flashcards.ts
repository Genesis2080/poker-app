import { Router } from 'express'
import * as controller from '../controllers/flashcards.js'
import {
  validate,
  createFlashcardSchema,
  updateFlashcardSchema,
} from '../middleware/validation.js'

const router = Router()

router.get('/', controller.getAll)
router.post('/', validate(createFlashcardSchema), controller.create)
router.patch('/:id', validate(updateFlashcardSchema), controller.patch)

export default router
