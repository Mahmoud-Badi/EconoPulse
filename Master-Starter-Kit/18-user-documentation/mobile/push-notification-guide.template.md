<!-- IF {{HAS_MOBILE}} == "true" -->
---
feature: push-notifications
generated_date: {{GENERATED_DATE}}
platforms: [ios, android]
scope: mobile-only
---

# Push Notifications

{{PROJECT_NAME}} sends push notifications to keep you informed about {{NOTIFICATION_PRIMARY_USE_CASE}}. This guide explains what notifications you'll receive, how to control them, and what to do if they stop working.

---

## What Notifications {{PROJECT_NAME}} Sends

Notifications are grouped into categories. You can enable or disable each category independently.

| Category | What Triggers It | Default State | Can Disable? |
|----------|-----------------|---------------|--------------|
| **{{NOTIFICATION_CATEGORY_1_NAME}}** | {{NOTIFICATION_CATEGORY_1_TRIGGER}} | {{NOTIFICATION_CATEGORY_1_DEFAULT}} | {{NOTIFICATION_CATEGORY_1_CAN_DISABLE}} |
| **{{NOTIFICATION_CATEGORY_2_NAME}}** | {{NOTIFICATION_CATEGORY_2_TRIGGER}} | {{NOTIFICATION_CATEGORY_2_DEFAULT}} | {{NOTIFICATION_CATEGORY_2_CAN_DISABLE}} |
| **{{NOTIFICATION_CATEGORY_3_NAME}}** | {{NOTIFICATION_CATEGORY_3_TRIGGER}} | {{NOTIFICATION_CATEGORY_3_DEFAULT}} | {{NOTIFICATION_CATEGORY_3_CAN_DISABLE}} |
| **{{NOTIFICATION_CATEGORY_4_NAME}}** | {{NOTIFICATION_CATEGORY_4_TRIGGER}} | {{NOTIFICATION_CATEGORY_4_DEFAULT}} | {{NOTIFICATION_CATEGORY_4_CAN_DISABLE}} |

### What a Notification Looks Like

**{{NOTIFICATION_CATEGORY_1_NAME}}:**

![Screenshot: Example notification — {{NOTIFICATION_CATEGORY_1_NAME}}]({{USER_DOCS_PATH}}/screenshots/ios/push-notifications/example-{{NOTIFICATION_CATEGORY_1_SLUG}}.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, trigger a {{NOTIFICATION_CATEGORY_1_NAME}} notification with the app in background, capture the notification banner on the lock screen -->

**{{NOTIFICATION_CATEGORY_2_NAME}}:**

![Screenshot: Example notification — {{NOTIFICATION_CATEGORY_2_NAME}}]({{USER_DOCS_PATH}}/screenshots/ios/push-notifications/example-{{NOTIFICATION_CATEGORY_2_SLUG}}.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, trigger a {{NOTIFICATION_CATEGORY_2_NAME}} notification, capture the notification banner -->

---

## Enabling Notifications

If you skipped notifications during onboarding, or if they were accidentally disabled, here's how to turn them back on.

### In the App

1. Open {{PROJECT_NAME}}.
2. Tap **{{SETTINGS_ICON_LABEL}}** ({{SETTINGS_LOCATION}}).
3. Tap **Notifications**.
4. Toggle **Enable Notifications** on.

If the toggle is grayed out, the system permission has been revoked. Follow the steps below for your platform to re-enable it.

![Screenshot: In-app notification settings]({{USER_DOCS_PATH}}/screenshots/ios/push-notifications/in-app-settings.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{PROJECT_NAME}} Settings → Notifications, capture the full screen -->

### Enabling in iOS Settings

If notifications are off in iPhone Settings:

1. Open the **Settings** app on your iPhone.
2. Scroll down and tap **{{PROJECT_NAME}}**.
3. Tap **Notifications**.
4. Toggle **Allow Notifications** on.
5. Choose the alert style you prefer (Lock Screen, Notification Center, Banners).

![Screenshot: iOS system notification settings for {{PROJECT_NAME}}]({{USER_DOCS_PATH}}/screenshots/ios/push-notifications/ios-system-settings.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to iPhone Settings → {{PROJECT_NAME}} → Notifications, capture the full settings screen -->

### Enabling on Android

If notifications are off in Android Settings:

1. Open the **Settings** app on your Android device.
2. Tap **Apps** (or **Application Manager** on some devices).
3. Find and tap **{{PROJECT_NAME}}**.
4. Tap **Notifications**.
5. Toggle **Show Notifications** on.

<!-- IF {{ANDROID_HAS_CHANNELS}} == "true" -->
You can also control individual notification categories (channels) from this screen.
<!-- ENDIF -->

![Screenshot: Android notification settings for {{PROJECT_NAME}}]({{USER_DOCS_PATH}}/screenshots/android/push-notifications/android-system-settings.png)
<!-- SCREENSHOT_PENDING: platform=android, device=Pixel 7, navigate to Settings → Apps → {{PROJECT_NAME}} → Notifications, capture the full settings screen -->

---

## Disabling Notifications

### Turn Off All Notifications

Follow the same steps as "Enabling Notifications" above but toggle notifications **off** instead.

### Turn Off Specific Categories

You can silence specific notification types while keeping others active.

**In {{PROJECT_NAME}}:**

1. Open {{PROJECT_NAME}}.
2. Go to **{{SETTINGS_LOCATION}}** → **Notifications**.
3. Each notification category has its own toggle. Turn off any categories you don't want.

![Screenshot: Per-category notification settings]({{USER_DOCS_PATH}}/screenshots/ios/push-notifications/category-settings.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{PROJECT_NAME}} Settings → Notifications, scroll to show all category toggles, capture -->

<!-- IF {{ANDROID_HAS_CHANNELS}} == "true" -->
**On Android (via system channels):**

Android also lets you manage categories from the system notification settings:

1. Go to **Settings** → **Apps** → **{{PROJECT_NAME}}** → **Notifications**.
2. Each notification channel appears as a separate entry.
3. Toggle individual channels on or off.
<!-- ENDIF -->

---

## Customizing Notification Preferences

### Notification Delivery Timing

<!-- IF {{NOTIFICATION_HAS_QUIET_HOURS}} == "true" -->
**Quiet Hours:** You can set a time window during which {{PROJECT_NAME}} will not send notifications.

1. Go to **{{SETTINGS_LOCATION}}** → **Notifications** → **Quiet Hours**.
2. Toggle **Quiet Hours** on.
3. Set your **Start time** and **End time**.
4. Notifications that arrive during quiet hours are held and delivered after the quiet window ends.

![Screenshot: Quiet hours settings]({{USER_DOCS_PATH}}/screenshots/ios/push-notifications/quiet-hours.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{PROJECT_NAME}} Settings → Notifications → Quiet Hours, capture the settings screen -->
<!-- ENDIF -->

### Notification Sound and Badge

**On iOS:** Control sounds, badges, and banners from **iPhone Settings** → **{{PROJECT_NAME}}** → **Notifications**.

**On Android:** Control sounds and vibration per notification channel from **Settings** → **Apps** → **{{PROJECT_NAME}}** → **Notifications** → select a channel.

### Frequency Controls

<!-- IF {{NOTIFICATION_HAS_FREQUENCY_CONTROL}} == "true" -->
For high-volume notification types, {{PROJECT_NAME}} lets you control how often you're notified:

| Option | Behavior |
|--------|----------|
| **Immediately** | Notify as soon as the event occurs |
| **Digest (hourly)** | Group events into one notification per hour |
| **Digest (daily)** | One summary notification per day at {{DAILY_DIGEST_TIME}} |

Set this per-category in **{{SETTINGS_LOCATION}}** → **Notifications** → **{{NOTIFICATION_FREQUENCY_CATEGORY}}** → **Frequency**.
<!-- ENDIF -->

---

## Platform-Specific Settings Paths

| Setting | iOS Path | Android Path |
|---------|----------|--------------|
| Enable/disable all notifications | Settings → {{PROJECT_NAME}} → Notifications → Allow Notifications | Settings → Apps → {{PROJECT_NAME}} → Notifications → Show Notifications |
| Notification sound | Settings → {{PROJECT_NAME}} → Notifications → Sounds | Settings → Apps → {{PROJECT_NAME}} → Notifications → [channel] → Sound |
| Notification badges | Settings → {{PROJECT_NAME}} → Notifications → Badges | Settings → Apps → {{PROJECT_NAME}} → Notifications → [channel] → Badge |
| Lock screen visibility | Settings → {{PROJECT_NAME}} → Notifications → Show Previews | Settings → Apps → {{PROJECT_NAME}} → Notifications → [channel] → On lock screen |
| In-app preferences | {{PROJECT_NAME}} → {{SETTINGS_LOCATION}} → Notifications | {{PROJECT_NAME}} → {{SETTINGS_LOCATION}} → Notifications |

---

## Troubleshooting: Not Receiving Notifications?

Work through these steps in order. Most notification issues are caused by one of the first three.

### Step 1: Check System Permission

Make sure the system permission is granted (see "Enabling Notifications" above for both platforms).

### Step 2: Check In-App Settings

Open {{PROJECT_NAME}} → **{{SETTINGS_LOCATION}}** → **Notifications** and confirm the relevant categories are toggled on.

### Step 3: Check Internet Connectivity

Notifications require an active internet connection to be received. If the device is offline, notifications will queue and deliver when connectivity returns.

### Step 4: Check Do Not Disturb / Focus Mode

**iOS:** Check **Control Center** for the Focus or Do Not Disturb icon. If active, {{PROJECT_NAME}} may be silenced. You can allow {{PROJECT_NAME}} to break through a Focus by going to **Settings** → **Focus** → select your Focus mode → **Apps** → add {{PROJECT_NAME}}.

**Android:** Pull down the notification shade and check for a Do Not Disturb icon. Go to **Settings** → **Sound & Vibration** → **Do Not Disturb** to configure exceptions.

### Step 5: Check Battery Optimization (Android)

Android may restrict {{PROJECT_NAME}} from receiving notifications in the background when battery optimization is aggressive:

1. Go to **Settings** → **Apps** → **{{PROJECT_NAME}}** → **Battery**.
2. Select **Unrestricted** (not "Optimized" or "Restricted").

### Step 6: Reinstall the App

If none of the above resolves the issue, try removing and reinstalling {{PROJECT_NAME}}. This resets the device token registration.

1. Uninstall {{PROJECT_NAME}}.
2. Reinstall from the [App Store]({{APP_STORE_URL}}) or [Play Store]({{PLAY_STORE_URL}}).
3. Sign in and go through the notification permission step again.

### Step 7: Contact Support

If notifications still aren't working, [contact support]({{SUPPORT_URL}}) with:
- Your device model and OS version
- The notification category that isn't working
- Whether you've completed all steps above

---

## Frequently Asked Questions

### Why am I getting too many notifications?

Go to **{{SETTINGS_LOCATION}}** → **Notifications** and disable categories you don't need, or switch high-volume categories to a digest mode.

### Can I get notifications on my Apple Watch or Android Wear?

Notifications from {{PROJECT_NAME}} mirror to your watch automatically if your phone and watch are connected and your watch mirrors phone notifications.

### Why do some notifications show on my lock screen and others don't?

This is controlled by your iOS or Android notification settings for {{PROJECT_NAME}}. On iOS, go to **Settings** → **{{PROJECT_NAME}}** → **Notifications** → **Show on Lock Screen**. On Android, go to **Settings** → **Apps** → **{{PROJECT_NAME}}** → **Notifications** → select a channel → **On lock screen**.

### I turned on notifications but never received any. Is something wrong?

Some notification categories only trigger when specific events occur (e.g., someone assigns a task to you). Confirm the event has occurred, then wait up to a minute for delivery. If the event occurred and no notification arrived, see the Troubleshooting section above.

---

## Related Guides

- [Mobile Onboarding]({{USER_DOCS_PATH}}/guides/mobile/onboarding.md)
<!-- IF {{MOBILE_OFFLINE}} == "true" -->
- [Offline Mode]({{USER_DOCS_PATH}}/guides/mobile/offline-mode.md)
<!-- ENDIF -->
- [Account Settings]({{USER_DOCS_PATH}}/guides/account-settings.md)

---

*Last updated: {{GENERATED_DATE}} | [Report an issue]({{SUPPORT_URL}})*
<!-- ENDIF -->
