import { Router } from 'express'
import { PermissionController } from '../controllers/index.js'

const permissionController = new PermissionController()

export const permissionRouter: Router = Router()

permissionRouter.post('/', permissionController.add)
permissionRouter.put('/', permissionController.edit)
permissionRouter.delete('/', permissionController.remove)
permissionRouter.get('/', permissionController.findAll)
permissionRouter.get('/:id', permissionController.findOne)
