# Content Decay Detection and Refresh

> Content decay is the silent killer of organic traffic. Pages that once ranked on page 1 gradually lose positions as competitors publish fresher content, search intent evolves, and Google's freshness signals favor recent updates. This guide covers detection, diagnosis, refresh methodology, re-promotion, and retirement decisions.

---

## Table of Contents

1. [What Content Decay Is and Why It Happens](#what-content-decay-is-and-why-it-happens)
2. [Detection Methods](#detection-methods)
3. [Content Freshness Signals](#content-freshness-signals)
4. [Refresh Methodology](#refresh-methodology)
5. [Full Rewrite vs Partial Refresh](#full-rewrite-vs-partial-refresh)
6. [Re-Indexing After Refresh](#re-indexing-after-refresh)
7. [Re-Promotion Workflow](#re-promotion-workflow)
8. [Content Retirement](#content-retirement)
9. [Monthly Content Health Check](#monthly-content-health-check)

---

## What Content Decay Is and Why It Happens

Content decay is the gradual decline in organic traffic and rankings for a page that previously performed well. It is not a penalty — it is the natural entropy of search results. If you do nothing, every piece of content you publish will eventually decay.

### Why Content Decays

| Cause | What Happens | Typical Decay Timeline |
|-------|-------------|----------------------|
| **Competitors publish better content** | Newer pages cover the topic more thoroughly, with fresher data and better UX | 6-18 months |
| **Search intent evolves** | What users want from a query changes over time (e.g., "best tools" lists need annual updates) | 12-24 months |
| **Information becomes outdated** | Statistics, screenshots, tool recommendations, pricing, and regulations change | 6-12 months for fast-moving industries |
| **Freshness signal decay** | Google's freshness algorithms favor recently updated content for many query types | 6-18 months |
| **Link equity dilution** | As more pages compete for the same query, your existing backlinks carry relatively less weight | 12-24 months |
| **Technical degradation** | Broken internal links, missing images, changed URL structures, slow page speed | Varies |
| **SERP feature changes** | Google adds AI Overviews, featured snippets, or video carousels that reduce clicks to your result | Immediate to gradual |

### The Decay Curve

Most content follows a predictable lifecycle:

```
Traffic
  ^
  |         ╭──────╮
  |        ╱        ╲          ← Peak (usually 2-6 months after indexing)
  |       ╱          ╲
  |      ╱            ╲
  |     ╱              ╲       ← Decay begins (gradual ranking loss)
  |    ╱                ╲
  |   ╱                  ╲     ← Refresh point (catch it here)
  |  ╱                    ╲
  | ╱                      ╲___   ← Plateau at lower level or complete loss
  |╱
  └──────────────────────────────→ Time
  0    3    6    9    12   18   24 months
```

The refresh point is where intervention yields the highest return. Waiting too long means you're competing to re-earn a position rather than defending one you already hold.

---

## Detection Methods

Set up multiple detection layers so decaying content is flagged before it drops off page 1.

### Method 1: Google Search Console Impression and Click Decline

The earliest warning signal. Impressions drop before clicks, and clicks drop before position — because Google starts testing other pages in your slot before formally replacing you.

**Process:**
1. Open Google Search Console → Performance → Search Results
2. Set the date range to the last 16 months
3. Compare: last 3 months vs. previous 3 months
4. Sort pages by biggest click decline (descending)
5. For each declining page, check:
   - Is it an impression decline (visibility loss) or a CTR decline (same impressions, fewer clicks)?
   - Which specific queries are declining?
   - Is the decline seasonal (check year-over-year data)?

**Automated approach:**
1. Export GSC data monthly
2. In a spreadsheet, calculate month-over-month change for each page
3. Flag any page with 3 consecutive months of decline
4. Flag any page with a 20%+ drop in a single month

### Method 2: Ranking Position Tracking

Monitor position changes for your target keywords in {{RANK_TRACKER}}.

**Decay signals:**
- Position drops from page 1 to page 2 (positions 1-10 → 11-20)
- Position instability: fluctuating 5+ positions week to week (Google is testing whether your page still deserves its position)
- URL changes: Google starts ranking a different page from your site for the same keyword (cannibalization triggered by decay)

### Method 3: Google Analytics Traffic Decline

Less granular than GSC but useful for pages that receive traffic from many keywords.

**Process:**
1. Google Analytics → Engagement → Pages and Screens
2. Filter by organic traffic source
3. Compare periods: last 3 months vs. same 3 months last year
4. Sort by biggest traffic decline
5. Cross-reference with GSC data to identify the specific keywords driving the decline

### Method 4: Content Age Audit

Proactive approach — flag content by age regardless of current performance.

| Content Type | Refresh Trigger Age | Reason |
|-------------|-------------------|--------|
| "Best of" / "Top tools" lists | 6 months | Tools, pricing, and features change rapidly |
| Statistical content (data, benchmarks) | 6-12 months | Data goes stale; competitors update annually |
| How-to guides (technical) | 12 months | Software interfaces and APIs change |
| Evergreen conceptual content | 18-24 months | Concepts are stable but examples and context evolve |
| News/trend content | Do not refresh — retire | News content has a natural expiration date |

### Content Decay Tracker

| Page URL | Primary Keyword | Peak Traffic (Monthly) | Current Traffic | Decline % | Decline Duration | Priority | Action | Status |
|----------|----------------|----------------------|----------------|-----------|-----------------|----------|--------|--------|
| | | | | | | | | |

**Priority scoring:**

```
Priority = (Peak Traffic - Current Traffic) × Business Value Score (1-5)
```

High priority = large traffic loss on a high-value page.

---

## Content Freshness Signals

These are the specific elements Google and users use to judge whether content is current. A refresh that does not update these signals is cosmetic — it may not produce ranking improvements.

### Freshness Signal Inventory

| Signal | Weight | How to Update |
|--------|--------|---------------|
| **Published/modified date** | High | Update the `dateModified` in schema markup AND the visible "Last updated" date on the page. Only update when you make substantive changes — changing the date without changing content is a spam signal. |
| **Statistics and data** | High | Replace outdated stats with current data. If you cite "2023 data," replace with 2025 data. If the original source has updated, link to the latest version. |
| **Screenshots and visuals** | Medium | If your screenshots show an old UI (of a tool, platform, or dashboard), replace them with current screenshots. Users notice immediately. |
| **Examples and case studies** | Medium | Replace examples that reference defunct companies, old tools, or outdated practices. Add recent examples. |
| **Tool and product recommendations** | High | Verify every tool you recommend still exists, has the features you describe, and is priced as you state. Tools pivot, get acquired, or shut down. |
| **Internal links** | Medium | Add links to new content published since the original article. Remove or fix broken internal links. |
| **External links** | Medium | Check every external link — replace 404s and redirects with current URLs. Add new authoritative sources. |
| **Author information** | Low-Medium | Update the author bio if their credentials, title, or role has changed. |
| **Code examples** | High (technical content) | Verify code snippets still work with current library versions. Update syntax for breaking changes. |
| **Regulatory and legal references** | High | If content references laws, regulations, or compliance requirements, verify they haven't changed. |

### Freshness Audit Checklist (Per Page)

- [ ] Published/modified date is accurate and reflects a substantive update
- [ ] All statistics cite data from the last 2 years (or the most recent available)
- [ ] All screenshots show current interfaces
- [ ] All recommended tools/products are current and accurately described
- [ ] All examples reference active companies and current practices
- [ ] All internal links point to live, relevant pages
- [ ] All external links resolve (no 404s, no redirect chains)
- [ ] Code examples are tested against current library versions
- [ ] Author bio is current
- [ ] Regulatory references are verified against current legislation

---

## Refresh Methodology

A content refresh is not "change a few words and update the date." It is a systematic process to make the page the best result for its target keyword in the current search landscape.

### Step 1: Re-Analyze the SERP

Before touching the content, check what ranks now for the target keyword:

1. Search the primary keyword in an incognito browser
2. Analyze the current top 5 results (same process as the content brief SERP analysis)
3. Ask: what has changed since this page was originally published?
   - Are new SERP features present (AI Overview, video carousel, featured snippet)?
   - Have competitors published more comprehensive content?
   - Has the search intent shifted?

### Step 2: Identify Content Gaps

Compare your page against the current top 3 results:

| Topic/Section | Our Page | Competitor 1 | Competitor 2 | Competitor 3 | Action |
|---------------|----------|-------------|-------------|-------------|--------|
| [Subtopic A] | Covered | Covered | Covered | Covered | Refresh existing section |
| [Subtopic B] | Missing | Covered | Covered | Covered | Add new section |
| [Subtopic C] | Covered | Missing | Missing | Missing | Keep — this is our differentiator |
| [Subtopic D] | Outdated | Current | Current | Current | Update with current data |

### Step 3: Execute the Refresh

**Content updates:**
- Add new sections that cover gaps identified in Step 2
- Update all statistics with current data (cite sources)
- Replace outdated screenshots with current ones
- Add or update examples with recent, relevant references
- Improve formatting: add tables, bullet lists, and visual breaks if the original was a text wall
- Strengthen the introduction: if the original introduction is weak, rewrite it with a clearer value proposition

**SEO updates:**
- Review and update the title tag (include the current year if the query has a freshness expectation)
- Review and update the meta description
- Add new internal links to content published since the original
- Add or update schema markup (especially `dateModified`)
- Check that the primary keyword still appears in: title, H1, first 100 words, at least one H2
- Optimize for any new SERP features (featured snippet formatting, FAQ schema)

**Technical updates:**
- Fix any broken internal or external links
- Optimize images (compress, convert to WebP, add alt text)
- Check page speed — remove any render-blocking resources added since publication

### Step 4: Update the Published Date

Only update the visible "Last updated" date AND the `dateModified` schema when you have made substantive changes. Substantive means:
- Added a new section (100+ words of new content)
- Updated statistics or data throughout
- Replaced outdated screenshots or examples
- Added significant new information

Do NOT update the date for:
- Fixing a typo
- Changing a single link
- Minor formatting adjustments

### Step 5: Document the Refresh

Maintain a refresh log for each page:

| Date | Refresh Type | Changes Made | Impact (measured 8 weeks later) |
|------|-------------|-------------|--------------------------------|
| | Partial / Full rewrite | [Summary of changes] | [Traffic change, ranking change] |

---

## Full Rewrite vs Partial Refresh

Not every decaying page needs the same level of intervention. Use this decision framework to choose the right approach.

### Decision Matrix

| Factor | Partial Refresh | Full Rewrite |
|--------|----------------|-------------|
| **Traffic decline** | 10-40% from peak | 50%+ from peak |
| **Ranking position** | Still on pages 1-2 (positions 1-20) | Dropped to page 3+ (position 21+) |
| **Content quality** | Core content is solid; needs updates | Fundamental approach is wrong (format, angle, depth) |
| **Search intent** | Intent hasn't changed | Intent has shifted (e.g., users now want a tool, not an article) |
| **Competitive landscape** | Competitors are similar quality | Competitors have fundamentally different (better) content |
| **Backlinks** | Page has strong backlinks | Backlinks are minimal (little equity to preserve) |
| **Time investment** | 2-4 hours | 8-20 hours |
| **Expected recovery time** | 2-6 weeks | 4-12 weeks |

### Key Principle: Preserve the URL

Whether you do a partial refresh or full rewrite, keep the same URL. Changing the URL means losing all existing backlinks, social shares, and accumulated authority unless you set up a 301 redirect — and even then, some equity is lost in the redirect.

### When to Change the URL

Only change the URL if:
- The original URL has a keyword that no longer matches the content (e.g., `/best-tools-2022` → needs a non-dated URL)
- The URL structure is being reorganized across the site (migration scenario)
- The content is being merged with another page (the weaker URL redirects to the stronger one)

If you must change the URL: implement a 301 redirect from old → new immediately, update all internal links, and update the sitemap.

---

## Re-Indexing After Refresh

After publishing a refresh, tell Google to re-crawl the page. Do not wait for Google to discover the changes on its own — that can take weeks.

### Re-Indexing Checklist

1. **Google Search Console URL Inspection:**
   - Go to GSC → URL Inspection → enter the refreshed page URL
   - Click "Request Indexing"
   - Note: Google limits re-indexing requests. Use this for high-priority pages, not every minor update.

2. **Update the XML Sitemap:**
   - Ensure the sitemap's `<lastmod>` date reflects the refresh date
   - If your sitemap is auto-generated, verify it updates when content changes
   - Ping Google: `https://www.google.com/ping?sitemap=https://{{DOMAIN}}/sitemap.xml`

3. **IndexNow (if configured):**
   - If your site uses IndexNow (Bing, Yandex), push the updated URL
   - IndexNow plugins for WordPress/Next.js handle this automatically

4. **Internal Link Signal:**
   - Add a link to the refreshed page from a recently published page (this triggers Google to crawl the link path and discover the update faster)

### Post-Refresh Monitoring

| Timeframe | What to Check | Tool |
|-----------|--------------|------|
| Day 1-3 | Verify Google has re-crawled the page (GSC URL Inspection → "Last crawl" date) | Google Search Console |
| Week 1-2 | Check if the cached version in Google reflects the updated content | `cache:URL` in Google |
| Week 2-4 | Monitor ranking position for the target keyword | {{RANK_TRACKER}} |
| Week 4-8 | Compare traffic (organic) to the same period pre-refresh | Google Analytics + GSC |
| Week 8-12 | Final assessment: has the refresh recovered the decay? | GSC + Analytics |

---

## Re-Promotion Workflow

A refresh is a second launch. Treat it like one. Re-promotion drives immediate traffic signals (visits, engagement, shares) that reinforce the refresh for Google.

### Re-Promotion Channels

| Channel | Action | When |
|---------|--------|------|
| **Social media** | Share the refreshed content with "Updated for 2025" framing. Highlight what's new. | Day of publication |
| **Email newsletter** | Include in the next newsletter: "We updated our guide on [topic] with [new data/section/tool]" | Next scheduled send |
| **Internal linking** | Add links from 3-5 high-traffic pages to the refreshed content | Day of publication |
| **Outreach (existing linkers)** | Email sites that link to the original: "We've significantly updated this resource — now includes [new feature]" | Week 1 |
| **Community sharing** | Share in relevant communities (Reddit, Slack, Discord, forums) if you have an established presence | Week 1 |
| **Content syndication** | Republish on Medium, LinkedIn Articles, or Dev.to with a canonical tag back to the original | Week 2 |

### Outreach to Existing Linkers

```
Subject: Updated: [Article Title] — now with [key improvement]

Hi [Name],

I noticed you link to our guide on [topic] from your article at [URL]
— thank you!

We just published a major update that includes:
- [New section or feature 1]
- [Updated data for 2025]
- [New examples or tools]

Here's the updated version: [URL]

Thought you'd want to know in case you'd like to mention the update
to your readers.

Thanks,
[Name]
```

---

## Content Retirement

Not every decaying page should be refreshed. Some content has reached the end of its useful life and should be retired gracefully.

### When to Retire Instead of Refresh

| Signal | Retire | Refresh |
|--------|--------|---------|
| **Topic relevance** | Topic is no longer relevant to {{PROJECT_NAME}}'s strategy | Topic is still relevant and valuable |
| **Traffic** | Page receives < 10 organic visits/month with no backlinks | Page still receives meaningful traffic or has valuable backlinks |
| **Refresh cost** | Would require a complete rewrite + new research + new images (15+ hours) for minimal return | Can be updated in 2-6 hours with clear upside |
| **Keyword demand** | Search volume for the target keyword has dropped to near zero | Search volume is stable or growing |
| **Cannibalization** | Page cannibalizes a better page and adds no unique value | Page has unique value that can't be captured elsewhere |
| **Content quality** | Content is fundamentally wrong, misleading, or embarrassing by current standards | Content is solid but outdated |

### Retirement Process

1. **Check for backlinks.** If the page has valuable backlinks (from DR 30+ sites), you must redirect — do not simply delete.
2. **Choose a redirect target.** Find the most relevant existing page on {{DOMAIN}}. If none exists, create a brief section on the most relevant page before redirecting.
3. **Implement a 301 redirect.** Point the old URL to the chosen target permanently.
4. **Update internal links.** Find all pages that link to the retired URL and update them to point to the redirect target (avoid unnecessary redirect chains).
5. **Remove from sitemap.** Verify the old URL is no longer in the XML sitemap.
6. **Update the keyword mapping.** Remove the retired page from `keyword-content-mapping.template.md` and reassign its keyword if still relevant.
7. **Log the retirement.** Document why the page was retired, where it redirects, and the date.

### Content Retirement Log

| Date | Retired URL | Reason | Redirect Target | Backlinks Preserved | Traffic Impact |
|------|------------|--------|----------------|--------------------|--------------------|
| | | | | | |

---

## Monthly Content Health Check

Run this process on the first week of every month. Total time: 1-2 hours for a site with under 200 pages; 2-4 hours for larger sites.

### Monthly Checklist

**Step 1: Identify Decaying Pages (30 minutes)**

- [ ] Pull GSC data: pages with 20%+ click decline (last 3 months vs. previous 3 months)
- [ ] Pull rank tracker data: keywords that dropped 5+ positions
- [ ] Flag pages older than their refresh trigger age (see Content Age Audit table above)
- [ ] Add all flagged pages to the Content Decay Tracker

**Step 2: Triage (20 minutes)**

For each flagged page, categorize:

- [ ] **Refresh** — content is valuable, decline is addressable
- [ ] **Retire** — content is past its useful life
- [ ] **Monitor** — decline is minor or potentially seasonal; check again next month
- [ ] **Investigate** — decline may be technical (broken page, de-indexed, cannibalized)

**Step 3: Schedule Refreshes (10 minutes)**

- [ ] Prioritize refreshes by traffic impact and business value
- [ ] Assign refreshes to the content calendar for the current month
- [ ] Create content briefs for high-priority refreshes (use `content-seo/content-brief.template.md`)

**Step 4: Execute and Track (ongoing through the month)**

- [ ] Execute scheduled refreshes
- [ ] Re-index refreshed pages
- [ ] Re-promote refreshed pages
- [ ] Document refreshes in the refresh log

**Step 5: Measure Previous Refreshes (10 minutes)**

- [ ] Check the results of refreshes completed 8+ weeks ago
- [ ] Update the refresh log with measured impact
- [ ] Identify patterns: which types of refreshes produce the best results?

### Monthly Health Report Template

```
Content Health Report — [Month/Year]
────────────────────────────────────

DECAY DETECTION
  Pages flagged for decline:          _____
  Pages triaged as "Refresh":         _____
  Pages triaged as "Retire":          _____
  Pages triaged as "Monitor":         _____
  Pages triaged as "Investigate":     _____

REFRESH ACTIVITY
  Refreshes completed this month:     _____
  Total hours invested:               _____
  Pages refreshed (URLs):
    1. _________________________________
    2. _________________________________
    3. _________________________________

PREVIOUS REFRESH RESULTS (8+ weeks post-refresh)
  Pages measured:                     _____
  Average traffic change:             _____%
  Pages that recovered:               _____ / _____
  Pages that did not recover:         _____ (escalate to full rewrite or retire)

RETIREMENT
  Pages retired this month:           _____
  Redirects implemented:              _____
  Backlinks preserved via redirect:   _____

CONTENT AGE DISTRIBUTION
  Pages < 6 months old:              _____
  Pages 6-12 months old:             _____
  Pages 12-18 months old:            _____
  Pages 18-24 months old:            _____
  Pages 24+ months old:              _____ (flag for review)

ACTIONS FOR NEXT MONTH
  1. ________________________________
  2. ________________________________
  3. ________________________________
```

---

## Cross-References

- **Content brief template:** `content-seo/content-brief.template.md`
- **Keyword-content mapping:** `content-seo/keyword-content-mapping.template.md`
- **Content pruning strategy:** `content-seo/content-pruning-strategy.template.md`
- **Content repurposing:** `19-marketing/seo-and-content/content-repurposing.md`
- **On-page optimization framework:** `on-page/content-optimization-framework.template.md`
- **SEO measurement dashboard:** `measurement/seo-kpi-dashboard.template.md`
- **Content optimization and E-E-A-T scoring:** `content-seo/content-seo-scoring.md`
