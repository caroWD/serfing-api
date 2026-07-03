import { Router } from 'express'
import { AccountantController } from '../controllers/index.js'

const accountantController = new AccountantController()

export const accountantRouter: Router = Router()

accountantRouter.post('/', accountantController.add)
accountantRouter.put('/', accountantController.edit)
accountantRouter.delete('/', accountantController.remove)
accountantRouter.get('/', accountantController.findAll)
accountantRouter.get('/:id', accountantController.findOne)
