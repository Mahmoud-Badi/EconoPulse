# LLM-Friendly Content Patterns

How to structure content on {{PROJECT_NAME}} so that large language models can accurately retrieve, understand, and cite it. This is not about gaming AI systems — it is about making your content maximally useful to both humans and machines.

---

## Table of Contents

1. [Clear Heading Hierarchies](#clear-heading-hierarchies)
2. [Definition-First Paragraph Structure](#definition-first-paragraph-structure)
3. [Structured Data as LLM Context](#structured-data-as-llm-context)
4. [FAQ Sections as Retrieval Targets](#faq-sections-as-retrieval-targets)
5. [Entity Clarity](#entity-clarity)
6. [Content Freshness Signals](#content-freshness-signals)
7. [Robots.txt Directives for AI Bots](#robotstxt-directives-for-ai-bots)
8. [Schema Markup for LLM Comprehension](#schema-markup-for-llm-comprehension)
9. [Citation-Worthy Content Patterns](#citation-worthy-content-patterns)
10. [Content That Survives LLM Summarization](#content-that-survives-llm-summarization)

---

## Clear Heading Hierarchies

LLMs use heading structure as their primary signal for understanding document organization. When a retrieval-augmented generation (RAG) system chunks your page, headings define the chunk boundaries and topic labels. Poor heading structure leads to misattribution and missed citations.

### Why Headings Matter More for LLMs Than for Humans

Humans scan a page visually and infer structure from layout, font size, whitespace, and formatting. LLMs process the HTML (or extracted text) sequentially and rely on heading tags to understand:

- **What the page is about** (H1)
- **What major topics it covers** (H2s)
- **What specific aspects it addresses** (H3s and H4s)
- **Which paragraph belongs to which topic** (proximity to the nearest heading)

### Heading Rules for LLM Optimization

1. **One H1 per page.** It should contain the primary topic keyword and be descriptive enough that an LLM reading only the H1 understands what the page covers.

2. **H2s should be self-contained topic labels.** Do not use clever or ambiguous H2s. "Pricing Models for SaaS" is better than "The Money Question." An LLM retrieving content under that heading uses the heading as context for the paragraph.

3. **H3s should be specific questions or subtopics.** These are the most common retrieval targets. When a user asks "how much does X cost," the LLM looks for an H3 that closely matches the question, then retrieves the text beneath it.

4. **Never skip heading levels.** Do not jump from H2 to H4. LLMs interpret this as malformed structure and may misassign the content's topic scope.

5. **Do not use headings for visual styling.** If you want large bold text that is not a section header, use CSS. An H2 that says "Ready to get started?" confuses the document's semantic structure.

### Heading Hierarchy Example

```
H1: Complete Guide to API Rate Limiting
  H2: What Is API Rate Limiting
    H3: Token Bucket Algorithm
    H3: Sliding Window Algorithm
    H3: Fixed Window Algorithm
  H2: How to Implement Rate Limiting
    H3: Rate Limiting in Node.js
    H3: Rate Limiting in Python
    H3: Rate Limiting at the API Gateway Level
  H2: Rate Limiting Best Practices
    H3: Choosing the Right Limits
    H3: Communicating Limits to API Consumers
    H3: Handling Rate Limit Errors Gracefully
  H2: Frequently Asked Questions
    H3: What HTTP status code should rate limiting return?
    H3: Should rate limits be per-user or per-API-key?
```

Each H3 is a retrievable unit. If a user asks Perplexity "what HTTP status code should rate limiting return," the system retrieves the FAQ H3 and the paragraph beneath it.

---

## Definition-First Paragraph Structure

The single most impactful change you can make for LLM retrievability is restructuring paragraphs to lead with the answer.

### The Pattern

```
Sentence 1: Direct answer or definition (the "what")
Sentence 2: Key qualifying detail (the "how much" or "under what conditions")
Sentence 3: Context or implication (the "why it matters")
Remaining: Supporting evidence, examples, edge cases
```

### Examples

**Before (narrative-first):**
> When organizations begin thinking about their API strategy, one of the
> first questions that comes up is how to handle authentication. There are
> several approaches, each with trade-offs. Over the past decade, the
> industry has largely converged on a few standards...

An LLM retrieving this paragraph gets 50 words before any useful information.

**After (definition-first):**
> API authentication verifies the identity of a client making a request.
> The three dominant standards are API keys (simplest, least secure),
> OAuth 2.0 (most flexible, most complex), and JWT tokens (stateless,
> widely supported). For {{PROJECT_NAME}}, the choice depends on whether
> your API is internal-only, partner-facing, or public.

An LLM can extract the definition from sentence one and the comparison from sentence two, regardless of where the chunk boundary falls.

### Where Definition-First Matters Most

- The first paragraph after every H2 and H3 heading
- The page's opening paragraph (directly below the H1)
- FAQ answers
- Glossary entries
- Any paragraph that defines a term, states a number, or answers a common question

### Where It Matters Less

- Narrative case studies (storytelling structure is appropriate)
- Opinion pieces (building an argument requires setup)
- Step-by-step instructions (sequential structure takes priority)

---

## Structured Data as LLM Context

JSON-LD structured data gives LLMs a machine-readable layer of meaning on top of your HTML content. While LLMs can parse HTML, structured data provides explicit entity relationships that reduce ambiguity.

### How LLMs Use Structured Data

1. **Entity identification.** `Organization` schema tells the LLM who published the content. `Person` schema identifies the author. This matters for authority assessment.

2. **Content type classification.** `Article`, `HowTo`, `FAQPage`, `Product` — the schema type tells the LLM what kind of content it is dealing with before it reads a single paragraph.

3. **Temporal context.** `datePublished` and `dateModified` let LLMs assess freshness without parsing the page for date strings (which are often ambiguous).

4. **Relationship mapping.** `BreadcrumbList` tells the LLM where this page sits in your site hierarchy. `mentions` and `about` properties connect the page to known entities.

### Priority Schema Types for LLM Optimization

| Schema Type | Properties to Include | LLM Benefit |
|---|---|---|
| `Article` | `headline`, `datePublished`, `dateModified`, `author`, `publisher` | Establishes content as editorial, with clear authorship and freshness |
| `FAQPage` | `mainEntity` array of `Question`/`Answer` pairs | Directly maps to LLM Q&A retrieval |
| `HowTo` | `step` array with `name` and `text` | Machine-readable process that LLMs can extract step-by-step |
| `Organization` | `name`, `url`, `logo`, `sameAs` (social profiles) | Establishes entity identity across the web |
| `Product` | `name`, `description`, `offers`, `review`, `aggregateRating` | Rich product data for commercial queries |
| `WebPage` with `speakable` | `speakable.cssSelector` pointing to key sections | Identifies the most important sections for voice/AI extraction |
| `BreadcrumbList` | Full path from homepage to current page | Site hierarchy context |

### Implementation Notes

- Place JSON-LD in a `<script type="application/ld+json">` tag in the `<head>`, not in the body
- Validate with Google's Rich Results Test and Schema.org validator
- Do not add schema for entities you do not control (do not add `Person` schema for someone else's quote)
- Keep `dateModified` accurate — only update when content actually changes
- Cross-reference: `36-seo/technical/structured-data-cookbook.md` for full implementation guide

---

## FAQ Sections as Retrieval Targets

FAQ sections are the highest-value retrieval targets on any page because they pre-package content in the exact format LLMs need: a question + a direct answer.

### Why FAQs Are Disproportionately Cited

When a user asks a question to an AI search engine, the retrieval system looks for content that matches the question. An FAQ section provides:

- **Exact question-answer mapping** — the H3 is the question, the paragraph is the answer
- **Clean chunk boundaries** — each Q&A pair is a self-contained unit
- **High information density** — no filler between the question and the answer
- **Explicit relevance signal** — the question heading directly matches user queries

### FAQ Writing Rules for LLM Retrieval

1. **Use the exact question users ask.** Check People Also Ask boxes, Search Console query data, and support tickets. Do not rephrase into "corporate" language. If users ask "how much does it cost," the H3 should be "How much does it cost?" not "Pricing information."

2. **Answer in the first sentence.** The first sentence should be a complete answer. Subsequent sentences add context. If the LLM can only extract one sentence, it should be the answer.

3. **Keep answers 2-5 sentences.** Too short and you provide no value beyond the heading. Too long and the LLM may chunk mid-answer.

4. **Include specific numbers when applicable.** "Costs range from $50-$200/month" is more citation-worthy than "pricing varies."

5. **Do not duplicate content.** If the FAQ answer restates something already covered in the body of the page, either remove the FAQ entry or write a distinct version that adds new information (a different angle, a summary, an example).

6. **Mark up with FAQPage schema.** This is the only schema type where the markup directly matches the LLM retrieval pattern.

### FAQ Placement

- Place at the bottom of long-form content (after the main body, before the conclusion)
- Include 5-10 questions maximum (more than that dilutes quality)
- Only include questions with real search demand — do not pad with filler questions

---

## Entity Clarity

LLMs understand the world through entities — named things with attributes and relationships. If your content is ambiguous about which entity it discusses, the LLM may misattribute information or skip your page entirely.

### The Pronoun Problem

```
Poor:
"It offers real-time analytics and automated reporting. Users love
its dashboard. It integrates with popular CRMs."

What is "it"? An LLM processing this chunk without the preceding
heading has no idea which product is being described.
```

```
Good:
"{{PROJECT_NAME}} offers real-time analytics and automated reporting.
{{PROJECT_NAME}}'s dashboard is consistently rated highest in user
satisfaction surveys. {{PROJECT_NAME}} integrates with Salesforce,
HubSpot, and Pipedrive."
```

Yes, repeating the entity name feels redundant to human readers. This is a deliberate trade-off. The paragraph may be extracted from its context — the heading, the page title, the surrounding content — and the entity name needs to travel with it.

### Entity Clarity Rules

1. **Name the entity in the first sentence of every section.** Do not rely on headings to establish context — chunks may not include the heading.

2. **Avoid ambiguous pronouns for key entities.** Use the entity name instead of "it," "they," or "the product" in definition sentences and key claims.

3. **Differentiate similar entities explicitly.** If discussing {{PROJECT_NAME}} and a competitor on the same page, always use the full name, never "the former" or "the latter."

4. **Consistent naming.** Pick one canonical name for each entity and use it everywhere. If your product is "{{PROJECT_NAME}}" do not alternate between that, an abbreviation, and a nickname within the same page.

5. **Establish entity relationships early.** "{{PROJECT_NAME}}, a [category] platform built by [Company], helps [target audience] [do what]." One sentence that establishes type, creator, audience, and purpose.

### Entity Naming Across the Site

Maintain a glossary of canonical entity names for {{PROJECT_NAME}} and use them consistently across all content:

| Entity | Canonical Name | Never Use |
|---|---|---|
| Product | {{PROJECT_NAME}} | Abbreviations, informal names, unless defined first |
| Company | {{COMPANY_NAME}} | Legal entity suffixes (Inc., LLC) in content — only in legal pages |
| Features | Full feature name on first use per page | Acronyms without definition |
| Competitors | Their actual product name | Dismissive nicknames or vague references |

---

## Content Freshness Signals

AI search engines weight content freshness, but they are more sophisticated than simply checking the date. They look for multiple corroborating freshness signals.

### Signals That Indicate Fresh Content

| Signal | How LLMs Detect It | Implementation |
|---|---|---|
| `dateModified` in schema | Read directly from JSON-LD | Update only when content actually changes |
| `lastmod` in sitemap | Crawlers check sitemap timestamps | Keep in sync with actual content updates |
| Current-year references in text | NLP analysis of content | Reference current data, events, versions |
| HTTP `Last-Modified` header | Server-level signal | Configure your server to return accurate headers |
| Visible "Updated on [date]" text | Parsed from page content | Display last-updated date on the page |
| Version numbers of software/tools | Factual accuracy check | Reference current versions of tools you mention |

### Freshness Anti-Patterns

- **Changing `dateModified` without changing content.** Google has explicitly warned against this. AI systems can detect when the date changed but the content hash did not.
- **Adding "Updated for 2026!" to the title without updating the content.** The content itself must reflect the date claim.
- **Mass-updating hundreds of pages simultaneously.** This looks automated and suspicious. Update content on its actual refresh schedule.

### Content Refresh Cadence for LLM Visibility

| Content Type | Refresh Frequency | What to Update |
|---|---|---|
| Data-driven content (statistics, benchmarks) | Quarterly | Replace outdated numbers with current data |
| Tool/software reviews | Every 6 months or on major releases | Update version numbers, screenshots, feature comparisons |
| Evergreen guides | Annually | Verify all claims still hold, update examples |
| News/trend content | Do not refresh — publish new | Mark old content as archived |
| Product documentation | On every product change | Immediately, before or during release |

---

## Robots.txt Directives for AI Bots

You need a deliberate policy on which AI crawlers can access {{PROJECT_NAME}} content. This is not a simple allow-all or block-all decision — different bots serve different purposes, and the trade-offs are meaningful.

### Known AI Bot User-Agents

| Bot | Operator | Purpose | What It Powers |
|---|---|---|---|
| `GPTBot` | OpenAI | Training data collection | GPT model training (NOT ChatGPT search) |
| `ChatGPT-User` | OpenAI | Real-time search retrieval | ChatGPT browse/search feature |
| `OAI-SearchBot` | OpenAI | Search index for ChatGPT | ChatGPT search results |
| `Google-Extended` | Google | AI training data | Gemini model training (does NOT affect Google Search) |
| `Googlebot` | Google | Search crawling | Google Search AND AI Overviews — blocking this blocks both |
| `ClaudeBot` | Anthropic | Training data collection | Claude model training |
| `anthropic-ai` | Anthropic | Training data collection | Claude model training (older user-agent) |
| `CCBot` | Common Crawl | Open web corpus | Many AI models use Common Crawl data for training |
| `Bytespider` | ByteDance | Training data collection | TikTok AI features, various ByteDance models |
| `PerplexityBot` | Perplexity | Search index and retrieval | Perplexity search results and citations |
| `Applebot-Extended` | Apple | AI training data | Apple Intelligence features |
| `cohere-ai` | Cohere | Training data collection | Cohere model training |
| `Diffbot` | Diffbot | Web data extraction | Powers various AI and data products |
| `Meta-ExternalAgent` | Meta | Training data | Meta AI features |

### Decision Framework

The decision is not "block all AI" or "allow all AI." It is a per-bot decision based on what you get in return.

#### Bots You Almost Certainly Want to Allow

| Bot | Reason to Allow |
|---|---|
| `Googlebot` | Blocking this removes you from Google Search entirely — never block |
| `ChatGPT-User` / `OAI-SearchBot` | Blocking prevents citation in ChatGPT search — you lose visibility with no benefit |
| `PerplexityBot` | Blocking prevents citation in Perplexity — same logic as above |
| `bingbot` | Blocking removes you from Bing and Bing Copilot |

#### Bots Where the Decision Is Nuanced

| Bot | Argument to Allow | Argument to Block |
|---|---|---|
| `GPTBot` | Your content influences future GPT models; broad reach | Your content trains a competitor's product without compensation |
| `Google-Extended` | Your content improves Gemini; potential ranking benefit (unproven) | Training data collection without direct benefit to your search rankings |
| `ClaudeBot` / `anthropic-ai` | Your content improves Claude models | No direct search visibility benefit; training data collection |
| `CCBot` | Open data commons; many tools depend on Common Crawl | Very broad; your content trains dozens of models you may not want to support |
| `Bytespider` | Broad reach into ByteDance ecosystem | Often aggressive crawling; high server load; limited benefit for most Western sites |

#### Recommended Starting Policy for {{PROJECT_NAME}}

```
# robots.txt — AI bot policy

# ALWAYS ALLOW — search crawlers (blocking these removes search visibility)
User-agent: Googlebot
Allow: /

User-agent: bingbot
Allow: /

# ALLOW — AI search retrieval (blocking these prevents citations)
User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# DECISION REQUIRED — training data collection
# Uncomment "Disallow: /" to block, or leave as-is to allow

User-agent: GPTBot
Allow: /
# Disallow: /

User-agent: Google-Extended
Allow: /
# Disallow: /

User-agent: ClaudeBot
Allow: /
# Disallow: /

User-agent: anthropic-ai
Allow: /
# Disallow: /

User-agent: CCBot
Allow: /
# Disallow: /

# RECOMMENDED BLOCK — high crawl load, limited benefit
User-agent: Bytespider
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /
```

### Important Notes

- **Blocking `GPTBot` does NOT block `ChatGPT-User`.** They are separate bots. You can block training data collection while still appearing in ChatGPT search results.
- **Blocking `Google-Extended` does NOT affect Google Search or AI Overviews.** It only affects Gemini training data. AI Overviews use `Googlebot`, which you should never block.
- **robots.txt is advisory, not enforced.** Reputable companies honor it; others may not. For legal protection, also review your terms of service.
- **Monitor crawl logs for new AI bots.** New user-agents appear regularly. Check quarterly and update your policy.

---

## Schema Markup for LLM Comprehension

Beyond the structured data basics covered in `36-seo/technical/structured-data-cookbook.md`, specific schema patterns improve how LLMs interpret and cite your content.

### High-Impact Schema Patterns

#### 1. Article with Author and Publisher Chain

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Guide to API Rate Limiting",
  "datePublished": "2026-01-15",
  "dateModified": "2026-03-01",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://example.com/team/jane-smith",
    "jobTitle": "Senior Backend Engineer"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{{PROJECT_NAME}}",
    "url": "https://{{DOMAIN}}"
  },
  "description": "How to implement API rate limiting using token bucket, sliding window, and fixed window algorithms. Includes code examples for Node.js, Python, and API gateway configurations.",
  "about": [
    {"@type": "Thing", "name": "API Rate Limiting"},
    {"@type": "Thing", "name": "Token Bucket Algorithm"}
  ]
}
```

Why this matters: the author-publisher chain establishes authority. The `about` property explicitly states the topic. The `description` provides a pre-written summary the LLM can use directly.

#### 2. FAQPage with Complete Answers

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What HTTP status code should rate limiting return?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Return HTTP 429 (Too Many Requests) with a Retry-After header indicating when the client can retry. Include the rate limit details in X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers."
      }
    }
  ]
}
```

#### 3. Speakable Markup for Key Sections

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".article-summary", ".key-definition", ".faq-answer"]
  }
}
```

`speakable` tells AI systems which parts of the page are the most important extractable content. It was designed for voice assistants but is increasingly relevant for AI search.

---

## Citation-Worthy Content Patterns

Not all content earns citations. AI search engines cite content that adds something the AI cannot generate on its own.

### What Makes Content Citation-Worthy

| Content Pattern | Why AI Cites It | How to Create It |
|---|---|---|
| **Original data** | AI cannot fabricate statistics | Conduct surveys, analyze your product data, publish benchmarks |
| **Expert quotes** | AI cannot interview people | Include named expert quotes with credentials |
| **Unique analysis** | AI can summarize but not originate analysis | Take a contrarian position, connect non-obvious dots, provide novel frameworks |
| **First-person experience** | AI lacks lived experience | Case studies, implementation stories, post-mortems |
| **Proprietary methodology** | AI cannot create new methods | Document your internal processes, frameworks, scoring models |
| **Primary source documentation** | AI needs sources for claims | Be the original source others cite |
| **Current, specific numbers** | AI training data is outdated | Publish current pricing, benchmarks, statistics with dates |

### Content Patterns That Do NOT Earn Citations

- Generic definitions available on Wikipedia
- Rewrites of information readily available elsewhere
- Listicles without original commentary or analysis
- Content that says nothing specific ("it depends on your needs")
- Content without author attribution or organizational backing

### Building a Citation-Worthy Content Strategy

1. **Audit existing content for citation-worthiness.** For each page targeting an informational query, ask: "Does this page contain anything an LLM could not generate on its own?" If no, the page needs original data, expert input, or unique analysis added.

2. **Create a primary data pipeline.** Identify what unique data {{PROJECT_NAME}} has access to. User behavior data, transaction data, survey results, A/B test outcomes. Anonymize and publish insights regularly.

3. **Build an expert network.** Establish relationships with 5-10 industry experts who will provide quotes for your content. Named expert quotes are citation magnets.

4. **Publish annually-updated benchmark reports.** "The 2026 State of [Industry]" reports become reference documents that AI systems cite for years.

---

## Content That Survives LLM Summarization

When an LLM summarizes your content, information is lost. The question is: does your key message survive the compression?

### What Survives Summarization

- **Clear, specific claims.** "Conversion rates increase 27% when forms have fewer than 5 fields" survives. "Forms should be as short as possible" does not.
- **Named entities.** Brand names, product names, person names — these persist through summarization.
- **Numbers and statistics.** Specific figures are preserved because they are factual anchors.
- **Structured comparisons.** "A vs B: A is better for X, B is better for Y" survives because the structure is inherently compressible.
- **Actionable recommendations.** "Use HTTP 429 with a Retry-After header" survives. "Consider the appropriate error handling approach" does not.

### What Gets Lost

- **Nuance and caveats.** "In most cases, but not when..." — the caveat gets dropped.
- **Extended examples.** A 500-word case study gets compressed to one sentence.
- **Context and background.** Introductory paragraphs are almost always dropped.
- **Hedging language.** "It could be argued that..." becomes a definitive statement or gets dropped entirely.
- **Visual information.** Charts, diagrams, and screenshots are not summarized (yet).

### Writing for Summarization Resilience

1. **Front-load the key message.** The first sentence of every section should be the claim you want to survive summarization. Do not build up to it.

2. **Attach your brand to key claims.** "According to {{PROJECT_NAME}}'s 2026 benchmark report, average SaaS churn is 5.7%" survives with attribution. "Average SaaS churn is 5.7%" may survive but without attribution.

3. **Use specific numbers instead of vague qualifiers.** "Significant improvement" gets dropped. "27% improvement" gets cited.

4. **State recommendations as imperatives.** "Set cache TTL to 300 seconds for API responses" survives. "You might want to think about cache duration" does not.

5. **Keep important caveats in the same sentence as the claim.** "Conversion rates increase 27% with shorter forms, except for B2B enterprise forms where qualification fields improve lead quality." The caveat survives because it is attached to the claim, not in a separate paragraph.

---

## Cross-References

- `36-seo/ai-seo/ai-search-optimization.md` — broader AI search strategy
- `36-seo/technical/structured-data-cookbook.md` — full schema implementation guide
- `36-seo/technical/robots-sitemap-canonical.md` — robots.txt fundamentals
- `36-seo/on-page/on-page-seo-checklist.md` — on-page optimization including heading structure
- `36-seo/content-seo/content-brief.template.md` — incorporating LLM-friendly patterns into content briefs
