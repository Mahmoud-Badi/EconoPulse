# SEO Gotchas

Production battle scars. Every entry here cost someone real traffic, real revenue, or real recovery time. Learn from their pain.

---

## 1. Technical Gotchas

### 1.1 noindex Left on After Staging

**What happened:** A site launched from staging to production. The staging environment had `<meta name="robots" content="noindex">` on every page. Nobody removed it during the production deploy. The site was live for 3 weeks before anyone noticed organic traffic had gone to zero.

**Why it was bad:** Google deindexed the entire site within days of crawling the noindex tags. Three weeks of zero organic traffic. Recovery took another 4 weeks after fixing, because Google had to recrawl and re-evaluate every page.

**How to prevent it:**
- Add a CI/CD check that fails the deploy if `noindex` is found in production builds (except on pages that genuinely should not be indexed, like /admin, /account, /checkout).
- Use environment-specific meta tags: `if (process.env.NODE_ENV !== 'production') { add noindex }`.
- Post-deploy smoke test: `curl -s https://yourdomain.com | grep -i noindex` — should return nothing.

**How to fix if it happens:**
1. Remove all unintended noindex tags immediately.
2. Request re-indexing of key pages via GSC URL Inspection.
3. Submit XML sitemap to accelerate recrawl.
4. Monitor GSC Coverage report daily until indexation recovers.

---

### 1.2 robots.txt Blocking CSS and JavaScript

**What happened:** The robots.txt blocked `/static/`, `/assets/`, or `/_next/` directories. Googlebot could access the HTML but could not load CSS or JavaScript. Pages rendered as unstyled, broken layouts. Content that depended on JavaScript rendering was invisible to Google.

**Why it was bad:** Google sees the page as low quality (broken layout). Rankings dropped for pages that relied on CSS for layout and JS for content rendering. Core Web Vitals in Google's measurements were terrible because the page rendered without styles.

**How to prevent it:**
- Never block CSS, JS, or font directories in robots.txt.
- After any robots.txt change, test with GSC URL Inspection → "View Tested Page" → check the screenshot.
- Default robots.txt should only block truly private paths (/api/, /admin/, /account/).

**How to fix if it happens:**
1. Update robots.txt to allow access to all public static assets.
2. Use GSC URL Inspection on 5 key pages to verify Google can render them correctly.
3. Request re-indexing of affected pages.

---

### 1.3 Canonical Tag Pointing to the Wrong URL

**What happened:** During a redesign, the canonical tag template was updated but had a bug — it generated canonical URLs using the staging domain instead of production. Every page on the site told Google "the canonical version of this page is on staging.example.com."

**Why it was bad:** Google tried to index the staging domain (which was password-protected, so it returned 401 errors). Production pages were treated as duplicates of a non-accessible staging site. Rankings plummeted.

**How to prevent it:**
- Canonical tags should use the `{{PRIMARY_DOMAIN}}` environment variable, not a hardcoded domain.
- CI/CD check: verify canonical tags use the production domain.
- Monthly audit check: spot-check canonical tags on 5 pages.

**How to fix if it happens:**
1. Fix the canonical tag template to use the correct production domain.
2. Rebuild and redeploy.
3. Request re-indexing of key pages.
4. Recovery time: 2-4 weeks.

---

### 1.4 Sitemap Including 404 Pages

**What happened:** The auto-generated sitemap pulled URLs from the CMS database, including deleted and draft pages. 30% of sitemap URLs returned 404. Google kept trying to crawl them, wasting crawl budget and generating hundreds of crawl errors.

**Why it was bad:** Crawl budget wasted on dead pages. Excessive 404 errors in GSC made it harder to identify real issues. Googlebot crawled the site less frequently because it encountered so many errors.

**How to prevent it:**
- Sitemap generation must check page status (only include published pages that return 200).
- Automated sitemap validation: fetch the sitemap, spot-check 20 random URLs — all should return 200.
- Monthly: compare sitemap URL count to actual live page count.

**How to fix if it happens:**
1. Fix sitemap generation to exclude non-200 URLs.
2. Regenerate and resubmit sitemap in GSC.
3. For deleted pages that had traffic: add 301 redirects to relevant pages.

---

### 1.5 Infinite Crawl Traps from Faceted Navigation

**What happened:** An e-commerce site had faceted navigation (filters for size, color, price, brand). Each filter combination generated a unique URL: `/shoes?color=red&size=10&brand=nike&sort=price`. The combinations were effectively infinite. Googlebot spent the entire crawl budget on filter URLs instead of product pages.

**Why it was bad:** Product pages were not crawled frequently. New products took weeks to get indexed. Thousands of thin, duplicate filter pages diluted the site's quality signals.

**How to prevent it:**
- Block filter/facet parameters in robots.txt: `Disallow: /*?color=` `Disallow: /*?sort=`
- Or use `<meta name="robots" content="noindex, follow">` on filtered pages.
- Or use canonical tags pointing filtered pages to the unfiltered category page.
- Use `rel="nofollow"` on filter links to prevent Googlebot from discovering them.

**How to fix if it happens:**
1. Implement one of the prevention strategies above.
2. Submit a clean sitemap with only the canonical category/product URLs.
3. Monitor crawl stats in GSC — crawl budget should shift to important pages within 2-4 weeks.

---

### 1.6 CDN Caching Stale Meta Tags

**What happened:** The CDN was configured with aggressive caching (24-hour TTL). Someone updated title tags and meta descriptions in the CMS. The CDN continued serving the old version to both users and Googlebot for 24 hours. For some pages with edge caching issues, the stale version persisted for days.

**Why it was bad:** SEO test results were contaminated (changes were not live when the team thought they were). Title tag optimizations did not reach Googlebot when expected, delaying ranking improvements.

**How to prevent it:**
- Implement cache purging on CMS content updates. When a page is edited, purge that URL from the CDN.
- Use versioned asset URLs for CSS/JS (automatically done by most frameworks).
- After publishing SEO changes, verify the live page (not the CMS preview) reflects the changes.
- Set reasonable TTLs: 1 hour for HTML pages, longer for static assets.

**How to fix if it happens:**
1. Manually purge the CDN cache for affected URLs.
2. Verify changes are live: `curl -sI URL` (check headers) and `curl -s URL | grep "<title>"`.
3. Re-test your SEO changes after confirming the CDN is serving fresh content.

---

## 2. Content Gotchas

### 2.1 Keyword Cannibalization Between Blog and Product Pages

**What happened:** The blog published "Best Project Management Tools" (targeting "project management tools") while the product page also targeted "project management tools." Google alternated between ranking the blog post and the product page, never committing to either. Both pages ranked worse than either would have alone.

**Why it was bad:** Split authority between two pages. Neither page could build momentum. The blog post had more content but the product page had more backlinks. Google was confused about which to show.

**How to prevent it:**
- Maintain a keyword-to-URL mapping. Every target keyword is assigned to exactly one page.
- Blog posts target informational variants ("how to choose a project management tool"), product pages target commercial variants ("project management software").
- Before publishing any content, check: does another page already target this keyword?

**How to fix if it happens:**
1. Decide which page should own the keyword (usually the one with more backlinks and better performance history).
2. Refocus the losing page on a different keyword variant.
3. Add a prominent internal link from the losing page to the winning page.
4. If the pages are very similar, consider merging them (301 redirect the weaker page to the stronger one).

---

### 2.2 Thin Content Penalty from Auto-Generated Pages

**What happened:** An e-commerce site auto-generated pages for every product attribute combination. "Red widgets in Boston," "Blue widgets in Boston," "Red widgets in New York" — each with the same template, different only in the attribute values. 10,000 pages with near-identical content.

**Why it was bad:** Google classified the site as having a thin content problem. The helpful content system (now integrated into core algorithm) downranked the entire domain, not just the thin pages. Even high-quality product pages lost rankings.

**How to prevent it:**
- Auto-generated pages must have meaningful unique content per page. If the only difference is swapping "red" for "blue," it is thin content.
- Set a minimum content threshold: if a generated page cannot have at least 300 words of unique, useful content, do not create it.
- Use `noindex` on auto-generated pages that exist for UX but have no SEO value.

**How to fix if it happens:**
1. Identify all thin auto-generated pages.
2. Either add substantial unique content to each, or noindex/remove them.
3. 301 redirect removed pages to the most relevant remaining page.
4. Recovery from helpful content downranking can take 3-12 months.

---

### 2.3 Duplicate Meta Descriptions Across Product Variants

**What happened:** 500 product pages all had the meta description: "Buy [product name] at [brand]. Free shipping on orders over $50." The product name changed, but the rest was identical. Google ignored the meta descriptions and auto-generated snippets from the page content — which was often not compelling.

**Why it was bad:** Lost control over SERP snippets. Auto-generated snippets were often pulled from irrelevant sections of the page (footer text, navigation, etc.). CTR was lower than it could have been.

**How to prevent it:**
- Meta description templates must include product-specific details beyond just the name: key features, price, differentiator.
- Audit for duplicate meta descriptions monthly (Screaming Frog → Meta Descriptions → Duplicate).
- For large catalogs: it is better to leave meta descriptions empty (let Google generate them) than to have duplicates.

**How to fix if it happens:**
1. Rewrite meta descriptions for top-traffic product pages (prioritize by organic impressions).
2. For the long tail, either write unique descriptions or remove the duplicates (empty is better than duplicated).

---

### 2.4 Over-Optimization (Keyword Stuffing)

**What happened:** The SEO team was told to include the target keyword in the title, H1, first paragraph, every H2, alt text of every image, and the URL. The result: "Best CRM Software: Top CRM Software Solutions for CRM Software Needs." Google demoted the page for over-optimization.

**Why it was bad:** Reads terribly to humans. Google's algorithms specifically detect and penalize unnatural keyword density. The page ranked lower than a competitor's page that used the keyword naturally 3-4 times.

**How to prevent it:**
- Write for humans first. Include the keyword where it naturally fits — title, H1, and 2-3 times in the body.
- Use related terms and synonyms naturally. Google understands semantic relationships.
- Read the content aloud. If it sounds robotic, it is over-optimized.

**How to fix if it happens:**
1. Rewrite the page with a human-first approach.
2. Reduce keyword density to natural levels (typically 0.5-1.5% of total words).
3. Replace some exact-match keyword instances with synonyms and related terms.

---

### 2.5 Publishing 50 Posts at Once Instead of Consistent Cadence

**What happened:** The content team stockpiled 50 blog posts and published them all on the same day. Googlebot crawled a few but did not discover most of them for weeks. The sitemap was enormous overnight. Internal linking between the new posts was nonexistent.

**Why it was bad:** Crawl budget could not handle 50 new URLs at once. Many posts were not indexed for weeks. No internal linking structure between posts meant they competed against each other without supporting each other. Social sharing and promotion was impossible to do for 50 posts simultaneously.

**How to prevent it:**
- Publish 2-3 posts per week on a consistent schedule.
- Queue content in the CMS with scheduled publish dates.
- Each new post should be internally linked from at least 2-3 existing relevant pages.
- Drip publishing also allows proper promotion of each post.

**How to fix if it happens:**
1. Manually submit the most important posts for indexing via GSC URL Inspection.
2. Add internal links from high-authority existing pages to the new posts.
3. Spread social promotion across multiple weeks.
4. Lesson learned: implement a content calendar with staggered publishing.

---

## 3. Migration Gotchas

### 3.1 Forgetting to Redirect Old URLs

**What happened:** Site migrated from WordPress to Next.js. URL structure changed from `/blog/post-slug` to `/articles/post-slug`. No redirects were set up. All old URLs returned 404. Every backlink to the old site was broken. Rankings dropped to zero within 2 weeks.

**Why it was bad:** Total loss of link equity from all existing backlinks. Total loss of organic traffic. Recovery took 4+ months even after redirects were added, because Google had already deindexed the old URLs and the new URLs had to build authority from scratch.

**How to prevent it:**
- Follow the migration checklist (`36-seo/migration/seo-migration-checklist.template.md`).
- Every migration requires a complete redirect map before go-live.
- Test redirects in staging before deploying to production.
- Never launch a migration without SEO sign-off on the redirect map.

**How to fix if it happens:**
1. Add 301 redirects immediately for every old URL.
2. Submit updated sitemap with new URLs.
3. Request re-indexing of top pages via GSC.
4. Monitor recovery — expect 2-4 months for rankings to return.

---

### 3.2 Redirect Chains Killing Page Speed

**What happened:** Over multiple migrations, redirects stacked: `http://old.com/page` → `https://old.com/page` → `https://new.com/page` → `https://new.com/articles/page`. Four hops. Each hop added 50-100ms of latency. Googlebot sometimes gave up after 2-3 hops.

**Why it was bad:** 200-400ms added to every page load for users arriving from old bookmarks or backlinks. Googlebot crawling was inefficient. Link equity diminished with each hop (estimated 10-15% loss per hop).

**How to prevent it:**
- When adding new redirects, check for existing redirect chains.
- All redirects should go directly to the final destination URL in a single hop.
- After every migration, run Screaming Frog's redirect chain report and flatten any chains.

**How to fix if it happens:**
1. Map every redirect chain from original source to final destination.
2. Update all redirects to point directly to the final URL (single hop).
3. Test with `curl -sIL` to verify single-hop resolution.

---

### 3.3 Losing Structured Data During Redesign

**What happened:** The old site had FAQ schema, Product schema, and BreadcrumbList schema generating rich results. The new site design did not include structured data implementation. Rich results disappeared. CTR dropped 15-25% on affected pages.

**Why it was bad:** Rich results increase CTR by 15-30% on average. Losing them means losing click share even if rankings stay the same. Nobody noticed for 6 weeks because the team was focused on design metrics, not SEO metrics.

**How to prevent it:**
- Pre-migration audit must inventory all structured data types and pages.
- Migration QA must include structured data validation (Rich Results Test on 5+ pages of each type).
- Post-migration monitoring must include GSC Enhancements checks.

**How to fix if it happens:**
1. Re-implement all structured data on the new templates.
2. Validate with Rich Results Test.
3. Rich results will return within 1-3 weeks as Google recrawls.

---

### 3.4 Not Updating Internal Links Post-Migration

**What happened:** Redirects were set up correctly for external traffic, but nobody updated internal links within the site content. Every internal link went through a redirect. 500+ internal links each adding a redirect hop.

**Why it was bad:** Slower internal page loads (redirect hop on every navigation). Crawl budget wasted on internal redirects. Poor user experience with visible redirect flash on slower connections.

**How to prevent it:**
- Migration checklist includes: "Update all internal links to use new URL patterns."
- After migration, crawl the new site with Screaming Frog and check for internal links that return 3xx responses.
- CMS search-and-replace for old URL patterns in content.

**How to fix if it happens:**
1. Crawl the site and export all internal links pointing to redirect URLs.
2. Bulk update in CMS (search and replace old URL pattern with new).
3. For hardcoded links in templates: update template files.

---

### 3.5 Not Monitoring for 4+ Weeks Post-Migration

**What happened:** Migration went live on a Friday. The team checked on Monday, saw traffic was "about the same," and moved on. A redirect mapping error was causing 40% of blog URLs to 404, but the team was not monitoring blog traffic specifically. The issue was not discovered for 5 weeks.

**Why it was bad:** 5 weeks of broken blog URLs meant Google deindexed those pages. Backlinks to those pages lost their equity. Recovery after adding correct redirects took an additional 6 weeks.

**How to prevent it:**
- Post-migration monitoring is mandatory for 4 weeks minimum, daily.
- Monitor by page group (blog, products, landing pages), not just total traffic.
- Set up automated alerts for 404 spikes and traffic drops by section.
- Assign a specific person responsible for daily monitoring.

**How to fix if it happens:**
1. Identify all broken redirects immediately.
2. Fix redirect mapping.
3. Request re-indexing of affected pages.
4. Expect 4-8 weeks for recovery of deindexed pages.

---

## 4. Measurement Gotchas

### 4.1 Not Filtering Bot Traffic in GA

**What happened:** GA4 showed organic traffic growing steadily. Conversion rate was declining. Investigation revealed that 25% of "organic traffic" was actually bot traffic — SEO monitoring tools, scrapers, and crawlers that executed JavaScript and triggered GA4 tracking.

**Why it was bad:** All metrics were inflated. Conversion rate calculations were wrong. Marketing budgets were allocated based on incorrect traffic numbers. Seasonal trends were masked by bot traffic patterns.

**How to prevent it:**
- Enable "Exclude all known bots and spiders" in GA4 if available (Admin → Data Settings).
- Cross-reference GA4 organic sessions with GSC clicks — they should be in the same ballpark.
- Monitor for suspicious patterns: traffic at unusual hours, zero engagement metrics, traffic from unexpected locations.
- For accurate measurement, consider server-side analytics as a complement to GA4.

**How to fix if it happens:**
1. Enable bot filtering.
2. Create a GA4 segment that excludes known bot patterns for retroactive analysis.
3. Recalculate baselines using filtered data.
4. Do not retroactively change historical reports — annotate the correction point.

---

### 4.2 Confusing Search Console Data with GA Data

**What happened:** The team reported "organic traffic dropped 20%" based on GSC clicks. When checked in GA4, organic sessions were flat. The discrepancy was because GSC counts clicks from Google search only, while GA4 counts sessions from all search engines and includes attribution differences.

**Why it was bad:** False alarm triggered an unnecessary incident response. Time wasted investigating a non-issue. Credibility of SEO team damaged when the "crisis" turned out to be a measurement discrepancy.

**How to prevent it:**
- Understand what each tool measures:
  - **GSC:** Clicks and impressions from Google Search only. Counts by URL.
  - **GA4:** Sessions from all traffic sources. Uses last-click or data-driven attribution. Counts by session.
- Use GSC as the primary source for Google-specific SEO performance.
- Use GA4 as the primary source for business impact (conversions, revenue from organic).
- Never compare absolute numbers between GSC and GA4 — compare trends.

**How to fix if it happens:**
1. Educate the team on the difference between GSC and GA4 data.
2. Standardize reporting: GSC for SEO performance, GA4 for business impact.
3. Document the discrepancy for future reference.

---

### 4.3 Misinterpreting Seasonal Drops as Problems

**What happened:** A B2B SaaS site saw a 30% traffic drop in December. The SEO team panicked, initiated incident response, and spent 2 weeks investigating. The conclusion: B2B search volume drops every December because decision-makers go on holiday. Same thing happened the previous December.

**Why it was bad:** Two weeks of SEO team time wasted on a non-issue. Opportunity cost of not working on actual improvements. Team credibility reduced.

**How to prevent it:**
- Always compare year-over-year, not just month-over-month.
- Document seasonal patterns for your industry.
- Before triggering incident response for a traffic drop, check: "Did this happen last year at the same time?"
- Use Google Trends to verify if search demand for your keywords actually declined.

**How to fix if it happens:**
1. Close the incident as "seasonal — not actionable."
2. Add the seasonal pattern to team documentation.
3. Set up year-over-year comparison as the default reporting view.

---

### 4.4 Tracking Wrong Conversion Events

**What happened:** The SEO team reported organic conversions based on a "page_view" event for the /thank-you page. But the /thank-you page was also accessible via direct URL (no form submission required). Bot traffic and accidental visits inflated "conversion" numbers. Actual form submissions were 60% lower than reported.

**Why it was bad:** Organic channel ROI was massively overstated. Budget decisions were made based on inflated numbers. When the tracking was corrected, it appeared that organic performance "dropped" — but it had never been that high.

**How to prevent it:**
- Track actual business events (form submission, purchase completion), not page views of confirmation pages.
- GA4 Key Events should fire on the actual action (form submit, API success response), not on the page that appears afterward.
- Validate conversion tracking monthly: submit a test conversion and verify it appears in GA4 with correct attribution.

**How to fix if it happens:**
1. Implement correct event tracking (fire on form submission, not page view).
2. Recalculate historical conversion data if possible.
3. Communicate the correction to stakeholders with context (numbers were inflated, not declining).

---

### 4.5 Panicking Over Daily Fluctuations

**What happened:** The CEO checked organic traffic every morning. On Tuesday, organic sessions were 15% below Monday. The SEO team was asked to "investigate urgently." Investigation revealed: Monday was the highest-traffic day of the week. Tuesday was always lower. This happened every single week.

**Why it was bad:** Weekly disruption of SEO team to investigate normal day-of-week patterns. Team burnout from constant false alarms. No time for actual strategic work.

**How to prevent it:**
- Report organic traffic weekly or monthly, not daily.
- If daily monitoring is required, compare to the same day last week (Tuesday vs. Tuesday), not to yesterday.
- Set up automated alerts with appropriate thresholds (>20% weekly decline, not daily).
- Educate stakeholders on normal traffic volatility patterns.

**How to fix if it happens:**
1. Show the stakeholder a 30-day traffic chart with day-of-week overlay.
2. Demonstrate the recurring weekly pattern.
3. Agree on reporting frequency and alert thresholds.

---

## 5. AI / Algorithm Gotchas

### 5.1 Overreacting to Daily Rank Changes

**What happened:** The team tracked rankings daily. Position 3 became position 5 on a Monday. By Wednesday it was position 2. But on Monday, the team had already started rewriting the page, changing the title tag, and adding 2,000 words of content in response to the "ranking drop."

**Why it was bad:** Unnecessary content changes disrupted a page that was performing well. The original position 3 was fine — the fluctuation was normal daily SERP volatility. After the reactive changes, the page actually dropped further because Google needed to re-evaluate the substantially modified page.

**How to prevent it:**
- Do not react to ranking changes that last less than 7 days.
- Track rolling 7-day average position, not daily position.
- Establish a "reaction threshold": only investigate if position drops >5 spots for >7 days.
- See `36-seo/incident/algorithm-update-playbook.md` for when to react and when not to.

**How to fix if it happens:**
1. If the reactive changes were not improvements, revert them.
2. If they were genuine improvements, keep them but recognize the trigger was wrong.
3. Implement the reaction threshold policy.

---

### 5.2 Chasing Every Algorithm Update

**What happened:** Every time Search Engine Roundtable reported a Google update, the SEO team dropped everything and "audited the site." This happened 15 times in a year. Each time, the team found minor issues and made changes. After 15 rounds of reactive changes, the site's content strategy was incoherent — a Frankenstein of responses to different updates rather than a consistent quality approach.

**Why it was bad:** No consistent content strategy. Reactive instead of proactive. Team time consumed by audit cycles instead of content creation and genuine improvement. Some changes made in response to one update conflicted with changes for another.

**How to prevent it:**
- Maintain a consistent content quality standard regardless of algorithm updates.
- Only conduct an update-specific audit when YOUR traffic is affected AND the update is confirmed.
- Most updates do not affect most sites. Check your data before reacting.
- Quarterly deep audits are sufficient for maintaining health.

**How to fix if it happens:**
1. Stop reacting to updates for 3 months.
2. Conduct one comprehensive audit.
3. Develop a proactive SEO strategy based on fundamentals (content quality, technical health, user experience).
4. Only deviate from the strategy for significant, confirmed traffic impacts.

---

### 5.3 Over-Optimizing for AI Overviews at the Expense of Traditional SEO

**What happened:** The team read articles about AI Overviews taking traffic from organic results. They restructured all content to be "AI-overview friendly" — short, concise answers at the top of every page, removing detailed content that they considered "too long for AI to summarize." Traffic dropped because the pages lost the depth that had earned them high rankings in traditional organic results.

**Why it was bad:** AI Overviews cite authoritative, comprehensive sources. By making content shallower, the pages became LESS likely to be cited in AI Overviews AND ranked lower in traditional results. Lost on both fronts.

**How to prevent it:**
- Comprehensive, authoritative content performs well in both traditional SEO and AI Overviews.
- Do not dumb down content for AI. Write the best possible content for humans — AI systems will extract what they need.
- Monitor AI Overview citations as a secondary metric, not a primary optimization target.
- Traditional organic clicks are still 10-20x more valuable than AI Overview citations for most sites.

**How to fix if it happens:**
1. Restore content depth to all pages that were simplified.
2. Focus on being the definitive resource for each topic.
3. Track AI Overview citations as an observation metric, not an optimization target.

---

### 5.4 Treating AI-Generated Content as SEO Strategy

**What happened:** The team used AI to generate 200 blog posts in a month, targeting long-tail keywords. The content was grammatically correct but generic — it said the same things every other AI-generated article said. Initial traffic trickled in, then the next core update wiped out 80% of organic traffic to the blog.

**Why it was bad:** Google's helpful content system specifically targets content created primarily for ranking purposes without adding unique value. 200 generic articles triggered the site-wide classifier, dragging down even the high-quality human-written content.

**How to prevent it:**
- AI can assist with content creation (research, outlining, first drafts), but the final output must include genuine human expertise, original insights, and unique value.
- Every AI-assisted article must be reviewed and substantially enhanced by a subject matter expert.
- The test: "Would this article exist if search engines did not exist?" If the answer is no, it is search-first content and is vulnerable.
- Quality over quantity — always. 10 exceptional articles outperform 200 generic ones.

**How to fix if it happens:**
1. Audit all AI-generated content. For each piece: does it contain unique insights, original data, or expert perspective?
2. Remove or substantially improve content that does not pass the test.
3. This is a site-wide classifier — recovery requires reducing the proportion of low-quality content site-wide.
4. Recovery timeline: 6-12 months for helpful content classifier reassessment.

---

### 5.5 Ignoring AI Overview Impact on CTR

**What happened:** Rankings were stable. Impressions were stable. But clicks dropped 25% over 6 months. The team investigated everything — title tags, meta descriptions, SERP features. The cause: AI Overviews had been gradually expanding into the site's key queries, satisfying users before they clicked any organic result.

**Why it was bad:** Traditional SEO metrics (position, impressions) did not capture the problem. The team spent months investigating the wrong signals. Revenue from organic declined without a clear explanation in traditional SEO metrics.

**How to prevent it:**
- Track CTR by keyword cluster, not just overall average CTR.
- Monitor AI Overview presence on your top keywords monthly (see `monthly-audit-checklist.md`, Section 7).
- Diversify traffic sources — do not depend entirely on organic search.
- For queries where AI Overviews consistently appear, focus on being cited in the AI Overview rather than traditional organic ranking.

**How to fix if it happens:**
1. Accept that some queries will have structurally lower CTR due to AI Overviews.
2. Adjust traffic forecasts and business plans accordingly.
3. Invest in content that drives clicks despite AI Overviews (tools, interactive content, unique data that requires visiting the page).
4. Build direct traffic channels (email list, community, social media) as a hedge.

---

## Cross-References

- **Incident response:** `36-seo/incident/seo-incident-response.md`
- **Traffic drop diagnosis:** `36-seo/incident/traffic-drop-diagnosis.md`
- **Algorithm updates:** `36-seo/incident/algorithm-update-playbook.md`
- **Migration checklist:** `36-seo/migration/seo-migration-checklist.template.md`
- **Monthly audit:** `36-seo/audit/monthly-audit-checklist.md`
- **General lessons learned:** `LESSONS-LEARNED.md`
- **Other gotchas files:** `13-lessons-gotchas/`
