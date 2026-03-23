# Release Versioning Strategy

## Why This Matters

Mobile versioning is more consequential than web versioning. On the web, every user always gets the latest version on page refresh. In mobile, users run different versions simultaneously for weeks or months. Your API must support old versions. Your crash reports must identify which version crashed. Your rollout strategy determines whether a bad release hits 100 users or 10 million. Getting versioning right is not pedantic -- it is operational.

---

## Semantic Versioning for Apps

Use **MAJOR.MINOR.PATCH** (e.g., `1.2.3`) for the display version that users see.

| Component | When to Bump | Example |
|-----------|-------------|---------|
| **MAJOR** | Breaking changes, major UI redesign, major platform changes | 1.0.0 -> 2.0.0: Complete navigation redesign |
| **MINOR** | New features, significant improvements, new screens | 1.0.0 -> 1.1.0: Added dark mode and profile editing |
| **PATCH** | Bug fixes, minor UI tweaks, copy changes | 1.1.0 -> 1.1.1: Fixed crash on login with special characters |

**Pre-release versions:**
- `1.0.0-beta.1` -- first beta of version 1.0.0
- `1.0.0-rc.1` -- release candidate 1

**Rules:**
- Start at `1.0.0` for your first public release (not `0.1.0`)
- Never go backwards. If you shipped `1.2.0`, the next version is `1.2.1` or `1.3.0`, never `1.1.x`
- Hotfixes branch from the release tag: `1.2.0` -> hotfix -> `1.2.1`

---

## Build Number Strategy

Both iOS and Android require two version identifiers: a human-readable display version and a machine-readable build number.

### iOS

| Field | Key | Format | Purpose |
|-------|-----|--------|---------|
| Display version | `CFBundleShortVersionString` | `MAJOR.MINOR.PATCH` (e.g., `1.2.3`) | Shown on App Store, visible to users |
| Build number | `CFBundleVersion` | Integer or dotted notation (e.g., `42` or `1.2.3.42`) | Must increment for every upload to App Store Connect |

**Rules:**
- Build number must be **strictly increasing** for each upload
- You can upload multiple builds of the same display version (e.g., `1.2.3` build 1, build 2, build 3)
- TestFlight shows both: "Version 1.2.3 (42)"

### Android

| Field | Key | Format | Purpose |
|-------|-----|--------|---------|
| Display version | `versionName` | String (e.g., `"1.2.3"`) | Shown on Play Store, visible to users |
| Build number | `versionCode` | Positive integer (e.g., `42`) | Must increment for every upload to Play Console |

**Rules:**
- `versionCode` must be a **positive integer**
- Must be **strictly greater** than the previously uploaded version code
- Maximum value: `2100000000`
- Different APKs/AABs for different architectures can use ranges (e.g., arm64: 100042, x86: 200042)

### Expo (app.json / app.config.js)

```jsonc
{
  "expo": {
    "version": "1.2.3",              // Display version (both platforms)
    "ios": {
      "buildNumber": "42"            // CFBundleVersion (string)
    },
    "android": {
      "versionCode": 42              // versionCode (integer)
    }
  }
}
```

With EAS Build, use `"appVersionSource": "remote"` in `eas.json` and `"autoIncrement": true` to let EAS manage build numbers automatically. This prevents the most common versioning mistake: forgetting to increment.

### Auto-Increment Build Numbers in CI

```bash
# GitHub Actions: use the run number as build number
BUILD_NUMBER=${{ github.run_number }}

# Or derive from git commit count (always increasing)
BUILD_NUMBER=$(git rev-list --count HEAD)

# Or use a timestamp-based approach (YYMMDDHHmm)
BUILD_NUMBER=$(date +%y%m%d%H%M)
```

**Recommended strategy:** Use `github.run_number` (or equivalent CI build counter) for CI builds. It auto-increments, never resets, and is easy to trace back to the CI run.

---

## Changelog Generation

### From Conventional Commits to Store "What's New"

If your team uses conventional commits (`feat:`, `fix:`, `chore:`), you can auto-generate changelogs.

**Commit format:**
```
feat: add biometric login
fix: resolve crash when uploading large images
perf: reduce app startup time by 40%
chore: update React Native to 0.75
```

**Generate changelog:**

```bash
# Using conventional-changelog-cli
npx conventional-changelog -p angular -i CHANGELOG.md -s

# Or using changelogen (lightweight)
npx changelogen

# Or using standard-version / release-it
npx release-it
```

**Transform changelog to "What's New" for stores:**

The store "What's New" section should be user-facing, not developer-facing. Transform:

| Commit Message | Store "What's New" |
|---------------|-------------------|
| `feat: add biometric login` | "You can now log in with Face ID or fingerprint" |
| `fix: resolve crash when uploading large images` | "Fixed a crash when uploading photos" |
| `perf: reduce app startup time by 40%` | "The app launches faster than ever" |
| `chore: update React Native to 0.75` | (omit -- users do not care about internal changes) |

**Template for "What's New":**

```
What's New in {{VERSION}}:

{{#NEW_FEATURES}}
- {{USER_FACING_DESCRIPTION}}
{{/NEW_FEATURES}}

Bug Fixes:
{{#BUG_FIXES}}
- {{USER_FACING_DESCRIPTION}}
{{/BUG_FIXES}}

{{#PERFORMANCE}}
Performance Improvements:
- {{USER_FACING_DESCRIPTION}}
{{/PERFORMANCE}}
```

---

## Feature Flags for Phased Rollouts

Feature flags decouple deployment from release. You can ship code to all users but only enable features for a subset.

### Server-Controlled Feature Flags

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| **Firebase Remote Config** | Yes (generous) | Small teams, Firebase users |
| **LaunchDarkly** | No (paid) | Enterprise, complex targeting |
| **Statsig** | Yes (up to 1M events) | Data-driven teams, A/B testing |
| **Custom (your API)** | Yes (self-hosted) | Simple flags, no vendor dependency |

### Implementation Pattern

```typescript
// Feature flag service (React Native)
import remoteConfig from '@react-native-firebase/remote-config';

// Initialize on app start
await remoteConfig().setDefaults({
  new_checkout_flow: false,
  dark_mode_enabled: true,
  max_upload_size_mb: 10,
});
await remoteConfig().fetchAndActivate();

// Check flag in component
const useNewCheckout = remoteConfig().getValue('new_checkout_flow').asBoolean();

if (useNewCheckout) {
  return <NewCheckoutFlow />;
} else {
  return <LegacyCheckoutFlow />;
}
```

```dart
// Feature flag service (Flutter)
import 'package:firebase_remote_config/firebase_remote_config.dart';

final remoteConfig = FirebaseRemoteConfig.instance;

await remoteConfig.setDefaults({
  'new_checkout_flow': false,
  'dark_mode_enabled': true,
  'max_upload_size_mb': 10,
});
await remoteConfig.fetchAndActivate();

// Check flag
final useNewCheckout = remoteConfig.getBool('new_checkout_flow');
```

### Client-Side Feature Flags

For platform-specific features that do not need server control:

```typescript
// Platform-specific feature flags
import { Platform } from 'react-native';

const FEATURES = {
  // iOS has haptic feedback, Android does not (or uses a different API)
  hapticFeedback: Platform.OS === 'ios',
  // Widget support only on iOS 17+ and Android 12+
  homeWidget: Platform.select({
    ios: parseInt(Platform.Version, 10) >= 17,
    android: Platform.Version >= 31,
    default: false,
  }),
};
```

### Rollout Strategy Using Feature Flags

```
Step 1: Ship build with feature behind flag (flag = OFF)
    |
    v
Step 2: Enable flag for internal team (1-2 days)
    - Monitor: crash rate, error logs, user feedback
    |
    v
Step 3: Enable flag for 10% of users (2-3 days)
    - Monitor: same metrics + engagement, conversion
    |
    v
Step 4: Enable flag for 50% of users (2-3 days)
    - Monitor: same metrics at scale
    |
    v
Step 5: Enable flag for 100% of users
    |
    v
Step 6: Remove flag and dead code in next release
    - Clean up: remove conditional, remove old code path
```

---

## Staged Rollouts

### Google Play Staged Rollout

Google Play natively supports percentage-based rollout for production releases.

**Recommended rollout schedule:**

| Stage | Percentage | Wait Period | Stop If |
|-------|-----------|-------------|---------|
| 1 | 1% | 24 hours | Crash rate > 1% |
| 2 | 5% | 24 hours | Crash rate > 0.5% |
| 3 | 20% | 48 hours | ANR rate > 0.5% |
| 4 | 50% | 48 hours | Uninstall rate > 2x baseline |
| 5 | 100% | -- | -- |

**Monitoring during rollout:**

```
Google Play Console > Android Vitals > Overview

Key metrics to watch:
- Crash rate (target: < 1% of daily active users)
- ANR rate (target: < 0.5% of daily active users)
- Excessive wakeups
- Stuck partial wake locks
```

**Halt and rollback:**

```
Google Play Console > Release > Production > Manage
    > "Halt rollout" -- stops the rollout at current percentage
    > Previous version remains for users who haven't updated
```

### iOS Staged Rollout

Apple does not support percentage-based staged rollout natively. Instead:

1. **Use feature flags.** Ship the build to 100% of users with the new feature behind a flag.
2. Enable the flag for a small percentage of users using your feature flag provider.
3. Monitor crash rates in App Store Connect and your crash reporter (Sentry, Firebase Crashlytics).
4. Gradually increase the percentage.

Alternatively, Apple offers **Phased Release:**
- Rolls out an update over 7 days: Day 1: 1%, Day 2: 2%, Day 3: 5%, Day 4: 10%, Day 5: 20%, Day 6: 50%, Day 7: 100%
- Users who manually check for updates will always get the latest version
- You can pause a phased release (but cannot reduce the percentage)
- Enable in App Store Connect > App Store > Version > Phased Release

---

## Forced Updates

When you ship a critical fix or make a breaking API change, you need to ensure users are on a minimum app version.

### Minimum Version Enforcement

```typescript
// Server endpoint: GET /api/app-config
// Returns:
{
  "minVersion": "1.2.0",
  "latestVersion": "1.3.1",
  "forceUpdate": false,
  "gracePeriodDays": 7,
  "updateUrl": {
    "ios": "https://apps.apple.com/app/id{{APP_STORE_ID}}",
    "android": "https://play.google.com/store/apps/details?id=com.{{COMPANY_NAME}}.{{APP_SLUG}}"
  },
  "message": "Please update to continue using {{APP_NAME}}."
}
```

### Client-Side Version Check

```typescript
// React Native version check on app launch
import { Platform, Linking, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';

async function checkAppVersion() {
  const currentVersion = DeviceInfo.getVersion(); // e.g., "1.1.0"
  const response = await fetch('{{API_BASE_URL}}/api/app-config');
  const config = await response.json();

  if (isVersionLessThan(currentVersion, config.minVersion)) {
    if (config.forceUpdate) {
      // Show blocking modal -- user cannot dismiss
      showForceUpdateDialog(config);
    } else {
      // Show dismissible prompt
      showSoftUpdateDialog(config);
    }
  }
}

function isVersionLessThan(current: string, minimum: string): boolean {
  const currentParts = current.split('.').map(Number);
  const minimumParts = minimum.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const c = currentParts[i] || 0;
    const m = minimumParts[i] || 0;
    if (c < m) return true;
    if (c > m) return false;
  }
  return false;
}

function showForceUpdateDialog(config: AppConfig) {
  Alert.alert(
    'Update Required',
    config.message,
    [
      {
        text: 'Update Now',
        onPress: () => {
          const url = Platform.select({
            ios: config.updateUrl.ios,
            android: config.updateUrl.android,
          });
          if (url) Linking.openURL(url);
        },
      },
    ],
    { cancelable: false }
  );
}
```

### Grace Period Strategy

```
Version 1.1.0 released (current minimum: 1.0.0)
    |
    v (7 days later)
Minimum version bumped to 1.0.5 (force update for very old versions)
    |
    v (14 days later)
Minimum version bumped to 1.1.0 (all users must update)
```

**Rules:**
- Always give users at least 7 days before forcing an update
- Show a dismissible "update available" prompt during the grace period
- Only force-update when there is a security vulnerability, a breaking API change, or a critical crash
- Log the distribution of app versions to know how many users will be affected

---

## Version Bump Workflow

### From Code Change to Store Update

```
1. Developer merges feature branch to main
    |
    v
2. Version bump commit:
    - Update version in package.json / pubspec.yaml / app.json / Info.plist / build.gradle
    - Update CHANGELOG.md with user-facing changes
    - Git tag: v1.2.0
    |
    v
3. CI detects tag, triggers production build:
    - Build number auto-incremented
    - Signed with distribution certificate / release keystore
    |
    v
4. CI submits to stores:
    - iOS: Upload to App Store Connect, submit for review
    - Android: Upload to Play Console internal track
    |
    v
5. Review and rollout:
    - iOS: Wait for App Store Review (1-2 days)
    - Android: Internal testing -> Staged rollout (1% -> 5% -> 20% -> 50% -> 100%)
    |
    v
6. Post-release:
    - Monitor crash rates for 48 hours
    - Bump minimum supported version if needed
    - Close related issues / update project board
```

### Automated Version Bump Script

```bash
#!/bin/bash
# scripts/bump-version.sh
# Usage: ./scripts/bump-version.sh patch|minor|major

set -euo pipefail

BUMP_TYPE=${1:-patch}

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Bump version
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
case $BUMP_TYPE in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
  *) echo "Usage: $0 patch|minor|major"; exit 1 ;;
esac
NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "New version: $NEW_VERSION"

# Update package.json
npm version "$NEW_VERSION" --no-git-tag-version

# Update app.json (Expo)
if [ -f "app.json" ]; then
  node -e "
    const fs = require('fs');
    const config = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    config.expo.version = '$NEW_VERSION';
    fs.writeFileSync('app.json', JSON.stringify(config, null, 2) + '\n');
  "
fi

# Generate changelog
npx conventional-changelog -p angular -i CHANGELOG.md -s 2>/dev/null || true

# Commit and tag
git add -A
git commit -m "chore: bump version to $NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release $NEW_VERSION"

echo "Version bumped to $NEW_VERSION"
echo "Run 'git push && git push --tags' to trigger CI release build"
```

### Version Comparison Utility

```typescript
// utils/version.ts

/**
 * Compare two semantic version strings.
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }
  return 0;
}

/**
 * Check if the current version satisfies the minimum required version.
 */
export function meetsMinimumVersion(
  current: string,
  minimum: string
): boolean {
  return compareVersions(current, minimum) >= 0;
}

/**
 * Parse a version string into its components.
 */
export function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const [major = 0, minor = 0, patch = 0] = version.split('.').map(Number);
  return { major, minor, patch };
}
```
