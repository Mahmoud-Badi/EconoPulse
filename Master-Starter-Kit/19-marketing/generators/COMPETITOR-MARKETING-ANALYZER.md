# Competitor Marketing Analyzer

**Purpose:** Conduct a deep, structured analysis of competitor marketing strategies using
web scraping (Firecrawl MCP), web search (WebSearch), and manual research. Produces a
comprehensive per-competitor breakdown covering website messaging, content strategy, social
media presence, SEO profile, email sequences, pricing, advertising, and reviews. Culminates
in a comparative matrix, gap analysis, and differentiation recommendations.

**Output:** `marketing/market-research/competitor-marketing-analysis.md`

---

## When to Run

Run this analyzer:
1. After Marketing Intake (Step 19) -- competitor list is available from MARKETING_CONFIG
2. Before the Marketing Plan Generator -- competitor insights inform strategy decisions
3. Before the Landing Page Copy Generator -- differentiation requires competitor context
4. Quarterly refresh recommended -- competitor strategies change over time

---

## Inputs Required

| Input | Location | What it provides |
|-------|----------|-----------------|
| MARKETING_CONFIG | Orchestrator STATE BLOCK | Competitor list, product type, industry |
| Tribunal Competitor Research | `{{TRIBUNAL_OUTPUT_PATH}}/02-competitor-research/` | Feature comparison, pricing, positioning (product-focused) |
| Product Type | MARKETING_CONFIG.PRODUCT_TYPE | Determines which analysis dimensions matter most |
| Industry/Category | Project brief | Context for evaluating competitor positioning |
| Own Positioning | MARKETING_CONFIG.MARKET_POSITIONING | For contrast and differentiation analysis |
| Own UVP | MARKETING_CONFIG.UNIQUE_VALUE_PROP | What makes us different -- verify against competitors |

---

## Tool Requirements

This analyzer uses external tools to gather competitor data. Priority order:

### Preferred: Firecrawl MCP Server
If the Firecrawl MCP server is available, use these tools:
- `firecrawl_scrape` -- scrape individual competitor pages (homepage, pricing, about, blog)
- `firecrawl_crawl` -- crawl competitor sites for content inventory
- `firecrawl_map` -- map competitor site structure
- `firecrawl_search` -- search for competitor mentions and reviews

### Alternative: WebSearch + WebFetch
If Firecrawl is unavailable:
- `WebSearch` -- search for competitor information, reviews, social profiles
- `WebFetch` -- fetch and analyze individual competitor pages

### Fallback: Manual Research Protocol
If no web tools are available, generate a research checklist for the user to complete
manually. Include specific URLs to visit and data points to collect.

---

## Generation Algorithm

1. **Read MARKETING_CONFIG.** Extract competitor list:
   - `COMPETITOR_1`: {name, URL}
   - `COMPETITOR_2`: {name, URL}
   - `COMPETITOR_3`: {name, URL}
   - Additional competitors if available

2. **For each competitor, execute the 8-dimension analysis** described below.

3. **After analyzing all competitors, generate:**
   - Comparative summary matrix
   - Gap analysis (competitor weaknesses = your opportunities)
   - Messaging differentiation recommendations
   - Channel opportunity map

4. **Validate** completeness and accuracy of findings.

---

## Per-Competitor Analysis (8 Dimensions)

For EACH competitor in the list, execute these analyses:

### Dimension 1: Website & Messaging Analysis

**What to scrape/fetch:** Homepage, pricing page, about page, features page

**Extract and document:**

```markdown
## {Competitor Name} -- Website Analysis

**URL:** {competitor website URL}
**Scrape date:** {{DATE}}

### Homepage Messaging
| Element | Content | Assessment |
|---------|---------|-----------|
| **Primary headline** | "{exact headline text}" | {Strong/Weak/Generic} |
| **Sub-headline** | "{exact sub-headline text}" | {Strong/Weak/Generic} |
| **Primary CTA** | "{button text}" | {Clear/Vague/Missing} |
| **Above-fold value prop** | {summary of above-fold messaging} | {Compelling/Average/Weak} |
| **Social proof** | {what social proof is displayed: logos, numbers, ratings} | {Strong/Absent} |

### Positioning Analysis
- **How they position themselves:** {premium/value/niche/disruptor/open}
- **Who they target:** {apparent target audience from copy and imagery}
- **Primary benefit emphasized:** {what they lead with}
- **Tone/voice:** {formal/casual/technical/playful/corporate}
- **Design quality:** {1-10 rating with brief justification}

### CTA Strategy
| CTA Location | CTA Text | Friction Level |
|-------------|----------|---------------|
| Hero | "{CTA text}" | {Low/Medium/High -- does it require credit card, email only, etc.} |
| Features page | "{CTA text}" | {Low/Medium/High} |
| Pricing page | "{CTA text}" | {Low/Medium/High} |

### Trust Signals Audit
- [ ] Customer logos: {Yes/No -- which logos?}
- [ ] Testimonials: {Yes/No -- how many? Named or anonymous?}
- [ ] Case studies: {Yes/No -- how many? With metrics?}
- [ ] Security badges: {Yes/No -- SOC 2, GDPR, etc.}
- [ ] Review platform badges: {Yes/No -- G2, Capterra, etc.}
- [ ] Press mentions: {Yes/No -- which publications?}
- [ ] Team/founder page: {Yes/No -- photos and bios?}
```

---

### Dimension 2: Content Strategy Analysis

**What to check:** Blog/resources page, help center, documentation, lead magnets

**Extract and document:**

```markdown
### {Competitor Name} -- Content Strategy

**Blog URL:** {URL}
**Content hub URL:** {URL if separate from blog}

| Metric | Value | Assessment |
|--------|-------|-----------|
| **Blog exists** | Yes/No | |
| **Total posts (estimated)** | {N} | {Robust/Moderate/Sparse/None} |
| **Publishing frequency** | {X posts per week/month} | {Consistent/Sporadic/Abandoned} |
| **Most recent post date** | {Date} | {Active/Stale} |
| **Content types** | {Blog posts, guides, videos, podcasts, webinars, templates} | {Diverse/Limited} |
| **Content depth** | {Short (300-500 words) / Medium (800-1500) / Long (2000+)} | {Thorough/Shallow} |

**Top content topics (last 10 posts):**
1. {Topic 1}
2. {Topic 2}
3. {Topic 3}
4. {Topic 4}
5. {Topic 5}

**Content quality assessment:**
- Writing quality: {1-10}
- Visual quality (images, diagrams, screenshots): {1-10}
- SEO optimization (title tags, meta descriptions, internal linking): {1-10}
- Actionability (does it teach something useful?): {1-10}

**Lead magnets identified:**
| Lead Magnet | Type | Gate | Quality |
|-------------|------|------|---------|
| {Name} | {ebook/template/webinar/course/tool} | {Email required / Free} | {High/Medium/Low} |

**Content gap opportunities:**
- {Topic they have NOT covered that your audience cares about}
- {Content format they do NOT use (video, interactive, templates)}
- {Depth they lack (surface-level posts where deep guides would win)}
```

---

### Dimension 3: Social Media Analysis

**Platforms to check:** Twitter/X, LinkedIn (company page), YouTube, TikTok, Instagram, Facebook

**Extract and document:**

```markdown
### {Competitor Name} -- Social Media

| Platform | Handle | Followers | Post Frequency | Engagement | Content Type |
|----------|--------|-----------|---------------|------------|-------------|
| Twitter/X | @{handle} | {N} | {X/week} | {Low/Med/High} | {Edu/Product/BTS/Mix} |
| LinkedIn | {page} | {N} followers | {X/week} | {Low/Med/High} | {Thought leadership/Product/Mix} |
| YouTube | {channel} | {N} subs | {X/month} | {Low/Med/High} | {Tutorials/Demos/Talks} |
| TikTok | @{handle} | {N} | {X/week} | {Low/Med/High} | {Style} |
| Instagram | @{handle} | {N} | {X/week} | {Low/Med/High} | {Style} |

**Top-performing posts (highest engagement):**
1. {Platform}: "{Post summary}" -- {engagement metrics}
2. {Platform}: "{Post summary}" -- {engagement metrics}
3. {Platform}: "{Post summary}" -- {engagement metrics}

**Social media assessment:**
- Strongest platform: {platform} -- why: {reason}
- Weakest platform: {platform} -- why: {reason}
- Content strategy: {broadcasting only / genuine engagement / community building}
- Build-in-public: {Yes/No}
- Founder personal brand: {Active/Inactive} -- {handle if active}

**Social media gap opportunities:**
- {Platform they ignore where your audience exists}
- {Content type they do not produce (threads, video, polls)}
- {Engagement style gap (they broadcast but do not engage in replies)}
```

---

### Dimension 4: SEO Analysis

**Tools to use:** WebSearch for keyword research, Firecrawl for page analysis

**Extract and document:**

```markdown
### {Competitor Name} -- SEO Profile

| Metric | Value | Source |
|--------|-------|--------|
| **Estimated domain authority** | {X}/100 | {Ahrefs/Moz estimate or qualitative assessment} |
| **Estimated monthly organic traffic** | {N} | {SimilarWeb/Ahrefs estimate if available} |
| **Indexed pages (estimated)** | {N} | {site:{domain} search result count} |
| **Blog content volume** | {N posts} | |

**Top ranking keywords (estimated from content analysis):**
1. {Keyword} -- {estimated position} -- {search intent}
2. {Keyword} -- {estimated position} -- {search intent}
3. {Keyword} -- {estimated position} -- {search intent}
4. {Keyword} -- {estimated position} -- {search intent}
5. {Keyword} -- {estimated position} -- {search intent}

**Backlink sources (identified from mentions and press):**
- {Source 1}: {type of backlink -- press mention, guest post, directory listing}
- {Source 2}
- {Source 3}

**Technical SEO observations:**
- Page speed: {Fast/Average/Slow -- based on page load observation}
- Mobile-responsive: {Yes/No}
- Structured data: {Yes/No -- check for FAQ schema, product schema, etc.}

**SEO gap opportunities:**
- {Keywords they rank for that you could also target}
- {Keywords they do NOT rank for that have search volume}
- {Content formats they lack (comparison pages, glossary, tools)}
- {Backlink sources accessible to you (directories, guest post opportunities)}
```

---

### Dimension 5: Email Analysis

**How to gather:** Sign up for their email list or free trial. Document the experience.

**Extract and document:**

```markdown
### {Competitor Name} -- Email Marketing

**Sign-up method used:** {Newsletter / Free trial / Lead magnet download}
**Sign-up date:** {{DATE}}

**Welcome sequence observations:**

| Email # | Day Received | Subject Line | Content Summary | CTA | Quality |
|---------|-------------|-------------|-----------------|-----|---------|
| 1 | Day 0 | "{subject}" | {brief summary} | "{CTA text}" | {1-10} |
| 2 | Day {N} | "{subject}" | {brief summary} | "{CTA text}" | {1-10} |
| 3 | Day {N} | "{subject}" | {brief summary} | "{CTA text}" | {1-10} |

**Email strategy observations:**
- Sequence length: {N emails over N days}
- Tone: {Formal/Casual/Technical/Sales-heavy}
- Personalization: {First name / Company / Role / None}
- Value vs pitch ratio: {X% educational, Y% promotional}
- Sender: {Person name / Company name / Team name}
- Design: {HTML designed / Plain text / Hybrid}

**Email gap opportunities:**
- {What their emails do NOT do well that you could}
- {Sequences they lack (onboarding, win-back, etc.)}
- {Content quality issues in their emails}

**Note for Claude:** If you cannot sign up for competitor emails during this analysis,
generate a research task for the user: "Sign up for {competitor} email list using
{email}. Forward the first 5 emails to {destination}. We'll analyze them in the next run."
```

---

### Dimension 6: Pricing Analysis

**What to check:** Pricing page, comparison pages, review sites for pricing complaints

**Extract and document:**

```markdown
### {Competitor Name} -- Pricing

**Pricing page URL:** {URL}
**Pricing model:** {Freemium / Free trial / Paid only / Usage-based / Custom}
**Pricing transparency:** {Fully public / "Contact sales" / Hidden}

| Tier | Name | Price | Key Features | Limitations |
|------|------|-------|-------------|-------------|
| Free | {name} | $0 | {features included} | {limitations: seats, volume, features} |
| Tier 1 | {name} | ${X}/mo | {features included} | {limitations} |
| Tier 2 | {name} | ${X}/mo | {features included} | {limitations} |
| Enterprise | {name} | Custom | {features included} | {contact sales} |

**Pricing observations:**
- Annual discount: {X}% ({Yes/No})
- Free trial length: {N} days
- Credit card required for trial: {Yes/No}
- Money-back guarantee: {Yes/No -- duration}
- Most pushed tier: {which tier has "Most Popular" or "Recommended" badge}

**Pricing gap opportunities:**
- {Price point gaps you could fill}
- {Feature bundling differences you could exploit}
- {Pricing model alternatives (usage-based vs flat rate)}
- {Free tier limitations that frustrate users -- based on reviews}
```

---

### Dimension 7: Advertising Analysis

**Tools:** Facebook Ad Library (ads.facebook.com/ads/library), Google Ads Transparency Center

**Extract and document:**

```markdown
### {Competitor Name} -- Advertising

**Facebook Ad Library check:**
- Active ads found: {Yes/No}
- Number of active ads: {N}
- Ad formats: {Image / Video / Carousel / Collection}
- Running since: {earliest ad start date}
- Key messaging themes: {what their ads emphasize}
- Ad copy examples:
  - "{Example ad copy 1}"
  - "{Example ad copy 2}"

**Google Ads Transparency check:**
- Active ads found: {Yes/No}
- Ad format: {Search / Display / Shopping}
- Key headline examples:
  - "{Headline 1}"
  - "{Headline 2}"

**Estimated ad spend:** {If inferable from ad volume and platform; otherwise "Unknown"}

**Advertising gap opportunities:**
- {Platforms they advertise on that you should consider}
- {Platforms they do NOT advertise on (opportunity if your audience is there)}
- {Messaging angles they are NOT using in ads}
- {Keyword gaps in their search ads}
```

---

### Dimension 8: Reviews & Reputation Analysis

**Where to check:** G2, Capterra, Product Hunt, Trustpilot, App Store, Play Store, Reddit mentions

**Extract and document:**

```markdown
### {Competitor Name} -- Reviews & Reputation

| Platform | Rating | Review Count | URL |
|----------|--------|-------------|-----|
| G2 | {X}/5 | {N} reviews | {URL} |
| Capterra | {X}/5 | {N} reviews | {URL} |
| Product Hunt | {X} upvotes | -- | {URL} |
| Trustpilot | {X}/5 | {N} reviews | {URL} |
| App Store | {X}/5 | {N} ratings | {URL} |
| Play Store | {X}/5 | {N} ratings | {URL} |

**Common praise themes (what users love):**
1. {Theme 1 -- e.g., "easy to use", "great support", "fast"}
2. {Theme 2}
3. {Theme 3}

**Common complaint themes (what users hate):**
1. {Theme 1 -- e.g., "expensive", "missing feature X", "poor mobile experience"}
2. {Theme 2}
3. {Theme 3}

**Notable reviews to study:**
- "{Quote from a particularly insightful positive review}" -- {Source}
- "{Quote from a particularly insightful negative review}" -- {Source}

**Reputation gap opportunities:**
- {Complaints that your product addresses or could address}
- {Missing features users request that you offer}
- {Support quality issues you could differentiate on}
```

---

## Comparative Summary Matrix

After completing all per-competitor analyses, generate the summary:

```markdown
## Comparative Summary Matrix

| Dimension | {{PROJECT_NAME}} | {Competitor 1} | {Competitor 2} | {Competitor 3} |
|-----------|-----------------|----------------|----------------|----------------|
| **Positioning** | {positioning} | {positioning} | {positioning} | {positioning} |
| **Primary message** | {headline/UVP} | {headline} | {headline} | {headline} |
| **Pricing model** | {model} | {model} | {model} | {model} |
| **Starting price** | ${X}/mo | ${X}/mo | ${X}/mo | ${X}/mo |
| **Free tier** | {Yes/No} | {Yes/No} | {Yes/No} | {Yes/No} |
| **Content strategy** | {assessment} | {assessment} | {assessment} | {assessment} |
| **Strongest social** | {platform} | {platform} | {platform} | {platform} |
| **Blog quality** | {1-10} | {1-10} | {1-10} | {1-10} |
| **SEO strength** | {est. DA} | {est. DA} | {est. DA} | {est. DA} |
| **Review rating** | {avg} | {avg} | {avg} | {avg} |
| **Active ads** | {Yes/No} | {Yes/No} | {Yes/No} | {Yes/No} |
| **Top weakness** | {weakness} | {weakness} | {weakness} | {weakness} |
```

---

## Gap Analysis

```markdown
## Gap Analysis: Your Opportunities

### Where Competitors Are Weak (Your Opportunities)

| Opportunity | Which Competitors | How to Exploit | Priority |
|------------|-------------------|---------------|----------|
| {Gap 1: e.g., "No competitor has video content"} | All | {Action: "Launch YouTube tutorials"} | {High/Med/Low} |
| {Gap 2: e.g., "Competitor A has poor mobile experience"} | {Comp A} | {Action: "Emphasize mobile-first in copy"} | {High/Med/Low} |
| {Gap 3: e.g., "Common complaint about pricing"} | {Comp B, C} | {Action: "Lead with value positioning"} | {High/Med/Low} |

### Where Competitors Are Strong (Your Risks)

| Strength | Which Competitors | How to Respond | Priority |
|----------|-------------------|---------------|----------|
| {Strength 1: e.g., "Competitor A has 50K blog visitors/mo"} | {Comp A} | {Response: "Target long-tail keywords they miss"} | {High/Med/Low} |
| {Strength 2: e.g., "Competitor B has strong brand recognition"} | {Comp B} | {Response: "Position as niche specialist vs their generalist"} | {High/Med/Low} |
```

---

## Messaging Differentiation Recommendations

```markdown
## How to Position Against Each Competitor

### vs {Competitor 1}
- **Their position:** {how they position themselves}
- **Their weakness:** {what they do poorly or what users complain about}
- **Your angle:** {how to position {{PROJECT_NAME}} specifically against them}
- **Messaging:** "Unlike {Competitor 1} which {their approach}, {{PROJECT_NAME}} {your approach}."
- **Comparison page headline:** "{Headline for a {{PROJECT_NAME}} vs {Competitor 1} page}"

### vs {Competitor 2}
{Same structure}

### vs {Competitor 3}
{Same structure}

### Universal Differentiation (vs ALL competitors)
- **What NO competitor does well:** {gap that only you fill}
- **Your unfair advantage:** {what makes you structurally better, not just feature-better}
- **Primary positioning statement:** {the one-liner that sets you apart from the entire field}
```

---

## Quality Gates

Before finalizing the competitor analysis, verify:

- [ ] At least 3 competitors are analyzed across all 8 dimensions
- [ ] All data is sourced (URLs, dates, tool used for each data point)
- [ ] No fabricated data -- mark as "Unable to determine" if a data point is inaccessible
- [ ] Website messaging analysis uses EXACT copy from competitor sites, not paraphrases
- [ ] Pricing data is current (check date on pricing page if visible)
- [ ] Social media follower counts and engagement are approximate but reasonable
- [ ] Review quotes are real (from actual review platforms, not invented)
- [ ] Gap analysis provides actionable recommendations, not just observations
- [ ] Messaging differentiation is specific enough to write ad copy from
- [ ] Comparative matrix is complete with no empty cells (use "N/A" or "Unknown" if needed)

---

## Validation Checklist

After generation, verify:
- [ ] All `{{PLACEHOLDER}}` variables are resolved
- [ ] Each competitor has entries for all 8 dimensions (even if some are "Not available")
- [ ] Comparative summary matrix accurately summarizes the per-competitor analyses
- [ ] Gap analysis has at least 3 opportunities and 2 risks identified
- [ ] Messaging differentiation provides specific copy angles, not vague advice
- [ ] All URLs are valid and functional
- [ ] Analysis is current (data gathered within the last 30 days)
- [ ] The document can be used by the Marketing Plan Generator and Landing Page Copy Generator
  without requiring additional research
- [ ] No competitor analysis contains opinion presented as fact -- clearly distinguish
  observations from assessments
