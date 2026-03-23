# Market Sizing Analysis: {{PROJECT_NAME}}

> **Purpose:** Estimate the revenue opportunity for {{PROJECT_NAME}} using TAM/SAM/SOM methodology.
> This framework helps you understand how big your market really is, justify your business model,
> and set realistic revenue targets. Investors, partners, and your own strategic planning all depend
> on credible market sizing.
>
> **Last Updated:** {{DATE}}
> **Prepared By:** {{AUTHOR_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Industry Vertical:** {{INDUSTRY_VERTICAL}}

---

## Table of Contents

1. [Market Sizing Overview](#1-market-sizing-overview)
2. [Step 1: Define Your Market](#2-step-1-define-your-market)
3. [Step 2: Total Addressable Market (TAM)](#3-step-2-total-addressable-market-tam)
4. [Step 3: Serviceable Addressable Market (SAM)](#4-step-3-serviceable-addressable-market-sam)
5. [Step 4: Serviceable Obtainable Market (SOM)](#5-step-4-serviceable-obtainable-market-som)
6. [Top-Down Estimation Method](#6-top-down-estimation-method)
7. [Bottom-Up Estimation Method](#7-bottom-up-estimation-method)
8. [Data Sources for Market Research](#8-data-sources-for-market-research)
9. [Industry Benchmarks by Product Type](#9-industry-benchmarks-by-product-type)
10. [Market Growth Rate Estimation](#10-market-growth-rate-estimation)
11. [Revenue Potential Calculation](#11-revenue-potential-calculation)
12. [Competitive Density Assessment](#12-competitive-density-assessment)
13. [Example Calculations](#13-example-calculations)
14. [Your Market Sizing Summary](#14-your-market-sizing-summary)

---

## 1. Market Sizing Overview

Market sizing is not about guessing a number -- it is about building a defensible, logical argument for how large your opportunity is. There are three concentric circles:

```
+-----------------------------------------------+
|                                                 |
|   TAM (Total Addressable Market)                |
|   = Everyone who could theoretically buy        |
|                                                 |
|     +-------------------------------------+     |
|     |                                     |     |
|     |  SAM (Serviceable Addressable)      |     |
|     |  = People you can actually reach    |     |
|     |                                     |     |
|     |    +---------------------------+    |     |
|     |    |                           |    |     |
|     |    |  SOM (Serviceable         |    |     |
|     |    |  Obtainable Market)       |    |     |
|     |    |  = What you can           |    |     |
|     |    |    realistically capture  |    |     |
|     |    +---------------------------+    |     |
|     +-------------------------------------+     |
+-----------------------------------------------+
```

**Key principle:** Always present all three numbers. TAM alone is meaningless ("the global software market is $500B!" tells investors nothing). SOM is what actually drives your financial projections.

---

## 2. Step 1: Define Your Market

Before calculating anything, precisely define what market you are in. A vague definition leads to inflated, non-credible numbers.

### Market Definition Worksheet

| Question | Your Answer |
|----------|-------------|
| What problem does {{PROJECT_NAME}} solve? | {{CORE_PROBLEM}} |
| Who experiences this problem most acutely? | {{PRIMARY_AUDIENCE}} |
| What do they currently pay to solve it? | {{CURRENT_SPEND}} |
| What category does {{PROJECT_NAME}} belong to? | {{MARKET_CATEGORY}} |
| What adjacent categories overlap? | {{ADJACENT_CATEGORIES}} |
| Geographic scope (initial launch)? | {{GEOGRAPHIC_SCOPE}} |
| Geographic scope (long-term)? | {{LONG_TERM_GEOGRAPHY}} |
| Company size / user type you target? | {{TARGET_SEGMENT}} |
| Are there regulatory constraints limiting your market? | {{REGULATORY_CONSTRAINTS}} |

### Avoid These Market Definition Mistakes

1. **Too broad:** "We are in the $500B enterprise software market" -- this is meaningless unless you sell to every enterprise for every use case.
2. **Too narrow:** "We sell to left-handed graphic designers in Portland" -- your market is so small that it may not be worth pursuing.
3. **Category confusion:** Make sure you are sizing the right category. A project management tool competes in "project management software," not "all productivity software."
4. **Mixing B2B and B2C:** If you sell to businesses, size the business market. If you sell to consumers, size the consumer market. Do not blend them unless your model genuinely serves both.

---

## 3. Step 2: Total Addressable Market (TAM)

**Definition:** The total revenue opportunity if you captured 100% of the market with zero competition. This is theoretical maximum demand.

### TAM Formula

```
TAM = Total number of potential customers x Average annual revenue per customer
```

### How to Calculate TAM for {{PROJECT_NAME}}

| Input | Value | Source |
|-------|-------|--------|
| Total potential customers worldwide | {{TAM_CUSTOMER_COUNT}} | {{TAM_CUSTOMER_SOURCE}} |
| Average revenue per customer per year | {{TAM_ARPU}} | {{TAM_ARPU_SOURCE}} |
| **TAM (calculated)** | **{{TAM_TOTAL}}** | |

### Alternative TAM Calculation (Industry Reports)

If reliable industry reports exist for your category, you can use their published TAM directly:

| Report Source | Published TAM | Year | CAGR | Projected TAM (5yr) |
|---------------|---------------|------|------|----------------------|
| {{REPORT_SOURCE_1}} | {{REPORT_TAM_1}} | {{REPORT_YEAR_1}} | {{REPORT_CAGR_1}} | {{PROJECTED_TAM_1}} |
| {{REPORT_SOURCE_2}} | {{REPORT_TAM_2}} | {{REPORT_YEAR_2}} | {{REPORT_CAGR_2}} | {{PROJECTED_TAM_2}} |
| {{REPORT_SOURCE_3}} | {{REPORT_TAM_3}} | {{REPORT_YEAR_3}} | {{REPORT_CAGR_3}} | {{PROJECTED_TAM_3}} |

**Sanity check:** If your TAM exceeds $1 trillion and you are a startup, you have defined your market too broadly.

---

## 4. Step 3: Serviceable Addressable Market (SAM)

**Definition:** The portion of TAM that your product and business model can actually serve given your specific features, pricing, geography, and go-to-market approach.

### SAM Filtering Criteria

Start with your TAM and apply filters to narrow it down:

| Filter | Rationale | Remaining Market |
|--------|-----------|------------------|
| Geographic filter | {{PROJECT_NAME}} launches in {{GEOGRAPHIC_SCOPE}} | {{SAM_AFTER_GEO}} |
| Language / localization | Product available in {{LANGUAGES}} | {{SAM_AFTER_LANG}} |
| Company size / user type | Targeting {{TARGET_SEGMENT}} | {{SAM_AFTER_SEGMENT}} |
| Technology compatibility | Requires {{TECH_REQUIREMENTS}} | {{SAM_AFTER_TECH}} |
| Price point filter | Your pricing excludes some segments | {{SAM_AFTER_PRICE}} |
| Regulatory / compliance | Cannot serve {{EXCLUDED_REGIONS_OR_INDUSTRIES}} | {{SAM_AFTER_REGULATORY}} |

### SAM Formula

```
SAM = TAM x Geographic % x Segment % x Tech Compatibility % x Price Fit %
```

### SAM Calculation for {{PROJECT_NAME}}

| Input | Value |
|-------|-------|
| TAM | {{TAM_TOTAL}} |
| Geographic reach (% of TAM) | {{GEO_PERCENT}}% |
| Target segment (% of geo-filtered) | {{SEGMENT_PERCENT}}% |
| Tech / platform compatibility | {{TECH_PERCENT}}% |
| Price point fit | {{PRICE_PERCENT}}% |
| **SAM (calculated)** | **{{SAM_TOTAL}}** |

---

## 5. Step 4: Serviceable Obtainable Market (SOM)

**Definition:** The realistic revenue you can capture in the near term (1-3 years), accounting for competition, your sales capacity, brand awareness, and go-to-market effectiveness.

### SOM Estimation Approaches

**Approach A: Market Share Method**

```
SOM = SAM x Expected Market Share %
```

Typical market share for new entrants by stage:
- Year 1: 1-3% of SAM (new product, building awareness)
- Year 2: 3-5% of SAM (product-market fit achieved)
- Year 3: 5-10% of SAM (scaling go-to-market)
- Mature: 10-25% of SAM (established player)

**Approach B: Capacity Method (Bottom-Up)**

```
SOM = (Sales capacity x Close rate x Average deal size) + (Organic leads x Conversion rate x Average deal size)
```

This is often more credible for investors because it is grounded in real operational assumptions.

**Approach C: Comparable Company Method**

Look at what similar companies at your stage have achieved:

| Comparable Company | Revenue at Similar Stage | Their SAM | Market Share Achieved |
|--------------------|--------------------------|-----------|----------------------|
| {{COMPARABLE_1}} | {{COMP_1_REVENUE}} | {{COMP_1_SAM}} | {{COMP_1_SHARE}}% |
| {{COMPARABLE_2}} | {{COMP_2_REVENUE}} | {{COMP_2_SAM}} | {{COMP_2_SHARE}}% |
| {{COMPARABLE_3}} | {{COMP_3_REVENUE}} | {{COMP_3_SAM}} | {{COMP_3_SHARE}}% |

### SOM Calculation for {{PROJECT_NAME}}

| Timeframe | SAM | Expected Market Share | SOM |
|-----------|-----|-----------------------|-----|
| Year 1 | {{SAM_TOTAL}} | {{YEAR1_SHARE}}% | {{SOM_YEAR1}} |
| Year 2 | {{SAM_TOTAL_Y2}} | {{YEAR2_SHARE}}% | {{SOM_YEAR2}} |
| Year 3 | {{SAM_TOTAL_Y3}} | {{YEAR3_SHARE}}% | {{SOM_YEAR3}} |

---

## 6. Top-Down Estimation Method

Start with the big picture and narrow down. Best when industry data exists.

### Step-by-Step Process

1. **Find the total industry revenue** for your category from analyst reports.
2. **Apply geographic filters** -- what percentage of the global market is in your target region?
3. **Apply segment filters** -- what percentage of the regional market matches your target customer?
4. **Apply product-fit filters** -- what percentage of the segment needs what you specifically offer?
5. **Apply capture rate** -- what percentage can you realistically win?

### Top-Down Calculation Template

```
Global market revenue:                    ${{GLOBAL_MARKET_REVENUE}}
  x Target geography %:                  x {{GEO_FILTER}}%
  = Regional market:                      ${{REGIONAL_MARKET}}
  x Target segment %:                    x {{SEGMENT_FILTER}}%
  = Segment market:                       ${{SEGMENT_MARKET}}
  x Product fit %:                       x {{PRODUCT_FIT_FILTER}}%
  = Addressable opportunity (SAM):        ${{TOP_DOWN_SAM}}
  x Realistic capture rate:              x {{CAPTURE_RATE}}%
  = Obtainable revenue (SOM):             ${{TOP_DOWN_SOM}}
```

### Strengths and Weaknesses of Top-Down

| Strengths | Weaknesses |
|-----------|------------|
| Quick to calculate | Can produce inflated numbers |
| Uses credible third-party data | Filters are subjective |
| Good for investor presentations | Does not account for operational constraints |
| Easy to benchmark against industry | May miss emerging or niche markets |

---

## 7. Bottom-Up Estimation Method

Start with your unit economics and scale up. More credible for early-stage companies.

### Step-by-Step Process

1. **Count your potential customers** in a specific, well-defined segment.
2. **Estimate willingness to pay** from surveys, competitor pricing, or customer interviews.
3. **Calculate per-customer revenue** including recurring and expansion revenue.
4. **Multiply customers x revenue** to get your addressable market.
5. **Apply conversion and reach rates** for realistic projections.

### Bottom-Up Calculation Template

```
Number of target companies/users:         {{BOTTOM_UP_CUSTOMERS}}
  x % who have the problem:              x {{PROBLEM_PREVALENCE}}%
  = Potential buyers:                     {{POTENTIAL_BUYERS}}
  x % who would consider a solution:     x {{SOLUTION_CONSIDERATION}}%
  = Reachable buyers:                    {{REACHABLE_BUYERS}}
  x Average annual contract value:       x ${{AVERAGE_ACV}}
  = Total addressable revenue:           ${{BOTTOM_UP_TAM}}
  x Expected win rate:                   x {{WIN_RATE}}%
  = Year 1 revenue potential:            ${{BOTTOM_UP_SOM}}
```

### Bottom-Up Data Collection Methods

| Data Point | How to Get It |
|------------|---------------|
| Number of target companies | LinkedIn Sales Navigator, industry databases, government census data |
| Problem prevalence | Customer interviews (aim for 20-30), survey data, industry reports |
| Willingness to pay | Van Westendorp price sensitivity analysis, competitor pricing benchmarks |
| Average contract value | Competitor pricing pages, sales conversations, industry benchmarks |
| Win rate | Industry averages (SaaS: 15-25%, Marketplace: 5-15%), refine with real data |

### Strengths and Weaknesses of Bottom-Up

| Strengths | Weaknesses |
|-----------|------------|
| Grounded in real data | Time-consuming to research |
| More credible to investors | May underestimate market |
| Directly tied to business model | Requires primary research |
| Easier to validate | Can miss adjacent opportunities |

**Best practice:** Calculate both top-down and bottom-up, then compare. If they are within 2-3x of each other, your estimates are in the right ballpark. If they differ by 10x, re-examine your assumptions.

---

## 8. Data Sources for Market Research

### Free Data Sources

| Source | What It Provides | URL |
|--------|-----------------|-----|
| U.S. Census Bureau | Industry statistics, business counts, demographics | census.gov |
| Bureau of Labor Statistics | Employment data, industry growth, wage data | bls.gov |
| Statista (free tier) | Basic market statistics, infographics | statista.com |
| Google Trends | Search interest over time, geographic distribution | trends.google.com |
| SimilarWeb (free tier) | Website traffic estimates, competitor benchmarks | similarweb.com |
| Crunchbase (free tier) | Startup funding data, company information | crunchbase.com |
| Product Hunt | New product launches, user interest signals | producthunt.com |
| Reddit / community forums | Qualitative demand signals, user complaints | reddit.com |
| SEC filings (EDGAR) | Public company financials, market commentary | sec.gov/edgar |
| World Bank Open Data | Global economic indicators | data.worldbank.org |
| Google Scholar | Academic research on market trends | scholar.google.com |
| LinkedIn | Company counts by industry, employee counts | linkedin.com |
| App Annie / Sensor Tower (free) | App market data, download estimates | sensortower.com |
| BuiltWith | Technology usage statistics across websites | builtwith.com |
| Stack Overflow Survey | Developer demographics, technology adoption | stackoverflow.com/survey |

### Paid Data Sources

| Source | Cost Range | What It Provides |
|--------|-----------|-----------------|
| Gartner | $2,000-30,000/yr | Magic quadrants, market forecasts, vendor analysis |
| Forrester | $2,000-25,000/yr | Market waves, total economic impact studies |
| IDC | $1,500-20,000/yr | Market share data, spending forecasts |
| Statista Premium | $500-5,000/yr | Comprehensive market statistics, reports |
| IBISWorld | $1,000-10,000/yr | Industry reports with detailed market sizing |
| Grand View Research | $3,000-5,000/report | Detailed market reports by segment |
| CB Insights | $5,000-50,000/yr | Startup market data, funding trends, analysis |
| PitchBook | $12,000-24,000/yr | Private company data, deal flow, valuations |
| SimilarWeb Pro | $200-800/mo | Detailed website traffic and competitive intelligence |
| SEMrush / Ahrefs | $100-400/mo | Search volume data as demand proxy |
| SpyFu | $40-80/mo | Competitor ad spend and keyword data |
| LinkedIn Sales Navigator | $80-135/mo | Precise company and contact counts for TAM |

### How to Use Search Volume as a Market Proxy

When industry reports do not exist for your niche, search volume can approximate demand:

```
Monthly search volume for "{{PRIMARY_KEYWORD}}":     {{SEARCH_VOLUME}}
  x 12 months:                                        {{ANNUAL_SEARCHES}}
  x Click-through rate (estimate 30% for top 3):      x 30%
  = Annual clicks (people seeking solutions):          {{ANNUAL_SEEKERS}}
  x Conversion rate (industry avg):                   x {{CONVERSION_RATE}}%
  = Potential annual customers:                        {{POTENTIAL_CUSTOMERS}}
  x Average revenue per customer:                     x ${{ARPU}}
  = Estimated addressable market:                     ${{SEARCH_BASED_TAM}}
```

---

## 9. Industry Benchmarks by Product Type

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### SaaS Benchmarks

| Metric | Early Stage | Growth Stage | Mature |
|--------|------------|--------------|--------|
| Annual growth rate | 100-300% | 50-100% | 20-40% |
| Net revenue retention | 90-100% | 100-120% | 110-130% |
| CAC payback period | 12-18 months | 8-12 months | 6-8 months |
| Gross margin | 60-70% | 70-80% | 80-90% |
| LTV:CAC ratio | 2:1 | 3:1 | 5:1+ |
| Average ACV (SMB) | $1,200-5,000 | $5,000-15,000 | $15,000-50,000 |
| Average ACV (Mid-market) | $15,000-50,000 | $50,000-150,000 | $100,000-500,000 |
| Average ACV (Enterprise) | $50,000-200,000 | $200,000-1,000,000 | $500,000+ |
| Win rate | 15-20% | 20-30% | 25-35% |
| Free-to-paid conversion | 2-5% | 5-10% | 7-15% |
| Trial-to-paid conversion | 10-20% | 15-30% | 25-40% |
| Monthly churn (SMB) | 3-7% | 2-5% | 1-3% |
| Monthly churn (Enterprise) | 0.5-2% | 0.5-1.5% | 0.3-1% |
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
### Mobile App Benchmarks

| Metric | Benchmark Range |
|--------|----------------|
| TAM calculation base | Smartphone users in target geography |
| Average revenue per user (ARPU) - Freemium | $0.50-5.00/month |
| Average revenue per user (ARPU) - Subscription | $5-30/month |
| Average revenue per user (ARPU) - Paid app | $1-10 one-time |
| Install-to-active-user rate | 20-40% |
| Day 1 retention | 25-40% |
| Day 7 retention | 10-20% |
| Day 30 retention | 5-15% |
| Free-to-paid conversion | 2-5% |
| Cost per install (organic) | $0 (but requires ASO investment) |
| Cost per install (paid - iOS) | $2-7 |
| Cost per install (paid - Android) | $1-4 |
| Viral coefficient (good) | 0.5-0.8 |
| Viral coefficient (exceptional) | 1.0+ |
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
### Marketplace Benchmarks

| Metric | Benchmark Range |
|--------|----------------|
| TAM calculation base | Total transaction volume in the category |
| Average take rate | 5-25% (varies by category) |
| Typical take rates by category | Services: 15-25%, Products: 5-15%, Digital: 20-30% |
| Liquidity threshold | 30-60% of listings result in transaction |
| Supply-side acquisition cost | $10-100 per provider |
| Demand-side acquisition cost | $5-50 per buyer |
| Time to liquidity | 6-18 months |
| Repeat transaction rate | 30-60% |
| Average order value growth | 10-20% per year with established users |
| Gross merchandise volume to revenue | GMV x Take Rate = Revenue |
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "ecommerce" -->
### E-Commerce Benchmarks

| Metric | Benchmark Range |
|--------|----------------|
| TAM calculation base | Total online spending in product category |
| Average conversion rate | 1-3% (varies by category) |
| Average order value | Varies by category ($30-200 typical) |
| Customer acquisition cost | $10-50 (organic), $30-150 (paid) |
| Customer lifetime value | 2-5x first purchase value |
| Repeat purchase rate | 20-40% |
| Cart abandonment rate | 60-80% |
| Email revenue contribution | 15-30% of total revenue |
| Gross margin | 40-60% (own products), 15-30% (resale) |
| Return rate | 5-15% (varies by category) |
<!-- ENDIF -->

### General Benchmarks (All Product Types)

| Metric | Benchmark |
|--------|-----------|
| Rule of thumb: SOM should be | 1-5% of SAM in Year 1 |
| Credible market share for new entrant | Under 10% in Year 1-2 |
| Market growth rate (high-growth tech) | 15-30% CAGR |
| Market growth rate (mature tech) | 5-10% CAGR |
| Investors want TAM of at least | $1B for venture-backed startups |
| Investors want SAM of at least | $100M-500M for venture-backed startups |
| Bootstrapped companies can thrive with SAM of | $10M-100M |

---

## 10. Market Growth Rate Estimation

Understanding whether your market is growing, flat, or shrinking is as important as the absolute size.

### Growth Rate Calculation

```
CAGR = (Ending Value / Beginning Value) ^ (1 / Number of Years) - 1
```

### Growth Rate Sources

| Method | How to Apply |
|--------|-------------|
| Industry reports | Use published CAGR from Gartner, Forrester, etc. |
| Search trend analysis | Track Google Trends data over 5 years for category keywords |
| Funding trend analysis | Track CB Insights / Crunchbase funding in your category |
| Job posting trends | Track LinkedIn job postings in your category (growing categories hire more) |
| Public company earnings | Read earnings calls of companies in your space for growth commentary |
| Adjacent market growth | If your specific market is new, look at growth rates of adjacent markets |

### Growth Rate Assessment for {{PROJECT_NAME}}

| Indicator | Data Point | Growth Signal |
|-----------|-----------|---------------|
| Industry report CAGR | {{INDUSTRY_CAGR}}% | {{CAGR_SIGNAL}} |
| Google Trends (5yr) | {{TRENDS_DIRECTION}} | {{TRENDS_SIGNAL}} |
| Category funding (YoY) | {{FUNDING_GROWTH}}% | {{FUNDING_SIGNAL}} |
| Job postings (YoY) | {{JOBS_GROWTH}}% | {{JOBS_SIGNAL}} |
| Related public co. revenue growth | {{PUBLIC_CO_GROWTH}}% | {{PUBLIC_SIGNAL}} |
| **Overall growth assessment** | | **{{OVERALL_GROWTH_ASSESSMENT}}** |

### Market Maturity Stage

Identify where your market sits on the adoption curve:

| Stage | Characteristics | Implications for {{PROJECT_NAME}} |
|-------|----------------|-----------------------------------|
| Emerging | Few competitors, low awareness, high risk/high reward | {{EMERGING_IMPLICATIONS}} |
| Growing | Increasing competition, rising demand, VC interest | {{GROWING_IMPLICATIONS}} |
| Mature | Established leaders, price competition, consolidation | {{MATURE_IMPLICATIONS}} |
| Declining | Shrinking demand, technology displacement | {{DECLINING_IMPLICATIONS}} |

**Your market is in the:** {{MARKET_MATURITY_STAGE}} stage.

---

## 11. Revenue Potential Calculation

### 5-Year Revenue Model

| Year | SOM Customers | ARPU | Gross Revenue | Growth Rate |
|------|---------------|------|---------------|-------------|
| Year 1 | {{Y1_CUSTOMERS}} | ${{Y1_ARPU}} | ${{Y1_REVENUE}} | -- |
| Year 2 | {{Y2_CUSTOMERS}} | ${{Y2_ARPU}} | ${{Y2_REVENUE}} | {{Y2_GROWTH}}% |
| Year 3 | {{Y3_CUSTOMERS}} | ${{Y3_ARPU}} | ${{Y3_REVENUE}} | {{Y3_GROWTH}}% |
| Year 4 | {{Y4_CUSTOMERS}} | ${{Y4_ARPU}} | ${{Y4_REVENUE}} | {{Y4_GROWTH}}% |
| Year 5 | {{Y5_CUSTOMERS}} | ${{Y5_ARPU}} | ${{Y5_REVENUE}} | {{Y5_GROWTH}}% |

### Revenue Scenarios

| Scenario | Assumptions | Year 3 Revenue |
|----------|-------------|----------------|
| Conservative | Low market share, high churn, slow growth | ${{CONSERVATIVE_Y3}} |
| Base Case | Moderate assumptions aligned with benchmarks | ${{BASE_Y3}} |
| Optimistic | Strong product-market fit, viral growth, low churn | ${{OPTIMISTIC_Y3}} |

### Unit Economics Validation

Make sure your market size implies viable unit economics:

```
Target Year 3 Revenue:                    ${{BASE_Y3}}
  / Average revenue per customer:         / ${{Y3_ARPU}}
  = Customers needed:                     {{CUSTOMERS_NEEDED}}
  x Customer acquisition cost:            x ${{CAC}}
  = Total acquisition spend required:     ${{TOTAL_ACQ_SPEND}}
  / Marketing budget (% of revenue):      / {{MARKETING_BUDGET_PCT}}%
  = Implied revenue to fund acquisition:  ${{IMPLIED_REVENUE}}
```

If the implied revenue needed exceeds your projections, your plan needs adjustment -- either lower CAC, raise prices, or find more efficient channels.

---

## 12. Competitive Density Assessment

How crowded is your market? This affects how realistic your SOM estimates are.

### Competitive Landscape Overview

| Metric | Value | Interpretation |
|--------|-------|----------------|
| Number of direct competitors | {{DIRECT_COMPETITOR_COUNT}} | {{COMPETITION_LEVEL}} |
| Number of well-funded competitors ($10M+ raised) | {{FUNDED_COMPETITOR_COUNT}} | {{FUNDING_THREAT}} |
| Market concentration (top 3 players' share) | {{TOP3_SHARE}}% | {{CONCENTRATION_LEVEL}} |
| New entrants in last 2 years | {{NEW_ENTRANTS}} | {{ENTRY_BARRIER_SIGNAL}} |
| Average competitor age | {{AVG_COMPETITOR_AGE}} years | {{MATURITY_SIGNAL}} |

### Competitive Density Rating

| Rating | Direct Competitors | Funded Competitors | Top 3 Share | Your Implication |
|--------|--------------------|--------------------|-------------|------------------|
| Low density (Blue ocean) | 0-3 | 0-1 | <30% | Easier to capture share; market may be unproven |
| Moderate density | 4-10 | 2-4 | 30-60% | Healthy competition validates market; differentiation needed |
| High density (Red ocean) | 10-25 | 5-10 | 60-80% | Strong differentiation required; niche strategy advisable |
| Saturated | 25+ | 10+ | 80%+ | Very hard to break in; consider adjacencies or disruption |

**Your market density:** {{MARKET_DENSITY_RATING}}

### Implications for Market Sizing

- If high density: Reduce your SOM estimate by {{DENSITY_ADJUSTMENT}}% to account for competitive pressure.
- If low density: Verify the market truly exists (maybe there is no demand, which is why there are few competitors).
- If moderate density: Your estimates are likely reasonable if well-researched.

---

## 13. Example Calculations

### Example 1: SaaS Project Management Tool

```
TAM (Top-Down):
  Global project management software market:         $7.0B (Grand View Research, 2024)

SAM:
  Focus: English-speaking markets (US, UK, CA, AU):   $7.0B x 45% = $3.15B
  Target: SMB segment (10-200 employees):             $3.15B x 30% = $945M
  Target: Technology companies:                        $945M x 25% = $236M

SOM (Year 1):
  Realistic market share for new entrant:              $236M x 1% = $2.36M

Bottom-Up Validation:
  Tech SMBs in target regions:                         120,000 companies
  % who actively use PM software:                      x 60% = 72,000
  % reachable via content marketing + sales:           x 5% = 3,600
  Expected conversion rate:                            x 3% = 108 customers
  Average annual contract value:                       x $2,400/yr
  Year 1 revenue:                                      = $259,200

Note: Bottom-up is lower because it reflects actual Year 1 operational capacity,
while top-down SOM of $2.36M represents what is addressable over 1-3 years.
```

### Example 2: Mobile Fitness App

```
TAM (Top-Down):
  Global fitness app market:                           $14.7B (2024)

SAM:
  Focus: US market:                                    $14.7B x 35% = $5.15B
  Target: Subscription fitness apps:                   $5.15B x 40% = $2.06B
  Target: Strength training niche:                     $2.06B x 15% = $309M

SOM (Year 1):
  New app market share:                                $309M x 0.5% = $1.5M

Bottom-Up Validation:
  US smartphone users interested in strength training: 25M
  % willing to pay for fitness app:                    x 8% = 2M
  % reachable through App Store + marketing:           x 2% = 40,000
  Expected install-to-subscriber conversion:           x 5% = 2,000
  Monthly subscription:                                x $9.99/mo
  Annual revenue per subscriber:                       x $119.88
  Retention over 12 months (average):                  x 50%
  Year 1 revenue:                                      = $119,880

Note: Mobile apps typically start much smaller and grow through
word-of-mouth and ASO. Year 1 revenue is often modest.
```

### Example 3: Freelancer-Client Marketplace

```
TAM (Top-Down):
  Global freelance platform market:                    $9.2B (2024)

SAM:
  Focus: US + EU markets:                              $9.2B x 55% = $5.06B
  Target: Design and creative freelancers:             $5.06B x 20% = $1.01B
  Revenue model: 15% take rate on transactions:        (applied to GMV, not market size)

GMV-Based Sizing:
  Total creative freelance spending (US + EU):         $45B
  % that flows through platforms:                      x 20% = $9B GMV
  Design-specific:                                     x 25% = $2.25B GMV
  Revenue at 15% take rate:                            = $337.5M (this is your SAM)

SOM (Year 1):
  New marketplace share:                               $337.5M x 0.3% = $1.01M

Bottom-Up Validation:
  Target: 500 freelancers on supply side (Year 1)
  Average monthly GMV per freelancer:                  $3,000
  Annual GMV:                                          x 12 = $36,000
  Total GMV (500 freelancers):                         = $18M
  Take rate:                                           x 15%
  Year 1 revenue:                                      = $2.7M

Note: Marketplace bottom-up tends to be higher because getting
500 quality suppliers is achievable; demand follows supply.
```

---

## 14. Your Market Sizing Summary

### Final Numbers for {{PROJECT_NAME}}

| Metric | Value | Methodology | Confidence |
|--------|-------|-------------|------------|
| **TAM** | ${{FINAL_TAM}} | {{TAM_METHOD}} | {{TAM_CONFIDENCE}} |
| **SAM** | ${{FINAL_SAM}} | {{SAM_METHOD}} | {{SAM_CONFIDENCE}} |
| **SOM (Year 1)** | ${{FINAL_SOM_Y1}} | {{SOM_METHOD}} | {{SOM_CONFIDENCE}} |
| **SOM (Year 3)** | ${{FINAL_SOM_Y3}} | {{SOM_METHOD}} | {{SOM_CONFIDENCE}} |
| Market Growth Rate | {{FINAL_CAGR}}% CAGR | {{CAGR_METHOD}} | {{CAGR_CONFIDENCE}} |
| Competitive Density | {{FINAL_DENSITY}} | Competitor count analysis | {{DENSITY_CONFIDENCE}} |

### Key Assumptions

1. {{ASSUMPTION_1}}
2. {{ASSUMPTION_2}}
3. {{ASSUMPTION_3}}
4. {{ASSUMPTION_4}}
5. {{ASSUMPTION_5}}

### Risks to These Estimates

| Risk | Impact on Market Size | Mitigation |
|------|----------------------|------------|
| {{RISK_1}} | {{RISK_1_IMPACT}} | {{RISK_1_MITIGATION}} |
| {{RISK_2}} | {{RISK_2_IMPACT}} | {{RISK_2_MITIGATION}} |
| {{RISK_3}} | {{RISK_3_IMPACT}} | {{RISK_3_MITIGATION}} |

### Next Steps

- [ ] Validate TAM with at least two independent data sources
- [ ] Conduct 15-20 customer interviews to validate willingness to pay
- [ ] Run a pricing survey (Van Westendorp or Gabor-Granger method)
- [ ] Cross-reference top-down and bottom-up estimates
- [ ] Build a sensitivity analysis with conservative / base / optimistic scenarios
- [ ] Update these numbers quarterly as you gain real market data
- [ ] Use actual customer acquisition data to refine SOM projections after launch

---

> **Template version:** 1.0
> **Part of:** {{PROJECT_NAME}} Master Starter Kit - Marketing Section
> **Related templates:** competitor-marketing-audit.template.md, audience-research.template.md, positioning-strategy.template.md
