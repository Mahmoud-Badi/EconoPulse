# Integration Maturity Assessment

> Use this decision tree to determine your integration maturity level before working through the rest of Section 32. Your maturity level determines which templates to resolve and how deeply to invest in cross-cutting integration infrastructure.

---

## Step 1: Count Your Integrations

List every third-party service your project will consume. Include services from your Section 00 `integrations-map.template.md` output. Count each distinct service as one integration.

Common integrations people forget to count:
- Authentication provider (Auth0, Clerk, Supabase Auth, Firebase Auth)
- Email delivery (SendGrid, SES, Resend, Postmark)
- File storage (S3, R2, GCS, Cloudinary)
- Analytics (Segment, Mixpanel, PostHog, Google Analytics)
- Payment processing (Stripe, PayPal, Paddle)
- Error tracking (Sentry, Bugsnag, Datadog)
- Search (Algolia, Typesense, Elasticsearch)
- CDN/hosting (Vercel, Cloudflare, AWS CloudFront)
- CI/CD (GitHub Actions, CircleCI, GitLab CI)
- Monitoring (Datadog, New Relic, Grafana Cloud)

**Your count: ____**

---

## Step 2: Assess Your Context

Answer these questions to refine your maturity level:

| Question | Yes → Higher Maturity | No → Lower Maturity |
|----------|----------------------|---------------------|
| Do any integrations handle money (payments, billing, refunds)? | +1 level | — |
| Do any integrations handle PII or sensitive data? | +1 level | — |
| Is there a compliance requirement (SOC 2, HIPAA, GDPR)? | +1 level | — |
| Are you building a multi-tenant platform? | +1 level | — |
| Will you have more than 1,000 daily active users at launch? | +1 level | — |
| Do any integrations require real-time data (WebSockets, SSE)? | +1 level | — |
| Do you consume more than 2 webhook-based APIs? | +1 level | — |

---

## Step 3: Determine Your Level

```
Integration Count: 1-3, Context Score: 0-1
→ LEVEL 1: BASIC

Integration Count: 1-3, Context Score: 2+
→ LEVEL 2: STANDARD

Integration Count: 4-8, Context Score: 0-2
→ LEVEL 2: STANDARD

Integration Count: 4-8, Context Score: 3+
→ LEVEL 3: COMPLEX

Integration Count: 9-15, Context Score: any
→ LEVEL 3: COMPLEX

Integration Count: 16+, Context Score: any
→ LEVEL 4: ENTERPRISE
```

---

## Level Definitions

### Level 1: Basic

**Profile:** Weekend MVP, solo developer, 1–3 integrations, no compliance requirements.

**Resolve these files:**
- [ ] `integration-strategy.template.md` — lightweight version (inventory + implementation order only)

**Skip everything else.** At this scale, over-engineering integration infrastructure costs more than the problems it prevents. Add resilience patterns when you have users, not before.

**Time estimate:** 15–20 minutes

---

### Level 2: Standard

**Profile:** Small team, 4–8 integrations, some handle payments or PII, moderate user base.

**Resolve these files:**
- [ ] `integration-strategy.template.md` — full version
- [ ] `resilience-patterns.md` — read and apply patterns to critical integrations
- [ ] `webhook-architecture.template.md` — if consuming webhook-based APIs
- [ ] `integration-health-monitoring.template.md` — lightweight health checks
- [ ] `integration-testing-strategies.md` — read and apply contract testing for payment/auth integrations
- [ ] Relevant category subdirectory templates (auth-sso, cloud-services, etc.)

**Time estimate:** 45–60 minutes

---

### Level 3: Complex

**Profile:** Team of 5+, 9–15 integrations, multiple handle money/PII, compliance requirements, real-time data needs.

**Resolve these files:**
- [ ] Everything in Level 2
- [ ] `multi-provider-fallback.template.md` — for critical integrations (email, payments, auth)
- [ ] `rate-limiting-strategies.md` — read and apply to quota-limited APIs
- [ ] `job-queue-patterns.template.md` — for async integration workloads
- [ ] `graphql-integration-patterns.md` — if consuming GraphQL APIs
- [ ] `realtime-integration-patterns.md` — if using WebSockets/SSE
- [ ] `api-versioning-deprecation.md` — read and plan for API lifecycle management
- [ ] All relevant category subdirectory templates

**Time estimate:** 90–120 minutes

---

### Level 4: Enterprise

**Profile:** Multiple teams, 16+ integrations, platform-scale, strict compliance, high availability requirements.

**Resolve these files:**
- [ ] Everything in Level 3
- [ ] `integration-gotchas.md` — study all production lessons
- [ ] Full contract testing suite per `integration-testing-strategies.md`
- [ ] Full API versioning strategy per `api-versioning-deprecation.md`
- [ ] All category subdirectory templates regardless of current usage (plan for future)

**Time estimate:** 2–3 hours

---

## Decision Matrix: Quick Reference

| Template | Basic | Standard | Complex | Enterprise |
|----------|-------|----------|---------|------------|
| `integration-strategy.template.md` | Lite | Full | Full | Full |
| `resilience-patterns.md` | — | Read | Apply | Apply |
| `webhook-architecture.template.md` | — | If needed | Resolve | Resolve |
| `multi-provider-fallback.template.md` | — | — | Critical only | All |
| `integration-health-monitoring.template.md` | — | Lite | Full | Full |
| `api-versioning-deprecation.md` | — | — | Read | Plan |
| `rate-limiting-strategies.md` | — | — | Read | Apply |
| `integration-testing-strategies.md` | — | Critical | Most | All |
| `graphql-integration-patterns.md` | — | — | If needed | If needed |
| `realtime-integration-patterns.md` | — | — | If needed | If needed |
| `job-queue-patterns.template.md` | — | — | Resolve | Resolve |
| `integration-gotchas.md` | — | Skim | Read | Study |
| Category subdirectories | — | Relevant | Relevant | All |

---

## Reassessment Triggers

Reassess your maturity level when:
- You add 3+ new integrations in a single quarter
- A third-party outage causes a user-facing incident
- You adopt a compliance framework (SOC 2, HIPAA, GDPR)
- Your team grows past 5 engineers working on integration-dependent features
- You receive a deprecation notice for a critical API
- Monthly integration costs exceed $500

Integration maturity is not a one-time assessment. Review quarterly during hardening (Steps 29–33) and upgrade your patterns as your integration surface area grows.
