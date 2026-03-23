# Site Architecture for SEO

How to structure {{PROJECT_NAME}} so that search engines can efficiently discover, understand, and rank every important page. Architecture is the foundation — no amount of content optimization compensates for a broken structure.

---

## URL Hierarchy Design Principles

### The Rules

1. **URLs should describe content hierarchy**: `/category/subcategory/page` mirrors how content relates
2. **Shorter is better**: every path segment should earn its place
3. **Use hyphens, not underscores**: Google treats hyphens as word separators. `my-page` = "my" + "page". `my_page` = "my_page" (one token).
4. **Lowercase only**: URLs are case-sensitive. Mixed case causes duplicate content. Force lowercase via redirect.
5. **No stop words unless they aid clarity**: `/how-to-cook-rice` is fine. `/the-ultimate-guide-to-the-best-way-to-cook-rice` is not.
6. **Include target keyword in URL**: `/blog/nextjs-performance-optimization` signals relevance
7. **Trailing slash consistency**: pick one pattern and enforce it with redirects. Most frameworks default to no trailing slash.

### URL Templates by Content Type

| Content Type | URL Pattern | Example |
|---|---|---|
| Homepage | `/` | `{{BASE_URL}}/` |
| Product category | `/category-name` | `{{BASE_URL}}/running-shoes` |
| Product detail | `/category/product-slug` | `{{BASE_URL}}/running-shoes/air-zoom-pegasus` |
| Blog listing | `/blog` | `{{BASE_URL}}/blog` |
| Blog post | `/blog/post-slug` | `{{BASE_URL}}/blog/nextjs-seo-guide` |
| Blog category | `/blog/category/category-slug` | `{{BASE_URL}}/blog/category/performance` |
| Documentation | `/docs/section/page` | `{{BASE_URL}}/docs/api/authentication` |
| Landing page | `/feature-name` | `{{BASE_URL}}/analytics` |
| Pricing | `/pricing` | `{{BASE_URL}}/pricing` |
| Author page | `/blog/author/name` | `{{BASE_URL}}/blog/author/jane-smith` |

### URL Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| `/page?id=12345` | No keyword signal, ugly in search results | Use descriptive slugs: `/products/widget-pro` |
| `/products/category/subcategory/sub-subcategory/item` | Too deep — crawl priority drops with depth | Flatten: `/products/item` or `/category/item` |
| `/Products/Widget-PRO` | Case inconsistency creates duplicates | Force lowercase, redirect mixed case |
| `/blog/2024/01/15/post-title` | Date in URL ages content, adds unnecessary depth | `/blog/post-title` unless dates are the point |
| `/p/12345/s/67890` | Opaque IDs waste URL keyword opportunity | Use human-readable slugs |
| `/#/about` | Hash-based routing invisible to crawlers | Path-based routing: `/about` |
| `/blog/post-title.html` | File extensions add no value, reduce flexibility | No extension: `/blog/post-title` |

---

## Flat vs Deep Architecture

### Flat Architecture

Every important page is 1-2 clicks from the homepage.

```
/                          (homepage)
├── /product-a             (1 click)
├── /product-b             (1 click)
├── /blog                  (1 click)
│   ├── /blog/post-1       (2 clicks)
│   └── /blog/post-2       (2 clicks)
├── /pricing               (1 click)
└── /about                 (1 click)
```

**Pros**: All pages get strong authority from homepage. Fast crawling. Simple navigation.
**Cons**: Does not scale past ~100 pages. No topical grouping signal. Navigation becomes cluttered.
**Best for**: Small sites (< 100 pages), SaaS marketing sites, portfolios.

### Deep Architecture

Content organized in hierarchical categories.

```
/                                    (homepage)
├── /shoes                           (1 click)
│   ├── /shoes/running               (2 clicks)
│   │   ├── /shoes/running/pegasus   (3 clicks)
│   │   └── /shoes/running/vaporfly  (3 clicks)
│   └── /shoes/casual                (2 clicks)
│       ├── /shoes/casual/air-force  (3 clicks)
│       └── /shoes/casual/blazer     (3 clicks)
├── /clothing                        (1 click)
│   └── ...
```

**Pros**: Clear topical grouping. Scales to millions of pages. Category pages rank for broad terms. Supports faceted navigation.
**Cons**: Deep pages get less authority. Requires intentional internal linking to distribute authority. Category pages need real content.
**Best for**: E-commerce, large content sites, documentation.

### Hybrid Approach (Recommended for Most Projects)

Organize content hierarchically but ensure no important page is more than 3 clicks from the homepage. Use prominent internal links, "featured" sections, and contextual links to bypass hierarchy.

---

## Faceted Navigation SEO

Faceted navigation (filters for color, size, price, brand, etc.) is an SEO minefield. Each filter combination generates a unique URL, potentially creating millions of thin, duplicate pages that waste crawl budget.

### The Problem

```
/shoes                          → 500 products (good, indexable)
/shoes?color=red                → 50 products (maybe indexable)
/shoes?color=red&size=10        → 3 products (thin, probably not indexable)
/shoes?color=red&size=10&sort=price → 3 products, sorted (duplicate)
```

### Strategy Matrix

| Facet Type | Search Volume? | Unique Content? | Strategy |
|---|---|---|---|
| Primary category | Yes | Yes | Index — use clean URL: `/shoes/red` |
| High-value filter | Yes | Some | Index selectively — canonical to self |
| Low-value filter | No | No | Noindex or canonical to parent |
| Sort order | No | No | Canonical to unsorted version |
| Pagination | Depends | Yes (different items) | Self-canonical, proper pagination markup |
| Combined filters | Rarely | Thin | Canonical to broadest applicable filter |

### Implementation Patterns

#### Clean URLs for Indexable Facets

```
# Instead of: /shoes?color=red
# Use:        /shoes/red

# Map in your router/controller
/shoes/:color       → filter by color (indexable)
/shoes?sort=price   → sort parameter (not indexable, canonical to /shoes)
```

#### Canonical Strategy

```html
<!-- /shoes?color=red&sort=price — canonical strips sort parameter -->
<link rel="canonical" href="{{BASE_URL}}/shoes?color=red" />

<!-- /shoes?color=red&size=10&brand=nike — too specific, canonical to broadest -->
<link rel="canonical" href="{{BASE_URL}}/shoes?color=red" />
```

#### Robots Meta for Thin Combinations

```html
<!-- Low-value filter combination: noindex but allow link following -->
<meta name="robots" content="noindex, follow" />
```

#### robots.txt for Parameter Blocking

```
# Block crawling of sort and session parameters
User-agent: *
Disallow: /*?sort=
Disallow: /*?sessionid=
Disallow: /*&sort=
Disallow: /*&sessionid=
```

---

## Pagination

### The Current State (Post-2019)

Google deprecated `rel="next"` and `rel="prev"`. It now treats paginated pages as individual pages. This changes the strategy:

### Recommended Approach

1. **Each paginated page has a self-referencing canonical** — do not canonical all pages to page 1
2. **Include pagination links** as standard `<a>` tags so Googlebot can follow them
3. **Each page should have unique, valuable content** — not just "page 2 of products"
4. **Use descriptive titles**: "Running Shoes - Page 2 | {{PROJECT_NAME}}" not just "Running Shoes"

### Pagination URL Patterns

```
Good:
/blog?page=2          (query parameter — acceptable)
/blog/page/2          (path segment — cleaner)

Bad:
/blog#page2           (hash — invisible to crawlers)
/blog (with JS-loaded content) — infinite scroll with no URL change
```

### Load-More and Infinite Scroll

Neither is inherently SEO-friendly because Googlebot cannot click "Load More" or scroll.

**Fix**: Provide crawlable paginated URLs in addition to the JS-powered UX:

```html
<!-- Hidden pagination links for crawlers (visible in source, can be visually hidden) -->
<nav aria-label="Pagination">
  <a href="/blog/page/1">Page 1</a>
  <a href="/blog/page/2">Page 2</a>
  <a href="/blog/page/3">Page 3</a>
</nav>
```

Or use `<noscript>` to show pagination when JS is disabled:

```html
<noscript>
  <a href="/blog/page/2">Next Page</a>
</noscript>
```

---

## Breadcrumb Implementation

Breadcrumbs serve two purposes: user navigation and structured data for search results.

### HTML Implementation

```html
<nav aria-label="Breadcrumb">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="{{BASE_URL}}">
        <span itemprop="name">Home</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="{{BASE_URL}}/{{SECTION_SLUG}}">
        <span itemprop="name">{{SECTION_NAME}}</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span itemprop="name">{{PAGE_NAME}}</span>
      <meta itemprop="position" content="3" />
    </li>
  </ol>
</nav>
```

### JSON-LD (Preferred — Decoupled from HTML)

See [structured-data-cookbook.md](structured-data-cookbook.md) for the BreadcrumbList JSON-LD template.

### React Component

```typescript
// components/Breadcrumbs.tsx
interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex gap-2 text-sm text-gray-600">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {item.href ? (
                <a href={item.href} className="hover:underline">{item.name}</a>
              ) : (
                <span aria-current="page">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
```

---

## Information Architecture for Crawl Efficiency

### The 3-Click Rule

Every important page should be reachable within 3 clicks from the homepage. This is not about user convenience — it is about crawl priority. Pages deeper than 3 clicks receive less PageRank and are crawled less frequently.

### Achieving 3-Click Depth at Scale

For sites with thousands of pages:

1. **Category hubs**: Homepage links to category pages, each category links to its items
2. **Related content links**: Each page links to 3-5 related pages (cross-linking between categories)
3. **Footer/sidebar navigation**: Global links to high-priority pages
4. **HTML sitemap page**: A single page with links organized by category — acts as a crawl accelerator
5. **"Featured" or "Popular" sections**: Surface deep content on high-authority pages

### Content Clusters (Topic Clusters)

Organize content into clusters: one **pillar page** (comprehensive overview) linking to multiple **cluster pages** (focused subtopics), all linking back to the pillar.

```
Pillar: /guides/nextjs-performance
  ├── Cluster: /blog/nextjs-image-optimization
  ├── Cluster: /blog/nextjs-lazy-loading
  ├── Cluster: /blog/nextjs-bundle-analysis
  ├── Cluster: /blog/nextjs-caching-strategies
  └── Cluster: /blog/nextjs-edge-functions

Each cluster page links back to the pillar.
The pillar links to every cluster page.
Cluster pages link to related clusters.
```

This creates a tight internal link graph that:
- Signals topical authority to Google
- Distributes link equity efficiently
- Helps users find related content

---

## Site Structure Templates

### SaaS Marketing Site

```
/                           Homepage (hero, features, social proof)
├── /features               Feature overview
│   ├── /features/analytics     Individual feature pages
│   ├── /features/reporting
│   └── /features/integrations
├── /pricing                Pricing page
├── /customers              Customer stories / case studies
│   └── /customers/company-name
├── /blog                   Blog index
│   ├── /blog/post-slug
│   └── /blog/category/category-slug
├── /docs                   Documentation
│   ├── /docs/getting-started
│   ├── /docs/api/endpoint
│   └── /docs/guides/topic
├── /about                  About page
├── /contact                Contact page
└── /changelog              Product updates
```

### E-Commerce

```
/                           Homepage
├── /category-slug          Category pages (indexable, strong content)
│   └── /category-slug/product-slug   Product pages
├── /brand/brand-slug       Brand pages (if brands have search volume)
├── /sale                   Sale/deals page
├── /blog                   Content marketing
│   └── /blog/post-slug
├── /help                   Help center
│   └── /help/topic-slug
└── /about                  About, shipping, returns policies
```

### Documentation Site

```
/                           Homepage with getting started guide
├── /docs                   Documentation root
│   ├── /docs/quickstart
│   ├── /docs/section-slug
│   │   ├── /docs/section-slug/topic-slug
│   │   └── /docs/section-slug/another-topic
│   └── /docs/api
│       ├── /docs/api/overview
│       └── /docs/api/endpoint-name
├── /blog                   Engineering blog / announcements
│   └── /blog/post-slug
├── /changelog              Version history
└── /community              Community resources
```

### Blog / Content Site

```
/                           Homepage with featured content
├── /category-slug          Category pages with content listings
│   └── /category-slug/post-slug   Posts in category
├── /author/author-slug     Author pages
├── /tag/tag-slug           Tag pages (noindex if thin, or consolidate)
├── /about                  About
└── /newsletter             Newsletter signup
```

---

## Internal Linking: Architectural Perspective

Internal links are the primary mechanism for distributing authority and signaling page importance.

### Link Equity Distribution

- Every page has a finite amount of link equity (PageRank) to pass
- That equity is divided among all outbound links on the page
- Pages with more inbound internal links accumulate more authority
- Links higher in the HTML document may carry slightly more weight

### Architectural Linking Patterns

| Pattern | Description | When to Use |
|---|---|---|
| **Hub and spoke** | Category page links to all items | Category-to-product, pillar-to-cluster |
| **Cross-linking** | Related items link to each other | Related products, related posts |
| **Breadcrumb links** | Every page links up the hierarchy | All interior pages |
| **Contextual links** | In-content links to relevant pages | Blog posts, documentation |
| **Footer links** | Global links to important pages | High-priority pages only (not everything) |
| **Sidebar links** | Section-specific navigation | Documentation, large content sections |

### Anti-Patterns

- Linking to every page from every page (dilutes equity)
- Orphan pages (no internal links at all)
- JavaScript-only links (`onClick` with no `href`)
- Links behind login or form submission
- Excessive nofollow on internal links (rarely appropriate)
- Broken internal links (404s waste equity)

---

## Cross-References

- Crawlability and indexation: [crawlability-indexation.md](crawlability-indexation.md)
- Robots, sitemaps, canonicals: [robots-sitemap-canonical.md](robots-sitemap-canonical.md)
- Structured data (BreadcrumbList): [structured-data-cookbook.md](structured-data-cookbook.md)
- Master checklist: [technical-seo-checklist.md](technical-seo-checklist.md)
- Content SEO and keyword strategy: `36-seo/content-seo/`
