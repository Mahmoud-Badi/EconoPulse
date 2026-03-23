# Quarterly SEO Deep Audit — {{PROJECT_NAME}}

**Quarter:** {{AUDIT_QUARTER}} {{AUDIT_YEAR}}
**Auditor:** {{AUDIT_LEAD}}
**Audit period:** YYYY-MM-DD to YYYY-MM-DD
**Previous audit reference:** Q[N-1] {{AUDIT_YEAR}} audit (or "Initial audit — no prior reference")

---

## Executive Summary

### Overall SEO Health Score

| Section | Weight | Score | Max | Previous Quarter | Trend |
| ------- | ------ | ----- | --- | ---------------- | ----- |
| Technical SEO | 30% | /30 | 30 | /30 | ↑↓→ |
| On-Page SEO | 20% | /20 | 20 | /20 | |
| Content | 20% | /20 | 20 | /20 | |
| Off-Page | 15% | /15 | 15 | /15 | |
| Measurement | 15% | /15 | 15 | /15 | |
| **Total** | **100%** | **/100** | **100** | **/100** | |

### Top 3 Critical Issues

1. [Critical issue 1 — one sentence]
2. [Critical issue 2 — one sentence]
3. [Critical issue 3 — one sentence]

### Top 3 Quick Wins

1. [Quick win 1 — what and expected impact]
2. [Quick win 2 — what and expected impact]
3. [Quick win 3 — what and expected impact]

### Quarter-over-Quarter Trend

| Metric | Previous Quarter | This Quarter | Change |
| ------ | ---------------- | ------------ | ------ |
| Organic sessions (monthly avg) | | | % |
| Organic clicks (monthly avg, GSC) | | | % |
| Impressions (monthly avg, GSC) | | | % |
| Average CTR (GSC) | | | pp |
| Indexed pages | | | |
| Referring domains | | | |
| Domain Rating | | | |
| Organic revenue/conversions | | | % |

---

## Section 1: Technical SEO Audit

### 1.1 Crawlability

| Check | Tool | Status | Finding |
| ----- | ---- | ------ | ------- |
| robots.txt correct | Manual review | ✅ / ❌ | |
| XML sitemap valid and submitted | GSC + manual | ✅ / ❌ | |
| Sitemap contains only 200-status indexable URLs | Screaming Frog | ✅ / ❌ | |
| Crawl budget not wasted on low-value pages | GSC Crawl Stats + server logs | ✅ / ❌ | |
| No redirect chains (max 1 hop) | Screaming Frog | ✅ / ❌ | |
| No redirect loops | Screaming Frog | ✅ / ❌ | |
| Crawl depth ≤3 clicks for important pages | Screaming Frog | ✅ / ❌ | |
| No orphan pages (pages with 0 internal links) | Screaming Frog | ✅ / ❌ | |
| Googlebot not blocked by WAF/firewall | Server logs | ✅ / ❌ | |
| Crawl rate: pages crawled per day | GSC Crawl Stats | | [number] |

### 1.2 Indexation

| Check | Tool | Status | Finding |
| ----- | ---- | ------ | ------- |
| Total indexed pages matches expectations | GSC Coverage | ✅ / ❌ | [count] |
| No important pages excluded from index | GSC Coverage | ✅ / ❌ | |
| No unintended noindex tags | Screaming Frog | ✅ / ❌ | |
| Canonical tags correct on all pages | Screaming Frog | ✅ / ❌ | |
| Google-selected canonical matches declared canonical | GSC URL Inspection (sample) | ✅ / ❌ | |
| No duplicate content issues | Screaming Frog + GSC | ✅ / ❌ | |
| New content published this quarter is indexed | `site:` search | ✅ / ❌ | |
| Parameter URLs not indexed | `site:` search with `inurl:?` | ✅ / ❌ | |

### 1.3 Page Speed & Core Web Vitals

| Metric | Mobile | Desktop | Threshold | Status |
| ------ | ------ | ------- | --------- | ------ |
| LCP (Largest Contentful Paint) | ms | ms | <2.5s | ✅ / ❌ |
| CLS (Cumulative Layout Shift) | | | <0.1 | ✅ / ❌ |
| INP (Interaction to Next Paint) | ms | ms | <200ms | ✅ / ❌ |
| % URLs in "Good" CWV (mobile) | % | | >75% | ✅ / ❌ |

**CWV trend vs. previous quarter:**

| Metric | Previous Q | This Q | Direction |
| ------ | ---------- | ------ | --------- |
| % Good (mobile) | % | % | |
| % Needs Improvement | % | % | |
| % Poor | % | % | |

### 1.4 Mobile Experience

| Check | Tool | Status | Finding |
| ----- | ---- | ------ | ------- |
| Mobile Usability report clean | GSC | ✅ / ❌ | |
| No mobile-specific rendering issues | Manual test on real device | ✅ / ❌ | |
| Touch targets adequately sized | PageSpeed/Lighthouse | ✅ / ❌ | |
| Viewport meta tag present | Screaming Frog | ✅ / ❌ | |
| No intrusive interstitials | Manual test | ✅ / ❌ | |
| Text readable without zooming | Manual test | ✅ / ❌ | |

### 1.5 Security & HTTPS

| Check | Tool | Status | Finding |
| ----- | ---- | ------ | ------- |
| SSL certificate valid | SSL Labs / browser | ✅ / ❌ | Expiry: YYYY-MM-DD |
| No mixed content | Browser console / Screaming Frog | ✅ / ❌ | |
| HSTS header present | `curl -sI` | ✅ / ❌ | |
| HTTP → HTTPS redirect working | `curl -sI http://domain.com` | ✅ / ❌ | |
| No security issues in GSC | GSC | ✅ / ❌ | |

### 1.6 Structured Data

| Schema Type | Pages Implemented | Valid | Errors | Warnings | Rich Results Generating |
| ----------- | ----------------- | ----- | ------ | -------- | ----------------------- |
| Article | | | | | |
| Product | | | | | |
| BreadcrumbList | | | | | |
| FAQ | | | | | |
| Organization | | | | | |
| LocalBusiness | | | | | |
| Other: _____ | | | | | |

### 1.7 International (if applicable)

| Check | Tool | Status | Finding |
| ----- | ---- | ------ | ------- |
| Hreflang tags present and valid | Screaming Frog | ✅ / ❌ | |
| Return tags present (bidirectional) | Screaming Frog | ✅ / ❌ | |
| x-default specified | Screaming Frog | ✅ / ❌ | |
| Language/region targeting correct in GSC | GSC | ✅ / ❌ | |

---

## Section 2: On-Page SEO Audit

Audit the top 20 pages by organic traffic.

### 2.1 Title Tags

| Check | Status | Count Affected |
| ----- | ------ | -------------- |
| All pages have title tags | ✅ / ❌ | |
| No duplicate title tags | ✅ / ❌ | |
| Title tags include target keyword | ✅ / ❌ | |
| Title tags ≤60 characters | ✅ / ❌ | |
| Title tags are compelling (not just keyword stuffing) | ✅ / ❌ | |

### 2.2 Meta Descriptions

| Check | Status | Count Affected |
| ----- | ------ | -------------- |
| All pages have meta descriptions | ✅ / ❌ | |
| No duplicate meta descriptions | ✅ / ❌ | |
| Meta descriptions ≤155 characters | ✅ / ❌ | |
| Meta descriptions include CTA or value proposition | ✅ / ❌ | |

### 2.3 Heading Structure

| Check | Status | Count Affected |
| ----- | ------ | -------------- |
| Every page has exactly one H1 | ✅ / ❌ | |
| H1 includes target keyword | ✅ / ❌ | |
| Logical heading hierarchy (H1 → H2 → H3, no skipping) | ✅ / ❌ | |
| Headings provide content structure (not just styling) | ✅ / ❌ | |

### 2.4 Images

| Check | Status | Count Affected |
| ----- | ------ | -------------- |
| All images have descriptive alt text | ✅ / ❌ | |
| Images use modern formats (WebP, AVIF) | ✅ / ❌ | |
| Images are appropriately sized (not serving 4000px on mobile) | ✅ / ❌ | |
| Images use lazy loading (except above-the-fold) | ✅ / ❌ | |

### 2.5 Internal Linking

| Check | Status | Finding |
| ----- | ------ | ------- |
| Key pages have adequate internal links (>5 internal links pointing to them) | ✅ / ❌ | |
| Anchor text is descriptive (not "click here") | ✅ / ❌ | |
| No broken internal links | ✅ / ❌ | |
| Navigation links point to canonical URLs (not redirect URLs) | ✅ / ❌ | |

---

## Section 3: Content Audit

### 3.1 Content Inventory

| Content Type | Total Pages | Published This Quarter | Updated This Quarter |
| ------------ | ----------- | ---------------------- | -------------------- |
| Blog posts | | | |
| Product pages | | | |
| Landing pages | | | |
| Documentation/Help | | | |
| Category/Collection pages | | | |
| Other: _____ | | | |
| **Total** | | | |

### 3.2 Thin Content

Pages with <300 words or minimal unique content:

| URL | Word Count | Organic Traffic | Decision (Improve / Consolidate / Remove / Noindex) |
| --- | ---------- | --------------- | ---------------------------------------------------- |
| | | | |

### 3.3 Content Gaps

Keywords competitors rank for (top 50+) that {{PROJECT_NAME}} does not:

| Keyword | Search Volume | Difficulty | Top Competitor Ranking | Opportunity |
| ------- | ------------- | ---------- | ---------------------- | ----------- |
| | | | | |

### 3.4 Content Decay

Pages that lost >20% organic traffic year-over-year:

| URL | Traffic (This Q) | Traffic (Same Q Last Year) | Decline % | Likely Cause | Action |
| --- | ---------------- | -------------------------- | --------- | ------------ | ------ |
| | | | | | |

### 3.5 Keyword Cannibalization

Keywords where multiple pages compete for the same query:

| Keyword | Page 1 (URL) | Page 1 Position | Page 2 (URL) | Page 2 Position | Resolution |
| ------- | ------------ | --------------- | ------------ | --------------- | ---------- |
| | | | | | |

### 3.6 Topical Authority Assessment

| Core Topic | Pages Covering Topic | Depth (Shallow/Moderate/Deep) | Gaps Identified |
| ---------- | -------------------- | ----------------------------- | --------------- |
| | | | |

---

## Section 4: Off-Page Audit

### 4.1 Backlink Profile

| Metric | This Quarter | Previous Quarter | Change |
| ------ | ------------ | ---------------- | ------ |
| Total backlinks | | | |
| Total referring domains | | | |
| Domain Rating (Ahrefs) | | | |
| Domain Authority (Moz) | | | |
| % Follow links | | | |
| % Nofollow links | | | |

### 4.2 Link Quality Distribution

| DR Range | Referring Domains | % of Total |
| -------- | ----------------- | ---------- |
| 80-100 | | |
| 60-79 | | |
| 40-59 | | |
| 20-39 | | |
| 0-19 | | |

### 4.3 Toxic Link Assessment

- [ ] Total potentially toxic links: [count]
- [ ] Action needed: [None / Monitor / Disavow]
- [ ] Disavow file last updated: [date]

### 4.4 Competitor Backlink Gap

| Competitor | Their Referring Domains | Shared with Us | Unique to Them | Gap |
| ---------- | ---------------------- | -------------- | -------------- | --- |
| | | | | |

### 4.5 Link-Building Opportunities

| Opportunity | Type | Estimated Effort | Estimated Impact |
| ----------- | ---- | ---------------- | ---------------- |
| | Unlinked mention / Guest post / Digital PR / Resource link / Broken link building | | |

---

## Section 5: Measurement & Reporting Audit

### 5.1 Analytics Configuration

| Check | Status | Finding |
| ----- | ------ | ------- |
| GA4 tracking on all pages | ✅ / ❌ | |
| GA4 events configured correctly | ✅ / ❌ | |
| Conversions/Key Events defined | ✅ / ❌ | |
| Cross-domain tracking (if needed) | ✅ / ❌ / N/A | |
| Bot filtering enabled | ✅ / ❌ | |
| GSC connected to GA4 | ✅ / ❌ | |

### 5.2 Search Console Configuration

| Check | Status | Finding |
| ----- | ------ | ------- |
| All domain variants verified | ✅ / ❌ | |
| Correct domain property set as primary | ✅ / ❌ | |
| All sitemaps submitted | ✅ / ❌ | |
| Team members have appropriate access | ✅ / ❌ | |

### 5.3 Rank Tracking

| Check | Status | Finding |
| ----- | ------ | ------- |
| Primary keywords tracked (20+) | ✅ / ❌ | |
| Competitor keywords tracked | ✅ / ❌ | |
| Local rankings tracked (if applicable) | ✅ / ❌ / N/A | |
| Tracking frequency (daily/weekly) | | |

---

## Previous Quarter Findings: Follow-Up

Review every finding from the previous quarter's audit. Were they addressed?

| Finding (Previous Quarter) | Severity | Status | Notes |
| -------------------------- | -------- | ------ | ----- |
| [Finding from previous audit] | Critical/High/Med/Low | ✅ Fixed / 🔄 In Progress / ❌ Not Started | |
| | | | |

**Completion rate:** [X]% of previous quarter's findings addressed.

---

## Trend Analysis

### Traffic Trend (4 Quarters)

| Quarter | Organic Sessions | Organic Clicks (GSC) | Impressions | Avg CTR | Indexed Pages |
| ------- | ---------------- | -------------------- | ----------- | ------- | ------------- |
| Q[N-3] | | | | | |
| Q[N-2] | | | | | |
| Q[N-1] | | | | | |
| Q[N] (this) | | | | | |

### Directional Assessment

- [ ] **Traffic:** Growing / Stable / Declining
- [ ] **Rankings:** Improving / Stable / Declining
- [ ] **Technical health:** Improving / Stable / Degrading
- [ ] **Content velocity:** Accelerating / Steady / Slowing
- [ ] **Link profile:** Strengthening / Stable / Weakening

### Root Cause for Trends

If any metric is declining, document the root cause here:

| Declining Metric | Root Cause | Corrective Action |
| ---------------- | ---------- | ------------------ |
| | | |

---

## Findings Summary

### All Findings (Sorted by Priority)

| # | Finding | Section | Severity | Effort | Impact | Priority |
| - | ------- | ------- | -------- | ------ | ------ | -------- |
| 1 | | | Critical | | High | P1 |
| 2 | | | High | | High | P1 |
| 3 | | | High | | Medium | P2 |
| ... | | | | | | |

### Finding Detail Template

For each finding, document:

```markdown
### FINDING-XX: [Title]

| Field | Value |
| ----- | ----- |
| Section | Technical / On-Page / Content / Off-Page / Measurement |
| Severity | Critical / High / Medium / Low |
| Effort | Hours / Days / Weeks |
| Impact | High / Medium / Low |
| Priority | P1 / P2 / P3 / P4 |
| Previous quarter | New / Recurring / Worsened / Improved |

**Issue:** [What is wrong — be specific]

**Evidence:** [URLs, data, screenshots]

**Recommendation:** [Exactly what to do]

**Expected outcome:** [What will improve and by how much]
```

---

## Action Plan

### P1 Actions (This Month)

| Action | Owner | Due Date | Status |
| ------ | ----- | -------- | ------ |
| | | | |

### P2 Actions (This Quarter)

| Action | Owner | Due Date | Status |
| ------ | ----- | -------- | ------ |
| | | | |

### P3 Actions (Next Quarter)

| Action | Owner | Target Quarter | Notes |
| ------ | ----- | -------------- | ----- |
| | | | |

### P4 Actions (Backlog)

| Action | Notes |
| ------ | ----- |
| | |

---

## Cross-References

- **SEO audit generator:** `36-seo/audit/seo-audit-generator.md`
- **Monthly audit checklist:** `36-seo/audit/monthly-audit-checklist.md`
- **Incident response:** `36-seo/incident/seo-incident-response.md`
- **Traffic drop diagnosis:** `36-seo/incident/traffic-drop-diagnosis.md`
- **Experiment log:** `36-seo/testing/seo-experiment-log.template.md`
- **Gotchas:** `36-seo/gotchas/seo-gotchas.md`
