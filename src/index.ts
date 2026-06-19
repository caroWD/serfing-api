import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { PORT } from './config/index.js'

const api = express()

api.use(express.json())
api.use(cors())
api.use(cookieParser())

api.get('/', (_, res) => res.send('Hello world!'))

api.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
)
