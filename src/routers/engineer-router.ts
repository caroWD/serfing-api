import { Router } from 'express'
import { EngineerController } from '../controllers/index.js'

const engineerController = new EngineerController()

export const engineerRouter: Router = Router()

engineerRouter.post('/', engineerController.add)
engineerRouter.put('/', engineerController.edit)
engineerRouter.delete('/', engineerController.remove)
engineerRouter.get('/', engineerController.findAll)
engineerRouter.get('/:id', engineerController.findOne)
