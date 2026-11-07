---
name: seed-nuxt-ui
description: 'Build forms, tables or application layouts with Nuxt UI in the landing or CRM apps.'
license: MIT
---

# Nuxt UI

1. Check the installed @nuxt/ui version and use its matching component documentation. Keep UApp around the application for overlays and notifications.

2. Use Nuxt UI semantic colors, accessible labels, visible focus and real loading/error/empty states. Both Nuxt apps inherit the shared @seed/ui layer. Use seed-design-system and docs/design-system.md for the chosen koonrad.dev visual direction. Change shared tokens and component variants in packages/ui.

3. Validate form payloads with @seed/shared schemas and show server errors. Browser validation supplements server validation. Reuse Nuxt UI components before adding competing UI libraries.

4. For slot or prop details, read generated .nuxt/ui files or official component docs. Do not infer APIs from older Nuxt UI versions.

## Official references

- https://ui.nuxt.com/docs/getting-started
- https://ui.nuxt.com/mcp
