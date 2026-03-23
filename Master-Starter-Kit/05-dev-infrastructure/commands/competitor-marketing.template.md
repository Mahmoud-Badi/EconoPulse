# /competitor-marketing $ARGUMENT

Deep-dive marketing analysis of a specific competitor. `$ARGUMENT` is the competitor name or website URL. Analyzes their marketing strategy across all channels.

## When to Use

- During marketing research (Step 19)
- When a new competitor enters the market
- Before launching a competitive campaign
- Quarterly competitive landscape review

## Steps

### Step 1: Identify Competitor

If `$ARGUMENT` is a name, search for their website URL using WebSearch.
If `$ARGUMENT` is a URL, use it directly.

### Step 2: Website Analysis

Use Firecrawl MCP (or WebFetch fallback) to scrape and analyze:

**Homepage:**
- Headline and value proposition (exact copy)
- Positioning statement
- Target audience signals
- Social proof elements (logos, testimonials, metrics)
- CTA strategy (primary and secondary CTAs)
- Design quality assessment

**Pricing page:**
- Pricing model (subscription, freemium, one-time, etc.)
- Tier structure (names, prices, features per tier)
- Free tier or trial offering
- Enterprise/custom pricing
- Annual vs monthly pricing and discounts
- Money-back guarantee

**About/Company page:**
- Team size and composition
- Funding status (check Crunchbase via WebSearch)
- Company story and mission
- Key differentiators they claim

### Step 3: Content Strategy Analysis

**Blog/Content:**
- Publishing frequency (posts per week/month)
- Content types (tutorials, thought leadership, case studies, product updates)
- Top-performing content (most shared, most linked)
- SEO strategy (target keywords, content clusters)
- Content quality assessment

**Resources:**
- Lead magnets (ebooks, templates, tools, calculators)
- Documentation quality
- Video content (YouTube channel, tutorials, webinars)

### Step 4: Social Media Analysis

For each active platform (Twitter/X, LinkedIn, YouTube, etc.):
- Follower count
- Posting frequency
- Content types and themes
- Engagement rates (likes, comments, shares relative to followers)
- Community engagement (responses, conversations)
- Paid promotion indicators

### Step 5: Distribution & Reviews

**Directories and listings:**
- G2, Capterra, Product Hunt presence
- Average ratings and review counts
- Common praise and complaints from reviews

**Advertising (if detectable):**
- Check Meta Ad Library for active Facebook/Instagram ads
- Check Google Ads Transparency for search ads
- Note ad copy themes, creative styles, and landing pages

### Step 6: Synthesize and Compare

Generate a structured competitor profile and comparison against {{PROJECT_NAME}}.

### Output

```
COMPETITOR MARKETING ANALYSIS
==============================
Competitor: $ARGUMENT
URL: {url}
Analysis date: {today}

POSITIONING:
  Headline: "{exact headline}"
  Value prop: "{value proposition}"
  Target audience: {who they're targeting}
  Key differentiator: {what they claim makes them different}

PRICING:
  Model: {subscription/freemium/etc.}
  Plans: {plan names and prices}
  Free tier: {yes/no — what's included}
  Trial: {yes/no — length and type}

CONTENT:
  Blog frequency: {X posts/month}
  Content focus: {primary topics}
  Lead magnets: {what they offer}
  Video: {YouTube presence}

SOCIAL:
  Twitter/X: {followers} — {posting frequency}
  LinkedIn: {followers} — {posting frequency}
  Other: {platforms and presence}

REVIEWS:
  G2: {rating} ({review count})
  Capterra: {rating} ({review count})
  Product Hunt: {upvotes}
  Common praise: {themes}
  Common complaints: {themes}

STRENGTHS:
- {marketing strength 1}
- {marketing strength 2}

WEAKNESSES:
- {marketing weakness 1}
- {marketing weakness 2}

OPPORTUNITIES FOR {{PROJECT_NAME}}:
- {opportunity 1 — where you can outperform them}
- {opportunity 2}
- {opportunity 3}

MESSAGING DIFFERENTIATION:
  Against this competitor, emphasize: {what to highlight}
  Avoid competing on: {where they're strong}
```

Save to `{{DOCS_PATH}}/marketing/competitors/{competitor-slug}-analysis.md`

## Notes

- This command requires Firecrawl MCP for website scraping. Falls back to WebFetch + WebSearch if unavailable.
- Sign up for the competitor's email list to capture their welcome sequence (document separately).
- Re-run this analysis quarterly as competitors evolve their marketing.
- Use findings to update your own positioning and messaging in `19-marketing/brand-messaging/`.
- Check Meta Ad Library at `https://www.facebook.com/ads/library/` for competitor ad intelligence.
