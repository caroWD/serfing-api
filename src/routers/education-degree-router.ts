import { Router } from 'express'
import { EducationDegreeController } from '../controllers/index.js'

const educationDegreeController = new EducationDegreeController()

export const educationDegreeRouter: Router = Router()

educationDegreeRouter.post('/', educationDegreeController.add)
educationDegreeRouter.put('/', educationDegreeController.edit)
educationDegreeRouter.delete('/', educationDegreeController.remove)
educationDegreeRouter.get('/', educationDegreeController.findAll)
educationDegreeRouter.get('/:id', educationDegreeController.findOne)
