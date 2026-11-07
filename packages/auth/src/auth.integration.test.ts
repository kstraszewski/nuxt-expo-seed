import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { schema, type Database } from '@seed/db'
import { createAuth } from './index'

test('Better Auth signup, password checks and session revocation use the committed Postgres schema', async () => {
  const client = new PGlite()
  await client.exec(
    await readFile(new URL('../../db/drizzle/0000_initial.sql', import.meta.url), 'utf8'),
  )
  const auth = createAuth({
    databaseUrl: 'postgresql://unused.example.invalid/seed',
    database: drizzle(client, { schema }) as unknown as Database,
    baseURL: 'http://localhost:3001',
    secret: 'test-only-4c899833aee0e89a601b7a682d2a8727-secret',
  })

  async function post(path: string, body: Record<string, unknown>, cookie?: string) {
    return auth.handler(
      new Request(`http://localhost:3001/api/auth/${path}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'http://localhost:3001',
          ...(cookie ? { cookie } : {}),
        },
        body: JSON.stringify(body),
      }),
    )
  }

  try {
    const signUp = await post('sign-up/email', {
      name: 'Test User',
      email: 'auth@example.com',
      password: 'test-password-123456',
    })
    assert.equal(signUp.status, 200, await signUp.clone().text())
    const cookie = signUp.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ')
    assert.match(cookie, /seed\.session_token=/)
    const session = await auth.api.getSession({ headers: new Headers({ cookie }) })
    assert.equal(session?.user.email, 'auth@example.com')

    const wrongPassword = await post('sign-in/email', {
      email: 'auth@example.com',
      password: 'incorrect-password',
    })
    assert.equal(wrongPassword.status, 401)
    const signOut = await post('sign-out', {}, cookie)
    assert.equal(signOut.status, 200)
    assert.equal(await auth.api.getSession({ headers: new Headers({ cookie }) }), null)

    const signedIn = await post('sign-in/email', {
      email: 'auth@example.com',
      password: 'test-password-123456',
    })
    assert.equal(signedIn.status, 200, await signedIn.clone().text())
    const newCookie = signedIn.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ')
    assert.ok(await auth.api.getSession({ headers: new Headers({ cookie: newCookie }) }))

    const untrusted = await auth.handler(
      new Request('http://localhost:3001/api/auth/sign-out', {
        method: 'POST',
        headers: {
          origin: 'https://attacker.example',
          cookie: newCookie,
          'content-type': 'application/json',
        },
        body: '{}',
      }),
    )
    assert.equal(untrusted.status, 403)
  } finally {
    await client.close()
  }
})
