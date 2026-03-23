# Topic Cluster Architecture for {{PROJECT_NAME}}

> Plans the pillar-and-cluster content architecture that drives topical authority in search. Covers pillar page identification, cluster mapping, internal linking topology, gap identification, performance measurement, and when to expand vs. create new clusters.

---

## Table of Contents

1. [Why Topic Clusters](#why-topic-clusters)
2. [Pillar Page Identification](#pillar-page-identification)
3. [Cluster Topic Mapping](#cluster-topic-mapping)
4. [Internal Linking Topology](#internal-linking-topology)
5. [Content Gap Identification Within Clusters](#content-gap-identification-within-clusters)
6. [Cluster Performance Measurement](#cluster-performance-measurement)
7. [When to Create vs. Expand Clusters](#when-to-create-vs-expand-clusters)
8. [Cluster Planning Template](#cluster-planning-template)
9. [Example Cluster Maps](#example-cluster-maps)

---

## Why Topic Clusters

Google no longer ranks individual pages in isolation. It evaluates topical authority — does this domain comprehensively cover a topic? Sites that demonstrate deep expertise on a subject outrank sites with isolated pages on the same keywords.

Topic clusters are the structural implementation of topical authority:

```
Without clusters:                   With clusters:

  [Page]  [Page]  [Page]              ┌──── Cluster Post
  [Page]  [Page]  [Page]              ├──── Cluster Post
  (isolated, no relationship)    Pillar Page ──┤
                                      ├──── Cluster Post
Google sees: "random pages"           └──── Cluster Post
Google sees: "this site is an              (all interlinked)
 authority on nothing"
                                Google sees: "this site owns this topic"
```

**The compounding effect**: Each new cluster post strengthens the pillar page. The pillar page's authority flows back to cluster posts. Over time, the entire cluster rises in rankings together.

---

## Pillar Page Identification

A pillar page is a comprehensive, authoritative page covering a broad topic. It targets a high-volume, competitive keyword that you want to own.

### Selection Criteria

| Criterion | Good Pillar Topic | Bad Pillar Topic |
|-----------|-------------------|------------------|
| **Breadth** | Broad enough to spawn 8-15 subtopics | Too narrow (would be a blog post) or too broad (would be a textbook) |
| **Search volume** | 1,000+ monthly searches for primary keyword | < 500 searches (not enough to justify pillar investment) |
| **Business relevance** | Directly relates to your product/category | Tangentially related or off-topic |
| **Subtopic potential** | Can you list 8+ specific subtopics? | Only 2-3 subtopics exist |
| **Competitor coverage** | Competitors have pillar content (validates demand) | No one is covering this (validate demand first) |
| **Conversion path** | Readers can naturally discover your product | No logical connection to your product |

### Pillar Page Identification Process

**Step 1: List your keyword clusters from keyword research**

Group keywords from your master list by topic. Each group with 8+ related keywords is a pillar candidate.

**Step 2: Validate with search volume**

The pillar keyword (the broadest keyword in the group) should have 1,000+ monthly searches.

**Step 3: Check SERP format**

Search the pillar keyword. If Google shows comprehensive guides on page 1, it expects pillar-type content. If it shows short answers or product pages, a pillar page may not be the right format.

**Step 4: Assess competitive feasibility**

Can you realistically rank for this pillar keyword within 12 months given your domain authority? If not, the cluster posts will still rank for long-tail keywords, but choose a pillar keyword where you have a realistic path to page 1.

### Pillar Page Inventory

| # | Pillar Topic | Primary Keyword | Volume | KD | Cluster Size (est.) | Priority |
|---|-------------|-----------------|--------|-----|--------------------|---------|
| 1 | {{PILLAR_TOPIC_1}} | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

---

## Cluster Topic Mapping

Once you have identified pillar topics, map out the cluster posts for each.

### Mapping Process

**Step 1: Gather subtopics**

For each pillar topic, generate subtopics using:
- Your keyword research long-tail keywords (grouped under this pillar)
- "People Also Ask" questions related to the pillar keyword
- AlsoAsked.com question tree for the pillar keyword
- Competitor pillar pages — what subtopics do they link to?
- AnswerThePublic question/preposition/comparison data
- Your product's feature set (each feature can be a subtopic)

**Step 2: Classify each subtopic**

| Subtopic | Target Keyword | Volume | KD | Intent | Content Type | Status |
|----------|---------------|--------|-----|--------|-------------|--------|
| | | | | Info/Comm/Trans | Blog/Guide/Tutorial/Comparison | Not started/Draft/Published |
| | | | | | | |

**Step 3: Ensure coverage**

A healthy cluster covers:
- [ ] "What is [topic]?" — definitional post
- [ ] "How to [task related to topic]" — tutorial posts (multiple)
- [ ] "Best [tools/methods] for [topic]" — commercial comparison
- [ ] "[Topic] for [audience segment]" — audience-specific angles
- [ ] "[Topic] vs [alternative approach]" — comparison content
- [ ] "Common [topic] mistakes" or "[topic] best practices" — advice content
- [ ] Case study or example related to the topic

**Step 4: Define linking relationships**

Every cluster post MUST link to the pillar page. The pillar page MUST link to every cluster post. Cluster posts SHOULD link to each other when contextually relevant.

### Cluster Map Template

```
PILLAR: {{PILLAR_TOPIC_1}}
Primary keyword: [keyword]
URL: [/pillar-page-url]
Word count target: 3,000-5,000
Status: [ ] Not started  [ ] Draft  [ ] Published

CLUSTER POSTS:
┌─────────────────────────────────────────────────────────────────────┐
│ #  │ Title / Topic              │ Keyword        │ Vol  │ Status   │
├────┼────────────────────────────┼────────────────┼──────┼──────────┤
│ 1  │                            │                │      │          │
│ 2  │                            │                │      │          │
│ 3  │                            │                │      │          │
│ 4  │                            │                │      │          │
│ 5  │                            │                │      │          │
│ 6  │                            │                │      │          │
│ 7  │                            │                │      │          │
│ 8  │                            │                │      │          │
│ 9  │                            │                │      │          │
│ 10 │                            │                │      │          │
└────┴────────────────────────────┴────────────────┴──────┴──────────┘

INTERNAL LINKING PLAN:
  Pillar → links to all 10 cluster posts
  Each cluster post → links to pillar + 2-3 related cluster posts
  Total internal links in this cluster: ___
```

---

## Internal Linking Topology

The linking structure within and between clusters determines how authority flows through your site.

### Architecture 1: Hub-and-Spoke (Recommended for Most Sites)

```
                    ┌─── Cluster Post A
                    │
                    ├─── Cluster Post B
                    │
    PILLAR PAGE ────┤
    (hub)           ├─── Cluster Post C
                    │
                    ├─── Cluster Post D
                    │
                    └─── Cluster Post E

    Links: Pillar ↔ each post (bidirectional)
    Posts do NOT link to each other (or minimally)
```

**Best for**: Simple content structures, small clusters (5-8 posts), clear topic hierarchy.

**Pros**: Simple to maintain, clear authority flow to pillar.
**Cons**: Limited cross-linking between cluster posts, less "web" structure.

### Architecture 2: Hub-and-Spoke with Cross-Links (Recommended for Growing Sites)

```
                    ┌─── Cluster Post A ──┐
                    │         │            │
                    ├─── Cluster Post B    │
                    │    │    │            │
    PILLAR PAGE ────┤    │    │            │
    (hub)           ├─── Cluster Post C ──┘
                    │         │
                    ├─── Cluster Post D
                    │
                    └─── Cluster Post E

    Links: Pillar ↔ each post (bidirectional)
    Posts link to 2-3 related sibling posts (selective, contextual)
```

**Best for**: Medium clusters (8-15 posts), sites building topical depth.

**Pros**: Stronger internal linking, spreads authority, helps users navigate related content.
**Cons**: Requires careful planning to avoid random/forced links.

### Architecture 3: Matrix (For Large, Complex Sites)

```
    PILLAR 1 ────────── PILLAR 2
       │    ╲             │    ╲
       │     ╲            │     ╲
    Post A  Post B     Post F  Post G
       │  ╲    │  ╲       │  ╲    │
    Post C  Post D     Post H  Post I
                ╲                ╱
                 ╲──── Post J ──╱
                 (shared cluster post)

    Links: Pillars link to each other
    Posts link to their pillar + related posts in OTHER clusters
    Some posts belong to multiple clusters
```

**Best for**: Large sites (50+ posts), overlapping topics, comprehensive content libraries.

**Pros**: Maximum interlinking, strong topical authority signals, natural user journeys across topics.
**Cons**: Complex to manage, risk of diluting focus, requires a linking map document.

### Internal Linking Rules

1. **Every cluster post links to its pillar page** — non-negotiable
2. **Every pillar page links to all its cluster posts** — non-negotiable
3. **Anchor text is descriptive and keyword-relevant** — not "click here" or "read more"
4. **Links are contextual** — placed within body copy where they add value, not dumped in a sidebar list
5. **Pillar pages link to other pillar pages** — when topically related
6. **Cross-cluster links are selective** — only when genuinely relevant, not forced
7. **No orphan pages** — every page should have at least 3 internal links pointing to it
8. **Important pages get more internal links** — the pages you most want to rank should have the most internal links

### Internal Linking Audit Checklist

- [ ] Every cluster post has a link to its pillar page within the first 3 paragraphs
- [ ] Every pillar page has a section listing/linking to all cluster posts
- [ ] No pages have 0 internal links pointing to them (orphan pages)
- [ ] Anchor text varies naturally (not the same keyword phrase every time)
- [ ] No broken internal links (404s)
- [ ] Key conversion pages (pricing, signup, trial) receive internal links from high-traffic content

---

## Content Gap Identification Within Clusters

Even after initial cluster planning, gaps will emerge as you publish and analyze performance.

### Gap Detection Methods

#### Method 1: Search Console Query Analysis

1. In Search Console, filter by pillar page URL
2. Check "Queries" tab — look for queries the pillar receives impressions for but does not rank well
3. Each of these queries is a potential cluster post topic

#### Method 2: PAA Chain Expansion

1. Search your pillar keyword
2. Expand every PAA question
3. For each question, click to expand — note the new PAA questions that appear
4. Continue 3-4 levels deep
5. Any question not covered by an existing cluster post = gap

#### Method 3: Competitor Cluster Comparison

1. Find a competitor's pillar page on the same topic
2. Identify all pages they link to from that pillar
3. Compare their cluster posts to yours
4. Any topic they cover that you do not = gap

#### Method 4: "Also Searched For" Analysis

After searching your pillar keyword, note Google's "Related searches" at page bottom. Each suggestion not covered by your cluster is a potential gap.

### Gap Prioritization

| Gap Topic | Keyword | Volume | Already Covered by Competitor? | Fills Intent Gap? | Priority |
|-----------|---------|--------|-------------------------------|-------------------|----------|
| | | | Y/N | Y/N | P1/P2/P3 |
| | | | | | |

**Prioritize gaps that:**
1. Multiple competitors cover (validated demand)
2. Fill an intent gap in your cluster (e.g., you have informational but no commercial content)
3. Have meaningful search volume (> 100/month)
4. Can be published quickly (low content effort)

---

## Cluster Performance Measurement

Measure clusters as a unit, not just individual pages.

### Cluster-Level Metrics

| Metric | How to Measure | Healthy Benchmark |
|--------|---------------|-------------------|
| **Total cluster organic traffic** | Sum organic sessions for pillar + all cluster posts | Growing month-over-month |
| **Pillar page position** | Rank tracking for pillar keyword | Moving toward page 1 over time |
| **Cluster keyword coverage** | % of target keywords with a published page | > 80% within 6 months of starting |
| **Internal link density** | Average internal links per page in cluster | 3-5 internal links per page |
| **Pillar page referring domains** | Backlinks to the pillar page | Should have the most backlinks in the cluster |
| **Cluster conversion rate** | Conversions from cluster pages / total cluster sessions | Depends on funnel stage — TOFU: 0.5-2%, MOFU: 2-5% |
| **Content freshness** | Average age of content in cluster | < 12 months since last update |

### Cluster Performance Dashboard Template

```
CLUSTER: {{PILLAR_TOPIC_1}}
Period: {{QUARTER}}

Pillar page:
  Organic sessions:    ___ (Δ __% vs last quarter)
  Primary keyword rank: position ___ (Δ ___ positions)
  Referring domains:   ___
  Conversions:         ___

Cluster posts:
  Total posts published:  ___ / ___ planned
  Total organic sessions: ___ (Δ __% vs last quarter)
  Keywords on page 1:    ___
  Keywords on page 2:    ___
  Top-performing post:    [title] — ___ sessions
  Lowest-performing post: [title] — ___ sessions

Cluster health:
  [ ] All cluster posts link to pillar — verified
  [ ] Pillar links to all cluster posts — verified
  [ ] No cannibalization detected
  [ ] No content gaps remaining
  [ ] All content updated within last 12 months

Actions for next quarter:
  1. ___
  2. ___
  3. ___
```

---

## When to Create vs. Expand Clusters

### Expand an Existing Cluster When...

- The pillar page ranks page 2 but not page 1 (more cluster content boosts authority)
- Search Console shows the pillar receiving impressions for keywords you have not covered
- Competitors have more cluster content on the same topic
- The cluster has < 8 posts (most topics need 8-15 for sufficient depth)
- New subtopics emerge (technology changes, new features, new audience segments)

### Create a New Cluster When...

- You have exhausted the current cluster's subtopics (80%+ coverage)
- There is a validated keyword group outside your current clusters
- Your business is expanding into a new product area or audience segment
- A topic adjacent to your current clusters has high demand and low competition
- You have the content capacity to sustain both clusters simultaneously

### Decision Framework

```
Should I expand or create?

Is the existing cluster at 80%+ coverage?
├── No → EXPAND the existing cluster first
└── Yes → Does the new topic relate to an existing pillar?
          ├── Yes → Add it as a cluster post under that pillar
          └── No → Is there demand (volume, competitor validation)?
                   ├── No → Don't create it yet
                   └── Yes → Do you have capacity (writer, time, budget)?
                            ├── No → Add to roadmap for next quarter
                            └── Yes → CREATE a new cluster
```

---

## Cluster Planning Template

Use this template for each cluster you plan. Copy and fill in per pillar topic.

```
═══════════════════════════════════════════════════════════
CLUSTER PLAN: {{PILLAR_TOPIC_1}}
═══════════════════════════════════════════════════════════

PILLAR PAGE
  Title:
  Primary keyword:           | Volume:      | KD:
  URL:
  Word count target:         3,000-5,000
  Target publish date:
  Status: [ ] Not started  [ ] Outlining  [ ] Drafting  [ ] Review  [ ] Published

CLUSTER POSTS
  {{CLUSTER_TOPICS}}

  1. Title:
     Keyword:                | Volume:      | KD:
     Intent: Info / Comm / Trans
     Content type: Blog / Guide / Tutorial / Comparison / Case study
     Word count target:      1,500-2,500
     Links to pillar: Yes
     Links to cluster posts: #___, #___
     Target publish date:
     Status: [ ] Not started  [ ] Drafting  [ ] Published

  2. Title:
     Keyword:                | Volume:      | KD:
     ...

  (Repeat for each cluster post, target 8-15 per cluster)

LINKING PLAN
  Pillar → Cluster posts:    all
  Each cluster post → Pillar: yes
  Cross-links between posts: [list specific pairs]
  External clusters linked:  [list related pillars]

TIMELINE
  Month 1: Publish pillar + posts 1-3
  Month 2: Publish posts 4-6
  Month 3: Publish posts 7-10, review pillar
  Month 4: Publish remaining posts, optimize based on data

SUCCESS CRITERIA
  By month 6:
    - Pillar page ranking in top 20 for primary keyword
    - 5+ cluster posts indexed and receiving impressions
    - ___ monthly organic sessions to cluster pages

  By month 12:
    - Pillar page ranking in top 10
    - 80%+ of cluster posts published
    - ___ monthly organic sessions to cluster pages
    - ___ conversions from cluster pages
═══════════════════════════════════════════════════════════
```

---

## Example Cluster Maps

### Example 1: SaaS Product (Project Management Tool)

```
PILLAR: "The Complete Guide to Project Management" (Vol: 12,000 | KD: 65)
│
├── "What is project management?" (Vol: 8,100 | KD: 45) — Informational
├── "Project management methodologies compared" (Vol: 2,400 | KD: 50) — Commercial
├── "Agile vs Waterfall: which is right for your team?" (Vol: 1,900 | KD: 40) — Commercial
├── "How to create a project plan" (Vol: 3,600 | KD: 35) — Informational
├── "Project management for small teams" (Vol: 720 | KD: 20) — Informational
├── "Best project management tools for startups" (Vol: 1,300 | KD: 30) — Commercial
├── "Project management templates (free download)" (Vol: 2,100 | KD: 25) — Transactional
├── "Remote team project management best practices" (Vol: 590 | KD: 15) — Informational
├── "How to run a sprint planning meeting" (Vol: 1,100 | KD: 20) — Informational
├── "Project management KPIs and metrics" (Vol: 480 | KD: 25) — Informational
└── "Case study: How [Company] improved delivery by 40%" (Vol: ~0 | KD: ~0) — Commercial
```

### Example 2: E-Commerce (Running Shoes)

```
PILLAR: "The Ultimate Running Shoe Guide" (Vol: 6,500 | KD: 55)
│
├── "How to choose running shoes for your foot type" (Vol: 2,900 | KD: 30) — Informational
├── "Best running shoes for beginners" (Vol: 4,100 | KD: 45) — Commercial
├── "Trail running shoes vs road running shoes" (Vol: 1,200 | KD: 25) — Commercial
├── "Running shoe sizing guide" (Vol: 1,800 | KD: 20) — Informational
├── "When to replace your running shoes" (Vol: 2,200 | KD: 15) — Informational
├── "Best running shoes for flat feet" (Vol: 3,400 | KD: 40) — Commercial
├── "Running shoe cushioning types explained" (Vol: 890 | KD: 20) — Informational
├── "Nike vs Hoka vs Brooks: running shoe comparison" (Vol: 1,500 | KD: 35) — Commercial
├── "Budget running shoes under $100" (Vol: 2,700 | KD: 25) — Transactional
└── "Running shoe care and maintenance tips" (Vol: 320 | KD: 10) — Informational
```

### Example 3: Developer Tool (API Testing Platform)

```
PILLAR: "The Complete Guide to API Testing" (Vol: 5,400 | KD: 50)
│
├── "What is API testing?" (Vol: 3,200 | KD: 35) — Informational
├── "API testing best practices" (Vol: 1,600 | KD: 30) — Informational
├── "REST API testing tutorial" (Vol: 2,800 | KD: 25) — Informational
├── "GraphQL API testing guide" (Vol: 720 | KD: 15) — Informational
├── "Best API testing tools compared" (Vol: 2,100 | KD: 40) — Commercial
├── "Postman vs [Your Tool]: API testing comparison" (Vol: 890 | KD: 20) — Commercial
├── "How to write API test cases" (Vol: 1,400 | KD: 20) — Informational
├── "API load testing and performance benchmarks" (Vol: 980 | KD: 25) — Informational
├── "Automated API testing in CI/CD pipelines" (Vol: 650 | KD: 20) — Informational
├── "API testing for microservices architecture" (Vol: 420 | KD: 15) — Informational
├── "API mocking and stubbing techniques" (Vol: 580 | KD: 15) — Informational
└── "Common API testing mistakes and how to avoid them" (Vol: 260 | KD: 10) — Informational
```

---

## Cross-References

- **Keyword research**: `36-seo/strategy/keyword-research-methodology.md`
- **SEO strategy**: `36-seo/strategy/seo-strategy.template.md`
- **Content SEO execution**: `36-seo/content-seo/`
- **Internal linking details**: `36-seo/on-page/`
- **SEO roadmap**: `36-seo/strategy/seo-roadmap.template.md`
