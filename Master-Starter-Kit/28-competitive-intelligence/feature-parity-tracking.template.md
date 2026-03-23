# Feature Parity Tracking — {{PROJECT_NAME}}

> A living feature comparison matrix that tracks what you have, what competitors have, and where the gaps are. Updated monthly, reviewed quarterly. This is your single source of truth for competitive feature intelligence.

---

## Last Updated: {{DATE}}

**Review Cadence:** Monthly update, quarterly full review
**Owner:** Product lead or founder
**Data Sources:** Competitor changelogs, product pages, free trial sign-ups, G2/Capterra feature lists, user feedback

---

## How to Use This Document

1. **Initial population:** Fill in the matrix using your Tribunal data from `01-tribunal/competitors/competition-matrix.template.md` as the starting point
2. **Monthly updates:** During your monthly monitoring review, update any features that competitors have shipped or you have shipped
3. **Quarterly review:** During the quarterly reassessment, do a full audit — sign up for competitor free trials if needed to verify feature claims
4. **Prioritization:** Use the Feature Gap Prioritization table at the bottom to decide what to build next based on competitive pressure

---

## Legend

| Symbol | Meaning | Description |
|--------|---------|-------------|
| ✅ | Shipped | Feature is live in production and available to users |
| 🚧 | In Progress | Currently being built, expected ship date known |
| 📋 | Planned | On the roadmap but not yet started |
| ❌ | Not Planned | Consciously decided not to build this feature |
| ❓ | Unknown | Need to investigate — cannot confirm from public information |

---

## Feature Comparison Matrix

### Core Features

| Feature | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} | Priority | Notes |
|---------|-------------------|-------------------|-------------------|-------------------|----------|-------|
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

### Advanced Features

| Feature | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} | Priority | Notes |
|---------|-------------------|-------------------|-------------------|-------------------|----------|-------|
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

### Enterprise Features

| Feature | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} | Priority | Notes |
|---------|-------------------|-------------------|-------------------|-------------------|----------|-------|
| SSO / SAML | | | | | | |
| Role-based access control | | | | | | |
| Audit logging | | | | | | |
| SOC 2 compliance | | | | | | |
| Custom SLAs | | | | | | |
| Dedicated support | | | | | | |
| On-premise / self-hosted | | | | | | |
| API rate limits (enterprise tier) | | | | | | |

### Integration Features

| Integration | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} | Priority | Notes |
|-------------|-------------------|-------------------|-------------------|-------------------|----------|-------|
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

### Platform / Technical

| Capability | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} | Priority | Notes |
|-----------|-------------------|-------------------|-------------------|-------------------|----------|-------|
| Mobile app (iOS) | | | | | | |
| Mobile app (Android) | | | | | | |
| API availability | | | | | | |
| Webhook support | | | | | | |
| Offline mode | | | | | | |
| Multi-language support | | | | | | |
| White-labeling | | | | | | |

---

## Feature Classification

### Table Stakes Features

Features that every competitor has. You must have these to be considered a viable option. If you lack a table stakes feature, it is a blocking gap — prioritize immediately.

| Feature | Status in {{PROJECT_NAME}} | Gap? | Action |
|---------|---------------------------|------|--------|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

### Differentiators

Features that only {{PROJECT_NAME}} has. These are your competitive advantages. Protect them, promote them in marketing, and build on them.

| Feature | Why It Matters | Competitive Moat | Marketing Usage |
|---------|---------------|------------------|----------------|
| | | | |
| | | | |
| | | | |

### Opportunities

Features that competitors have but {{PROJECT_NAME}} does not. Evaluate whether your users actually need them before building.

| Feature | Which Competitors Have It | Users Requesting? | Strategic Value | Build Priority |
|---------|--------------------------|-------------------|----------------|---------------|
| | | | | |
| | | | | |
| | | | | |

### Conscious Gaps

Features you have deliberately decided NOT to build. Document the reasoning so you do not relitigate these decisions every quarter.

| Feature | Competitors Who Have It | Why We Are Not Building It | Last Reviewed |
|---------|------------------------|--------------------------|---------------|
| | | | |
| | | | |
| | | | |

---

## Feature Gap Prioritization

Use this table to prioritize which gaps to close. Score each dimension 1-5 and multiply for a priority score.

| Feature Gap | Customer Demand (1-5) | Competitive Pressure (1-5) | Strategic Alignment (1-5) | Effort Estimate (1-5, inverted: 5 = easy) | Priority Score (max 625) | Decision |
|-------------|----------------------|---------------------------|--------------------------|------------------------------------------|-------------------------|----------|
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

### Scoring Guide

**Customer Demand (1-5):**
- 1 = No customers have asked for this
- 2 = 1-2 customers mentioned it in passing
- 3 = Multiple customers have requested it
- 4 = Customers are citing this as a reason to evaluate competitors
- 5 = Customers are churning because we lack this

**Competitive Pressure (1-5):**
- 1 = No competitor has this
- 2 = One minor competitor has this
- 3 = Multiple competitors have this
- 4 = All major competitors have this (table stakes risk)
- 5 = Competitors are actively marketing against us on this gap

**Strategic Alignment (1-5):**
- 1 = Unrelated to our core value proposition
- 2 = Tangentially related
- 3 = Related but not core
- 4 = Directly supports our positioning
- 5 = Core to our competitive strategy

**Effort Estimate (1-5, inverted):**
- 1 = Massive effort (6+ months, team investment)
- 2 = Large effort (2-6 months)
- 3 = Medium effort (1-2 months)
- 4 = Small effort (1-4 weeks)
- 5 = Trivial effort (days)

### Priority Thresholds

| Score Range | Action |
|-------------|--------|
| 400-625 | Build immediately — this is a critical gap |
| 200-399 | Plan for next quarter — significant but not urgent |
| 100-199 | Monitor — revisit at next quarterly review |
| Below 100 | Ignore — not worth building based on current data |

---

## Pricing Comparison

| Dimension | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} |
|-----------|-------------------|-------------------|-------------------|-------------------|
| Free tier | | | | |
| Lowest paid plan | | | | |
| Most popular plan | | | | |
| Enterprise pricing | | | | |
| Pricing model | | | | |
| Free trial length | | | | |
| Annual discount | | | | |
| Per-seat vs. flat | | | | |

---

## Competitive Positioning Summary

Based on the feature matrix above, here is where {{PROJECT_NAME}} stands:

### Strengths (Features where we lead)
1.
2.
3.

### Weaknesses (Features where we lag)
1.
2.
3.

### Strategic Implications
-
-
-

---

## Version History

| Date | Changes Made | Source of Change | Updated By |
|------|-------------|-----------------|------------|
| {{DATE}} | Initial matrix created from Tribunal data | `01-tribunal/competitors/` | {{ANALYST}} |
| | | | |
| | | | |
| | | | |

---

## Update Checklist

Use this checklist during each update:

```
[ ] Reviewed competitor changelogs since last update
[ ] Checked competitor pricing pages for changes
[ ] Verified feature claims through product trials or screenshots
[ ] Updated feature status symbols in the matrix
[ ] Reclassified Table Stakes / Differentiators / Opportunities if needed
[ ] Re-scored Feature Gap Prioritization for any new gaps
[ ] Updated Pricing Comparison if pricing changed
[ ] Updated Version History
[ ] Communicated significant changes to team
```
