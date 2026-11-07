---
name: seed-eas
description: 'Configure or run EAS development builds, signed releases or store submissions for apps/mobile.'
license: MIT
---

# EAS delivery

1. Inspect eas.json and app config before building. New project forks need their own EAS project, bundle identifiers and store records.

2. Use eas whoami to confirm the intended account. Link only the current product. Do not reuse credentials, project IDs or signing assets from another app.

3. Keep development, preview and production profiles distinct. Public environment variables remain public in signed mobile bundles.

4. Build and submit are separate actions. Complete the locally verifiable setup before a store submission. Report build IDs, target profile and actual store/submission status.

## Official references

- https://docs.expo.dev/build/introduction/
- https://docs.expo.dev/submit/introduction/
