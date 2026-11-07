import assert from 'node:assert/strict'
import test from 'node:test'
import { createMailer, escapeHtml } from './index'

test('email HTML escapes names and links containing markup', () => {
  assert.equal(escapeHtml('<script>"&\'</script>'), '&lt;script&gt;&quot;&amp;&#39;&lt;/script&gt;')
})

test('mail setup fails closed without complete sender configuration', () => {
  assert.throws(() => createMailer({ apiKey: '', from: 'Seed <hello@example.com>' }))
  assert.throws(() => createMailer({ apiKey: 'test-key', from: '' }))
})

test('Resend delivery errors propagate and retries reuse a token-based idempotency key', async () => {
  const originalFetch = globalThis.fetch
  const requests: { body: Record<string, unknown>; headers: Headers }[] = []
  let fail = false
  globalThis.fetch = async (_input, init) => {
    requests.push({ body: JSON.parse(String(init?.body)), headers: new Headers(init?.headers) })
    return fail
      ? new Response(JSON.stringify({ name: 'validation_error', message: 'Rejected' }), {
          status: 422,
          headers: { 'content-type': 'application/json' },
        })
      : new Response(JSON.stringify({ id: 'mock-email-id' }), {
          headers: { 'content-type': 'application/json' },
        })
  }
  try {
    const mailer = createMailer({ apiKey: 'test-key-never-sent', from: 'Seed <hello@example.com>' })
    const email = {
      to: 'delivered@resend.dev',
      name: '<Ada>',
      url: 'https://seed.example/verify?token=fake',
      token: 'fake-token',
    }
    assert.equal(await mailer.sendVerification(email), 'mock-email-id')
    assert.equal(await mailer.sendVerification(email), 'mock-email-id')
    assert.deepEqual(requests[0]?.body.to, ['delivered@resend.dev'])
    assert.equal(requests[0]?.body.cc, undefined)
    assert.equal(requests[0]?.body.bcc, undefined)
    const key = requests[0]?.headers.get('idempotency-key')
    assert.equal(key, requests[1]?.headers.get('idempotency-key'))
    assert.ok(key?.startsWith('auth/verification/'))
    assert.equal(key?.includes('fake-token'), false)
    assert.ok(String(requests[0]?.body.html).includes('&lt;Ada&gt;'))
    fail = true
    await assert.rejects(() => mailer.sendPasswordReset(email), /Email delivery failed/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
