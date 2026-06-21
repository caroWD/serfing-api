import { Router } from 'express'
import { EngineerPositionController } from '../controllers/index.js'

const engineerPositionController = new EngineerPositionController()

export const engineerPositionRouter: Router = Router()

engineerPositionRouter.post('/', engineerPositionController.add)
engineerPositionRouter.put('/', engineerPositionController.edit)
engineerPositionRouter.delete('/', engineerPositionController.remove)
engineerPositionRouter.get('/', engineerPositionController.findAll)
engineerPositionRouter.get('/:id', engineerPositionController.findOne)
