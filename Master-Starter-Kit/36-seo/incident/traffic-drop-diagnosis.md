# Traffic Drop Diagnosis Flowchart

When organic traffic drops, do not panic and do not guess. Walk through this decision tree systematically. Each branch has specific diagnostic commands, tools to use, and resolution steps.

**Rule of thumb:** Most traffic drops have boring explanations. Check measurement errors and technical issues before assuming algorithm penalties.

---

## Decision Tree Overview

```
Traffic Drop Detected
│
├─ 1. Is it a measurement issue?
│    ├─ YES → Fix measurement
│    └─ NO ↓
│
├─ 2. Is it seasonal?
│    ├─ YES → Normal, adjust expectations
│    └─ NO ↓
│
├─ 3. Is it site-wide or page-specific?
│    ├─ SITE-WIDE → Continue to 4
│    └─ PAGE-SPECIFIC → Skip to 6
│
├─ 4. Did it correlate with an algorithm update?
│    ├─ YES → See algorithm-update-playbook.md
│    └─ NO ↓
│
├─ 5. Is it a technical issue?
│    ├─ YES → Fix technical issue
│    └─ NO ↓
│
├─ 6. Is it a content issue?
│    ├─ YES → Fix content
│    └─ NO ↓
│
├─ 7. Is it a link issue?
│    ├─ YES → Fix link profile
│    └─ NO ↓
│
└─ 8. Is it a SERP layout change?
     ├─ YES → Adapt strategy
     └─ NO → Deeper investigation needed
```

---

## Branch 1: Is It a Measurement Issue?

**Check this first.** A surprisingly large number of "traffic drops" are actually measurement errors.

### Diagnostic Steps

| Check | How to Verify | Tool |
| ----- | ------------- | ---- |
| GA4 tracking code still present? | View source on 5 key pages, search for GA4 measurement ID | Browser dev tools, `curl -s URL \| grep "G-"` |
| GA4 data stream active? | GA4 → Admin → Data Streams → check status | GA4 Admin |
| Was a GA4 filter added/changed? | GA4 → Admin → Data Settings → Data Filters | GA4 Admin |
| Did attribution model change? | GA4 → Admin → Attribution Settings | GA4 Admin |
| Is bot traffic being filtered differently? | Compare GA4 data to server logs for the same period | GA4 + server logs |
| Tag Manager container published? | Check GTM version history for recent publishes | Google Tag Manager |
| Is Google Search Console data consistent with GA4? | Compare GSC clicks to GA4 organic sessions | GSC + GA4 side by side |
| Consent banner blocking tracking? | Test site with fresh browser — does consent banner block GA4 before interaction? | Manual test |

### Resolution

If measurement is broken:
1. Fix the tracking issue.
2. Annotate the gap period in GA4.
3. Use Search Console data (server-side, not affected by client-side tracking issues) to estimate real traffic during the gap.
4. Recalculate baselines excluding the measurement gap.

### Common Measurement Gotchas

- **Cookie consent changes:** New consent banner rolled out → fewer users accept tracking → GA4 shows "drop" but real traffic is unchanged.
- **GTM container override:** Someone published a GTM container that removed or broke the GA4 tag.
- **GA4 property migration:** Team migrated from UA to GA4 mid-period, or changed GA4 property settings.
- **Ad blocker prevalence:** No sudden drop, but long-term erosion as ad blocker usage grows. Compare GA4 to server-side analytics or GSC clicks.

---

## Branch 2: Is It Seasonal?

### Diagnostic Steps

| Check | How to Verify | Tool |
| ----- | ------------- | ---- |
| Year-over-year comparison | Compare current period to same period last year in GA4 and GSC | GA4 (compare period), GSC |
| Google Trends for primary queries | Search your top 10 queries in Google Trends — is search volume declining? | [Google Trends](https://trends.google.com) |
| Industry seasonality | Is your industry known for seasonal cycles? (B2B drops in December, e-commerce spikes in Q4, tax software peaks in Q1) | Industry knowledge |
| Day-of-week pattern | Is the "drop" just comparing a weekday to a weekend? | GA4 daily view |
| Holiday effect | Did a public holiday fall in the comparison period? | Calendar |

### Resolution

If seasonal:
1. This is normal. Do not make reactive changes.
2. Document the seasonal pattern for future reference.
3. Set year-over-year comparisons as the default for reporting (not week-over-week or month-over-month).
4. Plan content and optimization efforts around seasonal peaks, not troughs.

---

## Branch 3: Is It Site-Wide or Page-Specific?

### Diagnostic Steps

| Check | How to Verify | Tool |
| ----- | ------------- | ---- |
| Traffic by landing page | GA4 → Reports → Engagement → Landing Page → filter to organic → sort by change | GA4 |
| Traffic by page group | Group by URL pattern (/blog/*, /products/*, etc.) — which groups dropped? | GA4 or GSC |
| GSC Performance by page | GSC → Performance → Pages tab → compare two date ranges | GSC |
| New vs. returning analysis | Did both segments drop, or just one? | GA4 |

### Interpretation

| Pattern | Likely Cause | Next Branch |
| ------- | ------------ | ----------- |
| All pages dropped equally | Algorithm update, technical issue, or measurement error | Branch 4 (algorithm) or Branch 5 (technical) |
| Only blog dropped | Content quality issue, or algorithm update targeting informational content | Branch 6 (content) |
| Only product pages dropped | Product review update, competitor launched, SERP layout change | Branch 6 or Branch 8 |
| Only a few specific pages | Those pages lost rankings or had technical issues | Branch 5, 6, or 7 |
| Homepage only | Brand search declined, or homepage technical issue | Branch 5 (check canonicals, redirects) |

---

## Branch 4: Did It Correlate with a Google Algorithm Update?

### Diagnostic Steps

| Check | How to Verify | Tool |
| ----- | ------------- | ---- |
| Confirmed update? | Check Google Search Status Dashboard | [status.search.google.com](https://status.search.google.com/summary) |
| Unconfirmed update? | Check SERP volatility trackers | [Semrush Sensor](https://www.semrush.com/sensor/), [MozCast](https://moz.com/mozcast/), [Algoroo](https://algoroo.com/) |
| Industry chatter | Search for reports from other affected sites | [Search Engine Roundtable](https://www.seroundtable.com/), SEO Twitter/X, r/SEO |
| Timeline alignment | Does the traffic drop start date match the update rollout date? | GSC daily data vs. update timeline |
| Which pages affected? | Update types affect different content differently | GSC Performance by page |

### Resolution

If algorithm update is confirmed:
→ See `36-seo/incident/algorithm-update-playbook.md` for detailed response procedures by update type.

**Critical:** Do not make reactive changes during an update rollout (typically 2 weeks). Wait for the rollout to complete before assessing impact.

---

## Branch 5: Is It a Technical Issue?

### Diagnostic Steps

| Check | How | Tool | Red Flag |
| ----- | --- | ---- | -------- |
| Indexation status | GSC → Indexing → Pages | GSC | Spike in "Excluded" pages |
| robots.txt | `curl -s https://yourdomain.com/robots.txt` | Terminal | `Disallow: /` or blocking key sections |
| Meta robots | `curl -s URL \| grep -i "noindex\|nofollow"` on key pages | Terminal | noindex on indexed pages |
| Server errors | GSC → Indexing → Pages → filter "Server error (5xx)" | GSC | Spike in 5xx errors |
| Crawl stats | GSC → Settings → Crawl Stats | GSC | Drop in crawl requests, spike in errors |
| Page speed | PageSpeed Insights on top 5 pages | [PageSpeed Insights](https://pagespeed.web.dev/) | LCP >4s, CLS >0.25, INP >500ms |
| Rendering | GSC → URL Inspection → "View Tested Page" → Screenshot | GSC | Page renders blank or missing content |
| Canonical tags | Check canonical URLs on key pages | Screaming Frog or `curl -s URL \| grep canonical` | Canonical pointing to wrong URL |
| Redirects | Check for redirect chains or loops | Screaming Frog, `curl -sI -L URL` | 3+ redirect hops, redirect loops |
| HTTPS/SSL | Check certificate validity and mixed content | Browser, SSL Labs | Expired cert, mixed content warnings |
| Sitemap | Fetch sitemap, check for errors | `curl -s https://yourdomain.com/sitemap.xml \| head -20` | 404, empty, or includes non-200 URLs |
| CDN/caching | Are stale pages being served to Googlebot? | Fetch as Google in GSC URL Inspection | Cached version different from live version |
| JavaScript rendering | Does content require JS to render? Is Googlebot executing it? | GSC URL Inspection (compare HTML to rendered) | Content visible in rendered but not raw HTML |
| Hreflang | Are hreflang tags correct? | Screaming Frog hreflang report | Missing return tags, wrong language codes |

### Resolution by Technical Issue

| Issue | Fix | Timeline |
| ----- | --- | -------- |
| robots.txt blocking | Fix robots.txt, request re-crawl in GSC | Hours to fix, days to re-index |
| noindex tags | Remove noindex, request re-crawl | Hours to fix, days to weeks to re-index |
| Server errors | Fix server, check hosting capacity | Hours to fix, days to recover rankings |
| Crawl budget waste | Block faceted navigation in robots.txt, add `noindex` to parameter URLs | Days to fix, weeks to see crawl improvement |
| Redirect chains | Fix to single-hop 301s | Hours to fix, weeks for ranking recovery |
| Canonical errors | Fix canonical tags | Hours to fix, weeks for re-evaluation |
| Page speed regression | Identify regression (deploy diff), revert or optimize | Days to fix, weeks to months for ranking impact |
| JS rendering issues | Implement SSR/SSG, or add pre-rendering for Googlebot | Days to weeks to fix, weeks to re-index |

---

## Branch 6: Is It a Content Issue?

### Diagnostic Steps

| Check | How | Tool |
| ----- | --- | ---- |
| Did competitors publish better content? | Search your target keywords — who is now outranking you? | Manual SERP review, Ahrefs/Semrush |
| Content freshness | When was the dropped content last updated? | CMS, Wayback Machine |
| Content quality | Reread the page critically — is it thin, generic, or outdated? | Manual review |
| Keyword cannibalization | Are multiple pages targeting the same keyword? | GSC → Performance → filter by query → check which pages are appearing |
| Content removed or changed | Was the page content modified or removed recently? | CMS version history, Wayback Machine |
| Word count / depth comparison | How does your content compare to current top-3 results? | Manual review, Surfer SEO, Clearscope |
| E-E-A-T signals | Does the page have author info, citations, credentials, first-hand experience? | Manual review |
| User engagement | Bounce rate, time on page, scroll depth — did these change? | GA4 |

### Resolution by Content Issue

| Issue | Fix | Timeline |
| ----- | --- | -------- |
| Competitor published better content | Update and improve your content to be the best result | 2-4 weeks to update, 4-8 weeks to see ranking recovery |
| Content decay (outdated info) | Refresh with current data, examples, screenshots | 1-2 weeks to update, 2-6 weeks to see improvement |
| Keyword cannibalization | Consolidate pages (301 redirect weaker page to stronger), or differentiate intent | 1-2 weeks to implement, 4-8 weeks to stabilize |
| Thin content penalty | Add substantial unique value, or noindex/remove thin pages | 2-4 weeks to fix, 4-12 weeks for recovery |
| Content removed accidentally | Restore content, or 301 redirect to most relevant existing page | Hours to fix, days to weeks to recover |

---

## Branch 7: Is It a Link Issue?

### Diagnostic Steps

| Check | How | Tool |
| ----- | --- | ---- |
| Lost backlinks | Check for links lost in the past 30-90 days | Ahrefs → Site Explorer → Backlinks → Lost |
| Toxic backlink spike | Check for sudden influx of spammy links (negative SEO) | Ahrefs → Backlinks → filter by DR <10, check for patterns |
| Disavow file mistake | Review your disavow file — did you accidentally disavow good links? | GSC → Disavow Tool, cross-reference with Ahrefs |
| Competitor link building | Did competitors acquire high-quality links you don't have? | Ahrefs → Competing Domains → compare link profiles |
| Referring domain trend | Is your referring domain count growing, flat, or declining? | Ahrefs → Overview → Referring Domains trend |
| Anchor text distribution | Has anchor text profile become over-optimized or spammy? | Ahrefs → Anchors report |

### Resolution by Link Issue

| Issue | Fix | Timeline |
| ----- | --- | -------- |
| Lost high-quality links | Contact site owners for re-linking, earn replacement links | Weeks to months |
| Negative SEO (toxic link spam) | Monitor, disavow if necessary (Google usually ignores these automatically) | Days to disavow, weeks to process |
| Disavow mistake | Remove entries from disavow file, resubmit | Days to update, weeks to months for recovery |
| Competitor outpacing on links | Intensify link-building efforts, focus on digital PR and content marketing | Months (long-term strategy) |

---

## Branch 8: Is It a SERP Layout Change?

### Diagnostic Steps

| Check | How | Tool |
| ----- | --- | ---- |
| AI Overviews appeared | Search your target queries — is an AI Overview now showing above organic results? | Manual SERP review, Semrush AI Overview tracking |
| Featured snippet changed | Did you lose a featured snippet? Did a competitor gain one? | GSC → Performance → Search Appearance → filter "Featured snippet" |
| New SERP features | Are new elements pushing organic results below the fold? (People Also Ask expanded, video carousel, local pack, etc.) | Manual SERP review |
| Ad density increased | Are more ads showing above organic results? | Manual SERP review |
| Knowledge panel appeared | Is a knowledge panel now taking SERP real estate? | Manual SERP review |
| Position unchanged but CTR dropped | You rank in the same position, but fewer people click because SERP layout changed | GSC → compare CTR at same position over two periods |

### Resolution by SERP Layout Change

| Issue | Fix | Timeline |
| ----- | --- | -------- |
| AI Overviews absorbing clicks | Optimize for AI Overview citation (clear answers, authoritative source), diversify traffic sources | Ongoing strategy shift |
| Lost featured snippet | Restructure content to match featured snippet format (concise answer, list, table) | 2-4 weeks to optimize, 4-8 weeks to see change |
| New SERP features pushing organic down | Target long-tail queries with less SERP clutter, optimize for the new features | Ongoing |
| Increased ad density | Focus on queries with lower commercial intent (fewer ads), invest in branded search | Ongoing |

---

## When All Branches Are Exhausted

If you have walked through all 8 branches and cannot identify the cause:

1. **Expand the timeline.** Look at 6-month and 12-month trends. Is this a gradual decline you only noticed now?
2. **Check competitors.** Has the entire market shifted? Use Semrush's Market Explorer or Ahrefs' Content Explorer for your topic.
3. **Check Google Search Console messages.** Look for any notifications you may have missed.
4. **Consult external SEO expertise.** Fresh eyes often spot what you have become blind to.
5. **Wait and monitor.** Sometimes traffic drops are temporary. Set a calendar reminder for 2 weeks and reassess.

---

## Diagnosis Documentation Template

For every diagnosed traffic drop, document:

```markdown
## Traffic Drop Incident — YYYY-MM-DD

**Detection date:** YYYY-MM-DD
**Magnitude:** X% drop over Y days
**Scope:** Site-wide / [specific section]

### Diagnosis Path

- Branch 1 (Measurement): ✅ Verified — tracking intact
- Branch 2 (Seasonal): ✅ Verified — not seasonal (YoY shows decline)
- Branch 3 (Scope): Site-wide / Page-specific → [specific pages]
- Branch 4 (Algorithm): [Correlated / Not correlated] with [update name]
- Branch 5 (Technical): [Finding or "No issues found"]
- Branch 6 (Content): [Finding or "No issues found"]
- Branch 7 (Links): [Finding or "No issues found"]
- Branch 8 (SERP Layout): [Finding or "No issues found"]

### Root Cause

[What caused the drop]

### Resolution

[What was done to fix it]

### Recovery Status

[Recovered / Partially recovered / Not recovered — with dates and metrics]
```

---

## Cross-References

- **Incident response:** `36-seo/incident/seo-incident-response.md`
- **Algorithm updates:** `36-seo/incident/algorithm-update-playbook.md`
- **Penalty recovery:** `36-seo/incident/penalty-recovery.md`
- **Monthly audit:** `36-seo/audit/monthly-audit-checklist.md`
