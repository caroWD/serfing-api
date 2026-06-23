import { Router } from 'express'
import { UserController } from '../controllers/index.js'

const userController = new UserController()

export const userRouter: Router = Router()

userRouter.post('/', userController.add)
userRouter.post('/login', userController.auth)
userRouter.put('/', userController.edit)
userRouter.patch('/', userController.changePassword)
userRouter.patch('/remove', userController.softRemove)
userRouter.delete('/', userController.remove)
userRouter.get('/', userController.findAll)
userRouter.get('/:id', userController.findOne)
