# Competitor Research

## Purpose

Competitor research is the Tribunal's market intelligence layer. Before personas vote on features, and before experts assess feasibility, the team needs to know what already exists — what works, what doesn't, and where the gaps are.

The goal is not to copy competitors. It's to understand the **table stakes** (features every product has, which users expect by default) and the **differentiation opportunities** (features no one does well, or no one does at all).

## How Many Competitors to Research

| Project Size | Direct Competitors | Adjacent Market |
|-------------|-------------------|-----------------|
| Small (1-3 months) | 3-5 | 1 |
| Medium (3-6 months) | 5-8 | 2-3 |
| Large (6+ months) | 8-12 | 3-5 |

**Direct competitors** serve the same user types with the same core workflow. **Adjacent market** products solve a related problem and may have UX patterns worth borrowing (e.g., a fleet management app is adjacent to a delivery logistics app).

## Research Process

### Step 1: Identify Competitors

Sources for finding competitors:

- **Google:** "[domain] software", "[domain] SaaS", "best [domain] tools 2026"
- **Review sites:** G2, Capterra, TrustRadius — filter by category, sort by rating
- **Product Hunt:** Search the domain, check collections
- **Industry publications:** Trade magazines, buyer's guides, analyst reports
- **Reddit/forums:** Ask "what do you use for [domain]?" — real users give honest answers
- **LinkedIn:** Search for companies in the space, check their product pages
- **App stores:** If mobile is relevant, search iOS/Android stores

### Step 2: Scrape Each Competitor (Firecrawl)

For each competitor, scrape these pages:

| Page | What to Extract |
|------|----------------|
| Homepage | Value proposition, target market, hero messaging |
| Features/Product page | Feature list, feature descriptions, screenshots |
| Pricing page | Tiers, per-seat vs. flat, enterprise gates |
| Help docs / Knowledge base | Feature depth, edge cases, limitations |
| Case studies / Testimonials | Target customer profile, use cases, results |
| Blog | Product updates, roadmap hints, industry positioning |
| Changelog (if public) | Release velocity, recent focus areas |

### Step 3: Deep Analysis (Gemini)

Feed the scraped content to Gemini deep research with this prompt:

```
Analyze this product as a competitor in the [DOMAIN] space.

Scraped content: [PASTE]

Produce:
1. Product summary (2-3 sentences)
2. Target market segment (SMB / Mid-Market / Enterprise)
3. Key features with quality rating (1-5)
4. UX strengths (what they do well)
5. UX weaknesses (where they fall short)
6. Differentiators (what makes them unique)
7. What we can learn from them
8. Where we can beat them
```

### Step 4: Fill Out Templates

- One `competitor.template.md` per competitor (save as `[company-name].md`)
- One `competition-matrix.template.md` for the cross-competitor feature grid

## Abbreviated Mode

For smaller projects, skip the full per-competitor deep dives:

1. Spend 10-15 minutes per competitor browsing their site and pricing page
2. Fill out the competition matrix only (skip individual competitor documents)
3. Note 2-3 UX patterns worth borrowing
4. Move on to personas

## Output Files

```
competitors/
  README.md                          # This file
  competitor.template.md             # Per-competitor analysis template
  competition-matrix.template.md     # Cross-competitor feature grid
  [company-a].md                     # Filled template for Company A
  [company-b].md                     # Filled template for Company B
  ...
  competition-matrix.md              # Filled cross-competitor grid
```

## Tips

- **Don't over-invest in failing competitors.** If a competitor has bad reviews and a dying product, note it briefly and move on.
- **Screenshot everything.** Screenshots decay (products change), but they're invaluable during design rounds. Save to a `screenshots/` subfolder if needed.
- **Note pricing carefully.** Pricing reveals market expectations. If every competitor charges $50/seat/month, pricing at $200/seat needs strong justification.
- **Check the negative reviews.** G2 and Capterra 1-2 star reviews tell you exactly what frustrates users — these are your differentiation opportunities.
- **Look for "Coming Soon" features.** These reveal competitor roadmaps and areas where the market is heading.
