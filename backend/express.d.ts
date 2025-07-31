// @types/express/index.d.ts

import * as express from 'express'

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

type AuthenticatedUser = {
  id: string
  email: string
  role: string
}
