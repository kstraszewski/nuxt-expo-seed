---
name: seed-expo-overview
description: 'Start or change the Expo app, select the relevant native workflow or evaluate its SDK compatibility.'
license: MIT
---

# Expo overview

1. Read apps/mobile/package.json and app config first. Use the installed Expo SDK documentation, not an unversioned example for another SDK.

2. Install native dependencies with pnpm exec expo install from apps/mobile so React Native and Expo package versions remain compatible.

3. For routes use seed-expo-router. For UI use seed-expo-native-ui. For API access use seed-expo-data. For upgrades use seed-expo-upgrade. App-store delivery uses seed-eas.

4. Native iOS/Android builds use Expo/EAS. The Vercel project hosts the static web export. It does not produce signed .ipa or .aab files.

5. App scheme and bundle identifiers are template values. Give every new product unique identifiers before enabling auth callbacks or store builds.

## Official references

- https://docs.expo.dev
- https://docs.expo.dev/workflow/monorepos/
