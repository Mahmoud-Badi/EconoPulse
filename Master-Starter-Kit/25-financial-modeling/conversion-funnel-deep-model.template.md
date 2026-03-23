# Conversion Funnel Deep Model — {{PROJECT_NAME}}

> An 8-stage funnel model with cohort-based retention curves, channel-specific variants, and expansion revenue modeling. Most startups track top-of-funnel and paid conversions. This model tracks every transition in between, because each stage is a lever and each drop-off is a leak.

---

## Funnel Stage Definitions

| Stage | Definition | Key Event | Measured By |
|-------|-----------|-----------|------------|
| 1. **Visitor** | Arrives at website or landing page | Page view | Analytics (PostHog, GA4) |
| 2. **Lead** | Provides contact info or engages meaningfully | Email capture, demo request | CRM / marketing tool |
| 3. **Signup** | Creates an account | Account creation event | Auth system |
| 4. **Activation** | Completes the "aha moment" action | {{ACTIVATION_EVENT}} | Product analytics |
| 5. **Trial** | Begins using paid features (free trial or freemium upgrade intent) | Trial start event | Billing system |
| 6. **Paid** | Converts to paying customer | First payment | Stripe / billing |
| 7. **Retained** | Still paying after initial period (Month 2+) | Renewal / no churn | Billing system |
| 8. **Expanded** | Increased spend (upgrade, add seats, add-ons) | Plan change or seat addition | Billing system |

---

## Conversion Rates by Stage

### Your Funnel

| Stage Transition | Your Rate | Industry Benchmark (B2B SaaS) | Industry Benchmark (B2C SaaS) | Gap | Priority |
|-----------------|-----------|-------------------------------|-------------------------------|-----|----------|
| Visitor → Lead | {{VISITOR_TO_LEAD_RATE}}% | 2-5% | 5-15% | ___% | ___ |
| Lead → Signup | {{LEAD_TO_SIGNUP_RATE}}% | 10-25% | 20-40% | ___% | ___ |
| Signup → Activation | {{SIGNUP_TO_ACTIVATION_RATE}}% | 20-40% | 30-60% | ___% | ___ |
| Activation → Trial | {{ACTIVATION_TO_TRIAL_RATE}}% | 30-60% | 40-70% | ___% | ___ |
| Trial → Paid | {{TRIAL_TO_PAID_RATE}}% | 15-30% (free trial) / 3-7% (freemium) | 5-15% | ___% | ___ |
| Paid → Retained (M2) | {{MONTHLY_RETENTION_RATE}}% | 95-97% monthly | 90-95% monthly | ___% | ___ |
| Retained → Expanded | {{EXPANSION_RATE}}% | 5-15% of retained/quarter | 2-8% of retained/quarter | ___% | ___ |

### Cumulative Conversion (Visitor to Paid)

```
End-to-End Rate = Visitor→Lead x Lead→Signup x Signup→Activation x Activation→Trial x Trial→Paid
```

| Scenario | V→L | L→S | S→A | A→T | T→P | **Visitor → Paid** | Visitors Needed for 100 Customers |
|----------|-----|-----|-----|-----|-----|--------------------|----------------------------------|
| Your model | {{VISITOR_TO_LEAD_RATE}}% | {{LEAD_TO_SIGNUP_RATE}}% | {{SIGNUP_TO_ACTIVATION_RATE}}% | {{ACTIVATION_TO_TRIAL_RATE}}% | {{TRIAL_TO_PAID_RATE}}% | ___% | ___ |
| Optimistic (+20% each) | ___% | ___% | ___% | ___% | ___% | ___% | ___ |
| Pessimistic (-20% each) | ___% | ___% | ___% | ___% | ___% | ___% | ___ |

**Key insight:** A 5-stage funnel with 30% conversion at each stage yields 0.24% end-to-end. You need 41,667 visitors for 100 customers. Improving any single stage by 5 percentage points changes this dramatically.

---

## Time-to-Convert Per Stage

How long does each transition take? This determines your cash flow timing and forecast lag.

| Stage Transition | Median Time | 25th Percentile | 75th Percentile | Max Viable Window |
|-----------------|-------------|-----------------|-----------------|-------------------|
| Visitor → Lead | Instant - 3 visits | 1 visit | 7 visits | 30 days |
| Lead → Signup | 1-3 days | Same session | 14 days | 60 days (then lead is cold) |
| Signup → Activation | 1-7 days | Day 0 | 14 days | 21 days (after this, likelihood drops to <5%) |
| Activation → Trial | 3-14 days | Day 1 | 30 days | 45 days |
| Trial → Paid | Trial length (7-30 days) | Day 3 of trial | Last day of trial | Trial end + 7 days grace |
| **Total: Visitor → Paid** | **14-60 days** | **7 days** | **90 days** | **120 days** |

<!-- IF {{MONETIZATION_MODEL}} == "subscription" -->
**SaaS timing note:** The gap between signup and first payment is your "time-to-revenue." If this averages 45 days, your MRR projections lag your signup growth by 6 weeks. Account for this in cash flow planning.
<!-- ENDIF -->

---

## Cohort-Based Retention Curves

Track each monthly cohort separately. Aggregate retention masks problems.

### Retention by Monthly Cohort (% of original cohort still paying)

| Cohort | M0 | M1 | M2 | M3 | M4 | M5 | M6 | M9 | M12 |
|--------|----|----|----|----|----|----|----|----|-----|
| Jan cohort (example) | 100% | 78% | 68% | 62% | 58% | 56% | 54% | 50% | 47% |
| Feb cohort | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | ___% |
| Mar cohort | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | ___% |
| Apr cohort | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | ___% |
| May cohort | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | ___% |
| Jun cohort | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | ___% |

### Retention Benchmarks

| Retention Window | Excellent | Good | Concerning | Critical |
|-----------------|-----------|------|-----------|----------|
| M1 (30-day) | >90% | 80-90% | 60-80% | <60% |
| M3 (90-day) | >75% | 60-75% | 40-60% | <40% |
| M6 (6-month) | >65% | 50-65% | 30-50% | <30% |
| M12 (annual) | >55% | 40-55% | 25-40% | <25% |

**Reading the curve:** A healthy retention curve flattens after M3-M6, indicating a stable core user base. If it keeps declining linearly, you have a product-market fit problem, not a churn problem.

---

## Channel-Specific Funnel Variants

Different acquisition channels produce different quality users with different conversion behaviors.

| Metric | Organic Search | Paid Search | Paid Social | Referral | Product-Led (Viral) | Outbound Sales |
|--------|---------------|-------------|-------------|----------|--------------------|----|
| Visitor→Lead | ___% | ___% | ___% | ___% | ___% | N/A (lead-first) |
| Lead→Signup | ___% | ___% | ___% | ___% | ___% | ___% |
| Signup→Activation | ___% | ___% | ___% | ___% | ___% | ___% |
| Trial→Paid | ___% | ___% | ___% | ___% | ___% | ___% |
| M6 Retention | ___% | ___% | ___% | ___% | ___% | ___% |
| Avg Revenue/User | $___ | $___ | $___ | $___ | $___ | $___ |
| CAC | $___ | $___ | $___ | $___ | $___ | $___ |
| **LTV:CAC** | ___:1 | ___:1 | ___:1 | ___:1 | ___:1 | ___:1 |

**Typical pattern:** Organic and referral have highest LTV:CAC (3-8x). Paid social has lowest retention. Outbound sales has highest ARPU but highest CAC. Product-led viral has lowest CAC but lowest ARPU.

---

## Funnel Optimization Recommendations

| Stage | Typical Failure Mode | Optimization Lever | Expected Impact |
|-------|---------------------|-------------------|-----------------|
| Visitor → Lead | No clear CTA; page loads slowly | Above-fold CTA; speed optimization; social proof | +30-80% improvement |
| Lead → Signup | Too much friction; email verification wall | Single-field signup; OAuth (Google/GitHub); defer verification | +20-50% improvement |
| Signup → Activation | User doesn't reach "aha moment" | Onboarding checklist; first-value-in-5-minutes design; empty state guidance | +25-100% improvement |
| Activation → Trial | No prompt to try paid features | In-app upgrade prompts at moment of value; feature gating at usage limits | +15-40% improvement |
| Trial → Paid | Trial too short; no urgency; payment friction | Optimal trial length (14 days B2B, 7 days B2C); countdown emails; saved payment method | +10-30% improvement |
| Paid → Retained | Feature not sticky; poor onboarding | Usage-based engagement emails; QBRs for enterprise; habit loops | +5-15% improvement |
| Retained → Expanded | No expansion triggers; flat pricing | Seat-based pricing; usage tiers; annual plan incentives; feature launches | +10-25% improvement |

---

## Net Revenue Per Cohort (12 Months)

Model revenue from a single cohort of 100 initial paid customers over 12 months.

| Month | Retained Customers | Avg Revenue/Customer | Monthly Revenue | Cumulative Revenue | Expansion Revenue | Total with Expansion |
|-------|-------------------|---------------------|----------------|--------------------|----|------|
| M0 | 100 | ${{BASE_PRICE}} | $___ | $___ | $0 | $___ |
| M1 | ___ | $___ | $___ | $___ | $___ | $___ |
| M2 | ___ | $___ | $___ | $___ | $___ | $___ |
| M3 | ___ | $___ | $___ | $___ | $___ | $___ |
| M4 | ___ | $___ | $___ | $___ | $___ | $___ |
| M5 | ___ | $___ | $___ | $___ | $___ | $___ |
| M6 | ___ | $___ | $___ | $___ | $___ | $___ |
| M9 | ___ | $___ | $___ | $___ | $___ | $___ |
| M12 | ___ | $___ | $___ | $___ | $___ | $___ |
| **12-Month Total** | | | | **$___** | **$___** | **$___** |

### Expansion Revenue Modeling

| Expansion Type | % of Retained Customers/Quarter | Avg Revenue Increase | Quarterly Expansion MRR |
|---------------|-------------------------------|---------------------|------------------------|
| Seat addition | ___% | +$___/seat | $___ |
| Plan upgrade | ___% | +$___/upgrade | $___ |
| Add-on purchase | ___% | +$___/add-on | $___ |
| Usage overage | ___% | +$___/overage | $___ |
| **Total Expansion Rate** | **{{EXPANSION_RATE}}% of retained** | | **$___** |

**Net Revenue Retention (NRR):**
```
NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR x 100
```

| NRR Range | Interpretation |
|-----------|---------------|
| >130% | Elite (Twilio, Snowflake class) |
| 110-130% | Excellent — expansion outpaces churn |
| 100-110% | Good — roughly breaking even on existing revenue |
| 90-100% | Warning — losing revenue from existing base |
| <90% | Critical — leaky bucket, growth cannot outpace churn |

---

## Gotchas: Funnel Modeling Mistakes

1. **Your funnel has more stages than you think.** Most teams track Signup → Paid and miss Activation entirely. If 60% of signups never complete onboarding, your real funnel is half as efficient as your dashboard shows.

2. **Missed activation events are invisible churn.** A user who signs up but never activates will churn in 30 days, but you won't see it coming because they never appeared in your "active user" metrics. Track activation rate as a leading indicator of future churn.

3. **Averaging retention across cohorts hides trends.** If January cohort retained 70% at M3 but June cohort retained 45% at M3, your product is getting worse. Aggregate metrics would show ~55% and look stable.

4. **Ignoring channel mix shifts.** If you move from 80% organic to 60% paid, your aggregate funnel metrics will decline even if each channel's funnel is unchanged. Always segment by channel.

5. **Treating trial-to-paid as one number.** A 14-day free trial has a completely different conversion profile than a freemium model. Free trial: 15-30% converts. Freemium: 3-7% converts. Mixing them produces a meaningless number.

6. **Expansion revenue is not free.** It requires CSM effort, feature development, and pricing design. Budget for expansion-driving costs when projecting expansion revenue.

7. **Forgetting reactivation.** 5-15% of churned users return within 12 months. Model reactivation separately — it is essentially a free acquisition channel.

---

*Cross-references: freemium-trial-conversion-modeling.template.md (trial details), unit-economics-calculator.template.md (CAC by channel), revenue-projection.template.md (revenue from cohort model)*
