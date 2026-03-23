<!-- IF {{HAS_MOBILE}} == "true" -->
# Mobile Screenshot Capture Guide

How to capture screenshots from iOS Simulator and Android Emulator for user documentation and App Store listings.

---

## Capture Commands by Platform

### iOS Simulator

```bash
# Capture screenshot from currently booted simulator
xcrun simctl io booted screenshot {output_path}

# Capture with specific device
xcrun simctl io {device_uuid} screenshot {output_path}

# List available simulators
xcrun simctl list devices available

# Boot a specific simulator
xcrun simctl boot "iPhone 15"
```

### Android Emulator

```bash
# Capture screenshot from connected device/emulator
adb exec-out screencap -p > {output_path}

# Capture with specific device (if multiple connected)
adb -s {device_serial} exec-out screencap -p > {output_path}

# List connected devices
adb devices
```

### React Native / Expo

```bash
# For Expo web export (can use Playwright)
npx expo start --web
# Then use Playwright to capture at mobile viewport sizes

# For native screens, use simulator commands above
npx expo run:ios
# Then: xcrun simctl io booted screenshot {path}

npx expo run:android
# Then: adb exec-out screencap -p > {path}
```

### Flutter

```bash
# Capture from connected device/emulator
flutter screenshot --out={output_path}

# Run on specific device
flutter run -d {device_id}
flutter screenshot --out={output_path}
```

---

## Device Sizes for Documentation Screenshots

These are the primary sizes for user documentation (not store listings):

| Device | Resolution | Platform | Use For |
|--------|-----------|----------|---------|
| iPhone 15 | 390x844 | iOS | Primary mobile doc screenshots |
| Pixel 7 | 412x915 | Android | Primary mobile doc screenshots |
| iPad Pro 11" | 834x1194 | iOS | Tablet screenshots (if tablet support) |
| Android Tablet | 800x1280 | Android | Tablet screenshots (if tablet support) |

---

## App Store Screenshot Requirements

These are for the store listings, separate from documentation screenshots. Store screenshots may have text overlays, device frames, and backgrounds added by a designer.

### Apple App Store

| Device Class | Required Size | Mandatory? |
|-------------|--------------|-----------|
| iPhone 6.7" (15 Pro Max) | 1290x2796 | Yes (required for submission) |
| iPhone 6.5" (14 Plus) | 1284x2778 | Yes |
| iPhone 5.5" (SE/8 Plus) | 1242x2208 | Required if supporting older devices |
| iPad Pro 12.9" (6th gen) | 2048x2732 | Required if universal app |
| iPad Pro 11" | 1668x2388 | Optional |

**Count:** Up to 10 screenshots per device class per localization.

### Google Play Store

| Requirement | Value |
|------------|-------|
| Minimum size | 320px on any side |
| Maximum size | 3840px on any side |
| Aspect ratio | 16:9 or 9:16 |
| Recommended phone | 1080x1920 (standard) |
| Recommended tablet | 1200x1920 (7" tablet) |
| Format | JPEG or PNG (24-bit, no alpha) |

**Count:** 2-8 screenshots per device type.

---

## Screenshot Ordering Strategy

The order of screenshots in the App Store / Play Store matters — users see the first 2-3 without scrolling.

| Position | What to Show | Why |
|----------|-------------|-----|
| 1 | **Hero shot** — the core value proposition screen | First impression, most important |
| 2 | **Primary workflow** — the main thing users do daily | Shows utility |
| 3 | **Key differentiator** — what makes your app unique | Competitive edge |
| 4 | **Social proof or dashboard** — data/insights view | Shows depth |
| 5+ | **Additional features** — secondary workflows | Shows breadth |

---

## Capture Workflow for Mobile

The `/capture-screenshots` skill follows this workflow for mobile:

1. **Check platform availability:**
   - iOS: `xcrun simctl list devices available | grep "Booted"` — is a simulator running?
   - Android: `adb devices` — is an emulator/device connected?

2. **Build and install the app** (if not already running):
   - iOS: `npx expo run:ios` or `npx react-native run-ios`
   - Android: `npx expo run:android` or `npx react-native run-android`

3. **Navigate to each screen:**
   - Deep links (preferred): `xcrun simctl openurl booted {deep_link}` (iOS) or `adb shell am start -a android.intent.action.VIEW -d {deep_link}` (Android)
   - If no deep links: describe manual navigation steps in the manifest

4. **Set up the screen state** (apply filters, load specific data, etc.)

5. **Wait for load** (fixed delay or check for specific UI element)

6. **Capture**

7. **Move to next screen**

---

## Fallback: Manual Capture Checklist

If simulators/emulators are not available (e.g., building on a machine without Xcode or Android Studio), generate a manual checklist:

```markdown
## Mobile Screenshot Checklist

### iOS (iPhone 15)
- [ ] Open {{PROJECT_NAME}} on iOS Simulator (iPhone 15)
- [ ] Navigate to Invoice List
  - State: 5+ invoices visible, mixed statuses
  - Save to: user_docs/screenshots/ios/invoices/list-default.png

### Android (Pixel 7)
- [ ] Open {{PROJECT_NAME}} on Android Emulator (Pixel 7)
- [ ] Navigate to Invoice List
  - State: 5+ invoices visible, mixed statuses
  - Save to: user_docs/screenshots/android/invoices/list-default.png
```

---

## Quality Standards for Mobile Screenshots

- **Device frame:** Do NOT add device frames to documentation screenshots. Clean captures only. Device frames are for App Store marketing screenshots only.
- **Status bar:** Include the status bar (it confirms the platform to the reader)
- **Navigation bar:** Include the bottom navigation bar (shows app navigation context)
- **Seed data:** Same seed data as web screenshots for consistency
- **Dark mode:** If the app supports it, capture both light and dark variants
- **Permissions dialogs:** DO capture permission request dialogs — users need to see what to expect
<!-- ENDIF -->
