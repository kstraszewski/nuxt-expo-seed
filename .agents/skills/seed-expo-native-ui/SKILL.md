---
name: seed-expo-native-ui
description: 'Build mobile screens, forms or native controls in apps/mobile.'
license: MIT
---

# Expo native UI

1. Consult the installed @expo/ui documentation before adding a community control. Use native equivalents where supported by the installed SDK and platform.

2. Use safe areas, accessible labels, keyboard-friendly forms and platform-appropriate touch targets. Keep neutral styling and system typography until the new project has design requirements.

3. Use virtualized lists for growing contact datasets. Include explicit loading, empty, error and retry states. Account for permission or network denial.

4. Web preview cannot validate native keyboard, deep-link or secure-storage behavior. Report which platforms actually ran.

## Official references

- https://docs.expo.dev/ui/
- https://reactnative.dev/docs/accessibility
