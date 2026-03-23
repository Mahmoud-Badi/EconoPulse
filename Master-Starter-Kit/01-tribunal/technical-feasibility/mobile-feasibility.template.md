# Mobile Feasibility Assessment: {{FEATURE_NAME}}

## Feature Summary

**Feature:** {{FEATURE_NAME}}
**Priority:** {P0/P1/P2}
**Platforms:** iOS / Android / Both
**Framework:** {{MOBILE_FRAMEWORK}}

---

## Mobile-Specific Complexity

### Native API Requirements

| API | Required? | Complexity | Notes |
|-----|-----------|-----------|-------|
| Camera | Yes/No | Low/Med/High | {photo capture, video, scanning, AR} |
| GPS / Location | Yes/No | Low/Med/High | {foreground only, background tracking, geofencing} |
| Push Notifications | Yes/No | Low/Med/High | {basic alerts, rich notifications, deep link targeting} |
| Biometrics | Yes/No | Low/Med/High | {Face ID, Touch ID, fingerprint} |
| Bluetooth | Yes/No | Low/Med/High | {BLE scanning, device pairing, data transfer} |
| NFC | Yes/No | Low/Med/High | {read tags, write tags, card emulation} |
| Contacts | Yes/No | Low/Med/High | {read only, sync, invite flow} |
| File System | Yes/No | Low/Med/High | {download, upload, local storage} |
| Calendar | Yes/No | Low/Med/High | {read events, create events, sync} |
| Sensors | Yes/No | Low/Med/High | {accelerometer, gyroscope, barometer} |

**Total native API count:** {N}
**Custom native module needed:** Yes / No

---

### Offline Requirements

| Aspect | Requirement |
|--------|-------------|
| Offline access needed? | Yes / No / Partial |
| Data to cache locally | {list of data types} |
| Local database needed? | Yes (SQLite/WatermelonDB/Drift) / No (AsyncStorage/SharedPrefs only) |
| Sync strategy | {conflict-last-write-wins / server-authority / manual-merge} |
| Queue offline mutations? | Yes / No |
| Offline-first or offline-tolerant? | {offline-first: app works fully offline / offline-tolerant: graceful degradation} |

**Offline complexity rating:** Low (cache only) / Medium (local DB + sync) / High (offline-first with conflict resolution)

---

### Platform Differences

| Behavior | iOS | Android | Shared? |
|----------|-----|---------|---------|
| Navigation pattern | {push/modal/tab} | {push/modal/tab} | Yes/No |
| Permission flow | {when requested} | {when requested} | Yes/No |
| Background behavior | {suspended/limited/active} | {service/WorkManager} | No |
| Notification handling | {APNs} | {{FCM}} | Partial |
| Deep link mechanism | {Universal Links} | {App Links} | No |
| UI differences | {describe any iOS-specific UI} | {describe any Android-specific UI} | {mostly shared} |

**Platform divergence risk:** Low (identical) / Medium (minor differences) / High (significant platform-specific work)

---

### Performance Considerations

| Concern | Applicable? | Mitigation |
|---------|-------------|------------|
| Large list rendering | Yes/No | {FlatList/RecyclerView with virtualization} |
| Image-heavy screens | Yes/No | {cached_network_image, progressive loading} |
| Complex animations | Yes/No | {Reanimated/Lottie, 60fps target} |
| Real-time data | Yes/No | {WebSocket/SSE, throttle updates} |
| Heavy computation | Yes/No | {move to native thread, web worker} |
| Large file handling | Yes/No | {streaming, chunked upload/download} |
| Map rendering | Yes/No | {MapView with clustering, lazy marker loading} |

---

## Effort Estimation

| Component | Days | Confidence | Notes |
|-----------|------|------------|-------|
| UI (screens + components) | {N} | High/Med/Low | {number of screens, complexity} |
| Native module / bridge | {N} | High/Med/Low | {custom native code needed?} |
| API integration | {N} | High/Med/Low | {endpoints, auth, error handling} |
| Offline / local storage | {N} | High/Med/Low | {sync complexity} |
| Push notifications | {N} | High/Med/Low | {APNs + FCM setup} |
| Deep linking | {N} | High/Med/Low | {route configuration} |
| Testing (unit + E2E) | {N} | High/Med/Low | {test count estimate} |
| Platform-specific work | {N} | High/Med/Low | {iOS-only or Android-only code} |
| **Total** | **{N}** | | |

**Buffer multiplier:** 1.3x (known tech) / 1.5x (new tech) / 2.0x (first mobile feature)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| App Store rejection | Low/Med/High | High | {review guidelines compliance, test account prep} |
| Native module instability | Low/Med/High | High | {use established packages, fallback plan} |
| Performance on low-end devices | Low/Med/High | Med | {test on budget Android device, optimize renders} |
| Offline sync conflicts | Low/Med/High | High | {define conflict resolution strategy upfront} |
| Permission denial by user | Low/Med/High | Med | {graceful degradation, explain why needed} |
| Platform API deprecation | Low/Med/High | Med | {use abstraction layer, stay on latest SDK} |

---

## Recommendation

**Build it:** Yes / Yes with caveats / Defer to V2

**Caveats (if any):**
- {caveat 1}
- {caveat 2}

**Suggested simplifications:**
- {simplification 1 — e.g., "foreground location only, skip geofencing for V1"}
- {simplification 2 — e.g., "online-only for V1, add offline in V2"}

**Dependencies on other features:**
- {dependency 1 — e.g., "requires push notification infrastructure from Feature X"}
- {dependency 2 — e.g., "shares API endpoints with web Feature Y"}
