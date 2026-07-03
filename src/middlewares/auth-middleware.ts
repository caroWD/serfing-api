import type { RequestHandler } from 'express'
import { UserUnauthorizedError } from '../models/index.js'

export const authMiddleware: RequestHandler = async (req, _, next) => {
  const { auth } = req.session

  if (!auth) throw new UserUnauthorizedError('Usuario no autorizado')

  next()
}
