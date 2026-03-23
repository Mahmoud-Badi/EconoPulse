# Rank Tracking Setup

How to set up, maintain, and act on keyword rank tracking for {{PROJECT_NAME}}. Rank tracking is not a vanity exercise — it is the feedback loop that validates whether your SEO strategy is working, identifies emerging opportunities, and catches problems before they become crises.

---

## Table of Contents

1. [Why Track Rankings](#why-track-rankings)
2. [Choosing a Rank Tracking Tool](#choosing-a-rank-tracking-tool)
3. [What to Track](#what-to-track)
4. [Tracking Frequency](#tracking-frequency)
5. [SERP Feature Tracking](#serp-feature-tracking)
6. [Mobile vs Desktop Tracking](#mobile-vs-desktop-tracking)
7. [Local Rank Tracking](#local-rank-tracking)
8. [Rank Volatility Alerting](#rank-volatility-alerting)
9. [Competitor Rank Comparison](#competitor-rank-comparison)
10. [Reporting](#reporting)

---

## Why Track Rankings

Rankings are the leading indicator of organic traffic. Traffic changes lag ranking changes by days to weeks. By the time a traffic drop shows up in Google Analytics, the ranking drop happened earlier.

**What rank tracking tells you that traffic data does not:**

- **Strategy validation.** You published 10 articles targeting a topic cluster. Are they ranking? If positions are improving week over week (even if they are still on page 2), the strategy is working. Traffic data would show nothing yet.
- **Competitive displacement.** A competitor published a massive guide targeting your top keyword. Rank tracking shows your position dropped from 3 to 7 immediately. Traffic data shows a gradual decline over weeks — by then, the damage is done and the cause is harder to identify.
- **Algorithm update impact.** Google rolls out a core update. Rank tracking shows your commercial keywords dropped while informational keywords improved. This tells you the update favored informational content — a strategic insight traffic data alone cannot provide.
- **Content decay detection.** A page that ranked #2 for 18 months slowly drifts to #5, then #8. The traffic decline is gradual and hard to spot in aggregate traffic data. Rank tracking makes the decay visible immediately.
- **Cannibalization detection.** Two pages compete for the same keyword. Rank tracking shows them alternating between positions 6 and 15, with neither stabilizing on page 1. Traffic data just shows both pages underperforming.

---

## Choosing a Rank Tracking Tool

### Free: Google Search Console

**What it provides:**
- Average position for every query that generated an impression in the last 16 months
- Click, impression, and CTR data alongside position
- No limit on the number of queries tracked
- Real data from real SERPs (not simulated)

**Limitations:**
- Average position is averaged across all impressions (including page 2+ appearances), making it less accurate for volatile keywords
- Data is delayed 2-3 days
- No daily tracking — data is aggregated by date range
- Cannot track keywords you do not yet rank for (no prospective tracking)
- No competitor data
- No SERP feature tracking (no featured snippet detection, no AI Overview tracking)
- Cannot track specific locations (national-level only, or country-level)

**Verdict:** Use Search Console as your baseline truth source. It is free and based on real Google data. But it is not sufficient as your only rank tracking tool for an active SEO program.

### Paid: Dedicated Rank Trackers

| Tool | Strengths | Limitations | Pricing Tier |
|---|---|---|---|
| **Ahrefs Rank Tracker** | Integrated with backlink/content data; SERP feature tracking; competitor tracking | Tracking limits tied to plan; daily tracking only on higher plans | Mid-high ($) |
| **SEMrush Position Tracking** | SERP feature tracking; cannibalization detection; local tracking; competitor overlap | Can be slow with large keyword sets; interface complexity | Mid-high ($) |
| **AccuRanker** | Fastest daily rank checks; on-demand rank refresh; excellent API; SERP feature data | Backlink/content data requires separate tools | Mid ($) |
| **SE Ranking** | Strong local tracking; affordable; includes basic site audit | Less accurate on low-volume keywords; smaller index than Ahrefs/SEMrush | Low-mid ($) |
| **STAT (by Moz)** | Enterprise-scale tracking (thousands of keywords); best SERP feature analysis | Expensive; complex setup; overkill for most sites | High ($$) |
| **Wincher** | Simple, affordable, good for small-to-mid sites; clean UI | Limited SERP feature data; no competitor tracking in basic plan | Low ($) |

### Selection Criteria for {{PROJECT_NAME}}

- [ ] **Keyword volume.** How many keywords do you need to track? Under 500: any tool works. 500-5,000: Ahrefs, SEMrush, or AccuRanker. 5,000+: AccuRanker or STAT.
- [ ] **Update frequency.** Do you need daily tracking? Weekly is fine for most sites. Daily matters for competitive commercial keywords.
- [ ] **SERP feature tracking.** If AI Overviews, featured snippets, and People Also Ask matter to your strategy, you need a tool that tracks them.
- [ ] **Local tracking.** If {{PROJECT_NAME}} targets specific cities or regions, you need location-specific tracking.
- [ ] **API access.** If you want automated reporting in {{DASHBOARD_TOOL}}, the tool needs a reliable API.
- [ ] **Budget.** Rank tracking is a recurring cost. Factor it into the annual SEO tool budget.

---

## What to Track

Not every keyword deserves a tracking slot. Be deliberate about what you track and organize keywords into groups.

### Keyword Categories

#### Primary Keywords (Track Daily)

These are the keywords directly tied to {{PROJECT_NAME}}'s revenue. They represent high-intent, high-volume queries where ranking improvements translate directly to business outcomes.

- [ ] Core product/service keywords (5-20 keywords)
- [ ] High-commercial-intent keywords (10-30 keywords)
- [ ] Top-performing current keywords (your existing top 10 traffic drivers)

**Example keyword set:**
```
"{{PRIMARY_KEYWORD_1}}" — monthly volume: {{VOLUME}}, current position: {{POSITION}}
"{{PRIMARY_KEYWORD_2}}" — monthly volume: {{VOLUME}}, current position: {{POSITION}}
[...]
```

#### Secondary Keywords (Track Weekly)

These are supporting keywords — informational queries, long-tail variations, and emerging opportunities.

- [ ] Topic cluster supporting keywords (50-200 keywords)
- [ ] Long-tail variations of primary keywords
- [ ] Question-based queries (how to, what is, why does)
- [ ] Keywords targeting upper-funnel awareness content

#### Brand Keywords (Track Weekly)

Your brand name and variations. These should be position 1 — if they are not, you have a brand protection problem.

- [ ] `{{PROJECT_NAME}}` (exact brand name)
- [ ] `{{PROJECT_NAME}} reviews`
- [ ] `{{PROJECT_NAME}} pricing`
- [ ] `{{PROJECT_NAME}} vs [competitor]` (for each major competitor)
- [ ] `{{PROJECT_NAME}} alternatives`
- [ ] Common misspellings of your brand name

#### Competitor Keywords (Track Weekly)

Keywords where your competitors rank and you want to compete.

- [ ] Competitor brand + "alternatives" (opportunity to appear on comparison SERPs)
- [ ] Keywords where competitors rank #1-3 and you rank #4-20 (closing-distance keywords)
- [ ] Keywords competitors are creating new content for (competitive intelligence)

### Keyword Organization

Organize tracked keywords into groups/tags for meaningful analysis:

| Group | Purpose | Example Keywords |
|---|---|---|
| Brand | Brand health monitoring | "{{PROJECT_NAME}}", "{{PROJECT_NAME}} login" |
| Commercial | Revenue-driving queries | "buy {{PRODUCT_CATEGORY}}", "{{PRODUCT_CATEGORY}} pricing" |
| Informational | Top-of-funnel awareness | "what is {{TOPIC}}", "how to {{TASK}}" |
| Competitor | Competitive displacement | "{{COMPETITOR}} alternatives", "{{COMPETITOR}} vs" |
| Topic: [Cluster Name] | Content strategy validation | Group by topic cluster |
| Page: [URL] | Per-page tracking | All keywords targeting a specific URL |

---

## Tracking Frequency

Not all keywords need the same tracking cadence. Over-tracking wastes tool credits and creates noise. Under-tracking means you miss problems.

| Keyword Category | Frequency | Rationale |
|---|---|---|
| Primary commercial keywords | Daily | Revenue impact is immediate; need to detect drops fast |
| Brand keywords | Daily | Brand hijacking or negative SEO requires immediate response |
| Secondary keywords | Weekly | Slower-moving; weekly is sufficient for trend detection |
| Competitor keywords | Weekly | Competitive landscape changes weekly, not daily |
| Long-tail / experimental | Weekly or bi-weekly | Low individual impact; batch analysis is more useful |
| Local keywords | Daily (if local is primary) or weekly | Local packs can shift daily |

### When to Increase Frequency

Temporarily switch to daily tracking for all keywords during:
- Google core algorithm updates (check for announcements, then track for 2-3 weeks)
- Major site migrations or redesigns
- After a large content publish (50+ pages)
- When investigating a traffic anomaly
- During competitive attacks (negative SEO, aggressive competitor campaigns)

---

## SERP Feature Tracking

Ranking position alone is insufficient. The SERP is not just 10 blue links anymore. A position-3 ranking below an AI Overview, a featured snippet, and a People Also Ask box may get fewer clicks than a position-8 ranking on a clean SERP.

### SERP Features to Track

| Feature | Impact on Organic CTR | Tracking Priority |
|---|---|---|
| **AI Overview** | Severe (-30 to -60% CTR for all results below) | Critical — track which of your keywords trigger AI Overviews |
| **Featured Snippet** | Dual: earns clicks if you own it, steals clicks if a competitor owns it | High — track ownership |
| **People Also Ask (PAA)** | Moderate — diverts some clicks to expanded answers | Medium — track presence and whether your domain appears |
| **Local Pack** | High for local-intent queries — pushes organic results below fold | High if {{PROJECT_NAME}} has local presence |
| **Video Carousel** | Moderate — captures clicks for how-to and tutorial queries | Medium — track if you have video content |
| **Shopping Results** | High for product queries — pushes organic results down | High for ecommerce; low for SaaS/service |
| **Knowledge Panel** | Low direct CTR impact, but strong brand signal | Medium for brand queries |
| **Image Pack** | Low-moderate — captures image-seeking queries | Low unless image-heavy niche |
| **Site Links** | Positive — increases your SERP real estate | Track for brand queries |
| **Top Stories** | High for news-related queries | Only relevant if you publish news content |

### SERP Feature Tracking Setup

1. **Enable SERP feature tracking in your rank tracker.** Ahrefs, SEMrush, and AccuRanker all track SERP features. Enable it for all tracked keywords.

2. **Create a SERP feature report.** For each keyword, record:
   - Which SERP features are present
   - Whether {{PROJECT_NAME}} owns any of them (featured snippet, PAA, video carousel)
   - Whether the feature is new (just appeared) or established

3. **Track featured snippet ownership over time.** Create a metric: "Featured snippets owned / Featured snippets available for tracked keywords." A declining ratio means competitors are taking your snippets.

4. **Monitor AI Overview presence.** Track what percentage of your target keywords trigger AI Overviews. Cross-reference with CTR data to measure impact. See `36-seo/ai-seo/ai-search-optimization.md` for detailed AI Overview strategy.

---

## Mobile vs Desktop Tracking

Google uses mobile-first indexing, which means your mobile rankings are the "real" rankings. But mobile and desktop SERPs differ, and both matter.

### Why Track Both

- **Different rankings.** The same keyword can rank #3 on mobile and #5 on desktop (or vice versa). This is because Google personalizes results by device type, screen size affects layout, and mobile-specific signals (page speed, mobile usability) influence mobile rankings.
- **Different SERP layouts.** Mobile SERPs show more SERP features above the fold (local pack, PAA, AI Overview), pushing organic results further down. A "position 1" on mobile may be below the fold.
- **Different user behavior.** Mobile users have different click patterns — they are more likely to click the first result and less likely to scroll.
- **Core Web Vitals differ by device.** Your CWV scores may pass on desktop and fail on mobile (or vice versa), affecting rankings on each device.

### Tracking Configuration

| Setting | Recommendation |
|---|---|
| Primary tracking device | Mobile (matches Google's mobile-first index) |
| Secondary tracking device | Desktop |
| Comparison reporting | Weekly comparison of mobile vs desktop positions |
| Alert on divergence | Alert if mobile and desktop rankings diverge by 5+ positions for any primary keyword |

### When Desktop Tracking Matters More

- B2B SaaS where the target audience primarily uses desktop
- Enterprise products with desktop-heavy user bases
- Developer tools and documentation (often accessed from desktop)

Even in these cases, track mobile as primary because Google indexes mobile-first regardless of your audience's device preference.

---

## Local Rank Tracking

If {{PROJECT_NAME}} targets specific geographic areas, local rank tracking is essential. Google returns different results based on the searcher's location, and the difference can be dramatic.

### When Local Tracking Is Needed

- [ ] {{PROJECT_NAME}} has a physical location (store, office, clinic)
- [ ] {{PROJECT_NAME}} serves specific geographic markets
- [ ] Target keywords have local intent ("near me," "[service] in [city]")
- [ ] You have a Google Business Profile

### Local Tracking Setup

1. **Define tracking locations.** List every city/region where {{PROJECT_NAME}} operates or targets customers. For each location, you will track the same keyword set but with location-specific results.

2. **Configure location-specific tracking.** In your rank tracker:
   - Set the location (city, zip code, or GPS coordinates depending on tool granularity)
   - Track both the organic results and the local pack (map results)
   - Track separately from national-level tracking

3. **Track local pack inclusion.** For local-intent keywords, the local pack (3-pack of Google Business Profile listings) dominates clicks. Track:
   - Whether {{PROJECT_NAME}} appears in the local pack
   - What position within the 3-pack
   - Which competitors appear alongside

4. **Monitor Google Business Profile rankings.** GBP rankings influence local pack appearance. Track:
   - Primary category ranking
   - Reviews count and rating (social proof affects CTR)
   - GBP post engagement

### Local Rank Tracking Tools

| Tool | Local Capability |
|---|---|
| BrightLocal | Purpose-built for local SEO; granular location tracking; GBP management |
| SEMrush | Good local tracking at city/zip level; integrated with broader SEO data |
| Whitespark | Strong local search tools; citation tracking |
| AccuRanker | Location-specific tracking with good API support |
| SE Ranking | Affordable local tracking; city-level granularity |

---

## Rank Volatility Alerting

Ranking fluctuations are normal. What is not normal is a sudden, sustained drop across multiple keywords. Set up alerts that distinguish signal from noise.

### Alert Configuration

| Alert Type | Trigger | Notification |
|---|---|---|
| **Single keyword crash** | Any primary keyword drops 10+ positions in one check | Email to SEO lead |
| **Broad position decline** | 20%+ of tracked keywords drop 3+ positions within one week | Email + Slack/Teams alert |
| **Brand keyword displacement** | Any brand keyword drops below position 1 | Immediate email + Slack/Teams |
| **Featured snippet lost** | {{PROJECT_NAME}} loses a featured snippet it previously held | Weekly digest |
| **New page 1 ranking** | Any keyword moves into positions 1-10 for the first time | Weekly digest (positive alert) |
| **Competitor surge** | A competitor gains 5+ new page 1 rankings in your keyword set within one week | Weekly digest |

### Triage Process When Alerts Fire

1. **Check scope.** Is the drop isolated to one page, one keyword group, or site-wide? Site-wide drops suggest an algorithm update or technical issue. Isolated drops suggest a page-specific problem or new competitor.

2. **Check for technical issues.** Is the page returning 200? Is it still indexed? Has robots.txt changed? Have canonical tags been modified? Technical problems are the most common cause of sudden drops.

3. **Check for algorithm updates.** Search "Google algorithm update [date]" on SEO news sites (Search Engine Roundtable, Search Engine Land). If an update is confirmed, wait 2-3 weeks before making changes — rankings often fluctuate during rollout and partially recover.

4. **Check the SERP.** Manually search the keyword. What changed? Did a new competitor enter? Did a SERP feature appear? Did an existing competitor update their content?

5. **Check for content changes.** Did your page change recently? CMS updates, template changes, and accidental edits can alter on-page signals.

6. **Document and respond.** Log the incident, the diagnosis, and the response. Track whether the response worked. Reference `36-seo/incident/` for incident response templates if available.

### Volatility Scoring

Calculate a weekly volatility score for your tracked keyword set:

```
Volatility Score = (Sum of |position change| for all keywords) / (Number of tracked keywords)

Interpretation:
  0-1.0: Low volatility (stable rankings)
  1.0-2.5: Normal volatility (routine fluctuations)
  2.5-5.0: Elevated volatility (investigate — possible algorithm update)
  5.0+: High volatility (likely algorithm update or site issue — triage immediately)
```

---

## Competitor Rank Comparison

Tracking your own rankings in isolation misses half the picture. Your position is relative — if you are not monitoring competitors, you cannot anticipate or respond to their moves.

### What to Track

1. **Keyword overlap.** What percentage of your tracked keywords do competitors also rank for? A high overlap means direct competition. Track overlap trend over time — growing overlap means a competitor is targeting your keyword territory.

2. **Position comparison.** For shared keywords, compare your position vs each competitor's position. Track the "competitive gap" — how many positions separate you from the nearest competitor.

3. **Visibility share.** Of all the search visibility available for your tracked keyword set (total impressions), what percentage does each competitor capture vs {{PROJECT_NAME}}? This is the organic equivalent of market share.

4. **Competitor content velocity.** How many new pages are competitors publishing per week/month? Are they accelerating? Tools like Ahrefs "New pages" filter and SEMrush "Competitive Research" provide this data.

5. **Competitor backlink acquisition rate.** How many new referring domains are competitors gaining per month? If they are outbuilding you on links, they will eventually outrank you.

### Competitor Tracking Setup

Add these competitors to your rank tracking tool:

| Competitor | Domain | Priority | Reason |
|---|---|---|---|
| {{COMPETITOR_1}} | {{COMPETITOR_1_DOMAIN}} | Primary | Closest market competitor |
| {{COMPETITOR_2}} | {{COMPETITOR_2_DOMAIN}} | Primary | Strongest organic presence in your niche |
| {{COMPETITOR_3}} | {{COMPETITOR_3_DOMAIN}} | Secondary | Emerging competitor / growing fast |
| {{COMPETITOR_4}} | {{COMPETITOR_4_DOMAIN}} | Secondary | Content competitor (blog/resource-focused) |
| {{COMPETITOR_5}} | {{COMPETITOR_5_DOMAIN}} | Watch | Potential new entrant |

### Competitive Intelligence Cadence

| Analysis | Frequency | Output |
|---|---|---|
| Position comparison | Weekly | Dashboard update |
| Visibility share | Monthly | Monthly SEO report section |
| New competitor content | Bi-weekly | Content team briefing |
| Competitor backlink analysis | Monthly | Link building strategy adjustment |
| Full competitive audit | Quarterly | Quarterly strategic review |

---

## Reporting

### Weekly Rank Report

A lightweight report delivered every Monday covering the previous week's ranking changes. Keep it brief and actionable.

**Template:**

```
WEEKLY RANK REPORT — {{PROJECT_NAME}}
Week of: [date range]
Prepared by: [name]

SUMMARY
─────────────
Total keywords tracked: [number]
Keywords on page 1: [number] ([%]) — change from last week: [+/- number]
Average position (all keywords): [number] — change: [+/- number]
Volatility score: [number] — [Low / Normal / Elevated / High]

NOTABLE MOVEMENTS
─────────────────
▲ Improvements (top 5 by position gain):
  1. "[keyword]" — [old position] → [new position] (page: [URL])
  2. ...

▼ Declines (top 5 by position loss):
  1. "[keyword]" — [old position] → [new position] (page: [URL])
  2. ...

🆕 New page 1 rankings:
  1. "[keyword]" — now at position [X] (page: [URL])

SERP FEATURE CHANGES
─────────────────────
Featured snippets owned: [number] (change: [+/-])
AI Overviews present for tracked keywords: [number] ([%])

COMPETITOR MOVEMENTS
────────────────────
[Notable competitor ranking changes — 2-3 bullet points max]

ACTION ITEMS
────────────
- [ ] [Specific action based on this week's data]
- [ ] [Specific action based on this week's data]
```

### Monthly Trend Analysis

A deeper analysis delivered at the end of each month. Included in the monthly SEO report (see `36-seo/measurement/seo-reporting.template.md`).

**What to include:**

1. **30-day position distribution chart.** Show how the distribution of rankings has shifted: more keywords moving into page 1, or more keywords sliding to page 2?

2. **Topic cluster performance.** For each topic cluster, show the average position of all keywords in the cluster. Which clusters are improving? Which are declining?

3. **Content ROI by ranking.** Which new content published this month is already ranking? What position? This validates content investment.

4. **Competitive position changes.** Month-over-month visibility share comparison against top 3 competitors.

5. **Keyword movement cohort analysis.** Group keywords by their movement pattern:
   - Stable (moved <2 positions): [X] keywords
   - Improving (gained 2+ positions): [X] keywords
   - Declining (lost 2+ positions): [X] keywords
   - New to page 1: [X] keywords
   - Lost from page 1: [X] keywords

6. **Correlation with SEO activities.** Map ranking changes to SEO activities completed that month (content published, links built, technical fixes). This builds the case for continued SEO investment.

---

## Cross-References

- `36-seo/measurement/seo-kpi-dashboard.template.md` — integrating rank data into the SEO dashboard
- `36-seo/measurement/seo-reporting.template.md` — monthly and quarterly reporting templates
- `36-seo/strategy/keyword-research-methodology.md` — how to build the keyword list that feeds rank tracking
- `36-seo/ai-seo/ai-search-optimization.md` — tracking AI Overview presence and citations
- `36-seo/strategy/seo-competitive-intelligence.template.md` — deeper competitive analysis methodology
