import { Router } from 'express'
import * as controller from '../controllers/stats.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(controller.get))

export default router
