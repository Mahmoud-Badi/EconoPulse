# On-Page SEO Checklist

Run this for **every page** before publishing on {{PROJECT_NAME}}. No exceptions. A page that goes live without passing this checklist is a page that competes with one hand tied behind its back.

Each item is tagged with a priority level:

- **[CRITICAL]** — Launch-blocker. Fix before publishing or you are actively harming rankings.
- **[IMPORTANT]** — Significant ranking factor. Fix within 24 hours of publishing.
- **[NICE-TO-HAVE]** — Incremental improvement. Schedule for next content review cycle.

---

## How to Use

1. Open this checklist for the page you are about to publish
2. Work through every item top to bottom
3. Mark each item PASS or FAIL
4. If any CRITICAL item fails, do not publish until resolved
5. If any IMPORTANT item fails, publish only if there is a documented plan to fix within 24 hours
6. Record the completed checklist in your project's SEO audit log

---

## 1. Title Tag

| # | Check | Priority | Pass/Fail Criteria |
|---|-------|----------|--------------------|
| 1.1 | Primary keyword present | **[CRITICAL]** | Target keyword appears in the title tag. Ideally within the first 60 characters. |
| 1.2 | Keyword placement | **[IMPORTANT]** | Primary keyword appears as close to the beginning of the title as naturally possible. Front-loaded titles outperform end-loaded titles in CTR studies. |
| 1.3 | Character length | **[CRITICAL]** | Title is 50-60 characters. Titles beyond ~580px (approximately 60 characters) get truncated in SERPs. Check actual pixel width with a SERP preview tool. |
| 1.4 | Uniqueness | **[CRITICAL]** | No other page on {{PROJECT_NAME}} shares this exact title tag. Duplicate titles cause cannibalization. |
| 1.5 | Compelling copy | **[IMPORTANT]** | Title communicates a clear benefit or creates curiosity. It is not just a keyword — it is a click magnet. Would you click this over the other 9 results? |
| 1.6 | Brand inclusion | **[NICE-TO-HAVE]** | Brand name appended at the end (e.g., `| {{PROJECT_NAME}}`). Omit for long titles where truncation would eat the keyword. |

---

## 2. Meta Description

| # | Check | Priority | Pass/Fail Criteria |
|---|-------|----------|--------------------|
| 2.1 | Primary keyword present | **[IMPORTANT]** | Target keyword appears naturally. Google bolds matching terms, increasing visual salience in SERPs. |
| 2.2 | Call to action | **[IMPORTANT]** | Description ends with or includes a CTA (Learn how, See the data, Get started, Compare options). Passive descriptions get passive CTRs. |
| 2.3 | Character length | **[CRITICAL]** | 140-155 characters. Descriptions beyond ~920px get truncated. Under 70 characters look sparse and Google is more likely to rewrite them. |
| 2.4 | Uniqueness | **[CRITICAL]** | No other page on {{PROJECT_NAME}} shares this meta description. |
| 2.5 | Accurately represents content | **[CRITICAL]** | The description matches what the user will actually find on the page. Misleading descriptions increase pogo-sticking, which hurts rankings. |

---

## 3. URL Structure

| # | Check | Priority | Pass/Fail Criteria |
|---|-------|----------|--------------------|
| 3.1 | Primary keyword in URL | **[IMPORTANT]** | The URL slug contains the target keyword or a close variant. `/seo-audit-checklist/` not `/page-47/`. |
| 3.2 | Hyphen-separated words | **[CRITICAL]** | Words separated by hyphens, not underscores, spaces, or camelCase. `/on-page-seo/` not `/on_page_seo/` or `/onPageSeo/`. |
| 3.3 | All lowercase | **[CRITICAL]** | Entire URL is lowercase. Mixed case creates duplicate URL problems on case-sensitive servers. |
| 3.4 | Short and readable | **[IMPORTANT]** | URL slug is under 60 characters. No unnecessary stop words, dates, or folder nesting. `/blog/seo-checklist/` not `/blog/2024/03/15/the-ultimate-on-page-seo-checklist-guide/`. |
| 3.5 | No special characters | **[CRITICAL]** | No query parameters, session IDs, or encoded characters in the canonical URL. |
| 3.6 | Logical hierarchy | **[NICE-TO-HAVE]** | URL path reflects site architecture. `/products/widget-pro/` not `/p/12847/`. |

---

## 4. Heading Hierarchy

| # | Check | Priority | Pass/Fail Criteria |
|---|-------|----------|--------------------|
| 4.1 | Single H1 | **[CRITICAL]** | Exactly one H1 on the page. It contains the primary keyword or a close semantic variant. |
| 4.2 | H1 differs from title tag | **[NICE-TO-HAVE]** | H1 and title tag are not identical — the H1 can be longer, more descriptive, or include secondary keywords. This gives you two ranking signals instead of one. |
| 4.3 | H2s with keywords | **[IMPORTANT]** | Major sections use H2 tags. At least one H2 contains a secondary keyword or a question users ask about the topic. |
| 4.4 | Logical nesting | **[IMPORTANT]** | No skipped levels (H1 > H3 with no H2). Headings follow a document-outline hierarchy: H1 > H2 > H3 > H4. Screen readers and crawlers both rely on this. |
| 4.5 | No headings for styling | **[IMPORTANT]** | Heading tags are used for semantic structure, not font sizing. If it is not a section heading, use CSS classes. |
| 4.6 | H2/H3 count appropriate | **[NICE-TO-HAVE]** | Long-form content has enough subheadings that no section exceeds 300 words without a heading break. |

---

## 5. Content Quality

| # | Check | Priority | Pass/Fail Criteria |
|---|-------|----------|--------------------|
| 5.1 | Keyword in first 100 words | **[IMPORTANT]** | Primary keyword appears naturally within the first 100 words (ideally the first paragraph). This confirms topic relevance immediately for both users and crawlers. |
| 5.2 | Keyword density | **[IMPORTANT]** | Primary keyword density is 0.5-1.5% of total word count. Under 0.5% means weak relevance signals. Over 1.5% risks keyword stuffing penalties. Use a tool to count — do not eyeball it. |
| 5.3 | Secondary keywords present | **[IMPORTANT]** | 3-5 secondary/related keywords appear naturally throughout the content. These reinforce topical authority and help the page rank for long-tail variations. |
| 5.4 | Content comprehensiveness | **[IMPORTANT]** | Content covers the topic at least as thoroughly as the current top-3 SERP results. Run a content gap analysis — if competitors cover subtopics you miss, you lose on depth. |
| 5.5 | Content uniqueness | **[CRITICAL]** | Content is original. No copy-paste from other pages on {{PROJECT_NAME}} or external sources. Run a plagiarism/duplication check. Duplicate content earns no rankings. |
| 5.6 | Satisfies search intent | **[CRITICAL]** | If the keyword has informational intent, the page educates. If commercial intent, the page compares. If transactional intent, the page converts. Mismatched intent means zero chance of ranking regardless of optimization. |
| 5.7 | Readability | **[NICE-TO-HAVE]** | Average sentence length under 20 words. Paragraphs under 4 sentences. Flesch-Kincaid grade level appropriate for {{TARGET_AUDIENCE}}. |
| 5.8 | Fresh and current | **[NICE-TO-HAVE]** | No outdated statistics, dead references, or stale claims. Include a "last updated" date for evergreen content. |

---

## 6. Internal Links

| # | Check | Priority | Pass/Fail Criteria |
|---|-------|----------|--------------------|
| 6.1 | Minimum internal links | **[IMPORTANT]** | Page contains 3-5 internal links to related pages on {{PROJECT_NAME}}. Orphan pages (zero inbound internal links) are invisible to crawlers navigating your site. |
| 6.2 | Descriptive anchor text | **[IMPORTANT]** | Anchor text describes the destination page, not "click here" or "read more." Good: "on-page SEO checklist." Bad: "this article." |
| 6.3 | Contextual relevance | **[IMPORTANT]** | Links appear within the body content where they are topically relevant, not dumped in a "related articles" footer as an afterthought. Contextual links carry more weight. |
| 6.4 | Links to pillar pages | **[NICE-TO-HAVE]** | If this page is part of a topic cluster, it links back to the pillar page with a keyword-rich anchor. |
| 6.5 | No broken internal links | **[CRITICAL]** | Every internal link resolves to a 200-status page. No 404s, no redirect chains. |
| 6.6 | Inbound internal links exist | **[IMPORTANT]** | At least 2-3 other pages on the site link to this page. If nothing links to it, it is an orphan regardless of its own outbound links. |

---

## 7. Images & Media

| # | Check | Priority | Pass/Fail Criteria |
|---|-------|----------|--------------------|
| 7.1 | Alt text on all images | **[CRITICAL]** | Every non-decorative image has descriptive alt text. Under 125 characters. Includes the keyword on the primary image if natural. |
| 7.2 | Descriptive file names | **[IMPORTANT]** | Image files use descriptive, hyphen-separated names. `seo-audit-dashboard.webp` not `IMG_4729.jpg` or `screenshot.png`. |
| 7.3 | Compression applied | **[IMPORTANT]** | All images compressed to web-appropriate quality (WebP preferred, JPEG quality 75-85 for photos, PNG only for images requiring transparency). No image over 200KB without justification. |
| 7.4 | Explicit dimensions | **[IMPORTANT]** | `width` and `height` attributes set on all `<img>` tags to prevent Cumulative Layout Shift. |
| 7.5 | Lazy loading | **[NICE-TO-HAVE]** | Below-the-fold images use `loading="lazy"`. Above-the-fold hero image does NOT use lazy loading (it should load eagerly). |
| 7.6 | Modern format | **[NICE-TO-HAVE]** | Images served in WebP or AVIF with JPEG/PNG fallback for older browsers. |

---

## 8. Technical On-Page Elements

| # | Check | Priority | Pass/Fail Criteria |
|---|-------|----------|--------------------|
| 8.1 | Canonical tag | **[CRITICAL]** | Self-referencing canonical tag present (`<link rel="canonical" href="...">`). Points to the exact URL of this page, not a variant. |
| 8.2 | Open Graph tags | **[IMPORTANT]** | `og:title`, `og:description`, `og:image`, and `og:url` set correctly. Test by pasting the URL into Facebook's Sharing Debugger or Twitter's Card Validator. |
| 8.3 | Structured data | **[IMPORTANT]** | Appropriate schema markup present (Article, Product, FAQ, HowTo, BreadcrumbList). Validates in Google's Rich Results Test with zero errors. |
| 8.4 | Mobile responsive | **[CRITICAL]** | Page renders correctly on mobile viewport (360px-428px width). No horizontal scrolling, no text too small to read, no tap targets too close together. Google uses mobile-first indexing — mobile IS the primary version. |
| 8.5 | Page speed | **[CRITICAL]** | LCP under 2.5s, INP under 200ms, CLS under 0.1 on mobile. Test with PageSpeed Insights using the page's actual URL (not just the homepage). |
| 8.6 | HTTPS | **[CRITICAL]** | Page loads over HTTPS with no mixed content warnings. |
| 8.7 | No noindex tag | **[CRITICAL]** | Verify the page does NOT have `<meta name="robots" content="noindex">` or an `X-Robots-Tag: noindex` HTTP header unless you intentionally want it excluded. This is the single most common accidental SEO disaster. |
| 8.8 | Hreflang (if multilingual) | **[IMPORTANT]** | If {{PROJECT_NAME}} serves content in multiple languages, correct `hreflang` tags are present with valid language/region codes and reciprocal references. |

---

## Pre-Publish Summary

Use this summary block to record the audit result:

```
Page: {{PAGE_URL}}
Auditor: _______________
Date: _______________

CRITICAL items:    ___ / ___ passed
IMPORTANT items:   ___ / ___ passed
NICE-TO-HAVE items: ___ / ___ passed

Overall verdict:
  [ ] PUBLISH — all CRITICAL items pass
  [ ] HOLD — CRITICAL failures must be resolved first
  [ ] REVISE — significant IMPORTANT failures need attention

Notes:
_______________________________________________
_______________________________________________
```

---

## Quick Reference: The 30-Second Version

If you only have time for the absolute essentials, verify these seven items:

1. Title tag has the keyword, is under 60 characters, and is unique
2. H1 is unique and contains the keyword
3. URL is short, lowercase, hyphenated, and contains the keyword
4. Content satisfies search intent and is original
5. 3+ internal links with descriptive anchors
6. All images have alt text
7. No accidental noindex tag

Everything else matters. But these seven are the difference between ranking and not ranking.
