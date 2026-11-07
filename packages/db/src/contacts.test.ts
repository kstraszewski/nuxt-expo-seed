import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import {
  createContact,
  deleteContact,
  listContacts,
  schema,
  updateContact,
  type Database,
} from './index'

test('contacts enforce ownership against a real isolated Postgres engine', async (t) => {
  const client = new PGlite()
  // This is the committed production SQL, executed by Postgres in WASM without a remote database.
  const sql = await readFile(new URL('../drizzle/0000_initial.sql', import.meta.url), 'utf8')
  await client.exec(sql)
  // The SQL builder is identical across the Neon HTTP and PGlite Drizzle drivers.
  const db = drizzle(client, { schema }) as unknown as Database
  await db.insert(schema.user).values([
    { id: 'owner-a', name: 'Owner A', email: 'a@example.com' },
    { id: 'owner-b', name: 'Owner B', email: 'b@example.com' },
  ])

  try {
    const owned = await createContact(db, 'owner-a', {
      name: 'Ada',
      email: 'ada@example.com',
      company: '',
      status: 'lead',
    })
    const other = await createContact(db, 'owner-b', {
      name: 'Ben',
      email: 'ben@example.com',
      company: '',
      status: 'active',
    })

    await t.test(
      'list only returns the signed-in owner rows and omits ownership metadata',
      async () => {
        assert.deepEqual(
          (await listContacts(db, 'owner-a')).map((contact) => contact.id),
          [owned.id],
        )
        assert.deepEqual(
          (await listContacts(db, 'owner-b')).map((contact) => contact.id),
          [other.id],
        )
        assert.equal('userId' in owned, false)
        assert.equal(typeof owned.createdAt, 'string')
      },
    )

    await t.test('cross-owner update and delete cannot change the record', async () => {
      assert.equal(await updateContact(db, 'owner-b', owned.id, { name: 'Stolen' }), null)
      assert.equal(await deleteContact(db, 'owner-b', owned.id), false)
      assert.equal((await listContacts(db, 'owner-a'))[0]?.name, 'Ada')
    })

    await t.test('authenticated owner can update and delete their own record', async () => {
      assert.equal(
        (await updateContact(db, 'owner-a', owned.id, { status: 'archived' }))?.status,
        'archived',
      )
      assert.equal(await deleteContact(db, 'owner-a', owned.id), true)
      assert.deepEqual(await listContacts(db, 'owner-a'), [])
    })

    await t.test('empty identities and client-supplied ownership are rejected', async () => {
      await assert.rejects(() => listContacts(db, ''))
      await assert.rejects(() =>
        createContact(db, 'owner-a', {
          name: 'Ada',
          email: 'ada@example.com',
          userId: 'owner-b',
        } as never),
      )
      await assert.rejects(() =>
        updateContact(db, 'owner-b', other.id, { userId: 'owner-a' } as never),
      )
    })
  } finally {
    await client.close()
  }
})
