import { Router } from 'express'
import { SaleTypeController } from '../controllers/index.js'

const saleTypeController = new SaleTypeController()

export const saleTypeRouter: Router = Router()

saleTypeRouter.post('/', saleTypeController.add)
saleTypeRouter.put('/', saleTypeController.edit)
saleTypeRouter.delete('/', saleTypeController.remove)
saleTypeRouter.get('/', saleTypeController.findAll)
saleTypeRouter.get('/:id', saleTypeController.findOne)
