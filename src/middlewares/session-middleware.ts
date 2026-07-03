import session from 'express-session'
import { JWT_SECRET } from '../config/index.js'
import type { RequestHandler } from 'express'

export const sessionMiddleware = (): RequestHandler =>
  session({
    secret: new TextEncoder().encode(JWT_SECRET),
    resave: false,
    saveUninitialized: true,
  })
