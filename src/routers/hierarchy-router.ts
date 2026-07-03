import { Router } from 'express'
import { HierarchyController } from '../controllers/index.js'

const hierarchyController = new HierarchyController()

export const hierarchyRouter: Router = Router()

hierarchyRouter.post('/', hierarchyController.add)
hierarchyRouter.put('/', hierarchyController.edit)
hierarchyRouter.delete('/', hierarchyController.remove)
hierarchyRouter.get('/', hierarchyController.findAll)
hierarchyRouter.get('/:id', hierarchyController.findOne)
