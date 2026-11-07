import { neon } from '@neondatabase/serverless'
import { and, desc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import {
  contactIdSchema,
  contactInputSchema,
  contactUpdateSchema,
  type Contact,
  type ContactInput,
  type ContactUpdate,
} from '@seed/shared'
import * as schema from './schema'

export { schema }
export * from './schema'

/** Call only in a server request or a server utility. Importing the package performs no I/O. */
export function createDb(databaseUrl: string) {
  if (!databaseUrl) throw new Error('DATABASE_URL is required for live database access.')
  return drizzle(neon(databaseUrl), { schema })
}

export type Database = ReturnType<typeof createDb>

type ContactRow = typeof schema.contacts.$inferSelect

function toContact(row: ContactRow): Contact {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function requireUserId(userId: string): string {
  if (!userId?.trim()) throw new Error('An authenticated user ID is required.')
  return userId
}

/** Stable upper bound prevents an unbounded response as the seed grows. Add cursor pagination when needed. */
export async function listContacts(db: Database, userId: string): Promise<Contact[]> {
  const rows = await db
    .select()
    .from(schema.contacts)
    .where(eq(schema.contacts.userId, requireUserId(userId)))
    .orderBy(desc(schema.contacts.createdAt), desc(schema.contacts.id))
    .limit(100)
  return rows.map(toContact)
}

export async function createContact(
  db: Database,
  userId: string,
  input: ContactInput,
): Promise<Contact> {
  const parsed = contactInputSchema.parse(input)
  const [row] = await db
    .insert(schema.contacts)
    .values({ ...parsed, userId: requireUserId(userId) })
    .returning()
  if (!row) throw new Error('The database did not return the new contact.')
  return toContact(row)
}

/** A record belonging to another user is indistinguishable from a missing record. */
export async function updateContact(
  db: Database,
  userId: string,
  id: string,
  input: ContactUpdate,
): Promise<Contact | null> {
  const parsed = contactUpdateSchema.parse(input)
  const [row] = await db
    .update(schema.contacts)
    .set({ ...parsed, updatedAt: new Date() })
    .where(
      and(
        eq(schema.contacts.id, contactIdSchema.parse(id)),
        eq(schema.contacts.userId, requireUserId(userId)),
      ),
    )
    .returning()
  return row ? toContact(row) : null
}

export async function deleteContact(db: Database, userId: string, id: string): Promise<boolean> {
  const deleted = await db
    .delete(schema.contacts)
    .where(
      and(
        eq(schema.contacts.id, contactIdSchema.parse(id)),
        eq(schema.contacts.userId, requireUserId(userId)),
      ),
    )
    .returning({ id: schema.contacts.id })
  return deleted.length > 0
}
