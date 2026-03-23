# Tech Stack SEO Implementation Guide

> Framework-specific SEO implementation patterns for every major web framework. This guide provides copy-paste-ready code for metadata, sitemaps, robots configuration, dynamic OG images, and rendering control. Use this alongside the strategy documents in `36-seo/strategy/` — that section defines *what* your SEO should achieve; this section defines *how* to implement it in your specific tech stack.

---

## Table of Contents

1. [Meta Tag Builder (Framework-Agnostic)](#meta-tag-builder-framework-agnostic)
2. [OG Tag Builder (Framework-Agnostic)](#og-tag-builder-framework-agnostic)
3. [Next.js (App Router)](#nextjs-app-router)
4. [Remix](#remix)
5. [Astro](#astro)
6. [Nuxt](#nuxt)
7. [Gatsby](#gatsby)
8. [WordPress](#wordpress)
9. [Static Site Generators (Hugo, 11ty, Jekyll)](#static-site-generators)
10. [SPA Frameworks (React, Vue, Angular without SSR)](#spa-frameworks)
11. [Rendering Strategy Decision Matrix](#rendering-strategy-decision-matrix)

---

## Meta Tag Builder (Framework-Agnostic)

A reusable TypeScript utility for constructing meta tags. Import this into any framework's metadata layer.

```typescript
// lib/seo.ts

interface PageSEO {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
  keywords?: string[];
}

const SITE_NAME = "{{PROJECT_NAME}}";
const BASE_URL = "{{BASE_URL}}"; // e.g., https://example.com

export function buildMeta({ title, description, canonical, noIndex, keywords }: PageSEO) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: description.slice(0, 160),
    canonical: canonical || undefined,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    keywords: keywords?.join(", ") || undefined,
  };
}

// Convenience function for common page types
export function buildPageMeta(
  page: "home" | "product" | "blog" | "pricing" | "category",
  overrides: Partial<PageSEO> & { title: string; description: string }
): ReturnType<typeof buildMeta> {
  const defaults: Record<string, Partial<PageSEO>> = {
    home: { title: `${SITE_NAME} - {{TAGLINE}}` },
    product: {},
    blog: {},
    pricing: { title: `Pricing | ${SITE_NAME}` },
    category: {},
  };

  return buildMeta({ ...defaults[page], ...overrides });
}
```

### Per-Page Meta Defaults

| Page | Title Template | Description Length |
|------|---------------|-------------------|
| Home | `{{PROJECT_NAME}} - {{TAGLINE}}` | 150-160 chars |
| Product / Feature | `{{FEATURE}} | {{PROJECT_NAME}}` | 150-160 chars |
| Blog post | `{{POST_TITLE}} | {{PROJECT_NAME}}` | 150-160 chars |
| Pricing | `Pricing | {{PROJECT_NAME}}` | 150-160 chars |
| Category | `{{CATEGORY_NAME}} | {{PROJECT_NAME}}` | 150-160 chars |
| Documentation | `{{DOC_TITLE}} - {{PROJECT_NAME}} Docs` | 150-160 chars |

---

## OG Tag Builder (Framework-Agnostic)

```typescript
// lib/og.ts

interface OGTags {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article" | "product";
  url: string;
  publishedTime?: string;   // ISO 8601 date for articles
  modifiedTime?: string;    // ISO 8601 date for articles
  author?: string;
  section?: string;         // Article section/category
  tags?: string[];          // Article tags
}

const DEFAULT_OG_IMAGE = `{{BASE_URL}}/og-default.png`; // 1200x630 recommended

export function buildOGTags({
  title,
  description,
  image,
  type = "website",
  url,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
}: OGTags) {
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: "{{PROJECT_NAME}}",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        article: {
          publishedTime,
          modifiedTime,
          authors: author ? [author] : undefined,
          section,
          tags,
        },
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "{{TWITTER_HANDLE}}",
      site: "{{TWITTER_HANDLE}}",
    },
  };
}
```

---

## Next.js (App Router)

Next.js App Router (13.4+) has the most comprehensive built-in SEO support of any React framework. The Metadata API replaces the old `next/head` approach entirely.

### Static Metadata

```typescript
// app/pricing/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | {{PROJECT_NAME}}",
  description: "{{PRICING_PAGE_DESCRIPTION}}",
  alternates: {
    canonical: "{{BASE_URL}}/pricing",
  },
  openGraph: {
    title: "Pricing | {{PROJECT_NAME}}",
    description: "{{PRICING_PAGE_DESCRIPTION}}",
    url: "{{BASE_URL}}/pricing",
    siteName: "{{PROJECT_NAME}}",
    images: [
      {
        url: "{{BASE_URL}}/og/pricing.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | {{PROJECT_NAME}}",
    description: "{{PRICING_PAGE_DESCRIPTION}}",
    images: ["{{BASE_URL}}/og/pricing.png"],
  },
};

export default function PricingPage() {
  return <main>{/* page content */}</main>;
}
```

### Dynamic Metadata with generateMetadata

For pages where metadata depends on fetched data (blog posts, product pages, user profiles):

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { getPost } from "@/lib/posts";
import { buildOGTags } from "@/lib/og";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const ogTags = buildOGTags({
    title: post.title,
    description: post.excerpt,
    image: post.ogImage || `{{BASE_URL}}/api/og?title=${encodeURIComponent(post.title)}`,
    type: "article",
    url: `{{BASE_URL}}/blog/${slug}`,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author.name,
    tags: post.tags,
  });

  return {
    title: `${post.title} | {{PROJECT_NAME}}`,
    description: post.excerpt,
    alternates: {
      canonical: `{{BASE_URL}}/blog/${slug}`,
    },
    ...ogTags,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{/* render post */}</article>;
}
```

### Dynamic OG Image Generation

```typescript
// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "{{PROJECT_NAME}}";
  const subtitle = searchParams.get("subtitle") || "";

  // Optionally load custom fonts
  // const fontData = await fetch(new URL("./Inter-Bold.ttf", import.meta.url)).then(
  //   (res) => res.arrayBuffer()
  // );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "60px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "20px",
            padding: "60px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <h1 style={{ fontSize: 56, fontWeight: 800, color: "#1a1a2e", margin: 0 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 28, color: "#4a4a6a", marginTop: 20 }}>{subtitle}</p>
          )}
          <div style={{ display: "flex", alignItems: "center", marginTop: "auto" }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: "#667eea" }}>
              {"{{PROJECT_NAME}}"}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

### sitemap.ts (Static)

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "{{BASE_URL}}",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "{{BASE_URL}}/pricing",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "{{BASE_URL}}/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: "{{BASE_URL}}/docs",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}
```

### sitemap.ts (Dynamic — for blogs, products, large sites)

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const products = await getAllProducts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: "{{BASE_URL}}", lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: "{{BASE_URL}}/pricing", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "{{BASE_URL}}/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `{{BASE_URL}}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `{{BASE_URL}}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...productPages];
}
```

### Multiple Sitemaps (for sites with 50,000+ URLs)

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

// This generates /sitemap.xml as a sitemap index
// pointing to /sitemap/0.xml, /sitemap/1.xml, etc.
export async function generateSitemaps() {
  const totalProducts = await getProductCount();
  const sitemapsNeeded = Math.ceil(totalProducts / 50000);

  return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const start = id * 50000;
  const products = await getProducts({ offset: start, limit: 50000 });

  return products.map((product) => ({
    url: `{{BASE_URL}}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
  }));
}
```

### robots.ts

```typescript
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/auth/", "/search"],
      },
    ],
    sitemap: "{{BASE_URL}}/sitemap.xml",
  };
}
```

### Route-Level Rendering Control

```typescript
// Force static generation (SSG) — best for SEO on content that rarely changes
// app/about/page.tsx
export const dynamic = "force-static";

// ISR with revalidation — good for content that changes periodically
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // revalidate every hour

// Force dynamic rendering (SSR) — for pages with highly dynamic content
// app/dashboard/page.tsx
export const dynamic = "force-dynamic";

// Combine with segment config for fine-grained control
// app/products/[slug]/page.tsx
export const dynamic = "force-static";
export const revalidate = 600; // revalidate every 10 minutes

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}
```

### next-sitemap for Complex Sites

For sites that need more control than the built-in `sitemap.ts` provides:

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
  exclude: ["/api/*", "/admin/*", "/dashboard/*", "/auth/*", "/search"],
  robotsTxtOptions: {
    additionalSitemaps: ["{{BASE_URL}}/server-sitemap.xml"],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/auth/", "/search"],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority per path pattern
    let priority = config.priority;
    if (path === "/") priority = 1.0;
    else if (path.startsWith("/blog/")) priority = 0.6;
    else if (path.startsWith("/products/")) priority = 0.7;
    else if (path === "/pricing") priority = 0.8;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
```

Add to `package.json` scripts: `"postbuild": "next-sitemap"`

### Structured Data Component (Next.js / React)

```typescript
// components/StructuredData.tsx

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage: Organization
export function OrganizationSchema() {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "{{ORG_NAME}}",
        url: "{{BASE_URL}}",
        logo: "{{BASE_URL}}/logo.png",
        sameAs: ["{{TWITTER_URL}}", "{{LINKEDIN_URL}}", "{{GITHUB_URL}}"],
      }}
    />
  );
}

// Usage: Breadcrumbs
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

// Usage: FAQ
export function FAQSchema({
  questions,
}: {
  questions: { q: string; a: string }[];
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }}
    />
  );
}

// Usage: Product
export function ProductSchema({
  name,
  description,
  price,
  currency = "USD",
  image,
  availability = "InStock",
  ratingValue,
  reviewCount,
}: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  ratingValue?: number;
  reviewCount?: number;
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image,
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: currency,
          availability: `https://schema.org/${availability}`,
        },
        ...(ratingValue && reviewCount
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue,
                reviewCount,
              },
            }
          : {}),
      }}
    />
  );
}
```

---

## Remix

Remix handles SEO through its `meta` function export. In Remix v2, the `meta` function returns an array of meta descriptors.

### meta Function (v2 Convention)

```typescript
// app/routes/pricing.tsx
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Pricing | {{PROJECT_NAME}}" },
    { name: "description", content: "{{PRICING_PAGE_DESCRIPTION}}" },
    { name: "robots", content: "index, follow" },
    { tagName: "link", rel: "canonical", href: "{{BASE_URL}}/pricing" },
    // Open Graph
    { property: "og:title", content: "Pricing | {{PROJECT_NAME}}" },
    { property: "og:description", content: "{{PRICING_PAGE_DESCRIPTION}}" },
    { property: "og:url", content: "{{BASE_URL}}/pricing" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "{{BASE_URL}}/og/pricing.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Pricing | {{PROJECT_NAME}}" },
    { name: "twitter:description", content: "{{PRICING_PAGE_DESCRIPTION}}" },
    { name: "twitter:image", content: "{{BASE_URL}}/og/pricing.png" },
  ];
};
```

### Loader-Based Dynamic SEO Data

```typescript
// app/routes/blog.$slug.tsx
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/lib/posts.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPost(params.slug!);
  if (!post) throw new Response("Not Found", { status: 404 });
  return json({ post });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Post Not Found" }];
  }

  const { post } = data;
  return [
    { title: `${post.title} | {{PROJECT_NAME}}` },
    { name: "description", content: post.excerpt },
    { tagName: "link", rel: "canonical", href: `{{BASE_URL}}/blog/${post.slug}` },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.excerpt },
    { property: "og:type", content: "article" },
    { property: "og:url", content: `{{BASE_URL}}/blog/${post.slug}` },
    { property: "og:image", content: post.ogImage || "{{BASE_URL}}/og-default.png" },
    { property: "article:published_time", content: post.publishedAt },
    { property: "article:modified_time", content: post.updatedAt },
    { property: "article:author", content: post.author.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.excerpt },
    { name: "twitter:image", content: post.ogImage || "{{BASE_URL}}/og-default.png" },
  ];
};

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();
  return <article>{/* render post */}</article>;
}
```

### Remix Sitemap Generation

Remix does not have built-in sitemap generation. Use a resource route:

```typescript
// app/routes/sitemap[.]xml.tsx
import type { LoaderFunction } from "@remix-run/node";
import { getAllPosts } from "~/lib/posts.server";

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts();

  const staticUrls = [
    { loc: "{{BASE_URL}}", priority: "1.0", changefreq: "weekly" },
    { loc: "{{BASE_URL}}/pricing", priority: "0.8", changefreq: "monthly" },
    { loc: "{{BASE_URL}}/blog", priority: "0.7", changefreq: "daily" },
  ];

  const postUrls = posts.map((post) => ({
    loc: `{{BASE_URL}}/blog/${post.slug}`,
    lastmod: post.updatedAt || post.publishedAt,
    priority: "0.6",
    changefreq: "monthly",
  }));

  const urls = [...staticUrls, ...postUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
```

### Remix robots.txt

```typescript
// app/routes/robots[.]txt.tsx
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/

Sitemap: {{BASE_URL}}/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: { "Content-Type": "text/plain" },
  });
};
```

---

## Astro

Astro is static-first with optional server-side rendering via "islands." Its content collections and built-in integrations make it excellent for content-heavy SEO sites.

### Content Collections and SEO

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    canonicalUrl: z.string().url().optional(),
    noIndex: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### Astro SEO Component

```astro
---
// src/components/SEO.astro
interface Props {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const {
  title,
  description,
  canonical = Astro.url.href,
  image = "/og-default.png",
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  author,
} = Astro.props;

const fullTitle = title.includes("{{PROJECT_NAME}}")
  ? title
  : `${title} | {{PROJECT_NAME}}`;
const ogImageUrl = new URL(image, "{{BASE_URL}}").href;
---

<!-- Primary Meta Tags -->
<title>{fullTitle}</title>
<meta name="description" content={description} />
<meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
<link rel="canonical" href={canonical} />

<!-- Open Graph -->
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:type" content={type} />
<meta property="og:image" content={ogImageUrl} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="{{PROJECT_NAME}}" />

{type === "article" && publishedTime && (
  <meta property="article:published_time" content={publishedTime} />
)}
{type === "article" && modifiedTime && (
  <meta property="article:modified_time" content={modifiedTime} />
)}
{type === "article" && author && (
  <meta property="article:author" content={author} />
)}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageUrl} />
```

### Blog Post Page with SEO

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from "astro:content";
import SEO from "../../components/SEO.astro";
import BaseLayout from "../../layouts/BaseLayout.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout>
  <SEO
    slot="head"
    title={post.data.title}
    description={post.data.description}
    type="article"
    image={post.data.image}
    publishedTime={post.data.publishDate.toISOString()}
    modifiedTime={post.data.updatedDate?.toISOString()}
    author={post.data.author}
    canonical={post.data.canonicalUrl}
    noIndex={post.data.noIndex}
  />
  <article>
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</BaseLayout>
```

### Built-in Sitemap Integration

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
      changefreq: "weekly",
      priority: 0.7,
      filter: (page) =>
        !page.includes("/admin/") &&
        !page.includes("/api/") &&
        !page.includes("/dashboard/"),
      customPages: ["{{BASE_URL}}/custom-page-not-in-routes"],
      serialize(item) {
        // Custom priority per page
        if (item.url === "{{BASE_URL}}/") {
          item.priority = 1.0;
        }
        if (item.url.includes("/blog/")) {
          item.changefreq = "monthly";
          item.priority = 0.6;
        }
        return item;
      },
    }),
  ],
});
```

### Static-First with Island Architecture

Astro renders everything to static HTML by default. Interactive components ("islands") hydrate only when needed. This approach is inherently SEO-friendly because:

- All content is in the initial HTML (no JavaScript required for rendering)
- Page weight is minimal (no framework JavaScript shipped unless needed)
- Core Web Vitals are excellent by default (no hydration jank, no layout shifts from client rendering)
- Crawlers see the complete page content without executing JavaScript

```astro
---
// src/pages/product.astro
// This page is fully static HTML. The interactive carousel is an island.
import ProductCarousel from "../components/ProductCarousel.tsx";
import ProductSchema from "../components/ProductSchema.astro";
---

<ProductSchema name="Product" price={99.99} />
<h1>Product Name</h1>
<p>Full product description rendered as static HTML — crawlers see everything.</p>

<!-- Only this component ships JavaScript -->
<ProductCarousel client:visible images={images} />
```

---

## Nuxt

Nuxt 3 provides composables for SEO that are tightly integrated with Vue's reactivity system.

### useSeoMeta Composable

```vue
<!-- pages/pricing.vue -->
<script setup lang="ts">
useSeoMeta({
  title: "Pricing | {{PROJECT_NAME}}",
  description: "{{PRICING_PAGE_DESCRIPTION}}",
  ogTitle: "Pricing | {{PROJECT_NAME}}",
  ogDescription: "{{PRICING_PAGE_DESCRIPTION}}",
  ogImage: "{{BASE_URL}}/og/pricing.png",
  ogUrl: "{{BASE_URL}}/pricing",
  ogType: "website",
  ogSiteName: "{{PROJECT_NAME}}",
  twitterCard: "summary_large_image",
  twitterTitle: "Pricing | {{PROJECT_NAME}}",
  twitterDescription: "{{PRICING_PAGE_DESCRIPTION}}",
  twitterImage: "{{BASE_URL}}/og/pricing.png",
  robots: "index, follow",
});
</script>

<template>
  <main>
    <!-- page content -->
  </main>
</template>
```

### Dynamic SEO with useAsyncData

```vue
<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute();
const { data: post } = await useAsyncData(`post-${route.params.slug}`, () =>
  $fetch(`/api/posts/${route.params.slug}`)
);

if (post.value) {
  useSeoMeta({
    title: `${post.value.title} | {{PROJECT_NAME}}`,
    description: post.value.excerpt,
    ogTitle: post.value.title,
    ogDescription: post.value.excerpt,
    ogImage: post.value.ogImage || "{{BASE_URL}}/og-default.png",
    ogType: "article",
    ogUrl: `{{BASE_URL}}/blog/${route.params.slug}`,
    articlePublishedTime: post.value.publishedAt,
    articleModifiedTime: post.value.updatedAt,
    articleAuthor: [post.value.author.name],
    twitterCard: "summary_large_image",
    twitterTitle: post.value.title,
    twitterDescription: post.value.excerpt,
    twitterImage: post.value.ogImage || "{{BASE_URL}}/og-default.png",
  });
}

useHead({
  link: [
    { rel: "canonical", href: `{{BASE_URL}}/blog/${route.params.slug}` },
  ],
});
</script>

<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <div v-html="post.content" />
  </article>
</template>
```

### useHead for Additional Head Elements

```vue
<script setup lang="ts">
// Structured data via useHead
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "{{ORG_NAME}}",
        url: "{{BASE_URL}}",
        logo: "{{BASE_URL}}/logo.png",
      }),
    },
  ],
});
</script>
```

### nuxt-simple-sitemap

```bash
npx nuxi module add nuxt-simple-sitemap
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  site: {
    url: "{{BASE_URL}}",
  },
  sitemap: {
    excludeAppSources: true,
    sources: ["/api/__sitemap__/urls"],
    exclude: ["/admin/**", "/dashboard/**", "/api/**", "/auth/**"],
  },
});
```

```typescript
// server/api/__sitemap__/urls.ts
import { defineSitemapEventHandler } from "#imports";

export default defineSitemapEventHandler(async () => {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.updatedAt || post.publishedAt,
    changefreq: "monthly",
    priority: 0.6,
  }));
});
```

---

## Gatsby

Gatsby uses a plugin ecosystem for SEO. Despite being less actively developed than Next.js, Gatsby sites remain in production and need SEO maintenance.

### gatsby-plugin-sitemap

```javascript
// gatsby-config.js
module.exports = {
  siteMetadata: {
    siteUrl: "{{BASE_URL}}",
    title: "{{PROJECT_NAME}}",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        excludes: ["/admin/*", "/dashboard/*", "/404", "/search"],
        resolveSiteUrl: () => "{{BASE_URL}}",
        resolvePages: ({ allSitePage: { nodes: allPages } }) => {
          return allPages.map((page) => ({ path: page.path }));
        },
        serialize: ({ path }) => ({
          url: path,
          changefreq: path.startsWith("/blog/") ? "monthly" : "weekly",
          priority: path === "/" ? 1.0 : 0.7,
        }),
      },
    },
  ],
};
```

### Gatsby Head API (Gatsby 4.19+)

The Head API replaced `react-helmet` as the recommended approach:

```tsx
// src/pages/pricing.tsx
import type { HeadFC, PageProps } from "gatsby";

export const Head: HeadFC = () => (
  <>
    <title>Pricing | {"{{PROJECT_NAME}}"}</title>
    <meta name="description" content="{{PRICING_PAGE_DESCRIPTION}}" />
    <link rel="canonical" href="{{BASE_URL}}/pricing" />
    <meta property="og:title" content="Pricing | {{PROJECT_NAME}}" />
    <meta property="og:description" content="{{PRICING_PAGE_DESCRIPTION}}" />
    <meta property="og:url" content="{{BASE_URL}}/pricing" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="{{BASE_URL}}/og/pricing.png" />
    <meta name="twitter:card" content="summary_large_image" />
  </>
);

export default function PricingPage({}: PageProps) {
  return <main>{/* page content */}</main>;
}
```

### Dynamic SEO with GraphQL

```tsx
// src/templates/blog-post.tsx
import { graphql, type HeadProps, type PageProps } from "gatsby";

export const Head = ({ data }: HeadProps<Queries.BlogPostQuery>) => {
  const post = data.markdownRemark!;
  return (
    <>
      <title>{`${post.frontmatter!.title} | {{PROJECT_NAME}}`}</title>
      <meta name="description" content={post.frontmatter!.description || post.excerpt || ""} />
      <link rel="canonical" href={`{{BASE_URL}}${post.fields!.slug}`} />
      <meta property="og:title" content={post.frontmatter!.title!} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`{{BASE_URL}}${post.fields!.slug}`} />
      <meta property="article:published_time" content={post.frontmatter!.date!} />
    </>
  );
};

export const query = graphql`
  query BlogPost($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(pruneLength: 160)
      fields { slug }
      frontmatter { title, description, date }
    }
  }
`;

export default function BlogPost({ data }: PageProps<Queries.BlogPostQuery>) {
  const post = data.markdownRemark!;
  return (
    <article>
      <h1>{post.frontmatter!.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html! }} />
    </article>
  );
}
```

---

## WordPress

WordPress powers over 40% of the web. Its SEO ecosystem is mature but requires choosing the right plugin and configuring it correctly.

### Yoast SEO vs Rank Math

| Feature | Yoast SEO (Free) | Yoast SEO (Premium) | Rank Math (Free) | Rank Math (Pro) |
|---------|-----------------|--------------------|-----------------|-----------------|
| **On-page analysis** | 1 focus keyword | Unlimited keywords | 5 focus keywords | Unlimited keywords |
| **Schema markup** | Basic (Article, FAQ, HowTo) | Full schema types | 15+ schema types | 20+ schema types + custom |
| **Redirects** | No | Yes (301/302/410) | Yes (301/302/307/410/451) | Yes + auto-redirect on URL change |
| **XML sitemaps** | Yes | Yes | Yes | Yes + video/news sitemaps |
| **Breadcrumbs** | Yes | Yes | Yes | Yes |
| **Social previews** | Basic | Enhanced | Enhanced | Enhanced |
| **Local SEO** | No | Paid addon ($79/yr) | Basic | Full multi-location |
| **WooCommerce SEO** | No | Paid addon ($79/yr) | Basic | Enhanced |
| **Analytics integration** | No | No | Google Analytics + Search Console | Enhanced analytics |
| **Pricing** | Free | $99/yr per site | Free | $59/yr per site |

**Recommendation:** Rank Math Free covers more ground than Yoast Free. For premium features, Rank Math Pro is more cost-effective. Yoast remains a safe, well-supported choice if you are already using it.

### Custom Post Type SEO

```php
// functions.php — Register a custom post type with SEO-friendly settings
function register_product_post_type() {
    register_post_type('product', [
        'labels' => [
            'name' => 'Products',
            'singular_name' => 'Product',
        ],
        'public' => true,
        'has_archive' => true,          // Creates /products/ archive page
        'rewrite' => [
            'slug' => 'products',        // Clean URL: /products/product-name/
            'with_front' => false,       // Don't prepend /blog/ or whatever front base is
        ],
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'show_in_rest' => true,          // Enable Gutenberg editor
        'taxonomies' => ['product_category'],  // Custom taxonomy for filtering
    ]);
}
add_action('init', 'register_product_post_type');

// Register a custom taxonomy for product categories
function register_product_taxonomy() {
    register_taxonomy('product_category', 'product', [
        'hierarchical' => true,
        'rewrite' => ['slug' => 'product-category'],
        'show_in_rest' => true,
    ]);
}
add_action('init', 'register_product_taxonomy');
```

### WooCommerce SEO Configuration

| Setting | Configuration |
|---------|--------------|
| **Product URLs** | Settings > Permalinks > Product permalinks: `/product/%product_cat%/%postname%/` for category in URL, or `/product/%postname%/` for flat structure |
| **Category URLs** | Settings > Permalinks > Product category base: `product-category` |
| **Breadcrumbs** | WooCommerce > Settings > Site Visibility > Enable breadcrumbs (or use Rank Math/Yoast breadcrumbs) |
| **Product schema** | Automatically generated by WooCommerce. Enhanced by Rank Math/Yoast. Verify with Rich Results Test. |
| **Archive pages** | Ensure product category archive pages have unique descriptions (edit in Products > Categories) |
| **Attachment pages** | Redirect attachment pages to parent post (Rank Math handles this automatically) |
| **Cart/checkout pages** | Noindex via SEO plugin — these should never appear in search results |

---

## Static Site Generators

Hugo, 11ty (Eleventy), and Jekyll generate pure static HTML. They are inherently SEO-friendly — no JavaScript rendering concerns, fast page loads, and complete content in the initial HTML.

### Hugo

```html
<!-- layouts/partials/seo.html -->
{{ $title := .Title }}
{{ $description := .Description | default .Summary | truncate 160 }}
{{ $canonical := .Permalink }}
{{ $image := "" }}
{{ with .Params.image }}
  {{ $image = (printf "%s%s" $.Site.BaseURL .) }}
{{ else }}
  {{ $image = (printf "%s%s" $.Site.BaseURL "og-default.png") }}
{{ end }}

<title>{{ $title }} | {{ .Site.Title }}</title>
<meta name="description" content="{{ $description }}">
<link rel="canonical" href="{{ $canonical }}">
{{ if .Params.noindex }}<meta name="robots" content="noindex, nofollow">{{ end }}

<!-- Open Graph -->
<meta property="og:title" content="{{ $title }}">
<meta property="og:description" content="{{ $description }}">
<meta property="og:url" content="{{ $canonical }}">
<meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
<meta property="og:image" content="{{ $image }}">
<meta property="og:site_name" content="{{ .Site.Title }}">
{{ if .IsPage }}
<meta property="article:published_time" content="{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}">
{{ with .Lastmod }}<meta property="article:modified_time" content="{{ .Format "2006-01-02T15:04:05Z07:00" }}">{{ end }}
{{ end }}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ $title }}">
<meta name="twitter:description" content="{{ $description }}">
<meta name="twitter:image" content="{{ $image }}">
```

Hugo has built-in sitemap generation. Configure in `hugo.toml`:

```toml
[sitemap]
  changefreq = "weekly"
  filename = "sitemap.xml"
  priority = 0.5
```

Frontmatter-based SEO per page:

```yaml
---
title: "How to Build a REST API"
description: "Step-by-step guide to building a production REST API with authentication, rate limiting, and documentation."
date: 2025-03-01
lastmod: 2025-03-10
image: "/images/rest-api-guide.png"
noindex: false
sitemap:
  changefreq: monthly
  priority: 0.8
---
```

### 11ty (Eleventy)

```javascript
// .eleventy.js
module.exports = function (eleventyConfig) {
  // Add a filter for absolute URLs
  eleventyConfig.addFilter("absoluteUrl", (url) => {
    return new URL(url, "{{BASE_URL}}").href;
  });

  return {
    dir: { input: "src", output: "_site" },
  };
};
```

```njk
{# _includes/seo.njk #}
<title>{{ title }} | {{PROJECT_NAME}}</title>
<meta name="description" content="{{ description }}">
<link rel="canonical" href="{{ page.url | absoluteUrl }}">

{% if noindex %}
<meta name="robots" content="noindex, nofollow">
{% endif %}

<meta property="og:title" content="{{ title }}">
<meta property="og:description" content="{{ description }}">
<meta property="og:url" content="{{ page.url | absoluteUrl }}">
<meta property="og:type" content="{% if layout == 'post' %}article{% else %}website{% endif %}">
<meta property="og:image" content="{{ image | default: '/og-default.png' | absoluteUrl }}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ title }}">
<meta name="twitter:description" content="{{ description }}">
<meta name="twitter:image" content="{{ image | default: '/og-default.png' | absoluteUrl }}">
```

For sitemaps, use the `@11ty/eleventy-plugin-sitemap` package or generate one from collections:

```javascript
// src/sitemap.njk
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{%- for page in collections.all %}
{%- if not page.data.noindex %}
  <url>
    <loc>{{ page.url | absoluteUrl }}</loc>
    <lastmod>{{ page.date | dateToRfc3339 }}</lastmod>
  </url>
{%- endif %}
{%- endfor %}
</urlset>
```

### Jekyll

```liquid
<!-- _includes/seo.html -->
<title>{{ page.title }} | {{ site.title }}</title>
<meta name="description" content="{{ page.description | default: page.excerpt | strip_html | truncate: 160 }}">
<link rel="canonical" href="{{ page.url | absolute_url }}">

{% if page.noindex %}
<meta name="robots" content="noindex, nofollow">
{% endif %}

<meta property="og:title" content="{{ page.title }}">
<meta property="og:description" content="{{ page.description | default: page.excerpt | strip_html | truncate: 160 }}">
<meta property="og:url" content="{{ page.url | absolute_url }}">
<meta property="og:type" content="{% if page.layout == 'post' %}article{% else %}website{% endif %}">
<meta property="og:image" content="{{ page.image | default: '/og-default.png' | absolute_url }}">
```

Jekyll generates sitemaps with `jekyll-sitemap` gem. Add to `_config.yml`:

```yaml
plugins:
  - jekyll-sitemap

url: "{{BASE_URL}}"
```

Frontmatter for SEO:

```yaml
---
title: "Guide Title"
description: "Page description for search engines."
image: "/images/guide-og.png"
sitemap:
  lastmod: 2025-03-01
  changefreq: monthly
  priority: 0.8
---
```

---

## SPA Frameworks

Single-page applications (React without Next.js, Vue without Nuxt, Angular without SSR) face fundamental SEO challenges because they render content client-side using JavaScript. Crawlers that do not execute JavaScript see an empty page.

### Why SPAs Struggle with SEO

| Problem | Impact |
|---------|--------|
| **Empty initial HTML** | The server returns `<div id="root"></div>`. Content only appears after JavaScript downloads, parses, and executes. |
| **Googlebot JavaScript rendering** | Google can render JavaScript, but with a delay (seconds to days). Fresh content may not be indexed for days or weeks. |
| **Other crawlers cannot render JS** | Bing's JS rendering is limited. Social media crawlers (Facebook, Twitter, LinkedIn) do not render JS at all — shared links show blank previews. |
| **Core Web Vitals penalty** | Client-side rendering means large JS bundles, slow LCP (content appears only after JS executes), and poor FID/INP (main thread is blocked during hydration). |
| **Crawl budget waste** | Googlebot may need to visit the page twice — once to get the HTML, once to render the JS. For large sites, this doubles crawl budget consumption. |

### Mitigation Strategy 1: Prerendering Service

A prerendering service detects crawler requests (via User-Agent) and serves a pre-rendered HTML snapshot instead of the SPA.

```
User request  →  SPA (normal JavaScript app)
Bot request   →  Prerendering service → Cached HTML snapshot
```

**Prerendering services:**
- **Prerender.io** — hosted service, easiest setup
- **Rendertron** — Google's open-source prerenderer (self-hosted)
- **Prerender-spa-plugin** — webpack plugin for build-time prerendering

**Nginx configuration for prerendering:**

```nginx
location / {
    # Detect bots by User-Agent
    set $prerender 0;
    if ($http_user_agent ~* "googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|linkedinbot|slackbot|whatsapp") {
        set $prerender 1;
    }

    # Don't prerender for already-prerendered requests or static files
    if ($uri ~* "\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|svg|eot)") {
        set $prerender 0;
    }

    if ($prerender = 1) {
        rewrite .* /render/$scheme://$host$request_uri? break;
        proxy_pass http://your-prerender-service:3000;
    }

    # Normal SPA serving
    try_files $uri $uri/ /index.html;
}
```

### Mitigation Strategy 2: Dynamic Rendering

Google's documented approach: serve server-rendered HTML to crawlers and the normal SPA to users. Conceptually identical to prerendering but using Google's terminology and recommended patterns.

```
                    ┌──────────────────┐
                    │   Incoming        │
                    │   Request         │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Is it a bot?     │
                    │  (User-Agent)     │
                    └────────┬─────────┘
                             │
                   ┌─────────┴──────────┐
                   │                    │
              ┌────▼───┐          ┌─────▼────┐
              │  YES   │          │   NO     │
              │  Bot   │          │  User    │
              └────┬───┘          └─────┬────┘
                   │                    │
          ┌────────▼───────┐    ┌───────▼──────┐
          │  Serve          │    │ Serve normal  │
          │  pre-rendered   │    │ SPA           │
          │  HTML           │    │ (index.html)  │
          └────────────────┘    └──────────────┘
```

### Mitigation Strategy 3: Static Site Generation (Hybrid)

For SPAs where most content is known at build time, pre-render pages during the build process:

```javascript
// vite.config.ts (with vite-plugin-ssr or vite-ssg)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build-time pre-rendering for known routes
const prerenderedRoutes = [
  "/",
  "/pricing",
  "/about",
  "/blog",
  // Add all static routes
];

export default defineConfig({
  plugins: [react()],
  // Use a prerendering plugin for your framework
});
```

### Mitigation Strategy 4: Migrate to an SSR Framework

For any SPA where SEO matters, the most reliable long-term solution is migrating to a framework with built-in server-side rendering:

| Current SPA | Migrate To | Effort |
|-------------|-----------|--------|
| React (CRA or Vite) | Next.js | Medium — file-based routing, Metadata API |
| Vue (Vite) | Nuxt 3 | Medium — file-based routing, useSeoMeta |
| Angular | Angular Universal (SSR) | Medium — built-in SSR support |
| Svelte (SvelteKit already has SSR) | SvelteKit | Low — SSR is the default |

### Social Media Preview Fix for SPAs

Even if you solve the Google crawling problem, social media crawlers (Facebook, Twitter, LinkedIn, Slack) do not execute JavaScript. Shared links will show blank previews unless you:

1. Use a prerendering service that serves HTML to social bots
2. Serve static HTML `<meta>` tags from the server (e.g., via server middleware that injects OG tags into the HTML shell before sending it)
3. Use a service like `react-snap` or `prerender-spa-plugin` to generate static HTML for each route at build time

---

## Rendering Strategy Decision Matrix

Choose your rendering strategy based on your SEO requirements:

| Rendering | How It Works | SEO Quality | Best For |
|-----------|-------------|-------------|----------|
| **SSG (Static Site Generation)** | Pages built at compile time as static HTML | Excellent — full HTML, fastest TTFB | Marketing pages, blogs, docs, landing pages |
| **SSR (Server-Side Rendering)** | Pages rendered on the server per request | Very good — full HTML, slightly slower TTFB | Dynamic pages with personalization, frequently changing content |
| **ISR (Incremental Static Regeneration)** | Static pages with background revalidation | Very good — static speed with fresh data | Product pages, content that changes periodically |
| **CSR (Client-Side Rendering)** | Empty HTML, content rendered via JavaScript | Poor — requires JS execution by crawlers | Authenticated dashboards, admin panels, tools behind login |
| **Streaming SSR** | HTML streamed progressively to the client | Good — content appears incrementally | Data-heavy pages where some content loads faster than others |
| **Dynamic Rendering** | SSR for bots, CSR for users | Good — but Google considers it a workaround | Legacy SPAs where migration to SSR is not feasible |

### Decision Flowchart

```
Does this page need to be indexed by search engines?
│
├── NO → Client-side rendering is fine (CSR)
│        Use noindex meta tag.
│
└── YES
    │
    ├── Does the content change per request (user-specific, real-time data)?
    │   │
    │   ├── YES → SSR (server-side render per request)
    │   │
    │   └── NO
    │       │
    │       ├── Does the content change frequently (hourly/daily)?
    │       │   │
    │       │   ├── YES → ISR (static with revalidation)
    │       │   │
    │       │   └── NO → SSG (fully static at build time)
    │       │
    │       └── Are there too many pages to build statically (>50,000)?
    │           │
    │           ├── YES → ISR or on-demand SSR with caching
    │           │
    │           └── NO → SSG
```

**Rule of thumb:** Any page you want indexed by search engines should be SSG or SSR. Reserve client-side rendering for authenticated, non-indexable pages. If you are using a SPA framework and need SEO, migrate to an SSR-capable framework or implement prerendering.

### SSR/SSG Comparison Table

| Factor | SSG | SSR | ISR | CSR |
|--------|-----|-----|-----|-----|
| **TTFB** | Fastest (served from CDN) | Slower (server compute per request) | Fast (cached, revalidated in background) | Fast (empty HTML) |
| **LCP** | Excellent | Good | Excellent | Poor (waits for JS) |
| **Content freshness** | Stale until rebuild | Always fresh | Fresh within revalidation window | Always fresh (client-side) |
| **Build time** | Grows with page count | No build time for pages | Minimal (builds on demand) | No build time |
| **SEO** | Excellent | Very good | Very good | Poor without mitigation |
| **Hosting cost** | Lowest (static files) | Higher (server required) | Medium (CDN + serverless) | Lowest (static files) |

---

## Cross-References

- **Structured data patterns**: `36-seo/technical/structured-data-cookbook.md`
- **Core Web Vitals optimization**: `36-seo/technical/core-web-vitals-playbook.md`
- **Rendering and JavaScript SEO**: `36-seo/technical/rendering-seo.md`
- **Robots, sitemaps, and canonicals**: `36-seo/technical/robots-sitemap-canonical.md`
- **Original code patterns (Section 11)**: `11-new-capabilities/seo-optimization.md`
- **Overall SEO strategy**: `36-seo/strategy/seo-strategy.template.md`
- **E-commerce SEO (product schema)**: `36-seo/specialized/ecommerce-seo.template.md`
- **Local SEO (LocalBusiness schema)**: `36-seo/specialized/local-seo.template.md`
