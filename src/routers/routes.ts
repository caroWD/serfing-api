import { Router } from 'express'
import { permissionRouter } from './permission-router.js'
import { roleRouter } from './role-router.js'
import { operatorTypeRouter } from './operator-type-router.js'
import { accountantPositionRouter } from './accountant-position-router.js'
import { engineerPositionRouter } from './engineer-position-router.js'
import { saleTypeRouter } from './sale-type-router.js'
import { contractTypeRouter } from './contract-type-router.js'

export const routes: Router = Router()

routes.use('/user/permission', permissionRouter)
routes.use('/user/role', roleRouter)

routes.use('/user/collaborator/operator/type', operatorTypeRouter)
routes.use('/user/collaborator/accountant/position', accountantPositionRouter)
routes.use('/user/collaborator/engineer/position', engineerPositionRouter)
routes.use('/user/collaborator/seller/type', saleTypeRouter)
routes.use('/user/collaborator/contract-type', contractTypeRouter)
