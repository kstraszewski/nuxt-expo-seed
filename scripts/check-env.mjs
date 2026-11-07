import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function parseEnv(content) {
  const values = {}
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)?$/)
    if (!match) continue
    let value = (match[2] ?? '').trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    } else value = value.replace(/\s+#.*$/, '').trim()
    values[match[1]] = value
  }
  return values
}

function isHttpUrl(value, { httpsOnly = false, originOnly = true } = {}) {
  try {
    const url = new URL(value)
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      (!httpsOnly || url.protocol === 'https:') &&
      (!originOnly || value.replace(/\/$/, '') === url.origin) &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}

function isDatabaseUrl(value) {
  try {
    const url = new URL(value)
    return (
      ['postgres:', 'postgresql:'].includes(url.protocol) &&
      !!url.hostname &&
      !!url.pathname.slice(1) &&
      !/example|placeholder|your[-_]/i.test(url.hostname)
    )
  } catch {
    return false
  }
}

export function checkEnvironment(root = workspaceRoot, { live = false, env = process.env } = {}) {
  const errors = []
  const warnings = []
  const config = {}
  for (const app of ['landing', 'crm', 'mobile']) {
    const target = resolve(root, 'apps', app, '.env')
    if (!existsSync(target)) errors.push(`Brak apps/${app}/.env. Uruchom pnpm setup:env.`)
    config[app] = { ...(existsSync(target) ? parseEnv(readFileSync(target, 'utf8')) : {}), ...env }
  }

  const crm = config.crm
  const mode = live ? 'live' : crm.SEED_MODE || 'demo'
  if (!['demo', 'live'].includes(mode))
    errors.push('CRM: SEED_MODE musi mieć wartość demo albo live.')

  for (const [app, keys] of Object.entries({
    landing: ['NUXT_PUBLIC_CRM_URL', 'NUXT_PUBLIC_MOBILE_URL'],
    crm: ['BETTER_AUTH_URL', 'NUXT_PUBLIC_LANDING_URL'],
    mobile: ['EXPO_PUBLIC_API_URL'],
  })) {
    for (const key of keys) {
      const value = config[app][key]
      if (value && !isHttpUrl(value))
        errors.push(`${app}: ${key} musi być pełnym originem HTTP(S), bez ścieżki.`)
    }
  }

  if (mode === 'live') {
    const required = [
      'DATABASE_URL',
      'BETTER_AUTH_SECRET',
      'BETTER_AUTH_URL',
      'TRUSTED_ORIGINS',
      'MOBILE_SCHEME',
      'RESEND_API_KEY',
      'EMAIL_FROM',
    ]
    for (const key of required) if (!crm[key]) errors.push(`CRM: brak ${key} dla trybu live.`)
    if (crm.DATABASE_URL && !isDatabaseUrl(crm.DATABASE_URL))
      errors.push('CRM: DATABASE_URL musi wskazywać rzeczywistą bazę PostgreSQL.')
    if (crm.DATABASE_URL_UNPOOLED && !isDatabaseUrl(crm.DATABASE_URL_UNPOOLED))
      errors.push('CRM: niepoprawny DATABASE_URL_UNPOOLED.')
    if (!crm.DATABASE_URL_UNPOOLED)
      warnings.push('CRM: ustaw DATABASE_URL_UNPOOLED przed db:migrate.')
    if (
      crm.BETTER_AUTH_SECRET &&
      (crm.BETTER_AUTH_SECRET.length < 32 ||
        /change.?me|replace.?me|your.secret|example/i.test(crm.BETTER_AUTH_SECRET))
    ) {
      errors.push(
        'CRM: BETTER_AUTH_SECRET wymaga co najmniej 32 znaków i własnej losowej wartości.',
      )
    }
    if (
      crm.MOBILE_SCHEME &&
      (!/^[a-z][a-z0-9+.-]*$/.test(crm.MOBILE_SCHEME) ||
        ['http', 'https', 'exp'].includes(crm.MOBILE_SCHEME))
    )
      errors.push('CRM: MOBILE_SCHEME wymaga własnego schematu aplikacji, bez ://.')
    if (crm.RESEND_API_KEY && !crm.RESEND_API_KEY.startsWith('re_'))
      errors.push('CRM: RESEND_API_KEY ma niepoprawny format.')
    if (crm.EMAIL_FROM && !/^[^<>\r\n]*<?[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+>?$/.test(crm.EMAIL_FROM))
      errors.push('CRM: EMAIL_FROM musi zawierać adres nadawcy.')
    const origins = (crm.TRUSTED_ORIGINS || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
    const production = env.NODE_ENV === 'production' || env.VERCEL_ENV === 'production'
    for (const origin of origins) {
      if (
        !isHttpUrl(origin, { httpsOnly: production }) ||
        origin !== new URL(origin).origin ||
        origin.includes('*')
      )
        errors.push(
          'CRM: TRUSTED_ORIGINS wymaga dokładnych originów HTTP(S), bez ścieżek. Na produkcji użyj HTTPS.',
        )
    }
    if (production && !isHttpUrl(crm.BETTER_AUTH_URL, { httpsOnly: true }))
      errors.push('CRM: produkcyjny BETTER_AUTH_URL wymaga HTTPS.')
  } else if (mode === 'demo') {
    warnings.push(
      'Tryb demo. Sprawdzenie nie potwierdza połączenia z Neon, działania sesji ani wysyłki Resend.',
    )
  }

  return { mode, errors, warnings }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkEnvironment(workspaceRoot, { live: process.argv.includes('--live') })
  for (const warning of result.warnings) console.log(`Info: ${warning}`)
  for (const error of result.errors) console.error(error)
  if (result.errors.length) process.exitCode = 1
  else
    console.log(
      `Konfiguracja ${result.mode}: wymagane nazwy i formaty są poprawne. Wartości sekretów ukryte.`,
    )
}
