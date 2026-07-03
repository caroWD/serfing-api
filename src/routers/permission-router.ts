import { Router } from 'express'
import { PermissionController } from '../controllers/index.js'
import { authAdminMiddleware } from '../middlewares/index.js'

const permissionController = new PermissionController()

export const permissionRouter: Router = Router()

permissionRouter.use(authAdminMiddleware)

permissionRouter.post('/', permissionController.add)
permissionRouter.put('/', permissionController.edit)
permissionRouter.delete('/', permissionController.remove)
permissionRouter.get('/', permissionController.findAll)
permissionRouter.get('/:id', permissionController.findOne)
