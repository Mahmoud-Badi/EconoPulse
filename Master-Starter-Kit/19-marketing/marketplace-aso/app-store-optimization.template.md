# App Store Optimization (ASO) Strategy — {{PROJECT_NAME}}

> A comprehensive ASO playbook for maximizing organic discoverability, conversion rates, and download velocity on iOS App Store and Google Play Store.

---

## ASO Fundamentals

App Store Optimization is the process of improving an app's visibility and conversion rate within app stores. Unlike web SEO, ASO operates within a closed ecosystem with unique ranking signals.

### Why ASO Matters for {{PROJECT_NAME}}

- 65% of app downloads come from app store search
- ASO reduces customer acquisition cost compared to paid install campaigns
- Higher organic rankings compound over time -- small improvements in conversion rate today mean thousands more downloads over the next year
- Strong ASO amplifies the return on every paid campaign (better conversion = lower CPI)

### ASO Ranking Factors

| Factor | iOS Weight | Android Weight | Notes |
|--------|-----------|---------------|-------|
| **App title/name** | Very high | Very high | Primary keyword placement |
| **Subtitle / short description** | High | High | Secondary keyword opportunity |
| **Keyword field** | High (iOS only) | N/A | 100 characters, comma-separated |
| **Long description** | Low (not indexed) | High (indexed) | Keyword density matters on Google Play |
| **Download velocity** | Very high | Very high | Recent downloads relative to competitors |
| **Ratings and reviews** | High | High | Average rating + volume + recency |
| **Update frequency** | Medium | Medium | Signals active development |
| **Retention / engagement** | High | High | Uninstall rate, session length, DAU/MAU |
| **Backlinks** | N/A | Medium | Google indexes Play Store listings |

---

## Keyword Research Process

### Step 1: Seed Keyword Generation

Start with 50-100 seed keywords derived from these sources.

```
Sources for seed keywords:

1. Your product description — what does {{PROJECT_NAME}} do?
2. User language — how do {{TARGET_AUDIENCE}} describe the problem you solve?
3. Competitor app titles and descriptions
4. App store search suggestions (type partial terms, note autocomplete)
5. Related web search keywords (Google Keyword Planner, Ahrefs)
6. Reviews of competitor apps — what words do users use?
7. Category browsing — terms used by top apps in your category
```

### Step 2: Keyword Research Tools

| Tool | Best For | Pricing |
|------|----------|---------|
| **App Annie (data.ai)** | Market intelligence, download estimates, competitive benchmarks | Custom pricing |
| **Sensor Tower** | Keyword volume estimates, competitor tracking, ad intelligence | $79/mo+ |
| **AppTweak** | Keyword suggestions, ASO scoring, trend analysis, timeline views | $69/mo+ |
| **Mobile Action** | Keyword spy, competitor keyword analysis, visibility score | $59/mo+ |
| **AppFollow** | Review analysis, keyword tracking, automated alerts | $23/mo+ |
| **SearchAds.com (free)** | Apple Search Ads keyword popularity scores | Free |
| **Google Play Console** | Actual search terms driving installs to your app | Free (your app) |

### Step 3: Keyword Evaluation Matrix

For each keyword, score on three dimensions.

```
KEYWORD: _______________

Relevance (1-5):     ___ How closely does this describe {{PROJECT_NAME}}?
Volume (1-5):        ___ How many people search for this term?
Difficulty (1-5):    ___ How hard is it to rank for this term?

Priority Score = Relevance x Volume / Difficulty

Score 5+:   HIGH PRIORITY — target in title or subtitle
Score 3-5:  MEDIUM PRIORITY — target in keyword field or description
Score <3:   LOW PRIORITY — consider for long-tail combinations only
```

### Step 4: Competitor Keyword Analysis

```
For each top 5 competitor in your category, document:

Competitor: _______________
App Store Rank: ___
Title keywords: _______________
Subtitle keywords: _______________
Description keywords (top 10): _______________
Categories: _______________
Estimated monthly downloads: _______________

Keywords they rank for that you do not: _______________
Keywords you share (and relative position): _______________
Keyword gaps (you rank, they do not): _______________
```

### Step 5: Keyword Mapping

```
Allocate keywords across available metadata fields:

iOS:
  Title (30 chars): {{PRIMARY_KEYWORD}} — highest-value keyword
  Subtitle (30 chars): {{SECONDARY_KEYWORD}} — complementary keyword
  Keyword field (100 chars): remaining keywords, comma-separated, no spaces
  Description: conversion-focused (NOT indexed for search)

Google Play:
  Title (30 chars): {{PRIMARY_KEYWORD}}
  Short description (80 chars): {{SECONDARY_KEYWORD}} + benefit statement
  Long description (4,000 chars): distribute 3-5 mentions of each target keyword

Rule: Never repeat a keyword across fields on iOS — Apple indexes
all fields together and duplication wastes character space.
```

---

## Title Optimization

The app title is the single most important ASO element. Every word counts.

### Platform Constraints

| Platform | Title Length | Key Consideration |
|----------|------------|-------------------|
| **iOS** | 30 characters max | Keyword field supplements title |
| **Google Play** | 30 characters max | No keyword field — description carries more weight |

### Title Formula

```
Formula: [Brand Name] — [Primary Keyword Phrase]
  or:    [Brand Name]: [Primary Keyword Phrase]

Examples:
  "Notion — Notes & Docs"
  "Slack: Messaging & Teams"
  "Headspace: Meditation & Sleep"

For {{PROJECT_NAME}}:
  Option A: "{{PROJECT_NAME}} — {{PRIMARY_KEYWORD}}"
  Option B: "{{PROJECT_NAME}}: {{PRIMARY_KEYWORD}}"
```

### Title Optimization Rules

- Brand name should come first for recognition
- Use remaining characters for highest-value keyword
- Do not repeat words from your subtitle in the title (iOS)
- Avoid special characters unless part of your brand name
- Never use "best" or "free" — both stores may reject this
- Test title changes with A/B testing before committing

---

## Subtitle (iOS) / Short Description (Google Play)

### iOS Subtitle

- 30 characters maximum
- Appears directly below app name in search results
- Include secondary keywords not used in the title
- Updates require a new app version submission
- Do NOT duplicate words from title — Apple indexes all fields together

### Google Play Short Description

- 80 characters maximum
- Appears above the "Read more" fold on listing page
- Google indexes this field for search ranking
- Can be updated without a new app version
- Include secondary keywords and a clear benefit statement

```
Subtitle/Short Description options for {{PROJECT_NAME}}:

Option A: "{{SUBTITLE_OPTION_A}}"
Option B: "{{SUBTITLE_OPTION_B}}"
Option C: "{{SUBTITLE_OPTION_C}}"

Selection criteria:
- Does it complement (not repeat) the title?
- Does it include a high-value secondary keyword?
- Does it communicate a clear benefit to {{TARGET_AUDIENCE}}?
- Is it within the character limit?
```

---

## Long Description Strategy

### iOS Long Description

- 4,000 characters maximum
- Apple does NOT index the long description for search ranking
- Primary purpose is conversion — convince users to download
- Structure: hook paragraph, feature bullets, social proof, CTA
- First 3 lines appear before the "more" fold — make them count

### Google Play Long Description

- 4,000 characters maximum
- Google DOES index the long description for search
- Balance keyword optimization with readability
- Target 3-5 mentions of each primary keyword, naturally distributed
- Avoid keyword stuffing — Google penalizes this and it hurts conversion
- Use Unicode symbols for formatting (no HTML support)

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### SaaS App Description Strategy

Focus descriptions on productivity gains, team collaboration, and integration capabilities. Lead with the business problem solved, then features. Emphasize cross-platform availability, data sync, and enterprise-grade security. Include integration partner names as keywords where relevant.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
### Mobile App Description Strategy

Lead with the core experience and user benefit. Use emotional language about how the app improves daily life. Highlight offline capabilities, performance, battery efficiency, and device-specific features like widgets or watch companions.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
### Marketplace App Description Strategy

Emphasize the breadth of selection, trust and safety features, and transaction ease. Include social proof metrics (number of users, listings, transactions). Address both buyer and seller personas separately in the description body.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
### Developer Tool Description Strategy

Use technical language confidently. Include supported languages, frameworks, and platforms. Mention API capabilities, CLI support, and CI/CD integration. Link to documentation. Developer audiences respond to specificity over marketing superlatives.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "client_site" -->
### Client-Facing App Description Strategy

Focus on the end-user benefit and simplicity. Avoid internal jargon. Emphasize ease of use, customer support availability, and onboarding experience. Include industry-specific use cases and compliance certifications if applicable.
<!-- ENDIF -->

### Description Template

```
FIRST PARAGRAPH (above the fold — most critical):
{{PROJECT_NAME}} helps {{TARGET_AUDIENCE}} {{PRIMARY_BENEFIT}} —
the {{ADJECTIVE}} way to {{DESIRED_OUTCOME}}.

Trusted by {{NUMBER}}+ {{USER_TYPE}} worldwide.

KEY FEATURES:
- {{FEATURE_1}}: {{BENEFIT_1}}
- {{FEATURE_2}}: {{BENEFIT_2}}
- {{FEATURE_3}}: {{BENEFIT_3}}
- {{FEATURE_4}}: {{BENEFIT_4}}
- {{FEATURE_5}}: {{BENEFIT_5}}

HOW IT WORKS:
1. {{STEP_1}}
2. {{STEP_2}}
3. {{STEP_3}}

WHAT USERS SAY:
"{{TESTIMONIAL_1}}" — {{USER_NAME_1}}
"{{TESTIMONIAL_2}}" — {{USER_NAME_2}}

PRICING:
- Free: {{FREE_FEATURES}}
- {{PAID_TIER}}: {{PAID_FEATURES}} ({{PRICE}}/month)

Download {{PROJECT_NAME}} today and start {{DESIRED_OUTCOME}}.

Website: {{WEBSITE_URL}}
Support: {{SUPPORT_EMAIL}}
Privacy Policy: {{PRIVACY_URL}}
Terms of Service: {{TERMS_URL}}
```

---

## Screenshot Strategy

Screenshots are the most influential conversion factor on app store listing pages. Users spend an average of 7 seconds deciding whether to download.

### The First Three Rule

The first 3 screenshots are visible without scrolling on most devices. These must tell a complete, compelling story.

```
Screenshot 1: Hero shot — the core value proposition
  "{{SCREENSHOT_1_HEADLINE}}"
  Show the primary use case or most impressive screen

Screenshot 2: Key differentiator
  "{{SCREENSHOT_2_HEADLINE}}"
  Show what makes {{PROJECT_NAME}} different from alternatives

Screenshot 3: Social proof or breadth
  "{{SCREENSHOT_3_HEADLINE}}"
  Show either user results/stats or range of capabilities

Screenshots 4-8: Supporting features
  Each highlights a specific feature with a benefit-driven caption
  Prioritize by feature popularity and competitive advantage
```

### Screenshot Design Guidelines

| Element | Recommendation |
|---------|---------------|
| **Captions** | Short, benefit-focused text (not feature names). "Track Progress at a Glance" beats "Dashboard Feature" |
| **Text size** | Large enough to read in search results thumbnails, not just on listing page |
| **Device frames** | Optional — trending toward frameless designs with more screen real estate |
| **Background** | Bold, brand-consistent colors that stand out in search results |
| **Consistency** | Uniform style, colors, and typography across all screenshots |
| **App data** | Show realistic data (never empty states) |
| **Localization** | Translate both captions AND in-app text for each locale |

### Screenshot Sizes

```
iOS:
  iPhone 6.7" (required): 1290 x 2796 px
  iPhone 6.5": 1284 x 2778 px
  iPad 12.9": 2048 x 2732 px
  Maximum: 10 screenshots per device size

Google Play:
  Phone: 1080 x 1920 px (minimum)
  Tablet 7": 1200 x 1920 px
  Tablet 10": 1600 x 2560 px
  Maximum: 8 screenshots

Recommended for both: 6-8 screenshots
```

---

## App Preview Videos

### iOS App Previews

- Up to 3 videos per locale (30 seconds maximum each)
- Auto-plays on WiFi in search results (muted)
- First frame is critical — replaces the first screenshot when video is present
- Must show actual app footage (no live action allowed by Apple)
- Record in-app at device resolution
- Design for silent viewing with text overlays

### Google Play Promo Videos

- YouTube video linked from listing
- No length limit (recommended: 30-120 seconds)
- Can include live action, motion graphics, testimonials
- Does not auto-play in search results
- Appears as the first visual element on listing page

### Video Content Plan for {{PROJECT_NAME}}

```
Video 1 (primary — required):
  Duration: 15-30 seconds
  Content: Core user flow showing primary value proposition
  First 3 seconds: {{VIDEO_HOOK}}
  Last 3 seconds: {{VIDEO_CTA}}
  Text overlays: Benefit statements at each transition

Video 2 (optional — feature deep dive):
  Duration: 15-30 seconds
  Content: Secondary feature or advanced use case

Video 3 (optional — social proof):
  Duration: 15-30 seconds
  Content: User testimonials, results, or awards
```

---

## Icon Optimization

The app icon is the smallest but one of the most visible ASO elements. It appears in search results, top charts, home screens, notifications, and settings.

### Icon Design Principles

- Simple and recognizable at all sizes (29x29 to 1024x1024)
- Avoid text in the icon — illegible at small sizes
- Use 1-2 primary colors from your brand palette
- Stand out from competitors in the same category
- Test at multiple sizes before finalizing
- Avoid photos or overly detailed illustrations
- Create a unique silhouette — identifiable even when blurred

### Icon A/B Testing

```
Test 2-3 icon variations against each other:

Variant A: {{ICON_VARIANT_A_DESCRIPTION}}
Variant B: {{ICON_VARIANT_B_DESCRIPTION}}
Variant C: {{ICON_VARIANT_C_DESCRIPTION}}

Run for: Minimum 7 days
Sample size: Minimum 1,000 impressions per variant
Success metric: Conversion rate (impressions to installs)
Platform: Google Play Experiments or SplitMetrics (iOS)
```

---

## Ratings and Review Management

### Target Benchmarks

| Metric | Minimum | Good | Excellent |
|--------|---------|------|-----------|
| **Average rating** | 4.0 | 4.3+ | 4.6+ |
| **Total reviews** | 100+ | 1,000+ | 10,000+ |
| **Recent reviews (30 days)** | 10+ | 50+ | 200+ |
| **Review sentiment** | 60% positive | 75% positive | 85%+ positive |

### When to Prompt for Reviews

```
PROMPT after these positive moments:
- User completes a core action successfully
- User reaches a milestone (7-day streak, 10th session, etc.)
- User shares content or invites a teammate
- App has been used for 3+ sessions over 7+ days

NEVER prompt:
- On first launch
- During onboarding
- After an error, crash, or loading delay
- During a time-sensitive or critical flow
- More than 3 times total per user (ever)
- Immediately after an app update
```

### In-App Review APIs

```
iOS: SKStoreReviewController.requestReview()
  - System manages the prompt UI and frequency
  - Limited to 3 displays per 365-day period per user
  - You call it — Apple decides whether to actually show it

Android: ReviewManager (In-App Review API)
  - System manages the prompt UI
  - Google controls frequency and display logic
  - Call launchReviewFlow() — Google decides whether to show
```

---

## Localization Strategy

### Priority Markets by Revenue Potential

```
Tier 1 (highest priority — localize fully):
  English (US, UK, AU, CA)
  Japanese
  Korean
  Chinese (Simplified + Traditional)
  German

Tier 2 (strong potential — listing localization):
  French
  Spanish (Spain + Latin America)
  Portuguese (Brazil)
  Italian
  Russian

Tier 3 (opportunistic — keywords and title only):
  Dutch, Swedish, Norwegian, Danish
  Thai, Vietnamese, Indonesian
  Turkish, Arabic, Hindi
```

### What to Localize

| Element | Ranking Impact | Conversion Impact | Priority |
|---------|---------------|-------------------|----------|
| **Keywords (title, subtitle, keyword field)** | Very high | Medium | Must do |
| **Screenshot captions** | None | High | Must do |
| **Long description** | High (Google Play) | Medium | Should do |
| **In-app screenshot UI text** | None | High | Nice to have |
| **App preview video** | None | High | Top 3 markets only |

### Localization Best Practices

- Hire native speakers — direct translation misses how people actually search
- Research local keywords independently for each market
- Localize screenshots with local currencies, date formats, and examples
- Consider cultural differences in color associations and visual design
- Manage localized listings separately — do not auto-translate and forget

---

## A/B Testing

### Google Play Experiments (Store Listing Experiments)

Google Play offers native A/B testing for listing elements at no cost.

```
Testable elements:
- App icon
- Feature graphic
- Screenshots (order and content)
- Short description
- Long description

Setup process:
1. Google Play Console > Store presence > Store listing experiments
2. Choose element to test
3. Upload variant(s)
4. Set traffic split (50/50 recommended for fastest results)
5. Run for minimum 7 days
6. Apply winner when 95% statistical confidence is reached
```

### Apple Product Page Optimization (PPO)

Apple offers A/B testing through product page optimization.

```
Testable elements:
- App icon
- Screenshots
- App preview videos

Limitations:
- Maximum 3 treatments (variants) per test
- Traffic split is managed automatically by Apple
- Minimum 90% confidence recommended before applying
- Each treatment requires App Review approval

Setup process:
1. App Store Connect > Product Page Optimization
2. Create a test
3. Add up to 3 treatments
4. Submit for review
5. Monitor results in App Analytics
6. Apply winner
```

### Testing Calendar for {{PROJECT_NAME}}

```
Month 1: Screenshot order and content test
  Hypothesis: {{SCREENSHOT_HYPOTHESIS}}
  Variants: {{SCREENSHOT_VARIANTS}}
  Metric: Conversion rate (page views to installs)

Month 2: Icon test
  Hypothesis: {{ICON_HYPOTHESIS}}
  Variants: {{ICON_VARIANTS}}
  Metric: Tap-through rate (impressions to page views)

Month 3: Description test (Google Play only)
  Hypothesis: {{DESCRIPTION_HYPOTHESIS}}
  Variants: {{DESCRIPTION_VARIANTS}}
  Metric: Conversion rate

Month 4: Revisit lowest-performing element from previous tests
```

---

## Category Selection

### Choosing the Right Category

```
Primary category criteria:
1. Where does {{TARGET_AUDIENCE}} actually browse?
2. Where are top chart positions realistically achievable?
3. Which category most accurately describes the core function?
4. Where are your direct competitors listed?

Secondary category (iOS only):
- Choose a complementary category to expand browsing visibility
- Must genuinely apply to your app — Apple reviews this
- Do NOT simply pick the least competitive option

Common mistake: Choosing a less competitive category for easier ranking.
This backfires if your target audience does not browse that category.
```

---

## Seasonal Updates

### Seasonal ASO Calendar

```
January:     New Year resolutions, fresh starts, productivity goals
February:    Valentine's Day themes (if applicable)
March-April: Spring refresh, tax season tools, back-to-school (southern hemisphere)
May-June:    Summer planning, travel, graduation
July-August: Summer activities, back-to-school prep (northern hemisphere)
September:   New iPhone launch, iOS major update, back-to-school
October:     Halloween (if applicable), Q4 planning
November:    Black Friday deals, holiday shopping, year-end wrap-up
December:    Holiday season, gift guides, new device activation surge

For each relevant season:
- Update screenshots with seasonal context (if appropriate for brand)
- Adjust description to highlight seasonal use cases
- Target seasonal keywords temporarily
- Update feature graphic (Google Play)
- Prepare for post-holiday new device activation surge (late December)
```

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
### Developer Tool Seasonal Considerations

- Major conference seasons (WWDC June, Google I/O May, re:Invent December) drive searches for related tooling
- Year-end budget cycles mean purchasing decisions concentrate in Q4
- Hackathon seasons (spring and fall) drive trial signups
- Open source contribution months (Hacktoberfest in October) increase community visibility
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### SaaS Seasonal Considerations

- Q1 new budget allocations drive tool evaluation and adoption
- End-of-quarter urgency creates conversion windows
- Summer can see dips in B2B engagement — adjust expectations
- September "back to work" surge as teams re-engage after summer
<!-- ENDIF -->

---

## ASO Monitoring and Iteration

### Weekly ASO Review

```
{{PROJECT_NAME}} — Weekly ASO Tracker

Keyword Rankings:
  {{KEYWORD_1}}: Rank ___ (Change: ___)
  {{KEYWORD_2}}: Rank ___ (Change: ___)
  {{KEYWORD_3}}: Rank ___ (Change: ___)
  {{KEYWORD_4}}: Rank ___ (Change: ___)
  {{KEYWORD_5}}: Rank ___ (Change: ___)

Conversion Funnel:
  Impressions:      ___ (Change: ___%)
  Product page views: ___ (Change: ___%)
  Downloads:        ___ (Change: ___%)
  Conversion rate:  ___% (Change: ___pp)

Ratings:
  Current average:               ___
  New reviews this week:         ___
  Average rating of new reviews: ___

Competitor Notes:
  [Document any competitor listing changes or ranking shifts]
```

### Monthly ASO Audit Checklist

```
- [ ] Review keyword rankings and adjust keyword field/description
- [ ] Analyze full conversion funnel (impressions > views > downloads)
- [ ] Read all new reviews — identify recurring themes and feature requests
- [ ] Check top 5 competitor listings for changes
- [ ] Review A/B test results and launch new test if none running
- [ ] Update screenshots if app UI has changed
- [ ] Refresh description for seasonal relevance
- [ ] Verify all localized listings are current and accurate
- [ ] Confirm all metadata is within character limits
- [ ] Cross-reference Apple Search Ads / Google UAC data for keyword insights
- [ ] Update this tracker document with findings
```

---

*ASO is not a one-time setup. The most successful apps treat ASO as a continuous optimization process, testing and refining every element monthly. Organic growth compounds — small improvements in conversion rate today mean thousands more downloads over the next year.*
