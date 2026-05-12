import { Router } from 'express'
import * as controller from '../controllers/study.js'
import { validate, createStudySchema } from '../middleware/validation.js'

const router = Router()

router.get('/', controller.getAll)
router.post('/', validate(createStudySchema), controller.create)
router.patch('/:id/toggle', controller.toggle)

export default router
