---
name: seed-turborepo
description: 'Change workspace scripts, turbo task dependencies or build cache behavior.'
license: MIT
---

# Turborepo

1. Keep package-level scripts as the source of task behavior and root scripts as orchestration. Filter by @seed/landing, @seed/crm or @seed/mobile for focused work.

2. Read node_modules/turbo/docs/README.md if provided by the installed version. Otherwise use matching official documentation.

3. Declare build outputs for the actual app: Nuxt .output and mobile dist. Development tasks are persistent and uncached. Never cache .env or credential-bearing .vercel files.

4. Explicitly declare env inputs that affect builds and runtime configuration. Do not make db:migrate part of the build graph. Review lockfile changes when updating dependencies.

## Official references

- https://turborepo.com/docs
- https://pnpm.io/workspaces
