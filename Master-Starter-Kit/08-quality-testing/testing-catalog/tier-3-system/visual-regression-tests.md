# Visual Regression Tests

## What It Is

Visual regression tests capture screenshots of UI components or pages and compare them pixel-by-pixel (or perceptually) against approved baselines to detect unintended visual changes. They answer the question "does this page still look the same?" which is different from "does this page still work?" — a functional test won't catch that your button moved 12px left, that font-weight changed from 600 to 400, or that a z-index conflict is hiding your dropdown behind the hero section. These tests are the safety net for CSS changes, dependency upgrades, and refactors where you touch layout code and need proof nothing else shifted. They are inherently noisy — dynamic content, anti-aliasing differences, and font rendering variations cause false positives — so stabilization strategy is as important as the tests themselves.

## What It Catches

- **CSS side effects** — changing `.card` padding breaks `.card-header` alignment on a completely different page you didn't check manually
- **Dependency upgrade visual breakage** — upgrading a component library shifts spacing, changes default fonts, or alters animation timing
- **Z-index stacking bugs** — a modal overlay renders behind the navigation bar after a refactor of the layout component
- **Dark mode inconsistencies** — new feature looks correct in light mode but has invisible text (white-on-white) in dark mode
- **Font loading failures** — web font fails to load in CI, fallback system font renders differently, nobody notices until production screenshots look wrong
- **Responsive layout breaks** — a component that was tested at desktop width overflows its container at 768px after a grid change
- **Unintended color changes** — a design token update propagates to 47 components, 3 of which now have insufficient contrast
- **Animation/transition regressions** — a CSS transition that used to ease-in-out now snaps instantly because `transition` was accidentally removed

## When It's Required

- The feature has a user-facing interface (C4) that users interact with visually
- You're modifying an existing feature (C9) — prove the modification didn't shift anything else
- The project has a design system with documented visual specifications
- You're upgrading UI dependencies (component libraries, CSS frameworks, icon sets)
- The feature is user-facing (C14) and visual quality is a brand requirement

**Skip when:** The feature is purely backend, a CLI tool, or an API with no rendered output.

## Setup Guide

### Option 1: Playwright Built-in (Recommended for most projects)

Playwright has `toHaveScreenshot()` built in — no third-party service needed.

```bash
# Already installed if you have Playwright
npx playwright install
```

**Configuration in playwright.config.ts:**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,          // Allow up to 100 pixels to differ
      maxDiffPixelRatio: 0.01,     // Or 1% of total pixels
      threshold: 0.2,             // Per-pixel color difference tolerance (0-1)
      animations: 'disabled',      // Freeze CSS animations before capture
    },
  },
  // Run visual tests only in one browser to reduce baseline maintenance
  projects: [
    {
      name: 'visual',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        // Consistent rendering across OS
        deviceScaleFactor: 1,
        hasTouch: false,
      },
    },
  ],
});
```

### Option 2: Percy (BrowserStack) — Cloud-based comparison

```bash
npm install --save-dev @percy/cli @percy/playwright
```

Percy renders snapshots in their cloud across multiple browsers, manages baselines in a web dashboard, and handles approval workflows. Paid service — free tier covers small projects.

### Option 3: Chromatic — Storybook integration

```bash
npm install --save-dev chromatic
npx chromatic --project-token=YOUR_TOKEN
```

Chromatic captures every Storybook story as a visual test. If your project already uses Storybook, this is the lowest-friction option for component-level visual testing.

### Alternatives

- **BackstopJS** — open source, Docker-based for consistent rendering, good for page-level screenshots
- **reg-suit** — pluggable visual regression with S3 storage for baselines
- **Applitools Eyes** — AI-powered visual comparison (reduces false positives), enterprise pricing

## Template

### Page-level visual regression with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual regression: Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Stabilize dynamic content before screenshots
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('dashboard — default state', async ({ page }) => {
    // Mask dynamic content that changes every render
    await expect(page).toHaveScreenshot('dashboard-default.png', {
      mask: [
        page.locator('[data-testid="current-time"]'),
        page.locator('[data-testid="user-avatar"]'),
        page.locator('[data-testid="notification-count"]'),
      ],
    });
  });

  test('dashboard — empty state', async ({ page }) => {
    // Use API to clear data for this test
    await page.route('**/api/projects', (route) =>
      route.fulfill({ json: [] })
    );
    await page.reload();
    await expect(page).toHaveScreenshot('dashboard-empty.png');
  });

  test('dashboard — sidebar collapsed', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle sidebar' }).click();
    await expect(page.locator('.sidebar')).toHaveCSS('width', '64px');
    await expect(page).toHaveScreenshot('dashboard-sidebar-collapsed.png');
  });
});
```

### Multi-viewport visual testing

```typescript
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`pricing page — ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`pricing-${vp.name}.png`);
  });
}
```

### Component-level visual testing with Storybook + Chromatic

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    chromatic: {
      viewports: [375, 768, 1200],
      diffThreshold: 0.2,
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', children: 'Click me' } };
export const Disabled: Story = { args: { variant: 'primary', children: 'Click me', disabled: true } };
export const Loading: Story = { args: { variant: 'primary', children: 'Click me', loading: true } };
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {['primary', 'secondary', 'ghost', 'destructive'].map((variant) => (
        <Button key={variant} variant={variant as any}>{variant}</Button>
      ))}
    </div>
  ),
};
```

### Baseline update script (package.json)

```json
{
  "scripts": {
    "test:visual": "npx playwright test --project=visual",
    "test:visual:update": "npx playwright test --project=visual --update-snapshots",
    "test:visual:report": "npx playwright show-report"
  }
}
```

## Common Pitfalls

| Pitfall | Why It Happens | Fix |
|---------|---------------|-----|
| **Cross-OS baseline mismatches** | Screenshots taken on macOS differ from Linux CI due to font rendering, anti-aliasing, and sub-pixel positioning. | Run visual tests only in CI (Linux), or use Docker locally (`mcr.microsoft.com/playwright`) to match CI rendering. Never commit baselines from a different OS than CI. |
| **Flaky tests from dynamic content** | Timestamps, avatars, relative dates ("3 minutes ago"), notification badges change every run. | Mask dynamic regions with `mask: [locator]`. Mock API responses to return static data. Freeze time with `page.clock`. |
| **Baselines never updated** | Team approves visual changes verbally but forgets to update the baseline screenshots. Tests fail, everyone ignores them. | Make baseline updates part of the PR process. If a visual change is intentional, the PR must include updated baselines. CI blocks merge on visual diff. |
| **Too many screenshots** | Every page x every viewport x every state = 200+ baselines. Maintenance becomes a full-time job. | Prioritize: test the design system components thoroughly, then only critical pages at one viewport. Component-level visual tests (via Storybook) scale better than page-level. |
| **Animations cause flakes** | A spinner, skeleton loader, or CSS transition captures mid-frame differently each run. | Set `animations: 'disabled'` in Playwright config. For Chromatic, use `pauseAnimationAtEnd`. For custom solutions, add `[data-visual-test] * { animation: none !important; transition: none !important; }`. |
| **Large baseline diffs in PRs** | Binary PNG files bloat the git repo and make PRs unreadable. | Use Git LFS for snapshot directories, or use a cloud service (Percy, Chromatic) that stores baselines externally. Add `**/*.png` to `.gitattributes` with LFS tracking. |

## Proof Artifact

The visual regression suite must produce:

1. **All visual tests passing** — exit code 0 with screenshot comparison results
   ```
   Running 18 tests using 1 worker
   18 passed (45s)
   ```

2. **Baseline screenshots committed** — the `__screenshots__` or equivalent directory exists in the repo with current baselines, and the CI run used those baselines for comparison

3. **Diff report for any changes** — when a visual change is intentional, the PR includes the visual diff (old vs. new vs. diff overlay) either from Playwright HTML report, Percy dashboard URL, or Chromatic build link

4. **Viewport coverage documented** — which viewports are tested:
   ```
   | Page/Component   | Mobile (375) | Tablet (768) | Desktop (1440) |
   |------------------|:---:|:---:|:---:|
   | Dashboard        | yes | yes | yes |
   | Pricing page     | yes | yes | yes |
   | Button component | yes | —   | yes |
   | Modal component  | yes | —   | yes |
   ```

5. **Dynamic content handling documented** — list of masked or mocked elements per test, confirming that false positives are controlled
