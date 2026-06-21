import { Router } from 'express'
import { AccountantPositionController } from '../controllers/index.js'

const accountantPositionController = new AccountantPositionController()

export const accountantPositionRouter: Router = Router()

accountantPositionRouter.post('/', accountantPositionController.add)
accountantPositionRouter.put('/', accountantPositionController.edit)
accountantPositionRouter.delete('/', accountantPositionController.remove)
accountantPositionRouter.get('/', accountantPositionController.findAll)
accountantPositionRouter.get('/:id', accountantPositionController.findOne)
