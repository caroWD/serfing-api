import { Router } from 'express'
import { OperatorTypeController } from '../controllers/index.js'

const operatorTypeController = new OperatorTypeController()

export const operatorTypeRouter: Router = Router()

operatorTypeRouter.post('/', operatorTypeController.add)
operatorTypeRouter.put('/', operatorTypeController.edit)
operatorTypeRouter.delete('/', operatorTypeController.remove)
operatorTypeRouter.get('/', operatorTypeController.findAll)
operatorTypeRouter.get('/:id', operatorTypeController.findOne)
