# Compensation Framework

> Pay inequity is a termite — invisible until the structure collapses. This framework establishes salary bands, equity grants, benefits, and geographic adjustments before you make your first offer. Building the framework post-hoc means reverse-engineering fairness into decisions that were made without it. That never works cleanly.

---

## 1. Salary Band Structure

Salary bands define the minimum, midpoint, and maximum base compensation for each level. Bands should overlap slightly between adjacent levels to accommodate high performers who are not yet ready for promotion.

### Engineering IC Bands

| Level | Title | Band Minimum | Band Midpoint | Band Maximum | Band Width |
|-------|-------|-------------|---------------|-------------|------------|
| IC1 | Junior Engineer | {{IC1_MIN}} | {{IC1_MID}} | {{IC1_MAX}} | 20% |
| IC2 | Mid-Level Engineer | {{IC2_MIN}} | {{IC2_MID}} | {{IC2_MAX}} | 25% |
| IC3 | Senior Engineer | {{IC3_MIN}} | {{IC3_MID}} | {{IC3_MAX}} | 25% |
| IC4 | Staff Engineer | {{IC4_MIN}} | {{IC4_MID}} | {{IC4_MAX}} | 30% |
| IC5 | Principal Engineer | {{IC5_MIN}} | {{IC5_MID}} | {{IC5_MAX}} | 30% |
| IC6 | Distinguished Engineer | {{IC6_MIN}} | {{IC6_MID}} | {{IC6_MAX}} | 35% |

### Management Bands

| Level | Title | Band Minimum | Band Midpoint | Band Maximum | Band Width |
|-------|-------|-------------|---------------|-------------|------------|
| M1 | Engineering Manager | {{M1_MIN}} | {{M1_MID}} | {{M1_MAX}} | 25% |
| M2 | Director of Engineering | {{M2_MIN}} | {{M2_MID}} | {{M2_MAX}} | 30% |
| M3 | VP Engineering / CTO | {{M3_MIN}} | {{M3_MID}} | {{M3_MAX}} | 35% |

### Non-Engineering Bands

| Role Family | Junior | Mid | Senior | Lead |
|-------------|--------|-----|--------|------|
| Product Management | — | {{PM_MID_MIN}}-{{PM_MID_MAX}} | {{PM_SR_MIN}}-{{PM_SR_MAX}} | {{PM_LEAD_MIN}}-{{PM_LEAD_MAX}} |
| Product Design | {{DES_JR_MIN}}-{{DES_JR_MAX}} | {{DES_MID_MIN}}-{{DES_MID_MAX}} | {{DES_SR_MIN}}-{{DES_SR_MAX}} | {{DES_LEAD_MIN}}-{{DES_LEAD_MAX}} |
| Operations | {{OPS_JR_MIN}}-{{OPS_JR_MAX}} | {{OPS_MID_MIN}}-{{OPS_MID_MAX}} | {{OPS_SR_MIN}}-{{OPS_SR_MAX}} | {{OPS_LEAD_MIN}}-{{OPS_LEAD_MAX}} |
| Customer Support | {{CS_JR_MIN}}-{{CS_JR_MAX}} | {{CS_MID_MIN}}-{{CS_MID_MAX}} | {{CS_SR_MIN}}-{{CS_SR_MAX}} | — |

### Band Positioning Guidelines

| Where in Band | When to Use |
|---------------|-------------|
| **Below midpoint** (min to mid) | New to role, still developing proficiency. Typical for new hires who meet minimum requirements. |
| **At midpoint** | Fully proficient in the role. Meeting all expectations consistently. This is the target for most employees. |
| **Above midpoint** (mid to max) | Exceeding expectations, demonstrating next-level behaviors. Approaching readiness for promotion. |
| **At maximum** | Top performer at this level. If they are not being promoted, the compensation is capped — have the promotion conversation. |

### Band Review Cadence

- **Annual review:** Adjust bands based on market data. Minimum 3% increase to keep pace with inflation unless market data shows otherwise.
- **Triggered review:** When you lose 2+ candidates or employees to compensation in a single quarter, your bands may be below market.
- **Post-funding review:** After each funding round, review whether your {{COMPENSATION_MODEL}} still makes sense.

---

## 2. Geographic Adjustment Model

<!-- IF {{WORK_LOCATION_POLICY}} == "remote-first" -->
Remote-first teams must decide: pay by location, pay by role, or pay a blended rate. Each approach has trade-offs.
<!-- ENDIF -->

### Approach Options

| Approach | How It Works | Pros | Cons |
|----------|-------------|------|------|
| **Location-based** | Bands adjust by city/region cost of living | Fair relative to local market, lower cost for distributed teams | Complex to administer, creates "salary lottery" based on address |
| **National rate** | Same band regardless of location within a country | Simple, perceived as fair, no incentive to lie about location | Overpays in low-cost areas, may underpay in SF/NYC |
| **Role-based (global)** | Same band globally for same role and level | Maximum simplicity, strongest equity signal | Significant overpay in low-cost countries, may not be sustainable |

### City Tier Adjustments (If Using Location-Based)

| Tier | Example Cities | Adjustment Factor |
|------|---------------|-------------------|
| **Tier 1** (Highest cost) | San Francisco, New York, Seattle, London, Zurich | 1.00 (baseline) |
| **Tier 2** | Los Angeles, Boston, Washington DC, Toronto, Berlin | 0.90 - 0.95 |
| **Tier 3** | Austin, Denver, Chicago, Portland, Amsterdam | 0.80 - 0.90 |
| **Tier 4** | Salt Lake City, Raleigh, Minneapolis, Lisbon, Bucharest | 0.70 - 0.80 |
| **Tier 5** (Lowest cost) | Non-metro US, Latin America, Southeast Asia, Eastern Europe | 0.55 - 0.70 |

**How to apply:** Multiply the band midpoint by the adjustment factor. Example: IC3 midpoint of $180K in Tier 1 becomes $144K-$162K in Tier 3 (factor 0.80-0.90).

**Recommendation for most startups:** Use national rate within each country. Location-based pay creates resentment and administrative burden that is not worth the savings until you have 50+ employees across 3+ tiers.

---

## 3. Equity Compensation

### Equity Grant by Level

<!-- IF {{COMPENSATION_MODEL}} == "market-rate" -->
Standard equity grants with market-rate salary:
<!-- ENDIF -->

<!-- IF {{COMPENSATION_MODEL}} == "below-market-heavy-equity" -->
Enhanced equity grants to compensate for below-market salary:
<!-- ENDIF -->

| Level | Standard Grant (% of company) | Heavy-Equity Grant (% of company) | Vesting Schedule |
|-------|-------------------------------|-----------------------------------|-----------------|
| IC1 | 0.01% - 0.05% | 0.05% - 0.15% | 4 years, 1-year cliff |
| IC2 | 0.05% - 0.15% | 0.15% - 0.40% | 4 years, 1-year cliff |
| IC3 | 0.10% - 0.30% | 0.30% - 0.75% | 4 years, 1-year cliff |
| IC4 | 0.25% - 0.75% | 0.75% - 1.50% | 4 years, 1-year cliff |
| IC5 | 0.50% - 1.50% | 1.00% - 2.50% | 4 years, 1-year cliff |
| M1 | 0.15% - 0.40% | 0.40% - 0.80% | 4 years, 1-year cliff |
| M2 | 0.30% - 0.75% | 0.75% - 1.50% | 4 years, 1-year cliff |
| M3 | 1.00% - 3.00% | 2.00% - 5.00% | 4 years, 1-year cliff |

### Option Pool Management

| Metric | Current Value | Target |
|--------|---------------|--------|
| **Total option pool** | {{EQUITY_POOL_AVAILABLE}}% | Maintain 10-15% unallocated post-Series A |
| **Allocated to date** | ___% | Track against pool |
| **Remaining unallocated** | ___% | Must cover planned hires for next 18 months |
| **Planned grants (next 12 months)** | ___% | Sum of grants for all planned hires |
| **Buffer for refresh grants** | ___% | Reserve 20-30% of remaining pool for retention |

### Vesting Details

| Parameter | Standard | Notes |
|-----------|----------|-------|
| **Vesting period** | 4 years | Industry standard. 3 years is acceptable for later-stage. |
| **Cliff** | 1 year | Employee receives 0 equity before 12 months. After cliff, 25% vests. |
| **Vesting schedule** | Monthly after cliff | Quarterly vesting is also common but less employee-friendly. |
| **Exercise window** | 90 days post-departure (standard) or 10 years (employee-friendly) | 90-day window penalizes employees who leave. 10-year window is increasingly expected. |
| **Early exercise** | Allow (83(b) election) | Allows employees to exercise before vesting for potential tax benefit. Requires legal setup. |
| **Refresh grants** | Annual, performance-based | 25-50% of original grant size for top performers. Critical for retention at 2-3 year mark. |

### Equity Communication

When presenting equity to candidates, include:

- [ ] Number of shares (not just percentage — percentage is misleading without total share count)
- [ ] Total shares outstanding (fully diluted)
- [ ] Current strike price (409A valuation)
- [ ] Last funding valuation (if applicable)
- [ ] Vesting schedule with cliff details
- [ ] Exercise window after departure
- [ ] Scenario analysis: "If the company is worth $X at exit, your shares would be worth $Y before tax"

**Warning:** Never guarantee or imply a specific equity outcome. Use scenario analysis with clear disclaimers. Overpromising on equity creates legal and trust issues.

---

## 4. Benefits Package

### Core Benefits

| Benefit | Coverage | Monthly Cost (Employer) | Notes |
|---------|----------|------------------------|-------|
| **Health insurance** | Medical, dental, vision | $500-$1500/employee | Required in many jurisdictions for 50+ employees. Offer even if not required. |
| **Retirement** | 401(k) or equivalent | 3-6% match | Match up to 4% is standard. Immediate vesting or 2-year graded. |
| **PTO** | {{PTO_DAYS}} days/year or unlimited | $0 (sunk cost) | "Unlimited" PTO often results in less vacation taken. Set a minimum of 15 days if unlimited. |
| **Parental leave** | {{PARENTAL_LEAVE_WEEKS}} weeks | Salary continuation | 12-16 weeks is competitive. Apply equally regardless of gender. |
| **Equipment** | Laptop, monitor, peripherals | $2,500-$4,000 one-time | Refresh every 3 years. Include ergonomic setup. |

### Remote-Specific Benefits

<!-- IF {{WORK_LOCATION_POLICY}} == "remote-first" -->
| Benefit | Coverage | Monthly Cost | Notes |
|---------|----------|-------------|-------|
| **Home office stipend** | One-time setup | $1,000-$2,500 | Desk, chair, monitor, keyboard, headset |
| **Monthly internet/utilities** | Ongoing | $100-$200/month | Covers home internet and workspace costs |
| **Coworking space** | Optional | $200-$500/month | For employees who prefer working outside home |
| **Annual team meetup** | Travel + lodging | $3,000-$5,000/person/year | 1-2 in-person gatherings per year. Non-negotiable for remote teams. |
<!-- ENDIF -->

### Professional Development

| Benefit | Annual Budget | Notes |
|---------|--------------|-------|
| **Conference attendance** | $2,000-$5,000 | 1-2 conferences per year including travel |
| **Learning budget** | $1,000-$2,500 | Books, courses, subscriptions, certifications |
| **Internal training** | Time allocation | 10% time for learning projects, reading groups, tech talks |

---

## 5. Compensation Review Cadence

| Event | Frequency | What Happens |
|-------|-----------|-------------|
| **Annual comp review** | Every 12 months (January or April) | Review all employees against bands. Adjust for performance, market movement, and internal equity. |
| **Promotion adjustment** | As needed | Move to new band midpoint (minimum). Typical increase: 10-20% base salary + new equity grant. |
| **Market adjustment** | Annual (with comp review) | Compare bands to market data. Adjust bands if they have drifted more than 5% below market. |
| **Equity refresh grant** | Annual (with comp review) | Top performers receive additional equity grants to maintain retention incentive. |
| **Cost-of-living adjustment** | Annual | Minimum 2-3% increase for all employees to offset inflation. Separate from merit increases. |
| **Off-cycle adjustment** | As needed | For retention risk (competing offer), significant role change, or internal equity correction. |

### Internal Equity Audit

Run this audit annually:

- [ ] No two people at the same level with same location tier differ by more than 15% in total comp
- [ ] No gender or demographic pay gap exceeds 3% at any level (investigate and close if found)
- [ ] No employee has been at band maximum for more than 12 months without a promotion conversation
- [ ] All new hire offers are within established bands (no exceptions without CEO + legal approval)
- [ ] Equity grants at same level are within 2x range (not 5x or 10x)

---

## 6. Market Data Sources

Use at least 2 sources when setting or reviewing bands. Single-source data is unreliable.

| Source | Cost | Best For | Update Frequency |
|--------|------|----------|-----------------|
| **Levels.fyi** | Free (basic) / $100/mo (premium) | Engineering comp at tech companies | Real-time |
| **Pave** | Free (basic) / paid (detailed) | Startup-specific comp data | Quarterly |
| **Carta Total Comp** | Free for Carta customers | Equity benchmarks for startups | Quarterly |
| **Glassdoor** | Free | Broad comp data, useful for non-engineering | Ongoing |
| **Radford (Aon)** | $5K-$20K/year | Enterprise-grade surveys, comprehensive | Annual |
| **Mercer** | $5K-$20K/year | Global comp data, geographic adjustments | Annual |
| **Option Impact** | $5K-$15K/year | Equity benchmarks by stage and role | Annual |
| **H1B Salary Database** | Free | Actual salaries for visa-sponsored roles | Ongoing |
| **Blind** | Free | Anonymous self-reported (high variance) | Real-time |
| **AngelList / Wellfound** | Free | Startup comp ranges from job postings | Real-time |

### How to Use Market Data

1. Pull data from 2-3 sources for each role
2. Filter by company stage (seed, Series A, Series B, etc.) — big company data is misleading for startups
3. Filter by location if using location-based bands
4. Use the 50th percentile as your band midpoint for {{COMPENSATION_MODEL}} == "market-rate"
5. Use the 25th-40th percentile for {{COMPENSATION_MODEL}} == "below-market-heavy-equity"
6. Adjust for your specific competitive landscape (if competing with FAANG, adjust up)

---

## Checklist

- [ ] Set salary bands for all levels using market data from at least 2 sources
- [ ] Decided geographic adjustment approach (location-based vs national vs global)
- [ ] Defined equity grant ranges by level aligned with {{COMPENSATION_MODEL}}
- [ ] Calculated remaining option pool and verified it covers planned hires
- [ ] Documented vesting schedule, cliff, exercise window, and refresh grant policy
- [ ] Designed benefits package including health, retirement, PTO, and equipment
- [ ] Added remote-specific benefits if {{WORK_LOCATION_POLICY}} is remote-first
- [ ] Established compensation review cadence (annual minimum)
- [ ] Run internal equity audit template
- [ ] Identified 2-3 market data sources for ongoing band calibration
- [ ] Verified total compensation costs align with Section 25 financial model
