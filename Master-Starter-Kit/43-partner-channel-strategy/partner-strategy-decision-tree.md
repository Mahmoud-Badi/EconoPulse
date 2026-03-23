# Partner Strategy Decision Tree

> Walk through five decision nodes to calibrate your partner strategy. Each node narrows the partner model, revenue structure, and channel technology required for {{PROJECT_NAME}}.

---

## Overview

Not every product needs a partner channel, and not every partner channel needs the same infrastructure. A developer tool with a natural API integration model requires different partner architecture than a vertical SaaS product that sells through industry-specific resellers. This decision tree prevents both under-investment (launching a partner program with a Google Form and a handshake) and over-investment (building a four-tier reseller portal before you have a single partner).

Walk through Nodes 1-5 sequentially. Each node produces a decision that feeds into the next. The combination of all five decisions produces your **partner strategy profile** — the specific set of templates and depth levels required for {{PROJECT_NAME}}.

**How to use this file:**
1. Read each node's description
2. Select the option that matches your situation
3. Note the downstream implications
4. After completing all five nodes, compile your partner strategy profile

---

## Node 1 — Do You Need Partners?

Before designing a partner program, determine whether partner channels are the right growth lever for {{PROJECT_NAME}}. Partner programs require sustained investment — portal engineering, partner management headcount, co-marketing budgets, and ongoing enablement. The ROI must justify the cost.

### Option A: Yes — Direct Sales is Plateauing

| Pros | Cons |
|------|------|
| Partner channels add distribution without adding headcount | Loss of direct customer relationship |
| Geographic reach beyond your team's coverage | Margin compression from revenue sharing |
| Industry-specific expertise partners already have | Channel management overhead and complexity |
| Faster market entry through established partner networks | Brand control becomes harder to maintain |

**Signals that this is you:**
- Direct sales growth rate is declining quarter-over-quarter
- Customers ask "do you have a local reseller?"
- Potential partners approach you about reselling
- Competitors have active partner programs capturing market share
- Your product has clear integration points with complementary tools
- Your sales cycle requires domain expertise you do not have in-house

**Downstream implications:** Proceed to Node 2. All partner templates are in scope.

### Option B: Yes — Product is Naturally Partner-Oriented

| Pros | Cons |
|------|------|
| API/platform products need ecosystem partners to deliver value | Platform dependency — if partners leave, value drops |
| White-label model can unlock entirely new markets | Engineering investment in multi-tenancy and theming |
| Technology integrations drive organic discovery | Integration maintenance burden scales with partner count |
| Partner ecosystem creates competitive moat | Quality control across partner implementations |

**Signals that this is you:**
- Your product is a platform or infrastructure that others build on
- Your product has an API that third parties integrate with
- Agencies or consultants already recommend your product to clients
- Your product could be rebranded and sold by other companies
- Your value proposition improves when combined with complementary tools

**Downstream implications:** Proceed to Node 2. Focus on API partner, white-label, and technology partner templates.

### Option C: Not Yet — Focus on Direct First

| Pros | Cons |
|------|------|
| Full margin retention on all revenue | Growth ceiling will eventually appear |
| Complete control over sales process and customer experience | Miss early partner opportunities that competitors capture |
| Simpler operations — no channel management overhead | Harder to build partner program later when urgently needed |
| Learn customer needs directly before adding intermediaries | Geographic expansion limited to your team's reach |

**Signals that this is you:**
- Direct sales growth rate is still healthy (>30% YoY)
- You have not achieved product-market fit yet
- Your sales process is still being refined
- You have fewer than 50 customers
- No potential partners have approached you

**Downstream implications:** Set `{{PARTNER_CHANNEL}}` to `false`. Skip this section. Revisit when direct growth plateaus or partners begin approaching you. Bookmark this decision tree for that future conversation.

### Option D: Hybrid — Selective Partnerships Only

| Pros | Cons |
|------|------|
| Capture specific opportunities without full program overhead | Ad-hoc partnerships lack scalable infrastructure |
| Test partner model before committing to full program | Inconsistent partner experience undermines trust |
| Lower investment to validate channel viability | Difficult to attract top-tier partners without formal program |
| Learn what works before building permanent infrastructure | Manual processes break at 5-10 partners |

**Signals that this is you:**
- 1-3 specific partners have strong strategic fit
- You want to validate the partner model before full investment
- Your product serves a niche where a few key partners cover the market
- You are pre-Series B and cannot staff a partner team yet

**Downstream implications:** Proceed to Node 2 but implement at minimum viable depth. Use lightweight versions of templates. Plan to formalize when partner count exceeds 5.

---

## Node 2 — Partner Model

What type of partnership relationship best fits your product, market, and go-to-market motion? Most programs combine multiple models, but one model is primary.

### Option A: Reseller / VAR (Value-Added Reseller)

| Pros | Cons |
|------|------|
| Partners sell your product — direct revenue multiplication | Margin compression (20-40% wholesale discount) |
| Partners handle first-line sales conversations | Loss of direct customer relationship |
| Geographic and industry reach through partner networks | Partner sales quality varies widely |
| Scalable — each partner is an independent sales team | Requires portal, deal registration, and order management |

**Best for:** Products with a sales-assisted motion, products sold into specific industries or geographies, products that benefit from local-language support.

**Required templates:** `reseller-portal.template.md`, `partner-tier-definitions.template.md`, `revenue-sharing-models.template.md`, `channel-conflict-resolution.template.md`

**Set:** `{{PARTNER_MODEL}}` = `reseller`

### Option B: Affiliate / Referral

| Pros | Cons |
|------|------|
| Low cost per acquisition — pay only for results | Affiliates optimize for volume, not quality |
| Massive distribution through content creators and influencers | Fraud risk (cookie stuffing, fake referrals) |
| Simple model — partner sends traffic, you pay commission | Brand control is minimal — affiliates write their own copy |
| Easy to scale — no partner training required | Attribution complexity with multi-touch journeys |

**Best for:** Self-serve products, products with strong content marketing fit, consumer or prosumer products, products with clear conversion funnels.

**Required templates:** `affiliate-program.template.md`, `revenue-sharing-models.template.md`

**Set:** `{{PARTNER_MODEL}}` = `affiliate`

### Option C: White-Label / OEM

| Pros | Cons |
|------|------|
| Access markets you cannot reach under your own brand | Highest engineering complexity (theming, multi-tenancy, branding) |
| Higher revenue per partner (entire product, not just referral) | Partner support burden — you support their support team |
| Sticky relationships — partners invest in customization | Pricing complexity — per-seat, per-tenant, or revenue share? |
| Partners' success is directly tied to your product quality | Risk of partner becoming competitor if they build in-house |

**Best for:** Platform products, infrastructure products, products in industries where end-customers buy from trusted brands (healthcare, finance, government).

**Required templates:** `white-label-architecture.template.md`, `revenue-sharing-models.template.md`, `partner-onboarding.template.md`, `partner-tier-definitions.template.md`

**Set:** `{{PARTNER_MODEL}}` = `white-label`, `{{WHITE_LABEL_ENABLED}}` = `true`

### Option D: Technology / Integration Partner

| Pros | Cons |
|------|------|
| Complementary products drive mutual referrals | Integration maintenance scales with partner count |
| Marketplace listings drive organic discovery | Partner API changes can break your integration |
| Deep integrations create switching costs | Engineering investment per integration |
| Co-marketing opportunities with established brands | Power imbalance — large partners dictate terms |

**Best for:** Products that are part of a larger workflow, products with strong APIs, products targeting ecosystems (Salesforce, HubSpot, Shopify).

**Required templates:** `api-partner-program.template.md`, `integration-marketplace.template.md`, `co-marketing-playbook.template.md`

**Set:** `{{PARTNER_MODEL}}` = `technology`

### Option E: Multi-Model (Hybrid)

| Pros | Cons |
|------|------|
| Maximum market coverage across channels | Highest operational complexity |
| Different models serve different market segments | Channel conflict between models (affiliate vs reseller) |
| Revenue diversification across partner types | Requires separate infrastructure for each model |
| Flexibility to shift investment to highest-performing model | Partner management team needs diverse skills |

**Best for:** Products at scale (>$10M ARR), products serving multiple market segments, products with both self-serve and enterprise motions.

**Required templates:** All templates. Implement per-model in priority order.

**Set:** `{{PARTNER_MODEL}}` = `hybrid`

---

## Node 3 — Revenue Sharing

How will you compensate partners? Revenue sharing structure is the single most important factor in partner recruitment and retention. Get it wrong and partners will not invest in selling your product.

### Option A: Percentage of Revenue (Recurring)

| Pros | Cons |
|------|------|
| Aligns partner incentives with long-term customer success | Ongoing margin compression for the life of the customer |
| Partners are motivated to retain customers, not just close deals | Accounting complexity — monthly/annual share calculations |
| Attractive to partners — recurring income builds a business | Disputes over renewal attribution |
| Industry standard for SaaS partner programs | Compounding cost if partner revenue grows faster than expected |

**Typical ranges:**
- Resellers: 20-40% of contract value
- White-label: 30-50% of end-customer revenue
- Referral partners: 10-20% of first-year revenue

**Set:** `{{PARTNER_REVENUE_SHARE}}` = percentage value

### Option B: One-Time Commission

| Pros | Cons |
|------|------|
| Simpler accounting — single payment per deal | Partners have no incentive to ensure customer retention |
| Predictable cost per acquisition | Less attractive to partners building recurring revenue businesses |
| No ongoing margin compression | Higher one-time cost to compensate for lack of recurring |
| Clean attribution — commission paid at deal close | Partners may churn customers and re-sign them for new commissions |

**Typical ranges:**
- Affiliate: 15-30% of first payment
- Referral: flat fee ($50-$500 per qualified lead)
- Reseller: 1-3 months of contract value

### Option C: Tiered / Performance-Based

| Pros | Cons |
|------|------|
| Higher performers earn more — natural incentive alignment | Complexity in tier management and tracking |
| Lower-tier partners cost less, limiting downside | New partners start at lowest tier, which may not be attractive |
| Encourages partners to invest in growing their volume | Tier thresholds must be carefully calibrated |
| Can blend recurring and one-time elements | Annual recalculation creates uncertainty for partners |

**Structure example:**

| Tier | Annual Revenue | Revenue Share | Bonus |
|------|---------------|---------------|-------|
| Bronze | < $50K | 20% | — |
| Silver | $50K - $200K | 25% | Quarterly bonus |
| Gold | $200K - $500K | 30% | MDF + quarterly bonus |
| Platinum | > $500K | 35% | MDF + dedicated CSM + quarterly bonus |

### Option D: Wholesale / Margin-Based

| Pros | Cons |
|------|------|
| Simple model — partner buys at wholesale, sells at retail | Price control risk — partners may discount below your direct price |
| Partner controls their own margin and pricing | MAP (Minimum Advertised Price) enforcement required |
| Common in physical product channels — partners understand it | Inventory risk if partner commits to volume |
| Clean financial relationship — you sell to partner, partner sells to customer | Less common in SaaS, may confuse partners |

**Typical discount:** 25-45% off list price

---

## Node 4 — Partner Tiers

How many tiers will your partner program have? Tiers create aspiration and differentiation. Too few tiers and there is no growth path. Too many tiers and the distinctions become meaningless.

### Option A: Two Tiers (Partner / Premier Partner)

| Pros | Cons |
|------|------|
| Simple to manage and communicate | Limited aspiration — only one level to advance to |
| Clear distinction between standard and top partners | Does not differentiate among mid-range performers |
| Low overhead for tier management | May not motivate partners who are close to but not at Premier |

**Best for:** Programs with < 20 partners, early-stage programs, niche markets.

**Set:** `{{PARTNER_TIER_COUNT}}` = `2`

### Option B: Three Tiers (Silver / Gold / Platinum)

| Pros | Cons |
|------|------|
| Enough differentiation to motivate advancement | Middle tier can become a "dead zone" if benefits are unclear |
| Common model — partners understand it immediately | Three sets of benefits, pricing, and support to manage |
| Each tier has meaningful benefit increases | Must define clear thresholds between tiers |

**Best for:** Programs with 20-100 partners, growing programs, multi-vertical markets.

**Set:** `{{PARTNER_TIER_COUNT}}` = `3`

### Option C: Four Tiers (Bronze / Silver / Gold / Platinum)

| Pros | Cons |
|------|------|
| Maximum differentiation and aspiration | Four sets of everything — significant management overhead |
| Granular benefit scaling rewards incremental performance | Distinctions between adjacent tiers may be too subtle |
| Industry standard for enterprise partner programs | Requires dedicated partner operations team to manage |
| Room for partners at every stage of growth | Annual tier reviews become a significant operational event |

**Best for:** Programs with 100+ partners, enterprise products, global programs.

**Set:** `{{PARTNER_TIER_COUNT}}` = `4`

---

## Node 5 — Channel Technology

What technology infrastructure will you build to support the partner program? The answer depends on your partner model, tier count, and engineering capacity.

### Option A: Custom-Built Portal

| Pros | Cons |
|------|------|
| Fully tailored to your partner model and workflows | Significant engineering investment (3-6 months minimum) |
| Deep integration with your product and billing | Ongoing maintenance and feature development |
| No per-partner licensing fees | Must build deal registration, reporting, and training from scratch |
| Complete control over partner experience | Delays program launch until portal is built |

**Best for:** White-label programs, products with unique partner workflows, companies with available engineering capacity.

**Set:** `{{PARTNER_PORTAL_TYPE}}` = `custom`

### Option B: SaaS Partner Platform (PartnerStack, Impact, Crossbeam)

| Pros | Cons |
|------|------|
| Launch in weeks, not months | Monthly platform cost ($500-$5,000+/month) |
| Built-in deal registration, reporting, and payouts | Limited customization — must adapt to platform's model |
| Industry best practices baked in | Another vendor dependency |
| Handles tax documents (1099s) and compliance | Integration with your product requires API work |

**Best for:** Affiliate programs, referral programs, companies launching partner programs for the first time.

**Set:** `{{PARTNER_PORTAL_TYPE}}` = `saas-platform`

### Option C: CRM-Integrated (Salesforce PRM, HubSpot)

| Pros | Cons |
|------|------|
| Partners and direct sales in the same system | CRM licensing cost increases |
| Deal registration integrated with pipeline management | Limited portal customization compared to custom build |
| Reporting across direct and partner channels | Partner experience limited by CRM's PRM capabilities |
| Sales team already knows the platform | Complex CRM configurations can become brittle |

**Best for:** Reseller programs, companies already using Salesforce or HubSpot extensively, enterprise sales-led motions.

**Set:** `{{PARTNER_PORTAL_TYPE}}` = `crm-integrated`

---

## Partner Strategy Profile

After completing all five nodes, compile your profile:

```
Partner Strategy Profile — {{PROJECT_NAME}}
=============================================
Node 1 — Need Partners:       [Yes/Not Yet/Hybrid]
Node 2 — Partner Model:       {{PARTNER_MODEL}}
Node 3 — Revenue Sharing:     {{PARTNER_REVENUE_SHARE}}%
Node 4 — Tier Count:          {{PARTNER_TIER_COUNT}}
Node 5 — Channel Technology:  {{PARTNER_PORTAL_TYPE}}

Conditional Modules:
  White-Label:                 {{WHITE_LABEL_ENABLED}}
  Affiliate:                   {{AFFILIATE_ENABLED}}
  Marketplace:                 {{MARKETPLACE_LISTING}}

Required Templates (in priority order):
  1. ___________________________
  2. ___________________________
  3. ___________________________
  4. ___________________________
  5. ___________________________

Estimated Implementation Timeline:  _____ weeks
Partner Team Headcount Required:    _____ FTEs
Target Partner Count (Year 1):      _____
Target Partner Revenue (Year 1):    $_____
```

---

## Decision Matrix Quick Reference

| Decision | Reseller | Affiliate | White-Label | Technology | Hybrid |
|----------|----------|-----------|-------------|------------|--------|
| Engineering effort | Medium | Low | High | Medium | High |
| Revenue share range | 20-40% | 10-30% | 30-50% | 5-15% | Varies |
| Time to first partner revenue | 3-6 months | 1-2 months | 6-12 months | 3-6 months | 6-12 months |
| Partner management FTEs | 1 per 20-30 | 1 per 100+ | 1 per 5-10 | 1 per 15-25 | 2+ from day one |
| Portal complexity | High | Medium | Very high | Medium | Very high |
| Channel conflict risk | High | Medium | Low | Low | Very high |
| Customer relationship | Indirect | Direct | Indirect | Direct | Mixed |
| Brand control | Medium | Low | Very low | High | Low |
