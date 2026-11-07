import { createAuth } from '@seed/auth'
import { createDb } from '@seed/db'
import type { H3Event } from 'h3'

export function getServiceStatus() {
  const configuredMode = process.env.SEED_MODE || 'demo'
  if (!['demo', 'live'].includes(configuredMode))
    throw createError({
      statusCode: 503,
      statusMessage: 'SEED_MODE musi mieć wartość demo lub live.',
    })
  const mode: 'demo' | 'live' = configuredMode === 'live' ? 'live' : 'demo'
  const databaseConfigured = Boolean(process.env.DATABASE_URL)
  const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
  const authConfigured = Boolean(
    databaseConfigured && process.env.BETTER_AUTH_SECRET && process.env.BETTER_AUTH_URL,
  )
  return { mode, authConfigured, emailConfigured, databaseConfigured }
}

let auth: ReturnType<typeof createAuth> | undefined
let db: ReturnType<typeof createDb> | undefined

export function requireLive() {
  const status = getServiceStatus()
  if (status.mode !== 'live')
    throw createError({
      statusCode: 503,
      statusMessage: 'Tryb demo. Skonfiguruj własne usługi i ustaw SEED_MODE=live.',
    })
  if (
    !status.authConfigured ||
    (process.env.NODE_ENV === 'production' && !status.emailConfigured)
  ) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Brak konfiguracji usług. Sprawdź pnpm env:check --live.',
    })
  }
}

export function getAuth() {
  requireLive()
  auth ??= createAuth({
    databaseUrl: process.env.DATABASE_URL!,
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL!,
    trustedOrigins: (process.env.TRUSTED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    mobileScheme: process.env.MOBILE_SCHEME || 'nuxt-expo-seed',
    resendApiKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM,
    production: process.env.NODE_ENV === 'production',
  })
  return auth
}

export function getDb() {
  requireLive()
  db ??= createDb(process.env.DATABASE_URL!)
  return db
}

export async function requireUser(event: H3Event) {
  const session = await getAuth().api.getSession({ headers: toWebRequest(event).headers })
  if (!session)
    throw createError({ statusCode: 401, statusMessage: 'Zaloguj się, aby uzyskać dostęp.' })
  return session.user
}
