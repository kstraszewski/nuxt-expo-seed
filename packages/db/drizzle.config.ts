import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '../../apps/crm/.env', quiet: true })

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  // Generation is offline. Studio requires the direct URL, supplied by the caller.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? '' },
  strict: true,
})
