# Phase 44: Product-Led Growth

> Product-led growth is not a marketing strategy — it is a product architecture decision. When your product is the primary driver of acquisition, activation, and expansion, every feature choice is a growth choice. This section designs the mechanics that make that work.

---

## Why This Exists

Section 19 builds your marketing engine — content, email, social, launch campaigns. Section 27 designs onboarding and retention flows that activate users once they arrive. Neither addresses the structural question of what happens when your product itself becomes the primary acquisition channel. A well-marketed product with poor viral mechanics is a product that pays for every user forever. A product with strong growth loops can acquire users at near-zero marginal cost — but only if those loops are designed into the product architecture from the start, not bolted on after launch.

Product-led growth sits at the intersection of product design, pricing strategy, analytics instrumentation, and sales enablement. It requires a different way of thinking about features: every feature is either a growth lever or a growth blocker. A sharing button that nobody clicks is dead weight. A collaboration feature that forces invitations is a viral loop. A usage limit that triggers an upgrade prompt is a monetization trigger. This section provides the frameworks, templates, and experiment infrastructure to identify which levers exist in your product, design the mechanics around them, and measure whether they work.

The gap this section fills is specific and measurable. Without it, teams build freemium tiers with arbitrary limits, add referral programs as afterthoughts, instrument analytics events with no naming convention, and run experiments with no statistical rigor. They measure vanity metrics (signups) instead of actionable ones (activation rate, PQL conversion, viral coefficient). They over-gate features so free users never see value, or under-gate so there is no incentive to upgrade. This section replaces guesswork with frameworks — PQL scoring models, growth loop design patterns, experiment backlogs with ICE scoring, freemium conversion funnels with diagnostic frameworks, and viral coefficient models with clear optimization levers.

---

## How It Integrates with the Orchestrator

This section is triggered by **Step 27.5** in the Orchestrator, after Onboarding & Retention (Step 27) and before Marketing Dashboard (Step 28). Product-led growth must follow onboarding because PLG mechanics depend on a well-designed activation flow — you cannot optimize Time-to-Value if the onboarding path is undefined. It must precede the marketing dashboard because PLG introduces growth metrics (viral coefficient, PQL conversion rate, expansion revenue) that the marketing dashboard needs to display.

**Skip condition:** `CONFIG.GROWTH_MODEL != "product-led"` — If the project uses a purely sales-led growth model with no self-serve component, this section can be skipped. However, most modern SaaS products benefit from at least a hybrid PLG+sales approach, so consider running the readiness decision tree before skipping.

**Relationship with Section 19 (Marketing) and Section 27 (Onboarding & Retention):** Marketing drives awareness and initial traffic. Onboarding converts that traffic into activated users. PLG turns those activated users into acquisition channels themselves — through viral loops, referrals, and organic sharing. Section 19 defines the paid and organic acquisition channels. Section 27 defines the activation path. Section 44 defines the mechanics that make activated users bring in new users without additional marketing spend. The three sections form a complete growth system: acquire (19) → activate (27) → multiply (44).

**Relationship with Section 25 (Financial Modeling):** PLG fundamentally changes unit economics. When your product drives acquisition, CAC drops — but you need to model free-tier costs, conversion rates, and expansion revenue to understand the true economics. Section 25 provides the financial modeling framework. Section 44 provides the PLG-specific inputs — viral coefficient (which affects CAC), freemium conversion rate (which determines revenue per signup), and expansion revenue triggers (which affect LTV). The financial model in Section 25 should incorporate the PLG metrics defined here.

**Relationship with Section 11 (Analytics):** PLG is data-driven by definition. You cannot optimize what you do not measure. Section 11 provides general analytics and feature flag infrastructure. Section 44 defines the specific event taxonomy, funnel definitions, cohort analysis setup, and PQL scoring signals that PLG requires. The analytics instrumentation template in this section extends Section 11 with PLG-specific events and metrics.

**Relationship with Section 35 (Business Intelligence):** PLG generates growth data that feeds into executive dashboards. Viral coefficient trends, PQL pipeline health, experiment velocity, and expansion revenue breakdowns all belong in the BI layer defined by Section 35. Section 44 defines the metrics; Section 35 builds the dashboards that display them.

**Relationship with Section 30 (Billing & Payments):** Self-serve upgrade flows in this section connect directly to the billing architecture in Section 30. Upgrade modals trigger payment flows. Usage-based expansion triggers meter consumption against plan limits. Downgrade and cancellation flows integrate with dunning and retention. Section 30 handles the payment infrastructure; Section 44 handles the product experience that drives users toward (and through) that infrastructure.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Overview and reading order for product-led growth | 27.5 |
| `plg-readiness-decision-tree.md` | Guide | 5-node decision tree for PLG strategy calibration | 27.5 |
| `growth-loops.template.md` | Template | In-product viral, content, and usage loop design | 27.5 |
| `activation-experiments.template.md` | Template | Activation experiment framework with ICE scoring | 27.5 |
| `pql-scoring.template.md` | Template | Product-Qualified Lead scoring model and sales handoff | 27.5 |
| `self-serve-upgrade.template.md` | Template | Self-serve upgrade and downgrade flow design | 27.5 |
| `usage-expansion-triggers.template.md` | Template | Usage-based expansion signal taxonomy and trigger rules | 27.5 |
| `viral-coefficient-model.template.md` | Template | K-factor modeling, viral cycle time, referral design | 27.5 |
| `freemium-conversion-funnel.template.md` | Template | Free-to-paid funnel stages, paywall strategy, diagnostics | 27.5 |
| `in-app-upsell-patterns.template.md` | Template | Contextual upsell/cross-sell patterns and timing rules | 27.5 |
| `product-analytics-instrumentation.template.md` | Template | Event taxonomy, funnel definitions, analytics configuration | 27.5 |
| `growth-experiment-backlog.template.md` | Template | ICE-scored experiment backlog with 20+ starter ideas | 27.5 |
| `plg-gotchas.md` | Guide | Production lessons for product-led growth (18 gotchas) | 27.5 |

---

## Reading Order

1. **`plg-readiness-decision-tree.md`** — Start here. Walk through five decision nodes to determine whether PLG is right for your product, which growth motion to pursue, how to monetize, how to qualify leads, and where self-serve ends and sales begins.
2. **`growth-loops.template.md`** — Design the growth loops that will drive your product's organic acquisition. Identify 2-3 loops, map the mechanics, and instrument them for measurement.
3. **`product-analytics-instrumentation.template.md`** — Before you can optimize growth, you need clean data. Define your event taxonomy, funnel stages, and cohort analysis setup.
4. **`activation-experiments.template.md`** — Define your activation metric and Time-to-Value target, then build an experiment framework to optimize the path from signup to value.
5. **`pql-scoring.template.md`** — Build the scoring model that identifies which free users are ready for a sales conversation or self-serve upgrade prompt.
6. **`freemium-conversion-funnel.template.md`** — Map the complete free-to-paid funnel. Define paywall placement strategy and the feature gating matrix.
7. **`self-serve-upgrade.template.md`** — Design the self-serve upgrade experience — pricing pages, checkout flows, plan comparison, and downgrade retention.
8. **`usage-expansion-triggers.template.md`** — Define the usage signals that trigger expansion opportunities — limit approaching, team growth, feature discovery.
9. **`in-app-upsell-patterns.template.md`** — Design the contextual upsell UI patterns, timing rules, and frequency caps.
10. **`viral-coefficient-model.template.md`** — Model your viral coefficient and design the invite and referral mechanics.
11. **`growth-experiment-backlog.template.md`** — Populate the experiment backlog with 20+ prioritized experiments across activation, conversion, expansion, and referral.
12. **`plg-gotchas.md`** — Read last. These production lessons will resonate more after you understand the full PLG framework.

---

## Quick Start Checklist

- [ ] Complete the PLG readiness decision tree to determine growth motion and monetization model
- [ ] Verify Section 27 onboarding flows are defined (PLG builds on top of activation paths)
- [ ] Verify Section 30 billing architecture is defined (upgrade flows need payment infrastructure)
- [ ] Identify 2-3 growth loops that fit your product
- [ ] Define your activation metric and Time-to-Value target
- [ ] Set up the analytics event taxonomy before building growth features
- [ ] Build PQL scoring model and define the sales handoff threshold
- [ ] Design the freemium feature gating matrix (what is free vs. paid)
- [ ] Implement self-serve upgrade flow with pricing page and checkout
- [ ] Populate the experiment backlog with at least 20 experiments
- [ ] Set experiment velocity target (experiments per month)
- [ ] Review all 18 gotchas before launching PLG features

---

## Key Principles

**Growth loops over funnels.** Funnels are linear — users enter at the top and exit at the bottom. Loops are circular — the output of one cycle feeds the input of the next. Design your growth as loops (use → value → share → acquire → use) rather than funnels (acquire → activate → convert → retain). Loops compound; funnels deplete.

**Time-to-Value is the master metric.** The single most important number in PLG is how quickly a new user experiences the core value of your product. Every decision — onboarding steps, feature gating, setup requirements — should be evaluated through the lens of "does this increase or decrease Time-to-Value?"

**Product-Qualified over Marketing-Qualified.** PQLs convert at 5-10x the rate of MQLs because they are based on demonstrated product usage, not marketing engagement. Build your lead qualification around what users do in the product, not what content they download.

**Instrument before you optimize.** You cannot improve what you do not measure. Set up clean analytics with consistent event naming, proper deduplication, and bot filtering before running a single growth experiment. Bad data leads to bad decisions that compound over time.

**Experiment velocity over experiment quality.** In early-stage PLG, running more experiments matters more than running perfect experiments. A team running 8 experiments per month with 60% statistical rigor will learn faster than a team running 2 experiments per month with 99% rigor. Increase rigor as you scale.

**Self-serve is not the absence of sales.** PLG does not mean removing humans from the sales process. It means letting the product do the work of qualification and activation, and inserting humans at the moments where they add the most value — typically at expansion and enterprise thresholds.

---

## Placeholder Variables Used in This Section

| Placeholder | Description | Example Values |
|---|---|---|
| `{{GROWTH_MODEL}}` | Primary growth model | `product-led`, `sales-led`, `hybrid` |
| `{{PLG_MOTION}}` | PLG growth motion | `viral`, `usage-based`, `content-led`, `community-led` |
| `{{ACTIVATION_METRIC}}` | Definition of an activated user | `created-first-project`, `invited-teammate` |
| `{{TIME_TO_VALUE_TARGET}}` | Target time from signup to first value | `5-minutes`, `1-hour`, `1-day` |
| `{{PQL_THRESHOLD}}` | PQL score threshold for sales handoff | `70`, `80` |
| `{{PQL_SIGNALS}}` | Key PQL scoring signals | `feature-usage, team-size, engagement-frequency` |
| `{{SELF_SERVE_CEILING}}` | Maximum self-serve plan tier | `pro`, `business`, `all` |
| `{{FREE_TIER_LIMITS}}` | Free tier resource limits | `3-projects, 1-user, 100mb` |
| `{{VIRAL_COEFFICIENT_TARGET}}` | Target K-factor | `0.5`, `1.0`, `1.5` |
| `{{EXPERIMENT_VELOCITY}}` | Target experiments per month | `2`, `4`, `8` |
| `{{ANALYTICS_TOOL}}` | Primary analytics platform | `amplitude`, `mixpanel`, `posthog` |
| `{{PAYWALL_STRATEGY}}` | Paywall approach | `feature-based`, `usage-based`, `time-based` |
| `{{UPGRADE_CONVERSION_TARGET}}` | Target free-to-paid conversion rate | `3`, `5`, `10` |
