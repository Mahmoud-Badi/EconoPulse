# Technical SEO Checklist

> **MOVED:** This file's content has been decomposed and significantly expanded across 7 dedicated files in the SEO section.
>
> **New locations:**
> - `36-seo/technical/technical-seo-checklist.md` — Streamlined master checklist
> - `36-seo/technical/crawlability-indexation.md` — Crawl budget, index coverage, orphan pages
> - `36-seo/technical/core-web-vitals-playbook.md` — LCP/INP/CLS optimization
> - `36-seo/technical/structured-data-cookbook.md` — JSON-LD templates for 15+ schema types
> - `36-seo/technical/rendering-seo.md` — SSR/SSG/CSR/ISR implications
> - `36-seo/technical/site-architecture-for-seo.md` — URL hierarchy, faceted nav, pagination
> - `36-seo/technical/robots-sitemap-canonical.md` — robots.txt, sitemaps, canonical strategy
>
> Start with `36-seo/README.md` for the full reading order.

---

## Table of Contents

1. [Site Structure](#site-structure)
2. [Performance & Core Web Vitals](#performance--core-web-vitals)
3. [Meta Tags](#meta-tags)
4. [Structured Data (Schema Markup)](#structured-data-schema-markup)
5. [XML Sitemap](#xml-sitemap)
6. [Robots.txt](#robotstxt)
7. [HTTPS & Security](#https--security)
8. [Mobile Optimization](#mobile-optimization)
9. [Indexation & Crawling](#indexation--crawling)
10. [Page Speed Optimization](#page-speed-optimization)
11. [JavaScript & Rendering](#javascript--rendering)
12. [International SEO](#international-seo)
13. [Tools & Resources](#tools--resources)
14. [Monthly Audit Schedule](#monthly-audit-schedule)

---

## Site Structure

### URL Structure

Good URL structure helps search engines and humans understand your site hierarchy.

**Rules:**
- [ ] URLs are descriptive and readable (`/blog/deployment-best-practices` not `/blog/post?id=47`)
- [ ] URLs use hyphens between words (not underscores: `/best-practices` not `/best_practices`)
- [ ] URLs are lowercase (avoid mixed case — URLs are case-sensitive on some servers)
- [ ] URLs are short (3-5 words after the domain)
- [ ] URLs do not contain unnecessary parameters, session IDs, or tracking codes
- [ ] URLs follow a logical hierarchy (`/blog/category/post-title`)
- [ ] URL changes are handled with 301 redirects (never leave broken URLs)

**URL Structure Template:**
```
Homepage:        example.com
Product page:    example.com/features
Pricing page:    example.com/pricing
Blog index:      example.com/blog
Blog post:       example.com/blog/post-slug
Documentation:   example.com/docs
Docs section:    example.com/docs/getting-started
Comparison:      example.com/compare/product-vs-competitor
```

### Site Hierarchy

Organize your site in a clear, shallow hierarchy:

```
Homepage (Level 0)
├── Product (Level 1)
│   ├── Features (Level 2)
│   ├── Integrations (Level 2)
│   └── Security (Level 2)
├── Pricing (Level 1)
├── Blog (Level 1)
│   ├── Post 1 (Level 2)
│   ├── Post 2 (Level 2)
│   └── Post 3 (Level 2)
├── Docs (Level 1)
│   ├── Getting Started (Level 2)
│   ├── API Reference (Level 2)
│   └── Guides (Level 2)
├── About (Level 1)
└── Contact (Level 1)
```

**Rule**: Every important page should be reachable within 3 clicks from the homepage.

### Breadcrumbs

- [ ] Breadcrumb navigation is present on all sub-pages
- [ ] Breadcrumbs reflect the site hierarchy accurately
- [ ] Breadcrumb structured data (BreadcrumbList schema) is implemented
- [ ] Breadcrumbs are visible but not visually dominant

**Example:**
```
Home > Blog > Deployment Best Practices
Home > Docs > Getting Started > Installation
```

### Internal Linking

Internal links distribute "link equity" across your site and help search engines discover and understand page relationships.

- [ ] Every page links to at least 2-3 related pages on your site
- [ ] Anchor text is descriptive (not "click here" — use "deployment best practices guide")
- [ ] Your most important pages receive the most internal links
- [ ] Blog posts link to related blog posts and relevant product pages
- [ ] Product pages link to supporting content (docs, case studies, blog posts)
- [ ] Navigation includes links to your highest-priority pages
- [ ] No orphan pages (pages with zero internal links pointing to them)
- [ ] Internal links open in the same tab (not new tab — that is for external links)

**Internal linking strategy:**
- When publishing a new post, find 3-5 existing posts that could link to it. Add links.
- When publishing a new post, include 3-5 links TO existing relevant content.
- Review top pages monthly — ensure they link to newer related content.

---

## Performance & Core Web Vitals

### What Are Core Web Vitals?

Core Web Vitals are Google's metrics for measuring user experience. They directly impact search rankings.

| Metric | What It Measures | Good | Needs Work | Poor |
|--------|-----------------|------|------------|------|
| **LCP** (Largest Contentful Paint) | How quickly the main content loads | ≤ 2.5s | 2.5-4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | How quickly the page responds to user input | ≤ 200ms | 200-500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | How much the page layout shifts during loading | ≤ 0.1 | 0.1-0.25 | > 0.25 |

### LCP Optimization

The Largest Contentful Paint is usually the hero image, headline text, or a video poster image.

- [ ] Optimize the largest element above the fold (compress hero image, preload it)
- [ ] Use `<link rel="preload">` for the hero image
- [ ] Serve images in WebP or AVIF format
- [ ] Set explicit `width` and `height` attributes on images
- [ ] Use a CDN for static assets
- [ ] Eliminate render-blocking CSS and JavaScript
- [ ] Optimize server response time (TTFB under 200ms)
- [ ] Implement critical CSS inlining (inline above-fold styles)
- [ ] Use `fetchpriority="high"` on the hero image

### INP Optimization

INP measures the delay between a user interaction (click, tap, key press) and the visual response.

- [ ] Minimize main thread blocking (break up long JavaScript tasks)
- [ ] Defer non-critical JavaScript
- [ ] Use `requestIdleCallback` for low-priority work
- [ ] Minimize third-party script impact (analytics, chat widgets, tracking)
- [ ] Use web workers for heavy computation
- [ ] Optimize event handlers (avoid heavy work in click/scroll handlers)

### CLS Optimization

Layout shift happens when elements move unexpectedly during loading.

- [ ] Set explicit `width` and `height` on all images and videos
- [ ] Reserve space for ads, embeds, and iframes with aspect-ratio or explicit dimensions
- [ ] Do not inject content above existing content during load
- [ ] Use `font-display: swap` for web fonts (and preload critical fonts)
- [ ] Avoid dynamically resizing elements after the page loads
- [ ] Use CSS `contain` property where appropriate

### Performance Checklist

- [ ] **Google PageSpeed Insights score**: 90+ on desktop, 70+ on mobile
- [ ] **LCP**: Under 2.5 seconds
- [ ] **INP**: Under 200ms
- [ ] **CLS**: Under 0.1
- [ ] **TTFB**: Under 200ms
- [ ] **Total page size**: Under 3MB (ideally under 1MB)
- [ ] **HTTP requests**: Under 50 per page
- [ ] **JavaScript bundle size**: Under 200KB (compressed)

---

## Meta Tags

### Title Tags

- [ ] Every page has a unique title tag
- [ ] Title tags are under 60 characters
- [ ] Title tags include the primary keyword (near the beginning)
- [ ] Title tags are compelling (encourage clicks, not just keyword-stuffed)
- [ ] Format: `Primary Keyword — Brand Name` or `Primary Keyword | Brand Name`
- [ ] Homepage title tag: `Brand Name — Value Proposition` or `Brand Name: Tagline`

### Meta Descriptions

- [ ] Every page has a unique meta description
- [ ] Meta descriptions are under 155 characters
- [ ] Meta descriptions include the primary keyword
- [ ] Meta descriptions include a call to action or value statement
- [ ] Meta descriptions accurately summarize the page content
- [ ] Meta descriptions are written for humans (not keyword-stuffed)

### Canonical URLs

- [ ] Every page has a `<link rel="canonical">` tag
- [ ] Canonical URLs point to the preferred version of the page
- [ ] HTTP pages canonicalize to HTTPS
- [ ] www and non-www versions canonicalize to one preferred version
- [ ] Paginated pages use proper canonical handling (or rel="next/prev")
- [ ] Cross-posted content (dev.to, Medium) has canonical URL pointing to original
- [ ] Canonical URLs are absolute (full URL, not relative paths)

**Implementation:**
```html
<link rel="canonical" href="https://example.com/blog/post-slug" />
```

### Open Graph Tags

Open Graph tags control how your pages appear when shared on social media.

- [ ] `og:title` — title for social sharing (can differ from title tag)
- [ ] `og:description` — description for social sharing
- [ ] `og:image` — image shown in social cards (1200x630px recommended)
- [ ] `og:url` — canonical URL
- [ ] `og:type` — "website" for homepage, "article" for blog posts
- [ ] `og:site_name` — your brand name

**Implementation:**
```html
<meta property="og:title" content="Post Title — Brand Name" />
<meta property="og:description" content="Brief description of the page." />
<meta property="og:image" content="https://example.com/images/og-image.png" />
<meta property="og:url" content="https://example.com/blog/post-slug" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Brand Name" />
```

### Twitter Card Tags

- [ ] `twitter:card` — "summary_large_image" (for posts with images) or "summary"
- [ ] `twitter:title` — title for Twitter sharing
- [ ] `twitter:description` — description for Twitter sharing
- [ ] `twitter:image` — image for Twitter card (same as og:image usually works)
- [ ] `twitter:site` — your Twitter handle (@handle)

**Implementation:**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Post Title" />
<meta name="twitter:description" content="Brief description." />
<meta name="twitter:image" content="https://example.com/images/twitter-card.png" />
<meta name="twitter:site" content="@yourbrand" />
```

### Testing Social Tags

- **Facebook**: Use the [Sharing Debugger](https://developers.facebook.com/tools/debug/) to test og: tags
- **Twitter**: Use the [Card Validator](https://cards-dev.twitter.com/validator) to test twitter: tags
- **LinkedIn**: Use the [Post Inspector](https://www.linkedin.com/post-inspector/) to test how URLs render

---

## Structured Data (Schema Markup)

### What Is Structured Data?

Structured data is code (JSON-LD format recommended) added to your pages that helps search engines understand the content. It can enable rich results (star ratings, FAQ dropdowns, breadcrumbs, etc.) in search results.

### Priority Schema Types

| Schema Type | Use On | Rich Result |
|-------------|--------|-------------|
| **Organization** | Homepage | Knowledge panel, logo in results |
| **Product** | Product/pricing pages | Price, availability, reviews in results |
| **FAQ** | FAQ pages, landing pages | Expandable FAQ in search results |
| **HowTo** | Tutorial/how-to pages | Step-by-step display in results |
| **BreadcrumbList** | All sub-pages | Breadcrumb trail in search results |
| **Article** | Blog posts | Article metadata in search results |
| **SoftwareApplication** | App landing pages | Ratings, pricing in results |
| **Review** | Review/comparison pages | Star ratings in results |

### Implementation Examples

#### Organization Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "Brief company description.",
  "sameAs": [
    "https://twitter.com/yourbrand",
    "https://linkedin.com/company/yourbrand",
    "https://github.com/yourbrand"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@example.com",
    "contactType": "customer support"
  }
}
```

#### FAQ Schema (Landing Page / FAQ Page)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your product?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our product is a deployment platform that..."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a free tier for small teams. Paid plans start at..."
      }
    }
  ]
}
```

#### HowTo Schema (Tutorial Blog Post)
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Set Up Automated Deployments",
  "description": "A step-by-step guide to setting up automated deployments.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Connect your repository",
      "text": "Link your GitHub repository to the platform."
    },
    {
      "@type": "HowToStep",
      "name": "Configure your pipeline",
      "text": "Set up build and deploy steps in the configuration file."
    },
    {
      "@type": "HowToStep",
      "name": "Deploy",
      "text": "Push to main to trigger an automatic deployment."
    }
  ]
}
```

#### BreadcrumbList Schema (All Sub-Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "Post Title", "item": "https://example.com/blog/post-slug" }
  ]
}
```

### Structured Data Checklist

- [ ] JSON-LD format (preferred over Microdata or RDFa)
- [ ] Placed in the `<head>` section or within the `<body>` of the page
- [ ] Validated with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] No errors or warnings in validation
- [ ] Structured data matches visible page content (do not include hidden data)
- [ ] Updated when page content changes

---

## XML Sitemap

### What Is an XML Sitemap?

An XML sitemap lists all the pages on your site that you want search engines to index. It helps search engines discover your content and understand your site structure.

### Sitemap Requirements

- [ ] Sitemap exists at `example.com/sitemap.xml`
- [ ] Sitemap includes all important pages (not just the homepage)
- [ ] Sitemap excludes pages you do NOT want indexed (admin, login, duplicate pages)
- [ ] Sitemap includes `<lastmod>` dates (tells Google when pages were updated)
- [ ] Sitemap is under 50MB and contains fewer than 50,000 URLs (use sitemap index for larger sites)
- [ ] Sitemap is referenced in `robots.txt`
- [ ] Sitemap is submitted to Google Search Console
- [ ] Sitemap is submitted to Bing Webmaster Tools
- [ ] Sitemap updates automatically when new pages are published
- [ ] Sitemap does not include non-200 status pages (no 404s, no redirects)

### Sitemap Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-02-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/blog/post-slug</loc>
    <lastmod>2026-02-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Sitemap Generation

| Framework | Sitemap Solution |
|-----------|-----------------|
| **Next.js** | `next-sitemap` package or App Router `sitemap.ts` |
| **Gatsby** | `gatsby-plugin-sitemap` |
| **WordPress** | Yoast SEO (built-in) |
| **Hugo** | Built-in sitemap template |
| **Custom** | Generate programmatically from page routes |

---

## Robots.txt

### What Is Robots.txt?

The `robots.txt` file tells search engine crawlers which pages they are allowed (or not allowed) to crawl. It does NOT prevent indexation — it prevents crawling.

### Robots.txt Template

```
# robots.txt for example.com

User-agent: *
Allow: /

# Block admin and internal pages
Disallow: /admin/
Disallow: /login/
Disallow: /dashboard/
Disallow: /api/
Disallow: /internal/

# Block search results and filtered pages
Disallow: /search?
Disallow: /*?sort=
Disallow: /*?filter=

# Block staging and preview pages
Disallow: /preview/
Disallow: /draft/

# Reference sitemap
Sitemap: https://example.com/sitemap.xml
```

### Robots.txt Checklist

- [ ] File exists at `example.com/robots.txt`
- [ ] Does NOT block important pages (homepage, product pages, blog posts)
- [ ] Blocks admin, login, and internal pages
- [ ] Blocks API endpoints from crawling
- [ ] Blocks search result pages and filtered URLs
- [ ] References the sitemap URL
- [ ] Does NOT use `Disallow: /` (this blocks the entire site)
- [ ] Tested with Google's robots.txt tester in Search Console

### Common Robots.txt Mistakes

| Mistake | Consequence |
|---------|-------------|
| `Disallow: /` for all user-agents | Blocks entire site from search engines |
| Blocking CSS/JS files | Google cannot render the page properly |
| Not including sitemap reference | Search engines may miss pages |
| Blocking `/blog/` accidentally | Blog content disappears from search |
| Forgetting to update after site restructure | Old disallow patterns may block new pages |

---

## HTTPS & Security

### HTTPS Checklist

- [ ] SSL/TLS certificate is installed and valid
- [ ] All pages are served over HTTPS (no HTTP pages)
- [ ] HTTP URLs redirect to HTTPS (301 redirect)
- [ ] No mixed content (HTTP resources loaded on HTTPS pages)
- [ ] HSTS header is set (`Strict-Transport-Security: max-age=31536000; includeSubDomains`)
- [ ] Certificate is not expired (set up renewal reminders)
- [ ] Certificate covers all subdomains (wildcard or individual certs)
- [ ] SSL Labs test grade: A or A+ (test at ssllabs.com/ssltest)

### Security Headers

- [ ] `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing
- [ ] `X-Frame-Options: DENY` or `SAMEORIGIN` — prevents clickjacking
- [ ] `Content-Security-Policy` — controls which resources can load
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` — controls referrer info
- [ ] `Permissions-Policy` — controls browser feature access

---

## Mobile Optimization

### Mobile-First Indexing

Google primarily uses the mobile version of your site for indexing and ranking. If your mobile experience is poor, your rankings suffer — even for desktop searches.

### Mobile SEO Checklist

- [ ] Responsive design (same URL serves both desktop and mobile)
- [ ] Viewport meta tag is set: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] Text is readable without zooming (minimum 16px body text)
- [ ] Tap targets are at least 48x48px with 8px spacing
- [ ] No horizontal scrolling on any page
- [ ] Images are responsive (use `srcset` and `sizes`)
- [ ] Page loads in under 5 seconds on 3G mobile network
- [ ] No intrusive interstitials (full-screen pop-ups on mobile — Google penalizes these)
- [ ] Same content is available on mobile and desktop (mobile-first indexing requires content parity)
- [ ] Hamburger menu is functional and includes all key navigation items
- [ ] Forms are usable on mobile (appropriate input types, large fields)
- [ ] Test on real devices (not just browser DevTools)

### Testing Mobile

| Tool | What It Tests |
|------|--------------|
| **Google Mobile-Friendly Test** | Basic mobile compatibility |
| **Chrome DevTools Device Mode** | Visual layout on different screen sizes |
| **BrowserStack** | Real device testing across many devices (paid) |
| **Lighthouse (Mobile)** | Performance, accessibility, SEO on mobile |

---

## Indexation & Crawling

### Google Search Console Setup

- [ ] Verify your domain in Google Search Console (DNS, HTML file, meta tag, or GA)
- [ ] Submit your XML sitemap
- [ ] Review the Index Coverage report
- [ ] Check for crawl errors (404s, 500s, redirects)
- [ ] Review the URL Inspection tool for key pages

### Index Coverage Issues

| Issue | What It Means | Fix |
|-------|--------------|-----|
| **Submitted and indexed** | Page is in Google's index | No action needed |
| **Crawled but not indexed** | Google found the page but chose not to index it | Improve content quality, add internal links, submit for indexing |
| **Excluded by robots.txt** | Your robots.txt is blocking the page | Update robots.txt to allow the page |
| **Page with redirect** | Page redirects to another URL | Expected if intentional; fix if unintentional |
| **Not found (404)** | Page returns a 404 error | Fix the URL, redirect, or remove internal links to it |
| **Duplicate without canonical** | Multiple pages with same content, no canonical set | Add canonical tag to the preferred version |
| **Soft 404** | Page returns 200 status but looks like a 404 to Google | Ensure empty/thin pages return proper 404 status or add content |

### Fixing Index Issues

1. **Crawled but not indexed**: This is the most common frustration. Possible fixes:
   - Improve the page content (more depth, more value)
   - Add more internal links pointing to the page
   - Earn external backlinks to the page
   - Submit for indexing via URL Inspection tool (may take weeks)
   - Ensure the page is in the sitemap

2. **Duplicate content**: Multiple URLs serving the same content
   - Set canonical tags on all duplicate pages pointing to the preferred version
   - Use 301 redirects to consolidate duplicate URLs
   - Parameter handling: Configure URL parameters in Search Console

3. **404 errors**: Pages that no longer exist
   - Redirect to the most relevant existing page (301)
   - If no relevant page exists, return a proper 404 with a helpful error page
   - Remove internal links to 404 pages

---

## Page Speed Optimization

### Image Optimization

| Technique | Impact | Implementation |
|-----------|--------|---------------|
| **WebP/AVIF format** | 25-50% smaller than JPEG/PNG | Use `<picture>` element with fallbacks |
| **Compression** | Significant size reduction | Use Squoosh, TinyPNG, or ImageOptim |
| **Lazy loading** | Faster initial load | Add `loading="lazy"` to below-fold images |
| **Responsive images** | Right size for right device | Use `srcset` and `sizes` attributes |
| **Explicit dimensions** | Prevents layout shift | Always set `width` and `height` |
| **CDN delivery** | Faster global delivery | Serve images from CDN (Cloudflare, CloudFront) |

### Code Optimization

- [ ] **JavaScript**: Minified, tree-shaken, code-split by route
- [ ] **CSS**: Minified, purged of unused rules, critical CSS inlined
- [ ] **HTML**: Minified, no unnecessary whitespace
- [ ] **Third-party scripts**: Loaded asynchronously, deferred where possible
- [ ] **Fonts**: Subsetted, preloaded, using `font-display: swap`
- [ ] **Compression**: Brotli (preferred) or gzip enabled on the server

### Server Optimization

- [ ] **CDN**: Static assets served from a CDN
- [ ] **Caching**: Aggressive cache headers for static assets (1 year), short for HTML
- [ ] **HTTP/2 or HTTP/3**: Enabled for multiplexed requests
- [ ] **TTFB**: Under 200ms (optimize server, use edge functions if needed)
- [ ] **Preconnect**: `<link rel="preconnect">` for critical third-party origins
- [ ] **DNS prefetch**: `<link rel="dns-prefetch">` for non-critical third-party origins

---

## JavaScript & Rendering

### SEO Implications of Client-Side Rendering

Search engines can render JavaScript, but it is slower and less reliable than server-rendered HTML.

| Rendering Method | SEO Impact | Recommendation |
|-----------------|------------|----------------|
| **SSR (Server-Side Rendering)** | Best for SEO — content is in the HTML | Preferred for all SEO-critical pages |
| **SSG (Static Site Generation)** | Excellent for SEO — pre-built HTML | Best for content that does not change frequently |
| **CSR (Client-Side Rendering)** | Risky for SEO — Google may not render all content | Avoid for SEO-critical pages |
| **ISR (Incremental Static Regeneration)** | Great for SEO — hybrid of SSG and SSR | Good for dynamic content that changes periodically |

### JavaScript SEO Checklist

- [ ] Critical content is in the initial HTML response (not only loaded via JavaScript)
- [ ] Meta tags (title, description, canonical, OG tags) are in the HTML `<head>` at load time
- [ ] Internal links use standard `<a href>` tags (not JavaScript-only navigation)
- [ ] Structured data is in the HTML (not dynamically injected)
- [ ] `View Source` shows meaningful content (not just an empty div + JavaScript bundle)
- [ ] Lazy-loaded content uses proper techniques that Google can discover (IntersectionObserver)
- [ ] Test with Google's URL Inspection tool (renders the page as Google sees it)

### Dynamic Rendering (Fallback)

If you must use CSR, consider dynamic rendering as a fallback:
- Detect search engine bots (via user-agent)
- Serve pre-rendered HTML to bots
- Serve the standard client-rendered version to users
- Tools: Rendertron, Prerender.io, Puppeteer

**Note**: Google has said dynamic rendering is a workaround, not a long-term solution. SSR/SSG is preferred.

---

## International SEO

### When International SEO Matters

If your site serves users in multiple languages or targets specific countries.

### Hreflang Tags

Hreflang tells Google which language/region version of a page to show to different users.

```html
<link rel="alternate" hreflang="en" href="https://example.com/page" />
<link rel="alternate" hreflang="es" href="https://example.com/es/page" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/page" />
```

### International SEO Checklist

- [ ] Hreflang tags implemented on all pages with language variants
- [ ] `x-default` hreflang tag points to the default/English version
- [ ] Hreflang tags are reciprocal (if A points to B, B must point to A)
- [ ] URL structure is clear: subdirectory (`/es/`), subdomain (`es.example.com`), or ccTLD (`.es`)
- [ ] Content is properly translated (not machine-translated without review)
- [ ] Geo-targeting is configured in Google Search Console (if using subdirectories)
- [ ] Currency and local formatting is correct for each market

---

## Tools & Resources

### Essential Free Tools

| Tool | Purpose | URL |
|------|---------|-----|
| **Google Search Console** | Index coverage, search performance, crawl errors | search.google.com/search-console |
| **Google PageSpeed Insights** | Core Web Vitals, performance scoring | pagespeed.web.dev |
| **Google Lighthouse** | Comprehensive audit (performance, accessibility, SEO) | Chrome DevTools |
| **Google Rich Results Test** | Test structured data | search.google.com/test/rich-results |
| **Google Mobile-Friendly Test** | Mobile compatibility | search.google.com/test/mobile-friendly |
| **Bing Webmaster Tools** | Bing index management | bing.com/webmasters |
| **Microsoft Clarity** | Heatmaps, session recordings | clarity.microsoft.com |
| **Screaming Frog (Free)** | Crawl up to 500 URLs, find SEO issues | screamingfrog.co.uk |
| **Check My Links** | Chrome extension — find broken links | Chrome Web Store |
| **WAVE** | Accessibility checker | wave.webaim.org |

### Paid Tools (When Budget Allows)

| Tool | Purpose | Starting Price |
|------|---------|---------------|
| **Ahrefs** | Backlinks, keywords, site audit, rank tracking | $99/mo |
| **SEMrush** | Keywords, competitive analysis, site audit, content tools | $130/mo |
| **Screaming Frog (Paid)** | Full site crawl with no URL limit | $259/year |
| **Sitebulb** | Visual technical SEO auditing | $35/mo |

---

## Monthly Audit Schedule

### Weekly Quick Checks (5 minutes)

- [ ] Check Google Search Console for new crawl errors
- [ ] Review any new manual actions or security issues
- [ ] Verify sitemap is up to date with recently published pages
- [ ] Check uptime (any downtime affects SEO)

### Monthly Audit (1-2 hours)

#### Performance
- [ ] Run PageSpeed Insights on 5 key pages (homepage, pricing, top blog posts)
- [ ] Check Core Web Vitals in Search Console (Experience report)
- [ ] Verify no new performance regressions

#### Indexation
- [ ] Review Index Coverage report in Search Console
- [ ] Check for new "Excluded" pages (investigate if unexpected)
- [ ] Verify new content is indexed (URL Inspection tool)
- [ ] Check for crawl budget waste (unnecessary pages being crawled)

#### Content
- [ ] Verify no duplicate title tags or meta descriptions
- [ ] Check for thin content pages (under 300 words with no real value)
- [ ] Review 404 pages and set up redirects where needed
- [ ] Verify canonical tags are correct on key pages

#### Links
- [ ] Check for broken internal links (Screaming Frog or Check My Links)
- [ ] Review new backlinks in Search Console
- [ ] Verify redirect chains are not excessive (no more than 2 hops)

#### Mobile
- [ ] Test 3-5 key pages on a real mobile device
- [ ] Verify no mobile usability issues in Search Console

#### Structured Data
- [ ] Test structured data on key pages (Rich Results Test)
- [ ] Verify no new structured data errors

### Quarterly Deep Audit (half day)

Everything in the monthly audit, plus:

- [ ] Full site crawl with Screaming Frog (check all URLs)
- [ ] Review and update robots.txt
- [ ] Review and update XML sitemap
- [ ] Audit redirect chains (consolidate if needed)
- [ ] Review page speed trends (are pages getting slower?)
- [ ] Audit structured data across all page types
- [ ] Review international SEO tags (if applicable)
- [ ] Check SSL certificate expiration date
- [ ] Review security headers
- [ ] Benchmark against competitors (keyword positions, content gaps)
- [ ] Update content-keyword mapping based on Search Console data
- [ ] Identify content refresh opportunities (posts losing rankings)

### Priority Matrix for Audit Findings

| Priority | Issue Type | Action |
|----------|-----------|--------|
| **Critical** (fix today) | Site down, pages blocked by robots.txt, SSL expired, manual action | Drop everything and fix |
| **High** (fix this week) | Broken important pages, missing title tags on key pages, Core Web Vitals failing | Schedule immediate fix |
| **Medium** (fix this month) | Duplicate content, thin pages, missing structured data | Add to sprint backlog |
| **Low** (fix when convenient) | Minor CLS issues, suboptimal meta descriptions, image alt text gaps | Queue for next content update |
