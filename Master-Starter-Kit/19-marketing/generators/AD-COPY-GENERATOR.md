# Ad Copy Generator

**Purpose:** Generate complete ad copy variations for paid advertising across Google Search,
Facebook/Instagram, LinkedIn, and Twitter/X. Produces platform-compliant copy organized by
funnel stage (awareness, consideration, conversion), with audience targeting suggestions,
keyword intent mapping, and A/B test variants. All copy respects character limits and
platform-specific best practices.

**Output:** `marketing/paid-advertising/ad-copy-library.md`

---

## When to Run

Run this generator after completing:
1. Marketing Intake (Step 19) -- MARKETING_CONFIG confirms paid ads are in scope
2. Channel Decision Tree (Step 20) -- paid channels are Tier 1 or Tier 2
3. Brand & Messaging (Step 21) -- messaging framework and value propositions are finalized
4. Landing Page Copy Generator -- destination pages exist for ad clicks

**Budget gate:** Only run if `{{MARKETING_BUDGET}}` is "small" or higher. Bootstrap ($0)
budgets should skip paid advertising entirely.

---

## Inputs Required

| Input | Location | What it provides |
|-------|----------|-----------------|
| MARKETING_CONFIG | Orchestrator STATE BLOCK | Product type, UVP, audience, budget, platforms |
| Messaging Framework | `marketing/brand-messaging/messaging-framework.md` | Key messages, proof points, objection handling |
| Value Proposition Canvas | `marketing/brand-messaging/value-proposition-canvas.md` | Pains, gains, jobs |
| Competitor Marketing Audit | `marketing/market-research/competitor-marketing-audit.md` | Competitor positioning and ad strategies |
| Landing Page Copy | `marketing/website-and-landing-pages/landing-page-copy.md` | Destination page messaging for consistency |
| User Personas | `dev_docs/user-personas.md` | Target audience demographics and behaviors |
| Keyword Research | SEO research or CUSTOMER_LANGUAGE from MARKETING_CONFIG | Search terms and intent signals |
| Paid Ads Strategy | `marketing/paid-advertising/paid-ads-strategy.md` | Budget allocation, platform priorities |

---

## Generation Algorithm

1. **Read MARKETING_CONFIG.** Extract:
   - `{{PRODUCT_TYPE}}` -- determines which ad platforms and formats to prioritize
   - `{{UNIQUE_VALUE_PROP}}` -- core message for all ad copy
   - `{{CUSTOMER_LANGUAGE}}` -- exact search terms and pain phrases
   - `{{MARKETING_BUDGET}}` -- determines ad spend allocation
   - `{{PRIMARY_PLATFORMS}}` -- confirms which platforms to generate ads for
   - `{{BUYER_JOURNEY_LENGTH}}` -- determines funnel depth and retargeting strategy
   - `{{PRICING_MODEL}}` -- determines CTA type (free trial, sign up, download, etc.)

2. **Read the messaging framework.** Extract:
   - Primary and secondary messages for headline hierarchy
   - Proof points for description copy (numbers, awards, reviews)
   - Objection handling points for consideration-stage ads

3. **Read competitor marketing audit.** Note:
   - Competitor ad messaging (to differentiate from, NOT copy)
   - Competitor keyword targets (opportunities and gaps)
   - Competitor weaknesses to exploit in positioning

4. **Map keyword intent** to funnel stages:
   - **Awareness:** Problem-aware keywords ("how to {solve problem}")
   - **Consideration:** Solution-aware keywords ("{product category} comparison", "best {tool} for {use case}")
   - **Conversion:** Brand-aware keywords ("{{PROJECT_NAME}} pricing", "{{PROJECT_NAME}} vs {competitor}")

5. **Generate ad copy per platform** following character limits and format specs below.

6. **Organize by funnel stage** so the advertiser knows which ads to run in which campaign.

7. **Validate** all copy against character limits and quality gates.

---

## Output Format

Write to `marketing/paid-advertising/ad-copy-library.md`:

```markdown
# Ad Copy Library -- {{PROJECT_NAME}}

> **Product Type:** {{PRODUCT_TYPE}}
> **Budget Tier:** {{MARKETING_BUDGET}}
> **Active Ad Platforms:** {from channel priority matrix}
> **Generated:** {{DATE}}

---

## Google Search Ads

### Character Limits Reference
- Headline: 30 characters max (15 headlines allowed, 3 shown at a time)
- Description: 90 characters max (4 descriptions allowed, 2 shown at a time)
- Display URL path: 15 characters per path field (2 fields)

---

### Ad Group 1: {Core Product Keywords}

**Target keywords:** {keyword 1}, {keyword 2}, {keyword 3}
**Keyword intent:** Consideration (solution-aware)
**Landing page:** {URL -- main landing page or features page}

| # | Headline (30 char max) | Chars |
|---|----------------------|-------|
| H1 | {Primary benefit headline} | {N}/30 |
| H2 | {{PROJECT_NAME}} - {Category} | {N}/30 |
| H3 | {Social proof: "Trusted by X+"} | {N}/30 |

| # | Description (90 char max) | Chars |
|---|--------------------------|-------|
| D1 | {Expanded value proposition with CTA. Include a differentiator and action verb.} | {N}/90 |
| D2 | {Secondary benefit with proof point. Address a common objection.} | {N}/90 |

---

### Ad Group 2: {Problem-Aware Keywords}

**Target keywords:** {how to {solve problem}}, {problem symptom search terms}
**Keyword intent:** Awareness (problem-aware)
**Landing page:** {URL -- blog post or problem-focused landing page}

| # | Headline (30 char max) | Chars |
|---|----------------------|-------|
| H1 | {Problem acknowledgment} | {N}/30 |
| H2 | {Solution teaser} | {N}/30 |
| H3 | {Outcome promise} | {N}/30 |

| # | Description (90 char max) | Chars |
|---|--------------------------|-------|
| D1 | {Describe the problem and hint at the solution. Empathy-led copy.} | {N}/90 |
| D2 | {Specific outcome with proof. "Join X+ {users} who {outcome}."} | {N}/90 |

---

### Ad Group 3: {Competitor Keywords}

**Target keywords:** {competitor name} alternative, {competitor name} vs, switch from {competitor}
**Keyword intent:** Consideration (comparing alternatives)
**Landing page:** {URL -- comparison page: "{{PROJECT_NAME}} vs {Competitor}"}

| # | Headline (30 char max) | Chars |
|---|----------------------|-------|
| H1 | {Better alternative framing} | {N}/30 |
| H2 | {"Switch in {time}" promise} | {N}/30 |
| H3 | {Key differentiator vs competitor} | {N}/30 |

| # | Description (90 char max) | Chars |
|---|--------------------------|-------|
| D1 | {Why users switch: specific advantage over the competitor. No trash-talking.} | {N}/90 |
| D2 | {Migration ease + incentive. "Free migration. No credit card required."} | {N}/90 |

---

### Ad Groups 4-10: {Additional Keyword Themes}

{Generate 7 more ad groups following the same format. Suggested themes:}

| Ad Group | Keyword Theme | Intent | Example Keywords |
|----------|--------------|--------|-----------------|
| 4 | {Feature-specific} | Consideration | {feature name}, {feature benefit} |
| 5 | {Industry/niche} | Consideration | {industry} {product category} |
| 6 | {Use case specific} | Consideration | {use case} tool, {use case} software |
| 7 | {Pricing/cost} | Conversion | {category} pricing, affordable {category} |
| 8 | {Free/trial} | Conversion | free {category}, {category} free trial |
| 9 | {Brand terms} | Conversion | {{PROJECT_NAME}}, {{PROJECT_NAME}} login |
| 10 | {Long-tail questions} | Awareness | how to {task}, what is best {category} |

{Each ad group follows the same format: keywords, intent, landing page, 3 headlines, 2 descriptions.}

---

### Sitelink Extensions (4 sitelinks)

| Sitelink | Link Text (25 char) | Description 1 (35 char) | Description 2 (35 char) | URL |
|----------|-------------------|------------------------|------------------------|-----|
| 1 | {Features page} | {Key feature highlight} | {Benefit statement} | /features |
| 2 | {Pricing page} | {Pricing summary} | {Trial/free CTA} | /pricing |
| 3 | {About/Why Us} | {Credibility point} | {Differentiator} | /about |
| 4 | {Resources/Blog} | {Content value prop} | {Helpful content} | /blog |

### Callout Extensions (4 callouts, 25 char each)

| # | Callout | Chars |
|---|---------|-------|
| 1 | {Trust signal: "Free Trial" or "No Credit Card"} | {N}/25 |
| 2 | {Benefit: "Setup in 5 Minutes"} | {N}/25 |
| 3 | {Social proof: "Trusted by X+ Teams"} | {N}/25 |
| 4 | {Differentiator: "{Key feature}"} | {N}/25 |

### Structured Snippet Extensions

**Category:** {Types, Features, or Brands}
**Values:** {value 1}, {value 2}, {value 3}, {value 4}

---

## Facebook / Instagram Ads

### Character Limits Reference
- Primary text: 125 characters visible (up to 600 before "see more")
- Headline: 40 characters (27 visible on mobile)
- Link description: 30 characters visible
- Video: 15-60 seconds recommended

---

### Primary Text Variants (5 variants)

**Short Copy (under 125 chars -- no "see more" truncation):**

**Variant F-S1:**
> {Problem-solution in one sentence. Direct, punchy. Leads with pain point.
> "Tired of {problem}? {{PROJECT_NAME}} {solves it} in {timeframe}."}

**Variant F-S2:**
> {Benefit-led. "Now you can {outcome} without {obstacle}. Try {{PROJECT_NAME}} free."}

**Medium Copy (125-300 chars -- "see more" truncation):**

**Variant F-M1:**
> {Hook line (visible before truncation)}
>
> {Expanded problem description. Specific and relatable.}
>
> {Solution introduction. What {{PROJECT_NAME}} does differently.}
>
> {CTA with friction reducer.}

**Variant F-M2:**
> {Social proof hook: "{User/Company} {achieved outcome} with {{PROJECT_NAME}}."}
>
> {Their situation before. Their result after.}
>
> {How they did it (briefly).}
>
> {CTA: "See if it works for you too."}

**Long Copy (300-600 chars -- story format):**

**Variant F-L1:**
> {Story-format ad. Open with a relatable scenario. Build tension (the problem).
> Introduce the turning point (finding {{PROJECT_NAME}}). End with the result.
> CTA at the end.}

---

### Headline Variants (5 variants, 40 char max)

| # | Headline | Chars | Funnel Stage |
|---|---------|-------|-------------|
| H1 | {Benefit headline} | {N}/40 | Awareness |
| H2 | {Problem headline} | {N}/40 | Awareness |
| H3 | {Social proof headline} | {N}/40 | Consideration |
| H4 | {CTA headline: "Start Free Trial"} | {N}/40 | Conversion |
| H5 | {Urgency headline: "{Offer} Ends {Date}"} | {N}/40 | Conversion |

### Link Descriptions (3 variants, 30 char max)

| # | Description | Chars |
|---|------------|-------|
| L1 | {Friction reducer: "No Credit Card"} | {N}/30 |
| L2 | {Time promise: "Setup in 2 min"} | {N}/30 |
| L3 | {Social proof: "Join X+ users"} | {N}/30 |

### Video Ad Script Outline (30 seconds)

```
[0-3s] HOOK: {Visual + text overlay that stops the scroll. Must grab attention
       without audio (85% of Facebook video is watched muted). Show the PROBLEM
       visually or state a bold claim.}

[3-10s] PROBLEM: {Agitate the pain point. Show the "before" state. Use text
        overlays for key points since audio may be off.}

[10-20s] SOLUTION: {Show {{PROJECT_NAME}} in action. Screen recording or demo
         footage. Highlight the "aha moment" -- the key feature that solves the
         problem. Text overlay: key benefit statement.}

[20-27s] PROOF: {Social proof overlay: user count, rating, testimonial quote.
         Show the "after" state -- the outcome achieved.}

[27-30s] CTA: {Clear call to action with button. "Start your free trial" or
         "Download now." Display URL. End card with logo.}
```

**Audio script (for sound-on viewers):**
> {Voice-over narration matching the visual timeline above. Conversational tone,
> not corporate. Max 75 words for 30 seconds.}

---

## LinkedIn Ads

### Character Limits Reference
- Intro text: 150 characters visible (up to 600 before "see more")
- Headline: 70 characters (recommended under 50)
- Description: 100 characters

---

### Ad Copy Variants (5 variants -- B2B tone)

**LinkedIn Ad L1 (Problem-Aware):**

**Intro text:**
> {Address the reader by role. "{Job titles} -- are you still {inefficient process}?
> {Expanded problem description in professional tone}.
> {Solution hint}: {{PROJECT_NAME}} {key outcome}.
> {CTA with professional framing}."}

**Headline:** {Outcome + audience. "{Outcome} for {role/industry}"}
**Description:** {Proof point. "{N}+ companies use {{PROJECT_NAME}} to {outcome}."}

**LinkedIn Ad L2 (Solution-Aware):**
{Focus on features and capabilities. Technical enough for B2B buyers but
not overwhelming. Include a specific ROI or efficiency metric.}

**LinkedIn Ad L3 (Case Study):**
{Lead with a customer result. "How {Company} {achieved X% improvement} with
{{PROJECT_NAME}}." Link to full case study.}

**LinkedIn Ad L4 (Thought Leadership):**
{Share an insight, link to a valuable resource (guide, report, webinar).
Soft sell -- establish expertise first, product mention second.}

**LinkedIn Ad L5 (Direct Offer):**
{Clear, direct offer for bottom-of-funnel. "Start your free trial" or
"Book a demo with our team." Include social proof and friction reducer.}

---

### Headline Variants (targeting job titles/roles)

| # | Headline | Target Role | Chars |
|---|---------|-------------|-------|
| H1 | "{Role}: {Outcome} with {{PROJECT_NAME}}" | {Primary role} | {N}/70 |
| H2 | "How {Industry} Leaders {Outcome}" | {Industry decision-makers} | {N}/70 |
| H3 | "Stop {Pain}. Start {Outcome}." | {Broad professional} | {N}/70 |
| H4 | "{N}% of {Role}s Agree: {Insight}" | {Specific role} | {N}/70 |
| H5 | "The {Category} Built for {Role}s" | {Primary buyer} | {N}/70 |

---

### Sponsored InMail Template

**Subject:** {50 char max -- personalized, not salesy}
**Sender:** {{FOUNDER_NAME}}, {Title} at {{PROJECT_NAME}}

**Body:**
> Hi {{FIRST_NAME}},
>
> {1 sentence: personalized connection. Reference their role, company, or industry.
> "As a {role} at {company type}, you probably deal with {problem} regularly."}
>
> {2-3 sentences: introduce the solution without hard-selling. Focus on outcomes
> and proof points. "We built {{PROJECT_NAME}} to help {audience} {achieve outcome}.
> {Proof point: "X companies now use it to {result}."}}
>
> {1 sentence: specific, low-commitment CTA. "Would a 15-minute demo be worth
> your time?" or "I put together a {resource} that covers {topic} -- want me to
> send it over?"}
>
> Best,
> {{FOUNDER_NAME}}
> {Title}, {{PROJECT_NAME}}

**CTA Button:** "Learn More" or "Request Demo"

---

## Twitter/X Ads

### Promoted Tweet Variants (5 variants)

**Twitter Ad T1 (Benefit-Led):**
> {Tweet-native format. Must read like an organic tweet, not an ad. Lead with
> the benefit, include a brief proof point, end with a natural CTA.
> Include a link. 280 chars max but 200 is optimal for engagement.}

**Twitter Ad T2 (Problem-Led):**
> {Start with a question or pain point the audience relates to. "Still {doing
> the frustrating thing}?" Then pivot to the solution. Link to landing page.}

**Twitter Ad T3 (Social Proof):**
> {Lead with a number or testimonial. "X,000 {user type} switched to
> {{PROJECT_NAME}} this month. Here's why:" -- brief reason + link.}

**Twitter Ad T4 (Curiosity):**
> {Create an information gap. "We analyzed {N} {data points} and found that
> {surprising insight}. Here's what it means for your {workflow}:" -- link.}

**Twitter Ad T5 (Build-in-Public):**
> {Authentic founder voice. "We just hit {milestone} with {{PROJECT_NAME}}.
> {Brief story of the journey}. If you're {target audience}, {soft CTA}."}

---

## Audience Targeting Suggestions

### Google Search
| Targeting Layer | Details |
|----------------|---------|
| Keywords | {10 core keywords from keyword intent mapping above} |
| Match types | Exact match for brand + competitor terms; Phrase match for problem terms |
| Negative keywords | {5-10 irrelevant terms to exclude: "free", "jobs", "salary", etc.} |
| Location | {Geographic targeting if applicable} |
| Device | {Desktop/mobile preference based on product type} |
| Schedule | {Day/time bidding adjustments: higher bids during business hours for B2B} |

### Facebook / Instagram
| Targeting Layer | Details |
|----------------|---------|
| Custom Audiences | Website visitors (retargeting), email list upload, app users |
| Lookalike Audiences | 1% lookalike of converters (once you have 100+ conversions) |
| Interest targeting | {5-8 interests: competitor brands, industry publications, relevant tools} |
| Job title targeting | {3-5 job titles if B2B} |
| Age range | {Based on persona demographics} |
| Exclusions | Existing customers, employees, irrelevant demographics |

### LinkedIn
| Targeting Layer | Details |
|----------------|---------|
| Job titles | {5-10 specific titles from personas} |
| Company size | {Employee count ranges} |
| Industry | {3-5 industries} |
| Seniority | {Entry, Senior, Manager, Director, VP, C-Suite} |
| Skills | {5-10 relevant LinkedIn skills} |
| Groups | {Relevant LinkedIn groups} |

### Twitter/X
| Targeting Layer | Details |
|----------------|---------|
| Follower lookalikes | Followers of {competitor accounts, industry leaders, relevant publications} |
| Interest categories | {Relevant interest categories} |
| Keywords | {Conversation keywords people tweet about} |
| Events | {Relevant industry events for time-bound targeting} |

---

## Funnel Stage Organization

### Awareness Stage Ads (Top of Funnel)
**Goal:** Introduce the problem and the brand. No hard sell.
**Platforms:** Facebook/Instagram (broad reach), Twitter/X, LinkedIn (thought leadership)
**Budget allocation:** 30-40% of ad spend
**Ads to use:** F-S1, F-M1, F-L1, L4, T2, T4, Ad Groups 2 and 10

### Consideration Stage Ads (Middle of Funnel)
**Goal:** Educate on the solution, differentiate from competitors.
**Platforms:** Google Search (high intent), LinkedIn, Facebook retargeting
**Budget allocation:** 30-40% of ad spend
**Ads to use:** F-M2, L1, L2, L3, T1, T3, Ad Groups 1, 3, 4, 5, 6

### Conversion Stage Ads (Bottom of Funnel)
**Goal:** Drive sign-up, trial start, or purchase. Clear CTA.
**Platforms:** Google Search (brand + pricing keywords), Facebook/LinkedIn retargeting
**Budget allocation:** 20-30% of ad spend
**Ads to use:** F-S2, L5, T5, Ad Groups 7, 8, 9
```

---

## Conditional Adjustments by Product Type

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### SaaS Ad Copy Adjustments
- CTAs should focus on "Start Free Trial" or "Get Started Free" (low commitment)
- Include trial length in ad copy ("14-day free trial")
- Google Ads: heavy investment in competitor comparison keywords
- LinkedIn Ads: prioritize if B2B; skip if B2C SaaS
- Retargeting: show pricing/testimonials to website visitors who did not convert
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
### Mobile App Ad Copy Adjustments
- Facebook/Instagram: use App Install campaign objective
- CTAs: "Download Free" or "Get the App"
- Include app store rating in ad copy if 4.0+
- Video ads: show the app in use on a real device
- Google: use Universal App Campaigns (UAC) instead of standard Search
- Skip LinkedIn unless B2B app
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
### Dev Tool Ad Copy Adjustments
- **Caution:** Developers use ad blockers heavily. Paid ads have lower reach for this audience.
- If running ads: Google Search only (developers DO search for tools)
- Skip Facebook, Instagram, and LinkedIn Ads (very low developer engagement with ads)
- Twitter Ads: only promoted tweets that read like organic content
- CTAs: "Read the Docs" or "Star on GitHub" (lower commitment than "Sign Up")
- Ad copy must be technically accurate -- developers will fact-check
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
### Marketplace Ad Copy Adjustments
- Create separate ad campaigns for supply side and demand side
- Facebook: best platform for consumer marketplaces
- Google: target category + location keywords for local marketplaces
- Ad copy should emphasize network size ("Join X providers" or "Browse X listings")
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "client_site" -->
### Client/Agency Site Ad Copy Adjustments
- Google Search: focus on local + service keywords ("{service} near me", "{service} {city}")
- CTAs: "Get a Free Quote" or "Schedule a Consultation"
- Include portfolio/case study mentions in ad copy
- Facebook: retargeting only (do not run broad awareness for service businesses)
- LinkedIn: promote thought leadership content, not direct service ads
<!-- ENDIF -->

---

## Quality Gates

Before finalizing ad copy, verify:

- [ ] ALL character limits are strictly respected (count every headline, description, CTA)
- [ ] No ad copy makes claims that cannot be substantiated (avoid "best", "#1", "guaranteed")
- [ ] CTAs are specific action verbs, not generic ("Start Free Trial" not "Learn More" for conversion ads)
- [ ] Competitor names are NOT used in ad headlines (policy violation on most platforms)
- [ ] Competitor names CAN be used in Google keyword targeting (this is allowed)
- [ ] Each ad has a clear funnel stage assignment
- [ ] Landing page messaging matches ad messaging (message match = higher quality score)
- [ ] No emoji overuse in ad copy (max 1 emoji per ad, and only if brand voice permits)
- [ ] Facebook ad copy follows the 20% text rule for images (if using text on images)
- [ ] LinkedIn InMail template does not read like spam (personalized, short, specific CTA)
- [ ] Budget allocation across funnel stages is appropriate for buyer journey length
- [ ] Video script can be produced with available resources (screen recording if no video team)

---

## Validation Checklist

After generation, verify:
- [ ] All `{{PLACEHOLDER}}` variables are resolved
- [ ] Google Ads: 10 ad groups x 3 headlines + 2 descriptions = 50 pieces of copy
- [ ] Facebook/Instagram: 5 primary text + 5 headlines + 3 descriptions + 1 video script
- [ ] LinkedIn: 5 ad variants + 5 headlines + 1 InMail template
- [ ] Twitter/X: 5 promoted tweet variants
- [ ] Sitelink, callout, and snippet extensions are complete
- [ ] Audience targeting suggestions cover all active platforms
- [ ] Funnel stage organization maps each ad to the correct stage
- [ ] Conditional sections match the actual product type
- [ ] Character counts are accurate for every headline and description
- [ ] A developer or marketer can set up campaigns using only this document
