import express from 'express'
import cookieParser from 'cookie-parser'
import { PORT } from './config/index.js'
import { corsMiddleware, errorHandlerMiddleware } from './middlewares/index.js'
import { routes } from './routers/index.js'

const api = express()

api.use(express.json())
api.use(corsMiddleware())
api.use(cookieParser())

api.use('/api/v01', routes)

api.use(errorHandlerMiddleware)

api.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
)
