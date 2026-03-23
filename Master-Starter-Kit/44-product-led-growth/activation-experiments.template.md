# Activation Experiments

> Define your activation metric, set a Time-to-Value benchmark, and run a structured experiment program to optimize the path from signup to first value moment — with ICE scoring, statistical rigor, and velocity tracking.

---

## 1. Activation Metric Definition

The activation metric is the single event that marks when a user has experienced your product's core value for the first time. Everything before this moment is onboarding friction. Everything after is retention.

### Choosing Your Activation Metric

| Criteria | Your Product |
|----------|-------------|
| What is the core value proposition? | ________________________________________ |
| What action proves a user experienced that value? | ________________________________________ |
| Is this action measurable with a single event? | Yes / No — if no, define a composite |
| Can a user reach this action within {{TIME_TO_VALUE_TARGET}}? | Yes / No — if no, reduce friction |
| Do users who complete this action retain at higher rates? | Must validate with data |

### Activation Metric

```
Activation Metric: {{ACTIVATION_METRIC}}

Definition:
  A user is "activated" when they have ________________________________________

Event Name: user.activated
Event Properties:
  - time_from_signup: number (seconds)
  - activation_path: string (which onboarding flow)
  - activation_source: string (organic, invite, referral)
  - first_session: boolean

Current Activation Rate: ____%
Target Activation Rate:  ____%
```

### Activation Metric Validation

Before committing to an activation metric, validate that it actually predicts retention:

```
Cohort Analysis:
  Users who completed {{ACTIVATION_METRIC}} within 7 days:
    D7 retention:  ____%
    D30 retention: ____%
    D90 retention: ____%

  Users who did NOT complete {{ACTIVATION_METRIC}} within 7 days:
    D7 retention:  ____%
    D30 retention: ____%
    D90 retention: ____%

  Retention lift (activated vs. not):
    D7:  ____x
    D30: ____x
    D90: ____x
```

**Validation threshold:** If activated users retain at less than 2x the rate of non-activated users at D30, your activation metric may not be the right one. Re-examine which actions truly predict long-term retention.

### Common Activation Metrics by Product Type

| Product Type | Activation Metric | Time-to-Value |
|-------------|-------------------|---------------|
| Project management | Created first project + added a task | 5-10 minutes |
| Communication | Sent first message in a channel | 2-5 minutes |
| Design tool | Created first design or edited a template | 10-15 minutes |
| Analytics | Connected data source + viewed first report | 30-60 minutes |
| Developer tool | Deployed first app or ran first query | 15-30 minutes |
| CRM | Imported contacts + sent first email | 30-60 minutes |
| E-commerce tool | Connected store + processed first order | 1-4 hours |

---

## 2. Time-to-Value Benchmark

Time-to-Value (TTV) is the elapsed time from signup to activation. The shorter the TTV, the higher the activation rate. Every additional step, form field, or decision point between signup and value increases drop-off.

### TTV Measurement

```
Current TTV Distribution:
  P25 (fastest 25%):   ____ minutes
  P50 (median):        ____ minutes
  P75 (slowest 75%):   ____ minutes
  P90:                 ____ minutes

Target TTV: {{TIME_TO_VALUE_TARGET}}

Steps from Signup to Value:
  1. ________________________________________ (avg ____ seconds)
  2. ________________________________________ (avg ____ seconds)
  3. ________________________________________ (avg ____ seconds)
  4. ________________________________________ (avg ____ seconds)
  5. ________________________________________ (avg ____ seconds)

Total Steps: ____
Target Steps: ____ (remove or defer the rest)
```

### TTV Reduction Strategies

| Strategy | Expected TTV Reduction | Implementation Effort |
|----------|----------------------|----------------------|
| Pre-fill defaults instead of requiring choices | 30-50% | Low |
| Skip email verification until later | 20-30% | Low |
| Use templates/examples instead of blank state | 20-40% | Medium |
| Progressive onboarding (show only first step) | 15-25% | Medium |
| Social login (Google/GitHub) instead of form | 10-20% | Low |
| Skip workspace setup, use personal default | 15-30% | Medium |
| Guided walkthrough with sample data | 25-40% | High |
| Reduce required form fields | 5-15% per field removed | Low |

---

## 3. Experiment Framework

Every activation experiment follows a structured format. No experiment runs without a documented hypothesis, success metric, and minimum sample size.

### Experiment Template

```
Experiment ID:    AX-____
Experiment Name:  ________________________________________
Status:           Draft / Running / Complete / Paused

HYPOTHESIS:
  If we [change] ________________________________________
  Then [metric] ________________________________________
  Will [direction] ________________________________________
  Because [rationale] ________________________________________

METRICS:
  Primary:    ________________________________________ (current: ____%, target: ____%)
  Secondary:  ________________________________________ (guard rail)
  Counter:    ________________________________________ (ensure no negative impact)

VARIANTS:
  Control (A): ________________________________________
  Variant (B): ________________________________________
  Variant (C): ________________________________________ (optional)

TARGETING:
  Audience:   All new signups / Segment: ________________________________________
  Traffic:    ____% control / ____% variant(s)
  Exclusions: ________________________________________

DURATION:
  Start Date:       ____-____-____
  Min Duration:     ____ days (for statistical significance)
  Sample Size:      ____ users per variant (calculated below)
  Expected End:     ____-____-____

RESULTS:
  Control Rate:     ____%
  Variant Rate:     ____%
  Lift:             ____% (relative)
  Confidence:       ____%
  Decision:         Ship / Iterate / Kill
  Learning:         ________________________________________
```

### Sample Size Calculator

```
Inputs:
  Baseline conversion rate (p1):  ____%
  Minimum detectable effect:      ____% (relative lift)
  Statistical significance (α):   95% (0.05)
  Statistical power (1-β):        80% (0.80)

Formula (simplified):
  n = (Z_α/2 + Z_β)² × (p1(1-p1) + p2(1-p2)) / (p2 - p1)²

  Where:
    Z_α/2 = 1.96 (for 95% confidence)
    Z_β   = 0.84 (for 80% power)
    p2    = p1 × (1 + MDE)

Quick Reference:
  | Baseline | MDE 5% | MDE 10% | MDE 20% | MDE 50% |
  |----------|--------|---------|---------|---------|
  | 5%       | 63,000 | 15,800  | 4,000   | 680     |
  | 10%      | 34,800 | 8,700   | 2,200   | 380     |
  | 20%      | 20,400 | 5,100   | 1,300   | 230     |
  | 30%      | 15,200 | 3,800   | 960     | 170     |
  | 50%      | 10,800 | 2,700   | 680     | 130     |

  (Users PER variant — multiply by number of variants for total)
```

---

## 4. Onboarding Experiment Ideas

15+ experiment ideas organized by onboarding stage, with ICE scores.

### ICE Scoring

- **Impact** (1-10): How much will this move the activation metric?
- **Confidence** (1-10): How confident are we in the hypothesis?
- **Ease** (1-10): How easy is this to implement?
- **ICE Score** = (Impact + Confidence + Ease) / 3

### Experiment Backlog

| ID | Stage | Experiment | Hypothesis | I | C | E | ICE |
|----|-------|-----------|-----------|---|---|---|-----|
| AX-001 | Signup | Remove company name field | Reducing form fields increases signup completion | 6 | 8 | 9 | 7.7 |
| AX-002 | Signup | Add Google/GitHub SSO | Social login reduces signup friction | 7 | 9 | 7 | 7.7 |
| AX-003 | Signup | Add social proof ("10K teams use us") | Social proof increases signup confidence | 5 | 7 | 9 | 7.0 |
| AX-004 | Onboarding | Replace blank state with template | Pre-populated content reduces TTV | 8 | 8 | 6 | 7.3 |
| AX-005 | Onboarding | Add interactive walkthrough | Guided tour increases feature discovery | 7 | 7 | 5 | 6.3 |
| AX-006 | Onboarding | Skip workspace setup (defer to later) | Fewer steps = faster activation | 8 | 7 | 7 | 7.3 |
| AX-007 | Onboarding | Add progress indicator | Progress bar increases completion rate | 5 | 8 | 9 | 7.3 |
| AX-008 | Onboarding | Personalize by use case (ask goal first) | Relevant content increases engagement | 7 | 6 | 5 | 6.0 |
| AX-009 | Activation | Send activation reminder at 24h | Nudge email re-engages drop-offs | 6 | 7 | 8 | 7.0 |
| AX-010 | Activation | Add checklist with 3 key actions | Clear goals increase activation rate | 8 | 8 | 7 | 7.7 |
| AX-011 | Activation | Reduce required integrations from 2 to 0 | Removing blockers increases activation | 9 | 7 | 6 | 7.3 |
| AX-012 | Activation | Add sample data for immediate exploration | Users value seeing data over empty screens | 7 | 8 | 6 | 7.0 |
| AX-013 | Activation | Show "what you can do" modal vs "how to set up" | Value-first framing increases motivation | 6 | 6 | 8 | 6.7 |
| AX-014 | Retention | Send D3 email highlighting unused feature | Feature discovery reduces early churn | 5 | 6 | 8 | 6.3 |
| AX-015 | Retention | Add "invite teammate" prompt after first success | Post-value moment has highest invite rate | 7 | 7 | 7 | 7.0 |
| AX-016 | Signup | Change CTA from "Start Free Trial" to "Start Building" | Action-oriented CTA increases signup | 4 | 5 | 10 | 6.3 |
| AX-017 | Onboarding | Video walkthrough vs. text instructions | Video may increase comprehension for complex products | 5 | 5 | 6 | 5.3 |
| AX-018 | Activation | Offer live onboarding call for users stuck > 48h | Human assistance rescues at-risk users | 6 | 7 | 4 | 5.7 |

### Prioritized Experiment Queue (sorted by ICE)

```
Priority 1 (ICE >= 7.5):
  AX-001  Remove company name field         (7.7)
  AX-002  Add Google/GitHub SSO             (7.7)
  AX-010  Add checklist with 3 key actions  (7.7)

Priority 2 (ICE >= 7.0):
  AX-004  Replace blank state with template (7.3)
  AX-006  Skip workspace setup              (7.3)
  AX-007  Add progress indicator            (7.3)
  AX-011  Reduce required integrations      (7.3)
  AX-003  Add social proof                  (7.0)
  AX-009  Send activation reminder          (7.0)
  AX-012  Add sample data                   (7.0)
  AX-015  Invite prompt after first success (7.0)

Priority 3 (ICE >= 6.0):
  AX-005  Interactive walkthrough           (6.3)
  AX-008  Personalize by use case           (6.0)
  AX-013  Value-first framing modal         (6.7)
  AX-014  D3 feature discovery email        (6.3)
  AX-016  Action-oriented CTA              (6.3)

Priority 4 (ICE < 6.0):
  AX-017  Video vs text walkthrough         (5.3)
  AX-018  Live onboarding call offer        (5.7)
```

---

## 5. Results Tracking Template

### Experiment Results Log

| ID | Name | Start | End | Control | Variant | Lift | Conf | Decision | Key Learning |
|----|------|-------|-----|---------|---------|------|------|----------|-------------|
| AX-___ | ________ | ______ | ______ | ____% | ____% | ____% | ____% | Ship/Kill | ________ |
| AX-___ | ________ | ______ | ______ | ____% | ____% | ____% | ____% | Ship/Kill | ________ |
| AX-___ | ________ | ______ | ______ | ____% | ____% | ____% | ____% | Ship/Kill | ________ |
| AX-___ | ________ | ______ | ______ | ____% | ____% | ____% | ____% | Ship/Kill | ________ |
| AX-___ | ________ | ______ | ______ | ____% | ____% | ____% | ____% | Ship/Kill | ________ |

### Cumulative Impact Tracker

```
Metric: Activation Rate ({{ACTIVATION_METRIC}})

Baseline (start of program):     ____%
After AX-___:                    ____% (+____% lift)
After AX-___:                    ____% (+____% lift)
After AX-___:                    ____% (+____% lift)
After AX-___:                    ____% (+____% lift)

Cumulative lift:                 ____% (from ____% to ____%)

Metric: Time-to-Value
Baseline (start of program):     ____ minutes
Current:                         ____ minutes
Reduction:                       ____% (from ____ to ____ minutes)
```

---

## 6. Statistical Significance

### When to Call an Experiment

An experiment result is statistically significant when:

1. **Minimum sample size reached** for all variants (see calculator above)
2. **Confidence level >= 95%** (p-value < 0.05)
3. **Minimum duration of 7 days** (to capture day-of-week effects)
4. **At least 2 full business cycles** observed
5. **No external confounders** during the test (launches, outages, holidays)

### Common Statistical Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Peeking | Checking results before sample size is reached inflates false positives | Set sample size upfront, do not peek until reached |
| Multiple comparisons | Testing 5 variants without correction makes a false positive likely | Use Bonferroni correction: α/n for each comparison |
| Simpson's paradox | Aggregate result hides opposite trends in segments | Always segment results by key dimensions |
| Novelty effect | Variant wins because it is new, not because it is better | Run experiment for at least 2 weeks |
| Survivorship bias | Only measuring users who complete signup | Measure from intent (landing page view), not from signup |
| Instrumentation error | Events fire inconsistently across variants | QA event firing in both variants before launch |

### Quick Significance Check

```typescript
// src/growth/significance.ts

interface ExperimentResult {
  controlConversions: number;
  controlTotal: number;
  variantConversions: number;
  variantTotal: number;
}

function isSignificant(result: ExperimentResult): {
  significant: boolean;
  confidence: number;
  lift: number;
} {
  const p1 = result.controlConversions / result.controlTotal;
  const p2 = result.variantConversions / result.variantTotal;
  const pPool = (result.controlConversions + result.variantConversions)
    / (result.controlTotal + result.variantTotal);
  const se = Math.sqrt(
    pPool * (1 - pPool) * (1 / result.controlTotal + 1 / result.variantTotal)
  );
  const z = (p2 - p1) / se;
  // Two-tailed test
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));
  const confidence = (1 - pValue) * 100;
  const lift = ((p2 - p1) / p1) * 100;

  return {
    significant: pValue < 0.05,
    confidence: Math.round(confidence * 10) / 10,
    lift: Math.round(lift * 10) / 10,
  };
}

function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}
```

---

## 7. Experiment Velocity

Experiment velocity is the number of experiments shipped per time period. Higher velocity = faster learning = faster growth.

### Velocity Targets

```
Target Experiment Velocity: {{EXPERIMENT_VELOCITY}} experiments/month

Current Velocity:  ____ experiments/month
Target Velocity:   {{EXPERIMENT_VELOCITY}} experiments/month
Gap:               ____ experiments/month

Bottleneck Analysis:
  Hypothesis generation:  ____ ideas/month (target: 3x velocity)
  Design/spec time:       ____ days/experiment (target: 1-2 days)
  Engineering time:       ____ days/experiment (target: 2-5 days)
  QA time:                ____ days/experiment (target: 1 day)
  Run time:               ____ days/experiment (depends on traffic)
  Analysis time:          ____ days/experiment (target: 1 day)
```

### Velocity Improvement Strategies

| Strategy | Impact on Velocity | Effort |
|----------|-------------------|--------|
| Build reusable experiment framework | 2-3x | High (one-time) |
| Pre-build common UI variants (modals, banners) | 1.5-2x | Medium |
| Automate significance calculation | 1.2x | Low |
| Use feature flags instead of code deploys | 2x | Medium |
| Run multiple non-competing experiments simultaneously | 2-3x | Low |
| Create experiment templates for common patterns | 1.3x | Low |
| Dedicated experiment review meeting (weekly) | 1.5x | Low |

### Monthly Velocity Report

```
Month: ________

Experiments Started:    ____
Experiments Completed:  ____
Experiments Shipped:    ____
Experiments Killed:     ____
Experiments Paused:     ____

Win Rate:               ____% (shipped / completed)
Average Lift (winners): ____%
Cumulative Impact:      ____% improvement in activation rate

Top Learning This Month:
________________________________________
```

---

## Checklist

- [ ] Defined activation metric: {{ACTIVATION_METRIC}}
- [ ] Validated activation metric predicts retention (2x+ retention lift)
- [ ] Set Time-to-Value target: {{TIME_TO_VALUE_TARGET}}
- [ ] Measured current TTV distribution (P25/P50/P75/P90)
- [ ] Documented all steps from signup to activation
- [ ] Scored and prioritized 15+ experiment ideas with ICE
- [ ] Set up experiment results tracking template
- [ ] Calculated required sample sizes for current traffic
- [ ] Established experiment velocity target: {{EXPERIMENT_VELOCITY}}/month
- [ ] Created experiment review cadence (weekly or biweekly)
- [ ] Instrumented activation event in {{ANALYTICS_TOOL}}
