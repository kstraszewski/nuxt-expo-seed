---
name: seed-design-system
description: Change shared Nuxt UI themes, visual tokens, typography or component defaults used by the landing and CRM apps.
license: MIT
---

# Shared Nuxt UI theme

The user chose the visual direction of the current koonrad.dev homepage for this starter. Use Inter Tight Variable, paper and ink surfaces, cobalt blue, lime highlights, restrained borders and square component geometry. This authorizes the visual reference, not copying personal identity, business content, images or secrets.

1. Read `docs/design-system.md`, then inspect `packages/ui`. Both Nuxt apps extend the `@seed/ui` Nuxt layer. Shared visual decisions belong there, rather than repeated overrides in app components.
2. Change semantic palette tokens, font imports and shared utility classes in `packages/ui/app/assets/css/main.css`. Change Nuxt UI component defaults in `packages/ui/app/app.config.ts`. Use the app CSS files only for rules exclusive to that app.
3. Use real Nuxt UI components such as UButton, UCard, UInput, UTable and UModal. Preserve their accessibility, keyboard behavior, validation and loading states. Read the upstream `nuxt-ui` skill for slots, theming, forms and layout references.
4. Preserve the light default and verify dark mode when changing tokens. Use semantic `--ui-*` values in application UI. Highlights and poster treatments use the shared `--seed-*` tokens, not copied literal colors.
5. For a new visual reference, inspect the live page and the active CSS before extracting tokens. Old or unused CSS and unrequested brand assets are not evidence of the current design.
6. Verify the landing and CRM at mobile and desktop widths, including forms, focus states, overlays and content contrast. The Nuxt layer is for Vue web apps. Expo uses its own native theme and the upstream `expo-design-system` skill.

Dependency updates must preserve the installed framework APIs. Check actual npm stable tags and peer requirements before updating, commit the lockfile, then run relevant typechecks, lint, builds and UI verification. Newer prereleases or incompatible toolchain majors are not automatic replacements.

## References

- `docs/design-system.md`
- `packages/ui/nuxt.config.ts`
- `packages/ui/app/app.config.ts`
- `packages/ui/app/assets/css/main.css`
- https://ui.nuxt.com/docs/getting-started/theme
- https://nuxt.com/docs/4.x/guide/going-further/layers
