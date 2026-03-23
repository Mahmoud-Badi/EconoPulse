# Content Quality Signals for SEO

> Google's ranking algorithms evaluate content quality through dozens of signals — from E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) to topical completeness, entity salience, freshness, and uniqueness. This guide breaks down each signal, explains how to demonstrate it, and provides a scoring rubric for auditing your content before and after publication.

---

## Table of Contents

1. [E-E-A-T Breakdown](#e-e-a-t-breakdown)
2. [Content Depth Analysis](#content-depth-analysis)
3. [NLP-Based Content Optimization](#nlp-based-content-optimization)
4. [Featured Snippet Optimization](#featured-snippet-optimization)
5. [People Also Ask Targeting](#people-also-ask-targeting)
6. [Content Uniqueness and Helpful Content](#content-uniqueness-and-helpful-content)
7. [Author Authority Signals](#author-authority-signals)
8. [Content Freshness Signals and Their Weight](#content-freshness-signals-and-their-weight)
9. [Quality Scoring Rubric](#quality-scoring-rubric)
10. [Tools for Content Quality Assessment](#tools-for-content-quality-assessment)

---

## E-E-A-T Breakdown

E-E-A-T is Google's framework for evaluating content quality. It stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It is not a direct ranking factor — Google does not have an "E-E-A-T score." Instead, E-E-A-T is the lens through which human quality raters evaluate search results, and those evaluations inform algorithmic improvements.

For YMYL (Your Money or Your Life) topics — health, finance, safety, legal — E-E-A-T signals are weighted heavily. For casual informational content, they matter less but still differentiate competitive pages.

### Experience

**What it means:** The content creator has first-hand, real-world experience with the topic. Not book knowledge — actual hands-on involvement.

**How Google detects it:**
- First-person accounts ("When I implemented this...")
- Original photos and screenshots (not stock images)
- Specific details that only someone with experience would know
- Product reviews with evidence of actual product use

**How to demonstrate it:**

| Signal | Implementation |
|--------|---------------|
| First-person narrative | Include sections like "What we learned after 6 months of..." or "Having deployed this to 10,000 users, here's what actually happens..." |
| Original screenshots | Show real dashboards, real data (anonymized if needed), real interfaces — not mockups or stock images |
| Specific numbers and timelines | "This took 3 weeks, cost $4,200, and required 2 engineers" beats "This is fast and affordable" |
| Process documentation | Describe the actual steps you took, including mistakes and pivots — not just the idealized process |
| Before/after comparisons | Show measurable outcomes from your experience: "Traffic went from 1,200 to 8,400 after implementing..." |

### Expertise

**What it means:** The content creator has deep knowledge of the subject — through education, professional work, or extensive study.

**How Google detects it:**
- Author credentials (degree, certifications, professional experience)
- Depth of coverage (covers nuances that a non-expert would miss)
- Technical accuracy (verified against authoritative sources)
- Recognition by peers (quoted by other experts, published in respected outlets)

**How to demonstrate it:**

| Signal | Implementation |
|--------|---------------|
| Author bio with credentials | Include a detailed author bio on every page: "Jane Smith is a certified SEO professional with 12 years of experience and has managed organic search for Fortune 500 brands." |
| Depth beyond surface level | Cover edge cases, exceptions, and nuances. If you are explaining a technique, address when it does NOT work — only an expert knows the limitations. |
| Citations and references | Cite primary sources (Google's documentation, academic papers, official guidelines) — not other blog posts that summarize the same thing. |
| Technical precision | Use correct terminology. Explain complex concepts accurately. Avoid simplifications that are technically wrong. |
| Author schema markup | Implement `Person` schema for authors with `sameAs` links to their professional profiles |

### Authoritativeness

**What it means:** The content creator and the website are recognized authorities on the topic. Other experts, publications, and institutions reference them.

**How Google detects it:**
- Backlinks from authoritative sites (other experts link to you as a reference)
- Brand mentions in authoritative publications
- Consistent coverage of the topic (not a one-off article on a random blog)
- Domain history and topical focus

**How to demonstrate it:**

| Signal | Implementation |
|--------|---------------|
| Topical coverage | Publish comprehensively on your topic — a single article does not establish authority. Build topic clusters (see `strategy/topic-cluster-architecture.template.md`). |
| Earn editorial backlinks | When authoritative sites link to you naturally, it signals that experts consider your content reference-worthy. |
| "As featured in" signals | Display media coverage, speaking engagements, and industry recognition. |
| Consistent brand presence | Publish regularly on your topic. Be the site that people associate with your niche. |
| Contribute to authoritative platforms | Guest posts, conference talks, podcast appearances, and academic contributions build authority that Google can trace. |

### Trustworthiness

**What it means:** The content and the website are reliable, honest, and transparent. Users can trust the information and the organization behind it.

**How Google detects it:**
- HTTPS security
- Clear authorship and organizational identity
- Transparent business practices (contact information, privacy policy, terms of service)
- Accurate information (verified against authoritative sources)
- User reviews and reputation signals

**How to demonstrate it:**

| Signal | Implementation |
|--------|---------------|
| HTTPS | Non-negotiable. Every page must be served over HTTPS. |
| Contact information | Publish a real address, phone number, and email — not just a contact form. |
| Privacy and terms | Clear, accessible privacy policy and terms of service. |
| Editorial standards | Publish your editorial policy: how content is researched, reviewed, and updated. |
| Corrections | If you make an error, correct it visibly: "Correction [date]: This article previously stated X. The correct figure is Y." |
| Source attribution | Link to sources for every claim. Do not make unsupported assertions. |
| Conflict of interest disclosure | If you review a product and have an affiliate relationship, disclose it. If you write about a competitor, disclose that too. |

---

## Content Depth Analysis

Content depth is not word count. It is topical completeness — how thoroughly your content covers the topic relative to what a searcher needs and what competitors provide.

### Measuring Depth Against Competitors

**Process:**
1. Search the target keyword
2. Open the top 5 organic results
3. Extract every subtopic, heading, and concept covered
4. Build a completeness matrix:

| Subtopic | Our Page | Competitor 1 | Competitor 2 | Competitor 3 | Competitor 4 | Competitor 5 |
|----------|----------|-------------|-------------|-------------|-------------|-------------|
| [Topic A] | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No |
| [Topic B] | | | | | | |
| [Topic C] | | | | | | |
| [Topic D] | | | | | | |

5. Identify:
   - **Must-have topics:** Covered by 4-5 of 5 competitors (expected by searchers)
   - **Differentiator topics:** Covered by 0-1 of 5 competitors (opportunity to stand out)
   - **Overcovered topics:** Covered by all, including us, but not adding value (candidate for trimming)

### Depth vs. Length

| Content Characteristic | Good | Bad |
|----------------------|------|-----|
| Covers all subtopics the searcher needs | Deep, even if short | — |
| Covers subtopics no one asked about | — | Padded, not deep |
| 5,000 words, every word adds value | Deep | — |
| 5,000 words, could be said in 2,000 | — | Long, not deep |
| 1,500 words, answers the query completely | Deep | — |
| 1,500 words, skips critical subtopics | — | Shallow |

**Rule of thumb:** Your content should be as long as it needs to be to cover the topic completely, and not one sentence longer. Padding hurts engagement metrics (time on page, scroll depth, bounce rate) which indirectly hurts rankings.

---

## NLP-Based Content Optimization

Google uses natural language processing to understand content semantically — not just keyword matching. Modern SEO content optimization involves aligning your content with the semantic expectations of search engines.

### TF-IDF Concepts

TF-IDF (Term Frequency-Inverse Document Frequency) measures how important a term is to a document relative to a corpus of documents. In SEO, the "corpus" is the top-ranking pages for your target keyword.

**How it works for SEO:**
- Tools like Clearscope, SurferSEO, and MarketMuse analyze the top-ranking pages for a keyword
- They identify terms that appear frequently across those pages but not in average web content
- These terms are semantically expected in content about your topic
- Including them signals to Google that your content is topically comprehensive

**Example:** If you are writing about "customer churn," the NLP analysis might reveal that top-ranking pages frequently mention:
- retention rate, cohort analysis, NPS, onboarding, customer success, win-back campaigns, churn prediction, MRR, CLV

If your content discusses customer churn but never mentions "cohort analysis" or "customer lifetime value," Google's NLP models may rate it as less comprehensive than competitors.

### Entity Salience

Entity salience measures how important a specific entity (person, company, concept, product) is to a page. Google uses entity salience to understand what a page is "about" beyond keywords.

**How to optimize for entity salience:**
- **Mention your primary entity early** — the first 100-200 words of your content
- **Define the entity clearly** — "Customer churn is the rate at which customers stop doing business with a company" (explicit definition helps Google's knowledge graph)
- **Use the entity consistently** — don't switch between "churn," "attrition," "customer loss," and "turnover" randomly. Pick a primary term and use it consistently, with variations as secondary mentions.
- **Connect to related entities** — mention related concepts (retention, CLV, NPS) to establish the semantic field

### Semantic Relevance Score

Think of it as: "If an expert on this topic read your content, would they say it covers the subject comprehensively?"

**Factors that increase semantic relevance:**
- Answering the questions implied by the query (not just the literal query)
- Covering the logical subtopics (if you discuss X, the reader expects you to also discuss Y)
- Using the terminology an expert would use
- Providing context that connects the topic to related concepts

**Factors that decrease semantic relevance:**
- Keyword stuffing (mentioning the primary keyword unnaturally often)
- Off-topic tangents (sections that don't serve the searcher's intent)
- Missing expected subtopics (creating a gap the searcher has to fill elsewhere)

---

## Featured Snippet Optimization

Featured snippets appear above position 1 — "position zero." They extract a direct answer from a page and display it prominently. Winning a featured snippet dramatically increases CTR and visibility.

### Snippet Types and How to Win Each

#### Paragraph Snippets (Most Common — ~70% of Featured Snippets)

**What they look like:** A short paragraph (40-60 words) answering a question directly.

**How to win:**
- Identify the question the snippet answers (check "People Also Ask" for patterns)
- Place the question as an H2 or H3 heading
- Immediately below the heading, provide a concise answer in 40-60 words
- Follow the concise answer with expanded detail
- Use a definition or explanation format: "[Term] is [definition]. It [key characteristic]. [Why it matters]."

**Formatting template:**
```
## What Is [Topic]?

[Topic] is [40-60 word clear, direct definition/answer that can stand alone
as a complete response to the query. This paragraph should be factual,
specific, and directly answer the query without filler words or preambles
like "In this article, we'll explain..."]

[Expanded explanation follows below...]
```

#### List Snippets (~20% of Featured Snippets)

**What they look like:** A numbered or bulleted list extracted from the page.

**How to win:**
- Use an H2 heading that matches the snippet query (e.g., "How to [do thing]" or "Best [category]")
- Immediately follow with a numbered or bulleted list
- Each list item should start with a bolded key term or step name
- Keep each item to 1-2 sentences
- Google typically shows 5-8 items — structure your list for that length

**Formatting template:**
```
## How to [Achieve Outcome]

1. **Step/Item Name** — Brief description (1-2 sentences).
2. **Step/Item Name** — Brief description (1-2 sentences).
3. **Step/Item Name** — Brief description (1-2 sentences).
4. **Step/Item Name** — Brief description (1-2 sentences).
5. **Step/Item Name** — Brief description (1-2 sentences).
```

#### Table Snippets (~10% of Featured Snippets)

**What they look like:** A data table extracted from the page.

**How to win:**
- Use an HTML `<table>` element (not a CSS-styled div grid)
- Include clear `<th>` header cells
- Keep tables to 3-5 columns and 4-8 rows (Google truncates larger tables)
- Use the query as the section heading immediately above the table
- Ensure the data is directly responsive to the query

**Formatting template:**
```
## [Query as Heading]

| [Column A] | [Column B] | [Column C] |
|------------|------------|------------|
| [Data] | [Data] | [Data] |
| [Data] | [Data] | [Data] |
| [Data] | [Data] | [Data] |
```

#### Video Snippets

**What they look like:** A video (usually YouTube) with a timestamp showing where the answer appears.

**How to win:**
- Create a YouTube video that directly answers the target query
- Add timestamps in the video description ("0:00 Introduction, 1:23 [Answer to query]")
- Use the query as the video title or include it in the first 100 characters
- Add chapters to the video (YouTube's timestamp-based chapters)
- Include a transcript

### Featured Snippet Targeting Workflow

1. Identify keywords where you already rank positions 1-10 (you need to be on page 1 to win a snippet)
2. Check if a featured snippet exists for each keyword (SERP analysis)
3. Determine the snippet type (paragraph, list, table, video)
4. Format your content to match the expected snippet format
5. If you already own the snippet, ensure competitors cannot easily replicate your formatting
6. Monitor snippet ownership weekly — snippets can change rapidly

---

## People Also Ask Targeting

PAA boxes appear for most informational queries and expand with related questions. Each question is an opportunity to appear in a highly visible search feature.

### How PAA Works

- Google generates PAA questions from the most common related queries
- Clicking a PAA question expands an answer extracted from a web page (with a link)
- Each click reveals additional PAA questions (infinite expansion)
- The source page does NOT need to rank in the top 10 to appear in PAA

### PAA Optimization Strategy

**Step 1: Find PAA Questions**

For your target keyword, search in an incognito browser and note all PAA questions. Click each to reveal more. Collect 10-20 questions per keyword.

Also use:
- AlsoAsked.com — maps PAA questions in a tree structure
- SEMrush / Ahrefs — both report PAA questions in SERP analysis features

**Step 2: Structure Content to Answer PAA Questions**

Use PAA questions as subheadings in your content:

```
## [PAA Question — verbatim or close paraphrase]

[Direct answer in 40-60 words — this is what gets extracted]

[Expanded explanation, examples, data, or context — this is for the reader
who clicks through to your page]
```

**Step 3: Create a Dedicated FAQ Section**

For PAA questions that don't fit naturally into your content flow, add a FAQ section at the end:

```
## Frequently Asked Questions

### [PAA Question 1]

[Concise answer — 2-3 sentences]

### [PAA Question 2]

[Concise answer — 2-3 sentences]

### [PAA Question 3]

[Concise answer — 2-3 sentences]
```

Add FAQ schema markup to this section for additional SERP visibility:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[PAA Question 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Concise answer]"
      }
    }
  ]
}
```

### PAA Monitoring

Track which PAA questions you appear for:
- SEMrush Position Tracking → filter by SERP feature "People Also Ask"
- Ahrefs → SERP Features report
- Manual checks for high-priority keywords

---

## Content Uniqueness and Helpful Content

Google's Helpful Content system (now integrated into the core ranking algorithm) evaluates whether content provides genuine value or exists primarily to attract search traffic.

### What Google Considers "Helpful Content"

| Helpful | Not Helpful |
|---------|-------------|
| Written for a specific audience with a specific need | Written for "anyone searching for [keyword]" |
| Provides a satisfying, complete answer | Answers the query superficially and pads with tangential content |
| Based on original research, analysis, or experience | Summarizes what other pages already say without adding value |
| Has a clear author with identifiable credentials | No author, or author with no verifiable expertise |
| Would be valuable even if search engines didn't exist | Would have no audience if it didn't rank in Google |
| Leaves the reader feeling they learned something | Leaves the reader needing to search again for a better answer |

### Content Uniqueness Signals

| Signal | How to Achieve |
|--------|---------------|
| **Original data** | Include proprietary research, analysis, or metrics that no other page has |
| **Original perspective** | Share an informed opinion, framework, or methodology unique to your experience |
| **Original examples** | Use your own case studies, screenshots, and results — not borrowed examples |
| **Original visuals** | Create diagrams, charts, and infographics — not stock photos |
| **Comprehensive aggregation** | If you are aggregating information from multiple sources, add analysis, comparison, and synthesis that the individual sources don't provide |
| **Better format** | If existing content is all text, add tables, visual comparisons, interactive elements, or videos |

### Self-Assessment: Is This Content Helpful?

Before publishing, answer these questions honestly:

- [ ] Would I share this with a colleague who asked me about this topic?
- [ ] Does this page contain information or insight that isn't on the top 5 results?
- [ ] If I remove the SEO-targeted headings and keywords, is the content still useful?
- [ ] Does this cover the topic deeply enough that the reader doesn't need to search again?
- [ ] Is the author credible on this topic, and is that credibility visible on the page?
- [ ] Would I be proud to put my name on this content?

If any answer is "no," revise before publishing.

---

## Author Authority Signals

Google increasingly evaluates who wrote the content, not just what the page says. Author authority is especially critical for YMYL topics.

### Author Bio Requirements

Every piece of content should have an author bio that includes:

| Element | Why It Matters | Example |
|---------|---------------|---------|
| Full name | Establishes a real, identifiable person | "Sarah Chen" |
| Title and organization | Professional context | "Senior SEO Strategist at {{PROJECT_NAME}}" |
| Relevant credentials | Expertise proof | "Certified in Google Analytics and Ahrefs. 10+ years in organic search." |
| Experience statement | First-hand experience | "Has managed SEO for brands including [notable clients/projects]" |
| Photo | Trust signal — real person behind the content | Professional headshot (not AI-generated) |
| Links to professional profiles | Verifiable identity | LinkedIn, Twitter/X, personal site |

### Author Schema Markup

Implement `Person` schema for every content author:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "author": {
    "@type": "Person",
    "name": "Sarah Chen",
    "jobTitle": "Senior SEO Strategist",
    "worksFor": {
      "@type": "Organization",
      "name": "{{PROJECT_NAME}}"
    },
    "sameAs": [
      "https://linkedin.com/in/sarahchen",
      "https://twitter.com/sarahchen"
    ],
    "url": "https://{{DOMAIN}}/team/sarah-chen"
  }
}
```

### Building Author Authority Over Time

1. **Publish consistently under the same byline** — Google builds an entity profile for authors who publish regularly
2. **Get bylines on external authoritative sites** — guest posts, industry publications, contributed articles
3. **Earn mentions and citations** — when other sites cite your author by name, it strengthens the entity
4. **Build a knowledge panel** — authors with sufficient entity signals can earn a Google Knowledge Panel (search for your name → right sidebar)
5. **Create a dedicated author page** — one URL per author with bio, credentials, and links to all their published content

---

## Content Freshness Signals and Their Weight

Not all content needs to be fresh. Google applies freshness signals selectively based on the query type.

### Query Freshness Demand (QDF)

| Query Type | Freshness Weight | Examples |
|-----------|-----------------|---------|
| **Breaking news** | Extremely high — minutes matter | "election results," "[company] layoffs" |
| **Trending topics** | Very high — hours/days | "new iPhone review," "[celebrity] controversy" |
| **Regularly updating** | High — content must be current year | "best laptops 2025," "tax brackets 2025" |
| **Seasonal** | Moderate — must match the current season/year | "winter jacket reviews," "summer internships" |
| **Evergreen informational** | Low — accuracy matters more than recency | "how photosynthesis works," "what is compound interest" |
| **Historical/reference** | Very low — accuracy and completeness trump freshness | "history of the internet," "theory of relativity" |

### Freshness Signals Google Uses

| Signal | How It Works | How to Optimize |
|--------|-------------|----------------|
| **Page creation date** | Initial indexing date | Publish promptly when targeting time-sensitive queries |
| **Content modification date** | When the page content substantively changed | Update content and `dateModified` schema when making real changes |
| **Inception date** | When the topic/event the content discusses first appeared | Reference the most recent developments and data |
| **Link freshness** | New links to a page signal continued relevance | Earn ongoing backlinks (not just a burst at publication) |
| **User engagement freshness** | Continued clicks and engagement from search results | Re-promote and refresh content to maintain engagement signals |
| **Core content freshness** | Whether the body text itself has been updated | Update statistics, examples, and references — not just the date |

### Freshness Optimization by Content Type

| Content Type | Freshness Strategy |
|-------------|-------------------|
| Annual guides ("Best X in 2025") | Rewrite annually with new data. Include the year in the title. Publish the updated version in December/January for the coming year. |
| Tool/product reviews | Update pricing, features, and screenshots quarterly. Add new competitors as they emerge. |
| How-to guides (technical) | Update when the underlying technology releases a new version. Verify all code snippets and screenshots. |
| Statistical/data content | Update when new data is available (often annually). Clearly label the data year. |
| Evergreen conceptual content | Update every 18-24 months to add new examples, fix links, and refine explanations. |
| News/trend analysis | Do not update — let it age naturally. Publish new analysis for new developments instead. |

---

## Quality Scoring Rubric

Use this rubric to score content quality before publication and during content audits. Score each dimension 1-5, then calculate the total.

### Scoring Dimensions

| # | Dimension | 1 (Poor) | 3 (Acceptable) | 5 (Excellent) | Score |
|---|-----------|----------|-----------------|---------------|-------|
| 1 | **Experience** | No evidence of first-hand experience | Some experience signals (first-person references) | Rich with original screenshots, specific numbers, real case studies | /5 |
| 2 | **Expertise** | Generic content anyone could write | Accurate with some expert insights | Deep, nuanced, covers edge cases only an expert would know | /5 |
| 3 | **Authoritativeness** | No author attribution; unknown site | Named author with basic bio; established site | Recognized expert author; authoritative domain with strong topical coverage | /5 |
| 4 | **Trustworthiness** | No sources cited; no contact info; errors present | Some sources; basic contact info; factually accurate | All claims sourced; transparent editorial standards; corrections policy; HTTPS | /5 |
| 5 | **Topical Completeness** | Misses 3+ subtopics that competitors cover | Covers all expected subtopics | Covers all expected subtopics plus unique differentiator topics | /5 |
| 6 | **Content Depth** | Surface-level; could be answered in 2 sentences | Adequate coverage; answers the query | Thorough coverage with examples, data, edge cases, and actionable detail | /5 |
| 7 | **Uniqueness** | Rehashes what other pages say | Some original insights or examples | Substantial original data, research, perspective, or analysis | /5 |
| 8 | **Formatting and Readability** | Wall of text; no headings; no visuals | Headings, some lists, adequate visuals | Clear hierarchy; scannable; tables, lists, visuals, and white space; mobile-friendly | /5 |
| 9 | **Freshness** | Outdated stats, dead links, old screenshots | Mostly current; 1-2 outdated elements | All data current; recent examples; verified links; dateModified accurate | /5 |
| 10 | **Search Intent Alignment** | Content format doesn't match what the searcher needs | Content format roughly matches; some friction | Content format perfectly matches intent; searcher need is satisfied completely | /5 |
| | **TOTAL** | | | | **/50** |

### Score Interpretation

| Score Range | Assessment | Action |
|-------------|-----------|--------|
| 40-50 | Excellent — competitive for page 1 | Publish and monitor |
| 30-39 | Good — competitive with minor improvements | Address lowest-scoring dimensions before publishing |
| 20-29 | Needs work — will struggle to rank | Significant revision needed; use content brief to identify gaps |
| Below 20 | Not ready — do not publish | Return to the content brief stage; the approach may need rethinking |

---

## Tools for Content Quality Assessment

### Paid Tools

| Tool | What It Does | Best For | Price Range |
|------|-------------|---------|-------------|
| **Clearscope** | NLP-based content optimization; grades content against top-ranking pages; recommends terms | Content teams producing 5+ articles/month | $170-$1,200/month |
| **SurferSEO** | Content scoring, NLP term suggestions, SERP analysis, content outline generator | SEO teams wanting real-time optimization guidance | $89-$239/month |
| **MarketMuse** | Content planning and optimization; identifies topic gaps; content brief generation | Large content operations with 50+ pages | $149-$399/month |
| **Frase.io** | Content optimization, SERP analysis, content brief creation, AI writing assistance | Small teams wanting a combined optimization + writing tool | $15-$115/month |
| **SEMrush SEO Writing Assistant** | Real-time content scoring against target keywords | Teams already using SEMrush | Included in SEMrush plans |

### Free and Low-Cost Methods

When paid tools are not in the budget, you can achieve 80% of the same insights manually:

#### Manual TF-IDF Analysis

1. Search your target keyword
2. Open the top 5 organic results
3. Copy each page's content into a word frequency analyzer (wordcounter.net or a spreadsheet)
4. Identify terms that appear in 4-5 of 5 competitors but not in your content
5. Determine which of those terms are genuinely relevant (not all frequent terms matter)
6. Incorporate the relevant missing terms naturally into your content

#### Free Readability Analysis

- **Hemingway Editor** (hemingwayapp.com): Readability grade, sentence complexity, passive voice detection
- **Yoast SEO** (WordPress plugin): Basic content scoring, keyword density, readability
- **Grammarly** (free tier): Grammar, clarity, and tone analysis

#### Google Search Console as a Content Quality Signal

GSC data reveals how Google perceives your content quality:

| Metric | What It Signals | How to Use |
|--------|----------------|-----------|
| **CTR for target keyword** | Whether your title and description attract clicks vs. competitors | If CTR is below average for your position, improve title and meta description |
| **Queries your page ranks for** | Which topics Google associates with your page | If Google ranks your page for irrelevant queries, your topical focus is unclear |
| **Position stability** | Whether Google is confident in your ranking | Fluctuating positions suggest Google is testing whether your page deserves its spot |
| **Impressions without clicks** | Whether your page appears but fails to attract interest | High impressions + low CTR = title/description mismatch with searcher intent |

#### Competitor Content Audit (Free)

For any target keyword, build a comparison matrix manually:

1. Open top 5 results
2. For each, document: word count, number of images, number of headings, topics covered, unique elements
3. Score your content against this matrix
4. Close the gaps identified

This takes 30-60 minutes per keyword but provides the same core insight as paid tools: what does Google consider comprehensive for this query?

---

## Cross-References

- **Content brief template (E-E-A-T and quality sections):** `content-seo/content-brief.template.md`
- **Content decay and refresh (freshness):** `content-seo/content-decay-refresh.md`
- **On-page content optimization framework:** `on-page/content-optimization-framework.template.md`
- **Featured snippet strategy (expanded):** `content-seo/featured-snippet-optimization.template.md`
- **Topic cluster architecture (topical authority):** `strategy/topic-cluster-architecture.template.md`
- **Keyword-content mapping (intent alignment):** `content-seo/keyword-content-mapping.template.md`
- **AI search optimization (content for LLMs):** `ai-seo/ai-search-optimization.template.md`
- **Structured data cookbook (schema markup):** `technical/structured-data-cookbook.md`
