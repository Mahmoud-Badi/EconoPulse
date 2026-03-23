# Event Catalog

> **Purpose:** Consolidated list of all system events in {{PROJECT_NAME}} for analytics tracking, audit logging, and observability.
> Every measurable action, state change, and system occurrence is registered here.
> If an event is not in this catalog, it is not tracked.
>
> **Target:** 150-250 events across all services.

---

## How to Use This Catalog

1. **During spec writing:** When a service spec describes a user action or state change worth tracking, add it here.
2. **During implementation:** Developers emit events using the exact names and payloads defined here.
3. **During analytics setup:** Data team configures dashboards and funnels using event names from this catalog.
4. **During compliance review:** Security team verifies all audit-required events are present and correctly classified.
5. **Cross-reference:** The CROSS-REFERENCE-VALIDATOR checks that every event trigger in service specs maps to an entry here.

---

## Event Naming Convention

Format: `{category}.{entity}.{action}` (lowercase, dot-separated)

| Component | Rule | Examples |
|-----------|------|----------|
| `category` | Domain area | `auth`, `billing`, `{{SERVICE_SLUG_1}}`, `{{SERVICE_SLUG_2}}`, `system` |
| `entity` | Object acted upon | `user`, `session`, `invoice`, `{{ENTITY_1}}`, `{{ENTITY_2}}` |
| `action` | Past tense verb | `created`, `updated`, `deleted`, `viewed`, `exported`, `failed` |

Examples:
- `auth.session.created` — User logged in
- `billing.invoice.paid` — Invoice payment succeeded
- `system.deployment.completed` — New version deployed

### Reserved Prefixes

| Prefix | Reserved For |
|--------|-------------|
| `system.*` | Infrastructure events (deployments, health checks, config changes) |
| `auth.*` | Authentication and authorization events |
| `admin.*` | Admin panel actions |
| `error.*` | System error events (distinct from user-facing errors) |

---

## Event Registry

| Event Name | Category | Data Payload | Analytics? | Audit Log? | HIPAA/PHI? | Service |
|-----------|----------|-------------|------------|------------|------------|---------|
| `auth.session.created` | auth | `{ userId, method, ip, userAgent }` | Yes | Yes | No | {{AUTH_SERVICE}} |
| `auth.session.failed` | auth | `{ email, reason, ip, attemptCount }` | Yes | Yes | No | {{AUTH_SERVICE}} |
| `auth.session.expired` | auth | `{ userId, sessionDuration }` | Yes | Yes | No | {{AUTH_SERVICE}} |
| `auth.password.changed` | auth | `{ userId, method }` | No | Yes | No | {{AUTH_SERVICE}} |
| `auth.password.reset_requested` | auth | `{ email }` | Yes | Yes | No | {{AUTH_SERVICE}} |
| `auth.mfa.enabled` | auth | `{ userId, mfaMethod }` | Yes | Yes | No | {{AUTH_SERVICE}} |
| `{{EVENT_NAME}}` | {{CATEGORY}} | `{ {{PAYLOAD_FIELDS}} }` | {{YES_NO}} | {{YES_NO}} | {{YES_NO}} | {{SERVICE_NAME}} |
<!-- Repeat for every event. Target: 150-250 rows. -->
<!-- Group by category. Include lifecycle events (created, updated, deleted), -->
<!-- state transitions, user interactions, system events, and error events. -->

### Category Breakdown Targets

| Category | Expected Event Count | Description |
|----------|---------------------|-------------|
| `auth` | 15-25 | Login, logout, password, MFA, role changes, session events |
| `{{SERVICE_SLUG_1}}` | {{COUNT}} | Core business entity CRUD + state transitions |
| `{{SERVICE_SLUG_2}}` | {{COUNT}} | Core business entity CRUD + state transitions |
| `billing` | 15-25 | Subscription, invoice, payment, refund events |
| `admin` | 10-20 | User management, config changes, bulk operations |
| `system` | 10-15 | Deployments, health, migrations, feature flags |
| `error` | 10-15 | Unhandled errors, integration failures, timeouts |

---

## Event Payload Standards

### Required Fields (All Events)

Every event payload MUST include these fields automatically (injected by the event emitter, not by the caller):

| Field | Type | Description |
|-------|------|-------------|
| `eventId` | UUID | Unique event instance ID |
| `eventName` | string | Event name from this catalog |
| `timestamp` | ISO 8601 | When the event occurred |
| `tenantId` | UUID | Tenant context (for multi-tenant isolation) |
| `userId` | UUID / null | Acting user (null for system events) |
| `sessionId` | string / null | Session ID (null for system events) |
| `source` | string | Service that emitted the event |
| `environment` | string | `production` / `staging` / `development` |

### PHI/PII Handling Rules

| Data Classification | In Analytics Payload? | In Audit Log? | Storage Rule |
|--------------------|-----------------------|---------------|-------------|
| Public (event names, counts) | Yes | Yes | Standard retention |
| PII (email, name, phone) | Hashed only | Yes (encrypted) | {{PII_RETENTION_DAYS}} day retention |
| PHI (health data, diagnoses) | Never | Yes (encrypted, access-logged) | {{PHI_RETENTION_DAYS}} day retention |
| Sensitive (passwords, tokens) | Never | Never (log "changed" not the value) | Never stored |

---

## Event Schema Versioning

### Versioning Rules

| Rule | Description |
|------|-------------|
| Schema version | Each event has a `schemaVersion` field (integer, starting at 1) |
| Additive changes | New optional fields can be added without bumping version |
| Breaking changes | Removing or renaming fields requires a version bump |
| Backward compatibility | Consumers must handle events from version N and N-1 simultaneously |
| Deprecation | Deprecated event versions emit a `system.schema.deprecated` warning for {{DEPRECATION_WINDOW_DAYS}} days before removal |

### Version Registry

| Event Name | Current Version | Changelog |
|-----------|----------------|-----------|
| `auth.session.created` | 1 | Initial schema |
| `{{EVENT_NAME}}` | {{VERSION}} | {{CHANGELOG_ENTRY}} |
<!-- Add entries as schemas evolve. This becomes critical for data pipeline maintenance. -->

### Schema Definition Location

Event schemas are defined as {{SCHEMA_FORMAT}} (e.g., JSON Schema, Zod, class-validator DTO) at:
- `{{BACKEND_SRC}}/events/schemas/`
- One file per event category: `auth.events.{{FILE_EXT}}`, `billing.events.{{FILE_EXT}}`, etc.

---

## Analytics vs Audit Classification

| Classification | Purpose | Storage | Retention | Query Access |
|---------------|---------|---------|-----------|-------------|
| Analytics only | Product metrics, funnels, A/B tests | {{ANALYTICS_PROVIDER}} (e.g., Mixpanel, Amplitude, PostHog) | {{ANALYTICS_RETENTION_DAYS}} days | Product team |
| Audit only | Compliance, security, legal | Append-only audit table in {{DATABASE}} | {{AUDIT_RETENTION_DAYS}} days | Security team, admins |
| Both | Important business events | Both systems | Per-system retention | Both teams |
| Neither | Should not exist — remove from catalog | N/A | N/A | N/A |

---

## Completeness Checklist

- [ ] Every CRUD operation on every entity has create/update/delete events
- [ ] Every state transition in every service spec has a corresponding event
- [ ] Every user-facing action in screen specs has an analytics event
- [ ] Every security-relevant action has an audit event
- [ ] PHI/PII classification reviewed by compliance for every event
- [ ] Event naming follows the convention consistently
- [ ] Payload schemas defined for all events
- [ ] Analytics provider configured to receive all analytics-flagged events
- [ ] Audit log consumer configured to receive all audit-flagged events
