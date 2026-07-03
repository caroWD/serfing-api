import { Router } from 'express'
import { BusinessAreaController } from '../controllers/index.js'

const businessAreaController = new BusinessAreaController()

export const businessAreaRouter: Router = Router()

businessAreaRouter.post('/', businessAreaController.add)
businessAreaRouter.put('/', businessAreaController.edit)
businessAreaRouter.delete('/', businessAreaController.remove)
businessAreaRouter.get('/', businessAreaController.findAll)
businessAreaRouter.get('/:id', businessAreaController.findOne)
