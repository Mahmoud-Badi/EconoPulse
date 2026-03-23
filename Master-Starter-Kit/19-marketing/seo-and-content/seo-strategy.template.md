# SEO Strategy for {{PROJECT_NAME}}

> **MOVED:** This file's content has been migrated and significantly expanded in the dedicated SEO section.
>
> **New location:** `36-seo/strategy/seo-strategy.template.md`
>
> The full `36-seo/` section includes 43 files covering strategy, technical SEO, on-page, off-page, content SEO, specialized verticals (local, international, e-commerce), AI search optimization, measurement, testing, incident response, migration, audits, and gotchas. Start with `36-seo/README.md` for the reading order.
>
> Content-marketing files (`blog-strategy.template.md`, `content-calendar.template.md`, `content-repurposing.md`) remain in this directory — they serve all marketing channels, not just SEO.

---

## Table of Contents

1. [Keyword Research Methodology](#keyword-research-methodology)
2. [Free Keyword Research Tools](#free-keyword-research-tools)
3. [Paid Tools Overview](#paid-tools-overview)
4. [Keyword Categorization](#keyword-categorization)
5. [Content-Keyword Mapping](#content-keyword-mapping)
6. [On-Page SEO Checklist](#on-page-seo-checklist)
7. [Content Structure for SEO](#content-structure-for-seo)
8. [Link Building Strategy](#link-building-strategy)
9. [Local SEO](#local-seo)
10. [Technical SEO Foundations](#technical-seo-foundations)
11. [SEO Timeline Expectations](#seo-timeline-expectations)
12. [Product-Type-Specific SEO](#product-type-specific-seo)
13. [SEO Measurement & Reporting](#seo-measurement--reporting)

---

## Keyword Research Methodology

### Step 1: Seed Keywords

Start with 5-10 seed keywords that describe your product, its category, and the problems it solves.

**Template:**

```
Product category: {{PRODUCT_CATEGORY}}
Example: "deployment tool," "CI/CD platform," "devops automation"

Problem keywords: {{PROBLEM_KEYWORDS}}
Example: "slow deployments," "deployment errors," "manual deployment"

Solution keywords: {{SOLUTION_KEYWORDS}}
Example: "automated deployment," "one-click deploy," "zero-downtime deployment"

Audience keywords: {{AUDIENCE_KEYWORDS}}
Example: "devops tools," "developer productivity," "engineering team tools"

Competitor names: {{COMPETITOR_NAMES}}
Example: "heroku alternative," "vercel vs netlify," "[competitor] pricing"
```

### Step 2: Long-Tail Expansion

For each seed keyword, generate long-tail variations. Long-tail keywords are longer, more specific phrases with lower competition and higher intent.

**Expansion methods:**

| Method | How | Example |
|--------|-----|---------|
| **Add modifiers** | Prepend/append descriptors | "best deployment tool for startups" |
| **Add intent** | Add action words | "how to automate deployments" |
| **Add qualifiers** | Add specifics | "free deployment tool for Node.js" |
| **Add comparisons** | Compare to alternatives | "ShipFast vs Heroku" |
| **Add location** | If relevant | "deployment tools for European companies (GDPR)" |
| **Add year** | For freshness | "best CI/CD tools 2026" |

### Step 3: Search Intent Mapping

For every keyword, determine the searcher's intent. This determines what type of content to create.

| Intent Type | What They Want | Content Type | Conversion Potential |
|-------------|---------------|--------------|---------------------|
| **Informational** | Learn something | Blog post, guide, tutorial | Low (awareness) |
| **Navigational** | Find a specific site/page | Homepage, product page | Medium (brand search) |
| **Commercial** | Compare options | Comparison page, review, listicle | High (evaluating) |
| **Transactional** | Buy/sign up | Landing page, pricing page, sign-up page | Very High (ready to act) |

**Examples:**

```
"what is CI/CD" → Informational → Blog post explaining CI/CD
"best CI/CD tools" → Commercial → Comparison blog post or landing page
"ShipFast" → Navigational → Homepage (you want to rank #1 for your brand name)
"ShipFast pricing" → Transactional → Pricing page
"ShipFast vs Heroku" → Commercial → Comparison landing page
"deploy Node.js app" → Informational → Tutorial blog post
```

### Step 4: Keyword Prioritization

Score each keyword on:

| Factor | Weight | How to Assess |
|--------|--------|---------------|
| **Search volume** | Medium | Monthly searches (tools will show this) |
| **Competition** | High | Keyword difficulty score + SERP analysis |
| **Relevance** | Very High | How closely does this relate to your product? |
| **Intent match** | Very High | Does the intent match what your page delivers? |
| **Conversion potential** | High | Will this traffic convert to users? |

**Priority formula**: Relevance x Intent Match x (Volume / Competition)

Focus on **high-relevance, low-competition, commercial/transactional intent** keywords first.

---

## Free Keyword Research Tools

### Google Keyword Planner

**What**: Google's official keyword tool (requires a Google Ads account — free to create, no spend required).
**Best for**: Search volume ranges, keyword suggestions, competition level.
**How to use**:
1. Go to ads.google.com → Tools → Keyword Planner
2. Enter seed keywords in "Discover new keywords"
3. Filter by relevance and sort by search volume
4. Export the list for analysis

**Limitation**: Shows volume ranges (100-1K, 1K-10K) not exact numbers unless you run ads.

### Google Autocomplete

**What**: Type your seed keyword into Google search and note the autocomplete suggestions.
**Best for**: Discovering what people actually search for.
**How to use**:
1. Go to google.com
2. Type your seed keyword slowly
3. Note all autocomplete suggestions
4. Try with different starting words: "how to...", "best...", "why...", "[keyword] for..."
5. Add a letter after your keyword: "[keyword] a", "[keyword] b" to get more suggestions

### Google "People Also Ask"

**What**: The "People Also Ask" box that appears in Google search results.
**Best for**: Discovering related questions people ask. Perfect for FAQ and blog content.
**How to use**:
1. Search your seed keyword on Google
2. Find the "People Also Ask" box
3. Click to expand questions (clicking reveals more questions — you can generate dozens)
4. Each question is a potential blog post or FAQ entry

### AnswerThePublic

**What**: Visualizes questions and phrases people search for around a keyword.
**Best for**: Content ideation — discovering questions, comparisons, and prepositions.
**Free tier**: 3 searches per day.
**How to use**:
1. Go to answerthepublic.com
2. Enter your seed keyword
3. Review the question wheel, preposition wheel, and comparison data
4. Export the results as a CSV

### AlsoAsked

**What**: Shows the hierarchical relationship between "People Also Ask" questions.
**Best for**: Understanding how topics relate to each other (great for pillar/cluster planning).
**Free tier**: 3 searches per day.
**How to use**:
1. Go to alsoasked.com
2. Enter your keyword
3. View the tree of related questions
4. Use the tree to plan content clusters

### Google Search Console

**What**: Google's tool showing which queries drive traffic to YOUR site.
**Best for**: Discovering keywords you already rank for (that you might not know about). Finding opportunities to improve rankings.
**How to use**:
1. Set up Search Console (verify your domain)
2. Go to Performance → Search Results
3. Look at Queries — these are keywords bringing traffic
4. Find keywords where you rank #5-20 (opportunity: optimize existing pages to move up)

### Google Trends

**What**: Shows search interest over time for any keyword.
**Best for**: Seasonal planning, trending topics, comparing keyword popularity.
**How to use**:
1. Go to trends.google.com
2. Enter your keyword
3. Check if interest is growing, stable, or declining
4. Compare multiple keywords to see which has more demand
5. Use for seasonal content planning (e.g., "tax software" spikes in Q1)

---

## Paid Tools Overview

### When to Invest in Paid SEO Tools

**Wait until**: You have a content team or are producing 4+ pieces of content per month. Free tools are sufficient for getting started.

**Invest when**: You need accurate search volumes, competitive analysis, backlink data, or rank tracking at scale.

| Tool | Starting Price | Best For |
|------|---------------|----------|
| **Ahrefs** | $99/month | Backlink analysis, keyword research, content gap analysis, rank tracking |
| **SEMrush** | $130/month | Keyword research, competitive intelligence, site auditing, content tools |
| **Moz Pro** | $99/month | Domain authority, keyword research, on-page optimization |
| **Ubersuggest** | $29/month | Budget-friendly alternative, keyword research, content ideas |
| **Mangools (KWFinder)** | $49/month | Keyword difficulty analysis, SERP analysis |

**If you can only pick one**: Ahrefs for technical SEO and backlink focus. SEMrush for content and competitive analysis. Both are excellent.

---

## Keyword Categorization

### Mapping Keywords to Content Types

Organize your keywords into four categories, each with a different content strategy:

### Informational Keywords

**Pattern**: "what is...", "how to...", "why does...", "guide to..."
**Content type**: Blog posts, guides, tutorials, explainers
**Goal**: Attract top-of-funnel visitors, build authority, earn backlinks
**Conversion path**: Content → email signup → nurture → trial

**Examples for {{PROJECT_NAME}}:**
```
- "what is {{PRODUCT_CATEGORY}}"
- "how to {{KEY_TASK_1}}"
- "{{INDUSTRY_TOPIC}} best practices"
- "guide to {{RELEVANT_PROCESS}}"
- "{{TECHNICAL_CONCEPT}} explained"
```

### Navigational Keywords

**Pattern**: Brand names, product names, specific page searches
**Content type**: Homepage, product pages, docs
**Goal**: Capture brand-aware visitors
**Conversion path**: Direct to product page → trial/sign-up

**Examples for {{PROJECT_NAME}}:**
```
- "{{PROJECT_NAME}}"
- "{{PROJECT_NAME}} login"
- "{{PROJECT_NAME}} documentation"
- "{{PROJECT_NAME}} pricing"
- "{{PROJECT_NAME}} API"
```

### Commercial Keywords

**Pattern**: "best...", "top...", "...vs...", "...alternative", "...review"
**Content type**: Comparison pages, listicle posts, vs. pages
**Goal**: Capture mid-funnel visitors comparing options
**Conversion path**: Comparison content → product page → trial

**Examples for {{PROJECT_NAME}}:**
```
- "best {{PRODUCT_CATEGORY}} tools"
- "{{COMPETITOR_1}} vs {{COMPETITOR_2}}"
- "{{COMPETITOR}} alternative"
- "{{PRODUCT_CATEGORY}} comparison"
- "{{PROJECT_NAME}} review"
```

### Transactional Keywords

**Pattern**: "buy...", "pricing...", "sign up...", "free trial...", "download..."
**Content type**: Pricing pages, landing pages, sign-up pages
**Goal**: Capture high-intent visitors ready to act
**Conversion path**: Direct to conversion page → sign-up/purchase

**Examples for {{PROJECT_NAME}}:**
```
- "{{PROJECT_NAME}} free trial"
- "{{PRODUCT_CATEGORY}} pricing"
- "{{PROJECT_NAME}} sign up"
- "free {{PRODUCT_CATEGORY}}"
- "{{PRODUCT_CATEGORY}} for {{SPECIFIC_USE_CASE}}"
```

---

## Content-Keyword Mapping

### Template: Content-Keyword Map

Create this map for your site. Each page targets ONE primary keyword and 2-5 secondary keywords.

| Page | Primary Keyword | Secondary Keywords | Search Intent | Monthly Volume | Difficulty |
|------|----------------|-------------------|---------------|---------------|------------|
| Homepage | {{BRAND_KEYWORD}} | {{CATEGORY_KEYWORD}}, {{BROAD_KEYWORD}} | Navigational | {{VOL}} | {{DIFF}} |
| Pricing | {{BRAND}} pricing | {{CATEGORY}} pricing, {{CATEGORY}} cost | Transactional | {{VOL}} | {{DIFF}} |
| Features | {{CATEGORY}} features | {{FEATURE_1_KEYWORD}}, {{FEATURE_2_KEYWORD}} | Commercial | {{VOL}} | {{DIFF}} |
| Blog Post 1 | {{INFORMATIONAL_KW_1}} | {{RELATED_KW_1A}}, {{RELATED_KW_1B}} | Informational | {{VOL}} | {{DIFF}} |
| Blog Post 2 | {{INFORMATIONAL_KW_2}} | {{RELATED_KW_2A}}, {{RELATED_KW_2B}} | Informational | {{VOL}} | {{DIFF}} |
| Comparison | {{BRAND}} vs {{COMPETITOR}} | {{COMPETITOR}} alternative | Commercial | {{VOL}} | {{DIFF}} |
| Landing Page | {{TRANSACTIONAL_KW}} | {{SUPPORTING_KW_1}}, {{SUPPORTING_KW_2}} | Transactional | {{VOL}} | {{DIFF}} |

### Rules for Content-Keyword Mapping

1. **One primary keyword per page**: Do not try to rank one page for multiple unrelated keywords
2. **No keyword cannibalization**: Two pages should not target the same primary keyword (they compete with each other)
3. **Intent alignment**: The page content must match the search intent of the keyword
4. **Include the primary keyword in**: Title tag, H1, URL, meta description, first 100 words
5. **Include secondary keywords naturally**: In H2s, body copy, image alt text

---

## On-Page SEO Checklist

Run this checklist for EVERY page on your site.

### Title Tag
- [ ] Contains primary keyword (ideally near the beginning)
- [ ] Under 60 characters (Google truncates at ~60)
- [ ] Unique across all pages (no duplicate titles)
- [ ] Compelling — includes benefit or curiosity element
- [ ] Format: "Primary Keyword — Brand" or "Primary Keyword | Brand"

**Template**: `{{PRIMARY_KEYWORD}} — {{PROJECT_NAME}}`

### Meta Description
- [ ] Contains primary keyword (Google bolds matching terms)
- [ ] Under 155 characters
- [ ] Includes a call to action or value proposition
- [ ] Unique across all pages
- [ ] Reads naturally (not keyword-stuffed)

**Template**: `{{BENEFIT_STATEMENT}} with {{PROJECT_NAME}}. {{CTA_OR_PROOF}}. {{SECONDARY_BENEFIT}}.`

### URL Structure
- [ ] Contains primary keyword
- [ ] Short and descriptive (3-5 words after domain)
- [ ] Uses hyphens between words (not underscores)
- [ ] Lowercase only
- [ ] No unnecessary parameters or IDs

**Good**: `/blog/how-to-automate-deployments`
**Bad**: `/blog/post?id=12345&category=devops`

### Heading Structure
- [ ] One H1 per page (contains primary keyword)
- [ ] H2s for major sections (contain secondary keywords where natural)
- [ ] H3s for subsections
- [ ] Logical hierarchy (no skipping levels: H1 → H3 without H2)
- [ ] Headings describe section content (not "Section 1", "Section 2")

### Content
- [ ] Primary keyword appears in the first 100 words
- [ ] Primary keyword density: 0.5-1.5% (natural, not forced)
- [ ] Secondary keywords included naturally
- [ ] Content length is appropriate for the topic (generally 1,500+ words for blog posts)
- [ ] Content is comprehensive (covers the topic better than current top-ranking pages)
- [ ] Unique content (not duplicated from elsewhere)

### Internal Linking
- [ ] Links to 3-5 related pages on your site
- [ ] Anchor text is descriptive (not "click here")
- [ ] Links are contextually relevant
- [ ] Key pages receive the most internal links

### Images
- [ ] All images have descriptive alt text (include keyword where natural)
- [ ] File names are descriptive (not IMG_12345.jpg)
- [ ] Images are optimized (compressed, proper format)
- [ ] Image dimensions are specified (prevents layout shift)

### Technical
- [ ] Page has canonical URL set
- [ ] Open Graph tags for social sharing
- [ ] Structured data where applicable (FAQ, HowTo, Product)
- [ ] Page is mobile responsive
- [ ] Page loads in under 3 seconds

---

## Content Structure for SEO

### Pillar Pages and Topic Clusters

The most effective SEO content strategy uses the pillar/cluster model:

```
                    ┌─────────────┐
                    │ Pillar Page  │ (broad topic, 3,000-5,000 words)
                    │ "Complete    │
                    │  Guide to   │
                    │  CI/CD"     │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────┴──────┐ ┌────┴────┐  ┌──────┴──────┐
     │ Cluster Post│ │ Cluster │  │ Cluster Post│
     │ "GitHub     │ │ "Docker │  │ "Kubernetes │
     │  Actions    │ │  CI/CD  │  │  Deployment │
     │  Tutorial"  │ │  Guide" │  │  Best       │
     └─────────────┘ └─────────┘  │  Practices" │
                                  └─────────────┘
```

**How it works:**
- **Pillar page**: A comprehensive, authoritative page on a broad topic (targets a high-volume, competitive keyword)
- **Cluster posts**: Focused articles on specific subtopics (target long-tail keywords)
- **Internal links**: Every cluster post links back to the pillar page, and the pillar links to all clusters
- **SEO effect**: Google sees topical authority — your site becomes THE source on this subject

### Hub-and-Spoke Model

Similar to pillar/cluster but centered around use cases or audience segments:

```
Hub: "{{PROJECT_NAME}} for Startups"
├── Spoke: "How startups can automate deployments"
├── Spoke: "Deployment tools that scale from 1 to 100 engineers"
├── Spoke: "Case study: How [Startup] cut deploy time by 90%"
└── Spoke: "Startup deployment checklist"
```

### Content Depth vs. Competition

Before writing, analyze the top 5 results for your target keyword:

| Their Content | Your Strategy |
|---------------|---------------|
| Thin (< 500 words) | Write 1,500+ words with more depth |
| Average (1,000-2,000 words) | Write 2,500+ words with better structure, visuals, examples |
| Comprehensive (3,000+ words) | Match depth, add unique data/perspectives, better formatting |
| Video-heavy | Add video AND written content (cover both preferences) |

---

## Link Building Strategy

### Why Backlinks Matter

Backlinks (links from other websites to yours) are one of Google's strongest ranking signals. A page with high-quality backlinks will outrank a similar page without them.

### Ethical Link Building Methods

#### 1. Guest Posting

Write articles for other publications that include a link back to your site.

**Process:**
1. Find target publications: Search "[your industry] guest post" or "[your industry] write for us"
2. Study their content: Read 3-5 recent articles to understand their style
3. Pitch a topic: Email the editor with 2-3 topic ideas and brief outlines
4. Write the post: Follow their guidelines, include a natural link to your site
5. Promote: Share the published post on your social channels

**Where to guest post:**
- Industry blogs (DevTo, CSS-Tricks, Smashing Magazine for tech)
- Medium publications with large followings
- Company blogs of complementary (non-competing) products
- Industry newsletters

#### 2. Resource Page Link Building

Many websites maintain resource pages ("Best tools for X", "Useful links for Y"). Get your product listed.

**Process:**
1. Search: "[your industry] resources" or "[your industry] useful tools"
2. Find pages that list tools/resources in your category
3. Email the page owner: "I noticed your resource list on [topic]. We've built [Product] which [brief value prop]. Would you consider adding it?"
4. Make it easy: Provide the exact text and link they can copy-paste

#### 3. Broken Link Building

Find broken links on relevant websites and suggest your content as a replacement.

**Process:**
1. Use a tool like Ahrefs or Check My Links (Chrome extension) to find broken links on industry sites
2. If a broken link pointed to content similar to something you have, contact the site owner
3. "I noticed a broken link on your [page]. It was pointing to [dead URL]. I have a similar resource at [your URL] that might be a good replacement."

#### 4. HARO / Connectively

Respond to journalist queries to get quoted (with a backlink) in articles.

**Process:**
1. Sign up at helpareporter.com or connectively.us
2. Receive daily emails with journalist queries
3. Respond to relevant queries within 2 hours (speed matters)
4. Provide expert, concise answers
5. If selected, you get a mention and often a backlink from high-authority publications

#### 5. Creating Linkable Assets

Create content so valuable that people link to it naturally:

- **Original research/data**: Surveys, studies, industry reports
- **Free tools**: Calculators, generators, checklists
- **Comprehensive guides**: The definitive guide on a topic
- **Infographics**: Visual data that others embed (with attribution)
- **Open-source projects**: Repositories that get referenced

### Link Building to Avoid

- **Buying links**: Against Google's guidelines, can result in penalties
- **Link exchanges**: "I'll link to you if you link to me" at scale looks unnatural
- **PBNs (Private Blog Networks)**: Google is very good at detecting these
- **Comment spam**: Links in blog comments, forums, etc. (usually nofollow anyway)
- **Low-quality directories**: Submitting to hundreds of random directories

---

## Local SEO

### When Local SEO Matters

Local SEO matters if you:
- Have a physical office or store
- Serve a specific geographic area
- Want to appear in "near me" searches
- Are a service business (agency, consultancy)

### Local SEO Checklist

- [ ] **Google Business Profile**: Create and verify your profile at business.google.com
- [ ] **NAP consistency**: Name, Address, Phone number are identical across all online listings
- [ ] **Local citations**: List your business on Yelp, Bing Places, Apple Maps, industry directories
- [ ] **Google reviews**: Actively request reviews from customers (respond to all reviews)
- [ ] **Local keywords**: Include city/region in title tags and content where relevant
- [ ] **Local content**: Create content about local events, partnerships, community involvement
- [ ] **Schema markup**: Add LocalBusiness structured data to your site

---

## Technical SEO Foundations

Technical SEO is covered in detail in the `seo-technical-checklist.md` file. Key foundations:

- [ ] Site is crawlable (robots.txt is not blocking important pages)
- [ ] XML sitemap exists and is submitted to Google Search Console
- [ ] HTTPS is enabled across the entire site
- [ ] Site loads quickly (Core Web Vitals pass)
- [ ] Site is mobile-responsive
- [ ] No duplicate content issues (canonical URLs set)
- [ ] No broken internal links (404 errors)
- [ ] Structured data is implemented where applicable

---

## SEO Timeline Expectations

SEO is a long-term investment. Set realistic expectations:

### Months 1-3: Foundation

**What to expect**: Minimal organic traffic growth. This phase is about building the foundation.

**Activities:**
- Set up Google Search Console and analytics
- Conduct keyword research
- Optimize existing pages (on-page SEO)
- Fix technical SEO issues
- Start publishing content (2-4 posts)
- Begin link building efforts

### Months 3-6: Early Growth

**What to expect**: First signs of ranking improvements. Some long-tail keywords start appearing in search results (page 2-3 positions).

**Activities:**
- Continue publishing content consistently
- Optimize content based on Search Console data
- Build pillar/cluster content structure
- Earn first backlinks
- Track keyword ranking movements

### Months 6-12: Compound Growth

**What to expect**: Meaningful organic traffic growth. Some pages reach page 1 for target keywords. Traffic compounds as content library grows.

**Activities:**
- Scale content production
- Update and optimize top-performing content
- Build more backlinks
- Create linkable assets (guides, tools, data)
- Expand keyword targets based on what is working

### Months 12+: Established Authority

**What to expect**: Consistent organic traffic growth. New content ranks faster due to domain authority. Organic becomes a significant traffic channel.

**Activities:**
- Maintain content quality and freshness
- Protect rankings from competitors
- Expand into adjacent topic areas
- Consider international SEO if relevant
- Regular technical audits

### Realistic Growth Curve

```
Traffic
  ^
  |                                    ╱
  |                                 ╱
  |                              ╱
  |                           ╱
  |                        ╱
  |                    ╱
  |               ╱
  |          ╱
  |     ╱
  | ╱
  +────────────────────────────────────>
  0   3    6    9   12   15   18  months

  ↑ Foundation ↑  Early  ↑ Compound growth
                  Growth
```

**Key message**: SEO results compound. The first 3 months feel slow. The growth after month 6 accelerates. Consistency is everything.

---

## Product-Type-Specific SEO

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### SaaS SEO Strategy

**Priority keywords:**
1. "{{PRODUCT_CATEGORY}} software" / "{{PRODUCT_CATEGORY}} tool"
2. "best {{PRODUCT_CATEGORY}} for [audience]"
3. "[Competitor] alternative"
4. "[Competitor] vs [Competitor]" (include yourself)
5. "how to [solve problem your product solves]"

**Key pages to optimize:**
- Homepage (brand + category keywords)
- Feature pages (individual feature keywords)
- Pricing page ("{{product}} pricing")
- Comparison pages ("{{product}} vs {{competitor}}")
- Integration pages ("{{product}} {{integration}} integration")

**Content strategy:**
- Tutorial blog posts (how to use your product for specific tasks)
- Comparison articles (your product vs. each competitor)
- Industry guides (comprehensive guides on topics your audience cares about)
- Case studies (optimized for "[industry] {{product category}} case study")
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "developer-tool" -->
### Developer Tool SEO Strategy

**Priority keywords:**
1. "{{TECHNOLOGY}} {{TOOL_TYPE}}" (e.g., "Node.js deployment tool")
2. "how to {{TASK}} with {{TECHNOLOGY}}"
3. "{{TECHNOLOGY}} tutorial"
4. "{{TOOL_TYPE}} for {{FRAMEWORK}}"
5. "{{COMPETITOR}} alternative for {{TECHNOLOGY}}"

**Key pages to optimize:**
- Homepage (product + technology keywords)
- Documentation (ranks for how-to queries)
- Getting started guide (ranks for tutorial queries)
- Integrations page (ranks for "[tool] + [technology]" queries)

**Content strategy:**
- Technical tutorials (step-by-step, with code examples)
- Documentation (comprehensive, well-structured docs rank extremely well)
- Comparison articles (your tool vs. alternatives for specific languages/frameworks)
- Performance benchmarks (developers search for "[tool] performance" and "[tool] benchmarks")
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "ecommerce" -->
### E-Commerce SEO Strategy

**Priority keywords:**
1. Product names and categories
2. "[Product type] for [use case]"
3. "best [product type]"
4. "[Product type] reviews"
5. "buy [product] online"

**Key pages to optimize:**
- Product pages (product-specific keywords, schema markup)
- Category pages (category keywords, filters)
- Homepage (brand + main category)
- Blog (informational content driving top-of-funnel traffic)

**Content strategy:**
- Buying guides ("How to choose the right [product]")
- Comparison content ("[Product A] vs [Product B]")
- Use case content ("Best [products] for [specific use]")
- Product reviews and unboxing content
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile-app" -->
### Mobile App SEO (ASO + Web)

**Priority keywords:**
1. "[App category] app"
2. "best [app category] app for [platform]"
3. "[Competitor] alternative app"
4. "how to [task your app helps with]"

**Key strategies:**
- **App Store Optimization (ASO)**: Optimize app name, subtitle, keywords, description, and screenshots in App Store / Play Store
- **Website SEO**: Create a website with landing pages targeting web search keywords
- **Deep linking**: Use deep links so Google can index app content
- **App indexing**: Submit your app to Google for app indexing (Firebase App Indexing)
<!-- ENDIF -->

---

## SEO Measurement & Reporting

### Key Metrics to Track

| Metric | Tool | Frequency |
|--------|------|-----------|
| **Organic traffic** | Google Analytics 4 | Weekly |
| **Keyword rankings** | Google Search Console / Ahrefs | Weekly |
| **Click-through rate (CTR)** | Google Search Console | Monthly |
| **Backlinks gained** | Ahrefs / Search Console | Monthly |
| **Page-level organic traffic** | Google Analytics 4 | Monthly |
| **Conversion rate from organic** | Google Analytics 4 | Monthly |
| **Core Web Vitals** | PageSpeed Insights / Search Console | Monthly |
| **Index coverage** | Google Search Console | Monthly |

### Monthly SEO Report Template

```
## SEO Report — {{MONTH}} {{YEAR}}

### Traffic Summary
- Organic sessions: {{NUMBER}} ({{CHANGE}}% vs last month)
- Organic users: {{NUMBER}}
- Top landing pages from organic:
  1. {{PAGE}} — {{SESSIONS}} sessions
  2. {{PAGE}} — {{SESSIONS}} sessions
  3. {{PAGE}} — {{SESSIONS}} sessions

### Keyword Rankings
- Keywords on page 1: {{NUMBER}}
- Keywords on page 2: {{NUMBER}}
- New keywords ranking: {{NUMBER}}
- Keywords improved: {{LIST}}
- Keywords declined: {{LIST}}

### Content Published
- {{NUMBER}} new pages/posts published
- Topics: {{LIST}}

### Backlinks
- New backlinks: {{NUMBER}}
- Referring domains: {{NUMBER}}
- Notable backlinks: {{LIST}}

### Technical Health
- Pages indexed: {{NUMBER}}
- Crawl errors: {{NUMBER}}
- Core Web Vitals status: {{PASS/FAIL}}

### Next Month Priorities
1. {{PRIORITY_1}}
2. {{PRIORITY_2}}
3. {{PRIORITY_3}}
```
