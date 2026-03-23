# SEO Migration Checklist — {{PROJECT_NAME}}

**Migration type:** {{MIGRATION_TYPE}}
**Old domain/URL structure:** {{OLD_DOMAIN}}
**New domain/URL structure:** {{NEW_DOMAIN}}
**Planned migration date:** {{MIGRATION_DATE}}
**Migration owner:** {{MIGRATION_OWNER}}
**SEO lead:** {{SEO_LEAD}}

---

## Migration Type Reference

This checklist covers all migration types. Check the applicable sections for your migration:

| Migration Type | Key Risk | Typical Traffic Recovery |
| -------------- | -------- | ----------------------- |
| Domain change (old.com → new.com) | Loss of domain authority, broken backlinks | 3-6 months for full recovery |
| HTTPS migration (http → https) | Mixed content, redirect chains, lost link equity | 2-4 weeks if done correctly |
| Platform migration (WordPress → Next.js) | URL structure changes, rendering differences, lost content | 2-6 months |
| URL structure change (/blog/post → /articles/post) | Redirect mapping errors, internal link rot | 1-3 months |
| Site redesign (new templates) | Content changes, URL changes, structural changes | 1-4 months |
| Domain consolidation (merge multiple domains) | Redirect complexity, content duplication during transition | 3-6 months |

**Expected traffic dip:** Even a perfect migration will typically see a 10-20% temporary organic traffic dip lasting 2-6 weeks. Plan for this. Communicate it to stakeholders in advance.

---

## Phase 1: Pre-Migration Audit (4-6 Weeks Before Migration)

### 1.1 Crawl the Existing Site

- [ ] Full Screaming Frog crawl of the current site. Save the crawl file — this is your source of truth.
- [ ] Export all URLs with: URL, status code, title tag, meta description, H1, canonical URL, word count, internal links count.
- [ ] Record total indexed pages: `site:{{OLD_DOMAIN}}` in Google.
- [ ] Export XML sitemap URLs and compare to crawl URLs (identify gaps).

### 1.2 Document Baseline Metrics

Capture these metrics for the 3-month period before migration:

| Metric | Value | Source | Date Range |
| ------ | ----- | ------ | ---------- |
| Total organic sessions (monthly avg) | | GA4 | |
| Total organic clicks (monthly avg) | | GSC | |
| Total impressions (monthly avg) | | GSC | |
| Average CTR | | GSC | |
| Total indexed pages | | GSC Coverage | |
| Total referring domains | | Ahrefs/Semrush | |
| Domain Rating / Authority | | Ahrefs/Semrush | |
| Top 20 keyword rankings | | Rank tracker | |
| Core Web Vitals (CWV) pass rate | | GSC CWV report | |
| Revenue from organic channel | | GA4 e-commerce | |

**Store this data permanently.** You will need it for post-migration comparison.

### 1.3 Identify High-Value Pages

Export from GA4 and GSC the pages that drive the most organic value:

- [ ] Top 50 pages by organic sessions (GA4).
- [ ] Top 50 pages by organic clicks (GSC).
- [ ] Top 50 pages by conversions/revenue from organic (GA4).
- [ ] Pages with the most backlinks (Ahrefs → Best by Links).
- [ ] Pages with featured snippets or rich results (GSC → Search Appearance).

These pages get priority attention during redirect mapping and post-migration monitoring.

### 1.4 Backlink Audit

- [ ] Export all backlinks from Ahrefs/Semrush.
- [ ] Identify top 100 most valuable backlinks (high DR, relevant, editorial).
- [ ] Note the exact URLs these backlinks point to — these URLs MUST redirect correctly.
- [ ] For domain changes: plan outreach to top link sources to update their links (nice to have, not required if redirects are in place).

### 1.5 Technical SEO Inventory

Document the current state of:

- [ ] robots.txt file contents
- [ ] XML sitemap structure and URLs
- [ ] Canonical tag patterns
- [ ] Hreflang tags (if multilingual)
- [ ] Structured data types and pages
- [ ] Internal linking structure (top linked pages)
- [ ] .htaccess or server redirect rules currently in place
- [ ] CDN configuration
- [ ] Google Search Console verified properties

---

## Phase 2: Redirect Mapping (3-4 Weeks Before Migration)

### 2.1 Create the Full Redirect Map

**Every URL on the old site must map to a URL on the new site or be explicitly designated as removed.**

See `36-seo/migration/url-redirect-mapping.template.md` for the mapping template.

- [ ] Map every URL from the Screaming Frog crawl (Phase 1.1) to its new URL.
- [ ] Prioritize high-value pages (Phase 1.3) — these get manual review.
- [ ] For bulk pages with predictable patterns (e.g., /blog/[slug] → /articles/[slug]), use regex rules.
- [ ] For removed pages with no equivalent: redirect to the next most relevant page (not the homepage).
- [ ] Flag any URL that cannot be redirected cleanly — these need individual decisions.

### 2.2 Redirect Rules

| Rule | Required |
| ---- | -------- |
| All redirects are 301 (permanent) | Yes — unless genuinely temporary |
| No redirect chains (A → B → C) | Maximum 1 hop (A → C) |
| No redirect loops | Verify with automated testing |
| HTTPS redirects correct | http → https AND old domain → new domain |
| Trailing slash handling | Consistent — pick one pattern and redirect the other |
| Query parameters handled | Decide: pass through, strip, or redirect |
| Case sensitivity handled | Redirect uppercase URLs to lowercase (or vice versa, consistently) |

### 2.3 Redirect Implementation Patterns

**Domain change ({{OLD_DOMAIN}} → {{NEW_DOMAIN}}):**
```
# Nginx
server {
    server_name {{OLD_DOMAIN}};
    return 301 https://{{NEW_DOMAIN}}$request_uri;
}
```

**URL structure change:**
```
# Nginx — regex redirect
location ~ ^/blog/(.*)$ {
    return 301 /articles/$1;
}
```

**Platform-specific redirects:**

| Platform | Method | File/Location |
| -------- | ------ | ------------- |
| Nginx | `return 301` or `rewrite` | nginx.conf or site config |
| Apache | `Redirect` or `RewriteRule` | .htaccess |
| Vercel | `redirects` in vercel.json | vercel.json |
| Netlify | `_redirects` file or netlify.toml | _redirects or netlify.toml |
| CloudFlare | Page Rules or Bulk Redirects | CloudFlare dashboard |
| Next.js | `redirects()` in next.config.js | next.config.js |

### 2.4 Review and Sign-Off

- [ ] SEO lead reviews full redirect map.
- [ ] Engineering lead reviews redirect implementation.
- [ ] Redirect map signed off by both parties.
- [ ] Redirect map stored in version control.

---

## Phase 3: Staging Environment Testing (2 Weeks Before Migration)

### 3.1 Deploy to Staging

- [ ] New site deployed to staging environment (staging.{{NEW_DOMAIN}} or similar).
- [ ] Staging is blocked from search engines (robots.txt `Disallow: /` or password-protected).

### 3.2 Verify Redirects

- [ ] Test every redirect in the mapping file (automated script or Screaming Frog list mode).
- [ ] Verify status codes are 301 (not 302 or 307).
- [ ] Verify no redirect chains exist.
- [ ] Verify no redirect loops exist.
- [ ] Test edge cases: trailing slashes, query parameters, uppercase URLs, encoded characters.
- [ ] Test on mobile user-agent (some redirect rules behave differently).

### 3.3 Verify On-Page SEO

- [ ] Crawl the new site with Screaming Frog. Compare to old crawl:
  - Title tags match or improved.
  - Meta descriptions match or improved.
  - H1 tags present and correct.
  - Canonical tags point to correct new URLs (not old URLs).
  - No accidental `noindex` tags.
- [ ] Internal links updated to point to new URLs (not relying on redirects for internal navigation).
- [ ] Image alt text preserved.
- [ ] Content preserved (word count comparison — flag any page with >20% content reduction).

### 3.4 Verify Technical SEO

- [ ] New robots.txt is correct (allows crawling of intended pages).
- [ ] New XML sitemap generated with all new URLs. Old URLs are NOT in the new sitemap.
- [ ] Structured data validated on key pages (Rich Results Test).
- [ ] Hreflang tags updated to new URLs (if multilingual).
- [ ] Page speed acceptable (PageSpeed Insights on 5 key page types).
- [ ] Mobile rendering correct.
- [ ] JavaScript rendering verified (if using client-side rendering framework).

### 3.5 Pre-Migration Stakeholder Notification

- [ ] Notify all stakeholders of migration date and expected temporary traffic impact.
- [ ] Confirm rollback plan with engineering (see Phase 6).

---

## Phase 4: Go-Live (Migration Day)

### 4.1 Pre-Launch (Morning of Migration Day)

- [ ] Final baseline snapshot of all metrics (GSC, GA4, rank tracker).
- [ ] Confirm engineering team is available for immediate support.
- [ ] Confirm SEO lead is available for monitoring for the next 8 hours.

### 4.2 Launch Steps

Execute in this order:

1. [ ] Deploy new site to production.
2. [ ] Activate redirects (verify they work immediately with `curl -sI {{OLD_DOMAIN}}/sample-page`).
3. [ ] Remove `noindex` / robots.txt blocks on new site (if staging had them).
4. [ ] Submit new XML sitemap in Google Search Console.
5. [ ] **For domain changes:** Add new domain property in GSC. Use the Change of Address tool (GSC → Settings → Change of Address).
6. [ ] **For HTTPS migrations:** Add https:// property in GSC if not already present.
7. [ ] Update Google Business Profile URL (if applicable).
8. [ ] Update social media profile links.
9. [ ] Notify Google of the change: Request indexing of top 20 pages via GSC URL Inspection tool.

### 4.3 Immediate Verification (First 2 Hours)

- [ ] Test 20 redirects manually (mix of high-value and random pages).
- [ ] Check `site:{{NEW_DOMAIN}}` in Google — are new pages appearing?
- [ ] Check `site:{{OLD_DOMAIN}}` in Google — are old pages starting to redirect?
- [ ] Verify GA4 tracking is working on the new site (check real-time data).
- [ ] Check for console errors on 5 key pages.
- [ ] Verify structured data on 3 key pages (Rich Results Test).
- [ ] Check robots.txt is accessible and correct: `curl -s https://{{NEW_DOMAIN}}/robots.txt`

---

## Phase 5: Post-Migration Monitoring

### Week 1 (Daily Monitoring)

| Check | What to Look For | Tool |
| ----- | ---------------- | ---- |
| Organic traffic | Compare to baseline — some dip is normal | GA4 |
| Crawl errors | Spike in 404s or 5xx errors | GSC → Indexing → Pages |
| Crawl stats | Is Googlebot crawling the new site? | GSC → Settings → Crawl Stats |
| Indexation | Are new URLs getting indexed? Are old URLs being removed? | GSC → Indexing → Pages |
| Rankings (top 20 keywords) | Fluctuations are normal in week 1 | Rank tracker |
| Redirect verification | Spot-check 10 redirects daily | `curl -sI` |
| 404 report | New 404s from organic traffic | GA4 + GSC |
| Search Console messages | Any warnings or issues | GSC |

### Week 2-4 (Daily → Every Other Day)

- [ ] Continue all Week 1 checks, reducing frequency to every other day.
- [ ] Compare organic traffic week-over-week (should be recovering).
- [ ] Check that old URLs are being deindexed and new URLs are being indexed (GSC Coverage).
- [ ] Monitor for redirect chains that may have been missed (Screaming Frog re-crawl).
- [ ] Check backlink tools — are backlinks pointing to new URLs or still hitting redirects?

### Week 4-8 (Weekly Monitoring)

- [ ] Weekly organic traffic comparison to baseline.
- [ ] Rankings stabilization check (should be returning to pre-migration levels).
- [ ] Full Screaming Frog crawl of new site — check for any new issues.
- [ ] Verify all structured data is rendering correctly.
- [ ] Check Google cache of key pages — are they showing new content?

### Month 2-3 (Bi-Weekly Monitoring)

- [ ] Organic traffic should be at or near baseline.
- [ ] Rankings should be stabilized.
- [ ] Indexation should be complete (old URLs deindexed, new URLs indexed).
- [ ] If traffic has not recovered to within 10% of baseline by month 3, conduct a full diagnostic (see `36-seo/incident/traffic-drop-diagnosis.md`).

### Post-Migration Report (Month 3)

Document the migration outcome:

| Metric | Pre-Migration | Month 1 Post | Month 2 Post | Month 3 Post | Recovery % |
| ------ | ------------- | ------------ | ------------ | ------------ | ---------- |
| Organic sessions (monthly) | | | | | |
| Organic clicks (monthly) | | | | | |
| Impressions (monthly) | | | | | |
| Average CTR | | | | | |
| Indexed pages | | | | | |
| Top 20 keyword avg position | | | | | |
| Revenue from organic | | | | | |

---

## Phase 6: Rollback Criteria

Define conditions under which you would rollback the migration:

### Immediate Rollback (Within 24 Hours)

| Trigger | Action |
| ------- | ------ |
| Redirects not working (returning 404/500 instead of 301) | Fix redirects or rollback DNS |
| New site has critical errors (blank pages, broken functionality) | Rollback to old site, fix, re-migrate |
| GA4 shows zero organic traffic (tracking broken) | Fix tracking immediately (do not rollback for measurement issues) |

### Evaluated Rollback (Within 1 Week)

| Trigger | Assessment |
| ------- | ---------- |
| >50% organic traffic drop sustained 5+ days | Investigate — likely a redirect issue, not requiring full rollback |
| Googlebot receiving 5xx errors on majority of new URLs | Fix server issues; consider temporary rollback if fix is >24 hours |
| Manual action received | Very unlikely to be migration-related; investigate separately |

### Not a Rollback Trigger

| Situation | Why |
| --------- | --- |
| 10-20% traffic dip in week 1 | Expected and normal during any migration |
| Ranking fluctuations in week 1-2 | Google is reprocessing — rankings will stabilize |
| Old URLs still appearing in search results | Takes weeks for Google to fully process redirects |
| Some pages not yet indexed on new domain | Indexation takes time — be patient |

---

## Migration-Type-Specific Checklists

### Domain Change Additions

- [ ] Register new domain well in advance (aged domains carry more trust).
- [ ] Set up new GSC property for new domain.
- [ ] Use GSC Change of Address tool.
- [ ] Update all external profiles (social media, directories, business listings).
- [ ] Maintain old domain and redirects for minimum 1 year (ideally 2+ years).
- [ ] Update email signatures, business cards, marketing materials.

### HTTPS Migration Additions

- [ ] SSL certificate covers all subdomains (wildcard or multi-domain cert).
- [ ] Mixed content audit — no HTTP resources loaded on HTTPS pages.
- [ ] HSTS header configured after verifying everything works.
- [ ] Update hardcoded HTTP URLs in CMS, templates, and CDN configuration.
- [ ] Update canonical tags to use HTTPS.
- [ ] Update sitemap URLs to use HTTPS.

### Platform Migration Additions

- [ ] Rendering comparison — does the new platform render all content that the old one did?
- [ ] JavaScript rendering — if new platform is SPA/SSR, verify Googlebot can render content.
- [ ] URL parameter handling — new platform may handle parameters differently.
- [ ] Pagination — new platform may paginate differently (verify rel=next/prev or lack thereof).
- [ ] CMS-generated meta tags — verify new CMS generates correct meta tags (some have bad defaults).
- [ ] Plugin/module SEO features — verify SEO functionality (sitemaps, meta tags, schema) works on new platform.

### URL Structure Change Additions

- [ ] Update ALL internal links to use new URL patterns (do not rely on redirects for internal links).
- [ ] Update navigation menus, footer links, breadcrumbs.
- [ ] Update CMS settings for permalink/URL patterns.
- [ ] Update any hardcoded URLs in content (blog posts linking to other blog posts).

### Domain Consolidation Additions

- [ ] Choose the primary domain (usually the one with the most authority/backlinks).
- [ ] Map content from all secondary domains to the primary domain.
- [ ] Handle content duplication — if the same content exists on multiple domains, decide which version to keep.
- [ ] 301 redirect all secondary domain URLs to their equivalents on the primary domain.
- [ ] Maintain all secondary domains and their redirects for 2+ years.
- [ ] Expect a longer recovery period (3-6 months) due to consolidation of authority signals.

---

## Cross-References

- **Redirect mapping template:** `36-seo/migration/url-redirect-mapping.template.md`
- **Traffic drop diagnosis:** `36-seo/incident/traffic-drop-diagnosis.md`
- **Incident response:** `36-seo/incident/seo-incident-response.md`
- **Monthly audit:** `36-seo/audit/monthly-audit-checklist.md`
