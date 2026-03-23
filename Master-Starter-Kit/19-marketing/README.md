# Phase 19: Marketing System

> **You built something great. Now make sure people find it.**
> This marketing system turns developers who have never written a marketing plan into developers with a complete go-to-market strategy, channel-specific assets, and a month-by-month execution roadmap.

---

## Why This Exists

Here is the uncomfortable truth about software products: the ones that win are not always the best-built. They are the best-marketed. Every year, thousands of technically excellent products die in obscurity because their creators assumed "if you build it, they will come." They do not come. You have to go get them.

This marketing system exists because:

1. **Developers are builders, not marketers.** You know how to architect a database, but do you know how to write a landing page headline that converts at 8%? Do you know which subreddits will embrace your dev tool versus which ones will ban you for self-promotion? This system does.

2. **Marketing is not optional — it is a product feature.** A product nobody uses is not a product. It is a portfolio piece. Marketing is how you close the gap between "deployed" and "adopted."

3. **Generic marketing advice is useless for software products.** A SaaS product, a mobile app, a developer tool, a marketplace, and a client website all require fundamentally different marketing strategies. This system branches by product type and gives you specific, actionable guidance for YOUR product.

4. **AI can generate marketing assets at scale.** Claude can write your landing page copy, generate email sequences, draft social posts, create SEO content outlines, and build your analytics tracking plan — if it has the right templates and context. That is what this system provides.

---

## How It Integrates with the Orchestrator

The marketing system is activated during **Orchestrator Steps 19-28**, which run after all build planning is complete (Steps 0-16) and user documentation is set up (Steps 15.5-18). By the time marketing starts, Claude has deep context about:

- What the product does (from Discovery, Step 1)
- Who the users are (from Tribunal, Step 3)
- What features exist (from Service Specs, Step 5)
- How the product looks (from Design System, Step 13)
- What the product is called and how it is described (from Foundation Docs, Step 4)

This context feeds directly into marketing asset generation. Claude does not write generic marketing copy — it writes copy informed by 200+ planning documents it already generated.

### Orchestrator Marketing Steps

| Step | Name | What Happens |
|------|------|-------------|
| **19** | Marketing Discovery & Research | Collect marketing-specific answers, run competitor marketing analysis, generate market research docs |
| **20** | Brand, Messaging & Pricing | Generate brand voice guide, value propositions, pricing strategy |
| **21** | Marketing Strategy & Channel Plan | Run channel decision tree, allocate budget, set up analytics/CRM, generate legal compliance docs |
| **22** | Website, Landing Pages & Conversion | Generate landing page copy, pricing page, conversion optimization, SEO foundation |
| **23** | Content, Social Media & Video Strategy | Content calendar, social media strategy, video marketing plan, webinars/podcasts |
| **24** | Email Marketing System | Welcome sequences, newsletter strategy, sales sequences, deliverability setup |
| **25** | Launch Strategy & Directory Listings | Pre-launch playbook, launch day checklist, directory listings, app store marketing |
| **26** | Growth, Outreach & Referral Systems | Cold outreach, influencer marketing, paid advertising, referral programs, AI marketing |
| **27** | Onboarding & Retention | Activation flows, churn prevention, NPS/feedback, upsell strategy |
| **28** | Marketing Dashboard & Handoff | Reporting templates, A/B testing, sales pipeline, marketing handoff document |

Each step reads templates from the corresponding sub-directory, resolves `{{PLACEHOLDER}}` variables using values from `MARKETING_CONFIG` (collected in Step 19), and generates project-specific marketing assets.

### State Block Extension

When marketing steps begin, the orchestrator STATE BLOCK is extended with:

```
MARKETING_STEP: 19
MARKETING_COMPLETED: []
MARKETING_CONFIG: {
  PRODUCT_TYPE: "",
  TARGET_AUDIENCE: "",
  MARKETING_BUDGET: "",
  LAUNCH_DATE: "",
  PRIMARY_CHANNELS: [],
  COMPETITORS: [],
  UNIQUE_VALUE_PROP: "",
  BRAND_VOICE: "",
  CONTENT_TOPICS: []
}
```

---

## The 22 Sub-Directories

Each sub-directory contains templates, guides, and generator prompts for a specific marketing domain. Here is what each one does and when it is used:

### Strategy & Foundation

| Directory | Purpose | Used In Step |
|-----------|---------|-------------|
| **market-research/** | Competitor analysis templates, market sizing frameworks, SWOT analysis, positioning maps | 19-20 |
| **brand-messaging/** | Brand voice guide, value proposition canvas, tagline generator, messaging hierarchy | 21 |
| **pricing-monetization/** | Pricing page templates, tier comparison frameworks, freemium conversion strategies | 21 |
| **launch-strategy/** | Pre-launch timeline, launch day checklist, beta program framework, Product Hunt playbook | 26 |

### Channels — Owned

| Directory | Purpose | Used In Step |
|-----------|---------|-------------|
| **website-and-landing-pages/** | Landing page copy templates, hero section formulas, feature section layouts, social proof blocks | 22 |
| **seo-and-content/** | Content calendar, blog strategy, content repurposing. **Note:** SEO-specific content (strategy, technical checklist) has moved to the dedicated `36-seo/` section (43 files). Content marketing files remain here. | 22-23 |
| **email-marketing/** | Welcome sequence templates, onboarding drips, newsletter frameworks, re-engagement flows, cold outreach templates | 25 |
| **social-media/** | Platform-specific playbooks (Twitter/X, LinkedIn, Reddit, TikTok), content templates, engagement strategies | 24 |
| **video-marketing/** | YouTube strategy, demo video scripts, product walkthrough templates, short-form video (Reels/TikTok) frameworks | 24 |
| **webinars-podcasts-events/** | Webinar planning template, podcast guest pitch, conference talk abstracts, event marketing playbook | 27 |

### Channels — Earned & Paid

| Directory | Purpose | Used In Step |
|-----------|---------|-------------|
| **paid-advertising/** | Google Ads templates, Meta Ads frameworks, LinkedIn Ads playbook, retargeting strategies, budget allocation | 27 |
| **outreach-and-partnerships/** | Influencer outreach scripts, partnership proposal templates, cross-promotion frameworks, affiliate program setup | 27 |
| **directory-and-listings/** | Product Hunt checklist, G2/Capterra listing guide, app store optimization, Hacker News strategy | 26 |
| **marketplace-aso/** | App Store Optimization templates, Play Store listing guide, keyword optimization, screenshot strategy | 26 |

### Growth & Retention

| Directory | Purpose | Used In Step |
|-----------|---------|-------------|
| **onboarding-retention/** | User onboarding flow templates, activation metric definitions, churn prevention playbook, NPS survey templates | 25 |
| **referral-viral/** | Referral program framework, viral loop design, word-of-mouth amplification, community-led growth | 26 |
| **analytics-and-tracking/** | GA4 setup guide, event taxonomy template, conversion funnel definitions, KPI dashboard templates | 28 |
| **automation-crm/** | CRM setup guide (HubSpot, Pipedrive), lead scoring templates, sales pipeline stages, follow-up automation | 25, 27 |

### Specialized

| Directory | Purpose | Used In Step |
|-----------|---------|-------------|
| **ai-marketing/** | AI content generation prompts, ChatGPT/Claude marketing workflows, AI image generation for social | 24 |
| **legal-compliance/** | Privacy policy templates, terms of service frameworks, GDPR consent for marketing, CAN-SPAM compliance | 22 |
| **marketing-gotchas/** | Common mistakes by product type, channel-specific pitfalls, timing errors, budget waste patterns | All |
| **generators/** | Meta-prompts that Claude uses to generate marketing assets from templates + project context | 19-28 |

---

## Product-Type Branching

Not all products are marketed the same way. A B2B SaaS tool and a mobile consumer app require fundamentally different strategies. The marketing system uses `{{PRODUCT_TYPE}}` from `MARKETING_CONFIG` to branch content throughout every template.

### Supported Product Types

| Product Type | Key Characteristics | Primary Channels | Secondary Channels |
|-------------|-------------------|-----------------|-------------------|
| **SaaS** (B2B or B2C) | Recurring revenue, free trial/freemium, web-based | SEO, Content Marketing, Email, LinkedIn, Paid Search | Webinars, Partnerships, Directories, YouTube |
| **Mobile App** | App store distribution, install-based, retention-critical | ASO, Social (TikTok/Instagram), Paid Social, Influencer | Content, Email, Referral, PR |
| **Marketplace** | Two-sided (buyers + sellers), network effects, trust-critical | SEO, Content, Community, Email, Referral | Social, Paid, Partnerships, PR |
| **Dev Tool** | Developer audience, technical content, community-driven | Content (technical blog), Twitter/X, GitHub, Reddit, Hacker News | YouTube (tutorials), Conferences, Open Source, Product Hunt |
| **Client/Agency Site** | Portfolio/service site, lead generation, local or niche market | SEO (local), LinkedIn, Email, Google Ads, Referral | Content, Directories, Networking, Case Studies |

### How Branching Works in Templates

Templates use conditional sections that include or exclude content based on product type:

```markdown
<!-- IF {{PRODUCT_TYPE}} == "saas" -->
## SaaS-Specific: Free Trial Optimization
Your free trial is your most powerful marketing asset. Here is how to optimize the trial-to-paid conversion funnel...
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
## Mobile-Specific: App Store Optimization
Your app store listing IS your landing page. 70% of app discovery happens through search...
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
## Dev Tool-Specific: Community-Led Growth
Developers do not respond to traditional marketing. They respond to quality documentation, genuine community engagement, and solving real problems...
<!-- ENDIF -->
```

When Claude resolves templates, it keeps only the sections matching the detected `{{PRODUCT_TYPE}}` and removes the rest (including the comment markers), just like the main orchestrator's template resolution rules.

---

## How to Use the Marketing System

### Automatic (Recommended)

If you ran the full orchestrator (Steps 0-16), marketing is the natural next phase:

```
Tell Claude: "Continue with marketing setup — run Steps 19-28"
```

Claude will:
1. Conduct the marketing intake interview (Step 19)
2. Run the channel decision tree (Step 20)
3. Generate all marketing assets in sequence (Steps 21-28)
4. Output everything into a `marketing/` directory in your project

### Manual (Run Specific Parts)

You can run individual marketing steps using slash commands:

| Command | What It Does |
|---------|-------------|
| `/marketing-intake` | Re-run the marketing intake interview |
| `/marketing-channels` | Re-run channel selection decision tree |
| `/marketing-brand` | Regenerate brand messaging and voice guide |
| `/marketing-landing` | Regenerate landing page copy |
| `/marketing-seo` | Regenerate SEO strategy and content plan |
| `/marketing-social` | Regenerate social media plan |
| `/marketing-email` | Regenerate email sequences |
| `/marketing-launch` | Regenerate launch strategy |
| `/marketing-ads` | Regenerate paid advertising plan |
| `/marketing-analytics` | Regenerate analytics and tracking plan |
| `/marketing-full` | Run ALL marketing steps (19-28) from scratch |

### Updating Marketing Assets Later

As your product evolves, your marketing should too. Run individual commands to regenerate specific assets:

```
Tell Claude: "Our pricing changed from freemium to free trial. Update the landing page copy and email sequences."
```

Claude will re-read the relevant templates, apply the new context, and regenerate only the affected assets.

---

## Philosophy: Strategy + Assets for Every Channel

This marketing system does not just tell you WHAT to do. It gives you the actual assets to do it. For every channel, you get:

### 1. Strategy Document
- Why this channel works for your product type
- Who you reach on this channel
- What content performs best
- How long until you see results
- What "good" looks like (benchmarks)

### 2. Actionable Templates
- Copy templates with `{{PLACEHOLDER}}` variables pre-filled
- Content calendars with posting schedules
- Email sequences with subject lines and body copy
- Ad copy with headlines, descriptions, and CTAs

### 3. Setup Guides
- Step-by-step tool setup (free tools prioritized)
- Account configuration checklists
- Integration instructions (analytics, CRM, email)
- Automation workflows

### 4. Measurement Framework
- KPIs for this specific channel
- Tracking implementation (events, UTM parameters)
- Dashboard templates
- When to double down vs. when to cut losses

---

## Root-Level Files

These files live at the root of `19-marketing/` alongside the 22 sub-directories:

| File | Purpose |
|------|---------|
| `README.md` | This file — overview and guide for the entire marketing system |
| `marketing-intake.md` | Marketing-specific discovery questions (Step 19 interview) |
| `channel-decision-tree.md` | Decision framework for selecting priority marketing channels |
| `marketing-budget-framework.md` | Budget allocation framework by tier, stage, and channel |

---

## Output Structure

When the marketing system runs, it generates files in your project's `marketing/` directory:

```
marketing/
├── MARKETING-BRIEF.md              # Executive summary of the entire marketing plan
├── MARKETING-CONFIG.md             # All marketing variables (resolved from intake)
├── brand/
│   ├── voice-guide.md              # Brand voice, tone, personality
│   ├── value-propositions.md       # Core value props by persona
│   ├── messaging-hierarchy.md      # Taglines, elevator pitches, boilerplate
│   └── competitor-positioning.md   # How you differentiate from competitors
├── channels/
│   ├── channel-priority-matrix.md  # Ranked channels with rationale
│   ├── seo-strategy.md             # Keyword targets, content plan, technical SEO
│   ├── content-calendar.md         # 90-day content calendar
│   ├── social-media-plan.md        # Platform-specific strategies
│   ├── email-sequences/            # Welcome, onboarding, re-engagement
│   └── paid-advertising-plan.md    # Ad copy, targeting, budget
├── launch/
│   ├── pre-launch-checklist.md     # Everything before launch day
│   ├── launch-day-playbook.md      # Hour-by-hour launch plan
│   ├── post-launch-followup.md     # First 30 days after launch
│   └── product-hunt-playbook.md    # Product Hunt specific strategy
├── assets/
│   ├── landing-page-copy.md        # Full landing page copy (hero, features, CTA)
│   ├── blog-post-outlines/         # 10+ blog post outlines
│   ├── social-templates/           # Ready-to-post social content
│   └── email-templates/            # HTML-ready email templates
├── analytics/
│   ├── tracking-plan.md            # Event taxonomy and implementation
│   ├── kpi-dashboard.md            # Key metrics by channel
│   └── ab-testing-framework.md     # What to test and how
└── budget/
    ├── budget-allocation.md        # Where to spend by month
    ├── tool-stack.md               # Recommended tools with costs
    └── roi-projections.md          # Expected returns by channel
```

---

## Prerequisites

Before running the marketing steps, ensure:

- [x] **Steps 0-16 completed** — Claude needs the project context from discovery, tribunal, and service specs
- [x] **`MARKETING_CONFIG` values collected** — Step 19 gathers these through conversational interview
- [x] **Product has a name and description** — From `{{PROJECT_NAME}}` and `{{PROJECT_DESCRIPTION}}`
- [x] **User personas defined** — From tribunal output (Step 3)
- [x] **Competitors identified** — From intake (Step 1) and tribunal (Step 3)

---

## Estimated Time

| Activity | Time |
|----------|------|
| Marketing intake interview (Step 19) | 10-20 minutes |
| Channel selection + brand messaging (Steps 20-21) | 15-30 minutes |
| Asset generation (Steps 22-27) | 2-4 hours |
| Analytics setup (Step 28) | 15-30 minutes |
| **Total** | **~3-5 hours** |

Most of this runs on autopilot. You only need to confirm at the intake (Step 19) and review the final output.

---

## Key Placeholders Used

The marketing system introduces these additional placeholders (see `PLACEHOLDER-REGISTRY.md` for the full list):

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{PRODUCT_TYPE}}` | Product category | `saas` / `mobile_app` / `marketplace` / `dev_tool` / `client_site` |
| `{{TARGET_AUDIENCE}}` | Primary audience description | `B2B SaaS founders` / `Mobile gamers 18-25` |
| `{{MARKETING_BUDGET}}` | Monthly marketing budget tier | `bootstrap` / `small` / `medium` / `growth` / `scale` |
| `{{LAUNCH_DATE}}` | Planned public launch date | `2026-06-15` |
| `{{UNIQUE_VALUE_PROP}}` | One-sentence unique value | `The only TMS that auto-dispatches trips` |
| `{{BRAND_VOICE}}` | Brand personality | `professional-friendly` / `technical-authoritative` / `casual-fun` |
| `{{PRIMARY_CHANNELS}}` | Top 3-5 marketing channels | `["seo", "content", "linkedin", "email"]` |
| `{{COMPETITOR_1}}` | Primary competitor name | `Competitor X` |
| `{{COMPETITOR_2}}` | Secondary competitor name | `Competitor Y` |
| `{{COMPETITOR_3}}` | Tertiary competitor name | `Competitor Z` |
| `{{PRICING_MODEL}}` | How the product is priced | `freemium` / `free_trial` / `paid_only` / `usage_based` |
| `{{CONTENT_TOPICS}}` | Core content themes | `["logistics automation", "fleet management", "driver safety"]` |
| `{{SOCIAL_HANDLE}}` | Primary social media handle | `@fleetmanager` |
| `{{SUPPORT_EMAIL}}` | Support contact email | `support@fleetmanager.com` |
| `{{MARKETING_EMAIL}}` | Marketing sender email | `hello@fleetmanager.com` |

---

## The Bottom Line

You spent weeks (or months) building your product. This system makes sure that effort was not wasted. It gives you a marketing strategy tailored to your specific product type, audience, and budget — plus the actual copy, templates, and tracking setup to execute it.

The goal is not to make you a marketing expert. The goal is to make sure your product gets in front of the right people, with the right message, through the right channels, starting on day one.

**Ready to start? Tell Claude: "Read 19-marketing/marketing-intake.md and begin the marketing interview."**
