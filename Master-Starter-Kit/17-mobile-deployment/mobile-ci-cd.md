# Mobile CI/CD Pipeline

## Why This Matters

Building mobile apps locally and manually uploading to the app stores is a recipe for mistakes. A developer forgets to increment the build number. Another pushes a debug build to TestFlight. Someone ships with the wrong signing certificate. CI/CD eliminates these problems by making builds reproducible, automatic, and auditable.

**Rule: No build that reaches testers or the app store should be built on a developer's machine.**

---

## React Native / Expo (EAS Build -- Recommended)

EAS Build is the fastest path from code to installable build for React Native and Expo projects. It handles code signing, native dependencies, and build infrastructure.

### eas.json Configuration

```jsonc
// eas.json -- place at project root
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
        "resourceClass": "m-medium",
        "simulator": false
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      },
      "channel": "development",
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      },
      "channel": "preview",
      "env": {
        "APP_ENV": "preview"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium",
        "autoIncrement": true
      },
      "android": {
        "buildType": "app-bundle",
        "autoIncrement": true
      },
      "channel": "production",
      "env": {
        "APP_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "{{APPLE_ID_EMAIL}}",
        "ascAppId": "{{APP_STORE_CONNECT_APP_ID}}",
        "appleTeamId": "{{APPLE_TEAM_ID}}"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### Build Profiles Explained

| Profile | When to Use | Includes Dev Tools? | Distribution | Auto-Increment? |
|---------|-------------|--------------------|--------------| --------------- |
| `development` | Daily development, debugging on device | Yes (dev client) | Internal (registered devices) | No |
| `preview` | QA testing, stakeholder demos | No | Internal (registered devices) | No |
| `production` | App Store / Play Store submission | No | Store | Yes |

### Build Commands

```bash
# Development build (includes dev tools, hot reload)
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview build (for internal testers)
eas build --profile preview --platform all

# Production build (app store ready)
eas build --profile production --platform all

# Submit to stores after build
eas submit --platform ios --latest
eas submit --platform android --latest

# Build and submit in one step
eas build --profile production --platform all --auto-submit
```

### OTA Updates (EAS Update)

OTA updates push JavaScript bundle changes without a new binary build. This means bug fixes and feature tweaks deploy in minutes, not days.

```bash
# Push an OTA update to the preview channel
eas update --channel preview --message "Fix login button alignment"

# Push to production
eas update --channel production --message "Fix crash on profile page"
```

**Limitations:** OTA updates cannot change native code (new native modules, permissions changes, SDK version bumps). Those require a new binary build.

### Build Triggers

```yaml
# .github/workflows/eas-build.yml
name: EAS Build

on:
  push:
    branches: [main]
    paths:
      - 'apps/mobile/**'
      - 'packages/**'
  workflow_dispatch:
    inputs:
      platform:
        description: 'Platform to build'
        required: true
        default: 'all'
        type: choice
        options: [ios, android, all]
      profile:
        description: 'Build profile'
        required: true
        default: 'preview'
        type: choice
        options: [development, preview, production]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Build
        run: eas build --profile ${{ github.event.inputs.profile || 'preview' }} --platform ${{ github.event.inputs.platform || 'all' }} --non-interactive
```

---

## Flutter (Codemagic -- Recommended)

Codemagic provides first-class Flutter support with macOS build machines for iOS, automatic code signing, and direct store submission.

### codemagic.yaml Configuration

```yaml
# codemagic.yaml -- place at project root
workflows:
  ios-release:
    name: iOS Release
    max_build_duration: 60
    instance_type: mac_mini_m2
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.{{COMPANY_NAME}}.{{APP_SLUG}}
      vars:
        APP_STORE_CONNECT_ISSUER_ID: Encrypted(...)
        APP_STORE_CONNECT_KEY_IDENTIFIER: Encrypted(...)
        APP_STORE_CONNECT_PRIVATE_KEY: Encrypted(...)
      flutter: stable
      xcode: latest
      cocoapods: default
    scripts:
      - name: Get Flutter packages
        script: flutter packages pub get
      - name: Run tests
        script: flutter test
      - name: Build iOS
        script: |
          flutter build ipa \
            --release \
            --build-number=$PROJECT_BUILD_NUMBER \
            --export-options-plist=/Users/builder/export_options.plist
    artifacts:
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        cancel_previous_submissions: true
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: 'main'
          include: true

  android-release:
    name: Android Release
    max_build_duration: 60
    instance_type: linux_x2
    environment:
      android_signing:
        - keystore_reference
      vars:
        GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS: Encrypted(...)
      flutter: stable
      java: 17
    scripts:
      - name: Get Flutter packages
        script: flutter packages pub get
      - name: Run tests
        script: flutter test
      - name: Build Android AAB
        script: |
          flutter build appbundle \
            --release \
            --build-number=$PROJECT_BUILD_NUMBER
    artifacts:
      - build/app/outputs/bundle/**/*.aab
    publishing:
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
        submit_as_draft: false
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: 'main'
          include: true
```

---

## Native (Fastlane -- Recommended)

Fastlane automates the entire release process for native iOS and Android apps.

### Fastfile

```ruby
# fastlane/Fastfile

default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    setup_ci if ENV['CI']
    match(type: "appstore")
    increment_build_number(
      build_number: ENV['BUILD_NUMBER'] || (latest_testflight_build_number + 1)
    )
    build_app(
      workspace: "{{PROJECT_SLUG}}.xcworkspace",
      scheme: "{{PROJECT_SLUG}}",
      configuration: "Release",
      export_method: "app-store"
    )
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end

  desc "Push a new release to the App Store"
  lane :release do
    setup_ci if ENV['CI']
    match(type: "appstore")
    increment_build_number(
      build_number: ENV['BUILD_NUMBER'] || (latest_testflight_build_number + 1)
    )
    build_app(
      workspace: "{{PROJECT_SLUG}}.xcworkspace",
      scheme: "{{PROJECT_SLUG}}",
      configuration: "Release",
      export_method: "app-store"
    )
    upload_to_app_store(
      force: true,
      skip_metadata: false,
      skip_screenshots: true
    )
  end
end

platform :android do
  desc "Push a new beta build to Play Store internal track"
  lane :beta do
    gradle(
      task: "bundle",
      build_type: "Release",
      project_dir: "android/"
    )
    upload_to_play_store(
      track: "internal",
      aab: "android/app/build/outputs/bundle/release/app-release.aab",
      json_key: "fastlane/google-play-key.json",
      skip_upload_metadata: true,
      skip_upload_changelogs: false,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end

  desc "Promote internal build to production"
  lane :release do
    upload_to_play_store(
      track: "internal",
      track_promote_to: "production",
      json_key: "fastlane/google-play-key.json",
      skip_upload_aab: true,
      skip_upload_metadata: false
    )
  end
end
```

### Fastlane with GitHub Actions

```yaml
# .github/workflows/fastlane-ios.yml
name: iOS Fastlane

on:
  push:
    branches: [main]
    paths: ['ios/**', 'src/**']

jobs:
  ios-beta:
    runs-on: macos-14  # macOS runner required for iOS builds
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      - name: Install CocoaPods
        run: cd ios && pod install
      - name: Setup certificates
        env:
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          MATCH_GIT_BASIC_AUTHORIZATION: ${{ secrets.MATCH_GIT_BASIC_AUTHORIZATION }}
        run: bundle exec fastlane match appstore --readonly
      - name: Build and upload to TestFlight
        env:
          APP_STORE_CONNECT_API_KEY_KEY_ID: ${{ secrets.ASC_KEY_ID }}
          APP_STORE_CONNECT_API_KEY_ISSUER_ID: ${{ secrets.ASC_ISSUER_ID }}
          APP_STORE_CONNECT_API_KEY_KEY: ${{ secrets.ASC_API_KEY }}
          BUILD_NUMBER: ${{ github.run_number }}
        run: bundle exec fastlane ios beta
```

---

## GitHub Actions Alternative

### React Native Build Workflow

```yaml
# .github/workflows/react-native-build.yml
name: React Native Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # Android builds run on Linux (cheaper, faster)
  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'
      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: node-modules-${{ hashFiles('package-lock.json') }}
      - run: npm ci
      - name: Decode keystore
        env:
          ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
        run: echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > android/app/release.keystore
      - name: Build Android
        env:
          ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          ANDROID_KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
          ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
        run: cd android && ./gradlew assembleRelease
      - uses: actions/upload-artifact@v4
        with:
          name: android-release
          path: android/app/build/outputs/apk/release/

  # iOS builds MUST run on macOS
  ios:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Cache CocoaPods
        uses: actions/cache@v4
        with:
          path: ios/Pods
          key: pods-${{ hashFiles('ios/Podfile.lock') }}
      - run: npm ci
      - run: cd ios && pod install
      - name: Decode signing certificate
        env:
          IOS_P12_BASE64: ${{ secrets.IOS_P12_BASE64 }}
          IOS_P12_PASSWORD: ${{ secrets.IOS_P12_PASSWORD }}
          IOS_PROVISIONING_PROFILE_BASE64: ${{ secrets.IOS_PROVISIONING_PROFILE_BASE64 }}
        run: |
          echo "$IOS_P12_BASE64" | base64 -d > certificate.p12
          echo "$IOS_PROVISIONING_PROFILE_BASE64" | base64 -d > profile.mobileprovision
          security create-keychain -p temp build.keychain
          security default-keychain -s build.keychain
          security unlock-keychain -p temp build.keychain
          security import certificate.p12 -k build.keychain -P "$IOS_P12_PASSWORD" -T /usr/bin/codesign
          security set-key-partition-list -S apple-tool:,apple: -s -k temp build.keychain
          mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
          cp profile.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/
      - name: Build iOS
        run: |
          xcodebuild -workspace ios/{{PROJECT_SLUG}}.xcworkspace \
            -scheme {{PROJECT_SLUG}} \
            -configuration Release \
            -archivePath build/{{PROJECT_SLUG}}.xcarchive \
            archive \
            CODE_SIGN_STYLE=Manual
      - uses: actions/upload-artifact@v4
        with:
          name: ios-release
          path: build/

```

### Flutter Build Workflow

```yaml
# .github/workflows/flutter-build.yml
name: Flutter Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: 'stable'
          cache: true
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'
      - run: flutter pub get
      - run: flutter test
      - run: flutter build appbundle --release
      - uses: actions/upload-artifact@v4
        with:
          name: android-aab
          path: build/app/outputs/bundle/release/

  ios:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: 'stable'
          cache: true
      - run: flutter pub get
      - run: flutter test
      - run: flutter build ipa --release --no-codesign
      # Signing handled by Fastlane or manual xcodebuild step
      - uses: actions/upload-artifact@v4
        with:
          name: ios-ipa
          path: build/ios/ipa/
```

---

## Monorepo CI Considerations

### Path-Based Triggers

```yaml
# Only build mobile when mobile code changes
on:
  push:
    branches: [main]
    paths:
      - 'apps/mobile/**'
      - 'packages/shared/**'       # shared packages affect mobile
      - 'packages/api-client/**'   # API client changes affect mobile
      - 'package.json'             # dependency changes
      - 'pnpm-lock.yaml'
```

### Shared Package Change Detection

```yaml
# Detect if shared packages changed
- name: Check for shared changes
  id: changes
  uses: dorny/paths-filter@v3
  with:
    filters: |
      mobile:
        - 'apps/mobile/**'
      shared:
        - 'packages/shared/**'
        - 'packages/api-client/**'

- name: Build mobile
  if: steps.changes.outputs.mobile == 'true' || steps.changes.outputs.shared == 'true'
  run: eas build --profile preview --platform all --non-interactive
```

### Turbo Remote Caching

```bash
# Enable Turbo remote caching for faster CI builds
npx turbo login
npx turbo link

# In CI, set the TURBO_TOKEN and TURBO_TEAM env vars
# Builds that haven't changed since last successful CI run are cached
```

---

## Build Time & Cost Comparison

| Platform | iOS Build Time | Android Build Time | Cost | Best For |
|----------|---------------|-------------------|------|----------|
| **EAS Build (Expo)** | 15-30 min | 10-20 min | Free tier: 30 builds/month. $99/mo for more. | React Native / Expo projects |
| **Codemagic** | 15-25 min | 10-15 min | 500 free min/month. $95/mo for teams. | Flutter projects |
| **GitHub Actions** | 20-40 min (macOS) | 10-20 min (Linux) | macOS: $0.08/min. Linux: $0.008/min. | Any framework, existing GitHub workflow |
| **Fastlane (self-hosted)** | Depends on hardware | Depends on hardware | Free (open source), but you maintain the infra | Existing CI, complex pipelines |
| **Bitrise** | 15-30 min | 10-20 min | Free tier: 2 builds. $90/mo for teams. | Teams wanting managed mobile CI |

**Recommendation:** Use EAS Build for Expo/React Native, Codemagic for Flutter, Fastlane + GitHub Actions for native. Start with the managed service and only self-host if you hit cost or customization limits.
