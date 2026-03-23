<!-- IF {{MOBILE_OFFLINE}} == "true" -->
<!-- IF {{HAS_MOBILE}} == "true" -->
---
feature: offline-mode
generated_date: {{GENERATED_DATE}}
platforms: [ios, android]
scope: mobile-only
requires: MOBILE_OFFLINE == "true"
---

# Offline Mode

{{PROJECT_NAME}} keeps a copy of your data on your device so you can keep working even without an internet connection. When you reconnect, changes sync automatically.

---

## What Works Offline

Not every feature is available offline. This table shows what you can and cannot do without an internet connection.

| Feature | Works Offline? | Notes |
|---------|---------------|-------|
| {{OFFLINE_FEATURE_1}} | Yes | {{OFFLINE_FEATURE_1_NOTE}} |
| {{OFFLINE_FEATURE_2}} | Yes | {{OFFLINE_FEATURE_2_NOTE}} |
| {{OFFLINE_FEATURE_3}} | Yes | {{OFFLINE_FEATURE_3_NOTE}} |
| {{ONLINE_ONLY_FEATURE_1}} | No | {{ONLINE_ONLY_FEATURE_1_NOTE}} |
| {{ONLINE_ONLY_FEATURE_2}} | No | {{ONLINE_ONLY_FEATURE_2_NOTE}} |
| {{ONLINE_ONLY_FEATURE_3}} | No | {{ONLINE_ONLY_FEATURE_3_NOTE}} |

**Rule of thumb:** Viewing and editing your existing {{PRIMARY_DATA_NOUN}} works offline. Anything that depends on real-time data from other users or external services requires connectivity.

### Offline Indicator

When {{PROJECT_NAME}} detects you're offline, a banner appears at the top of the screen:

![Screenshot: Offline mode banner]({{USER_DOCS_PATH}}/screenshots/ios/offline-mode/offline-banner.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, enable airplane mode, open {{PROJECT_NAME}}, navigate to the main screen, capture the offline banner at top -->

The banner disappears automatically when connectivity returns and sync completes.

---

## How Data Syncs When Connectivity Returns

When your device reconnects to the internet, {{PROJECT_NAME}} syncs your offline changes to the server automatically. You do not need to take any action.

### The Sync Process

1. {{PROJECT_NAME}} detects the restored connection (typically within a few seconds).
2. All changes made offline are uploaded to the server.
3. The latest data from the server is downloaded to your device.
4. The offline banner disappears and the sync indicator clears.

![Screenshot: Sync in progress]({{USER_DOCS_PATH}}/screenshots/ios/offline-mode/sync-in-progress.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, disable airplane mode while {{PROJECT_NAME}} has pending offline changes, capture the sync progress indicator -->

![Screenshot: Sync complete]({{USER_DOCS_PATH}}/screenshots/ios/offline-mode/sync-complete.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, wait for sync to complete after restoring connectivity, capture the success state (banner dismissed, data fresh) -->

**What you should see:** After sync completes, your data reflects both your offline changes and any changes other users made while you were offline.

### What Gets Synced First

{{PROJECT_NAME}} prioritizes sync in this order:

1. **Your pending changes** — data you created or edited while offline
2. **Deletions** — items you deleted while offline
3. **Incoming changes** — updates from the server (other users' changes, new data)

---

## Conflict Resolution

A conflict occurs when you edited something offline that another user also edited while you were disconnected. {{PROJECT_NAME}} uses a **{{CONFLICT_RESOLUTION_STRATEGY}}** strategy:

<!-- IF {{CONFLICT_RESOLUTION_STRATEGY}} == "last-write-wins" -->
### Last Write Wins

The most recent change wins. If another user saved a change after you went offline, their version is kept. Your offline change is discarded for that field.

**When this matters:** If you and a colleague both edited the same {{PRIMARY_DATA_NOUN}} description offline, the one who synced last will have their version saved.

**How to prevent this:** For critical data, coordinate with your team before working offline on shared items.
<!-- ENDIF -->

<!-- IF {{CONFLICT_RESOLUTION_STRATEGY}} == "field-level-merge" -->
### Field-Level Merge

{{PROJECT_NAME}} merges changes at the field level. If you changed the **title** and a colleague changed the **description**, both changes are preserved. A conflict only occurs when the same field was changed by both parties.

When a field-level conflict occurs:

1. A **Conflicts** badge appears on the affected item.
2. Open the item to see the conflict.
3. {{PROJECT_NAME}} shows your version and the server version side-by-side.
4. Choose which version to keep, or manually combine them.

![Screenshot: Conflict resolution screen]({{USER_DOCS_PATH}}/screenshots/ios/offline-mode/conflict-resolution.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, create an artificial conflict (edit same field on two devices), sync, navigate to the conflict resolution screen, capture it -->
<!-- ENDIF -->

<!-- IF {{CONFLICT_RESOLUTION_STRATEGY}} == "server-wins" -->
### Server Wins

When a conflict occurs, the server version always takes precedence. Your offline change for that item is discarded.

**When this matters:** This strategy is used for {{CONFLICT_RESOLUTION_SERVER_WINS_RATIONALE}} where server data is considered authoritative.

**Your offline change is not lost permanently:** It is saved in your **Sync History** (see Settings → Offline → Sync History) for {{CONFLICT_RESOLUTION_HISTORY_DAYS}} days, in case you need to reference what you changed.
<!-- ENDIF -->

### How to Know If a Conflict Occurred

{{CONFLICT_NOTIFICATION_DESCRIPTION}}

![Screenshot: Conflict notification]({{USER_DOCS_PATH}}/screenshots/ios/offline-mode/conflict-notification.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, trigger a sync conflict, capture the conflict notification or badge -->

---

## Forcing a Manual Sync

{{PROJECT_NAME}} syncs automatically, but you can trigger a manual sync at any time.

### How to Force Sync

1. Open {{PROJECT_NAME}}.
2. Go to **{{SETTINGS_LOCATION}}** → **Offline & Sync**.
3. Tap **Sync Now**.

The sync indicator in the header shows sync progress. When it disappears, sync is complete.

![Screenshot: Manual sync option]({{USER_DOCS_PATH}}/screenshots/ios/offline-mode/manual-sync.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{PROJECT_NAME}} Settings → Offline & Sync, capture the screen showing the Sync Now button -->

### Sync Status Indicator

The sync status icon in the app header tells you the current state:

| Icon | Meaning |
|------|---------|
| No icon | Synced — all data is up to date |
| Spinning indicator | Sync in progress |
| Cloud with arrow | Pending changes waiting to upload |
| Warning triangle | Sync error — tap for details |
| Slash through cloud | Offline — no internet connection |

---

## Storage Usage

Offline mode stores {{OFFLINE_STORAGE_DESCRIPTION}} on your device. Over time this can grow, particularly if you have a large account.

### Viewing Storage Usage

1. Go to **{{SETTINGS_LOCATION}}** → **Offline & Sync** → **Storage**.
2. The screen shows how much storage {{PROJECT_NAME}} is using and what is taking up space.

![Screenshot: Storage usage screen]({{USER_DOCS_PATH}}/screenshots/ios/offline-mode/storage-usage.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{PROJECT_NAME}} Settings → Offline & Sync → Storage, capture the storage breakdown screen -->

### Managing Storage

**Clear cached data:** Removes downloaded content that is not essential for offline editing (e.g., large file previews). Your offline edits are not affected.

1. Go to **{{SETTINGS_LOCATION}}** → **Offline & Sync** → **Storage**.
2. Tap **Clear Cache**.
3. Confirm the action.

**Clear all offline data:** Removes everything stored locally and performs a fresh sync. Use this if storage usage is unexpectedly large or if you're having persistent sync issues.

1. Go to **{{SETTINGS_LOCATION}}** → **Offline & Sync** → **Storage**.
2. Tap **Reset Offline Data**.
3. Confirm the action — this will trigger a full re-download of your data.

> **Warning:** Do not clear offline data while you have unsynced changes. Check the sync status first (see "Forcing a Manual Sync" above) and ensure all changes have uploaded.

<!-- IF {{OFFLINE_STORAGE_LIMIT}} != "" -->
### Storage Limit

{{PROJECT_NAME}} limits offline storage to **{{OFFLINE_STORAGE_LIMIT}}** per device. If you exceed this limit, older cached items are removed to make room for newer ones. Your data on the server is never affected.
<!-- ENDIF -->

---

## Troubleshooting: Sync Isn't Working

### Sync Has Been Pending for More Than a Few Minutes

**Possible causes:**

1. **Weak or intermittent connectivity** — Sync requires a stable connection. Try moving to a stronger Wi-Fi signal or switching from mobile data to Wi-Fi.
2. **Background sync is restricted** — On Android, battery optimization may prevent background sync. Set {{PROJECT_NAME}} battery usage to **Unrestricted** (see "Platform-Specific Notes" below).
3. **Server outage** — Check [{{PROJECT_NAME}} Status]({{STATUS_PAGE_URL}}) for any known issues.

**Solution:**

1. Confirm you have an active internet connection (open a browser and load a page).
2. Force a manual sync: **{{SETTINGS_LOCATION}}** → **Offline & Sync** → **Sync Now**.
3. If it still fails, note the error message shown and [contact support]({{SUPPORT_URL}}).

### Sync Failed With an Error

Tap the warning triangle icon (or go to **{{SETTINGS_LOCATION}}** → **Offline & Sync** → **Sync Log**) to see the error details.

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "{{SYNC_ERROR_1}}" | {{SYNC_ERROR_1_MEANING}} | {{SYNC_ERROR_1_SOLUTION}} |
| "{{SYNC_ERROR_2}}" | {{SYNC_ERROR_2_MEANING}} | {{SYNC_ERROR_2_SOLUTION}} |
| "{{SYNC_ERROR_3}}" | {{SYNC_ERROR_3_MEANING}} | {{SYNC_ERROR_3_SOLUTION}} |
| "Conflict detected" | Two versions of the same item exist | See "Conflict Resolution" section above |
| "Storage full" | Device storage is full | Free up space on your device, then sync |

### Changes Made Offline Aren't Appearing After Sync

1. Pull to refresh on the affected screen to force a data reload.
2. If changes still don't appear, check **{{SETTINGS_LOCATION}}** → **Offline & Sync** → **Sync Log** for errors.
3. If the sync log shows success but changes are missing, [contact support]({{SUPPORT_URL}}) — this may be a server-side issue.

### App Shows Stale Data

If the data in the app looks outdated:

1. Force a manual sync: **{{SETTINGS_LOCATION}}** → **Offline & Sync** → **Sync Now**.
2. Pull to refresh on the screen showing stale data.
3. If data is still stale after a successful sync, [contact support]({{SUPPORT_URL}}).

---

## Platform-Specific Notes

### iOS

- Background sync runs when the app is in the background, provided **Background App Refresh** is enabled for {{PROJECT_NAME}} in **Settings** → **General** → **Background App Refresh**.
- iOS may limit background sync frequency when the device is on low battery. Connect to power for full background sync capability.

### Android

- For reliable background sync, set {{PROJECT_NAME}} battery optimization to **Unrestricted**: **Settings** → **Apps** → **{{PROJECT_NAME}}** → **Battery** → **Unrestricted**.
- On some Android manufacturers (Samsung, Xiaomi, Huawei), aggressive battery management may kill background processes. If sync only happens when the app is open, check your device's manufacturer-specific battery settings.

---

## Related Guides

- [Mobile Onboarding]({{USER_DOCS_PATH}}/guides/mobile/onboarding.md)
- [Push Notifications]({{USER_DOCS_PATH}}/guides/mobile/push-notifications.md)
- [Account Settings]({{USER_DOCS_PATH}}/guides/account-settings.md)

---

*Last updated: {{GENERATED_DATE}} | [Report an issue]({{SUPPORT_URL}})*
<!-- ENDIF -->
<!-- ENDIF -->
