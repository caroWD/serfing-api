import { Router } from 'express'
import { RoleController } from '../controllers/index.js'
import { authAdminMiddleware } from '../middlewares/index.js'

const roleController = new RoleController()

export const roleRouter: Router = Router()

roleRouter.use(authAdminMiddleware)

roleRouter.post('/', roleController.add)
roleRouter.post('/permission', roleController.addPermissionToRole)
roleRouter.put('/', roleController.edit)
roleRouter.delete('/', roleController.remove)
roleRouter.delete('/permission', roleController.removePermissionToRole)
roleRouter.get('/', roleController.findAll)
roleRouter.get('/:id', roleController.findOne)
roleRouter.get('/:id/permission', roleController.findPermissionsForRole)
