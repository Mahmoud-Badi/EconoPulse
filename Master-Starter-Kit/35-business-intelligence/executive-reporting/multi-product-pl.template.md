# Multi-Product P&L Framework

> **Owner:** {{STAKEHOLDER_CFO}}
> **Refresh cadence:** Monthly (after accounting close)
> **Project:** {{PROJECT_NAME}}

---

## Purpose

This template provides a multi-product profit and loss framework that enables {{PROJECT_NAME}} to understand the financial performance of each product line independently. As companies grow, blended financials mask the reality that some products subsidize others. This framework forces transparency: which products generate margin, which consume it, and how shared costs should be allocated.

---

## Table of Contents

1. [Revenue by Product Line](#1-revenue-by-product-line)
2. [Cost Allocation Methodology](#2-cost-allocation-methodology)
3. [Contribution Margin by Product](#3-contribution-margin-by-product)
4. [Fully Loaded P&L by Product Line](#4-fully-loaded-pl-by-product-line)
5. [Segment Analysis](#5-segment-analysis)
6. [Transfer Pricing](#6-transfer-pricing)
7. [SQL Templates](#7-sql-templates)
8. [Visualization](#8-visualization)
9. [Cross-References](#9-cross-references)

---

## 1. Revenue by Product Line

### Revenue Classification

| Revenue Type | Definition | Recognition Rule | Included in ARR? |
|---|---|---|---|
| Subscription (recurring) | Monthly or annual subscription fees | Recognized monthly over subscription period | Yes |
| Usage-based (recurring) | Metered consumption charges | Recognized monthly based on actual usage | Yes (trailing average) |
| One-time | Setup fees, migration fees, training | Recognized when service is delivered | No |
| Professional services | Implementation, consulting, custom development | Recognized as services are delivered (% completion or milestone) | No |

### Monthly Revenue by Product Line

| Product Line | Subscription | Usage-Based | One-Time | Services | **Total Revenue** |
|---|---|---|---|---|---|
| Core Platform | $— | $— | $— | $— | **$—** |
| Module A | $— | $— | $— | $— | **$—** |
| Module B | $— | $— | $— | $— | **$—** |
| API / Platform | $— | $— | $— | $— | **$—** |
| **Total** | **$—** | **$—** | **$—** | **$—** | **$—** |

### Revenue Mix Trend (12-Month)

Track how revenue mix shifts over time. A healthy multi-product company sees diversification, not concentration.

| Month | Core Platform | Module A | Module B | API / Platform |
|---|---|---|---|---|
| — | —% | —% | —% | —% |
| — | —% | —% | —% | —% |
| — | —% | —% | —% | —% |
| — | —% | —% | —% | —% |
| — | —% | —% | —% | —% |
| — | —% | —% | —% | —% |

---

## 2. Cost Allocation Methodology

### Direct Costs (Attributable to Specific Products)

These costs can be directly traced to a single product line with no allocation needed.

| Cost Category | How to Attribute | Examples |
|---|---|---|
| Hosting / compute | Usage monitoring per service/product | AWS cost allocation tags, GCP project billing |
| Third-party APIs | API call logs per product | Payment processor fees, AI/ML API costs, email delivery |
| Product-specific licenses | Contract assignment | Product-specific SaaS tools |
| Dedicated personnel | Timesheet or role assignment | Product-specific engineers, dedicated support agents |
| Product-specific marketing | Campaign attribution | Product-specific ad campaigns, landing pages |

### Shared Costs (Require Allocation)

These costs serve multiple products and must be distributed using allocation keys.

| Cost Category | Allocation Key | Rationale |
|---|---|---|
| Shared engineering | % of engineering time (story points or hours) | Time spent building/maintaining each product |
| Shared infrastructure | % of compute resources consumed | Fair usage-based distribution |
| Customer support | % of tickets by product | Support effort correlates with ticket volume |
| Sales | % of revenue or % of deals by product | Sales effort correlates with revenue attribution |
| Marketing (brand/general) | % of revenue | Revenue-weighted for general brand spend |
| G&A (finance, legal, HR, office) | % of headcount or % of revenue | Revenue-proportional or headcount-proportional |
| Management / executive | % of revenue | Revenue-weighted for executive overhead |

### Allocation Key Configuration

| Allocation Key | Product: Core Platform | Product: Module A | Product: Module B | Product: API |
|---|---|---|---|---|
| % of Engineering Time | —% | —% | —% | —% |
| % of Compute Resources | —% | —% | —% | —% |
| % of Support Tickets | —% | —% | —% | —% |
| % of Revenue | —% | —% | —% | —% |
| % of Headcount | —% | —% | —% | —% |

> **Update cadence:** Allocation keys should be reviewed and updated quarterly. Using stale allocation keys distorts product-level profitability.

### Allocation Methodology Selection

| Method | Pros | Cons | Best For |
|---|---|---|---|
| Activity-based (hours/tickets/compute) | Most accurate | Requires tracking systems | Companies with good instrumentation |
| Revenue-proportional | Simple, easy to maintain | Penalizes high-revenue products | Early-stage or when tracking is immature |
| Headcount-proportional | Reflects team investment | Ignores efficiency differences | G&A costs primarily |
| Even split | Simplest | Least accurate | Only for truly shared costs with no better proxy |

**Recommended approach:** Use activity-based allocation for direct-attributable shared costs (engineering, support, infrastructure). Use revenue-proportional for general overhead (G&A, executive, brand marketing).

---

## 3. Contribution Margin by Product

### Definition

Contribution margin measures what each product line contributes after covering its direct costs, before absorbing shared overhead. This is the clearest signal of product-level viability.

```
Contribution Margin = Product Revenue - Direct COGS - Direct Operating Expenses
```

### Monthly Contribution Margin

| | Core Platform | Module A | Module B | API / Platform | **Total** |
|---|---|---|---|---|---|
| **Revenue** | $— | $— | $— | $— | **$—** |
| Direct COGS | | | | | |
| — Hosting / compute | ($—) | ($—) | ($—) | ($—) | ($—) |
| — Third-party APIs | ($—) | ($—) | ($—) | ($—) | ($—) |
| — Direct support | ($—) | ($—) | ($—) | ($—) | ($—) |
| **Gross Profit** | **$—** | **$—** | **$—** | **$—** | **$—** |
| **Gross Margin %** | **—%** | **—%** | **—%** | **—%** | **—%** |
| Direct OpEx | | | | | |
| — Product engineering | ($—) | ($—) | ($—) | ($—) | ($—) |
| — Product marketing | ($—) | ($—) | ($—) | ($—) | ($—) |
| — Product management | ($—) | ($—) | ($—) | ($—) | ($—) |
| **Contribution Margin** | **$—** | **$—** | **$—** | **$—** | **$—** |
| **Contribution Margin %** | **—%** | **—%** | **—%** | **—%** | **—%** |

### Product Viability Assessment

| Product | Contribution Margin % | Assessment | Action |
|---|---|---|---|
| Core Platform | —% | — | — |
| Module A | —% | — | — |
| Module B | —% | — | — |
| API / Platform | —% | — | — |

**Assessment criteria:**
| Contribution Margin | Assessment |
|---|---|
| > 60% | Strong contributor — scale investment |
| 40-60% | Healthy — maintain and optimize |
| 20-40% | Marginal — investigate cost reduction or pricing |
| 0-20% | Weak — strategic review needed (keep only if strategic value) |
| < 0% | Negative — sunset unless clear path to profitability |

---

## 4. Fully Loaded P&L by Product Line

### Monthly Fully Loaded P&L

| | Core Platform | Module A | Module B | API / Platform | **Corporate** | **Total** |
|---|---|---|---|---|---|---|
| **Revenue** | $— | $— | $— | $— | $— | **$—** |
| | | | | | | |
| **Direct COGS** | ($—) | ($—) | ($—) | ($—) | — | ($—) |
| **Gross Profit** | **$—** | **$—** | **$—** | **$—** | — | **$—** |
| **Gross Margin** | **—%** | **—%** | **—%** | **—%** | — | **—%** |
| | | | | | | |
| **Direct OpEx** | ($—) | ($—) | ($—) | ($—) | — | ($—) |
| **Contribution Margin** | **$—** | **$—** | **$—** | **$—** | — | **$—** |
| **Contribution Margin %** | **—%** | **—%** | **—%** | **—%** | — | **—%** |
| | | | | | | |
| **Allocated Shared Costs** | | | | | | |
| — Shared engineering | ($—) | ($—) | ($—) | ($—) | — | ($—) |
| — Shared infrastructure | ($—) | ($—) | ($—) | ($—) | — | ($—) |
| — Shared support | ($—) | ($—) | ($—) | ($—) | — | ($—) |
| — Sales (allocated) | ($—) | ($—) | ($—) | ($—) | — | ($—) |
| — Marketing (allocated) | ($—) | ($—) | ($—) | ($—) | — | ($—) |
| — G&A (allocated) | ($—) | ($—) | ($—) | ($—) | ($—) | ($—) |
| **Total Allocated** | **($—)** | **($—)** | **($—)** | **($—)** | **($—)** | **($—)** |
| | | | | | | |
| **Operating Profit (Loss)** | **$—** | **$—** | **$—** | **$—** | **($—)** | **$—** |
| **Operating Margin** | **—%** | **—%** | **—%** | **—%** | — | **—%** |

> **Corporate column:** Captures costs that cannot reasonably be allocated to any product (e.g., board governance, investor relations, unallocated executive time). Keep this column small — if it's large, your allocation methodology needs improvement.

### Quarterly Trend by Product

| Product | Q-3 Op Margin | Q-2 Op Margin | Q-1 Op Margin | Current Q Op Margin | Trend |
|---|---|---|---|---|---|
| Core Platform | —% | —% | —% | —% | — |
| Module A | —% | —% | —% | —% | — |
| Module B | —% | —% | —% | —% | — |
| API / Platform | —% | —% | —% | —% | — |

---

## 5. Segment Analysis

### By Customer Size

| Segment | Revenue | Customers | ARPA | Gross Margin | Contribution Margin | CAC | LTV:CAC |
|---|---|---|---|---|---|---|---|
| SMB (1-50 emp) | $— | — | $— | —% | —% | $— | —:1 |
| Mid-Market (51-500) | $— | — | $— | —% | —% | $— | —:1 |
| Enterprise (500+) | $— | — | $— | —% | —% | $— | —:1 |
| **Total** | **$—** | **—** | **$—** | **—%** | **—%** | **$—** | **—:1** |

**Key questions this table answers:**
- Which segment is most profitable on a contribution basis?
- Where is ARPA growing fastest?
- Are enterprise customers worth the higher CAC?

### By Geography

| Region | Revenue | % of Total | MoM Growth | Gross Margin | Customers |
|---|---|---|---|---|---|
| North America | $— | —% | —% | —% | — |
| EMEA | $— | —% | —% | —% | — |
| APAC | $— | —% | —% | —% | — |
| LATAM | $— | —% | —% | —% | — |
| **Total** | **$—** | **100%** | **—%** | **—%** | **—** |

**Cross-reference:** `geographic-segment-analysis.template.md` for detailed geographic analysis.

### By Industry Vertical

| Vertical | Revenue | Customers | ARPA | Retention (12-mo) | Growth Rate |
|---|---|---|---|---|---|
| Financial Services | $— | — | $— | —% | —% |
| Healthcare | $— | — | $— | —% | —% |
| Technology | $— | — | $— | —% | —% |
| Retail / E-commerce | $— | — | $— | —% | —% |
| Education | $— | — | $— | —% | —% |
| Other | $— | — | $— | —% | —% |

---

## 6. Transfer Pricing

### When Transfer Pricing Applies

Transfer pricing is relevant when:
- One product consumes another product's infrastructure or API (e.g., Module A uses Core Platform's authentication service).
- A platform product provides shared capabilities consumed by multiple product lines.
- Products share customers where one product drives acquisition for another.

### Transfer Pricing Model

| Service Provider | Service Consumer | Service Description | Pricing Model | Monthly Amount |
|---|---|---|---|---|
| Core Platform | Module A | Authentication & user management | Per-user fee: $X/user/month | $— |
| Core Platform | Module B | Data storage & retrieval API | Per-GB: $X/GB/month | $— |
| API / Platform | Core Platform | Shared infrastructure | % of compute usage | $— |
| Core Platform | API / Platform | User base access | Revenue share: X% of API revenue | $— |

### Transfer Pricing Rules

1. **Arm's length principle:** Internal prices should approximate what would be charged to an external party for the same service.
2. **Consistency:** Once set, transfer prices are fixed for the fiscal year and reviewed annually.
3. **Transparency:** Transfer pricing amounts appear as both revenue (for the provider) and cost (for the consumer) in the product P&L.
4. **Netting:** For consolidated reporting, transfer prices net to zero. They only appear in product-level views.
5. **Dispute resolution:** If product leaders disagree on transfer prices, CFO arbitrates.

### Impact on Product P&L

| Product | External Revenue | Transfer Revenue (In) | Transfer Cost (Out) | Net Revenue |
|---|---|---|---|---|
| Core Platform | $— | $— | ($—) | $— |
| Module A | $— | $— | ($—) | $— |
| Module B | $— | $— | ($—) | $— |
| API / Platform | $— | $— | ($—) | $— |
| **Total (should net to $0 for transfers)** | **$—** | **$—** | **($—)** | **$—** |

---

## 7. SQL Templates

### Query 1: Revenue by Product Line

```sql
-- Monthly revenue breakdown by product line and revenue type

SELECT
    DATE_TRUNC('month', s.billing_period_start) AS period,
    p.product_line,
    CASE
        WHEN s.billing_type = 'recurring' AND s.pricing_model = 'flat' THEN 'subscription'
        WHEN s.billing_type = 'recurring' AND s.pricing_model = 'usage' THEN 'usage_based'
        WHEN s.billing_type = 'one_time' THEN 'one_time'
        WHEN s.billing_type = 'services' THEN 'professional_services'
        ELSE 'other'
    END AS revenue_type,
    SUM(s.amount) AS revenue
FROM subscriptions s
JOIN products p ON s.product_id = p.product_id
WHERE s.billing_period_start >= '{{REPORT_START_DATE}}'
GROUP BY 1, 2, 3
ORDER BY 1, 2, 3;
```

### Query 2: Direct Cost Attribution

```sql
-- Direct costs by product line (from cost allocation tags)

SELECT
    DATE_TRUNC('month', cost_date) AS period,
    product_line,
    cost_category,
    SUM(amount) AS direct_cost
FROM cost_allocations
WHERE allocation_type = 'direct'
  AND cost_date >= '{{REPORT_START_DATE}}'
GROUP BY 1, 2, 3
ORDER BY 1, 2, 3;
```

### Query 3: Contribution Margin Calculation

```sql
-- Contribution margin by product line

WITH revenue AS (
    SELECT
        DATE_TRUNC('month', s.billing_period_start) AS period,
        p.product_line,
        SUM(s.amount) AS total_revenue
    FROM subscriptions s
    JOIN products p ON s.product_id = p.product_id
    GROUP BY 1, 2
),

direct_costs AS (
    SELECT
        DATE_TRUNC('month', cost_date) AS period,
        product_line,
        SUM(CASE WHEN cost_category = 'cogs' THEN amount ELSE 0 END) AS direct_cogs,
        SUM(CASE WHEN cost_category = 'opex' THEN amount ELSE 0 END) AS direct_opex
    FROM cost_allocations
    WHERE allocation_type = 'direct'
    GROUP BY 1, 2
)

SELECT
    r.period,
    r.product_line,
    r.total_revenue,
    COALESCE(d.direct_cogs, 0) AS direct_cogs,
    r.total_revenue - COALESCE(d.direct_cogs, 0) AS gross_profit,
    (r.total_revenue - COALESCE(d.direct_cogs, 0))::FLOAT / NULLIF(r.total_revenue, 0) * 100
        AS gross_margin_pct,
    COALESCE(d.direct_opex, 0) AS direct_opex,
    r.total_revenue - COALESCE(d.direct_cogs, 0) - COALESCE(d.direct_opex, 0)
        AS contribution_margin,
    (r.total_revenue - COALESCE(d.direct_cogs, 0) - COALESCE(d.direct_opex, 0))::FLOAT
        / NULLIF(r.total_revenue, 0) * 100
        AS contribution_margin_pct
FROM revenue r
LEFT JOIN direct_costs d ON r.period = d.period AND r.product_line = d.product_line
ORDER BY r.period, r.product_line;
```

---

## 8. Visualization

### Waterfall by Product

**Chart type:** Stacked waterfall showing how each product contributes to total company profit.

```
Revenue (Core)      ████████████████████
Revenue (Module A)  ████████
Revenue (Module B)  █████
Revenue (API)       ███
─── Total Revenue   ████████████████████████████████████
- COGS (Core)       ████████                  (red)
- COGS (Module A)   ███                       (red)
- COGS (Module B)   ██                        (red)
- COGS (API)        █                         (red)
─── Gross Profit    ████████████████████████
- OpEx              ████████████████          (red)
─── Operating P/L   ████████
```

### Margin Comparison

**Chart type:** Grouped bar chart comparing gross margin and contribution margin across products.

**Layout:** Products on X-axis, two bars per product (gross margin %, contribution margin %). Horizontal reference lines at 60% (target gross margin) and 40% (target contribution margin).

### Trend Analysis

**Chart type:** Multi-line chart showing contribution margin % by product over 12 months.

**Annotations:** Highlight months where a product crosses below 0% contribution margin in red.

---

## 9. Cross-References

| Reference | Location | Relationship |
|---|---|---|
| Financial modeling | Section 25 `revenue-projection.template.md` | Revenue projections by product feed this P&L |
| Unit economics | `unit-economics-dashboard.template.md` (this section) | Gross margin feeds unit economics calculations |
| Billing system | Section 30 `billing-domain-model.template.md` | Revenue data source |
| Board deck | `board-deck-templates.template.md` (this section) | Slide 4 (Unit Economics) and Slide 11 (Financial Projections) reference product margins |
| Geographic analysis | `geographic-segment-analysis.template.md` (this section) | Segment analysis by geography complements product-level analysis |
| Break-even analysis | Section 25 `break-even-analysis.template.md` | Product-level break-even requires contribution margin data from this template |
