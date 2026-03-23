# Mobile Configuration Files

Guide for configuring the key mobile config files. Each section covers what the file does, where it lives, and the critical fields.

---

## React Native / Expo

### app.json (or app.config.js)

**Location:** `apps/mobile/app.json`

The central configuration for an Expo project. Controls app identity, splash screen, icons, plugins, and build settings.

```json
{
  "expo": {
    "name": "{{PROJECT_NAME}}",
    "slug": "{{PROJECT_SLUG}}",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "{{PRIMARY_COLOR_HEX}}"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.{{COMPANY_SLUG}}.{{PROJECT_SLUG}}",
      "infoPlist": {
        "NSCameraUsageDescription": "$(PRODUCT_NAME) needs camera access to ...",
        "NSLocationWhenInUseUsageDescription": "$(PRODUCT_NAME) needs location to ..."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "{{PRIMARY_COLOR_HEX}}"
      },
      "package": "com.{{COMPANY_SLUG}}.{{PROJECT_SLUG}}",
      "permissions": ["CAMERA", "ACCESS_FINE_LOCATION"]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      ["expo-notifications", { "icon": "./assets/notification-icon.png" }]
    ],
    "scheme": "{{PROJECT_SLUG}}",
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/{{EAS_PROJECT_ID}}"
    },
    "extra": {
      "eas": {
        "projectId": "{{EAS_PROJECT_ID}}"
      }
    }
  }
}
```

**Critical fields:**
- `bundleIdentifier` / `package` — Must be unique across all apps in both stores. Cannot be changed after first submission.
- `scheme` — URL scheme for deep linking. Register early.
- `runtimeVersion` — Controls OTA update compatibility. See `16-mobile-native-features/ota-updates.md`.
- `plugins` — Expo Config Plugins that modify native code at build time.
- `infoPlist` permissions — Apple rejects apps with missing or generic permission descriptions.

---

### eas.json

**Location:** `apps/mobile/eas.json`

EAS Build and Submit configuration. Defines build profiles and submission targets.

```json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "{{APPLE_ID}}",
        "ascAppId": "{{ASC_APP_ID}}",
        "appleTeamId": "{{APPLE_TEAM_ID}}"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services-key.json",
        "track": "internal"
      }
    }
  }
}
```

**Critical fields:**
- `distribution: "internal"` — Required for TestFlight/Ad Hoc. Without it, builds are unsigned.
- `channel` — Maps builds to EAS Update channels. Mismatched channels = no OTA updates.
- `autoIncrement` — Automatically bumps build number. Prevents store rejection for duplicate build numbers.
- `submit` — Requires Apple credentials and Google service account key. Set up once, never touch again.

---

### metro.config.js (Monorepo)

**Location:** `apps/mobile/metro.config.js`

Metro bundler configuration. In a monorepo, Metro must be told where to find shared packages.

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Resolve packages from monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Force resolving shared packages from the app's node_modules
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
```

**Critical fields:**
- `watchFolders` — Must include monorepo root or Metro cannot find shared packages.
- `nodeModulesPaths` — Tells Metro where to look for dependencies.
- `disableHierarchicalLookup` — Prevents Metro from resolving the wrong copy of a package in a monorepo.

---

## Flutter

### pubspec.yaml

**Location:** `apps/mobile_flutter/pubspec.yaml`

Flutter project configuration. Defines dependencies, assets, fonts, and SDK version.

```yaml
name: {{PROJECT_SLUG}}
description: {{PROJECT_NAME}} mobile app
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.2.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  # Navigation
  go_router: ^14.0.0
  # State Management
  flutter_riverpod: ^2.5.0
  riverpod_annotation: ^2.3.0
  # Networking
  dio: ^5.4.0
  # Storage
  shared_preferences: ^2.2.0
  flutter_secure_storage: ^9.0.0
  # UI
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  build_runner: ^2.4.0
  riverpod_generator: ^2.4.0
  freezed: ^2.5.0
  json_serializable: ^6.8.0
  mockito: ^5.4.0
  integration_test:
    sdk: flutter

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
  fonts:
    - family: {{FONT_FAMILY}}
      fonts:
        - asset: assets/fonts/{{FONT_FAMILY}}-Regular.ttf
        - asset: assets/fonts/{{FONT_FAMILY}}-Bold.ttf
          weight: 700
```

**Critical fields:**
- `version: X.Y.Z+N` — `X.Y.Z` is the display version, `+N` is the build number. Both stores use the build number for ordering.
- `environment.sdk` — Must match your Flutter SDK version. Mismatches cause `pub get` failures.
- `publish_to: "none"` — Prevents accidental publishing to pub.dev.
- `dev_dependencies` — `build_runner` and code gen packages go here, not in `dependencies`.

---

### analysis_options.yaml

**Location:** `apps/mobile_flutter/analysis_options.yaml`

Dart static analysis configuration. Controls lint rules and analysis strictness.

```yaml
include: package:flutter_lints/flutter.yaml

analyzer:
  errors:
    missing_return: error
    dead_code: warning
  exclude:
    - "**/*.g.dart"
    - "**/*.freezed.dart"

linter:
  rules:
    - prefer_const_constructors
    - prefer_const_declarations
    - avoid_print
    - require_trailing_commas
    - prefer_single_quotes
    - sort_child_properties_last
    - use_build_context_synchronously
```

**Critical fields:**
- `exclude` — Must exclude generated files (`.g.dart`, `.freezed.dart`) or analysis will report false errors in generated code.
- `avoid_print` — Forces use of `debugPrint` or logger, preventing print statements in production.

---

## Native iOS

### Info.plist

**Location:** `apps/ios/{{PROJECT_NAME}}/Info.plist` (or via Xcode target settings)

iOS app configuration. Controls permissions, URL schemes, and app behavior.

**Critical permission keys (add ONLY the ones your app uses):**

| Key | When to Add |
|-----|-------------|
| `NSCameraUsageDescription` | Camera access |
| `NSPhotoLibraryUsageDescription` | Photo library access |
| `NSLocationWhenInUseUsageDescription` | Foreground location |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | Background location |
| `NSMicrophoneUsageDescription` | Audio recording |
| `NSFaceIDUsageDescription` | Biometric authentication |
| `NSContactsUsageDescription` | Contacts access |
| `NSBluetoothAlwaysUsageDescription` | Bluetooth |

**Rule:** Every permission string must explain WHY the app needs it, not WHAT it is. "We need your camera" will be rejected. "Take photos for your profile picture" will pass.

---

## Native Android

### build.gradle (App Level)

**Location:** `apps/android/app/build.gradle`

Android app build configuration. Controls SDK versions, signing, dependencies.

```groovy
android {
    namespace "com.{{COMPANY_SLUG}}.{{PROJECT_SLUG}}"
    compileSdk 34

    defaultConfig {
        applicationId "com.{{COMPANY_SLUG}}.{{PROJECT_SLUG}}"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }

    signingConfigs {
        release {
            storeFile file(keystoreProperties["storeFile"])
            storePassword keystoreProperties["storePassword"]
            keyAlias keystoreProperties["keyAlias"]
            keyPassword keystoreProperties["keyPassword"]
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }
}
```

**Critical fields:**
- `applicationId` — Must be unique. Cannot be changed after first Play Store submission.
- `targetSdk` — Google Play requires this to be recent. Check Play Console for current minimum.
- `minSdk` — Lowest Android version supported. 24 (Android 7.0) covers 97%+ of devices.
- `signingConfigs.release` — Load from `key.properties` file. Never hardcode passwords in `build.gradle`.
- `minifyEnabled` — Enables R8/ProGuard. Always test release builds — code stripping can break reflection-based code.

---

## Checklist

- [ ] App identity (bundleIdentifier / applicationId / package) is set and unique
- [ ] All permission strings explain WHY, not WHAT
- [ ] Deep link scheme is registered
- [ ] OTA update config matches build profile channels
- [ ] Signing config does not contain hardcoded credentials
- [ ] Generated files are excluded from analysis
- [ ] Metro config includes monorepo watchFolders (if monorepo)
- [ ] Version and build number strategy is defined
