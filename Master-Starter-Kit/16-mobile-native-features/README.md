# 16 - Mobile Native Features

## Purpose

This section defines how to integrate native device capabilities into your mobile application. Push notifications, offline storage, deep linking, camera, GPS, biometrics, background tasks, and OTA updates all require platform-specific configuration that varies dramatically between iOS, Android, React Native, and Flutter. Getting any of these wrong leads to App Store rejections, silent permission failures, or data loss when the user goes offline.

**Input:** Framework choice from `14-mobile-platform/`, UI system from `15-mobile-ui-design/`
**Output:** Configured native features with proper permissions, offline strategy, push notification channels, deep link routes, and an audit checklist

---

## File Manifest

| # | File | Type | Description |
|---|------|------|-------------|
| 1 | `README.md` | Guide | This file — orchestrates the native features section |
| 2 | `push-notifications.md` | Guide | Push notification architecture, per-framework setup, server-side delivery, permission flow |
| 3 | `offline-first-patterns.md` | Guide | Local databases, sync strategies, conflict resolution, network detection |
| 4 | `deep-linking.md` | Guide | Universal Links, App Links, URL schemes, deferred deep linking, route mapping |
| 5 | `device-apis.md` | Guide | Camera, GPS, biometrics, contacts, Bluetooth/NFC, file system — per-framework libraries and permissions |
| 6 | `permissions-strategy.md` | Guide | iOS Info.plist strings, Android runtime permissions, request-at-point-of-use pattern, denial handling |
| 7 | `ota-updates.md` | Guide | Over-the-air updates via EAS Update, CodePush, Shorebird — strategies, rollback, version pinning |
| 8 | `background-tasks.md` | Guide | Background fetch, processing tasks, WorkManager, battery optimization, platform constraints |
| 9 | `native-features-audit.template.md` | Template | Checklist for the Native Features Audit gate (Step 5.5) — APIs, permissions, offline strategy, deep links |

---

## Reading Order

1. **Permissions strategy** — understand the permission model before integrating any native API
2. **Push notifications** — the most universally required native feature
3. **Device APIs** — camera, GPS, biometrics, and other hardware integrations
4. **Deep linking** — wire up URL-to-screen routing for both platforms
5. **Offline-first patterns** — choose your local storage and sync strategy
6. **Background tasks** — schedule work that runs when the app is not in the foreground
7. **OTA updates** — ship JS/Dart fixes without going through the app store
8. **Native features audit** — fill out the audit template to verify all decisions

## When to Use This Section

- You are adding push notifications, camera, GPS, or biometrics to a mobile app
- You need offline support or background sync for a mobile product
- You are setting up deep linking for marketing, sharing, or onboarding flows
- You want to ship OTA updates to bypass app store review for non-native changes
- You are preparing for the Native Features Audit gate (Step 5.5 in the orchestrator)
