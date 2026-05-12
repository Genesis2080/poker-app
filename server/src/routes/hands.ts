import { Router } from 'express'
import * as controller from '../controllers/hands.js'
import {
  validate,
  createHandSchema,
  updateHandSchema,
} from '../middleware/validation.js'

const router = Router()

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', validate(createHandSchema), controller.create)
router.patch('/:id', validate(updateHandSchema), controller.patch)
router.delete('/:id', controller.remove)

export default router
