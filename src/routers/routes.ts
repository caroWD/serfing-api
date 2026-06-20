import { Router } from 'express'
import { permissionRouter } from './permission-router.js'
import { roleRouter } from './role-router.js'

export const routes: Router = Router()

routes.use('/permission', permissionRouter)
routes.use('/role', roleRouter)
