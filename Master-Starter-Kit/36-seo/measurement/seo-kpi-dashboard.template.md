# SEO KPI Dashboard for {{PROJECT_NAME}}

> The single-pane view of organic search health. This dashboard consolidates the metrics that matter, defines alert thresholds, and specifies data sources and measurement frequency. Build this in {{DASHBOARD_TOOL}} and review on a {{REPORTING_FREQUENCY}} cadence.

---

## Table of Contents

1. [Core Metrics](#core-metrics)
2. [Dashboard Layout](#dashboard-layout)
3. [Alert Thresholds](#alert-thresholds)
4. [Tool-Specific Setup](#tool-specific-setup)
5. [BI Pipeline Integration](#bi-pipeline-integration)

---

## Core Metrics

### 1. Organic Sessions and Users

| Attribute | Value |
|---|---|
| **Definition** | Total sessions and unique users arriving via organic search (Google, Bing, other engines). Excludes paid search, direct, and referral. |
| **Why it matters** | The primary volume indicator. If this declines, something is wrong — algorithm update, technical issue, content decay, or competitive displacement. |
| **Data source** | Google Analytics 4 (GA4) — Acquisition > Traffic acquisition > Session source/medium = "google / organic" + other search engines |
| **Measurement frequency** | Daily monitoring, weekly trend review, monthly reporting |
| **Target** | {{ORGANIC_TRAFFIC_TARGET}} sessions/month (set based on historical growth rate + strategic ambition) |
| **Segmentation** | Break down by: landing page group, device type, geography, new vs returning users |

**Dashboard widget:** Line chart showing daily organic sessions with 7-day moving average. Overlay previous period (dotted line) for comparison.

---

### 2. Organic Conversions and Revenue

| Attribute | Value |
|---|---|
| **Definition** | Conversions (goal completions or key events) and attributed revenue from organic search traffic. |
| **Why it matters** | Traffic without conversions is vanity. This metric connects SEO to business outcomes. |
| **Data source** | GA4 — Conversions by session source/medium = organic. For revenue: GA4 ecommerce or CRM attribution data. |
| **Measurement frequency** | Weekly review, monthly reporting |
| **Target** | {{ORGANIC_CONVERSION_TARGET}} conversions/month at {{ORGANIC_CONVERSION_RATE_TARGET}}% conversion rate |
| **Segmentation** | By conversion type (signup, purchase, lead form, demo request), by landing page, by keyword intent group |

**Conversion types to track for {{PROJECT_NAME}}:**
- [ ] Primary conversion: {{PRIMARY_CONVERSION_EVENT}}
- [ ] Secondary conversion: {{SECONDARY_CONVERSION_EVENT}}
- [ ] Micro-conversions: email signup, resource download, free trial start

**Dashboard widget:** Bar chart (monthly conversions) with line overlay (conversion rate %). Include revenue figure as a large number card.

---

### 3. Keyword Visibility Score

| Attribute | Value |
|---|---|
| **Definition** | Percentage of target keywords ranking on page 1 (positions 1-10) of Google. Calculated as: (keywords on page 1 / total tracked keywords) x 100. |
| **Why it matters** | Aggregate ranking health indicator. A single keyword fluctuating is noise. Visibility score declining across the board is a signal. |
| **Data source** | Ahrefs Rank Tracker, SEMrush Position Tracking, or AccuRanker — tracking your defined keyword set |
| **Measurement frequency** | Weekly |
| **Target** | {{VISIBILITY_SCORE_TARGET}}% of target keywords on page 1 |
| **Segmentation** | By keyword group (brand, non-brand commercial, non-brand informational), by topic cluster |

**Calculation method:**
```
Visibility Score = (Keywords in positions 1-10) / (Total tracked keywords) x 100

Weighted alternative (more nuanced):
  Position 1  = 100 points
  Position 2  = 70 points
  Position 3  = 50 points
  Positions 4-10 = 10-40 points (descending)
  Positions 11+ = 0 points

  Weighted Score = (Sum of points) / (Total keywords x 100) x 100
```

**Dashboard widget:** Gauge showing current visibility %. Line chart showing weekly trend. Pie chart showing position distribution (1-3, 4-10, 11-20, 21-50, 50+).

---

### 4. Domain Authority / Rating Trend

| Attribute | Value |
|---|---|
| **Definition** | Third-party authority metric — Ahrefs Domain Rating (DR) or Moz Domain Authority (DA). A logarithmic scale (0-100) estimating overall backlink strength. |
| **Why it matters** | Leading indicator of ranking potential. A rising DR/DA means your link-building efforts are working. A declining score means competitors are outbuilding you. |
| **Data source** | Ahrefs (DR) or Moz (DA) — pull monthly |
| **Measurement frequency** | Monthly (these metrics do not change daily) |
| **Target** | DR/DA {{DOMAIN_AUTHORITY_TARGET}} within {{DOMAIN_AUTHORITY_TIMEFRAME}} |
| **Context** | Compare against top 5 competitors. Absolute number matters less than relative position. |

**Dashboard widget:** Large number card showing current DR/DA. Line chart showing 12-month trend. Comparison table with competitor DR/DA.

---

### 5. Backlink Growth (New Referring Domains)

| Attribute | Value |
|---|---|
| **Definition** | Net new unique referring domains linking to {{PROJECT_NAME}} per month. One domain = one referring domain regardless of how many pages on that domain link to you. |
| **Why it matters** | Referring domain growth is the most reliable predictor of ranking improvement. More domains linking to you = more authority signals = better rankings over time. |
| **Data source** | Ahrefs (Referring Domains report), SEMrush (Backlink Analytics), Google Search Console (Links report — less detailed) |
| **Measurement frequency** | Monthly |
| **Target** | Net +{{BACKLINK_GROWTH_TARGET}} referring domains per month |
| **Segmentation** | By quality tier (DR 50+, DR 30-49, DR 10-29, DR 0-9), by link type (editorial, directory, social, user-generated) |

**Important distinctions:**
- Track *net* growth (new - lost), not just new. Losing 50 referring domains while gaining 60 is +10 net — very different from gaining 60 from a base of 0 lost.
- Exclude low-quality / spam referring domains from targets. Quality-filtered growth is the metric that matters.

**Dashboard widget:** Bar chart showing monthly new vs lost referring domains. Running total line chart. Quality distribution pie chart.

---

### 6. Core Web Vitals Pass Rate

| Attribute | Value |
|---|---|
| **Definition** | Percentage of {{PROJECT_NAME}} URLs that pass all three Core Web Vitals thresholds: LCP < 2.5s, INP < 200ms, CLS < 0.1. Based on field data (real user metrics), not lab data. |
| **Why it matters** | Core Web Vitals are a confirmed ranking factor. Failing CWV on critical pages means a ranking penalty relative to competitors who pass. |
| **Data source** | Google Search Console (Core Web Vitals report), Chrome UX Report (CrUX), PageSpeed Insights API |
| **Measurement frequency** | Monthly (CrUX data updates monthly on the rolling 28-day window) |
| **Target** | {{CWV_PASS_RATE_TARGET}}% of URLs passing all three metrics |
| **Segmentation** | By page type (homepage, product pages, blog posts, category pages), by device (mobile, desktop) |

**Dashboard widget:** Three gauge charts (one per CWV metric) showing pass rate. Trend line for each. Table of worst-performing URLs.

---

### 7. Index Coverage Health

| Attribute | Value |
|---|---|
| **Definition** | Percentage of submitted URLs (in sitemap) that Google has indexed. Calculated as: (indexed URLs / sitemap URLs) x 100. |
| **Why it matters** | If Google is not indexing your pages, they cannot rank. A declining index rate signals crawl issues, quality problems, or canonical confusion. |
| **Data source** | Google Search Console — Pages report (Indexing section) |
| **Measurement frequency** | Weekly check, monthly reporting |
| **Target** | {{INDEX_COVERAGE_TARGET}}% of sitemap URLs indexed |
| **Breakdown** | Track by exclusion reason: "Crawled - not indexed," "Discovered - not indexed," "Blocked by robots.txt," "Duplicate without canonical," etc. |

**Red flags to monitor:**
- "Crawled - currently not indexed" increasing — Google is crawling but choosing not to index (content quality signal)
- "Discovered - currently not indexed" increasing — Google knows about the URL but has not crawled it (crawl budget or priority issue)
- Indexed count declining without corresponding page removals — potential deindexation

**Dashboard widget:** Stacked bar showing indexed vs excluded counts. Exclusion reason breakdown table. Trend line of indexed percentage.

---

### 8. Crawl Error Rate

| Attribute | Value |
|---|---|
| **Definition** | Percentage of Googlebot crawl requests that return errors (4xx, 5xx, timeout, redirect loops). |
| **Why it matters** | High crawl error rates waste crawl budget and signal site instability to Google. Persistent 5xx errors can lead to deindexation. |
| **Data source** | Google Search Console — Settings > Crawl stats. Server access logs (see `36-seo/measurement/crawl-budget-log-analysis.md`). |
| **Measurement frequency** | Weekly |
| **Target** | Crawl error rate below {{CRAWL_ERROR_RATE_TARGET}}% |
| **Breakdown** | By error type: 404, 410, 500, 503, redirect loops, DNS errors, timeout |

**Dashboard widget:** Percentage card showing current error rate. Line chart of crawl error trend. Table of top error URLs.

---

### 9. Organic CTR (Click-Through Rate)

| Attribute | Value |
|---|---|
| **Definition** | Average click-through rate from Google Search results to {{PROJECT_NAME}}. Calculated as: (clicks / impressions) x 100. |
| **Why it matters** | CTR indicates how compelling your titles and meta descriptions are relative to competitors on the same SERP. A declining CTR with stable rankings suggests your SERP presentation needs improvement — or AI Overviews are absorbing clicks. |
| **Data source** | Google Search Console — Performance report |
| **Measurement frequency** | Monthly |
| **Target** | Average organic CTR of {{ORGANIC_CTR_TARGET}}% (benchmark varies dramatically by position — see targets below) |
| **Segmentation** | By query type (brand vs non-brand), by position range, by page |

**CTR benchmarks by position (approximate, varies by industry and SERP features):**

| Position | Expected CTR Range | Notes |
|---|---|---|
| 1 | 20-35% | Highly variable based on SERP features present |
| 2 | 10-18% | |
| 3 | 7-12% | |
| 4-7 | 3-7% | |
| 8-10 | 1-3% | |
| 11+ | <1% | Below the fold / page 2 |

**AI Overview impact:** Queries with AI Overviews show 30-60% lower CTR across all positions. Segment CTR analysis by queries with vs without AI Overviews when this data becomes available in Search Console.

**Dashboard widget:** Line chart of average CTR over time. Scatter plot of CTR vs position (to identify over/under-performers). Table of lowest-CTR high-impression pages (optimization opportunities).

---

### 10. Content Freshness Score

| Attribute | Value |
|---|---|
| **Definition** | Percentage of indexed content pages that have been reviewed or updated within their target refresh window. |
| **Why it matters** | Stale content decays in rankings. A freshness score ensures the content team maintains the existing asset base rather than only producing new content. |
| **Data source** | Internal content management system or a manual content audit tracker |
| **Measurement frequency** | Monthly |
| **Target** | {{CONTENT_FRESHNESS_TARGET}}% of content within its refresh window |
| **Refresh windows** | Define per content type (see table below) |

**Refresh windows by content type:**

| Content Type | Refresh Window | Action on Refresh |
|---|---|---|
| Product/feature pages | Every release cycle | Update features, screenshots, pricing |
| Data-driven articles | Quarterly | Update statistics, benchmarks, citations |
| Evergreen guides | Annually | Verify accuracy, update examples, check links |
| Comparison pages | Every 6 months | Re-evaluate competitors, update pricing/features |
| News/trend content | Do not refresh | Archive or mark as historical |

**Dashboard widget:** Percentage gauge of content within refresh window. Bar chart showing content by freshness status (current, due for refresh, overdue). List of top priority refresh candidates (high-traffic pages that are overdue).

---

## Dashboard Layout

### Recommended Layout (Top-to-Bottom)

```
┌─────────────────────────────────────────────────────────┐
│  ROW 1: Executive Summary Cards                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Organic   │ │ Organic  │ │ Keyword  │ │ Domain   │   │
│  │ Sessions  │ │ Revenue  │ │ Visibility│ │ Authority│   │
│  │ 125,000   │ │ $48,200  │ │ 67%      │ │ DR 52    │   │
│  │ ▲ +12%    │ │ ▲ +8%   │ │ ▲ +3pp   │ │ ▲ +2     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────────────────┤
│  ROW 2: Traffic & Conversions (line charts)             │
│  ┌────────────────────────┐ ┌────────────────────────┐  │
│  │ Organic Sessions       │ │ Organic Conversions    │  │
│  │ (daily, 90-day view)   │ │ (weekly, 90-day view)  │  │
│  └────────────────────────┘ └────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ROW 3: Rankings & Authority                            │
│  ┌────────────────────────┐ ┌────────────────────────┐  │
│  │ Keyword Visibility     │ │ Referring Domains      │  │
│  │ (weekly trend + dist.) │ │ (monthly new vs lost)  │  │
│  └────────────────────────┘ └────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ROW 4: Technical Health                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ CWV Pass │ │ Index    │ │ Crawl    │ │ Content  │   │
│  │ Rate     │ │ Coverage │ │ Errors   │ │ Freshness│   │
│  │ 89%      │ │ 94%      │ │ 0.3%     │ │ 78%      │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────────────────┤
│  ROW 5: CTR & Optimization Opportunities                │
│  ┌────────────────────────┐ ┌────────────────────────┐  │
│  │ Organic CTR Trend      │ │ Low-CTR High-Impression│  │
│  │ (monthly, by position) │ │ Pages (action table)   │  │
│  └────────────────────────┘ └────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Dashboard Design Principles

- **Top row = business impact.** Executives look at the top of the dashboard. Put the metrics they care about (sessions, revenue, visibility, authority) there.
- **Middle rows = strategy indicators.** Rankings, backlinks — these tell the SEO team whether strategies are working.
- **Bottom rows = technical health.** CWV, index coverage, crawl errors — these are diagnostic. Green means no action needed.
- **Every chart shows comparison.** Current vs previous period, or current vs target. A number without context is meaningless.
- **Use color consistently.** Green = on target, yellow = attention needed, red = action required. Same colors everywhere.

---

## Alert Thresholds

Set alerts in {{DASHBOARD_TOOL}} for the following conditions. Do not alert on noise — only alert on signals that require action.

| Metric | Green (On Track) | Yellow (Attention) | Red (Action Required) |
|---|---|---|---|
| Organic sessions (WoW) | Within -5% to +20% | -5% to -15% decline | >15% decline |
| Organic conversions (WoW) | Within -10% to +30% | -10% to -25% decline | >25% decline |
| Keyword visibility | Above {{VISIBILITY_SCORE_TARGET}}% | 5-10pp below target | >10pp below target |
| Domain authority | Stable or growing | Declined 2+ points in a month | Declined 5+ points in a month |
| New referring domains | Meeting monthly target | 50-75% of target | Below 50% of target |
| Core Web Vitals pass rate | Above 90% | 75-90% | Below 75% |
| Index coverage | Above 90% of sitemap | 80-90% | Below 80% |
| Crawl error rate | Below 1% | 1-5% | Above 5% |
| Organic CTR (non-brand) | Within historical range | >20% decline from historical | >40% decline from historical |
| Content freshness | Above 80% current | 60-80% current | Below 60% current |

### Alert Routing

| Severity | Notification Channel | Response Time |
|---|---|---|
| Red | Slack/Teams channel + email to SEO lead + ticket created | Within 24 hours |
| Yellow | Slack/Teams channel + weekly review agenda | Within 1 week |
| Green | Dashboard only — no notification | No action needed |

---

## Tool-Specific Setup

### Google Analytics 4 (GA4)

**Required configuration:**

1. **Organic traffic segment.** Create a segment: Session source/medium contains "organic". Save as "Organic Search Traffic" for reuse across reports.

2. **Conversion events.** Ensure the following events are marked as conversions:
   - {{PRIMARY_CONVERSION_EVENT}}
   - {{SECONDARY_CONVERSION_EVENT}}
   - Additional micro-conversions as relevant

3. **Content grouping.** Group pages by type (blog, product, landing, docs) to analyze organic performance by content category. Set via `content_group` parameter in GA4 config.

4. **Custom explorations.** Build a landing page exploration: Rows = landing page, Columns = organic sessions, conversions, conversion rate, revenue. Filter to organic traffic. Sort by sessions descending.

5. **Looker Studio connection.** Connect GA4 to Looker Studio (or {{DASHBOARD_TOOL}}) as a data source. Use the GA4 connector, not Universal Analytics.

### Google Search Console (GSC)

**Required configuration:**

1. **Property verification.** Verify both the domain property (covers all subdomains) and the URL-prefix property (for more granular data).

2. **Performance report setup.** Default date range: Last 28 days. Compare to: Previous period. Filter by search type: Web.

3. **Regex filters for keyword groups.** Create saved filters for:
   - Brand queries: `{{BRAND_REGEX}}`
   - Non-brand queries: exclude brand regex
   - Commercial intent queries: keywords containing "buy," "pricing," "compare," "best," "review"

4. **API access.** Set up the Search Console API for automated data pulls into {{DASHBOARD_TOOL}}. GSC retains 16 months of data — start pulling immediately.

5. **URL inspection API.** Use for automated index coverage monitoring at scale.

### Ahrefs / SEMrush

**Required configuration:**

1. **Project setup.** Create a project for {{PROJECT_NAME}} with your root domain.

2. **Rank tracking.** Add your target keyword list (organized by groups: brand, commercial, informational). Set tracking to:
   - Country: {{TARGET_COUNTRY}}
   - Device: Mobile + Desktop (track both)
   - Frequency: Daily for top 50 keywords, weekly for the rest

3. **Backlink monitoring.** Enable new/lost backlink alerts. Set up weekly email digests.

4. **Competitor tracking.** Add your top 5 competitors for side-by-side visibility comparison.

5. **API integration.** Connect the Ahrefs/SEMrush API to {{DASHBOARD_TOOL}} for automated reporting. Rate limits vary by plan — check before setting up frequent pulls.

---

## BI Pipeline Integration

Connect SEO data to the broader business intelligence infrastructure documented in `35-business-intelligence/`.

### Data Flow

```
Google Analytics 4 ──┐
                     │
Search Console ──────┼──→ Data warehouse ──→ BI dashboard
                     │    (BigQuery /        (Looker Studio /
Ahrefs / SEMrush ────┤     Snowflake /        Tableau /
                     │     {{DW_TOOL}})        {{DASHBOARD_TOOL}})
Server logs ─────────┘
```

### Integration Points

1. **GA4 to BigQuery export.** Enable the free GA4 > BigQuery export for raw event-level data. This allows custom SQL analysis beyond GA4's interface limitations.

2. **Search Console to BigQuery.** Use the Search Console bulk data export (available in GSC settings) for large-scale query analysis.

3. **Third-party tool APIs.** Schedule daily/weekly API pulls from Ahrefs/SEMrush into your data warehouse. Store historical data — these tools have retention limits.

4. **Unified attribution model.** Join organic search data with CRM data to calculate true SEO ROI (organic visit > lead > opportunity > closed deal). This requires aligning GA4 client IDs with CRM contact records.

5. **Cross-channel comparison.** In the BI layer, compare SEO performance against paid search, social, and direct channels using consistent metric definitions. Reference `35-business-intelligence/` for unified metric definitions.

---

## Cross-References

- `36-seo/measurement/rank-tracking-setup.md` — detailed rank tracking methodology
- `36-seo/measurement/crawl-budget-log-analysis.md` — server log analysis for crawl metrics
- `36-seo/measurement/seo-reporting.template.md` — reporting templates using these KPIs
- `36-seo/technical/core-web-vitals-playbook.md` — CWV optimization details
- `35-business-intelligence/` — BI pipeline architecture and unified metrics
