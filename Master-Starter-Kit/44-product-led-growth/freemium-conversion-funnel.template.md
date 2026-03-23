# Freemium Conversion Funnel

> Map the complete free-to-paid conversion funnel — from signup through activation, engagement, conversion, and expansion — with paywall placement strategy, feature gating matrix, trial optimization, and funnel diagnostics.

---

## 1. Funnel Stages

The freemium conversion funnel has five stages. Each stage has a distinct metric, conversion rate, and set of optimization levers.

### Funnel Overview

```
    ┌────────────────────────────────────────────────────────────────┐
    │                          SIGNUP                                │
    │  Visitor → creates account                                     │
    │  Metric: signup rate (visitors → signups)                      │
    │  Benchmark: 2-8% of landing page visitors                     │
    ├────────────────────────────────────────────────────────────────┤
    │                         ACTIVATED                              │
    │  Signed-up user → completes activation metric                 │
    │  Metric: activation rate (signups → activated)                │
    │  Benchmark: 20-50% within 7 days                              │
    ├────────────────────────────────────────────────────────────────┤
    │                          ENGAGED                               │
    │  Activated user → consistent weekly usage                     │
    │  Metric: engagement rate (activated → weekly active)          │
    │  Benchmark: 30-60% of activated users                        │
    ├────────────────────────────────────────────────────────────────┤
    │                         CONVERTED                              │
    │  Engaged user → upgrades to paid plan                         │
    │  Metric: conversion rate (engaged → paid)                    │
    │  Benchmark: 3-10% of signups, 10-25% of engaged users       │
    ├────────────────────────────────────────────────────────────────┤
    │                          EXPANDED                              │
    │  Paid user → upgrades plan, adds seats, purchases add-ons    │
    │  Metric: expansion rate (paid → higher plan)                 │
    │  Benchmark: 20-40% of paid accounts within 12 months         │
    └────────────────────────────────────────────────────────────────┘
```

### Your Funnel Metrics

```
Stage           Current Rate    Target Rate     Gap         Benchmark
─────           ────────────    ───────────     ───         ─────────
Signup          ____%           ____%           ____%       2-8%
Activated       ____%           ____%           ____%       20-50%
Engaged         ____%           ____%           ____%       30-60%
Converted       ____%           ____%           ____%       3-10%
Expanded        ____%           ____%           ____%       20-40%

End-to-end:     ____%           ____%           ____%       0.5-3%
(visitor → paid)
```

---

## 2. Transition Metrics

Each funnel transition has specific metrics that indicate health or problems.

### Signup → Activated

| Metric | Calculation | Your Value | Target |
|--------|------------|-----------|--------|
| Activation rate (D1) | Activated within 24h / Total signups | ____% | > 15% |
| Activation rate (D7) | Activated within 7d / Total signups | ____% | > 30% |
| Activation rate (D30) | Activated within 30d / Total signups | ____% | > 40% |
| Time-to-activation (median) | P50 time from signup to activation | ____ min | < {{TIME_TO_VALUE_TARGET}} |
| Drop-off step | Highest drop-off onboarding step | Step ____ | Identify and fix |
| Activation by source | Activation rate segmented by acquisition channel | ____% | — |

### Activated → Engaged

| Metric | Calculation | Your Value | Target |
|--------|------------|-----------|--------|
| D7 retention | % of activated users active in day 7 | ____% | > 40% |
| D14 retention | % of activated users active in day 14 | ____% | > 30% |
| D30 retention | % of activated users active in day 30 | ____% | > 25% |
| Weekly sessions (avg) | Average sessions per week for engaged users | ____ | > 3 |
| Feature depth | Avg distinct features used per engaged user | ____ | > 4 |
| Habit formation | % of activated users with 3+ sessions in first week | ____% | > 40% |

### Engaged → Converted

| Metric | Calculation | Your Value | Target |
|--------|------------|-----------|--------|
| Free-to-paid rate | Paid accounts / Total free accounts | ____% | {{UPGRADE_CONVERSION_TARGET}}% |
| Days to conversion (median) | P50 time from signup to first payment | ____ days | < 30 |
| Conversion by trigger | % of conversions attributed to each trigger type | ____% | — |
| Pricing page view rate | % of engaged users who view pricing page | ____% | > 15% |
| Checkout start rate | % of pricing page viewers who start checkout | ____% | > 30% |
| Checkout completion rate | % of checkout starters who complete | ____% | > 70% |

### Converted → Expanded

| Metric | Calculation | Your Value | Target |
|--------|------------|-----------|--------|
| Expansion rate (12mo) | Accounts that expanded in first year | ____% | > 25% |
| Net revenue retention | (Start MRR + Expansion - Churn) / Start MRR | ____% | > 110% |
| Seat expansion rate | Accounts that added seats in first 6 months | ____% | > 30% |
| Plan upgrade rate | Accounts that upgraded plan tier in first year | ____% | > 15% |
| Time to expansion | Median days from first payment to expansion | ____ days | — |

---

## 3. Paywall Placement

Paywall placement is the single most consequential decision in freemium product design. Place the wall too early and users never see value. Place it too late and there is no reason to pay.

### Paywall Strategy: {{PAYWALL_STRATEGY}}

<!-- IF {{PAYWALL_STRATEGY}} == "feature-based" -->

### Feature-Based Paywall

Users access a subset of features for free. Paid plans unlock additional features. The free tier must include enough to deliver the core value proposition; the paid tier must include features users genuinely need as they scale.

**Placement principle:** Free tier delivers the "aha moment." Paid tier enables scaling, collaboration, and advanced workflows.

```
FREE TIER (must deliver core value):
  ✓ Core workflow (the primary use case)
  ✓ Basic version of all major features
  ✓ Single-user experience
  ✓ Community support

PAID TIER (enables scale and depth):
  ✓ Everything in Free
  ✓ Team collaboration
  ✓ Advanced analytics and reporting
  ✓ Integrations and API access
  ✓ Priority support
  ✓ Admin controls and permissions
```

<!-- ENDIF -->

<!-- IF {{PAYWALL_STRATEGY}} == "usage-based" -->

### Usage-Based Paywall

Users access all features but with resource limits. Exceeding limits requires a paid plan. The free tier limit must be generous enough for genuine evaluation but not so generous that it supports production workloads.

**Placement principle:** Free tier supports individual experimentation. Usage grows naturally with value received; payment follows value.

```
FREE TIER LIMITS:
  {{FREE_TIER_LIMITS}}
  All features available within limits.

PAID TIER:
  Higher or unlimited limits.
  Pay for what you use.
```

<!-- ENDIF -->

<!-- IF {{PAYWALL_STRATEGY}} == "time-based" -->

### Time-Based Paywall (Trial)

Users access all features for a fixed period. After the trial, they must pay or lose access.

**Placement principle:** Full-access trial demonstrates complete value. Urgency of expiry drives conversion.

```
TRIAL PERIOD: ____ days
TRIAL ACCESS: Full feature access
POST-TRIAL: Downgrade to limited free tier or lose access
```

<!-- ENDIF -->

### Paywall Placement Decision Framework

| Question | Free | Paid | Rationale |
|----------|------|------|-----------|
| Does this feature deliver the core "aha moment"? | ✓ | | Core value must be free |
| Does this feature require team collaboration? | | ✓ | Collaboration = organizational value = willingness to pay |
| Does this feature scale with usage? | ✓ (limited) | ✓ (unlimited) | Usage-based gating |
| Is this feature a table-stakes expectation? | ✓ | | Gating expected features causes frustration |
| Does this feature differentiate from competitors? | | ✓ | Premium differentiation |
| Does this feature cost you money to serve? | ✓ (capped) | ✓ | Cost recovery above free tier |
| Does this feature enable compliance/security? | | ✓ | Enterprise requirement = enterprise pricing |

---

## 4. Feature Gating Matrix

The feature gating matrix maps every product feature to a plan tier and gating behavior.

### Gating Behaviors

| Behavior | Description | User Experience |
|----------|-------------|----------------|
| Available | Feature is fully accessible | No restriction |
| Limited | Feature is available with restrictions | Usage cap, reduced functionality |
| Preview | Feature is visible but not usable | Can see what it does, cannot interact |
| Locked | Feature is not accessible or visible | Does not appear in free UI |
| Trial | Feature is available for N uses | Counter shows remaining uses |

### Feature Gating Matrix

| Feature | Free | Pro | Business | Enterprise | Gating Type |
|---------|------|-----|----------|------------|-------------|
| Core feature A | Available | Available | Available | Available | — |
| Core feature B | Available | Available | Available | Available | — |
| Projects | Limited ({{FREE_TIER_LIMITS}}) | Available (20) | Unlimited | Unlimited | Usage cap |
| Team members | Limited (1) | Limited (20) | Unlimited | Unlimited | Seat cap |
| Storage | Limited (100 MB) | Limited (10 GB) | Limited (100 GB) | Unlimited | Usage cap |
| Advanced analytics | Preview | Available | Available | Available | Soft gate |
| API access | Locked | Available | Available | Available | Hard gate |
| Integrations | Limited (3) | Limited (20) | Unlimited | Unlimited | Usage cap |
| Custom reports | Locked | Locked | Available | Available | Hard gate |
| SSO/SAML | Locked | Locked | Available | Available | Hard gate |
| Audit logs | Locked | Locked | Available | Available | Hard gate |
| Webhooks | Locked | Locked | Available | Available | Hard gate |
| Guest access | Locked | Available | Available | Available | Hard gate |
| Priority support | Locked | Locked | Available | Available | Hard gate |
| Custom SLA | Locked | Locked | Locked | Available | Hard gate |
| Dedicated CSM | Locked | Locked | Locked | Available | Hard gate |
| Data export | Locked | Available | Available | Available | Hard gate |
| White-label | Locked | Locked | Locked | Available | Hard gate |

### Gating UX Patterns

```tsx
// src/components/gating/FeatureGate.tsx

interface FeatureGateProps {
  feature: string;
  requiredPlan: string;
  gatingType: "preview" | "locked" | "limited" | "trial";
  children: React.ReactNode;
  currentPlan: string;
}

function FeatureGate({
  feature,
  requiredPlan,
  gatingType,
  children,
  currentPlan,
}: FeatureGateProps) {
  const hasAccess = planLevel(currentPlan) >= planLevel(requiredPlan);

  if (hasAccess) return <>{children}</>;

  switch (gatingType) {
    case "preview":
      return (
        <div className="feature-preview">
          <div className="preview-overlay">
            {children}  {/* rendered but not interactive */}
            <div className="preview-cta">
              <p>Available on {requiredPlan}</p>
              <Button onClick={() => showUpgradeModal(feature, requiredPlan)}>
                Upgrade to unlock
              </Button>
            </div>
          </div>
        </div>
      );

    case "locked":
      return (
        <div className="feature-locked">
          <LockIcon />
          <p>{feature} — available on {requiredPlan}</p>
          <Button variant="ghost" onClick={() => showUpgradeModal(feature, requiredPlan)}>
            Learn more
          </Button>
        </div>
      );

    case "limited":
      return <>{children}</>; // Render with limits enforced elsewhere

    case "trial":
      return <>{children}</>; // Render with trial counter
  }
}
```

---

## 5. Trial Optimization

If your product includes a free trial (time-limited full access), optimization focuses on maximizing the percentage of trial users who convert before expiry.

### Trial Configuration

```
Trial duration:           ____ days
Trial access level:       Full / Limited to ________ features
Payment required upfront: Yes (opt-out) / No (opt-in)
Grace period after expiry: ____ days
Post-trial downgrade to:  Free tier / Account locked

Current trial-to-paid rate: ____%
Target trial-to-paid rate:  ____%
```

### Trial Optimization Levers

| Lever | Current | Experiment | Expected Impact |
|-------|---------|-----------|-----------------|
| Trial length | ____ days | Test 7 vs 14 vs 30 | Shorter = urgency, longer = more value |
| Opt-in vs opt-out | ________ | Test requiring card upfront | Opt-out: higher conversion, lower signups |
| Activation during trial | ____% | Onboarding improvements | +5-15% conversion |
| Mid-trial email (Day 3-5) | ________ | Feature highlight email | +3-8% engagement |
| Expiry warning (Day -3) | ________ | Urgency messaging | +5-10% conversion |
| Post-trial offer | ________ | Discount for immediate conversion | +5-15% recovery |
| Extended trial for engaged users | ________ | Auto-extend if active | +10-20% for extended group |

### Trial Email Sequence

| Day | Email | Purpose | Key Content |
|-----|-------|---------|-------------|
| 0 | Welcome | Orient user | Getting started guide, key features |
| 1 | Quick win | Drive activation | Single action to experience value |
| 3 | Feature spotlight | Deepen engagement | Highlight a feature they haven't used |
| 5 | Social proof | Build confidence | Customer story, team adoption tip |
| 7 | Mid-trial check-in | Assess engagement | "How's it going?" + help offer |
| N-3 | Expiry warning | Create urgency | "3 days left — here's what you'll lose" |
| N-1 | Final reminder | Drive conversion | "Last day — upgrade to keep access" |
| N | Expiry | Convert or retain | Special offer or downgrade to free tier |
| N+3 | Win-back | Recover churned trials | "We saved your data — come back" |
| N+7 | Final win-back | Last attempt | "Your data will be deleted in 30 days" |

---

## 6. Free Tier Cost Management

Free users cost money (compute, storage, support, bandwidth) but generate no direct revenue. Managing free tier costs is essential for PLG unit economics.

### Free Tier Cost Model

```
Cost per free user per month:
  Compute:    $________
  Storage:    $________
  Bandwidth:  $________
  Support:    $________
  Email:      $________
  Total:      $________

Free users:          ________
Monthly free tier cost: $________
Paid users:          ________
Monthly revenue:     $________
Free:Paid ratio:     ____:1

Cost of free tier as % of revenue: ____%
Target: < 15% of revenue
```

### Cost Management Strategies

| Strategy | Cost Reduction | User Impact |
|----------|---------------|-------------|
| Aggressive resource limits on free tier | High | May reduce activation |
| Throttle API/compute for free tier | Medium | Slower experience for free users |
| Deprioritize free tier support (community only) | Medium | Lower support quality |
| Archive inactive free accounts after 90 days | Medium | Data loss for returning users |
| Reduce free tier storage retention | Medium | Limits long-term free usage |
| Optimize infrastructure per-user cost | Medium | None (transparent) |
| Convert high-cost free users via targeted upsell | High | Positive (better experience on paid) |

---

## 7. Funnel Diagnostics

When funnel metrics drop, use this diagnostic framework to identify the root cause.

### Diagnostic Decision Tree

```
SYMPTOM: Signup rate dropped
├── Check: Landing page changes?
├── Check: Traffic source mix changed?
├── Check: Signup form broken? (test in incognito)
├── Check: Social login provider issues?
└── Check: Competitor launched free tier?

SYMPTOM: Activation rate dropped
├── Check: Onboarding flow changed?
├── Check: Product bug blocking activation?
├── Check: New user segment with different needs?
├── Check: Integration/API dependency down?
└── Check: Email verification blocking activation?

SYMPTOM: Conversion rate dropped
├── Check: Pricing changed?
├── Check: Feature gating changed?
├── Check: Competitor dropped prices?
├── Check: Free tier expanded (cannibalized paid)?
├── Check: Checkout flow broken?
├── Check: Payment provider issues?
└── Check: Trial length changed?

SYMPTOM: Expansion rate dropped
├── Check: Usage limit thresholds changed?
├── Check: Upgrade prompts removed or broken?
├── Check: Customers finding workarounds to limits?
├── Check: Competitor offering feature at lower tier?
└── Check: Customer success outreach reduced?
```

### Weekly Funnel Health Check

```
Date: ________

Signup Rate:       ____% (vs ____% last week) [↑/↓/→]  [OK / ALERT / CRITICAL]
Activation Rate:   ____% (vs ____% last week) [↑/↓/→]  [OK / ALERT / CRITICAL]
Engagement Rate:   ____% (vs ____% last week) [↑/↓/→]  [OK / ALERT / CRITICAL]
Conversion Rate:   ____% (vs ____% last week) [↑/↓/→]  [OK / ALERT / CRITICAL]
Expansion Rate:    ____% (vs ____% last week) [↑/↓/→]  [OK / ALERT / CRITICAL]

Alert Thresholds:
  ALERT:    > 10% decline week-over-week
  CRITICAL: > 20% decline week-over-week or below minimum viable rate

Actions Required:
________________________________________
________________________________________
```

---

## Checklist

- [ ] Mapped all five funnel stages with current conversion rates
- [ ] Set target conversion rates for each stage transition
- [ ] Defined paywall strategy: {{PAYWALL_STRATEGY}}
- [ ] Built feature gating matrix for all features across all plans
- [ ] Implemented feature gate UX (preview, locked, limited, trial)
- [ ] Optimized trial configuration (if using time-based trial)
- [ ] Set up trial email sequence
- [ ] Calculated free tier cost per user
- [ ] Established free tier cost as % of revenue (target: < 15%)
- [ ] Created funnel diagnostic runbook
- [ ] Set up weekly funnel health check
- [ ] Target free-to-paid conversion rate: {{UPGRADE_CONVERSION_TARGET}}%
