# Cross-Browser Tests

## What It Is

Cross-browser testing verifies that your application renders correctly and functions identically across different browser engines — Chromium (Chrome, Edge, Opera, Brave), Gecko (Firefox), and WebKit (Safari). Each engine has its own CSS rendering quirks, JavaScript runtime behavior, security policies, and API support gaps. A feature that works flawlessly in Chrome can silently break in Safari because of ITP cookie restrictions, display differently in Firefox because of scrollbar rendering, or fail in older Edge because of unsupported CSS properties. Cross-browser tests run your E2E and visual regression suites across multiple browsers to catch these engine-specific divergences before users do. The goal is not to test every browser ever made — it's to test the browsers your actual users use, weighted by analytics data.

## What It Catches

- **Safari flexbox bugs** — `flex-basis: auto` with `min-width` behaves differently in WebKit, causing layout overflow on iOS Safari that doesn't reproduce in Chrome
- **Firefox scrollbar styling** — `scrollbar-width: thin` works in Firefox but Chrome needs `::-webkit-scrollbar` pseudo-elements, resulting in either double-styled or unstyled scrollbars
- **Safari ITP (Intelligent Tracking Prevention)** — third-party cookies blocked by default, breaking OAuth flows, embedded iframes, and analytics that depend on cross-site cookies
- **Safari date input differences** — `<input type="date">` renders a native date picker in Safari with a completely different UX than Chrome's, and `new Date('2024-01-15')` parses differently when timezone-naive strings are used
- **Firefox strict mode JavaScript differences** — `document.all` is falsy in Firefox strict mode, breaking legacy feature detection code
- **CSS `gap` in flexbox** — supported in Chrome since 2020 but Safari only added support in 14.1 (2021), meaning older iOS devices show no gap between flex items
- **`backdrop-filter: blur()`** — renders in Chrome and Safari but requires `-webkit-backdrop-filter` in older Safari versions and has no support in Firefox until v103
- **Clipboard API differences** — `navigator.clipboard.writeText()` requires HTTPS in all browsers but the permission prompt timing and behavior varies per engine
- **Web font rendering** — the same font at the same size renders with subtly different metrics (line height, kerning, anti-aliasing) across engines, causing text-dependent layouts to shift

## When It's Required

- The feature has a user interface (C4) — any rendered UI can differ across browsers
- The feature is user-facing (C14) — public-facing features must work for all users regardless of browser choice
- Your analytics show significant Safari or Firefox traffic (>5% of sessions)
- You're using newer CSS features (container queries, `:has()`, `@layer`, `color-mix()`)
- You're using Web APIs with incomplete browser support (Web Bluetooth, File System Access, View Transitions)

**Skip when:** The feature targets a controlled environment (Electron app, internal Chromium-only tool, native mobile app).

## Setup Guide

### Playwright Multi-Browser (Primary)

Playwright supports Chromium, Firefox, and WebKit natively — no additional browser binaries to manage.

```bash
# Install all browsers
npx playwright install --with-deps
```

**playwright.config.ts — multi-browser configuration:**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
});
```

**Running specific browsers:**

```bash
# All browsers
npx playwright test

# Single browser
npx playwright test --project=webkit

# Multiple specific browsers
npx playwright test --project=chromium --project=firefox
```

### BrowserStack / Sauce Labs (Real Device Testing)

For testing on actual devices (real iOS Safari, Samsung Internet, etc.) rather than emulated engines:

```bash
npm install --save-dev browserstack-local
```

Use when: you need to verify behavior on real iOS/Android devices, specific OS versions, or browsers Playwright doesn't emulate (Samsung Internet, UC Browser).

### Can I Use Integration

Before writing cross-browser tests, check feature support:

```bash
# npx browserslist to see your target browsers
npx browserslist "> 0.5%, last 2 versions, not dead"
```

Cross-reference against [caniuse.com](https://caniuse.com) for any CSS property or Web API you're using.

## Template

### Cross-browser functional test

```typescript
// e2e/cross-browser/checkout.spec.ts
import { test, expect } from '@playwright/test';

// This test runs in all configured browser projects
test.describe('Checkout flow', () => {
  test('complete purchase across browsers', async ({ page, browserName }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.getByRole('link', { name: 'Cart' }).click();
    await expect(page.getByText('1 item')).toBeVisible();

    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByLabel('Card number').fill('4242424242424242');
    await page.getByLabel('Expiry').fill('12/28');
    await page.getByLabel('CVC').fill('123');
    await page.getByRole('button', { name: 'Pay' }).click();

    await expect(page.getByText('Order confirmed')).toBeVisible({ timeout: 15000 });
  });
});
```

### Browser-specific behavior test

```typescript
// e2e/cross-browser/browser-specific.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Browser-specific behavior', () => {
  test('date picker works correctly', async ({ page, browserName }) => {
    await page.goto('/booking');

    if (browserName === 'webkit') {
      // Safari native date picker — verify the value is set correctly
      await page.getByLabel('Check-in date').fill('2025-06-15');
      await expect(page.getByLabel('Check-in date')).toHaveValue('2025-06-15');
    } else {
      // Chrome/Firefox — standard date input
      await page.getByLabel('Check-in date').fill('2025-06-15');
      await expect(page.getByLabel('Check-in date')).toHaveValue('2025-06-15');
    }

    // Regardless of browser, submitting the form should work
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/check_in=2025-06-15/);
  });

  test('clipboard operations work', async ({ page, browserName, context }) => {
    // Grant clipboard permissions where the API supports it
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }

    await page.goto('/share');
    await page.getByRole('button', { name: 'Copy link' }).click();

    // Verify UI feedback regardless of actual clipboard access
    await expect(page.getByText('Copied!')).toBeVisible();
  });

  test('scroll behavior is consistent', async ({ page, browserName }) => {
    await page.goto('/long-page');

    // Smooth scroll to anchor
    await page.getByRole('link', { name: 'Jump to FAQ' }).click();

    // Wait for scroll to complete — timing varies by browser
    await page.waitForFunction(() => {
      const faq = document.getElementById('faq');
      if (!faq) return false;
      const rect = faq.getBoundingClientRect();
      return rect.top >= 0 && rect.top < 100;
    });

    await expect(page.getByRole('heading', { name: 'FAQ' })).toBeInViewport();
  });
});
```

### CSS feature detection test

```typescript
// e2e/cross-browser/css-features.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CSS feature support', () => {
  test('container queries render correctly', async ({ page, browserName }) => {
    await page.goto('/dashboard');

    // Container queries are supported in all modern browsers,
    // but verify the layout actually responds to container size
    const card = page.locator('.dashboard-card').first();
    const cardWidth = await card.evaluate((el) => el.getBoundingClientRect().width);

    if (cardWidth < 300) {
      // Narrow container — should show stacked layout
      await expect(card.locator('.card-content')).toHaveCSS('flex-direction', 'column');
    } else {
      // Wide container — should show horizontal layout
      await expect(card.locator('.card-content')).toHaveCSS('flex-direction', 'row');
    }
  });

  test('backdrop-filter renders blur effect', async ({ page, browserName }) => {
    await page.goto('/modal-demo');
    await page.getByRole('button', { name: 'Open modal' }).click();

    const overlay = page.locator('.modal-overlay');
    await expect(overlay).toBeVisible();

    // Verify backdrop-filter is applied (the value syntax varies by browser)
    const backdropFilter = await overlay.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backdropFilter || style.webkitBackdropFilter || 'none';
    });

    expect(backdropFilter).not.toBe('none');
  });
});
```

### Browser priority matrix (for the project's README or test config)

```typescript
// e2e/browser-matrix.ts — shared configuration
export const BROWSER_PRIORITY = {
  // Tier 1: Must pass — run on every PR
  critical: ['chromium', 'webkit'],

  // Tier 2: Should pass — run on merge to main
  important: ['firefox', 'mobile-chrome', 'mobile-safari'],

  // Tier 3: Best effort — run weekly or before release
  extended: ['edge-on-windows', 'samsung-internet', 'ios-15-safari'],
};
```

## Common Pitfalls

| Pitfall | Why It Happens | Fix |
|---------|---------------|-----|
| **Testing only Chrome** | "It works on my machine" — developer uses Chrome, CI uses Chrome, bugs ship to Safari users. | Configure Playwright with at least Chromium + WebKit projects. WebKit catches most Safari issues. Add Firefox if analytics show >5% usage. |
| **Ignoring Safari completely** | Safari has ~18% global mobile share. Skipping it means 1 in 5 mobile users may hit bugs. | WebKit in Playwright catches most (not all) Safari issues. For critical flows, test on real iOS devices via BrowserStack or a physical device. |
| **Feature detection vs. browser sniffing** | Code checks `navigator.userAgent` to branch behavior. UA strings change, detection breaks. | Use feature detection: `if ('IntersectionObserver' in window)`. Use `@supports` in CSS: `@supports (backdrop-filter: blur(10px))`. |
| **Polyfills not tested** | Polyfills are added for older browsers but never tested — the polyfill itself may behave differently. | If you polyfill a feature, test that specific feature in the browser that needs the polyfill. Don't assume the polyfill is invisible. |
| **Viewport ≠ browser** | Testing at mobile viewport width in Chrome doesn't catch Safari-specific mobile behavior (rubber-banding, fixed positioning, safe-area insets). | Mobile viewport tests catch responsive CSS issues. Safari-specific bugs require WebKit engine testing. These are two different test concerns. |
| **Cross-browser tests run on every commit** | Full multi-browser E2E suite takes 15 minutes, runs on every push, developers ignore it. | Run Chromium on every PR. Run full multi-browser suite on merge to main or nightly. Tier your browser priority. |

## Proof Artifact

The cross-browser test suite must produce:

1. **Multi-browser test results** — all tests passing across configured browsers
   ```
   Running 24 tests using 6 workers

   [chromium] › checkout.spec.ts — 8 passed
   [firefox]  › checkout.spec.ts — 8 passed
   [webkit]   › checkout.spec.ts — 8 passed

   24 passed (2m 14s)
   ```

2. **Browser matrix coverage table** — documenting which browsers are tested and at what frequency:
   ```
   | Browser        | Engine   | Frequency     | Priority |
   |----------------|----------|---------------|----------|
   | Chrome 120+    | Chromium | Every PR      | Tier 1   |
   | Safari 16+     | WebKit   | Every PR      | Tier 1   |
   | Firefox 120+   | Gecko    | Merge to main | Tier 2   |
   | Mobile Chrome  | Chromium | Merge to main | Tier 2   |
   | Mobile Safari  | WebKit   | Merge to main | Tier 2   |
   | Edge           | Chromium | Weekly        | Tier 3   |
   ```

3. **Known browser-specific issues log** — any intentional browser differences documented:
   ```
   | Issue | Browser | Status | Workaround |
   |-------|---------|--------|------------|
   | Date picker style differs | Safari | Accepted | Native picker is fine |
   | Scrollbar width differs | Firefox | Accepted | No layout impact |
   ```

4. **CI pipeline evidence** — link or screenshot of CI run showing multi-browser jobs all green
