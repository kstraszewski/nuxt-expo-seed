---
name: seed-better-auth
description: 'Change sign-up, sign-in, sessions, verification or password reset using Better Auth.'
license: MIT
---

# Better Auth

1. Auth configuration belongs in packages/auth and the CRM server adapter. Vue and Expo use their dedicated Better Auth clients against the CRM origin.

2. Inspect resolved better-auth and @better-auth/expo versions before changing plugin behavior. Update Drizzle migrations when auth tables or plugins introduce schema changes.

3. TRUSTED_ORIGINS accepts exact HTTP(S) origins only. The factory adds the native scheme from MOBILE_SCHEME itself. Preserve CSRF/origin protection and secure production cookies. Never put the Better Auth secret in EXPO_PUBLIC_* or NUXT_PUBLIC_* values.

4. Live production requires email verification and a working Resend sender. Do not weaken these checks to make a deployment pass. Demo mode has no real sessions.

5. Verify registration, email verification, sign-in, private API access, sign-out and password reset. A successful auth health endpoint alone does not verify authentication.

## Official references

- https://www.better-auth.com/docs
- https://www.better-auth.com/docs/integrations/nuxt
- https://www.better-auth.com/docs/integrations/expo
