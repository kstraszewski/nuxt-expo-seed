---
name: seed-environment
description: 'Create, validate or change local, Vercel or Expo environment configuration.'
license: MIT
---

# Environment configuration

1. Use pnpm setup:env to create missing app .env files from examples. The script generates a local auth secret without printing it and never overwrites an existing file.

2. Use pnpm env:check for the demo baseline and pnpm env:check --live for a configured live environment. Read docs/environment.md before changing required variables.

3. NUXT_PUBLIC_* and EXPO_PUBLIC_* are public. Keep database, Resend and Better Auth secrets only in CRM server env. Never copy real .env values into examples or commits.

4. Use separate preview and production databases/secrets. Confirm names and presence without printing values. Avoid secret-bearing command-line arguments and build artifacts.

## Official references

- https://nuxt.com/docs/4.x/guide/going-further/runtime-config
- https://docs.expo.dev/guides/environment-variables/
- https://vercel.com/docs/environment-variables
