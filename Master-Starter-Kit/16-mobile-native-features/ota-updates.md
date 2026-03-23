# Over-the-Air (OTA) Updates

OTA updates let you ship JavaScript (React Native) or Dart (Flutter) changes without going through the App Store or Play Store review process. A critical bug fix that would normally take 1-3 days for store review can reach users in minutes. But OTA has strict boundaries — native code changes still require a store update. Misunderstanding these boundaries causes crashes.

---

## What Can and Cannot Be OTA Updated

| Can Be OTA Updated | Cannot Be OTA Updated (Store Release Required) |
|--------------------|-------------------------------------------------|
| JavaScript bundle (React Native) | Native modules (Java/Kotlin/Swift/ObjC) |
| Dart code (Flutter, via Shorebird) | New native dependencies |
| JSON/text assets | App icon, splash screen |
| Image assets bundled in JS | SDK version changes (Expo SDK, Flutter engine) |
| Styling and layout changes | Permission declarations (Info.plist, AndroidManifest) |
| Business logic fixes | New background modes |
| Navigation changes | Push notification configuration changes |
| API endpoint changes | Deep link intent filters |

**Rule of thumb:** If it runs in the JS/Dart runtime, it can be OTA'd. If it touches the native layer (Xcode project, Android manifest, native modules), it needs a store release.

---

## React Native (Expo): EAS Update

EAS Update is the recommended OTA solution for Expo apps. It replaced the older `expo-updates` direct publishing and Classic Updates.

### How EAS Update Works

```
┌──────────┐    eas update     ┌──────────────┐
│ Developer│───────────────────▶│  EAS Servers │
│          │   (JS bundle +    │  (CDN)       │
│          │    assets)        └──────┬───────┘
└──────────┘                          │
                                      │ Check for update
                                      │ on app launch
                                      ▼
                              ┌──────────────┐
                              │  User's App  │
                              │              │
                              │ runtime      │
                              │ version: 1.0 │
                              │              │
                              │ Downloads    │
                              │ new JS       │
                              │ bundle       │
                              │              │
                              │ Applies on   │
                              │ next launch  │
                              └──────────────┘
```

### Setup

```bash
# Install expo-updates
npx expo install expo-updates

# Configure EAS
eas update:configure

# Login to EAS
eas login
```

```json
// app.json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    }
  }
}
```

```json
// eas.json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "autoIncrement": true
    }
  }
}
```

### Publishing an Update

```bash
# Publish to the preview channel
eas update --channel preview --message "Fix checkout button alignment"

# Publish to production
eas update --channel production --message "Fix critical payment bug"

# Publish for a specific platform
eas update --channel production --platform ios --message "Fix iOS-specific crash"
```

### Channels and Runtime Versions

**Channels** determine which builds receive which updates:

```
Channel: "production"  ────▶  All production builds
Channel: "preview"     ────▶  All preview/staging builds
Channel: "development" ────▶  Development builds only
```

**Runtime version** ensures the JS bundle is compatible with the native binary:

```
App binary (runtime version 1.0)  ←──── JS bundle (runtime version 1.0)  ✓ Compatible
App binary (runtime version 1.0)  ←──── JS bundle (runtime version 2.0)  ✗ Incompatible
```

If you add a new native module or upgrade the Expo SDK, the runtime version must change. Old app binaries will not download the new JS bundle — they'll keep their existing version, and users must update via the store.

### Update Checking Strategies

```typescript
// app.json — automatic checking (default)
{
  "expo": {
    "updates": {
      "checkAutomatically": "ON_LAUNCH",
      "fallbackToCacheTimeout": 0
    }
  }
}
```

```typescript
// Manual checking — gives you full control
import * as Updates from 'expo-updates';

async function checkForUpdate() {
  if (__DEV__) return; // No updates in development

  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      // Download the update
      await Updates.fetchUpdateAsync();

      // Strategy 1: Immediate — reload the app now
      await Updates.reloadAsync();

      // Strategy 2: On next launch — do nothing, update applies on next cold start
      // (This is the default behavior)

      // Strategy 3: Ask the user
      Alert.alert(
        'Update Available',
        'A new version is ready. Restart to apply?',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Restart', onPress: () => Updates.reloadAsync() },
        ]
      );
    }
  } catch (error) {
    // Silently fail — user keeps current version
    console.error('Update check failed:', error);
  }
}
```

### Rollback

```bash
# View recent updates
eas update:list

# Rollback: republish a known-good update to the same channel
# Option 1: Republish from a specific branch/commit
git checkout <known-good-commit>
eas update --channel production --message "Rollback: revert payment bug fix"

# Option 2: Use EAS rollback (repromotes the previous update)
eas update:rollback --channel production
```

### Staged Rollout

```bash
# Publish an update to a small percentage of users first
eas update --channel production --message "New feature" --rollout-percentage 10

# Increase rollout after monitoring
eas update:edit --group <update-group-id> --rollout-percentage 50

# Full rollout
eas update:edit --group <update-group-id> --rollout-percentage 100
```

---

## React Native (Bare): CodePush

For bare React Native apps not using Expo, Microsoft CodePush (App Center) provides OTA updates.

**Note:** Microsoft App Center was retired in March 2025. If you are starting a new bare React Native project, consider migrating to Expo or using a CodePush-compatible open-source server.

### Setup (Historical Reference)

```bash
npm install react-native-code-push
```

```typescript
// App.tsx
import codePush from 'react-native-code-push';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
};

function App() {
  // Your app component
}

export default codePush(codePushOptions)(App);
```

```typescript
// Manual update check with UI
async function syncWithCodePush() {
  const update = await codePush.checkForUpdate();

  if (!update) return;

  if (update.isMandatory) {
    // Force update — critical fix
    await update.download();
    update.install(codePush.InstallMode.IMMEDIATE);
  } else {
    // Optional — download in background, install on next restart
    await update.download();
    update.install(codePush.InstallMode.ON_NEXT_RESTART);
  }
}
```

### Alternatives to CodePush (Post App Center Retirement)

| Alternative | Status | Notes |
|------------|--------|-------|
| **Migrate to Expo + EAS Update** | Recommended | Best DX, full ecosystem support |
| **code-push-server (OSS)** | Community maintained | Self-hosted CodePush-compatible server |
| **Shorebird (React Native support)** | In development | Watch for RN support announcements |

---

## Flutter: Shorebird

Shorebird provides OTA updates for Flutter apps — the equivalent of EAS Update for the Flutter ecosystem.

### How Shorebird Works

Shorebird patches the Dart code at the AOT compilation level. It creates a binary diff between the original release and the patched version, then delivers only the diff to devices.

### Setup

```bash
# Install Shorebird CLI
curl --proto '=https' --tlsv1.2 https://raw.githubusercontent.com/shorebirdtech/install/main/install.sh -sSf | bash

# Initialize in your Flutter project
shorebird init

# Login
shorebird login
```

### Release and Patch

```bash
# Create a release (this is your base binary — submit to stores)
shorebird release android
shorebird release ios

# Create a patch (OTA update applied to existing releases)
shorebird patch android --release-version 1.0.0
shorebird patch ios --release-version 1.0.0
```

### Channels

```bash
# Create a staging channel
shorebird channel create staging

# Patch to staging first
shorebird patch android --release-version 1.0.0 --channel staging

# Promote to production after testing
shorebird patch android --release-version 1.0.0 --channel stable
```

### Rollback

```bash
# List patches
shorebird patch list --release-version 1.0.0

# Rollback to previous patch
shorebird patch rollback android --release-version 1.0.0
```

### Flutter Integration

```dart
// lib/main.dart
import 'package:shorebird_code_push/shorebird_code_push.dart';

final shorebirdCodePush = ShorebirdCodePush();

Future<void> checkForUpdate() async {
  final isUpdateAvailable = await shorebirdCodePush.isNewPatchAvailableForDownload();

  if (isUpdateAvailable) {
    await shorebirdCodePush.downloadUpdateIfAvailable();

    // Option 1: Notify user to restart
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Update Ready'),
        content: const Text('Restart the app to apply the update.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Later'),
          ),
          TextButton(
            onPressed: () {
              // Restart app (platform-specific or use flutter_phoenix)
            },
            child: const Text('Restart'),
          ),
        ],
      ),
    );

    // Option 2: Silent — update applies on next cold start
  }
}
```

---

## Update Strategies

### Strategy 1: Immediate (Critical Fixes)

Force update before the user can continue. Use only for critical bugs (data corruption, security vulnerabilities, payment issues).

```typescript
// React Native (Expo)
async function forceUpdate() {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync(); // App restarts immediately
  }
}
```

**When to use:** Security patches, critical crash fixes, data corruption bugs.
**User impact:** App restarts. Use sparingly — users hate forced restarts.

### Strategy 2: Background Download, Apply on Next Launch

Download the update silently. The next time the user cold-starts the app, the new version loads.

```typescript
// This is the default EAS Update behavior when checkAutomatically is ON_LAUNCH
// No code needed — configure in app.json:
{
  "updates": {
    "checkAutomatically": "ON_LAUNCH",
    "fallbackToCacheTimeout": 0
  }
}
```

**When to use:** Most updates. Feature additions, non-critical bug fixes, UI tweaks.
**User impact:** None. Update is invisible. Users get the new version next time they open the app.

### Strategy 3: Prompt User

Download in background, then show a non-blocking prompt asking the user to restart.

```typescript
async function promptUpdate() {
  const update = await Updates.checkForUpdateAsync();
  if (!update.isAvailable) return;

  await Updates.fetchUpdateAsync();

  Alert.alert(
    'Update Available',
    'We\'ve improved the app. Restart to get the latest version?',
    [
      { text: 'Not Now', style: 'cancel' },
      { text: 'Restart', onPress: () => Updates.reloadAsync() },
    ]
  );
}
```

**When to use:** Important but not critical updates. New features you want users to see soon.
**User impact:** Minor interruption. User can defer.

---

## Monitoring and Rollback

### Post-Update Monitoring

After publishing an OTA update, monitor these metrics:

| Metric | Tool | Alarm Threshold |
|--------|------|----------------|
| Crash rate | Sentry, Crashlytics | > 2x baseline |
| App launch time | Custom telemetry | > 2x baseline |
| API error rate | Server logs | > 3x baseline |
| Update download failures | EAS dashboard | > 10% |
| User complaints | App store reviews | Any spike |

### Automatic Rollback Triggers

```typescript
// Track update health in your error reporting
import * as Updates from 'expo-updates';
import * as Sentry from '@sentry/react-native';

// Tag all events with the current update ID
if (!__DEV__ && Updates.updateId) {
  Sentry.setTag('expo-update-id', Updates.updateId);
  Sentry.setTag('expo-channel', Updates.channel ?? 'unknown');
}

// In your error boundary, count crashes per update
// If crashes exceed threshold, your CI/CD can trigger rollback:
// eas update:rollback --channel production
```

### Rollback Procedure

1. **Detect:** Crash rate spike within 1 hour of update deployment
2. **Confirm:** Check Sentry/Crashlytics for new crash signatures tagged with the update ID
3. **Rollback:** `eas update:rollback --channel production`
4. **Verify:** Confirm crash rate returns to baseline
5. **Investigate:** Fix the issue on a separate branch
6. **Redeploy:** Publish corrected update

---

## Version Pinning

Ensure the JS/Dart bundle is compatible with the native binary:

### Expo runtimeVersion Policies

```json
// app.json
{
  "expo": {
    "runtimeVersion": {
      // Option 1: Tied to app version (recommended for most apps)
      // Runtime version changes when app version changes
      "policy": "appVersion"

      // Option 2: Tied to native SDK version
      // Runtime version changes when Expo SDK or native dependencies change
      // "policy": "nativeVersion"

      // Option 3: Fingerprint (most precise)
      // Hash of all native dependencies — auto-detects native changes
      // "policy": "fingerprintExperimental"
    }
  }
}
```

```json
// Or set explicitly
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}
```

**When to bump runtime version:**
- You upgrade the Expo SDK
- You add or remove a native module
- You change native configuration (permissions, capabilities, splash screen)
- You update react-native version

**When NOT to bump runtime version:**
- You change JS/TS code only
- You update JS-only dependencies
- You change styles, layouts, or business logic

---

## Common Pitfalls

| Pitfall | Consequence | Fix |
|---------|-------------|-----|
| Adding a native module without bumping runtime version | App crashes on update (missing native code) | Always bump runtime version when native dependencies change |
| Using `IMMEDIATE` install mode for every update | Users hate forced restarts | Reserve immediate mode for critical fixes only |
| Not testing OTA updates before publishing to production | Bad update reaches all users | Publish to preview channel first, test, then promote to production |
| Forgetting to set up rollback procedure | Stuck with broken update | Document rollback steps before your first production OTA |
| Publishing OTA update that changes native config | Update downloads but native config unchanged | Native config changes require a store release, not OTA |
| Not monitoring crash rates after update | Bad update stays live for hours | Set up crash rate alerts that trigger within 30 minutes |
| Channel confusion (dev update goes to prod) | Development code in production | Use separate channels per environment, never cross-publish |
| Large OTA bundles (> 50MB) | Slow downloads, update failures on cellular | Keep JS bundles lean, use asset optimization, lazy-load large images |
