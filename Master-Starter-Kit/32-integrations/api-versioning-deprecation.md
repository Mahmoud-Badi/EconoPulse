# API Versioning & Deprecation Management

> Every API you consume will eventually deprecate the version you're using. This guide helps you detect deprecation signals early, plan migrations proactively, and avoid the panic of a forced upgrade on a tight deadline.

---

## Version Pinning Strategy

### Pin Everything

Never consume an API's "latest" version implicitly. Explicitly pin the version in your client configuration:

| Pinning Method | Example | Providers That Use It |
|----------------|---------|----------------------|
| URL path versioning | `/v1/customers`, `/v2/customers` | Stripe, Twilio, GitHub |
| Header versioning | `Stripe-Version: 2023-10-16` | Stripe (date-based) |
| Query parameter | `?api-version=2024-01-01` | Azure |
| Accept header | `Accept: application/vnd.github.v3+json` | GitHub |
| SDK version lock | `"stripe": "^14.0.0"` in package.json | All SDK-based providers |

### Version Inventory

Maintain a living document of every API version you consume:

| Provider | Current Version | Latest Available | Pinned In | Last Verified |
|----------|----------------|-----------------|-----------|---------------|
| Stripe | `2023-10-16` | `2024-06-20` | SDK + header | 2024-07-01 |
| GitHub | `v3` | `v4 (GraphQL)` | Accept header | 2024-07-01 |
| Twilio | `2010-04-01` | `2010-04-01` | URL path | 2024-07-01 |

**Review quarterly** during hardening (Steps 29–33).

---

## Sunset Detection

### Sunset Header (RFC 8594)

Some providers include a `Sunset` HTTP header indicating when an API version will be discontinued:

```
Sunset: Sat, 01 Mar 2025 00:00:00 GMT
```

**Monitor this header in production.** Log a warning whenever a Sunset header appears in a response.

### Deprecation Header

Some providers include `Deprecation: true` in response headers for deprecated endpoints.

### Detection Checklist

| Signal | How to Detect | Action |
|--------|--------------|--------|
| `Sunset` header in response | Parse and log in middleware | Create migration ticket with deadline |
| `Deprecation: true` header | Parse and log in middleware | Investigate replacement endpoint |
| SDK update changelog mentions breaking changes | Dependabot / Renovate PR review | Assess impact before upgrading |
| Email from provider about API changes | Forward to engineering team channel | Triage within 1 week |
| Provider blog post about new API version | RSS feed / changelog monitor | Read and assess impact |
| Status page announcement about EOL | Status page RSS subscription | Create migration plan |

### Automated Monitoring

Set up automated deprecation detection:
1. **Response header middleware** — Log any `Sunset`, `Deprecation`, or `Warning` headers from third-party API responses
2. **Changelog subscriptions** — Subscribe to provider changelogs via RSS or email
3. **Dependency update alerts** — Use Dependabot / Renovate and review SDK changelogs for breaking changes
4. **Quarterly manual review** — Check each provider's docs for version lifecycle status

---

## Migration Playbook

### When You Receive a Deprecation Notice

**Week 1: Assessment**
1. Identify all code that uses the deprecated endpoint/version
2. Read the migration guide from the provider
3. Estimate effort (hours) and risk (breaking changes)
4. Check if your SDK version supports the new API version
5. Create a migration ticket with effort estimate and deadline

**Week 2–4: Implementation**
1. Update in a feature branch
2. Run integration tests against the new version (sandbox/staging)
3. Verify response format changes are handled
4. Update contract tests / recorded fixtures
5. Update any webhook endpoints if event schemas changed

**Week 5: Rollout**
1. Deploy to staging → run full integration test suite
2. Deploy to production with feature flag (if applicable)
3. Monitor error rates and latency for 48 hours
4. Remove old version code and feature flag
5. Update version inventory document

### Migration Risk Matrix

| Change Type | Risk | Example | Mitigation |
|-------------|------|---------|------------|
| New required field | Low | New `metadata` field required on create | Add field, test, deploy |
| Field renamed | Medium | `customer_id` → `cust_id` | Update all references, test |
| Field removed | Medium | `legacy_status` no longer returned | Find all usages, provide default |
| Response format change | High | Array → paginated object | Update parsing logic, test edge cases |
| Auth mechanism change | High | API key → OAuth 2.0 | Full auth flow rewrite |
| Endpoint removed | High | `/v1/charges` → `/v1/payment_intents` | May require business logic changes |
| Webhook schema change | High | New event structure | Update all handlers, test with fixtures |

---

## Breaking Change Impact Assessment

When a provider announces a breaking change:

### 1. Surface Area Scan

- How many files reference the affected API/endpoint?
- How many services depend on it?
- Is this on the critical path (payment, auth) or non-critical (analytics)?

### 2. Downstream Impact

- Do your consumers (frontend, mobile app, other services) depend on data from this integration?
- Will the format change cascade through your system?
- Are there cached responses that will become stale/invalid?

### 3. Timeline Assessment

| Urgency | Deadline | Strategy |
|---------|----------|----------|
| > 6 months | Next quarter planning | Schedule normally |
| 3–6 months | Current quarter | Prioritize in upcoming sprint |
| 1–3 months | Urgent | Dedicate engineer this sprint |
| < 1 month | Emergency | Drop other work, migration-only sprint |
| Past deadline | Critical | Provider may disable at any time — emergency migration |

---

## Provider Lifecycle Patterns

Understanding how providers handle versioning helps you plan:

### Date-Based Versioning (Stripe)
- New version released every few months
- Old versions supported for ~2 years
- Upgrade at your pace, pin specific date
- **Strategy:** Upgrade annually during hardening, skip minor versions

### Major Version Bumps (GitHub, Twilio)
- v1 → v2 → v3 with breaking changes
- Old versions supported for 1–3 years
- **Strategy:** Upgrade when the next major is stable (6+ months after release)

### Rolling Deprecation (Google)
- Announce deprecation → 1 year sunset → removal
- Multiple APIs with different timelines
- **Strategy:** Monitor deprecation announcements aggressively

### Silent Deprecation (Smaller Providers)
- Little or no advance warning
- API just stops working or returns errors
- **Strategy:** Pin SDK versions, monitor for unexpected errors, have fallback ready

---

## Dependency Management

### SDK Version Strategy

| Strategy | Description | Pros | Cons |
|----------|-------------|------|------|
| **Lock exact** | `"stripe": "14.1.0"` | Predictable, no surprises | Must manually update |
| **Lock minor** | `"stripe": "~14.1.0"` | Gets patches, no breaking changes | Minor risk from patches |
| **Lock major** | `"stripe": "^14.0.0"` | Gets features and patches | Medium risk from minor bumps |
| **Latest** | `"stripe": "*"` | Always current | High risk, unreproducible builds |

**Recommendation:** Lock exact (`14.1.0`) for P0/P1 integrations. Lock minor (`~14.1.0`) for P2/P3.

### Automated Updates

- Use Dependabot or Renovate for automated PR creation on SDK updates
- Require integration tests to pass before merging SDK update PRs
- Review changelogs in PR description before approving
- Group related SDK updates (e.g., all AWS SDK packages together)

---

## Quarterly Review Template

Every quarter, during hardening (Steps 29–33), review your integration versions:

```
Integration Version Review — Q{{QUARTER}} {{YEAR}}

| Provider | Current Version | Latest Version | Versions Behind | Sunset Date | Action Required |
|----------|----------------|---------------|-----------------|-------------|-----------------|
|          |                |               |                 |             |                 |

Summary:
- Total integrations: X
- Up to date: X
- 1 version behind: X
- 2+ versions behind: X (review urgently)
- Sunset announced: X (create migration tickets)

Action items:
1. [ ] ...
2. [ ] ...
```
