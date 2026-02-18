import { Router } from 'express'
import { cryptoController } from '../controllers/crypto.controller'

const router = Router()

router.get('/', cryptoController.getAll)
router.post('/', cryptoController.create)
router.get('/:id/history', cryptoController.getHistory)

export default router