import { Router } from 'express'
import { permissionRouter } from './permission-router.js'
import { roleRouter } from './role-router.js'
import { operatorTypeRouter } from './operator-type-router.js'
import { accountantPositionRouter } from './accountant-position-router.js'

export const routes: Router = Router()

routes.use('/permission', permissionRouter)
routes.use('/role', roleRouter)
routes.use('/operator/type', operatorTypeRouter)
routes.use('/accountant/position', accountantPositionRouter)
