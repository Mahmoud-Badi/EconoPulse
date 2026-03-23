# URL Redirect Mapping — {{PROJECT_NAME}}

**Migration type:** {{MIGRATION_TYPE}}
**Old domain:** {{OLD_DOMAIN}}
**New domain:** {{NEW_DOMAIN}}
**Created by:** {{MIGRATION_OWNER}}
**Date:** {{MIGRATION_DATE}}

This document is the single source of truth for all URL redirects during the migration. Every URL on the old site must appear here with a defined destination or an explicit removal decision.

---

## Redirect Mapping Table

### Priority 1: High-Value Pages (Top 50 by Traffic + Backlinks)

These pages are manually verified. Each redirect is individually tested.

| # | Old URL | New URL | Status Code | Page Type | Monthly Organic Traffic | Backlinks | Verified |
| - | ------- | ------- | ----------- | --------- | ----------------------- | --------- | -------- |
| 1 | {{OLD_URL}} | {{NEW_URL}} | 301 | Homepage | | | [ ] |
| 2 | {{OLD_URL}} | {{NEW_URL}} | 301 | Product | | | [ ] |
| 3 | {{OLD_URL}} | {{NEW_URL}} | 301 | Blog | | | [ ] |
| ... | | | | | | | |

### Priority 2: Pattern-Based Redirects (Bulk URL Patterns)

These use regex rules for entire URL patterns. Spot-checked, not individually verified.

| Pattern | Old URL Pattern | New URL Pattern | Status Code | Count | Example Old | Example New | Verified |
| ------- | --------------- | --------------- | ----------- | ----- | ----------- | ----------- | -------- |
| Blog posts | /blog/{slug} | /articles/{slug} | 301 | ~200 | /blog/seo-guide | /articles/seo-guide | [ ] |
| Product pages | /products/{id}/{slug} | /shop/{slug} | 301 | ~500 | /products/123/widget | /shop/widget | [ ] |
| Category pages | /category/{name} | /collections/{name} | 301 | ~30 | /category/tools | /collections/tools | [ ] |
| ... | | | | | | | |

### Priority 3: Removed Pages (No Equivalent on New Site)

Pages that are intentionally not migrated. Each must redirect to the most relevant existing page.

| Old URL | Redirect Target | Reasoning | Status Code | Verified |
| ------- | --------------- | --------- | ----------- | -------- |
| {{OLD_URL}} | {{NEW_URL}} | [Closest topical match] | 301 | [ ] |
| {{OLD_URL}} | (none — return 410 Gone) | [Content permanently removed, no relevant page] | 410 | [ ] |
| ... | | | | |

**Rule:** Never redirect removed pages to the homepage unless the homepage is genuinely the most relevant destination. Redirecting everything to the homepage creates a soft 404 pattern that Google treats as a quality signal problem.

---

## Redirect Chain Detection and Prevention

### What Is a Redirect Chain?

```
BAD:  Page A  →  Page B  →  Page C  (2 hops — loses link equity, slows crawl)
GOOD: Page A  →  Page C  (1 hop — direct redirect)
```

### Prevention Rules

| Rule | Enforcement |
| ---- | ----------- |
| Maximum 1 redirect hop | All redirects go directly to the final destination URL |
| No redirect loops | A → B → A must never exist |
| Update old redirects | If old redirects already exist (from a previous migration), update them to point directly to the new final URL |
| Internal links use final URL | Do not rely on redirects for internal navigation — link directly to the canonical URL |

### Detection Process

1. **Before migration:** Crawl the old site with Screaming Frog. Export all existing redirects. Ensure the new redirect map does not create chains with existing redirects.

2. **Testing:** After implementing redirects in staging:
   ```bash
   # Test a single URL for redirect chain
   curl -sIL https://{{OLD_DOMAIN}}/sample-page 2>&1 | grep -E "HTTP/|Location:"

   # Expected output (single redirect):
   # HTTP/2 301
   # Location: https://{{NEW_DOMAIN}}/sample-page
   # HTTP/2 200

   # Bad output (redirect chain):
   # HTTP/2 301
   # Location: https://{{OLD_DOMAIN}}/new-path
   # HTTP/2 301
   # Location: https://{{NEW_DOMAIN}}/new-path
   # HTTP/2 200
   ```

3. **Bulk testing with Screaming Frog:**
   - Mode → List
   - Upload all old URLs from the redirect map
   - Crawl → check "Redirect Chains" report
   - Fix any chains before go-live

---

## Testing Methodology

### Manual Testing (Spot-Check)

```bash
# Verify redirect status code and destination
curl -sI "https://{{OLD_DOMAIN}}/page-path" | head -5

# Follow the full redirect chain to final destination
curl -sIL "https://{{OLD_DOMAIN}}/page-path" 2>&1 | grep -E "HTTP/|Location:"

# Test with httpie (more readable output)
http --follow --all HEAD "https://{{OLD_DOMAIN}}/page-path"
```

### Screaming Frog (Bulk Testing)

1. Open Screaming Frog → Mode → List
2. Upload CSV of all old URLs
3. Configure: Spider → Advanced → Always Follow Redirects
4. Start crawl
5. Check: Response Codes → filter "Redirect (3xx)"
6. Verify each redirect resolves to the expected new URL
7. Export results → compare against redirect mapping table

### Automated Redirect Checker Script

```bash
#!/bin/bash
# redirect-checker.sh
# Input: CSV file with columns: old_url,expected_new_url

INPUT_FILE="redirect-map.csv"
FAILURES=0

while IFS=, read -r old_url expected_new_url; do
    actual_url=$(curl -sI -o /dev/null -w "%{redirect_url}" "$old_url")
    status_code=$(curl -sI -o /dev/null -w "%{http_code}" "$old_url")

    if [ "$actual_url" != "$expected_new_url" ]; then
        echo "FAIL: $old_url"
        echo "  Expected: $expected_new_url"
        echo "  Actual:   $actual_url"
        echo "  Status:   $status_code"
        FAILURES=$((FAILURES + 1))
    fi
done < "$INPUT_FILE"

echo ""
echo "Total failures: $FAILURES"
```

### Google Search Console Validation (Post-Launch)

1. GSC → Indexing → Pages → filter by "Page with redirect"
2. Check that old URLs show as redirected (not 404 or error)
3. Monitor "Not found (404)" for URLs that should have been redirected

---

## Common Redirect Mistakes

| Mistake | Consequence | How to Detect | How to Fix |
| ------- | ----------- | ------------- | ---------- |
| **Redirect loops** (A → B → A) | Infinite loop, page never loads, Googlebot wastes crawl budget | `curl -sIL URL` shows repeating locations | Fix one side of the loop to point to the final destination |
| **Redirect chains** (A → B → C → D) | Each hop loses ~10-15% link equity; slows page load; Googlebot may stop following after 5 hops | Screaming Frog redirect chain report | Flatten to single hop (A → D) |
| **302 instead of 301** | Link equity not transferred; Google may keep old URL indexed | Check status codes in Screaming Frog or `curl -sI` | Change to 301 |
| **Forgetting trailing slashes** | /page and /page/ treated as different URLs; one may 404 | Test both variants | Normalize trailing slashes (redirect one to the other) |
| **Case sensitivity mismatch** | /Page and /page may resolve differently | Test uppercase variations | Normalize to lowercase with redirect |
| **Query parameter stripping** | /page?ref=utm lost when redirecting to /new-page | Test URLs with query parameters | Pass through or explicitly handle parameters |
| **Redirecting to homepage** | Google treats as soft 404; backlink value wasted | Audit redirects pointing to / | Redirect to the most topically relevant page |
| **Not redirecting non-www/www** | Half the URLs 404 | Test both www and non-www variants | Add www/non-www normalization redirect |
| **Forgetting HTTP → HTTPS** | Old HTTP URLs (from backlinks) return 404 | Test `http://` variant of URLs | Add HTTP → HTTPS redirect layer |
| **International variants missed** | /fr/page or /de/page not redirected | Test all language/locale prefixes | Map all locale variants |

---

## Redirect Implementation by Platform

### Nginx

```nginx
# Single redirect
location = /old-page {
    return 301 /new-page;
}

# Pattern redirect
location ~ ^/blog/(.*)$ {
    return 301 /articles/$1;
}

# Domain redirect (entire domain)
server {
    server_name old-domain.com;
    return 301 https://new-domain.com$request_uri;
}

# HTTP to HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://example.com$request_uri;
}
```

### Apache (.htaccess)

```apache
# Single redirect
Redirect 301 /old-page /new-page

# Pattern redirect
RewriteEngine On
RewriteRule ^blog/(.*)$ /articles/$1 [R=301,L]

# Domain redirect
RewriteCond %{HTTP_HOST} ^old-domain\.com$ [NC]
RewriteRule ^(.*)$ https://new-domain.com/$1 [R=301,L]

# HTTP to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

### Vercel (vercel.json)

```json
{
  "redirects": [
    { "source": "/old-page", "destination": "/new-page", "permanent": true },
    { "source": "/blog/:slug", "destination": "/articles/:slug", "permanent": true }
  ]
}
```

### Netlify (_redirects file)

```
/old-page /new-page 301
/blog/* /articles/:splat 301
```

### Netlify (netlify.toml)

```toml
[[redirects]]
  from = "/old-page"
  to = "/new-page"
  status = 301

[[redirects]]
  from = "/blog/*"
  to = "/articles/:splat"
  status = 301
```

### CloudFlare (Bulk Redirects)

Use CloudFlare Bulk Redirects (dashboard → Rules → Redirect Rules) for large-scale redirects. Upload a CSV of source/destination pairs. More efficient than Page Rules for migrations with hundreds of URLs.

### Next.js (next.config.js)

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/articles/:slug',
        permanent: true,
      },
    ];
  },
};
```

---

## Monitoring After Implementation

### Week 1 (Daily)

- [ ] Check GSC for spike in 404 errors (Indexing → Pages → Not found).
- [ ] Check server logs for Googlebot requests resulting in 404/500.
- [ ] Spot-check 20 random redirects from the mapping table.
- [ ] Monitor organic traffic to redirected pages in GA4 (landing page report).

### Week 2-4 (Every Other Day)

- [ ] GSC 404 error trend — is it decreasing?
- [ ] Are new URLs appearing in search results?
- [ ] Are old URLs disappearing from search results? (`site:{{OLD_DOMAIN}}` should decrease)
- [ ] Check top referring pages in Ahrefs — are backlinks resolving correctly through redirects?

### Month 2-3 (Weekly)

- [ ] Full Screaming Frog crawl of old domain (should all return 301s).
- [ ] Organic traffic comparison to pre-migration baseline.
- [ ] Any remaining 404s in GSC that should have been redirected.

---

## Redirect Expiration Policy

### When to Keep Redirects

| Duration | Situation |
| -------- | --------- |
| **1 year minimum** | All migrations — this is the absolute minimum |
| **2 years recommended** | Domain changes, HTTPS migrations |
| **Indefinitely** | High-value pages with many backlinks, pages that are frequently shared or bookmarked |

### When It Is Safe to Remove a Redirect

A redirect can be removed when ALL of these conditions are met:

1. The old URL receives zero traffic (check server logs, not just analytics).
2. The old URL has no remaining backlinks pointing to it (check Ahrefs/Semrush).
3. The old URL does not appear in Google's index (`site:` search returns no results).
4. At least 1 year has passed since the redirect was implemented.
5. The old URL is not referenced in any external content you cannot control (printed materials, partner sites, etc.).

**In practice:** Most redirects should be maintained indefinitely. The cost of keeping a redirect is negligible. The cost of removing one too early (lost traffic, broken bookmarks, lost link equity) is significant.

---

## Cross-References

- **Migration checklist:** `36-seo/migration/seo-migration-checklist.template.md`
- **Traffic drop diagnosis:** `36-seo/incident/traffic-drop-diagnosis.md`
- **Incident response:** `36-seo/incident/seo-incident-response.md`
