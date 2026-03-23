# Algorithm Update Response Playbook

Google rolls out thousands of algorithm changes per year. Most are invisible. A few are announced and named. The ones that matter can move your rankings significantly in either direction. This playbook defines how to monitor, assess, and respond to algorithm updates without overreacting.

**The cardinal rule:** Do not make reactive changes during an active rollout. Wait for it to finish.

---

## Monitoring Update Announcements

### Primary Sources (Check These)

| Source | What It Provides | URL |
| ------ | ---------------- | --- |
| Google Search Status Dashboard | Official confirmed updates with start/end dates | [status.search.google.com](https://status.search.google.com/summary) |
| Google Search Central Blog | Detailed announcements for major updates | [developers.google.com/search/blog](https://developers.google.com/search/blog) |
| Google SearchLiaison (X/Twitter) | Real-time update confirmations and clarifications | [@searchliaison](https://twitter.com/searchliaison) |
| Danny Sullivan (X/Twitter) | Google's public liaison for search, often gives context | [@dannysullivan](https://twitter.com/dannysullivan) |

### Secondary Sources (Industry Analysis)

| Source | What It Provides | URL |
| ------ | ---------------- | --- |
| Search Engine Roundtable (Barry Schwartz) | Fastest reporting on confirmed and unconfirmed updates | [seroundtable.com](https://www.seroundtable.com/) |
| Semrush Sensor | SERP volatility measurement — spikes indicate potential updates | [semrush.com/sensor](https://www.semrush.com/sensor/) |
| MozCast | Daily Google algorithm weather report | [moz.com/mozcast](https://moz.com/mozcast/) |
| Algoroo | SERP fluctuation tracker | [algoroo.com](https://algoroo.com/) |
| Search Engine Land | Industry news and analysis | [searchengineland.com](https://searchengineland.com/) |

### Monitoring Cadence

| Activity | Frequency |
| -------- | --------- |
| Check Google Search Status Dashboard | Weekly (Monday) |
| Check Semrush Sensor / MozCast | When traffic drop detected |
| Review Search Engine Roundtable | 2x/week or when alerted |
| Full update impact assessment | Only when confirmed update + observed traffic change |

---

## Update Types and Typical Patterns

### Core Updates

**Frequency:** 3-4 per year.
**Rollout duration:** 2-4 weeks.
**What they target:** Broad reassessment of content quality, relevance, and authority. Not targeting specific tactics — re-evaluating how well pages satisfy user intent.

**Typical impact patterns:**
- Affect all content types and industries (not targeted).
- Winners and losers across every niche.
- Changes can be dramatic (40%+ traffic swings possible).
- Often partially reversed in the next core update.

**Recovery strategy:** Improve overall content quality, E-E-A-T signals, and user satisfaction. There is no quick fix. See "Recovery Strategies" section below.

### Helpful Content Updates

**Frequency:** Integrated into core algorithm as of March 2024 (no longer separate named updates).
**What they target:** Content created primarily for search engines rather than humans. Sites with a high proportion of "search-first" content.

**Signals they evaluate:**
- Does the content demonstrate first-hand experience?
- Is there substantial original information or analysis?
- Does the site have a clear purpose and audience beyond "rank for keywords"?
- Is the content satisfying if someone arrived via search?

**Recovery strategy:** Remove or substantially improve thin/unhelpful content. Add genuine expertise and original value. This is a site-wide classifier — individual page fixes may not help if the site overall is classified as unhelpful.

### Link Spam Updates

**Frequency:** 1-2 per year.
**What they target:** Manipulative link-building practices — paid links, link exchanges, PBNs, large-scale guest posting for links.

**Typical impact patterns:**
- Primarily affects sites that relied heavily on link manipulation.
- Can also affect sites linking out to spammy destinations.
- Impact may be delayed (Google processes, then applies penalty in batches).

**Recovery strategy:** Audit backlink profile. Disavow clearly manipulative links. Stop participating in link schemes. Focus on earning editorial links through content quality and digital PR.

### Spam Updates

**Frequency:** Multiple per year.
**What they target:** Pure spam techniques — cloaking, hidden text, doorway pages, hacked content, auto-generated gibberish, link spam at extreme scale.

**Typical impact patterns:**
- Dramatic drops (70-100% traffic loss) for affected sites.
- Legitimate sites rarely affected unless they have been hacked.
- May affect sites hosted on spammy infrastructure (shared IPs with spam sites).

**Recovery strategy:** If legitimately affected, check for hacked content, remove any spam techniques, file reconsideration request if manual action applied.

### Product Reviews Updates (now integrated into Core)

**Frequency:** Previously standalone, now part of core updates.
**What they target:** Review content quality — depth of analysis, evidence of hands-on experience, comparison methodology.

**Typical impact patterns:**
- Affiliate review sites most affected.
- Sites with genuine hands-on reviews tend to benefit.
- Sites with template-based reviews ("Top 10 Best X") without genuine testing are penalized.

**Recovery strategy:** Add real photos, video, hands-on testing evidence. Compare products you have actually used. Show your methodology.

---

## Impact Assessment Procedure

### Step 1: Confirm the Update (Day 0-1)

- [ ] Check Google Search Status Dashboard for confirmed update.
- [ ] Check Semrush Sensor / MozCast for volatility levels.
- [ ] Check if your traffic change timing aligns with the update rollout dates.
- [ ] Determine update type from Google's announcement.

### Step 2: Wait for Rollout to Complete (Day 1-14)

**Do not make changes during rollout.** Rankings fluctuate wildly during a rollout as Google reprocesses pages. Changes you observe on day 3 may reverse by day 10.

During the wait:
- [ ] Monitor traffic daily in GA4 and GSC (observe, do not react).
- [ ] Document daily rankings for your top 20 keywords.
- [ ] Note which page types and content categories are most affected.
- [ ] Check if competitors are also affected (industry-wide vs. site-specific).

### Step 3: Assess Impact After Rollout (Day 14-21)

Compare the 2-week post-rollout period to the 2-week pre-rollout period:

| Metric | Pre-Update | Post-Update | Change |
| ------ | ---------- | ----------- | ------ |
| Total organic sessions | | | % |
| Total organic clicks (GSC) | | | % |
| Average position (top 20 keywords) | | | |
| Impressions | | | % |
| CTR | | | % |
| Pages indexed | | | |

### Step 4: Compare to Historical Volatility (Day 14-21)

Before panicking, check: is this change within your normal volatility range?

- Calculate your site's typical week-over-week organic traffic variance for the past 6 months.
- If the post-update change is within 2 standard deviations of normal variance, it may not be update-related.
- If it exceeds 2 standard deviations, the update likely caused it.

### Step 5: Decide on Response (Day 21+)

| Impact Level | Response |
| ------------ | -------- |
| <5% traffic change | No action. Normal volatility. Monitor in next monthly audit. |
| 5-15% traffic change | Investigate which pages/sections were affected. Prioritize improvements but do not panic. |
| 15-30% traffic change | Conduct targeted content and technical audit on affected pages. Develop improvement plan. |
| >30% traffic change | Full-site audit. Potential fundamental issue. See recovery strategies below. |

---

## Recovery Strategies by Update Type

### Core Update Recovery

Core updates do not penalize specific tactics — they reassess overall quality. Recovery requires genuine improvement, not technical tricks.

**Action plan:**

1. **Audit affected pages** (Week 1-2)
   - Which specific pages lost rankings? (GSC → Performance → compare periods → sort by click change)
   - What queries did those pages rank for before?
   - Who now ranks above you for those queries?

2. **Competitive analysis** (Week 2-3)
   - For each lost ranking: read the page that replaced you. What do they do better?
   - Common patterns: more depth, better structure, more original research, clearer expertise, better multimedia.

3. **Content improvement plan** (Week 3-4)
   - Prioritize pages by traffic potential (impressions in GSC).
   - For each page: document specific improvements needed.
   - Focus on: unique value, depth, accuracy, freshness, user experience.

4. **E-E-A-T enhancement** (Ongoing)
   - Add author bios with verifiable credentials.
   - Link to sources and cite data.
   - Demonstrate first-hand experience (photos, case studies, personal insights).
   - Build topical authority (comprehensive coverage of your niche, not scattered topics).

5. **Pruning** (Weeks 4-8)
   - Identify pages with zero organic traffic for 6+ months.
   - Decision: improve substantially, consolidate with a stronger page (301 redirect), or noindex.
   - Do not mass-delete — prune carefully and monitor impact.

**Timeline expectation:** 3-6 months to see meaningful recovery. Core updates re-evaluate during the next core update rollout — recovery is not instantaneous.

### Helpful Content Recovery

This is the hardest recovery because it is a site-wide classifier, not a page-level signal.

1. **Identify content created primarily for search engines:**
   - Pages that exist only to target keywords with no genuine audience need.
   - Pages with thin, generic content that could apply to any website.
   - Pages that are substantially similar to many other pages on the web.

2. **Remove or substantially improve:**
   - Do not just add 200 words. Either make the content genuinely useful and unique, or remove it.
   - If removing, 301 redirect to the most relevant remaining page.
   - Target: reduce the percentage of "unhelpful" content on your site.

3. **Add unique value everywhere:**
   - Original research, data, case studies.
   - First-person experience and expertise.
   - Content that cannot be easily replicated by anyone with a keyword tool.

**Timeline expectation:** 6-12 months. The classifier needs to see sustained improvement before reclassifying your site.

### Link Spam Recovery

1. **Audit your backlink profile:**
   - Export all backlinks from Ahrefs or Semrush.
   - Identify clearly manipulative links (PBNs, paid links, link exchanges, irrelevant foreign-language sites).

2. **Attempt removal:**
   - Contact webmasters of spammy linking sites and request removal.
   - Document all outreach attempts (dates, emails, responses).
   - Realistic expectation: <10% removal rate from outreach.

3. **Disavow remaining toxic links:**
   - Create disavow file (domain-level for obvious spam sites, URL-level for mixed-quality sites).
   - Submit via Google Search Console Disavow Tool.
   - See `36-seo/incident/penalty-recovery.md` for disavow file format and best practices.

4. **Stop link manipulation:**
   - Cease all paid link placements, link exchanges, and PBN usage.
   - Shift to editorial link earning: digital PR, original research, expert commentary.

**Timeline expectation:** 2-4 months after disavow submission and next link spam update rollout.

### Spam Update Recovery

1. **Check for manual actions** in Search Console.
2. **Check for hacked content** (Search Console → Security Issues).
3. **Remove any spam techniques** (cloaking, hidden text, doorway pages).
4. **If hacked:** Clean the site, update all credentials, patch vulnerabilities, submit reconsideration request.

**Timeline expectation:** Weeks if manual action; months if algorithmic.

---

## When NOT to React

Not every ranking change requires action. Do not react to:

| Situation | Why It Is Normal |
| --------- | ---------------- |
| Daily position changes of 1-3 spots | Normal SERP volatility. Google re-ranks constantly. |
| Traffic dip on a single day | Could be a holiday, weather event, or temporary Google glitch. |
| Incomplete update rollout | Rankings fluctuate wildly during a rollout. Wait for it to finish. |
| Seasonal trends | Compare year-over-year before concluding it is an update effect. |
| Competitor's one-time spike | They may have had a viral moment. Check if it persists. |
| SERP feature appeared/disappeared | Google experiments with SERP layouts constantly. Features come and go. |

**The threshold for action:** Sustained change (2+ weeks post-rollout) that exceeds your normal volatility range and correlates with a confirmed update.

---

## Historical Update Timeline Reference

This table provides context for patterns. Update-specific details change — this is for directional reference only.

| Year | Update | Focus |
| ---- | ------ | ----- |
| 2024 | March Core Update | Integrated helpful content system into core; focused on reducing "unhelpful" content in results |
| 2024 | June Spam Update | Expired domain abuse, scaled content abuse, site reputation abuse |
| 2024 | August Core Update | Broad quality reassessment |
| 2024 | November Core Update | Quality and relevance |
| 2025 | March Core Update | E-E-A-T emphasis, original content prioritization |
| 2025 | Link Spam Update (May) | AI-generated link spam, large-scale link manipulation |
| 2025 | August Core Update | Content depth, user satisfaction signals |
| 2025 | December Spam Update | Parasite SEO crackdown, scaled AI content abuse |

**Note:** This timeline is for reference. Always check the Google Search Status Dashboard for the most current update information.

---

## Cross-References

- **Incident response:** `36-seo/incident/seo-incident-response.md`
- **Traffic drop diagnosis:** `36-seo/incident/traffic-drop-diagnosis.md`
- **Penalty recovery:** `36-seo/incident/penalty-recovery.md`
- **Content quality:** `36-seo/content-seo/` (for content improvement strategies)
- **Gotchas:** `36-seo/gotchas/seo-gotchas.md` (Section 5: AI/Algorithm Gotchas)
