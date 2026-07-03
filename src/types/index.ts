import type { JWTPayload } from 'jose'

declare module 'express-session' {
  interface SessionData {
    auth: JWTPayload | null
  }
}

export type BaseResponse = {
  message: string
  state: boolean
}
