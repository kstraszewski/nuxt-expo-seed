---
name: seed-expo-router
description: 'Change Expo Router navigation, route groups, links or auth redirects.'
license: MIT
---

# Expo Router

1. Use file-based routes and the installed Expo Router navigation APIs. Use route groups to organize screens without changing public URLs.

2. Keep authentication state in the existing client boundary. A route redirect helps navigation but private API authorization must still happen on the CRM server.

3. Configure app scheme and trusted origins together for native callbacks. Check cold links and return-to-app behavior on a device or simulator when changing auth links.

4. Keep web routes compatible with static export. Do not introduce request-time server APIs into the Vercel mobile web export.

## Official references

- https://docs.expo.dev/router/introduction/
- https://docs.expo.dev/router/web/static-rendering/
