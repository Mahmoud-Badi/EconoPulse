# Monthly SEO Audit Checklist

A monthly SEO audit should take 1-2 hours. It is not a deep dive — it is a health check that catches problems early before they become incidents. Run this on the first business day of each month.

For the comprehensive quarterly audit, see `36-seo/audit/quarterly-deep-audit.template.md`.

---

## Weekly Quick Checks (5 Minutes Each)

Run these every Monday morning. They take 5 minutes total and catch critical issues fast.

- [ ] **Search Console manual actions:** GSC → Security & Manual Actions → Manual Actions. Any new issues? (Should say "No issues detected.")
- [ ] **Search Console security issues:** GSC → Security & Manual Actions → Security Issues. Any new issues?
- [ ] **Crawl errors spike:** GSC → Indexing → Pages. Has the error count increased significantly since last week?
- [ ] **Sitemap status:** GSC → Indexing → Sitemaps. Is the sitemap still submitted and processing without errors?
- [ ] **Uptime:** Check your uptime monitor (Pingdom, UptimeRobot, etc.). Any downtime in the past week?

If any of these fail, escalate immediately per `36-seo/incident/seo-incident-response.md`.

---

## Monthly Audit Sections

### 1. Performance (15 min)

#### Core Web Vitals

- [ ] GSC → Experience → Core Web Vitals → Mobile report. How many URLs are in "Good," "Needs Improvement," and "Poor"?
- [ ] Compare to last month. Are things improving or degrading?
- [ ] Run PageSpeed Insights on 5 key pages (homepage, top product page, top blog post, pricing page, contact page).

| Page | LCP | CLS | INP | Overall Score | Change from Last Month |
| ---- | --- | --- | --- | ------------- | ---------------------- |
| Homepage | | | | | |
| Top product page | | | | | |
| Top blog post | | | | | |
| Pricing page | | | | | |
| Contact page | | | | | |

#### Page Speed Trends

- [ ] Are any key pages significantly slower than last month?
- [ ] Were there any recent deploys that could have affected performance? (Check with engineering.)
- [ ] If CWV degraded: file a Sev-3 or Sev-4 incident per `seo-incident-response.md`.

### 2. Indexation (15 min)

#### Coverage Report

- [ ] GSC → Indexing → Pages. Record totals:

| Status | Count | Change from Last Month |
| ------ | ----- | ---------------------- |
| Indexed (total) | | |
| Not indexed: Crawled - currently not indexed | | |
| Not indexed: Discovered - currently not indexed | | |
| Not indexed: Excluded by 'noindex' tag | | |
| Not indexed: Blocked by robots.txt | | |
| Not indexed: Duplicate, Google chose different canonical | | |
| Not indexed: Page with redirect | | |
| Not indexed: Not found (404) | | |
| Not indexed: Soft 404 | | |
| Not indexed: Server error (5xx) | | |

#### Indexation Health

- [ ] **New content indexed?** Check that content published in the last month is appearing in the index. Search `site:yourdomain.com/new-page-slug` for 5 recent pages.
- [ ] **Unwanted pages indexed?** Check for pages that should NOT be indexed (staging URLs, parameter URLs, admin pages, test pages). Search `site:yourdomain.com inurl:staging` or similar.
- [ ] **Excluded page spike?** If "Excluded" pages increased by >10% month-over-month, investigate which URLs and why.

### 3. Content (15 min)

#### Duplicate Issues

- [ ] GSC → Indexing → Pages → filter "Duplicate" issues. Any new duplicates?
- [ ] Check for duplicate title tags: Screaming Frog → Page Titles → filter "Duplicate."
- [ ] Check for duplicate meta descriptions: Screaming Frog → Meta Descriptions → filter "Duplicate."
- [ ] Check for missing title tags or meta descriptions on recently published pages.

#### Thin Content

- [ ] Are there new pages with <300 words that should have more content?
- [ ] Check for auto-generated pages with no unique content (tag pages, empty category pages, pagination pages with no content).

#### 404 Errors

- [ ] GSC → Indexing → Pages → "Not found (404)." Any new 404s?
- [ ] For new 404s: are these pages that should exist (broken by a deploy) or pages that were intentionally removed (need redirects)?
- [ ] Top 404s by incoming links — these lose link equity and need redirects.

#### Canonical Tags

- [ ] Spot-check canonical tags on 5 key pages. Do they point to the correct URL?
- [ ] Check for pages where Google chose a different canonical than what you specified (GSC → URL Inspection → "Google selected canonical").

### 4. Links (15 min)

#### Internal Links

- [ ] Run Screaming Frog (or use GSC internal links report). Any broken internal links (linking to 404 pages)?
- [ ] Check for orphan pages (pages with zero internal links pointing to them). These struggle to get crawled and ranked.
- [ ] Are new important pages (published this month) linked from existing high-authority pages?

#### Backlinks

- [ ] Check Ahrefs/Semrush for new backlinks acquired this month.
- [ ] Check for lost backlinks this month. Any high-value links lost?
- [ ] Any suspicious link spikes (potential negative SEO or spammy link building)?

| Metric | This Month | Last Month | Change |
| ------ | ---------- | ---------- | ------ |
| Total referring domains | | | |
| New referring domains | | | |
| Lost referring domains | | | |
| Domain Rating / Authority | | | |

#### Redirect Chains

- [ ] If redirects were added this month, verify no redirect chains were created.
- [ ] Spot-check 5 redirected URLs — do they resolve in a single hop?

### 5. Mobile (10 min)

- [ ] GSC → Experience → Mobile Usability. Any new issues?
- [ ] Test 3 key pages on a real mobile device (not just responsive mode in desktop browser):
  - Does the page load in under 3 seconds on mobile?
  - Are all interactive elements easily tappable?
  - Is text readable without zooming?
  - Do interstitials block content?
- [ ] Check GSC → Experience → Page Experience. Mobile page experience status.

### 6. Structured Data (10 min)

- [ ] GSC → Enhancements section. Check each structured data type for errors and warnings.
- [ ] Test 3 key pages with Google's Rich Results Test. Any new validation errors?
- [ ] Are rich results appearing for pages with structured data? (GSC → Performance → Search Appearance → filter by rich result type.)
- [ ] If new pages were published with schema: verify the schema is valid and rendering correctly.

| Schema Type | Pages with Valid Markup | Errors | Warnings | Rich Result Impressions |
| ----------- | ---------------------- | ------ | -------- | ----------------------- |
| Article | | | | |
| Product | | | | |
| FAQ | | | | |
| BreadcrumbList | | | | |
| Organization | | | | |
| Other: _____ | | | | |

### 7. AI Overview Monitoring (10 min)

This is a newer area that requires manual checking as tooling is still maturing.

- [ ] Search your top 10 keywords. For each, note:
  - Does an AI Overview appear?
  - Is your brand/site cited in the AI Overview?
  - Has the AI Overview changed since last month?
  - Is the AI Overview accurate about your product/service?
- [ ] Track AI Overview presence over time:

| Keyword | AI Overview Present? | Your Site Cited? | Change from Last Month |
| ------- | -------------------- | ---------------- | ---------------------- |
| [keyword 1] | | | |
| [keyword 2] | | | |
| [keyword 3] | | | |
| ... | | | |

- [ ] If AI Overviews are providing incorrect information about your brand, document for potential Google feedback submission.

### 8. Competitor SERP Tracking (10 min)

- [ ] Check rank tracker for top 20 keywords. Any significant position changes?
- [ ] For any keyword where you dropped 3+ positions: who moved up? What are they doing differently?
- [ ] Did any competitor launch significant new content in your space this month?
- [ ] Any new competitors appearing in your keyword space?

| Keyword | Your Position | Last Month | Change | Top Competitor | Their Position |
| ------- | ------------- | ---------- | ------ | -------------- | -------------- |
| | | | | | |
| | | | | | |
| | | | | | |

---

## Priority Matrix

After completing the audit, categorize all findings:

### Critical (Fix within 48 hours)

Issues that are actively causing significant traffic or revenue loss.

| Finding | Section | Impact | Action |
| ------- | ------- | ------ | ------ |
| | | | |

### High (Fix within 1 week)

Issues that will cause problems if not addressed soon.

| Finding | Section | Impact | Action |
| ------- | ------- | ------ | ------ |
| | | | |

### Medium (Fix within 1 month)

Issues that should be addressed in the normal optimization cycle.

| Finding | Section | Impact | Action |
| ------- | ------- | ------ | ------ |
| | | | |

### Low (Fix when time permits)

Nice-to-have improvements with marginal impact.

| Finding | Section | Impact | Action |
| ------- | ------- | ------ | ------ |
| | | | |

---

## Monthly Audit Report Template

After completing the audit, fill in this summary:

```markdown
## Monthly SEO Audit Report — [Month YYYY]

**Auditor:** [Name]
**Date completed:** YYYY-MM-DD
**Time spent:** [X] hours

### Summary

- **Overall health:** [Healthy / Minor Issues / Needs Attention / Critical Issues]
- **Critical findings:** [count]
- **High findings:** [count]
- **Medium findings:** [count]
- **Low findings:** [count]

### Key Metrics (Month over Month)

| Metric | This Month | Last Month | Change | Trend |
| ------ | ---------- | ---------- | ------ | ----- |
| Organic sessions | | | | ↑↓→ |
| Organic clicks (GSC) | | | | |
| Impressions (GSC) | | | | |
| Average CTR | | | | |
| Indexed pages | | | | |
| CWV pass rate (mobile) | | | | |
| Referring domains | | | | |

### Top Actions for This Month

1. [Most important action]
2. [Second most important action]
3. [Third most important action]

### Carried Over from Last Month

- [ ] [Action that was not completed last month]

### Notes

[Anything notable — algorithm updates, competitor changes, seasonal context]
```

---

## Cross-References

- **Quarterly deep audit:** `36-seo/audit/quarterly-deep-audit.template.md`
- **SEO audit generator:** `36-seo/audit/seo-audit-generator.md`
- **Incident response:** `36-seo/incident/seo-incident-response.md`
- **Experiment log:** `36-seo/testing/seo-experiment-log.template.md`
