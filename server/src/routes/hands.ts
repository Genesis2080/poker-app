import { Router } from 'express'
import * as controller from '../controllers/hands.js'
import {
  validate,
  createHandSchema,
  updateHandSchema,
} from '../middleware/validation.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(controller.getAll))
router.get('/:id', asyncHandler(controller.getById))
router.post('/', validate(createHandSchema), asyncHandler(controller.create))
router.patch('/:id', validate(updateHandSchema), asyncHandler(controller.patch))
router.delete('/:id', asyncHandler(controller.remove))

export default router
