import assert from 'node:assert/strict'
import test from 'node:test'
import { contactInputSchema, contactUpdateSchema } from './index'

test('contact input normalizes expected fields and applies defaults', () => {
  assert.deepEqual(contactInputSchema.parse({ name: '  Ada  ', email: 'ADA@example.com' }), {
    name: 'Ada',
    email: 'ada@example.com',
    company: '',
    status: 'lead',
  })
})

test('clients cannot inject contact ownership, IDs or unknown fields', () => {
  const valid = { name: 'Ada', email: 'ada@example.com' }
  for (const forbidden of ['ownerId', 'userId', 'id', 'createdAt']) {
    assert.equal(contactInputSchema.safeParse({ ...valid, [forbidden]: 'attacker' }).success, false)
    assert.equal(contactUpdateSchema.safeParse({ [forbidden]: 'attacker' }).success, false)
  }
})

test('updates reject empty payloads, invalid status and invalid email', () => {
  for (const input of [{}, { name: ' ' }, { email: 'bad' }, { status: 'admin' }]) {
    assert.equal(contactUpdateSchema.safeParse(input).success, false)
  }
  assert.deepEqual(contactUpdateSchema.parse({ status: 'archived' }), { status: 'archived' })
})
