import { Router } from 'express'
import { UserController } from '../controllers/index.js'
import { authAdminMiddleware, authMiddleware } from '../middlewares/index.js'

const userController = new UserController()

export const userRouter: Router = Router()

userRouter.post('/login', userController.auth)

userRouter.use(authMiddleware)

userRouter.patch('/', userController.changePassword)
userRouter.patch('/remove', userController.softRemove)

userRouter.use(authAdminMiddleware)

userRouter.post('/', userController.add)
userRouter.put('/', userController.edit)
userRouter.delete('/', userController.remove)
userRouter.get('/', userController.findAll)
userRouter.get('/:id', userController.findOne)
