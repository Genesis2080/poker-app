import { Router } from 'express'
import * as controller from '../controllers/study.js'
import { validate, createStudySchema } from '../middleware/validation.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(controller.getAll))
router.post('/', validate(createStudySchema), asyncHandler(controller.create))
router.patch('/:id/toggle', asyncHandler(controller.toggle))

export default router
