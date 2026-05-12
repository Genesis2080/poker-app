import { Router } from 'express'
import * as controller from '../controllers/sessions.js'
import { validate, createSessionSchema } from '../middleware/validation.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(controller.getAll))
router.get('/:id', asyncHandler(controller.getById))
router.post('/', validate(createSessionSchema), asyncHandler(controller.create))
router.delete('/:id', asyncHandler(controller.remove))

export default router
