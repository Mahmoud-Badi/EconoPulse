# Native Features Audit — {{PROJECT_NAME}}

> Generated during Step 5.5 of the orchestrator.
> Last updated: {{DATE}}

## Overview

**App Name:** {{PROJECT_NAME}}
**Framework:** {{FRAMEWORK}}
**Minimum iOS Version:** {{MIN_IOS_VERSION}}
**Minimum Android API Level:** {{MIN_ANDROID_API}}
**Offline Requirement:** {{ONLINE_ONLY / CACHE_FIRST / OFFLINE_FIRST}}

---

## Native API Requirements

| Service | Native APIs Needed | Priority | Implementation Notes |
|---------|-------------------|----------|---------------------|
| {{SERVICE_1}} | [push, camera, gps, biometrics, contacts, bluetooth, nfc, file-system, background-fetch, background-location] | P0/P1/P2 | |
| {{SERVICE_2}} | [...] | P0/P1/P2 | |
| {{SERVICE_3}} | [...] | P0/P1/P2 | |
| {{SERVICE_4}} | [...] | P0/P1/P2 | |

> P0 = launch blocker, P1 = needed within first month, P2 = future enhancement

---

## Permissions Matrix

### iOS Permissions

| Permission | Info.plist Key | Justification String | Required By | Request Trigger |
|-----------|---------------|---------------------|-------------|-----------------|
| Camera | `NSCameraUsageDescription` | "{{PROJECT_NAME}} needs camera access to {{CAMERA_REASON}}." | {{SERVICE}} | User taps scan/photo button |
| Photo Library | `NSPhotoLibraryUsageDescription` | "{{PROJECT_NAME}} needs access to your photo library to {{PHOTO_REASON}}." | {{SERVICE}} | User taps upload image |
| Location (Foreground) | `NSLocationWhenInUseUsageDescription` | "{{PROJECT_NAME}} uses your location to {{LOCATION_FG_REASON}}." | {{SERVICE}} | User opens map/search |
| Location (Background) | `NSLocationAlwaysAndWhenInUseUsageDescription` | "{{PROJECT_NAME}} uses your location in the background to {{LOCATION_BG_REASON}}." | {{SERVICE}} | User starts tracking flow |
| Contacts | `NSContactsUsageDescription` | "{{PROJECT_NAME}} reads your contacts to {{CONTACTS_REASON}}." | {{SERVICE}} | User taps invite friends |
| Face ID | `NSFaceIDUsageDescription` | "{{PROJECT_NAME}} uses Face ID to {{FACEID_REASON}}." | {{SERVICE}} | User enables biometric lock |
| Microphone | `NSMicrophoneUsageDescription` | "{{PROJECT_NAME}} needs microphone access to {{MIC_REASON}}." | {{SERVICE}} | User starts voice recording |
| Bluetooth | `NSBluetoothPeripheralUsageDescription` | "{{PROJECT_NAME}} uses Bluetooth to {{BLE_REASON}}." | {{SERVICE}} | User opens device pairing |
| Notifications | N/A (runtime only) | N/A | {{SERVICE}} | After first meaningful action |

<!-- IF {{NEEDS_TRACKING}} == "yes" -->
| App Tracking (ATT) | `NSUserTrackingUsageDescription` | "{{PROJECT_NAME}} uses this identifier to {{TRACKING_REASON}}." | Analytics | After onboarding |
<!-- ENDIF -->

> **Remove rows for permissions your app does not use.** Apple will reject apps that declare unused permissions.

### Android Permissions

| Permission | Manifest Declaration | Runtime Prompt? | Required By | Request Trigger |
|-----------|---------------------|----------------|-------------|-----------------|
| Camera | `<uses-permission android:name="android.permission.CAMERA"/>` | Yes | {{SERVICE}} | User taps scan/photo |
| Fine Location | `<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>` | Yes | {{SERVICE}} | User opens map |
| Coarse Location | `<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>` | Yes | {{SERVICE}} | User opens nearby search |
| Background Location | `<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/>` | Yes (separate) | {{SERVICE}} | User starts background tracking |
| Contacts | `<uses-permission android:name="android.permission.READ_CONTACTS"/>` | Yes | {{SERVICE}} | User taps invite |
| Biometrics | `<uses-permission android:name="android.permission.USE_BIOMETRIC"/>` | No (prompt IS permission) | {{SERVICE}} | User enables biometric lock |
| Bluetooth Connect | `<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>` | Yes (Android 12+) | {{SERVICE}} | User opens device pairing |
| Bluetooth Scan | `<uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>` | Yes (Android 12+) | {{SERVICE}} | User opens device scan |
| Notifications | `<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>` | Yes (Android 13+) | {{SERVICE}} | After first meaningful action |
| Microphone | `<uses-permission android:name="android.permission.RECORD_AUDIO"/>` | Yes | {{SERVICE}} | User starts voice recording |
| Internet | `<uses-permission android:name="android.permission.INTERNET"/>` | No | Core | Always |

> **Remove rows for permissions your app does not use.** Only declare permissions that are actively needed.

---

## Offline Strategy

| Service | Strategy | Local Storage | Sync Frequency | Conflict Resolution |
|---------|----------|--------------|----------------|-------------------|
| {{SERVICE_1}} | online-only / cache-first / offline-first | N/A / SQLite / MMKV / Drift / Room | N/A / on-reconnect / periodic (interval) | N/A / last-write-wins / server-wins / manual-merge |
| {{SERVICE_2}} | | | | |
| {{SERVICE_3}} | | | | |
| {{SERVICE_4}} | | | | |

### Sync Queue Design

<!-- IF {{OFFLINE_STRATEGY}} == "offline-first" -->
- **Queue location:** {{SQLITE_TABLE / MMKV_KEY}}
- **Queue processing trigger:** Network reconnection + periodic ({{INTERVAL}})
- **Retry policy:** {{RETRY_COUNT}} retries with exponential backoff
- **Dead-letter handling:** After {{MAX_RETRIES}} failures, move to dead-letter queue and notify user
- **Conflict resolution strategy:** {{STRATEGY}} — rationale: {{RATIONALE}}
<!-- ENDIF -->

<!-- IF {{OFFLINE_STRATEGY}} == "cache-first" -->
- **Cache layer:** {{TANSTACK_QUERY_PERSISTER / DIO_CACHE / CUSTOM}}
- **Cache TTL:** {{DURATION}} (staleTime: {{STALE}}, gcTime: {{GC}})
- **Cache invalidation:** {{ON_MUTATION / ON_RECONNECT / MANUAL}}
<!-- ENDIF -->

<!-- IF {{OFFLINE_STRATEGY}} == "online-only" -->
- **Cache layer:** API response cache only (TanStack Query / Dio)
- **Offline behavior:** Show cached data if available, show "No connection" message otherwise
- **No local CRUD** — all mutations require network
<!-- ENDIF -->

---

## Push Notification Channels

| Channel ID | Display Name | Trigger | Priority | Sound | Badge | Vibration |
|-----------|-------------|---------|----------|-------|-------|-----------|
| {{CHANNEL_1}} | {{DISPLAY_NAME}} | {{WHEN_SENT}} | high / default / low | yes / no | yes / no | yes / no |
| {{CHANNEL_2}} | {{DISPLAY_NAME}} | {{WHEN_SENT}} | high / default / low | yes / no | yes / no | yes / no |
| {{CHANNEL_3}} | {{DISPLAY_NAME}} | {{WHEN_SENT}} | high / default / low | yes / no | yes / no | yes / no |

### Notification Payload Structure

```json
{
  "notification": {
    "title": "{{TITLE_TEMPLATE}}",
    "body": "{{BODY_TEMPLATE}}"
  },
  "data": {
    "screen": "{{TARGET_ROUTE}}",
    "id": "{{ENTITY_ID}}",
    "type": "{{NOTIFICATION_TYPE}}"
  },
  "android": {
    "channelId": "{{CHANNEL_ID}}",
    "priority": "high"
  },
  "apns": {
    "payload": {
      "aps": {
        "badge": 1,
        "sound": "default"
      }
    }
  }
}
```

### Permission Request Timing

- **When to ask:** {{PERMISSION_TRIGGER}} (e.g., after first order placed, after first message sent)
- **Pre-permission value prop:** "{{VALUE_PROPOSITION}}"
- **If denied:** {{DENIAL_STRATEGY}} (e.g., remind after next meaningful action, max 3 attempts)
- **iOS provisional authorization:** {{YES_NO}} — rationale: {{RATIONALE}}

---

## Deep Link Routes

| Route Name | URL Pattern | Target Screen | Auth Required | Params |
|-----------|------------|--------------|---------------|--------|
| {{ROUTE_1}} | `https://{{DOMAIN}}/{{PATH}}` | {{SCREEN_NAME}} | yes / no | {{PARAM_LIST}} |
| {{ROUTE_2}} | `https://{{DOMAIN}}/{{PATH}}` | {{SCREEN_NAME}} | yes / no | {{PARAM_LIST}} |
| {{ROUTE_3}} | `https://{{DOMAIN}}/{{PATH}}` | {{SCREEN_NAME}} | yes / no | {{PARAM_LIST}} |
| {{ROUTE_4}} | `https://{{DOMAIN}}/{{PATH}}` | {{SCREEN_NAME}} | yes / no | {{PARAM_LIST}} |
| {{ROUTE_5}} | `https://{{DOMAIN}}/{{PATH}}` | {{SCREEN_NAME}} | yes / no | {{PARAM_LIST}} |

### URL Scheme

- **Development scheme:** `{{APP_SCHEME}}://` (e.g., `myapp://`)
- **Production:** Universal Links (iOS) + App Links (Android) via `https://{{DOMAIN}}/`

### Deferred Deep Linking

- **Service:** {{BRANCH_IO / EXPO_DEFERRED / NONE}}
- **Key flows requiring deferred deep links:** {{FLOW_LIST}} (e.g., referral invites, shared content links)

### Auth-Required Deep Link Handling

When a deep link targets an auth-required screen and the user is not logged in:
1. Save the target route to {{STORAGE_LOCATION}} (e.g., MMKV, AsyncStorage)
2. Redirect to login screen
3. After successful login, navigate to the saved route
4. Clear the saved route

---

## Background Tasks

| Task | iOS Mode | Android Solution | Frequency | Max Duration | Priority |
|------|---------|-----------------|-----------|-------------|----------|
| {{TASK_1}} | BGAppRefreshTask / background-location / remote-notification | WorkManager / ForegroundService | {{FREQUENCY}} | {{DURATION}} | P0/P1/P2 |
| {{TASK_2}} | | | | | |
| {{TASK_3}} | | | | | |

### Battery Optimization Strategy

- **WiFi-only operations:** {{LIST}} (e.g., large file uploads, full database sync)
- **Low battery behavior:** {{STRATEGY}} (e.g., skip non-essential syncs below 20%)
- **Adaptive scheduling:** {{YES_NO}} — reduce frequency for inactive users

---

## OTA Update Strategy

- **OTA solution:** {{EAS_UPDATE / CODEPUSH / SHOREBIRD / NONE}}
- **Update channel mapping:**
  - `development` channel -> development builds
  - `preview` channel -> staging/QA builds
  - `production` channel -> production builds
- **Default install mode:** {{BACKGROUND_NEXT_LAUNCH / PROMPT_USER / IMMEDIATE}}
- **Critical update mode:** Immediate (force restart)
- **Runtime version policy:** {{APP_VERSION / NATIVE_VERSION / FINGERPRINT / EXPLICIT}}
- **Rollback plan:** Monitor crash rate for 1 hour post-update; rollback if > 2x baseline
- **Staged rollout:** {{YES_NO}} — start at {{INITIAL_PERCENTAGE}}%, increase to 100% after {{MONITORING_PERIOD}}

---

## MVP vs Deferred

| Feature | MVP? | Rationale |
|---------|------|-----------|
| Push notifications | Yes / No | {{RATIONALE}} |
| Offline mode | Yes / No | {{RATIONALE}} |
| Camera (photo capture) | Yes / No | {{RATIONALE}} |
| Camera (barcode scanning) | Yes / No | {{RATIONALE}} |
| GPS / Location | Yes / No | {{RATIONALE}} |
| Biometric login | Yes / No | {{RATIONALE}} |
| Contacts access | Yes / No | {{RATIONALE}} |
| Bluetooth / NFC | Yes / No | {{RATIONALE}} |
| Background sync | Yes / No | {{RATIONALE}} |
| Background location | Yes / No | {{RATIONALE}} |
| Deep linking | Yes / No | {{RATIONALE}} |
| Deferred deep linking | Yes / No | {{RATIONALE}} |
| OTA updates | Yes / No | {{RATIONALE}} |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| App Store rejection for unused permission declarations | M | H | Audit Info.plist and AndroidManifest before submission; remove any unused permission strings |
| Push notification permission denial rate > 50% | M | M | Implement pre-permission dialog with clear value proposition; request after first meaningful action |
| Background task throttling by OS | H | M | Design for eventual execution; never depend on exact timing; use push notifications as fallback trigger |
| OTA update introduces crash | L | H | Staged rollout (10% -> 50% -> 100%); crash monitoring alerts; documented rollback procedure |
| Offline sync conflicts causing data loss | M | H | Choose conflict resolution strategy before implementation; add sync status indicator in UI |
| Deep link AASA/assetlinks caching delays | M | L | Configure AASA file before app launch; use developer mode for testing; plan 48-hour buffer for changes |
| Battery drain from background location | M | H | Use balanced accuracy (not high); increase distance interval; respect battery saver mode |
| Biometric auth failing on older devices | L | M | Always provide PIN/password fallback; check `canEvaluatePolicy` before offering biometrics |
| {{CUSTOM_RISK}} | H/M/L | H/M/L | {{MITIGATION}} |

---

## Sign-Off

| Reviewer | Role | Date | Status |
|----------|------|------|--------|
| {{REVIEWER_1}} | {{ROLE}} | {{DATE}} | Approved / Needs Changes |
| {{REVIEWER_2}} | {{ROLE}} | {{DATE}} | Approved / Needs Changes |

---

> **Next step:** After completing this audit, proceed to `17-mobile-deployment/` for app store submission preparation.
