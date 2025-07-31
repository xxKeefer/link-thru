import dotenv from 'dotenv'
import express from 'express'
import shortenRouter from './api/shorten'
import redirectRouter from './api/redirect'
import authRouter, { authMiddleware } from './api/auth'
import { db } from './db'
import path from 'path'
import { env } from '../env'

dotenv.config({ path: '../.env' })
const staticPath = path.resolve('frontend/dist')

async function main() {
  const app = express()

  app.use(express.json())
  app.use(express.static(staticPath))
  app.use('/auth', authRouter(db))
  app.use('/shorten', authMiddleware, shortenRouter(db))
  app.use('/r', redirectRouter(db))

  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'))
  })

  app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`)
  })
}

main()
