import { Router } from 'express'
import { OperatorController } from '../controllers/index.js'

const operatorController = new OperatorController()

export const operatorRouter: Router = Router()

operatorRouter.post('/', operatorController.add)
operatorRouter.put('/', operatorController.edit)
operatorRouter.delete('/', operatorController.remove)
operatorRouter.get('/', operatorController.findAll)
operatorRouter.get('/:id', operatorController.findOne)
