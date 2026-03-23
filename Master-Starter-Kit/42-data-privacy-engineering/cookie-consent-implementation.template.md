# Cookie Consent Implementation

> {{PROJECT_NAME}} — Cookie audit, classification, consent banner architecture, TCF 2.2 compliance, CMP selection, server-side enforcement, and consent testing.

---

## 1. Cookie Audit & Classification

Before building a consent banner, audit every cookie and tracking technology your application uses. Most teams undercount cookies by 40-60% because third-party scripts set cookies silently.

### Cookie Audit Process

1. **Automated scan:** Use a cookie scanner (Cookiebot scanner, OneTrust scanner, or browser DevTools) to capture all cookies set during a full user journey
2. **Third-party script audit:** Review every `<script>` tag, SDK import, and iframe for tracking behavior
3. **Local storage audit:** Check `localStorage`, `sessionStorage`, and `IndexedDB` for tracking data
4. **Pixel audit:** Identify all tracking pixels (Meta Pixel, Google Ads, LinkedIn Insight, etc.)
5. **Fingerprinting audit:** Check for canvas fingerprinting, WebGL fingerprinting, or other device fingerprinting

### Cookie Classification Table

| Cookie Name | Provider | Category | Purpose | Duration | Domain | Data Collected | GDPR Basis |
|------------|----------|----------|---------|----------|--------|---------------|-----------|
| `session_id` | First-party | Necessary | Session management | Session | `.{{DOMAIN}}` | Session token | Contract |
| `csrf_token` | First-party | Necessary | CSRF protection | Session | `.{{DOMAIN}}` | Random token | Legitimate interest |
| `auth_token` | First-party | Necessary | Authentication | 30 days | `.{{DOMAIN}}` | JWT | Contract |
| `locale` | First-party | Functional | Language preference | 1 year | `.{{DOMAIN}}` | Language code | Legitimate interest |
| `theme` | First-party | Functional | UI theme preference | 1 year | `.{{DOMAIN}}` | Theme name | Legitimate interest |
| `_ga` | Google Analytics | Analytics | User distinction | 2 years | `.{{DOMAIN}}` | Client ID | Consent |
| `_gid` | Google Analytics | Analytics | User distinction | 24 hours | `.{{DOMAIN}}` | Client ID | Consent |
| `_fbp` | Meta Pixel | Marketing | Ad targeting | 3 months | `.{{DOMAIN}}` | Browser ID | Consent |
| `_gcl_au` | Google Ads | Marketing | Conversion tracking | 3 months | `.{{DOMAIN}}` | Conversion data | Consent |
| *(Audit and add all cookies)* | | | | | | | |

### Classification Categories

| Category | Consent Required? | Description | Examples |
|----------|------------------|-------------|---------|
| **Necessary** | No | Essential for the website to function. Cannot be disabled. | Session cookies, CSRF tokens, auth tokens, load balancer cookies |
| **Functional** | Depends on jurisdiction | Enhance user experience but are not strictly necessary. | Language preferences, theme, recently viewed items |
| **Analytics** | Yes (EU), Configurable (US) | Measure website usage and performance. | Google Analytics, Mixpanel, Hotjar, Plausible |
| **Marketing** | Yes | Track users across websites for advertising purposes. | Meta Pixel, Google Ads, LinkedIn Insight Tag, retargeting |

---

## 2. Consent Banner Architecture

### Banner Component Implementation

```typescript
// src/privacy/cookies/consent-banner.tsx

interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  defaultEnabled: boolean;
  cookies: string[];
}

const CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: 'necessary',
    name: 'Necessary',
    description: 'Essential cookies required for the website to function. These cannot be disabled.',
    required: true,
    defaultEnabled: true,
    cookies: ['session_id', 'csrf_token', 'auth_token'],
  },
  {
    id: 'functional',
    name: 'Functional',
    description: 'Cookies that enhance your experience, such as remembering your language preference.',
    required: false,
    defaultEnabled: false,
    cookies: ['locale', 'theme', 'recent_items'],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Cookies that help us understand how you use our product so we can improve it.',
    required: false,
    defaultEnabled: false,
    cookies: ['_ga', '_gid', '_gat'],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Cookies used to deliver relevant advertisements and measure their effectiveness.',
    required: false,
    defaultEnabled: false,
    cookies: ['_fbp', '_gcl_au', 'li_sugr'],
  },
];

function ConsentBanner() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [showDetails, setShowDetails] = useState(false);

  const handleAcceptAll = () => {
    const allGranted = Object.fromEntries(
      CONSENT_CATEGORIES.map((cat) => [cat.id, true])
    );
    saveConsentPreferences(allGranted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = Object.fromEntries(
      CONSENT_CATEGORIES.map((cat) => [cat.id, cat.required])
    );
    saveConsentPreferences(onlyNecessary);
  };

  const handleSavePreferences = () => {
    const finalPreferences = Object.fromEntries(
      CONSENT_CATEGORIES.map((cat) => [
        cat.id,
        cat.required ? true : (preferences[cat.id] ?? cat.defaultEnabled),
      ])
    );
    saveConsentPreferences(finalPreferences);
  };

  return (
    <div role="dialog" aria-label="Cookie consent" aria-modal="true">
      <h2>We value your privacy</h2>
      <p>
        We use cookies to enhance your experience. You can customize your
        preferences or accept all cookies.
      </p>

      {showDetails && (
        <div>
          {CONSENT_CATEGORIES.map((category) => (
            <div key={category.id}>
              <label>
                <input
                  type="checkbox"
                  checked={category.required || preferences[category.id]}
                  disabled={category.required}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      [category.id]: e.target.checked,
                    }))
                  }
                />
                <strong>{category.name}</strong>
                {category.required && <span> (Required)</span>}
              </label>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        {/* Equal visual weight for Accept and Reject — no dark patterns */}
        <button onClick={handleRejectAll}>Reject All</button>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Details' : 'Customize'}
        </button>
        {showDetails ? (
          <button onClick={handleSavePreferences}>Save Preferences</button>
        ) : (
          <button onClick={handleAcceptAll}>Accept All</button>
        )}
      </div>
    </div>
  );
}
```

### Consent Persistence

```typescript
// src/privacy/cookies/consent-storage.ts

interface CookieConsent {
  categories: Record<string, boolean>;
  timestamp: string;
  version: string; // Consent text version
  jurisdiction: string;
  source: 'banner' | 'settings' | 'gpc';
}

function saveConsentPreferences(categories: Record<string, boolean>): void {
  const consent: CookieConsent = {
    categories,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
    jurisdiction: detectJurisdiction(),
    source: 'banner',
  };

  // 1. Store in a first-party cookie (accessible server-side)
  document.cookie = `cookie_consent=${encodeURIComponent(
    JSON.stringify(consent)
  )}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax; Secure`;

  // 2. Send to server for persistent storage
  fetch('/api/v1/privacy/cookie-consent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(consent),
  });

  // 3. Apply consent immediately — enable/disable scripts
  applyConsentDecisions(categories);
}

function applyConsentDecisions(categories: Record<string, boolean>): void {
  // Remove cookies for denied categories
  for (const category of CONSENT_CATEGORIES) {
    if (!categories[category.id] && !category.required) {
      for (const cookieName of category.cookies) {
        deleteCookie(cookieName);
      }
    }
  }

  // Enable/disable tracking scripts
  if (categories.analytics) {
    loadAnalyticsScripts();
  } else {
    unloadAnalyticsScripts();
  }

  if (categories.marketing) {
    loadMarketingScripts();
  } else {
    unloadMarketingScripts();
  }
}
```

---

## 3. TCF 2.2 Compliance

The Transparency and Consent Framework (TCF) 2.2 by IAB Europe standardizes how consent is communicated to advertising vendors in the programmatic advertising ecosystem.

### When TCF 2.2 Is Required

| Scenario | TCF Required? | Reason |
|----------|--------------|--------|
| Display advertising with programmatic buying | Yes | Ad exchanges require TCF consent strings |
| Self-serve advertising (no programmatic) | No | Direct relationships, no TCF needed |
| Analytics only (no advertising) | No | TCF is advertising-specific |
| Affiliate marketing | Usually no | Direct partner relationships |
| Content recommendation widgets | Depends | If they use programmatic ad tech, yes |

### TCF 2.2 Key Concepts

| Concept | Description |
|---------|-------------|
| **TC String** | Encoded consent preferences sent to ad tech vendors via APIs |
| **Purposes** | 11 standard purposes (e.g., Store/access info on device, Create personalized ads profile) |
| **Special Purposes** | 2 purposes that can use legitimate interest (security, ad delivery) |
| **Features** | 3 features vendors may use (matching, linking, active scanning) |
| **Special Features** | 2 features requiring opt-in (precise geolocation, active scanning) |
| **Vendors** | Registered ad tech companies in the Global Vendor List (GVL) |

### TCF 2.2 Implementation

<!-- IF {{COOKIE_CONSENT_PLATFORM}} == "custom" -->
Building a TCF 2.2 compliant CMP from scratch is not recommended. The specification is complex, requires IAB registration, and must pass conformance testing. Use a certified CMP instead.
<!-- ENDIF -->

If using a certified CMP ({{COOKIE_CONSENT_PLATFORM}}), TCF 2.2 is handled by the CMP. Your responsibilities:

- [ ] Register with IAB Europe as a CMP (or use a registered CMP provider)
- [ ] Configure vendor list based on your actual ad tech partners
- [ ] Ensure TC String is passed correctly in ad requests
- [ ] Implement `__tcfapi` JavaScript API per TCF spec
- [ ] Test consent string generation and vendor signal propagation

---

## 4. CMP Selection

### CMP Comparison Matrix

| CMP | TCF 2.2 | Pricing | Customization | Analytics | A/B Testing | GDPR | CCPA | Integration Effort |
|-----|---------|---------|---------------|-----------|-------------|------|------|-------------------|
| **OneTrust** | Yes | Enterprise pricing | High | Yes | Yes | Yes | Yes | Medium |
| **Cookiebot** | Yes | Free < 100 pages | Medium | Yes | No | Yes | Yes | Low |
| **Usercentrics** | Yes | Mid-market | High | Yes | Yes | Yes | Yes | Medium |
| **Osano** | Yes | Transparent pricing | Medium | Yes | No | Yes | Yes | Low |
| **Custom** | Manual | Dev cost only | Unlimited | Custom | Custom | Manual | Manual | High |

### Selection Criteria

- [ ] Does it support all jurisdictions in {{PRIVACY_JURISDICTIONS}}?
- [ ] Does it support TCF 2.2 (if programmatic advertising is used)?
- [ ] Can it detect user jurisdiction automatically (geolocation)?
- [ ] Does it integrate with your analytics stack?
- [ ] Can it block scripts server-side (not just client-side)?
- [ ] Does it provide consent analytics and reporting?
- [ ] Does it support A/B testing of consent UX?
- [ ] Is the pricing sustainable at your scale?
- [ ] Does it meet accessibility requirements (WCAG 2.1 AA)?
- [ ] Does it support GPC signal detection?

---

## 5. Server-Side Consent Enforcement

Client-side consent banners are necessary but not sufficient. Scripts can load before the consent banner renders. Ad blockers can interfere with consent state. Server-side enforcement provides the authoritative consent check.

### Server-Side Consent Middleware

```typescript
// src/privacy/cookies/server-consent-middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function consentMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  const consentCookie = request.cookies.get('cookie_consent');

  if (!consentCookie) {
    // No consent recorded — strip all non-necessary cookies from response
    stripNonNecessaryCookies(response);
    // Add header to signal client: show consent banner
    response.headers.set('X-Consent-Required', 'true');
    return response;
  }

  try {
    const consent: CookieConsent = JSON.parse(
      decodeURIComponent(consentCookie.value)
    );

    // Check consent version — if outdated, require re-consent
    if (consent.version !== CURRENT_CONSENT_VERSION) {
      response.headers.set('X-Consent-Outdated', 'true');
    }

    // Enforce consent on server-rendered pages
    if (!consent.categories.analytics) {
      // Remove analytics script injection from HTML response
      response.headers.set('X-Block-Analytics', 'true');
    }

    if (!consent.categories.marketing) {
      // Remove marketing pixel injection
      response.headers.set('X-Block-Marketing', 'true');
    }
  } catch {
    // Invalid consent cookie — treat as no consent
    stripNonNecessaryCookies(response);
    response.headers.set('X-Consent-Required', 'true');
  }

  return response;
}

// Script blocking in page rendering
function renderPage(consentHeaders: Headers): string {
  const blockAnalytics = consentHeaders.get('X-Block-Analytics') === 'true';
  const blockMarketing = consentHeaders.get('X-Block-Marketing') === 'true';

  return `
    <html>
      <head>
        ${!blockAnalytics ? analyticsScriptTag() : '<!-- Analytics blocked by consent -->'}
        ${!blockMarketing ? marketingScriptTag() : '<!-- Marketing blocked by consent -->'}
      </head>
      ...
    </html>
  `;
}
```

### GPC Signal Detection

```typescript
// src/privacy/cookies/gpc-detection.ts

// Global Privacy Control — browser signal for opt-out
function detectGPC(request: NextRequest): boolean {
  // Check Sec-GPC header (HTTP request header)
  const gpcHeader = request.headers.get('Sec-GPC');
  if (gpcHeader === '1') return true;

  return false;
}

// Client-side GPC detection
function detectGPCClient(): boolean {
  if (typeof navigator !== 'undefined' && 'globalPrivacyControl' in navigator) {
    return (navigator as any).globalPrivacyControl === true;
  }
  return false;
}

// When GPC is detected:
// 1. Treat as opt-out for analytics and marketing (CCPA)
// 2. Do NOT override explicit user consent (GDPR)
// 3. Log GPC detection for compliance records
```

---

## 6. Consent Testing

Cookie consent must be tested on every deployment. A broken consent banner is a compliance violation.

### Consent Test Cases

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| CC-001 | First visit — no consent cookie exists | Banner appears, no analytics/marketing cookies set | Critical |
| CC-002 | Accept all cookies | All cookie categories set, banner dismissed, consent stored | Critical |
| CC-003 | Reject all cookies | Only necessary cookies remain, analytics/marketing cookies deleted | Critical |
| CC-004 | Custom selection — analytics only | Only necessary + analytics cookies set | High |
| CC-005 | Re-open banner from footer link | Previous preferences pre-selected | High |
| CC-006 | Withdraw consent via settings | Relevant cookies deleted immediately | Critical |
| CC-007 | GPC signal active | Analytics and marketing blocked automatically | High |
| CC-008 | Consent version change | Re-consent banner shown on next visit | High |
| CC-009 | Banner accessibility | Screen reader compatible, keyboard navigable, sufficient contrast | High |
| CC-010 | Banner does not block page content | Page is usable while banner is visible | Medium |
| CC-011 | Consent persists across sessions | Returning user does not see banner again | High |
| CC-012 | Consent applies to all subdomains | Cookie scope covers `*.{{DOMAIN}}` | Medium |
| CC-013 | Accept/Reject buttons have equal visual weight | No dark patterns — similar size, color, placement | High |
| CC-014 | Server-side enforcement | Analytics scripts not injected when consent is denied | Critical |
| CC-015 | Third-party scripts respect consent | No tracking scripts fire before consent is given | Critical |

### Automated Consent Testing

```typescript
// tests/privacy/cookie-consent.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Cookie Consent', () => {
  test('no tracking cookies before consent', async ({ page, context }) => {
    await page.goto('/');

    // Check that no analytics/marketing cookies exist
    const cookies = await context.cookies();
    const trackingCookies = cookies.filter(
      (c) => ['_ga', '_gid', '_fbp', '_gcl_au'].includes(c.name)
    );
    expect(trackingCookies).toHaveLength(0);

    // Verify consent banner is visible
    await expect(page.getByRole('dialog', { name: 'Cookie consent' })).toBeVisible();
  });

  test('reject all removes tracking cookies', async ({ page, context }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Reject All' }).click();

    const cookies = await context.cookies();
    const trackingCookies = cookies.filter(
      (c) => !['session_id', 'csrf_token', 'auth_token', 'cookie_consent'].includes(c.name)
    );
    expect(trackingCookies).toHaveLength(0);

    // Verify banner is dismissed
    await expect(page.getByRole('dialog', { name: 'Cookie consent' })).not.toBeVisible();
  });

  test('accept all sets all cookie categories', async ({ page, context }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Accept All' }).click();

    // Verify consent cookie is set
    const cookies = await context.cookies();
    const consentCookie = cookies.find((c) => c.name === 'cookie_consent');
    expect(consentCookie).toBeDefined();

    const consent = JSON.parse(decodeURIComponent(consentCookie!.value));
    expect(consent.categories.analytics).toBe(true);
    expect(consent.categories.marketing).toBe(true);
  });
});
```

### Cookie Consent Implementation Checklist

- [ ] Cookie audit completed — all cookies classified
- [ ] Consent banner implemented with equal Accept/Reject prominence
- [ ] Necessary cookies are identified and set without consent
- [ ] Analytics scripts load ONLY after consent is granted
- [ ] Marketing scripts load ONLY after consent is granted
- [ ] Consent preferences are stored in a durable, server-accessible cookie
- [ ] Consent preferences are persisted to the server for compliance records
- [ ] Footer link allows users to re-open cookie preferences at any time
- [ ] GPC signal is detected and honored
- [ ] Server-side enforcement blocks script injection for denied categories
- [ ] Consent versioning triggers re-consent when cookie policy changes
- [ ] Banner meets WCAG 2.1 AA accessibility requirements
- [ ] Automated tests verify consent behavior on every deployment
- [ ] Cookie policy page lists all cookies with descriptions and durations
- [ ] TCF 2.2 implemented if programmatic advertising is used
