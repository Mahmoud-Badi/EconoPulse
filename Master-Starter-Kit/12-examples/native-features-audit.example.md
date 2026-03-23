# TaskFlow Mobile — Native Features Audit
# ============================================================
# EXAMPLE FILE — This is a filled-in native features audit for
# a fictional TaskFlow Mobile companion app. Your audit will be
# generated during ORCHESTRATOR Step 5.5 (Mobile Native Features).
# Source template: 16-mobile-native-features/native-features-audit.template.md
# ============================================================

> Generated during Step 5.5 of the orchestrator.
> Last updated: 2026-02-20

## Overview

**App Name:** TaskFlow Mobile
**Framework:** React Native with Expo SDK 52
**Minimum iOS Version:** 16.0
**Minimum Android API Level:** 26 (Android 8.0)
**Offline Requirement:** Cache-first (task list and projects), online-only (reports and analytics)

---

## Native API Requirements

| Service | Native APIs Needed | Priority | Implementation Notes |
|---------|-------------------|----------|---------------------|
| Task Notifications | Push notifications | P0 | Task assignments, due date reminders, status changes. FCM + APNs via Expo Notifications. |
| Receipt Uploads | Camera, file-system | P1 | Attach receipt photos to expense time entries. Expo Camera + ImagePicker. |
| Secure Login | Biometrics | P0 | FaceID / TouchID / fingerprint for quick unlock after initial login. Expo LocalAuthentication. |
| Field Clock-In | GPS (foreground location) | P2 | Optional geofence check-in for field service workers. Expo Location (foreground only). |
| Offline Task Access | Local storage | P0 | Cache task list and project data for subway/airplane use. TanStack Query persister + MMKV. |

> P0 = launch blocker, P1 = needed within first month, P2 = future enhancement

---

## Permissions Matrix

### iOS Permissions

| Permission | Info.plist Key | Justification String | Required By | Request Trigger |
|-----------|---------------|---------------------|-------------|-----------------|
| Camera | `NSCameraUsageDescription` | "TaskFlow needs camera access to photograph receipts and attachments." | Receipt Uploads | User taps "Attach Photo" on a time entry |
| Photo Library | `NSPhotoLibraryUsageDescription` | "TaskFlow needs access to your photo library to attach existing images to time entries." | Receipt Uploads | User taps "Choose from Library" |
| Face ID | `NSFaceIDUsageDescription` | "TaskFlow uses Face ID for quick, secure access to your account." | Secure Login | User enables biometric lock in settings |
| Location (Foreground) | `NSLocationWhenInUseUsageDescription` | "TaskFlow uses your location to verify clock-in at job sites." | Field Clock-In | User taps "Clock In" with geofence enabled |
| Notifications | N/A (runtime only) | N/A | Task Notifications | After user creates their first task |

> Unused permission rows (Contacts, Bluetooth, Microphone, Background Location) have been removed. Apple rejects apps declaring unused permissions.

### Android Permissions

| Permission | Manifest Declaration | Runtime Prompt? | Required By | Request Trigger |
|-----------|---------------------|----------------|-------------|-----------------|
| Camera | `android.permission.CAMERA` | Yes | Receipt Uploads | User taps "Attach Photo" |
| Fine Location | `android.permission.ACCESS_FINE_LOCATION` | Yes | Field Clock-In | User taps "Clock In" |
| Biometrics | `android.permission.USE_BIOMETRIC` | No (prompt IS permission) | Secure Login | User enables biometric lock |
| Notifications | `android.permission.POST_NOTIFICATIONS` | Yes (Android 13+) | Task Notifications | After first task creation |
| Internet | `android.permission.INTERNET` | No | Core | Always |

---

## Push Notification Channels

| Channel ID | Display Name | Trigger | Priority | Sound | Badge | Vibration |
|-----------|-------------|---------|----------|-------|-------|-----------|
| `task_assigned` | Task Assignments | A task is assigned to the user | high | yes | yes | yes |
| `task_due` | Due Date Reminders | 24 hours and 1 hour before a task is due | default | yes | yes | no |
| `status_change` | Status Updates | A task the user owns or watches changes status | default | no | yes | no |
| `time_reminder` | Timesheet Reminders | Friday 4 PM if weekly hours < 32 | default | yes | no | yes |
| `comment_mention` | Mentions | User is @mentioned in a task comment | high | yes | yes | yes |

### Notification Payload Structure

```json
{
  "notification": {
    "title": "New task assigned",
    "body": "Sarah assigned you: Update API documentation"
  },
  "data": {
    "screen": "tasks/[id]",
    "id": "task_abc123",
    "type": "task_assigned"
  },
  "android": {
    "channelId": "task_assigned",
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

- **When to ask:** After the user creates their first task (demonstrates app value before asking).
- **Pre-permission value prop:** "Turn on notifications so you never miss a task assignment or deadline."
- **If denied:** Remind once after the next task assignment (max 2 retry prompts total). Show in-app badge on settings icon.
- **iOS provisional authorization:** Yes -- allows silent notifications to appear in Notification Center without prompting. Upgrade to full authorization after the user engages with a notification.

---

## Offline Strategy

| Service | Strategy | Local Storage | Sync Frequency | Conflict Resolution |
|---------|----------|--------------|----------------|-------------------|
| Task List | Cache-first | TanStack Query persister (MMKV) | On-reconnect + pull-to-refresh | Server-wins (server timestamp is source of truth) |
| Project List | Cache-first | TanStack Query persister (MMKV) | On-reconnect + pull-to-refresh | Server-wins |
| Time Entries | Cache-first | TanStack Query persister (MMKV) | On-reconnect | Last-write-wins (user is only editor of their own entries) |
| Reports & Analytics | Online-only | API response cache only | N/A | N/A |
| User Profile | Cache-first | MMKV (standalone key) | On app launch | Server-wins |

### Cache-First Configuration

```typescript
// TanStack Query + MMKV Persister setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes before refetch
      gcTime: 1000 * 60 * 60 * 24, // 24 hours before garbage collection
    },
  },
});

// Cache invalidation: on mutation success (optimistic updates for task status changes)
// Offline behavior: show cached data immediately, refetch in background when online
// No-connection fallback: banner at top of screen — "You're offline. Showing cached data."
```

---

## Deep Link Routes

| Route Name | URL Pattern | Target Screen | Auth Required | Params |
|-----------|------------|--------------|---------------|--------|
| Task Detail | `https://app.taskflow.io/tasks/:id` | `tasks/[id]` | yes | `id: string` |
| Project Detail | `https://app.taskflow.io/projects/:id` | `projects/[id]` | yes | `id: string` |
| Time Entry | `https://app.taskflow.io/time/:id` | `timesheet/[id]` | yes | `id: string` |
| Create Task | `https://app.taskflow.io/tasks/new` | `modal/create-task` | yes | `projectId?: string` |
| Invite Accept | `https://app.taskflow.io/invite/:code` | `(auth)/register` | no | `code: string` |

### URL Scheme

- **Development scheme:** `taskflow://` (e.g., `taskflow://tasks/abc123`)
- **Production:** Universal Links (iOS) + App Links (Android) via `https://app.taskflow.io/`

### Auth-Required Deep Link Handling

When a deep link targets an auth-required screen and the user is not logged in:
1. Save the target route to MMKV under `pending_deep_link` key.
2. Redirect to `(auth)/login` screen.
3. After successful login, navigate to the saved route.
4. Clear the `pending_deep_link` key.

---

## Biometric Authentication

- **Library:** `expo-local-authentication`
- **Supported methods:** FaceID (iOS), TouchID (iOS), Fingerprint (Android), Device PIN fallback
- **Flow:** After initial email/password login, prompt user to enable biometrics. On subsequent app opens, show biometric prompt before revealing content. JWT remains in SecureStore; biometrics gate access to it.
- **Fallback:** If biometric fails 3 times, fall back to full email/password login.
- **Security note:** Biometric enrollment is per-device. If the user adds a new face/fingerprint at the OS level, require re-authentication with email/password before re-enabling biometrics.

---

## Camera / Image Capture

- **Library:** `expo-camera` (direct capture), `expo-image-picker` (gallery selection)
- **Use case:** Attaching receipt photos or document scans to expense-related time entries.
- **Max resolution:** 1920x1080 (downsample before upload to reduce bandwidth).
- **Upload flow:** Capture -> preview -> crop (optional) -> compress to JPEG 80% -> upload to S3 presigned URL -> attach URL to time entry via tRPC mutation.
- **Offline behavior:** Store image locally in app cache directory. Queue upload for when connectivity returns. Show "Pending upload" indicator on the time entry.

---

## MVP vs Deferred

| Feature | MVP? | Rationale |
|---------|------|-----------|
| Push notifications | Yes | Core engagement driver -- users must know when tasks are assigned or due. |
| Offline mode (cache-first) | Yes | Mobile users frequently lose connectivity (subway, elevators, travel). Stale data is better than a blank screen. |
| Camera (receipt capture) | No | Needed within first month but not a launch blocker. Expense tracking is a v1.1 feature. |
| Biometric login | Yes | Table-stakes UX for a work app accessed multiple times daily. Eliminates password friction. |
| GPS / Location (geofence) | No | Only relevant for field-service customers. Ship as opt-in feature in v1.2. |
| Background sync | No | Cache-first with on-reconnect sync is sufficient. Background fetch adds complexity without clear user value at launch. |
| Deep linking | Yes | Required for push notification tap-through (notification -> task detail). |
| Deferred deep linking | No | Referral/invite flows are a growth feature for v2. Branch.io integration planned but not for MVP. |
| OTA updates (EAS Update) | Yes | Critical for shipping bug fixes without app store review delays. Configured from day one. |
| Contacts access | No | No invite-from-contacts feature planned. Team invites happen via email link from the web app. |
| Bluetooth / NFC | No | No hardware integration planned for TaskFlow. |
| Background location | No | Foreground-only GPS is sufficient for geofence clock-in. Background location triggers App Store scrutiny. |

---

## OTA Update Strategy

- **OTA solution:** EAS Update
- **Update channel mapping:**
  - `development` channel -> development builds (internal testers)
  - `preview` channel -> staging/QA builds (beta testers via TestFlight / Internal Testing)
  - `production` channel -> production builds (App Store / Play Store)
- **Default install mode:** Background download, apply on next launch
- **Critical update mode:** Immediate (force restart) -- reserved for security patches
- **Runtime version policy:** `appVersion` (new native build required only when native modules change)
- **Rollback plan:** Monitor Sentry crash rate for 1 hour post-update; rollback via `eas update:rollback` if crash rate exceeds 2x baseline
- **Staged rollout:** Yes -- start at 10%, increase to 50% after 4 hours, then 100% after 24 hours with no anomalies

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Push notification permission denial rate > 40% | M | H | Pre-permission screen explaining value; request after first task creation, not on app launch |
| App Store rejection for camera permission without clear use | L | H | Justification string references "receipts and attachments"; only request when user taps attach button |
| Offline cache showing stale task status | M | M | Show "Last updated X minutes ago" timestamp; auto-refetch on reconnect; pull-to-refresh on all lists |
| Biometric prompt confusing users on first launch | L | L | Only offer biometrics after successful password login; clear onboarding tooltip explaining the feature |
| Geofence GPS draining battery | M | H | Foreground-only location; balanced accuracy (not high); stop location updates immediately after clock-in confirmed |
| OTA update introducing crash on specific device | L | H | Staged rollout 10% -> 50% -> 100%; Sentry crash monitoring; documented rollback within 15 minutes |
| Deep link AASA file caching delays | M | L | Deploy AASA file to `app.taskflow.io/.well-known` 48 hours before app launch; use developer mode for QA testing |

---

## Sign-Off

| Reviewer | Role | Date | Status |
|----------|------|------|--------|
| Alex Chen | Mobile Lead | 2026-02-20 | Approved |
| Jordan Lee | Product Manager | 2026-02-20 | Approved |

---

> **Next step:** After completing this audit, proceed to `17-mobile-deployment/` for app store submission preparation.
