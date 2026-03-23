# PLG Readiness Decision Tree

> Five decision nodes that calibrate your product-led growth strategy — from whether PLG is right for your product, through growth motion selection, monetization trigger design, lead qualification priority, and self-serve ceiling definition.

---

## How to Use This Decision Tree

Walk through each node sequentially. Each node presents 2-4 options with Pros/Cons tables and a recommendation heuristic. Record your decision at each node — the combination of all five decisions defines your PLG configuration. If you reach a node where none of the options fit, revisit your assumptions from the previous node.

**Prerequisites:** Before starting, you should have completed:
- Section 6 (competitive landscape — you need to know how competitors acquire users)
- Section 25 (financial modeling — you need to know your target ACV and unit economics)
- Section 27 (onboarding — you need a defined activation path)

---

## ASCII Flowchart

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PLG READINESS DECISION TREE                       │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────┐
  │  NODE 1              │
  │  Is PLG Right?       │
  └──────┬───────────────┘
         │
    ┌────┴─────┬──────────────┐
    ▼          ▼              ▼
 [Yes:       [Hybrid:       [No:
  Self-Serve  PLG+Sales]     Enterprise
  Low ACV]                   Only]
    │          │              │
    ▼          ▼              ▼
  ┌──────────────────────┐  STOP ──▶ Use Section 19
  │  NODE 2              │           (Marketing) only
  │  Primary Growth      │
  │  Motion              │
  └──────┬───────────────┘
         │
    ┌────┴─────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼
 [Viral]   [Usage-    [Content-  [Community-
            Based]     Led]       Led]
    │          │          │          │
    └────┬─────┴──────────┴──────────┘
         ▼
  ┌──────────────────────┐
  │  NODE 3              │
  │  Monetization        │
  │  Trigger             │
  └──────┬───────────────┘
         │
    ┌────┴─────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼
 [Feature- [Usage-    [Time-     [Seat-
  Based]    Based]     Based      Based]
                       Trial]
    │          │          │          │
    └────┬─────┴──────────┴──────────┘
         ▼
  ┌──────────────────────┐
  │  NODE 4              │
  │  PQL vs MQL          │
  │  Priority            │
  └──────┬───────────────┘
         │
    ┌────┴─────┬──────────┐
    ▼          ▼          ▼
 [PQL-      [MQL-      [Balanced]
  Primary]   Primary]
    │          │          │
    └────┬─────┴──────────┘
         ▼
  ┌──────────────────────┐
  │  NODE 5              │
  │  Self-Serve          │
  │  Ceiling             │
  └──────┬───────────────┘
         │
    ┌────┴─────┬──────────┐
    ▼          ▼          ▼
 [Full       [Sales-    [PLG
  Self-       Assisted   Activation
  Serve]      Above      Only]
              Threshold]
```

---

## Node 1 — Is PLG Right for Your Product?

The first and most consequential decision. PLG is not universally applicable. Products with long implementation cycles, high compliance requirements, or enterprise-only buyer personas may not benefit from a self-serve motion. The key signals are average contract value (ACV), buyer persona, product complexity, and time-to-value feasibility.

### Qualification Signals

| Signal | PLG-Favorable | PLG-Unfavorable |
|--------|--------------|-----------------|
| ACV | < $25,000/year | > $100,000/year |
| Buyer persona | Individual contributor or team lead | C-suite or procurement committee |
| Time-to-value | < 1 day achievable | Requires weeks of integration |
| Product complexity | Self-explanatory UI | Requires training or consulting |
| Data sensitivity | Low (productivity, dev tools) | High (healthcare, finance, gov) |
| Competitive landscape | Competitors offer free tiers | No competitor has free tier |
| Network effects | Present (collaboration, sharing) | Absent (single-user workflow) |
| Implementation effort | No code, self-service setup | Custom integrations required |

### Option A: Yes — Full PLG (Self-Serve, Low ACV)

**When to choose:** Your product has a clear value proposition that a user can experience within minutes, your ACV is under $25K, and individual contributors can adopt without procurement approval.

| Pros | Cons |
|------|------|
| Lowest CAC at scale | Requires significant product investment in self-serve |
| Fastest growth compounding | Free tier costs can be substantial |
| Users self-qualify through usage | Revenue per user is lower initially |
| Organic word-of-mouth acquisition | Harder to serve enterprise requirements |
| Data-rich qualification signals | Requires strong analytics infrastructure |

**Examples:** Slack, Notion, Figma, Canva, Loom, Calendly, Zapier

**Recommendation:** Choose this if your product can deliver value in under 10 minutes with zero human assistance, and your target user can make a purchase decision under $500/month without committee approval.

### Option B: Hybrid — PLG + Sales

**When to choose:** Your product has self-serve potential but your most valuable customers need sales assistance for procurement, compliance, security review, or custom pricing above a threshold.

| Pros | Cons |
|------|------|
| Best of both worlds — PLG for acquisition, sales for expansion | Two motions to staff and optimize |
| Higher ACV deals through sales team | Potential channel conflict between self-serve and sales |
| PLG generates warm leads for sales | Complex attribution and compensation models |
| Self-serve validates product-market fit | Risk of neglecting one motion for the other |
| Lower CAC than pure sales-led | Requires clear handoff rules to avoid customer confusion |

**Examples:** Datadog, Twilio, Atlassian, MongoDB, Snowflake, HubSpot

**Recommendation:** Choose this if your product has natural self-serve entry points but your top-tier customers (enterprise) require custom contracts, SLAs, or security reviews. This is the most common model for B2B SaaS products with ACV ranging from $5K to $100K.

### Option C: No — Enterprise-Only (Sales-Led)

**When to choose:** Your product requires significant implementation effort, your buyer is a committee (not an individual), your ACV is above $100K, and there is no viable way for a user to experience value without a guided setup.

| Pros | Cons |
|------|------|
| Highest ACV per deal | Highest CAC per deal |
| Deep customer relationships | Slow growth, linear scaling |
| Premium positioning | No organic acquisition compounding |
| Full control of sales process | Dependent on sales team headcount |
| Custom solutions per customer | Long sales cycles (months) |

**Examples:** Palantir, Workday, ServiceNow, Veeva

**Recommendation:** Choose this only if self-serve value delivery is truly impossible — not merely difficult. Many products that seem enterprise-only can find a self-serve wedge (e.g., Snowflake offers free trial credits). If you choose this option, the remainder of this section is informational only — focus on Section 19 (Marketing) for your primary growth strategy.

### Decision Record

```
Node 1 Decision: ________________
Rationale: ________________
ACV Range: ________________
Time-to-Value Feasibility: ________________
```

---

## Node 2 — Primary Growth Motion

Given that PLG is appropriate (Node 1 = A or B), which growth motion will drive the majority of your organic acquisition? Most products have a primary motion and one or two secondary motions. Identify the primary here — you will design all motions in `growth-loops.template.md`.

### Option A: Viral Growth

Users invite other users as a natural part of using the product. Growth compounds because each new user brings in additional users.

| Pros | Cons |
|------|------|
| Exponential growth when K > 1 | Requires inherent collaboration use case |
| Near-zero marginal acquisition cost | Viral mechanics can feel spammy if poorly designed |
| Strong network effects create moats | Hard to control growth rate and quality |
| Users do the marketing for you | Viral growth is hard to manufacture — it must be organic |

**Signals this is your motion:**
- [ ] Your product is fundamentally collaborative (multiple users in a workspace)
- [ ] Users need to share outputs with non-users (documents, designs, links)
- [ ] The product becomes more valuable with more users in a workspace
- [ ] Your product creates visible artifacts (public pages, shared links, embedded content)

**Examples:** Slack (team invites), Figma (shared designs), Notion (shared workspaces), Dropbox (shared folders), Calendly (scheduling links)

**K-factor target range:** 0.3-0.8 for most B2B, 0.8-1.5+ for consumer

### Option B: Usage-Based Growth

Users start small and expand organically as they use the product more. Growth comes from expansion within accounts rather than new account acquisition.

| Pros | Cons |
|------|------|
| Natural alignment between value and revenue | Slower initial growth than viral |
| Expansion revenue compounds over time | Revenue is less predictable (usage varies) |
| Low barrier to entry (start free/cheap) | Requires metering infrastructure |
| Self-qualifying — heavy users are best customers | Risk of cost optimization reducing revenue |

**Signals this is your motion:**
- [ ] Usage scales with business activity (API calls, data volume, compute)
- [ ] Small teams adopt first and expand to departments
- [ ] Users naturally increase usage over time without prompting
- [ ] Your product has a clear consumption metric (storage, messages, queries)

**Examples:** Twilio (API calls), AWS (compute), Datadog (hosts), Snowflake (credits), Vercel (bandwidth)

### Option C: Content-Led Growth

Your product generates content that attracts new users through search, social sharing, or embedding. The content your users create becomes your acquisition channel.

| Pros | Cons |
|------|------|
| Compounds with SEO over time | Slower to build momentum |
| Each piece of user content is a landing page | Requires users to create public content |
| Organic discovery through search | Content quality varies (user-generated) |
| Low cost per acquisition once flywheel spins | Dependent on search algorithm changes |

**Signals this is your motion:**
- [ ] Users create public-facing content (templates, pages, galleries)
- [ ] User-generated content ranks in search results
- [ ] Your product has an embeddable output (widgets, badges, charts)
- [ ] Community templates or galleries drive discovery

**Examples:** Canva (templates), Substack (newsletters), WordPress (sites), Airtable (templates), Typeform (forms)

### Option D: Community-Led Growth

A community of practitioners, enthusiasts, or builders drives awareness, education, and adoption. Growth comes from community engagement and peer influence.

| Pros | Cons |
|------|------|
| High trust — peer recommendations | Slow to build, requires sustained investment |
| Community creates content and support | Hard to attribute revenue to community |
| Deep loyalty and low churn | Community management is a full-time role |
| Feedback loop for product development | Risk of toxic dynamics if unmoderated |

**Signals this is your motion:**
- [ ] Your product has a practitioner community (developers, designers, marketers)
- [ ] Users share workflows, tips, and customizations
- [ ] Community events and meetups are viable
- [ ] Open-source or extensible architecture enables community contributions

**Examples:** Figma (community files), dbt (analytics engineering), Notion (template community), HashiCorp (open-source community)

### Decision Record

```
Node 2 Decision: ________________
Primary Motion: ________________
Secondary Motion(s): ________________
Key Viral/Growth Signal: ________________
```

---

## Node 3 — Monetization Trigger

What action or threshold triggers the transition from free to paid? This decision directly shapes your pricing page, paywall UX, and conversion funnel. The trigger must be natural — it should feel like a value upgrade, not a punishment for using the product.

### Option A: Feature-Based

Paid plans unlock features that free plans do not have. Users upgrade when they need a specific capability.

| Pros | Cons |
|------|------|
| Clear value differentiation between tiers | Risk of over-gating (free tier too limited) |
| Easy for users to understand | Risk of under-gating (no reason to upgrade) |
| Predictable revenue per tier | Feature allocation is contentious internally |
| Works well with tiered pricing | New features create gating decisions |

**Best when:** Your product has clearly delineated feature tiers (e.g., basic analytics vs. advanced analytics, individual vs. team features, standard vs. premium integrations).

**Paywall trigger:** User attempts to access a gated feature.

**Examples:** Slack (message history, integrations), Notion (blocks, team features), GitHub (Actions minutes, code review)

### Option B: Usage-Based

Users pay based on consumption — API calls, storage, compute, seats, or another measurable unit. The free tier has a usage cap; exceeding it requires a paid plan.

| Pros | Cons |
|------|------|
| Perfect alignment between value and cost | Revenue is less predictable |
| Low barrier to start — no commitment | Users may optimize usage to stay free |
| Natural expansion as usage grows | Requires metering and billing infrastructure |
| Fair pricing — pay for what you use | Can discourage exploration and experimentation |

**Best when:** Your product has a clear consumption metric that scales with the value users receive.

**Paywall trigger:** User approaches or exceeds usage limit.

**Examples:** Twilio (API calls), Vercel (bandwidth), Cloudflare (requests), SendGrid (emails)

### Option C: Time-Based Trial

Users get full (or near-full) access for a fixed period. After the trial expires, they must pay to continue using the product.

| Pros | Cons |
|------|------|
| Users experience full value quickly | Hard deadline creates urgency but also churn |
| Simpler to implement than feature gating | Users who need more time may churn instead of paying |
| Clear evaluation period | No free tier means no long-tail viral growth |
| Works well for high-ACV products | Users may create multiple accounts to extend trial |

**Best when:** Your product's value is best demonstrated with full access, and you can deliver meaningful value within the trial window (7-30 days).

**Paywall trigger:** Trial period expires.

**Examples:** Salesforce (30-day trial), Adobe Creative Cloud (7-day trial), Linear (14-day trial)

### Option D: Seat-Based

The product is free for individuals or small teams, but paid plans are required above a team size threshold. Monetization scales with organizational adoption.

| Pros | Cons |
|------|------|
| Natural expansion as teams grow | Individual users may never convert |
| Clear value prop — collaboration needs | Small teams may stay free forever |
| Easy to understand pricing | Encourages account sharing to avoid seats |
| Low barrier for initial adoption | Revenue depends on team growth |

**Best when:** Your product's value increases with team size, and collaboration features are the primary differentiator.

**Paywall trigger:** User adds team members beyond free limit.

**Examples:** Slack (free for small teams), Figma (free for 3 editors), Asana (free for 15 members)

### Decision Record

```
Node 3 Decision: ________________
Monetization Trigger: ________________
Free Tier Limits: ________________
Paywall Placement: ________________
```

---

## Node 4 — PQL vs MQL Priority

How do you prioritize lead qualification? Product-Qualified Leads (PQLs) are identified through in-product behavior. Marketing-Qualified Leads (MQLs) are identified through marketing engagement (content downloads, webinar attendance, form fills). Most PLG companies use both, but one should be primary.

### Option A: PQL-Primary

Your sales team prioritizes leads based on product usage signals. MQLs are secondary and only pursued when they also show product engagement.

| Pros | Cons |
|------|------|
| 5-10x higher conversion rates than MQLs | Requires mature analytics infrastructure |
| Based on demonstrated value, not intent signals | Users must reach product before qualification |
| Sales conversations are warmer and more informed | Cold outbound to non-users is deprioritized |
| Shorter sales cycles | Smaller initial pipeline (only active users) |
| Better alignment between sales and product teams | PQL scoring model requires ongoing calibration |

**Recommendation:** Choose PQL-primary if you have strong product analytics, a meaningful free tier or trial, and enough product usage data to build a scoring model. This is the default for PLG companies.

**Conversion benchmarks:**
- PQL → Paid: 15-30% (vs. MQL → Paid: 1-5%)
- PQL → Sales Accepted Lead: 40-60%
- Average PQL deal cycle: 14-30 days (vs. MQL: 60-120 days)

### Option B: MQL-Primary

Your marketing team generates leads through content, events, and outbound. Product is used as a demo environment, not as the primary qualification signal.

| Pros | Cons |
|------|------|
| Larger initial pipeline | Lower conversion rates |
| Works with limited product data | Sales conversations require more discovery |
| Can reach decision-makers who do not use product | Longer sales cycles |
| Better for complex products with long evaluation | Higher CAC |

**Recommendation:** Choose MQL-primary only if your product is early-stage with limited usage data, or if your buyer persona is not the product user (e.g., the buyer is a VP who never touches the product).

### Option C: Balanced

Both PQL and MQL pipelines run in parallel with equal priority. Leads are scored in both systems and the highest-scoring leads are prioritized regardless of source.

| Pros | Cons |
|------|------|
| Maximum pipeline coverage | Two systems to maintain and optimize |
| Captures both user-led and buyer-led signals | Attribution complexity |
| Flexible — can shift weight over time | Risk of conflicting outreach |
| Good for hybrid PLG+sales models | Requires cross-functional coordination |

**Recommendation:** Choose balanced if you are transitioning from sales-led to PLG, or if your product serves both self-serve users (who generate PQLs) and enterprise buyers (who generate MQLs).

### Decision Record

```
Node 4 Decision: ________________
Primary Qualification: ________________
PQL Threshold: ________________
MQL Threshold: ________________
```

---

## Node 5 — Self-Serve Ceiling

At what point does the self-serve experience end and human-assisted sales begin? This decision affects your pricing page, checkout flow, sales team structure, and customer success investment.

### Option A: Full Self-Serve

Users can purchase any plan, including enterprise-tier, through self-serve checkout. No sales team is required for any tier.

| Pros | Cons |
|------|------|
| Lowest cost to serve | Cannot offer custom contracts |
| Fastest time to revenue | May miss large deals that need negotiation |
| Scalable without headcount | Limited ability to serve compliance requirements |
| Simple operational model | No opportunity for solution selling |

**Self-serve ceiling:** All plans including enterprise

**Best when:** Your product is simple enough that enterprise adoption does not require custom configuration, security reviews, or legal negotiation. Rare for B2B SaaS above $10K ACV.

**Examples:** Basecamp, Calendly, Loom

### Option B: Sales-Assisted Above Threshold

Self-serve checkout for individual and team plans. Enterprise plans require a sales conversation for custom pricing, security review, SLA negotiation, and procurement compliance.

| Pros | Cons |
|------|------|
| Self-serve handles volume, sales handles value | Requires defining a clear threshold |
| Sales team focuses on highest-ACV deals | Potential friction at the threshold boundary |
| Supports custom enterprise requirements | Two buying experiences to maintain |
| PLG pipeline feeds sales pipeline | Sales compensation on PLG-sourced deals is complex |

**Self-serve ceiling:** Up to {{SELF_SERVE_CEILING}} plan — above requires sales

**Threshold heuristics:**
- **Seat-based:** Self-serve up to 50 seats, sales above 50
- **Revenue-based:** Self-serve up to $2K/month, sales above $2K/month
- **Feature-based:** Self-serve for standard features, sales for enterprise features (SSO, SAML, audit logs, custom SLA)

**Best when:** Your product serves both SMB (self-serve) and enterprise (sales-assisted). This is the most common model.

**Examples:** Slack, Notion, Figma, Datadog, Atlassian

### Option C: PLG Activation Only

The product is used for activation and qualification, but all purchasing happens through sales. There is no self-serve checkout. The free tier or trial qualifies leads; the sales team closes them.

| Pros | Cons |
|------|------|
| Sales team controls pricing and negotiation | Higher friction — users cannot buy instantly |
| Product usage data informs sales conversations | Longer time to first revenue |
| No free-rider cost management problem | Users who want to buy may churn before sales contact |
| Works for high-ACV products with complex pricing | Requires fast sales follow-up on PQLs |

**Self-serve ceiling:** None — all purchasing through sales

**Best when:** Your product is high-ACV ($50K+), requires custom pricing, and the buying process inherently involves negotiation or procurement. The free tier exists to generate PQLs, not to generate revenue directly.

**Examples:** Snowflake, MongoDB Atlas (partially), Databricks

### Decision Record

```
Node 5 Decision: ________________
Self-Serve Ceiling: ________________
Sales Handoff Trigger: ________________
Enterprise Contact Threshold: ________________
```

---

## Complete Decision Summary

After completing all five nodes, record your complete PLG configuration:

```
┌─────────────────────────────────────────────────┐
│            PLG CONFIGURATION SUMMARY             │
├─────────────────────────────────────────────────┤
│ Node 1 — PLG Right?:        ________________    │
│ Node 2 — Growth Motion:     ________________    │
│ Node 3 — Monetization:      ________________    │
│ Node 4 — Lead Priority:     ________________    │
│ Node 5 — Self-Serve Ceiling: ________________   │
├─────────────────────────────────────────────────┤
│ Growth Model:         {{GROWTH_MODEL}}           │
│ PLG Motion:           {{PLG_MOTION}}             │
│ Paywall Strategy:     {{PAYWALL_STRATEGY}}       │
│ Self-Serve Ceiling:   {{SELF_SERVE_CEILING}}     │
│ PQL Threshold:        {{PQL_THRESHOLD}}          │
│ Free Tier Limits:     {{FREE_TIER_LIMITS}}       │
└─────────────────────────────────────────────────┘
```

---

## Common Configuration Archetypes

| Archetype | Node 1 | Node 2 | Node 3 | Node 4 | Node 5 | Examples |
|-----------|--------|--------|--------|--------|--------|----------|
| Pure Viral PLG | Yes | Viral | Feature | PQL | Full Self-Serve | Calendly, Loom |
| Usage-Led PLG | Yes | Usage | Usage | PQL | Sales Above | Twilio, Vercel |
| Hybrid PLG+Sales | Hybrid | Viral | Feature | Balanced | Sales Above | Slack, Notion |
| Content Flywheel | Yes | Content | Feature | PQL | Full Self-Serve | Canva, Substack |
| Open-Source PLG | Yes | Community | Usage | PQL | Sales Above | GitLab, HashiCorp |
| Enterprise PLG | Hybrid | Usage | Trial | Balanced | PLG Activation | Snowflake, Databricks |

---

## Next Steps

1. Take your Node 2 decision to `growth-loops.template.md` and design 2-3 loops around your chosen motion
2. Take your Node 3 decision to `freemium-conversion-funnel.template.md` and design your paywall strategy
3. Take your Node 4 decision to `pql-scoring.template.md` and build your scoring model
4. Take your Node 5 decision to `self-serve-upgrade.template.md` and design the checkout experience
