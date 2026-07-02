import { Router } from 'express'
import { CollaboratorController } from '../controllers/index.js'

const collaboratorController = new CollaboratorController()

export const collaboratorRouter: Router = Router()

collaboratorRouter.post('/', collaboratorController.add)
collaboratorRouter.put('/', collaboratorController.edit)
collaboratorRouter.delete('/', collaboratorController.remove)
collaboratorRouter.get('/', collaboratorController.findAll)
collaboratorRouter.get('/:id', collaboratorController.findOne)
