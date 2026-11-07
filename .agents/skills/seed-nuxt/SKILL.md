---
name: seed-nuxt
description: 'Change Nuxt pages, server routes, runtime config or SSR behavior in apps/landing or apps/crm.'
license: MIT
---

# Nuxt and Vue

1. Read the target app package.json and resolved lockfile version before changing an API. Use Nuxt 4 app/ for routes and server/ for private code. Do not flatten this monorepo into a single app.

2. Use Nuxt useFetch/useAsyncData for SSR data. Keep request-specific state in request scope. Use useRequestFetch for authenticated server-side calls so cookies reach the CRM API.

3. Keep DATABASE_URL, auth secrets and Resend keys in the server environment. NUXT_PUBLIC_* values are browser-visible. Mobile clients call CRM HTTP routes and never import @seed/db or @seed/auth.

4. Prefer existing Nuxt conventions over adding another data layer. Run the affected app typecheck and build after route or config changes.

## Official references

- https://nuxt.com/docs/4.x
- https://vuejs.org/guide/
