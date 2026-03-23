# BI Maturity Assessment

> Use this assessment to determine your BI maturity level before working through the rest of Section 35. Your maturity level determines which templates to resolve, which infrastructure to build, and which executive reporting layers to invest in. A two-person team with three data sources does not need a Snowflake warehouse and a governed semantic layer — and a fifty-person company with fifteen data sources cannot survive on Google Sheets.

---

## Step 1: Count Your Data Sources

List every system that generates data your organization needs for reporting, analysis, or decision-making. Include systems from your Section 00 `integrations-map.template.md` output, your Section 11 analytics tracking plan, and your Section 25 financial model inputs. Count each distinct system as one data source.

Common data sources people forget to count:

- **Application database** — your primary OLTP database (PostgreSQL, MySQL, MongoDB)
- **Billing system** — Stripe, Paddle, Chargebee, or your invoicing platform
- **Product analytics tool** — PostHog, Mixpanel, Amplitude, Google Analytics
- **CRM** — HubSpot, Salesforce, Pipedrive, or a homegrown contact database
- **Support platform** — Zendesk, Intercom, Freshdesk, Help Scout
- **Email/marketing tool** — Customer.io, Mailchimp, SendGrid, Resend (engagement data)
- **Error tracker** — Sentry, Bugsnag, Datadog (error rates, resolution times)
- **CDN/infrastructure logs** — Cloudflare, Vercel, AWS CloudWatch (traffic, latency, uptime)
- **Ad platforms** — Google Ads, Meta Ads, LinkedIn Ads (spend, impressions, conversions)
- **App stores** — Apple App Store Connect, Google Play Console (downloads, ratings, revenue)
- **HR/payroll** — Gusto, Rippling, BambooHR (headcount costs for unit economics)
- **Version control/CI** — GitHub, GitLab (deployment frequency, cycle time for engineering metrics)

**Your count: ____**

---

## Step 2: Assess Your Context

Answer these questions to refine your maturity level. Each "yes" adds one point to your context score.

| Question | Yes | No |
|----------|-----|----|
| Do you have a data engineer or dedicated analyst on the team? | +1 | — |
| Do you need board-ready reporting (investor updates, board decks)? | +1 | — |
| Are you subject to SOC 2, SOX, GDPR, or other compliance frameworks? | +1 | — |
| Do you operate multiple products or distinct business lines? | +1 | — |
| Do you operate in international markets (multi-currency, multi-region)? | +1 | — |
| Do you have more than 10,000 users or customers? | +1 | — |
| Do you have real-time reporting requirements (sub-minute dashboards)? | +1 | — |

**Your context score: ____**

---

## Step 3: Determine Your Level

```
Data Source Count: 0-2, Context Score: 0-1
→ LEVEL 1: SPREADSHEET

Data Source Count: 0-2, Context Score: 2+
→ LEVEL 2: TOOL-NATIVE

Data Source Count: 3-8, Context Score: 0-2
→ LEVEL 2: TOOL-NATIVE

Data Source Count: 3-8, Context Score: 3+
→ LEVEL 3: GOVERNED

Data Source Count: 5-15, Context Score: 3+
→ LEVEL 3: GOVERNED

Data Source Count: 5-15, Context Score: 5+
→ LEVEL 4: PREDICTIVE

Data Source Count: 10+, Context Score: 4+
→ LEVEL 4: PREDICTIVE

Data Source Count: 16+, Context Score: any
→ LEVEL 4: PREDICTIVE
```

If your data source count and context score point to different levels, take the higher one. Under-investing in BI infrastructure is more expensive than over-investing — ungoverned data erodes trust faster than governed data erodes budgets.

---

## Level Definitions

### Level 1: Spreadsheet

**Profile:** Pre-revenue or early-revenue product, solo founder or tiny team, 0–2 data sources, no data engineer, no board reporting obligation. Metrics live in Google Sheets, Notion databases, or manual CSV exports from your admin panel.

**Resolve these files:**
- [ ] `metrics-hub/unified-metrics-registry.template.md` — resolve as a **reference document only** (define your metrics and their canonical definitions, but do not build warehouse infrastructure around them yet)

**Skip everything else.** At this scale, building a warehouse and ETL pipeline costs more than the problems they solve. Your metrics registry becomes the foundation you build on when you graduate to Level 2. The registry ensures that when you do build infrastructure, you are not starting from scratch — you already know what you are measuring and why.

**What this looks like in practice:** You track MRR in a spreadsheet, pull Stripe data from the Stripe dashboard, check PostHog for product metrics, and report to yourself or a small group of stakeholders via a monthly email or Notion page.

**Time estimate:** 20–30 minutes

---

### Level 2: Tool-Native

**Profile:** Small team (2–10 people), 3–8 data sources, each SaaS tool has its own built-in dashboard (Stripe Dashboard for revenue, PostHog for product analytics, Zendesk for support metrics). No dedicated data team, but you need to start cross-referencing data across tools. May have informal board updates but not formal deck obligations.

**Resolve these files:**
- [ ] `data-warehouse-architecture.template.md` — lightweight version (single-schema warehouse, core fact tables only)
- [ ] `etl-pipeline-design.template.md` — basic extraction from 3–8 sources into warehouse
- [ ] `metrics-hub/unified-metrics-registry.template.md` — full version with source mapping and ownership
- [ ] `bi-platform-decision-tree.md` — read and select a BI platform
- [ ] `bi-connection-patterns.md` — configure connection for your selected platform
- [ ] `bi-gotchas.md` — skim for anti-patterns relevant to your stack

**Skip:** Advanced executive reporting (multi-product P&L, geographic analysis, regulatory reporting). Skip the transformation layer template if you have fewer than 5 data sources — raw SQL views are sufficient at this scale.

**What this looks like in practice:** You set up a lightweight warehouse (possibly a dedicated PostgreSQL schema or DuckDB), configure Airbyte or Fivetran to sync your critical data sources, and connect Metabase or Preset to display cross-source dashboards. Your "board deck" is a Loom video walking through the dashboards.

**Time estimate:** 60–90 minutes

---

### Level 3: Governed

**Profile:** Team of 10–50 people, 5–15 data sources, at least one data engineer or analyst on the team, centralized data warehouse with defined metric ownership and dbt (or equivalent) transformation layer. Board reporting obligations exist. Cross-functional teams need consistent metric definitions.

**Resolve these files:**
- [ ] Everything in Level 2
- [ ] `transformation-layer.template.md` — full dbt model design with staging, intermediate, and mart layers
- [ ] `data-quality-governance.template.md` — freshness SLAs, PII handling, audit trails
- [ ] `metrics-hub/cross-section-metric-map.md` — read and apply to unify metrics from Sections 19, 20, 25, 33
- [ ] `metrics-hub/data-lineage-catalog.template.md` — document source-to-dashboard lineage
- [ ] `metrics-hub/alert-threshold-registry.template.md` — define business metric alerting
- [ ] `executive-reporting/board-deck-templates.template.md` — resolve with your board cadence and stage
- [ ] `executive-reporting/mrr-arr-waterfall.template.md` — build revenue decomposition reporting
- [ ] `executive-reporting/cohort-analysis.template.md` — retention, revenue, and behavioral cohorts
- [ ] `executive-reporting/unit-economics-dashboard.template.md` — CAC payback, LTV, NRR tracking
- [ ] `executive-reporting/okr-kpi-tracking.template.md` — OKR framework with KPI trees
- [ ] `executive-reporting/departmental-dashboards.template.md` — dashboards for each functional area

**What this looks like in practice:** You have a Snowflake or BigQuery warehouse, dbt models running on a schedule, a BI tool connected with governed access controls, and a monthly board deck that pulls live data from your dashboards. Metric definitions are centralized and disputes are resolved by metric owners, not by creating competing spreadsheets.

**Time estimate:** 2–3 hours

---

### Level 4: Predictive

**Profile:** 50+ person organization (or a data-intensive smaller company), 10+ data sources, dedicated data team (engineer + analyst minimum), real-time pipeline requirements, ML-driven forecasting, embedded analytics in your product, or compliance obligations requiring audit-ready exports.

**Resolve these files:**
- [ ] Everything in Level 3
- [ ] `executive-reporting/multi-product-pl.template.md` — multi-product P&L with cost allocation and contribution margin
- [ ] `executive-reporting/geographic-segment-analysis.template.md` — geographic, market segment, and industry breakdowns
- [ ] `executive-reporting/regulatory-reporting.template.md` — SOC 2/GDPR/SOX audit-ready exports and compliance dashboards

**Additionally:**
- [ ] Revisit `data-warehouse-architecture.template.md` with real-time streaming layer (Kafka, Kinesis, or Change Data Capture)
- [ ] Revisit `etl-pipeline-design.template.md` with streaming CDC and sub-minute latency requirements
- [ ] Revisit `bi-connection-patterns.md` with embedded analytics and row-level security configurations
- [ ] Revisit `data-quality-governance.template.md` with automated anomaly detection and data contracts

**What this looks like in practice:** You have a streaming data platform alongside your batch warehouse, ML models predicting churn and LTV, embedded analytics dashboards inside your product (customer-facing analytics), automated regulatory reporting exports, and a data team that operates like a product team — with sprints, a backlog, and internal SLAs for data requests.

**Time estimate:** 4–6 hours

---

## Decision Matrix: Quick Reference

This table shows every file in Section 35 and what action to take at each maturity level.

| File | Spreadsheet | Tool-Native | Governed | Predictive |
|------|-------------|-------------|----------|------------|
| `bi-maturity-assessment.md` | Read | Read | Read | Read |
| `bi-platform-decision-tree.md` | — | Read | Read | Read |
| `bi-connection-patterns.md` | — | Configure | Configure | Configure + embedded |
| `data-warehouse-architecture.template.md` | — | Lite | Full | Full + streaming |
| `etl-pipeline-design.template.md` | — | Basic | Full | Full + CDC |
| `transformation-layer.template.md` | — | — | Full | Full |
| `data-quality-governance.template.md` | — | — | Resolve | Resolve + anomaly detection |
| `bi-gotchas.md` | — | Skim | Read | Study |
| `metrics-hub/unified-metrics-registry.template.md` | Reference only | Full | Full | Full |
| `metrics-hub/cross-section-metric-map.md` | — | — | Read + apply | Read + apply |
| `metrics-hub/data-lineage-catalog.template.md` | — | — | Resolve | Resolve |
| `metrics-hub/alert-threshold-registry.template.md` | — | — | Resolve | Resolve |
| `executive-reporting/board-deck-templates.template.md` | — | — | Resolve | Resolve |
| `executive-reporting/mrr-arr-waterfall.template.md` | — | — | Resolve | Resolve |
| `executive-reporting/cohort-analysis.template.md` | — | — | Resolve | Resolve |
| `executive-reporting/unit-economics-dashboard.template.md` | — | — | Resolve | Resolve |
| `executive-reporting/okr-kpi-tracking.template.md` | — | — | Resolve | Resolve |
| `executive-reporting/departmental-dashboards.template.md` | — | — | Resolve | Resolve |
| `executive-reporting/multi-product-pl.template.md` | — | — | — | Resolve |
| `executive-reporting/geographic-segment-analysis.template.md` | — | — | — | Resolve |
| `executive-reporting/regulatory-reporting.template.md` | — | — | — | Resolve |

**Legend:**
- **—** = Skip entirely at this level
- **Read** = Read for awareness, do not resolve placeholders
- **Skim** = Scan headings and anti-patterns relevant to your stack
- **Study** = Read thoroughly and apply lessons to your implementation
- **Lite / Basic** = Resolve with minimal configuration (core sections only)
- **Full** = Resolve all sections and placeholders
- **Reference only** = Fill in metric definitions for future use, do not build infrastructure
- **Configure** = Set up connections and verify data flows
- **Resolve** = Complete the full template with all placeholders and checklists

---

## Reassessment Triggers

Reassess your maturity level when any of the following occur:

- You add 3 or more new data sources in a single quarter
- A data quality issue causes an incorrect board report or investor update
- You adopt a compliance framework that requires audit-ready data exports (SOC 2, SOX, GDPR)
- Your team grows past 10 engineers or adds a dedicated data hire
- A stakeholder creates a competing spreadsheet because they do not trust the existing dashboards
- Monthly data infrastructure costs exceed $500
- You launch a second product line or enter a new geographic market
- An executive asks "why does my number not match yours?" more than twice in a month
- You need to provide data to an external auditor, acquirer, or regulatory body
- Your ETL pipeline fails silently and nobody notices for more than 24 hours

BI maturity is not a one-time assessment. Review quarterly during hardening (Steps 29–33) and upgrade your infrastructure as your data surface area grows. The cost of under-investment compounds — every month you operate with ungoverned data, the migration to governed data gets harder.
