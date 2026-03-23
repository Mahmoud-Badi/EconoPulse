# Crawlability & Indexation

How search engines discover, crawl, and index {{PROJECT_NAME}}. If Google cannot crawl a page, it does not exist. If Google crawls it but does not index it, it might as well not exist. This guide covers both problems.

---

## Crawl Budget: What It Is and Why It Matters

Crawl budget is the number of URLs Googlebot will crawl on your site within a given timeframe. It is determined by two factors:

1. **Crawl capacity limit** — how fast Googlebot can crawl without degrading your server performance
2. **Crawl demand** — how much Google wants to crawl based on perceived importance and staleness

### When Crawl Budget Matters

- Sites with 10,000+ URLs
- Sites that generate URLs dynamically (filters, sorts, faceted navigation)
- Sites with slow server response times (TTFB > 500ms)
- Sites with large portions of low-quality or duplicate content

### When It Does Not Matter

- Sites under 1,000 URLs with fast servers — Google will crawl everything regardless

### Crawl Budget Optimization Checklist

- [ ] Remove or noindex low-value pages (empty tag pages, thin filter combinations)
- [ ] Return proper 404/410 for deleted pages (do not soft-404)
- [ ] Reduce redirect chains to one hop maximum
- [ ] Fix server errors (5xx) — these waste crawl budget and signal instability
- [ ] Block crawling of non-content URLs via robots.txt (search results, session URLs, print versions)
- [ ] Keep server TTFB under 200ms for HTML documents
- [ ] Use sitemap to signal which URLs matter most (include only canonical, 200-status URLs)
- [ ] Implement pagination properly so Googlebot can discover deep content
- [ ] Consolidate duplicate content with canonical tags (do not rely on crawl budget to fix duplication)

---

## Crawl Frequency Optimization

Google re-crawls pages at different rates based on:

- **Update frequency** — pages that change often get crawled more often
- **Importance signals** — pages with more internal/external links get priority
- **Sitemap lastmod** — if accurate, helps Google prioritize re-crawls

### How to Increase Crawl Frequency

1. **Keep lastmod accurate** — only update it when content actually changes. Fake lastmod destroys trust.
2. **Implement IndexNow** — instant notification to search engines on publish (see section below)
3. **Internal link to new/updated content** — link from high-authority pages
4. **Publish consistently** — sites with regular publishing schedules get crawled more frequently
5. **Reduce server response time** — faster responses mean more pages crawled per session

### How to Decrease Crawl Frequency (for stable pages)

- Set `Cache-Control` headers with long max-age for truly static content
- Do not update lastmod on unchanged pages
- Use `Crawl-Delay` in robots.txt (respected by Bing; ignored by Google)

---

## Google Search Console Index Coverage Report

The Index Coverage report is the single most important diagnostic tool for indexation issues. Every status explained:

### Valid (Indexed)

| Status | Meaning | Action |
|---|---|---|
| Submitted and indexed | URL was in your sitemap and Google indexed it | None — this is the goal |
| Indexed, not submitted in sitemap | Google found and indexed it, but it is not in your sitemap | Add to sitemap if it should be indexed; noindex if it should not |

### Valid with Warnings

| Status | Meaning | Action |
|---|---|---|
| Indexed, though blocked by robots.txt | Google indexed despite robots.txt block (because other pages link to it) | Either remove robots.txt block or add noindex meta tag. robots.txt alone does not prevent indexing. |

### Excluded (Not Indexed)

| Status | Meaning | Action |
|---|---|---|
| **Crawled — currently not indexed** | Google crawled but chose not to index. The #1 frustration. | See diagnosis section below |
| **Discovered — currently not indexed** | Google knows the URL exists but has not crawled it yet | Usually a crawl budget issue. Improve internal linking, add to sitemap. |
| Excluded by noindex tag | You told Google not to index it | Correct if intentional. If not, remove the noindex tag. |
| Blocked by robots.txt | robots.txt prevents crawling | Correct if intentional. Remember: blocking crawl does not prevent indexing. |
| Alternate page with proper canonical tag | This URL has a canonical pointing elsewhere | Correct behavior. The canonical URL should be indexed instead. |
| Duplicate without user-selected canonical | Google detected a duplicate and chose one version | Set explicit canonical tags to control which version gets indexed |
| Duplicate, submitted URL not selected as canonical | Your sitemap says this is canonical but Google disagrees | Check for conflicting signals: canonical tag, internal links, content similarity |
| Not found (404) | Page returns 404 | If intentional, no action. If not, fix or redirect. |
| Soft 404 | Page returns 200 but Google thinks it is a 404 (empty/thin content) | Add real content or return a proper 404 |
| Redirect | URL is a redirect | Correct if intentional. Update internal links to point to the final URL. |
| Blocked due to unauthorized request (401) | Page requires authentication | Correct for auth-gated content. If this page should be public, fix auth. |
| Server error (5xx) | Server returned an error during crawl | Fix server issues. Monitor server logs during Googlebot crawls. |
| Blocked due to other 4xx issue | Client error other than 401/404 | Check server logs for the specific error code |
| Page with redirect | URL redirects | Update sitemap and internal links to use the final URL |

---

## "Crawled — Currently Not Indexed" Diagnosis

This is the most common and most frustrating indexation status. Google crawled the page but decided not to add it to the index. Systematic diagnosis:

### Step 1: Content Quality Assessment

- [ ] Is the page thin (under 300 words of unique content)?
- [ ] Is the content substantially similar to another page on your site or the web?
- [ ] Does the page provide unique value that other indexed pages do not?
- [ ] Is the content auto-generated or templated with minimal customization?

**Fix:** Add substantial, unique content. Merge thin pages. Remove or noindex pages that add no value.

### Step 2: Technical Signal Assessment

- [ ] Does the page have a canonical tag pointing elsewhere?
- [ ] Does the page have a noindex tag (check both HTML and HTTP header)?
- [ ] Is the page linked from the sitemap?
- [ ] Is the page linked from at least one other indexed page?
- [ ] Is the page more than 3 clicks from the homepage?
- [ ] Does the page load in under 3 seconds?
- [ ] Does the page render correctly without JavaScript?

**Fix:** Remove conflicting signals. Add internal links. Include in sitemap. Ensure server-side rendering.

### Step 3: Authority Assessment

- [ ] Does the page have any internal links pointing to it?
- [ ] Does the page have any external links?
- [ ] Is the parent section of the site well-established?

**Fix:** Build internal links from authoritative pages. Improve the content to attract natural external links.

### Step 4: Structural Assessment

- [ ] Is the URL clean and descriptive?
- [ ] Is the URL excessively deep (more than 4 path segments)?
- [ ] Are there URL parameters creating near-duplicate versions?

**Fix:** Flatten URL structure. Canonicalize parameter variations.

### Escalation Path

If the page passes all four assessments and still is not indexed after 4 weeks:
1. Request indexing via URL Inspection tool
2. Add a prominent internal link from a high-traffic page
3. Share the URL on social media to generate crawl signals
4. Wait another 2-4 weeks — sometimes Google is simply slow
5. If still not indexed, the page may not meet Google's quality threshold. Consider significant content upgrades.

---

## Orphan Page Detection and Rescue

An orphan page has no internal links pointing to it. Googlebot can only find it via sitemap or external links. Orphan pages are crawled less frequently and rank poorly.

### Detection Methods

1. **Cross-reference crawl data with sitemap**: Crawl your site with Screaming Frog or Sitebulb. Compare discovered URLs to sitemap URLs. Any sitemap URL not found during crawl is effectively orphaned.
2. **Log file analysis**: URLs that appear in crawl logs but not in internal link data are orphans.
3. **GSC Coverage report**: "Indexed, not submitted in sitemap" pages may be orphans that Google found through external links.

### Rescue Process

- [ ] For each orphan page, determine: should it exist?
- [ ] If yes: add internal links from relevant pages, ensure it is in the sitemap, add to breadcrumb navigation if appropriate
- [ ] If no: redirect to a relevant page (301) or return 410 (gone)
- [ ] After rescue, re-crawl to verify the page is now discovered through internal links

---

## URL Parameter Handling

URL parameters create crawl budget waste and duplicate content when they generate multiple URLs for the same content.

### Parameter Types

| Type | Example | SEO Impact | Solution |
|---|---|---|---|
| Sorting | `?sort=price-asc` | Duplicate content | Canonical to parameterless URL |
| Filtering | `?color=red&size=large` | Duplicate/thin content | Canonical, or noindex if thin |
| Pagination | `?page=2` | Valid unique content | Canonical to self, proper pagination |
| Tracking | `?utm_source=email` | Duplicate content | Canonical to parameterless URL |
| Session | `?sessionid=abc123` | Duplicate content | Block in robots.txt, canonical |

### Implementation Pattern

```html
<!-- On any page with parameters that don't change content -->
<link rel="canonical" href="{{BASE_URL}}/products" />
```

```
# robots.txt — block crawling of non-content parameters
User-agent: *
Disallow: /*?sessionid=
Disallow: /*?sort=
Disallow: /*?utm_
```

---

## JavaScript Rendering Queue Impact

When Googlebot encounters a JavaScript-rendered page:

1. **First wave** — Googlebot fetches the HTML and follows links found in the source
2. **Rendering queue** — the page enters a queue to be rendered with a headless Chrome instance
3. **Second wave** — after rendering, Googlebot can see JavaScript-generated content and links

The delay between first wave and rendering can be **seconds to days**. This means:

- Content that only exists after JavaScript execution may not be indexed promptly
- Links that only appear after JavaScript execution may not be discovered in the first crawl pass
- Critical content must be in the initial HTML response (SSR/SSG), not client-rendered

### Diagnosis

1. View page source (`view-source:{{BASE_URL}}/page`) — this is what Googlebot sees in wave 1
2. Use GSC URL Inspection → "Test Live URL" → view rendered HTML — this is what Googlebot sees after rendering
3. Compare the two. Any critical content missing from view-source is at risk.

---

## IndexNow Protocol

IndexNow is a protocol that lets you notify search engines immediately when content is published or updated. Supported by Bing, Yandex, and Seznam. Google does not currently support it but has participated in testing.

### Implementation

1. **Generate an API key** — any unique string (UUID recommended)
2. **Host the key file** at `{{BASE_URL}}/{{INDEXNOW_KEY}}.txt` containing just the key
3. **Submit URLs** via HTTP POST on every publish/update:

```bash
# Single URL submission
curl -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "{{DOMAIN}}",
    "key": "{{INDEXNOW_KEY}}",
    "urlList": [
      "{{BASE_URL}}/blog/new-post",
      "{{BASE_URL}}/blog/updated-post"
    ]
  }'
```

### Framework Integration

```typescript
// lib/indexnow.ts
const INDEXNOW_KEY = "{{INDEXNOW_KEY}}";
const HOST = "{{DOMAIN}}";

export async function notifyIndexNow(urls: string[]) {
  if (process.env.NODE_ENV !== "production") return;

  await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, urlList: urls }),
  });
}
```

Call `notifyIndexNow()` in your CMS publish hook or build pipeline.

---

## Googlebot Behavior Patterns

Understanding how Googlebot operates helps you diagnose issues:

- **User-agent**: `Googlebot` (desktop) and `Googlebot-Smartphone` (mobile). Mobile-first indexing means the smartphone version is primary.
- **Rendering engine**: Googlebot uses the latest stable Chrome. It can execute modern JavaScript, but has a timeout. Pages that take too long to render may be indexed with incomplete content.
- **Crawl patterns**: Googlebot respects robots.txt, follows links, reads sitemaps. It does not click buttons, fill forms, or interact with JavaScript widgets.
- **Frequency**: Popular, frequently-updated pages may be crawled multiple times per day. Low-authority, stable pages may be crawled once a month or less.
- **Caching**: Googlebot caches resources (CSS, JS) aggressively. If you deploy new JavaScript that changes content rendering, it may take time for Googlebot to pick up the new version.

### Verifying Googlebot

Legitimate Googlebot requests can be verified via reverse DNS:

```bash
# Verify a Googlebot IP
host 66.249.66.1
# Should resolve to *.googlebot.com or *.google.com

# Then verify forward DNS matches
host crawl-66-249-66-1.googlebot.com
# Should resolve back to 66.249.66.1
```

---

## Crawl Log Analysis

Server log analysis reveals exactly what Googlebot is doing on your site — what it crawls, how often, and what errors it encounters.

### What to Extract

From your server access logs, filter for Googlebot user-agent and extract:

| Data Point | What It Tells You |
|---|---|
| URLs crawled | Which pages Googlebot prioritizes |
| Crawl frequency per URL | How often each page is re-crawled |
| Status codes returned | Server errors Googlebot encounters |
| Response times | Pages that are slow for Googlebot |
| URLs crawled but not in sitemap | Pages Googlebot discovers on its own |
| Sitemap URLs not crawled | Pages Googlebot ignores despite sitemap inclusion |

### Analysis Methodology

1. Export 30 days of Googlebot access logs
2. Deduplicate by URL to get unique pages crawled
3. Cross-reference with sitemap: identify sitemap URLs never crawled (priority gap)
4. Cross-reference with GSC index coverage: correlate crawl frequency with indexation status
5. Identify 5xx errors — these are crawl budget wasted and reliability signals damaged
6. Calculate average response time by page type — slow pages reduce overall crawl efficiency

> Cross-reference: `36-seo/measurement/crawl-budget-log-analysis.md` for detailed log analysis procedures and tooling.

---

## Master Crawlability Checklist

### Pass/Fail Criteria

| Check | Pass | Fail |
|---|---|---|
| All priority pages indexed | 100% of P0 pages in index | Any P0 page not indexed |
| Crawl errors | < 1% of crawled URLs return 5xx | > 1% server errors |
| Orphan pages | 0 orphan pages in sitemap | Any sitemap URL unreachable via internal links |
| Crawl budget waste | < 10% of crawled URLs are non-canonical or non-indexable | > 10% waste |
| TTFB for Googlebot | < 200ms median | > 500ms median |
| JavaScript rendering | Critical content in view-source | Critical content only after JS execution |
| Sitemap accuracy | 100% of sitemap URLs return 200 and are canonical | Any sitemap URL returns non-200 or is non-canonical |
| Redirect chains | Max 1 hop | Any chain with 2+ redirects |
| Index coverage trend | Stable or growing | Declining indexed pages without intentional removal |

---

## Cross-References

- Robots, sitemaps, canonicals: [robots-sitemap-canonical.md](robots-sitemap-canonical.md)
- Rendering and JavaScript SEO: [rendering-seo.md](rendering-seo.md)
- Site architecture: [site-architecture-for-seo.md](site-architecture-for-seo.md)
- Master checklist: [technical-seo-checklist.md](technical-seo-checklist.md)
- Crawl log analysis tooling: `36-seo/measurement/crawl-budget-log-analysis.md`
