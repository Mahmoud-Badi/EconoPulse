# Robots, Sitemaps & Canonicals

The three mechanisms that control how search engines discover and deduplicate {{PROJECT_NAME}} URLs. These work together as a system — misconfiguring one undermines the others.

---

## How They Work Together

```
robots.txt    → Controls what crawlers CAN access (crawl permission)
Sitemap       → Tells crawlers what you WANT them to find (crawl suggestion)
Canonical     → Tells crawlers which version to INDEX (deduplication signal)
```

Important distinctions:
- **robots.txt blocks crawling, not indexing**. If external sites link to a blocked URL, Google may still index it (without content) based on anchor text alone.
- **Sitemaps are suggestions, not commands**. Search engines may ignore sitemap entries or crawl URLs not in the sitemap.
- **Canonical tags are hints, not directives**. Google may choose a different canonical if it disagrees with your tag.

All three must be consistent. If robots.txt blocks a URL that is in your sitemap and has a canonical tag — you have conflicting signals.

---

## robots.txt

### Location and Delivery

- Must be at the root: `{{BASE_URL}}/robots.txt`
- Must return HTTP 200 with `Content-Type: text/plain`
- Maximum file size: 500KB (Google's limit)
- Cached by search engines — changes may take hours to propagate

### Syntax Reference

```
# Comment — ignored by crawlers

User-agent: *          # Applies to all crawlers
Disallow: /admin/      # Block this path
Allow: /admin/public/  # But allow this subpath (more specific wins)

User-agent: Googlebot  # Rules specific to Googlebot
Crawl-delay: 1         # Wait 1 second between requests (ignored by Google)

Sitemap: {{BASE_URL}}/sitemap.xml    # Location of sitemap
```

### Matching Rules

- Patterns match from the start of the path: `Disallow: /admin` matches `/admin`, `/admin/`, `/admin/settings`
- `*` is a wildcard: `Disallow: /*.pdf` blocks all PDF files at any depth
- `$` matches end of URL: `Disallow: /*.php$` blocks `.php` but not `.php?param=value`
- More specific rules override less specific rules
- An empty `Disallow:` means "allow everything"
- `Allow` takes precedence over `Disallow` when path lengths are equal

### Standard robots.txt Template

```
# {{PROJECT_NAME}} robots.txt
# Last updated: {{DATE}}

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/
Disallow: /internal/
Disallow: /preview/
Disallow: /*?sessionid=
Disallow: /*?sort=
Disallow: /*?utm_
Disallow: /search
Disallow: /thank-you

# Sitemap
Sitemap: {{BASE_URL}}/sitemap.xml
```

### Per-Bot Rules

```
# Standard crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# AI Training Bots — block if you do not want content used for AI training
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: ClaudeBot
Disallow: /

# Allow AI search features (separate from training)
# Google-Extended blocks AI training/summaries but NOT Search
# GPTBot blocks ChatGPT browsing
# Decide per your project policy
```

### AI Bot Directive Decision Framework

| Bot | Owner | Purpose | Block If |
|---|---|---|---|
| `GPTBot` | OpenAI | ChatGPT browsing, training | You do not want content in ChatGPT |
| `Google-Extended` | Google | AI Overviews, Gemini training | You do not want content in Google AI features |
| `CCBot` | Common Crawl | Open web dataset, used by many AI models | You do not want content in open training datasets |
| `anthropic-ai` | Anthropic | AI training | You do not want content used for Anthropic training |
| `ClaudeBot` | Anthropic | Claude web browsing | You do not want content accessible to Claude |
| `Bytespider` | ByteDance | TikTok AI training | You do not want content in ByteDance models |
| `FacebookBot` | Meta | Meta AI, content previews | You do not want content in Meta AI (but may break link previews) |

### Common Mistakes

| Mistake | Impact | Fix |
|---|---|---|
| Blocking CSS/JS files | Googlebot cannot render the page — may not see content | Allow all CSS/JS: do not `Disallow: /*.css` or `/*.js` |
| Blocking images | Rich results may not show images | Allow image paths |
| Using robots.txt to prevent indexing | URL may still be indexed (without content) | Use `noindex` meta tag instead |
| Trailing slash inconsistency | `Disallow: /admin` does not block `/admin/` on all crawlers | Use `Disallow: /admin/` and `Disallow: /admin` |
| Forgetting sitemap declaration | Crawlers must discover sitemap some other way | Always include `Sitemap:` directive |
| Blocking staging but not via DNS/auth | Staging leaks if robots.txt fails | Use authentication or DNS restriction, not just robots.txt |

### Testing robots.txt

- **Google**: Search Console → robots.txt Tester
- **Manual**: `curl {{BASE_URL}}/robots.txt` — verify content and status code
- **Validation**: Ensure no accidental blocks on critical paths

```bash
# Quick verification
curl -s -o /dev/null -w "%{http_code}" "{{BASE_URL}}/robots.txt"
# Should return 200

curl -s "{{BASE_URL}}/robots.txt" | head -20
# Verify content is correct
```

---

## XML Sitemaps

### Purpose

Sitemaps tell search engines which URLs exist and which are important. They are especially valuable for:
- Large sites where not all pages are discoverable via links
- New sites with few external links
- Sites with deep content that Googlebot might not crawl quickly
- Sites with rich media (images, video) that need additional metadata

### Sitemap Requirements

- Format: XML (UTF-8 encoding)
- Maximum 50,000 URLs per sitemap file
- Maximum 50MB uncompressed per sitemap file
- For larger sites: use a sitemap index file that references multiple sitemaps
- Only include URLs that return 200, are canonical, and are indexable
- Host at the root: `{{BASE_URL}}/sitemap.xml`

### Sitemap XML Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{{BASE_URL}}/</loc>
    <lastmod>{{LAST_MODIFIED_ISO}}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>{{BASE_URL}}/pricing</loc>
    <lastmod>{{LAST_MODIFIED_ISO}}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>{{BASE_URL}}/blog/{{POST_SLUG}}</loc>
    <lastmod>{{LAST_MODIFIED_ISO}}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

**Notes on `changefreq` and `priority`**:
- Google has stated it ignores `changefreq` and `priority`
- Bing and other engines may still use them
- Include them for completeness but do not rely on them
- `lastmod` is the most important field — keep it accurate

### Sitemap Index (Large Sites)

For sites with more than 50,000 URLs:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>{{BASE_URL}}/sitemaps/pages.xml</loc>
    <lastmod>{{LAST_MODIFIED_ISO}}</lastmod>
  </sitemap>
  <sitemap>
    <loc>{{BASE_URL}}/sitemaps/blog.xml</loc>
    <lastmod>{{LAST_MODIFIED_ISO}}</lastmod>
  </sitemap>
  <sitemap>
    <loc>{{BASE_URL}}/sitemaps/products-1.xml</loc>
    <lastmod>{{LAST_MODIFIED_ISO}}</lastmod>
  </sitemap>
  <sitemap>
    <loc>{{BASE_URL}}/sitemaps/products-2.xml</loc>
    <lastmod>{{LAST_MODIFIED_ISO}}</lastmod>
  </sitemap>
</sitemapindex>
```

### Image Sitemap Extension

```xml
<url>
  <loc>{{BASE_URL}}/products/{{PRODUCT_SLUG}}</loc>
  <image:image>
    <image:loc>{{BASE_URL}}/images/{{PRODUCT_IMAGE}}</image:loc>
    <image:title>{{IMAGE_TITLE}}</image:title>
    <image:caption>{{IMAGE_CAPTION}}</image:caption>
  </image:image>
</url>
```

Add `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` to the `<urlset>` tag.

### Video Sitemap Extension

```xml
<url>
  <loc>{{BASE_URL}}/videos/{{VIDEO_SLUG}}</loc>
  <video:video>
    <video:thumbnail_loc>{{THUMBNAIL_URL}}</video:thumbnail_loc>
    <video:title>{{VIDEO_TITLE}}</video:title>
    <video:description>{{VIDEO_DESCRIPTION}}</video:description>
    <video:content_loc>{{VIDEO_FILE_URL}}</video:content_loc>
    <video:duration>{{DURATION_SECONDS}}</video:duration>
    <video:publication_date>{{PUBLISH_DATE_ISO}}</video:publication_date>
  </video:video>
</url>
```

Add `xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"` to the `<urlset>` tag.

### News Sitemap Extension

For Google News publishers:

```xml
<url>
  <loc>{{BASE_URL}}/news/{{ARTICLE_SLUG}}</loc>
  <news:news>
    <news:publication>
      <news:name>{{PUBLICATION_NAME}}</news:name>
      <news:language>{{LANGUAGE_CODE}}</news:language>
    </news:publication>
    <news:publication_date>{{PUBLISH_DATE_ISO}}</news:publication_date>
    <news:title>{{ARTICLE_TITLE}}</news:title>
  </news:news>
</url>
```

Add `xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"` to the `<urlset>` tag. News sitemaps should only contain articles published in the last 2 days.

---

## Framework-Specific Sitemap Generation

### Next.js App Router (Built-in)

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "{{BASE_URL}}";

  // Fetch dynamic content
  const posts = await getAllPosts();
  const products = await getAllProducts();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...postUrls, ...productUrls];
}
```

### Next.js with next-sitemap

```bash
npm install next-sitemap
```

```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "{{BASE_URL}}",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/api/*", "/admin/*", "/dashboard/*", "/auth/*"],
  robotsTxtOptions: {
    additionalSitemaps: [
      "{{BASE_URL}}/server-sitemap.xml",
    ],
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/dashboard/", "/auth/"] },
      { userAgent: "GPTBot", disallow: "/" },
    ],
  },
  // Transform function for custom per-URL configuration
  transform: async (config, path) => {
    // Custom priority for specific paths
    const priorityMap: Record<string, number> = {
      "/": 1.0,
      "/pricing": 0.9,
      "/blog": 0.8,
    };
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorityMap[path] || config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
```

Add to `package.json`: `"postbuild": "next-sitemap"`

### Gatsby

```bash
npm install gatsby-plugin-sitemap
```

```javascript
// gatsby-config.js
module.exports = {
  siteMetadata: {
    siteUrl: "{{BASE_URL}}",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
          {
            allSitePage { nodes { path } }
            allMarkdownRemark { nodes { fields { slug } frontmatter { date } } }
          }
        `,
        excludes: ["/admin/*", "/preview/*"],
      },
    },
  ],
};
```

### Astro

```bash
npx astro add sitemap
```

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "{{BASE_URL}}",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin/") && !page.includes("/preview/"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
```

### Hugo

Hugo generates sitemaps by default. Configure in `config.toml`:

```toml
baseURL = "{{BASE_URL}}"

[sitemap]
  changefreq = "weekly"
  filename = "sitemap.xml"
  priority = 0.5
```

### Custom Generation (Any Framework)

```typescript
// scripts/generate-sitemap.ts
import { writeFileSync } from "fs";

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

function generateSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ""}
    ${entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Build entries from your data source
const entries: SitemapEntry[] = [
  { url: "{{BASE_URL}}/", lastmod: new Date().toISOString(), priority: 1.0 },
  // ... add dynamic entries from your CMS/database
];

writeFileSync("public/sitemap.xml", generateSitemap(entries));
console.log(`Sitemap generated with ${entries.length} URLs`);
```

### Submitting Sitemaps

```bash
# Submit to Google (via Search Console API or the ping URL)
curl "https://www.google.com/ping?sitemap={{BASE_URL}}/sitemap.xml"

# Submit to Bing (via Bing Webmaster Tools or the ping URL)
curl "https://www.bing.com/ping?sitemap={{BASE_URL}}/sitemap.xml"
```

Also submit manually in Google Search Console (Sitemaps section) and Bing Webmaster Tools.

---

## Canonical URLs

### What Canonicals Do

A canonical tag tells search engines: "This page has duplicate or near-duplicate versions. This is the one you should index."

```html
<link rel="canonical" href="{{BASE_URL}}/products/widget" />
```

The canonical URL receives all ranking signals from the duplicate versions. The duplicates are still crawled but not indexed separately.

### When You Need Canonicals

| Scenario | Example | Canonical To |
|---|---|---|
| HTTP and HTTPS versions | `http://` and `https://` | HTTPS version |
| www and non-www | `www.example.com` and `example.com` | Your preferred domain |
| Trailing slash variants | `/about` and `/about/` | Your preferred pattern |
| URL parameters | `/products?sort=price` | `/products` |
| Session IDs | `/page?sid=abc123` | `/page` |
| Tracking parameters | `/page?utm_source=twitter` | `/page` |
| Print/mobile versions | `/page/print`, `m.example.com/page` | `/page` |
| Syndicated content | Same article on multiple sites | Original source URL |
| Pagination (debatable) | `/blog?page=2` | Self-canonical (`/blog?page=2`) |

### Self-Referencing Canonicals

**Every indexable page should have a self-referencing canonical.** This prevents duplicate content from unknown URL variations (parameters appended by external links, case variations, etc.).

```html
<!-- On {{BASE_URL}}/about — canonical points to itself -->
<link rel="canonical" href="{{BASE_URL}}/about" />
```

### Cross-Domain Canonicals

When the same content exists on multiple domains:

```html
<!-- On syndication-partner.com/article — canonical points to your original -->
<link rel="canonical" href="{{BASE_URL}}/blog/original-article" />
```

**Caveats**:
- The canonical target domain must not disallow the source domain in robots.txt
- Google treats cross-domain canonicals as a strong hint but may not always follow it
- The content must be substantially similar (not just related)

### Canonical + Sitemap Consistency

| Situation | Problem | Fix |
|---|---|---|
| Sitemap URL differs from canonical | Conflicting signals | Sitemap should only contain canonical URLs |
| Sitemap includes noindexed URLs | Contradictory: "index this" vs "don't index this" | Remove noindexed URLs from sitemap |
| Sitemap URL has parameters, canonical doesn't | Google sees mixed signals | Sitemap URL should match canonical exactly |
| Redirect chain to canonical | Extra crawl hops, diluted signals | Sitemap should contain the final URL |

### Canonical Pitfalls

| Pitfall | Why It Happens | Impact | Fix |
|---|---|---|---|
| Canonical to a 404 page | Linked page was deleted | Content not indexed | Update canonical to a valid URL |
| Canonical to a redirected URL | Linked page was moved | Weakened signal | Point canonical to the final destination |
| Canonical chain | Page A → B → C canonicals | Google may ignore the chain | Every canonical should point to the final canonical, not through intermediaries |
| Relative canonical URLs | `<link rel="canonical" href="/about">` | May resolve incorrectly in some edge cases | Use absolute URLs: `href="{{BASE_URL}}/about"` |
| Canonical in body (not head) | JavaScript injection or HTML errors | May not be recognized | Ensure canonical is in `<head>` |
| Multiple canonical tags | Template error, plugin conflict | Google may ignore both | Audit and remove duplicates |
| Canonical pointing to a different language | Misunderstanding purpose | Wrong language ranks | Use `hreflang` for language variants, canonical for exact duplicates |

### Canonical in HTTP Headers

For non-HTML resources (PDFs, images) or when you cannot modify the `<head>`:

```
HTTP/1.1 200 OK
Link: <{{BASE_URL}}/document>; rel="canonical"
```

### Handling Pagination with Canonicals

Since Google deprecated `rel="next/prev"`, the canonical strategy for pagination is:

```html
<!-- /blog/page/1 — self-canonical -->
<link rel="canonical" href="{{BASE_URL}}/blog/page/1" />

<!-- /blog/page/2 — self-canonical (NOT canonical to page 1) -->
<link rel="canonical" href="{{BASE_URL}}/blog/page/2" />

<!-- /blog/page/3 — self-canonical -->
<link rel="canonical" href="{{BASE_URL}}/blog/page/3" />
```

Each page has unique content (different items) and should be its own canonical. Canonicalizing all pages to page 1 would hide all content from pages 2+.

Exception: If you have a "view all" page that contains all items, you can canonical paginated pages to the "view all" page.

---

## Putting It All Together: Consistency Audit

Run this audit after any structural change:

### Consistency Checklist

- [ ] Every URL in sitemap returns HTTP 200
- [ ] Every URL in sitemap has a self-referencing canonical (or canonical to itself)
- [ ] No URL in sitemap is blocked by robots.txt
- [ ] No URL in sitemap has a `noindex` meta tag
- [ ] No URL in sitemap redirects (sitemap should contain final URLs)
- [ ] robots.txt `Sitemap:` directive points to the correct sitemap URL
- [ ] All canonical URLs are absolute (not relative)
- [ ] No canonical chains (A→B→C)
- [ ] No canonical URLs return 4xx or 5xx
- [ ] Canonical URL matches the URL in the sitemap for every page
- [ ] robots.txt does not block resources needed for page rendering (CSS, JS, images)
- [ ] AI bot directives match your project's content usage policy

### Automated Validation

```typescript
// scripts/validate-seo-consistency.ts
// Run after each build to catch inconsistencies

import { readFileSync } from "fs";
import { parseStringPromise } from "xml2js";

async function validateSitemap(sitemapPath: string) {
  const xml = readFileSync(sitemapPath, "utf-8");
  const result = await parseStringPromise(xml);
  const urls: string[] = result.urlset.url.map((u: any) => u.loc[0]);

  const errors: string[] = [];

  for (const url of urls) {
    const response = await fetch(url, { redirect: "manual" });

    if (response.status !== 200) {
      errors.push(`${url} returns ${response.status} (expected 200)`);
    }

    if (response.status >= 300 && response.status < 400) {
      errors.push(`${url} is a redirect — use the final URL in sitemap`);
    }
  }

  if (errors.length > 0) {
    console.error("Sitemap validation errors:");
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log(`Sitemap validated: ${urls.length} URLs, 0 errors`);
}
```

---

## Cross-References

- Crawlability and indexation: [crawlability-indexation.md](crawlability-indexation.md)
- Site architecture (URL design): [site-architecture-for-seo.md](site-architecture-for-seo.md)
- Rendering and framework-specific SEO: [rendering-seo.md](rendering-seo.md)
- Master checklist: [technical-seo-checklist.md](technical-seo-checklist.md)
