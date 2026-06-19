import express from 'express'
import cookieParser from 'cookie-parser'
import { PORT } from './config/index.js'
import { corsMiddleware, errorHandlerMiddleware } from './middlewares/index.js'

const api = express()

api.use(express.json())
api.use(corsMiddleware())
api.use(cookieParser())

api.get('/', (_, res) => res.send('Hello world!'))

api.use(errorHandlerMiddleware)

api.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
)
