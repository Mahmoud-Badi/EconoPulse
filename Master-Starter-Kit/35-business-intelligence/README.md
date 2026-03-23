# Phase 35: Business Intelligence

> Scattered dashboards are not a BI strategy. This section builds the data infrastructure that connects your application database to governed dashboards, the executive reporting layer that turns raw metrics into board-ready decisions, and the unified metrics registry that prevents five teams from having five different definitions of "churn rate."

---

## Why This Exists

The Master Starter Kit already generates metrics across multiple sections: marketing KPIs in Section 19, post-launch health metrics in Section 20, financial modeling in Section 25, and CX operations dashboards in Section 33. Each section defines what to measure and why. But none of them answer three critical questions:

**How does the data actually get there?** Your application database stores events, transactions, and user activity in an OLTP schema optimized for writes. Your BI dashboards need an OLAP schema optimized for analytical queries. Between those two worlds sits an ETL pipeline, a data warehouse, a transformation layer, and a BI visualization tool — none of which are covered by the existing sections. Without this infrastructure, teams export CSVs from their admin panel and paste them into Google Sheets, which is how you end up with a $50M company making decisions based on a spreadsheet that was last updated "sometime last month."

**Who sees what, and in what format?** A board member needs a 12-slide deck with MRR waterfalls and cohort retention curves. A VP of Engineering needs a departmental dashboard showing deployment frequency, incident rates, and tech debt metrics. A product manager needs feature adoption funnels and activation rates. A CFO needs multi-product P&L breakdowns with cost allocation by department. The existing sections define the raw metrics but not the reporting layer that packages those metrics for each audience. Without executive reporting templates, leadership consumes data through ad-hoc Slack messages and verbal updates — which means they are making decisions on incomplete, stale, and inconsistent information.

**Where is the single source of truth?** When Section 19 defines "conversion rate" and Section 25 defines "trial-to-paid conversion" and Section 33 defines "activation rate," are these the same metric with three names, three different metrics, or three overlapping metrics with subtle definitional differences? Without a unified metrics registry that maps every KPI to its canonical definition, source system, warehouse table, and dashboard location, organizations develop "metric drift" — where the same number means different things to different teams, eroding trust in data and making cross-functional alignment impossible.

This section closes all three gaps. Layer 1 (Data Infrastructure) builds the plumbing. Layer 2 (Executive Reporting) builds the presentation. Layer 3 (Metrics Hub) builds the governance.

---

## How It Integrates with the Orchestrator

This section is triggered by **Step 28.7** in the Orchestrator, positioned after competitive intelligence (Step 28.5) and before the session boundary SB-6 and hardening (Steps 29-33). This placement ensures all source metrics from Sections 19, 20, 25, and 33 have been defined before the BI layer attempts to unify them.

**Skip condition:** `CONFIG.BI_ENABLED == "false"`. Projects that are pre-MVP or explicitly opting out of BI infrastructure skip this section entirely. The maturity assessment provides a graceful degradation path — even "spreadsheet-level" projects generate a metrics registry for future reference.

**Relationship with Section 11 (New Capabilities — Analytics Tracking):** Section 11 defines the event taxonomy and tracking plan — the raw events your application emits (page views, feature usage, conversions). Section 35 consumes those events as inputs to the ETL pipeline. Section 11 answers "what events do we fire?" Section 35 answers "where do those events go after they're fired, and how do they become dashboard metrics?"

**Relationship with Section 19 (Marketing — Analytics & Tracking):** Section 19 defines marketing KPIs (traffic, conversion funnels, channel attribution, email engagement). Section 35 maps those KPIs into the unified metrics registry, assigns them warehouse tables, and routes them to the appropriate executive dashboards. The KPI dashboard template in Section 19 is a conceptual framework; Section 35 provides the data infrastructure that makes it a live, auto-refreshing dashboard.

**Relationship with Section 20 (Post-Launch Operations):** Section 20 defines operational health metrics (DAU/MAU, retention curves, error rates, latency, uptime). Section 35 ingests these into the warehouse alongside business metrics, enabling cross-domain analysis — for example, correlating a latency spike in Section 20 with a churn increase in Section 25. The post-launch metrics dashboard becomes one consumer of the centralized BI pipeline.

**Relationship with Section 25 (Financial Modeling):** Section 25 defines the financial metrics and projection models (MRR, ARR, unit economics, runway). Section 35 builds the actuals-tracking layer — the MRR waterfall that shows real revenue movements, the cohort analysis that validates LTV projections, the board deck that presents financial performance to investors. Section 25 is the forecast; Section 35 is the scorecard.

**Relationship with Section 33 (Customer Experience Operations):** Section 33 defines CX-specific metrics (CSAT, NPS, health scores, ticket resolution times). Section 35 connects these to the enterprise BI layer, enabling analysis like "customers with health scores below 40 have a 3x higher churn rate" — which requires joining CX data with financial data in the warehouse.

**Relationship with Section 09 (Deployment & Operations):** Section 09 defines monitoring and alerting infrastructure. Section 35 extends this with business metric alerting — not just "is the server up?" but "did MRR drop more than 5% this week?" The alert threshold registry in Section 35 complements the operational alerting in Section 09.

**Relationship with Section 32 (Integrations):** The BI pipeline itself is an integration — connecting your database, ETL tool, warehouse, and BI platform. Section 32's resilience patterns and health monitoring apply to the BI stack. The integration health metrics from Section 32 also flow into the operational health dashboard in Section 35.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Overview, reading order, cross-references | 28.7 |
| `bi-maturity-assessment.md` | Guide | 4-tier maturity model and prioritization decision tree | 28.7 |
| `data-warehouse-architecture.template.md` | Template | Star schema, dimensional modeling, warehouse platform selection | 28.7 |
| `etl-pipeline-design.template.md` | Template | ETL/ELT pipeline from app DB to warehouse to BI tool | 28.7 |
| `transformation-layer.template.md` | Template | dbt-style model templates, testing patterns, CI for transforms | 28.7 |
| `bi-platform-decision-tree.md` | Guide | Metabase vs Looker vs Tableau vs Preset vs PowerBI selection | 28.7 |
| `data-quality-governance.template.md` | Template | Data lineage, PII handling, audit trails, freshness SLAs | 28.7 |
| `bi-connection-patterns.md` | Guide | Per-tool connection setup (JDBC, API, direct query) | 28.7 |
| `executive-reporting/board-deck-templates.template.md` | Template | Board deck structure, investor updates, slide-by-slide guide | 28.7 |
| `executive-reporting/mrr-arr-waterfall.template.md` | Template | MRR/ARR waterfall analysis with segment drill-downs | 28.7 |
| `executive-reporting/cohort-analysis.template.md` | Template | Retention, revenue, behavioral, and LTV cohort analysis | 28.7 |
| `executive-reporting/unit-economics-dashboard.template.md` | Template | CAC payback, NRR, expansion revenue, gross margin | 28.7 |
| `executive-reporting/okr-kpi-tracking.template.md` | Template | OKR framework, KPI trees, objective cascading | 28.7 |
| `executive-reporting/departmental-dashboards.template.md` | Template | Product, engineering, sales, marketing, support, finance dashboards | 28.7 |
| `executive-reporting/multi-product-pl.template.md` | Template | Multi-product P&L, cost allocation, contribution margin | 28.7 |
| `executive-reporting/geographic-segment-analysis.template.md` | Template | Geographic, market segment, and industry breakdowns | 28.7 |
| `executive-reporting/regulatory-reporting.template.md` | Template | SOC2/GDPR/SOX audit-ready exports and compliance dashboards | 28.7 |
| `metrics-hub/unified-metrics-registry.template.md` | Template | Master registry of every KPI with definitions and lineage | 28.7 |
| `metrics-hub/cross-section-metric-map.md` | Guide | Maps metrics from sections 19, 20, 25, 33 into BI hierarchy | 28.7 |
| `metrics-hub/data-lineage-catalog.template.md` | Template | Source-to-dashboard lineage for every metric | 28.7 |
| `metrics-hub/alert-threshold-registry.template.md` | Template | Green/yellow/red thresholds, escalation rules per metric | 28.7 |
| `bi-gotchas.md` | Guide | Production anti-patterns and lessons for BI infrastructure | 28.7 |

---

## Reading Order

1. **`bi-maturity-assessment.md`** — Start here. Assess your current BI maturity level so you know which files to prioritize and which to defer. A team with no data engineer and 3 integrations needs a very different BI strategy than a team with a data team and 20 data sources.
2. **`bi-platform-decision-tree.md`** — Select your BI visualization platform. This decision affects connection patterns, query language, governance capabilities, and cost.
3. **`data-warehouse-architecture.template.md`** — Design your warehouse schema. This is the foundation everything else sits on — get the dimensional model wrong and every downstream report will be painful.
4. **`etl-pipeline-design.template.md`** — Design the pipeline that moves data from your application database into the warehouse. CDC patterns, extraction scheduling, staging layer design.
5. **`transformation-layer.template.md`** — Design the transformation layer (dbt models or equivalent) that converts raw staging data into analytics-ready tables.
6. **`bi-connection-patterns.md`** — Configure the connection between your warehouse and your BI platform. JDBC, API, direct query, or semantic layer — each has trade-offs.
7. **`data-quality-governance.template.md`** — Define data quality rules, freshness SLAs, PII handling, and audit trails. This is what separates "we have dashboards" from "we trust our dashboards."
8. **`metrics-hub/unified-metrics-registry.template.md`** — Build the master registry of every metric in your organization. This is the single source of truth that prevents metric drift.
9. **`metrics-hub/cross-section-metric-map.md`** — Map each metric to its source section, data pipeline, and consuming dashboards. This is the rosetta stone for cross-functional alignment.
10. **`metrics-hub/data-lineage-catalog.template.md`** — Document the full lineage for each metric from source system to dashboard. When a number looks wrong, this tells you where to investigate.
11. **`metrics-hub/alert-threshold-registry.template.md`** — Define alerting thresholds for business metrics. Not just "is the server up?" but "did MRR drop more than 5%?"
12. **`executive-reporting/board-deck-templates.template.md`** — Structure your board deck and investor updates. Start here for the executive reporting layer.
13. **`executive-reporting/mrr-arr-waterfall.template.md`** — Build the MRR waterfall that decomposes revenue changes into new, expansion, contraction, and churn.
14. **`executive-reporting/cohort-analysis.template.md`** — Design cohort analyses for retention, revenue, behavior, and lifetime value.
15. **`executive-reporting/unit-economics-dashboard.template.md`** — Build the unit economics dashboard that tracks CAC payback, NRR, and gross margin.
16. **`executive-reporting/okr-kpi-tracking.template.md`** — Set up OKR tracking with KPI trees and objective cascading.
17. **`executive-reporting/departmental-dashboards.template.md`** — Design department-specific dashboards for product, engineering, sales, marketing, support, and finance.
18. **`executive-reporting/multi-product-pl.template.md`** — Build multi-product P&L breakdowns with cost allocation.
19. **`executive-reporting/geographic-segment-analysis.template.md`** — Design geographic and market segment analysis dashboards.
20. **`executive-reporting/regulatory-reporting.template.md`** — Set up compliance and regulatory reporting exports.
21. **`bi-gotchas.md`** — Read last. These production lessons will resonate more after you understand the full BI framework.

---

## Quick Start Checklist

- [ ] Complete the BI maturity self-assessment and identify your current level
- [ ] Select a BI platform using the decision tree (Metabase, Looker, Tableau, Preset, PowerBI)
- [ ] Design your data warehouse schema with fact and dimension tables
- [ ] Configure your ETL/ELT pipeline from application database to warehouse
- [ ] Set up the transformation layer (dbt models or equivalent) with tests
- [ ] Define data quality rules, freshness SLAs, and PII handling strategy
- [ ] Build the unified metrics registry with all KPIs from Sections 19, 20, 25, 33
- [ ] Map each metric's lineage from source system to consuming dashboard
- [ ] Define alert thresholds for critical business metrics
- [ ] Create your board deck template with stage-appropriate slides
- [ ] Build MRR waterfall and cohort analysis dashboards
- [ ] Design departmental dashboards for each functional area
- [ ] Set up a monthly BI review cadence to catch metric drift and dashboard sprawl

---

## Key Principles

**Data infrastructure is not optional — it is invisible.** The best BI systems feel like magic to their consumers: dashboards refresh automatically, numbers are consistent across reports, and new metrics can be added without rebuilding the pipeline. This invisibility requires significant upfront investment in warehouse design, ETL reliability, and transformation testing. Teams that skip the infrastructure and go straight to dashboards end up with a Frankenstein of one-off queries, manual exports, and conflicting numbers.

**One metric, one definition, one owner.** Metric drift — where "churn" means something different to the CFO, the product manager, and the support lead — is the most corrosive problem in enterprise analytics. The unified metrics registry exists to enforce canonical definitions. Every metric has exactly one owner who is responsible for its definition, calculation, and data quality. Disputes are resolved by the owner, not by creating a second version.

**Dashboards are products, not projects.** A dashboard that gets built and never maintained is worse than no dashboard, because it provides false confidence. Every dashboard should have an owner, a refresh cadence, a data quality SLA, and a deprecation plan. The departmental dashboards template includes lifecycle management for exactly this reason.

**Executive reporting is translation, not decoration.** A board deck is not a prettier version of a database query. It translates data into narrative — what happened, why it happened, what we are doing about it, and what we need from the board. The MRR waterfall does not just show numbers; it tells the story of which customer segments are expanding and which are contracting. Good executive reporting makes the audience smarter, not just informed.

**Start governed, or you will never get there.** Teams that defer data governance to "when we are bigger" discover that retrofitting governance onto an ungoverned data stack is like adding types to a JavaScript codebase — technically possible but practically agonizing. Define metric ownership, data lineage, and quality rules from day one, even if your warehouse has only five tables. The marginal cost of governance at creation time is near zero; the cost of governance after two years of ungoverned growth is enormous.

**Maturity is a ladder, not a destination.** The maturity assessment exists so that spreadsheet-level teams do not waste time designing a Snowflake warehouse, and predictive-level teams do not settle for a Google Sheet. Build what you need today with clear extension points for tomorrow. The templates are designed to scale — a metrics registry that starts with 15 metrics and grows to 150 should not require structural changes.

---

## Placeholder Variables Used in This Section

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{PROJECT_NAME}}` | Product or project display name | `Fleet Manager`, `Acme SaaS` |
| `{{DATABASE}}` | Application database | `postgresql`, `mysql`, `mongodb` |
| `{{BI_ENABLED}}` | Whether BI infrastructure is planned | `true`, `false` |
| `{{BI_WAREHOUSE}}` | Data warehouse platform | `snowflake`, `bigquery`, `redshift`, `postgres`, `clickhouse`, `duckdb` |
| `{{BI_ETL_TOOL}}` | ETL/ELT pipeline tool | `fivetran`, `airbyte`, `custom`, `stitch` |
| `{{BI_TRANSFORM_TOOL}}` | Transformation layer tool | `dbt`, `dataform`, `custom-sql` |
| `{{BI_PLATFORM}}` | BI visualization and dashboard tool | `metabase`, `looker`, `tableau`, `preset`, `powerbi`, `superset` |
| `{{BI_MATURITY_LEVEL}}` | Current BI maturity tier | `spreadsheet`, `tool-native`, `governed`, `predictive` |
| `{{BI_REFRESH_CADENCE}}` | Default data refresh frequency | `real-time`, `hourly`, `daily` |
| `{{BI_DATA_RETENTION_MONTHS}}` | Warehouse data retention period | `12`, `24`, `36`, `unlimited` |
| `{{BI_PII_STRATEGY}}` | PII handling approach in warehouse | `mask`, `hash`, `exclude`, `vault` |
| `{{BI_METRIC_OWNER_DEFAULT}}` | Default team owning metric definitions | `engineering`, `data-team`, `product`, `finance` |
| `{{BI_BOARD_CADENCE}}` | Board/investor reporting frequency | `monthly`, `quarterly` |
| `{{BI_DEPARTMENT_DASHBOARDS}}` | Departments needing dedicated dashboards | `["product", "engineering", "sales", "marketing", "support", "finance"]` |
| `{{ANALYTICS_PROVIDER}}` | Product analytics tool (from Section 11) | `posthog`, `mixpanel`, `google-analytics` |
| `{{BILLING_PROVIDER}}` | Billing/payments platform (from Section 30) | `stripe`, `paddle`, `chargebee` |
