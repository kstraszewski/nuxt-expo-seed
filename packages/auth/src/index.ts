import { expo } from '@better-auth/expo'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { createDb, schema, type Database } from '@seed/db'
import { createMailer } from '@seed/email'

export interface AuthOptions {
  databaseUrl: string
  secret: string
  baseURL: string
  trustedOrigins?: string[]
  mobileScheme?: string
  resendApiKey?: string
  emailFrom?: string
  production?: boolean
  appName?: string
  /** Optional Postgres adapter injection for isolated tests. Never take this from a request body. */
  database?: Database
}

export function validateAuthOptions(options: AuthOptions) {
  if (!options.databaseUrl) throw new Error('DATABASE_URL is required for live authentication.')
  if (options.secret.length < 32)
    throw new Error('BETTER_AUTH_SECRET must contain at least 32 characters.')
  const baseURL = new URL(options.baseURL)
  if (
    !['https:', 'http:'].includes(baseURL.protocol) ||
    baseURL.username ||
    baseURL.password ||
    baseURL.search ||
    baseURL.hash
  ) {
    throw new Error(
      'BETTER_AUTH_URL must be an HTTP(S) origin without credentials, query or fragment.',
    )
  }
  if (baseURL.pathname !== '/')
    throw new Error('BETTER_AUTH_URL must be an origin. Auth is mounted at /api/auth.')
  if (options.production && baseURL.protocol !== 'https:')
    throw new Error('Production authentication requires an HTTPS BETTER_AUTH_URL.')
  if (Boolean(options.resendApiKey) !== Boolean(options.emailFrom))
    throw new Error('Configure both RESEND_API_KEY and EMAIL_FROM, or neither.')
  if (options.production && (!options.resendApiKey || !options.emailFrom))
    throw new Error('Production authentication requires Resend and a verified EMAIL_FROM.')
  const mobileScheme = options.mobileScheme ?? 'nuxt-expo-seed'
  if (
    !/^[a-z][a-z0-9+.-]*$/.test(mobileScheme) ||
    ['http', 'https', 'exp'].includes(mobileScheme)
  ) {
    throw new Error('MOBILE_SCHEME must be a dedicated application URL scheme.')
  }
  const origins = options.trustedOrigins ?? []
  for (const origin of origins) {
    const url = new URL(origin)
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      origin !== url.origin ||
      origin.includes('*')
    ) {
      throw new Error(
        'TRUSTED_ORIGINS must contain exact HTTP(S) origins, without paths or wildcards.',
      )
    }
    if (options.production && url.protocol !== 'https:')
      throw new Error('Production trusted origins must use HTTPS.')
  }
  return { baseURL: baseURL.origin, mobileScheme, origins }
}

/** Call once lazily from server code. No auth instance or DB connection is created during import. */
export function createAuth(options: AuthOptions) {
  const { baseURL, mobileScheme, origins } = validateAuthOptions(options)
  const db = options.database ?? createDb(options.databaseUrl)
  const mailer =
    options.resendApiKey && options.emailFrom
      ? createMailer({
          apiKey: options.resendApiKey,
          from: options.emailFrom,
          appName: options.appName,
        })
      : undefined

  return betterAuth({
    appName: options.appName ?? 'Seed',
    baseURL,
    basePath: '/api/auth',
    secret: options.secret,
    database: drizzleAdapter(db, { provider: 'pg', schema, transaction: false }),
    trustedOrigins: [
      baseURL,
      ...origins,
      `${mobileScheme}://`,
      ...(!options.production ? ['exp://**'] : []),
    ],
    plugins: [expo()],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      requireEmailVerification: Boolean(mailer),
      revokeSessionsOnPasswordReset: true,
      ...(mailer
        ? {
            sendResetPassword: async ({ user, url, token }) => {
              await mailer.sendPasswordReset({ to: user.email, name: user.name, url, token })
            },
          }
        : {}),
    },
    ...(mailer
      ? {
          emailVerification: {
            sendOnSignUp: true,
            sendOnSignIn: true,
            autoSignInAfterVerification: true,
            sendVerificationEmail: async ({
              user,
              url,
              token,
            }: {
              user: { email: string; name: string }
              url: string
              token: string
            }) => {
              await mailer.sendVerification({ to: user.email, name: user.name, url, token })
            },
          },
        }
      : {}),
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    rateLimit: {
      enabled: true,
      storage: 'database',
      window: 60,
      max: 100,
      customRules: {
        '/sign-in/email': { window: 60, max: 5 },
        '/sign-up/email': { window: 60, max: 5 },
        '/request-password-reset': { window: 60, max: 3 },
      },
    },
    advanced: {
      cookiePrefix: 'seed',
      useSecureCookies: Boolean(options.production),
      // Vercel overwrites this header. Revisit the header when deploying behind another proxy.
      ipAddress: { ipAddressHeaders: options.production ? ['x-vercel-forwarded-for'] : [] },
    },
  })
}

export type Auth = ReturnType<typeof createAuth>
