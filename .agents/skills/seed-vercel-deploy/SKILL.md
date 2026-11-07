---
name: seed-vercel-deploy
description: 'Configure or deploy this monorepo to Vercel.'
license: MIT
---

# Vercel deployments

1. Use three Vercel projects with roots apps/landing, apps/crm and apps/mobile. Enable source files outside the app root for workspace packages.

2. Confirm the selected personal account/team before creating or changing resources. Repository publication and deployment use the current task authorization, not assumptions from old project links.

3. Nuxt apps use Vercel SSR output. Mobile uses Expo static web export to dist. Configure CRM and landing cross-links using the actual deployed URLs.

4. Keep demo deployments explicit with SEED_MODE=demo. For live mode, provision a dedicated Neon database and Resend sender, apply migrations, set env, then deploy.

5. Inspect READY status and test the public URLs. A successful build does not verify sessions, database persistence, email delivery or native builds.

## Official references

- https://vercel.com/docs/monorepos
- https://vercel.com/docs/frameworks/full-stack/nuxt
- https://vercel.com/docs/deployments
