import { Router } from 'express'
import * as controller from '../controllers/sessions.js'
import { validate, createSessionSchema } from '../middleware/validation.js'

const router = Router()

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', validate(createSessionSchema), controller.create)
router.delete('/:id', controller.remove)

export default router
