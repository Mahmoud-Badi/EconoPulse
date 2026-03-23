# SEO Competitive Intelligence for {{PROJECT_NAME}}

> Systematic analysis of competitor search presence. Identifies keyword gaps, backlink opportunities, content voids, and SERP feature ownership. Feeds directly into the SEO strategy and content roadmap.

---

## Table of Contents

1. [Competitor Identification](#competitor-identification)
2. [Domain Authority Comparison](#domain-authority-comparison)
3. [Keyword Portfolio Analysis](#keyword-portfolio-analysis)
4. [Backlink Gap Analysis](#backlink-gap-analysis)
5. [Content Gap Analysis](#content-gap-analysis)
6. [SERP Feature Ownership Audit](#serp-feature-ownership-audit)
7. [Content Velocity Tracking](#content-velocity-tracking)
8. [Tools and Methods](#tools-and-methods)
9. [Competitive Intelligence Cadence](#competitive-intelligence-cadence)

---

## Competitor Identification

Not every business competitor is an SEO competitor. The sites you compete with in SERPs may be entirely different from the companies you compete with for customers.

### Three Types of SEO Competitors

| Type | Definition | How to Find |
|------|-----------|-------------|
| **Direct competitors** | Companies selling similar products to similar audiences | You already know these — {{COMPETITOR_NAMES}} |
| **Indirect competitors** | Companies solving the same problem differently | Search your problem keywords, see who ranks |
| **SERP competitors** | Any site ranking for your target keywords (blogs, media, aggregators) | Search each target keyword, note all page-1 domains |

### Competitor Discovery Process

1. **List known competitors**: Direct business competitors you track
2. **Search-based discovery**: Search your top 20 target keywords, record every domain on page 1
3. **Tool-based discovery**: Use Ahrefs "Competing Domains" or SEMrush "Organic Competitors" report
4. **Frequency analysis**: Rank all discovered domains by how often they appear across your keyword set
5. **Select top 5**: Choose the 5 domains that overlap most with your target keywords

### Competitor Tracking Table

| Slot | Domain | Type | Category | Notes |
|------|--------|------|----------|-------|
| {{COMPETITOR_1}} | | Direct / Indirect / SERP | | |
| {{COMPETITOR_2}} | | Direct / Indirect / SERP | | |
| {{COMPETITOR_3}} | | Direct / Indirect / SERP | | |
| {{COMPETITOR_4}} | | Direct / Indirect / SERP | | |
| {{COMPETITOR_5}} | | Direct / Indirect / SERP | | |

---

## Domain Authority Comparison

Domain authority (DA/DR) is not a Google ranking factor, but it correlates with ranking ability. A site with DR 70 will rank faster and for more competitive keywords than a site with DR 15.

### Authority Metrics Comparison

| Metric | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} | {{COMPETITOR_4}} | {{COMPETITOR_5}} |
|--------|-------------------|-------------------|-------------------|-------------------|-------------------|-------------------|
| **Domain Rating (Ahrefs)** | | | | | | |
| **Domain Authority (Moz)** | | | | | | |
| **Referring domains** | | | | | | |
| **Total backlinks** | | | | | | |
| **Organic keywords (total)** | | | | | | |
| **Organic traffic (est.)** | | | | | | |
| **Pages indexed** | | | | | | |
| **Domain age** | | | | | | |

### Authority Gap Assessment

```
Current gap to closest competitor:  DR ___ vs DR ___ = ___ point gap
Estimated effort to close gap:      ___ referring domains needed
Estimated timeline:                 ___ months at current link building pace

Reality check:
  [ ] Gap is < 10 points — closeable within 6-12 months with effort
  [ ] Gap is 10-25 points — significant effort needed, focus on long-tail keywords
  [ ] Gap is 25+ points — compete on specificity, not authority (niche down)
```

---

## Keyword Portfolio Analysis

Understanding what competitors rank for reveals both their strategy and your opportunities.

### Competitor Keyword Overview

For each competitor, pull their organic keyword profile using Ahrefs/SEMrush:

#### {{COMPETITOR_1}} Keyword Analysis

| Metric | Value |
|--------|-------|
| Total organic keywords | |
| Keywords on page 1 | |
| Keywords on positions 1-3 | |
| Estimated monthly organic traffic | |
| Top traffic pages (top 5) | |

**Top 10 keywords by traffic:**

| # | Keyword | Position | Volume | Traffic (est.) | Page URL |
|---|---------|----------|--------|----------------|----------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |
| 7 | | | | | |
| 8 | | | | | |
| 9 | | | | | |
| 10 | | | | | |

*(Repeat the above block for {{COMPETITOR_2}} through {{COMPETITOR_5}})*

### Keyword Overlap Analysis

This reveals where you compete head-to-head and where each competitor has exclusive keyword territory.

```
Keyword Universe Venn Diagram (conceptual):

    ┌───────────────────────────────┐
    │  {{COMPETITOR_1}} only        │
    │  (keywords they rank for,     │
    │   you don't = OPPORTUNITY)    │
    │         ┌─────────────┐       │
    │         │  OVERLAP    │       │
    │         │  (head-to-  │       │
    │         │   head)     │       │
    │    ┌────┤             ├────┐  │
    │    │    └─────────────┘    │  │
    │    │                      │  │
    │    │  {{PROJECT_NAME}}    │  │
    │    │  only (your unique   │  │
    │    │  keywords = DEFEND)  │  │
    │    └──────────────────────┘  │
    └───────────────────────────────┘
```

### Keyword Gap Table

Keywords competitors rank for that {{PROJECT_NAME}} does NOT rank for:

| Keyword | Volume | Difficulty | {{COMPETITOR_1}} Pos. | {{COMPETITOR_2}} Pos. | {{COMPETITOR_3}} Pos. | {{PROJECT_NAME}} Pos. | Opportunity |
|---------|--------|------------|----------------------|----------------------|----------------------|----------------------|-------------|
| | | | | | | Not ranking | |
| | | | | | | Not ranking | |
| | | | | | | Not ranking | |

**How to use this table:**
1. Export keyword gap data from Ahrefs (Content Gap tool) or SEMrush (Keyword Gap tool)
2. Filter: Volume > 100, Difficulty < 40 (adjust based on your DR)
3. Sort by: Opportunity score (volume / difficulty)
4. Prioritize: Keywords where 2+ competitors rank but you do not — these are validated keywords

---

## Backlink Gap Analysis

Backlinks are the hardest SEO asset to build. Finding who links to competitors (but not to you) reveals the most actionable outreach targets.

### Backlink Profile Comparison

| Metric | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} |
|--------|-------------------|-------------------|-------------------|-------------------|
| **Referring domains** | | | | |
| **Dofollow links** | | | | |
| **Nofollow links** | | | | |
| **Gov/edu links** | | | | |
| **Average DR of linking domains** | | | | |
| **Link velocity (new links/month)** | | | | |

### Link Gap: Sites Linking to Competitors But Not to You

| Linking Domain | DR | Links to {{COMPETITOR_1}} | Links to {{COMPETITOR_2}} | Links to {{COMPETITOR_3}} | Links to You | Outreach Priority |
|----------------|-----|---------------------------|---------------------------|---------------------------|--------------|-------------------|
| | | Yes/No | Yes/No | Yes/No | No | High/Med/Low |
| | | | | | | |
| | | | | | | |

**How to populate:**
1. Ahrefs: "Link Intersect" tool — enter your domain + competitor domains
2. SEMrush: "Backlink Gap" tool
3. Filter: DR > 20, Dofollow only
4. Sort by: Number of competitors they link to (a site linking to 3+ competitors is very likely to link to you too)

### Backlink Acquisition Strategy by Gap Type

| Gap Type | What It Is | Outreach Approach |
|----------|-----------|-------------------|
| **Resource pages** | Pages listing tools/resources in your category | "We'd be a good addition to your list" |
| **Guest posts** | Competitor has authored content on the linking site | Pitch your own guest post to the same publication |
| **Mentions** | Competitor is mentioned in articles | Pitch yourself as an alternative/addition |
| **Directories** | Industry directories listing competitors | Submit your listing |
| **Reviews** | Review/comparison articles featuring competitors | Request inclusion or pitch an updated review |
| **Sponsorships** | Competitor sponsors events, podcasts, newsletters | Sponsor the same or similar properties |

---

## Content Gap Analysis

Content gaps reveal topics and questions your competitors address that you do not. These are validated content opportunities.

### Content Gap Discovery Process

1. **Keyword-based gap**: Keywords competitors rank for, you do not (covered above)
2. **Topic-based gap**: Entire topics/categories competitors have content for, you do not
3. **Format-based gap**: Content formats competitors use that you do not (video, tools, templates)
4. **Depth-based gap**: Topics you both cover, but they go deeper

### Topic Gap Matrix

| Topic Area | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} | Gap? |
|-----------|-------------------|-------------------|-------------------|-------------------|------|
| | Has/Missing | Has/Missing | Has/Missing | Has/Missing | Y/N |
| | | | | | |
| | | | | | |
| | | | | | |

### Content Format Gap

| Format | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | Opportunity |
|--------|-------------------|-------------------|-------------------|-------------|
| **Blog posts** | | | | |
| **Video tutorials** | | | | |
| **Interactive tools** | | | | |
| **Templates/downloads** | | | | |
| **Case studies** | | | | |
| **Original research** | | | | |
| **Podcasts** | | | | |
| **Comparison pages** | | | | |
| **Documentation** | | | | |
| **Webinars** | | | | |

### Top Content Opportunities (Prioritized)

After completing the gap analysis, compile the highest-value opportunities:

| Priority | Topic/Keyword | Why It's an Opportunity | Estimated Effort | Expected Impact |
|----------|--------------|------------------------|-----------------|-----------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

---

## SERP Feature Ownership Audit

SERP features (featured snippets, People Also Ask, AI overviews) occupy prime real estate above traditional organic results. Knowing who owns these features for your target keywords tells you where to aim.

### SERP Feature Tracker

For your top 30 target keywords, audit which SERP features appear and who owns them:

| Keyword | Featured Snippet Owner | PAA Present? | AI Overview? | Video Carousel? | Image Pack? | Knowledge Panel? | Local Pack? |
|---------|----------------------|--------------|-------------|----------------|------------|-----------------|------------|
| | | Y/N | Y/N | Y/N | Y/N | Y/N | Y/N |
| | | | | | | | |
| | | | | | | | |

### Featured Snippet Opportunities

Keywords where a competitor owns the featured snippet — these are stealable:

| Keyword | Current Snippet Owner | Snippet Type | Your Current Rank | Can You Create Better Content? | Action |
|---------|----------------------|-------------|-------------------|-------------------------------|--------|
| | | Paragraph/List/Table | | Y/N | |
| | | | | | |

**How to steal featured snippets:**
1. Identify the snippet type (paragraph, list, table)
2. Create content that answers the query more concisely and accurately
3. Match the format (if snippet is a list, use a list)
4. Place the answer near the top of your page, immediately after the H2 that matches the query
5. Ensure your page already ranks on page 1 (snippets usually come from page 1 results)

### AI Overview Source Audit

Google's AI Overviews cite sources. Track which domains are cited for your target queries:

| Query | AI Overview Present? | Sources Cited | Is {{PROJECT_NAME}} Cited? | Action |
|-------|---------------------|---------------|---------------------------|--------|
| | Y/N | | Y/N | |
| | | | | |

**How to become an AI Overview source:**
- Produce factually accurate, well-structured, clearly sourced content
- Use structured data and schema markup
- Be an authoritative domain on the topic (domain authority + topical authority)
- Provide unique data, original research, or expert perspectives

---

## Content Velocity Tracking

Content velocity measures how fast competitors are publishing. If they are accelerating content production, you need to know.

### Monthly Content Publication Tracker

| Month | {{PROJECT_NAME}} | {{COMPETITOR_1}} | {{COMPETITOR_2}} | {{COMPETITOR_3}} |
|-------|-------------------|-------------------|-------------------|-------------------|
| Jan | | | | |
| Feb | | | | |
| Mar | | | | |
| Apr | | | | |
| May | | | | |
| Jun | | | | |
| Jul | | | | |
| Aug | | | | |
| Sep | | | | |
| Oct | | | | |
| Nov | | | | |
| Dec | | | | |
| **Total** | | | | |
| **Avg/month** | | | | |

**How to estimate competitor content velocity:**
- Use Ahrefs "New pages" report (shows recently published/indexed pages)
- Check their blog/resources section and count recent posts
- Use Wayback Machine to see how their content library has grown over time
- Monitor their RSS feed or use a tool like Visualping for content change alerts

### Velocity Trend Assessment

```
Competitor acceleration status:
  {{COMPETITOR_1}}: [ ] Accelerating  [ ] Steady  [ ] Slowing
  {{COMPETITOR_2}}: [ ] Accelerating  [ ] Steady  [ ] Slowing
  {{COMPETITOR_3}}: [ ] Accelerating  [ ] Steady  [ ] Slowing

Your velocity relative to competitors:
  [ ] Outpacing all competitors
  [ ] Matching pace
  [ ] Falling behind — need to increase content production

Action required:
  [ ] No change needed
  [ ] Increase output by ___% to match competitors
  [ ] Shift focus from volume to quality (competitors publishing low-quality content)
  [ ] Invest in content refresh (competitors updating old content, not just publishing new)
```

---

## Tools and Methods

### Free Methods

| Method | What It Reveals | How |
|--------|----------------|-----|
| **Google search (manual)** | SERP features, who ranks, content quality | Search each keyword, analyze page 1 results |
| **Google Search Console** | Your keyword positions vs competitors appearing above you | Performance report, compare queries |
| **SimilarWeb (free tier)** | Estimated traffic, traffic sources, top pages | Enter competitor domain |
| **BuiltWith (free tier)** | Competitor tech stack (CMS, analytics, marketing tools) | Enter competitor domain |
| **Wayback Machine** | Historical content changes, when they launched pages | Enter competitor URLs |
| **RSS feeds** | Real-time content publication monitoring | Subscribe to competitor blog RSS |
| **Social media monitoring** | Content promotion strategy, engagement levels | Follow competitor channels |

### Paid Tools

| Tool | Key CI Features | Starting Price |
|------|----------------|---------------|
| **Ahrefs** | Content Gap, Link Intersect, Competing Domains, keyword tracking | $99/mo |
| **SEMrush** | Keyword Gap, Backlink Gap, Organic Research, Position Tracking | $130/mo |
| **SpyFu** | Competitor keyword history, PPC + organic overlap, keyword groups | $39/mo |
| **Surfer SEO** | SERP Analyzer, content scoring vs competitors, NLP analysis | $89/mo |
| **Sistrix** | Visibility Index (EU-focused), competitor comparisons | $100/mo |

### Recommended Audit Frequency

| Analysis | Frequency | Tool |
|----------|-----------|------|
| Keyword gap | Quarterly | Ahrefs/SEMrush |
| Backlink gap | Quarterly | Ahrefs Link Intersect |
| Content gap | Monthly | Manual + Ahrefs |
| SERP feature audit | Monthly | Manual search + Ahrefs |
| Content velocity | Monthly | Manual + Ahrefs |
| Domain authority check | Monthly | Ahrefs/Moz |
| Full competitive report | Quarterly | All tools |

---

## Competitive Intelligence Cadence

### Quarterly CI Report Template

```
## SEO Competitive Intelligence Report — {{QUARTER}}

### Executive Summary
- Key competitive changes this quarter: [summary]
- Biggest threats: [competitor actions that could impact your rankings]
- Biggest opportunities: [gaps discovered]

### Domain Authority Changes
| Domain | Last Quarter DR | This Quarter DR | Change |
|--------|----------------|-----------------|--------|
| {{PROJECT_NAME}} | | | |
| {{COMPETITOR_1}} | | | |
| {{COMPETITOR_2}} | | | |

### New Keyword Gaps Discovered
- [list of high-priority keywords competitors gained that you lack]

### Competitor Content Actions
- {{COMPETITOR_1}}: [notable content published, strategy shifts]
- {{COMPETITOR_2}}: [notable content published, strategy shifts]
- {{COMPETITOR_3}}: [notable content published, strategy shifts]

### Recommended Actions (prioritized)
1. [action] — Expected impact: [high/medium/low]
2. [action] — Expected impact: [high/medium/low]
3. [action] — Expected impact: [high/medium/low]
```

---

## Cross-References

- **Broader competitive monitoring** (pricing, features, positioning): `28-competitive-intelligence/`
- **SEO strategy**: `36-seo/strategy/seo-strategy.template.md`
- **Content planning**: `36-seo/strategy/topic-cluster-architecture.template.md`
- **SEO roadmap**: `36-seo/strategy/seo-roadmap.template.md`
- **Link building execution**: `36-seo/off-page/`
