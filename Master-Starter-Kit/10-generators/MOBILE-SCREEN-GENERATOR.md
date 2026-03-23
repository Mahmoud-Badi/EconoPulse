# Mobile Screen Catalog Generator

**Purpose:** Create a master catalog of all mobile screens in the application by reading
service specs, hub files, and the native features audit, then consolidating into a single
navigable document with platform-specific details and summary statistics.

**Output:** `dev_docs/mobile-screen-catalog.md`

---

## When to Run

Run this generator:

- After service hub files are created (by SERVICE-HUB-GENERATOR)
- After the native features audit (Step 5.5) is complete
- After adding new mobile screens to the application
- At sprint planning to identify which mobile screens remain to be built

---

## Inputs Required

| Input | Location | What it provides |
| ----- | -------- | ---------------- |
| Service hub files | `dev_docs/services/*.md` | Screens table per service |
| Native features audit | `dev_docs/mobile/native-features-audit.md` | Native API requirements per service |
| Mobile architecture | `dev_docs/mobile-architecture.md` | Framework, navigation structure |
| Web screen catalog | `dev_docs/specs/screen-catalog.md` | Web screens to mirror or adapt |
| Task files | `dev_docs/tasks/` | Task IDs assigned to mobile screens |

---

## Screen Classification

For each mobile screen, determine:

| Field | Values | Description |
| ----- | ------ | ----------- |
| **Name** | Descriptive name | e.g., "Trip List", "Driver Dashboard" |
| **Route** | In-app route | e.g., `/(tabs)/trips`, `/trips/[id]` |
| **Deep Link** | Universal link | e.g., `myapp://trips/123` |
| **Service** | Parent service | e.g., "Trip Management", "Auth" |
| **Type** | See type table | Screen archetype |
| **Platform** | iOS / Android / Both | Target platform(s) |
| **Complexity** | S, M, L, XL | Implementation effort |
| **Status** | See status table | Current build state |
| **Native APIs** | List | e.g., "GPS, Push" or "None" |
| **Offline** | Online / Cached / Offline-first | Offline strategy |
| **Task ID** | Task reference | e.g., MOBILE-101 |

### Mobile Screen Types

| Type | Description | Typical Components |
| ---- | ----------- | ------------------ |
| **List** | Scrollable data list with search, filter, infinite scroll | FlatList, SearchBar, FilterChips, PullToRefresh |
| **Detail** | Single entity view, often with tabs or sections | ScrollView, Tabs, ActionButtons, StatusBadge |
| **Form (Create)** | Input form for creating new entities | TextInput, Picker, DatePicker, validation |
| **Form (Edit)** | Same as create but pre-populated | Same as Create + data loading |
| **Dashboard** | KPI cards, charts, activity feed | KPICard, Chart, ActivityList |
| **Settings** | Configuration panels, toggles | Switch, Picker, Section headers |
| **Map** | Map view with markers, routes, tracking | MapView, Markers, UserLocation |
| **Camera** | Camera capture, barcode scanning | CameraView, Overlay, CaptureButton |
| **Chat** | Message list with input | FlatList (inverted), MessageBubble, TextInput |
| **Auth** | Login, register, forgot password | TextInput, Button, social login buttons |
| **Onboarding** | Swipeable introduction screens | PagerView, PageIndicator, SkipButton |

### Screen Status

| Status | Meaning |
| ------ | ------- |
| **Done** | Fully functional, handles all states, tested on both platforms |
| **WIP** | Partially built, some functionality works |
| **Stub** | Route exists, minimal placeholder content |
| **Not Built** | Identified in specs but no code exists |
| **Web Only** | Screen exists on web but not needed on mobile |
| **Mobile Only** | Screen needed on mobile but not on web |

### Complexity Guide

| Complexity | Hours | Characteristics |
| ---------- | ----- | --------------- |
| S | 1-2h | Simple layout, few inputs, no native APIs, no offline |
| M | 2-4h | Standard CRUD, moderate state, form validation, basic native API |
| L | 4-8h | Multi-section, complex gestures, native API integration, offline support |
| XL | 8-16h | Map views, camera integration, real-time updates, complex offline sync |

---

## Generation Algorithm

1. **Read all service hub files.** Extract the Screens table from each. Identify which screens have mobile equivalents.

2. **Read the web screen catalog.** For each web screen, determine:
   - Does this screen need a mobile equivalent? (Most list/detail/form screens do)
   - Is the mobile version identical, simplified, or completely different?
   - Are there mobile-only screens not in the web catalog? (e.g., camera scanner, map tracking)

3. **Read the native features audit.** Map native API requirements to screens:
   - GPS → map screens, tracking screens
   - Camera → scanner screens, photo capture screens
   - Push → notification center screen, deep link target screens
   - Biometrics → login screen (biometric unlock)

4. **Cross-reference with mobile architecture.** Verify:
   - Navigation structure matches screen list (every screen has a route)
   - Deep link routes are registered for key screens
   - Offline strategy per screen matches the audit

5. **Assign task IDs.** For screens without task IDs:
   - Check `dev_docs/tasks/` for matching mobile tasks
   - If no task exists, flag as "Needs Task" with suggested phase

6. **Calculate statistics** per service, per platform, and overall.

7. **Write the catalog** in the format below.

---

## Catalog Output Format

Write to `dev_docs/mobile-screen-catalog.md`:

```markdown
# Mobile Screen Catalog

> **Framework:** {{MOBILE_FRAMEWORK}}
> **Platforms:** {{MOBILE_PLATFORMS}}
> **Total Screens:** {N}
> **Done:** {n} | **WIP:** {n} | **Stub:** {n} | **Not Built:** {n}
> **Last Updated:** {date}

---

## Summary by Service

| Service | Total | Done | WIP | Stub | Not Built | Mobile Only |
| ------- | ----- | ---- | --- | ---- | --------- | ----------- |
| Auth | {n} | {n} | {n} | {n} | {n} | {n} |
| {{Service}} | {n} | {n} | {n} | {n} | {n} | {n} |
| **Total** | **{N}** | **{n}** | **{n}** | **{n}** | **{n}** | **{n}** |

---

## Summary by Type

| Type | Count | Native APIs Used |
| ---- | ----- | ---------------- |
| List | {n} | None |
| Detail | {n} | None |
| Form | {n} | Camera (document scan) |
| Dashboard | {n} | None |
| Map | {n} | GPS |
| Camera | {n} | Camera |
| Auth | {n} | Biometrics |

---

## Full Screen List

### {{Service Name}}

| # | Screen | Route | Deep Link | Type | Platform | Complexity | Status | Native APIs | Offline | Task ID |
| - | ------ | ----- | --------- | ---- | -------- | ---------- | ------ | ----------- | ------- | ------- |
| 1 | Login | /(auth)/login | myapp://login | Auth | Both | S | Not Built | Biometrics | Online | AUTH-M01 |

{... repeat for all services ...}

---

## Web ↔ Mobile Screen Mapping

| Web Screen | Mobile Screen | Approach | Notes |
| ---------- | ------------- | -------- | ----- |
| /dashboard | /(tabs)/ | Simplified | Mobile shows top 5 KPIs only |
| /items | /(tabs)/items | Adapted | Infinite scroll instead of paginated table |
| /items/[id] | /items/[id] | Mirror | Same data, mobile-optimized layout |
| /settings | /(tabs)/settings | Mirror | Same options |
| N/A | /scanner | Mobile only | Barcode scanning not available on web |

---

## Screens Needing Tasks

| Screen | Route | Service | Suggested Phase |
| ------ | ----- | ------- | --------------- |
| {name} | {route} | {service} | Phase {N} |

---

## Deep Link Registry

| Deep Link | Target Screen | Auth Required | Notes |
| --------- | ------------- | ------------- | ----- |
| myapp://items/{id} | Item Detail | Yes | From push notification |
| myapp://login | Login | No | Password reset link |
```

---

## Validation Checklist

After generation, verify:

- [ ] Every screen in every service hub file has a mobile entry (or is explicitly marked "Web Only")
- [ ] Every mobile screen has a route in the navigation architecture
- [ ] Deep links are registered for all screens accessible from push notifications
- [ ] Offline strategy is specified for every screen
- [ ] Native API requirements match the native features audit
- [ ] Summary totals match the detailed tables
- [ ] Every screen has a task ID (or is flagged in "Screens Needing Tasks")
- [ ] Platform column is accurate (iOS-only screens for iOS-only features, etc.)
- [ ] Web ↔ Mobile mapping is complete for all web screens
