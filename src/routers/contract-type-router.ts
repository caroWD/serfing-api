import { Router } from 'express'
import { ContractTypeController } from '../controllers/index.js'

const contracTypeController = new ContractTypeController()

export const contractTypeRouter: Router = Router()

contractTypeRouter.post('/', contracTypeController.add)
contractTypeRouter.put('/', contracTypeController.edit)
contractTypeRouter.delete('/', contracTypeController.remove)
contractTypeRouter.get('/', contracTypeController.findAll)
contractTypeRouter.get('/:id', contracTypeController.findOne)
