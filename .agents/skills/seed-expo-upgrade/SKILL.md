---
name: seed-expo-upgrade
description: 'Upgrade Expo SDK, React Native or native package dependencies.'
license: MIT
---

# Expo upgrades

1. Check npm dist-tags and the Expo upgrade guide for the target stable SDK. The latest version of every native package is not necessarily compatible with the same Expo SDK.

2. Upgrade one SDK at a time when the official guide requires it. Use expo install --fix, then expo-doctor, TypeScript and export checks.

3. If the SDK changes the required React/React Native versions, update them as a compatible set. Review app config and generated native project implications.

4. Run at least one native simulator/device check when native dependencies or configuration change. A web export is an additional check, not a native test.

## Official references

- https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
- https://docs.expo.dev/versions/latest/
