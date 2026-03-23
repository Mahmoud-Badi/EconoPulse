# Technical SEO Checklist

Master quick-reference for {{PROJECT_NAME}}. Each section links to its deep-dive file. Use this as your audit starting point — drill into the linked guides when you need implementation detail.

---

## How to Use This Checklist

Run through every section. Mark each item pass/fail. Any fail requires remediation before launch (or before the next audit cycle). Items marked with a star are launch-blockers.

---

## 1. Crawlability & Indexation

> Deep dive: [crawlability-indexation.md](crawlability-indexation.md)

- [ ] Google Search Console verified and monitored weekly
- [ ] Index Coverage report shows zero unexpected errors
- [ ] No critical pages stuck in "Crawled — currently not indexed"
- [ ] Orphan pages identified and linked or removed
- [ ] Crawl budget not wasted on low-value URLs (filters, sorts, session IDs)
- [ ] URL parameter handling configured in GSC where applicable
- [ ] IndexNow implemented for content that changes frequently
- [ ] JavaScript-rendered content confirmed visible in Google's URL Inspection tool

---

## 2. Core Web Vitals

> Deep dive: [core-web-vitals-playbook.md](core-web-vitals-playbook.md)

- [ ] **LCP** < 2.5s on 75th percentile (field data) ★
- [ ] **INP** < 200ms on 75th percentile (field data) ★
- [ ] **CLS** < 0.1 on 75th percentile (field data) ★
- [ ] Performance budget defined and enforced in CI
- [ ] Hero image preloaded; critical fonts preloaded
- [ ] No layout shifts from ads, embeds, or lazy-loaded content
- [ ] Web-vitals.js reporting to analytics (or CrUX API monitored)

---

## 3. Structured Data

> Deep dive: [structured-data-cookbook.md](structured-data-cookbook.md)

- [ ] Organization schema on homepage
- [ ] BreadcrumbList schema on all interior pages
- [ ] Product / Article / FAQ / HowTo schemas where applicable
- [ ] All structured data passes Google Rich Results Test
- [ ] No warnings in GSC Enhancements reports
- [ ] JSON-LD injection tested in CI (schema validates against schema.org)

---

## 4. Rendering & JavaScript SEO

> Deep dive: [rendering-seo.md](rendering-seo.md)

- [ ] Every indexable page uses SSR or SSG (not client-only rendering)
- [ ] View-source test confirms content is in the HTML (not injected by JS)
- [ ] URL Inspection in GSC shows fully rendered content
- [ ] Dynamic OG images generating correctly
- [ ] Meta tags render server-side (not hydrated client-side)
- [ ] No hydration mismatches causing content flicker

---

## 5. Site Architecture

> Deep dive: [site-architecture-for-seo.md](site-architecture-for-seo.md)

- [ ] URL hierarchy is logical and shallow (max 3-4 levels)
- [ ] Every page reachable within 3 clicks from homepage
- [ ] Breadcrumbs implemented (HTML + structured data)
- [ ] Faceted navigation does not create duplicate/thin pages
- [ ] Pagination handled without orphaning content
- [ ] Internal linking connects related content clusters

---

## 6. Robots, Sitemaps & Canonicals

> Deep dive: [robots-sitemap-canonical.md](robots-sitemap-canonical.md)

- [ ] robots.txt serves correctly at {{BASE_URL}}/robots.txt
- [ ] robots.txt does not accidentally block CSS/JS/images needed for rendering
- [ ] AI bot directives set per project policy (GPTBot, Google-Extended, CCBot)
- [ ] XML sitemap at {{BASE_URL}}/sitemap.xml — submitted to GSC and Bing
- [ ] Sitemap contains only 200-status, canonical, indexable URLs
- [ ] Sitemap updated automatically on content publish
- [ ] Every indexable page has a self-referencing canonical tag ★
- [ ] Cross-domain canonicals correct where applicable
- [ ] No canonical conflicts between sitemap URLs and on-page canonicals

---

## 7. Meta Tags

Meta tags are straightforward enough to keep inline. No separate deep-dive needed.

### Title Tags

- [ ] Every page has a unique `<title>` ★
- [ ] Format: `{{PRIMARY_KEYWORD}} | {{PROJECT_NAME}}`
- [ ] Length: 50-60 characters (Google truncates at ~60)
- [ ] Homepage: `{{PROJECT_NAME}} — {{TAGLINE}}`
- [ ] No duplicate titles across the site

### Meta Descriptions

- [ ] Every page has a unique `<meta name="description">` ★
- [ ] Length: 150-160 characters
- [ ] Contains primary keyword naturally
- [ ] Includes a call to action or value proposition
- [ ] No duplicate descriptions across the site

### Open Graph & Twitter Cards

- [ ] `og:title`, `og:description`, `og:image`, `og:url` on every page
- [ ] `og:image` is 1200x630px minimum
- [ ] `twitter:card` set to `summary_large_image`
- [ ] Social sharing preview tested (Facebook Debugger, Twitter Card Validator)
- [ ] Dynamic OG images for blog posts and product pages

### Robots Meta

- [ ] Pages that should not be indexed use `<meta name="robots" content="noindex, nofollow">`
- [ ] Authenticated pages (dashboard, settings) are noindexed
- [ ] Staging/preview environments are noindexed
- [ ] No accidental `noindex` on production pages ★

---

## 8. HTTPS & Security

- [ ] Entire site served over HTTPS ★
- [ ] HTTP → HTTPS redirect is 301 (not 302)
- [ ] No mixed content warnings (all resources loaded over HTTPS)
- [ ] HSTS header present: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- [ ] SSL certificate valid and not expiring within 30 days
- [ ] Security headers set: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`

---

## 9. Mobile Optimization

- [ ] Viewport meta tag present: `<meta name="viewport" content="width=device-width, initial-scale=1">` ★
- [ ] Mobile-friendly test passes in GSC
- [ ] No horizontal scroll on any page at 375px width
- [ ] Tap targets are at least 48x48px with adequate spacing
- [ ] Font size minimum 16px for body text (prevents iOS zoom on focus)
- [ ] No interstitials or popups that block content on mobile
- [ ] Mobile page speed meets CWV thresholds (test on real 4G, not Wi-Fi)

---

## Audit Schedule

| Audit Type | Frequency | Owner |
|---|---|---|
| Full technical audit (all sections) | Quarterly | {{SEO_LEAD}} |
| CWV monitoring | Weekly | {{ENGINEERING_LEAD}} |
| Index Coverage review | Weekly | {{SEO_LEAD}} |
| Structured data validation | After each deploy | CI pipeline |
| Broken link scan | Monthly | Automated (Screaming Frog or similar) |
| robots.txt / sitemap review | After each deploy | CI pipeline |
| Security header check | Monthly | {{SECURITY_LEAD}} |

---

## Cross-References

- Performance testing: `08-quality-testing/performance-budget/`
- Deployment checks: `09-deployment-operations/`
- Content SEO: `36-seo/content-seo/`
- SEO measurement: `36-seo/measurement/`
- SEO audit procedures: `36-seo/audit/`
