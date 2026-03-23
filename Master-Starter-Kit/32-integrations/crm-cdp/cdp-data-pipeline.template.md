# {{PROJECT_NAME}} — Customer Data Pipeline (CDP)

> **Owner:** {{LEAD_DEVELOPER}}
> **CDP Platform:** {{CDP_PLATFORM}}
> **Last Updated:** {{DATE}}

---

## 1. CDP Selection

### Selected Platform: {{CDP_PLATFORM}}

| Feature | Segment | RudderStack | Jitsu | mParticle |
|---------|---------|-------------|-------|-----------|
| **Type** | Cloud SaaS | Cloud + Self-hosted | Open source | Cloud SaaS |
| **Pricing** | Per MTU ($120/1k MTU) | Per event (self-hosted: free) | Free (self-hosted) | Per MTU |
| **Sources** | 400+ | 200+ | 50+ | 300+ |
| **Destinations** | 400+ | 200+ | 50+ | 300+ |
| **Identity resolution** | ✅ | ✅ | ⚠️ Basic | ✅ |
| **Privacy controls** | ✅ | ✅ | ⚠️ | ✅ |
| **Self-hosted option** | ❌ | ✅ | ✅ | ❌ |
| **Real-time** | ✅ | ✅ | ✅ | ✅ |

**Decision rationale:** {{CDP_RATIONALE}}

---

## 2. Data Architecture

### Event Flow

```
Your Application
  │
  ├─ Frontend (browser/mobile)
  │   └─ analytics.js / SDK → CDP Source → CDP Pipeline
  │                                            │
  ├─ Backend (server-side)                     │
  │   └─ Server SDK → CDP Source ─────────────→│
  │                                            │
  │                                     CDP Pipeline
  │                                     (transform, enrich, filter)
  │                                            │
  │                              ┌─────────────┼─────────────┐
  │                              ↓             ↓             ↓
  │                         Analytics      CRM          Data Warehouse
  │                        (Mixpanel,   (HubSpot,     (BigQuery,
  │                         PostHog)    Salesforce)    Snowflake)
```

### Source Configuration

| Source | Type | SDK | Environment |
|--------|------|-----|-------------|
| Web App | Client-side JavaScript | `analytics.js` / `rudder-sdk-js` | Browser |
| Mobile App (iOS) | Native SDK | `Analytics-Swift` / `rudder-sdk-ios` | iOS |
| Mobile App (Android) | Native SDK | `Analytics-Kotlin` / `rudder-sdk-android` | Android |
| Backend API | Server-side | `analytics-node` / `@rudderstack/analytics-js-service-worker` | Node.js |

### Destination Configuration

| Destination | Purpose | Events Forwarded | Transform |
|-------------|---------|-----------------|-----------|
| {{ANALYTICS_TOOL}} | Product analytics | All track events | None |
| {{CRM_PLATFORM}} | Sales pipeline | identify, group | Map to CRM properties |
| {{DATA_WAREHOUSE}} | Historical analysis | All events | Flatten nested objects |
| {{EMAIL_PROVIDER}} | Email automation | identify, track (key events) | Map to email lists |
| {{AD_PLATFORM}} | Conversion tracking | track (purchase, signup) | Map to conversion events |

---

## 3. Event Schema

### Standard Events (Semantic Events)

Follow the CDP's semantic event naming convention for maximum compatibility:

| Event | When | Properties |
|-------|------|------------|
| `Signed Up` | User creates account | `plan`, `source`, `referrer` |
| `Signed In` | User logs in | `method` (email, google, github) |
| `Page Viewed` | Any page load | `name`, `url`, `path`, `referrer` |
| `Feature Used` | User uses a feature | `feature_name`, `duration_seconds` |
| `Plan Upgraded` | Subscription upgrade | `previous_plan`, `new_plan`, `revenue` |
| `Plan Downgraded` | Subscription downgrade | `previous_plan`, `new_plan`, `revenue` |
| `Payment Completed` | Successful payment | `amount`, `currency`, `payment_method` |
| `Support Ticket Created` | User submits ticket | `category`, `priority` |

### Custom Events

| Event | When | Properties |
|-------|------|------------|
| `{{CUSTOM_EVENT_1}}` | {{TRIGGER}} | {{PROPERTIES}} |
| `{{CUSTOM_EVENT_2}}` | {{TRIGGER}} | {{PROPERTIES}} |

### Event Naming Conventions

- Use **Title Case** for event names: `Page Viewed`, not `page_viewed`
- Use **snake_case** for property names: `feature_name`, not `featureName`
- Include context properties automatically: `timestamp`, `user_id`, `anonymous_id`, `context.page`
- Be specific: `Article Bookmarked` not `Button Clicked`

---

## 4. Identity Resolution

### Identity Strategy

```
Anonymous visitor lands on site
  → Assigned anonymous_id (UUID, stored in cookie)
  → All events tracked with anonymous_id

Visitor signs up / logs in
  → Call identify(user_id, traits)
  → CDP merges anonymous_id with user_id
  → Historical anonymous events now attributed to known user
```

### Identity Calls

```
// Identify call — associate user with traits
analytics.identify('user_123', {
  email: 'alice@example.com',
  name: 'Alice Johnson',
  plan: 'pro',
  company: 'Acme Corp',
  created_at: '2024-01-15T10:30:00Z'
});

// Group call — associate user with company/organization
analytics.group('org_456', {
  name: 'Acme Corp',
  plan: 'enterprise',
  employees: 150,
  industry: 'Technology'
});
```

### Cross-Device Identity

| Scenario | Resolution |
|----------|-----------|
| Same user, different devices | `identify()` with same user_id on each device |
| User logs out then logs in as different user | `reset()` to clear anonymous_id, then `identify()` with new user |
| Multiple users on shared device | `reset()` on logout, `identify()` on login |

---

## 5. Privacy & Consent

### Consent Management

```
User consent state:
  - analytics: true/false (product analytics)
  - advertising: true/false (ad tracking, conversion events)
  - functional: true/false (feature-related tracking)

CDP integrations filter based on consent:
  - analytics=false → Don't send to Mixpanel, PostHog
  - advertising=false → Don't send to Google Ads, Facebook Pixel
  - functional=false → Don't send any events (minimal tracking only)
```

### Data Deletion (GDPR Right to Erasure)

When a user requests data deletion:
1. Delete from your application database
2. Call CDP suppression/deletion API
3. CDP propagates deletion to all connected destinations
4. Log the deletion request and completion for compliance audit

| CDP | Deletion API | Propagation |
|-----|-------------|-------------|
| Segment | `DELETE /v1beta/workspaces/{workspace}/regulations` | Automatic to supported destinations |
| RudderStack | Data Regulation API | Manual per destination |
| mParticle | GDPR API | Automatic to supported destinations |

---

## 6. Server-Side vs. Client-Side Tracking

### Decision Matrix

| Factor | Client-Side | Server-Side |
|--------|------------|-------------|
| Page views, clicks | ✅ Best | ❌ Can't detect |
| Form submissions | ✅ | ✅ |
| Purchase events | ⚠️ (can be blocked) | ✅ Reliable |
| Subscription changes | ❌ (happens server-side) | ✅ |
| Ad blocker resistance | ❌ Blocked | ✅ Not affected |
| Data accuracy | ⚠️ Users can tamper | ✅ Controlled |
| Latency impact | ⚠️ Slows page load | ✅ No user impact |
| Implementation | Easy (paste snippet) | Medium (API calls) |

**Recommendation:** Use **client-side for user interaction events** (page views, clicks, form submissions) and **server-side for business events** (purchases, subscription changes, backend actions).

---

## 7. Data Quality

### Event Validation

| Check | How | When |
|-------|-----|------|
| Required properties present | Schema validation in tracking code | Before sending |
| Property types match schema | CDP schema enforcement (Protocols/Tracking Plans) | On receipt |
| Event names follow naming convention | Lint rule + CDP tracking plan | Development + CI |
| No PII in event properties | Automated scan | Quarterly audit |
| Events firing correctly | E2E test with analytics assertions | CI pipeline |

### Tracking Plan

Document every event your application sends:

```
Tracking Plan: {{PROJECT_NAME}}

Event: Signed Up
  Description: User creates a new account
  Triggers: After successful registration
  Properties:
    - plan (string, required): Subscription plan selected
    - source (string, required): Registration source (organic, referral, ad)
    - referrer (string, optional): Referral code if applicable
  Destinations: All
  Owner: Growth team
```

---

## 8. Implementation Checklist

- [ ] CDP account created and configured
- [ ] Sources configured (client-side + server-side)
- [ ] Destinations connected and tested
- [ ] Tracking plan documented (all events, properties, destinations)
- [ ] Identity strategy implemented (identify, group, anonymous_id)
- [ ] Consent management integrated with CDP
- [ ] Server-side tracking for business-critical events
- [ ] Event validation / schema enforcement enabled
- [ ] Data deletion flow tested (GDPR compliance)
- [ ] No PII in event properties (or properly consented/encrypted)
- [ ] Debugger/live event viewer used to verify event flow
- [ ] QA process for new events (tracking plan review before shipping)
