import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db as DBConnection } from '../db'
import { roles, userRoles, users } from '../db/schema'
import { env } from '../../env'

type AuthPayload = {
  email: string
  password: string
}
type CustomJWTClaims = { email: string; id: string; role: string }
function validateJWT(token: string) {
  const payload = jwt.verify(token, env.JWT_SECRET)
  if (typeof payload === 'string' || !('email' in payload)) throw 'unauthorized'
  return payload as jwt.JwtPayload & CustomJWTClaims
}

export default function shortenRouter(db: typeof DBConnection) {
  const router = express.Router()

  router.post('/register', async (req: Request<{}, {}, AuthPayload>, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'missing registration fields' })

    const existing = await db.select().from(users).where(eq(users.email, email))

    if (existing.length > 0) return res.status(409).json({ error: 'user already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const [user] = await db
      .insert(users)
      .values({
        email,
        hashedPassword,
      })
      .returning()
    const [role] = await db.select().from(roles).where(eq(roles.name, 'user'))

    await db.insert(userRoles).values({ userId: user.id, roleId: role.id })

    res.status(201).json({ success: true })
  })

  router.post('/login', async (req: Request<{}, {}, AuthPayload>, res) => {
    const { email, password } = req.body
    const query = await db.select().from(users).where(eq(users.email, email))

    if (query.length === 0) return res.status(401).json({ error: 'invalid credentials' })
    const [user] = query
    const valid = await bcrypt.compare(password, user.hashedPassword)
    if (!valid) return res.status(401).json({ error: 'invalid credentials' })
    const [role] = await db.select().from(userRoles).where(eq(userRoles.userId, user.id))

    const token = jwt.sign({ id: user.id, email: user.email, role: role.roleId }, env.JWT_SECRET, {
      expiresIn: '1h',
    })
    res.json({ token })
  })
  return router
}
// Middleware
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'unauthorized' })

  const token = authHeader.split(' ')[1]
  try {
    const payload = validateJWT(token)

    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'unauthorized' })
  }
}
