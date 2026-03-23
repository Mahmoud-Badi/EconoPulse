# Marketing Intake Questions

> 18 structured interview questions organized in 5 categories.
> Questions marked with **\*** are **stop gates** — Claude must get answers before generating the marketing brief.
> Each question includes: the question text, why it matters, a smart default, and the stop gate indicator.
> This interview runs during **Orchestrator Step 19**, after all build planning (Steps 0-16) is complete.

---

## Pre-Interview: What Claude Already Knows

Before asking a single marketing question, Claude has already collected extensive project context from the build planning steps. Claude should review this context and pre-fill what it can:

**From Step 1 (Discovery Intake):**
- `{{PROJECT_NAME}}` — product name
- `{{PROJECT_DESCRIPTION}}` — one-line description
- `{{PERSONAS}}` — user types and their workflows
- `{{COMPETITORS}}` — known competitors

**From Step 3 (Tribunal):**
- Detailed competitor analysis (features, pricing, positioning)
- User persona research (demographics, behaviors, pain points)
- Market sizing and opportunity assessment

**From Step 4 (Foundation Docs):**
- Project vision and market positioning
- Feature prioritization and MVP scope

**Claude should NOT re-ask questions it already has answers to.** Instead, confirm what it knows and ask only the marketing-specific questions that build on that foundation.

### Pre-Interview Confirmation Block

Before starting the marketing interview, Claude should present:

```
MARKETING CONTEXT (from build planning):
  Product: {{PROJECT_NAME}} — {{PROJECT_DESCRIPTION}}
  Customer type: {{CUSTOMER_TYPE}} (B2B / B2C / Internal)
  User personas: {{PERSONAS}}
  Known competitors: {{COMPETITORS}}
  MVP launch target: {{TARGET_LAUNCH_DATE}}

  Does this still accurately describe your product and audience?
  Any changes since we completed the build planning?
```

If the user confirms, proceed to marketing-specific questions. If anything changed, update the context before continuing.

---

## Category M1: Product & Market Position

> Goal: Understand how the product fits into the market and what makes it different. These answers drive every piece of marketing copy — from the landing page headline to the email subject lines.

---

### M1.1* — What type of product is this?

**Question:** Which of these best describes your product?
- **SaaS** — Web-based software with recurring subscription (B2B or B2C)
- **Mobile App** — Native app distributed through App Store / Play Store
- **Marketplace** — Two-sided platform connecting buyers and sellers (or providers and consumers)
- **Dev Tool** — Library, framework, API, CLI, or infrastructure tool for developers
- **Client/Agency Site** — Service business website, portfolio, or lead-generation site

**Why it matters:** This is the single most impactful marketing decision. Product type determines which channels work, what kind of content to create, where to spend budget, and how to measure success. A SaaS product and a mobile app require fundamentally different marketing strategies — applying the wrong one wastes time and money.

**Smart default:** N/A — this is a stop gate. Claude must get a clear answer.

**Stop gate:** YES

**Claude's interpretation guidance:**
- If the user says "it's a web app with subscriptions" → SaaS
- If the user says "it's on the App Store" → Mobile App
- If the user says "it connects X with Y" → Marketplace
- If the user says "it's for developers" or "it's an API" → Dev Tool
- If the user says "it's for my agency" or "it's a business website" → Client/Agency Site
- If the product spans multiple types (e.g., SaaS with a mobile companion app), ask: "Which is the PRIMARY product that drives revenue?" Use that as the product type, and note the secondary type for channel prioritization.

---

### M1.2* — What makes you different? (One sentence)

**Question:** Complete this sentence: "Unlike [competitor], {{PROJECT_NAME}} is the only product that ___."

**Why it matters:** This becomes your Unique Value Proposition (UVP). It appears in your landing page headline, your email subject lines, your social media bios, your Product Hunt tagline, and every piece of marketing copy. If you cannot fill in this blank, your marketing will be generic and forgettable.

**Smart default:** N/A — this is a stop gate. Claude must get a clear answer.

**Stop gate:** YES

**Good answers:**
- "Unlike generic project management tools, TaskFlow is the only PM tool that auto-assigns tasks based on team availability and skill match."
- "Unlike other TMS platforms, FleetManager is the only one that handles wheelchair-accessible vehicle scheduling with Medicaid compliance built in."
- "Unlike Postman, our API client runs entirely in the terminal and supports real-time collaboration via git."

**Bad answers (Claude should push back):**
- "We're better." (How? Be specific.)
- "We have more features." (Which features? Why do they matter to the user?)
- "We're cheaper." (Price alone is rarely a sustainable differentiator.)

**Claude should help refine:** If the user gives a vague answer, Claude should use the competitor analysis from the Tribunal (Step 3) to help them articulate a sharper differentiator. Ask: "Based on our competitor research, [Competitor A] focuses on X and [Competitor B] focuses on Y. Where does {{PROJECT_NAME}} fit that neither of them covers?"

---

### M1.3* — What problem does this solve? (User's words)

**Question:** When someone asks "what does {{PROJECT_NAME}} do?" — what do you say? Not the technical answer. The answer you would give to a non-technical friend at a dinner party.

**Why it matters:** This becomes your "plain English" description — used in social media bios, directory listings, casual introductions, and anywhere you need to explain the product in under 10 seconds. Technical descriptions repel non-technical buyers. Even B2B buyers are humans who appreciate clarity.

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES

**Claude's interpretation guidance:**
- The answer should be jargon-free
- It should describe the OUTCOME, not the technology
- If the user says "It's a React-based SaaS platform leveraging microservices..." — push back gently: "That's the technical answer. What would you say if your mom asked what you're building?"
- The answer should be 1-2 sentences maximum

**Good examples:**
- "It helps trucking companies figure out which driver should pick up which patient, and makes sure nobody gets forgotten."
- "It lets small business owners send professional invoices in 30 seconds and get paid the same week."
- "It's like Grammarly but for code — it catches bugs before you ship them."

---

### M1.4 — What is the pricing model?

**Question:** How will you charge for this product?
- **Freemium** — Free forever tier + paid upgrades (e.g., Slack, Notion)
- **Free trial** — Full access for X days, then pay (e.g., Netflix, Ahrefs)
- **Paid only** — No free access, pay from day one (e.g., Basecamp)
- **Usage-based** — Pay per API call / transaction / seat (e.g., Stripe, Twilio)
- **One-time purchase** — Pay once, own forever (e.g., desktop software)
- **Ad-supported** — Free to use, monetized through advertising
- **Not decided yet**

**Why it matters:** Pricing model determines your entire conversion funnel. Freemium needs activation optimization and upgrade triggers. Free trial needs trial-to-paid conversion optimization. Paid-only needs strong trust signals and social proof before purchase. Usage-based needs clear cost calculators and transparent pricing pages.

**Smart default:** "Freemium with paid tiers (most common for SaaS). Claude will generate pricing page templates for this model and note it can be adjusted."

**Stop gate:** No

**Follow-up questions based on answer:**
- **Freemium:** What features are free vs. paid? What triggers the upgrade?
- **Free trial:** How many days? What happens at the end — hard paywall or downgrade?
- **Usage-based:** What unit do users pay for? Is there a minimum?
- **Not decided:** Claude will generate pricing comparison frameworks to help decide.

---

## Category M2: Audience & Personas

> Goal: Go deeper than the build-phase personas. Marketing needs to know WHERE these people spend time online, what content they consume, who influences their purchasing decisions, and what language they use to describe their problems.

---

### M2.1* — Where does your target audience spend time online?

**Question:** Where do the people who would buy your product hang out online? Select all that apply and rank by importance:
- LinkedIn (B2B professionals)
- Twitter/X (tech, media, startup community)
- Reddit (niche communities — which subreddits?)
- YouTube (tutorials, reviews)
- TikTok (younger audiences, visual products)
- Instagram (visual products, lifestyle brands)
- Facebook Groups (niche communities, local businesses)
- Hacker News (developers, technical founders)
- Discord / Slack communities (which ones?)
- Industry-specific forums or sites (which ones?)
- Product Hunt (early adopters, tech enthusiasts)
- GitHub (developers, open source)
- Stack Overflow (developers with specific problems)
- Podcasts (which ones?)
- Conferences / Events (which ones?)

**Why it matters:** You cannot market to people you cannot reach. If your audience lives on Reddit and you are posting on LinkedIn, you are shouting into the void. This answer directly determines which channels you invest in and which you skip entirely.

**Smart default:** Claude infers based on product type and audience:
- **B2B SaaS** → LinkedIn, Twitter/X, Industry forums, Email
- **Mobile App** → TikTok, Instagram, YouTube, App Store
- **Dev Tool** → Twitter/X, Reddit, Hacker News, GitHub, Stack Overflow
- **Marketplace** → SEO, Social (platform depends on niche), Community
- **Client Site** → LinkedIn, Local SEO, Google Ads, Email

**Stop gate:** YES

**Claude's follow-up:** For each platform selected, ask: "Are you (or anyone on your team) already active there? Do you have existing accounts with followers?"

---

### M2.2 — Who influences your buyer's decisions?

**Question:** Before your target customer buys a product like yours, who do they consult? Who do they trust? Examples:
- Industry analysts or publications
- Specific bloggers, YouTubers, or podcasters
- Peer recommendations (colleagues, friends)
- Online reviews (G2, Capterra, App Store reviews)
- Nobody — they search Google and decide alone

**Why it matters:** Influencer and outreach strategy depends on this. If your buyers trust specific YouTubers, partnering with those YouTubers is more effective than any paid ad. If they read G2 reviews before buying, getting early reviews on G2 becomes a launch priority.

**Smart default:** "Peer recommendations + Google search. Claude will identify specific influencers during content strategy generation."

**Stop gate:** No

---

### M2.3 — What language does your audience use?

**Question:** When your target customers describe the problem your product solves, what EXACT words and phrases do they use? Think about how they would phrase a Google search, a Reddit post, or a complaint to a colleague.

**Why it matters:** This is the foundation of your SEO keyword strategy AND your ad copy. If your customers search "how to schedule medical transport" but your landing page says "non-emergency medical transportation logistics management solution," you will never rank and your ads will not resonate. Customer language beats marketing language every time.

**Smart default:** "Claude will extract language from the competitor analysis (Tribunal Step 3) and the user persona research. User can refine later."

**Stop gate:** No

**Examples of what Claude is looking for:**
- Pain-point phrases: "I waste 2 hours every morning assigning trips manually"
- Search queries: "best free invoice tool for freelancers"
- Comparison phrases: "is X better than Y for Z?"
- Frustration language: "why is [competitor] so expensive?"

---

### M2.4 — What is the buyer's journey length?

**Question:** How long does it typically take from "first hears about your product" to "pays money"?
- **Impulse** (minutes) — app downloads, small purchases under $20
- **Short** (days) — free tools, low-cost subscriptions under $50/mo
- **Medium** (weeks) — mid-tier SaaS ($50-500/mo), team tools
- **Long** (months) — enterprise software, high-value contracts ($500+/mo)

**Why it matters:** Journey length determines your content strategy and funnel depth. Impulse products need strong first impressions (app store listing, landing page). Long-journey products need nurture sequences (email drips, case studies, webinars, free trials, demos). Mismatching content to journey length wastes effort.

**Smart default:** Claude infers from pricing model and product type:
- Freemium/free trial B2C → Short (days)
- B2B SaaS under $100/mo → Medium (weeks)
- B2B SaaS over $500/mo → Long (months)
- Mobile app (free/cheap) → Impulse (minutes)

**Stop gate:** No

---

## Category M3: Competition & Positioning

> Goal: Understand the competitive landscape in marketing terms — not just product features, but how competitors position themselves, where they advertise, and what their weaknesses are.

---

### M3.1 — How do competitors market themselves?

**Question:** For your top 2-3 competitors (from the Tribunal research), answer:
- What is their primary marketing channel? (SEO? Paid ads? Social? Community?)
- What kind of content do they produce? (Blog posts? Videos? Podcasts? Webinars?)
- What does their messaging emphasize? (Speed? Price? Features? Simplicity? Enterprise-grade?)
- Where are they weak in their marketing? (Bad website? No content? Expensive ads? Poor reviews?)

**Why it matters:** Competitor marketing analysis reveals opportunities. If every competitor focuses on SEO but none are on YouTube, YouTube is a blue ocean. If every competitor emphasizes features but none emphasize ease-of-use, positioning on simplicity is a differentiator. You do not need to out-spend competitors — you need to out-position them.

**Smart default:** "Claude will analyze competitor websites and marketing presence using the Tribunal research. User can add additional observations."

**Stop gate:** No

**Claude's auto-analysis:** If Claude has Firecrawl or web access, it should scan competitor websites and report:
- Homepage messaging and value proposition
- Blog/content presence and frequency
- Social media activity and engagement
- Paid ad presence (use Google "ads transparency" or Facebook Ad Library)
- Review scores on G2, Capterra, Trustpilot, or app stores

---

### M3.2 — What is your market positioning strategy?

**Question:** How do you want to be positioned relative to competitors?
- **Premium** — "We're the best, and we charge accordingly" (like Apple, Superhuman)
- **Value** — "We do 80% of what the expensive tool does, at 20% of the price" (like Basecamp, Plausible)
- **Niche specialist** — "We serve [specific industry/use case] better than anyone" (like Clio for lawyers, Toast for restaurants)
- **Disruptor** — "We're rebuilding this category from scratch" (like Figma vs. Sketch, Linear vs. Jira)
- **Open/transparent** — "We're open source / open pricing / open roadmap" (like PostHog, Cal.com)

**Why it matters:** Positioning drives every marketing decision. Premium positioning means high-quality design, case studies, and thought leadership. Value positioning means comparison pages, pricing transparency, and "switch from X" campaigns. Niche positioning means deep industry content and community building.

**Smart default:** "Niche specialist — focused on solving {{PRODUCT_DESCRIPTION}} better than general-purpose alternatives." (Most MVPs benefit from niche positioning.)

**Stop gate:** No

---

## Category M4: Budget & Resources

> Goal: Understand what the user can actually spend on marketing — both in money and in time. This determines whether the strategy is bootstrap/organic, paid-heavy, or a mix.

---

### M4.1* — What is your monthly marketing budget?

**Question:** How much can you spend on marketing per month? Be honest — the strategy changes dramatically at each tier:
- **$0 (Bootstrap)** — No budget. Free tools, organic growth, sweat equity only
- **$100-500/mo (Small)** — One or two paid tools, small ad experiments
- **$500-2,000/mo (Medium)** — Multiple tools, consistent ad spend, some outsourcing
- **$2,000-10,000/mo (Growth)** — Dedicated ad budgets, content creation, outreach
- **$10,000+/mo (Scale)** — Full marketing stack, agencies, significant ad spend

**Why it matters:** Budget tier is the second most impactful marketing variable after product type. A bootstrap strategy relies entirely on organic channels (SEO, content, social, community). A growth budget can accelerate with paid ads and influencer partnerships. Recommending paid advertising to someone with no budget wastes their time.

**Smart default:** N/A — this is a stop gate. The strategy is fundamentally different at each tier.

**Stop gate:** YES

**Claude's follow-up:** "Is this budget available starting now, or does it begin at launch? Can it increase if early marketing shows positive ROI?"

---

### M4.2 — How many hours per week can you dedicate to marketing?

**Question:** How many hours per week can you (or your team) spend on marketing activities? This includes writing content, posting on social media, responding to community questions, writing emails, and analyzing metrics.
- **0-2 hours/week** — Absolute minimum, automated only
- **2-5 hours/week** — One focused session per week
- **5-10 hours/week** — Part-time marketing effort
- **10-20 hours/week** — Significant marketing commitment
- **20+ hours/week** — Dedicated marketing person or team

**Why it matters:** Even free marketing channels require time. Content marketing needs someone to write. Social media needs someone to post and engage. Community building needs someone to show up consistently. If the answer is "0-2 hours," the strategy must prioritize set-and-forget channels (SEO, automated email, listings) over high-touch channels (social media, community, outreach).

**Smart default:** "2-5 hours/week. Claude prioritizes low-maintenance channels and provides content batching strategies."

**Stop gate:** No

---

### M4.3 — Do you have any existing marketing assets?

**Question:** Do you already have any of these? Select all that apply:
- [ ] Domain name and website
- [ ] Logo and brand colors
- [ ] Social media accounts (which platforms?)
- [ ] Email list (how many subscribers?)
- [ ] Blog with existing content (how many posts?)
- [ ] Product demo or walkthrough video
- [ ] Customer testimonials or case studies
- [ ] Press mentions or media coverage
- [ ] Existing partnerships or affiliate relationships
- [ ] Analytics already set up (Google Analytics, Mixpanel, etc.)
- [ ] None of the above — starting from scratch

**Why it matters:** Existing assets change the launch strategy. An email list of 500 subscribers is a built-in launch audience. Existing blog content with SEO traffic means you already have a distribution channel. Zero existing assets means you need to build everything from scratch, which changes the timeline.

**Smart default:** "Domain name and logo only (common for projects coming through the Starter Kit). Claude generates all other assets from scratch."

**Stop gate:** No

---

## Category M5: Goals & Timeline

> Goal: Understand what success looks like and when the user needs to see results. This prevents the common mistake of expecting paid-ad results from an organic-only strategy on a 2-week timeline.

---

### M5.1* — When is your public launch date?

**Question:** When do you plan to publicly launch this product? Options:
- **Already launched** — product is live, need to grow
- **Launching in < 2 weeks** — urgent, need launch-day assets now
- **Launching in 1-3 months** — time for pre-launch marketing
- **Launching in 3-6 months** — full pre-launch campaign possible
- **No date set** — focus on strategy, execute when ready

**Why it matters:** Launch timeline determines whether you can do pre-launch marketing (email list building, teaser campaigns, Product Hunt scheduling) or need to go straight to launch-day tactics. A 3-month runway allows for SEO content to start ranking, email lists to grow, and social presence to build. A 2-week runway means landing page + launch announcement only.

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES

**Claude's follow-up based on answer:**
- **Already launched:** "What have you tried so far? What worked and what didn't?"
- **< 2 weeks:** "We'll focus exclusively on launch-day assets. Everything else comes after."
- **1-3 months:** "Perfect window for pre-launch marketing. We'll build anticipation."
- **3-6 months:** "Full pre-launch campaign. We'll start with SEO and content now."

---

### M5.2 — What does success look like in 90 days?

**Question:** 90 days after launch, what numbers would make you feel the marketing is working? Think about:
- Users/customers acquired
- Website traffic
- Email subscribers
- Revenue (if applicable)
- App downloads (if mobile)
- Any other metric that matters to you

**Why it matters:** This sets expectations and success criteria. If the user expects 10,000 users in 90 days with a $0 budget, Claude needs to have an honest conversation about what is realistic. Setting achievable milestones prevents disappointment and premature pivot.

**Smart default:** Claude calculates realistic targets based on product type, budget, and channels:
- **Bootstrap SaaS:** 50-200 users, 1K-5K monthly visitors, 100-500 email subscribers
- **Small budget SaaS:** 200-1K users, 5K-20K monthly visitors, 500-2K email subscribers
- **Mobile App (organic):** 500-2K downloads, 4.0+ app store rating
- **Dev Tool:** 100-500 GitHub stars, 50-200 active users, 1K-5K monthly docs visitors

**Stop gate:** No

---

### M5.3 — Any marketing constraints or preferences?

**Question:** Are there any marketing activities you specifically want to avoid or include? Examples:
- "I don't want to do cold outreach"
- "I only want to focus on organic/free channels"
- "I have a strong opinion about being on TikTok" (for or against)
- "We're in a regulated industry — certain claims are off-limits"
- "I want to try Product Hunt"
- "I don't want to write blog posts myself"

**Why it matters:** Constraints prevent wasted effort. If the user hates cold outreach, do not generate cold email templates. If they are excited about Product Hunt, prioritize the Product Hunt playbook. Preferences also reveal comfort level — someone who hates social media needs an automated scheduling approach, not a "post 3x daily" strategy.

**Smart default:** "No constraints. Claude will recommend the best channels and the user can veto specific ones."

**Stop gate:** No

---

## Interview Flow Instructions for Claude

### How to Conduct This Interview

1. **Start with the Pre-Interview Confirmation Block.** Confirm what Claude already knows from build planning. Do not re-ask questions already answered.

2. **Ask questions conversationally, not as a numbered dump.** Group by category and ask 2-3 questions at a time. Wait for answers before proceeding.

3. **Stop gates are non-negotiable.** There are 6 stop gates (M1.1, M1.2, M1.3, M2.1, M4.1, M5.1). Claude must have answers to ALL of them before generating the marketing brief. If the user says "I don't know" to a stop gate, help them figure it out using the Tribunal research.

4. **Use smart defaults silently for non-stop-gate questions.** If the user says "you decide" or "I don't know" for a non-starred question, apply the smart default and note it as "(default — can be adjusted)."

5. **Summarize after each category.** Before moving to the next category, read back what was captured. "So your product is positioned as [X], your primary audience hangs out on [Y], and your budget is [Z]. Sound right?"

6. **Generate the MARKETING_CONFIG block after all stop gates are cleared.**

---

## Interview Completion Checklist

Before generating the marketing brief, Claude must verify:

- [ ] **M1.1*** answered: Product type is ____
- [ ] **M1.2*** answered: Unique value proposition is ____
- [ ] **M1.3*** answered: Plain-English description is ____
- [ ] **M2.1*** answered: Audience hangs out on ____
- [ ] **M4.1*** answered: Monthly budget is ____
- [ ] **M5.1*** answered: Launch date is ____

All 6 stop gates cleared? Generate the `MARKETING_CONFIG` block.

---

## MARKETING_CONFIG Output Block

After the interview is complete, Claude generates this config block and stores it in the orchestrator STATE BLOCK:

```
MARKETING_CONFIG: {
  # Product & Market (from M1)
  PRODUCT_TYPE: "saas" | "mobile_app" | "marketplace" | "dev_tool" | "client_site",
  UNIQUE_VALUE_PROP: "Unlike [competitor], {{PROJECT_NAME}} is the only product that [differentiator]",
  PLAIN_ENGLISH_DESCRIPTION: "[dinner party description]",
  PRICING_MODEL: "freemium" | "free_trial" | "paid_only" | "usage_based" | "one_time" | "ad_supported" | "undecided",
  MARKET_POSITIONING: "premium" | "value" | "niche" | "disruptor" | "open",

  # Audience (from M2)
  PRIMARY_PLATFORMS: ["linkedin", "twitter", "reddit", ...],
  AUDIENCE_INFLUENCERS: ["peer_recommendations", "industry_analysts", "youtubers", ...],
  CUSTOMER_LANGUAGE: ["phrase 1", "phrase 2", ...],
  BUYER_JOURNEY_LENGTH: "impulse" | "short" | "medium" | "long",

  # Competition (from M3, supplemented by Tribunal)
  COMPETITOR_1: { name: "", positioning: "", primary_channel: "", weakness: "" },
  COMPETITOR_2: { name: "", positioning: "", primary_channel: "", weakness: "" },
  COMPETITOR_3: { name: "", positioning: "", primary_channel: "", weakness: "" },

  # Budget & Resources (from M4)
  MARKETING_BUDGET: "bootstrap" | "small" | "medium" | "growth" | "scale",
  MARKETING_BUDGET_AMOUNT: "$0" | "$100-500" | "$500-2000" | "$2000-10000" | "$10000+",
  WEEKLY_MARKETING_HOURS: "0-2" | "2-5" | "5-10" | "10-20" | "20+",
  EXISTING_ASSETS: ["domain", "logo", "social_accounts", "email_list", ...],
  EMAIL_LIST_SIZE: 0,

  # Goals & Timeline (from M5)
  LAUNCH_DATE: "YYYY-MM-DD" | "already_launched" | "no_date",
  LAUNCH_TIMELINE: "already" | "urgent" | "1-3_months" | "3-6_months" | "no_date",
  SUCCESS_METRICS_90_DAY: {
    users: 0,
    monthly_visitors: 0,
    email_subscribers: 0,
    revenue: "$0",
    app_downloads: 0
  },
  MARKETING_CONSTRAINTS: ["no_cold_outreach", "organic_only", ...],
  MARKETING_PREFERENCES: ["product_hunt", "technical_content", ...],

  # Derived (Claude calculates)
  PRIMARY_CHANNELS: [],  # Populated by channel-decision-tree.md in Step 20
  BRAND_VOICE: "",       # Populated by brand-messaging in Step 21
  CONTENT_TOPICS: []     # Populated by SEO/content strategy in Step 23
}
```

### Derived Values Claude Calculates

After the interview, Claude should also derive:

| Derived Value | How It's Calculated |
|--------------|-------------------|
| `FUNNEL_DEPTH` | Buyer journey length maps to funnel complexity (impulse=shallow, long=deep) |
| `CONTENT_FREQUENCY` | Weekly hours and budget determine sustainable posting frequency |
| `AD_BUDGET_ALLOCATION` | Total budget minus tool costs = available ad spend |
| `LAUNCH_URGENCY` | Days until launch determines which strategies are viable |
| `CHANNEL_CAPACITY` | Hours per week / 2 hours per channel = max active channels |

---

## Post-Interview: What Happens Next

Once the `MARKETING_CONFIG` is generated, Claude proceeds to:

1. **Step 20: Channel Selection** — Reads `channel-decision-tree.md` and uses `MARKETING_CONFIG` to select and prioritize channels
2. **Step 21: Brand & Messaging** — Generates brand voice guide, value propositions, and messaging hierarchy
3. **Steps 22-28: Asset Generation** — Generates channel-specific marketing assets using templates from the 22 sub-directories

The user does not need to do anything between these steps — they run on autopilot, just like the build planning steps.

---

## Re-Running the Marketing Intake

If project parameters change (new pricing model, different audience, updated budget), re-run the intake:

```
Tell Claude: "Re-run the marketing intake — our budget changed to [new tier]"
```

Claude will update the `MARKETING_CONFIG` block and flag which downstream assets need regeneration.
