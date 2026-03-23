# Compatibility Tests

## What It Is

Compatibility testing goes beyond cross-browser verification to cover the full matrix of environments where your application must function: different devices (iPhone 12 vs. Samsung Galaxy S23 vs. iPad Air), different operating systems (iOS 16 vs. iOS 17, Android 13 vs. Android 14, Windows 10 vs. 11, macOS Ventura vs. Sonoma), different network conditions (5G, 4G, 3G, flaky WiFi, complete offline), and different assistive technology combinations (VoiceOver + Safari, NVDA + Firefox, JAWS + Chrome, TalkBack + Android Chrome). Where cross-browser tests ask "does it work in Firefox?", compatibility tests ask "does it work on a Samsung Galaxy A14 running Android 13 on a 3G connection with TalkBack enabled?" — because that is a real user's reality, and each layer of that stack can introduce unique failures. The goal is a priority-tiered testing matrix so you cover the combinations that matter most without trying to test everything.

## What It Catches

- **iOS Safari specific bugs** — position: fixed inside a scrollable container breaks on iOS but works in desktop Safari's WebKit; keyboard appearance pushes the viewport up and hides fixed-bottom elements; `100vh` is taller than the visible viewport because it includes the address bar
- **Android Chrome fragmentation** — Samsung Internet (based on Chromium but with its own quirks) handles `overflow: auto` differently; older Android WebView (used in in-app browsers) lacks features that Chrome has
- **Network degradation failures** — API calls timeout on 3G but the app shows an infinite spinner instead of an error state; images don't use responsive `srcset` so mobile users download 4MB hero images on cellular
- **Offline mode breakage** — service worker caches the HTML shell but not the CSS, resulting in an unstyled page; or the app crashes entirely instead of showing an offline indicator
- **OS-level differences** — Windows high contrast mode overrides your CSS colors, making custom buttons invisible; macOS "reduce motion" preference is ignored, causing vestibular issues for sensitive users; Android "font size: large" system setting breaks layouts that use `px` instead of `rem`
- **Assistive technology mismatches** — a component is accessible in VoiceOver + Safari but NVDA + Firefox reads it differently because Firefox exposes ARIA differently to the accessibility tree; JAWS announces "clickable" on every div with an onClick handler, confusing users
- **In-app browser failures** — your OAuth login works in Safari but fails in Instagram's in-app browser because it blocks third-party redirects; Facebook's in-app browser doesn't support `navigator.share()`

## When It's Required

- The feature has a user interface (C4) and is user-facing (C14) — public-facing features encounter the full diversity of user environments
- The feature has offline or poor-connectivity scenarios (C15) — network condition testing is mandatory
- The product targets a global audience — global users have more device diversity, slower connections, and higher mobile-first usage
- The feature uses device APIs (camera, GPS, accelerometer, file system, notifications)
- The project has accessibility requirements (ADA, Section 508, WCAG 2.1 AA) — assistive technology combinations must be verified
- You're building a PWA or offline-capable application

**Skip when:** The feature targets a controlled single-platform environment (internal desktop-only tool with a mandated OS and browser).

## Setup Guide

### Layer 1: Network Condition Testing (Playwright)

Built into Playwright — no additional setup.

```typescript
// e2e/compat/network.compat.spec.ts
import { test, expect } from '@playwright/test';

// Simulate 3G connection
test('app loads and functions on slow 3G', async ({ page, context }) => {
  // Create a CDP session for network throttling (Chromium only)
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,  // 750 Kbps
    uploadThroughput: (250 * 1024) / 8,    // 250 Kbps
    latency: 100,                           // 100ms
  });

  await page.goto('/', { timeout: 30000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
});
```

### Layer 2: Device Emulation (Playwright)

```typescript
import { devices } from '@playwright/test';

// Playwright has built-in device profiles
const testDevices = [
  { name: 'iPhone 14', config: devices['iPhone 14'] },
  { name: 'Pixel 7', config: devices['Pixel 7'] },
  { name: 'iPad Pro 11', config: devices['iPad Pro 11'] },
  { name: 'Galaxy S9+', config: devices['Galaxy S9+'] },
];
```

### Layer 3: Real Device Testing (BrowserStack / Sauce Labs)

```bash
npm install --save-dev browserstack-local @browserstack/playwright
```

**browserstack.config.ts:**

```typescript
// BrowserStack Playwright integration
export const bsConfig = {
  auth: {
    username: process.env.BROWSERSTACK_USERNAME,
    access_key: process.env.BROWSERSTACK_ACCESS_KEY,
  },
  browsers: [
    { browser: 'chrome', os: 'Windows', os_version: '11' },
    { browser: 'safari', os: 'OS X', os_version: 'Sonoma' },
    { browser: 'chrome', device: 'Samsung Galaxy S23', os_version: '13.0' },
    { browser: 'safari', device: 'iPhone 15', os_version: '17' },
    { browser: 'samsung', device: 'Samsung Galaxy A14', os_version: '13.0' },
  ],
};
```

### Layer 4: Offline / Service Worker Testing

```typescript
// Test offline behavior by toggling network
test('shows offline indicator when network drops', async ({ page, context }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Go offline
  await context.setOffline(true);

  // Navigate or trigger an API call
  await page.getByRole('button', { name: 'Refresh' }).click();

  // Should show offline indicator, not crash
  await expect(page.getByText(/offline|no connection/i)).toBeVisible();

  // Come back online
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

## Template

### Device testing matrix

```typescript
// e2e/compat/device-matrix.spec.ts
import { test, expect, devices } from '@playwright/test';

const DEVICE_MATRIX = [
  // Tier 1: Must test (covers 80%+ of users)
  { name: 'iPhone 14', profile: devices['iPhone 14'], tier: 1 },
  { name: 'Desktop Chrome', profile: devices['Desktop Chrome'], tier: 1 },

  // Tier 2: Should test (covers next 15%)
  { name: 'Pixel 7', profile: devices['Pixel 7'], tier: 2 },
  { name: 'iPad Pro', profile: devices['iPad Pro 11'], tier: 2 },
  { name: 'Desktop Firefox', profile: devices['Desktop Firefox'], tier: 2 },

  // Tier 3: Best effort (edge cases)
  { name: 'Galaxy S9+', profile: devices['Galaxy S9+'], tier: 3 },
  { name: 'iPhone SE', profile: devices['iPhone SE'], tier: 3 },
];

for (const device of DEVICE_MATRIX.filter((d) => d.tier <= 2)) {
  test.describe(`${device.name} compatibility`, () => {
    test.use(device.profile);

    test('home page loads correctly', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // No horizontal overflow
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);
    });

    test('critical flow completes', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });
}
```

### Network condition testing suite

```typescript
// e2e/compat/network-conditions.spec.ts
import { test, expect } from '@playwright/test';

const NETWORK_PROFILES = {
  fast3G: {
    download: (1.6 * 1024 * 1024) / 8,
    upload: (768 * 1024) / 8,
    latency: 150,
  },
  slow3G: {
    download: (500 * 1024) / 8,
    upload: (128 * 1024) / 8,
    latency: 300,
  },
  flaky: {
    download: (2 * 1024 * 1024) / 8,
    upload: (1 * 1024 * 1024) / 8,
    latency: 50,
    packetLoss: 10, // 10% packet loss — simulated via route interception
  },
};

test.describe('Network degradation handling', () => {
  test('app loads within 10s on slow 3G', async ({ page, context }) => {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: NETWORK_PROFILES.slow3G.download,
      uploadThroughput: NETWORK_PROFILES.slow3G.upload,
      latency: NETWORK_PROFILES.slow3G.latency,
    });

    const startTime = Date.now();
    await page.goto('/', { timeout: 30000 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
    const loadTime = Date.now() - startTime;

    console.log(`Load time on slow 3G: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000);
  });

  test('shows loading states for slow API responses', async ({ page }) => {
    // Delay API responses by 3 seconds
    await page.route('**/api/**', async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.continue();
    });

    await page.goto('/dashboard');

    // Loading skeleton or spinner should appear
    await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible();

    // Eventually, real content loads
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
  });

  test('handles complete network failure gracefully', async ({ page, context }) => {
    await page.goto('/dashboard');
    await context.setOffline(true);

    await page.getByRole('button', { name: 'Save' }).click();

    // Should show error, not crash
    await expect(page.getByText(/failed|offline|try again/i)).toBeVisible();

    // No unhandled promise rejection
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    expect(errors).toEqual([]);
  });
});
```

### Assistive technology combination checklist (manual test template)

```markdown
## AT Compatibility Test Session

**Feature:** _______________
**Tester:** _______________
**Date:** _______________

### Screen Reader + Browser Combinations

| # | Screen Reader | Browser | OS | Priority | Result | Notes |
|---|--------------|---------|-----|----------|--------|-------|
| 1 | VoiceOver | Safari | macOS | Tier 1 | ☐ Pass ☐ Fail | |
| 2 | NVDA | Firefox | Windows | Tier 1 | ☐ Pass ☐ Fail | |
| 3 | JAWS | Chrome | Windows | Tier 2 | ☐ Pass ☐ Fail | |
| 4 | TalkBack | Chrome | Android | Tier 2 | ☐ Pass ☐ Fail | |
| 5 | VoiceOver | Safari | iOS | Tier 1 | ☐ Pass ☐ Fail | |

### Test Tasks (repeat for each combination above)

| Task | Expected Behavior | Result |
|------|-------------------|--------|
| Navigate to login page | Screen reader announces page title | ☐ |
| Fill in email field | Label "Email" is announced | ☐ |
| Submit form with errors | Error messages are announced via aria-live | ☐ |
| Open modal dialog | Focus moves to modal, background is inert | ☐ |
| Close modal with Escape | Focus returns to trigger button | ☐ |
| Navigate data table | Row/column headers announced for each cell | ☐ |

### OS Accessibility Settings

| Setting | Tested | Result | Notes |
|---------|--------|--------|-------|
| Windows High Contrast Mode | ☐ | | |
| macOS Reduce Motion | ☐ | | |
| macOS Increase Contrast | ☐ | | |
| iOS Large Text (Dynamic Type) | ☐ | | |
| Android Font Size: Largest | ☐ | | |
```

### Comprehensive compatibility config

```typescript
// e2e/compat/playwright.compat.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/compat',
  projects: [
    // OS simulation via user-agent and viewport
    {
      name: 'windows-chrome',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        timezoneId: 'America/New_York',
      },
    },
    {
      name: 'mac-safari',
      use: {
        ...devices['Desktop Safari'],
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
      },
    },
    {
      name: 'ios-safari',
      use: {
        ...devices['iPhone 14'],
        locale: 'en-US',
      },
    },
    {
      name: 'android-chrome',
      use: {
        ...devices['Pixel 7'],
        locale: 'en-US',
      },
    },
  ],
});
```

## Common Pitfalls

| Pitfall | Why It Happens | Fix |
|---------|---------------|-----|
| **Trying to test every combination** | The matrix of devices x OS x browsers x network x AT is effectively infinite. Teams spend weeks configuring and never finish. | Tier your matrix. Tier 1 (must pass): iPhone Safari + Desktop Chrome + NVDA/Firefox. Tier 2 (should pass): Android Chrome + Desktop Firefox + iPad. Tier 3 (best effort): everything else. Base tiers on analytics. |
| **Emulation treated as real device testing** | Playwright's iPhone emulation sets viewport and user-agent but doesn't replicate iOS Safari rendering, GPU behavior, or memory constraints. | Emulation catches ~70% of issues. For critical flows (checkout, sign-up), verify on real devices via BrowserStack or physical devices quarterly. |
| **Network tests only test "offline = true"** | Real network degradation is more nuanced — packets arrive out of order, connections drop mid-request, DNS resolution fails intermittently. | Test the spectrum: fast → slow → flaky → offline. Simulate request-level failures (`route.abort()` on specific API calls), not just global offline. |
| **Assistive technology testing skipped** | "We'll do it later" — later never comes. Screen reader bugs ship to production. | Build AT testing into the definition of done for any feature with custom interactive components. VoiceOver is pre-installed on every Mac — there is no setup cost. |
| **Compatibility matrix not updated** | The matrix was created at project start and never revised. Two years later, you're still testing IE11 but not testing Safari 17. | Review the matrix quarterly. Drop browsers/devices below 1% of your traffic. Add newly popular devices. Analytics is the source of truth. |
| **In-app browsers ignored** | 30-40% of social media traffic comes through in-app browsers (Instagram, Facebook, Twitter/X, TikTok) which have different capability sets than the system browser. | Test critical flows in at least one in-app browser. These browsers often block redirects, popups, and specific Web APIs. Have fallback flows ready. |

## Proof Artifact

The compatibility test suite must produce:

1. **Device matrix test results** — all automated tests passing across configured devices
   ```
   [iPhone 14]       › device-matrix.spec.ts — 2 passed
   [Desktop Chrome]  › device-matrix.spec.ts — 2 passed
   [Pixel 7]         › device-matrix.spec.ts — 2 passed
   [iPad Pro]        › device-matrix.spec.ts — 2 passed
   8 passed (1m 42s)
   ```

2. **Network condition test results** — all degraded-network tests passing
   ```
   ✓ app loads within 10s on slow 3G (6.2s)
   ✓ shows loading states for slow API responses (4.1s)
   ✓ handles complete network failure gracefully (1.8s)
   3 passed
   ```

3. **Compatibility matrix document** — the tested matrix with results:
   ```
   | Device/Environment     | OS         | Browser      | Tier | Result |
   |------------------------|------------|--------------|------|--------|
   | iPhone 14              | iOS 17     | Safari       | 1    | Pass   |
   | Pixel 7                | Android 14 | Chrome       | 2    | Pass   |
   | Desktop                | Windows 11 | Chrome 120   | 1    | Pass   |
   | Desktop                | macOS 14   | Safari 17    | 1    | Pass   |
   | Desktop                | Windows 11 | Firefox 121  | 2    | Pass   |
   | iPad Pro               | iPadOS 17  | Safari       | 2    | Pass   |
   | Galaxy A14             | Android 13 | Samsung Int. | 3    | Pass   |
   ```

4. **AT testing session log** — completed assistive technology checklist (from the manual test template above) signed by the tester

5. **Known compatibility issues log** — any accepted differences documented with rationale:
   ```
   | Issue | Environment | Severity | Decision |
   |-------|-------------|----------|----------|
   | Blur backdrop not rendered | Firefox < 103 | Low | Graceful degradation — solid background shown |
   | Native date picker style | iOS Safari | Accepted | Native picker is platform-appropriate |
   ```
