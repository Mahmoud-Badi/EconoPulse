# Brand Mentions Monitoring and Conversion

> Every unlinked mention of {{PROJECT_NAME}} is a warm link-building opportunity. This guide covers setting up monitoring infrastructure, identifying unlinked brand mentions, converting them to backlinks, tracking sentiment for brand SERP management, and monitoring competitor mentions for insertion opportunities.

---

## Table of Contents

1. [Setting Up Monitoring Infrastructure](#setting-up-monitoring-infrastructure)
2. [Identifying Unlinked Brand Mentions](#identifying-unlinked-brand-mentions)
3. [Outreach Templates for Converting Mentions to Links](#outreach-templates-for-converting-mentions-to-links)
4. [Sentiment Monitoring for Brand SERP Management](#sentiment-monitoring-for-brand-serp-management)
5. [Competitor Mention Monitoring](#competitor-mention-monitoring)
6. [Review and Reputation Management Impact on SEO](#review-and-reputation-management-impact-on-seo)
7. [Tracking and Measurement](#tracking-and-measurement)

---

## Setting Up Monitoring Infrastructure

You need multiple monitoring layers because no single tool catches everything. Set up all of the following, then check them on a defined schedule.

### Tool-by-Tool Setup

#### Google Alerts (Free — Required)

Google Alerts is basic but catches a surprising amount. Set up alerts for every variation of your brand.

**Alerts to create:**

| Alert Query | Purpose | Frequency |
|-------------|---------|-----------|
| `"{{PROJECT_NAME}}"` | Exact brand name mentions | As-it-happens |
| `"{{DOMAIN}}"` | Domain mentions without a hyperlink | As-it-happens |
| `"[founder full name]"` | Founder mentions (often cite the company) | Once a day |
| `"[product feature name]"` | Specific product/feature mentions | Once a day |
| `"{{PROJECT_NAME}}" -site:{{DOMAIN}}` | Brand mentions excluding your own site | As-it-happens |

**Settings for each alert:**
- Sources: Automatic (covers web, news, blogs)
- Language: Match your primary market
- Region: Match your target geography or set to "Any region"
- How many: "All results" (not "Only the best results" — you need comprehensive coverage)
- Deliver to: A dedicated email or Google Group (keeps your inbox clean)

#### Ahrefs Alerts

Ahrefs provides the highest-quality unlinked mention detection for SEO purposes because it can distinguish between mentions that include a hyperlink and those that don't.

**Setup:**
1. Ahrefs → Alerts → Mentions
2. Add alert for: `{{PROJECT_NAME}}`
3. Mode: "Unlinked" (this is the key setting — it filters to mentions without a backlink)
4. Scope: Exclude results from {{DOMAIN}}
5. Frequency: Weekly
6. Language: Match your primary market

Also set up:
- Ahrefs → Alerts → New Backlinks → add {{DOMAIN}} (tracks when new links appear)
- Ahrefs → Alerts → New Backlinks → add competitor domains (tracks their link acquisition)

#### Mention.com / Brand24

Real-time monitoring across web, social media, forums, podcasts, and review sites. More comprehensive than Google Alerts for non-news sources.

**Setup:**
1. Create a project for {{PROJECT_NAME}}
2. Add keywords: brand name, product names, common misspellings, domain name
3. Add excluded sources: your own domain, your social media accounts
4. Configure alerts for: all new mentions (real-time or daily digest)
5. Set up sentiment filtering: flag negative mentions for immediate review

#### Social Listening

Social mentions rarely produce direct backlinks, but they signal brand awareness trends and surface content creators who are talking about you.

**Platforms to monitor:**
- Twitter/X: Use TweetDeck or Twitter Advanced Search — save searches for "{{PROJECT_NAME}}" and product names
- Reddit: Set up keyword alerts via F5Bot (free) for brand name and product keywords
- LinkedIn: Monitor brand name mentions in posts (no automated tool — manual weekly check)
- YouTube: Search for your brand name weekly — video creators who mention you are prime outreach candidates

### Monitoring Schedule

| Task | Tool | Frequency | Time Required |
|------|------|-----------|---------------|
| Review Google Alerts | Gmail / Google Groups | Daily (scan) | 5 minutes |
| Review Ahrefs unlinked mentions | Ahrefs Alerts | Weekly | 15 minutes |
| Review Mention.com dashboard | Mention.com | Weekly | 15 minutes |
| Check social mentions | Twitter, Reddit, LinkedIn | Weekly | 20 minutes |
| Full unlinked mention audit | Ahrefs Content Explorer | Monthly | 1-2 hours |
| Competitor mention review | Ahrefs / Mention.com | Monthly | 30 minutes |
| Sentiment trend review | Mention.com / Brand24 | Monthly | 20 minutes |

---

## Identifying Unlinked Brand Mentions

An unlinked mention is any page that references {{PROJECT_NAME}} by name without including a hyperlink to {{DOMAIN}}. These are the warmest link-building leads you will ever find — the author already knows you and chose to mention you.

### Discovery Methods

#### Method 1: Ahrefs Content Explorer (Most Efficient)

1. Go to Ahrefs → Content Explorer
2. Search: `"{{PROJECT_NAME}}"`
3. Filter: "Highlight unlinked" → enter {{DOMAIN}}
4. Filter: "One article per domain" (avoids duplicate outreach)
5. Sort by: Domain Rating (prioritize high-authority sites)
6. Export the unlinked results

#### Method 2: Google Search Operators

Run these searches and manually check each result for a link:

```
"{{PROJECT_NAME}}" -site:{{DOMAIN}} -site:twitter.com -site:facebook.com -site:linkedin.com
"{{PROJECT_NAME}}" -site:{{DOMAIN}} inurl:blog
"{{PROJECT_NAME}}" -site:{{DOMAIN}} intitle:review
"[founder name]" + "{{PROJECT_NAME}}" -site:{{DOMAIN}}
```

For each result: visit the page, Ctrl+F for your brand name, check if any instance is hyperlinked. If not, add to your outreach list.

#### Method 3: Google Search Console

Sometimes your brand appears in search queries but the ranking page doesn't link to you:
1. GSC → Performance → Search Results
2. Filter queries containing your brand name
3. Look for pages ranking for your brand terms that are NOT your own pages
4. Visit those pages to check for unlinked mentions

### Qualification Criteria

Not every unlinked mention is worth pursuing. Prioritize:

| Criteria | Priority |
|----------|----------|
| DR 40+ and the page has organic traffic | High — outreach immediately |
| DR 20-39 and topically relevant | Medium — batch for weekly outreach |
| DR < 20 or no organic traffic | Low — skip unless exceptional context |
| Negative sentiment | Skip — do not ask hostile pages for links |
| Forum posts, comments, social media | Skip — these are nofollow and not worth the effort |
| Listicles, roundups, and comparison articles | High — these pages are designed to link out |

### Unlinked Mention Tracker

| Date Found | URL | Domain | DR | Traffic | Mention Context | Sentiment | Contact Email | Outreach Sent | Result |
|-----------|-----|--------|-----|---------|----------------|-----------|--------------|--------------|--------|
| | | | | | | | | | |

---

## Outreach Templates for Converting Mentions to Links

Three templates for different contexts. Personalize every email — templated-but-personalized beats generic-but-sent.

### Template 1: Standard Blog/Article Mention

For pages where the author mentioned {{PROJECT_NAME}} in a blog post, article, or guide without linking.

```
Subject: Thanks for mentioning {{PROJECT_NAME}} in your [topic] article

Hi [Name],

I came across your article "[article title]" — really enjoyed your take
on [specific point from the article that shows you actually read it].

I noticed you mentioned {{PROJECT_NAME}} in the piece. Would you be open
to adding a link to [specific page URL]? It would give your readers
a quick way to check out what you referenced, and we'd really appreciate it.

Either way, great article — bookmarked it.

Best,
[Name]
[Title], {{PROJECT_NAME}}
```

**When to use:** The most common scenario. Works for editorial mentions in blog posts, guides, industry articles.

**Expected response rate:** 20-35%
**Expected conversion rate:** 40-60% of responses

### Template 2: Listicle or Roundup Mention

For pages that list tools, resources, or companies — where {{PROJECT_NAME}} appears in a list but without a link.

```
Subject: Quick link addition for your [topic] roundup

Hi [Name],

Thanks for including {{PROJECT_NAME}} in your [topic] list at [URL].
We're glad to be included alongside [mention another company in their list].

I noticed the mention doesn't have a link yet — would you mind adding
one to [specific URL]? It would help your readers find us directly.

If it's helpful, here's a brief description you could use:
"[One sentence description of {{PROJECT_NAME}} tailored to the list's context]"

Thanks for putting this resource together.

Best,
[Name]
```

**When to use:** Tool roundups, "best of" lists, industry directories, comparison articles.

**Expected response rate:** 25-40%
**Expected conversion rate:** 50-70% of responses (list owners expect to link out)

### Template 3: Data Citation or Quote Attribution

For pages that cite your research, statistics, or quote your team without linking to the source.

```
Subject: Source link for the [data point] you cited

Hi [Name],

Great piece on [topic]. I noticed you referenced [specific data point or
quote] from {{PROJECT_NAME}} — thanks for citing our research.

Would you be able to add a source link to the original [report/study/article]
at [URL]? It helps your readers verify the data and find additional context.

The full [report/study] includes [mention additional findings or charts
that might interest them].

Thanks,
[Name]
[Title], {{PROJECT_NAME}}
```

**When to use:** Pages that cite your data, statistics, quotes, or research findings without a hyperlink to the source.

**Expected response rate:** 30-50%
**Expected conversion rate:** 60-80% of responses (citing without a source link is an obvious gap the author will want to fix)

### Outreach Best Practices

- **Send from a real person, not a company email.** `jane@company.com` beats `seo@company.com`
- **Reference something specific from their content.** Generic praise ("great article!") signals you didn't read it.
- **Suggest a specific URL to link to.** Don't make them hunt for the right page.
- **Follow up once after 5-7 days.** A short, friendly bump:

```
Subject: Re: [Original subject line]

Hi [Name],

Just bumping this in case it got buried — totally understand if you're
busy. Would love to get that link added if you have a moment.

Thanks,
[Name]
```

- **Never follow up more than once.** If two emails don't get a response, move on.
- **Track everything.** Log every outreach attempt and outcome in your tracker.

---

## Sentiment Monitoring for Brand SERP Management

When someone searches for "{{PROJECT_NAME}}," what they see on page 1 shapes their buying decision. Sentiment monitoring ensures you know what the brand SERP looks like and can intervene when negative content appears.

### Brand SERP Audit

Monthly, search for your brand name and document page 1:

| Position | URL | Type | Sentiment | Owned? |
|----------|-----|------|-----------|--------|
| 1 | {{DOMAIN}} | Homepage | Positive | Yes |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |
| 9 | | | | |
| 10 | | | | |

**Target state:** 7+ of 10 results should be positive or neutral, and at least 4 should be properties you control (website, social profiles, review platforms you actively manage).

### Managing Negative Results

If negative content appears on page 1 for your brand search:

| Scenario | Response |
|----------|----------|
| **Factually incorrect review** | Contact the platform (Google, G2, etc.) with evidence for removal. If the platform won't remove, respond publicly and factually. |
| **Legitimate complaint** | Respond publicly, fix the issue, then follow up publicly showing the resolution. The response often ranks alongside the complaint. |
| **Competitor attack piece** | Do not engage directly. Instead, create positive content that outranks it — publish on high-authority platforms (Medium, LinkedIn, industry publications). |
| **Outdated negative content** | If the issue has been resolved, contact the author and ask them to update the article with the current status. |

### Proactive Brand SERP Control

Fill page 1 for your brand search with properties you control or influence:

- [ ] Your website homepage (position 1)
- [ ] Your website's key landing pages (positions 2-3)
- [ ] LinkedIn company page
- [ ] Twitter/X profile
- [ ] YouTube channel
- [ ] GitHub organization (if applicable)
- [ ] Crunchbase profile
- [ ] G2 / Capterra / TrustPilot profile (actively managed)
- [ ] Medium or blog publication
- [ ] Guest articles on high-authority publications

---

## Competitor Mention Monitoring

When a competitor is mentioned, there may be an opportunity for {{PROJECT_NAME}} to be mentioned alongside them — or instead of them.

### Setup

Monitor competitor brand mentions using the same tools you use for your own brand:

| Competitor | Monitor For | Tool |
|-----------|------------|------|
| {{COMPETITOR_1}} | Brand name mentions in articles, roundups, comparisons | Ahrefs Content Explorer, Google Alerts |
| {{COMPETITOR_2}} | Brand name mentions in articles, roundups, comparisons | Ahrefs Content Explorer, Google Alerts |
| {{COMPETITOR_3}} | Brand name mentions in articles, roundups, comparisons | Ahrefs Content Explorer, Google Alerts |

### Opportunity Types

| Scenario | Action |
|----------|--------|
| **Competitor listed in a roundup, you're not** | Contact the author: "I noticed your list of [category] tools — would you consider adding {{PROJECT_NAME}}? Here's what makes us different: [differentiator]." |
| **Comparison article between competitor and another tool** | Reach out and offer to be included in the comparison or suggest a separate comparison piece. |
| **Negative review of competitor** | Do NOT contact the reviewer to bash the competitor. Instead, contribute to comment sections with helpful advice (if the platform allows). If the reviewer is looking for alternatives, they may discover you organically. |
| **Competitor mentioned in a "best of" list that's outdated** | Contact the author with an update: "I saw your [year] roundup of [category] — since you last updated, {{PROJECT_NAME}} has launched [feature]. Worth considering for the next update?" |

### Competitor Mention Tracker

| Date | URL | Competitor Mentioned | Page DR | Our Opportunity | Action Taken | Result |
|------|-----|---------------------|---------|----------------|-------------|--------|
| | | | | | | |

---

## Review and Reputation Management Impact on SEO

Online reviews affect SEO in three direct ways: they influence click-through rates on search results, they provide content that Google indexes and uses for entity understanding, and aggregate review ratings can appear as rich results.

### Review Platforms That Matter for SEO

| Platform | SEO Impact | Priority |
|----------|-----------|----------|
| **Google Business Profile** | Reviews appear directly in search results, influence local pack rankings | Critical (if local SEO applies) |
| **G2** | High DA (DA 90+), G2 pages rank for "[brand] reviews," "[brand] vs [competitor]" | High (B2B SaaS) |
| **Capterra** | High DA, ranks for comparison and review queries | High (B2B software) |
| **Trustpilot** | High DA, ranks for "[brand] reviews," star ratings in search results | High (B2C, e-commerce) |
| **Product Hunt** | Moderate DA, ranks for brand searches, drives initial backlinks | Medium (tech products) |
| **Yelp** | High DA, dominates local search results | High (local businesses) |
| **App Store / Play Store** | Ratings appear in app-related searches | High (mobile apps) |

### Review Generation Strategy

More reviews (especially recent ones) improve your presence on these platforms:

1. **Identify happy customers.** Use NPS scores, support ticket resolution satisfaction, or product usage milestones.
2. **Ask at the right moment.** After a successful outcome — project completed, problem resolved, milestone reached.
3. **Make it frictionless.** Send a direct link to the review form (not your profile page).
4. **Respond to every review.** Both positive and negative. Google's local search algorithm factors in response rate and recency.

### Review Content and SEO Keywords

Reviews generate user-generated content that Google indexes. When customers naturally use keywords in their reviews ("best project management tool for small teams"), those keywords strengthen your entity association with those terms.

**You cannot (and should not) script reviews.** But you can guide the prompt:
- "What problem were you trying to solve when you found {{PROJECT_NAME}}?"
- "What feature has been most valuable for your team?"
- "How would you describe {{PROJECT_NAME}} to a colleague?"

These prompts naturally elicit keyword-rich responses without being manipulative.

---

## Tracking and Measurement

### Key Metrics

| Metric | How to Measure | Target | Frequency |
|--------|---------------|--------|-----------|
| **Unlinked mentions found** | Ahrefs Content Explorer monthly scan | Track trend — should increase with brand awareness | Monthly |
| **Outreach emails sent** | Email tracking spreadsheet | All qualified mentions contacted within 7 days of discovery | Weekly |
| **Response rate** | Responses / emails sent | 20-40% | Monthly |
| **Conversion rate** | Links earned / responses received | 40-60% | Monthly |
| **Links earned from mentions** | Ahrefs new backlink alerts cross-referenced with outreach tracker | Upward trend | Monthly |
| **Average DR of converted links** | Ahrefs DR check on all converted mentions | 30+ | Monthly |
| **Brand SERP sentiment** | Manual SERP audit | 70%+ positive/neutral results on page 1 | Monthly |
| **Review volume growth** | Platform dashboards | Steady monthly increase | Monthly |
| **Time to outreach** | Days between mention discovery and outreach email | < 7 days | Weekly |

### Monthly Reporting Template

```
Brand Mention Monitoring Report — [Month/Year]
──────────────────────────────────────────────

UNLINKED MENTIONS
  New unlinked mentions found:       _____
  Mentions qualifying for outreach:  _____
  Outreach emails sent:              _____
  Responses received:                _____
  Links converted:                   _____
  Conversion rate:                   _____%

BRAND SERP HEALTH
  Brand search results (page 1):
    Positive/Neutral:                _____ / 10
    Negative:                        _____ / 10
    Properties we control:           _____ / 10
  Changes since last month:          [describe any movement]

COMPETITOR MENTIONS
  Competitor mentions monitored:     _____
  Opportunities identified:          _____
  Outreach sent:                     _____
  Insertions earned:                 _____

REVIEW MANAGEMENT
  New reviews this month:            _____
  Average rating:                    _____ / 5
  Reviews responded to:              _____ / _____
  Review platforms active:           [list]

ACTIONS FOR NEXT MONTH
  1. ________________________________
  2. ________________________________
  3. ________________________________
```

---

## Cross-References

- **Link building playbook (outreach methods):** `off-page/link-building-playbook.md`
- **Digital PR strategy (media monitoring):** `off-page/digital-pr-strategy.template.md`
- **Backlink audit and disavow:** `off-page/backlink-audit-and-disavow.template.md`
- **SEO measurement dashboard:** `measurement/seo-kpi-dashboard.template.md`
- **Competitive SEO analysis:** `strategy/seo-competitive-intelligence.template.md`
- **Local SEO (Google Business Profile):** `specialized/local-seo.template.md`
