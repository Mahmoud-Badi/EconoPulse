# Core Web Vitals Playbook

Comprehensive guide to measuring and optimizing LCP, INP, and CLS for {{PROJECT_NAME}}. Core Web Vitals are a confirmed Google ranking signal and directly impact user experience. This is not optional.

---

## The Three Metrics

| Metric | Full Name | What It Measures | Good | Needs Improvement | Poor |
|---|---|---|---|---|---|
| **LCP** | Largest Contentful Paint | How fast the main content loads | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** | Interaction to Next Paint | How responsive the page is to user input | < 200ms | 200ms - 500ms | > 500ms |
| **CLS** | Cumulative Layout Shift | How much the page layout shifts during load | < 0.1 | 0.1 - 0.25 | > 0.25 |

All thresholds are measured at the **75th percentile** of field data (real users), not lab data.

---

## Field Data vs Lab Data

Understanding the difference is critical. You will waste time optimizing the wrong things if you conflate them.

### Field Data (Real User Metrics / RUM)

- Collected from real users via Chrome UX Report (CrUX) or web-vitals.js
- Reflects actual device diversity, network conditions, and user behavior
- This is what Google uses for ranking
- Available in: PageSpeed Insights (origin summary), CrUX Dashboard, GSC Core Web Vitals report, BigQuery CrUX dataset

### Lab Data (Synthetic)

- Collected in a controlled environment with a specific device/network profile
- Reproducible and consistent — good for debugging
- Does NOT reflect real-world performance
- Available in: Lighthouse, PageSpeed Insights (lab section), WebPageTest, Chrome DevTools

### When to Use Which

| Scenario | Use Field Data | Use Lab Data |
|---|---|---|
| Determine if you pass CWV for ranking | Yes | No |
| Debug a specific performance issue | As a signal | Yes — primary tool |
| Measure impact of a code change | After deployment (delayed) | Immediately in CI |
| Compare before/after optimization | Both | Both |
| Investigate device-specific issues | Yes (segment by device) | Yes (emulate specific device) |

---

## LCP Optimization

LCP measures when the largest content element in the viewport becomes visible. The LCP element is usually a hero image, heading, or video poster.

### Step 1: Identify the LCP Element

```javascript
// In Chrome DevTools console:
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const last = entries[entries.length - 1];
  console.log("LCP element:", last.element);
  console.log("LCP time:", last.startTime);
}).observe({ type: "largest-contentful-paint", buffered: true });
```

Or use Lighthouse → Performance → view the LCP element in the filmstrip.

### Step 2: Optimize by Category

#### Server-Side Optimization

- [ ] **TTFB < 200ms** — the server must respond fast. LCP cannot be good if TTFB is bad.
  - Use a CDN for static assets and edge-cached HTML
  - Enable HTTP/2 or HTTP/3
  - Optimize database queries and API calls
  - Use streaming SSR where supported (Next.js App Router, Remix)
- [ ] **Eliminate server-side redirects** — each redirect adds 100-300ms

#### Resource-Level Optimization

- [ ] **Preload the LCP image** (if LCP element is an image):
  ```html
  <link rel="preload" as="image" href="/hero.webp"
        fetchpriority="high" />
  ```
- [ ] **Use modern formats**: WebP or AVIF instead of PNG/JPEG (30-50% smaller)
- [ ] **Responsive images** with `srcset` and `sizes`:
  ```html
  <img
    src="/hero-800.webp"
    srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w"
    sizes="(max-width: 768px) 100vw, 50vw"
    alt="{{HERO_ALT_TEXT}}"
    width="1200"
    height="630"
    fetchpriority="high"
  />
  ```
- [ ] **Do not lazy-load the LCP image** — lazy loading delays it. Use `loading="eager"` (or omit `loading` entirely since eager is default).
- [ ] **Set `fetchpriority="high"`** on the LCP image

#### Rendering Optimization

- [ ] **Inline critical CSS** — CSS blocks rendering. Inline the CSS needed for above-the-fold content.
- [ ] **Defer non-critical CSS**:
  ```html
  <link rel="preload" href="/styles/below-fold.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'" />
  ```
- [ ] **Minimize render-blocking JavaScript** — defer or async all non-critical scripts
- [ ] **Preload web fonts** used in the LCP element:
  ```html
  <link rel="preload" href="/fonts/inter-var.woff2" as="font"
        type="font/woff2" crossorigin />
  ```
- [ ] **Use `font-display: swap` or `font-display: optional`** to prevent font-related LCP delays

#### Element-Level Optimization

- [ ] If LCP is a text element: ensure the font loads fast (preload) and no FOIT occurs
- [ ] If LCP is an image: preload, serve correctly sized, modern format
- [ ] If LCP is a video poster: preload the poster image
- [ ] If LCP is a background image in CSS: convert to an `<img>` tag so the browser discovers it earlier, or use a preload link

### LCP Debugging Workflow

1. Run PageSpeed Insights — note the LCP time and element
2. Check TTFB — if > 500ms, fix server performance first
3. Check if LCP resource is preloaded — if not, add preload
4. Check LCP image size — if > 200KB, optimize
5. Check for render-blocking resources — defer if possible
6. Check font loading — preload and use font-display
7. Re-test after each change

---

## INP Optimization

INP (Interaction to Next Paint) measures the latency from user input (click, tap, keypress) to the next visual update. It captures three phases:

1. **Input delay** — time from user interaction to event handler start (blocked by other tasks)
2. **Processing time** — time for your event handlers to execute
3. **Presentation delay** — time from handler completion to next paint (rendering, compositing)

### Step 1: Identify Slow Interactions

```javascript
// In Chrome DevTools console:
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 200) {
      console.log("Slow interaction:", entry.name, entry.duration, "ms");
    }
  }
}).observe({ type: "event", buffered: true });
```

Or use Chrome DevTools → Performance panel → record an interaction → look for long tasks.

### Step 2: Reduce Input Delay

Input delay occurs when the main thread is busy with other tasks when the user interacts.

- [ ] **Break up long tasks** — any task > 50ms is a "long task" that blocks the main thread
  ```typescript
  // Before: one long synchronous operation
  function processAllItems(items: Item[]) {
    items.forEach(item => expensiveOperation(item));
  }

  // After: yield to main thread between chunks
  async function processAllItems(items: Item[]) {
    for (let i = 0; i < items.length; i++) {
      expensiveOperation(items[i]);
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
  }
  ```
- [ ] **Use `scheduler.yield()`** (where supported) or the pattern above
- [ ] **Minimize third-party scripts** — analytics, ads, chat widgets all compete for main thread
- [ ] **Defer non-critical initialization** — do not run heavy setup code on page load
- [ ] **Use web workers** for CPU-intensive computation that does not need DOM access

### Step 3: Reduce Processing Time

- [ ] **Keep event handlers fast** — under 100ms total
- [ ] **Debounce rapid-fire events** (scroll, resize, input) — do not run expensive handlers on every event
- [ ] **Avoid synchronous layout (forced reflow)** — reading layout properties (offsetHeight, getBoundingClientRect) after DOM writes forces the browser to recalculate layout
  ```typescript
  // Bad: forced reflow
  element.style.width = "100px";
  const height = element.offsetHeight; // forces layout recalculation

  // Good: batch reads, then writes
  const height = element.offsetHeight; // read first
  element.style.width = "100px"; // then write
  ```
- [ ] **Use `requestAnimationFrame`** for visual updates to avoid unnecessary reflows

### Step 4: Reduce Presentation Delay

- [ ] **Minimize DOM size** — pages with 1,500+ DOM nodes render slower. Target < 1,000 for interactive pages.
- [ ] **Avoid large layout recalculations** — use CSS `contain` property to limit recalc scope
- [ ] **Use `content-visibility: auto`** for off-screen content — skips rendering until needed
- [ ] **Use CSS `will-change`** sparingly for elements that animate

### INP Debugging Workflow

1. Use Chrome DevTools Performance panel — record the interaction
2. Find the interaction in the flame chart
3. Identify which phase is slow: input delay (gray before handler), processing (handler execution), presentation (after handler, before paint)
4. If input delay is high: find and break up the long task running when the interaction occurred
5. If processing is high: optimize the event handler
6. If presentation delay is high: simplify DOM updates, reduce layout scope

---

## CLS Optimization

CLS measures how much the visible content shifts during the page lifecycle. Any element that moves after becoming visible contributes to CLS.

### Common Causes and Fixes

#### Images and Videos Without Dimensions

```html
<!-- Bad: no dimensions — image loads and shifts content -->
<img src="/photo.webp" alt="{{ALT_TEXT}}" />

<!-- Good: explicit dimensions — browser reserves space -->
<img src="/photo.webp" alt="{{ALT_TEXT}}" width="800" height="600" />

<!-- Also good: CSS aspect-ratio -->
<img src="/photo.webp" alt="{{ALT_TEXT}}" style="aspect-ratio: 4/3; width: 100%;" />
```

#### Web Fonts Causing Layout Shifts

```css
/* Use font-display: swap with a metrically-similar fallback */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-display: swap;
  /* Size-adjust to match fallback metrics */
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

Or use `next/font` in Next.js which handles this automatically:

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });
```

#### Dynamically Injected Content

- [ ] **Ads**: Reserve space with fixed-size containers before the ad loads
  ```css
  .ad-slot {
    min-height: 250px; /* match expected ad height */
    width: 300px;
  }
  ```
- [ ] **Banners/notifications**: Insert above the viewport or use `transform` animations (transforms do not cause layout shifts)
- [ ] **Cookie consent**: Use a fixed-position overlay, not a banner that pushes content down
- [ ] **Lazy-loaded content**: Set explicit dimensions or use aspect-ratio placeholders

#### Async Content (API-driven)

- [ ] Use skeleton screens with fixed dimensions while data loads
- [ ] Never insert content above existing visible content
- [ ] Use CSS `contain: layout` on containers with dynamic content

### CLS Debugging Workflow

1. Open Chrome DevTools → Performance panel → check "Screenshots"
2. Reload the page and look for layout shifts in the "Experience" row
3. Click on a shift event — it shows which elements moved
4. Fix the shifting element: add dimensions, reserve space, or change insertion point
5. The Layout Shift Regions overlay in DevTools (Rendering tab) highlights shifts in real-time

---

## Measurement Tools

### PageSpeed Insights

- URL: `https://pagespeed.web.dev/`
- Shows both field data (CrUX) and lab data (Lighthouse)
- Use field data for pass/fail assessment; use lab data for specific recommendations
- Test both mobile and desktop

### Chrome UX Report (CrUX)

- Real-user data aggregated by Google from Chrome users
- Available via: BigQuery (raw data), CrUX API (per-URL), PageSpeed Insights (summary)
- Updated monthly for origin-level data; daily for URL-level via API
- Minimum traffic threshold required for URL-level data

### web-vitals.js

The official Google library for measuring CWV in the browser:

```typescript
// lib/vitals.ts
import { onLCP, onINP, onCLS } from "web-vitals";

function sendToAnalytics(metric: { name: string; value: number; id: string }) {
  // Send to {{ANALYTICS_ENDPOINT}}
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    page: window.location.pathname,
  });
  // Use sendBeacon for reliability on page unload
  navigator.sendBeacon("{{ANALYTICS_ENDPOINT}}/vitals", body);
}

export function initVitals() {
  onLCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onCLS(sendToAnalytics);
}
```

### Chrome DevTools Performance Panel

- Best for debugging specific issues
- Record a page load or interaction, then analyze the flame chart
- Look for: long tasks, forced reflows, layout shifts, slow network requests
- Use the "Timings" lane to see LCP and other marks

### CrUX API

```bash
# Query CrUX API for a specific URL
curl "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key={{CRUX_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "{{BASE_URL}}/",
    "metrics": ["largest_contentful_paint", "interaction_to_next_paint", "cumulative_layout_shift"]
  }'
```

---

## Framework-Specific Optimization

### Next.js (App Router)

```typescript
// next.config.ts — performance-related configuration
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  experimental: {
    optimizeCss: true, // requires critters
  },
};
export default config;
```

Key patterns:
- Use `next/image` for automatic optimization (format, size, lazy-load)
- Use `next/font` for zero-CLS font loading
- Use `loading.tsx` for streaming SSR with Suspense boundaries
- Set `fetchpriority="high"` on above-the-fold `<Image>` components
- Use `priority` prop on `<Image>` for the LCP image (disables lazy loading + adds preload)

### Remix

- Remix streams HTML by default — good for TTFB
- Use `defer` in loaders to stream non-critical data:
  ```typescript
  export async function loader() {
    return defer({
      criticalData: await getCriticalData(), // blocks render
      deferredData: getDeferredData(),        // streams later
    });
  }
  ```
- Use `<link rel="preload">` in the `links` export for critical assets

### Astro

- Static-first by default — excellent LCP
- Use `<Image>` component for automatic optimization
- Islands architecture means minimal JS by default — excellent INP
- Use `loading="eager"` and `fetchpriority="high"` on above-the-fold images

### Nuxt

- Use `<NuxtImg>` for image optimization
- Use `nuxt-font` for optimized font loading
- Configure `routeRules` for ISR where appropriate:
  ```typescript
  export default defineNuxtConfig({
    routeRules: {
      "/blog/**": { swr: 3600 }, // stale-while-revalidate, 1 hour
    },
  });
  ```

---

## Performance Budget System

Define thresholds and enforce them in CI. A performance budget prevents regressions.

### Budget Definition

```json
{
  "budgets": [
    {
      "path": "/*",
      "resourceSizes": [
        { "resourceType": "script", "budget": 300 },
        { "resourceType": "stylesheet", "budget": 50 },
        { "resourceType": "image", "budget": 500 },
        { "resourceType": "total", "budget": 1000 }
      ],
      "resourceCounts": [
        { "resourceType": "script", "budget": 15 },
        { "resourceType": "third-party", "budget": 5 }
      ],
      "timings": [
        { "metric": "largest-contentful-paint", "budget": 2500 },
        { "metric": "total-blocking-time", "budget": 300 },
        { "metric": "cumulative-layout-shift", "budget": 0.1 }
      ]
    }
  ]
}
```

All `resourceSizes` values are in KB.

### CI Enforcement

```yaml
# In your CI pipeline (GitHub Actions example)
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --config=lighthouserc.json
  env:
    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

```javascript
// lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

---

## Preloading and Resource Hints

```html
<!-- Preload: resources needed for current page, discovered late -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />

<!-- Preconnect: establish early connections to third-party origins -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://cdn.{{DOMAIN}}" crossorigin />

<!-- DNS Prefetch: resolve DNS for origins you'll need soon -->
<link rel="dns-prefetch" href="https://analytics.{{DOMAIN}}" />

<!-- Prefetch: resources needed for the NEXT page (speculative) -->
<link rel="prefetch" href="/about" />

<!-- Modulepreload: preload ES modules -->
<link rel="modulepreload" href="/js/critical-module.js" />
```

### When to Use Each

| Hint | Use When | Impact |
|---|---|---|
| `preload` | Resource is needed for current page but discovered late by browser | High — directly improves LCP |
| `preconnect` | You know you will fetch from a third-party origin | Medium — saves 100-300ms per origin |
| `dns-prefetch` | Lower priority than preconnect; for origins used later | Low — saves 20-50ms |
| `prefetch` | User is likely to navigate to a specific page next | None on current page; improves next navigation |
| `modulepreload` | Critical JS modules that would otherwise load in a chain | Medium — breaks dependency chains |

---

## Cross-References

- Performance testing infrastructure: `08-quality-testing/performance-budget/`
- Rendering strategies: [rendering-seo.md](rendering-seo.md)
- Master checklist: [technical-seo-checklist.md](technical-seo-checklist.md)
- SEO measurement: `36-seo/measurement/`
