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

routes.use('/users/permission', permissionRouter)
routes.use('/users/role', roleRouter)

routes.use('/user/collaborator/operators/type', operatorTypeRouter)
routes.use('/user/collaborator/accountants/position', accountantPositionRouter)
routes.use('/user/collaborator/engineers/position', engineerPositionRouter)
routes.use('/user/collaborator/sellers/sale-type', saleTypeRouter)
routes.use('/user/collaborators/contract-type', contractTypeRouter)
routes.use('/user/collaborators/education-degree', educationDegreeRouter)
routes.use('/user/collaborators/business-area', businessAreaRouter)
routes.use('/user/collaborators/hierarchy', hierarchyRouter)
