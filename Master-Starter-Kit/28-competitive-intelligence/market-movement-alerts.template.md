# Market Movement Alerts — {{PROJECT_NAME}}

> Automated monitoring catches competitor moves you would otherwise miss. This template defines every alert you need, how to configure it, and what to do when an alert fires. Set it up once, maintain it quarterly.

---

## Last Updated: {{DATE}}

**Owner:** Product lead or founder
**Setup Time:** 90 minutes (one-time)
**Maintenance:** 15 minutes per quarter (verify alerts still work, update queries)

---

## Alert Configuration Matrix

### Competitor-Specific Alerts

Configure the following alerts for each tracked competitor.

#### {{COMPETITOR_1}}

| Alert Type | Tool | Search Query / URL | Frequency | Delivery | Action on Trigger |
|------------|------|-------------------|-----------|----------|-------------------|
| Brand mention | Google Alerts | `"{{COMPETITOR_1}}"` | Real-time or daily digest | Email | Review, categorize as news/product/marketing |
| Funding / acquisition | Google Alerts | `"{{COMPETITOR_1}}" AND ("funding" OR "raised" OR "acquired" OR "acquisition" OR "series")` | Real-time | Email | Trigger early quarterly assessment |
| Pricing page change | Visualping | `{{COMPETITOR_1_URL}}/pricing` | Weekly | Email | Update pricing matrix, assess positioning impact |
| Homepage change | Visualping | `{{COMPETITOR_1_URL}}` | Weekly | Email | Note messaging changes for quarterly review |
| Product changelog | RSS (Feedly) | `{{COMPETITOR_1_URL}}/changelog` or equivalent RSS feed | Daily | RSS reader | Update feature parity matrix |
| Blog / content | RSS (Feedly) | `{{COMPETITOR_1_URL}}/blog` RSS feed | Daily | RSS reader | Note thought leadership shifts, new feature announcements |
| Job postings | LinkedIn Jobs | Company: {{COMPETITOR_1}}, Department: Engineering | Weekly | Email | Infer product direction (see signal guide below) |
| Job postings (all) | LinkedIn Jobs | Company: {{COMPETITOR_1}} | Monthly | Email | Assess hiring velocity, team composition shifts |
| Social media | Twitter/X List | @{{COMPETITOR_1}} handle | Daily (passive) | Feed | Note engagement patterns, messaging changes |
| Patent filings | Google Patents | Assignee: {{COMPETITOR_1}} (or parent company) | Quarterly | Manual check | Assess long-term strategy and IP moves |
| App store updates | AppFollow / manual | {{COMPETITOR_1}} app listing | Weekly | Email / manual | Note new features, rating changes |
| G2 reviews | G2 email alerts | {{COMPETITOR_1}} product page | Weekly | Email | Track sentiment, identify their weak points |

#### {{COMPETITOR_2}}

| Alert Type | Tool | Search Query / URL | Frequency | Delivery | Action on Trigger |
|------------|------|-------------------|-----------|----------|-------------------|
| Brand mention | Google Alerts | `"{{COMPETITOR_2}}"` | Daily digest | Email | Review, categorize |
| Funding / acquisition | Google Alerts | `"{{COMPETITOR_2}}" AND ("funding" OR "raised" OR "acquired")` | Real-time | Email | Trigger assessment |
| Pricing page change | Visualping | `{{COMPETITOR_2_URL}}/pricing` | Weekly | Email | Update pricing matrix |
| Product changelog | RSS (Feedly) | `{{COMPETITOR_2_URL}}/changelog` RSS | Daily | RSS reader | Update feature matrix |
| Job postings | LinkedIn Jobs | Company: {{COMPETITOR_2}}, Department: Engineering | Monthly | Email | Infer direction |
| Social media | Twitter/X List | @{{COMPETITOR_2}} handle | Daily (passive) | Feed | Note changes |

#### {{COMPETITOR_3}}

| Alert Type | Tool | Search Query / URL | Frequency | Delivery | Action on Trigger |
|------------|------|-------------------|-----------|----------|-------------------|
| Brand mention | Google Alerts | `"{{COMPETITOR_3}}"` | Daily digest | Email | Review, categorize |
| Funding / acquisition | Google Alerts | `"{{COMPETITOR_3}}" AND ("funding" OR "raised" OR "acquired")` | Real-time | Email | Trigger assessment |
| Pricing page change | Visualping | `{{COMPETITOR_3_URL}}/pricing` | Weekly | Email | Update pricing matrix |
| Product changelog | RSS (Feedly) | `{{COMPETITOR_3_URL}}/changelog` RSS | Daily | RSS reader | Update feature matrix |
| Job postings | LinkedIn Jobs | Company: {{COMPETITOR_3}} | Monthly | Email | Infer direction |

### Market-Level Alerts

These monitor the broader market, not specific competitors.

| Alert Type | Tool | Search Query | Frequency | Action on Trigger |
|------------|------|-------------|-----------|-------------------|
| New market entrant | G2 category page | {{PRODUCT_CATEGORY}} — new listings | Monthly | Evaluate new entrant, decide if tracking is needed |
| Market category mention | Google Alerts | `"{{PRODUCT_CATEGORY}}" AND ("launch" OR "new" OR "alternative")` | Daily digest | Identify new entrants or adjacent movers |
| Industry trend | Google Alerts | `"{{PRODUCT_CATEGORY}}" AND ("trend" OR "report" OR "forecast")` | Weekly digest | Note for quarterly review |
| Product Hunt launches | Product Hunt daily digest | Subscribe to relevant topics | Daily | Evaluate new entrants |
| Hacker News mentions | HN Algolia search | `{{PRODUCT_CATEGORY}}` | Weekly manual search | Track community sentiment |
| Reddit discussions | Reddit saved search | r/[relevant subreddit] + product category keywords | Weekly manual search | Track user pain points and competitor mentions |
| Analyst reports | Google Alerts | `"{{PRODUCT_CATEGORY}}" AND ("Gartner" OR "Forrester" OR "G2 Grid")` | Monthly digest | Note positioning in analyst frameworks |

### Self-Monitoring Alerts

Monitor how your own brand appears in competitive contexts.

| Alert Type | Tool | Search Query | Frequency | Action on Trigger |
|------------|------|-------------|-----------|-------------------|
| Brand mention | Google Alerts | `"{{PROJECT_NAME}}"` | Real-time | Track reach and sentiment |
| Competitor comparison | Google Alerts | `"{{PROJECT_NAME}}" AND ("vs" OR "versus" OR "alternative" OR "compared")` | Real-time | Respond if appropriate, note comparison framing |
| Review sites | G2 / Capterra alerts | {{PROJECT_NAME}} product page | Weekly | Respond to reviews, track sentiment trends |
| Social mentions | Twitter/X search | `"{{PROJECT_NAME}}"` (excluding your own account) | Daily | Engage with positive mentions, address concerns |

---

## Signal Interpretation Guide

When an alert fires, interpret the signal before acting. Most signals require noting, not immediate action.

### Hiring Signals

| They Are Hiring | What It Likely Means | Confidence | Your Response |
|----------------|---------------------|------------|---------------|
| ML/AI engineers (3+ roles) | Building AI-powered features | High | Assess if AI features matter to your users. If yes, start planning. If no, note and monitor. |
| Enterprise sales team | Moving upmarket to larger contracts | High | Expect SSO, RBAC, audit logs, compliance features within 6-12 months. Decide if you are also going upmarket. |
| DevRel / Developer Advocates | Investing in developer ecosystem | High | Expect improved docs, SDKs, API features, community investment. Consider your developer experience. |
| Customer success (3+ roles) | Shifting to high-touch retention model | Medium | They may have a churn problem, or they are going upmarket. Watch for pricing increases. |
| Reducing engineering team | Financial trouble, pivot, or efficiency play | Medium | Opportunity to position as actively-developing alternative. Target their dissatisfied users. |
| New office in [geography] | Entering new geographic market | Medium | Assess if that geography matters to you. May signal regulatory compliance work. |
| Growth marketing (3+ roles) | Scaling acquisition spend | High | Expect increased competitive pressure in advertising, content, and outbound. Prepare. |
| Data engineers | Building analytics or reporting | Medium | Users may expect better reporting. Assess your analytics features. |
| Security / compliance engineers | Building for enterprise compliance | High | SOC 2, HIPAA, GDPR features coming. Relevant if you sell to regulated industries. |
| Product designers (3+ roles) | Major UX overhaul coming | Medium | Their current UX may be a weakness you can exploit now, but not for long. |

### Pricing Signals

| Signal | What It Likely Means | Your Response |
|--------|---------------------|---------------|
| Removed free tier | Monetization pressure, focusing on paying customers | Opportunity to capture free-tier users if you offer one |
| Added free tier | Growth-stage acquisition play, trying to build market share | Assess if this changes competitive dynamics for trials/onboarding |
| Raised prices 20%+ | Moving upmarket, or costs increased | If you are cheaper, this is a positioning opportunity. If you are similar price, hold. |
| Cut prices 20%+ | Struggling to compete on value, or running a promotion | Do NOT match unless you are losing deals on price specifically. See decision tree. |
| Switched to usage-based | Aligning pricing with value delivery | Monitor how customers react. Usage-based can scare budget-conscious buyers. |
| Added annual-only enterprise tier | Reducing churn, increasing commitment | Note for enterprise positioning comparisons |
| Introduced per-seat pricing | Monetizing team growth | If you offer flat pricing, this is a positioning advantage for larger teams |

### Product Signals

| Signal | What It Likely Means | Your Response |
|--------|---------------------|---------------|
| Major feature launch (blog post + PR) | Strategic priority, significant engineering investment | Update feature matrix. Assess if users need it. |
| Quiet changelog update | Incremental improvement, not strategic | Note in feature matrix, no immediate action |
| Acquired another company | Buying capability or customer base | Expect 6-12 months integration, then rapid feature addition in acquired area |
| Open-sourced a component | Building developer community, reducing cost | Assess community adoption risk. May attract developer users. |
| Deprecated a feature | Simplifying product, changing direction | If you have that feature, it becomes a differentiator for users who need it |
| Launched mobile app | Expanding platform reach | Assess your mobile strategy urgency |
| Launched API / developer platform | Building ecosystem and integrations | Assess your API strategy, consider integration partnerships |

### Marketing Signals

| Signal | What It Likely Means | Your Response |
|--------|---------------------|---------------|
| Messaging change on homepage | Repositioning, new target audience | Assess if they are moving toward or away from your positioning |
| New case studies / social proof | Growing customer base, building credibility | Note their customer types. Consider your own social proof strategy. |
| Heavy ad spend (new ads appearing) | Scaling acquisition, may be burning cash | Monitor but do not match spend unless your unit economics support it |
| Content marketing ramp-up | SEO play, thought leadership | Assess your content strategy and keyword overlap |
| Conference sponsorships | Brand building, enterprise positioning | Note for quarterly review. Conferences signal market commitment. |
| Influencer partnerships | Targeting specific audience segments | Assess if those influencers reach your target audience |

---

## Press Release Analysis Template

When a competitor issues a press release or makes a major announcement, analyze it using this framework.

```
## Press Release Analysis

**Competitor:** [Name]
**Date:** [Date]
**Announcement:** [One-line summary]
**Source:** [URL]

### What They Said (Headline Claims)
- [Bullet 1]
- [Bullet 2]
- [Bullet 3]

### What It Actually Means (Our Analysis)
- [Interpretation 1]
- [Interpretation 2]

### Impact on {{PROJECT_NAME}}
- **Feature impact:** [None / Low / Medium / High] — [Explanation]
- **Positioning impact:** [None / Low / Medium / High] — [Explanation]
- **Customer impact:** [None / Low / Medium / High] — [Explanation]

### Action Required
- [ ] Update feature parity matrix
- [ ] Update battle card
- [ ] Update pricing comparison
- [ ] Communicate to team
- [ ] Adjust roadmap
- [ ] No action needed — note for quarterly review

### Response Timeline
- [ ] Immediate (this week)
- [ ] Short-term (this month)
- [ ] Quarterly review
- [ ] No response needed
```

---

## Alert Triage Protocol

Not every alert requires action. Use this protocol to triage incoming alerts efficiently.

### Triage Decision Matrix

```
Is this information verified from a primary source?
├── No → Verify before acting. Rumors are not intelligence.
└── Yes
    ├── Does this affect our customers directly?
    │   ├── Yes → IMMEDIATE: Assess impact, update artifacts, communicate to team
    │   └── No
    │       ├── Does this change the competitive landscape?
    │       │   ├── Yes → THIS WEEK: Update relevant tracking documents
    │       │   └── No
    │       │       ├── Is this a data point for pattern analysis?
    │       │       │   ├── Yes → LOG IT: Add to competitive intelligence log for quarterly review
    │       │       │   └── No → IGNORE: Not actionable intelligence
    │       │       └──
    │       └──
    └──
```

### Triage Categories

| Category | Response Time | Examples | Action |
|----------|-------------|---------|--------|
| **Immediate** | Same day | Major feature that customers are asking us about, pricing change affecting active deals, competitor outage affecting shared customers | Update battle cards, notify sales, assess strategic response |
| **This Week** | Within 5 business days | New competitor with funding, significant feature launch, acquisition announcement | Run quick assessment, update feature matrix, update battle card |
| **Quarterly Review** | Next scheduled review | Minor feature updates, blog posts, social media campaigns, job postings | Log in competitive intelligence log, batch for quarterly review |
| **Ignore** | Never | Competitor social media drama, vanity metric announcements, unrelated product launches | Do not log, do not discuss, do not waste time |

---

## Alert Maintenance Schedule

Alerts decay. URLs change, products get renamed, Google Alerts stop working. Maintain your alert infrastructure quarterly.

### Quarterly Alert Maintenance Checklist

```
[ ] Verify all Google Alerts are still firing (check delivery history)
[ ] Update Visualping URLs if competitor pages have moved
[ ] Verify RSS feeds are still active (check for 404s)
[ ] Add alerts for any new competitors identified this quarter
[ ] Remove alerts for competitors that have shut down or become irrelevant
[ ] Update search queries if competitor names or product names changed
[ ] Test one alert from each tool to confirm delivery
[ ] Review alert volume — too many? consolidate. Too few? expand.
[ ] Update this document with any configuration changes
```

---

## Alert Volume Management

If you are receiving more than 20 alerts per day, you are over-monitoring. Reduce noise with these strategies:

1. **Switch real-time alerts to daily digest** for lower-priority competitors
2. **Narrow search queries** — add exclusion terms for common false positives (e.g., exclude competitor name if it is a common word)
3. **Consolidate tools** — use one RSS reader instead of individual email subscriptions
4. **Rank competitors** — give Tier 1 competitors (top 2-3) more alerts; give Tier 2+ competitors fewer alerts
5. **Remove social monitoring for quiet competitors** — if a competitor rarely posts, weekly manual checks are sufficient

### Recommended Alert Volumes

| Competitor Tier | Recommended Daily Alerts | Monitoring Depth |
|----------------|------------------------|-----------------|
| Tier 1 (top 2-3) | 3-5 per competitor | Full monitoring: all alert types |
| Tier 2 (next 3-5) | 1-2 per competitor | Core monitoring: brand mentions, pricing, changelog |
| Tier 3 (watch list) | 0-1 per competitor | Minimal: brand mentions only, monthly manual check |
