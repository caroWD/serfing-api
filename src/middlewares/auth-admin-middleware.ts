import type { RequestHandler } from 'express'
import { UserUnauthorizedError } from '../models/User.js'
import { RoleService } from '../services/index.js'

const roleService = new RoleService()

export const authAdminMiddleware: RequestHandler = async (req, _, next) => {
  const { auth } = req.session

  if (!auth) throw new UserUnauthorizedError('Usuario no autorizado')

  const role = await roleService.findOne({ id: auth['roleId'] as string })

  if (role.name !== 'system:admin')
    throw new UserUnauthorizedError('Usuario no autorizado')

  next()
}
