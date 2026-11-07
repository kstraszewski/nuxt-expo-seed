import assert from 'node:assert/strict'
import test from 'node:test'
import { validateAuthOptions, type AuthOptions } from './index'

const base: AuthOptions = {
  databaseUrl: 'postgresql://example.invalid/seed',
  secret: 'test-only-secret-32-characters-long',
  baseURL: 'http://localhost:3001',
}

test('production auth refuses incomplete or unsafe configuration before I/O', () => {
  assert.throws(() => validateAuthOptions({ ...base, secret: 'short' }))
  assert.throws(() => validateAuthOptions({ ...base, production: true }))
  assert.throws(() =>
    validateAuthOptions({ ...base, baseURL: 'https://seed.example', production: true }),
  )
  assert.throws(() => validateAuthOptions({ ...base, resendApiKey: 'test-key' }))
})

test('origin checks reject wildcards, paths and broad URL schemes', () => {
  for (const origin of ['https://*.example.com', 'https://example.com/path', 'file:///tmp/test']) {
    assert.throws(() => validateAuthOptions({ ...base, trustedOrigins: [origin] }))
  }
  assert.throws(() => validateAuthOptions({ ...base, mobileScheme: 'https' }))
  assert.throws(() => validateAuthOptions({ ...base, baseURL: 'https://seed.example/api/auth' }))
})

test('production configuration permits exact HTTPS origins and a dedicated mobile scheme', () => {
  const result = validateAuthOptions({
    ...base,
    baseURL: 'https://seed.example',
    production: true,
    resendApiKey: 'test-key-never-sent',
    emailFrom: 'Seed <hello@example.com>',
    trustedOrigins: ['https://mobile.seed.example'],
    mobileScheme: 'nuxt-expo-seed',
  })
  assert.equal(result.baseURL, 'https://seed.example')
})
