# Mobile Performance Budgets

> If you don't set a budget, performance degrades by default. Every sprint adds features; nobody removes weight unless a budget forces the conversation.

---

## Budget Summary

| Metric | Budget | Yellow Alert | Red Alert |
|--------|--------|-------------|-----------|
| App binary size | < 15MB (base) | > 25MB | > 50MB |
| App size with assets | < 50MB | > 75MB | > 100MB |
| Cold start time | < 2s (mid-range device) | > 3s | > 5s |
| Time to interactive | < 3s | > 4s | > 6s |
| Active memory | < 150MB | > 200MB | > 300MB |
| Background memory | < 50MB | > 75MB | > 100MB |
| Animation frame rate | 60fps | < 55fps | < 45fps |
| Scroll frame rate | 60fps (30fps absolute minimum) | < 50fps | < 30fps |
| Initial data fetch | < 500KB | > 1MB | > 3MB |
| Battery per hour (active use) | < 5% | > 8% | > 12% |

---

## App Size Budget

### Why Size Matters

- Google Play: apps >150MB must use Play Asset Delivery (adds complexity)
- App Store: apps >200MB can't download over cellular (users abandon)
- Emerging markets: storage is scarce, users uninstall large apps first
- Every 6MB increase in app size reduces install conversion by ~1% (Google data)

### Size Budget by Category

| Category | Target | What's Included |
|----------|--------|----------------|
| Base app (no assets) | < 15MB | JS bundle, native binaries, framework overhead |
| JS bundle | < 3MB (compressed) | All JavaScript code, dependencies |
| Native dependencies | < 8MB | Native modules, linked libraries |
| Bundled images | < 5MB | Icons, logos, placeholders (not user content) |
| Bundled fonts | < 2MB | Custom fonts (limit to 2-3 weights) |
| Total download size | < 30MB | Everything the user downloads |
| Total installed size | < 50MB | Download + extracted + cached assets |

### How to Measure

**React Native bundle size:**
```bash
# iOS
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/ios-bundle.js
ls -lh /tmp/ios-bundle.js

# Android
cd android && ./gradlew assembleRelease
ls -lh app/build/outputs/apk/release/app-release.apk

# Analyze what's in the bundle:
npx react-native-bundle-visualizer
```

**What to do when over budget:**

1. Run bundle visualizer — find the largest dependencies
2. Check for accidentally bundled dev dependencies
3. Replace heavy libraries: `moment` (300KB) → `date-fns` (tree-shakeable, ~10KB per function used) or `dayjs` (2KB)
4. Lazy-load screens: split into async chunks
5. Move images to CDN, load at runtime
6. Check for duplicate dependencies: `npx depcheck` and `pnpm why <package>`

---

## Cold Start Budget

### Target: < 2 seconds on mid-range device

**"Mid-range device" definition:** A phone from 2-3 years ago, ~$200-300 price point. Test on: Samsung Galaxy A54, Pixel 6a, iPhone SE 3rd gen, or similar.

**Do NOT benchmark on your flagship phone.** The iPhone 15 Pro will make everything feel fast. Your users don't all have flagship phones.

### What Happens During Cold Start

```
App process created
  → Native initialization (React Native bridge setup): ~500ms
  → JS bundle load and parse: ~300-800ms
  → Root component render: ~200-500ms
  → First data fetch: ~200-1000ms
  → Screen fully rendered: TARGET < 2000ms total
```

### How to Reduce Cold Start Time

| Technique | Time Saved | Complexity |
|-----------|-----------|------------|
| Enable Hermes engine | 200-500ms | Low (default in RN 0.70+) |
| Inline requires (lazy module loading) | 100-300ms | Low |
| Reduce dependencies | 50-200ms per removed dep | Medium |
| Preload critical data during splash screen | 200-500ms perceived | Medium |
| Use RAM bundles (Android) | 100-300ms | Medium |
| Defer non-critical initialization | 200-500ms | Medium |
| Cache first screen's data | Eliminates initial fetch wait | Medium |

### Measurement

```
// Add timing markers
const appStartTime = global.performance.now(); // Set in index.js

// In your first screen component:
useEffect(() => {
  const timeToInteractive = global.performance.now() - global.appStartTime;
  analytics.track('cold_start', { duration_ms: timeToInteractive });

  if (timeToInteractive > 2000) {
    console.warn(`Cold start exceeded budget: ${timeToInteractive}ms`);
  }
}, []);
```

---

## Time to Interactive Budget

### Target: < 3 seconds

Time to interactive (TTI) = user can tap buttons and get a response. Different from cold start because the screen may be visible but not yet interactive (loading data, rendering lists).

### Common TTI Killers

| Problem | Impact | Fix |
|---------|--------|-----|
| Fetching all data before showing any UI | +1-5s | Show skeleton screens, fetch progressively |
| Rendering a 500-item FlatList | +2-3s | Set `initialNumToRender={10}`, use `windowSize={5}` |
| Synchronous storage reads on mount | +200-500ms | Use async reads with loading state |
| Heavy computation on JS thread | +500-2000ms | Move to native thread or Web Worker |
| Multiple waterfall API calls | +1-3s | Parallelize or combine into single endpoint |

---

## Memory Budget

### Active Memory: < 150MB

**Why this matters:**
- iOS aggressively kills background apps that use too much memory
- Android shows "app is using battery" warnings for memory-heavy apps
- Low-end devices have 2-3GB RAM total — your app isn't the only thing running

### Common Memory Leaks in React Native

| Leak Source | How It Happens | Fix |
|-------------|---------------|-----|
| Event listeners not cleaned up | `addEventListener` without `removeEventListener` in cleanup | Always return cleanup function from `useEffect` |
| Unmounted component state updates | Async operation completes after navigation away | Use AbortController or check mounted state |
| Large image caching | Loading 50 full-resolution images in a scroll view | Use `react-native-fast-image` with cache limits, resize images |
| Closure captures | Timer or subscription closes over large data structures | Release references, use refs for mutable values |
| Navigation stack growth | 20+ screens on the navigation stack | Reset stack when navigating to root sections |

### Measuring Memory

```
# iOS — Xcode Instruments
# Product → Profile → Allocations

# Android — Android Studio Profiler
# View → Tool Windows → Profiler → Memory

# React Native — Flipper
# Install Flipper → Enable Memory plugin → Watch real-time usage

# Automated check in code:
import { NativeModules } from 'react-native';
// Log memory usage periodically during development
```

### Background Memory: < 50MB

When your app goes to the background:
- Release cached images
- Pause video/audio players
- Reduce active WebSocket connections
- Clear any in-memory query caches
- iOS will terminate your app if background memory exceeds ~50MB (varies by device)

---

## Frame Rate Budget

### Animation: 60fps (16.6ms per frame)

**Non-negotiable for:**
- Screen transitions
- Gesture-driven animations (swipe to dismiss, pull to refresh)
- Shared element transitions
- Loading spinners and progress indicators

### Scroll Performance: 60fps target, 30fps absolute minimum

**Techniques for maintaining scroll performance:**

1. **Use `FlatList` or `FlashList`, never `ScrollView` for lists >20 items**
2. **Set `getItemLayout` to skip measurement** (provide height upfront)
3. **Memoize list items:** `React.memo()` on every list item component
4. **Avoid inline functions in `renderItem`** — they cause re-renders
5. **Remove `console.log` in production** — each log call blocks the JS thread

### Frame Drop Detection

```
// Enable the React Native Performance Monitor during development:
// Shake device → "Perf Monitor"

// For automated detection, track JS frame drops:
import { PerformanceObserver } from 'react-native-performance';

// Log frames that take longer than 16.6ms
const FRAME_BUDGET_MS = 16.6;
```

### Common Frame Drop Causes

| Cause | Impact | Fix |
|-------|--------|-----|
| JS-driven animations | Major jank | Use `Animated` with `useNativeDriver: true` or Reanimated |
| Large re-renders during scroll | Dropped frames | Memoize components, use `useMemo`/`useCallback` |
| Shadow/elevation on Android | 5-10fps drop per shadow | Reduce shadow usage, pre-render shadows as images |
| Transparent overlays | 5-15fps drop | Reduce overlay count, use opaque backgrounds where possible |
| Heavy images in list | Stutter during fast scroll | Resize images server-side, use thumbnails in lists |

---

## Battery Impact Guidelines

### Budget: < 5% per hour of active use

| Activity | Battery Impact | Guideline |
|----------|---------------|-----------|
| GPS (high accuracy) | ~10% per hour | Use significant location changes instead of continuous tracking. Reduce accuracy when possible. |
| GPS (balanced) | ~3-5% per hour | Default for navigation-type features |
| Bluetooth scanning | ~3-5% per hour | Scan only when user-initiated, stop scanning when not needed |
| Background fetch | ~1-2% per cycle | Minimum 15-minute interval, batch operations |
| WebSocket (persistent) | ~2-3% per hour | Use push notifications instead for most real-time needs |
| Video playback | ~8-12% per hour | Expected, but optimize codec and resolution |
| Idle (well-optimized) | < 1% per hour | Target for background state |

### Background Processing Rules

1. **Never use `setInterval` for background work** — use OS-provided background fetch APIs
2. **Location tracking:** Use `startMonitoringSignificantLocationChanges` (iOS) or `PRIORITY_BALANCED_POWER_ACCURACY` (Android) instead of continuous high-accuracy tracking
3. **Network requests:** Batch them. One request with 10 items beats 10 separate requests
4. **Timers:** Cancel all timers when app goes to background
5. **Sensor access:** Stop accelerometer/gyroscope when not actively needed

---

## Network Budget

### Initial Data Fetch: < 500KB

```
First screen data payload targets:
  - List screen: < 50KB (20 items with essential fields only)
  - Detail screen: < 20KB (single entity with relationships)
  - Dashboard: < 100KB (aggregated metrics)
  - Images: lazy-loaded, not included in initial fetch

Pagination:
  - Default page size: 20 items
  - Max page size: 50 items
  - Never load "all" — always paginate
```

### Image Budget

| Context | Max Size | Format |
|---------|---------|--------|
| List thumbnail | 50KB | WebP, 150x150px |
| Card image | 100KB | WebP, 400x300px |
| Full-screen image | 300KB | WebP, device width |
| Avatar | 20KB | WebP, 100x100px |
| Hero image | 200KB | WebP, device width |

**Always:**
- Request images at the size you need (use CDN image resizing)
- Use WebP format (30% smaller than JPEG at same quality)
- Lazy-load images below the fold
- Show low-resolution placeholder while loading (blur-up technique)

---

## Measurement Tools

### React Native Specific

| Tool | What It Measures | Platform |
|------|-----------------|----------|
| Flipper | Network, layout, databases, memory, crash logs | Both |
| React Native Performance Monitor | JS/UI frame rate, RAM usage | Both |
| React DevTools Profiler | Component render times, re-render counts | Both |
| `react-native-bundle-visualizer` | Bundle size breakdown by module | Both |
| Reassure | Performance regression testing in CI | Both |

### iOS

| Tool | What It Measures |
|------|-----------------|
| Xcode Instruments — Time Profiler | CPU usage, function-level profiling |
| Xcode Instruments — Allocations | Memory allocation, leaks |
| Xcode Instruments — Energy Log | Battery impact |
| Xcode Instruments — Network | Request count, payload sizes |
| XCTest metrics | Startup time, memory, CPU in automated tests |

### Android

| Tool | What It Measures |
|------|-----------------|
| Android Studio Profiler — CPU | CPU usage, thread activity |
| Android Studio Profiler — Memory | Heap allocations, GC events |
| Android Studio Profiler — Energy | Battery drain by component |
| Android Studio Profiler — Network | Request timeline, payload sizes |
| Systrace | Frame rendering, thread scheduling |
| Macrobenchmark (Jetpack) | Startup, frame timing in CI |

---

## Budget Enforcement in CI

### Automated Checks

**1. Bundle size check (every PR):**

```yaml
# .github/workflows/mobile-perf.yml
- name: Check JS bundle size
  run: |
    npx react-native bundle \
      --platform ios --dev false \
      --entry-file index.js \
      --bundle-output /tmp/bundle.js

    BUNDLE_SIZE=$(wc -c < /tmp/bundle.js)
    MAX_SIZE=3145728  # 3MB in bytes

    if [ "$BUNDLE_SIZE" -gt "$MAX_SIZE" ]; then
      echo "::error::JS bundle size ($BUNDLE_SIZE bytes) exceeds budget ($MAX_SIZE bytes)"
      exit 1
    fi

    echo "Bundle size: $BUNDLE_SIZE bytes (budget: $MAX_SIZE bytes)"
```

**2. APK/IPA size check:**

```yaml
- name: Check APK size
  run: |
    APK_SIZE=$(stat -f%z android/app/build/outputs/apk/release/app-release.apk)
    MAX_SIZE=31457280  # 30MB

    if [ "$APK_SIZE" -gt "$MAX_SIZE" ]; then
      echo "::error::APK size ($APK_SIZE bytes) exceeds budget ($MAX_SIZE bytes)"
      exit 1
    fi
```

**3. Performance regression testing with Reassure:**

```javascript
// __tests__/performance/HomeScreen.perf-test.tsx
import { measurePerformance } from 'reassure';
import { HomeScreen } from '../../src/screens/HomeScreen';

test('HomeScreen renders within budget', async () => {
  await measurePerformance(<HomeScreen />, {
    runs: 20,
    // Fail if render takes more than 50ms on average
    // or more than 100ms for any single run
  });
});
```

```yaml
# In CI:
- name: Performance regression check
  run: npx reassure --baseline
  # Reassure compares current branch against baseline and fails if regression > threshold
```

### Baseline Tracking

Keep a `performance-baseline.json` in the repo:

```json
{
  "measured_on": "{{MEASUREMENT_DATE}}",
  "device": "{{DEVICE_MODEL}}",
  "os_version": "{{OS_VERSION}}",
  "metrics": {
    "js_bundle_size_bytes": 2100000,
    "apk_size_bytes": 24000000,
    "ipa_size_bytes": 22000000,
    "cold_start_ms": 1800,
    "tti_ms": 2400,
    "active_memory_mb": 120,
    "home_screen_render_ms": 35
  }
}
```

Update the baseline after each release. CI compares PRs against this baseline.

---

## Budget Review Process

### Monthly Review Checklist

- [ ] Compare current metrics against budgets (table above)
- [ ] Identify any metrics in Yellow or Red zone
- [ ] For each over-budget metric:
  - Root cause identified
  - Fix scheduled or budget exception documented with justification
- [ ] Update baseline after optimizations
- [ ] Review newly added dependencies for size/performance impact
- [ ] Test on a mid-range device (not just flagship)

### When to Adjust Budgets

**Tighten budgets when:**
- Targeting emerging markets (lower-end devices, slower networks)
- App category expects speed (messaging, social, utility)
- Competitor benchmarks show you're slower

**Relax budgets when (with documentation):**
- App requires heavy native features (AR, video processing)
- Enterprise use case where device specs are known
- Feature value clearly outweighs performance cost (document the tradeoff)
