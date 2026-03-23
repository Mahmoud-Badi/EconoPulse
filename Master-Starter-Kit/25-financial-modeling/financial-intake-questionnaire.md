# Financial Modeling Intake Questionnaire

> **When:** Step 17.5 (mandatory for all projects)
> **Format:** All questions use AskUserQuestion with selectable options + brief explainers
> **Flow:** 20 core questions → optional deep-dive branches the user can opt into
> **Output:** Populates financial placeholders used across all financial modeling templates

---

## Why This Is Mandatory

Financial modeling isn't just for fundraising. Every project has costs, every project needs a path to sustainability. Even a free open-source tool needs to understand hosting costs vs. budget. Skipping this step means:
- No infrastructure cost awareness (surprise $500/mo Vercel bill at 10K users)
- No pricing validation (is your $10/mo plan actually profitable after CAC?)
- No runway visibility (you don't know when you run out of money)
- No investor readiness (even bootstrapped founders need to understand unit economics)

---

## Intake Protocol

Present questions in 4 blocks using AskUserQuestion. Each question has a brief "why this matters" explainer so non-financial-experts understand the impact.

After the 4 core blocks (20 questions), offer optional deep-dive branches.

---

## Block 1: Revenue Model (5 Questions)

### Q1: How do you make money?

**Why this matters:** Your entire financial model structure changes based on this. Subscription models need churn analysis; marketplaces need take rate modeling; one-time purchases need volume projections.

AskUserQuestion options:
- **Subscription SaaS** — Monthly/annual recurring revenue from software access
- **Usage-based** — Customers pay per API call, transaction, or unit of consumption
- **Marketplace / Commission** — You take a percentage of transactions between buyers and sellers
- **One-time purchase** — Customers pay once for a product or license
- **Freemium + Premium** — Free tier with paid upgrades for advanced features
- **Ad-supported** — Revenue from advertising, users access for free
- **Hybrid** — Multiple revenue streams combined

→ Populates: `{{MONETIZATION_MODEL}}`

### Q2: What's your target price range per customer per month?

**Why this matters:** Your pricing determines your entire go-to-market strategy. Under $50/mo = self-serve (marketing-driven). Over $500/mo = sales-assisted. Over $5K/mo = enterprise sales team required.

AskUserQuestion options:
- **$0-10/mo** — Mass-market, high volume needed to break even
- **$10-50/mo** — SMB sweet spot, self-serve with some support
- **$50-200/mo** — Mid-market, onboarding matters, lower churn tolerance
- **$200-1,000/mo** — Enterprise-adjacent, sales-assist likely needed
- **$1,000+/mo** — Enterprise, dedicated sales and success required
- **Don't know yet** — We'll estimate based on your market and competitors

→ Populates: `{{PRICE_RANGE}}`

### Q3: What billing cycle will you offer?

**Why this matters:** Annual billing improves cash flow (you get 12 months upfront) but requires more trust. Monthly is easier to sell but increases churn. Most SaaS offers both with an annual discount (typically 15-20%).

AskUserQuestion options:
- **Monthly only** — Lower commitment, higher churn risk
- **Annual only** — Better cash flow, harder initial sell
- **Both (monthly + annual discount)** — Most common SaaS approach
- **Usage-based billing** — Pay-as-you-go, invoiced monthly

→ Populates: `{{BILLING_CYCLE}}`

### Q4: Will you offer a free tier or trial?

**Why this matters:** Free tiers are great for adoption but dangerous for economics — most free users never convert. Trials create urgency but need careful activation design. The trial-to-paid conversion rate is one of the most important metrics in your model.

AskUserQuestion options:
- **Free tier forever** — Generous free plan, monetize power users
- **7-day trial** — Short, creates urgency, best for simple products
- **14-day trial** — Standard B2B SaaS trial length
- **30-day trial** — Common for complex products that need onboarding
- **No free option** — Premium positioning, every user pays from day one

→ Populates: `{{FREE_TIER_MODEL}}`

### Q5: What's your expected average revenue per user (ARPU)?

**Why this matters:** ARPU is the single most important number in your financial model. It determines how many customers you need to hit revenue targets. $15 ARPU means you need 6,667 paying users for $100K MRR. $150 ARPU means you need 667.

AskUserQuestion options:
- **~$5/mo** — High-volume consumer or very basic SaaS
- **~$15/mo** — Standard SMB SaaS (Notion, Figma tier)
- **~$50/mo** — Professional/team tools (Slack, Linear tier)
- **~$100/mo** — Mid-market (HubSpot starter tier)
- **~$500/mo** — Enterprise-adjacent
- **Let me calculate** — I'll work through it with competitive pricing data

→ Populates: `{{AVERAGE_REVENUE_PER_USER}}`

---

## Block 2: Market & Audience (5 Questions)

### Q6: What's your target geography?

**Why this matters:** Geography affects everything — payment methods, tax compliance, pricing (purchasing power parity), CAC (US ads cost 5-10x India), and regulatory requirements (GDPR for EU, CCPA for California).

AskUserQuestion options:
- **Single country** — Focused launch, simpler compliance
- **Single continent** — Regional expansion (e.g., all of Europe)
- **Global** — Worldwide availability from day one
- **Local / city-level** — Hyperlocal product (delivery, services)

→ Populates: `{{TARGET_GEOGRAPHY}}`

### Q7: Which regions will you target? (multi-select)

**Why this matters:** Each region has different unit economics. US customers typically have higher ARPU but higher CAC. European customers require GDPR compliance costs. APAC markets may need local payment processors.

AskUserQuestion (multi-select) options:
- **North America** (US, Canada)
- **Europe** (EU, UK, Nordics)
- **UK** (separate for post-Brexit compliance)
- **APAC** (Australia, Japan, Singapore, Korea)
- **MENA** (Middle East, North Africa)
- **LATAM** (Central and South America)
- **Africa**

→ Populates: `{{TARGET_REGIONS}}`

### Q8: How large is your total addressable market (TAM)?

**Why this matters:** TAM determines your ceiling. If you're targeting 10K total businesses, capturing 10% = 1,000 customers max. If targeting 10M, you have more room. Investors use TAM to assess opportunity size — but they discount unrealistic TAMs heavily.

AskUserQuestion options:
- **< 10K potential customers** — Niche, every customer matters, high-touch
- **10K - 100K** — Focused market, can win with positioning
- **100K - 1M** — Large enough for VC interest
- **1M - 10M** — Mass-market opportunity
- **10M+** — Massive market, will face well-funded competition
- **Don't know — help me estimate** — We'll size it from industry data

→ Populates: `{{TAM_SIZE}}`

### Q9: Is this B2B or B2C?

**Why this matters:** B2B and B2C have fundamentally different economics. B2B: higher ARPU, longer sales cycles, lower churn, relationship-driven. B2C: lower ARPU, instant decisions, higher churn, brand-driven. B2B2C is the hardest — you need both motions.

AskUserQuestion options:
- **B2B** — Selling to businesses (departments, teams, companies)
- **B2C** — Selling to individual consumers
- **B2B2C** — Your business customers use your product to serve their consumers
- **Prosumer / Enthusiast** — Individuals who behave like businesses (freelancers, creators, hobbyists with budgets)

→ Populates: `{{BUSINESS_MODEL_TYPE}}`

### Q10: What's your expected average deal size / customer lifetime value?

**Why this matters:** Lifetime value determines how much you can afford to spend acquiring a customer (CAC). The golden rule: LTV should be at least 3x CAC. If your LTV is $300, you can't spend more than $100 to acquire each customer.

AskUserQuestion options:
- **< $100** — Very low touch, self-serve only, need massive volume
- **$100 - $1K** — SMB, content marketing and product-led growth
- **$1K - $10K** — Mid-market, inside sales may be needed
- **$10K - $100K** — Enterprise, dedicated sales required
- **$100K+** — Large enterprise, long sales cycles, custom deals

→ Populates: `{{DEAL_SIZE}}`

---

## Block 3: Conversion Funnel (5 Questions)

### Q11: What's your primary acquisition channel?

**Why this matters:** Your acquisition channel determines your CAC. Organic/SEO is cheapest but slowest. Paid ads are fastest but most expensive. Community/word-of-mouth is most sustainable but hardest to scale. Your financial model needs to project costs differently for each channel.

AskUserQuestion options:
- **Organic / SEO** — Content-driven, long-term, lowest CAC ($5-50)
- **Paid ads** — Google/Meta/LinkedIn ads, fastest but expensive ($50-500+ CAC)
- **Community / word-of-mouth** — Forums, Discord, social — free but slow
- **Partnerships** — Resellers, integrations, co-marketing
- **Sales team** — Outbound sales, demos, proposals
- **Product-led growth** — Free tier → viral loops → upgrade

→ Populates: `{{PRIMARY_ACQUISITION_CHANNEL}}`

### Q12: What visitor → signup conversion rate do you expect?

**Why this matters:** This is the top of your funnel. Industry averages: SaaS landing pages convert at 3-5%, freemium products at 5-10%, enterprise products at 1-2%. If you're below these, your marketing is the bottleneck. If you're above, your product has strong pull.

AskUserQuestion options:
- **1-2%** — Typical for enterprise or high-consideration purchases
- **3-5%** — Standard SaaS landing page performance
- **5-10%** — Strong for freemium or viral products
- **10%+** — Exceptional, usually from referral or community traffic
- **No idea** — We'll use industry benchmarks for your segment

→ Populates: `{{VISITOR_TO_SIGNUP_RATE}}`

### Q13: What signup → paid conversion rate do you expect?

**Why this matters:** This is the most critical conversion in your model. A 3% trial-to-paid rate with $50 ARPU means you need 667 signups per $1K MRR. A 25% rate means you need only 80. Small improvements here have massive revenue impact.

AskUserQuestion options:
- **1-3%** — Freemium with large free user base (Spotify model)
- **3-10%** — Standard for freemium SaaS
- **10-25%** — Good for trial-based SaaS with strong onboarding
- **25-50%** — Excellent, usually sales-assisted or high-intent traffic
- **50%+** — Enterprise or highly qualified lead flow
- **No idea** — We'll use benchmarks and adjust as data comes in

→ Populates: `{{SIGNUP_TO_PAID_RATE}}`

### Q14: What monthly churn rate do you expect?

**Why this matters:** Churn is the silent killer. 5% monthly churn means you lose half your customers every year. 2% monthly churn means ~22% annual churn — acceptable for SMB SaaS. Below 1% monthly = best-in-class. Your churn rate determines whether growth compounds or plateaus.

AskUserQuestion options:
- **< 2%/mo** — Best-in-class SaaS (enterprise, high switching costs)
- **2-5%/mo** — Acceptable for SMB SaaS
- **5-10%/mo** — Warning zone — product-market fit may be weak
- **10-15%/mo** — Red flag — retention problem needs solving before scaling
- **15%+/mo** — Critical — do not invest in acquisition until churn is fixed
- **No idea** — We'll model scenarios at 3%, 5%, and 8%

→ Populates: `{{EXPECTED_CHURN_RATE}}`

### Q15: What's the key conversion step beyond signup?

**Why this matters:** The "aha moment" — the action that predicts whether a user will stay and pay. For Slack, it's sending 2,000 messages. For Dropbox, it's uploading a file. Your financial model needs to track this because users who don't reach this step will churn.

AskUserQuestion options:
- **Onboarding complete** — User finishes setup wizard
- **First value moment** — User gets their first meaningful result
- **Upgrade to paid** — Conversion from free to paying
- **Invite team member** — Social proof of value (viral expansion)
- **Connect integration** — Product becomes embedded in workflow

→ Populates: `{{KEY_CONVERSION_STEP}}`

---

## Block 4: Costs & Runway (5 Questions)

### Q16: What's your current cash position?

**Why this matters:** Cash determines how long you can operate before needing revenue or funding. This feeds directly into runway calculations. Be honest — optimistic cash projections kill startups.

AskUserQuestion options:
- **Bootstrapped / no funding** — Operating on personal savings or revenue
- **< $50K** — Very early, tight runway
- **$50K - $250K** — Pre-seed or angel funding
- **$250K - $1M** — Seed level
- **$1M - $5M** — Post-seed or Series A
- **$5M+** — Well-funded, focus on growth metrics

→ Populates: `{{CASH_POSITION}}`

### Q17: What's your current monthly burn rate?

**Why this matters:** Burn rate = how fast you're spending. Cash / monthly burn = runway in months. 18+ months of runway is comfortable. Under 6 months is emergency territory. This is the most important number for survival.

AskUserQuestion options:
- **Solo founder (< $1K/mo)** — Personal time only, minimal cash costs
- **< $5K/mo** — Small team, minimal infrastructure
- **$5K - $20K/mo** — Growing team, real infrastructure costs
- **$20K - $50K/mo** — Funded startup burn rate
- **$50K+/mo** — Post-seed / Series A burn rate

→ Populates: `{{MONTHLY_BURN}}`

### Q18: What's your biggest cost category?

**Why this matters:** Knowing where money goes tells us where optimization matters most. If 70% of burn is salaries, hiring decisions are financial decisions. If 50% is infrastructure, scaling efficiency is critical. If 40% is marketing, CAC optimization is the priority.

AskUserQuestion options:
- **Infrastructure / Hosting** — Servers, databases, API costs
- **Salaries / Contractors** — Team compensation
- **Marketing / Ads** — Customer acquisition spend
- **Software / Tools** — SaaS subscriptions for development and operations
- **AI / API costs** — LLM inference, model training, API calls

→ Populates: `{{BIGGEST_COST_CATEGORY}}`

### Q19: When do you expect to generate revenue?

**Why this matters:** Pre-revenue companies need runway modeling. Revenue-generating companies need growth modeling. The gap between "now" and "revenue" is how much cash you need to survive.

AskUserQuestion options:
- **Already generating revenue** — Focus on growth and unit economics
- **0-3 months** — Imminent launch, focus on pricing and conversion
- **3-6 months** — Building mode, focus on runway and milestones
- **6-12 months** — Early stage, focus on fundraising timing
- **12+ months** — Pre-product, need significant runway or funding

→ Populates: `{{REVENUE_TIMELINE}}`

### Q20: What are your fundraising plans?

**Why this matters:** Bootstrapped companies optimize for profitability. Funded companies optimize for growth metrics. Your financial model priorities change completely based on this — investors want NRR and growth rate, bootstrappers want margin and break-even.

AskUserQuestion options:
- **Bootstrapping forever** — No external funding, profit-first
- **Seeking pre-seed** — < $500K, usually angels or accelerators
- **Seeking seed** — $500K - $3M, institutional seed funds
- **Seeking Series A** — $3M - $15M, growth-stage VCs
- **Already funded** — Focus on deploying capital efficiently

→ Populates: `{{FUNDRAISING_STAGE}}`

---

## Optional Deep-Dive Branches

After the 20 core questions, present via AskUserQuestion (multi-select):

**"Want to model any of these in more detail?"**

- **Geo-specific economics** → Opens 5-8 additional questions about regional pricing, payment processors, tax implications, FX considerations. Generates `geo-specific-economics.md`.
- **Detailed conversion funnels** → Opens 5-8 questions about multi-stage funnel metrics, cohort decay, channel-specific conversion rates. Generates `conversion-funnel-deep-model.md`.
- **Investor metrics** → Opens 5-8 questions about Rule of 40 inputs, burn multiple, magic number, NRR components. Enhances `investor-metrics-dashboard.md`.
- **Infrastructure costs** → Opens 5-8 questions about hosting tiers, API costs per request, storage costs, scaling inflection points. Generates `infrastructure-cost-model.md`. Auto-populates from `CONFIG.STACK`.
- **P&L / Cash flow statement** → Opens 8-12 questions about COGS breakdown, OpEx categories, CapEx, depreciation. Generates `pnl-cash-flow-statement.md`.
- **Team hiring plan** → Opens 5-8 questions about roles, timing, geography, compensation ranges. Generates `team-cost-projection.md`.
- **None — core questions are enough** → Proceed with the 20 core inputs.

Each deep-dive branch follows the same AskUserQuestion format with brief explainers.

---

## Output

After intake, generate the following financial documents from templates in `25-financial-modeling/`:

| Condition | Templates to Generate |
|---|---|
| Always | `revenue-projection.md`, `unit-economics-calculator.md`, `runway-burn-rate.md` |
| If monetization model is subscription/freemium | `pricing-financial-analysis.md`, `freemium-trial-conversion-modeling.md` |
| If fundraising stage is seed/series-a | `investor-metrics-dashboard.md`, `sensitivity-analysis.md` |
| If user opted into deep-dives | Corresponding deep-dive templates |
| If tech stack is known | `infrastructure-cost-model.md` (auto-populated from `stack-cost-mapping.md`) |

All generated documents go to `dev_docs/financial-modeling/`.
