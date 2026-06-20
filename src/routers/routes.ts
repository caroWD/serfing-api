import { Router } from 'express'
import { permissionRouter } from './permission-router.js'

export const routes: Router = Router()

routes.use('/permission', permissionRouter)
