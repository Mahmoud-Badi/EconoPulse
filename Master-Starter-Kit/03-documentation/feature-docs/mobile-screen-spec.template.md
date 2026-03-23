# Mobile Screen Spec: {{SCREEN_NAME}}

> Service: {{SERVICE_NAME}}
> Platform: {{PLATFORM}} (iOS / Android / Both)
> Priority: {{PRIORITY}} (P0 / P1 / P2)
> Task ID: {{TASK_ID}}

---

## 1. Purpose

{{One-sentence description of what this screen does and why users need it.}}

---

## 2. Navigation

| Aspect | Value |
|--------|-------|
| **Route** | `{{ROUTE_PATH}}` |
| **Navigation type** | Stack / Tab / Modal / Bottom Sheet |
| **Parent screen** | {{PARENT_SCREEN}} |
| **Accessed from** | {{How user gets here — tab bar, button press, deep link, push notification}} |
| **Deep link** | `{{PROJECT_SLUG}}://{{DEEP_LINK_PATH}}` |
| **Auth required** | Yes / No |
| **Role required** | {{ROLE}} or "any authenticated user" |

---

## 3. Layout

| Aspect | Value |
|--------|-------|
| **Header** | Navigation bar with title / Large title / Custom header / None |
| **Safe areas** | Top: {{yes/no}} Bottom: {{yes/no}} |
| **Scroll** | ScrollView / FlatList / None |
| **Pull-to-refresh** | Yes / No |
| **Tab bar visible** | Yes / No |
| **Keyboard avoidance** | KeyboardAvoidingView / Automatic / None |
| **Orientation** | Portrait only / Landscape only / Adaptive |

### Wireframe

```
┌─────────────────────────┐
│ ← Title            ⋮   │  ← Navigation bar
├─────────────────────────┤
│                         │
│   {{Main content        │
│     area description}}  │
│                         │
│                         │
├─────────────────────────┤
│  [Primary Action]       │  ← Sticky bottom CTA (if applicable)
├─────────────────────────┤
│  🏠    📋    👤         │  ← Tab bar (if visible)
└─────────────────────────┘
```

---

## 4. Data Requirements

| Data | Source | Loading Strategy |
|------|--------|-----------------|
| {{DATA_FIELD}} | API: `GET {{ENDPOINT}}` | Fetch on mount / Cache-first / Offline-first |

### Loading States

| State | Behavior |
|-------|----------|
| **Initial load** | Skeleton screen / Shimmer placeholders |
| **Pull-to-refresh** | Native refresh indicator, refetch data |
| **Pagination** | Infinite scroll with loading indicator at bottom |
| **Empty** | Empty state illustration + message + CTA |
| **Error** | Error message + retry button |
| **Offline** | Show cached data with offline banner / Show offline state |

---

## 5. User Interactions

| # | Interaction | Gesture | Response | Haptic |
|---|-------------|---------|----------|--------|
| 1 | {{ACTION}} | Tap / Long press / Swipe / Pull | {{What happens}} | Light / Medium / None |

---

## 6. Gestures

| Gesture | Action | Notes |
|---------|--------|-------|
| Swipe back (iOS) | Navigate back | System default — do not override |
| Swipe right on item | {{Action, e.g., archive}} | Threshold: 40% of item width |
| Swipe left on item | {{Action, e.g., delete}} | Destructive — red background |
| Long press on item | {{Action, e.g., context menu}} | Duration: 500ms |
| Pull down | Refresh data | Native indicator |

---

## 7. Platform Differences

| Aspect | iOS | Android |
|--------|-----|---------|
| Navigation | Back via swipe-right edge gesture | Back via system back button/gesture |
| Action sheet | iOS-style action sheet from bottom | Material bottom sheet dialog |
| Date picker | iOS wheel picker | Material date picker |
| Haptics | UIImpactFeedbackGenerator | HapticFeedbackConstants |
| {{Other}} | | |

---

## 8. Offline Behavior

| Scenario | Behavior |
|----------|----------|
| **Screen opened while offline** | {{Show cached data / Show offline state / Block access}} |
| **Connection lost while on screen** | {{Show banner, continue with cached data / Queue actions}} |
| **Action performed while offline** | {{Queue for sync / Block with message / Optimistic update}} |
| **Connection restored** | {{Auto-sync queued actions / Show sync indicator}} |

---

## 9. Accessibility

| Aspect | Implementation |
|--------|---------------|
| **Screen reader announcement** | "{{SCREEN_NAME}} screen" on navigation |
| **Element labels** | All interactive elements have `accessibilityLabel` |
| **Roles** | Buttons: `button`, Links: `link`, Headers: `header` |
| **Dynamic type** | All text respects system font size |
| **Minimum touch targets** | 44x44pt (iOS) / 48x48dp (Android) |
| **Focus order** | Logical top-to-bottom, left-to-right |

---

## 10. Performance

| Metric | Target |
|--------|--------|
| **Time to interactive** | < 300ms from navigation start |
| **List rendering** | 60fps scroll with 1000+ items (FlatList/LazyColumn) |
| **Image loading** | Progressive loading with placeholder |
| **Memory** | No memory leaks on repeated navigation |

---

## 11. Push Notification Entry

| Notification Type | Deep Link | Screen State |
|-------------------|-----------|-------------|
| {{NOTIFICATION}} | `{{PROJECT_SLUG}}://{{PATH}}` | {{What data to load on arrival}} |

---

## 12. Analytics Events

| Event | Trigger | Properties |
|-------|---------|-----------|
| `screen_view` | Screen appears | `screen_name: "{{SCREEN_NAME}}"` |
| {{EVENT}} | {{TRIGGER}} | {{PROPERTIES}} |

---

## 13. Acceptance Criteria

- [ ] Screen renders correctly on iOS and Android
- [ ] All loading states implemented (loading, empty, error, offline)
- [ ] Pull-to-refresh works (if applicable)
- [ ] Keyboard avoidance works on all form fields
- [ ] Safe areas respected (no content under notch or home indicator)
- [ ] Touch targets meet minimum size requirements
- [ ] Screen reader can navigate all interactive elements
- [ ] Deep link navigates to correct screen with correct data
- [ ] Offline behavior matches specification
- [ ] Platform-specific differences implemented per spec
