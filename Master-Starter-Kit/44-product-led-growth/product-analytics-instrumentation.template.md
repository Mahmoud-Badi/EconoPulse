# Product Analytics Instrumentation

> Define a consistent event taxonomy, standard event library, property schemas, funnel definitions, cohort analysis setup, feature usage tracking, analytics tool configuration, and data quality rules for PLG measurement.

---

## 1. Naming Convention

A consistent naming convention is the foundation of trustworthy analytics. Without it, teams create duplicate events, misspell event names, and lose the ability to query data reliably.

### Convention: `object.action`

All events follow the `object.action` format in snake_case. The object is the noun (what was interacted with), and the action is the verb (what happened to it).

```
Format:  {object}.{action}
Case:    snake_case for both object and action
Depth:   Maximum 2 levels (object.action) — no deeper nesting

GOOD:
  project.created
  user.signed_up
  invite.sent
  checkout.completed
  feature_gate.encountered

BAD:
  Created Project          (wrong format, PascalCase)
  user_signed_up           (underscore instead of dot)
  project.task.created     (3 levels deep — use project_task.created)
  click_upgrade_button     (action-first, not object-first)
  pageview                 (no dot separator)
```

### Object Registry

Register all objects before creating events. This prevents synonyms (project vs workspace vs space) from fragmenting data.

| Object | Description | Synonyms to Avoid |
|--------|------------|-------------------|
| `user` | An individual person using the product | account, member, person |
| `account` | An organizational account (workspace/team) | org, team, company |
| `project` | A project/workspace within an account | workspace, space, board |
| `invite` | An invitation to join | referral (different object) |
| `feature_gate` | A paywall or feature lock | paywall, lock, gate |
| `checkout` | The purchase/upgrade flow | payment, purchase, buy |
| `subscription` | A paid plan subscription | plan, billing |
| `session` | A user session (login to logout/timeout) | visit |
| `page` | A page view | screen, view |
| `search` | A search query | query, find |
| `notification` | A notification (email, push, in-app) | alert, message |
| `integration` | A third-party integration | connection, plugin |
| `export` | A data export | download |
| `referral` | A referral program interaction | invite (different object) |
| `experiment` | An A/B test variant assignment | test, variant |
| `support` | A support interaction | help, ticket |

### Action Registry

| Action | Description | Common Objects |
|--------|------------|----------------|
| `created` | Object was created | project, account, export |
| `updated` | Object was modified | project, user, subscription |
| `deleted` | Object was deleted | project, integration |
| `viewed` | Object was viewed/opened | page, feature_gate, project |
| `clicked` | Object was clicked | feature_gate, notification |
| `started` | A multi-step process began | checkout, session, export |
| `completed` | A multi-step process finished | checkout, session, export |
| `failed` | A process failed | checkout, integration, export |
| `sent` | Object was sent to someone | invite, notification |
| `received` | Object was received | invite, notification |
| `accepted` | Object was accepted | invite |
| `dismissed` | Object was dismissed | notification, feature_gate |
| `upgraded` | Subscription was upgraded | subscription |
| `downgraded` | Subscription was downgraded | subscription |
| `activated` | User completed activation | user |
| `deactivated` | Object was disabled | integration, user |
| `searched` | A search was performed | search |
| `exported` | Data was exported | export |
| `imported` | Data was imported | N/A (use import.completed) |

---

## 2. Standard Event Library

### Authentication Events (8)

```typescript
// src/analytics/events/auth.ts

const AUTH_EVENTS = {
  "user.signed_up": {
    description: "User completed account creation",
    properties: {
      signup_method: "email" | "google" | "github" | "sso",
      referral_code: "string | null",
      utm_source: "string | null",
      utm_medium: "string | null",
      utm_campaign: "string | null",
    },
  },
  "user.signed_in": {
    description: "User logged in",
    properties: {
      login_method: "email" | "google" | "github" | "sso",
      is_returning: "boolean",
      days_since_last_login: "number",
    },
  },
  "user.signed_out": {
    description: "User logged out",
    properties: {},
  },
  "user.activated": {
    description: "User completed activation metric",
    properties: {
      activation_metric: "string",         // {{ACTIVATION_METRIC}}
      time_from_signup_seconds: "number",
      activation_path: "string",
      onboarding_completed: "boolean",
    },
  },
  "user.deactivated": {
    description: "User account was deactivated",
    properties: { reason: "string" },
  },
  "user.invited": {
    description: "An existing user invited someone",
    properties: {
      invite_method: "email" | "link",
      invitee_email_domain: "string",
    },
  },
  "user.profile_updated": {
    description: "User updated their profile",
    properties: { fields_updated: "string[]" },
  },
  "session.started": {
    description: "User session began",
    properties: {
      session_id: "string",
      is_first_session: "boolean",
      device_type: "desktop" | "mobile" | "tablet",
      browser: "string",
    },
  },
} as const;
```

### Core Product Events (10)

```typescript
// src/analytics/events/core.ts

const CORE_EVENTS = {
  "project.created": {
    description: "User created a new project",
    properties: {
      project_id: "string",
      template_used: "string | null",
      is_first_project: "boolean",
    },
  },
  "project.viewed": {
    description: "User opened a project",
    properties: { project_id: "string", view_source: "string" },
  },
  "project.updated": {
    description: "User modified project content",
    properties: { project_id: "string", change_type: "string" },
  },
  "project.deleted": {
    description: "User deleted a project",
    properties: { project_id: "string", lifetime_days: "number" },
  },
  "project.shared": {
    description: "User shared a project externally",
    properties: {
      project_id: "string",
      share_method: "link" | "email" | "embed",
      recipient_count: "number",
    },
  },
  "search.performed": {
    description: "User performed a search",
    properties: {
      query: "string",
      results_count: "number",
      result_clicked: "boolean",
    },
  },
  "integration.connected": {
    description: "User connected a third-party integration",
    properties: { integration_name: "string", is_first_integration: "boolean" },
  },
  "integration.disconnected": {
    description: "User disconnected an integration",
    properties: { integration_name: "string", reason: "string | null" },
  },
  "export.completed": {
    description: "User exported data",
    properties: { format: "string", record_count: "number" },
  },
  "page.viewed": {
    description: "User viewed a page",
    properties: {
      page_name: "string",
      page_path: "string",
      referrer: "string | null",
      time_on_page_seconds: "number",
    },
  },
} as const;
```

### Growth Events (12)

```typescript
// src/analytics/events/growth.ts

const GROWTH_EVENTS = {
  "feature_gate.encountered": {
    description: "User encountered a feature gate (paywall)",
    properties: {
      feature_name: "string",
      required_plan: "string",
      current_plan: "string",
      gate_type: "soft" | "hard" | "trial" | "preview",
      encounter_count: "number",
    },
  },
  "feature_gate.clicked": {
    description: "User clicked upgrade CTA on a feature gate",
    properties: {
      feature_name: "string",
      required_plan: "string",
      cta_location: "string",
    },
  },
  "upgrade_prompt.viewed": {
    description: "Upgrade prompt was displayed to user",
    properties: {
      prompt_type: "modal" | "banner" | "tooltip" | "email" | "full_page",
      trigger_id: "string",
      trigger_category: "limit" | "feature" | "success" | "growth" | "time",
    },
  },
  "upgrade_prompt.clicked": {
    description: "User clicked CTA on upgrade prompt",
    properties: {
      prompt_type: "string",
      trigger_id: "string",
      cta_text: "string",
    },
  },
  "upgrade_prompt.dismissed": {
    description: "User dismissed upgrade prompt",
    properties: {
      prompt_type: "string",
      trigger_id: "string",
      dismiss_method: "close_button" | "click_outside" | "escape_key",
    },
  },
  "checkout.started": {
    description: "User entered checkout flow",
    properties: {
      selected_plan: "string",
      billing_cycle: "monthly" | "annual",
      trigger_source: "string",
    },
  },
  "checkout.completed": {
    description: "User completed checkout successfully",
    properties: {
      plan: "string",
      billing_cycle: "monthly" | "annual",
      mrr: "number",
      coupon_used: "string | null",
      time_from_signup_days: "number",
    },
  },
  "checkout.failed": {
    description: "Checkout failed (card declined, error)",
    properties: {
      plan: "string",
      error_type: "string",
      error_code: "string",
    },
  },
  "checkout.abandoned": {
    description: "User left checkout without completing",
    properties: {
      plan: "string",
      last_step: "string",
      time_in_checkout_seconds: "number",
    },
  },
  "subscription.upgraded": {
    description: "User upgraded their subscription",
    properties: {
      previous_plan: "string",
      new_plan: "string",
      mrr_change: "number",
      trigger_source: "string",
    },
  },
  "subscription.downgraded": {
    description: "User downgraded their subscription",
    properties: {
      previous_plan: "string",
      new_plan: "string",
      mrr_change: "number",
      downgrade_reason: "string",
    },
  },
  "subscription.cancelled": {
    description: "User cancelled their subscription",
    properties: {
      plan: "string",
      mrr_lost: "number",
      cancellation_reason: "string",
      save_offer_shown: "boolean",
      save_offer_accepted: "boolean",
      lifetime_days: "number",
    },
  },
} as const;
```

---

## 3. Properties Schema

### Global Properties (attached to every event)

```typescript
// src/analytics/properties.ts

interface GlobalProperties {
  // User identification
  user_id: string;
  anonymous_id: string;        // before signup
  account_id: string | null;

  // User attributes
  user_plan: "free" | "pro" | "business" | "enterprise";
  user_role: "owner" | "admin" | "member" | "guest";
  days_since_signup: number;
  is_activated: boolean;

  // Account attributes
  account_plan: string;
  account_size: number;         // team members
  account_industry: string | null;

  // Session context
  session_id: string;
  device_type: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  country: string;
  timezone: string;

  // Experiment context
  active_experiments: Record<string, string>;  // experiment_id → variant

  // Attribution
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referral_code: string | null;
}
```

### Property Validation Rules

| Rule | Implementation | Rationale |
|------|---------------|-----------|
| Required properties must never be null | Schema validation in track() wrapper | Missing user_id breaks identity resolution |
| Numeric properties must be finite | `Number.isFinite()` check | Infinity/NaN corrupt aggregations |
| String properties max 500 chars | Truncation in track() wrapper | Prevent storage bloat |
| Enum properties must match allowed values | Compile-time TypeScript check | Prevent typos creating new categories |
| Timestamps in ISO 8601 | Formatter in track() wrapper | Consistent time parsing |
| No PII in event properties | Linting rule / code review | Privacy compliance |

---

## 4. Funnel Definitions

### Core Funnels

```
FUNNEL 1: Signup to Activation
  Steps:
    1. page.viewed (page_name = "landing_page")
    2. user.signed_up
    3. session.started (is_first_session = true)
    4. project.created (is_first_project = true)
    5. user.activated
  Window: 7 days
  Segmentation: signup_method, utm_source, device_type

FUNNEL 2: Activation to Upgrade
  Steps:
    1. user.activated
    2. feature_gate.encountered (any)
    3. upgrade_prompt.viewed (any)
    4. checkout.started
    5. checkout.completed
  Window: 30 days
  Segmentation: current_plan, trigger_source, feature_name

FUNNEL 3: Checkout Completion
  Steps:
    1. page.viewed (page_name = "pricing")
    2. checkout.started
    3. checkout.completed
  Window: 1 hour (same session)
  Segmentation: selected_plan, billing_cycle, device_type

FUNNEL 4: Invite to Team Growth
  Steps:
    1. user.invited
    2. invite.sent
    3. invite.accepted
    4. user.signed_up (from invite)
    5. user.activated (invited user)
  Window: 14 days
  Segmentation: invite_method, inviter_plan, invitee_email_domain

FUNNEL 5: Feature Discovery to Upgrade
  Steps:
    1. feature_gate.encountered
    2. feature_gate.clicked
    3. upgrade_prompt.viewed
    4. checkout.started
    5. checkout.completed
  Window: 14 days
  Segmentation: feature_name, gate_type, prompt_type
```

---

## 5. Cohort Analysis Setup

### Cohort Definitions

| Cohort Type | Grouping | Metric | Window |
|-------------|---------|--------|--------|
| Signup cohort | Week of signup | Retention (D7, D14, D30, D60, D90) | 90 days |
| Activation cohort | Week of activation | Upgrade rate, feature usage | 90 days |
| Plan cohort | Current plan | Feature adoption, expansion | Ongoing |
| Acquisition cohort | Acquisition channel | Activation rate, LTV | 12 months |
| Feature cohort | First feature used | Retention, upgrade rate | 90 days |

### Retention Cohort Table Template

```
Signup Week    Users    W1     W2     W3     W4     W5     W6     W7     W8
──────────    ─────    ──     ──     ──     ──     ──     ──     ──     ──
WK ____       ____     ____%  ____%  ____%  ____%  ____%  ____%  ____%  ____%
WK ____       ____     ____%  ____%  ____%  ____%  ____%  ____%  ____%  ____%
WK ____       ____     ____%  ____%  ____%  ____%  ____%  ____%  ____%  ____%
WK ____       ____     ____%  ____%  ____%  ____%  ____%  ____%  ____%  ____%
WK ____       ____     ____%  ____%  ____%  ____%  ____%  ____%  ____%  ____%

Target:                60%+   45%+   35%+   30%+   28%+   26%+   25%+   24%+
```

---

## 6. Feature Usage Tracking

### Feature Usage Events Pattern

```typescript
// src/analytics/feature-tracking.ts

interface FeatureUsageEvent {
  feature_id: string;
  feature_name: string;
  feature_category: string;
  plan_required: string;
  usage_count_session: number;
  usage_count_lifetime: number;
  time_spent_seconds: number;
  is_first_use: boolean;
}

// Track feature entry and exit for time-spent calculation
function trackFeatureUsage(featureId: string) {
  const startTime = Date.now();

  // Track entry
  analytics.track("feature.entered", {
    feature_id: featureId,
    is_first_use: !hasUsedFeature(featureId),
  });

  // Return cleanup function for exit tracking
  return () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    analytics.track("feature.exited", {
      feature_id: featureId,
      time_spent_seconds: duration,
    });
  };
}
```

### Feature Adoption Dashboard

```
Feature              Plan     MAU    % of Users   Trend    Adoption Stage
───────              ────     ───    ──────────   ─────    ──────────────
Core feature A       Free     ____   ____%        ↑/↓/→   Mature
Core feature B       Free     ____   ____%        ↑/↓/→   Mature
Advanced analytics   Pro      ____   ____%        ↑/↓/→   Growing
API access           Pro      ____   ____%        ↑/↓/→   Growing
SSO/SAML             Biz      ____   ____%        ↑/↓/→   Early
Custom reports       Biz      ____   ____%        ↑/↓/→   Early
Webhooks             Biz      ____   ____%        ↑/↓/→   Nascent

Adoption Stages:
  Nascent:  < 5% of eligible users
  Early:    5-20% of eligible users
  Growing:  20-50% of eligible users
  Mature:   > 50% of eligible users
```

---

## 7. Tool Configuration

### Analytics Tool: {{ANALYTICS_TOOL}}

```typescript
// src/analytics/client.ts

import { AnalyticsClient } from "{{ANALYTICS_TOOL}}";

const analytics = new AnalyticsClient({
  apiKey: process.env.ANALYTICS_API_KEY,
  // Flush events in batches for performance
  flushInterval: 10000,        // 10 seconds
  flushQueueSize: 20,          // or 20 events, whichever comes first
  // Retry failed events
  maxRetries: 3,
  retryDelay: 1000,
});

// Type-safe track wrapper
function track<T extends keyof EventRegistry>(
  event: T,
  properties: EventRegistry[T]
) {
  // Validate required global properties
  const globalProps = getGlobalProperties();

  // Validate event-specific properties
  validateProperties(event, properties);

  // Filter PII
  const sanitized = removePII(properties);

  analytics.track(event, {
    ...globalProps,
    ...sanitized,
    timestamp: new Date().toISOString(),
  });
}

// Identity management
function identify(userId: string, traits: UserTraits) {
  analytics.identify(userId, {
    ...traits,
    last_identified_at: new Date().toISOString(),
  });
}

// Group (account-level) identification
function group(accountId: string, traits: AccountTraits) {
  analytics.group(accountId, {
    ...traits,
    last_identified_at: new Date().toISOString(),
  });
}

export { track, identify, group };
```

### SDK Integration Points

| Integration Point | Implementation | Notes |
|-------------------|---------------|-------|
| Client-side (browser) | JavaScript SDK in app shell | Page views, clicks, feature usage |
| Server-side (API) | Node.js SDK in API routes | Signup, checkout, subscription events |
| Server-side (async) | Worker/queue consumer | Aggregated events, computed metrics |
| Email | ESP webhook → analytics | Email opens, clicks |
| Billing | Stripe webhook → analytics | Payment events, subscription changes |

---

## 8. Data Quality Rules

### Automated Quality Checks

| Check | Frequency | Alert Threshold | Action |
|-------|-----------|----------------|--------|
| Event volume anomaly | Hourly | +/- 50% from hourly average | PagerDuty alert |
| Missing required properties | Real-time | Any null user_id | Drop event + log error |
| New unknown event names | Daily | Any new event not in registry | Slack alert to data team |
| Property type mismatch | Real-time | String where number expected | Coerce or drop + log |
| Duplicate events | Hourly | > 1% duplication rate | Dedup pipeline check |
| Bot traffic | Daily | > 5% of total events | Filter rule update |
| Event latency | Hourly | > 5 minute event delay | Infrastructure check |
| Schema drift | Weekly | Any new property not in schema | Schema review |

### Bot Filtering

```typescript
// src/analytics/bot-filter.ts

function isBot(userAgent: string, ip: string): boolean {
  // Known bot user agents
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /headless/i, /phantom/i, /selenium/i,
    /lighthouse/i, /pagespeed/i, /pingdom/i,
    /uptimerobot/i, /statuspage/i,
  ];

  if (botPatterns.some((p) => p.test(userAgent))) return true;

  // Known datacenter IP ranges (simplified)
  // In production, use a maintained IP intelligence service
  const datacenterRanges = [/* AWS, GCP, Azure ranges */];
  if (datacenterRanges.some((range) => isInRange(ip, range))) return true;

  return false;
}

// Wrap analytics track to filter bots
function trackWithBotFilter(event: string, properties: Record<string, unknown>) {
  if (isBot(navigator.userAgent, "")) return; // Client-side basic check
  analytics.track(event, { ...properties, is_bot: false });
}
```

### Data Quality Dashboard

```
Data Quality Score: ____/100

Completeness:   ____% of events have all required properties
Accuracy:       ____% of property values match expected types
Timeliness:     ____% of events arrive within 60 seconds
Uniqueness:     ____% deduplication rate
Consistency:    ____% of event names match registry
Volume:         ________ events/day (within expected range: Yes/No)

Issues This Week:
  1. ________________________________________
  2. ________________________________________
  3. ________________________________________
```

---

## Checklist

- [ ] Defined event naming convention: `object.action` in snake_case
- [ ] Registered all objects and actions in their respective registries
- [ ] Implemented 30+ standard events across auth, core, and growth categories
- [ ] Defined global properties schema attached to every event
- [ ] Set up property validation in the track() wrapper
- [ ] Configured 5 core funnels in {{ANALYTICS_TOOL}}
- [ ] Set up cohort analysis (signup, activation, plan, acquisition cohorts)
- [ ] Implemented feature usage tracking with time-spent measurement
- [ ] Configured {{ANALYTICS_TOOL}} SDK on client and server
- [ ] Established data quality rules with automated alerting
- [ ] Implemented bot filtering
- [ ] Verified no PII leaks in event properties
- [ ] Set up weekly data quality review
