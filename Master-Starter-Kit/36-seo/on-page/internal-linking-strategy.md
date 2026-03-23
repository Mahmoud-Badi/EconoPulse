# Internal Linking Strategy

Internal links are the circulatory system of {{PROJECT_NAME}}. They distribute link equity (ranking power) from high-authority pages to pages that need it. They help crawlers discover content. They guide users through your site. A page with zero internal links pointing to it is an orphan — invisible to both Google and your users. This guide covers how to build an internal linking system that compounds over time.

---

## Table of Contents

1. [How Link Equity Flows Internally](#how-link-equity-flows-internally)
2. [Orphan Page Detection and Rescue](#orphan-page-detection-and-rescue)
3. [Anchor Text Strategy](#anchor-text-strategy)
4. [Topical Relevance Scoring](#topical-relevance-scoring)
5. [Contextual vs Navigational Links](#contextual-vs-navigational-links)
6. [Link Depth Budgets](#link-depth-budgets)
7. [Automated Internal Linking Approaches](#automated-internal-linking-approaches)
8. [Monthly Audit Process](#monthly-audit-process)
9. [Patterns by Site Type](#patterns-by-site-type)
10. [Common Mistakes](#common-mistakes)
11. [Tools for Internal Link Analysis](#tools-for-internal-link-analysis)

---

## How Link Equity Flows Internally

### The PageRank Model (Simplified)

Every page on {{PROJECT_NAME}} has a certain amount of "authority" — derived from external backlinks, age, and Google's assessment of quality. When a page links to another page, it passes a portion of that authority through the link. This is called link equity (historically called "PageRank," though Google's modern algorithm is far more complex).

### Key Principles

**Equity splits across all links on a page.** If a page has 10 outbound internal links, each link receives roughly 1/10th of the page's passable equity. This means:

- Pages with fewer outbound links pass more equity per link
- Adding 50 internal links to a page dilutes each link's value
- Navigation links (present on every page) receive a share of every page's equity

**Equity flows through chains.** Page A links to Page B, which links to Page C. Page C receives equity from both A (indirectly) and B (directly). The further a page is from high-authority pages, the less equity it receives.

**Nofollow stops the flow.** An internal link with `rel="nofollow"` does not pass equity. Almost never use nofollow on internal links — there is rarely a valid reason to block equity flow within your own site.

### The Practical Takeaway

Your highest-authority pages (homepage, pages with the most backlinks) should link to the pages you most want to rank. This is not gaming the system — it is telling Google which pages matter most on your site.

### Equity Distribution Audit

Map your current equity flow:

1. Identify your top 10 pages by backlink count (use Ahrefs, Moz, or Search Console Links report)
2. For each page, list which internal pages it links to
3. Ask: are the pages receiving the most internal equity the same pages you most want to rank?
4. If not, add internal links from your highest-authority pages to your highest-priority target pages

---

## Orphan Page Detection and Rescue

An orphan page is any page on {{PROJECT_NAME}} that has zero internal links pointing to it. Googlebot can only discover it via the sitemap (if listed) or direct external links. Orphan pages typically rank poorly because:

- They receive zero internal link equity
- Crawlers may discover them infrequently
- Users cannot navigate to them through the site

### How Orphan Pages Are Created

- New pages published without adding links from existing content
- Pages removed from navigation during a redesign but not deleted
- Programmatic pages generated without cross-linking logic
- URL migrations where the new URL was not linked from anywhere
- Pagination changes that disconnect deep pages

### Detection Methods

**Method 1: Crawl comparison**
1. Crawl your site with Screaming Frog or Sitebulb (following internal links only)
2. Export all URLs found by the crawl
3. Compare against your sitemap or CMS page list
4. Any URL in the sitemap/CMS but NOT in the crawl is an orphan

**Method 2: Search Console**
1. Go to Search Console > Pages > Indexed
2. Look for pages marked "Indexed, not submitted in sitemap" — some of these may be orphans Google found through external links but not internal links
3. Cross-reference with a crawl to confirm

**Method 3: Screaming Frog orphan page report**
1. Crawl the site AND upload a list of all known URLs
2. Screaming Frog will flag URLs that exist in your list but were not discovered during the crawl

### Rescue Strategies

| Orphan Type | Rescue Action |
|-------------|---------------|
| Valuable content that should rank | Add 3-5 internal links from topically relevant pages. Add to relevant navigation or category pages. |
| Outdated content | Update the content, then add internal links. Or 301 redirect to a current page covering the same topic. |
| Duplicate or near-duplicate | Canonical to the primary version and/or 301 redirect. |
| Truly unnecessary | Return a 410 (Gone) status. Remove from sitemap. |
| Programmatic pages | Fix the cross-linking logic so future pages are auto-linked. Retroactively link existing orphans. |

---

## Anchor Text Strategy

Anchor text is the clickable text of an internal link. Google uses it as a strong signal for what the destination page is about. Internal anchor text is one of the most underused on-page SEO levers.

### Anchor Text Types

| Type | Example | When to Use | Risk |
|------|---------|-------------|------|
| **Exact match** | `on-page SEO checklist` | When the phrase is the destination page's primary keyword. Use sparingly — 20-30% of anchors. | Over-optimization if overused. |
| **Partial match** | `checklist for on-page optimization` | When you want to reinforce the keyword while varying phrasing. 30-40% of anchors. | Low risk. |
| **Branded** | `{{PROJECT_NAME}}'s SEO guide` | When linking to the homepage or brand-centric pages. | None — natural and expected. |
| **Generic** | `read more`, `click here`, `learn more` | Almost never. These anchors waste a ranking signal. | No SEO value. Missed opportunity. |
| **Natural / descriptive** | `the complete guide to title tag optimization` | When the natural sentence produces a descriptive phrase. 20-30% of anchors. | Low risk. Ideal for readability. |

### Anchor Text Rules for {{PROJECT_NAME}}

1. **Never use "click here" or "read more" as anchor text.** Every internal link is a ranking signal — use it.
2. **Vary your anchors.** If 10 pages link to your SEO checklist, they should not all use the identical anchor `on-page SEO checklist`. Mix exact match, partial match, and natural phrasing.
3. **Keep anchors under 7 words.** Long anchors dilute the signal. `on-page SEO checklist` is better than `the comprehensive on-page SEO checklist that covers everything you need to know`.
4. **Make anchors match the destination content.** Do not anchor-text `pricing plans` and link to a blog post. Google treats this as a misleading signal.
5. **Anchor text should read naturally in context.** If you have to distort a sentence to insert a keyword-rich anchor, the anchor is wrong — rewrite the sentence.

### Anchor Text Audit

Export all internal links from a crawl tool. For each destination URL, list all the anchor texts pointing to it. Flag:
- URLs where 100% of anchors are exact match (over-optimization)
- URLs where 100% of anchors are generic (missed opportunity)
- URLs where anchor text does not match the page's target keyword (misaligned signal)

---

## Topical Relevance Scoring

Not all internal links are equal. A link from a topically relevant page carries more weight than a link from an unrelated page.

### The Relevance Principle

Google evaluates the context surrounding a link. A link to your "image SEO guide" from a page about "on-page optimization" is highly relevant. A link to the same guide from your "company careers" page is not. Both pass equity, but the relevant link also passes topical signals.

### How to Score Relevance

For each internal link you plan to add, ask three questions:

| Question | Scoring |
|----------|---------|
| Is the linking page about the same topic or a closely related topic? | Yes = +2, Adjacent = +1, Unrelated = 0 |
| Does the link appear within a paragraph that discusses the destination topic? | In-context = +2, Same section = +1, Random placement = 0 |
| Would a reader find the link useful at this point in the content? | Yes = +1, Maybe = 0, No = -1 |

**Score 4-5:** Excellent link. Add it.
**Score 2-3:** Decent link. Add it if you need more links to the destination page.
**Score 0-1:** Weak link. Find a better source page or a better placement on this page.

### Building a Relevance Map

1. Export all pages on {{PROJECT_NAME}} with their primary topic/keyword
2. Group pages into topic clusters (e.g., all on-page SEO pages, all technical SEO pages)
3. Pages within the same cluster should link to each other heavily
4. Pages in adjacent clusters should link to each other selectively
5. Cross-cluster links should be rare and highly intentional

---

## Contextual vs Navigational Links

### Contextual Links (Within Body Content)

- Appear inside paragraphs, naturally woven into the text
- Carry the strongest topical relevance signal because the surrounding text provides context
- Should be your primary internal linking mechanism
- Target: every page of body content should have 3-5 contextual internal links

### Navigational Links (Menus, Sidebars, Footers)

- Present on every page (or a large group of pages) via templates
- Pass equity but with diluted topical relevance (same link on 500 pages = less signal per instance)
- Important for user navigation and crawl discovery, but not a substitute for contextual links
- Keep navigation lean — every link in your nav gets equity from every page on the site, so only include pages that deserve site-wide equity

### Footer Links

- Historically abused for SEO (stuffing keyword-rich links in footers). Google devalues footer links compared to body-content links.
- Use footer links for utility pages: Privacy Policy, Terms, Contact, Sitemap
- Do not use footer links as your internal linking strategy — they are a supplement, not a replacement

### Sidebar "Related Posts" Widgets

- Better than footer links, worse than contextual body links
- Useful for blogs and content sites where manual linking at scale is impractical
- Ensure the "related" algorithm actually surfaces topically relevant pages, not just recent pages
- Limit to 3-5 related links to avoid dilution

---

## Link Depth Budgets

Link depth is the number of clicks from the homepage (or another entry page) required to reach a given page. Google's crawlers have finite patience — pages buried deep in your site structure are crawled less frequently and may be perceived as less important.

### Depth Targets

| Page Importance | Maximum Click Depth | Examples |
|----------------|--------------------|---------|
| **Critical** (top revenue/traffic pages) | 1-2 clicks from homepage | Product pages, pricing, key landing pages |
| **High** (supporting content that should rank) | 2-3 clicks from homepage | Blog pillar pages, feature pages, comparison pages |
| **Medium** (useful content, moderate search volume) | 3-4 clicks from homepage | Individual blog posts, documentation, help articles |
| **Low** (archival, low-traffic) | 4-5 clicks from homepage | Old blog posts, legal pages, tag archives |

### How to Audit Link Depth

1. Crawl {{PROJECT_NAME}} with Screaming Frog
2. Sort by "Crawl Depth" column
3. Flag any important page with a depth > 3
4. For flagged pages, find opportunities to link from shallower pages

### Reducing Depth

- Add links from the homepage or main navigation to critical pages
- Create hub pages that link to groups of related content (reducing their effective depth by 1)
- Add "featured" or "popular" sections on category pages
- Use breadcrumbs (which also help with structured data and user navigation)

---

## Automated Internal Linking Approaches

Manual linking is ideal for quality but does not scale. For sites with hundreds or thousands of pages, automation is necessary.

### Approach 1: Related Posts Algorithm

- Most CMS platforms (WordPress, Ghost, etc.) have plugins that display related content
- Ensure the algorithm uses topical similarity (tag/category overlap or TF-IDF text comparison), not just recency
- WordPress plugins: JEPP, Jeep, or custom implementations using post tags
- Limit to 3-5 related links per page

### Approach 2: Keyword-Based Auto-Linking

- Define a mapping: keyword phrase -> destination URL
- Whenever that phrase appears in body content, automatically link the first occurrence to the destination URL
- Example: every time "internal linking strategy" appears on any page, the first instance becomes a link to your internal linking guide
- Rules: only link the first occurrence per page, never link within headings, never link within other links, cap at 1-2 auto-links per destination per page

### Approach 3: Programmatic Cross-Linking

For programmatic pages (product listings, location pages):
- Link each product to related products in the same category
- Link each location page to nearby locations
- Link each page to its parent category
- Ensure the cross-linking logic produces relevant links, not random ones

### Approach 4: Content Inventory Scripts

- Maintain a spreadsheet or database mapping every URL to its primary keyword and topic cluster
- When publishing new content, query the inventory: "Which existing pages mention my new page's keyword?"
- Add a link from those pages to the new page
- This can be scripted: crawl all pages, search for keyword mentions, output a list of link insertion opportunities

### Cautions

- Automated linking must still produce relevant, useful links. Irrelevant auto-links hurt user experience and waste equity.
- Review automated links quarterly. As pages are updated, deleted, or redirected, auto-links can break or become irrelevant.
- Never auto-link so aggressively that body content becomes a sea of blue underlined text. Cap at 1 auto-link per 200 words.

---

## Monthly Audit Process

Run this audit monthly. It takes 30-60 minutes once your tooling is set up.

### Step 1: Crawl the Site

Run a full crawl of {{PROJECT_NAME}} using Screaming Frog, Sitebulb, or Ahrefs Site Audit.

### Step 2: Identify Orphan Pages

Compare crawl results to your sitemap/CMS inventory. Flag any pages not discovered by the crawl. Follow the rescue strategies above.

### Step 3: Review Link Distribution

Export the "Inlinks" count for every page. Sort by inlinks (ascending). Pages with 0-2 inlinks need attention — especially if they target competitive keywords.

| Inlink Count | Assessment | Action |
|--------------|------------|--------|
| 0 | Orphan. Invisible. | Add 3-5 internal links from relevant pages immediately. |
| 1-2 | Under-linked. Weak equity. | Add 2-3 more links from topically relevant pages. |
| 3-5 | Adequate for most pages. | No action unless the page targets a high-competition keyword. |
| 6-10 | Well-linked. | Review anchor text diversity. |
| 10+ | Heavily linked. | Verify links are relevant, not just accumulated from templates/footers. |

### Step 4: Check for Broken Internal Links

Filter the crawl for internal links returning 404, 301, or 302. Fix all of them:
- 404: Update the link to the correct URL, or remove it if the destination no longer exists
- 301/302: Update the link to point directly to the final destination (skip the redirect)

### Step 5: Audit Anchor Text

For the top 20 pages by importance, export all internal links pointing to each page. Verify:
- Anchor text is descriptive (not generic)
- Anchor text is varied (not 100% exact match)
- Anchor text aligns with the page's target keyword

### Step 6: Check Click Depth

Sort pages by crawl depth. Flag any priority page deeper than 3 clicks. Add links from shallower pages to reduce depth.

### Step 7: Document and Assign

Record findings and assign remediation tasks:

```
Internal Linking Audit — {{PROJECT_NAME}}
Date: _______________
Auditor: _______________

Orphan pages found: ___
Under-linked pages (0-2 inlinks): ___
Broken internal links: ___
Pages with depth > 3: ___
Anchor text issues flagged: ___

Action items:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
```

---

## Patterns by Site Type

### Blog / Content Site

- **Hub-and-spoke model**: Pillar pages (hubs) link to all related articles (spokes). Every spoke links back to the pillar.
- Every new post should link to 3-5 existing articles and receive links from 2-3 existing articles
- Category pages serve as secondary hubs
- "Related articles" widget supplements manual contextual links
- Internal linking is the primary way to signal topic clusters to Google

### SaaS / Product Site

- **Feature page hierarchy**: Homepage > product overview > individual feature pages
- Every feature page links to the pricing page (your highest-intent page)
- Blog articles link to relevant feature pages (content marketing supports product discovery)
- Documentation links to feature pages (users in docs are high-intent)
- Comparison pages link to your product's advantages and the relevant feature pages

### E-Commerce

- **Category > subcategory > product hierarchy**: Every product links to its category. Categories link to featured products.
- Cross-sell and upsell links: "Customers also bought," "Frequently bought together"
- Faceted navigation creates internal links but watch for crawl budget waste (noindex filter combinations if needed)
- Product review pages link to the product page (and vice versa)
- Buying guides link to recommended products

### Documentation / Knowledge Base

- **Breadcrumb-driven hierarchy**: Every page has breadcrumbs linking up the hierarchy
- "Prerequisites" and "Next steps" links create sequential paths
- "See also" links connect related concepts across categories
- Glossary entries link to pages that explain concepts in depth
- FAQ pages link to detailed documentation for each answer

---

## Common Mistakes

### 1. Over-Linking a Single Page

Adding 20+ internal links on a single page dilutes the equity each link passes. It also overwhelms users. Cap body-content links at 1 per 150-200 words. For a 1,500-word article, that is roughly 7-10 internal links maximum.

### 2. Using Generic Anchor Text

"Click here," "read more," "this article," and "learn more" are wasted ranking signals. Every anchor should describe the destination page.

### 3. Linking Only from New Content to Old Content

New pages should receive links too. When you publish a new page, go back to 3-5 existing pages and add a link to the new content. Otherwise the new page starts as an orphan.

### 4. Ignoring Orphan Pages During Redesigns

Site redesigns are the number-one cause of mass orphan creation. When you change navigation, URL structures, or page templates, run a full crawl comparison before AND after launch to ensure no pages lost their internal links.

### 5. Relying Solely on Navigation Links

Navigation links appear on every page, which means they are diluted across your entire site. They are important for discovery but do not replace contextual body-content links for equity distribution.

### 6. Nofollow on Internal Links

Unless you have a specific, unusual reason (e.g., linking to a login page you do not want indexed), never use `rel="nofollow"` on internal links. You are blocking your own equity flow.

### 7. Deep Link Rot

Over time, pages get deleted, URLs change, and redirects accumulate. Without regular audits, your internal link network degrades. Broken links pass zero equity and frustrate users.

---

## Tools for Internal Link Analysis

| Tool | Strength | Use Case |
|------|----------|----------|
| **Screaming Frog** | Comprehensive crawling, inlinks/outlinks export, orphan detection, crawl depth analysis | Full internal link audits. The gold standard for technical SEO crawling. |
| **Sitebulb** | Visual link flow diagrams, automated orphan detection, content-type filtering | Visual audits where stakeholders need to see link flow diagrams. |
| **Ahrefs (Site Audit)** | Internal link analysis integrated with backlink data, orphan detection | Combining internal and external link data in one view. |
| **Google Search Console** | Links report shows top internally-linked pages | Quick check on which pages receive the most internal links. Free. |
| **Semrush (Site Audit)** | Internal linking module with recommendations | Automated fix suggestions for internal linking issues. |
| **Link Whisper (WordPress)** | AI-powered internal link suggestions while writing | Real-time linking suggestions during content creation. WordPress only. |
| **Internal Link Juicer (WordPress)** | Automated keyword-based internal linking | Auto-linking at scale for WordPress sites with 500+ pages. |
| **Custom scripts (Python + BeautifulSoup)** | Full control over crawl logic and analysis | Large-scale or unusual site architectures where off-the-shelf tools fall short. |

### Recommended Stack for {{PROJECT_NAME}}

- **Small site (under 500 pages):** Screaming Frog free version + Google Search Console
- **Medium site (500-10,000 pages):** Screaming Frog paid + Ahrefs Site Audit
- **Large site (10,000+ pages):** Sitebulb or custom crawl scripts + Ahrefs + automated linking tools
