---
name: seed-expo-structure
description: 'Add files or shared code to apps/mobile in this Expo Router monorepo.'
license: MIT
---

# Expo structure

1. Keep route components under the app router directory already selected in apps/mobile. Put reusable UI, API clients and configuration outside the route tree.

2. Reuse @seed/shared for transport validation and types. Never import the server-only db, auth factory or email package into a native or web bundle.

3. Use package exports and workspace dependencies rather than relative imports across apps. Avoid custom Metro monorepo configuration unless the installed SDK requires it.

4. Keep ios/ and android/ generated unless the project deliberately adopts native source control. Native config belongs in app config and config plugins.

## Official references

- https://docs.expo.dev/router/basics/core-concepts/
- https://docs.expo.dev/workflow/monorepos/
