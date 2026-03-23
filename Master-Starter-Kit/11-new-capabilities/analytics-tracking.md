# Analytics Tracking

## Purpose

Set up privacy-compliant analytics tracking with a structured event taxonomy, conversion funnels, and actionable dashboards. This guide covers both self-hosted and SaaS options.

## Analytics Library Setup

### Option A: PostHog (Recommended for Self-Hosted / Product Analytics)

```bash
npm install posthog-js
```

```typescript
// lib/analytics.ts
import posthog from "posthog-js";

export function initAnalytics() {
  if (typeof window === "undefined") return;

  posthog.init("{{POSTHOG_API_KEY}}", {
    api_host: "{{POSTHOG_HOST}}", // e.g., https://app.posthog.com or self-hosted URL
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    autocapture: false, // prefer explicit events for cleaner data
  });
}

export { posthog };
```

### Option B: Google Analytics 4 (Simple / Marketing-Focused)

```typescript
// lib/analytics.ts
export function initAnalytics() {
  if (typeof window === "undefined") return;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id={{GA_MEASUREMENT_ID}}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", "{{GA_MEASUREMENT_ID}}", {
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });
}
```

## Event Taxonomy Template

Use a consistent `category.action.label` naming convention for all custom events.

| Category       | Action         | Label (Example)          | Value       |
| -------------- | -------------- | ------------------------ | ----------- |
| `auth`         | `signup`       | `google`, `email`        | -           |
| `auth`         | `login`        | `google`, `email`        | -           |
| `onboarding`   | `step_complete`| `profile`, `invite_team` | step number |
| `feature`      | `used`         | `{{FEATURE_NAME}}`       | -           |
| `subscription` | `started`      | `pro`, `enterprise`      | MRR cents   |
| `subscription` | `cancelled`    | `pro`, `enterprise`      | MRR cents   |
| `engagement`   | `page_view`    | page path                | -           |
| `engagement`   | `session_start`| referrer                 | -           |

```typescript
// lib/track.ts
type EventCategory = "auth" | "onboarding" | "feature" | "subscription" | "engagement";

interface TrackEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
}

export function track({ category, action, label, value, properties }: TrackEvent) {
  const eventName = `${category}.${action}`;
  posthog.capture(eventName, { label, value, ...properties });
}
```

## User Journey Tracking Plan

Define the key user journeys you need to measure before writing any tracking code.

```
Journey: New User Activation
1. Landing page view         -> engagement.page_view (label: /landing)
2. Signup click              -> auth.signup_intent
3. Signup complete           -> auth.signup (label: method)
4. Onboarding step 1         -> onboarding.step_complete (label: profile, value: 1)
5. Onboarding step 2         -> onboarding.step_complete (label: workspace, value: 2)
6. First core action         -> feature.used (label: {{CORE_FEATURE}})
7. Activation milestone      -> onboarding.activated
```

## Conversion Funnel Definition

```typescript
// Define funnels as typed arrays for consistency
const SIGNUP_FUNNEL = [
  "engagement.page_view",      // Landed
  "auth.signup_intent",        // Clicked signup
  "auth.signup",               // Completed signup
  "onboarding.step_complete",  // Started onboarding
  "onboarding.activated",      // Reached activation
] as const;

const UPGRADE_FUNNEL = [
  "subscription.viewed_pricing",
  "subscription.selected_plan",
  "subscription.entered_payment",
  "subscription.started",
] as const;
```

## Privacy-Compliant Tracking

### Cookie Consent Banner

```typescript
// components/CookieConsent.tsx
export function CookieConsent() {
  const [consent, setConsent] = useState<"pending" | "accepted" | "rejected">(
    () => (localStorage.getItem("analytics_consent") as any) || "pending"
  );

  function handleAccept() {
    localStorage.setItem("analytics_consent", "accepted");
    setConsent("accepted");
    initAnalytics(); // Only initialize after consent
  }

  function handleReject() {
    localStorage.setItem("analytics_consent", "rejected");
    setConsent("rejected");
  }

  if (consent !== "pending") return null;

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 ...">
      <p>We use analytics cookies to improve your experience.</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleReject}>Decline</button>
    </div>
  );
}
```

### GDPR-Compliant Event Rules

- Never track PII (email, name, IP) in event properties without consent.
- Use anonymous user IDs until the user authenticates and consents.
- Provide a data deletion endpoint or process: `posthog.reset()` clears the local user.
- Set data retention policies (e.g., 90 days for raw events).
- Document every tracked event in a shared taxonomy spreadsheet.

## SaaS Event Patterns

```typescript
// Signup
track({ category: "auth", action: "signup", label: "google" });

// Activation (user completed key action within first session)
track({ category: "onboarding", action: "activated" });

// Feature usage (track each core feature separately)
track({ category: "feature", action: "used", label: "ai_summary" });

// Churn indicators
track({ category: "engagement", action: "dormant_warning" }); // No login in 7 days
track({ category: "subscription", action: "cancelled", label: "pro", value: 2900 });
```

## Analytics Dashboard Template

Track these key metrics on your primary dashboard:

| Metric                    | Source Event                   | Aggregation      |
| ------------------------- | ------------------------------ | ---------------- |
| Daily Active Users (DAU)  | `engagement.session_start`     | Unique users/day |
| Signup Rate               | `auth.signup`                  | Count/day        |
| Activation Rate           | `onboarding.activated / auth.signup` | Percentage |
| Feature Adoption          | `feature.used` by label        | Unique users     |
| Churn Rate                | `subscription.cancelled`       | Monthly %        |
| Revenue (MRR)             | `subscription.started` value   | Sum              |
| Conversion Funnel         | Signup funnel steps            | Step drop-off %  |

## A/B Testing Integration

```typescript
// Using PostHog feature flags for A/B tests
const variant = posthog.getFeatureFlag("pricing-page-test");

// Track which variant was shown
track({
  category: "experiment",
  action: "exposed",
  label: "pricing-page-test",
  properties: { variant },
});

// Track conversion per variant (PostHog correlates automatically)
track({ category: "subscription", action: "started", label: "pro" });
```

## Server-Side vs Client-Side Tracking

| Aspect          | Client-Side                  | Server-Side                     |
| --------------- | ---------------------------- | ------------------------------- |
| Reliability     | Blocked by ad blockers (~30%)| Always fires                    |
| Latency impact  | Adds JS to page              | No client impact                |
| Data accuracy   | Subject to bot traffic       | Validated server events         |
| Use for         | UI interactions, page views  | Purchases, signups, API usage   |
| Implementation  | SDK in browser               | HTTP API calls from backend     |

**Recommendation**: Use client-side for UI/UX events and server-side for business-critical events (signups, payments, API usage). This hybrid approach maximizes accuracy for the events that matter most.

```typescript
// Server-side tracking example (Node.js)
import { PostHog } from "posthog-node";

const posthogServer = new PostHog("{{POSTHOG_API_KEY}}", {
  host: "{{POSTHOG_HOST}}",
});

export function trackServerEvent(userId: string, event: string, properties?: Record<string, unknown>) {
  posthogServer.capture({ distinctId: userId, event, properties });
}

// Usage in API route
trackServerEvent(user.id, "subscription.started", { plan: "pro", mrr: 2900 });
```
