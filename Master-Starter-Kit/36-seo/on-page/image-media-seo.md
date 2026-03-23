# Image & Media SEO

Images and media are both a ranking opportunity and a performance liability. Done right, they earn traffic from Google Images, improve engagement, enhance accessibility, and support rich results. Done wrong, they tank your Core Web Vitals, fail accessibility audits, and waste crawl budget. This guide covers how to handle images, video, and infographics for maximum SEO value on {{PROJECT_NAME}}.

---

## Table of Contents

1. [Alt Text Writing Guidelines](#alt-text-writing-guidelines)
2. [File Naming Conventions](#file-naming-conventions)
3. [Image Compression](#image-compression)
4. [Lazy Loading](#lazy-loading)
5. [Responsive Images](#responsive-images)
6. [Image Sitemaps](#image-sitemaps)
7. [Google Images Optimization](#google-images-optimization)
8. [Video SEO](#video-seo)
9. [Infographic SEO](#infographic-seo)
10. [Performance Impact](#performance-impact)
11. [Image CDN Recommendations](#image-cdn-recommendations)

---

## Alt Text Writing Guidelines

Alt text serves three purposes: accessibility (screen readers read it aloud), SEO (Google uses it to understand image content), and fallback (displayed when an image fails to load). Every non-decorative image on {{PROJECT_NAME}} needs alt text.

### Writing Rules

**1. Describe the content and function of the image.**

- What is in the image? A person, a chart, a screenshot, a product photo?
- What is the image's function? Is it illustrating a concept, showing a result, demonstrating a UI?

Bad: `alt="image"`
Bad: `alt="photo"`
Good: `alt="Bar chart showing organic traffic growth from 5,000 to 23,000 monthly sessions over 12 months"`
Good: `alt="Screenshot of the Screaming Frog internal links report filtered by orphan pages"`

**2. Keep it under 125 characters.**

Screen readers may truncate or awkwardly break longer alt text. 125 characters is plenty to describe most images. If you need more, the image is probably complex enough to warrant a long description in the surrounding text.

**3. Include the target keyword naturally — when it fits.**

If the page targets "internal linking audit" and the image is a screenshot of an internal linking audit, then `alt="Internal linking audit results showing 12 orphan pages"` naturally includes the keyword. Do not force it.

Bad: `alt="internal linking internal linking strategy internal link"` (keyword stuffing)
Good: `alt="Dashboard showing internal linking metrics for the site audit"`

**4. Do not start with "Image of" or "Picture of."**

Screen readers already announce that the element is an image. Starting with "Image of" is redundant.

Bad: `alt="Image of a website's title tag in the SERP"`
Good: `alt="Title tag displayed in Google search results with the keyword bolded"`

**5. Mark decorative images as decorative.**

Purely decorative images (background textures, spacer images, visual flourishes) should have an empty alt attribute: `alt=""`. This tells screen readers to skip them. Do NOT omit the alt attribute entirely — that causes screen readers to read the filename, which is worse.

### Alt Text Decision Tree

```
Is the image purely decorative?
  YES -> alt=""
  NO  -> Does it contain text?
           YES -> alt text = the text in the image
           NO  -> Does it convey information (chart, diagram, data)?
                    YES -> alt text = summary of the information conveyed
                    NO  -> alt text = brief description of what the image shows
```

### Alt Text Audit

Crawl {{PROJECT_NAME}} with Screaming Frog and filter for images. Export the alt text column. Flag:
- Empty alt text on non-decorative images
- Alt text over 125 characters
- Alt text that is generic ("image," "photo," "banner")
- Alt text that is keyword-stuffed
- Missing alt attributes entirely (different from empty `alt=""`)

---

## File Naming Conventions

Google extracts meaning from image filenames. A descriptive filename reinforces what the image is about.

### Rules

| Rule | Good Example | Bad Example |
|------|-------------|-------------|
| Use descriptive words | `seo-audit-checklist-template.webp` | `IMG_4823.jpg` |
| Separate words with hyphens | `core-web-vitals-report.webp` | `corewebvitalsreport.webp` |
| Use lowercase only | `internal-linking-diagram.webp` | `Internal-Linking-Diagram.webp` |
| Include a keyword when natural | `on-page-seo-title-tag-example.webp` | `screenshot-2.webp` |
| Keep it concise | `orphan-page-detection.webp` | `this-is-a-screenshot-of-how-to-detect-orphan-pages-on-your-website.webp` |
| No special characters | `content-scoring-rubric.webp` | `content_scoring (rubric)!.webp` |

### Renaming Strategy for Existing Images

If {{PROJECT_NAME}} has hundreds of images with `IMG_XXXX.jpg` filenames:

1. Prioritize images on your top 50 pages by traffic
2. Rename the file descriptively
3. Update the `src` attribute in the HTML
4. Set up a 301 redirect from the old image URL to the new one (or let the old URL 404 if no external sites link to it)
5. Update the image sitemap

---

## Image Compression

Uncompressed images are the most common cause of slow page loads. A single 3MB hero image can push LCP past 4 seconds on mobile.

### Format Comparison

| Format | Best For | Typical Compression | Browser Support | Notes |
|--------|----------|--------------------|-----------------|---------|
| **WebP** | General purpose — photos, illustrations, screenshots | 25-35% smaller than JPEG at equivalent quality | All modern browsers (97%+ global support) | The default choice for {{PROJECT_NAME}}. |
| **AVIF** | Photos and complex images | 40-50% smaller than JPEG at equivalent quality | Chrome, Firefox, Opera, Samsung Internet. Safari 16.4+. | Better compression than WebP but slower encoding and narrower support. |
| **JPEG** | Fallback for older browsers | Baseline — the comparison standard | Universal | Use as `<picture>` fallback only. |
| **PNG** | Images requiring transparency, screenshots with text | Large file sizes. Use only when transparency is needed. | Universal | Often overused. Most PNGs should be WebP. |
| **SVG** | Icons, logos, simple illustrations | Vector — infinitely scalable, tiny file sizes | Universal | Not for photos. Perfect for UI elements. |
| **JPEG XL** | Next-gen replacement for JPEG | 60% smaller than JPEG | Very limited (Chrome removed support in 2023, Safari 17+) | Not recommended for production yet. Monitor adoption. |

### Quality Thresholds

| Image Type | WebP Quality Setting | Max File Size Target |
|-----------|---------------------|---------------------|
| Hero / above-the-fold images | 80-85 | Under 150KB |
| Body content images | 75-80 | Under 100KB |
| Thumbnails | 70-75 | Under 30KB |
| Icons / logos | SVG preferred | Under 5KB |

### Compression Tools

| Tool | Type | Notes |
|------|------|-------|
| **Squoosh** (squoosh.app) | Web-based, manual | Best for one-off optimization. Visual quality comparison. Free. |
| **Sharp** (Node.js library) | Build pipeline | Integrate into your build process for automatic compression on deploy. |
| **ImageOptim** (macOS) | Desktop app | Drag-and-drop batch optimization. Free. |
| **TinyPNG / TinyJPG** | Web-based, API available | Batch processing via API. Good for CMS integration. |
| **Cloudflare Polish** | CDN-level | Automatic optimization at the CDN edge. Zero build changes needed. |

### Compression Audit Checklist

- [ ] No image on the site exceeds 200KB without documented justification
- [ ] All photos served as WebP (or AVIF with WebP fallback)
- [ ] PNG used only where transparency is required
- [ ] SVG used for all icons and logos
- [ ] Build pipeline includes automatic image optimization

---

## Lazy Loading

Lazy loading defers the loading of off-screen images until the user scrolls near them. This reduces initial page load time and improves LCP for pages with many images.

### Native Lazy Loading

The simplest implementation — a single HTML attribute:

```html
<img src="content-image.webp" alt="Description" loading="lazy" width="800" height="450">
```

**Browser support:** All modern browsers (97%+ global support). Older browsers that do not support it simply load the image immediately — graceful degradation.

### Critical Rule: Never Lazy-Load the Hero Image

The above-the-fold hero image (the largest image visible without scrolling) should load **eagerly**. Lazy loading it delays LCP because the browser waits for scroll events that never happen for above-the-fold content.

```html
<!-- Hero image: load eagerly, preload for fastest LCP -->
<link rel="preload" as="image" href="hero-image.webp">
<img src="hero-image.webp" alt="Description" loading="eager" width="1200" height="630" fetchpriority="high">

<!-- Below-the-fold images: lazy load -->
<img src="body-image.webp" alt="Description" loading="lazy" width="800" height="450">
```

### IntersectionObserver (Advanced)

For more control over when images load (e.g., loading when 200px away from the viewport instead of the browser's default threshold):

```javascript
const images = document.querySelectorAll('img[data-src]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
}, { rootMargin: '200px 0px' });

images.forEach(img => observer.observe(img));
```

This approach uses `data-src` instead of `src`, loading the image only when the observer fires. Use this only if you need the custom threshold — native `loading="lazy"` is simpler and more performant for most cases.

### Lazy Loading Audit

- [ ] All below-the-fold images have `loading="lazy"`
- [ ] Hero image does NOT have `loading="lazy"`
- [ ] Hero image has `fetchpriority="high"` and a `<link rel="preload">`
- [ ] Lazy-loaded images still have `width` and `height` attributes (CLS prevention)
- [ ] No JavaScript-dependent lazy loading that fails with JS disabled (use native attribute as baseline)

---

## Responsive Images

Serving a 2400px image to a 360px mobile screen wastes bandwidth and hurts performance. Responsive images serve the right size for each device.

### `srcset` and `sizes`

```html
<img
  src="content-image-800.webp"
  srcset="
    content-image-400.webp 400w,
    content-image-800.webp 800w,
    content-image-1200.webp 1200w,
    content-image-1600.webp 1600w
  "
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="Description"
  width="800"
  height="450"
  loading="lazy"
>
```

**How it works:**
- `srcset` tells the browser which image files are available and their widths
- `sizes` tells the browser how wide the image will be displayed at different viewport sizes
- The browser picks the optimal file based on viewport width AND device pixel ratio

### `<picture>` Element for Format Negotiation

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" width="800" height="450" loading="lazy">
</picture>
```

The browser picks the first `<source>` it supports. AVIF-capable browsers get AVIF. WebP-capable browsers get WebP. Everyone else gets JPEG. No JavaScript needed.

### Responsive Image Breakpoints

Generate breakpoints based on actual file size savings, not arbitrary viewport widths:

| Viewport | Typical Image Display Width | Recommended Source Width |
|----------|-----------------------------|------------------------|
| Mobile (< 600px) | Full width (~360-428px) | 400w, 800w (for 2x DPR) |
| Tablet (600-1024px) | Half to full width | 600w, 800w, 1200w |
| Desktop (> 1024px) | Fixed width column | 800w, 1200w, 1600w |

### When to Use Responsive Images

- Hero images (biggest LCP impact)
- Content body images (most numerous)
- Product photos (e-commerce)

When NOT to bother:
- Icons and logos (use SVG)
- Thumbnails under 30KB (overhead of multiple files exceeds savings)

---

## Image Sitemaps

Image sitemaps help Google discover images that might not be found through normal crawling (e.g., images loaded via JavaScript, images on pages blocked by robots.txt, or images on CDN domains).

### When You Need an Image Sitemap

- Images hosted on a CDN with a different domain than your site
- Images loaded dynamically via JavaScript
- You want to ensure specific high-value images are indexed in Google Images
- Your site has a large image gallery or portfolio

### When You Do Not Need One

- All images are in standard `<img>` tags on crawlable HTML pages
- Images are on the same domain
- Google is already indexing your images (check via `site:yourdomain.com` in Google Images)

### Format

Image sitemaps extend the standard sitemap XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://{{DOMAIN}}/page-url/</loc>
    <image:image>
      <image:loc>https://{{DOMAIN}}/images/descriptive-filename.webp</image:loc>
      <image:title>Descriptive title of the image</image:title>
      <image:caption>Optional caption describing the image context</image:caption>
    </image:image>
  </url>
</urlset>
```

You can include up to 1,000 images per `<url>` entry. Submit the image sitemap in Google Search Console alongside your regular sitemap.

---

## Google Images Optimization

Google Images drives significant traffic for visual-heavy industries (travel, food, fashion, home design, tutorials). Even for other industries, ranking in Google Images provides incremental traffic.

### Ranking Factors for Google Images

| Factor | Impact | How to Optimize |
|--------|--------|-----------------|
| **Alt text** | High | Descriptive, keyword-inclusive alt text (covered above) |
| **Surrounding text** | High | Place images near text that discusses the image's subject |
| **Page authority** | High | Images on high-authority pages rank better in Google Images |
| **File name** | Medium | Descriptive, keyword-inclusive filenames |
| **Image quality** | Medium | High-resolution, original images outrank stock photos |
| **Structured data** | Medium | Product, Recipe, Article schema that references the image |
| **Page title** | Medium | Google uses the page title as context for all images on that page |
| **Uniqueness** | High | Original images rank better than stock photos used on 1,000 other sites |

### Google Images Best Practices for {{PROJECT_NAME}}

1. **Use original images whenever possible.** Stock photos are used by thousands of sites. An original screenshot, diagram, or photo has no competition in image search.
2. **Place important images near relevant text.** Google associates images with nearby text content for context.
3. **Use structured data.** Product pages with Product schema, articles with Article schema — Google uses these to display image context in image search results.
4. **Create high-quality images.** Low-resolution, blurry, or small images are deprioritized.
5. **Make images accessible on crawlable pages.** If the page is behind a login wall or blocked by robots.txt, Google cannot index the images.

---

## Video SEO

Video content appears in Google Search (video carousels, featured snippets), Google Video tab, and YouTube (the world's second-largest search engine). Optimizing video for search requires different approaches depending on where the video is hosted.

### VideoObject Schema

Every page with an embedded video should include VideoObject structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "How to Run an On-Page SEO Audit",
  "description": "Step-by-step walkthrough of auditing title tags, meta descriptions, headings, and internal links for a single page.",
  "thumbnailUrl": "https://{{DOMAIN}}/images/seo-audit-video-thumb.webp",
  "uploadDate": "2026-01-15",
  "duration": "PT8M32S",
  "contentUrl": "https://{{DOMAIN}}/videos/on-page-seo-audit.mp4",
  "embedUrl": "https://{{DOMAIN}}/blog/on-page-seo-guide/",
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": { "@type": "WatchAction" },
    "userInteractionCount": 4520
  }
}
```

### Video Sitemaps

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://{{DOMAIN}}/blog/on-page-seo-guide/</loc>
    <video:video>
      <video:thumbnail_loc>https://{{DOMAIN}}/images/seo-audit-video-thumb.webp</video:thumbnail_loc>
      <video:title>How to Run an On-Page SEO Audit</video:title>
      <video:description>Step-by-step walkthrough of auditing a page for SEO.</video:description>
      <video:content_loc>https://{{DOMAIN}}/videos/on-page-seo-audit.mp4</video:content_loc>
      <video:duration>512</video:duration>
    </video:video>
  </url>
</urlset>
```

### Self-Hosted vs YouTube vs Both

| Approach | Pros | Cons |
|----------|------|------|
| **Self-hosted only** | You own all traffic. Video SEO benefits your domain. Full control over player and UX. | Hosting costs. No YouTube discovery. Video encoding complexity. |
| **YouTube only** | Free hosting. YouTube's discovery algorithm. YouTube SEO benefits. | Traffic goes to YouTube, not your site. Google may show the YouTube version instead of your page. |
| **Both (recommended)** | Maximum discovery. YouTube for awareness, embedded on your site for engagement. | Risk of Google showing YouTube version in web SERPs instead of your page. |

**Recommended approach for {{PROJECT_NAME}}:** Upload to YouTube for discovery. Embed the YouTube video on your page. Add VideoObject schema pointing to YOUR page as the `embedUrl`. This tells Google the video lives on your site, even though YouTube hosts the file.

### YouTube SEO Essentials

- **Title:** Target keyword at the beginning. Under 60 characters.
- **Description:** First 150 characters appear in YouTube search results. Include the keyword, a summary, and a link to the relevant page on {{PROJECT_NAME}}.
- **Tags:** Include the primary keyword, variations, and related topics.
- **Chapters:** Add timestamps in the description for chapter markers. These appear in search results and improve engagement.
- **Thumbnail:** Custom thumbnail with text overlay. High contrast. Faces increase CTR.
- **Captions/subtitles:** Upload an accurate transcript. YouTube auto-captions are unreliable. Captions improve accessibility and provide additional text for Google to index.

---

## Infographic SEO

Infographics can be powerful link-building assets when done correctly. They also rank in Google Images and drive social shares.

### Creating Link-Worthy Infographics

1. **Original data or unique analysis.** An infographic that visualizes publicly available data is forgettable. An infographic based on your own research, survey, or unique analysis gives people a reason to cite (and link to) you.
2. **Clear, scannable design.** Dense infographics with tiny text fail on every screen size.
3. **Specific topic focus.** "The State of SEO" is too broad. "How Google's Rendering Changed from 2020-2026" is specific enough to attract a niche audience who will share it.

### Embed Codes for Backlinks

Provide an embed code below each infographic so other sites can easily republish it — with a backlink to your page:

```html
<!-- Embed code for other sites to copy -->
<a href="https://{{DOMAIN}}/blog/on-page-seo-infographic/">
  <img src="https://{{DOMAIN}}/images/on-page-seo-infographic.webp"
       alt="On-Page SEO Checklist Infographic by {{PROJECT_NAME}}"
       width="800" height="3200">
</a>
<p>Source: <a href="https://{{DOMAIN}}/blog/on-page-seo-infographic/">
  {{PROJECT_NAME}} — On-Page SEO Checklist
</a></p>
```

The key: the embed code includes a link back to your page. When someone embeds the infographic, you earn a backlink automatically.

### Text Transcription

Infographics are images — Google cannot read the text inside them. Provide a full text transcription below the infographic on the same page. This:

- Makes the content accessible to screen readers
- Gives Google indexable text content for the page
- Provides an alternative for users on slow connections or small screens where the infographic is hard to read

---

## Performance Impact

Images are typically the largest contributor to total page weight and the most common cause of poor LCP scores.

### Images and LCP

Largest Contentful Paint (LCP) measures when the largest visible element finishes rendering. On most pages, the largest element is an image — usually the hero image.

**How to optimize hero image LCP:**

1. **Preload the hero image:**
   ```html
   <link rel="preload" as="image" href="hero.webp" fetchpriority="high">
   ```

2. **Do not lazy load it.** The hero image must load immediately.

3. **Serve the smallest file that looks good.** Compress aggressively. Use WebP or AVIF. Size the image to the actual display dimensions, not larger.

4. **Avoid CSS background images for LCP elements.** The browser discovers `<img>` tags during HTML parsing. CSS background images are not discovered until the CSS is parsed and the element is laid out — adding latency.

5. **Use `fetchpriority="high"`.** Tells the browser this image is critical and should be prioritized in the loading queue.

### Images and CLS

Cumulative Layout Shift (CLS) measures how much the page layout shifts during loading. Images without explicit dimensions are the most common cause:

1. Browser encounters `<img>` without `width`/`height`
2. Browser allocates 0px height for the image
3. Image loads, and the browser suddenly allocates 450px height
4. Everything below the image shifts down 450px
5. CLS score spikes

**The fix:** Always include `width` and `height` attributes on `<img>` tags:

```html
<img src="image.webp" alt="Description" width="800" height="450" loading="lazy">
```

The browser uses the width/height ratio to reserve space before the image loads, preventing layout shift.

### Performance Budget for Images

| Metric | Target |
|--------|--------|
| Total image weight per page | Under 500KB (ideally under 300KB) |
| Single largest image | Under 150KB |
| Hero image LCP contribution | Under 1.5s on 4G mobile |
| Images causing CLS | Zero (all images have explicit dimensions) |

---

## Image CDN Recommendations

An image CDN serves optimized images from edge servers close to the user, automatically handling format conversion, resizing, and compression.

### When to Use an Image CDN

- Your site serves images to a global audience
- You have hundreds or thousands of images to optimize
- You want automatic WebP/AVIF conversion without build pipeline changes
- You need on-the-fly image resizing (responsive images without pre-generating multiple sizes)

### Options

| CDN | Key Feature | Pricing Model | Notes |
|-----|-------------|---------------|-------|
| **Cloudflare Images** | Integrated with Cloudflare CDN, automatic optimization via Polish | Per-image storage + delivery | Best if you already use Cloudflare. |
| **Cloudinary** | On-the-fly transformations (resize, crop, format, quality) via URL parameters | Free tier (25 credits/month), paid plans scale | Most flexible transformation API. Popular with developers. |
| **Imgix** | Real-time image processing, CDN delivery | Per-origin image + bandwidth | Enterprise-focused. Powerful URL-based API. |
| **Bunny CDN (Bunny Optimizer)** | Simple, affordable image optimization and CDN delivery | Per-bandwidth pricing (very cheap) | Best value for small-to-medium sites. |
| **Vercel Image Optimization** | Built-in for Next.js projects via `next/image` | Included in Vercel hosting plans | Zero-config if you are already on Vercel/Next.js. |

### Implementation Pattern

Most image CDNs work by proxying your image URLs through their transformation endpoint:

```
Original: https://{{DOMAIN}}/images/hero.jpg
CDN URL:  https://cdn.example.com/{{DOMAIN}}/images/hero.jpg?w=800&f=webp&q=80
```

Parameters control width (`w`), format (`f`), quality (`q`), and more. The CDN caches the transformed image at the edge.

### Recommended Approach for {{PROJECT_NAME}}

- **Static site or JAMstack:** Use the build pipeline (Sharp/imagemin) to pre-generate optimized images at build time. Add a CDN (Cloudflare, Bunny) for delivery.
- **Dynamic CMS (WordPress, etc.):** Use Cloudinary or Imgix for on-the-fly transformation. No build step needed.
- **Next.js / Vercel:** Use the built-in `next/image` component with Vercel's image optimization. Zero configuration.
- **E-commerce with thousands of product images:** Cloudinary or Imgix for URL-based transformations. Pre-generating variants for 50,000 products is impractical.
