# E-Commerce SEO Strategy for {{STORE_NAME}}

> Comprehensive e-commerce search optimization — from product page schema through faceted navigation management, pagination strategy, out-of-stock handling, seasonal optimization, and shopping feed configuration. E-commerce SEO has unique challenges that general SEO guides do not address: massive page counts, dynamically generated URLs from filters, product variants creating duplicate content, seasonal inventory changes breaking indexed pages, and the constant tension between user-friendly faceted browsing and crawl budget efficiency.

---

## Table of Contents

1. [Product Page Optimization](#product-page-optimization)
2. [Category Page SEO](#category-page-seo)
3. [Faceted Navigation Management](#faceted-navigation-management)
4. [Pagination for Large Catalogs](#pagination-for-large-catalogs)
5. [Product Variant URLs](#product-variant-urls)
6. [Out-of-Stock Page Handling](#out-of-stock-page-handling)
7. [Seasonal Product Optimization](#seasonal-product-optimization)
8. [Marketplace vs Own-Site SEO](#marketplace-vs-own-site-seo)
9. [Shopping Feed Optimization](#shopping-feed-optimization)
10. [Review and Rating Schema](#review-and-rating-schema)
11. [Product Comparison Page SEO](#product-comparison-page-seo)
12. [Internal Search SEO](#internal-search-seo)

---

## Product Page Optimization

Product pages are the revenue-generating core of e-commerce SEO. Each product page must satisfy both search engines (structured data, unique content, crawlability) and users (clear information, trust signals, easy purchase path).

### Complete Product Schema (JSON-LD)

Every product page should include comprehensive `Product` schema. This is the single highest-impact structured data implementation for e-commerce — it enables rich results with price, availability, reviews, and images directly in search results.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Premium Wireless Headphones XR-500",
  "description": "Over-ear noise-cancelling wireless headphones with 40-hour battery life, premium leather ear cushions, and Hi-Res Audio certification.",
  "image": [
    "https://{{STORE_NAME}}.com/images/xr500-front.jpg",
    "https://{{STORE_NAME}}.com/images/xr500-side.jpg",
    "https://{{STORE_NAME}}.com/images/xr500-case.jpg"
  ],
  "sku": "XR-500-BLK",
  "mpn": "XR500BLK2025",
  "gtin13": "0123456789012",
  "brand": {
    "@type": "Brand",
    "name": "AudioTech"
  },
  "color": "Black",
  "material": "Leather, Aluminum",
  "weight": {
    "@type": "QuantitativeValue",
    "value": "285",
    "unitCode": "GRM"
  },
  "category": "Electronics > Audio > Headphones > Over-Ear Headphones",
  "offers": {
    "@type": "Offer",
    "url": "https://{{STORE_NAME}}.com/headphones/xr-500-black",
    "priceCurrency": "USD",
    "price": "299.99",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "{{STORE_NAME}}"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "USD"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 0,
          "maxValue": 1,
          "unitCode": "DAY"
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 2,
          "maxValue": 5,
          "unitCode": "DAY"
        }
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "US"
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "US",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/FreeReturn"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "342",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Sarah M."
      },
      "datePublished": "2025-01-15",
      "reviewBody": "Best noise cancellation I've ever experienced. Battery lasts all week with daily commute use."
    }
  ]
}
```

### Product Page Content Checklist

| Element | SEO Requirement | Common Mistake |
|---------|----------------|----------------|
| **Title tag** | `[Product Name] - [Key Feature/Variant] | {{STORE_NAME}}` (under 60 chars) | Using manufacturer's generic title or stuffing with keywords |
| **Meta description** | Include price, key benefit, availability, CTA (under 160 chars) | Duplicating manufacturer's description or leaving auto-generated |
| **H1** | Product name — one H1 per page, matches the primary product keyword | Multiple H1 tags, or H1 hidden in CSS |
| **Product description** | 200-500 words minimum of unique content. Never use manufacturer copy verbatim. | Copy-pasting manufacturer descriptions (creates massive duplicate content across retailers) |
| **Images** | Multiple angles, lifestyle shots. Descriptive filenames (`black-wireless-headphones-xr500.jpg`). Alt text describing the product. | `IMG_4523.jpg` filenames, missing alt text, single product image |
| **URL slug** | `/headphones/wireless-headphones-xr500-black` — descriptive, includes primary keyword | `/product?id=12345` or `/p/12345` |
| **Breadcrumbs** | `Home > Headphones > Over-Ear > XR-500` with schema markup | Missing breadcrumbs or breadcrumbs without structured data |
| **Internal links** | Link to related products, parent category, and related buying guides | Orphaned product pages with no internal links |
| **User reviews** | Display on-page with schema markup. Each review adds unique keyword-rich content. | Reviews hidden behind tabs or loaded via JavaScript that crawlers cannot see |
| **Specifications** | Structured table format for technical specs | Specs buried in paragraph text where they are hard to scan and crawl |

### Unique Content Strategy for Product Pages at Scale

For stores with thousands of products, writing unique descriptions for every product is unrealistic. Prioritize:

1. **Top 20% of products by revenue** — fully custom descriptions (200-500 words)
2. **Category-level descriptions** — unique content on category pages benefits all products within
3. **Template with variables** — create description templates per product type with fill-in-the-blank unique sections
4. **User-generated content** — reviews, Q&A, and "customers also bought" sections add unique content at scale
5. **Never leave a product page with zero unique content** — even 50 words of unique text is better than pure manufacturer copy

---

## Category Page SEO

Category pages are often the highest-value pages for e-commerce SEO. They target head terms ("wireless headphones," "running shoes," "leather bags") that carry high search volume and strong commercial intent.

### Category Page Structure

```
URL: {{BASE_URL}}/[category-slug]/

┌──────────────────────────────────────────────────┐
│ H1: [Category Name]                              │
│                                                  │
│ Category Introduction (100-200 words above fold) │
│ Explains what products are in this category,     │
│ key features to consider, brief buying guidance   │
├──────────────────────────────────────────────────┤
│ Filter/Sort Controls                              │
│ (Price, Brand, Rating, Color, Size, etc.)        │
├──────────────────────────────────────────────────┤
│ Product Grid                                      │
│ [Product 1] [Product 2] [Product 3] [Product 4] │
│ [Product 5] [Product 6] [Product 7] [Product 8] │
│ ... (24-48 products per page)                    │
├──────────────────────────────────────────────────┤
│ Pagination                                        │
├──────────────────────────────────────────────────┤
│ Category Description (200-500 words below grid)   │
│ Deeper buying guide content, SEO-targeted copy,  │
│ links to subcategories and related buying guides  │
├──────────────────────────────────────────────────┤
│ FAQ Section (3-5 questions with FAQ schema)        │
├──────────────────────────────────────────────────┤
│ Related Categories (internal links)                │
└──────────────────────────────────────────────────┘
```

### Category Page SEO Checklist

- [ ] Unique H1 that includes the primary category keyword
- [ ] 100-200 words of introductory content above the product grid
- [ ] 200-500 words of deeper category description below the product grid
- [ ] BreadcrumbList schema markup
- [ ] Category-specific FAQ section with FAQPage schema
- [ ] Filter URLs handled properly (see faceted navigation section)
- [ ] Pagination implemented with crawlable links (see pagination section)
- [ ] Internal links to subcategories, related categories, and buying guides
- [ ] Canonical URL set to the clean category URL (without filter parameters)
- [ ] Unique meta title and description (not auto-generated from category name only)

### Subcategory Hierarchy

Build a logical hierarchy that matches how people search:

```
/headphones/                           — "headphones" (head term)
/headphones/wireless/                  — "wireless headphones"
/headphones/wireless/over-ear/         — "wireless over-ear headphones"
/headphones/wireless/earbuds/          — "wireless earbuds"
/headphones/noise-cancelling/          — "noise cancelling headphones"
/headphones/gaming/                    — "gaming headphones"
```

**Rules:**
- Maximum 3 levels of subcategory depth. Deeper hierarchies dilute link equity and confuse crawlers.
- Every subcategory URL must have unique content — not just a filtered version of the parent category.
- Each level should target a progressively more specific keyword.
- Internal link from child to parent and parent to child.

---

## Faceted Navigation Management

Faceted navigation (filters by price, color, size, brand, rating, etc.) is the most dangerous SEO challenge in e-commerce. A category page with 5 filter types and 10 options each can generate 100,000+ unique URL combinations. If Google crawls all of them, your crawl budget is wasted on duplicate/near-duplicate content, and your site may suffer index bloat.

### The Problem

```
/headphones/                                    ← Canonical category page
/headphones/?color=black                        ← Filtered: color only
/headphones/?color=black&brand=sony             ← Filtered: color + brand
/headphones/?color=black&brand=sony&price=100-200  ← 3 filters
/headphones/?color=black&brand=sony&price=100-200&rating=4  ← 4 filters
```

Each combination is a unique URL with slightly different content (same products, different subset). Google treats each as a separate page to crawl and potentially index. The result: thousands of thin, duplicate pages competing with your canonical category page.

### Strategy Decision Matrix

| Filter Type | Should It Be Indexable? | Approach |
|-------------|------------------------|----------|
| **Product type/subcategory** | YES — these target real search queries | Give them clean subdirectory URLs (`/headphones/wireless/`) |
| **Brand** | SOMETIMES — if "brand + category" has search volume | Indexable for top brands (`/headphones/brand/sony/`), noindex for niche brands |
| **Price range** | RARELY — "cheap headphones" is a keyword, but `/headphones/?price=0-50` is not | Noindex price-filtered URLs. Target price keywords via content instead. |
| **Color** | RARELY — except in fashion/apparel where "black dress" is a real keyword | Index for fashion (clean URLs), noindex for electronics |
| **Size** | NO — rarely searched as a filter URL | Noindex |
| **Rating** | NO — "4-star headphones" is not a search query | Noindex |
| **Multi-filter combinations** | NO — never | Noindex all multi-filter combinations |

### Implementation Methods

#### Method 1: robots.txt (blunt but effective)

```
# Block all filter parameter URLs
User-agent: *
Disallow: /*?color=
Disallow: /*?size=
Disallow: /*?price=
Disallow: /*?rating=
Disallow: /*?sort=
Disallow: /*?page=*&  # Block paginated + filtered combinations
```

**Pros:** Prevents crawling entirely, saving crawl budget.
**Cons:** If these pages have backlinks, the link equity is lost. Cannot selectively allow some filter values.

#### Method 2: Canonical tags (recommended for most)

All filtered URLs point their canonical back to the clean category page:

```html
<!-- On /headphones/?color=black&brand=sony -->
<link rel="canonical" href="https://{{STORE_NAME}}.com/headphones/" />
```

**Pros:** Consolidates link equity to the canonical page. Google can still discover products through filtered pages. More flexible than robots.txt.
**Cons:** Google treats canonical as a hint, not a directive. Pages still get crawled (crawl budget impact). Over time, Google may start ignoring canonicals if the content is too different.

#### Method 3: Noindex + follow (selective control)

```html
<!-- On filtered pages you do NOT want indexed -->
<meta name="robots" content="noindex, follow" />
```

**Pros:** Google follows links on the page (discovers products) but does not index the filtered page. Link equity flows through.
**Cons:** Pages still get crawled. Google may eventually stop crawling noindexed pages over time.

#### Method 4: Clean URLs for indexable filters (best of both worlds)

For filters that target real keywords, create clean subdirectory URLs:

```
/headphones/brand/sony/          ← Clean URL, indexable, targets "Sony headphones"
/headphones/?color=black         ← Parameter URL, noindex via canonical/noindex tag
```

**Pros:** Best pages get indexed with clean, keyword-rich URLs. Bad pages are excluded.
**Cons:** More complex to implement. Requires deciding which filters deserve clean URLs.

### Recommended Hybrid Approach for {{ECOMMERCE_PLATFORM}}

```
FACETED NAVIGATION STRATEGY
────────────────────────────

Indexable filters (clean URLs):
  - Product type/subcategory → /[category]/[subcategory]/
  - Top 5-10 brands → /[category]/brand/[brand-name]/
  - [Fashion only] Color → /[category]/color/[color]/

Noindex filters (canonical to parent):
  - Price range
  - Color (non-fashion)
  - Size
  - Rating
  - Material
  - All multi-filter combinations

Crawl prevention:
  - Add "nofollow" to filter links that generate non-indexable URLs
  - OR use JavaScript-based filtering (AJAX) that does not create crawlable URLs
  - Use Google Search Console URL Parameters tool to indicate which parameters change page content
```

---

## Pagination for Large Catalogs

A category with 500 products needs pagination. How you implement it affects both SEO (can Google discover all products?) and user experience (can users find what they want?).

### Pagination Options and SEO Impact

#### Option 1: Traditional Numbered Pagination with Crawlable Links

```
/headphones/                    ← Page 1 (canonical)
/headphones/?page=2             ← Page 2
/headphones/?page=3             ← Page 3
...
/headphones/?page=21            ← Page 21
```

```html
<!-- Page 1 -->
<link rel="canonical" href="https://{{STORE_NAME}}.com/headphones/" />
<link rel="next" href="https://{{STORE_NAME}}.com/headphones/?page=2" />

<!-- Page 2 -->
<link rel="canonical" href="https://{{STORE_NAME}}.com/headphones/?page=2" />
<link rel="prev" href="https://{{STORE_NAME}}.com/headphones/" />
<link rel="next" href="https://{{STORE_NAME}}.com/headphones/?page=3" />
```

**Note:** Google announced in 2019 that it no longer uses `rel="next"` and `rel="prev"` as indexing signals. However, they still help crawlers discover paginated URLs, and Bing still uses them. Include them.

**Each paginated page should self-canonicalize** (not canonicalize to page 1). Google treats paginated pages as individual pages with their own content.

**SEO impact:** Best for crawlability. Google can discover every product. Paginated pages may independently rank for long-tail queries.

#### Option 2: "Load More" Button

Products load dynamically when the user clicks "Load More." The URL does not change.

**SEO impact:** Poor unless implemented with a fallback. Google's crawler does not click buttons. All products beyond the initial load are invisible to crawlers unless you provide a crawlable fallback (HTML `<noscript>` links or a separate sitemap listing all product URLs).

**If using Load More, add a crawlable fallback:**
```html
<noscript>
  <a href="/headphones/?page=2">Next page</a>
</noscript>
```
Or ensure all product URLs are in the XML sitemap.

#### Option 3: Infinite Scroll

Products load automatically as the user scrolls. Similar SEO problems to "Load More" but worse — there is no click event at all.

**SEO impact:** Very poor. Requires the same crawlable fallback as Load More. Additionally, infinite scroll pages tend to have massive DOM sizes that hurt Core Web Vitals.

**Recommendation:** Use traditional numbered pagination for SEO. You can enhance UX with JavaScript-based lazy loading or "Load More" on top of a crawlable pagination structure.

### Pagination Best Practices

- [ ] Each paginated page self-canonicalizes (do NOT canonical all pages to page 1)
- [ ] Include `rel="next"` and `rel="prev"` tags
- [ ] Paginated URLs are in the XML sitemap
- [ ] Page title tags include page number: "Wireless Headphones - Page 2 | {{STORE_NAME}}"
- [ ] Do not noindex paginated pages (they contain unique product listings)
- [ ] Limit to 24-48 products per page (balance between crawl efficiency and user experience)
- [ ] Ensure all products are discoverable via pagination OR XML sitemap (or both)

---

## Product Variant URLs

Products with variants (color, size, storage capacity, material) create a decision: should each variant have its own URL or share a URL?

### Decision Framework

| Scenario | Approach | Implementation |
|----------|----------|----------------|
| **Variants with distinct search demand** | Separate URLs | "iPhone 16 Pro 256GB" and "iPhone 16 Pro 512GB" are different search queries — separate pages |
| **Variants with no distinct search demand** | Single URL with variant selector | "T-shirt in red" and "T-shirt in blue" — nobody searches for a specific color of a generic tee — one page |
| **Variants with moderate search demand** | Single canonical + variant pages | "Nike Air Max black" has some volume — create the page but canonical to the parent if content is thin |
| **Visually different variants** | Separate URLs | A "blue sofa" and "red sofa" look completely different in images — separate pages serve users better |
| **Functionally different variants** | Separate URLs | 64GB vs 256GB storage changes the product's use case — separate pages |

### Implementation: Separate Variant URLs

```
/shoes/nike-air-max-90/                    ← Parent product (canonical for variants with no demand)
/shoes/nike-air-max-90/black/              ← Color variant with search demand
/shoes/nike-air-max-90/white/              ← Color variant with search demand
```

Each variant page needs:
- Unique title tag including the variant: "Nike Air Max 90 Black | {{STORE_NAME}}"
- Unique H1 including the variant
- Variant-specific images (do not reuse the same images with different alt text)
- Unique product description paragraph mentioning the variant
- Canonical pointing to itself (self-canonicalize)
- Internal links to other variants ("Also available in: [White] [Red] [Blue]")

### Implementation: Single URL with Variant Selector

```
/shoes/nike-air-max-90/                    ← Single URL for all variants
```

Variant selection happens via JavaScript (color/size dropdowns). URL does not change. All variants share one page's SEO equity.

- All variant images should be on the page (tabbed or in a gallery)
- Product schema should include all variant offers:

```json
{
  "@type": "Product",
  "name": "Nike Air Max 90",
  "offers": [
    {
      "@type": "Offer",
      "sku": "NAM90-BLK-10",
      "name": "Black - Size 10",
      "price": "130.00",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "sku": "NAM90-WHT-10",
      "name": "White - Size 10",
      "price": "130.00",
      "availability": "https://schema.org/InStock"
    }
  ]
}
```

### What to Avoid

- **Parameter-based variants without canonicalization**: `/product?id=123&color=black` and `/product?id=123&color=white` without canonical tags create duplicate content
- **Identical content across variant pages**: If the only difference is the color name in the title, Google sees them as duplicates
- **Variant pages with no images of that variant**: A "blue shoes" page showing only red shoe images is a bad user experience and will rank poorly

---

## Out-of-Stock Page Handling

Out-of-stock products are a constant reality in e-commerce. How you handle these pages has significant SEO implications — the wrong decision destroys indexed pages with established rankings and backlinks.

### Decision Tree

```
Product is out of stock
│
├── Will it come back in stock?
│   ├── YES (temporary out-of-stock)
│   │   └── KEEP THE PAGE LIVE
│   │       - Update availability schema to "OutOfStock"
│   │       - Add "Notify me when back in stock" email capture
│   │       - Show related/alternative products
│   │       - Display expected restock date if known
│   │       - DO NOT noindex, DO NOT redirect, DO NOT 404
│   │
│   └── NO (permanently discontinued)
│       ├── Is there a direct replacement product?
│       │   ├── YES → 301 redirect to replacement product page
│       │   └── NO → Is there a relevant category page?
│       │       ├── YES → 301 redirect to category page
│       │       └── NO → Return 410 (Gone) after 6 months
│       │
│       └── Does the page have significant backlinks or rankings?
│           ├── YES → Keep live with "discontinued" notice + alternatives
│           │         for at least 6 months before redirecting
│           └── NO → 301 redirect to relevant category immediately
```

### Temporary Out-of-Stock Implementation

```json
{
  "@type": "Product",
  "name": "Product Name",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/OutOfStock",
    "price": "99.99",
    "priceCurrency": "USD"
  }
}
```

**Page content changes:**
- Show the "Out of Stock" status prominently
- Add email capture: "Notify me when this is back in stock"
- Display 4-6 alternative products in the same category
- Keep all existing content, images, and reviews intact
- Do NOT remove the page from the sitemap
- Do NOT add noindex

### Seasonal Out-of-Stock

For products that go out of stock seasonally (winter coats in summer, Christmas decorations in January):

- Keep pages live year-round
- Update page content to mention "Available for [Season] [Year]"
- Reduce internal linking to seasonal pages during off-season
- Increase internal linking 4-6 weeks before the season starts
- Never delete and recreate seasonal product pages — you lose all accumulated authority

---

## Seasonal Product Optimization

Seasonal SEO requires planning months ahead. Google rewards pages that exist and have authority when seasonal demand spikes — not pages created the week before Black Friday.

### Evergreen URL Strategy

```
WRONG: /black-friday-deals-2025/   → Dead URL after November, must create new one yearly
RIGHT: /deals/black-friday/         → Same URL every year, updated with current offers

WRONG: /christmas-gifts-2025/       → Dead URL after December
RIGHT: /gift-guides/christmas/      → Same URL every year, updated annually
```

### Seasonal Content Calendar

| Season/Event | Content Live By | Content Updated By | Peak Search | Wind Down |
|-------------|----------------|-------------------|-------------|-----------|
| **Valentine's Day** | December 1 | January 15 | Feb 1-14 | Feb 15 |
| **Easter** | January 15 | March 1 | 2 weeks before Easter | Easter +1 week |
| **Mother's Day** | February 1 | April 1 | May 1-12 | May 15 |
| **Father's Day** | March 1 | May 1 | June 1-15 | June 20 |
| **Back to School** | May 1 | July 1 | July 15 - Sep 1 | Sep 15 |
| **Halloween** | July 1 | September 1 | Oct 1-31 | Nov 1 |
| **Black Friday/Cyber Monday** | August 1 | October 15 | Nov 15-30 | Dec 1 |
| **Christmas** | August 1 | October 15 | Nov 15 - Dec 24 | Dec 26 |
| **New Year** | October 1 | December 1 | Dec 26 - Jan 1 | Jan 2 |

**Key principle:** Content must exist and be indexed 8-12 weeks before peak search demand. Google takes time to discover, crawl, index, and rank new pages. A Black Friday page created on November 1 will not rank by November 25.

### Post-Season Page Handling

After the season ends:
1. Remove time-sensitive offers and pricing
2. Replace with "Check back for [Season] [Next Year] deals" messaging
3. Keep the page live and indexed (do NOT noindex, redirect, or 404)
4. Reduce internal links to the seasonal page during off-season
5. Update the page title to remove the year: "Black Friday Deals | {{STORE_NAME}}" not "Black Friday 2025 Deals"
6. The accumulated authority transfers to next year's seasonal spike

---

## Marketplace vs Own-Site SEO

Many e-commerce businesses sell both on their own site and on marketplaces (Amazon, eBay, Etsy, Walmart). The SEO strategies are fundamentally different.

### Comparison

| Factor | Own-Site SEO | Marketplace SEO |
|--------|------------|----------------|
| **Control** | Full control over technical SEO, content, URL structure | Limited to marketplace templates and rules |
| **Brand building** | Your domain builds authority over time | Marketplace domain gets the authority |
| **Data ownership** | You own all customer and search data | Marketplace owns the data |
| **Ranking factors** | Google algorithm (backlinks, content, technical) | Marketplace algorithm (sales velocity, reviews, price, fulfillment) |
| **Cost** | Hosting + SEO investment | Marketplace fees (15-45% of revenue) |
| **Traffic source** | Google organic search | Marketplace internal search |
| **Competition** | Compete against other websites | Compete against other sellers on the same page |
| **Long-term value** | Compounding — domain authority grows over years | Volatile — marketplace can change rules, fees, or suspend you |

### Dual Strategy Recommendations

1. **Use marketplaces for revenue and own-site for brand** — marketplaces drive sales now; your own site builds long-term equity
2. **Unique content per channel** — do not copy your website product descriptions to Amazon. Write marketplace-optimized content for marketplaces and SEO-optimized content for your site.
3. **Use marketplace presence to build brand search** — customers who discover you on Amazon may search for your brand on Google. Capture that branded traffic on your own site.
4. **Never depend solely on marketplaces** — marketplace algorithm changes, fee increases, or account suspensions can destroy your business overnight. Own-site SEO is insurance.

---

## Shopping Feed Optimization

Google Shopping (via Google Merchant Center) displays your products in Shopping results, the Shopping tab, and Google Images. A well-optimized product feed is essential for e-commerce visibility.

### Product Feed Required Fields

| Field | Requirement | Optimization |
|-------|------------|-------------|
| `id` | Unique product identifier | Use your SKU. Must be stable — do not change IDs. |
| `title` | Product name (150 chars max) | Front-load important keywords. Include brand, product type, key attributes. "Nike Air Max 90 Men's Running Shoes Black Size 10" |
| `description` | Product description (5,000 chars max) | Include search keywords naturally. First 150-200 chars are most important. |
| `link` | Product page URL | Must match your canonical URL. Must be the live, accessible product page. |
| `image_link` | Primary product image URL | White background preferred for Shopping. Minimum 100x100px, recommended 800x800px. |
| `additional_image_link` | Additional images (up to 10) | Multiple angles, lifestyle shots. |
| `availability` | `in_stock`, `out_of_stock`, `preorder` | Must match what the product page shows. Mismatches get disapproved. |
| `price` | Product price | Must include currency. Must match the price on the product page exactly. |
| `sale_price` | Discounted price | Include `sale_price_effective_date` for time-limited sales. |
| `brand` | Brand name | Required for all products with a brand. |
| `gtin` | GTIN / UPC / EAN / ISBN | Required for all products with a GTIN. Critical for matching to Google's product catalog. |
| `mpn` | Manufacturer Part Number | Required when no GTIN is available. |
| `condition` | `new`, `refurbished`, `used` | Required. |
| `google_product_category` | Google's taxonomy category | Use the most specific category possible. Google has 6,000+ categories. |
| `product_type` | Your own category taxonomy | Helps Google understand your catalog structure. |
| `shipping` | Shipping cost and speed | Can be set at account level or per-product. |
| `tax` | Tax information | Can be set at account level (US only). |

### Feed Optimization Tips

1. **Title optimization is the highest-impact change.** Include: Brand + Product Type + Key Attribute (Color, Size, Material) + Model. Front-load the most important keywords.

2. **Use all available image slots.** Products with multiple images get higher CTR in Shopping results.

3. **Keep prices synchronized.** If your product page price changes, your feed must update within hours. Price mismatches cause disapprovals.

4. **Set `sale_price` for promotions** rather than changing the base `price`. This shows the strikethrough pricing in Shopping results.

5. **Use custom labels** (`custom_label_0` through `custom_label_4`) for internal categorization: margin tiers, seasonal flags, bestseller status. These help you bid strategically in Shopping campaigns but also organize your feed management.

6. **Submit supplemental feeds** for attributes that change frequently (price, availability) to keep your primary feed stable and your updates fast.

### Feed Submission

```
Feed format: XML, TSV, or Google Sheets
Update frequency: Daily minimum (hourly for high-inventory-turnover stores)
Submission: Google Merchant Center → Products → Feeds → Add feed

Platform-specific:
  Shopify: Google & YouTube channel app (automatic feed generation)
  WooCommerce: Product Feed PRO plugin or Google Listings & Ads plugin
  Magento: Google Shopping Feed extension
  BigCommerce: Google Shopping feed built into channel manager
  Custom: Generate XML feed from your product database via script
```

---

## Review and Rating Schema

Reviews and ratings are the primary social proof in e-commerce search results. Rich snippets with star ratings have significantly higher click-through rates.

### AggregateRating Schema

```json
{
  "@type": "Product",
  "name": "Product Name",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "892",
    "reviewCount": "234"
  }
}
```

**Important distinctions:**
- `ratingCount`: Total number of ratings (including ratings without text reviews)
- `reviewCount`: Total number of reviews with text content
- Both should be included when available

### Individual Review Schema

```json
{
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "author": {
    "@type": "Person",
    "name": "John D."
  },
  "datePublished": "2025-02-20",
  "reviewBody": "Excellent quality. The leather is genuine and the stitching is impeccable. Fits perfectly after the recommended break-in period.",
  "publisher": {
    "@type": "Organization",
    "name": "{{STORE_NAME}}"
  }
}
```

### Review Schema Guidelines (Google's Requirements)

- Reviews must be about the specific product on the page, not the store or shipping experience
- Self-serving reviews (written by the business about its own products) are not allowed
- Star ratings must accurately reflect the aggregate of all reviews, not a cherry-picked subset
- Reviews must be visible on the page — do not include schema for reviews hidden behind JavaScript or in collapsed sections that require user interaction to view
- Third-party review platforms (Trustpilot, Bazaarvoice, Yotpo) typically handle schema markup automatically

---

## Product Comparison Page SEO

Comparison pages ("Product A vs Product B") target commercial-investigation keywords with high purchase intent. Users searching for comparisons are close to buying — they are deciding between options.

### Comparison Page Template

```
URL: /compare/[product-a]-vs-[product-b]/

H1: [Product A] vs [Product B]: Which Is Better for [Use Case]?

Section 1: Quick Verdict (50-100 words)
  - Who should buy Product A and why
  - Who should buy Product B and why
  - (Users want the answer immediately, not after 2,000 words)

Section 2: Feature-by-Feature Comparison Table
  | Feature       | Product A | Product B | Winner |
  |---------------|-----------|-----------|--------|
  | Price         |           |           |        |
  | [Feature 1]   |           |           |        |
  | [Feature 2]   |           |           |        |
  | ...           |           |           |        |

Section 3: Detailed Analysis (200-300 words per feature)
  - In-depth comparison of each major differentiator
  - Genuine pros and cons (biased comparisons lose trust)

Section 4: Who Should Buy Which
  - "Choose [Product A] if you..."
  - "Choose [Product B] if you..."

Section 5: FAQ (with FAQ schema)
  - "Is [Product A] worth the extra money?"
  - "Can [Product B] do [specific thing]?"
```

### Comparison Page SEO Tips

- Target exact-match keywords: "[Product A] vs [Product B]"
- Include both product names in the title tag and H1
- Use a comparison table — Google frequently pulls these into featured snippets
- Be genuinely balanced — biased comparisons that always favor your products lose credibility and user trust
- Include both products' schema (two Product schemas on one page is valid)
- Internal link to both individual product pages
- Update comparison pages when either product is updated or new models are released

---

## Internal Search SEO

Should your internal site search results pages be indexed by Google? Almost always: no.

### Why Internal Search Results Should NOT Be Indexed

| Problem | Impact |
|---------|--------|
| **Duplicate content** | Search results for "wireless headphones" show the same products as the `/headphones/wireless/` category page |
| **Thin content** | Search results pages have minimal unique content — just a list of product cards |
| **Infinite URL combinations** | Every possible search query creates a unique URL (`/search?q=blue+shoes`, `/search?q=shoes+blue`, etc.) |
| **Crawl budget waste** | Googlebot crawls thousands of search result URLs instead of your actual product and category pages |
| **Poor user experience** | A user landing on a search results page from Google expects a curated category page, not an internal search |

### Implementation

```html
<!-- On all internal search result pages -->
<meta name="robots" content="noindex, follow" />
```

```
# robots.txt
User-agent: *
Disallow: /search
Disallow: /search?
```

### The Exception: Internal Search Data Is Valuable for SEO Strategy

While search results pages should not be indexed, the search query data is extremely valuable:

- **Track what users search for** on your site using your analytics tool
- **Identify content gaps**: If users search for "wireless earbuds" but you do not have a category page for it, create one
- **Identify keyword opportunities**: User search terms reveal how real people describe your products — use this language in your product descriptions and category content
- **Track zero-results searches**: Queries that return no results reveal products users expect you to carry or content that is missing

---

## E-Commerce SEO Audit Checklist

### Technical Foundation
- [ ] All product pages return 200 status codes (no soft 404s)
- [ ] XML sitemap includes all indexable product and category pages
- [ ] Faceted navigation is properly handled (noindex/canonical/robots)
- [ ] Pagination is crawlable with self-canonical per page
- [ ] Internal search results are noindexed
- [ ] Product variant URLs are properly canonicalized
- [ ] HTTPS across entire site with no mixed content
- [ ] Mobile-friendly product pages (especially image galleries and size selectors)
- [ ] Core Web Vitals pass on product and category pages
- [ ] Breadcrumb navigation with schema on all pages

### Structured Data
- [ ] Product schema on every product page (price, availability, SKU, brand, reviews)
- [ ] AggregateRating schema where reviews exist
- [ ] BreadcrumbList schema on all pages
- [ ] FAQPage schema on category pages with FAQ sections
- [ ] Organization schema on homepage
- [ ] All schema validated with Google Rich Results Test

### Content
- [ ] Unique product descriptions on top 20% of products by revenue
- [ ] Category pages have 200-500 words of unique content
- [ ] No manufacturer-copy duplicate descriptions
- [ ] Out-of-stock pages handled per decision tree (not 404ed)
- [ ] Seasonal pages use evergreen URLs
- [ ] Title tags include product name + key attribute + brand
- [ ] Meta descriptions include price, key benefit, and CTA

### Shopping Feed
- [ ] Google Merchant Center feed submitted and approved
- [ ] Feed prices match product page prices
- [ ] Feed availability matches product page availability
- [ ] Feed titles optimized with front-loaded keywords
- [ ] GTINs included for all products that have them
- [ ] Feed updated daily minimum

---

## Cross-References

- **Product and category structured data**: `36-seo/technical/structured-data-cookbook.md`
- **Crawl budget optimization**: `36-seo/technical/crawlability-indexation.md`
- **Core Web Vitals for product pages**: `36-seo/technical/core-web-vitals-playbook.md`
- **Tech stack implementation**: `36-seo/specialized/tech-stack-seo.md`
- **Overall SEO strategy**: `36-seo/strategy/seo-strategy.template.md`
- **Content SEO for e-commerce content**: `36-seo/content-seo/`
- **Link building for e-commerce**: `36-seo/off-page/`
