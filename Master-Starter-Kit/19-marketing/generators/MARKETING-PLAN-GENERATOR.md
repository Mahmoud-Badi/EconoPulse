# Marketing Plan Generator

**Purpose:** Read the MARKETING_CONFIG from the orchestrator STATE BLOCK, project brief,
personas, competitor data from Tribunal, and channel priority matrix, then generate a
comprehensive marketing strategy document with phased execution plan.

**Output:** `marketing/marketing-plan.md`

---

## When to Run

Run this generator after completing:
1. Marketing Intake (Step 19) -- MARKETING_CONFIG is populated
2. Channel Decision Tree (Step 20) -- channel priority matrix exists
3. Brand & Messaging (Step 21) -- brand voice guide and messaging framework exist

This generator consolidates all upstream marketing work into a single strategic plan.

---

## Inputs Required

Before running this prompt, gather these files:

| Input | Location | What it provides |
|-------|----------|-----------------|
| MARKETING_CONFIG | Orchestrator STATE BLOCK | All marketing intake answers: product type, budget, audience, goals |
| Project Brief | `dev_docs/PROJECT-BRIEF.md` | Product description, vision, MVP scope |
| User Personas | `dev_docs/user-personas.md` | Target user descriptions, pain points, behaviors |
| Tribunal Competitor Research | `{{TRIBUNAL_OUTPUT_PATH}}/02-competitor-research/` | Competitor features, pricing, positioning |
| Tribunal Executive Summary | `{{TRIBUNAL_OUTPUT_PATH}}/executive-summary.md` | Market opportunity, strategic direction |
| Channel Priority Matrix | `marketing/channels/channel-priority-matrix.md` | Ranked channels with tier assignments |
| Brand Voice Guide | `marketing/brand-messaging/brand-voice-guide.md` | Tone, voice, personality |
| Messaging Framework | `marketing/brand-messaging/messaging-framework.md` | Key messages, value propositions, proof points |
| Value Proposition Canvas | `marketing/brand-messaging/value-proposition-canvas.md` | Jobs-to-be-done, pains, gains |

---

## Generation Algorithm

1. **Read MARKETING_CONFIG.** Extract all stop-gate values:
   - `{{PRODUCT_TYPE}}` -- determines strategy template
   - `{{MARKETING_BUDGET}}` -- determines resource allocation
   - `{{UNIQUE_VALUE_PROP}}` -- drives all messaging
   - `{{PLAIN_ENGLISH_DESCRIPTION}}` -- used in executive summary
   - `{{PRIMARY_PLATFORMS}}` -- where the audience lives
   - `{{LAUNCH_TIMELINE}}` -- determines urgency and phasing
   - `{{SUCCESS_METRICS_90_DAY}}` -- sets KPI targets
   - `{{BUYER_JOURNEY_LENGTH}}` -- determines funnel depth
   - `{{MARKET_POSITIONING}}` -- drives tone and competitive approach

2. **Read the project brief and tribunal output.** Extract:
   - Market size and opportunity
   - Competitor strengths and weaknesses
   - Feature differentiation points
   - Pricing landscape

3. **Read the channel priority matrix.** Import:
   - Tier 1, 2, 3 channel assignments with scores
   - Eliminated channels and reasons
   - Budget allocation per channel
   - Time allocation per channel

4. **Read brand voice guide and messaging framework.** Import:
   - Brand personality and tone guidelines
   - Primary and secondary messaging hierarchy
   - Proof points and evidence for each claim
   - Objection handling points

5. **Synthesize into the marketing plan format below.**

6. **Apply conditional logic** based on `{{PRODUCT_TYPE}}` and `{{MARKETING_BUDGET}}` to select the appropriate strategy sections.

7. **Validate** against quality gates before finalizing.

---

## Output Format

Write to `marketing/marketing-plan.md`:

```markdown
# Marketing Plan -- {{PROJECT_NAME}}

> **Product Type:** {{PRODUCT_TYPE}}
> **Budget Tier:** {{MARKETING_BUDGET}} ({{MARKETING_BUDGET_AMOUNT}}/mo)
> **Launch Timeline:** {{LAUNCH_TIMELINE}}
> **Generated:** {{DATE}}
> **Status:** Draft -- review and approve before execution

---

## 1. Executive Summary

### The Product
{{PLAIN_ENGLISH_DESCRIPTION}}

### The Opportunity
{2-3 sentences on market size, growth trends, and why NOW is the right time.
Pull from tribunal market research. Include specific numbers where available.}

### The Strategy (One Paragraph)
{Summarize the entire plan in 4-5 sentences: who you are targeting, how you will
reach them, what channels you will prioritize, and what success looks like in 90 days.
This paragraph should be quotable -- a founder should be able to read this aloud and
have their team understand the marketing direction.}

### Key Metrics Target (90 Days)
| Metric | Target | Current Baseline |
|--------|--------|-----------------|
| Users/Customers | {{SUCCESS_METRICS_90_DAY.users}} | 0 |
| Monthly Website Visitors | {{SUCCESS_METRICS_90_DAY.monthly_visitors}} | 0 |
| Email Subscribers | {{SUCCESS_METRICS_90_DAY.email_subscribers}} | 0 |
| Revenue | {{SUCCESS_METRICS_90_DAY.revenue}} | $0 |
| {Product-specific metric} | {target} | 0 |

---

## 2. Target Audience Analysis

### Primary Persona: {Name}
| Attribute | Detail |
|-----------|--------|
| **Role/Title** | {job title or role description} |
| **Demographics** | {age range, location, company size} |
| **Pain Points** | {top 3 pains -- use THEIR language from CUSTOMER_LANGUAGE} |
| **Goals** | {what they are trying to achieve} |
| **Where They Hang Out** | {platforms from PRIMARY_PLATFORMS} |
| **How They Discover Products** | {search, social, word-of-mouth, etc.} |
| **Buying Triggers** | {what makes them start looking for a solution} |
| **Objections** | {top 3 reasons they would NOT buy} |

### Secondary Persona: {Name}
{Same table structure. Include 2-3 personas total.}

### Audience Size Estimate
{Estimate the total addressable audience across identified platforms. Pull from
tribunal market sizing. Example: "There are approximately 50,000 small trucking
companies in the US. Of these, ~15,000 are actively searching for TMS solutions."}

---

## 3. Positioning & Messaging

### Positioning Statement
For {target audience} who {need/pain point}, {{PROJECT_NAME}} is a {product category}
that {key benefit}. Unlike {primary competitor}, {{PROJECT_NAME}} {primary differentiator}.

### Messaging Hierarchy
| Level | Message | Where It Appears |
|-------|---------|-----------------|
| **Headline** (5-8 words) | {primary value in shortest form} | Homepage hero, ads, social bios |
| **Tagline** (10-15 words) | {expanded value proposition} | Landing pages, email headers |
| **Elevator Pitch** (30 seconds) | {full positioning in 2-3 sentences} | Sales calls, investor pitches, about pages |
| **Full Story** (2 minutes) | {complete narrative with proof points} | Blog posts, PR, case studies |

### Competitive Differentiation Matrix
| Feature/Attribute | {{PROJECT_NAME}} | {Competitor 1} | {Competitor 2} | {Competitor 3} |
|-------------------|-----------------|----------------|----------------|----------------|
| {Key feature 1} | {detail} | {detail} | {detail} | {detail} |
| {Key feature 2} | {detail} | {detail} | {detail} | {detail} |
| **Pricing** | {detail} | {detail} | {detail} | {detail} |
| **Best For** | {ideal user} | {ideal user} | {ideal user} | {ideal user} |

---

## 4. Channel Strategy (Priority-Ranked)

### Tier 1 Channels -- Start Immediately
{For each Tier 1 channel from the channel priority matrix:}

#### Channel: {Name}
- **Score:** {X}/25
- **Monthly Budget:** ${X}
- **Weekly Time:** {X} hours
- **Owner:** {who manages this channel}
- **Strategy:** {3-5 sentences on HOW to use this channel, specific to the product}
- **Content Mix:** {what types of content to create for this channel}
- **KPIs:** {2-3 measurable goals for this channel at 30/60/90 days}
- **Tools:** {specific tools to use -- include free alternatives}
- **First Week Actions:**
  1. {Specific action item}
  2. {Specific action item}
  3. {Specific action item}

{Repeat for each Tier 1 channel.}

### Tier 2 Channels -- Add in Month 2-3
{Same structure as Tier 1, but with later start dates.}

### Tier 3 Channels -- Scale Later
{Abbreviated format: channel name, score, rationale, trigger for activation.}

### Channels Eliminated
| Channel | Reason | Reconsider When |
|---------|--------|-----------------|
| {channel} | {reason from decision tree} | {condition that would change the decision} |

---

## 5. 90-Day Roadmap

### Month 1: Foundation (Days 1-30)

**Theme:** Set up infrastructure, create foundational assets, begin Tier 1 channels.

#### Week 1-2: Infrastructure
- [ ] Set up analytics (Google Analytics 4, Plausible, or Mixpanel)
- [ ] Set up email marketing tool ({recommendation based on budget})
- [ ] Create social media accounts on Tier 1 platforms
- [ ] Finalize landing page copy (use Landing Page Copy Generator output)
- [ ] Set up conversion tracking and attribution
- [ ] Install UTM parameter system for link tracking

#### Week 2-3: Content Foundation
- [ ] Publish landing page with email capture
- [ ] Write and schedule first batch of social content (use Social Content Generator)
- [ ] Set up welcome email sequence (use Email Sequence Generator)
- [ ] Create "about" and "why us" content pieces
- [ ] Submit to first batch of directories (use directory-master-list.md)

#### Week 3-4: Channel Launch
- [ ] Begin posting on Tier 1 social channels (follow Social Content Generator cadence)
- [ ] Publish first 2 blog posts / content pieces (if content marketing is Tier 1)
- [ ] Launch first paid ad campaign with small budget test (if paid ads are Tier 1)
- [ ] Begin community participation (if Reddit/HN/communities are Tier 1)
- [ ] Send first email to subscribers

**Month 1 Milestones:**
| Metric | Target |
|--------|--------|
| Email subscribers | {realistic target based on budget/channels} |
| Website visitors | {target} |
| Social followers (combined) | {target} |
| Content pieces published | {target} |

### Month 2: Growth (Days 31-60)

**Theme:** Activate Tier 2 channels, optimize Tier 1 based on data, scale what works.

#### Key Activities
- [ ] Review Month 1 analytics -- identify top-performing channels and content
- [ ] Double down on highest-performing Tier 1 channel
- [ ] Activate Tier 2 channels (following channel priority matrix)
- [ ] A/B test landing page copy (headline, CTA, social proof)
- [ ] Launch sales nurture email sequence for warm leads
- [ ] Create comparison pages ({{PROJECT_NAME}} vs {Competitor})
- [ ] Publish case study or user story (if users exist)
- [ ] {Product-type-specific activities -- see conditional sections below}

**Month 2 Milestones:**
| Metric | Target |
|--------|--------|
| Email subscribers | {target -- 2-3x Month 1} |
| Website visitors | {target -- 2x Month 1} |
| Trial/sign-up conversions | {target} |
| Content pieces published | {target} |

### Month 3: Optimize (Days 61-90)

**Theme:** Optimize conversion funnels, prepare for scaling, establish repeatable processes.

#### Key Activities
- [ ] Full funnel analysis: traffic → lead → trial → conversion rates
- [ ] Optimize weakest funnel stage (where are people dropping off?)
- [ ] Establish content creation cadence (sustainable publishing schedule)
- [ ] Build content repurposing pipeline (blog → social → email → video)
- [ ] Evaluate channel ROI -- cut underperforming channels
- [ ] Plan Month 4-6 strategy based on data
- [ ] {Scale activities for high-performing channels}

**Month 3 / 90-Day Milestone Check:**
| Metric | Target | Status |
|--------|--------|--------|
| Users/Customers | {{SUCCESS_METRICS_90_DAY.users}} | {actual} |
| Monthly Visitors | {{SUCCESS_METRICS_90_DAY.monthly_visitors}} | {actual} |
| Email Subscribers | {{SUCCESS_METRICS_90_DAY.email_subscribers}} | {actual} |
| Revenue | {{SUCCESS_METRICS_90_DAY.revenue}} | {actual} |

---

## 6. Budget Allocation

### Monthly Budget Breakdown

{Generate the appropriate table based on {{MARKETING_BUDGET}}:}

| Category | Monthly Cost | % of Budget | Notes |
|----------|-------------|-------------|-------|
| Tools & Platforms | ${X} | {X}% | {specific tools} |
| Paid Advertising | ${X} | {X}% | {platforms} |
| Content Creation | ${X} | {X}% | {in-house vs freelance} |
| Influencer/Partnerships | ${X} | {X}% | {approach} |
| Directories & Listings | ${X} | {X}% | {premium vs free} |
| Reserve/Testing | ${X} | {X}% | Experiments and new channels |
| **Total** | **${X}** | **100%** | |

### Tool Stack Recommendations
| Tool | Purpose | Cost | Free Alternative |
|------|---------|------|-----------------|
| {Tool 1} | {purpose} | ${X}/mo | {free alt} |
| {Tool 2} | {purpose} | ${X}/mo | {free alt} |

---

## 7. KPI Dashboard

### Leading Indicators (measure weekly)
| KPI | Target | Measurement Tool |
|-----|--------|-----------------|
| Website sessions | {target}/week | Google Analytics |
| Email open rate | >30% | Email platform |
| Social engagement rate | >{X}% | Platform analytics |
| New email subscribers | {target}/week | Email platform |
| Content published | {target}/week | Editorial calendar |

### Lagging Indicators (measure monthly)
| KPI | Target | Measurement Tool |
|-----|--------|-----------------|
| Trial-to-paid conversion | >{X}% | Product analytics |
| Customer acquisition cost (CAC) | <${X} | Attribution tracking |
| Monthly recurring revenue (MRR) | ${X} | Billing system |
| Organic search traffic | {target}/mo | Google Search Console |
| Domain authority | >{X} | Ahrefs / Moz |

### Reporting Cadence
- **Weekly:** Traffic, email metrics, social engagement, ad spend
- **Monthly:** Full KPI review, channel ROI analysis, budget reconciliation
- **Quarterly:** Strategy review, channel re-prioritization, goal adjustment

---

## 8. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low initial traffic | High | Medium | Set realistic expectations; focus on conversion rate before traffic volume |
| Paid ads burn budget fast | Medium | High | Start with small daily budgets ($5-10/day); set strict daily caps; pause underperformers after 7 days |
| Content creation burnout | High | Medium | Batch content creation; repurpose across channels; use AI tools for drafts |
| Platform algorithm change | Medium | Medium | Never depend on a single channel; always build email list as owned channel |
| Competitor copies positioning | Low | Medium | Move fast; build brand equity that cannot be copied; deepen niche expertise |
| Launch delay impacts marketing timeline | Medium | High | Decouple marketing prep from launch; build email list and content before product is ready |

---

## 9. Cross-References

| Asset | Generator | Template Location |
|-------|-----------|------------------|
| Landing page copy | LANDING-PAGE-COPY-GENERATOR.md | `19-marketing/generators/` |
| Email sequences | EMAIL-SEQUENCE-GENERATOR.md | `19-marketing/generators/` |
| Social media content | SOCIAL-CONTENT-GENERATOR.md | `19-marketing/generators/` |
| Ad copy | AD-COPY-GENERATOR.md | `19-marketing/generators/` |
| Competitor analysis | COMPETITOR-MARKETING-ANALYZER.md | `19-marketing/generators/` |
| Brand voice guide | brand-voice-guide.template.md | `19-marketing/brand-messaging/` |
| Messaging framework | messaging-framework.template.md | `19-marketing/brand-messaging/` |
| Channel decision tree | channel-decision-tree.md | `19-marketing/` |
| Directory listings | directory-master-list.md | `19-marketing/directory-and-listings/` |
```

---

## Conditional Sections by Product Type

<!-- IF {{PRODUCT_TYPE}} == "saas" -->

### SaaS-Specific Strategy Additions

Add these sections to the marketing plan when product type is SaaS:

**Conversion Funnel Strategy:**
- Homepage → Features page → Pricing page → Sign up → Onboarding → Activation → Upgrade
- Identify the conversion rate target for each step
- Free trial length optimization: 7 vs 14 vs 30 days
- Credit card upfront vs no credit card tradeoffs

**Comparison Content Strategy:**
- Create "{{PROJECT_NAME}} vs {Competitor}" pages for top 3-5 competitors
- Create "Best {Category} Tools in {Year}" roundup page (include yourself)
- Create "How to Migrate from {Competitor} to {{PROJECT_NAME}}" guides

**SaaS Metrics to Add:**
- Trial-to-paid conversion rate (target: 5-15%)
- Time to first value (measure and optimize)
- Feature adoption rate per plan tier
- Expansion revenue from upgrades

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->

### Mobile App-Specific Strategy Additions

**App Store Optimization (ASO):**
- Keyword research for app store search (see APP-STORE-LISTING-GENERATOR.md)
- Screenshot A/B testing plan
- Review solicitation strategy (ask happy users at peak engagement moments)
- Ratings target: maintain 4.5+ average

**Mobile-Specific Metrics:**
- Cost per install (CPI) target: <${X}
- Day 1 retention target: >40%
- Day 7 retention target: >20%
- Day 30 retention target: >10%

**Push Notification Strategy:**
- Welcome notification (day 0): {content}
- Re-engagement (day 3): {content}
- Feature discovery (day 7): {content}
- Win-back (day 14 if inactive): {content}

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->

### Marketplace-Specific Strategy Additions

**Chicken-and-Egg Strategy:**
- Which side to acquire first: {supply/demand} -- rationale: {reason}
- Single-player mode: how to provide value to one side without the other
- Geographic focus: start in {location} and expand after achieving liquidity

**Two-Sided Marketing:**
- Supply-side acquisition channels: {channels}
- Demand-side acquisition channels: {channels}
- Cross-side network effects messaging: "Join because X providers/buyers are already here"

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->

### Dev Tool-Specific Strategy Additions

**Developer Marketing Rules:**
- No marketing-speak -- all content must be technically accurate and honest
- Documentation IS marketing -- invest in docs quality
- Build in public: share development decisions, architecture, benchmarks
- Open source strategy: what to open source and what to keep proprietary

**Developer-Specific Content:**
- Technical blog posts (benchmarks, comparisons, architecture decisions)
- "Getting started" tutorial (under 5 minutes to first success)
- Integration guides for popular tools/frameworks
- API documentation with real-world examples

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "client_site" -->

### Client/Agency Site-Specific Strategy Additions

**Local Marketing Strategy:**
- Google Business Profile optimization
- Local SEO: city + service keyword targeting
- Review acquisition from existing clients
- Referral incentive program

**Portfolio & Case Study Strategy:**
- Convert each completed project into a case study with metrics
- Before/after format with specific results
- Industry-specific landing pages

<!-- ENDIF -->

---

## Conditional Sections by Budget Tier

<!-- IF {{MARKETING_BUDGET}} == "bootstrap" -->

### Bootstrap Budget Strategy

**Constraint:** $0/month. All marketing is organic and sweat-equity.

**Priority Order:**
1. Landing page with email capture (build yourself, use free hosting)
2. One social media channel (pick the ONE where your audience is densest)
3. Email welcome sequence (free tier of ConvertKit/Mailchimp/Buttondown)
4. Community participation (Reddit, HN, forums -- free but time-intensive)
5. Product Hunt launch (free, one-time effort with high potential return)

**Content Batching Strategy:**
- Write 4 pieces of content in one 4-hour session per month
- Each blog post becomes 5 social posts, 1 email, and 1 community discussion topic
- Use AI tools (Claude, ChatGPT) for first drafts, then edit for authenticity

**Tools (All Free):**
- Email: Buttondown (free under 100 subs) or Mailchimp (free under 500)
- Analytics: Plausible CE (self-hosted) or Google Analytics 4
- Social scheduling: Buffer free tier (3 channels, 10 scheduled posts)
- Landing page: Carrd ($0 free tier) or custom-built
- Design: Canva free tier for social graphics

<!-- ENDIF -->

<!-- IF {{MARKETING_BUDGET}} == "small" -->

### Small Budget Strategy ($100-500/mo)

**Budget Split:**
- $30-50/mo: Essential tools (email, SEO research)
- $50-200/mo: Small paid ad experiments (ONE platform only)
- $20-50/mo: Social scheduling and design tools
- Remaining: Content freelancer for 1-2 posts/month (optional)

**Ad Experimentation Protocol:**
- Start with $5/day on ONE ad platform
- Run 3 ad variants for 7 days each
- Kill ads with CPA > 2x target after 7 days
- Scale winners to $10-15/day
- Switch platforms if no winner after 30 days

<!-- ENDIF -->

<!-- IF {{MARKETING_BUDGET}} == "medium" -->

### Medium Budget Strategy ($500-2,000/mo)

**Budget Split:**
- $100-200/mo: Tools and platforms
- $200-800/mo: Paid advertising (search OR social, start with one)
- $200-500/mo: Content creation (freelance writer or AI + editing)
- $50-200/mo: Directories and listings (premium placements)
- $50-100/mo: Reserve for experiments

<!-- ENDIF -->

<!-- IF {{MARKETING_BUDGET}} == "growth" || {{MARKETING_BUDGET}} == "scale" -->

### Growth/Scale Budget Strategy ($2,000+/mo)

**Budget Split:**
- 35-45%: Paid acquisition (diversified across 2-3 platforms)
- 20-25%: Content production (freelance team or in-house)
- 10-15%: Tools, analytics, and automation
- 10-15%: Influencer partnerships and sponsorships
- 5-10%: Experimental channels
- 5%: Reserve

**Scaling Protocol:**
- Only scale channels with proven positive ROI
- Increase ad spend by max 20% per week (not per day)
- Hire dedicated marketing person when budget exceeds $5K/mo
- Consider marketing agency when budget exceeds $10K/mo

<!-- ENDIF -->

---

## Quality Gates

Before finalizing the marketing plan, verify ALL of these:

### Completeness Gates
- [ ] Executive summary is readable as a standalone document
- [ ] Every persona from user-personas.md is addressed in the audience analysis
- [ ] Every Tier 1 channel has specific first-week action items
- [ ] 90-day roadmap has concrete weekly deliverables for Month 1
- [ ] Budget allocation sums to exactly the stated marketing budget
- [ ] Every KPI has a specific numeric target and measurement tool

### Consistency Gates
- [ ] Positioning statement matches the messaging framework
- [ ] Channel selection matches the channel priority matrix output
- [ ] Budget allocation matches the budget tier recommendations from channel-decision-tree.md
- [ ] KPI targets align with `SUCCESS_METRICS_90_DAY` from MARKETING_CONFIG
- [ ] Brand voice in all copy examples matches the brand voice guide

### Feasibility Gates
- [ ] Time required across all channels does not exceed `{{WEEKLY_MARKETING_HOURS}}`
- [ ] Budget required does not exceed `{{MARKETING_BUDGET_AMOUNT}}`
- [ ] Content publishing cadence is sustainable for stated time commitment
- [ ] No channel requires skills or tools that are explicitly unavailable

### Strategic Gates
- [ ] Plan addresses all three buyer journey stages (awareness, consideration, conversion)
- [ ] At least one owned channel is prioritized (email list, blog, documentation)
- [ ] Competitive differentiation is clear and defensible
- [ ] Risk mitigation addresses the top 3 most likely failure modes
- [ ] Plan has a clear "what to cut first" priority if time/budget is reduced

---

## Validation Checklist

After generation, verify:
- [ ] All `{{PLACEHOLDER}}` variables are resolved from MARKETING_CONFIG
- [ ] Conditional sections match the actual product type and budget tier
- [ ] Cross-references point to files that exist or will be generated
- [ ] 90-day roadmap is achievable within stated constraints
- [ ] No channel appears in both "Tier 1" and "Eliminated" sections
- [ ] Budget math is correct (all line items sum to total)
- [ ] KPI targets are realistic for the budget and channel mix (check against benchmarks)
- [ ] The plan can be executed by someone who reads ONLY this document
