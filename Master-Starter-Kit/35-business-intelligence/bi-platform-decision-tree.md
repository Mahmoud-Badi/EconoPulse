# BI Platform Decision Tree

> Choosing a BI platform is one of the most consequential infrastructure decisions in this section. The platform you select determines your query language, your governance model, your embedding capabilities, and your migration cost if you outgrow it. This guide provides a structured comparison and decision tree to prevent the two most common outcomes: picking a tool because your investor uses it, or picking a tool because it was the first Google result.

---

## Platform Comparison Matrix

| Criteria | Metabase | Looker | Tableau | Preset (Superset) | PowerBI | Redash |
|----------|----------|--------|---------|-------------------|---------|--------|
| **Cost (startup)** | Free (self-hosted) / $85/mo (cloud, 5 users) | $5,000+/mo (contact sales) | $70/user/mo (Creator) | Free (self-hosted) / $228/mo (cloud, 10 users) | $10/user/mo (Pro) | Free (self-hosted) / deprecated cloud |
| **Self-hosted?** | Yes (Docker, JAR) | No (Google Cloud only) | No (Tableau Server is on-prem but not self-hosted in the traditional sense) | Yes (Docker, Helm) | No (SaaS only for Pro; on-prem via Report Server at enterprise pricing) | Yes (Docker) |
| **Primary query language** | SQL + visual query builder | LookML (proprietary modeling layer) + SQL | VizQL (visual) + custom SQL | SQL + visual query builder | DAX + M (Power Query) + limited SQL | SQL only |
| **Embedded analytics** | Basic (iframe, signed embedding) | Full (Looker Embedded, API-driven) | Full (Tableau Embedded Analytics) | Moderate (embedded dashboards, API) | Moderate (Power BI Embedded, per-capacity pricing) | Basic (iframe, API) |
| **Governed metrics layer** | No native semantic layer (pair with dbt metrics) | Yes (LookML is the semantic layer) | No native (pair with Tableau Catalog at enterprise tier) | Partial (Superset semantic layer, less mature) | Partial (dataflows and composite models) | No |
| **Learning curve** | Low (SQL + point-and-click) | High (LookML requires dedicated training) | Medium (visual is intuitive, advanced is complex) | Low-Medium (SQL + visual, Superset familiarity helps) | Medium (DAX has a steep learning curve) | Low (SQL-only, minimal UI) |
| **Real-time support** | Polling-based (minimum 1-min cache) | Near-real-time (Looker PDTs + derived tables) | Real-time via Tableau Bridge or live connections | Polling-based (configurable cache) | Near-real-time (DirectQuery mode, performance trade-offs) | Polling-based (scheduled queries) |
| **Best for** | SQL-first teams, startups, self-hosted requirements | Enterprise teams needing governed metrics at scale | Organizations with non-technical analysts who prefer visual exploration | Teams wanting Superset with managed hosting, SQL-first | Microsoft-ecosystem organizations, Excel-heavy teams | Minimal teams wanting SQL-only dashboards with no frills |

---

## Decision Tree

Work through these questions in order. The first question where you answer "yes" narrows your shortlist. Continue through subsequent questions to reach a final recommendation.

### Question 1: Do you require self-hosting?

Some organizations cannot send data to third-party cloud services due to compliance, data residency, or security policies.

**Yes → Shortlist: Metabase, Preset (Superset), Redash**

- Metabase: most polished self-hosted experience, Docker or JAR deployment, active open-source community
- Preset: Apache Superset with commercial backing, Helm charts for Kubernetes deployment
- Redash: lightweight and SQL-focused, but development has slowed significantly since the Databricks acquisition; evaluate long-term maintenance risk

**No → All platforms remain viable. Continue to Question 2.**

### Question 2: Is your BI budget above $1,000/month?

This threshold separates self-hosted/free-tier tools from enterprise-licensed platforms.

**Yes → Shortlist adds: Looker, Tableau, PowerBI (enterprise tier)**

- If budget is $1,000–$3,000/month: Metabase Cloud (Pro), Preset Cloud (Professional), or PowerBI Premium Per User
- If budget is $3,000–$10,000/month: Looker, Tableau (team licenses), or PowerBI Premium Per Capacity
- If budget exceeds $10,000/month: Looker or Tableau Enterprise with full governance, embedding, and support

**No → Prioritize: Metabase (self-hosted free), Preset (self-hosted free), Redash (self-hosted free), PowerBI Pro ($10/user/mo)**

### Question 3: Do you need a governed semantic layer?

A semantic layer (also called a metrics layer) defines business logic — what "MRR" means, how "churn rate" is calculated, which filters apply by default — in a single governed location, so every dashboard and query uses the same definitions.

**Yes → Looker (LookML is the industry-standard semantic layer)**

- LookML provides version-controlled metric definitions, row-level access controls, and derived table management in a single modeling language
- Alternative: pair any BI tool with dbt's metrics layer (dbt Semantic Layer via MetricFlow), though this is less mature than LookML and requires dbt Cloud for the full experience

**No → Continue to Question 4.**

### Question 4: Is your team SQL-first?

If your analysts and engineers are comfortable writing SQL and prefer it over visual drag-and-drop interfaces, SQL-native tools will have lower friction and faster adoption.

**Yes → Prioritize: Metabase, Preset, Redash**

- Metabase: SQL editor with visual query builder as fallback, saved questions, dashboard filters
- Preset: full SQL Lab (inherited from Superset), chart builder, dashboard tabs
- Redash: SQL editor only, minimal visual layer, best for teams that want SQL and nothing else

**No → Prioritize: Tableau (visual-first), PowerBI (visual + DAX), Metabase (visual query builder is approachable for non-SQL users)**

### Question 5: Are you in a Microsoft ecosystem?

If your organization already uses Microsoft 365, Azure, SharePoint, and Teams, PowerBI integrates natively with minimal friction.

**Yes → PowerBI**

- Native integration with Azure data services (Synapse, Data Factory, Azure SQL)
- Embeds directly in Microsoft Teams and SharePoint
- Uses Azure Active Directory for SSO and row-level security
- Excel integration via Analyze in Excel feature

**No → Continue to Question 6.**

### Question 6: Do you need embedded analytics in your product?

Embedded analytics means surfacing dashboards, charts, or data exploration directly inside your application — customer-facing analytics, white-labeled reporting, or in-app dashboards.

**Yes → Evaluate in this order:**

1. **Looker** — most mature embedded offering (Looker Embedded), API-driven, white-label support, row-level security per tenant, usage-based pricing for embedded
2. **Preset** — embedded dashboards via Superset's API, less polished than Looker but functional for basic use cases, lower cost
3. **Metabase** — signed embedding (Pro/Enterprise tier), iframe-based, adequate for internal or simple customer-facing dashboards, limited customization compared to Looker

**No → Your choice is primarily about team preference, cost, and governance needs. Revisit the comparison matrix above.**

---

## Per-Platform Guidance

### Metabase

**When to choose:**
- Your team is SQL-literate and wants a tool that stays out of the way
- You need self-hosting (compliance, data residency, or cost reasons)
- You are at Tool-Native or Governed maturity and want to defer the cost of Looker/Tableau until you have proven the value of dashboarding
- You want a BI tool that a new engineer can set up in under an hour

**When to avoid:**
- You need a governed semantic layer without pairing with dbt — Metabase has no native LookML equivalent
- You need enterprise-grade embedded analytics with white-labeling and per-tenant row-level security (Metabase embedding is functional but limited compared to Looker)
- You have more than 50 dashboard consumers who need granular permission management — Metabase's permission model is adequate but not as sophisticated as Looker or Tableau

**Connection pattern:**
- Direct JDBC connection to your warehouse (PostgreSQL, MySQL, BigQuery, Snowflake, Redshift, and 20+ others)
- Recommended: connect to a read replica or warehouse, never to your production OLTP database
- Supports SSH tunneling for warehouses behind firewalls
- Caching: configurable per-question, default 1-hour TTL

**Gotchas:**
- The visual query builder generates inefficient SQL for complex joins — always verify the generated SQL for performance-sensitive dashboards
- Self-hosted Metabase stores its own metadata in an embedded H2 database by default; migrate this to PostgreSQL immediately for production use or you will lose your dashboards when the container restarts
- Metabase Cloud does not support connecting to databases that require SSH tunnels or VPN access — self-hosted is required for those configurations

---

### Looker

**When to choose:**
- You need a governed semantic layer and are willing to invest in LookML modeling
- You have a dedicated data team (or at least one analyst) who can own the LookML layer
- You need enterprise-grade embedded analytics
- You are at Governed or Predictive maturity and need consistent metric definitions enforced at the platform level, not just by convention
- You are already on Google Cloud Platform (Looker is tightly integrated with BigQuery)

**When to avoid:**
- You are pre-Series A and cannot justify $5,000+/month for a BI tool
- You do not have anyone willing to learn LookML — without a maintained LookML model, Looker is an expensive SQL runner
- You need self-hosting — Looker is Google Cloud only (Looker Core on GCP)
- Your team changes BI requirements weekly — LookML's governance is a feature for stable organizations but a bottleneck for rapidly iterating ones

**Connection pattern:**
- Native BigQuery integration (zero-config on GCP)
- JDBC connection to Snowflake, Redshift, PostgreSQL, MySQL, and others
- Looker maintains a persistent connection and uses its own query optimizer on top of LookML
- PDTs (Persistent Derived Tables) provide materialized view-like functionality managed by Looker

**Gotchas:**
- LookML has a real learning curve — budget 2–4 weeks for a data engineer to become productive, not 2–4 days
- Looker pricing is opaque and negotiation-dependent; get a quote before committing architecturally
- Looker's Explore interface (the end-user query builder) is powerful but intimidating for non-technical stakeholders — plan for training
- Migration away from Looker is expensive because LookML is proprietary; your metric definitions are locked in the platform unless you maintain a parallel registry

---

### Tableau

**When to choose:**
- Your analysts are non-technical and prefer visual drag-and-drop exploration over SQL
- You need advanced data visualization capabilities (geographic maps, complex chart types, statistical analysis)
- You are in a large organization where Tableau is already the corporate standard
- You need Tableau Prep for visual data preparation workflows

**When to avoid:**
- Your team is SQL-first — Tableau's visual-first paradigm will feel like a detour
- You are a startup optimizing for cost — Tableau's per-user pricing ($70/user/mo for Creators, $42/user/mo for Explorers, $15/user/mo for Viewers) adds up quickly
- You need self-hosting in the traditional sense — Tableau Server exists but is a significant operational burden
- You want a governed semantic layer — Tableau Catalog (their metadata management layer) requires the Data Management Add-on at enterprise pricing

**Connection pattern:**
- Tableau Desktop connects directly to warehouses via native connectors or ODBC/JDBC
- Tableau Cloud uses Tableau Bridge for on-premises data sources behind firewalls
- Live connection vs Extract: Extracts (scheduled snapshots) are faster for dashboards but introduce latency; live connections are real-time but slower
- Supports virtually every warehouse: Snowflake, BigQuery, Redshift, PostgreSQL, MySQL, SQL Server, and dozens more

**Gotchas:**
- Tableau's licensing model is complex — understand the Creator/Explorer/Viewer tiers and their capability differences before purchasing
- Extracts can grow large and consume significant Tableau Cloud storage; monitor extract sizes and schedules
- Tableau workbooks (.twb/.twbx) are binary files that do not diff well in version control — governance requires Tableau Server/Cloud's built-in versioning
- Performance degrades noticeably with dashboards that have more than 10 worksheets or use complex calculated fields with live connections

---

### Preset (Apache Superset)

**When to choose:**
- You want Apache Superset with commercial support, managed hosting, and a smoother setup experience
- Your team is SQL-first and wants a tool similar to Metabase but with more chart types and a more flexible dashboard layout system
- You need self-hosting capabilities (Superset is fully open-source under Apache 2.0)
- You want a BI tool that supports advanced features like SQL Lab, Jinja templating in queries, and custom visualization plugins

**When to avoid:**
- You need a polished, low-learning-curve experience for non-technical users — Superset's UI is functional but less refined than Metabase or Tableau
- You need enterprise-grade embedded analytics — Preset's embedding is functional but less mature than Looker's
- You are evaluating based on community momentum — Superset has a large contributor base but the project's direction can shift with Apache governance dynamics
- You need a governed semantic layer — Superset's semantic layer exists but is less battle-tested than LookML

**Connection pattern:**
- SQLAlchemy-based connections (supports any database with a SQLAlchemy dialect)
- Native support for BigQuery, Snowflake, Redshift, PostgreSQL, MySQL, ClickHouse, Trino/Presto, and many others
- Supports Jinja templating in SQL queries for dynamic filters and parameterized dashboards
- Caching via Redis (configurable per-chart or per-dashboard)

**Gotchas:**
- Self-hosted Superset requires Redis and a metadata database (PostgreSQL recommended) — the infrastructure footprint is larger than Metabase
- Superset's role-based access control (RBAC) is powerful but complex to configure — plan for setup time
- Chart rendering performance varies by chart type — some advanced visualizations (deck.gl maps, pivot tables with large datasets) can be slow
- Upgrading self-hosted Superset across major versions can require database migrations and configuration changes — pin your version and test upgrades in staging

---

### PowerBI

**When to choose:**
- Your organization is deeply embedded in the Microsoft ecosystem (Azure, M365, Teams, SharePoint)
- You have analysts who are proficient in Excel and want a natural progression to more powerful analytics
- You need tight integration with Azure data services (Synapse Analytics, Azure Data Factory, Azure SQL)
- Your per-user budget is under $15/month and you need more than a SQL runner (PowerBI Pro at $10/user/mo is the most cost-effective commercial option)

**When to avoid:**
- You are not in the Microsoft ecosystem — PowerBI's advantages evaporate outside of Azure/M365
- Your team is SQL-first — DAX (Data Analysis Expressions) is PowerBI's formula language and it has a steep, unintuitive learning curve that SQL users find frustrating
- You need self-hosting — PowerBI is SaaS-only for the Pro tier; PowerBI Report Server (on-prem) is limited to Premium licensing
- You are on macOS — PowerBI Desktop is Windows-only; the web experience is functional but limited for report authoring

**Connection pattern:**
- DirectQuery: live connection to supported data sources (Azure SQL, Snowflake, BigQuery via partner connector, PostgreSQL, SQL Server)
- Import mode: scheduled refresh pulls data snapshots into PowerBI's in-memory engine (VertiPaq)
- Dataflows: Power Query-based ETL within PowerBI for lightweight transformations
- Gateway: PowerBI On-premises Data Gateway required for connecting to on-prem data sources from PowerBI Cloud

**Gotchas:**
- DAX is not SQL — it is a functional language closer to Excel formulas than to relational queries; budget real learning time for analysts transitioning from SQL
- DirectQuery performance depends heavily on the source database — poorly optimized source queries create slow dashboards with no obvious debugging path in PowerBI
- Row-level security in PowerBI requires DAX expressions per role — it works but is less intuitive than Looker's access filters or Metabase's sandboxing
- PowerBI's 1GB dataset limit on Pro (10GB on Premium Per User) catches teams off guard when their data grows; Import mode datasets that exceed the limit require Premium capacity licensing

---

### Redash

**When to choose:**
- You want the simplest possible SQL-to-dashboard tool with minimal configuration
- You have a team of engineers who prefer writing SQL and do not want a visual query builder, semantic layer, or any abstraction between their SQL and their charts
- You need a self-hosted, open-source solution and your requirements are simple (queries, basic charts, scheduled email reports)
- You are at Tool-Native maturity and want a temporary BI solution while you evaluate more capable platforms

**When to avoid:**
- You need active development and long-term vendor support — Redash was acquired by Databricks in 2020 and open-source development has slowed significantly
- You need any of: governed semantic layer, embedded analytics, advanced visualizations, row-level security, or SSO without self-hosted configuration
- You have non-technical dashboard consumers — Redash's interface is designed for people who write SQL
- You are choosing a platform for the next 3+ years — Redash's uncertain development trajectory makes it a risky long-term bet

**Connection pattern:**
- Direct database connections via Python database drivers
- Supports PostgreSQL, MySQL, BigQuery, Snowflake, Redshift, ClickHouse, Presto/Trino, MongoDB, and others
- Query results are cached with configurable TTL
- Scheduled queries with email alerts on threshold breaches

**Gotchas:**
- Self-hosted Redash requires Redis and PostgreSQL for its own metadata — similar infrastructure footprint to Superset
- No visual query builder — if a stakeholder cannot write SQL, they cannot use Redash
- Dashboard interactivity is limited — no cross-filtering, no drill-downs, no parameterized dashboards without manual query parameter setup
- The Docker Compose setup in the Redash repository works for development but requires hardening for production (persistent volumes, backup strategy, resource limits)

---

## The Recommendation

For most SaaS startups at Governed maturity or below, **Metabase + dbt is the highest-value starting point.** It is free (self-hosted), SQL-native, handles 90% of dashboard needs, and the migration path to Looker or Preset is well-documented if you outgrow it.

This pairing works because:

1. **dbt provides the semantic layer that Metabase lacks.** Define your metrics, dimensions, and business logic in dbt models. Metabase queries the output tables. When your metric definitions change, you change the dbt model and every downstream dashboard updates automatically.

2. **Metabase provides the visualization layer that dbt lacks.** dbt transforms and tests your data but has no dashboarding capability. Metabase turns dbt's output tables into interactive dashboards, scheduled reports, and filtered views for different stakeholders.

3. **The migration path is clear.** If you outgrow Metabase — because you need a native semantic layer, enterprise embedding, or Looker-grade governance — your dbt models transfer directly to Looker (LookML can consume dbt models), Preset, or any other BI tool. Your data infrastructure investment is not lost.

4. **The cost is right.** Self-hosted Metabase + dbt Core is $0 in licensing. Your costs are warehouse compute and the engineer-hours to maintain the models. For a team that is not yet sure whether BI will deliver ROI, this removes the financial barrier to experimentation.

**When to skip this recommendation and go directly to Looker:** You are Series B+, you have a data team of 3 or more, you need embedded analytics in your product, or you have compliance requirements that demand platform-level governance controls. At that scale, the LookML investment pays for itself in consistency and governance — and the cost of migrating from Metabase to Looker later is higher than starting with Looker from the beginning.

**When to skip this recommendation and go directly to PowerBI:** You are a Microsoft-ecosystem organization where every employee already has a Microsoft 365 license. PowerBI Pro is included in some M365 plans or available for $10/user/month. The integration with Teams, SharePoint, and Azure makes it the path of least resistance, even if it is not the "best" BI tool in isolation.
