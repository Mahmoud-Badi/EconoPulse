# Vendor Evaluation Framework

> Standardized framework for evaluating and selecting third-party vendors and integrations for {{PROJECT_NAME}}. Use this before committing to any paid service, API, or tool.

---

## Evaluation: {{VENDOR_NAME}}

- **Category:** <!-- e.g., "Email delivery", "Payment processing", "Analytics", "Hosting" -->
- **Evaluated By:** {{PROJECT_OWNER}}
- **Date:** YYYY-MM-DD
- **Decision:** <!-- Selected / Rejected / Shortlisted / Needs POC -->

---

## 1. Evaluation Criteria

### API Quality

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Documentation completeness | | <!-- Are all endpoints documented? Are there examples? --> |
| API versioning strategy | | <!-- Semantic versioning? Deprecation notices? Sunset policy? --> |
| Rate limits | | <!-- What are the limits? Can they be raised? --> |
| Error handling | | <!-- Clear error codes? Retry guidance? --> |
| Webhook support | | <!-- Does it send webhooks? Are they signed? Retry policy? --> |
| SDK availability ({{STACK}}) | | <!-- Official SDK for our stack? Maintained? TypeScript types? --> |
| Sandbox / test environment | | <!-- Free sandbox? Test credentials? Realistic test data? --> |

### Support

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Response time (our tier) | | |
| Support channels (email, chat, phone) | | |
| Technical depth of support staff | | |
| Status page and incident transparency | | |

### Pricing

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Cost at current scale | | |
| Cost at 10x scale | | |
| Pricing transparency | | |
| Free tier / trial adequacy | | |
| Hidden costs (overages, feature gates) | | |

### Compliance

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| BAA available (if HIPAA) | | |
| SOC 2 Type II | | |
| GDPR / DPA available | | |
| Uptime SLA and penalty terms | | |

### Developer Experience

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Time to first API call | | |
| Code examples quality | | |
| Migration ease from current solution | | |
| Backward compatibility track record | | |

---

## 2. Scorecard Summary

| Category | Weight | Raw Score (avg) | Weighted Score |
|----------|--------|----------------|----------------|
| API Quality | 25% | /5 | |
| Support | 15% | /5 | |
| Pricing | 25% | /5 | |
| Compliance | 20% | /5 | |
| Developer Experience | 15% | /5 | |
| **Total** | **100%** | | **/5** |

**Scoring Guide:**
- **4.0+** — Strong choice, proceed with confidence
- **3.0-3.9** — Acceptable, monitor weak areas
- **2.0-2.9** — Risky, consider alternatives
- **Below 2.0** — Do not proceed

---

## 3. POC Requirements

Before committing, validate these in a proof-of-concept:

### POC Checklist

- [ ] **Authentication:** Successfully authenticate using our auth pattern (API key, OAuth, etc.)
- [ ] **Core operation:** Complete the primary use case end-to-end (e.g., send an email, process a payment)
- [ ] **Error handling:** Trigger and handle at least 3 error scenarios (rate limit, invalid input, server error)
- [ ] **Webhooks:** Receive and process a webhook event (if applicable)
- [ ] **Performance:** Measure latency for the critical path — is it within our SLA?
- [ ] **Idempotency:** Verify duplicate requests are handled correctly
- [ ] **Sandbox realism:** Does test mode accurately reflect production behavior?
- [ ] **SDK quality:** Does the SDK handle retries, pagination, and types correctly?

---

## 4. Contract Checklist

Before signing, verify each item:

- [ ] **BAA signed** (if handling PHI/sensitive data)
- [ ] **DPA signed** (if handling EU personal data)
- [ ] **SLA documented** — uptime guarantee, response time, remedy for breach
- [ ] **Data ownership** — we own our data; vendor cannot use it for training, analytics, or resale
- [ ] **Exit clause** — can we leave without penalty? What's the notice period?
- [ ] **Data export** — can we export all our data in a standard format on exit?
- [ ] **Data deletion** — will they delete our data within N days of contract end?
- [ ] **Price lock period** — how long is pricing guaranteed? What's the max increase?
- [ ] **Auto-renewal terms** — does it auto-renew? What's the cancellation window?
- [ ] **Liability cap** — what's their liability if they cause us a data breach?
- [ ] **Subprocessor notification** — will they notify us before adding subprocessors?

---

## 5. Vendor Review Cadence

### Annual Review (Every 12 Months)

- [ ] Is the vendor still the best option? Check for new entrants.
- [ ] Review pricing — are we on the best plan for our current usage?
- [ ] Check compliance — is their SOC 2 / BAA still current?
- [ ] Review uptime — did they meet their SLA over the past year?
- [ ] Check for deprecations — are any APIs we use being sunset?
- [ ] Review security advisories — any incidents that affected our data?

### Trigger-Based Review (Immediate)

| Trigger | Action |
|---------|--------|
| Vendor acquired by another company | Review data ownership, pricing, and roadmap commitments |
| Pricing increase > 20% | Evaluate alternatives, negotiate, or plan migration |
| Major outage (> 4 hours) | Request postmortem, review SLA compliance, assess alternatives |
| Security breach at vendor | Assess impact on our data, review BAA/DPA terms, notify users if required |
| API deprecation announcement | Plan migration timeline, test new API version |
| Our usage crosses a pricing tier | Review cost projections, negotiate volume discount |

### Review Log

| Date | Vendor | Review Type | Findings | Action |
|------|--------|-------------|----------|--------|
| | | | | |

---

## Comparison Matrix (Multiple Vendors)

Use when evaluating 2+ vendors for the same category:

| Criterion | {{VENDOR_NAME}} | [Vendor B] | [Vendor C] |
|-----------|----------------|------------|------------|
| API Quality | /5 | /5 | /5 |
| Support | /5 | /5 | /5 |
| Pricing (monthly) | $ | $ | $ |
| Pricing (at 10x) | $ | $ | $ |
| Compliance | | | |
| DX Score | /5 | /5 | /5 |
| POC Result | | | |
| **Recommendation** | | | |
