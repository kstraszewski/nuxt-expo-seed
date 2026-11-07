---
name: seed-neon-postgres
description: 'Change Neon connections, Postgres queries, Drizzle schema or database migrations.'
license: MIT
---

# Neon and Drizzle

1. Application traffic uses DATABASE_URL. Migration commands use DATABASE_URL_UNPOOLED. Use a separate Neon branch for development and previews.

2. Keep schema and migrations in packages/db. Review generated SQL and commit it with the schema change. Production migrations are an explicit release step, never a build hook.

3. Every contacts query must constrain ownerId using the authenticated session user. Never take ownerId from browser or mobile input. UUID guessing is not authorization.

4. Use transactions when operations must be atomic and indexes that match actual query filters. Keep database clients in server packages and reuse the existing factory.

5. Read the installed Drizzle and Neon driver APIs before changing connection transport. Do not replace Better Auth with another identity provider as part of database work.

## Official references

- https://neon.com/docs
- https://orm.drizzle.team/docs/overview
