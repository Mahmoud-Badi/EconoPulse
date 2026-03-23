# Responsive Tests

## What It Is

Responsive tests verify that your application's layout, typography, interactive elements, and content hierarchy adapt correctly across viewport sizes — from 320px feature phones to 2560px ultrawide monitors. This is not just "does it look okay at mobile width" — it's verifying that touch targets are large enough on touch devices, that horizontal overflow doesn't create ghost scrollbars, that text remains readable without zooming, that navigation transforms correctly between mobile hamburger and desktop expanded states, and that no content is accidentally hidden or unreachable at any breakpoint. Responsive tests use Playwright's viewport resizing to programmatically verify layout behavior at standard breakpoints, and they complement visual regression tests by asserting specific CSS properties and element relationships rather than relying solely on pixel comparison.

## What It Catches

- **Horizontal overflow / ghost scrollbar** — a `width: 100vw` element doesn't account for the scrollbar width, creating a horizontal scroll that's invisible on macOS (overlay scrollbars) but visible on Windows
- **Text truncation without ellipsis** — a heading works at desktop width but at 375px it overflows its container, overlapping adjacent content instead of truncating or wrapping
- **Touch targets too small** — desktop buttons are 32px tall (fine for mouse), but on mobile they need 44px minimum for reliable finger taps (WCAG 2.5.8)
- **Navigation disappearing without alternative** — desktop nav hides at mobile breakpoint but the hamburger menu was never implemented, leaving users with no way to navigate
- **Fixed/sticky positioning bugs** — a fixed header overlaps content on iOS Safari due to the dynamic viewport height (dvh) issue where the address bar changes the available space
- **Images not scaling** — a hero image has a fixed width, overflowing on mobile and breaking the entire page layout
- **Container query vs. media query mismatch** — a component uses container queries for responsive behavior but its container doesn't have `container-type: inline-size` set, so it never adapts
- **Zoom breakage** — layout collapses when the user zooms to 200% because the CSS uses `px` for breakpoints but viewport dimensions change with zoom

## When It's Required

- The feature has a user interface (C4) — all UI needs responsive verification
- The feature is user-facing (C14) — public users access from phones, tablets, laptops, and desktops
- The project targets mobile users (check analytics — mobile is typically 50-70% of consumer web traffic)
- You're using CSS Grid, Flexbox, or container queries with breakpoint-dependent layouts
- The feature includes data tables, forms, or navigation — these are the most common responsive failure points

**Skip when:** The feature is a desktop-only admin panel with a documented minimum resolution requirement, or a terminal/CLI output.

## Setup Guide

### Playwright Viewport Testing (Primary)

No additional dependencies — Playwright handles viewport resizing natively.

**Define your breakpoints as a shared constant:**

```typescript
// e2e/config/breakpoints.ts
export const BREAKPOINTS = {
  mobileS: { width: 320, height: 568 },   // iPhone SE (1st gen)
  mobile: { width: 375, height: 812 },     // iPhone 14
  mobileL: { width: 428, height: 926 },    // iPhone 14 Pro Max
  tablet: { width: 768, height: 1024 },    // iPad
  laptop: { width: 1024, height: 768 },    // Small laptop
  desktop: { width: 1440, height: 900 },   // Standard desktop
  wide: { width: 1920, height: 1080 },     // Full HD
  ultrawide: { width: 2560, height: 1080 },// Ultrawide (if supported)
} as const;

// The 4 breakpoints every project must test at minimum
export const REQUIRED_BREAKPOINTS = ['mobile', 'tablet', 'laptop', 'desktop'] as const;
```

**Playwright config with responsive projects:**

```typescript
import { defineConfig } from '@playwright/test';
import { BREAKPOINTS } from './e2e/config/breakpoints';

export default defineConfig({
  projects: [
    {
      name: 'mobile',
      use: {
        viewport: BREAKPOINTS.mobile,
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'tablet',
      use: {
        viewport: BREAKPOINTS.tablet,
        hasTouch: true,
      },
    },
    {
      name: 'desktop',
      use: {
        viewport: BREAKPOINTS.desktop,
      },
    },
  ],
});
```

### Alternatives

- **Responsively App** — open-source tool that shows your site at multiple viewports simultaneously (development aid, not automated testing)
- **Chromatic** — captures Storybook stories at multiple viewports for visual comparison
- **Percy** — responsive snapshots at configured widths as part of visual regression

## Template

### Layout assertions at breakpoints

```typescript
// e2e/responsive/navigation.responsive.spec.ts
import { test, expect } from '@playwright/test';
import { BREAKPOINTS } from '../config/breakpoints';

test.describe('Navigation responsive behavior', () => {
  test('shows hamburger menu on mobile', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.mobile);
    await page.goto('/');

    // Desktop nav should be hidden
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden();

    // Hamburger button should be visible
    const menuButton = page.getByRole('button', { name: /menu/i });
    await expect(menuButton).toBeVisible();

    // Tapping hamburger opens mobile nav
    await menuButton.click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();

    // All nav links are accessible
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  });

  test('shows full navigation on desktop', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.desktop);
    await page.goto('/');

    // Desktop nav should be visible
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();

    // Hamburger should not be visible
    await expect(page.getByRole('button', { name: /menu/i })).toBeHidden();
  });

  test('shows full navigation on tablet in landscape', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 }); // Tablet landscape
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
  });
});
```

### Horizontal overflow detection

```typescript
// e2e/responsive/overflow.responsive.spec.ts
import { test, expect } from '@playwright/test';
import { BREAKPOINTS, REQUIRED_BREAKPOINTS } from '../config/breakpoints';

for (const bp of REQUIRED_BREAKPOINTS) {
  test(`no horizontal overflow at ${bp} (${BREAKPOINTS[bp].width}px)`, async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS[bp]);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasOverflow).toBe(false);
  });
}

// Run against every page route
const routes = ['/', '/features', '/pricing', '/dashboard', '/settings'];

for (const route of routes) {
  test(`no horizontal overflow on ${route} at mobile`, async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.mobile);
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasOverflow).toBe(false);
  });
}
```

### Touch target size validation

```typescript
// e2e/responsive/touch-targets.responsive.spec.ts
import { test, expect } from '@playwright/test';
import { BREAKPOINTS } from '../config/breakpoints';

test.describe('Touch target sizes', () => {
  test('all interactive elements meet 44px minimum on mobile', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.mobile);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const tooSmall = await page.evaluate(() => {
      const interactive = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], [role="link"], [tabindex="0"]'
      );
      const violations: { tag: string; text: string; width: number; height: number }[] = [];

      interactive.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Skip hidden elements
        if (rect.width === 0 || rect.height === 0) return;
        // Skip elements that are visually hidden (e.g., skip links)
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;

        if (rect.width < 44 || rect.height < 44) {
          violations.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || '').trim().slice(0, 30),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      });

      return violations;
    });

    if (tooSmall.length > 0) {
      console.error('Touch targets too small:', JSON.stringify(tooSmall, null, 2));
    }
    expect(tooSmall).toEqual([]);
  });
});
```

### Data table responsive behavior

```typescript
// e2e/responsive/data-table.responsive.spec.ts
import { test, expect } from '@playwright/test';
import { BREAKPOINTS } from '../config/breakpoints';

test.describe('Data table responsive behavior', () => {
  test('table scrolls horizontally on mobile without page overflow', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.mobile);
    await page.goto('/users');

    const table = page.locator('.data-table-wrapper');
    await expect(table).toBeVisible();

    // Table wrapper should handle overflow, not the page
    const tableOverflow = await table.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.overflowX;
    });
    expect(['auto', 'scroll']).toContain(tableOverflow);

    // Page should not have horizontal overflow
    const pageOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(pageOverflow).toBe(false);
  });

  test('table shows all columns on desktop', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.desktop);
    await page.goto('/users');

    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Last active' })).toBeVisible();
  });
});
```

## Common Pitfalls

| Pitfall | Why It Happens | Fix |
|---------|---------------|-----|
| **Testing only at exact breakpoint widths** | Layout tested at 768px (tablet breakpoint) but nobody checks 769px or 767px where transitions happen. | Test at breakpoints AND at breakpoint +/- 1px. The edge of a media query range is where layout bugs live. |
| **Using viewport width in Chrome as "mobile testing"** | Chrome DevTools mobile view doesn't replicate Safari iOS behavior — no dynamic viewport height, no rubber-banding, no notch safe areas. | Viewport resizing in Playwright catches responsive CSS issues. Safari-specific behavior requires WebKit testing (separate concern, covered in cross-browser tests). |
| **Forgetting `100vw` includes scrollbar on Windows** | `width: 100vw` is viewport width including scrollbar. On Windows (non-overlay scrollbars), this creates 15-17px horizontal overflow. | Use `width: 100%` on block elements instead of `100vw`. Or use `overflow-x: hidden` on the body (but only if you understand the implications for positioned elements). |
| **Not testing zoom** | WCAG requires content to work at 200% zoom. Many layouts break because breakpoints are in px but zoom changes the effective viewport. | Test at 375px viewport (mobile) AND at 1440px viewport at 200% zoom (which gives you an effective ~720px). Both should produce usable layouts. |
| **Ignoring landscape orientation on mobile** | iPhone in landscape is 812x375 — a very wide, very short viewport. Fixed headers can consume 60%+ of the visible area. | Test at landscape dimensions. Ensure fixed headers have `max-height` or collapse in landscape. Test that modals don't exceed viewport height. |
| **Testing responsive in isolation** | Responsive tests check layout but nobody tests if the mobile layout is actually usable — can users reach the CTA? Is the form input visible above the keyboard? | Combine responsive layout assertions with functional E2E tests at mobile viewport. Layout correctness without functionality is pointless. |

## Proof Artifact

The responsive test suite must produce:

1. **All responsive tests passing** across required breakpoints
   ```
   [mobile]  › navigation.responsive.spec.ts — 3 passed
   [tablet]  › navigation.responsive.spec.ts — 3 passed
   [desktop] › navigation.responsive.spec.ts — 3 passed
   [mobile]  › overflow.responsive.spec.ts — 6 passed
   [mobile]  › touch-targets.responsive.spec.ts — 1 passed
   16 passed (28s)
   ```

2. **Breakpoint coverage table** — every tested page/component at every tested viewport:
   ```
   | Page/Component | 375px | 768px | 1024px | 1440px |
   |----------------|:-----:|:-----:|:------:|:------:|
   | Home           |  yes  |  yes  |  yes   |  yes   |
   | Dashboard      |  yes  |  yes  |  yes   |  yes   |
   | Navigation     |  yes  |  yes  |  yes   |  yes   |
   | Data table     |  yes  |  —    |  —     |  yes   |
   | Checkout form  |  yes  |  yes  |  —     |  yes   |
   ```

3. **Zero horizontal overflow** — proof that no page has horizontal scroll at any tested viewport width

4. **Touch target compliance** — test output confirming all interactive elements meet 44x44px minimum at mobile viewport

5. **Screenshots at each breakpoint** (optional but recommended) — paired with visual regression baselines showing the responsive adaptation visually
