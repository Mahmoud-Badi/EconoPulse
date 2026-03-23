# Growth Experiment Backlog

> An ICE-scored backlog of 20+ growth experiments across activation, conversion, expansion, and referral — with hypothesis format, experiment lifecycle, results template, learning repository, and velocity tracking.

---

## 1. Hypothesis Format

Every experiment starts with a structured hypothesis. No experiment runs without one.

### Hypothesis Template

```
HYPOTHESIS:
  We believe that [specific change]
  will cause [specific metric] to [increase/decrease] by [estimated %]
  for [target audience]
  because [rationale based on data/observation].

FALSIFICATION CRITERIA:
  This hypothesis is wrong if [metric] does not move by at least [MDE%]
  within [duration] with [sample size] per variant at 95% confidence.
```

### Hypothesis Quality Checklist

- [ ] Change is specific and actionable (not "improve onboarding")
- [ ] Metric is measurable and already instrumented
- [ ] Direction and magnitude are predicted (not "will change")
- [ ] Audience is defined (all users, new users, free users, etc.)
- [ ] Rationale is based on data, not gut feeling
- [ ] Falsification criteria prevent indefinite running

### Example Hypotheses

**Good:**
> We believe that replacing the blank project screen with a pre-populated template
> will cause D7 activation rate to increase by 15%
> for new signups who have not created a project within 24 hours
> because our funnel data shows 60% of new users drop off at the blank project screen,
> and session recordings show confusion about what to do first.

**Bad:**
> Improving onboarding will increase activation.
> (No specific change, no metric magnitude, no audience, no rationale.)

---

## 2. ICE Scoring

ICE (Impact, Confidence, Ease) provides a fast, consistent way to prioritize experiments without lengthy debate.

### Scoring Guide

**Impact (1-10):** How much will this move the target metric if it works?

| Score | Meaning | Example |
|-------|---------|---------|
| 1-2 | Negligible: < 2% lift | Change button color |
| 3-4 | Small: 2-5% lift | Update copy on pricing page |
| 5-6 | Moderate: 5-10% lift | Add social proof to signup |
| 7-8 | Large: 10-25% lift | Replace blank state with template |
| 9-10 | Massive: > 25% lift | Remove entire onboarding step |

**Confidence (1-10):** How confident are we that the hypothesis is correct?

| Score | Meaning | Basis |
|-------|---------|-------|
| 1-2 | Wild guess | No data, no precedent |
| 3-4 | Informed guess | Qualitative data (user interviews) |
| 5-6 | Moderate | Quantitative data supports hypothesis |
| 7-8 | High | Strong data + similar experiment succeeded elsewhere |
| 9-10 | Very high | Previous test in similar context showed clear result |

**Ease (1-10):** How easy is this to implement and run?

| Score | Meaning | Effort |
|-------|---------|--------|
| 1-2 | Very hard | Multiple sprints, cross-team dependency |
| 3-4 | Hard | 1-2 week sprint, engineering + design |
| 5-6 | Moderate | 2-5 days, single engineer |
| 7-8 | Easy | 1-2 days, mostly config or copy |
| 9-10 | Trivial | < 1 day, feature flag toggle |

**ICE Score = (Impact + Confidence + Ease) / 3**

---

## 3. Backlog Table

### Activation Experiments

| ID | Experiment | Hypothesis | I | C | E | ICE | Status |
|----|-----------|-----------|---|---|---|-----|--------|
| GE-001 | Remove company name from signup form | Reducing fields from 4 to 3 increases signup completion by 8% | 6 | 8 | 9 | 7.7 | Backlog |
| GE-002 | Add Google SSO to signup | Social login reduces signup friction, increasing completion by 15% | 7 | 9 | 7 | 7.7 | Backlog |
| GE-003 | Replace blank state with sample project | Pre-populated content reduces TTV by 40%, increasing D7 activation by 15% | 8 | 8 | 6 | 7.3 | Backlog |
| GE-004 | Add onboarding checklist (3 actions) | Clear goals increase activation from 30% to 40% within 7 days | 8 | 8 | 7 | 7.7 | Backlog |
| GE-005 | Skip email verification (defer to day 3) | Removing email gate increases D1 activation by 20% | 7 | 7 | 8 | 7.3 | Backlog |
| GE-006 | Personalized onboarding by use case | Asking "What's your goal?" and customizing flow increases activation by 12% | 7 | 6 | 5 | 6.0 | Backlog |
| GE-007 | Interactive product tour (3 steps) | Guided tour increases feature discovery, improving activation by 10% | 6 | 7 | 5 | 6.0 | Backlog |

### Conversion Experiments

| ID | Experiment | Hypothesis | I | C | E | ICE | Status |
|----|-----------|-----------|---|---|---|-----|--------|
| GE-008 | Default pricing toggle to annual | Pre-selecting annual increases annual plan selection from 40% to 55% | 7 | 9 | 10 | 8.7 | Backlog |
| GE-009 | Add "Most Popular" badge to Pro plan | Social proof anchoring increases Pro selection by 12% | 5 | 8 | 9 | 7.3 | Backlog |
| GE-010 | Show "X teams upgraded today" on pricing page | Real-time social proof increases checkout start rate by 8% | 5 | 7 | 8 | 6.7 | Backlog |
| GE-011 | Reduce checkout to 2 steps (plan + payment) | Fewer steps reduce checkout abandonment from 35% to 20% | 8 | 7 | 5 | 6.7 | Backlog |
| GE-012 | Add Apple Pay / Google Pay | 1-click payment increases mobile checkout completion by 25% | 7 | 8 | 6 | 7.0 | Backlog |
| GE-013 | Show "what you unlock" summary in checkout | Value reinforcement during payment reduces abandonment by 10% | 6 | 7 | 8 | 7.0 | Backlog |

### Expansion Experiments

| ID | Experiment | Hypothesis | I | C | E | ICE | Status |
|----|-----------|-----------|---|---|---|-----|--------|
| GE-014 | Show usage meter in sidebar (always visible) | Persistent usage awareness increases limit-triggered upgrades by 15% | 6 | 7 | 8 | 7.0 | Backlog |
| GE-015 | Send "team is growing" email at 3+ invites | Proactive suggestion increases team plan upgrades by 10% | 5 | 6 | 8 | 6.3 | Backlog |
| GE-016 | Soft-gate advanced analytics (preview mode) | Showing blurred preview increases feature-gate upgrades by 20% | 7 | 7 | 6 | 6.7 | Backlog |
| GE-017 | Offer monthly→annual switch at month 3 | Engaged monthly users convert to annual at 15% rate when prompted | 7 | 8 | 7 | 7.3 | Backlog |
| GE-018 | Proactive CSM outreach for accounts at 80% usage | Human touch at limit-approaching moment increases upgrade rate by 25% | 8 | 7 | 4 | 6.3 | Backlog |

### Referral & Viral Experiments

| ID | Experiment | Hypothesis | I | C | E | ICE | Status |
|----|-----------|-----------|---|---|---|-----|--------|
| GE-019 | Add "Invite team" step to onboarding | Integrated invite step increases invites per user from 0.5 to 2.0 | 8 | 7 | 7 | 7.3 | Backlog |
| GE-020 | Double-sided referral reward (1 month free each) | Incentivized referrals increase K-factor from 0.1 to 0.25 | 7 | 7 | 6 | 6.7 | Backlog |
| GE-021 | "Powered by {{PROJECT_NAME}}" on free tier outputs | Branding on shared artifacts drives 5% of new signups | 6 | 5 | 8 | 6.3 | Backlog |
| GE-022 | Pre-populate invite list from Google Contacts | Reducing invite friction increases invites sent per session by 3x | 7 | 6 | 5 | 6.0 | Backlog |
| GE-023 | Post-success invite prompt ("Share your work") | Timing invite after value moment increases invite acceptance rate by 30% | 7 | 7 | 7 | 7.0 | Backlog |

### Retention Experiments

| ID | Experiment | Hypothesis | I | C | E | ICE | Status |
|----|-----------|-----------|---|---|---|-----|--------|
| GE-024 | D3 email: "Feature you haven't tried" | Feature discovery email re-engages 15% of inactive D3 users | 5 | 7 | 8 | 6.7 | Backlog |
| GE-025 | Weekly digest email with usage stats | Engagement summary drives 20% more return visits | 5 | 6 | 7 | 6.0 | Backlog |
| GE-026 | Offer cancellation pause (3 months) instead of cancel | Pause option saves 30% of cancellation attempts | 7 | 8 | 6 | 7.0 | Backlog |

---

## 4. Experiment Lifecycle

### Lifecycle Stages

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  IDEATE  │──▶│  DESIGN  │──▶│   RUN    │──▶│ ANALYZE  │──▶│ DECIDE   │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
  Backlog        Ready          Running        Complete        Shipped/
                                                              Killed

IDEATE (Backlog):
  - Hypothesis written
  - ICE scored
  - Prioritized in backlog

DESIGN (Ready):
  - Experiment spec completed (variants, metrics, sample size)
  - Feature flag created
  - Analytics events instrumented
  - QA verified

RUN (Running):
  - Feature flag activated
  - Traffic split active
  - No peeking until minimum sample reached
  - Monitor for technical issues only

ANALYZE (Complete):
  - Minimum sample size reached
  - Statistical significance calculated
  - Results documented
  - Segments analyzed

DECIDE (Shipped or Killed):
  - Decision made: Ship variant / Kill variant / Iterate
  - Learning documented in repository
  - Feature flag cleaned up
  - Metrics monitored post-ship for 2 weeks
```

### Experiment Board

```
BACKLOG (sorted by ICE)    READY (designed, not started)    RUNNING    COMPLETE
─────────────────────────  ───────────────────────────────  ─────────  ────────
GE-008 (8.7)               GE-___                           GE-___    GE-___
GE-001 (7.7)               GE-___                           GE-___    GE-___
GE-002 (7.7)                                                          GE-___
GE-004 (7.7)
GE-003 (7.3)
GE-005 (7.3)
GE-009 (7.3)
GE-017 (7.3)
GE-019 (7.3)
...
```

---

## 5. Results Template

### Experiment Results Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPERIMENT RESULTS: GE-____
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:       ________________________________________
Duration:   ____-____-____ to ____-____-____
Status:     WINNER / NO WINNER / INCONCLUSIVE

HYPOTHESIS:
  We believed that [change]
  would cause [metric] to [direction] by [%]
  for [audience]
  because [rationale].

RESULT:   CONFIRMED / REJECTED / INCONCLUSIVE

METRICS:
  ┌───────────────────┬──────────┬──────────┬────────┬──────────┐
  │ Metric            │ Control  │ Variant  │ Lift   │ p-value  │
  ├───────────────────┼──────────┼──────────┼────────┼──────────┤
  │ Primary:          │          │          │        │          │
  │ {{metric_name}}   │ ____%    │ ____%    │ +___% │ 0.____   │
  ├───────────────────┼──────────┼──────────┼────────┼──────────┤
  │ Secondary:        │          │          │        │          │
  │ {{metric_name}}   │ ____%    │ ____%    │ +___% │ 0.____   │
  ├───────────────────┼──────────┼──────────┼────────┼──────────┤
  │ Guard rail:       │          │          │        │          │
  │ {{metric_name}}   │ ____%    │ ____%    │ +___% │ 0.____   │
  └───────────────────┴──────────┴──────────┴────────┴──────────┘

SAMPLE:
  Control:  ____ users
  Variant:  ____ users
  Total:    ____ users
  Confidence: ____% (target: 95%)

SEGMENT ANALYSIS:
  │ Segment         │ Control  │ Variant  │ Lift   │
  │ New users       │ ____%    │ ____%    │ +____% │
  │ Returning users │ ____%    │ ____%    │ +____% │
  │ Free plan       │ ____%    │ ____%    │ +____% │
  │ Paid plan       │ ____%    │ ____%    │ +____% │
  │ Desktop         │ ____%    │ ____%    │ +____% │
  │ Mobile          │ ____%    │ ____%    │ +____% │

DECISION:  SHIP / ITERATE / KILL
Rationale: ________________________________________

POST-SHIP MONITORING:
  Week 1 after ship: metric = ____% (stable / regressed / improved)
  Week 2 after ship: metric = ____% (stable / regressed / improved)

LEARNING:
  ________________________________________
  ________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 6. Learning Repository

### Learning Categories

| Category | Key Question | Example Learning |
|----------|-------------|-----------------|
| Activation | What drives users to first value? | "Sample data increases activation 2x vs blank state" |
| Onboarding | What friction slows users down? | "Email verification at signup loses 22% of users" |
| Conversion | What triggers upgrade decisions? | "Users who hit feature gates 3+ times convert at 25%" |
| Pricing | How do users evaluate pricing? | "Annual default increases annual selection by 37%" |
| Expansion | What signals account growth? | "Team growth is 3x more predictive than usage growth" |
| Referral | What motivates sharing? | "Post-success prompts generate 4x more invites than sidebar links" |
| Retention | What prevents churn? | "Pause option saves 35% of cancellations" |

### Learning Log

| Date | Experiment | Category | Learning | Confidence | Reusable? |
|------|-----------|----------|---------|------------|-----------|
| ____-__-__ | GE-___ | ________ | ________________________________________ | High/Med/Low | Yes/No |
| ____-__-__ | GE-___ | ________ | ________________________________________ | High/Med/Low | Yes/No |
| ____-__-__ | GE-___ | ________ | ________________________________________ | High/Med/Low | Yes/No |
| ____-__-__ | GE-___ | ________ | ________________________________________ | High/Med/Low | Yes/No |
| ____-__-__ | GE-___ | ________ | ________________________________________ | High/Med/Low | Yes/No |

### Top Learnings (Updated Monthly)

```
Month: ________

Top 3 Learnings:
  1. ________________________________________
     Source: GE-___ (____% confidence)
     Applied to: ________________________________________

  2. ________________________________________
     Source: GE-___ (____% confidence)
     Applied to: ________________________________________

  3. ________________________________________
     Source: GE-___ (____% confidence)
     Applied to: ________________________________________

Invalidated Assumptions:
  1. We assumed _________________________ but learned _________________________
  2. We assumed _________________________ but learned _________________________
```

---

## 7. Velocity Tracking

### Monthly Velocity Dashboard

```
Experiment Velocity Report — Month: ________

Target Velocity:         {{EXPERIMENT_VELOCITY}} experiments/month
Actual Velocity:         ____ experiments/month
Velocity Gap:            ____ experiments

PIPELINE:
  Backlog:               ____ experiments
  Ready (designed):      ____ experiments
  Running:               ____ experiments
  Completed this month:  ____ experiments

OUTCOMES:
  Winners (shipped):     ____ (____% win rate)
  Losers (killed):       ____
  Inconclusive:          ____
  Average lift (winners): ____%

BOTTLENECK ANALYSIS:
  Avg time in Backlog:   ____ days
  Avg time in Design:    ____ days
  Avg time Running:      ____ days
  Avg time in Analysis:  ____ days
  Total cycle time:      ____ days

VELOCITY TREND:
  Month -3:  ____ experiments
  Month -2:  ____ experiments
  Month -1:  ____ experiments
  This month: ____ experiments
  Trend:     Accelerating / Stable / Decelerating
```

### Velocity Improvement Actions

| Bottleneck | Symptom | Fix | Owner |
|-----------|---------|-----|-------|
| Ideation | Backlog < 2x velocity | Run monthly ideation session with cross-functional team | PM |
| Design | Experiments sit in Ready > 5 days | Create experiment spec templates | Designer |
| Engineering | Experiments take > 1 week to build | Build reusable experiment components | Eng |
| Traffic | Experiments run > 3 weeks for significance | Run multiple non-competing experiments in parallel | PM |
| Analysis | Results sit unanalyzed > 3 days | Automate significance calculation and alerts | Data |
| Decision | Completed experiments not decided within 1 week | Weekly experiment review meeting | PM |

### Quarterly Velocity Goals

```
Q__ Goals:
  Velocity target:          {{EXPERIMENT_VELOCITY}} experiments/month
  Win rate target:          > 30%
  Cumulative activation lift: +____% (from ____% to ____%)
  Cumulative conversion lift: +____% (from ____% to ____%)
  Learning repository entries: ____+

Q__ Actuals:
  Velocity achieved:        ____ experiments/month
  Win rate:                 ____%
  Cumulative activation lift: +____%
  Cumulative conversion lift: +____%
  Learning repository entries: ____
```

---

## Checklist

- [ ] Established hypothesis format and quality checklist
- [ ] ICE-scored all experiments in the backlog
- [ ] Populated backlog with 20+ experiments across all categories
- [ ] Defined experiment lifecycle stages (Ideate → Design → Run → Analyze → Decide)
- [ ] Created experiment results template
- [ ] Set up learning repository with categories
- [ ] Set velocity target: {{EXPERIMENT_VELOCITY}} experiments/month
- [ ] Created monthly velocity dashboard
- [ ] Identified and addressed velocity bottlenecks
- [ ] Scheduled weekly experiment review meeting
- [ ] Ensured all experiments have instrumented metrics before running
- [ ] Built backlog pipeline with 3x ideas relative to velocity target
