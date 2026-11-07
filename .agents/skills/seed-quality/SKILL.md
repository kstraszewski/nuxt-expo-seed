---
name: seed-quality
description: 'Validate changes across Nuxt, Expo and shared packages before handing off the starter.'
license: MIT
---

# Starter verification

1. Select checks that verify the changed behavior. Use typecheck and build for framework boundaries, unit tests for validation/authorization logic and browser checks for user flows.

2. For live CRM changes, test two different users to confirm contact ownership. Check unauthenticated access, malformed requests and logout behavior.

3. Distinguish demo UI checks, live integration checks and native device checks in the final report. Never claim an unrun provider flow succeeded.

4. Keep generated files, local env, build output and machine-specific paths out of the repository. Record any external configuration still required.

## Official references

- https://nuxt.com/docs/4.x/getting-started/testing
- https://docs.expo.dev/develop/unit-testing/
