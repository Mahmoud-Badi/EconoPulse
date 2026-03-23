# Keyword Research Methodology

> A deep, step-by-step guide to finding, evaluating, and prioritizing keywords for SEO. Covers seed generation, long-tail expansion, intent classification, difficulty assessment, prioritization scoring, cannibalization detection, entity-based research, zero-volume strategies, and tool walkthroughs.

---

## Table of Contents

1. [Seed Keyword Generation](#seed-keyword-generation)
2. [Long-Tail Expansion](#long-tail-expansion)
3. [Search Intent Classification](#search-intent-classification)
4. [Keyword Difficulty Assessment](#keyword-difficulty-assessment)
5. [Keyword Prioritization Scoring](#keyword-prioritization-scoring)
6. [Keyword Cannibalization](#keyword-cannibalization)
7. [Entity-Based Keyword Research](#entity-based-keyword-research)
8. [Zero-Volume Keyword Strategy](#zero-volume-keyword-strategy)
9. [Tool Walkthroughs](#tool-walkthroughs)
10. [Keyword Research Output Template](#keyword-research-output-template)

---

## Seed Keyword Generation

Seed keywords are your starting points — broad terms that describe your product, category, problems, and audience. Every other keyword you discover branches from these roots.

### Method 1: Product and Category Brainstorm

Start with what you are and what you do:

```
What is your product?         → [product type] (e.g., "deployment tool")
What category are you in?     → [category] (e.g., "CI/CD", "DevOps")
What do you replace?          → [legacy method] (e.g., "manual deployment")
What is the end result?       → [outcome] (e.g., "faster releases")
```

Generate 3-5 seed keywords from each question.

### Method 2: Problem and Pain Point Mining

Your customers have problems before they have solutions. Find the words they use to describe those problems:

- Review customer support tickets — what language do they use?
- Read G2/Capterra/Trustpilot reviews of competitors — what problems do reviewers mention?
- Search Reddit, Stack Overflow, Quora for threads about the problem you solve
- Read sales call transcripts — what words do prospects use before they know your product exists?

**Output**: 5-10 problem-framed seed keywords (e.g., "slow deployments", "deployment errors", "deployment downtime")

### Method 3: Audience and Persona Keywords

Different audiences search differently for the same solution:

| Audience Segment | Keyword Pattern | Example |
|-----------------|----------------|---------|
| Technical users | [technology] + [task] | "Node.js deployment automation" |
| Decision makers | [category] + [business value] | "CI/CD ROI" |
| Beginners | "what is" + [concept] | "what is continuous deployment" |
| Switchers | [competitor] + "alternative" | "Heroku alternative" |
| Industry-specific | [industry] + [category] | "fintech deployment tools" |

### Method 4: Competitor Keyword Harvesting

Your competitors have already done keyword research for you:

1. Enter competitor domains into Ahrefs/SEMrush "Organic Keywords" report
2. Export their top 100 keywords by traffic
3. Remove branded keywords (their brand name)
4. The remaining keywords are your seed keyword candidates

### Method 5: Google's Own Suggestions

Google tells you what people search for if you know where to look:

- **Autocomplete**: Type your seed keyword, note all suggestions
- **People Also Ask**: Expand the PAA box on page 1
- **Related Searches**: Scroll to the bottom of page 1
- **Google Trends Related Queries**: Enter seed keyword, check "Related queries"
- **Google Keyword Planner Suggestions**: Enter seed keyword, export all suggestions

### Seed Keyword Compilation

Compile all seeds into a master list before expansion:

| # | Seed Keyword | Source Method | Category |
|---|-------------|---------------|----------|
| 1 | | Product brainstorm / Problem mining / etc. | Product / Problem / Audience / Competitor |
| 2 | | | |
| 3 | | | |

**Target**: 20-40 seed keywords before moving to expansion.

---

## Long-Tail Expansion

Each seed keyword spawns dozens of long-tail variations. Long-tail keywords are longer (3-7 words), more specific, lower competition, and higher intent.

### Technique 1: Modifier Stacking

Add modifiers before and after your seed keyword:

| Modifier Type | Examples | Applied to "deployment tool" |
|--------------|---------|------------------------------|
| **Audience** | for startups, for enterprises, for teams | "deployment tool for startups" |
| **Technology** | for Node.js, for Python, for AWS | "deployment tool for Node.js" |
| **Quality** | best, top, fastest, simplest | "best deployment tool" |
| **Price** | free, affordable, cheap, open source | "free deployment tool" |
| **Year** | 2026, latest | "best deployment tool 2026" |
| **Action** | how to use, tutorial, guide, setup | "deployment tool setup guide" |
| **Comparison** | vs, alternative, compared to | "deployment tool vs manual deployment" |

### Technique 2: Question Expansion

Turn every seed keyword into questions:

```
Seed: "deployment tool"

Who questions:  "who uses deployment tools"
What questions: "what is a deployment tool"
When questions: "when to use a deployment tool"
Where questions: "where to find deployment tools"
Why questions:  "why use a deployment tool"
How questions:  "how to choose a deployment tool"
               "how does a deployment tool work"
               "how much does a deployment tool cost"
```

### Technique 3: Alphabet Soup Method

Append each letter of the alphabet to your seed keyword in Google Autocomplete:

```
"deployment tool a" → deployment tool alternative, deployment tool aws, deployment tool automation
"deployment tool b" → deployment tool best, deployment tool bitbucket
"deployment tool c" → deployment tool comparison, deployment tool CI/CD
...
"deployment tool z" → (continue through the alphabet)
```

This typically generates 50-200 keyword ideas per seed keyword.

### Technique 4: Preposition Expansion

Add prepositions to your seed keyword:

```
deployment tool FOR [audience/technology]
deployment tool WITH [feature/capability]
deployment tool WITHOUT [limitation/requirement]
deployment tool LIKE [known tool]
deployment tool NEAR [location — if relevant]
deployment tool VS [competitor/alternative]
```

### Technique 5: Use Case and Scenario Expansion

Think about specific situations where someone would search:

```
Seed: "deployment tool"

Scenarios:
- "deployment tool for monorepo"
- "deployment tool for microservices"
- "deployment tool for static sites"
- "deployment tool for Docker containers"
- "deployment tool for small teams"
- "deployment tool with rollback support"
- "deployment tool zero downtime"
```

### Technique 6: Related Entity Expansion

Identify entities (tools, concepts, brands, technologies) that relate to your seed keyword and combine them:

```
Seed: "deployment tool"

Related entities: Docker, Kubernetes, GitHub Actions, AWS, Vercel, Netlify, CI/CD

Combinations:
- "Docker deployment tool"
- "Kubernetes deployment automation"
- "GitHub Actions deployment"
- "AWS deployment tool comparison"
- "Vercel alternative deployment"
```

### Long-Tail Expansion Output

After applying all 6 techniques to each seed keyword, compile into a raw list. Expect 200-1,000+ keyword candidates from 20-40 seeds. The next step is intent classification and prioritization.

---

## Search Intent Classification

Every keyword has an intent — the reason someone typed it into Google. Mismatching intent destroys your ranking potential. Google will not rank a product page for an informational query, no matter how well-optimized it is.

### The Four Intent Types

| Intent | Searcher's Goal | Content Type to Create | Conversion Potential | Volume Pattern |
|--------|----------------|----------------------|---------------------|---------------|
| **Informational** | Learn, understand, research | Blog posts, guides, tutorials, explainers, videos | Low (0.5-2%) | High volume |
| **Navigational** | Find a specific website/page | Homepage, login page, specific product page | Medium (brand-aware) | Medium volume |
| **Commercial** | Compare options, evaluate before buying | Comparison pages, reviews, "best X" listicles, case studies | High (2-5%) | Medium volume |
| **Transactional** | Buy, sign up, download, take action | Pricing pages, landing pages, signup flows, product pages | Very high (5-15%) | Low volume |

### Intent Classification Decision Tree

```
Does the keyword contain...?
│
├── "what is", "how to", "why", "guide", "tutorial", "explained"
│   └── INFORMATIONAL → Blog post / guide
│
├── [Brand name], "[product] login", "[product] docs"
│   └── NAVIGATIONAL → Corresponding product page
│
├── "best", "top", "vs", "alternative", "review", "comparison"
│   └── COMMERCIAL → Comparison page / listicle
│
├── "buy", "pricing", "signup", "free trial", "download", "coupon"
│   └── TRANSACTIONAL → Landing page / pricing page
│
└── None of the above?
    └── Search the keyword in Google. Look at the top 5 results.
        What content type dominates? Match that intent.
```

### Intent-to-Content Mapping Table

| Intent | Blog Post | Guide | Tutorial | Comparison | Landing Page | Product Page | Pricing | Docs |
|--------|-----------|-------|----------|-----------|-------------|-------------|---------|------|
| Informational | Primary | Primary | Primary | - | - | - | - | Secondary |
| Navigational | - | - | - | - | - | Primary | Secondary | Primary |
| Commercial | Secondary | - | - | Primary | Primary | Secondary | - | - |
| Transactional | - | - | - | - | Primary | Primary | Primary | - |

### Mixed Intent Keywords

Some keywords have mixed intent. Google hedges by showing multiple content types on page 1.

**How to handle**: Check the SERP. If the top 10 results are a mix of blog posts and product pages, the intent is mixed. Create content that satisfies both (e.g., an informational blog post with strong product CTAs).

**Example**: "CI/CD tools" — could be informational ("what are CI/CD tools?") or commercial ("which CI/CD tool should I pick?"). Google shows a mix. Create a comprehensive comparison post that educates AND positions your product.

---

## Keyword Difficulty Assessment

Keyword difficulty (KD) predicts how hard it will be to rank on page 1 for a given keyword. Tool scores (Ahrefs KD, SEMrush KD) are useful starting points but insufficient alone.

### Tool-Based Difficulty Scores

| Tool | Scale | What It Measures | Reliability |
|------|-------|-----------------|-------------|
| **Ahrefs KD** | 0-100 | Estimated referring domains needed to rank in top 10 | Good for backlink-based difficulty |
| **SEMrush KD** | 0-100 | Composite of authority, backlinks, content quality signals | Good general indicator |
| **Moz KD** | 0-100 | Based on Page Authority and Domain Authority of ranking pages | Decent, slightly outdated model |

### Manual Difficulty Assessment (More Accurate)

For your top priority keywords, supplement tool scores with manual SERP analysis:

| Factor | Low Difficulty | Medium Difficulty | High Difficulty |
|--------|---------------|-------------------|-----------------|
| **Top 5 domain types** | Forums, small blogs, Q&A sites | Mix of known brands and niche sites | All major brands/authorities |
| **Top 5 DR/DA** | Average < 30 | Average 30-60 | Average > 60 |
| **Content quality of top 5** | Thin, outdated, poorly structured | Decent but beatable | Comprehensive, well-maintained |
| **Backlinks to top 5** | < 10 referring domains each | 10-50 referring domains each | 50+ referring domains each |
| **SERP features** | Few SERP features | Some featured snippets, PAA | AI Overview, Knowledge Panel, heavy SERP features |
| **Content freshness** | Results are 2+ years old | Mix of old and recent | Results are recent and frequently updated |

### Difficulty Scoring for Your Domain

Your ability to rank depends on YOUR domain's authority. A keyword with KD 40 is easy for a DR 70 site but nearly impossible for a DR 10 site.

**Rule of thumb for targetable difficulty:**

| Your Domain Rating | Target KD Range | Why |
|-------------------|----------------|-----|
| DR 0-15 | KD 0-15 | You can only win very low competition keywords |
| DR 15-30 | KD 0-25 | You can start competing for moderate terms |
| DR 30-50 | KD 0-40 | You have enough authority for medium-competition keywords |
| DR 50-70 | KD 0-60 | Most keywords except the most competitive are reachable |
| DR 70+ | KD 0-80+ | You can compete for nearly any keyword |

---

## Keyword Prioritization Scoring

With hundreds of keyword candidates, you need a systematic way to prioritize. Use a weighted scoring formula.

### Prioritization Scoring Framework

Score each keyword on 5 factors (1-10 scale), then apply weights:

| Factor | Weight | What It Measures | Scoring Guide |
|--------|--------|-----------------|---------------|
| **Relevance** | 30% | How closely the keyword relates to your product/service | 10 = directly describes your product; 1 = tangentially related |
| **Intent alignment** | 25% | Whether searcher intent matches your conversion goal | 10 = transactional, exact match; 1 = pure informational, no conversion path |
| **Ranking feasibility** | 20% | Your realistic ability to rank on page 1 | 10 = KD well below your DR; 1 = KD far above your DR |
| **Search volume** | 15% | Monthly search volume | 10 = 10,000+; 7 = 1,000-10,000; 4 = 100-1,000; 1 = < 100 |
| **Business value** | 10% | Revenue potential if you rank #1 | 10 = directly drives purchases; 1 = awareness only |

### Priority Score Formula

```
Priority Score = (Relevance x 0.30)
              + (Intent Alignment x 0.25)
              + (Ranking Feasibility x 0.20)
              + (Search Volume x 0.15)
              + (Business Value x 0.10)
```

### Scoring Example

| Keyword | Relevance (30%) | Intent (25%) | Feasibility (20%) | Volume (15%) | Biz Value (10%) | **Score** |
|---------|-----------------|-------------|-------------------|-------------|-----------------|-----------|
| "best CI/CD tool for startups" | 9 | 8 | 7 | 5 | 8 | **7.65** |
| "what is CI/CD" | 5 | 3 | 4 | 9 | 2 | **4.70** |
| "deploy Node.js to AWS" | 7 | 6 | 8 | 6 | 5 | **6.70** |
| "[competitor] alternative" | 10 | 9 | 6 | 4 | 9 | **8.05** |

### Priority Tiers

| Score Range | Tier | Action |
|-------------|------|--------|
| 7.0-10.0 | **P1 — Critical** | Create content immediately, allocate best resources |
| 5.0-6.9 | **P2 — High** | Schedule for next content sprint |
| 3.0-4.9 | **P3 — Medium** | Add to backlog, create when capacity allows |
| 0.0-2.9 | **P4 — Low** | Deprioritize or discard |

---

## Keyword Cannibalization

Cannibalization happens when two or more pages on your site target the same keyword and compete with each other in SERPs. Google gets confused about which page to rank, so neither ranks well.

### How to Detect Cannibalization

#### Method 1: Google Search Console Query Report

1. Go to Search Console → Performance → Search Results
2. Click on a keyword you suspect is cannibalized
3. Click the "Pages" tab
4. If multiple pages show impressions for the same keyword — you have cannibalization

#### Method 2: Site Search Operator

Search Google for: `site:yourdomain.com "target keyword"`

If multiple pages appear, they may be competing.

#### Method 3: Ahrefs/SEMrush "Keyword Cannibalization" Report

Both tools have dedicated cannibalization reports that flag keywords where multiple pages rank.

### Cannibalization Resolution Strategies

| Situation | Resolution |
|-----------|-----------|
| **Two similar pages, one is better** | Redirect (301) the weaker page to the stronger page |
| **Two pages with different angles on the same topic** | Differentiate: ensure each targets a distinct primary keyword |
| **A blog post and a product page compete** | Add canonical pointing blog → product page, or differentiate intent targeting |
| **Multiple blog posts on very similar topics** | Consolidate into one comprehensive page (redirect the others) |
| **Category page and blog post compete** | Ensure the blog post targets informational intent, category page targets commercial intent |

### Cannibalization Prevention

- **Maintain a keyword map**: One primary keyword per page, documented in a spreadsheet
- **Check before publishing**: Before writing new content, search your site for the target keyword
- **Use internal linking intentionally**: Link supporting pages to the page you want to rank for that keyword

---

## Entity-Based Keyword Research

Google's algorithm has evolved from matching strings (keywords) to understanding things (entities). Entity-based research helps you align with how Google actually processes queries.

### What Is Entity-Based SEO?

An "entity" is a thing — a person, place, concept, product, brand, or organization — that Google recognizes and stores in its Knowledge Graph. Google understands relationships between entities.

**Example**: Google knows that "React" is a JavaScript library created by Meta, related to "Next.js", "Vue.js", and "Angular", used for building "user interfaces" and "web applications."

### How to Research Entities for Your Niche

#### Step 1: Identify Your Core Entity

What entity is your product/brand? Does Google recognize it? Search for your brand name — if a Knowledge Panel appears, Google recognizes you as an entity.

#### Step 2: Map Related Entities

Use Google's Knowledge Graph to find connected entities:

```
Core entity: [Your product category]
│
├── Related technologies: [tech 1], [tech 2], [tech 3]
├── Related concepts: [concept 1], [concept 2]
├── Related brands: [competitor 1], [competitor 2]
├── Related roles: [job title 1], [job title 2]
└── Related problems: [problem 1], [problem 2]
```

#### Step 3: Create Entity-Rich Content

- Mention related entities naturally in your content
- Use structured data (schema.org) to explicitly declare entity types
- Link to authoritative sources for entities you reference
- Build your own entity recognition: consistent branding, Wikipedia presence, Wikidata entry, Crunchbase profile

#### Step 4: Entity-Based Keyword Discovery

Instead of just "keyword + modifier," think "entity + relationship + entity":

```
Traditional: "best deployment tool"
Entity-based: "deployment tool" + [relationship: integrates with] + "Kubernetes"
Result: "Kubernetes deployment tool", "deploy to Kubernetes"

Traditional: "CI/CD tutorial"
Entity-based: "CI/CD" + [relationship: used by] + "startups"
Result: "CI/CD for startups", "startup deployment workflow"
```

---

## Zero-Volume Keyword Strategy

Keywords that show "0" or "10" monthly volume in tools are often undervalued. Here is why they matter and when to target them.

### Why Zero-Volume Keywords Matter

1. **Tool data is inaccurate**: Ahrefs/SEMrush cannot track every query. Many "0 volume" keywords actually receive searches.
2. **New and emerging queries**: Someone is searching it for the first time. If you are there first, you own it.
3. **Ultra-high intent**: Very specific queries ("best CI/CD tool for Node.js monorepos on AWS") may have tiny volume but convert at 20%+.
4. **Long-tail aggregation**: 100 zero-volume keywords collectively drive significant traffic.
5. **Topic coverage signals**: Google rewards comprehensiveness. Covering niche subtopics strengthens your topical authority.

### When to Target Zero-Volume Keywords

| Target When... | Skip When... |
|----------------|-------------|
| The keyword is highly relevant to your product | The keyword has no connection to your business |
| The content also targets a higher-volume parent keyword | You have limited content capacity (prioritize volume) |
| The keyword represents an emerging trend | The keyword is a dead-end query with no related topics |
| You can create the content quickly (FAQ, short article) | The content would require significant investment |
| Your competitors have not covered the topic yet | Multiple authoritative competitors already own it |

### Zero-Volume Keyword Discovery Sources

- Google Autocomplete suggestions that do not appear in keyword tools
- Reddit/forum questions that have no good Google result
- Customer support questions (exact phrasing customers use)
- Sales call transcripts (questions prospects ask)
- "People Also Ask" chains (click through 4-5 levels deep)
- New technology/feature launches (no one has searched yet because it is new)

---

## Tool Walkthroughs

### Free Tools

#### Google Keyword Planner

**Setup**: Create a Google Ads account (free, no ad spend required) → Tools & Settings → Keyword Planner

**Workflow:**
1. Click "Discover new keywords"
2. Enter 3-5 seed keywords
3. Set location and language filters
4. Review suggestions — sort by "Avg. monthly searches"
5. Select relevant keywords → "Add to plan" or "Download keyword ideas"

**Key limitation**: Shows volume ranges (100-1K, 1K-10K), not exact numbers, unless you are running ads. Use as directional guidance.

**Best for**: Initial keyword discovery, volume ranges, competition level (low/medium/high).

#### Google Search Console

**Setup**: Verify your domain → wait 2-4 weeks for data accumulation

**Keyword research workflow:**
1. Performance → Search Results → Queries tab
2. Sort by impressions (shows keywords Google considers your site relevant for)
3. Filter to pages with impressions but low CTR → opportunity to improve title/meta
4. Filter to keywords in positions 5-20 → opportunity to optimize and move to page 1
5. Export and cross-reference with your keyword map

**Best for**: Finding keywords you already rank for (especially ones you did not intentionally target).

#### Google Autocomplete and Related Searches

**Workflow:**
1. Open an incognito browser (avoid personalization bias)
2. Type your seed keyword, pause — note autocomplete suggestions
3. Add each letter a-z after the keyword — note additional suggestions
4. Search the keyword — scroll down to "Related searches"
5. Click into a "People Also Ask" result — note the new PAA questions that appear
6. Compile all suggestions into your raw keyword list

**Best for**: Discovering real search queries, question-based keywords, related topics.

#### AnswerThePublic

**Workflow:**
1. Go to answerthepublic.com
2. Enter seed keyword, select country
3. Review: Questions (who/what/when/where/why/how), Prepositions (for/with/without/near), Comparisons (vs/or/and/like)
4. Download CSV for all suggestions
5. Cross-reference with intent classification

**Best for**: Question-based keyword discovery, content ideation, understanding how people frame queries.

#### AlsoAsked

**Workflow:**
1. Go to alsoasked.com
2. Enter keyword, select region
3. View the hierarchical question tree
4. Each branch represents a subtopic cluster
5. Use the tree structure to plan pillar/cluster content architecture

**Best for**: Understanding topic relationships, planning content clusters, discovering question chains.

#### Google Trends

**Workflow:**
1. Go to trends.google.com
2. Enter seed keyword — check interest over time
3. Compare 2-5 keywords to see relative popularity
4. Check "Related queries" for rising/breakout terms
5. Filter by region if targeting specific geographies

**Best for**: Seasonal keyword planning, trend validation, comparing relative keyword popularity, identifying rising topics.

### Paid Tools

#### Ahrefs

**Key keyword research features:**
- **Keywords Explorer**: Enter seed keyword → get volume, KD, CPC, clicks data, keyword suggestions
- **Content Gap**: Enter your domain + competitors → find keywords they rank for, you do not
- **SERP Overview**: See exactly who ranks, their DR, backlinks, traffic for any keyword
- **Keyword Clustering**: Group related keywords that can be targeted by a single page

**Best workflow**: Seed keywords → Keywords Explorer → filter by KD < your DR → sort by volume → analyze SERP → prioritize.

#### SEMrush

**Key keyword research features:**
- **Keyword Magic Tool**: Enter seed keyword → get thousands of grouped suggestions
- **Keyword Gap**: Compare your domain to competitors → find exclusive keywords
- **Keyword Manager**: Save, tag, and prioritize keywords in lists
- **Topic Research**: Enter topic → get subtopic suggestions with headlines and questions

**Best workflow**: Seed keywords → Keyword Magic Tool → filter by intent + KD → Keyword Gap for competitor analysis → Topic Research for content planning.

#### Moz

**Key keyword research features:**
- **Keyword Explorer**: Volume, difficulty, organic CTR, priority score
- **SERP Analysis**: Who ranks, DA, linking domains
- **Keyword Lists**: Save and organize keyword groups

**Best for**: If you already have a Moz subscription. Less comprehensive than Ahrefs/SEMrush for keyword research specifically.

#### KWFinder (Mangools)

**Key keyword research features:**
- **Keyword difficulty with SERP analysis**: Visual KD gauge with page-level metrics
- **Autocomplete and question suggestions**: Built-in keyword expansion
- **Trend data**: Volume over time for each keyword

**Best for**: Budget-friendly keyword research with good difficulty analysis. Excellent UX for beginners.

---

## Keyword Research Output Template

After completing your research, compile results in this format. This becomes the input for content planning and topic cluster architecture.

### Master Keyword List

| # | Keyword | Volume | KD | Intent | Priority Score | Target Page | Status |
|---|---------|--------|-----|--------|---------------|-------------|--------|
| 1 | | | | Info / Nav / Comm / Trans | | [URL or "To create"] | Not started / In progress / Published / Ranking |
| 2 | | | | | | | |
| 3 | | | | | | | |

### Keyword Clusters (Grouped)

```
Cluster 1: [Topic Name]
  Pillar keyword: [keyword] — Volume: [X] — KD: [X]
  Supporting keywords:
    - [keyword] — Volume: [X] — KD: [X]
    - [keyword] — Volume: [X] — KD: [X]
    - [keyword] — Volume: [X] — KD: [X]

Cluster 2: [Topic Name]
  Pillar keyword: [keyword] — Volume: [X] — KD: [X]
  Supporting keywords:
    - [keyword] — Volume: [X] — KD: [X]
    - ...
```

### Summary Statistics

```
Total keywords researched:     ___
Keywords by intent:
  Informational:               ___
  Navigational:                ___
  Commercial:                  ___
  Transactional:               ___

Keywords by priority:
  P1 (Critical):               ___
  P2 (High):                   ___
  P3 (Medium):                 ___
  P4 (Low / Discarded):        ___

Keyword clusters identified:   ___
Estimated content pieces needed: ___
```

---

## Cross-References

- **SEO strategy**: `36-seo/strategy/seo-strategy.template.md`
- **Topic cluster planning**: `36-seo/strategy/topic-cluster-architecture.template.md`
- **Competitive keyword analysis**: `36-seo/strategy/seo-competitive-intelligence.template.md`
- **Content-keyword mapping execution**: `36-seo/content-seo/`
- **On-page keyword optimization**: `36-seo/on-page/`
