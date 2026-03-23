# Cost Impact Analysis

> Every stack change has a financial dimension. This template quantifies the cost impact of proposed changes so decisions are based on numbers, not intuition. Complete this for any change with a monthly cost delta exceeding $500 or a one-time cost exceeding $5,000.

---

## Analysis Metadata

| Field | Value |
|-------|-------|
| **Analysis Date** | {{ANALYSIS_DATE}} |
| **Analyst** | {{ANALYST_NAME}} |
| **Related Upgrade Assessment** | {{ASSESSMENT_REFERENCE}} |
| **Project** | {{PROJECT_NAME}} |
| **Current Monthly Infrastructure Cost** | {{MONTHLY_INFRA_COST}} |
| **Current Monthly Active Users** | {{ACTIVE_USERS}} |

---

## 1. Current Monthly Cost Breakdown

Itemize every service that contributes to infrastructure cost. Include both the service directly affected by the proposed change and adjacent services that may be impacted.

| Service | Provider | Plan/Tier | Monthly Cost | % of Total | Cost Driver |
|---------|----------|-----------|-------------|------------|-------------|
| Hosting / Compute | {{HOSTING_PROVIDER}} | | | | |
| Database | | | | | |
| Authentication | {{AUTH_PROVIDER}} | | | | |
| File Storage | | | | | |
| CDN | | | | | |
| Email / Notifications | | | | | |
| Monitoring / Logging | | | | | |
| CI/CD | | | | | |
| Search | | | | | |
| Caching | | | | | |
| Domain / DNS / SSL | | | | | |
| Other: ____ | | | | | |
| **Total** | | | **$____/mo** | **100%** | |

**Cost per user:** $____ / MAU

---

## 2. Projected Cost After Change

What will the cost breakdown look like after the proposed change is implemented?

| Service | Current Monthly | Projected Monthly | Delta | Delta % | Notes |
|---------|----------------|-------------------|-------|---------|-------|
| | | | | | |
| | | | | | |
| | | | | | |
| **Total** | **$____/mo** | **$____/mo** | **+/- $____/mo** | **_____%** | |

**New cost per user:** $____ / MAU (was $____ / MAU)

---

## 3. One-Time Migration Cost

Costs incurred during the transition that do not recur after migration is complete.

| Cost Item | Estimate | Confidence | Notes |
|-----------|----------|------------|-------|
| Developer time (days x day rate) | | High / Medium / Low | |
| External consultant / contractor | | | |
| Migration tooling or services | | | |
| Temporary parallel infrastructure | | | Running old and new simultaneously |
| Data migration processing | | | |
| Downtime revenue loss | | | Estimated revenue per hour x expected downtime |
| QA and testing overhead | | | |
| Documentation and training | | | |
| **Total one-time cost** | **$____** | | |

---

## 4. Ongoing Cost Difference

| Metric | Value |
|--------|-------|
| **Monthly delta** | +/- $____ /month |
| **Annual delta** | +/- $____ /year |
| **Direction** | SAVING / INCREASE / NEUTRAL |

**At current scale ({{ACTIVE_USERS}} MAU):**
- Monthly impact: $____
- Annual impact: $____

**At 2x scale:**
- Current stack monthly cost at 2x: $____
- New stack monthly cost at 2x: $____
- Monthly delta at 2x: $____

**At 10x scale:**
- Current stack monthly cost at 10x: $____
- New stack monthly cost at 10x: $____
- Monthly delta at 10x: $____

**Scaling note:** Does the cost delta improve or worsen at scale? Some changes save money at small scale but cost more at large scale (or vice versa). Document the crossover point if one exists.

---

## 5. Break-Even Analysis

When does the one-time migration investment pay for itself through ongoing savings?

| Metric | Value |
|--------|-------|
| One-time migration cost | $____ |
| Monthly savings | $____ /month |
| **Break-even timeline** | **____ months** |
| Break-even at 2x scale | ____ months |
| Break-even at 10x scale | ____ months |

**Formula:** Break-even months = One-time cost / Monthly savings

**If the change increases ongoing costs** (no break-even), quantify the value received in exchange:
- Performance improvement: ____ (quantify: response time reduction, throughput increase)
- Security risk reduction: ____ (quantify: CVEs resolved, compliance requirements met)
- Developer productivity: ____ (quantify: build time reduction, fewer workarounds)
- Other: ____

---

## 6. Risk-Adjusted ROI

Account for the probability that estimates are wrong. Cost estimates are typically optimistic — build in realistic ranges.

| Scenario | One-Time Cost | Monthly Delta | Break-Even | Probability |
|----------|--------------|---------------|------------|-------------|
| **Best case** | $____ | $____ /mo | ____ months | ___% |
| **Expected case** | $____ | $____ /mo | ____ months | ___% |
| **Worst case** | $____ | $____ /mo | ____ months | ___% |

**Expected ROI (12-month horizon):**

```
ROI = (Annual savings - One-time cost) / One-time cost x 100%

Best case:    ____%
Expected:     ____%
Worst case:   ____%
```

**Decision threshold:** The change is financially justified if expected-case ROI exceeds 0% within 12 months, or if the change is required for non-financial reasons (security, compliance, EOL) regardless of ROI.

---

## 7. Hidden Cost Checklist

Costs that teams commonly forget to include. Check each and add to estimates above if applicable.

- [ ] **Opportunity cost:** What else could the team build with the migration time?
- [ ] **Learning curve:** Time for team to become productive with new technology
- [ ] **Tooling changes:** New IDE plugins, debugging tools, monitoring integrations
- [ ] **Staging environment:** Does staging need to be updated to match?
- [ ] **CI/CD pipeline:** Build time changes (faster or slower?)
- [ ] **Third-party integrations:** Do any integrations break and need rebuilding?
- [ ] **Support burden:** Will customer-facing behavior change, generating support tickets?
- [ ] **Compliance re-certification:** Does the change require re-auditing for SOC2, HIPAA, etc.?
- [ ] **Contract implications:** Are you locked into current provider contracts with penalties?
- [ ] **Data egress fees:** Moving data between providers often incurs egress charges

---

## 8. Cross-Reference with Financial Model

This analysis feeds into the broader financial model maintained in Section 25.

| Update Required | File | Section |
|----------------|------|---------|
| Infrastructure cost projections | `25-financial-modeling/infrastructure-cost-model.template.md` | Monthly cost breakdown |
| Burn rate recalculation | `25-financial-modeling/` | Runway projections |
| Unit economics update | `25-financial-modeling/` | Cost per user/customer |

- [ ] Section 25 financial model updated with new projections
- [ ] Burn rate recalculated if monthly delta > 10% of current infrastructure spend
- [ ] Unit economics updated if cost-per-user changes by > 5%

---

## 9. Recommendation

| Factor | Assessment |
|--------|-----------|
| Is the change cost-positive within 12 months? | YES / NO / N/A (non-financial driver) |
| Are the hidden costs accounted for? | YES / PARTIALLY / NO |
| Does the change scale favorably? | YES (saves more at scale) / NO (costs more at scale) / NEUTRAL |
| Is the ROI sufficient to justify the risk? | YES / NO |
| Is the financial model updated? | YES / NO |

**Financial verdict:** JUSTIFIED / MARGINAL / NOT-JUSTIFIED / REQUIRED-REGARDLESS

**Summary:**

<!-- 2-3 sentences. State the financial case clearly. If the change is not financially justified but is required for other reasons, state those reasons and the cost of doing it. -->
