# SEO Audit Generator

**Purpose:** Generate a tailored, comprehensive SEO audit for any project. The generator takes project context as input and produces a structured audit document covering technical SEO, on-page optimization, content quality, off-page signals, competitive positioning, and performance.

**Output:** Audit report in `dev_docs/seo/audit-YYYY-QN.md`

---

## When to Run

| Trigger | Scope |
| ------- | ----- |
| Project kickoff (new site or inherited site) | Full audit — all sections |
| Quarterly cadence | Full audit — compare to previous quarter |
| Before a migration | Technical audit focus + baseline metrics |
| After a traffic drop | Targeted audit on affected areas |
| Before a major content initiative | Content + competitive audit focus |
| Post-launch (new site/feature) | Technical + on-page audit focus |

**Recommended cadence:** Full audit quarterly, quick monthly checks per `36-seo/audit/monthly-audit-checklist.md`.

---

## Inputs Required

Before running the generator, gather these inputs:

| Input | Source | What It Provides |
| ----- | ------ | ---------------- |
| `{{PROJECT_NAME}}` | Project config | Identifies the project |
| `{{PRIMARY_DOMAIN}}` | DNS / hosting | The domain being audited |
| `{{TECH_STACK}}` | Architecture docs | Framework, hosting, CDN — affects technical SEO recommendations |
| `{{PRODUCT_TYPE}}` | Business docs | SaaS, e-commerce, content site, marketplace — affects audit priorities |
| `{{SEO_MATURITY}}` | Self-assessment | Beginner / Intermediate / Advanced — adjusts recommendation depth |
| `{{DOMAIN_AGE}}` | Whois lookup | How long the domain has been registered and active |
| `{{APPROXIMATE_PAGE_COUNT}}` | Screaming Frog crawl or `site:` search | Scale of the audit |
| `{{PRIMARY_KEYWORDS}}` | Keyword research or existing tracking | Top 10-20 target keywords |
| `{{PRIMARY_COMPETITORS}}` | Business knowledge | Top 3-5 organic competitors |
| `{{GOOGLE_SEARCH_CONSOLE_ACCESS}}` | GSC | Required for indexation, performance, CWV data |
| `{{GA4_ACCESS}}` | GA4 | Required for traffic, conversion, behavior data |

---

## Generator Prompt

Use this prompt to generate a tailored SEO audit. Provide it to your AI assistant along with the inputs above.

```
You are an expert SEO auditor. Generate a comprehensive SEO audit for the
following project. Be specific and actionable — every finding must include
the exact issue, where it was found, why it matters, and how to fix it.

PROJECT CONTEXT:
- Project: {{PROJECT_NAME}}
- Domain: {{PRIMARY_DOMAIN}}
- Tech stack: {{TECH_STACK}}
- Product type: {{PRODUCT_TYPE}}
- SEO maturity: {{SEO_MATURITY}}
- Domain age: {{DOMAIN_AGE}}
- Approximate page count: {{APPROXIMATE_PAGE_COUNT}}
- Primary keywords: {{PRIMARY_KEYWORDS}}
- Primary competitors: {{PRIMARY_COMPETITORS}}

AUDIT STRUCTURE:

1. EXECUTIVE SUMMARY (1 page max)
   - Overall SEO health score (0-100)
   - Top 3 critical issues requiring immediate action
   - Top 3 opportunities for quick wins
   - Quarter-over-quarter trend (if previous audit exists)

2. TECHNICAL SEO AUDIT
   Crawl and index the site. Check every item below. For each issue found,
   document: the issue, affected URLs (up to 10 examples), severity
   (Critical/High/Medium/Low), estimated effort to fix, and expected impact.

   Checks:
   - Crawlability: robots.txt, XML sitemap, crawl budget, redirect chains
   - Indexation: Coverage report, noindex pages, canonical tags, duplicate content
   - Site architecture: URL structure, internal linking depth, orphan pages
   - Page speed: Core Web Vitals (LCP, CLS, INP), PageSpeed scores
   - Mobile: Mobile-friendliness, responsive design, touch targets
   - Security: HTTPS, mixed content, security headers
   - Rendering: JavaScript rendering, critical CSS, above-the-fold content
   - International: Hreflang (if applicable), language targeting
   - Structured data: Schema markup presence, validation, rich result eligibility

   For {{TECH_STACK}} specifically, check:
   - Framework-specific SEO issues (SSR vs CSR, hydration, routing)
   - CDN and caching configuration
   - Build output (static HTML vs dynamic rendering)

3. ON-PAGE SEO AUDIT
   Analyze the top 20 pages by organic traffic. For each:
   - Title tag (length, keyword inclusion, uniqueness)
   - Meta description (length, compelling copy, uniqueness)
   - H1 tag (presence, single H1, keyword alignment)
   - Header hierarchy (H2-H6 structure)
   - Content quality (depth, originality, E-E-A-T signals)
   - Internal links (count, anchor text diversity)
   - Image optimization (alt text, file size, modern formats)
   - URL structure (length, readability, keyword inclusion)

4. CONTENT AUDIT
   - Content inventory: total pages by type (blog, product, landing, etc.)
   - Thin content: pages with <300 words or low uniqueness
   - Content gaps: keywords competitors rank for that you don't
   - Content decay: pages that have lost >20% traffic year-over-year
   - Keyword cannibalization: multiple pages targeting the same keyword
   - Content freshness: percentage of content updated in last 12 months
   - Topical authority assessment: depth of coverage in core topics

5. OFF-PAGE AUDIT
   - Backlink profile: total backlinks, referring domains, DR/DA distribution
   - Link quality: percentage of follow vs nofollow, editorial vs non-editorial
   - Toxic links: count and percentage of potentially harmful links
   - Competitor comparison: backlink gap analysis
   - Brand mentions: unlinked brand mentions that could become links
   - Digital PR opportunities: newsworthy angles for link earning

6. COMPETITIVE ANALYSIS
   For each of {{PRIMARY_COMPETITORS}}:
   - Domain authority comparison
   - Content gap (keywords they rank for that you don't)
   - Content overlap (keywords you both rank for — who is winning?)
   - Technical comparison (page speed, mobile experience)
   - SERP feature ownership (featured snippets, AI overviews, PAA)
   - Backlink comparison

7. PERFORMANCE & MEASUREMENT
   - GA4 configuration: events, conversions, attribution
   - GSC configuration: all properties verified, correct settings
   - Rank tracking: primary keywords tracked, reporting cadence
   - Reporting: dashboards, stakeholder reports, KPI definitions
   - Attribution: organic contribution to pipeline/revenue

OUTPUT FORMAT:
For each finding, use this structure:

### [FINDING TITLE]

| Field | Value |
| ----- | ----- |
| Section | [Technical / On-Page / Content / Off-Page / Competitive / Performance] |
| Severity | [Critical / High / Medium / Low] |
| Effort | [Hours / Days / Weeks] |
| Impact | [High / Medium / Low] |
| Priority | [P1 / P2 / P3 / P4] based on severity × impact ÷ effort |

**Issue:** [What is wrong]
**Evidence:** [URLs, screenshots, data]
**Recommendation:** [Exactly what to do to fix it]
**Expected outcome:** [What will improve and by approximately how much]

END OF AUDIT with an action plan table sorted by priority.
```

---

## Scoring Methodology

### Overall SEO Health Score (0-100)

| Section | Weight | Max Points | Scoring |
| ------- | ------ | ---------- | ------- |
| Technical SEO | 30% | 30 | Deduct points per critical/high finding |
| On-Page SEO | 20% | 20 | Score based on top 20 pages' optimization level |
| Content | 20% | 20 | Score based on depth, freshness, gaps, cannibalization |
| Off-Page | 15% | 15 | Score based on backlink quality and competitor comparison |
| Performance & Measurement | 15% | 15 | Score based on tracking accuracy and reporting maturity |

### Severity-to-Deduction Mapping

| Severity | Points Deducted (from section max) |
| -------- | ---------------------------------- |
| Critical | -5 per finding |
| High | -3 per finding |
| Medium | -1 per finding |
| Low | -0.5 per finding |

### Score Interpretation

| Score | Assessment | Action |
| ----- | ---------- | ------ |
| 90-100 | Excellent | Maintain and iterate |
| 75-89 | Good | Address high-priority findings |
| 60-74 | Needs improvement | Dedicated SEO sprint required |
| 40-59 | Poor | Significant investment needed |
| 0-39 | Critical | SEO is actively harming the business |

---

## Quarterly Cadence Recommendation

| Quarter | Focus |
| ------- | ----- |
| Q1 | Full audit + annual strategy review. Set targets for the year. |
| Q2 | Full audit + content strategy review. Mid-year course correction. |
| Q3 | Full audit + technical debt review. Pre-holiday preparation (if e-commerce). |
| Q4 | Full audit + year-in-review. Document wins and losses. Plan next year. |

Between quarterly audits, run the monthly checklist (`36-seo/audit/monthly-audit-checklist.md`) to catch issues early.

---

## Audit Output Location

```
dev_docs/seo/
  audit-2026-Q1.md          ← Full quarterly audit
  audit-2026-Q2.md
  audit-monthly-2026-01.md  ← Monthly quick audit
  audit-monthly-2026-02.md
  ...
```

---

## Cross-References

- **Quarterly deep audit template:** `36-seo/audit/quarterly-deep-audit.template.md`
- **Monthly audit checklist:** `36-seo/audit/monthly-audit-checklist.md`
- **Generator pattern reference:** `10-generators/AUDIT-GENERATOR.md`
- **Incident response:** `36-seo/incident/seo-incident-response.md`
