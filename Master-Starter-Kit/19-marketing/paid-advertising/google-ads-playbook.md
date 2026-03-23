# Google Ads Playbook for {{PROJECT_NAME}}

> A comprehensive guide to running profitable Google Ads campaigns for developer and tech products.
> Product Type: {{PRODUCT_TYPE}} | Target Audience: {{TARGET_AUDIENCE}}

---

## Table of Contents

1. [Account Setup and Configuration](#account-setup-and-configuration)
2. [Campaign Types Overview](#campaign-types-overview)
3. [Search Ads Deep Dive](#search-ads-deep-dive)
4. [Display Ads](#display-ads)
5. [YouTube Ads](#youtube-ads)
6. [Bidding Strategies](#bidding-strategies)
7. [Budget Management](#budget-management)
8. [Quality Score Optimization](#quality-score-optimization)
9. [A/B Testing](#ab-testing)
10. [Reporting and Optimization](#reporting-and-optimization)
11. [Common Google Ads Mistakes](#common-google-ads-mistakes)

---

## Account Setup and Configuration

### Step 1: Create Google Ads Account

1. Go to ads.google.com and sign up with your business Google account
2. Select "Switch to Expert Mode" immediately -- do not use Smart Campaigns
3. Choose "Create an account without a campaign" to avoid auto-created campaigns
4. Set your billing country, time zone (cannot be changed later), and currency

### Step 2: Billing Setup

- Add a payment method (credit card or bank account)
- Set a monthly spending limit as a safety net: start at 1.5x your intended monthly budget
- Enable invoice billing if spending over $5,000/month for cash flow benefits

### Step 3: Conversion Tracking

This is the most critical step. Without accurate conversion tracking, you cannot optimize.

**Google Tag (gtag.js) Installation:**
```html
<!-- Global site tag (gtag.js) - Google Ads: {{GOOGLE_ADS_ID}} -->
<script async src="https://www.googletagmanager.com/gtag/js?id={{GOOGLE_ADS_ID}}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{GOOGLE_ADS_ID}}');
</script>
```

**GA4 Integration:**
1. Link your Google Analytics 4 property to Google Ads (Admin > Google Ads Links)
2. Import GA4 conversions into Google Ads (Tools > Conversions > Import)
3. This gives you richer audience data and cross-channel attribution

**Conversion Actions to Create:**

| Conversion Action | Type | Value | Count |
|-------------------|------|-------|-------|
| Sign up / Account created | Primary | {{SIGNUP_VALUE}} | One per user |
| Free trial started | Primary | {{TRIAL_VALUE}} | One per user |
| Paid conversion | Primary | Dynamic (revenue) | One per user |
| Demo requested | Primary | {{DEMO_VALUE}} | One per user |
| Pricing page view | Secondary | $0 (observation) | One per user |
| Key feature page view | Secondary | $0 (observation) | One per user |

**Testing Your Tracking:**
- Use Google Tag Assistant (Chrome extension) to verify tags fire
- Complete a test conversion and check it appears in Google Ads within 24 hours
- Verify conversion values match your records

### Step 4: Audience Setup

- Import your customer email list (Customer Match) for targeting and exclusion
- Create remarketing audiences from your website traffic
- Set up audience signals for Performance Max campaigns

---

## Campaign Types Overview

| Campaign Type | Intent Level | Best For | When to Use |
|---------------|-------------|----------|-------------|
| **Search** | Very High | Capturing existing demand | Start here -- always |
| **Display** | Low | Awareness, retargeting | After Search is profitable |
| **YouTube** | Low-Medium | Brand building, demos | When you have video content |
| **Performance Max** | Mixed | Broad reach, automation | After manual campaigns are optimized |
| **Shopping** | High | Physical/digital products with prices | E-commerce only |
| **Discovery** | Low-Medium | Feed-based discovery | Supplementary to Search |

**Recommended launch order for {{PROJECT_NAME}}:**
1. Search campaigns (branded + non-branded)
2. Retargeting via Display
3. YouTube (if video assets available)
4. Performance Max (once you have 30+ conversions/month)

---

## Search Ads Deep Dive

Search ads are the highest-intent advertising available. Someone is actively typing their problem into Google -- you show up with the solution.

### Keyword Research

#### Keyword Categories for {{PROJECT_NAME}}

**1. Branded Keywords (Defend your name)**
```
{{PROJECT_NAME}}
{{PROJECT_NAME}} pricing
{{PROJECT_NAME}} review
{{PROJECT_NAME}} login
{{PROJECT_NAME}} alternative
```
Bid on your own brand name. It is cheap ($0.10-0.50 CPC) and protects against competitors bidding on your name.

**2. Competitor Keywords (Capture comparison shoppers)**
```
[competitor name] alternative
[competitor name] vs [your product]
[competitor name] pricing
[competitor name] review
switch from [competitor name]
```
These convert well because searchers are already solution-aware.

**3. Problem Keywords (Capture people experiencing the pain you solve)**
```
how to [solve problem]
best way to [task your product helps with]
[problem] solution
why is [pain point] so hard
[pain point] for [audience]
```

**4. Solution Keywords (Capture people seeking your product category)**
```
best [product category] software
[product category] tool for [audience]
top [product category] tools {{CURRENT_YEAR}}
[product category] comparison
```

**5. Comparison Keywords (Capture evaluators)**
```
[product category] comparison
best [category] for [use case]
[competitor A] vs [competitor B] (insert yourself)
[product category] reviews
```

#### Match Types

| Match Type | Syntax | Example | When to Use |
|-----------|--------|---------|-------------|
| **Exact** | [keyword] | [project management tool] | Highest control, start here for core terms |
| **Phrase** | "keyword" | "project management tool" | Moderate reach with relevance |
| **Broad** | keyword | project management tool | Maximum reach, use only with smart bidding and strong negative keywords |

**Starting strategy:** Use exact match for your top 10-20 keywords. Add phrase match once you see which terms convert. Use broad match only after you have 50+ conversions/month and are using automated bidding.

#### Negative Keywords

Essential negative keyword list to prevent wasted spend:

```
Negative Keywords -- Add These Immediately:

Generic waste:
free, cheap, discount, coupon, crack, pirated, torrent, open source (if not applicable)

Job-related:
jobs, career, salary, hiring, interview, resume, certification, course, tutorial (if not a learning product)

Informational:
what is, definition, meaning, wikipedia, example, template (evaluate -- some may be good)

DIY:
how to build, how to make, create your own, build your own, DIY

Irrelevant modifiers:
[your product for industries you don't serve]
[your product in locations you don't serve]
```

Review the Search Terms report weekly and add new negatives.

### Ad Copy

Google Responsive Search Ads allow up to 15 headlines (30 characters each) and 4 descriptions (90 characters each). Google tests combinations automatically.

#### Headline Formulas (30 characters max each)

**Problem-Solution:**
- "Stop Wasting Time on [Task]"
- "Tired of [Pain Point]?"
- "[Problem]? We Fix That"
- "Eliminate [Pain] Forever"

**Feature-Benefit:**
- "[Feature] Built for [Audience]"
- "[Benefit] in Minutes, Not Hours"
- "Automate Your [Task]"
- "[Feature] That Actually Works"

**Social Proof:**
- "Trusted by {{USER_COUNT}}+ Teams"
- "{{RATING}} Stars on G2 Reviews"
- "Join {{USER_COUNT}}+ {{TARGET_AUDIENCE}}"
- "#1 Rated [Category] Tool"

**CTA:**
- "Start Your Free Trial Today"
- "Try Free -- No Card Required"
- "Get Started in 2 Minutes"
- "See It in Action -- Free Demo"

**Comparison/Competitive:**
- "Better Than [Competitor]"
- "The [Competitor] Alternative"
- "Switch in Under 10 Minutes"
- "Why Teams Leave [Competitor]"

#### Description Formulas (90 characters max each)

**Description template 1 (Problem + Solution):**
"[Pain point] slowing you down? {{PROJECT_NAME}} helps {{TARGET_AUDIENCE}} [achieve outcome]. Try free."

**Description template 2 (Social proof + CTA):**
"Join {{USER_COUNT}}+ teams who [achieved result] with {{PROJECT_NAME}}. Start your free trial today."

**Description template 3 (Feature list + CTA):**
"[Feature 1], [Feature 2], and [Feature 3] -- all in one platform. No credit card required."

**Description template 4 (Urgency + Benefit):**
"Start [achieving benefit] today. Set up in minutes, not weeks. Free {{TRIAL_LENGTH}}-day trial."

### Ad Extensions

Extensions increase ad real estate and CTR by 10-20%. Set up all of these:

**Sitelink Extensions (4-6 links):**
- Pricing -- link to pricing page
- Features -- link to features page
- Case Studies -- link to customer stories
- Free Trial -- link to signup
- Demo -- link to demo booking
- Documentation -- link to docs (for dev tools)

**Callout Extensions (4-6 short phrases):**
- "No Credit Card Required"
- "Free {{TRIAL_LENGTH}}-Day Trial"
- "24/7 Support"
- "Setup in Minutes"
- "SOC 2 Compliant" (if applicable)
- "{{USER_COUNT}}+ Happy Customers"

**Structured Snippets:**
- Type: "Features" -- list your top features
- Type: "Types" -- list product tiers or editions

**Price Extensions:**
- Show pricing tiers directly in the ad
- Only if your pricing is competitive and clear

### Landing Page Requirements

Your landing page must match the ad's promise. Key requirements:

1. **Message match** - The headline on the page should echo the ad headline. If the ad says "Project Management for Remote Teams," the page should say something similar, not "Welcome to Our Product."
2. **Relevance** - The page content must directly address the keyword intent. Create separate landing pages for different keyword themes.
3. **Speed** - Target under 3 seconds load time. Use Google PageSpeed Insights to test. Slow pages destroy Quality Score and conversion rates.
4. **Mobile-optimized** - 50%+ of traffic may be mobile. Test your pages on actual phones.
5. **Clear CTA** - One primary action above the fold. Do not overwhelm with choices.
6. **Trust signals** - Logos, testimonials, security badges, ratings visible without scrolling.

---

## Display Ads

### When to Use Display

- **Retargeting** - Show ads to people who visited your site but did not convert (highest ROI use of Display)
- **Awareness** - Reach people who have never heard of you at a very low CPC ($0.20-1.00)
- **Not for:** Direct response from cold audiences (conversion rates are very low)

### Audience Targeting for Display

- **Remarketing audiences** (website visitors) -- primary use case
- **Custom intent audiences** (people searching for your keywords on Google)
- **In-market audiences** (people Google identifies as actively shopping your category)
- **Lookalike / Similar audiences** (people similar to your converters)

### Placement Exclusions

Exclude these to prevent wasted spend on Display:
- Mobile app placements (accidental clicks from games)
- Parked domains
- Below-the-fold placements
- Sensitive content categories

Add this exclusion list in your campaign settings under "Content exclusions."

### Responsive Display Ads

Provide these assets and Google assembles ads automatically:
- 5+ landscape images (1200x628)
- 5+ square images (1200x1200)
- 1+ logo images
- 5 headlines (30 chars)
- 5 long headlines (90 chars)
- 5 descriptions (90 chars)
- Business name
- Final URL

---

## YouTube Ads

### Ad Formats

| Format | Length | Skippable | Best For | Cost Model |
|--------|--------|-----------|----------|------------|
| Skippable In-Stream | 15s-3min | After 5 seconds | Product demos, testimonials | Cost per view (CPV) |
| Non-Skippable In-Stream | 15 seconds max | No | Short brand messages | CPM (cost per 1000 views) |
| Bumper Ads | 6 seconds max | No | Brand awareness, reminders | CPM |
| In-Feed Video | Any length | N/A (user clicks to watch) | Educational content | CPC |

### Video Creation Tips for {{PROJECT_NAME}}

1. **Hook in first 5 seconds** - State the problem or ask a question. You lose skippable viewers at second 5.
2. **Show the product early** - Do not wait until the end. Show your product solving the problem within the first 15 seconds.
3. **Keep it under 60 seconds** for ads. You can go longer for in-feed educational content.
4. **Include captions** - Many viewers watch without sound.
5. **End with a clear CTA** - Tell them exactly what to do next.
6. **Production quality** - Does not need to be Hollywood. Screen recordings with voiceover work well for tech products.

---

## Bidding Strategies

| Strategy | When to Use | Min Data Needed | Risk Level |
|----------|-------------|-----------------|------------|
| **Manual CPC** | Starting out, learning | None | Low (full control) |
| **Enhanced CPC** | After 2 weeks of data | 15+ conversions/month | Low-Medium |
| **Target CPA** | After proving profitability | 30+ conversions/month | Medium |
| **Maximize Conversions** | Scaling with budget constraint | 50+ conversions/month | Medium-High |
| **Target ROAS** | Revenue optimization | 50+ conversions with values | Medium-High |

**Recommendation for {{PROJECT_NAME}}:**
1. Start with Manual CPC for the first 2-4 weeks
2. Switch to Enhanced CPC once you have 15+ conversions
3. Move to Target CPA once you have 30+ conversions/month and a stable CPA
4. Never jump straight to automated bidding without historical data

---

## Budget Management

### Daily vs Monthly Budget

Google uses a daily budget but can spend up to 2x your daily budget on high-opportunity days. Over a month, it will not exceed your daily budget times 30.4.

```
Monthly budget: $1,000
Daily budget setting: $1,000 / 30.4 = ~$33/day
```

### Bid Adjustments

Fine-tune bids without creating separate campaigns:

| Dimension | Adjustment Range | Example |
|-----------|-----------------|---------|
| Device | -100% to +300% | Reduce mobile bids 20% if mobile converts poorly |
| Location | -90% to +300% | Increase bids 30% in high-converting cities |
| Time of day | -90% to +300% | Reduce bids 50% between midnight and 6 AM |
| Audience | -90% to +300% | Increase bids 50% for remarketing audiences |

### Budget Allocation Across Campaigns

```
Branded search campaigns:          10-15% of budget
Non-branded search (high-intent):  40-50% of budget
Non-branded search (research):     15-20% of budget
Retargeting (Display):             15-20% of budget
YouTube / Awareness:               5-10% of budget
```

---

## Quality Score Optimization

Quality Score (1-10) determines your ad rank and actual CPC. Higher Quality Score = lower costs + better positions.

### Quality Score Components

| Component | Weight | How to Improve |
|-----------|--------|---------------|
| **Expected CTR** | ~40% | Write compelling ads, use ad extensions, improve targeting |
| **Ad Relevance** | ~25% | Include keywords in headlines, match ad groups to tight keyword themes |
| **Landing Page Experience** | ~35% | Fast load time, mobile-friendly, relevant content, clear navigation |

### Quality Score Improvement Checklist

- [ ] Each ad group has 5-20 tightly related keywords
- [ ] Ad headlines include the primary keyword or close variant
- [ ] Landing page headline matches the ad headline
- [ ] Landing page loads in under 3 seconds
- [ ] Landing page is mobile-responsive
- [ ] Landing page has clear, relevant content
- [ ] Ad extensions are set up (sitelinks, callouts, structured snippets)
- [ ] CTR is above 3% for search ads (if below, rewrite ads)

---

## A/B Testing

### What to Test in Google Ads

**Ad Copy Tests:**
- Headline angles: problem vs benefit vs social proof vs CTA
- Description variations: feature-focused vs outcome-focused
- CTA variations: "Try free" vs "Start now" vs "See demo"

**Landing Page Tests:**
- Headline copy
- Hero image vs product screenshot vs video
- CTA button text and color
- Form length (fewer fields vs more qualifying fields)
- Social proof placement and type

**Bidding Tests:**
- Run campaign experiments to test Manual CPC vs Target CPA
- Test different Target CPA values (+/- 20%)

### Testing Framework

1. Change one variable at a time
2. Run tests for at least 2 weeks or until 100+ clicks per variant
3. Use Google's Campaign Experiments feature for fair budget splitting
4. Document all tests and results in your testing log

---

## Reporting and Optimization

### Weekly Optimization Checklist (30 minutes)

- [ ] Review Search Terms report -- add negative keywords for irrelevant terms
- [ ] Check Quality Scores -- investigate any scores below 6
- [ ] Pause underperforming keywords (high spend, zero conversions after 100+ clicks)
- [ ] Review ad performance -- pause ads with CTR below 2%
- [ ] Check budget pacing -- are campaigns limited by budget?
- [ ] Review device, location, and time-of-day performance
- [ ] Check competitor ads -- search your keywords and note competitor messaging

### Monthly Optimization Checklist (2 hours)

- [ ] Full campaign performance review (see reporting template in paid-ads-strategy.template.md)
- [ ] Add new keyword ideas from Search Terms report
- [ ] Refresh ad copy (introduce new variants, pause old losers)
- [ ] Review landing page conversion rates
- [ ] Audit conversion tracking (test a conversion end-to-end)
- [ ] Review audience performance and adjust bid modifiers
- [ ] Competitor analysis -- any new competitors bidding on your terms?
- [ ] Update negative keyword lists

### Key Metrics Dashboard

| Metric | This Week | Last Week | Change | Action Needed |
|--------|-----------|-----------|--------|---------------|
| Spend | $____ | $____ | ___% | |
| Clicks | ____ | ____ | ___% | |
| CTR | ___% | ___% | ___% | Below 3%? Rewrite ads |
| Conversions | ____ | ____ | ___% | |
| CPA | $____ | $____ | ___% | Above target? Optimize |
| ROAS | ___:1 | ___:1 | ___% | Below 3:1? Investigate |
| Quality Score (avg) | ___ | ___ | | Below 7? Fix relevance |

---

## Common Google Ads Mistakes

### Mistake 1: Using Smart Campaigns
Smart Campaigns are Google's simplified mode. They give you almost no control over targeting, bidding, or optimization. Always use Expert Mode.

### Mistake 2: One Ad Group with 100 Keywords
Each ad group should have 5-20 closely related keywords so your ads can be highly relevant. The "single keyword ad group" (SKAG) approach, while extreme, illustrates the principle.

### Mistake 3: Ignoring Search Terms Report
The Search Terms report shows you exactly what people typed before clicking your ad. Review it weekly and add negative keywords for irrelevant terms.

### Mistake 4: Not Using Ad Extensions
Extensions are free and increase CTR by 10-20%. There is no reason not to use sitelinks, callouts, and structured snippets.

### Mistake 5: Sending Traffic to Your Homepage
Create dedicated landing pages for each campaign theme. Homepage visitors have to figure out what to do. Landing page visitors are guided directly to convert.

### Mistake 6: Setting and Forgetting
Google Ads require ongoing optimization. Plan for at least 30 minutes per week of active management. Unmanaged campaigns waste money.

### Mistake 7: Jumping to Automated Bidding Too Early
Target CPA and Maximize Conversions need historical data to work. Start with Manual CPC, collect 30+ conversions, then switch.

### Mistake 8: Not Tracking Offline Conversions
If your sales process involves demos or calls, import offline conversion data back into Google Ads so the algorithm can optimize for actual revenue, not just form fills.

### Mistake 9: Broad Match Without Guardrails
Broad match keywords without smart bidding and strong negative keywords will drain your budget on irrelevant searches.

### Mistake 10: Not Bidding on Your Own Brand Name
Competitors will bid on your brand name. Even if you rank #1 organically, branded search ads are cheap ($0.10-0.50 CPC) and protect your traffic.

---

## Quick-Start Checklist for {{PROJECT_NAME}}

- [ ] Create Google Ads account in Expert Mode
- [ ] Set up billing and monthly spending limit
- [ ] Install Google Tag and verify it fires correctly
- [ ] Create conversion actions (signup, trial, purchase)
- [ ] Link Google Analytics 4 to Google Ads
- [ ] Research 20-30 keywords across all five categories
- [ ] Create initial negative keyword list
- [ ] Build 3-5 ad groups with tightly themed keywords
- [ ] Write 10+ headline variants and 4+ description variants
- [ ] Set up all ad extensions (sitelinks, callouts, snippets)
- [ ] Create or optimize landing pages for each ad group theme
- [ ] Set daily budget and Manual CPC bidding
- [ ] Launch and monitor daily for first week
- [ ] Schedule weekly 30-minute optimization sessions
