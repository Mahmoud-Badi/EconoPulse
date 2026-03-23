# Marketing Budget Framework

> **Purpose:** Detailed budget allocation guidance by tier, stage, channel, and tool — so you never wonder "how much should I spend on X?"
> **Used in:** Orchestrator Steps 19-28 (referenced throughout marketing asset generation)
> **Input:** `{{MARKETING_BUDGET}}` from `MARKETING_CONFIG` (collected in Step 19)
> **Output:** `marketing/budget/budget-allocation.md` and `marketing/budget/tool-stack.md`

---

## Budget Philosophy

Three rules govern every recommendation in this framework:

1. **Never spend money to validate messaging. Validate with organic first, then amplify with paid.** If your blog post gets zero engagement, paying to promote it just wastes money faster. If your landing page does not convert organic traffic, ads will not fix it.

2. **Tools should cost less than 15% of your total marketing budget.** If you are spending $500/mo on tools and $100/mo on actual marketing activities, your priorities are inverted. Tools serve execution, not the other way around.

3. **Every dollar should have a measurable expected return.** "Brand awareness" is not a measurable return. "50 email subscribers per month from content marketing" is. If you cannot define the expected outcome, do not spend the money yet.

---

## Budget Tier Breakdowns

### Tier 1: Bootstrap ($0/mo)

**Who this is for:** Solo founders, side projects, pre-revenue products, developers testing a market before committing.

**Mindset:** Your budget is TIME, not money. Every hour you spend on marketing is an hour you are not coding. Be ruthlessly selective about where you invest your time.

#### Recommended Channel Allocation

| Channel | Monthly Cost | Weekly Hours | Expected 90-Day Results |
|---------|-------------|-------------|------------------------|
| Landing page + email collection | $0 | 2-3 hrs (one-time setup) | 50-200 email subscribers |
| Content / SEO (write 2-4 posts/mo) | $0 | 4-6 hrs | 500-2K monthly organic visitors |
| Social media (ONE platform) | $0 | 2-3 hrs | 200-1K followers |
| Community participation (Reddit/HN/forums) | $0 | 1-2 hrs | 10-50 referred sign-ups |
| Product Hunt launch (one-time) | $0 | 10-20 hrs (one-time) | 200-2K sign-ups on launch day |
| **Total** | **$0/mo** | **7-11 hrs/week** | **See above** |

#### Free Tool Stack

| Category | Tool | Free Tier Limits | Paid Upgrade Cost |
|----------|------|-----------------|------------------|
| **Email** | Buttondown | 100 subscribers | $9/mo |
| **Email** | Mailchimp | 500 contacts, 1K sends/mo | $13/mo |
| **Email** | ConvertKit (free) | 1,000 subscribers (limited automations) | $29/mo |
| **Email** | Resend | 3,000 emails/mo | $20/mo |
| **Analytics** | Google Analytics 4 | Unlimited | Free forever |
| **Analytics** | PostHog (free) | 1M events/mo | $0 (self-host) or usage-based |
| **Analytics** | Plausible (self-hosted) | Unlimited (self-host) | $9/mo (cloud) |
| **SEO** | Google Search Console | Unlimited | Free forever |
| **SEO** | Ubersuggest (free) | 3 searches/day | $29/mo |
| **SEO** | Ahrefs Webmaster Tools | Limited (your own site only) | $29/mo (Lite) |
| **Social** | Buffer (free) | 3 channels, 10 scheduled posts | $6/mo/channel |
| **Social** | Typefully (free) | Basic Twitter/X scheduling | $12.50/mo |
| **Design** | Canva (free) | Templates, basic editing | $13/mo (Pro) |
| **Design** | Figma (free) | 3 files, unlimited viewers | $15/mo |
| **CRM** | HubSpot CRM (free) | Unlimited contacts, basic features | $20/mo |
| **Landing page** | Carrd | One page free | $19/year |
| **Landing page** | Your own site | Free (already built in Steps 0-16) | $0 |
| **Forms** | Tally | Unlimited forms and submissions | $29/mo |
| **Link tracking** | UTM.io (free) | Basic UTM builder | Free forever |
| **Heatmaps** | Microsoft Clarity | Unlimited | Free forever |

**Bootstrap Strategy Summary:**
- Write 2-4 high-quality blog posts per month targeting long-tail keywords
- Build an email list from day one (even "notify me at launch" counts)
- Pick ONE social platform, post 3-5 times per week, engage genuinely
- Participate in 2-3 relevant online communities WITHOUT promoting your product for the first month
- Prepare and execute ONE Product Hunt launch when the product is ready

---

### Tier 2: Small ($100-500/mo)

**Who this is for:** Early-stage startups with initial revenue, funded side projects, freelancers investing in their product.

**Mindset:** You have enough budget to unlock one or two premium tools and run very small ad experiments. The goal is NOT to scale ads — it is to learn what messaging and channels work before spending more.

#### Recommended Channel Allocation

| Category | Monthly Budget | What It Buys |
|----------|---------------|-------------|
| SEO tool (one) | $29-99 | Keyword research, rank tracking, competitor analysis |
| Email tool upgrade | $20-50 | More subscribers, automation, better deliverability |
| Paid ad experiments | $100-300 | 2-4 weeks of small Google or Meta ad tests to validate messaging |
| Social tool | $0-15 | Better scheduling, analytics (optional — free tools may suffice) |
| Design upgrade | $0-13 | Canva Pro for branded templates (optional) |
| **Total** | **$149-477/mo** | |

#### Recommended Tool Stack

| Category | Tool | Monthly Cost | Why This One |
|----------|------|-------------|-------------|
| **SEO** | Ahrefs Lite | $29/mo | Best keyword research at the lowest price tier |
| **SEO** (alternative) | Ubersuggest | $29/mo | Slightly simpler, good for beginners |
| **Email** | ConvertKit (Creator) | $29/mo (1K subs) | Best automation for creators and small products |
| **Email** (alternative) | Mailchimp (Essentials) | $13/mo (500 contacts) | Cheaper, good enough for simple sequences |
| **Analytics** | GA4 + PostHog (free tier) | $0 | Web analytics + product analytics |
| **Social** | Buffer (free or $6/channel) | $0-18 | Simple, reliable scheduling |
| **Design** | Canva Pro | $13/mo | Branded templates, background remover, brand kit |
| **CRM** | HubSpot CRM (free) | $0 | Tracks leads and deals at no cost |
| **Heatmaps** | Microsoft Clarity | $0 | See exactly how users interact with your site |

#### Paid Ad Experiment Framework

With $100-300/mo in ad budget, you are NOT trying to acquire customers profitably. You are trying to LEARN:

1. **Week 1-2:** Run 3-5 different ad headlines on Google Ads ($50-100)
   - Each headline tests a different value proposition
   - Measure: click-through rate tells you which message resonates

2. **Week 3-4:** Run the winning headline as a Meta/Facebook ad ($50-100)
   - Test 2-3 different audiences (demographics, interests)
   - Measure: which audience clicks and converts

3. **After 4 weeks:** You know your best messaging and best audience
   - If CPA is within target → consider increasing budget
   - If CPA is too high → fix the landing page or messaging before spending more

**Small Budget Rule:** Never spend more than $10/day on ads until you have a conversion rate above 2% on your landing page. Pouring traffic into a leaky bucket wastes money.

---

### Tier 3: Medium ($500-2,000/mo)

**Who this is for:** Startups with product-market fit signals, funded companies in growth mode, businesses with revenue supporting marketing investment.

**Mindset:** You can now sustain multiple channels simultaneously. The focus shifts from experimentation to consistent execution and early scaling.

#### Recommended Channel Allocation

| Category | Monthly Budget | % of Total | What It Buys |
|----------|---------------|-----------|-------------|
| Content creation (freelance writer or AI-assisted) | $200-500 | 25-30% | 4-8 blog posts/mo, 1-2 case studies |
| Paid advertising (ONE channel, not both) | $300-800 | 30-40% | Consistent Google or Meta ad spend with real data |
| Email marketing (tool + list growth) | $50-100 | 5-10% | Automation sequences, larger list, A/B testing |
| Tools (SEO, analytics, social) | $100-200 | 10-15% | Full tool stack for measurement and optimization |
| Directories / listings | $50-100 | 5% | Premium placement on 1-2 directories |
| Influencer / partnerships | $100-300 | 10-15% | 1-2 micro-influencer campaigns per month |
| **Total** | **$800-2,000/mo** | **100%** | |

#### Recommended Tool Stack

| Category | Tool | Monthly Cost | Why This One |
|----------|------|-------------|-------------|
| **SEO** | Ahrefs Standard | $99/mo | Full keyword research, site audit, competitor analysis, rank tracking |
| **SEO** (alternative) | SEMrush Pro | $130/mo | More features (but more expensive); good if you also need social analytics |
| **Email** | ConvertKit (Creator Pro) | $59/mo (up to 3K subs) | Advanced automations, subscriber scoring, deliverability tools |
| **Email** (alternative) | Resend + React Email | $20/mo | Developer-friendly, great for transactional + marketing emails |
| **Analytics** | GA4 + PostHog | $0 | Web + product analytics (PostHog free tier is generous) |
| **Analytics** (alternative) | Mixpanel (free tier) | $0 (up to 20M events) | Better funnel analysis for SaaS/mobile |
| **Social** | Buffer (Team) | $12/mo/channel | Scheduled posting, analytics, team collaboration |
| **Social** (alternative) | Hootsuite | $99/mo | More features, but pricier; good for managing many accounts |
| **CRM** | HubSpot CRM (Starter) | $20/mo | Contact management, email integration, deal tracking |
| **CRM** (alternative) | Pipedrive | $14/mo | Simpler pipeline management, better for sales-driven businesses |
| **Design** | Canva Pro | $13/mo | Brand kit, templates, team sharing |
| **Heatmaps** | Hotjar (Basic) | $32/mo | Heatmaps + session recordings + surveys |
| **Heatmaps** (alternative) | Microsoft Clarity | $0 | Free and surprisingly good — try this first |
| **Landing pages** | Your product site | $0 | You built this in Steps 0-16 |

---

### Tier 4: Growth ($2,000-10,000/mo)

**Who this is for:** Companies with proven product-market fit, clear unit economics, and marketing as a growth priority.

**Mindset:** You are scaling what works. You should already know which channels convert and at what cost. The growth budget amplifies proven channels and adds new ones.

#### Recommended Channel Allocation

| Category | Monthly Budget | % of Total | What It Buys |
|----------|---------------|-----------|-------------|
| Content production (team) | $500-2,000 | 15-25% | Professional writing, video production, design assets |
| Paid advertising (2+ channels) | $1,000-5,000 | 40-50% | Scaled campaigns on proven channels + retargeting |
| Influencer / partnerships | $500-1,500 | 10-15% | Regular influencer campaigns, co-marketing initiatives |
| Tools and platforms | $200-500 | 5-10% | Full marketing stack |
| Community / events | $100-300 | 3-5% | Community platform, event sponsorships |
| Video production | $200-500 | 5% | Professional tutorials, demo videos |
| PR / freelance consultant | $500-1,000 | 10% | Press outreach, media relationships |
| **Total** | **$3,000-10,800/mo** | **100%** | |

#### Additional Tools at This Tier

| Category | Tool | Monthly Cost | Why Add It Now |
|----------|------|-------------|---------------|
| **Marketing automation** | HubSpot Marketing Hub (Starter) | $45/mo | Lead scoring, nurture workflows, landing pages |
| **Marketing automation** (alternative) | ActiveCampaign | $29/mo | Powerful automation at a lower price point |
| **Video** | Descript | $24/mo | Edit video by editing text; fast repurposing |
| **Video** (alternative) | Riverside.fm | $24/mo | High-quality remote video recording for interviews/podcasts |
| **Social listening** | Mention | $41/mo | Track brand mentions, competitor mentions, keywords |
| **Social listening** (alternative) | Brand24 | $79/mo | More features, sentiment analysis |
| **A/B testing** | PostHog (feature flags) | $0 | Built-in A/B testing with your product analytics |
| **A/B testing** (alternative) | VWO | $199/mo | Professional landing page testing |
| **Chat/Support** | Intercom (Starter) | $74/mo | In-app chat, help center, targeted messages |
| **Chat/Support** (alternative) | Crisp | $25/mo | Affordable live chat with basic marketing features |

---

### Tier 5: Scale ($10,000+/mo)

**Who this is for:** Companies with a dedicated marketing team or agency, significant revenue, and aggressive growth targets.

**At this tier, you need humans — not just templates.** Consider:
- Hiring a full-time marketing person ($4,000-8,000/mo salary equivalent)
- Engaging a marketing agency ($3,000-10,000/mo retainer)
- Building an in-house content team (writer + designer + strategist)

#### High-Level Allocation

| Category | % of Budget | What It Includes |
|----------|-----------|-----------------|
| Paid acquisition (search + social + retargeting + display) | 40-50% | Multi-channel ad campaigns with dedicated management |
| Content & SEO (team of writers + SEO specialist) | 20-25% | High-volume content production, link building, technical SEO |
| Tools, platforms, and infrastructure | 10-12% | Enterprise-grade marketing stack |
| Brand awareness (PR, events, sponsorships) | 10-15% | PR agency, conference sponsorships, podcast sponsorships |
| Experimental / new channels | 5-10% | Testing new channels, audiences, and creative formats |

---

## Stage-Based Allocation

Budget allocation should change as your product moves through lifecycle stages. The same $1,000/mo budget should be allocated differently at pre-launch versus growth.

### Stage 1: Pre-Launch (Building Awareness)

**Goal:** Build an audience before you have a product to sell. Collect emails. Build credibility. Generate anticipation.

| Activity | % of Budget | % of Time |
|----------|-----------|----------|
| Landing page + email collection | 10% | 15% |
| Content marketing (SEO-focused) | 30% | 35% |
| Social media presence building | 10% | 20% |
| Community participation | 0% | 20% |
| Pre-launch tools (email, analytics) | 15% | 5% |
| Beta program / early access outreach | 10% | 5% |
| Product Hunt preparation | 5% | (varies, one-time) |
| **Reserve for launch** | **20%** | **0% (save for later)** |

**Key metric:** Email list size. Aim for 100-500 subscribers before launch.

**Timeline:** 1-3 months before launch.

---

### Stage 2: Launch (Acquiring First Users)

**Goal:** Convert your pre-launch audience into users. Generate as much attention as possible in a condensed window. Capture early social proof.

| Activity | % of Budget | % of Time |
|----------|-----------|----------|
| Launch campaigns (Product Hunt, HN, social blitz) | 25% | 40% |
| Paid ads (short burst for launch week) | 25% | 15% |
| Email to existing list (launch announcement) | 5% | 10% |
| Influencer / outreach campaigns | 20% | 20% |
| PR / press outreach | 15% | 10% |
| Tools and tracking | 10% | 5% |

**Key metrics:** Sign-ups, activation rate (users who complete onboarding), early reviews/testimonials.

**Timeline:** Launch week + 2 weeks post-launch.

---

### Stage 3: Growth (Retention + Expansion)

**Goal:** You have users. Now keep them and get more. Focus shifts from acquisition spikes to sustainable, repeatable channels.

| Activity | % of Budget | % of Time |
|----------|-----------|----------|
| Content marketing + SEO (scaling) | 25% | 30% |
| Paid advertising (proven channels) | 30% | 20% |
| Email marketing (onboarding + retention + upsell) | 10% | 15% |
| Social media (consistent posting) | 5% | 15% |
| Community building | 5% | 10% |
| Referral / viral programs | 10% | 5% |
| Tools and analytics | 10% | 5% |
| Partnerships | 5% | 5% (ongoing relationship management) |

**Key metrics:** Monthly active users, churn rate, LTV:CAC ratio (aim for 3:1 or higher), organic traffic growth.

**Timeline:** Months 2-12 post-launch.

---

### Stage 4: Scale (Optimization)

**Goal:** Maximize ROI of existing channels. Test new channels. Expand into adjacent markets.

| Activity | % of Budget | % of Time |
|----------|-----------|----------|
| Paid advertising (multi-channel, optimized) | 40% | 25% |
| Content + SEO (authoritative, high-production) | 20% | 20% |
| Brand awareness (PR, events, sponsorships) | 15% | 15% |
| Email (advanced segmentation, lifecycle) | 5% | 10% |
| Community + partnerships | 5% | 10% |
| Tools and infrastructure | 5% | 5% |
| Experimental channels | 10% | 15% |

**Key metrics:** Revenue per channel, blended CAC, brand search volume, NPS.

**Timeline:** 12+ months post-launch.

---

## ROI Expectations by Channel

These are realistic ranges for products with product-market fit. Your actual results will vary based on execution quality, market competition, and product quality.

| Channel | Time to First Results | 90-Day Expected ROI | 12-Month Expected ROI | Notes |
|---------|---------------------|--------------------|-----------------------|-------|
| **SEO / Content** | 3-6 months | Negative (investment phase) | 3-10x (compounds) | Slowest start, highest long-term ROI |
| **Email Marketing** | 1-2 weeks | 2-5x (if you have a list) | 10-40x (highest ROI channel) | Email consistently has the highest ROI of any marketing channel |
| **Paid Search (Google)** | 1-2 weeks | 1-3x (if optimized) | 2-5x | Immediate traffic, but expensive in competitive niches |
| **Paid Social (Meta)** | 1-2 weeks | 0.5-2x (learning phase) | 2-4x | Requires creative testing; ROAS improves over time |
| **Social Media (organic)** | 1-3 months | Hard to measure directly | 2-5x (indirect) | Builds brand, drives trust; hard to attribute directly |
| **Product Hunt** | Launch day | 5-50x (one-time spike) | Varies (trailing traffic) | One-time event; results depend on preparation |
| **Hacker News** | Same day (if post hits) | Unpredictable (could be 100x or 0) | Unpredictable | High variance; cannot be forced |
| **Influencer** | 1-4 weeks | 1-5x | 3-8x | Depends entirely on influencer quality and audience fit |
| **Directories** | 1-3 months | 1-2x (slow to build) | 3-8x (reviews compound) | Low effort, long-term compounding |
| **Community** | 3-6 months | Negative (investment phase) | 5-20x (moat) | Longest build time, strongest long-term moat |
| **PR** | 2-8 weeks (unpredictable) | Unpredictable | 2-10x (if coverage lands) | High variance; cannot be guaranteed |
| **Referral Program** | 1-2 months (setup + adoption) | 2-5x | 5-15x | Lowest CAC channel when it works |

---

## Cost-Per-Acquisition Benchmarks by Product Type

Use these as planning benchmarks. If your actual CPA is significantly higher, either your messaging, targeting, or product experience needs improvement.

### SaaS Products

| Channel | Typical CPA (B2B) | Typical CPA (B2C) | Notes |
|---------|-------------------|-------------------|-------|
| Organic search / SEO | $10-50 | $2-15 | Highest volume, lowest CPA long-term |
| Content marketing | $15-80 | $5-20 | Blended with SEO (content drives organic traffic) |
| Email marketing | $5-30 | $1-10 | Existing list only; CPA of list building is separate |
| Google Ads | $30-200 | $10-50 | Highly competitive keywords cost more |
| Meta Ads | $50-300 | $10-40 | B2B targeting on Meta is less precise |
| LinkedIn Ads | $50-500 | N/A | Expensive but precise B2B targeting |
| Product Hunt | $2-10 | $1-5 | Excellent CPA but one-time event |
| Referral | $5-25 | $2-10 | Lowest sustainable CPA |

### Mobile Apps

| Channel | Typical CPI (Cost Per Install) | Notes |
|---------|-------------------------------|-------|
| Organic (ASO) | $0 (free) | Requires investment in listing optimization |
| Meta Ads (Facebook/Instagram) | $1-5 (casual) / $5-20 (premium) | Most common paid acquisition channel for apps |
| TikTok Ads | $1-3 | Increasingly popular, lower CPIs than Meta |
| Google App Campaigns | $1-5 | Automated targeting, less control |
| Influencer | $0.50-3 per install | Varies wildly; micro-influencers often have best CPIs |
| Apple Search Ads | $1-5 | High intent; users are already in the App Store searching |

### Dev Tools

| Channel | Typical CPA | Notes |
|---------|------------|-------|
| Organic content / SEO | $5-30 | Technical blog posts and documentation |
| Twitter/X (organic) | $0-10 | Build in public; organic reach drives sign-ups |
| Hacker News | $1-5 | If your "Show HN" post lands, CPA is incredible |
| Reddit (organic) | $2-15 | Genuine community participation; NOT ads |
| YouTube tutorials | $5-20 | Good for complex tools that benefit from demonstration |
| Conference talks | $20-100 | High CPA but high-quality leads and brand building |

---

## When to Increase Budget

These are signals that justify spending more on marketing. If you see 2+ of these signals, consider moving up one budget tier:

| Signal | What It Means | Action |
|--------|-------------|--------|
| **CPA is below target on a paid channel** | Your messaging and targeting are working; more spend = more customers | Increase ad budget by 20-30% per week (never double overnight) |
| **Organic content is ranking and converting** | SEO investment is paying off; more content = more traffic | Hire a freelance writer or increase content cadence |
| **Email list is growing consistently** | You have a distribution channel; more emails = more conversions | Invest in email automation and segmentation tools |
| **Trial-to-paid conversion rate is above 5%** | Your product delivers value; more trials = more revenue | Increase top-of-funnel investment (any channel) |
| **LTV:CAC ratio is above 3:1** | Each customer is worth 3x what you paid to acquire them | You can afford to spend more to acquire each customer |
| **Organic word-of-mouth is generating sign-ups** | Product-market fit is working; marketing amplifies what is already happening | Invest in referral programs and community |
| **You are turning away feature requests** | Demand exceeds your current capacity | Market to the RIGHT audience (higher-value customers, not just more customers) |

### When NOT to Increase Budget

| Signal | What It Means | Action |
|--------|-------------|--------|
| **Churn rate is above 10% monthly** | Users leave because the product does not deliver | Fix the product before spending more on acquisition |
| **Onboarding completion rate is below 30%** | Users sign up but never activate | Fix onboarding before driving more traffic |
| **CPA is rising month-over-month** | Channel saturation or creative fatigue | Refresh creative, test new audiences, or try new channels |
| **You are not tracking conversions accurately** | You do not know what is working | Set up proper attribution before spending more |
| **Revenue does not cover marketing spend** | Unit economics are not working | Reduce spend, improve conversion rate, or increase pricing |

---

## Tool Cost Comparison: Free vs. Paid Alternatives

For every paid tool, here is a free alternative that gets you 70-80% of the functionality:

### Email Marketing

| Paid Tool | Cost | Free Alternative | Free Tier Limits |
|-----------|------|-----------------|-----------------|
| ConvertKit Creator Pro | $59/mo | ConvertKit Free | 1,000 subscribers, basic automations |
| Mailchimp Standard | $20/mo | Mailchimp Free | 500 contacts, 1,000 sends/mo |
| ActiveCampaign | $29/mo | Brevo (Sendinblue) Free | 300 emails/day, unlimited contacts |
| Resend | $20/mo | Resend Free | 3,000 emails/mo |
| Buttondown | $9/mo | Buttondown Free | 100 subscribers |

### Analytics

| Paid Tool | Cost | Free Alternative | Free Tier Limits |
|-----------|------|-----------------|-----------------|
| Mixpanel | $28/mo | Mixpanel Free | 20M events/mo |
| Amplitude | $49/mo | PostHog Free (cloud) | 1M events/mo |
| Heap | Custom pricing | Google Analytics 4 | Unlimited |
| Hotjar Business | $80/mo | Microsoft Clarity | Unlimited (fully free) |

### SEO

| Paid Tool | Cost | Free Alternative | Free Tier Limits |
|-----------|------|-----------------|-----------------|
| Ahrefs Standard | $99/mo | Ahrefs Webmaster Tools | Own site only |
| SEMrush Pro | $130/mo | Ubersuggest Free | 3 searches/day |
| Moz Pro | $99/mo | Google Search Console | Own site, full data |
| Screaming Frog | $259/yr | Screaming Frog Free | 500 URLs per crawl |

### Social Media Management

| Paid Tool | Cost | Free Alternative | Free Tier Limits |
|-----------|------|-----------------|-----------------|
| Hootsuite Professional | $99/mo | Buffer Free | 3 channels, 10 posts/channel |
| Sprout Social | $249/mo | Buffer Free or Later Free | Limited scheduling |
| SocialBee | $29/mo | Typefully Free | Basic Twitter scheduling |
| Publer | $12/mo | Canva Content Planner (free) | Basic scheduling with Canva account |

### CRM

| Paid Tool | Cost | Free Alternative | Free Tier Limits |
|-----------|------|-----------------|-----------------|
| HubSpot Starter | $20/mo | HubSpot CRM Free | Unlimited contacts, basic features |
| Pipedrive Essential | $14/mo | HubSpot CRM Free | Unlimited contacts |
| Salesforce | $25/mo | Notion (as a simple CRM) | Free for personal, $10/mo for team |
| Close | $59/mo | Folk CRM Free | 200 contacts |

### Design

| Paid Tool | Cost | Free Alternative | Free Tier Limits |
|-----------|------|-----------------|-----------------|
| Canva Pro | $13/mo | Canva Free | Basic templates and editing |
| Adobe Creative Suite | $55/mo | Figma Free | 3 Figma files |
| Lottie (animations) | Varies | LottieFiles Free | Community animations |
| Stock photos (Shutterstock) | $29/mo | Unsplash / Pexels | Unlimited free photos |

---

## Budget Tracking Template

Use this template to track actual marketing spend versus planned allocation. Update monthly.

```markdown
# Marketing Budget Tracker — {{PROJECT_NAME}}

**Budget Tier:** {{MARKETING_BUDGET}}
**Monthly Budget:** ${{BUDGET_AMOUNT}}
**Tracking Period:** {{START_DATE}} to present

## Monthly Summary

| Month | Planned | Actual | Over/Under | Notes |
|-------|---------|--------|-----------|-------|
| Month 1 | $___  | $___   | $___      |       |
| Month 2 | $___  | $___   | $___      |       |
| Month 3 | $___  | $___   | $___      |       |
| Month 4 | $___  | $___   | $___      |       |
| Month 5 | $___  | $___   | $___      |       |
| Month 6 | $___  | $___   | $___      |       |
| Month 7 | $___  | $___   | $___      |       |
| Month 8 | $___  | $___   | $___      |       |
| Month 9 | $___  | $___   | $___      |       |
| Month 10 | $___  | $___  | $___      |       |
| Month 11 | $___  | $___  | $___      |       |
| Month 12 | $___  | $___  | $___      |       |

## Spend by Category

| Category | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9 | M10 | M11 | M12 | Total |
|----------|----|----|----|----|----|----|----|----|----|-----|-----|-----|-------|
| Tools (SEO, email, analytics) | | | | | | | | | | | | | |
| Paid ads (search) | | | | | | | | | | | | | |
| Paid ads (social) | | | | | | | | | | | | | |
| Content creation | | | | | | | | | | | | | |
| Influencer / partnerships | | | | | | | | | | | | | |
| Design / creative | | | | | | | | | | | | | |
| PR / events | | | | | | | | | | | | | |
| Other | | | | | | | | | | | | | |
| **TOTAL** | | | | | | | | | | | | | |

## ROI by Channel

| Channel | Total Spend | Leads/Sign-ups | Conversions | Revenue | CPA | ROAS |
|---------|------------|----------------|-------------|---------|-----|------|
| SEO / Content | $___  | ___ | ___ | $___ | $___ | ___x |
| Email | $___  | ___ | ___ | $___ | $___ | ___x |
| Google Ads | $___  | ___ | ___ | $___ | $___ | ___x |
| Meta Ads | $___  | ___ | ___ | $___ | $___ | ___x |
| Social (organic) | $___  | ___ | ___ | $___ | $___ | ___x |
| Referral | $___  | ___ | ___ | $___ | $___ | ___x |
| Other | $___  | ___ | ___ | $___ | $___ | ___x |
| **TOTAL** | **$___** | **___** | **___** | **$___** | **$___** | **___x** |

## Budget Adjustment Log

| Date | Change | Reason | Approved By |
|------|--------|--------|-------------|
| | | | |
```

---

## Budget Allocation by Product Type

These are starting-point allocations. Adjust based on actual performance data after 30-60 days.

<!-- IF {{PRODUCT_TYPE}} == "saas" -->

### SaaS Budget Allocation

| Budget Tier | Content/SEO | Paid Ads | Email | Tools | Community | Influencer/PR |
|------------|------------|----------|-------|-------|-----------|--------------|
| Bootstrap ($0) | 50% (time) | 0% | 10% (time) | 0% | 30% (time) | 10% (time) |
| Small ($100-500) | 30% | 30% | 10% | 20% | 5% | 5% |
| Medium ($500-2K) | 25% | 35% | 10% | 15% | 5% | 10% |
| Growth ($2K-10K) | 20% | 40% | 8% | 10% | 7% | 15% |
| Scale ($10K+) | 20% | 45% | 5% | 8% | 7% | 15% |

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->

### Mobile App Budget Allocation

| Budget Tier | ASO | Paid Social | Influencer | Email | Tools | Content |
|------------|-----|-----------|-----------|-------|-------|---------|
| Bootstrap ($0) | 40% (time) | 0% | 20% (time) | 10% (time) | 0% | 30% (time) |
| Small ($100-500) | 15% | 35% | 20% | 10% | 15% | 5% |
| Medium ($500-2K) | 10% | 40% | 20% | 10% | 10% | 10% |
| Growth ($2K-10K) | 5% | 45% | 25% | 8% | 7% | 10% |
| Scale ($10K+) | 5% | 50% | 20% | 5% | 5% | 15% |

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->

### Dev Tool Budget Allocation

| Budget Tier | Content/Docs | Social/Community | Events | Email | Tools | Partnerships |
|------------|-------------|-----------------|--------|-------|-------|-------------|
| Bootstrap ($0) | 50% (time) | 30% (time) | 5% (time) | 10% (time) | 0% | 5% (time) |
| Small ($100-500) | 35% | 20% | 10% | 10% | 20% | 5% |
| Medium ($500-2K) | 30% | 20% | 15% | 10% | 15% | 10% |
| Growth ($2K-10K) | 25% | 15% | 20% | 10% | 10% | 20% |
| Scale ($10K+) | 25% | 10% | 25% | 5% | 10% | 25% |

**Dev Tool Note:** NEVER allocate budget to paid advertising for developer tools unless you have exhausted organic channels. Developers use ad blockers, distrust sponsored content, and respond to genuine community engagement — not ads.

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->

### Marketplace Budget Allocation

| Budget Tier | SEO | Community | Referral | Email | Paid Ads | Partnerships |
|------------|-----|----------|---------|-------|----------|-------------|
| Bootstrap ($0) | 30% (time) | 30% (time) | 15% (time) | 10% (time) | 0% | 15% (time) |
| Small ($100-500) | 25% | 20% | 15% | 10% | 20% | 10% |
| Medium ($500-2K) | 20% | 15% | 15% | 10% | 30% | 10% |
| Growth ($2K-10K) | 15% | 10% | 15% | 8% | 40% | 12% |
| Scale ($10K+) | 15% | 10% | 10% | 5% | 45% | 15% |

**Marketplace Note:** Split paid ad budget between supply-side and demand-side acquisition. The ratio depends on which side you need more of at any given time. Typically: 60% demand, 40% supply at launch; 50/50 at growth stage.

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "client_site" -->

### Client/Agency Site Budget Allocation

| Budget Tier | Local SEO | Google Ads | Email | Networking | Tools | Content |
|------------|----------|-----------|-------|-----------|-------|---------|
| Bootstrap ($0) | 30% (time) | 0% | 15% (time) | 35% (time) | 0% | 20% (time) |
| Small ($100-500) | 20% | 40% | 10% | 10% | 15% | 5% |
| Medium ($500-2K) | 15% | 45% | 10% | 10% | 10% | 10% |
| Growth ($2K-10K) | 10% | 45% | 10% | 10% | 10% | 15% |
| Scale ($10K+) | 10% | 40% | 10% | 10% | 10% | 20% |

**Client Site Note:** Google Ads (search) is typically the highest-ROI channel for service businesses because it captures high-intent searchers ("web developer near me," "accounting firm [city]"). Invest here first.

<!-- ENDIF -->

---

## Budget Mistakes to Avoid

1. **Spending on ads before fixing your landing page.** If your landing page converts at 0.5%, sending more traffic to it just wastes money. Get to 2%+ conversion rate with organic traffic first.

2. **Paying for premium tools you do not fully use.** If you are only using Ahrefs for keyword research, the $29/mo Lite plan is fine. You do not need the $99/mo Standard plan until you use site audit, content explorer, and rank tracking.

3. **Allocating equal budget to all channels.** The 80/20 rule applies: 80% of your results will come from 20% of your channels. Find those 2-3 channels and go deep, not wide.

4. **No budget for creative production.** Ads need creative assets (images, video, copy). If you allocate $500/mo to Meta Ads but $0 to creative, your ads will underperform and waste the $500.

5. **Stopping too early.** SEO takes 3-6 months. Content takes 2-4 months. Community takes 6+ months. If you evaluate a channel at 4 weeks and call it a failure, you probably did not give it enough time.

6. **Forgetting about attribution.** If you do not track where each customer came from, you cannot optimize budget allocation. Set up UTM parameters and conversion tracking BEFORE spending.

7. **Scaling a channel before it is working.** If your Google Ads CPA is $200 and your target is $50, doubling the budget does not fix the CPA. Fix the ads first (better targeting, better landing page, better creative), then scale.

---

## Summary: Budget Decision Quick Reference

| If your budget is... | Focus on... | Skip for now... | Expected timeline to results |
|---------------------|------------|----------------|----------------------------|
| **$0/mo** | Content + SEO, Email list, ONE social platform, Community | Paid ads, Premium tools, Influencer, PR | 3-6 months |
| **$100-500/mo** | Everything above + ONE SEO tool + Small ad experiments | Multi-channel ads, Influencer campaigns, PR | 2-4 months |
| **$500-2K/mo** | Everything above + Freelance content + Consistent paid channel + Directories | Multi-channel ads (stick to ONE), PR agency | 1-3 months |
| **$2K-10K/mo** | Multi-channel paid + Content team + Influencer + Events | PR agency (unless you have a compelling story) | 2-6 weeks |
| **$10K+/mo** | All channels, dedicated team, agency support | Nothing — test everything, double down on winners | 1-4 weeks |
