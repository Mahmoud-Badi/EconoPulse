# Rendering & SEO

How rendering strategy determines what search engines see. This guide consolidates server-side rendering, static generation, JavaScript SEO, framework-specific patterns, and the meta tag / OG image systems.

---

## Rendering Strategy Comparison

| Strategy | Abbreviation | How It Works | SEO Impact | Best For |
|---|---|---|---|---|
| **Static Site Generation** | SSG | HTML generated at build time | Excellent — fully rendered, fast TTFB | Marketing pages, docs, blogs |
| **Server-Side Rendering** | SSR | HTML generated per request on the server | Good — fully rendered, higher TTFB | Dynamic pages with fresh data |
| **Incremental Static Regeneration** | ISR | SSG with background revalidation | Good — fast TTFB with eventual freshness | Frequently updated content |
| **Client-Side Rendering** | CSR | HTML is empty shell; JS renders content | Poor — crawlers may not see content | Auth-gated dashboards only |
| **Dynamic Rendering** | DR | SSR for bots, CSR for users | Acceptable workaround | Legacy SPAs that cannot be rebuilt |
| **Edge Rendering** | Edge SSR | SSR at CDN edge locations | Good — low TTFB globally | Personalized content at scale |
| **Streaming SSR** | Streaming | HTML sent in chunks as it generates | Good — fast TTFB, progressive rendering | Pages with mixed fast/slow data |

### Decision Framework

```
Is the content behind authentication?
  YES → CSR is fine. Add noindex.
  NO → Continue

Does the content change per request?
  NO → Use SSG (or ISR if it changes occasionally)
  YES → Continue

Does it change per user?
  YES → Use Edge SSR or Streaming SSR
  NO → Use SSR or ISR with short revalidation
```

---

## JavaScript SEO Audit Procedure

Googlebot renders JavaScript, but there are delays, timeouts, and edge cases. You must verify that your content is actually visible to crawlers.

### Test 1: View-Source Test

```
1. Navigate to the page in Chrome
2. Right-click → View Page Source (Ctrl+U)
3. Search for your critical content (headings, product descriptions, main text)
4. If the content is NOT in the source: it is client-rendered and at risk
```

This shows what Googlebot sees in its first pass before rendering. Content missing here will only be indexed after Googlebot's rendering queue processes the page.

### Test 2: Google URL Inspection

```
1. Open Google Search Console
2. Enter the URL in the inspection bar
3. Click "Test Live URL"
4. Click "View Tested Page" → "Screenshot" tab
5. Verify all critical content is visible in the screenshot
6. Click "More Info" tab → check for resource loading errors
```

This shows what Googlebot sees after rendering. If content is missing here, it will not be indexed.

### Test 3: Mobile Rendering Check

Google uses mobile-first indexing. Test with mobile user-agent:

```bash
# Fetch page as Googlebot Smartphone
curl -A "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  "{{BASE_URL}}/page" -o rendered.html
```

### Test 4: Disabled JavaScript Test

```
1. Chrome DevTools → Settings → Debugger → Disable JavaScript
2. Reload the page
3. Is critical content still visible?
4. If not, you are fully dependent on Googlebot's rendering queue
```

### Common JavaScript SEO Failures

| Failure | Why It Happens | Fix |
|---|---|---|
| Content invisible without JS | SPA with no SSR | Implement SSR or SSG |
| Links in `onClick` handlers | `<div onClick={() => router.push(...)}>` | Use `<a href="...">` tags |
| Content behind user interaction | Tabs, accordions that load on click | Render all content in HTML, use CSS for show/hide |
| Infinite scroll with no pagination | Googlebot cannot scroll | Add `<a>` links to paginated URLs |
| Meta tags injected by client JS | React Helmet without SSR | Use framework-native metadata (Next.js Metadata API) |
| Hash-based routing | `example.com/#/about` | Use path-based routing |
| Lazy-loaded text content | Content loads on scroll | Only lazy-load images, not text content |

---

## Framework-Specific SEO Implementation

### Next.js App Router

#### Metadata API

```typescript
// app/layout.tsx — global defaults
import type { Metadata } from "next";

const SITE_NAME = "{{PROJECT_NAME}}";
const BASE_URL = "{{BASE_URL}}";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} — {{TAGLINE}}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "{{DEFAULT_DESCRIPTION}}",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "{{LOCALE}}",
  },
  twitter: {
    card: "summary_large_image",
    creator: "{{TWITTER_HANDLE}}",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};
```

```typescript
// app/blog/[slug]/page.tsx — per-page metadata
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title, // Uses template from layout: "Post Title | Site Name"
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
  };
}
```

#### Dynamic OG Image Generation

```typescript
// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "{{PROJECT_NAME}}";
  const description = searchParams.get("description") || "";

  // Load custom font (optional)
  const fontData = await fetch(
    new URL("../../../public/fonts/inter-bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "80px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          fontFamily: "Inter",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2, maxWidth: "80%" }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: 28, marginTop: 20, opacity: 0.9, maxWidth: "70%" }}>
            {description}
          </div>
        )}
        <div style={{ fontSize: 24, marginTop: "auto", opacity: 0.7 }}>
          {{PROJECT_NAME}}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Inter", data: fontData, style: "normal", weight: 700 }],
    }
  );
}
```

#### Sitemap Generation (App Router)

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "{{BASE_URL}}";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic pages (from database/CMS)
  const posts = await getAllPosts();
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}
```

#### Route-Level Rendering Control

```typescript
// app/marketing/page.tsx — force static
export const dynamic = "force-static";
export const revalidate = 3600; // ISR: rebuild every hour

// app/dashboard/page.tsx — force dynamic, no indexing
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

// app/products/[id]/page.tsx — ISR with on-demand revalidation
export const revalidate = 60; // revalidate every 60 seconds
```

---

### Remix

#### Meta Function

```typescript
// app/routes/blog.$slug.tsx
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPost(params.slug!);
  if (!post) throw new Response("Not Found", { status: 404 });
  return json({ post });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Not Found" }];
  const { post } = data;

  return [
    { title: `${post.title} | {{PROJECT_NAME}}` },
    { name: "description", content: post.excerpt },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.excerpt },
    { property: "og:image", content: post.ogImage },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { tagName: "link", rel: "canonical", href: `{{BASE_URL}}/blog/${post.slug}` },
  ];
};
```

#### Loader-Based SEO Data

Remix loaders run server-side, so all data is in the HTML — no JavaScript rendering dependency.

```typescript
// Structured data via loader
export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPost(params.slug!);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
  };
  return json({ post, jsonLd });
}

export default function BlogPost() {
  const { post, jsonLd } = useLoaderData<typeof loader>();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>{/* post content */}</article>
    </>
  );
}
```

---

### Astro

Astro is static-first with zero client-side JS by default. SEO-excellent out of the box.

```astro
---
// src/pages/blog/[slug].astro
import Layout from "../../layouts/Layout.astro";
import { getEntry } from "astro:content";

const { slug } = Astro.params;
const post = await getEntry("blog", slug!);
if (!post) return Astro.redirect("/404");

const { Content } = await post.render();
---

<Layout
  title={`${post.data.title} | {{PROJECT_NAME}}`}
  description={post.data.excerpt}
  ogImage={post.data.ogImage}
  canonical={`{{BASE_URL}}/blog/${slug}`}
>
  <article>
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</Layout>
```

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}
const { title, description, ogImage, canonical } = Astro.props;
const image = ogImage || "{{BASE_URL}}/og-default.png";
---

<html lang="{{LANGUAGE_CODE}}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={canonical} />}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

#### Astro Sitemap

```bash
npx astro add sitemap
```

```typescript
// astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "{{BASE_URL}}",
  integrations: [sitemap()],
});
```

---

### Nuxt

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  site: {
    url: "{{BASE_URL}}",
    name: "{{PROJECT_NAME}}",
  },
  app: {
    head: {
      htmlAttrs: { lang: "{{LANGUAGE_CODE}}" },
    },
  },
});
```

#### useSeoMeta Composable

```typescript
// pages/blog/[slug].vue — <script setup>
const route = useRoute();
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`);

useSeoMeta({
  title: () => `${post.value?.title} | {{PROJECT_NAME}}`,
  description: () => post.value?.excerpt,
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.excerpt,
  ogImage: () => post.value?.ogImage,
  ogType: "article",
  twitterCard: "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: `{{BASE_URL}}/blog/${route.params.slug}` }],
});
```

#### nuxt-simple-sitemap

```bash
npx nuxi module add sitemap
```

Automatically generates sitemap from your pages directory and any dynamic routes you configure.

---

### WordPress

- Use Yoast SEO or Rank Math for meta tags, sitemaps, and schema
- Ensure theme uses proper heading hierarchy (single H1 per page)
- Use a caching plugin (WP Super Cache, W3 Total Cache) for effective SSG behavior
- If using headless WordPress with a frontend framework: apply the framework-specific patterns above
- Ensure REST API responses include SEO fields from the SEO plugin

### Gatsby

```typescript
// gatsby-config.ts
export default {
  siteMetadata: {
    title: "{{PROJECT_NAME}}",
    description: "{{DEFAULT_DESCRIPTION}}",
    siteUrl: "{{BASE_URL}}",
  },
  plugins: [
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
  ],
};
```

Use `gatsby-plugin-react-helmet` or the built-in `<Head>` component (Gatsby 4.19+) for meta tags.

### Static Sites (Hugo, Jekyll, Eleventy)

- These are SSG by default — excellent for SEO
- Ensure meta tags are in the template's `<head>` section
- Use template variables for dynamic meta content
- Generate sitemaps with the framework's built-in sitemap plugin
- Remember: no JavaScript rendering issues since there is no JavaScript

---

## Edge Rendering and SEO

Edge SSR (running server-side rendering at CDN edge locations) provides:

- Low TTFB globally (response generated near the user)
- Full server-rendered HTML (good for crawlers)
- Dynamic personalization without CSR

### SEO Considerations for Edge Rendering

- Googlebot typically hits your origin region — edge latency benefits are mainly for users
- Ensure edge-rendered content is consistent (Googlebot should see the same content as users)
- If personalizing at the edge, serve a canonical, non-personalized version to bots
- Edge functions have execution time limits — keep rendering fast

---

## Hydration Issues and SEO

Hydration mismatches occur when server-rendered HTML does not match what the client JavaScript produces. This causes:

- Visual flicker (content changes after hydration)
- CLS increases (layout shifts from content changes)
- In extreme cases, React will discard server HTML and re-render client-side

### Common Causes

| Cause | Example | Fix |
|---|---|---|
| Date/time rendering | Server: "March 13", Client: "Mar 13" | Format dates consistently or use `suppressHydrationWarning` |
| Browser-only APIs | `window.innerWidth` used during render | Wrap in `useEffect` or check `typeof window` |
| Random IDs | `id={Math.random()}` | Use deterministic IDs |
| User-agent sniffing | Different output for SSR vs browser | Use CSS for responsive behavior, not JS |
| Extension injection | Browser extensions modify DOM before hydration | Cannot fix — but verify your code does not cause mismatches |

### Prevention

```typescript
// Use a client-only wrapper for browser-dependent content
"use client";
import { useEffect, useState } from "react";

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}
```

---

## Meta Tag Template System

Reusable meta tag builder for any framework:

```typescript
// lib/seo.ts
interface PageSEO {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  author?: string;
}

const SITE_NAME = "{{PROJECT_NAME}}";
const BASE_URL = "{{BASE_URL}}";

export function buildMeta(page: PageSEO) {
  const title = `${page.title} | ${SITE_NAME}`;
  const ogImage = page.ogImage || `${BASE_URL}/og-default.png`;

  return {
    title,
    description: page.description,
    canonical: page.canonical || undefined,
    robots: page.noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.canonical,
      type: page.ogType || "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      ...(page.publishedTime && { publishedTime: page.publishedTime }),
      ...(page.author && { authors: [page.author] }),
    },
    twitter: {
      card: "summary_large_image" as const,
      title: page.title,
      description: page.description,
      images: [ogImage],
    },
  };
}
```

---

## Dynamic Rendering (Legacy SPA Fallback)

If you have a legacy SPA that cannot be rebuilt with SSR, dynamic rendering serves pre-rendered HTML to search engine bots while serving the normal SPA to users.

### How It Works

1. A middleware (or CDN rule) detects the user-agent
2. Bot requests are routed to a pre-rendering service (Rendertron, Prerender.io)
3. User requests get the normal SPA

### Implementation

```nginx
# Nginx — route bots to prerender service
location / {
  set $prerender 0;
  if ($http_user_agent ~* "googlebot|bingbot|yandex|baiduspider") {
    set $prerender 1;
  }
  if ($prerender = 1) {
    rewrite .* /render/$scheme://$host$request_uri break;
    proxy_pass https://prerender.{{DOMAIN}};
  }
  # Normal users get the SPA
  try_files $uri /index.html;
}
```

### Caveats

- Google has stated dynamic rendering is a workaround, not a long-term solution
- The pre-rendered version must match what users see (no cloaking)
- Adds infrastructure complexity and potential points of failure
- Prefer migrating to SSR/SSG when feasible

---

## Cross-References

- Core Web Vitals: [core-web-vitals-playbook.md](core-web-vitals-playbook.md)
- Structured data: [structured-data-cookbook.md](structured-data-cookbook.md)
- Crawlability: [crawlability-indexation.md](crawlability-indexation.md)
- Robots and sitemaps: [robots-sitemap-canonical.md](robots-sitemap-canonical.md)
- Master checklist: [technical-seo-checklist.md](technical-seo-checklist.md)
- Quality testing: `08-quality-testing/`
