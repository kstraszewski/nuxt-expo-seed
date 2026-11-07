import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function setupEnvironment(root = workspaceRoot) {
  const created = []
  const preserved = []

  for (const app of ['landing', 'crm', 'mobile']) {
    const folder = resolve(root, 'apps', app)
    const template = resolve(folder, '.env.example')
    const target = resolve(folder, '.env')
    if (!existsSync(template)) throw new Error(`Brak szablonu apps/${app}/.env.example`)
    if (existsSync(target)) {
      preserved.push(`apps/${app}/.env`)
      continue
    }

    let content = readFileSync(template, 'utf8')
    if (app === 'crm') {
      const secret = randomBytes(48).toString('base64url')
      if (!/^BETTER_AUTH_SECRET=.*$/m.test(content)) {
        throw new Error('Szablon CRM nie zawiera BETTER_AUTH_SECRET')
      }
      content = content.replace(/^BETTER_AUTH_SECRET=.*$/m, `BETTER_AUTH_SECRET=${secret}`)
    }
    mkdirSync(folder, { recursive: true })
    writeFileSync(target, content, { flag: 'wx', mode: 0o600 })
    created.push(`apps/${app}/.env`)
  }

  return { created, preserved }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = setupEnvironment()
    for (const path of result.created) console.log(`Utworzono ${path}`)
    for (const path of result.preserved) console.log(`Zachowano istniejący ${path}`)
    console.log('Sekrety nie zostały wyświetlone. Uruchom pnpm env:check.')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
