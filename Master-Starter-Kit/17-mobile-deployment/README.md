# 17 - Mobile Deployment & Testing

## Purpose

Ship mobile apps to real devices, real testers, and real app stores. This section covers everything between "the app runs on my simulator" and "users are downloading it from the App Store." Code signing, CI/CD pipelines, beta distribution, store submissions, testing strategies, and release versioning -- every step that turns source code into a published, updatable mobile application.

## Files in This Section

| File | Type | Description |
|------|------|-------------|
| [app-store-submission.md](./app-store-submission.md) | Guide | Complete submission guide for Apple App Store and Google Play Store |
| [code-signing.md](./code-signing.md) | Guide | iOS certificates, Android keystores, and secure credential storage |
| [mobile-ci-cd.md](./mobile-ci-cd.md) | Guide | CI/CD pipelines for EAS Build, Codemagic, Fastlane, and GitHub Actions |
| [mobile-testing-strategy.md](./mobile-testing-strategy.md) | Guide | Unit, integration, and E2E testing across React Native, Flutter, and native |
| [mobile-test-configs/detox.config.template.js](./mobile-test-configs/detox.config.template.js) | Template | Detox E2E test configuration for React Native projects |
| [mobile-test-configs/flutter-test-config.template.yaml](./mobile-test-configs/flutter-test-config.template.yaml) | Guide | Flutter test configuration: analysis rules, integration test setup, golden tests |
| [beta-testing.md](./beta-testing.md) | Guide | Beta distribution via TestFlight, Play Internal Testing, Firebase, and Expo |
| [release-versioning.md](./release-versioning.md) | Guide | Versioning strategy, build numbers, changelogs, feature flags, staged rollouts |

## Reading Order

1. **code-signing.md** -- Set up signing before you can build anything distributable
2. **mobile-ci-cd.md** -- Automate builds so you never ship from a local machine
3. **mobile-testing-strategy.md** + **mobile-test-configs/** -- Test before you ship
4. **beta-testing.md** -- Get builds to testers before going public
5. **app-store-submission.md** -- Submit to the stores when ready
6. **release-versioning.md** -- Manage versions and rollouts after launch

## When to Use This Section

Use this section when your project includes a mobile app (React Native, Expo, Flutter, or native iOS/Android). Skip it entirely for web-only projects. Start with code signing and CI/CD during Phase 0 -- waiting until "the app is done" to figure out deployment is how you lose a week to certificate errors.
