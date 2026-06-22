import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { DrizzleError, DrizzleQueryError } from 'drizzle-orm'

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (error instanceof ZodError) {
    res.status(422).json({ message: JSON.parse(error.message), status: false })
    return
  }

  if (error instanceof DrizzleError || error instanceof DrizzleQueryError) {
    res.status(500).json({ message: error.message, status: false })
    return
  }

  if (error instanceof Error) {
    res.status(500).json({ message: error.message, status: false })
    return
  }

  res.status(500).json({ message: 'Something went wrong!', state: false })
  return

  next(error)
}
