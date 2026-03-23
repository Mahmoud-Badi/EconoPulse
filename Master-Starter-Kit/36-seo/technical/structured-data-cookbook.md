# Structured Data Cookbook

JSON-LD templates and implementation patterns for {{PROJECT_NAME}}. Structured data tells search engines what your content means, not just what it says. It enables rich results (rich snippets, knowledge panels, carousels) that dramatically improve click-through rates.

---

## Implementation Approach

Always use **JSON-LD** format (not Microdata or RDFa). Google recommends JSON-LD. It is easier to maintain, does not require changes to HTML structure, and can be injected dynamically.

Place JSON-LD in a `<script type="application/ld+json">` tag in the `<head>` or `<body>` of the page. Multiple JSON-LD blocks per page are valid.

---

## React / Next.js Component Pattern

Use this pattern to inject JSON-LD from any component:

```typescript
// components/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Usage in a page:

```typescript
import { JsonLd } from "@/components/JsonLd";

export default function ProductPage({ product }: { product: Product }) {
  return (
    <>
      <JsonLd data={buildProductSchema(product)} />
      {/* page content */}
    </>
  );
}
```

### Next.js App Router (Metadata API)

```typescript
// app/product/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: product.name,
    description: product.description,
    // JSON-LD can also be placed in the page component directly
  };
}
```

---

## Schema Templates

### Organization

**Rich result**: Knowledge Panel, logo in search results
**Where to place**: Homepage

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{{ORG_NAME}}",
  "url": "{{BASE_URL}}",
  "logo": "{{BASE_URL}}/logo.png",
  "description": "{{ORG_DESCRIPTION}}",
  "foundingDate": "{{FOUNDING_DATE}}",
  "founders": [
    {
      "@type": "Person",
      "name": "{{FOUNDER_NAME}}"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{STREET_ADDRESS}}",
    "addressLocality": "{{CITY}}",
    "addressRegion": "{{STATE}}",
    "postalCode": "{{ZIP}}",
    "addressCountry": "{{COUNTRY_CODE}}"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "{{PHONE}}",
    "contactType": "customer service",
    "availableLanguage": ["English"]
  },
  "sameAs": [
    "{{TWITTER_URL}}",
    "{{LINKEDIN_URL}}",
    "{{GITHUB_URL}}",
    "{{FACEBOOK_URL}}"
  ]
}
```

**Required**: `name`, `url`
**Recommended**: `logo`, `sameAs`, `contactPoint`
**Common errors**: `logo` must be a URL to an image file, not an HTML page. `sameAs` must be official profile URLs.

---

### Product

**Rich result**: Price, availability, rating stars in search results
**Where to place**: Product detail pages

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{PRODUCT_NAME}}",
  "description": "{{PRODUCT_DESCRIPTION}}",
  "image": [
    "{{PRODUCT_IMAGE_1}}",
    "{{PRODUCT_IMAGE_2}}"
  ],
  "sku": "{{SKU}}",
  "brand": {
    "@type": "Brand",
    "name": "{{BRAND_NAME}}"
  },
  "offers": {
    "@type": "Offer",
    "url": "{{PRODUCT_URL}}",
    "priceCurrency": "{{CURRENCY_CODE}}",
    "price": "{{PRICE}}",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "{{PRICE_VALID_DATE}}",
    "seller": {
      "@type": "Organization",
      "name": "{{ORG_NAME}}"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{AVERAGE_RATING}}",
    "reviewCount": "{{REVIEW_COUNT}}"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "{{REVIEWER_NAME}}"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "{{RATING}}",
        "bestRating": "5"
      },
      "reviewBody": "{{REVIEW_TEXT}}"
    }
  ]
}
```

**Required**: `name`, `offers` (with `price` and `priceCurrency`), or `review`, or `aggregateRating`
**Recommended**: `image`, `brand`, `sku`, `availability`
**Common errors**: `availability` must use full schema.org URL (e.g., `https://schema.org/InStock`), not just "InStock". `price` must be a number, not formatted text.

---

### Article

**Rich result**: Headline, image, date, author in search results
**Where to place**: Blog posts, news articles, content pages

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ARTICLE_TITLE}}",
  "description": "{{ARTICLE_DESCRIPTION}}",
  "image": "{{ARTICLE_IMAGE}}",
  "datePublished": "{{PUBLISH_DATE_ISO}}",
  "dateModified": "{{MODIFIED_DATE_ISO}}",
  "author": {
    "@type": "Person",
    "name": "{{AUTHOR_NAME}}",
    "url": "{{AUTHOR_URL}}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{{ORG_NAME}}",
    "logo": {
      "@type": "ImageObject",
      "url": "{{BASE_URL}}/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{{ARTICLE_URL}}"
  },
  "wordCount": "{{WORD_COUNT}}",
  "keywords": ["{{KEYWORD_1}}", "{{KEYWORD_2}}", "{{KEYWORD_3}}"]
}
```

**Required**: `headline`, `image`, `datePublished`, `author`
**Recommended**: `dateModified`, `publisher`, `mainEntityOfPage`
**Common errors**: Dates must be ISO 8601 format (`2025-01-15T09:00:00Z`). `headline` should not exceed 110 characters. `image` must be at least 1200px wide.

---

### FAQ Page

**Rich result**: Expandable Q&A directly in search results
**Where to place**: FAQ pages, product pages with FAQ sections

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{QUESTION_1}}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{ANSWER_1}}"
      }
    },
    {
      "@type": "Question",
      "name": "{{QUESTION_2}}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{ANSWER_2}}"
      }
    }
  ]
}
```

**Required**: At least one `Question` with `acceptedAnswer`
**Recommended**: Match the visible FAQ content exactly (Google may penalize hidden FAQ schema)
**Common errors**: `text` in the answer can contain HTML but must be properly escaped in JSON. Do not include FAQ schema for content that is not actually displayed on the page.

---

### HowTo

**Rich result**: Step-by-step instructions with images in search results
**Where to place**: Tutorial pages, guides, how-to articles

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "{{HOWTO_TITLE}}",
  "description": "{{HOWTO_DESCRIPTION}}",
  "totalTime": "PT{{MINUTES}}M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "{{CURRENCY_CODE}}",
    "value": "{{COST}}"
  },
  "supply": [
    { "@type": "HowToSupply", "name": "{{SUPPLY_1}}" }
  ],
  "tool": [
    { "@type": "HowToTool", "name": "{{TOOL_1}}" }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "{{STEP_1_TITLE}}",
      "text": "{{STEP_1_INSTRUCTIONS}}",
      "image": "{{STEP_1_IMAGE}}",
      "url": "{{PAGE_URL}}#step-1"
    },
    {
      "@type": "HowToStep",
      "name": "{{STEP_2_TITLE}}",
      "text": "{{STEP_2_INSTRUCTIONS}}",
      "image": "{{STEP_2_IMAGE}}",
      "url": "{{PAGE_URL}}#step-2"
    }
  ]
}
```

**Required**: `name`, `step` (at least two steps with `text`)
**Recommended**: `image` per step, `totalTime`, `supply`, `tool`
**Common errors**: `totalTime` must be ISO 8601 duration format (e.g., `PT30M` for 30 minutes, `PT1H30M` for 90 minutes). Steps must be in order.

---

### BreadcrumbList

**Rich result**: Breadcrumb trail in search results instead of raw URL
**Where to place**: Every interior page

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{{BASE_URL}}"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{{SECTION_NAME}}",
      "item": "{{BASE_URL}}/{{SECTION_SLUG}}"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{{PAGE_NAME}}",
      "item": "{{BASE_URL}}/{{SECTION_SLUG}}/{{PAGE_SLUG}}"
    }
  ]
}
```

**Required**: At least 2 `ListItem` entries with `position`, `name`, `item`
**Recommended**: Match the visible breadcrumb navigation exactly
**Common errors**: `position` must start at 1 and be sequential. The last item should not have an `item` URL if it represents the current page (omit `item` for the last entry).

---

### SoftwareApplication

**Rich result**: Rating, price in search results
**Where to place**: App landing page

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{{APP_NAME}}",
  "operatingSystem": "{{OPERATING_SYSTEM}}",
  "applicationCategory": "{{APP_CATEGORY}}",
  "description": "{{APP_DESCRIPTION}}",
  "offers": {
    "@type": "Offer",
    "price": "{{PRICE}}",
    "priceCurrency": "{{CURRENCY_CODE}}"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{AVERAGE_RATING}}",
    "ratingCount": "{{RATING_COUNT}}"
  },
  "screenshot": "{{SCREENSHOT_URL}}"
}
```

**Required**: `name`, `offers` (use `"price": "0"` for free apps)
**Recommended**: `aggregateRating`, `operatingSystem`, `applicationCategory`
**Common errors**: `applicationCategory` must be a schema.org category (e.g., `BusinessApplication`, `GameApplication`).

---

### LocalBusiness

**Rich result**: Map pack, business info in search results
**Where to place**: Homepage or location pages for brick-and-mortar businesses

```json
{
  "@context": "https://schema.org",
  "@type": "{{BUSINESS_TYPE}}",
  "name": "{{BUSINESS_NAME}}",
  "image": "{{BUSINESS_IMAGE}}",
  "url": "{{BASE_URL}}",
  "telephone": "{{PHONE}}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{STREET_ADDRESS}}",
    "addressLocality": "{{CITY}}",
    "addressRegion": "{{STATE}}",
    "postalCode": "{{ZIP}}",
    "addressCountry": "{{COUNTRY_CODE}}"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{{LATITUDE}}",
    "longitude": "{{LONGITUDE}}"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "{{OPEN_TIME}}",
      "closes": "{{CLOSE_TIME}}"
    }
  ],
  "priceRange": "{{PRICE_RANGE}}"
}
```

**Note**: `{{BUSINESS_TYPE}}` should be a specific subtype of LocalBusiness (e.g., `Restaurant`, `Dentist`, `AutoRepair`). See schema.org/LocalBusiness for subtypes.

**Required**: `name`, `address`
**Recommended**: `geo`, `openingHoursSpecification`, `telephone`, `image`
**Common errors**: `priceRange` is a text string like "$$" or "$10-$50". Time format is `HH:MM` (e.g., `"09:00"`).

---

### Event

**Rich result**: Date, location, ticket info in search results
**Where to place**: Event detail pages

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "{{EVENT_NAME}}",
  "description": "{{EVENT_DESCRIPTION}}",
  "startDate": "{{START_DATE_ISO}}",
  "endDate": "{{END_DATE_ISO}}",
  "location": {
    "@type": "Place",
    "name": "{{VENUE_NAME}}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "{{STREET_ADDRESS}}",
      "addressLocality": "{{CITY}}",
      "addressRegion": "{{STATE}}",
      "addressCountry": "{{COUNTRY_CODE}}"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "{{ORG_NAME}}",
    "url": "{{BASE_URL}}"
  },
  "offers": {
    "@type": "Offer",
    "url": "{{TICKET_URL}}",
    "price": "{{TICKET_PRICE}}",
    "priceCurrency": "{{CURRENCY_CODE}}",
    "availability": "https://schema.org/InStock",
    "validFrom": "{{SALE_START_DATE_ISO}}"
  },
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "image": "{{EVENT_IMAGE}}"
}
```

For virtual events, use `OnlineEventAttendanceMode` and add:
```json
"location": {
  "@type": "VirtualLocation",
  "url": "{{VIRTUAL_EVENT_URL}}"
}
```

**Required**: `name`, `startDate`, `location`
**Recommended**: `image`, `description`, `offers`, `organizer`
**Common errors**: `eventStatus` must use full schema.org URL. For cancelled events use `EventCancelled`, for postponed use `EventPostponed`.

---

### VideoObject

**Rich result**: Video thumbnail, duration in search results
**Where to place**: Pages with embedded video

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "{{VIDEO_TITLE}}",
  "description": "{{VIDEO_DESCRIPTION}}",
  "thumbnailUrl": "{{THUMBNAIL_URL}}",
  "uploadDate": "{{UPLOAD_DATE_ISO}}",
  "duration": "PT{{MINUTES}}M{{SECONDS}}S",
  "contentUrl": "{{VIDEO_FILE_URL}}",
  "embedUrl": "{{EMBED_URL}}",
  "publisher": {
    "@type": "Organization",
    "name": "{{ORG_NAME}}",
    "logo": {
      "@type": "ImageObject",
      "url": "{{BASE_URL}}/logo.png"
    }
  }
}
```

**Required**: `name`, `thumbnailUrl`, `uploadDate`
**Recommended**: `description`, `duration`, `contentUrl` or `embedUrl`
**Common errors**: `duration` is ISO 8601 (e.g., `PT5M30S` for 5 minutes 30 seconds). `thumbnailUrl` must be crawlable.

---

### Course

**Rich result**: Course info in search results
**Where to place**: Course catalog and detail pages

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "{{COURSE_NAME}}",
  "description": "{{COURSE_DESCRIPTION}}",
  "provider": {
    "@type": "Organization",
    "name": "{{ORG_NAME}}",
    "sameAs": "{{BASE_URL}}"
  },
  "offers": {
    "@type": "Offer",
    "price": "{{PRICE}}",
    "priceCurrency": "{{CURRENCY_CODE}}",
    "category": "{{COURSE_CATEGORY}}",
    "availability": "https://schema.org/InStock"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "instructor": {
      "@type": "Person",
      "name": "{{INSTRUCTOR_NAME}}"
    }
  }
}
```

**Required**: `name`, `description`, `provider`
**Recommended**: `offers`, `hasCourseInstance`

---

### Recipe

**Rich result**: Image, rating, cook time, calories in search results
**Where to place**: Recipe pages

```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "{{RECIPE_NAME}}",
  "image": ["{{RECIPE_IMAGE_1}}", "{{RECIPE_IMAGE_2}}"],
  "author": {
    "@type": "Person",
    "name": "{{AUTHOR_NAME}}"
  },
  "datePublished": "{{PUBLISH_DATE_ISO}}",
  "description": "{{RECIPE_DESCRIPTION}}",
  "prepTime": "PT{{PREP_MINUTES}}M",
  "cookTime": "PT{{COOK_MINUTES}}M",
  "totalTime": "PT{{TOTAL_MINUTES}}M",
  "recipeYield": "{{SERVINGS}} servings",
  "recipeCategory": "{{CATEGORY}}",
  "recipeCuisine": "{{CUISINE}}",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "{{CALORIES}} calories"
  },
  "recipeIngredient": [
    "{{INGREDIENT_1}}",
    "{{INGREDIENT_2}}",
    "{{INGREDIENT_3}}"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "text": "{{STEP_1}}"
    },
    {
      "@type": "HowToStep",
      "text": "{{STEP_2}}"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{AVERAGE_RATING}}",
    "ratingCount": "{{RATING_COUNT}}"
  }
}
```

**Required**: `name`, `image`, `recipeIngredient`, `recipeInstructions`
**Recommended**: `author`, `prepTime`, `cookTime`, `nutrition`, `aggregateRating`

---

### JobPosting

**Rich result**: Job listings in Google for Jobs
**Where to place**: Individual job posting pages

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "{{JOB_TITLE}}",
  "description": "{{JOB_DESCRIPTION_HTML}}",
  "datePosted": "{{POST_DATE_ISO}}",
  "validThrough": "{{EXPIRY_DATE_ISO}}",
  "employmentType": "{{EMPLOYMENT_TYPE}}",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "{{ORG_NAME}}",
    "sameAs": "{{BASE_URL}}",
    "logo": "{{BASE_URL}}/logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "{{CITY}}",
      "addressRegion": "{{STATE}}",
      "addressCountry": "{{COUNTRY_CODE}}"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "{{CURRENCY_CODE}}",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": "{{MIN_SALARY}}",
      "maxValue": "{{MAX_SALARY}}",
      "unitText": "YEAR"
    }
  },
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "{{COUNTRY}}"
  },
  "jobLocationType": "TELECOMMUTE"
}
```

**Required**: `title`, `description`, `datePosted`, `hiringOrganization`, `jobLocation` (or `applicantLocationRequirements` for remote)
**Recommended**: `baseSalary`, `employmentType`, `validThrough`
**Common errors**: `employmentType` must be one of: `FULL_TIME`, `PART_TIME`, `CONTRACTOR`, `TEMPORARY`, `INTERN`, `VOLUNTEER`, `PER_DIEM`, `OTHER`. `description` should be HTML (not plain text). For remote jobs, include `jobLocationType: "TELECOMMUTE"`.

---

### Review (Standalone)

**Rich result**: Star rating in search results
**Where to place**: Review pages (critic reviews, editorial reviews)

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "{{REVIEWED_ITEM_TYPE}}",
    "name": "{{REVIEWED_ITEM_NAME}}"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "{{RATING}}",
    "bestRating": "{{BEST_RATING}}"
  },
  "author": {
    "@type": "Person",
    "name": "{{REVIEWER_NAME}}"
  },
  "reviewBody": "{{REVIEW_TEXT}}",
  "datePublished": "{{REVIEW_DATE_ISO}}"
}
```

**Note**: Self-serving reviews (reviewing your own product on your own site) violate Google's guidelines and will not generate rich results.

---

## Multi-Entity Pages

When a page contains multiple schema types, you have two options:

### Option 1: Multiple JSON-LD Blocks (Preferred)

```html
<script type="application/ld+json">{ "@context": "https://schema.org", "@type": "Article", ... }</script>
<script type="application/ld+json">{ "@context": "https://schema.org", "@type": "BreadcrumbList", ... }</script>
<script type="application/ld+json">{ "@context": "https://schema.org", "@type": "FAQPage", ... }</script>
```

### Option 2: @graph Array

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Article", "headline": "...", ... },
    { "@type": "BreadcrumbList", "itemListElement": [...] },
    { "@type": "FAQPage", "mainEntity": [...] }
  ]
}
```

Both are valid. Multiple blocks are easier to maintain in component-based architectures. `@graph` is cleaner when generating all schemas in one place.

---

## Schema Inheritance and Nesting

Use `@id` to create relationships between entities:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "{{BASE_URL}}/#organization",
      "name": "{{ORG_NAME}}",
      "url": "{{BASE_URL}}"
    },
    {
      "@type": "WebSite",
      "@id": "{{BASE_URL}}/#website",
      "name": "{{PROJECT_NAME}}",
      "url": "{{BASE_URL}}",
      "publisher": { "@id": "{{BASE_URL}}/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "{{PAGE_URL}}",
      "name": "{{PAGE_TITLE}}",
      "isPartOf": { "@id": "{{BASE_URL}}/#website" }
    }
  ]
}
```

This creates a clear hierarchy: Organization → WebSite → WebPage.

---

## Automated Testing in CI

### Schema Validation Script

```typescript
// scripts/validate-schema.ts
import { readFileSync } from "fs";
import { glob } from "glob";

interface ValidationResult {
  file: string;
  errors: string[];
}

function validateJsonLd(html: string): string[] {
  const errors: string[] = [];
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (!data["@context"]) errors.push("Missing @context");
      if (!data["@type"] && !data["@graph"]) errors.push("Missing @type or @graph");

      // Type-specific validation
      if (data["@type"] === "Article") {
        if (!data.headline) errors.push("Article missing headline");
        if (!data.datePublished) errors.push("Article missing datePublished");
        if (!data.author) errors.push("Article missing author");
      }
      // Add more type-specific checks as needed
    } catch {
      errors.push(`Invalid JSON in JSON-LD block: ${match[1].substring(0, 100)}...`);
    }
  }
  return errors;
}
```

### Google Rich Results Test

- URL: `https://search.google.com/test/rich-results`
- Validates specific schema types against Google's requirements
- Run after every schema change
- Can test a live URL or paste code directly
- Does not validate all schema.org types — only those that produce rich results in Google

### Schema.org Validator

- URL: `https://validator.schema.org/`
- Validates against the full schema.org specification
- More thorough than Google's tool but does not tell you about rich result eligibility

---

## Common Mistakes and Fixes

| Mistake | Impact | Fix |
|---|---|---|
| Schema data does not match visible content | Manual action (spam) | Ensure schema exactly reflects what users see |
| Using `Review` schema for self-reviews | Rich results removed | Only use for third-party/editorial reviews |
| Missing required properties | Rich results not shown | Check required properties for each type |
| Dates not in ISO 8601 | Parsing failure | Use `YYYY-MM-DDTHH:MM:SSZ` format |
| `availability` without full URL | Not recognized | Use `https://schema.org/InStock` not `InStock` |
| Fake or manipulated ratings | Manual action | Only use genuine user ratings |
| JSON syntax errors (trailing commas) | Entire block ignored | Validate JSON before deployment |
| Schema on pages that are noindexed | Wasted effort | Only add schema to indexable pages |
| Duplicate schema types on same page | Confusing signals | One schema type per entity per page |
| Placeholder text left in templates | Incorrect data indexed | Validate no `{{PLACEHOLDER}}` values remain in production |

---

## Cross-References

- Breadcrumb implementation: [site-architecture-for-seo.md](site-architecture-for-seo.md)
- React/Next.js patterns: [rendering-seo.md](rendering-seo.md)
- Master checklist: [technical-seo-checklist.md](technical-seo-checklist.md)
