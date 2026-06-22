import { Router } from 'express'
import { RoleController } from '../controllers/index.js'

const roleController = new RoleController()

export const roleRouter: Router = Router()

roleRouter.post('/', roleController.add)
roleRouter.post('/permission', roleController.addPermissionToRole)
roleRouter.put('/', roleController.edit)
roleRouter.delete('/', roleController.remove)
roleRouter.delete('/permission', roleController.removePermissionToRole)
roleRouter.get('/', roleController.findAll)
roleRouter.get('/:id', roleController.findOne)
roleRouter.get('/:id/permission', roleController.findPermissionsForRole)
