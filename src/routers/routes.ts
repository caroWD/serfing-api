import { Router } from 'express'
import { permissionRouter } from './permission-router.js'
import { roleRouter } from './role-router.js'
import { operatorTypeRouter } from './operator-type-router.js'
import { accountantPositionRouter } from './accountant-position-router.js'
import { engineerPositionRouter } from './engineer-position-router.js'
import { saleTypeRouter } from './sale-type-router.js'
import { contractTypeRouter } from './contract-type-router.js'
import { educationDegreeRouter } from './education-degree-router.js'
import { businessAreaRouter } from './business-area-router.js'
import { hierarchyRouter } from './hierarchy-router.js'
import { userRouter } from './user-router.js'

export const routes: Router = Router()

routes.use('/user', userRouter)

routes.use('/permission', permissionRouter)
routes.use('/role', roleRouter)

routes.use('/user/collaborator/operator/type', operatorTypeRouter)
routes.use('/user/collaborator/accountant/position', accountantPositionRouter)
routes.use('/user/collaborator/engineer/position', engineerPositionRouter)
routes.use('/user/collaborator/seller/sale-type', saleTypeRouter)
routes.use('/user/collaborator/contract-type', contractTypeRouter)
routes.use('/user/collaborator/education-degree', educationDegreeRouter)
routes.use('/user/collaborator/business-area', businessAreaRouter)
routes.use('/user/collaborator/hierarchy', hierarchyRouter)
