# Mobile Deployment Pipeline

## Purpose

This guide defines the mobile deployment pipeline from local development through app store production. Mobile deployment is more complex than web deployment — you cannot just "push to main." Every release involves building native binaries, code signing, store review, and staged rollouts.

---

## Pipeline Overview

```
Local Development
  npx expo run:ios / flutter run
  |
  v
Development Build (CI)
  EAS Build --profile development / flutter build --debug
  Internal testers via Ad Hoc / direct install
  |
  v
Preview Build
  EAS Build --profile preview / flutter build --release
  TestFlight (internal) / Play Store internal track / Firebase App Distribution
  |
  v
Production Build
  EAS Build --profile production / flutter build ipa+appbundle
  TestFlight (external) / Play Store closed track
  |
  v
Store Submission
  App Store Connect / Google Play Console
  Review: 1-7 days (first submission longer)
  |
  v
Staged Rollout
  iOS: phased release (7 days) / Android: staged rollout (1% → 5% → 25% → 100%)
  Monitor crash rates, ANR rates, user feedback
  |
  v
Full Release
  100% of users
```

---

## Build Profiles

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

### EAS Build Profiles

| Profile | Purpose | Distribution | Code Signing | Channel |
|---------|---------|-------------|-------------|---------|
| `development` | Local testing with dev client | Internal (Ad Hoc) | Development | `development` |
| `preview` | Beta testing | Internal (TestFlight/Play Internal) | Distribution | `preview` |
| `production` | Store submission | Store | Distribution | `production` |

```bash
# Development build
cd apps/mobile && eas build --profile development --platform all

# Preview build
cd apps/mobile && eas build --profile preview --platform all

# Production build
cd apps/mobile && eas build --profile production --platform all
```

### EAS Submit

```bash
# Submit to App Store
cd apps/mobile && eas submit --platform ios --profile production

# Submit to Play Store
cd apps/mobile && eas submit --platform android --profile production
```

### OTA Updates (JS-only changes)

```bash
# Push update to preview channel
cd apps/mobile && eas update --branch preview --message "Fix: login screen layout"

# Push update to production channel
cd apps/mobile && eas update --branch production --message "Fix: crash on empty list"
```

**OTA rules:**
- Only JS/TS changes can be OTA updated — native code changes require a full build
- `runtimeVersion` must match between the binary and the update
- Always test OTA updates on preview before pushing to production
- OTA updates are applied on next app launch, not immediately

<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->

### Flutter Build Modes

| Mode | Purpose | Optimizations | Debugging |
|------|---------|-------------|-----------|
| `--debug` | Local development | None | Full |
| `--profile` | Performance testing | Partial | Some |
| `--release` | Production | Full (tree shaking, AOT) | None |

```bash
# Debug build
cd apps/mobile_flutter && flutter build ios --debug
cd apps/mobile_flutter && flutter build apk --debug

# Release build
cd apps/mobile_flutter && flutter build ipa
cd apps/mobile_flutter && flutter build appbundle
```

### Distribution Tools

| Tool | iOS | Android | Best For |
|------|-----|---------|----------|
| Codemagic | Yes | Yes | Flutter-optimized CI/CD |
| Fastlane | Yes | Yes | Automated signing + submission |
| Firebase App Distribution | Yes | Yes | Internal testing |
| TestFlight | Yes | No | iOS beta testing |
| Play Store Internal Track | No | Yes | Android beta testing |

<!-- ENDIF -->

---

## Environment Configuration

### Environment Variables

Mobile apps cannot use `.env` files at runtime the same way web apps do. Configure environment-specific values at build time.

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
```typescript
// app.config.ts — Expo dynamic config
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL ?? "https://api.example.com",
      environment: process.env.APP_ENV ?? "production",
    },
  },
};

// Usage in app code
import Constants from "expo-constants";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```
<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
```bash
# Build with environment
flutter build apk --dart-define=API_URL=https://api.example.com --dart-define=ENV=production
```

```dart
// Usage in app code
const apiUrl = String.fromEnvironment('API_URL', defaultValue: 'https://api.example.com');
const env = String.fromEnvironment('ENV', defaultValue: 'production');
```
<!-- ENDIF -->

### Secrets Management

| Secret | Where to Store | Never In |
|--------|---------------|----------|
| API keys | Build-time env vars | Source code |
| Signing certificates | EAS Secrets / Fastlane Match / CI secrets | Git repository |
| Firebase config | `google-services.json` / `GoogleService-Info.plist` | Public repos |
| Push notification keys | Server-side only | Mobile app bundle |

---

## Version Strategy

### Version Number Format

```
{major}.{minor}.{patch}+{buildNumber}
   1   .   2   .   3   +   42

major: Breaking changes or major redesign
minor: New features
patch: Bug fixes
buildNumber: Auto-incremented per build (required by both stores)
```

**Rules:**
- Version number must increase for every store submission
- Build number must be unique and higher than previous (never reuse)
- Use `autoIncrement` in EAS or CI scripts to handle build numbers automatically
- Both stores reject builds with duplicate or lower version numbers

---

## Rollout Strategy

### iOS: Phased Release

Apple offers a 7-day phased release that gradually rolls out to users:

| Day | % of Users |
|-----|-----------|
| 1 | 1% |
| 2 | 2% |
| 3 | 5% |
| 4 | 10% |
| 5 | 20% |
| 6 | 50% |
| 7 | 100% |

You can pause or halt the rollout at any time from App Store Connect.

### Android: Staged Rollout

Google Play allows custom percentages:

| Stage | % of Users | Duration | Monitor |
|-------|-----------|----------|---------|
| 1 | 1% | 24 hours | Crash rate, ANR rate |
| 2 | 5% | 24 hours | User reviews, support tickets |
| 3 | 25% | 48 hours | Performance metrics |
| 4 | 100% | — | Full release |

**Halt criteria:**
- Crash rate > 2% (halt immediately)
- ANR rate > 0.5% (halt and investigate)
- 1-star reviews mentioning a new bug (halt and investigate)

---

## Monitoring After Deployment

### First 24 Hours Checklist

- [ ] Crash rate is below baseline (check Firebase Crashlytics / Sentry)
- [ ] ANR rate is below 0.5% (Android only)
- [ ] No new 1-star reviews mentioning bugs
- [ ] Push notifications are being received on both platforms
- [ ] Deep links are resolving correctly
- [ ] Analytics events are firing
- [ ] API response times are within acceptable range on mobile networks

### Crash Monitoring Setup

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
```bash
# Sentry for React Native
npx expo install @sentry/react-native
```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
```bash
# Firebase Crashlytics for Flutter
flutter pub add firebase_crashlytics
```
<!-- ENDIF -->

---

## Rollback Plan

### If a Critical Bug is Found Post-Release

1. **iOS:** Pause the phased release from App Store Connect. Prepare a hotfix build.
2. **Android:** Halt the staged rollout from Play Console. Prepare a hotfix build.
3. **OTA (React Native only):** Push an OTA update to fix JS-only bugs immediately.
4. **Communication:** Notify affected users if the bug causes data loss or security issues.

**Rule:** Always have a rollback plan before submitting to production. "We'll fix it in the next release" is not a plan when 1% of users are already affected.
