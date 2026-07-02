import { Router } from 'express'
import { SellerController } from '../controllers/index.js'

const sellerController = new SellerController()

export const sellerRouter: Router = Router()

sellerRouter.post('/', sellerController.add)
sellerRouter.put('/', sellerController.edit)
sellerRouter.delete('/', sellerController.remove)
sellerRouter.get('/', sellerController.findAll)
sellerRouter.get('/:id', sellerController.findOne)
