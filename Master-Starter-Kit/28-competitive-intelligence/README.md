# Phase 28: Ongoing Competitive Intelligence

> The Tribunal (Step 3) does brilliant one-time competitive research. But competitor audits have a half-life of about 3 months. This section turns competitive analysis from a point-in-time snapshot into a continuous discipline that keeps your strategy current.

---

## Why This Exists

The initial competitor audit becomes stale. Competitors ship features, change pricing, enter new markets, get acquired, pivot their positioning, and hire teams that signal strategic direction changes. Without ongoing monitoring, you make decisions based on outdated intelligence. You price against numbers that changed two months ago. You position against messaging that was rewritten last quarter. You ignore a new entrant that has already captured 10% of your target market.

The Tribunal (Step 3) gives you an excellent starting point: competitor profiles, feature comparisons, positioning analysis. But that output is a snapshot. Snapshots decay. Within 90 days, at least one competitor will have shipped something significant. Within 6 months, the competitive landscape may look materially different.

This section solves the decay problem by providing:

1. **Monitoring cadence** — what to check daily, weekly, monthly, quarterly, and annually, with exact time budgets so monitoring does not become a full-time job
2. **Tracking systems** — structured templates for feature parity, win/loss analysis, and battle cards that accumulate intelligence over time instead of losing it
3. **Alert infrastructure** — automated monitoring that surfaces competitor moves without manual effort
4. **Decision frameworks** — what to actually DO when a competitor makes a move, so you respond strategically instead of reactively
5. **Reassessment protocol** — a quarterly discipline that forces you to update your competitive understanding on a schedule

The goal is not to obsess over competitors. The goal is to maintain situational awareness with minimal time investment, so your strategic decisions are based on current reality rather than stale assumptions.

---

## How It Integrates with the Orchestrator

This section connects to **Orchestrator Step 28.5** (Ongoing Competitive Intelligence). It runs after:

- **Step 3** (Tribunal) — the initial competitor research, feature gap analysis, and positioning audit from `01-tribunal/competitors/`
- **Step 19** (Marketing System) — market research, competitor marketing analysis, and positioning documents from `19-marketing/market-research/`
- **Step 20** (Post-Launch) — user feedback, churn data, and product metrics from `20-post-launch/`

It feeds into:

- **Step 3** (Tribunal — re-runs) — quarterly reassessments may trigger a full tribunal re-run for new competitors
- **Step 4** (Phase Planning) — feature gap prioritization informs roadmap decisions via `04-phase-planning/`
- **Step 19** (Marketing) — updated positioning and battle cards inform marketing asset refresh via `19-marketing/`
- **Step 25** (Financial Modeling) — competitive pricing intelligence informs pricing model adjustments via `25-financial-modeling/`

### Data Flow

```
01-tribunal (initial competitor audit, feature gaps)
        |
        v
19-marketing/market-research (competitor marketing analysis)
        |
        v
28-competitive-intelligence <-- 20-post-launch (user feedback, churn data)
        |
        |---> 04-phase-planning (feature gap prioritization)
        |---> 19-marketing (positioning refresh, battle cards)
        |---> 25-financial-modeling (pricing intelligence)
        '---> 01-tribunal (triggers full re-audit for new competitors)
```

### Key Dependencies

| Dependency | Source | What It Provides |
|------------|--------|------------------|
| Competitor profiles | `01-tribunal/competitors/` | Initial competitor list, positioning, feature comparison |
| Feature gap matrix | `01-tribunal/feature-research/` | Starting feature parity data |
| Market research | `19-marketing/market-research/` | Competitor marketing tactics, channel analysis |
| User personas | `01-tribunal/personas/` | Who you are competing for |
| Win/loss data | Sales/support team | Real reasons deals are won or lost |
| Product metrics | `20-post-launch/` | Churn data, NPS, user feedback mentioning competitors |

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Section overview, integration map, reading order | 28.5 |
| `competitive-monitoring-cadence.md` | Guide | What to monitor at each frequency, time budgets, tool setup | 28.5 |
| `feature-parity-tracking.template.md` | Template | Living feature comparison matrix with gap prioritization | 28.5 |
| `market-movement-alerts.template.md` | Template | Alert configuration, signal interpretation, triage protocol | 28.5 |
| `quarterly-reassessment-protocol.md` | Guide | 10-step quarterly review process with output template | 28.5 |
| `competitor-teardown.template.md` | Template | Deep-dive analysis framework for a single competitor | 28.5 |
| `win-loss-analysis.template.md` | Template | Win/loss tracking, interview template, pattern analysis | 28.5 |
| `competitive-battle-cards.template.md` | Template | Per-competitor sales enablement cards with objection handling | 28.5 |
| `competitive-intelligence-decision-tree.md` | Guide | "A competitor did X — what do I do?" decision framework | 28.5 |
| `competitive-gotchas.md` | Guide | Production lessons and anti-patterns for competitive analysis | 28.5 |

---

## Reading Order

1. **README.md** — you are here; understand the section structure and integration points
2. **competitive-monitoring-cadence.md** — set up your monitoring rhythm and tools before anything else
3. **market-movement-alerts.template.md** — configure automated alerts so you catch competitor moves passively
4. **feature-parity-tracking.template.md** — build your living feature comparison matrix
5. **competitor-teardown.template.md** — do a deep-dive on your top 1-2 competitors
6. **competitive-battle-cards.template.md** — create sales-ready battle cards from your teardown data
7. **win-loss-analysis.template.md** — set up win/loss tracking for ongoing data collection
8. **quarterly-reassessment-protocol.md** — schedule your first quarterly review
9. **competitive-intelligence-decision-tree.md** — reference when a competitor makes a move
10. **competitive-gotchas.md** — read to avoid the most common competitive intelligence mistakes

---

## Quick Start

If you are short on time, do these three things:

1. **Set up Google Alerts** for your top 3 competitors using the configuration in `market-movement-alerts.template.md` (10 minutes)
2. **Fill in the feature parity matrix** from `feature-parity-tracking.template.md` using your Tribunal data as the starting point (30 minutes)
3. **Schedule a quarterly calendar reminder** to run the `quarterly-reassessment-protocol.md` (2 minutes)

Everything else can be adopted incrementally. The quarterly review will naturally prompt you to fill in battle cards, set up additional alerts, and start win/loss tracking as your competitive awareness matures.

---

## Time Budget

Competitive intelligence should not become a full-time job. Here are the recommended time investments:

| Activity | Frequency | Time per Occurrence | Monthly Total |
|----------|-----------|-------------------|---------------|
| Automated alert review | Daily | 5 minutes | ~2 hours |
| Manual competitor scan | Weekly | 30 minutes | ~2 hours |
| Structured monthly review | Monthly | 2 hours | 2 hours |
| Quarterly reassessment | Quarterly | 4 hours | ~1.3 hours (amortized) |
| Annual landscape refresh | Annually | 8 hours | ~0.7 hours (amortized) |
| **Total** | | | **~8 hours/month** |

If you are spending more than 10 hours per month on competitive intelligence outside of quarterly reviews, you are over-investing. Redirect that time to building your product and talking to your users.

---

## Anti-Patterns This Section Prevents

| Anti-Pattern | Symptom | File That Fixes It |
|-------------|---------|-------------------|
| Stale competitor data | Decisions based on 6-month-old intelligence | `competitive-monitoring-cadence.md` |
| Reactive panic | Dropping everything when a competitor ships a feature | `competitive-intelligence-decision-tree.md` |
| No feature comparison | Cannot articulate why you are better than competitors | `feature-parity-tracking.template.md` |
| Sales team unprepared | Reps cannot handle competitive objections | `competitive-battle-cards.template.md` |
| Unknown loss reasons | No idea why deals are lost to competitors | `win-loss-analysis.template.md` |
| Missed market entrants | New competitor captures share before you notice | `market-movement-alerts.template.md` |
| Competitor obsession | Spending more time watching competitors than building | `competitive-gotchas.md` |
| Shallow competitor knowledge | Know competitor names but not their actual product quality | `competitor-teardown.template.md` |

---

## Key Placeholders Used

This section uses the following placeholders (see `PLACEHOLDER-REGISTRY.md` for the full list):

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{PROJECT_NAME}}` | Your product name | `FleetManager Pro` |
| `{{COMPETITOR_1}}` | Primary competitor name | `Competitor X` |
| `{{COMPETITOR_2}}` | Secondary competitor name | `Competitor Y` |
| `{{COMPETITOR_3}}` | Tertiary competitor name | `Competitor Z` |
| `{{COMPETITOR_NAME}}` | Generic competitor name (for per-competitor templates) | `Competitor X` |
| `{{COMPETITOR_1_URL}}` | Primary competitor website URL | `https://competitorx.com` |
| `{{PRODUCT_CATEGORY}}` | G2/Capterra product category | `Fleet Management Software` |
| `{{DATE}}` | Current date for tracking | `2026-02-20` |
| `{{ANALYST}}` | Person conducting the analysis | `Jane Smith` |
