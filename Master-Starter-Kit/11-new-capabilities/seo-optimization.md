# SEO Optimization

> **MOVED:** This file's content has been migrated and significantly expanded in the dedicated SEO section.
>
> **New locations:**
> - `36-seo/specialized/tech-stack-seo.md` — Framework-specific SEO (Next.js, Remix, Astro, Nuxt, WordPress, Gatsby, SPAs)
> - `36-seo/technical/rendering-seo.md` — SSR/SSG/CSR/ISR implications, meta tag systems, OG image generation
> - `36-seo/technical/structured-data-cookbook.md` — JSON-LD components and templates
> - `36-seo/technical/robots-sitemap-canonical.md` — Sitemap generation, robots.txt config
>
> Start with `36-seo/README.md` for the full reading order.

## Purpose

Configure technical SEO foundations so every page is discoverable, shareable, and performant. This guide provides templates and patterns that work across Next.js, Remix, and static sites.

## Meta Tag Template System

```typescript
// lib/seo.ts
interface PageSEO {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
}

const SITE_NAME = "{{PROJECT_NAME}}";
const BASE_URL = "{{BASE_URL}}"; // e.g., https://example.com

export function buildMeta({ title, description, canonical, noIndex }: PageSEO) {
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    canonical: canonical || undefined,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
  };
}
```

### Next.js App Router (Metadata API)

```typescript
// app/pricing/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | {{PROJECT_NAME}}",
  description: "{{PRICING_PAGE_DESCRIPTION}}",
  alternates: { canonical: "{{BASE_URL}}/pricing" },
};
```

### Per-Page Meta Defaults

| Page        | Title Template                      | Description Length |
| ----------- | ----------------------------------- | ------------------ |
| Home        | `{{PROJECT_NAME}} - {{TAGLINE}}`    | 150-160 chars      |
| Product     | `{{FEATURE}} | {{PROJECT_NAME}}`    | 150-160 chars      |
| Blog post   | `{{POST_TITLE}} | {{PROJECT_NAME}}` | 150-160 chars      |
| Pricing     | `Pricing | {{PROJECT_NAME}}`        | 150-160 chars      |

## Dynamic Open Graph / Social Sharing Tags

```typescript
// lib/og.ts
interface OGTags {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  url: string;
}

export function buildOGTags({ title, description, image, type = "website", url }: OGTags) {
  const ogImage = image || `{{BASE_URL}}/og-default.png`; // 1200x630 recommended
  return {
    openGraph: { title, description, url, type, images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}
```

### Dynamic OG Image Generation (Next.js)

```typescript
// app/api/og/route.tsx
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "{{PROJECT_NAME}}";

  return new ImageResponse(
    <div style={{ display: "flex", fontSize: 48, background: "#fff", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
      <h1>{title}</h1>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

## Sitemap Generation

### Using next-sitemap (Next.js)

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
  exclude: ["/api/*", "/admin/*", "/dashboard/*"],
  robotsTxtOptions: {
    additionalSitemaps: ["{{BASE_URL}}/server-sitemap.xml"],
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/dashboard/"] },
    ],
  },
};
```

Add to `package.json` scripts: `"postbuild": "next-sitemap"`.

## robots.txt Configuration

```
# public/robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/

Sitemap: {{BASE_URL}}/sitemap.xml
```

## Structured Data (JSON-LD) Templates

```typescript
// components/StructuredData.tsx
export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "{{ORG_NAME}}",
    url: "{{BASE_URL}}",
    logo: "{{BASE_URL}}/logo.png",
    sameAs: ["{{TWITTER_URL}}", "{{LINKEDIN_URL}}", "{{GITHUB_URL}}"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ProductSchema({ name, description, price, currency = "USD" }: {
  name: string; description: string; price: number; currency?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    offers: { "@type": "Offer", price, priceCurrency: currency, availability: "https://schema.org/InStock" },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem", position: i + 1, name: item.name, item: item.url,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function FAQSchema({ questions }: { questions: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({
      "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

## Image Alt Text Guidelines

- Every `<img>` must have an `alt` attribute. Decorative images use `alt=""`.
- Describe the content and function, not the file name. Good: `alt="Dashboard showing monthly revenue chart"`. Bad: `alt="screenshot1.png"`.
- Keep alt text under 125 characters.
- Include keywords naturally but never stuff them.

## URL Structure Best Practices

- Use lowercase, hyphen-separated slugs: `/blog/my-post-title`.
- Keep URLs short and descriptive: prefer `/pricing` over `/pages/pricing-information-page`.
- Avoid query parameters for indexable content; use path segments instead.
- Implement canonical URLs for pages accessible via multiple paths.
- Use 301 redirects (not 302) for permanent URL changes.

## Performance Optimization for Core Web Vitals

| Metric | Target  | Key Fixes                                           |
| ------ | ------- | --------------------------------------------------- |
| LCP    | < 2.5s  | Optimize hero image, preload fonts, SSR/SSG         |
| INP    | < 200ms | Reduce JS bundle, avoid long tasks, use transitions |
| CLS    | < 0.1   | Set explicit image dimensions, avoid layout shifts   |

```html
<!-- Preload critical assets -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/hero.webp" as="image" />
```

## SSR / SSG Considerations for SEO

| Rendering    | Best For                     | SEO Impact                        |
| ------------ | ---------------------------- | --------------------------------- |
| SSG          | Marketing pages, blog posts  | Best: fully rendered at build     |
| SSR          | Dynamic pages with fresh data| Good: rendered per request        |
| ISR          | Frequently updated content   | Good: cached with revalidation    |
| Client-only  | Authenticated dashboards     | Poor: no content for crawlers     |

**Rule of thumb**: Any page you want indexed by search engines should be SSG or SSR. Reserve client-side rendering for authenticated, non-indexable pages.

```typescript
// Next.js: Force static generation for marketing pages
// app/about/page.tsx
export const dynamic = "force-static";
export const revalidate = 3600; // ISR: revalidate every hour
```
