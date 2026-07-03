import type { RequestHandler } from 'express'
import { jwtVerify } from 'jose'
import { JWT_SECRET } from '../config/index.js'

export const tokenMiddleware: RequestHandler = async (req, _, next) => {
  const token = req.cookies.access_token as string

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )

    req.session.auth = payload
  } catch {
    req.session.auth = null
  }

  next()
}
