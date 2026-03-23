# Channel Decision Tree

> **Purpose:** Systematically select and prioritize marketing channels based on product type, audience, budget, and time investment.
> **Used in:** Orchestrator Step 20 (Channel Selection)
> **Input:** `MARKETING_CONFIG` values from Step 19 (Marketing Intake)
> **Output:** Ranked channel list with tier assignments (Tier 1: do first, Tier 2: add next, Tier 3: scale later)

---

## How This Decision Tree Works

This is NOT a "try everything and see what sticks" approach. That is how marketing budgets die.

Instead, this decision tree uses a structured elimination process:

1. **Filter by product type** — Remove channels that historically do not work for your product category
2. **Filter by budget** — Remove channels you cannot afford to sustain for 90+ days
3. **Filter by time** — Remove channels that require more weekly hours than you have
4. **Rank by fit** — Score remaining channels on audience match, competition, and expected ROI
5. **Assign tiers** — Tier 1 (start immediately), Tier 2 (add in month 2-3), Tier 3 (add when scaling)

The result: a focused list of 3-5 channels you execute well, instead of 12 channels you execute poorly.

---

## Channel Profiles

### Channel 1: SEO (Search Engine Optimization)

| Attribute | Details |
|-----------|---------|
| **Best for** | SaaS, Marketplace, Dev Tool, Client Site |
| **Not ideal for** | Mobile App (unless web-based companion), brand-new categories with no search volume |
| **Estimated cost** | $0-200/mo (tools) + content creation time |
| **Time investment** | 5-10 hrs/week for content creation; 1-2 hrs/week for technical SEO |
| **Time to results** | 3-6 months for meaningful traffic (this is the slowest but most sustainable channel) |
| **Effort level** | High upfront, decreasing over time |
| **Key metrics** | Organic traffic, keyword rankings, domain authority, organic conversions |
| **Budget tier minimum** | Bootstrap ($0) — can be done entirely for free |

**When to prioritize:** Your audience actively searches for solutions to the problem you solve. Competitors have blog content ranking on Google. You can commit to publishing 2-4 quality articles per month for 6+ months.

**When to skip:** Your product creates a new category nobody searches for yet. You need results in under 2 months. You cannot commit to consistent content creation.

---

### Channel 2: Content Marketing (Blog, Guides, Resources)

| Attribute | Details |
|-----------|---------|
| **Best for** | SaaS, Dev Tool, Marketplace, Client Site |
| **Not ideal for** | Mobile App (unless supporting a web presence) |
| **Estimated cost** | $0 (write yourself) to $500-2000/mo (freelance writers) |
| **Time investment** | 4-8 hrs/week for writing, editing, and promotion |
| **Time to results** | 2-4 months for social traction; 4-8 months for SEO traction |
| **Effort level** | High (writing is hard, but compounds over time) |
| **Key metrics** | Page views, time on page, email sign-ups from content, social shares |
| **Budget tier minimum** | Bootstrap ($0) — you are the writer |

**When to prioritize:** Your product solves a problem that people research before buying. You (or someone on your team) can write clearly about your domain. You want long-term compounding traffic.

**When to skip:** Nobody reads about your product category. Your audience discovers products through app stores or word-of-mouth, not Google.

---

### Channel 3: Twitter/X

| Attribute | Details |
|-----------|---------|
| **Best for** | Dev Tool, SaaS, Marketplace (tech-adjacent) |
| **Not ideal for** | Client Site, Local Business, non-tech B2C |
| **Estimated cost** | $0 (organic) to $100-500/mo (promoted tweets) |
| **Time investment** | 3-5 hrs/week for posting, engaging, and community participation |
| **Time to results** | 1-3 months for initial following; 3-6 months for meaningful engagement |
| **Effort level** | Medium (requires consistency and genuine engagement, not just broadcasting) |
| **Key metrics** | Followers, engagement rate, link clicks, profile visits, mentions |
| **Budget tier minimum** | Bootstrap ($0) |

**When to prioritize:** Your audience is on Twitter/X (developers, startup founders, tech professionals). You or your founder can build in public and share product development journey. The tech community discusses your product category.

**When to skip:** Your audience is not on Twitter/X. You have no one who can authentically engage (scheduling promotional tweets without engagement does not work).

---

### Channel 4: LinkedIn

| Attribute | Details |
|-----------|---------|
| **Best for** | B2B SaaS, Client Site, Enterprise Dev Tool |
| **Not ideal for** | B2C Mobile App, Consumer Marketplace, indie Dev Tool |
| **Estimated cost** | $0 (organic) to $500-5000/mo (LinkedIn Ads — expensive but precise B2B targeting) |
| **Time investment** | 2-4 hrs/week for posting and engaging |
| **Time to results** | 1-2 months for initial engagement; 2-4 months for lead generation |
| **Effort level** | Medium (personal brand posts outperform company page posts by 10x) |
| **Key metrics** | Post impressions, engagement rate, connection requests, inbound leads, company page followers |
| **Budget tier minimum** | Bootstrap ($0) for organic; Medium ($500+/mo) for ads |

**When to prioritize:** You sell to businesses. Decision-makers at your target companies are on LinkedIn. You can write thought leadership content about your industry.

**When to skip:** You sell to consumers. Your product is B2C. Your audience is developers (they are on Twitter, not LinkedIn).

---

### Channel 5: Reddit

| Attribute | Details |
|-----------|---------|
| **Best for** | Dev Tool, SaaS (niche), Marketplace (niche) |
| **Not ideal for** | Client Site, products that cannot provide genuine value to subreddit communities |
| **Estimated cost** | $0 (participation is free; Reddit Ads are $5-50/day but rarely effective) |
| **Time investment** | 3-5 hrs/week for genuine community participation |
| **Time to results** | 1-3 months (but a single viral post can drive thousands of users overnight) |
| **Effort level** | High (Reddit detects and punishes self-promotion; you must provide genuine value) |
| **Key metrics** | Referral traffic, upvotes on product-related posts, subreddit mentions, sign-ups from Reddit |
| **Budget tier minimum** | Bootstrap ($0) |

**CRITICAL WARNING:** Reddit is the most anti-marketing platform on the internet. If your first interaction with a subreddit is promoting your product, you will be downvoted, reported, and potentially banned. The strategy is: (1) become a genuine, helpful community member for 2-4 weeks, (2) THEN mention your product when relevant, with full transparency that you built it.

**When to prioritize:** Your product serves a specific niche with active subreddits (r/webdev, r/SaaS, r/startups, r/selfhosted, r/devops, etc.). You can contribute genuine expertise, not just promotion.

**When to skip:** There are no relevant subreddits for your product. You are unwilling to invest time in community building before promoting.

---

### Channel 6: YouTube

| Attribute | Details |
|-----------|---------|
| **Best for** | Dev Tool (tutorials), SaaS (demos/walkthroughs), Mobile App (reviews/comparisons) |
| **Not ideal for** | Client Site (low search volume), simple products that don't need explanation |
| **Estimated cost** | $0-200/mo (screen recording is free; professional editing is $200-1000/video) |
| **Time investment** | 4-8 hrs/week for scripting, recording, and editing ONE video |
| **Time to results** | 3-6 months for channel growth; individual videos can rank in search within weeks |
| **Effort level** | Very High (video production is the most time-intensive content format) |
| **Key metrics** | Views, watch time, subscribers, click-through rate, traffic to product from video descriptions |
| **Budget tier minimum** | Bootstrap ($0) — screen recordings with voiceover require zero budget |

**When to prioritize:** Your product benefits from visual demonstration. Your audience watches YouTube for tutorials and product reviews. You are comfortable on camera (or can do screen recordings with voiceover).

**When to skip:** Your product is simple enough that a landing page explains it. You cannot commit to producing at least 2 videos per month for 6 months.

---

### Channel 7: TikTok / Instagram Reels / YouTube Shorts

| Attribute | Details |
|-----------|---------|
| **Best for** | Mobile App (B2C), Consumer Marketplace, visually appealing products |
| **Not ideal for** | B2B SaaS, Enterprise Dev Tool, Client Site |
| **Estimated cost** | $0 (organic) to $500-5000/mo (paid promotion) |
| **Time investment** | 3-6 hrs/week for creating 3-5 short-form videos |
| **Time to results** | 1-4 weeks (short-form video has the fastest viral potential) |
| **Effort level** | Medium (short videos are quicker to produce than long-form, but require volume) |
| **Key metrics** | Views, shares, saves, profile visits, link in bio clicks, app downloads |
| **Budget tier minimum** | Bootstrap ($0) |

**When to prioritize:** Your product targets consumers under 35. Your product is visually interesting or has "wow factor" moments. You are comfortable creating casual, authentic content (polished corporate content performs poorly on these platforms).

**When to skip:** Your audience is B2B decision-makers. Your product is backend/infrastructure with nothing visual to show.

---

### Channel 8: Email Marketing

| Attribute | Details |
|-----------|---------|
| **Best for** | ALL product types (email is the universal channel) |
| **Not ideal for** | Products with no way to collect email addresses |
| **Estimated cost** | $0-50/mo (free tiers of Mailchimp, ConvertKit, Resend, Buttondown) |
| **Time investment** | 1-3 hrs/week for list building, writing, and automation setup |
| **Time to results** | Immediate (once you have a list, every email gets opened within 48 hours) |
| **Effort level** | Low to Medium (automation does most of the work after initial setup) |
| **Key metrics** | List size, open rate (>30% is good), click rate (>3% is good), unsubscribe rate (<0.5%), conversions |
| **Budget tier minimum** | Bootstrap ($0) — free tiers support 500-2000 subscribers |

**When to prioritize:** ALWAYS. Email is the only marketing channel you own (social platforms can change algorithms, SEO can fluctuate, but your email list is yours). Every marketing strategy should include email collection.

**When to skip:** Never skip email entirely. Even if it is just a "notify me when we launch" landing page.

---

### Channel 9: Product Hunt

| Attribute | Details |
|-----------|---------|
| **Best for** | SaaS, Dev Tool, Mobile App, any tech product |
| **Not ideal for** | Client Site, non-tech Marketplace, local businesses |
| **Estimated cost** | $0 (free to launch) |
| **Time investment** | 20-40 hrs ONE-TIME for preparation and launch day |
| **Time to results** | Launch day (immediate traffic spike); long-tail effect for 2-4 weeks |
| **Effort level** | Very High for 1 week, then zero |
| **Key metrics** | Upvotes, Product of the Day/Week ranking, referral traffic, sign-ups from Product Hunt |
| **Budget tier minimum** | Bootstrap ($0) |

**When to prioritize:** Your product is tech/SaaS/tool-oriented. You have a polished landing page and working product. You can mobilize your network to support on launch day. You are launching for the first time (relaunches perform worse).

**When to skip:** Your product is not tech-oriented. You do not have a working product yet. Your landing page is not polished.

---

### Channel 10: Hacker News

| Attribute | Details |
|-----------|---------|
| **Best for** | Dev Tool, Technical SaaS, Open Source, technical content |
| **Not ideal for** | B2C Mobile App, Consumer Marketplace, Client Site |
| **Estimated cost** | $0 |
| **Time investment** | 2-4 hrs/week for participation; launch post takes 1-2 hrs to write |
| **Time to results** | Immediate (a front-page HN post drives 5,000-50,000 visits in 24 hours) |
| **Effort level** | Low time, but high quality bar (HN audience detects and rejects marketing-speak) |
| **Key metrics** | HN points, comment engagement, referral traffic, sign-ups |
| **Budget tier minimum** | Bootstrap ($0) |

**When to prioritize:** Your product is technical and the HN audience (developers, startup founders, tech enthusiasts) is your target market. You can write a "Show HN" post that honestly explains what you built and why.

**When to skip:** Your product is not technical. You are not comfortable with the HN community's direct, sometimes harsh feedback.

---

### Channel 11: Paid Search (Google Ads / Bing Ads)

| Attribute | Details |
|-----------|---------|
| **Best for** | SaaS (high intent), Client Site (local services), Marketplace |
| **Not ideal for** | Dev Tool (developers use ad blockers), products with no search intent |
| **Estimated cost** | $300-5000+/mo (cost-per-click varies widely by industry: $1-50+) |
| **Time investment** | 2-4 hrs/week for campaign management and optimization |
| **Time to results** | Days (paid search is the fastest channel to get traffic, if you can afford it) |
| **Effort level** | Medium (requires ongoing optimization to avoid wasting budget) |
| **Key metrics** | Cost per click (CPC), click-through rate (CTR), conversion rate, cost per acquisition (CPA), ROAS |
| **Budget tier minimum** | Small ($300+/mo minimum for meaningful data) |

**When to prioritize:** People actively search for your solution on Google. You have a clear conversion action (sign up, start trial, book demo). Your unit economics support customer acquisition cost of $20-200+.

**When to skip:** Your budget is $0. Nobody searches for your product category. Your product is free/low-cost and cannot justify the CPA.

---

### Channel 12: Paid Social (Meta Ads, LinkedIn Ads, Twitter Ads)

| Attribute | Details |
|-----------|---------|
| **Best for** | Mobile App (Meta Ads), B2B SaaS (LinkedIn Ads), Consumer products (Meta/TikTok Ads) |
| **Not ideal for** | Dev Tool (developers block ads), niche B2B with tiny audience |
| **Estimated cost** | $500-10,000+/mo (LinkedIn Ads start at $10/day minimum, Meta Ads at $5/day) |
| **Time investment** | 3-6 hrs/week for creative production and campaign optimization |
| **Time to results** | Days to weeks (fast feedback on what resonates) |
| **Effort level** | High (requires good creative, constant testing, and budget management) |
| **Key metrics** | CPM (cost per 1000 impressions), CPC, conversion rate, CPA, ROAS |
| **Budget tier minimum** | Small to Medium ($500+/mo for meaningful tests) |

**When to prioritize:** You have budget for experimentation. You know exactly who your target audience is (job title, interests, demographics). Your product has strong visual appeal or a clear "before/after" story.

**When to skip:** Bootstrap budget. Developer audience. Niche B2B with <10,000 potential customers (paid social works on scale).

---

### Channel 13: Influencer Marketing

| Attribute | Details |
|-----------|---------|
| **Best for** | Mobile App, Consumer SaaS, Dev Tool (micro-influencers) |
| **Not ideal for** | Enterprise SaaS, Client Site, niche Marketplace |
| **Estimated cost** | $0 (product exchange) to $500-10,000+ per influencer |
| **Time investment** | 3-5 hrs/week for outreach, negotiation, and relationship management |
| **Time to results** | 1-4 weeks per campaign |
| **Effort level** | Medium (finding the RIGHT influencers is the hard part) |
| **Key metrics** | Referral traffic, promo code usage, sign-ups attributed to influencer, engagement on sponsored content |
| **Budget tier minimum** | Bootstrap ($0 for micro-influencers via product exchange); Small ($500+) for paid sponsorships |

**When to prioritize:** Your audience follows specific creators. You can identify 10-50 relevant micro-influencers (1K-50K followers) in your niche. Your product has a clear demo/review angle.

**When to skip:** No relevant influencers exist in your space. Your product is too complex for a quick review/demo.

---

### Channel 14: Community Building

| Attribute | Details |
|-----------|---------|
| **Best for** | Dev Tool, SaaS (with power users), Marketplace, Open Source |
| **Not ideal for** | One-time purchase products, Client Site |
| **Estimated cost** | $0-100/mo (Discord/Slack are free; Circle/Discourse cost $50-100/mo) |
| **Time investment** | 5-10 hrs/week for community management (this is a commitment) |
| **Time to results** | 2-6 months to reach critical mass; years to build a moat |
| **Effort level** | Very High (community requires daily presence and genuine care) |
| **Key metrics** | Active members, messages per day, support tickets deflected, community-sourced features, NPS |
| **Budget tier minimum** | Bootstrap ($0) |

**When to prioritize:** Your product benefits from user-to-user interaction. Users have questions that other users can answer. You are building for the long term and want a defensible moat.

**When to skip:** You cannot commit 5+ hours/week to community management. Your product does not benefit from user interaction.

---

### Channel 15: Directories & Listings

| Attribute | Details |
|-----------|---------|
| **Best for** | SaaS (G2, Capterra, GetApp), Mobile App (alternative app stores), Client Site (Yelp, industry directories), Dev Tool (awesome-lists, StackShare) |
| **Not ideal for** | Products too early for reviews |
| **Estimated cost** | $0 (most listings are free); $200-1000/mo for premium placements |
| **Time investment** | 5-10 hrs ONE-TIME for setup; 1 hr/month for maintenance |
| **Time to results** | 1-3 months for SEO benefit; reviews accumulate over time |
| **Effort level** | Low (set and forget after initial setup) |
| **Key metrics** | Listing views, referral traffic, review count and rating, comparison page appearances |
| **Budget tier minimum** | Bootstrap ($0) |

**When to prioritize:** Always include directories as a Tier 2 activity. They are low effort, provide SEO backlinks, and build credibility. For B2B SaaS, G2 and Capterra are particularly important because buyers check them.

**When to skip:** You have zero users who can leave reviews (wait until you have at least 5-10 happy users).

---

### Channel 16: Partnerships & Co-Marketing

| Attribute | Details |
|-----------|---------|
| **Best for** | SaaS (integrations), Marketplace (supply-side acquisition), Client Site (referrals) |
| **Not ideal for** | Products with no natural integration or complementary partners |
| **Estimated cost** | $0 (revenue share or cross-promotion) to $1000+/mo (affiliate payouts) |
| **Time investment** | 2-4 hrs/week for outreach and relationship maintenance |
| **Time to results** | 1-3 months (partnership cycles are slow; trust takes time) |
| **Effort level** | Medium (relationship management is ongoing) |
| **Key metrics** | Partner-referred traffic, co-marketing campaign reach, joint webinar attendees, integration installs |
| **Budget tier minimum** | Bootstrap ($0) |

**When to prioritize:** Your product integrates with or complements other products. You can offer value to a partner (their users want your product). You have a working product that partners can recommend without risk.

**When to skip:** No natural partnership fit. Your product competes with most potential partners.

---

### Channel 17: PR & Media Relations

| Attribute | Details |
|-----------|---------|
| **Best for** | Products with a compelling story, Marketplace (local press), Mobile App (app review sites) |
| **Not ideal for** | Incremental improvements, products without a newsworthy angle |
| **Estimated cost** | $0 (DIY pitching) to $3,000-20,000/mo (PR agency) |
| **Time investment** | 3-5 hrs/week for writing pitches and building media relationships |
| **Time to results** | 2-8 weeks per pitch cycle; unpredictable (some pitches land, most do not) |
| **Effort level** | High (crafting compelling pitches requires skill) |
| **Key metrics** | Media mentions, backlinks from publications, referral traffic from press, social amplification of coverage |
| **Budget tier minimum** | Bootstrap ($0) for DIY; Growth ($3,000+/mo) for agency |

**When to prioritize:** Your product has a compelling "why now" story. You are solving a problem that is culturally relevant. You have data or a unique angle that journalists would find interesting.

**When to skip:** Your product is an incremental improvement. You have no newsworthy angle. Your budget is small (PR agencies are expensive and results are unpredictable).

---

### Channel 18: Podcasts (Guest Appearances)

| Attribute | Details |
|-----------|---------|
| **Best for** | SaaS (founder stories), Dev Tool (technical deep-dives), thought leadership |
| **Not ideal for** | Consumer Mobile App, Client Site, products without a person to represent them |
| **Estimated cost** | $0 (guest appearances are free) |
| **Time investment** | 2-3 hrs/week for pitching, preparation, and recording |
| **Time to results** | 1-3 months (podcast episodes take weeks to air; long-tail traffic for years) |
| **Effort level** | Low to Medium (once booked, 1-hour conversation is easy) |
| **Key metrics** | Referral traffic from podcast show notes, promo code usage, social mentions post-episode |
| **Budget tier minimum** | Bootstrap ($0) |

**When to prioritize:** Your founder or team member is articulate and has interesting stories or insights. Podcasts exist in your industry. You can identify 20+ relevant podcasts to pitch.

**When to skip:** Nobody on the team is comfortable speaking on a podcast. No relevant podcasts exist in your niche.

---

### Channel 19: Webinars & Live Events

| Attribute | Details |
|-----------|---------|
| **Best for** | B2B SaaS (lead generation), Enterprise tools (demo events), educational products |
| **Not ideal for** | Consumer Mobile App, simple products that need no explanation |
| **Estimated cost** | $0-100/mo (Zoom free tier, StreamYard) to $500+/mo (professional webinar platforms) |
| **Time investment** | 8-15 hrs per webinar (prep, promotion, delivery, follow-up) |
| **Time to results** | Immediate (leads captured at registration and during event) |
| **Effort level** | High per event (but each webinar can be repurposed into blog posts, clips, and social content) |
| **Key metrics** | Registrations, attendance rate (>40% is good), engagement during event, post-webinar conversions |
| **Budget tier minimum** | Bootstrap ($0) — Zoom free tier supports up to 100 attendees |

**When to prioritize:** Your product requires explanation or demonstration. Your audience values education. You can present for 30-60 minutes on a relevant topic.

**When to skip:** Your product is self-explanatory. Your audience does not attend webinars (B2C consumers rarely do).

---

### Channel 20: App Store Optimization (ASO)

| Attribute | Details |
|-----------|---------|
| **Best for** | Mobile App (this is mandatory, not optional) |
| **Not ideal for** | Non-mobile products |
| **Estimated cost** | $0-100/mo (ASO tools: AppTweak, Sensor Tower have limited free tiers) |
| **Time investment** | 5-10 hrs initially; 2-3 hrs/month for ongoing optimization |
| **Time to results** | 2-4 weeks for keyword ranking changes; ongoing improvement |
| **Effort level** | Medium (keyword research, screenshot optimization, review management) |
| **Key metrics** | App store impressions, keyword rankings, install conversion rate, ratings and reviews |
| **Budget tier minimum** | Bootstrap ($0) |

**When to prioritize:** You have a mobile app. Period. ASO is to mobile apps what SEO is to websites — if you skip it, you are invisible in the app store.

**When to skip:** Only if you have no mobile app.

---

## Product Type Decision Matrices

### Matrix Format

For each product type, channels are assigned to tiers:
- **Tier 1 (Do First):** Start these immediately. They are your highest-ROI channels.
- **Tier 2 (Add Next):** Add these in month 2-3 once Tier 1 channels are running.
- **Tier 3 (Scale Later):** Add these when you have budget, team, and Tier 1-2 working.
- **Avoid:** Do NOT invest time/money in these channels for your product type.

---

<!-- IF {{PRODUCT_TYPE}} == "saas" -->

### SaaS Product Channel Matrix

| Tier | Channels | Why |
|------|----------|-----|
| **Tier 1** | SEO, Content Marketing, Email, Landing Page Optimization | SaaS buyers search Google, read comparisons, and evaluate before buying. Content + SEO builds a compounding acquisition engine. Email nurtures leads through the consideration phase. |
| **Tier 2** | LinkedIn (if B2B), Twitter/X (if tech audience), Product Hunt, Directories (G2, Capterra), Partnerships | LinkedIn reaches B2B decision-makers. Product Hunt provides a launch spike. Directories build credibility and capture comparison-shopping traffic. |
| **Tier 3** | Paid Search, Paid Social, YouTube (tutorials), Webinars, Podcasts, Community | Add paid channels once organic channels prove the messaging works. YouTube tutorials and webinars work for complex products that benefit from demonstration. |
| **Avoid** | TikTok (unless B2C), App Store Optimization (unless mobile app exists) | B2B SaaS buyers are not on TikTok. ASO is irrelevant without a mobile app. |

**SaaS-Specific Strategy Notes:**
- The SaaS marketing flywheel: Content ranks on Google → attracts visitors → email captures leads → drip sequence converts to trial → onboarding converts trial to paid → happy customers leave reviews on G2 → reviews drive more credibility
- Free trial is your most important marketing asset. Optimize the sign-up flow before investing in traffic.
- Comparison pages ("{{PROJECT_NAME}} vs [Competitor]") rank well and capture high-intent traffic.

<!-- ENDIF -->

---

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->

### Mobile App Channel Matrix

| Tier | Channels | Why |
|------|----------|-----|
| **Tier 1** | ASO (App Store Optimization), Social Media (TikTok/Instagram/Twitter), Influencer Marketing | ASO is mandatory — 65% of app downloads come from app store search. Short-form social video drives app installs at scale. Influencer reviews build trust faster than any ad. |
| **Tier 2** | Paid Social (Meta Ads, TikTok Ads), Email (for re-engagement), Referral Program, PR (app review sites) | Paid social scales what is already working organically. Email re-engages churned users. Referral programs leverage existing users for growth. |
| **Tier 3** | Content Marketing, YouTube, Partnerships, Community | Content and YouTube support long-term discovery. Partnerships (other apps, accessories, services) open new acquisition channels. |
| **Avoid** | LinkedIn (unless B2B app), Paid Search (expensive for mobile installs), Directories (web-focused), Webinars | LinkedIn and webinars do not drive app installs. Paid search CPA for mobile apps is typically too high compared to social ads. |

**Mobile-Specific Strategy Notes:**
- Invest heavily in screenshot optimization — most users decide within 3 seconds of viewing your listing
- Push notification strategy IS marketing — well-timed notifications drive 3-10x more engagement than email
- App Store ratings are everything: a 4.5-star app converts installs at 2x the rate of a 4.0-star app
- Day 1 and Day 7 retention are your most important metrics, not download count

<!-- ENDIF -->

---

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->

### Marketplace Channel Matrix

| Tier | Channels | Why |
|------|----------|-----|
| **Tier 1** | SEO (category pages), Email, Community Building, Referral Program | Marketplaces need supply AND demand. SEO captures demand-side search traffic. Community builds the supply side. Referral programs leverage both sides for growth. |
| **Tier 2** | Content Marketing (guides for both sides), Social Media, Partnerships, Local PR | Content educates both buyer and seller sides. Partnerships with adjacent services drive supply. |
| **Tier 3** | Paid Search, Paid Social, Influencer, YouTube, Directories | Paid channels can accelerate demand-side growth once supply is sufficient. |
| **Avoid** | Hacker News (unless tech marketplace), Webinars (unless B2B marketplace), TikTok (unless consumer marketplace) | Channel relevance depends heavily on the marketplace's specific niche. |

**Marketplace-Specific Strategy Notes:**
- Solve the chicken-and-egg problem first: which side do you acquire first? Usually supply (sellers/providers) — they are more motivated to join an empty marketplace than buyers
- Single-player mode: make the product useful to one side even without the other (e.g., Yelp was useful for finding restaurants even before businesses managed their listings)
- Geographic launch strategy: start in one city/region and dominate before expanding (Uber, DoorDash, Craigslist all started hyper-local)

<!-- ENDIF -->

---

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->

### Dev Tool Channel Matrix

| Tier | Channels | Why |
|------|----------|-----|
| **Tier 1** | Technical Content (blog, docs), Twitter/X, GitHub (README, stars, discussions), Reddit (r/webdev, r/programming, etc.), Hacker News | Developers discover tools through technical content, peer recommendations on social media, and community discussions. Quality documentation IS marketing for dev tools. |
| **Tier 2** | Product Hunt, YouTube (tutorials), Stack Overflow (answers, not ads), Open Source community, Conferences/Talks | Product Hunt reaches early adopters. YouTube tutorials demonstrate value. Stack Overflow answers position you as an authority. Conferences build relationships. |
| **Tier 3** | Email (changelog/updates), Community (Discord/Slack), Partnerships (integrations), Podcasts, Directories (StackShare) | Email keeps existing users engaged. Community provides support and feedback. Partnerships with complementary tools expand reach. |
| **Avoid** | LinkedIn Ads, Meta Ads, TikTok, Traditional PR, Cold email outreach | Developers actively distrust and block ads. Traditional PR does not reach the developer audience. Cold outreach is antithetical to developer culture. |

**Dev Tool-Specific Strategy Notes:**
- Documentation IS your marketing. If your docs are bad, no amount of advertising will save you.
- Build in public on Twitter/X. Share your development process, challenges, and decisions. Developers respect transparency.
- Open source is the ultimate marketing strategy for dev tools — it builds trust, enables contributions, and provides free distribution. Even if the core product is paid, open-sourcing components builds goodwill.
- NEVER astroturf on Reddit or Hacker News. The community WILL find out and it will permanently damage your reputation.

<!-- ENDIF -->

---

<!-- IF {{PRODUCT_TYPE}} == "client_site" -->

### Client/Agency Site Channel Matrix

| Tier | Channels | Why |
|------|----------|-----|
| **Tier 1** | Local SEO, Google Ads (search), Email (nurture), LinkedIn (personal brand), Referral/Word-of-Mouth | Client businesses need local visibility and trust. Google Ads captures "near me" and service-specific search intent. Email nurtures leads over longer sales cycles. LinkedIn establishes expertise. |
| **Tier 2** | Content Marketing (case studies, portfolio), Directories (Clutch, UpCity, industry-specific), Partnerships (complementary services), Google Business Profile | Case studies build credibility. Directories generate inbound leads. Partnerships with non-competing agencies (design + development, etc.) create referral pipelines. |
| **Tier 3** | Social Media (LinkedIn posts, Instagram portfolio), Webinars/Workshops, PR (local media), Paid Social (retargeting) | Social media showcases work. Webinars position you as an expert. Local PR builds community awareness. |
| **Avoid** | TikTok, Hacker News, Product Hunt, Reddit (unless relevant niche), App Store Optimization | These channels do not reach local business buyers or agency clients. |

**Client Site-Specific Strategy Notes:**
- Your portfolio IS your marketing. Every completed project should become a case study with before/after metrics.
- Google Business Profile is free and critically important for local services. Optimize it fully.
- Referral programs for existing clients (offer a discount for referring new business) are the highest-converting channel.
- Testimonials and case studies convert better than any ad. Collect them systematically.

<!-- ENDIF -->

---

## Budget Tier Channel Recommendations

### Bootstrap ($0/mo)

**Maximum active channels:** 2-3 (limited by time, not money)

| Priority | Channel | Why It's Free |
|----------|---------|--------------|
| 1 | Email list + landing page | Free tiers of Mailchimp/ConvertKit/Buttondown support 500-2K subscribers |
| 2 | SEO + Content | Writing your own blog posts costs nothing but time |
| 3 | Social media (1 platform) | Organic posting is free; pick ONE platform where your audience lives |
| 4 | Community participation | Reddit, Hacker News, forums — free to participate |
| 5 | Product Hunt (one-time) | Free to launch; time investment for preparation |

**Bootstrap Rule:** You cannot afford to be on every channel. Pick 2-3, do them well, and ignore everything else. Spreading thin across 8 free channels is worse than owning 2.

---

### Small ($100-500/mo)

**Maximum active channels:** 3-4

| Priority | Channel | Budget Allocation |
|----------|---------|------------------|
| 1 | Everything from Bootstrap | $0 |
| 2 | SEO tool (Ahrefs Lite or Ubersuggest) | $29-99/mo |
| 3 | Email tool upgrade (more subscribers) | $20-50/mo |
| 4 | Small paid ad experiments | $100-300/mo (Google Ads or Meta Ads — pick ONE) |
| 5 | Social scheduling tool | $15-30/mo (Buffer or Hootsuite) |

---

### Medium ($500-2,000/mo)

**Maximum active channels:** 4-6

| Priority | Channel | Budget Allocation |
|----------|---------|------------------|
| 1 | SEO + content (possibly freelance writer) | $200-500/mo |
| 2 | Paid search or paid social (pick ONE to start) | $300-800/mo |
| 3 | Email marketing (automation) | $50-100/mo |
| 4 | Tools (SEO, analytics, social) | $100-200/mo |
| 5 | Directory premium listings | $50-100/mo |
| 6 | Influencer experiments (micro-influencers) | $100-300/mo |

---

### Growth ($2,000-10,000/mo)

**Maximum active channels:** 6-8

| Priority | Channel | Budget Allocation |
|----------|---------|------------------|
| 1 | Content production (in-house or freelance team) | $500-2000/mo |
| 2 | Paid advertising (search + social, possibly both) | $1000-5000/mo |
| 3 | Influencer/partnerships | $500-1500/mo |
| 4 | Tools and platforms | $200-500/mo |
| 5 | Community platform (Circle, Discord Nitro) | $50-100/mo |
| 6 | Video production | $200-500/mo |
| 7 | PR (DIY or freelance PR consultant) | $500-1000/mo |

---

### Scale ($10,000+/mo)

At this budget, you should have dedicated marketing personnel (in-house or agency). The channel mix is heavily customized to your specific product, audience, and growth stage. General guidance:
- 40-50% on paid acquisition (search + social + retargeting)
- 20-25% on content and SEO (writers, editors, designers)
- 10-15% on tools and platforms
- 10-15% on brand awareness (PR, events, sponsorships)
- 5-10% on experimental channels

---

## Priority Ranking System

After filtering channels by product type and budget, score each remaining channel on these 5 criteria (1-5 scale):

| Criteria | 1 (Low) | 5 (High) |
|----------|---------|----------|
| **Audience Fit** | Your audience barely uses this channel | Your audience lives on this channel |
| **Competitive Gap** | Every competitor dominates this channel | No competitor has invested here |
| **Cost Efficiency** | High cost, uncertain returns | Low cost, predictable returns |
| **Time to Impact** | 6+ months before results | Results within 2-4 weeks |
| **Sustainability** | One-time spike, no compounding | Compounds over time (SEO, email list, community) |

**Total score = Audience Fit + Competitive Gap + Cost Efficiency + Time to Impact + Sustainability**

- **20-25 points:** Tier 1 — Start immediately
- **14-19 points:** Tier 2 — Add in month 2-3
- **8-13 points:** Tier 3 — Scale later
- **Below 8:** Skip entirely

---

## Anti-Patterns: Channels to AVOID by Product Type

These are not just "less effective" — they are actively harmful or wasteful for the given product type:

| Product Type | Avoid | Why |
|-------------|-------|-----|
| **SaaS (B2B)** | TikTok, Instagram (unless visual product), Cold calling | Your buyers are not there. Cold calling burns bridges. |
| **SaaS (B2C)** | LinkedIn Ads (too expensive for B2C), Webinars (B2C consumers skip these) | Cost per lead is too high on LinkedIn for B2C. Consumers don't attend webinars. |
| **Mobile App** | LinkedIn, Paid Search (expensive CPIs), Long-form blog content | These channels do not drive app installs efficiently. |
| **Marketplace** | Single-channel focus (you need both sides) | Investing 100% in demand with no supply (or vice versa) kills marketplaces. |
| **Dev Tool** | Any form of paid advertising, Corporate-speak content, Cold email | Developers actively distrust and block ads. Corporate content gets zero engagement. Cold email gets you blocked. |
| **Client Site** | TikTok, Product Hunt, Hacker News, Mass email | Your buyers are local business owners, not the tech audience on these platforms. |

### Universal Anti-Patterns (Never Do These)

1. **Spreading across 10+ channels simultaneously.** You will do all of them poorly. Start with 2-3, master them, then expand.
2. **Running paid ads before validating messaging organically.** If your organic content doesn't resonate, paying to amplify it just wastes money faster.
3. **Ignoring email collection.** Every marketing activity should capture an email address. Social followers can disappear overnight. Email subscribers are yours.
4. **Copying a competitor's strategy without understanding why it works for them.** A competitor with 50,000 Twitter followers built that over 5 years. You cannot replicate their strategy in 2 months.
5. **Marketing before the product delivers value.** Driving traffic to a product that churns users on day one is worse than no traffic at all. Fix onboarding first.
6. **Buying followers, reviews, or upvotes.** Platforms detect and penalize fake engagement. It destroys credibility and wastes money.

---

## Decision Tree: Quick-Start Flowchart

For Claude to execute during Step 20:

```
START
│
├─ What is {{PRODUCT_TYPE}}?
│   ├─ saas → Load SaaS matrix
│   ├─ mobile_app → Load Mobile App matrix
│   ├─ marketplace → Load Marketplace matrix
│   ├─ dev_tool → Load Dev Tool matrix
│   └─ client_site → Load Client Site matrix
│
├─ What is {{MARKETING_BUDGET}}?
│   ├─ bootstrap → Limit to Tier 1 channels only (max 2-3)
│   ├─ small → Tier 1 + one Tier 2 channel (max 3-4)
│   ├─ medium → Tier 1 + Tier 2 channels (max 4-6)
│   ├─ growth → Tier 1 + Tier 2 + one Tier 3 channel (max 6-8)
│   └─ scale → All tiers, customized allocation
│
├─ What is {{WEEKLY_MARKETING_HOURS}}?
│   ├─ 0-2 → Remove all channels requiring 3+ hrs/week
│   ├─ 2-5 → Remove channels requiring 5+ hrs/week
│   ├─ 5-10 → All channels viable
│   └─ 10+ → All channels viable + can manage community
│
├─ Score remaining channels (5 criteria x 1-5 scale)
│
├─ Assign tiers based on score
│
├─ Check against anti-patterns → Remove any flagged channels
│
└─ OUTPUT: Ranked channel list with tier assignments
   Write to: marketing/channels/channel-priority-matrix.md
```

---

## Output Format

After running the decision tree, Claude generates `marketing/channels/channel-priority-matrix.md` with this structure:

```markdown
# Channel Priority Matrix for {{PROJECT_NAME}}

**Product Type:** {{PRODUCT_TYPE}}
**Budget Tier:** {{MARKETING_BUDGET}}
**Weekly Hours Available:** {{WEEKLY_MARKETING_HOURS}}

## Tier 1: Start Immediately
1. [Channel] — Score: [X/25] — Est. monthly cost: $[X] — Est. hours/week: [X]
   Rationale: [Why this channel is highest priority for this product]
2. ...

## Tier 2: Add in Month 2-3
3. [Channel] — Score: [X/25] — Est. monthly cost: $[X] — Est. hours/week: [X]
   Rationale: [Why this is second priority]
4. ...

## Tier 3: Scale Later
5. [Channel] — Score: [X/25] — Est. monthly cost: $[X] — Est. hours/week: [X]
6. ...

## Channels Eliminated
- [Channel] — Eliminated because: [reason — budget, time, product type mismatch, anti-pattern]
- ...

## Estimated Total Monthly Investment
- Tools: $[X]/mo
- Ads: $[X]/mo
- Content: $[X]/mo
- Time: [X] hrs/week
- **Total: $[X]/mo + [X] hrs/week**
```
