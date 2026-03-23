# Analytics Event Taxonomy — {{PROJECT_NAME}}

> **Generated at:** Step 4.7 (Analytics Architecture)
> **Provider(s):** {{ANALYTICS_PROVIDERS}}
> **GA Measurement ID:** {{GA_MEASUREMENT_ID}}
> **Last updated:** {{GENERATION_DATE}}

---

## Event Naming Convention

All events use `snake_case` naming. Format: `{category}_{action}_{target}`

Examples: `signup_completed`, `feature_used_dashboard`, `payment_subscription_started`

**Rules:**
- No spaces, no hyphens, no camelCase
- Past tense for completed actions: `completed`, `submitted`, `clicked`
- Present tense for ongoing states: `viewing`, `streaming`
- Maximum 40 characters per event name
- Prefix with category for filtering: `auth_`, `nav_`, `feature_`, `payment_`, `content_`

---

## Core Events (Always Tracked)

These events fire for every project regardless of type. They establish baseline analytics.

| Event Name | Category | When It Fires | Parameters | Implementation Location |
|---|---|---|---|---|
| `page_view` | navigation | Every page/route change | `page_path`, `page_title`, `referrer` | Root layout or analytics provider wrapper |
| `session_start` | engagement | User starts a new session | `session_id`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign` | Analytics provider auto-tracks (verify) |
| `error_occurred` | system | Unhandled error caught by error boundary | `error_message`, `error_stack`, `page_path`, `component` | Error boundary component |
| `cta_clicked` | engagement | Any primary CTA button clicked | `cta_text`, `cta_location`, `page_path` | CTA button component(s) |

---

## Authentication Events

| Event Name | Category | When It Fires | Parameters | Implementation Location |
|---|---|---|---|---|
| `auth_signup_started` | auth | User initiates signup flow | `signup_method`, `page_path`, `referrer` | Signup form/page |
| `auth_signup_completed` | auth | User successfully creates account | `signup_method`, `user_id_hash`, `referral_source` | Auth callback / success handler |
| `auth_login` | auth | User logs in | `login_method`, `is_returning` | Login handler |
| `auth_logout` | auth | User logs out | `session_duration_seconds` | Logout handler |
| `auth_password_reset` | auth | User requests password reset | `page_path` | Password reset form |

---

## Conversion Events

<!-- These are the key events from CONFIG.CONVERSION_EVENTS mapped to tracking calls -->

{{CONVERSION_EVENTS_TABLE}}

<!--
Generate this table from CONFIG.CONVERSION_EVENTS. For each event, include:
- Event name (snake_case)
- Category
- When it fires (specific user action)
- Parameters (page_path always included)
- Implementation location (specific component/route)
- Financial metric it maps to (from Step 17.5)

Example rows:

| `waitlist_signup_complete` | conversion | User lands on thank-you page after waitlist submission | `page_path`, `referral_source` | Thank you page component | Maps to: VISITOR_TO_SIGNUP_RATE |
| `subscription_started` | payment | User completes first payment | `plan_name`, `billing_cycle`, `amount`, `currency` | Payment success handler | Maps to: SIGNUP_TO_PAID_RATE |
| `feature_activated` | activation | User completes key activation step | `feature_name`, `time_since_signup_hours` | Feature component | Maps to: KEY_CONVERSION_STEP |
-->

---

## Revenue Events

<!-- IF {{MONETIZATION_MODEL}} != "none" -->

| Event Name | Category | When It Fires | Parameters | Implementation Location |
|---|---|---|---|---|
| `payment_initiated` | payment | User starts checkout/payment flow | `plan_name`, `amount`, `currency`, `billing_cycle` | Checkout component |
| `payment_completed` | payment | Payment successfully processed | `plan_name`, `amount`, `currency`, `transaction_id`, `is_first_payment` | Payment webhook/callback |
| `payment_failed` | payment | Payment attempt fails | `error_code`, `plan_name`, `amount` | Payment error handler |
| `subscription_started` | payment | New subscription created | `plan_name`, `billing_cycle`, `amount`, `trial_days` | Subscription handler |
| `subscription_cancelled` | payment | User cancels subscription | `plan_name`, `reason`, `months_active` | Cancellation flow |
| `subscription_upgraded` | payment | User upgrades to higher plan | `from_plan`, `to_plan`, `amount_delta` | Upgrade handler |
| `subscription_downgraded` | payment | User downgrades to lower plan | `from_plan`, `to_plan`, `amount_delta` | Downgrade handler |
| `trial_started` | payment | Free trial begins | `plan_name`, `trial_days` | Trial activation |
| `trial_expired` | payment | Trial ends without conversion | `plan_name`, `trial_days`, `engagement_score` | Trial expiry handler |

<!-- ENDIF -->

---

## Engagement Events

| Event Name | Category | When It Fires | Parameters | Implementation Location |
|---|---|---|---|---|
| `feature_used` | engagement | User interacts with a key feature | `feature_name`, `page_path`, `is_first_use` | Feature components |
| `search_performed` | engagement | User performs a search | `query_length`, `results_count`, `page_path` | Search component |
| `invite_sent` | viral | User invites another user | `invite_method`, `recipient_count` | Invite flow |
| `invite_accepted` | viral | Invited user creates account | `inviter_id_hash`, `signup_method` | Invite acceptance handler |
| `feedback_submitted` | engagement | User submits feedback/review | `feedback_type`, `rating`, `page_path` | Feedback component |
| `export_generated` | engagement | User exports data (PDF, CSV, etc.) | `export_format`, `data_type`, `item_count` | Export handler |
| `integration_connected` | engagement | User connects third-party integration | `integration_name`, `is_first_integration` | Integration settings |

---

## Navigation Events

| Event Name | Category | When It Fires | Parameters | Implementation Location |
|---|---|---|---|---|
| `nav_menu_clicked` | navigation | User clicks main navigation item | `menu_item`, `from_path` | Navigation component |
| `nav_breadcrumb_clicked` | navigation | User clicks breadcrumb | `breadcrumb_label`, `depth` | Breadcrumb component |
| `nav_external_link` | navigation | User clicks external link | `destination_url`, `link_text`, `page_path` | External link component |

---

## Implementation Guide

### Google Analytics 4 (gtag)

```javascript
// Initialize (in root layout or _app)
// DO NOT add if gtag is already loaded — check for window.gtag first
if (typeof window.gtag === 'function') {
  // Already loaded — just fire events
} else {
  // Load gtag script
}

// Fire events
gtag('event', 'event_name', {
  page_path: window.location.pathname,
  // ... additional parameters
});
```

### PostHog

```javascript
posthog.capture('event_name', {
  page_path: window.location.pathname,
  // ... additional parameters
});
```

### Implementation Checklist

- [ ] Analytics provider SDK installed and initialized
- [ ] Core events (page_view, session_start, error_occurred) verified
- [ ] All conversion events firing on correct user actions
- [ ] Revenue events connected to payment webhooks
- [ ] Event parameters include page_path on every event
- [ ] No PII in event parameters (no email, no full name, no IP)
- [ ] Cookie consent / GDPR compliance verified
- [ ] Events visible in analytics dashboard
- [ ] Conversion events mapped to financial model metrics

---

## Financial Model Mapping

| Event | Financial Metric | How It's Used |
|---|---|---|
| `auth_signup_completed` | `VISITOR_TO_SIGNUP_RATE` | Numerator: signup count / Denominator: unique visitors |
| `subscription_started` | `SIGNUP_TO_PAID_RATE` | Numerator: paid users / Denominator: signups |
| `subscription_cancelled` | `EXPECTED_CHURN_RATE` | Monthly cancelled / total active subscribers |
| `subscription_upgraded` | Expansion revenue | Contributes to Net Revenue Retention (NRR) |
| `feature_activated` (key step) | `KEY_CONVERSION_STEP` | Activation rate = users reaching this / total signups |
