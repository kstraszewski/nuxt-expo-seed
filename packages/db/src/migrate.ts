import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

config({ path: fileURLToPath(new URL('../../../apps/crm/.env', import.meta.url)), quiet: true })

const url = process.env.DATABASE_URL_UNPOOLED
if (!url)
  throw new Error('Set DATABASE_URL_UNPOOLED to the direct Neon URL before running migrations.')
const parsed = new URL(url)
if (parsed.hostname.includes('-pooler.'))
  throw new Error('Migrations require the direct Neon URL, without -pooler in its hostname.')

const migrationsFolder = fileURLToPath(new URL('../drizzle/', import.meta.url))
await migrate(drizzle(url), { migrationsFolder })
console.info('Database migrations applied.')
