/// <reference path="./env.d.ts" />
import dotenv from 'dotenv'
dotenv.config()

const { DATABASE_URL, JWT_SECRET, PORT, NODE_ENV } = process.env
export const env = { DATABASE_URL, JWT_SECRET, PORT, NODE_ENV }
