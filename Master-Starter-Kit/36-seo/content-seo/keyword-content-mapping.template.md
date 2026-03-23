# Keyword-to-Content Mapping for {{PROJECT_NAME}}

> The master registry that maps every target keyword to exactly one page on {{DOMAIN}}. One keyword, one page — no exceptions. This prevents cannibalization, identifies content gaps, ensures intent alignment, and serves as the single source of truth for which page owns which search query.

---

## Table of Contents

1. [Master Keyword-Content Mapping Table](#master-keyword-content-mapping-table)
2. [Mapping Rules](#mapping-rules)
3. [Cannibalization Detection](#cannibalization-detection)
4. [Cannibalization Resolution Strategies](#cannibalization-resolution-strategies)
5. [Gap Analysis: Keywords Without Pages](#gap-analysis-keywords-without-pages)
6. [Coverage Analysis: Pages Without Keywords](#coverage-analysis-pages-without-keywords)
7. [Monthly Review Process](#monthly-review-process)

---

## Master Keyword-Content Mapping Table

This is the core artifact. Every target keyword in your SEO strategy must appear in this table exactly once.

| # | Primary Keyword | Search Intent | Monthly Volume | KD | Assigned Page URL | Page Title | Secondary Keywords | Current Rank | Target Rank | Optimization Status | Last Reviewed |
|---|----------------|---------------|---------------|-----|-------------------|------------|-------------------|-------------|-------------|-------------------|--------------|
| 1 | | | | | | | | | | | |
| 2 | | | | | | | | | | | |
| 3 | | | | | | | | | | | |
| 4 | | | | | | | | | | | |
| 5 | | | | | | | | | | | |

### Column Definitions

| Column | What Goes Here | Example |
|--------|---------------|---------|
| **Primary Keyword** | The single primary keyword this page is optimized for | `customer churn reduction` |
| **Search Intent** | Informational (I), Navigational (N), Commercial (C), Transactional (T) | `I` |
| **Monthly Volume** | Monthly search volume from your primary SEO tool | `2,400` |
| **KD** | Keyword Difficulty score (0-100) from your SEO tool | `38` |
| **Assigned Page URL** | The exact URL on {{DOMAIN}} that owns this keyword | `/blog/reduce-customer-churn` |
| **Page Title** | Current title tag of the assigned page | `How to Reduce Customer Churn (2025 Guide)` |
| **Secondary Keywords** | Comma-separated list of secondary keywords this page also targets | `churn rate, churn prevention, retention strategies` |
| **Current Rank** | Current organic position (use "--" if not ranking) | `14` |
| **Target Rank** | Realistic target position within 6 months | `5` |
| **Optimization Status** | See status definitions below | `Optimized` |
| **Last Reviewed** | Date the mapping was last verified | `2025-03-01` |

### Optimization Status Definitions

| Status | Meaning |
|--------|---------|
| **Not Created** | No page exists for this keyword yet — content brief needed |
| **Draft** | Page is in production but not yet published |
| **Published — Not Optimized** | Page exists but hasn't been through on-page SEO optimization |
| **Optimized** | Page has been through full on-page optimization (title, headings, content, internal links, schema) |
| **Monitoring** | Page is optimized and ranking — monitoring for position changes |
| **Refresh Needed** | Page is losing rankings or traffic and needs a content refresh |
| **Cannibalized** | This keyword is being targeted by multiple pages — resolution needed |

---

## Mapping Rules

These rules prevent the most common content SEO mistakes. Violations should be treated as defects — resolve them before creating new content.

### Rule 1: One Primary Keyword Per Page

Every page targets exactly one primary keyword. Secondary keywords (semantically related terms, long-tail variations) can overlap across pages, but the primary keyword must be unique.

**Why:** When two pages target the same primary keyword, Google must choose which one to rank. It often chooses neither — or alternates unpredictably, suppressing both pages below where a single, consolidated page would rank.

**How to enforce:** Before assigning a primary keyword to a new page, search this mapping table. If the keyword is already assigned, you must either:
- Assign a different primary keyword to the new page, or
- Reassign the existing page's primary keyword

### Rule 2: Intent Alignment

The page type must match the keyword's search intent. Do not assign an informational keyword to a product page, or a transactional keyword to a blog post.

| Intent | Appropriate Page Types |
|--------|----------------------|
| Informational | Blog posts, guides, how-to articles, educational pages |
| Navigational | Homepage, about page, branded landing pages |
| Commercial | Comparison pages, review pages, "best [category]" pages, feature pages |
| Transactional | Product pages, pricing pages, sign-up pages, checkout pages |

**How to enforce:** For each mapping, verify that the search intent column matches the page type. If Google's SERPs for a keyword show all blog posts and your assigned page is a product page, the mapping is wrong — either change the page or change the keyword.

### Rule 3: No Orphan Keywords

Every keyword in your keyword research universe (from `strategy/keyword-research-methodology.md`) must be assigned to a page — even if that page doesn't exist yet (status: "Not Created"). Unassigned keywords are invisible gaps.

### Rule 4: No Orphan Pages

Every indexable page on {{DOMAIN}} should have at least one primary keyword assigned. If a page exists but targets no keyword, it is either:
- Wasting crawl budget (set to noindex), or
- Missing an opportunity (assign a keyword)

### Rule 5: Secondary Keywords Do Not Cross Intent Boundaries

A page targeting an informational primary keyword should not have transactional secondary keywords. If a secondary keyword has a different intent than the primary, it belongs on a different page.

---

## Cannibalization Detection

Keyword cannibalization occurs when multiple pages on {{DOMAIN}} compete for the same search query. Google splits its signals (links, engagement, authority) across both pages instead of consolidating them into one strong result.

### Detection Method 1: Google Search Console

The most reliable cannibalization detection method because it uses Google's actual ranking data.

**Process:**
1. Open Google Search Console → Performance → Search Results
2. Click the "Pages" tab
3. Click on any page
4. Click "Queries" to see which search terms this page appears for
5. For each query, check: does more than one page appear?

**Automated approach:**
1. Export the full GSC query data (date, query, page, clicks, impressions, position)
2. In a spreadsheet, pivot by query → list all pages ranking for each query
3. Filter to queries where 2+ pages from {{DOMAIN}} appear
4. These are your cannibalization candidates

### Detection Method 2: Site Search Operator

For specific keywords you suspect are cannibalized:

```
site:{{DOMAIN}} "{{TARGET_KEYWORD}}"
```

If multiple pages appear, check which ones are actually ranking for the keyword in GSC. Multiple indexed pages discussing a topic is normal; multiple pages ranking for the same query is the problem.

### Detection Method 3: Rank Tracking

If your rank tracker shows position fluctuations for a keyword (jumping between position 8 and position 22, or alternating between two different URLs), this is a strong cannibalization signal.

### Cannibalization Audit Template

| Cannibalized Query | Page A (URL) | Page A Rank | Page A Traffic | Page B (URL) | Page B Rank | Page B Traffic | Resolution Strategy | Status |
|-------------------|-------------|------------|---------------|-------------|------------|---------------|-------------------|--------|
| | | | | | | | | |
| | | | | | | | | |

---

## Cannibalization Resolution Strategies

Once you've identified cannibalization, resolve it using one of these four strategies:

### Strategy 1: Merge

**When to use:** Both pages cover similar content and neither is significantly stronger.

**Process:**
1. Choose the page with better backlinks, higher traffic, or a more authoritative URL structure as the "winner"
2. Merge the unique, valuable content from the "loser" page into the "winner"
3. 301 redirect the loser URL to the winner URL
4. Update the keyword mapping table to reflect the consolidation
5. Update all internal links that pointed to the loser page

**Expected outcome:** The winner page receives the combined link equity and content depth, typically ranking higher than either page did individually. Expect ranking improvements within 4-8 weeks.

### Strategy 2: 301 Redirect (Without Merge)

**When to use:** One page is clearly superior and the other adds no unique value.

**Process:**
1. 301 redirect the weaker page to the stronger page
2. Remove the weaker page from the sitemap
3. Update internal links
4. Update the keyword mapping table

**Expected outcome:** Link equity transfers to the redirect target. Faster to implement than a merge but loses any unique content from the redirected page.

### Strategy 3: Differentiate

**When to use:** Both pages serve a legitimate purpose but are accidentally targeting the same keyword.

**Process:**
1. Re-examine the search intent for each page
2. Assign a different primary keyword to one of the pages
3. Rewrite the title tag, H1, and introduction of the differentiated page to clearly target its new primary keyword
4. Adjust on-page optimization (headings, internal links, schema) to match the new target
5. Update the keyword mapping table

**Example:** Two blog posts both target "project management tools." Differentiate by making one target "project management tools for small teams" (commercial intent) and the other target "how to choose a project management tool" (informational intent).

**Expected outcome:** Each page ranks for its distinct keyword without competing. Requires 4-8 weeks for Google to re-evaluate.

### Strategy 4: Deoptimize

**When to use:** One page accidentally ranks for a keyword it shouldn't target (e.g., a pricing page ranking for an informational query).

**Process:**
1. Remove the target keyword from the unintended page's title, H1, and meta description
2. Remove or change internal links that use the keyword as anchor text pointing to the wrong page
3. Add an internal link from the deoptimized page to the correct page, using the target keyword as anchor text
4. Update the keyword mapping table

**Expected outcome:** Google shifts the ranking signal to the correct page. This is the gentlest approach and works when the wrong page is ranking due to on-page signals rather than backlinks.

---

## Gap Analysis: Keywords Without Pages

Keywords that exist in your research universe but have no assigned page represent content opportunities. These are search queries with proven demand where {{PROJECT_NAME}} has no content to rank.

### Running a Gap Analysis

1. Export your full keyword research from `strategy/keyword-research-methodology.md`
2. Cross-reference against the Master Mapping Table above
3. Any keyword not assigned to a page is a gap

### Gap Prioritization Matrix

| Keyword | Volume | KD | Intent | Business Value (1-5) | Priority Score | Recommended Action |
|---------|--------|-----|--------|---------------------|---------------|-------------------|
| | | | | | | Create new page / Add to existing page / Defer |

**Priority Score Calculation:**

```
Priority = (Volume / 1000) × (5 - KD/25) × Business Value

Where:
  Volume = monthly search volume
  KD = keyword difficulty (0-100)
  Business Value = 1 (awareness only) to 5 (direct revenue)
```

Sort by Priority Score descending. The top 10-20 gaps are your next content briefs.

### Gap Analysis Quarterly Review

Every quarter, re-run the gap analysis to account for:
- New keywords discovered through competitor analysis
- Changes in search volume (seasonal or trending)
- New pages published that may have filled gaps
- Business strategy shifts that change keyword priorities

---

## Coverage Analysis: Pages Without Keywords

Pages that exist on {{DOMAIN}} but have no primary keyword assigned are either:
1. **Support pages** (privacy policy, terms, about, contact) — these don't need keyword targeting
2. **Wasted crawl budget** — pages that shouldn't be indexed
3. **Missed opportunities** — pages that could rank for something but have never been optimized

### Running a Coverage Analysis

1. Export all indexed URLs from Google Search Console (Index → Pages → Indexed)
2. Cross-reference against the Master Mapping Table
3. Any indexed URL without a primary keyword assignment is an unassigned page

### Handling Unassigned Pages

| Page Type | Action |
|-----------|--------|
| **Support/utility pages** (privacy, terms, about, contact, login) | Mark as "No keyword needed" — exclude from analysis |
| **Thin pages** (< 300 words, no unique value) | Candidate for consolidation or noindex — see `content-seo/content-pruning-strategy.template.md` |
| **Duplicate/near-duplicate pages** | Canonical to the preferred version or 301 redirect |
| **Outdated pages** | Candidate for refresh or retirement — see `content-seo/content-decay-refresh.md` |
| **Pages with traffic but no keyword** | Check GSC for what queries they actually rank for → assign that keyword in the mapping table |
| **Pages with zero traffic and no keyword** | Evaluate: refresh, consolidate, or noindex |

---

## Monthly Review Process

The keyword-content mapping is a living document. Review it monthly to prevent drift.

### Monthly Review Checklist

**Week 1 of each month (30-minute review):**

- [ ] Pull current ranking data from {{RANK_TRACKER}} and update the "Current Rank" column
- [ ] Flag any keywords that dropped 5+ positions since last month
- [ ] Flag any keywords that improved to page 1 (celebrate and document what worked)
- [ ] Check for new cannibalization signals in GSC (queries where 2+ pages appear)

**Quarterly deep review (2-hour session):**

- [ ] Re-run the gap analysis against current keyword research
- [ ] Re-run the coverage analysis against current indexed pages
- [ ] Update optimization status for all mapped pages
- [ ] Review and resolve all cannibalization flags
- [ ] Assess whether any "Not Created" keywords should be prioritized for content briefs
- [ ] Check if any "Monitoring" pages have decayed and need a status change to "Refresh Needed"
- [ ] Align keyword priorities with any changes in business strategy

### Review Output Template

```
Keyword-Content Mapping Review — [Month/Year]
─────────────────────────────────────────────

SUMMARY
  Total keywords tracked:              _____
  Keywords on page 1:                  _____ (____%)
  Keywords improved this month:        _____
  Keywords declined this month:        _____
  New keywords added this month:       _____

CANNIBALIZATION
  Active cannibalization issues:       _____
  Resolved this month:                 _____
  Resolution methods used:             [merge / redirect / differentiate / deoptimize]

GAPS
  Keywords without assigned pages:     _____
  Top 5 gap priorities:
    1. [keyword] — volume: _____, KD: _____
    2. [keyword] — volume: _____, KD: _____
    3. [keyword] — volume: _____, KD: _____
    4. [keyword] — volume: _____, KD: _____
    5. [keyword] — volume: _____, KD: _____

COVERAGE
  Indexed pages without keywords:      _____
  Actions taken:                       [assigned / noindexed / consolidated / redirected]

STATUS CHANGES
  Moved to "Optimized":               _____
  Moved to "Refresh Needed":          _____
  Moved to "Cannibalized":            _____

ACTIONS FOR NEXT MONTH
  1. ________________________________
  2. ________________________________
  3. ________________________________
```

---

## Cross-References

- **Keyword research methodology:** `strategy/keyword-research-methodology.md`
- **Topic cluster architecture:** `strategy/topic-cluster-architecture.template.md`
- **Content brief template:** `content-seo/content-brief.template.md`
- **Content decay monitoring:** `content-seo/content-decay-refresh.md`
- **Content pruning strategy:** `content-seo/content-pruning-strategy.template.md`
- **On-page optimization framework:** `on-page/content-optimization-framework.template.md`
- **SEO measurement dashboard:** `measurement/seo-kpi-dashboard.template.md`
