# Content Optimization Scoring for {{PROJECT_NAME}}

> Weighted scoring rubric for evaluating whether a page is SEO-ready. Score every page before publishing and re-score during quarterly audits. A page that scores below a B should not be promoted or expected to rank.

---

## Page Under Review

| Field | Value |
|-------|-------|
| **Page URL** | {{PAGE_URL}} |
| **Target keyword** | {{TARGET_KEYWORD}} |
| **Secondary keywords** | {{SECONDARY_KEYWORDS}} |
| **Page type** | {{PAGE_TYPE}} |
| **Reviewer** | ________________ |
| **Date** | ________________ |

---

## Scoring System

Each dimension is scored 0-3:

| Score | Meaning | Description |
|-------|---------|-------------|
| **3** | Excellent | Exceeds best practices. Competitive advantage. |
| **2** | Good | Meets best practices. No improvement needed for launch. |
| **1** | Weak | Below best practices. Will hurt rankings or engagement. Fix before publishing. |
| **0** | Missing / Failing | Not present or fundamentally broken. Must fix before publishing. |

**Total possible score: 30 points.**

---

## Dimension 1: Primary Keyword Targeting

**Weight: Core — this is the foundation of on-page SEO.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| Keyword in title tag | {{TARGET_KEYWORD}} appears in the title tag, ideally in the first half | ___ |
| Keyword in H1 | The H1 contains {{TARGET_KEYWORD}} or a close semantic variant | ___ |
| Keyword in URL | The URL slug contains the keyword or a shortened version | ___ |
| Keyword in first 100 words | {{TARGET_KEYWORD}} appears naturally in the opening paragraph | ___ |

**Scoring guide:**
- **3** — Keyword in all four locations, front-loaded in title, natural usage everywhere
- **2** — Keyword in 3 of 4 locations, or all 4 but phrasing feels forced
- **1** — Keyword in only 1-2 locations, or stuffed unnaturally
- **0** — Keyword absent from title, H1, and URL

**Score: ___ / 3**

---

## Dimension 2: Secondary Keyword Integration

**Weight: Reinforces topical authority and long-tail coverage.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| H2s contain secondary keywords | At least 2 H2s naturally incorporate secondary keyword variants | ___ |
| Body content usage | Secondary keywords appear 2-4 times each in body content | ___ |
| Natural phrasing | Keywords read as natural language, not forced insertions | ___ |
| Semantic coverage | Related terms and synonyms appear throughout (TF-IDF relevant) | ___ |

**Scoring guide:**
- **3** — 3+ secondary keywords woven naturally into H2s and body; semantic coverage matches or exceeds SERP competitors
- **2** — 2-3 secondary keywords present, natural usage, minor gaps in semantic coverage
- **1** — Only 1 secondary keyword present, or usage feels forced
- **0** — No secondary keywords; page targets only the primary keyword

**Score: ___ / 3**

---

## Dimension 3: Content Depth vs SERP Competitors

**Weight: Google rewards comprehensiveness. Thin content does not rank for competitive keywords.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| Word count vs top 3 results | Compare your page's word count to the average of the top 3 organic results | ___ |
| Topic coverage | List the subtopics covered by the top 3 results. Does your page cover them all? | ___ |
| Unique value | Does your page offer something no current top-3 result provides? (Original data, deeper analysis, unique examples, better tools) | ___ |

**Scoring guide:**
- **3** — Word count matches or exceeds top 3 average; covers all subtopics they cover plus additional unique value
- **2** — Word count within 80% of top 3 average; covers most subtopics; some unique value
- **1** — Significantly shorter than competitors; missing major subtopics; no unique value
- **0** — Thin content (under 300 words for informational pages, or under 50% of competitor average)

**Competitor comparison (fill in during audit):**

| Page | Word Count | Subtopics Covered | Unique Elements |
|------|-----------|-------------------|-----------------|
| Your page ({{PAGE_URL}}) | ___ | ___ | ___ |
| SERP #1: _______________ | ___ | ___ | ___ |
| SERP #2: _______________ | ___ | ___ | ___ |
| SERP #3: _______________ | ___ | ___ | ___ |

**Score: ___ / 3**

---

## Dimension 4: Readability & Formatting

**Weight: Directly impacts dwell time, which indirectly impacts rankings.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| Average sentence length | Under 20 words per sentence on average | ___ |
| Paragraph length | No paragraph exceeds 4 sentences or ~100 words | ___ |
| Formatting elements | Uses bullet lists, numbered lists, tables, bold text, and/or callout boxes to break up content | ___ |
| Heading frequency | A heading (H2-H4) appears at least every 300 words | ___ |
| Scanability | A reader skimming only headings and bold text can understand the page's main points | ___ |

**Scoring guide:**
- **3** — Short sentences, short paragraphs, rich formatting, frequent headings. Page is a pleasure to scan and read.
- **2** — Mostly good formatting with occasional dense paragraphs. Minor improvements possible.
- **1** — Long paragraphs, infrequent headings, minimal formatting. Feels like a wall of text.
- **0** — Single block of unformatted text. No headings, no lists, no formatting aids.

**Score: ___ / 3**

---

## Dimension 5: Internal Linking

**Weight: Distributes link equity and helps crawlers discover related pages.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| Outbound internal link count | Page contains 3-5 internal links to related pages | ___ |
| Anchor text quality | Anchors are descriptive and keyword-relevant (not "click here") | ___ |
| Contextual placement | Links appear within body content where topically relevant | ___ |
| Pillar page linkage | If part of a topic cluster, links to the pillar page | ___ |
| Inbound internal links | At least 2-3 existing pages link to this page | ___ |

**Scoring guide:**
- **3** — 4+ contextual internal links with keyword-rich anchors; pillar page linked; 3+ inbound internal links confirmed
- **2** — 3 internal links with decent anchors; mostly contextual; at least 1 inbound link planned
- **1** — 1-2 internal links, generic anchors, or links placed only in footer/sidebar
- **0** — No internal links, or page is an orphan with zero inbound internal links

**Score: ___ / 3**

---

## Dimension 6: External Link Quality

**Weight: Citing authoritative sources increases E-E-A-T signals and trust.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| External links present | Page links to at least 2 authoritative external sources | ___ |
| Source quality | Linked sources are reputable (industry publications, official docs, peer-reviewed, original research) | ___ |
| Relevance | External links are topically relevant and add value for the reader | ___ |
| Functioning links | All external links resolve to 200-status pages (no 404s, no paywalls) | ___ |

**Scoring guide:**
- **3** — 3+ high-quality external citations to authoritative sources; all relevant and functioning
- **2** — 2 external links to good sources; all functioning
- **1** — 1 external link, or links to low-quality sources
- **0** — No external links, or broken external links

**Score: ___ / 3**

---

## Dimension 7: Structured Data

**Weight: Enables rich results (stars, FAQs, breadcrumbs, how-tos) which dramatically increase CTR.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| Schema type present | Appropriate schema for the page type (Article, Product, FAQ, HowTo, BreadcrumbList) | ___ |
| Validation | Schema passes Google Rich Results Test with zero errors | ___ |
| Completeness | All recommended (not just required) properties are populated | ___ |
| Breadcrumbs | BreadcrumbList schema present on all interior pages | ___ |

**Scoring guide:**
- **3** — Correct schema type with all recommended properties; passes validation; breadcrumbs present
- **2** — Correct schema type with required properties; passes validation; minor omissions in recommended fields
- **1** — Schema present but has validation warnings or missing required properties
- **0** — No structured data on the page

**Score: ___ / 3**

---

## Dimension 8: Mobile Rendering Quality

**Weight: Google uses mobile-first indexing. If the mobile version is broken, the page will not rank.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| Responsive rendering | Page renders correctly at 360px, 390px, and 428px viewports | ___ |
| No horizontal scroll | No content overflows the viewport | ___ |
| Tap targets | All buttons and links have at least 44x44px hit areas with 8px spacing | ___ |
| Font size | Body text is at least 16px. No text requires pinch-to-zoom. | ___ |
| Content parity | All content visible on desktop is also visible on mobile (no hidden-by-default sections) | ___ |

**Scoring guide:**
- **3** — Perfect mobile rendering; correct tap targets; full content parity; excellent mobile UX
- **2** — Good mobile rendering with minor issues (e.g., one slightly small tap target)
- **1** — Functional but problematic (horizontal scroll on some elements, small fonts, collapsed content)
- **0** — Broken mobile layout; unreadable; inaccessible

**Score: ___ / 3**

---

## Dimension 9: Page Speed (Core Web Vitals)

**Weight: Ranking factor since 2021. Poor speed = poor rankings AND poor user experience.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| LCP (Largest Contentful Paint) | Under 2.5s on mobile (75th percentile) | ___ |
| INP (Interaction to Next Paint) | Under 200ms on mobile (75th percentile) | ___ |
| CLS (Cumulative Layout Shift) | Under 0.1 on mobile (75th percentile) | ___ |

**Scoring guide:**
- **3** — All three CWV metrics are "Good" (green) in PageSpeed Insights and CrUX data
- **2** — Two metrics are "Good," one is "Needs Improvement" (yellow)
- **1** — One or more metrics are "Needs Improvement," but none are "Poor"
- **0** — Any metric is "Poor" (red) — LCP > 4s, INP > 500ms, or CLS > 0.25

**Test URL:** Run PageSpeed Insights on the actual page URL, not just the homepage.

**Score: ___ / 3**

---

## Dimension 10: Media Optimization

**Weight: Images and video affect page speed, accessibility, and engagement.**

| Criteria | What to Check | Score (0-3) |
|----------|---------------|-------------|
| Alt text | All non-decorative images have descriptive alt text (under 125 chars) | ___ |
| Image compression | Images served in WebP/AVIF; no single image over 200KB without justification | ___ |
| Explicit dimensions | All `<img>` tags have width and height attributes (CLS prevention) | ___ |
| Lazy loading | Below-the-fold images use `loading="lazy"`; hero image is eager | ___ |
| Descriptive filenames | Files named descriptively (`seo-checklist-screenshot.webp` not `IMG_4823.jpg`) | ___ |
| Video (if applicable) | Video has VideoObject schema, descriptive title, transcript or captions | ___ |

**Scoring guide:**
- **3** — All images optimized (alt text, compression, dimensions, filenames); video has schema and captions
- **2** — Most images optimized; minor gaps (one missing alt text, one oversized image)
- **1** — Multiple images missing alt text, several uncompressed, or no lazy loading
- **0** — No alt text on any image, uncompressed PNGs/JPEGs, no dimensions set

**Score: ___ / 3**

---

## Score Summary

| # | Dimension | Score | Max |
|---|-----------|-------|-----|
| 1 | Primary keyword targeting | ___ | 3 |
| 2 | Secondary keyword integration | ___ | 3 |
| 3 | Content depth vs SERP competitors | ___ | 3 |
| 4 | Readability & formatting | ___ | 3 |
| 5 | Internal linking | ___ | 3 |
| 6 | External link quality | ___ | 3 |
| 7 | Structured data | ___ | 3 |
| 8 | Mobile rendering quality | ___ | 3 |
| 9 | Page speed (Core Web Vitals) | ___ | 3 |
| 10 | Media optimization | ___ | 3 |
| | **TOTAL** | **___** | **30** |

---

## Grade Thresholds

| Grade | Score | Interpretation | Action |
|-------|-------|----------------|--------|
| **A** | 27-30 | Excellent. Competitive with top SERP results. | Publish. Monitor rankings and iterate. |
| **B** | 22-26 | Good. Ready to publish with minor optimizations on the horizon. | Publish. Schedule improvements for lowest-scoring dimensions within 2 weeks. |
| **C** | 16-21 | Below average. Will struggle to rank for competitive keywords. | Hold publication. Fix all dimensions scoring 0-1 before publishing. |
| **D** | 10-15 | Poor. Significant gaps across multiple dimensions. | Do not publish. Requires substantial rework. |
| **F** | 0-9 | Failing. Page is not SEO-ready by any measure. | Do not publish. Start over with the on-page checklist. |

**This page's grade: ___**

---

## Action Items

Based on the lowest-scoring dimensions, generate specific remediation tasks:

### Priority 1: Dimensions Scoring 0 (Fix Immediately)

| Dimension | Current Score | Specific Issue | Remediation Task | Owner | Due Date |
|-----------|---------------|----------------|-----------------|-------|----------|
| ___ | 0 | ___ | ___ | ___ | ___ |
| ___ | 0 | ___ | ___ | ___ | ___ |

### Priority 2: Dimensions Scoring 1 (Fix Before Publishing)

| Dimension | Current Score | Specific Issue | Remediation Task | Owner | Due Date |
|-----------|---------------|----------------|-----------------|-------|----------|
| ___ | 1 | ___ | ___ | ___ | ___ |
| ___ | 1 | ___ | ___ | ___ | ___ |

### Priority 3: Dimensions Scoring 2 (Improve Within 2 Weeks)

| Dimension | Current Score | Specific Issue | Remediation Task | Owner | Due Date |
|-----------|---------------|----------------|-----------------|-------|----------|
| ___ | 2 | ___ | ___ | ___ | ___ |
| ___ | 2 | ___ | ___ | ___ | ___ |

---

## Competitor Comparison Summary

Score the top 3 SERP results using the same rubric to understand what you are competing against:

| Dimension | Your Page | SERP #1 | SERP #2 | SERP #3 |
|-----------|-----------|---------|---------|---------|
| 1. Primary keyword targeting | ___ | ___ | ___ | ___ |
| 2. Secondary keyword integration | ___ | ___ | ___ | ___ |
| 3. Content depth | ___ | ___ | ___ | ___ |
| 4. Readability & formatting | ___ | ___ | ___ | ___ |
| 5. Internal linking | ___ | ___ | ___ | ___ |
| 6. External link quality | ___ | ___ | ___ | ___ |
| 7. Structured data | ___ | ___ | ___ | ___ |
| 8. Mobile rendering | ___ | ___ | ___ | ___ |
| 9. Page speed | ___ | ___ | ___ | ___ |
| 10. Media optimization | ___ | ___ | ___ | ___ |
| **TOTAL** | **___** | **___** | **___** | **___** |

### Competitive Insight

- Where you beat the competition: ________________________________________
- Where competitors beat you: ________________________________________
- Biggest opportunity gap: ________________________________________
- Strategy to close the gap: ________________________________________

---

## Re-Score Schedule

| Review | Date | Score | Grade | Reviewer |
|--------|------|-------|-------|----------|
| Initial audit | ________ | ___ / 30 | ___ | ________ |
| Post-remediation | ________ | ___ / 30 | ___ | ________ |
| Quarterly review 1 | ________ | ___ / 30 | ___ | ________ |
| Quarterly review 2 | ________ | ___ / 30 | ___ | ________ |
