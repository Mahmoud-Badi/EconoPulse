<!-- IF {{HAS_MOBILE}} == "true" -->
---
role: {{USER_ROLE}}
generated_date: {{GENERATED_DATE}}
platforms: [ios, android]
scope: mobile-onboarding
---

# Getting Started with {{PROJECT_NAME}} on Mobile

Welcome to {{PROJECT_NAME}}! This guide covers your first launch experience on the mobile app — including permissions, account setup, and your first sync.

> **Already using {{PROJECT_NAME}} on the web?** Your account carries over automatically. Sign in with the same email and password.

---

## Download the App

- **iPhone / iPad:** [Download on the App Store]({{APP_STORE_URL}})
- **Android:** [Get it on Google Play]({{PLAY_STORE_URL}})

---

## First Launch

When you open {{PROJECT_NAME}} for the first time, the app walks you through a short setup sequence. Each step only takes a moment.

### Sign In or Create an Account

If you already have a {{PROJECT_NAME}} account, tap **Sign In** and enter your credentials. If you're new, tap **Create Account** and follow the prompts.

![Screenshot: Sign in screen]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/sign-in.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, first launch state (app not logged in), capture the sign-in screen -->

**What you should see:** The {{PROJECT_NAME}} sign-in screen with options to sign in or create an account.

---

## Permissions

The app will request access to certain device features during setup. Here is what it asks for and why.

> **Why we explain first:** iOS requires you to make a permission decision the moment the system dialog appears — you cannot easily change it later without visiting Settings. Understanding the reason before the dialog appears helps you make an informed choice.

### {{PERMISSION_1_NAME}} ({{PERMISSION_1_TYPE}})

**Why {{PROJECT_NAME}} needs this:** {{PERMISSION_1_WHY}}

**What happens if you decline:** {{PERMISSION_1_DECLINE_CONSEQUENCE}}

![Screenshot: {{PERMISSION_1_NAME}} permission prompt — in-app explanation]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/permission-{{PERMISSION_1_SLUG}}-pre.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to onboarding permission explanation screen for {{PERMISSION_1_NAME}}, capture before system dialog appears -->

![Screenshot: {{PERMISSION_1_NAME}} system permission dialog]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/permission-{{PERMISSION_1_SLUG}}-dialog.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, trigger {{PERMISSION_1_NAME}} permission system dialog, capture it before tapping Allow or Don't Allow -->

<!-- IF {{HAS_PERMISSION_2}} == "true" -->
### {{PERMISSION_2_NAME}} ({{PERMISSION_2_TYPE}})

**Why {{PROJECT_NAME}} needs this:** {{PERMISSION_2_WHY}}

**What happens if you decline:** {{PERMISSION_2_DECLINE_CONSEQUENCE}}

![Screenshot: {{PERMISSION_2_NAME}} permission prompt — in-app explanation]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/permission-{{PERMISSION_2_SLUG}}-pre.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to onboarding permission explanation screen for {{PERMISSION_2_NAME}}, capture before system dialog appears -->

![Screenshot: {{PERMISSION_2_NAME}} system permission dialog]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/permission-{{PERMISSION_2_SLUG}}-dialog.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, trigger {{PERMISSION_2_NAME}} permission system dialog, capture it -->
<!-- ENDIF -->

<!-- IF {{HAS_PERMISSION_3}} == "true" -->
### {{PERMISSION_3_NAME}} ({{PERMISSION_3_TYPE}})

**Why {{PROJECT_NAME}} needs this:** {{PERMISSION_3_WHY}}

**What happens if you decline:** {{PERMISSION_3_DECLINE_CONSEQUENCE}}

![Screenshot: {{PERMISSION_3_NAME}} system permission dialog]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/permission-{{PERMISSION_3_SLUG}}-dialog.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, trigger {{PERMISSION_3_NAME}} permission system dialog, capture it -->
<!-- ENDIF -->

### Changing Permissions Later

If you declined a permission and want to enable it later:

<!-- IF {{PLATFORM_SCOPE}} == "ios" || {{PLATFORM_SCOPE}} == "cross-platform" -->
**iOS:** Open the iPhone **Settings** app → scroll to **{{PROJECT_NAME}}** → toggle the permission on.
<!-- ENDIF -->

<!-- IF {{PLATFORM_SCOPE}} == "android" || {{PLATFORM_SCOPE}} == "cross-platform" -->
**Android:** Open **Settings** → **Apps** → **{{PROJECT_NAME}}** → **Permissions** → enable the permission.
<!-- ENDIF -->

---

## Biometric Authentication

{{PROJECT_NAME}} supports biometric sign-in so you can unlock the app quickly without typing your password each time.

<!-- IF {{PLATFORM_SCOPE}} == "ios" || {{PLATFORM_SCOPE}} == "cross-platform" -->
### Setting Up Face ID or Touch ID (iOS)

After signing in, the app will offer to set up biometric authentication.

1. Tap **Set Up Face ID** (or **Touch ID** on supported devices).
2. Follow the on-screen prompt from iOS to confirm your biometric.
3. The app will use your biometric for all future sign-ins on this device.

![Screenshot: Biometric setup prompt]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/biometric-setup.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to biometric setup screen during onboarding, capture the app's own prompt before the system Face ID dialog -->

**What you should see:** A confirmation screen that Face ID / Touch ID is now active.

> **Tip:** If you skip this step, you can enable it later in **{{PROJECT_NAME}}** → **Settings** → **Security** → **Biometric Sign-In**.
<!-- ENDIF -->

<!-- IF {{PLATFORM_SCOPE}} == "android" || {{PLATFORM_SCOPE}} == "cross-platform" -->
### Setting Up Fingerprint or Face Unlock (Android)

After signing in, the app will offer to set up biometric authentication.

1. Tap **Set Up Biometric Sign-In**.
2. Authenticate once with your device's fingerprint or face to confirm.
3. Tap **Enable** on the confirmation dialog.

![Screenshot: Biometric setup prompt on Android]({{USER_DOCS_PATH}}/screenshots/android/onboarding/biometric-setup.png)
<!-- SCREENSHOT_PENDING: platform=android, device=Pixel 7, navigate to biometric setup screen during onboarding, capture the in-app setup screen -->

> **Note:** Your device must have biometrics configured in Android Settings before {{PROJECT_NAME}} can use them.
<!-- ENDIF -->

---

## Push Notifications

{{PROJECT_NAME}} can send you notifications for {{NOTIFICATION_PRIMARY_USE_CASE}}.

> We ask for notification permission **after** you've seen what the app does — not on your very first launch. You can always change your mind later.

### Why Enable Notifications

{{NOTIFICATION_VALUE_PROPOSITION}}

For a full list of what notifications {{PROJECT_NAME}} sends, see the [Push Notifications Guide]({{USER_DOCS_PATH}}/guides/mobile/push-notifications.md).

### The Permission Prompt

When the opt-in screen appears:

1. Read the explanation of what kinds of notifications you'll receive.
2. Tap **Enable Notifications** to allow them, or **Maybe Later** to skip.

If you tap "Enable Notifications", your device shows the system permission dialog:

![Screenshot: Notification opt-in — in-app explanation]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/notification-pre.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to notification opt-in screen during onboarding, capture the in-app explanation screen before system dialog -->

![Screenshot: Notification permission dialog (iOS)]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/notification-dialog.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, trigger the notification permission system dialog, capture it before the user taps -->

**Tap "Allow"** to receive notifications.

<!-- IF {{PLATFORM_SCOPE}} == "android" || {{PLATFORM_SCOPE}} == "cross-platform" -->
> **Android 13 and above:** Android also shows a permission dialog for notifications. On Android 12 and earlier, notifications are enabled by default.

![Screenshot: Notification permission dialog (Android)]({{USER_DOCS_PATH}}/screenshots/android/onboarding/notification-dialog.png)
<!-- SCREENSHOT_PENDING: platform=android, device=Pixel 7 (Android 13+), trigger the notification permission dialog, capture it -->
<!-- ENDIF -->

---

<!-- IF {{MOBILE_OFFLINE}} == "true" -->
## Initial Data Sync

{{PROJECT_NAME}} downloads your data for offline access the first time you sign in. This means the app works even when you don't have an internet connection.

### What Gets Downloaded

{{OFFLINE_INITIAL_SYNC_DATA_DESCRIPTION}}

### How Long It Takes

The initial download typically takes **{{OFFLINE_INITIAL_SYNC_DURATION}}** on a Wi-Fi connection. On a mobile data connection it may take longer.

> **Tip:** Complete the initial sync on Wi-Fi to avoid using mobile data.

![Screenshot: Initial sync in progress]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/initial-sync.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, sign in on a fresh install, capture the initial sync progress screen -->

**What you should see:** A progress indicator showing data downloading. The app becomes fully usable once this completes.

### If Sync Is Interrupted

If you close the app or lose connectivity during the initial sync, it will resume automatically the next time you open the app with an internet connection.

For more details on how offline mode works, see the [Offline Mode Guide]({{USER_DOCS_PATH}}/guides/mobile/offline-mode.md).
<!-- ENDIF -->

---

## The Onboarding Tour

After setup, the app offers a brief guided tour of its key features.

- Swipe through the tour screens to see how the main features work.
- Tap **Skip** at any point to jump straight into the app.
- You can access the tour again later from **Settings** → **Take a Tour**.

![Screenshot: Onboarding tour — screen 1]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/tour-1.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, reach the onboarding tour (post-setup), capture the first tour card -->

![Screenshot: Onboarding tour — screen 2]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/tour-2.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, swipe to second tour card, capture it -->

---

## Platform-Specific Setup Notes

<!-- IF {{PLATFORM_SCOPE}} == "ios" || {{PLATFORM_SCOPE}} == "cross-platform" -->
### iOS

| Setting | Location | Default |
|---------|----------|---------|
| Notifications | Settings → {{PROJECT_NAME}} → Notifications | On (if permitted) |
| Background App Refresh | Settings → General → Background App Refresh → {{PROJECT_NAME}} | On |
| Siri & Search | Settings → {{PROJECT_NAME}} → Siri & Search | Off |

**Background App Refresh:** Enabling this allows {{PROJECT_NAME}} to refresh data in the background so your content is up to date when you open the app. It uses minimal battery and data.
<!-- ENDIF -->

<!-- IF {{PLATFORM_SCOPE}} == "android" || {{PLATFORM_SCOPE}} == "cross-platform" -->
### Android

| Setting | Location | Default |
|---------|----------|---------|
| Notifications | Settings → Apps → {{PROJECT_NAME}} → Notifications | On (if permitted) |
| Battery optimization | Settings → Apps → {{PROJECT_NAME}} → Battery → Unrestricted | Optimized |
| Background data | Settings → Apps → {{PROJECT_NAME}} → Mobile data → Background data | On |

**Battery optimization:** If {{PROJECT_NAME}} is battery-optimized by Android, background sync and notifications may be delayed. For the best experience, set battery optimization to **Unrestricted**.
<!-- ENDIF -->

---

## What's Next?

Now that you're set up, here's where to go:

- [{{GUIDE_1_TITLE}}]({{USER_DOCS_PATH}}/guides/{{GUIDE_1_SLUG}}.md) — {{GUIDE_1_DESCRIPTION}}
- [{{GUIDE_2_TITLE}}]({{USER_DOCS_PATH}}/guides/{{GUIDE_2_SLUG}}.md) — {{GUIDE_2_DESCRIPTION}}
- [Push Notifications]({{USER_DOCS_PATH}}/guides/mobile/push-notifications.md) — Customize what alerts you receive
<!-- IF {{MOBILE_OFFLINE}} == "true" -->
- [Offline Mode]({{USER_DOCS_PATH}}/guides/mobile/offline-mode.md) — Learn how offline access works
<!-- ENDIF -->

---

## Need Help?

- Browse our [FAQ]({{USER_DOCS_PATH}}/faq/)
- Check [Troubleshooting]({{USER_DOCS_PATH}}/troubleshooting/)
- [Contact Support]({{SUPPORT_URL}})

---

*Last updated: {{GENERATED_DATE}}*
<!-- ENDIF -->
