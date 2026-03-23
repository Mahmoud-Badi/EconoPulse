# Runway & Burn Rate Tracker — {{PROJECT_NAME}}

> The monthly financial pulse of your company. Tracks every dollar going out, every dollar coming in, and calculates exactly how many months you have before the money runs out. If you only fill out one financial template, make it this one.

---

## Current Financial Position

| Metric | Value | As of Date |
|--------|-------|-----------|
| Cash in bank | ${{CASH_IN_BANK}} | ___ |
| Monthly revenue (current) | $___ | ___ |
| Monthly expenses (current) | $___ | ___ |
| Gross burn rate | $___ | Expenses before revenue |
| Net burn rate | $___ | Expenses minus revenue |
| **Runway** | **___ months** | Cash / Net burn |

---

## Monthly Expense Breakdown

### Personnel Costs

| Role | Count | Monthly Cost Each | Monthly Total | Annual Total |
|------|-------|------------------|--------------|-------------|
| Founders (salary/draw) | ___ | $___ | $___ | $___ |
| Full-time engineers | ___ | $___ | $___ | $___ |
| Full-time non-engineering | ___ | $___ | $___ | $___ |
| Part-time / contractors | ___ | $___ | $___ | $___ |
| Benefits & payroll taxes (est. 20-30% of salary) | — | — | $___ | $___ |
| **Total Personnel** | | | **${{PERSONNEL_COST}}** | **$___** |

### Infrastructure Costs

Cross-reference: `11-new-capabilities/cost-estimation.template.md` for detailed infrastructure breakdown.

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Cloud hosting (AWS/GCP/Azure) | $___ | |
| Database (managed) | $___ | |
| CDN / storage | $___ | |
| Domain & DNS | $___ | |
| SSL / security services | $___ | |
| Monitoring & logging | $___ | |
| CI/CD pipeline | $___ | |
| AI/ML API costs | $___ | Per-request costs from Section 24 |
| **Total Infrastructure** | **$___** | |

### SaaS Tools & Subscriptions

| Tool | Purpose | Monthly Cost | Annual Option | Savings |
|------|---------|-------------|--------------|---------|
| GitHub / GitLab | Source control | $___ | $___ | $___ |
| Slack / Discord | Team communication | $___ | $___ | $___ |
| Linear / Jira | Project management | $___ | $___ | $___ |
| Figma | Design | $___ | $___ | $___ |
| Google Workspace / M365 | Email, docs | $___ | $___ | $___ |
| Analytics (Mixpanel, Amplitude, etc.) | Product analytics | $___ | $___ | $___ |
| CRM (HubSpot, etc.) | Sales & marketing | $___ | $___ | $___ |
| Email service (SendGrid, etc.) | Transactional email | $___ | $___ | $___ |
| Error tracking (Sentry, etc.) | Bug monitoring | $___ | $___ | $___ |
| Other: ___ | ___ | $___ | $___ | $___ |
| Other: ___ | ___ | $___ | $___ | $___ |
| **Total SaaS** | | **$___** | | |

### Marketing & Growth Spend

| Category | Monthly Budget | Notes |
|----------|---------------|-------|
| Paid advertising (Google, Meta, etc.) | $___ | |
| Content creation | $___ | Writers, designers, video |
| SEO tools | $___ | |
| Social media tools | $___ | |
| Events / sponsorships | $___ | |
| Referral program costs | $___ | |
| PR / communications | $___ | |
| **Total Marketing** | **$___** | |

### Legal, Admin & Other

| Category | Monthly Cost | Notes |
|----------|-------------|-------|
| Legal (incorporation, contracts, IP) | $___ | Often lumpy — amortize annually |
| Accounting / bookkeeping | $___ | |
| Insurance (general liability, D&O) | $___ | |
| Bank fees / payment processing | $___ | |
| Office / co-working space | $___ | |
| Remote work stipends | $___ | |
| Travel | $___ | |
| Miscellaneous / buffer (10%) | $___ | Always include a buffer |
| **Total Legal/Admin** | **$___** | |

---

## Consolidated Expense Summary

| Category | Monthly Cost | % of Total | Annual Cost |
|----------|-------------|-----------|-------------|
| Personnel | ${{PERSONNEL_COST}} | ___% | $___ |
| Infrastructure | $___ | ___% | $___ |
| SaaS Tools | $___ | ___% | $___ |
| Marketing & Growth | $___ | ___% | $___ |
| Legal / Admin / Other | $___ | ___% | $___ |
| **Total Gross Burn** | **$___** | **100%** | **$___** |
| **Revenue** | **$___** | | **$___** |
| **Net Burn** | **$___** | | **$___** |

---

## Runway Calculation

```
Runway (months) = Cash in Bank / Net Monthly Burn Rate

${{CASH_IN_BANK}} / $___ = ___ months
```

### Runway Under Different Scenarios

| Scenario | Assumptions | Monthly Net Burn | Runway (months) | Run-Out Date |
|----------|------------|-----------------|-----------------|-------------|
| **Current trajectory** | No changes to spend or revenue | $___ | ___ | ___ |
| **Revenue grows 20%/mo** | Expenses stay flat, revenue compounds | $___ → $___ | ___ | ___ |
| **Revenue grows 10%/mo** | Expenses stay flat, slower growth | $___ → $___ | ___ | ___ |
| **Costs cut 30%** | Reduce team/spending, revenue flat | $___ | ___ | ___ |
| **Costs cut 50%** | Skeleton crew, essentials only | $___ | ___ | ___ |
| **Worst case (no revenue)** | Revenue drops to $0, expenses unchanged | $___ | ___ | ___ |
| **Worst case + cost cuts** | Revenue $0, 50% cost reduction | $___ | ___ | ___ |

### What Gets Cut First (Priority Order)

If you need to extend runway, cut in this order:

| Priority | Cut | Monthly Savings | Impact |
|----------|-----|----------------|--------|
| 1 | Non-essential SaaS tools | $___ | Low — switch to free tiers |
| 2 | Marketing spend (paid ads) | $___ | Medium — slower growth but survivable |
| 3 | Contractor / part-time roles | $___ | Medium — slower development |
| 4 | Office / co-working space | $___ | Low — go fully remote |
| 5 | Founder salaries (reduce/defer) | $___ | Personal — last resort |
| 6 | Full-time headcount | $___ | High — reduces capacity significantly |
| **Total Potential Savings** | | **$___** | |
| **Extended Runway** | | | **___ additional months** |

---

## 12-Month Cash Flow Projection

| Month | Beginning Balance | + Revenue | - Expenses | = Net Cash Flow | Ending Balance | Runway Remaining |
|-------|------------------|-----------|-----------|----------------|---------------|-----------------|
| 1 | ${{CASH_IN_BANK}} | $___ | $___ | $___ | $___ | ___ mo |
| 2 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 3 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 4 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 5 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 6 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 7 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 8 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 9 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 10 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 11 | $___ | $___ | $___ | $___ | $___ | ___ mo |
| 12 | $___ | $___ | $___ | $___ | $___ | ___ mo |

### Cash Flow Milestones

| Milestone | Projected Month | Confidence |
|-----------|----------------|------------|
| First revenue | Month ___ | |
| Revenue covers infrastructure costs | Month ___ | |
| Revenue covers 50% of expenses | Month ___ | |
| Cash flow breakeven (revenue = expenses) | Month ___ | |
| Cash flow positive (revenue > expenses) | Month ___ | |
| 12 months of runway from revenue alone | Month ___ | |

---

## Funding Milestone Planning

If you plan to raise investment, you need to hit specific metrics before approaching investors. Work backwards from your fundraising target.

### Fundraising Timeline

| Milestone | Target Date | Months from Now |
|-----------|-----------|----------------|
| Start fundraising preparation | ___ | ___ |
| Begin investor outreach | ___ | ___ |
| Target close date | ___ | ___ |
| Cash needed by (danger zone) | ___ | ___ |

### Metrics to Hit Before Raising

| Stage | Key Metric | Target | Your Current | Gap |
|-------|-----------|--------|-------------|-----|
| **Pre-seed** | Product built, initial traction | Users: ___; Waitlist: ___ | ___ | ___ |
| **Seed** | Product-market fit signals | MRR: $10-50K; Growth: 15-25%/mo | $___ MRR; ___% growth | ___ |
| **Series A** | Scalable growth | ARR: $1-2M; NRR >100%; LTV:CAC >3:1 | $___ ARR; ___% NRR; ___:1 | ___ |

### Fundraise Amount Calculation

```
Amount to Raise = Monthly Burn x Months of Runway Desired + Growth Investment

Runway desired: 18-24 months (standard)
Monthly burn (current): $___
Monthly burn (post-raise, with hiring plan): $___
Growth investment: $___
Buffer (20%): $___

Total raise: $___
```

---

## Danger Zone Alerts

| Runway Remaining | Status | Action Required |
|-----------------|--------|----------------|
| **18+ months** | Green | Operate normally; start planning next raise if VC-backed |
| **12-18 months** | Yellow | Begin fundraising preparation; tighten non-essential spend |
| **6-12 months** | Orange | **Start fundraising NOW** — process takes 3-6 months |
| **3-6 months** | Red | Emergency mode: cut costs, bridge financing, revenue acceleration |
| **< 3 months** | Critical | Survival mode: minimum viable team, explore all options (acqui-hire, bridge notes, revenue loans) |

**Critical rule**: Start fundraising when you have 6+ months of runway remaining. The average fundraise takes 3-6 months. Starting at 3 months means you are negotiating from desperation, and investors know it.

---

## Budget Allocation by Stage

### Pre-Revenue Stage

| Category | % of Budget | Rationale |
|----------|-----------|-----------|
| Product (engineering, design) | 70% | Build the thing |
| Growth (marketing, sales) | 20% | Validate demand, early traction |
| Operations (admin, legal, tools) | 10% | Minimum viable operations |

### Post-Revenue / Pre-Profitability Stage

| Category | % of Budget | Rationale |
|----------|-----------|-----------|
| Product (engineering, design) | 50% | Continue building, but shift some to maintenance |
| Growth (marketing, sales) | 30% | Scale what works |
| Operations (admin, legal, tools) | 20% | Scaling needs more ops support |

### Scaling Stage

| Category | % of Budget | Rationale |
|----------|-----------|-----------|
| Product (engineering, design) | 40% | Maintain, iterate, new features |
| Growth (marketing, sales) | 40% | Aggressive customer acquisition |
| Operations (admin, legal, tools) | 20% | Support the organization |

---

## Monthly Burn Rate Review Checklist

Run this review on the 1st of every month:

- [ ] Update actual revenue vs projected revenue
- [ ] Update actual expenses vs budgeted expenses
- [ ] Recalculate net burn rate and runway
- [ ] Flag any expenses that increased >20% from last month
- [ ] Review SaaS subscriptions — cancel unused tools
- [ ] Check infrastructure costs against usage growth
- [ ] Update 12-month cash flow projection with actuals
- [ ] Compare current trajectory to fundraising timeline
- [ ] Determine if any scenario triggers require action

---

## Cross-References

- **Infrastructure costs**: `11-new-capabilities/cost-estimation.template.md`
- **Revenue projection**: `25-financial-modeling/revenue-projection.template.md`
- **Break-even analysis**: `25-financial-modeling/break-even-analysis.template.md`
- **Investor metrics**: `25-financial-modeling/investor-metrics-dashboard.template.md`
