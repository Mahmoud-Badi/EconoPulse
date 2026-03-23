# Competitor Marketing Audit: {{PROJECT_NAME}}

> **Purpose:** Systematically analyze how competitors in the {{MARKET_CATEGORY}} space market
> their products. This is not a product feature comparison -- it is a marketing strategy audit.
> Understanding competitor marketing reveals gaps you can exploit, channels that work in your
> space, messaging that resonates with your audience, and pricing expectations you must meet or reframe.
>
> **Last Updated:** {{DATE}}
> **Prepared By:** {{AUTHOR_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Number of Competitors Audited:** {{COMPETITOR_COUNT}}

---

## Table of Contents

1. [Competitor Identification Framework](#1-competitor-identification-framework)
2. [Research Tools and Setup](#2-research-tools-and-setup)
3. [Competitor Audit Template](#3-competitor-audit-template)
4. [Competitor 1 Audit](#4-competitor-1-audit)
5. [Competitor 2 Audit](#5-competitor-2-audit)
6. [Competitor 3 Audit](#6-competitor-3-audit)
7. [Competitor 4 Audit](#7-competitor-4-audit)
8. [Competitor 5 Audit](#8-competitor-5-audit)
9. [Competitive Gap Analysis](#9-competitive-gap-analysis)
10. [Opportunity Identification](#10-opportunity-identification)
11. [Summary Comparison Matrix](#11-summary-comparison-matrix)
12. [Action Items and Next Steps](#12-action-items-and-next-steps)

---

## 1. Competitor Identification Framework

### Three Types of Competitors

| Type | Definition | How to Find Them | How Many to Audit |
|------|-----------|------------------|-------------------|
| **Direct** | Solve the same problem for the same audience with a similar product | Search your main keyword, check G2/Capterra categories, ask target users what they use | 3-5 (audit all thoroughly) |
| **Indirect** | Solve the same problem differently or solve an adjacent problem | Think about alternatives: spreadsheets, manual processes, different product types | 2-3 (audit marketing approach) |
| **Aspirational** | Not competitors per se, but companies whose marketing you admire and want to emulate | Look outside your category for exceptional marketing in similar business models | 1-2 (study their tactics) |

### Competitor Discovery Methods

1. **Google search:** Search "{{PRIMARY_KEYWORD}}" and document the top 10 organic results and all ads.
2. **G2 / Capterra categories:** Find your product category and sort by reviews or popularity.
3. **Product Hunt:** Search your category and look at most upvoted products in the last 2 years.
4. **Reddit / community search:** Search "best {{PRODUCT_CATEGORY}}" or "alternative to {{KNOWN_COMPETITOR}}" in relevant subreddits.
5. **Customer interviews:** Ask potential customers "What are you using now? What else did you evaluate?"
6. **App Store search (if applicable):** Search your primary keywords and note the top results.
7. **SimilarWeb:** Enter a known competitor's URL and check "Similar Sites" section.
8. **Crunchbase:** Search your category and filter by recently funded companies.

### Your Competitor List

| # | Competitor Name | Type | URL | Why They Matter |
|---|----------------|------|-----|-----------------|
| 1 | {{COMPETITOR_1_NAME}} | {{COMPETITOR_1_TYPE}} | {{COMPETITOR_1_URL}} | {{COMPETITOR_1_RELEVANCE}} |
| 2 | {{COMPETITOR_2_NAME}} | {{COMPETITOR_2_TYPE}} | {{COMPETITOR_2_URL}} | {{COMPETITOR_2_RELEVANCE}} |
| 3 | {{COMPETITOR_3_NAME}} | {{COMPETITOR_3_TYPE}} | {{COMPETITOR_3_URL}} | {{COMPETITOR_3_RELEVANCE}} |
| 4 | {{COMPETITOR_4_NAME}} | {{COMPETITOR_4_TYPE}} | {{COMPETITOR_4_URL}} | {{COMPETITOR_4_RELEVANCE}} |
| 5 | {{COMPETITOR_5_NAME}} | {{COMPETITOR_5_TYPE}} | {{COMPETITOR_5_URL}} | {{COMPETITOR_5_RELEVANCE}} |

---

## 2. Research Tools and Setup

### Free Tools for Competitor Research

| Tool | What It Reveals | Setup Required |
|------|----------------|----------------|
| SimilarWeb (free tier) | Monthly traffic, traffic sources, top pages, geography | None -- enter URL |
| Google Alerts | New content and mentions | Set alerts for each competitor name |
| BuiltWith | Tech stack, analytics tools, ad platforms | None -- enter URL |
| Wappalyzer (browser extension) | Technologies used on competitor sites | Install browser extension |
| Wayback Machine (web.archive.org) | Historical website changes, old messaging | None -- enter URL |
| Social Blade | Social media follower growth, engagement trends | None -- enter handle |
| Hunter.io | Email patterns, team size estimates | Free tier: 25 searches/mo |
| SpyFu (free tier) | Top keywords, estimated ad spend, ad history | None -- enter URL |
| Ahrefs Free Backlink Checker | Top backlinks, referring domains | None -- enter URL |
| Meta Ad Library | Active Facebook/Instagram ads | None -- search brand name |
| Google Ads Transparency Center | Active Google ads | None -- search brand name |

### Paid Tools (If Budget Allows)

| Tool | Cost | Value for Audit |
|------|------|-----------------|
| SEMrush | $130-500/mo | Complete SEO/SEM competitor analysis |
| Ahrefs | $100-400/mo | Backlink analysis, content gap analysis |
| SpyFu Pro | $40-80/mo | Historical ad data, keyword tracking |
| SimilarWeb Pro | $200-800/mo | Detailed traffic and engagement data |
| Owletter | $19/mo | Automatically captures competitor emails |
| Visualping | Free-$10/mo | Monitors competitor website changes |

### Automation with Claude Code Tools

You can use Firecrawl and WebSearch within Claude Code to automate parts of this research:

```
# Example: Scrape competitor homepage for messaging analysis
Use firecrawl_scrape with the competitor URL to extract:
- Headlines and subheadlines (H1, H2, H3 tags)
- Call-to-action text
- Value propositions
- Social proof elements

# Example: Search for competitor reviews and mentions
Use WebSearch to find:
- "[competitor name] review" -- find review articles
- "[competitor name] alternative" -- find comparison content
- "[competitor name] pricing" -- find pricing discussions
- "site:reddit.com [competitor name]" -- find Reddit discussions
```

### Pre-Audit Checklist

Before you begin each audit, complete these setup steps:

- [ ] Sign up for competitor's email list with a dedicated research email
- [ ] Follow competitor on all social platforms
- [ ] Set up Google Alerts for competitor brand name
- [ ] Start a free trial of the competitor's product (if available)
- [ ] Bookmark their blog, changelog, and pricing pages
- [ ] Take a screenshot of their homepage (for historical comparison)

---

## 3. Competitor Audit Template

Use this template for each competitor. Copy this section for competitors 1 through 5.

### A. Company Overview

| Field | Data |
|-------|------|
| Company name | |
| Founded | |
| Headquarters | |
| Funding raised | |
| Team size (LinkedIn) | |
| Estimated ARR (if available) | |
| Target audience | |
| One-line positioning | |

### B. Website Analysis

| Element | Assessment | Notes |
|---------|-----------|-------|
| **Homepage headline** | Quote the exact H1 | |
| **Subheadline** | Quote the supporting text | |
| **Value proposition clarity** | 1-5 (can you understand what they do in 5 sec?) | |
| **Primary CTA** | What is the main call-to-action? | |
| **Secondary CTA** | What is the alternative action? | |
| **Social proof type** | Logos, testimonials, stats, case studies? | |
| **Above-the-fold elements** | What appears before scrolling? | |
| **Design quality** | 1-5 rating | |
| **Mobile experience** | 1-5 rating | |
| **Page load speed** | Use PageSpeed Insights -- score out of 100 | |
| **Trust elements** | Security badges, certifications, guarantees? | |
| **Navigation structure** | List main nav items | |
| **Number of landing pages** | Estimate from sitemap or SimilarWeb | |
| **Blog presence** | Yes/No, frequency, quality | |
| **Documentation/help center** | Quality and completeness | |

### C. Pricing Analysis

| Element | Details |
|---------|---------|
| **Pricing model** | Freemium / Free trial / Paid only / Usage-based / Per-seat |
| **Number of tiers** | |
| **Tier names and prices** | List each tier with monthly and annual pricing |
| **Free tier limitations** | What features are restricted? |
| **Most popular tier** | Which tier do they highlight? |
| **Enterprise pricing** | "Contact sales" or published? |
| **Annual discount** | What % discount for annual billing? |
| **Money-back guarantee** | Duration and terms |
| **Price anchoring** | How do they make the middle tier look attractive? |
| **Pricing page social proof** | What proof elements appear on the pricing page? |
| **Comparison with competitors** | Do they have a comparison table on their site? |
| **Price-to-value perception** | Does pricing feel expensive, fair, or cheap for what you get? |

### D. Content Strategy

| Metric | Data | Source |
|--------|------|--------|
| **Blog post frequency** | Posts per month | Manual count or SEMrush |
| **Content types** | Blog, video, podcast, newsletter, webinar, etc. | |
| **Top 5 blog posts** (by traffic) | List URLs and topics | SEMrush or Ahrefs |
| **Content themes** | What topics do they cover? | |
| **Content quality** | 1-5 rating | |
| **Content depth** | Average word count | |
| **SEO visibility score** | Estimated organic traffic | SEMrush/Ahrefs |
| **Domain authority/rating** | | Ahrefs/Moz |
| **Top 5 organic keywords** | List keywords and positions | SEMrush/Ahrefs |
| **Content lead magnets** | E-books, templates, tools, calculators? | |
| **Gated vs ungated content** | % of content behind email gate | |
| **Video content** | YouTube channel? How many subscribers? | |
| **Podcast** | Own podcast? Guest appearances? | |
| **Newsletter** | Frequency? Estimated subscriber count? | |

### E. Social Media Presence

| Platform | Handle | Followers | Posting Frequency | Engagement Rate | Content Type |
|----------|--------|-----------|-------------------|-----------------|--------------|
| Twitter/X | | | | | |
| LinkedIn | | | | | |
| YouTube | | | | | |
| Instagram | | | | | |
| TikTok | | | | | |
| Facebook | | | | | |
| Reddit | | | | | |
| Discord | | | | | |

**Engagement rate formula:** (Likes + Comments + Shares) / Followers x 100

**Benchmarks for engagement rate:**
- Twitter/X: 0.5-1% is good, 1-3% is excellent
- LinkedIn: 1-3% is good, 3-6% is excellent
- Instagram: 1-3% is good, 3-6% is excellent
- TikTok: 3-9% is good, 9%+ is excellent

| Social Media Assessment | Notes |
|------------------------|-------|
| Which platform do they invest most in? | |
| What content format gets highest engagement? | |
| Do they engage in conversations or just broadcast? | |
| Community building efforts? | |
| Influencer partnerships? | |
| User-generated content strategy? | |

### F. Email Marketing

To audit competitor email marketing, sign up for their email list (use a research-dedicated email) and document everything you receive for 30 days.

| Metric | Data |
|--------|------|
| **Opt-in incentive** | What do they offer for your email? |
| **Welcome email (timing)** | How quickly after signup? |
| **Welcome sequence length** | How many emails in the onboarding sequence? |
| **Welcome sequence content** | Summarize each email's purpose |
| **Regular email frequency** | Emails per week |
| **Email types** | Newsletter, product updates, promotional, educational? |
| **Subject line style** | Short/long, emoji use, personalization, urgency |
| **Email design** | HTML-heavy or plain text? |
| **CTA per email** | How many CTAs? What do they ask you to do? |
| **Personalization** | Name, company, behavior-based? |
| **Segmentation evidence** | Do different actions trigger different emails? |
| **Unsubscribe experience** | Easy? Do they offer frequency options? |

### G. Paid Advertising

| Channel | Active? | Estimated Monthly Spend | Ad Copy Themes | Landing Page Strategy |
|---------|---------|------------------------|----------------|----------------------|
| Google Search Ads | | | | |
| Google Display | | | | |
| Facebook/Instagram Ads | | | | |
| LinkedIn Ads | | | | |
| Twitter/X Ads | | | | |
| YouTube Ads | | | | |
| Reddit Ads | | | | |
| Podcast sponsorships | | | | |
| Newsletter sponsorships | | | | |
| Affiliate/referral program | | | | |

**How to find competitor ads:**
- Google Ads: Search your target keywords and note which competitors appear
- Meta Ad Library: facebook.com/ads/library -- search by brand name
- Google Ads Transparency: adstransparency.google.com
- SpyFu: Enter competitor URL for historical ad data
- LinkedIn: Visit competitor page > Posts > Ads

| Advertising Assessment | Notes |
|-----------------------|-------|
| Top 3 ad headlines they use | |
| Key benefits they emphasize in ads | |
| Landing page conversion elements | |
| Retargeting (do you see their ads after visiting site?) | |
| Estimated cost per click for their keywords | |

### H. Review and Reputation Presence

| Platform | Rating | # of Reviews | Key Positive Themes | Key Negative Themes |
|----------|--------|-------------|---------------------|---------------------|
| G2 | | | | |
| Capterra | | | | |
| Product Hunt | | | | |
| Trustpilot | | | | |
| App Store (iOS) | | | | |
| Google Play | | | | |
| Chrome Web Store | | | | |
| Reddit mentions | | | | |
| Twitter sentiment | | | | |

**Review mining instructions:**
1. Read the most recent 20 reviews on each platform.
2. Categorize positive themes (what do people love?).
3. Categorize negative themes (what do people complain about?).
4. Pay special attention to 2-3 star reviews -- they contain the most balanced and actionable feedback.
5. Note specific feature requests that appear repeatedly.

### I. Backlink and PR Profile

| Metric | Data | Source |
|--------|------|--------|
| Total referring domains | | Ahrefs/Moz |
| Domain rating / authority | | Ahrefs/Moz |
| Top 5 linking domains | | Ahrefs |
| Content that earns most links | | Ahrefs |
| Press mentions (last 12 months) | | Google News search |
| Industry award mentions | | Manual search |
| Guest post placements | | Search "author:competitor" on industry blogs |
| Podcast guest appearances | | Search on podcast platforms |

---

## 4. Competitor 1 Audit

### {{COMPETITOR_1_NAME}}

**URL:** {{COMPETITOR_1_URL}}
**Type:** {{COMPETITOR_1_TYPE}} competitor
**One-line description:** {{COMPETITOR_1_DESCRIPTION}}

#### A. Company Overview

| Field | Data |
|-------|------|
| Company name | {{COMPETITOR_1_NAME}} |
| Founded | {{C1_FOUNDED}} |
| Headquarters | {{C1_HQ}} |
| Funding raised | {{C1_FUNDING}} |
| Team size | {{C1_TEAM_SIZE}} |
| Estimated ARR | {{C1_ARR}} |
| Target audience | {{C1_TARGET}} |
| One-line positioning | {{C1_POSITIONING}} |

#### B. Website Analysis

| Element | Assessment |
|---------|-----------|
| Homepage headline | "{{C1_HEADLINE}}" |
| Subheadline | "{{C1_SUBHEADLINE}}" |
| Value proposition clarity (1-5) | {{C1_VP_CLARITY}} |
| Primary CTA | {{C1_PRIMARY_CTA}} |
| Secondary CTA | {{C1_SECONDARY_CTA}} |
| Social proof type | {{C1_SOCIAL_PROOF}} |
| Design quality (1-5) | {{C1_DESIGN_QUALITY}} |
| Mobile experience (1-5) | {{C1_MOBILE}} |
| Page speed score | {{C1_PAGESPEED}} |

#### C. Pricing

| Tier | Price (Monthly) | Price (Annual) | Key Features |
|------|----------------|----------------|--------------|
| {{C1_TIER1_NAME}} | {{C1_TIER1_MONTHLY}} | {{C1_TIER1_ANNUAL}} | {{C1_TIER1_FEATURES}} |
| {{C1_TIER2_NAME}} | {{C1_TIER2_MONTHLY}} | {{C1_TIER2_ANNUAL}} | {{C1_TIER2_FEATURES}} |
| {{C1_TIER3_NAME}} | {{C1_TIER3_MONTHLY}} | {{C1_TIER3_ANNUAL}} | {{C1_TIER3_FEATURES}} |
| {{C1_TIER4_NAME}} | {{C1_TIER4_MONTHLY}} | {{C1_TIER4_ANNUAL}} | {{C1_TIER4_FEATURES}} |

**Pricing model:** {{C1_PRICING_MODEL}}
**Free trial / freemium:** {{C1_FREE_OFFERING}}
**Annual discount:** {{C1_ANNUAL_DISCOUNT}}

#### D. Content Strategy Summary

| Metric | Value |
|--------|-------|
| Blog frequency | {{C1_BLOG_FREQUENCY}} |
| Content quality (1-5) | {{C1_CONTENT_QUALITY}} |
| Estimated organic traffic | {{C1_ORGANIC_TRAFFIC}} |
| Top keyword | {{C1_TOP_KEYWORD}} |
| Lead magnets | {{C1_LEAD_MAGNETS}} |

#### E. Social Media Summary

| Platform | Followers | Engagement | Primary Content Type |
|----------|-----------|------------|---------------------|
| {{C1_SOCIAL_1_PLATFORM}} | {{C1_SOCIAL_1_FOLLOWERS}} | {{C1_SOCIAL_1_ENGAGEMENT}} | {{C1_SOCIAL_1_CONTENT}} |
| {{C1_SOCIAL_2_PLATFORM}} | {{C1_SOCIAL_2_FOLLOWERS}} | {{C1_SOCIAL_2_ENGAGEMENT}} | {{C1_SOCIAL_2_CONTENT}} |
| {{C1_SOCIAL_3_PLATFORM}} | {{C1_SOCIAL_3_FOLLOWERS}} | {{C1_SOCIAL_3_ENGAGEMENT}} | {{C1_SOCIAL_3_CONTENT}} |

#### F. Email Marketing Summary

| Metric | Detail |
|--------|--------|
| Opt-in incentive | {{C1_OPTIN}} |
| Welcome sequence | {{C1_WELCOME_SEQUENCE}} |
| Regular frequency | {{C1_EMAIL_FREQUENCY}} |
| Email style | {{C1_EMAIL_STYLE}} |

#### G. Advertising Summary

| Channel | Active | Estimated Spend | Key Message |
|---------|--------|-----------------|-------------|
| {{C1_AD_CHANNEL_1}} | {{C1_AD_1_ACTIVE}} | {{C1_AD_1_SPEND}} | {{C1_AD_1_MESSAGE}} |
| {{C1_AD_CHANNEL_2}} | {{C1_AD_2_ACTIVE}} | {{C1_AD_2_SPEND}} | {{C1_AD_2_MESSAGE}} |

#### H. Review Summary

| Platform | Rating | Reviews | Top Positive | Top Negative |
|----------|--------|---------|-------------|-------------|
| {{C1_REVIEW_PLATFORM_1}} | {{C1_R1_RATING}} | {{C1_R1_COUNT}} | {{C1_R1_POSITIVE}} | {{C1_R1_NEGATIVE}} |
| {{C1_REVIEW_PLATFORM_2}} | {{C1_R2_RATING}} | {{C1_R2_COUNT}} | {{C1_R2_POSITIVE}} | {{C1_R2_NEGATIVE}} |

#### Key Takeaways for Competitor 1

- **What they do well in marketing:** {{C1_MARKETING_STRENGTHS}}
- **Where their marketing is weak:** {{C1_MARKETING_WEAKNESSES}}
- **Opportunities for {{PROJECT_NAME}}:** {{C1_OPPORTUNITIES}}

---

## 5. Competitor 2 Audit

### {{COMPETITOR_2_NAME}}

**URL:** {{COMPETITOR_2_URL}}
**Type:** {{COMPETITOR_2_TYPE}} competitor
**One-line description:** {{COMPETITOR_2_DESCRIPTION}}

#### A. Company Overview

| Field | Data |
|-------|------|
| Company name | {{COMPETITOR_2_NAME}} |
| Founded | {{C2_FOUNDED}} |
| Headquarters | {{C2_HQ}} |
| Funding raised | {{C2_FUNDING}} |
| Team size | {{C2_TEAM_SIZE}} |
| Estimated ARR | {{C2_ARR}} |
| Target audience | {{C2_TARGET}} |
| One-line positioning | {{C2_POSITIONING}} |

#### B-I. (Use the audit template from Section 3 to complete all sections)

| Section | Key Finding |
|---------|-------------|
| Website | {{C2_WEBSITE_FINDING}} |
| Pricing | {{C2_PRICING_FINDING}} |
| Content | {{C2_CONTENT_FINDING}} |
| Social Media | {{C2_SOCIAL_FINDING}} |
| Email | {{C2_EMAIL_FINDING}} |
| Advertising | {{C2_AD_FINDING}} |
| Reviews | {{C2_REVIEW_FINDING}} |
| Backlinks | {{C2_BACKLINK_FINDING}} |

#### Key Takeaways for Competitor 2

- **What they do well in marketing:** {{C2_MARKETING_STRENGTHS}}
- **Where their marketing is weak:** {{C2_MARKETING_WEAKNESSES}}
- **Opportunities for {{PROJECT_NAME}}:** {{C2_OPPORTUNITIES}}

---

## 6. Competitor 3 Audit

### {{COMPETITOR_3_NAME}}

**URL:** {{COMPETITOR_3_URL}}
**Type:** {{COMPETITOR_3_TYPE}} competitor
**One-line description:** {{COMPETITOR_3_DESCRIPTION}}

#### A. Company Overview

| Field | Data |
|-------|------|
| Company name | {{COMPETITOR_3_NAME}} |
| Founded | {{C3_FOUNDED}} |
| Headquarters | {{C3_HQ}} |
| Funding raised | {{C3_FUNDING}} |
| Team size | {{C3_TEAM_SIZE}} |
| Estimated ARR | {{C3_ARR}} |
| Target audience | {{C3_TARGET}} |
| One-line positioning | {{C3_POSITIONING}} |

#### B-I. (Use the audit template from Section 3 to complete all sections)

| Section | Key Finding |
|---------|-------------|
| Website | {{C3_WEBSITE_FINDING}} |
| Pricing | {{C3_PRICING_FINDING}} |
| Content | {{C3_CONTENT_FINDING}} |
| Social Media | {{C3_SOCIAL_FINDING}} |
| Email | {{C3_EMAIL_FINDING}} |
| Advertising | {{C3_AD_FINDING}} |
| Reviews | {{C3_REVIEW_FINDING}} |
| Backlinks | {{C3_BACKLINK_FINDING}} |

#### Key Takeaways for Competitor 3

- **What they do well in marketing:** {{C3_MARKETING_STRENGTHS}}
- **Where their marketing is weak:** {{C3_MARKETING_WEAKNESSES}}
- **Opportunities for {{PROJECT_NAME}}:** {{C3_OPPORTUNITIES}}

---

## 7. Competitor 4 Audit

### {{COMPETITOR_4_NAME}}

**URL:** {{COMPETITOR_4_URL}}
**Type:** {{COMPETITOR_4_TYPE}} competitor
**One-line description:** {{COMPETITOR_4_DESCRIPTION}}

#### A. Company Overview

| Field | Data |
|-------|------|
| Company name | {{COMPETITOR_4_NAME}} |
| Founded | {{C4_FOUNDED}} |
| Headquarters | {{C4_HQ}} |
| Funding raised | {{C4_FUNDING}} |
| Team size | {{C4_TEAM_SIZE}} |
| Estimated ARR | {{C4_ARR}} |
| Target audience | {{C4_TARGET}} |
| One-line positioning | {{C4_POSITIONING}} |

#### B-I. (Use the audit template from Section 3 to complete all sections)

| Section | Key Finding |
|---------|-------------|
| Website | {{C4_WEBSITE_FINDING}} |
| Pricing | {{C4_PRICING_FINDING}} |
| Content | {{C4_CONTENT_FINDING}} |
| Social Media | {{C4_SOCIAL_FINDING}} |
| Email | {{C4_EMAIL_FINDING}} |
| Advertising | {{C4_AD_FINDING}} |
| Reviews | {{C4_REVIEW_FINDING}} |
| Backlinks | {{C4_BACKLINK_FINDING}} |

#### Key Takeaways for Competitor 4

- **What they do well in marketing:** {{C4_MARKETING_STRENGTHS}}
- **Where their marketing is weak:** {{C4_MARKETING_WEAKNESSES}}
- **Opportunities for {{PROJECT_NAME}}:** {{C4_OPPORTUNITIES}}

---

## 8. Competitor 5 Audit

### {{COMPETITOR_5_NAME}}

**URL:** {{COMPETITOR_5_URL}}
**Type:** {{COMPETITOR_5_TYPE}} competitor
**One-line description:** {{COMPETITOR_5_DESCRIPTION}}

#### A. Company Overview

| Field | Data |
|-------|------|
| Company name | {{COMPETITOR_5_NAME}} |
| Founded | {{C5_FOUNDED}} |
| Headquarters | {{C5_HQ}} |
| Funding raised | {{C5_FUNDING}} |
| Team size | {{C5_TEAM_SIZE}} |
| Estimated ARR | {{C5_ARR}} |
| Target audience | {{C5_TARGET}} |
| One-line positioning | {{C5_POSITIONING}} |

#### B-I. (Use the audit template from Section 3 to complete all sections)

| Section | Key Finding |
|---------|-------------|
| Website | {{C5_WEBSITE_FINDING}} |
| Pricing | {{C5_PRICING_FINDING}} |
| Content | {{C5_CONTENT_FINDING}} |
| Social Media | {{C5_SOCIAL_FINDING}} |
| Email | {{C5_EMAIL_FINDING}} |
| Advertising | {{C5_AD_FINDING}} |
| Reviews | {{C5_REVIEW_FINDING}} |
| Backlinks | {{C5_BACKLINK_FINDING}} |

#### Key Takeaways for Competitor 5

- **What they do well in marketing:** {{C5_MARKETING_STRENGTHS}}
- **Where their marketing is weak:** {{C5_MARKETING_WEAKNESSES}}
- **Opportunities for {{PROJECT_NAME}}:** {{C5_OPPORTUNITIES}}

---

## 9. Competitive Gap Analysis

After completing all audits, identify gaps -- areas where competitors are underserving the market or where their marketing falls short.

### Channel Gaps

| Marketing Channel | Competitor 1 | Competitor 2 | Competitor 3 | Competitor 4 | Competitor 5 | Gap for {{PROJECT_NAME}} |
|-------------------|-------------|-------------|-------------|-------------|-------------|--------------------------|
| SEO / Blog content | {{C1_SEO_RATING}} | {{C2_SEO_RATING}} | {{C3_SEO_RATING}} | {{C4_SEO_RATING}} | {{C5_SEO_RATING}} | {{SEO_GAP}} |
| Social media | {{C1_SOCIAL_RATING}} | {{C2_SOCIAL_RATING}} | {{C3_SOCIAL_RATING}} | {{C4_SOCIAL_RATING}} | {{C5_SOCIAL_RATING}} | {{SOCIAL_GAP}} |
| Email marketing | {{C1_EMAIL_RATING}} | {{C2_EMAIL_RATING}} | {{C3_EMAIL_RATING}} | {{C4_EMAIL_RATING}} | {{C5_EMAIL_RATING}} | {{EMAIL_GAP}} |
| Paid advertising | {{C1_AD_RATING}} | {{C2_AD_RATING}} | {{C3_AD_RATING}} | {{C4_AD_RATING}} | {{C5_AD_RATING}} | {{AD_GAP}} |
| Community building | {{C1_COMMUNITY_RATING}} | {{C2_COMMUNITY_RATING}} | {{C3_COMMUNITY_RATING}} | {{C4_COMMUNITY_RATING}} | {{C5_COMMUNITY_RATING}} | {{COMMUNITY_GAP}} |
| Video content | {{C1_VIDEO_RATING}} | {{C2_VIDEO_RATING}} | {{C3_VIDEO_RATING}} | {{C4_VIDEO_RATING}} | {{C5_VIDEO_RATING}} | {{VIDEO_GAP}} |
| PR / thought leadership | {{C1_PR_RATING}} | {{C2_PR_RATING}} | {{C3_PR_RATING}} | {{C4_PR_RATING}} | {{C5_PR_RATING}} | {{PR_GAP}} |
| Partnerships | {{C1_PARTNER_RATING}} | {{C2_PARTNER_RATING}} | {{C3_PARTNER_RATING}} | {{C4_PARTNER_RATING}} | {{C5_PARTNER_RATING}} | {{PARTNER_GAP}} |

**Rating scale:** 0 = Not present, 1 = Minimal effort, 2 = Basic, 3 = Competent, 4 = Strong, 5 = Exceptional

### Messaging Gaps

| Messaging Dimension | What Competitors Emphasize | What Nobody Is Saying | {{PROJECT_NAME}} Opportunity |
|--------------------|---------------------------|----------------------|------------------------------|
| Primary benefit | {{COMPETITORS_PRIMARY_BENEFIT}} | {{UNSAID_BENEFIT}} | {{MESSAGING_OPP_1}} |
| Target audience | {{COMPETITORS_TARGET_MSG}} | {{UNDERSERVED_AUDIENCE}} | {{MESSAGING_OPP_2}} |
| Proof points | {{COMPETITORS_PROOF}} | {{MISSING_PROOF}} | {{MESSAGING_OPP_3}} |
| Emotional appeal | {{COMPETITORS_EMOTION}} | {{MISSING_EMOTION}} | {{MESSAGING_OPP_4}} |
| Differentiation claims | {{COMPETITORS_DIFF}} | {{UNCLAIMED_DIFF}} | {{MESSAGING_OPP_5}} |

### Pricing Gaps

| Gap Type | Description | Opportunity |
|----------|-------------|-------------|
| Underserved price point | {{PRICE_GAP_1}} | {{PRICE_OPP_1}} |
| Missing pricing model | {{PRICE_GAP_2}} | {{PRICE_OPP_2}} |
| Transparency gap | {{PRICE_GAP_3}} | {{PRICE_OPP_3}} |
| Free tier gap | {{PRICE_GAP_4}} | {{PRICE_OPP_4}} |

### Content Gaps

Use tools like Ahrefs Content Gap or SEMrush Keyword Gap to find keywords competitors rank for that overlap presents an opportunity.

| Content Topic | Competitors Covering It | Search Volume | Difficulty | Opportunity for {{PROJECT_NAME}} |
|---------------|------------------------|---------------|------------|----------------------------------|
| {{CONTENT_GAP_1}} | {{CG1_COMPETITORS}} | {{CG1_VOLUME}} | {{CG1_DIFFICULTY}} | {{CG1_OPPORTUNITY}} |
| {{CONTENT_GAP_2}} | {{CG2_COMPETITORS}} | {{CG2_VOLUME}} | {{CG2_DIFFICULTY}} | {{CG2_OPPORTUNITY}} |
| {{CONTENT_GAP_3}} | {{CG3_COMPETITORS}} | {{CG3_VOLUME}} | {{CG3_DIFFICULTY}} | {{CG3_OPPORTUNITY}} |
| {{CONTENT_GAP_4}} | {{CG4_COMPETITORS}} | {{CG4_VOLUME}} | {{CG4_DIFFICULTY}} | {{CG4_OPPORTUNITY}} |
| {{CONTENT_GAP_5}} | {{CG5_COMPETITORS}} | {{CG5_VOLUME}} | {{CG5_DIFFICULTY}} | {{CG5_OPPORTUNITY}} |

### Review Sentiment Gaps

Analyze competitor reviews to find recurring complaints you can address:

| Recurring Complaint | Which Competitors | Frequency | How {{PROJECT_NAME}} Addresses It |
|--------------------|-------------------|-----------|-----------------------------------|
| {{COMPLAINT_1}} | {{COMPLAINT_1_COMPETITORS}} | {{COMPLAINT_1_FREQ}} | {{COMPLAINT_1_SOLUTION}} |
| {{COMPLAINT_2}} | {{COMPLAINT_2_COMPETITORS}} | {{COMPLAINT_2_FREQ}} | {{COMPLAINT_2_SOLUTION}} |
| {{COMPLAINT_3}} | {{COMPLAINT_3_COMPETITORS}} | {{COMPLAINT_3_FREQ}} | {{COMPLAINT_3_SOLUTION}} |
| {{COMPLAINT_4}} | {{COMPLAINT_4_COMPETITORS}} | {{COMPLAINT_4_FREQ}} | {{COMPLAINT_4_SOLUTION}} |
| {{COMPLAINT_5}} | {{COMPLAINT_5_COMPETITORS}} | {{COMPLAINT_5_FREQ}} | {{COMPLAINT_5_SOLUTION}} |

---

## 10. Opportunity Identification

### Opportunity Framework

Based on all gap analyses, prioritize opportunities using this impact/effort matrix:

| Opportunity | Impact (1-5) | Effort (1-5) | Priority Score | Timeline |
|-------------|-------------|-------------|----------------|----------|
| {{OPP_1}} | {{OPP_1_IMPACT}} | {{OPP_1_EFFORT}} | {{OPP_1_SCORE}} | {{OPP_1_TIMELINE}} |
| {{OPP_2}} | {{OPP_2_IMPACT}} | {{OPP_2_EFFORT}} | {{OPP_2_SCORE}} | {{OPP_2_TIMELINE}} |
| {{OPP_3}} | {{OPP_3_IMPACT}} | {{OPP_3_EFFORT}} | {{OPP_3_SCORE}} | {{OPP_3_TIMELINE}} |
| {{OPP_4}} | {{OPP_4_IMPACT}} | {{OPP_4_EFFORT}} | {{OPP_4_SCORE}} | {{OPP_4_TIMELINE}} |
| {{OPP_5}} | {{OPP_5_IMPACT}} | {{OPP_5_EFFORT}} | {{OPP_5_SCORE}} | {{OPP_5_TIMELINE}} |
| {{OPP_6}} | {{OPP_6_IMPACT}} | {{OPP_6_EFFORT}} | {{OPP_6_SCORE}} | {{OPP_6_TIMELINE}} |
| {{OPP_7}} | {{OPP_7_IMPACT}} | {{OPP_7_EFFORT}} | {{OPP_7_SCORE}} | {{OPP_7_TIMELINE}} |
| {{OPP_8}} | {{OPP_8_IMPACT}} | {{OPP_8_EFFORT}} | {{OPP_8_SCORE}} | {{OPP_8_TIMELINE}} |

**Priority Score = Impact x (6 - Effort).** Higher is better.

### Quick Wins (High Impact, Low Effort)

1. {{QUICK_WIN_1}}
2. {{QUICK_WIN_2}}
3. {{QUICK_WIN_3}}

### Strategic Investments (High Impact, High Effort)

1. {{STRATEGIC_1}}
2. {{STRATEGIC_2}}
3. {{STRATEGIC_3}}

### Key Insight Summary

Based on this audit, the top 3 competitive marketing advantages available to {{PROJECT_NAME}} are:

1. **{{ADVANTAGE_1_TITLE}}:** {{ADVANTAGE_1_DESCRIPTION}}
2. **{{ADVANTAGE_2_TITLE}}:** {{ADVANTAGE_2_DESCRIPTION}}
3. **{{ADVANTAGE_3_TITLE}}:** {{ADVANTAGE_3_DESCRIPTION}}

---

## 11. Summary Comparison Matrix

### At-a-Glance Comparison

| Dimension | {{PROJECT_NAME}} | {{COMPETITOR_1_NAME}} | {{COMPETITOR_2_NAME}} | {{COMPETITOR_3_NAME}} | {{COMPETITOR_4_NAME}} | {{COMPETITOR_5_NAME}} |
|-----------|------------------|----------------------|----------------------|----------------------|----------------------|----------------------|
| **Positioning** | {{OUR_POSITIONING}} | {{C1_POSITIONING}} | {{C2_POSITIONING}} | {{C3_POSITIONING}} | {{C4_POSITIONING}} | {{C5_POSITIONING}} |
| **Target audience** | {{OUR_TARGET}} | {{C1_TARGET}} | {{C2_TARGET}} | {{C3_TARGET}} | {{C4_TARGET}} | {{C5_TARGET}} |
| **Pricing (entry)** | {{OUR_ENTRY_PRICE}} | {{C1_ENTRY_PRICE}} | {{C2_ENTRY_PRICE}} | {{C3_ENTRY_PRICE}} | {{C4_ENTRY_PRICE}} | {{C5_ENTRY_PRICE}} |
| **Pricing (top tier)** | {{OUR_TOP_PRICE}} | {{C1_TOP_PRICE}} | {{C2_TOP_PRICE}} | {{C3_TOP_PRICE}} | {{C4_TOP_PRICE}} | {{C5_TOP_PRICE}} |
| **Free tier?** | {{OUR_FREE}} | {{C1_FREE}} | {{C2_FREE}} | {{C3_FREE}} | {{C4_FREE}} | {{C5_FREE}} |
| **Primary channel** | {{OUR_CHANNEL}} | {{C1_CHANNEL}} | {{C2_CHANNEL}} | {{C3_CHANNEL}} | {{C4_CHANNEL}} | {{C5_CHANNEL}} |
| **Content quality** | {{OUR_CONTENT}} | {{C1_CONTENT_Q}} | {{C2_CONTENT_Q}} | {{C3_CONTENT_Q}} | {{C4_CONTENT_Q}} | {{C5_CONTENT_Q}} |
| **Social followers** | {{OUR_SOCIAL}} | {{C1_SOCIAL_TOTAL}} | {{C2_SOCIAL_TOTAL}} | {{C3_SOCIAL_TOTAL}} | {{C4_SOCIAL_TOTAL}} | {{C5_SOCIAL_TOTAL}} |
| **SEO strength** | {{OUR_SEO}} | {{C1_SEO_SCORE}} | {{C2_SEO_SCORE}} | {{C3_SEO_SCORE}} | {{C4_SEO_SCORE}} | {{C5_SEO_SCORE}} |
| **Review rating** | {{OUR_RATING}} | {{C1_RATING}} | {{C2_RATING}} | {{C3_RATING}} | {{C4_RATING}} | {{C5_RATING}} |
| **Key differentiator** | {{OUR_DIFF}} | {{C1_DIFF}} | {{C2_DIFF}} | {{C3_DIFF}} | {{C4_DIFF}} | {{C5_DIFF}} |
| **Biggest weakness** | {{OUR_WEAKNESS}} | {{C1_WEAKNESS}} | {{C2_WEAKNESS}} | {{C3_WEAKNESS}} | {{C4_WEAKNESS}} | {{C5_WEAKNESS}} |

---

## 12. Action Items and Next Steps

### Immediate Actions (This Week)

- [ ] Sign up for all competitor email lists
- [ ] Follow all competitors on social media
- [ ] Set up Google Alerts for all competitor names
- [ ] Take screenshots of all competitor homepages and pricing pages
- [ ] Start free trials for accessible competitors

### Short-Term Actions (This Month)

- [ ] Complete full audit for all 5 competitors using the template in Section 3
- [ ] Run SimilarWeb analysis for all competitors
- [ ] Complete review mining for top 2 review platforms per competitor
- [ ] Identify top 3 quick-win marketing opportunities
- [ ] Draft initial positioning based on competitive gaps

### Ongoing Monitoring

- [ ] Monthly: Check competitor pricing pages for changes
- [ ] Monthly: Review competitor blog and social media output
- [ ] Quarterly: Re-run SimilarWeb and SEO analysis
- [ ] Quarterly: Check for new competitors entering the space
- [ ] Annually: Complete a full re-audit of the competitive landscape

### Tools to Set Up for Ongoing Monitoring

| Tool | Purpose | Frequency |
|------|---------|-----------|
| Google Alerts | New competitor mentions | Real-time |
| Visualping | Pricing and homepage changes | Weekly check |
| Owletter / manual email | Competitor email changes | Monthly review |
| SEMrush Position Tracking | SEO ranking changes | Monthly |
| Social Blade | Follower and engagement trends | Monthly |

---

> **Template version:** 1.0
> **Part of:** {{PROJECT_NAME}} Master Starter Kit - Marketing Section
> **Related templates:** market-sizing.template.md, audience-research.template.md, positioning-strategy.template.md
