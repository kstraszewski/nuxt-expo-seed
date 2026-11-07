---
name: seed-expo-data
description: 'Change Expo HTTP requests, authenticated CRM access or network state handling.'
license: MIT
---

# Expo data

1. EXPO_PUBLIC_API_URL is a public CRM origin. A physical device needs a LAN address or deployed HTTPS origin, not localhost on the development computer.

2. Use the Better Auth Expo client for native cookies and SecureStore-backed persistence. Do not invent a second token format for CRM requests.

3. Validate request payloads with @seed/shared. Treat 401 as a session problem, 403 as authorization failure and 503/demo status as a setup state.

4. Never persist passwords, database URLs or provider keys in app storage. Show actionable network failures and allow retry. Do not silently turn a failed live request into demo data.

## Official references

- https://docs.expo.dev/develop/data-fetching/
- https://www.better-auth.com/docs/integrations/expo
