# Paid Advertising Strategy for {{PROJECT_NAME}}

> Part of the **{{PROJECT_NAME}}** Marketing Plan
> Product Type: {{PRODUCT_TYPE}} | Target Audience: {{TARGET_AUDIENCE}}
> Monthly Marketing Budget: {{MONTHLY_MARKETING_BUDGET}}

---

## Table of Contents

1. [When to Start Paid Advertising](#when-to-start-paid-advertising)
2. [When NOT to Start Paid Ads](#when-not-to-start-paid-ads)
3. [Channel Selection by Product Type](#channel-selection-by-product-type)
4. [Budget Allocation Framework](#budget-allocation-framework)
5. [Campaign Structure: The Funnel Approach](#campaign-structure-the-funnel-approach)
6. [Testing Methodology](#testing-methodology)
7. [Key Metrics by Channel](#key-metrics-by-channel)
8. [Scaling Framework](#scaling-framework)
9. [Retargeting as Your Starting Point](#retargeting-as-your-starting-point)
10. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
11. [Monthly Reporting Template](#monthly-reporting-template)
12. [Product-Type Specific Strategies](#product-type-specific-strategies)

---

## When to Start Paid Advertising

Paid ads are an accelerant, not a foundation. Start paid advertising only when these prerequisites are in place:

### Prerequisite Checklist

- [ ] **Product-market fit is validated** - You have organic users who retain and pay. Ads amplify what works; they cannot fix a product people do not want.
- [ ] **Organic channels are established** - Your website converts at a reasonable rate (2-5% for landing pages). Your SEO and content are generating some baseline traffic.
- [ ] **Conversion tracking is operational** - Google Analytics 4 is installed and tested. Conversion events fire correctly. You can attribute revenue to traffic sources.
- [ ] **Landing pages are optimized** - Dedicated landing pages exist for your core offers. They load in under 3 seconds. They are mobile-responsive. CTA is clear and above the fold.
- [ ] **You can measure ROI** - You know your customer lifetime value (LTV). You know your acceptable cost per acquisition (CPA). You have a system to track leads through to revenue.
- [ ] **You can sustain spending for 2-3 months** - Ads require a learning period. Budget at least 60-90 days of spend before judging results.

### Readiness Signals

| Signal | Ready | Not Ready |
|--------|-------|-----------|
| Organic conversion rate | > 2% on landing page | < 1% or unknown |
| Customer LTV | Known and calculated | Unknown or guessed |
| Conversion tracking | Tested and verified | Not installed or broken |
| Landing pages | Dedicated, fast, optimized | Homepage or generic pages |
| Monthly budget available | $500+ you can afford to lose | Scraping together $100 |
| Time commitment | 3-5 hours/week for optimization | Set and forget |

---

## When NOT to Start Paid Ads

Starting paid ads too early is one of the most expensive mistakes a startup can make. Do not start if:

### Hard Stops

1. **No landing page optimization** - Sending paid traffic to an unoptimized page is burning money. Fix your conversion rate first with free traffic.
2. **No conversion tracking** - If you cannot measure what happens after a click, you cannot optimize. You are flying blind.
3. **You cannot afford to lose money learning** - The first $500-1000 is tuition. You are buying data, not customers. If losing that money would hurt, wait.
4. **Product is not ready** - Driving traffic to a broken or incomplete product creates negative impressions that are expensive to undo.
5. **No clear value proposition** - If you cannot explain in one sentence why someone should care, your ads will not work no matter how much you spend.
6. **Customer LTV is unknown** - Without knowing how much a customer is worth, you cannot know what you can afford to pay to acquire one.

### Yellow Flags

- Your organic conversion rate is below 1%
- You have not talked to at least 20 users about their pain points
- Your pricing is not validated
- You do not have a dedicated person or time block for ad management
- Your product serves a very small niche (under 10,000 potential customers)

---

## Channel Selection by Product Type

Not every platform works for every product. Choose your first channel based on where your audience already is and what intent signals you can capture.

### Channel Selection Matrix

| Channel | Best For | Avg CPC | Intent Level | Min Budget/Month |
|---------|----------|---------|--------------|------------------|
| Google Search | High-intent queries, known problems | $1-5 | Very High | $500 |
| Google Display | Awareness, retargeting | $0.20-1 | Low | $300 |
| Facebook/Instagram | B2C, visual products, broad audiences | $0.50-3 | Medium | $300 |
| LinkedIn | B2B, enterprise, professional tools | $5-15 | Medium-High | $1,000 |
| Twitter/X | Dev tools, tech audience, niche B2B | $0.50-3 | Low-Medium | $300 |
| Reddit | Niche communities, technical products | $0.50-5 | Medium | $300 |
| YouTube | Products that benefit from demo/video | $0.05-0.30 per view | Low-Medium | $500 |

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### SaaS Product Recommendations

**Start with:** Google Search Ads targeting high-intent keywords like "best [category] software," "[competitor] alternative," and "[problem] solution."

**Second channel:** Facebook/Instagram retargeting to recapture website visitors who did not convert.

**Third channel:** LinkedIn if your buyers are decision-makers at companies (B2B SaaS). Skip LinkedIn if your product is under $50/month per user -- the CPC will not justify the acquisition cost.

**Channel priority:** Google Search > Retargeting (multi-platform) > LinkedIn (B2B) or Facebook (B2C) > YouTube > Display
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
### Mobile App Recommendations

**Start with:** Facebook/Instagram App Install campaigns. Meta's algorithm is highly optimized for app installs and can target effectively.

**Second channel:** Google App Campaigns (formerly Universal App Campaigns) for broad reach across Search, Play Store, YouTube, and Display.

**Third channel:** TikTok if your audience skews younger (18-35). Apple Search Ads if you are iOS-first.

**Channel priority:** Facebook/Instagram > Google App Campaigns > Apple Search Ads (iOS) > TikTok > Twitter
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "ecommerce" -->
### E-commerce Product Recommendations

**Start with:** Google Shopping Ads. Product listing ads have the highest purchase intent because users see the product and price before clicking.

**Second channel:** Facebook/Instagram with dynamic product ads and retargeting for cart abandonment.

**Third channel:** Pinterest if your products are visual (home, fashion, food). TikTok Shop if your audience is Gen Z / Millennial.

**Channel priority:** Google Shopping > Facebook/Instagram retargeting > Google Search > Pinterest > TikTok
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
### Developer Tool Recommendations

**Start with:** Google Search Ads targeting specific technical queries ("[language] [tool type]," "how to [problem your tool solves]").

**Second channel:** Twitter/X for developer community reach. Dev tool audiences are disproportionately active on Twitter.

**Third channel:** Reddit targeting programming and technology subreddits. Be authentic -- Reddit users hate obvious ads.

**Channel priority:** Google Search > Twitter/X > Reddit > GitHub Sponsors > Dev newsletter sponsorships > LinkedIn
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
### Marketplace Recommendations

**Start with:** Google Search Ads targeting both supply-side and demand-side queries separately.

**Second channel:** Facebook/Instagram for the demand side (consumers). LinkedIn for the supply side if suppliers are businesses.

**Third channel:** Localized ads (Google Local, Facebook Local) if your marketplace is geographically focused.

**Channel priority:** Google Search (both sides) > Facebook (demand side) > LinkedIn (supply side) > Local advertising
<!-- ENDIF -->

---

## Budget Allocation Framework

### The Single-Channel Start

**Rule: Start with ONE channel. Prove ROI. Then expand.**

Spreading $1,000 across four platforms gives you $250 per platform -- not enough to generate statistically significant data on any of them. Concentrate your budget to learn faster.

### Starting Budget Recommendations

| Stage | Monthly Budget | Channels | Goal |
|-------|---------------|----------|------|
| Testing | $500-1,000 | 1 channel | Find winning audience + creative |
| Validation | $1,000-3,000 | 1-2 channels | Prove profitable CPA |
| Growth | $3,000-10,000 | 2-3 channels | Scale profitable campaigns |
| Expansion | $10,000+ | 3-5 channels | Full funnel, multi-channel |

### Budget Split Within a Channel (Growth Stage)

```
Prospecting campaigns (new audiences): 60-70%
Retargeting campaigns (known visitors): 20-30%
Experimental campaigns (testing new angles): 10%
```

### Monthly Budget Calculator for {{PROJECT_NAME}}

```
Target new customers this month:     {{TARGET_CUSTOMERS_PER_MONTH}}
Customer lifetime value (LTV):       {{CUSTOMER_LTV}}
Target CPA (LTV / 3 as starting):   {{CUSTOMER_LTV}} / 3 = $___
Monthly ad budget:                   Target customers × Target CPA = $___
Daily ad budget:                     Monthly / 30 = $___
```

---

## Campaign Structure: The Funnel Approach

### Top of Funnel (TOFU) -- Awareness

- **Goal:** Introduce {{PROJECT_NAME}} to people who do not know it exists
- **Audiences:** Interest-based, lookalike, broad targeting
- **Ad types:** Educational content, blog posts, how-to videos, problem statements
- **KPI:** Cost per click (CPC), click-through rate (CTR), reach
- **Budget allocation:** 30-40% in growth stage

### Middle of Funnel (MOFU) -- Consideration

- **Goal:** Nurture people who know about {{PROJECT_NAME}} but have not tried it
- **Audiences:** Website visitors, content engagers, email subscribers
- **Ad types:** Product demos, case studies, comparison content, webinars, free trials
- **KPI:** Cost per lead, sign-up rate, content engagement
- **Budget allocation:** 20-30% in growth stage

### Bottom of Funnel (BOFU) -- Conversion

- **Goal:** Convert people who are actively considering {{PROJECT_NAME}}
- **Audiences:** Trial users, pricing page visitors, cart abandoners, demo requesters
- **Ad types:** Testimonials, limited offers, direct CTA, social proof
- **KPI:** Cost per acquisition (CPA), conversion rate, ROAS
- **Budget allocation:** 30-40% in growth stage

---

## Testing Methodology

### Testing Order (Most to Least Impact)

1. **Test audiences first** - Who you target matters more than what you say. Test 3-5 audience segments with the same ad creative.
2. **Test creatives second** - Once you find the best audience, test 3-5 different ad creatives (images, videos, copy angles).
3. **Test landing pages third** - Once you have a winning audience + creative, test different landing page variants.
4. **Test offers last** - Only after the above are optimized, experiment with different offers (pricing, trials, bonuses).

### Statistical Significance

- Minimum data per variant: 100 clicks or 20 conversions (whichever comes first)
- Run tests for at least 7 days to account for day-of-week variation
- Do not make changes during the learning period (first 3-5 days on a new campaign)
- Use a 95% confidence level before declaring a winner

### Testing Log Template

| Test # | Date | Variable | Variant A | Variant B | Winner | Lift | Notes |
|--------|------|----------|-----------|-----------|--------|------|-------|
| 1 | {{DATE}} | Audience | [Segment A] | [Segment B] | | | |
| 2 | | Creative | [Ad A] | [Ad B] | | | |
| 3 | | Landing Page | [Page A] | [Page B] | | | |

---

## Key Metrics by Channel

### Universal Metrics

| Metric | Definition | Good Benchmark | Target for {{PROJECT_NAME}} |
|--------|-----------|---------------|---------------------------|
| CPC (Cost per Click) | Amount paid per click | Varies by channel | $____ |
| CTR (Click-Through Rate) | Clicks / Impressions | 1-3% search, 0.5-1% social | ___% |
| Conversion Rate | Conversions / Clicks | 2-5% landing page | ___% |
| CPA (Cost per Acquisition) | Total spend / Conversions | LTV / 3 | $____ |
| ROAS (Return on Ad Spend) | Revenue / Ad Spend | 3:1 minimum | ___:1 |
| Frequency | Avg times a person sees your ad | 1-3 (prospecting), 3-7 (retargeting) | |

### Channel-Specific Benchmarks

**Google Search:**
- Average CTR: 3-5% (top 3 positions)
- Average conversion rate: 3-5%
- Quality Score target: 7+ out of 10

**Facebook/Instagram:**
- Average CTR: 0.9-1.5%
- Average conversion rate: 1-3%
- Relevance Score target: 7+ out of 10

**LinkedIn:**
- Average CTR: 0.4-0.7%
- Average conversion rate: 2-5% (higher quality leads)
- Engagement rate target: 0.5%+

---

## Scaling Framework

### When to Increase Budget

Increase budget when ALL of the following are true:
- CPA has been stable and profitable for at least 2 weeks
- You have at least 30-50 conversions per month on the campaign
- Increasing budget by 20% does not increase CPA by more than 10%
- Your operations can handle more customers

### How to Increase Budget

- **Rule:** Never increase budget by more than 20-30% at a time
- **Frequency:** Increase every 5-7 days if CPA remains stable
- **Watch period:** Monitor for 3-5 days after each increase before increasing again

### When to Add a New Channel

- Your primary channel is profitable and stable
- You have hit diminishing returns (CPA increasing despite optimization)
- You have bandwidth to manage another platform (or hire help)
- The new channel reaches a different segment of your audience

### When to Pause or Cut

- CPA exceeds LTV / 2 for more than 2 weeks
- Spend exceeds $500 with zero conversions
- CTR drops below 0.5% on search or 0.3% on social after optimization

---

## Retargeting as Your Starting Point

If you can only run one type of paid campaign, make it retargeting.

### Why Retargeting First

- These people already know you (highest conversion likelihood)
- CPCs are lower because the audience is smaller and more relevant
- Conversion rates are 2-10x higher than cold traffic
- You are recapturing value from organic and content efforts
- Budget required is small ($5-20/day can be effective)

### Minimum Retargeting Setup

1. Install tracking pixels (Google Tag, Facebook Pixel) -- do this NOW even if you are not running ads yet
2. Build audience of all website visitors (last 180 days)
3. Create a simple retargeting campaign with 3-5 ads
4. Set frequency cap at 3-7 impressions per week
5. Budget $10-20/day
6. Measure for 2 weeks before optimizing

See `retargeting-strategy.md` for the complete retargeting playbook.

---

## Common Mistakes to Avoid

### Mistake 1: Spreading Budget Too Thin
**Problem:** $200 across 5 platforms = $40 each = zero learnings on any of them.
**Fix:** Concentrate 100% of initial budget on one channel. Master it. Then expand.

### Mistake 2: No Conversion Tracking
**Problem:** Running ads without knowing which clicks lead to customers.
**Fix:** Set up end-to-end tracking before spending a single dollar. Test it with a real conversion.

### Mistake 3: No Dedicated Landing Pages
**Problem:** Sending ad traffic to your homepage or a generic page.
**Fix:** Create specific landing pages that match the ad's promise. One page per campaign theme.

### Mistake 4: Impatience
**Problem:** Changing ads after 2 days because "it's not working."
**Fix:** Commit to a 2-week test period. Algorithms need time to optimize. Collect at least 100 clicks before judging.

### Mistake 5: Ignoring Negative Keywords (Google)
**Problem:** Your ads show for irrelevant searches, wasting budget.
**Fix:** Review search term reports weekly. Add negative keywords aggressively.

### Mistake 6: Not Testing Creatives
**Problem:** Running one ad and hoping it works.
**Fix:** Always have 3-5 ad variants running. Kill losers, scale winners, introduce new challengers.

### Mistake 7: Optimizing for Clicks Instead of Conversions
**Problem:** Celebrating high CTR while CPA is terrible.
**Fix:** Optimize for the metric that matters: cost per acquisition or return on ad spend.

### Mistake 8: No Retargeting
**Problem:** Paying to drive visitors who leave and never come back.
**Fix:** Retargeting captures 2-10x more value from every dollar spent on prospecting.

---

## Monthly Paid Ads Reporting Template

### Executive Summary -- {{MONTH}} {{YEAR}}

| Metric | This Month | Last Month | Change | Target |
|--------|-----------|------------|--------|--------|
| Total Ad Spend | $____ | $____ | ___% | $____ |
| Total Conversions | ____ | ____ | ___% | ____ |
| Blended CPA | $____ | $____ | ___% | $____ |
| Blended ROAS | ___:1 | ___:1 | ___% | ___:1 |
| Revenue from Ads | $____ | $____ | ___% | $____ |
| New Customers from Ads | ____ | ____ | ___% | ____ |

### Channel Breakdown

| Channel | Spend | Impressions | Clicks | CTR | Conversions | CPA | ROAS |
|---------|-------|-------------|--------|-----|-------------|-----|------|
| Google Search | $____ | ____ | ____ | ___% | ____ | $____ | ___:1 |
| Google Display | $____ | ____ | ____ | ___% | ____ | $____ | ___:1 |
| Facebook/IG | $____ | ____ | ____ | ___% | ____ | $____ | ___:1 |
| LinkedIn | $____ | ____ | ____ | ___% | ____ | $____ | ___:1 |
| Retargeting | $____ | ____ | ____ | ___% | ____ | $____ | ___:1 |

### Top Performing Campaigns

1. **Campaign:** ____________ | CPA: $____ | ROAS: ___:1
2. **Campaign:** ____________ | CPA: $____ | ROAS: ___:1
3. **Campaign:** ____________ | CPA: $____ | ROAS: ___:1

### Key Learnings This Month

1. ____________________________________________________________
2. ____________________________________________________________
3. ____________________________________________________________

### Next Month Plan

- **Budget change:** $____ (increase/decrease/maintain)
- **New tests planned:** ____________________________________________
- **Channels to add/remove:** ______________________________________
- **Optimization priorities:** _______________________________________

---

## Action Items for {{PROJECT_NAME}}

- [ ] Validate all prerequisites in the readiness checklist above
- [ ] Calculate customer LTV and target CPA
- [ ] Choose primary advertising channel based on product type
- [ ] Set up conversion tracking and verify it works
- [ ] Create dedicated landing page(s) for paid traffic
- [ ] Install retargeting pixels on all pages immediately
- [ ] Set initial monthly budget: $____
- [ ] Create first campaign with 3-5 ad variants
- [ ] Schedule weekly 30-minute optimization sessions
- [ ] Set up monthly reporting using the template above
