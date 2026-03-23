# Migration Strategy Decision Tree

> Five decisions that shape your entire migration architecture. Walk through each node sequentially — the combination of answers determines your technical stack, UX model, staffing needs, and timeline.

---

## Overview

Migration strategy is not a single decision. It is five interconnected decisions that compound. A "simple CSV self-serve" migration and a "complex API-based white-glove" migration share almost no code, no UX, and no operational model. Teams that skip this decision tree build a migration system optimized for one scenario and then discover their customers need a different one.

Walk through Nodes 1-5 in order. At each node, select the option that best fits {{PROJECT_NAME}}. Record your selections in the placeholder registry. The combination of all five decisions produces your migration profile — a specific configuration that determines which templates in this section require full implementation and which can be deferred.

**When to revisit:** Quarterly, or whenever you expand to a new customer segment whose migration needs differ from your initial profile.

---

## Node 1 — Migration Complexity

What is the structural complexity of the data being migrated into {{PROJECT_NAME}}?

Migration complexity is determined by the relationships between data entities, not by volume. A flat list of 1 million contacts is simpler to migrate than a nested hierarchy of 500 projects with tasks, subtasks, dependencies, custom fields, attachments, and audit trails.

### Option A: Simple / Flat Data

**Description:** Data consists of a single entity type or a small number of independent entity types with no relationships between them. Examples: contact lists, product catalogs without variants, email subscriber lists, simple CRM records.

| Pros | Cons |
|------|------|
| CSV upload is sufficient — no relationship mapping needed | Limits the value proposition of migration (competitors can match easily) |
| Self-serve wizard handles 95%+ of cases | May oversimplify — real data often has hidden relationships |
| Fast to build (2-4 weeks for MVP) | Customers with complex data will hit a wall |
| Low support burden — errors are easy to diagnose | |

**Technical implications:**
- Single-pass CSV parser is sufficient
- No dependency ordering required
- Validation is field-level only (type, format, required)
- Rollback is simple DELETE by import batch ID

**Recommended templates:** `csv-import-architecture.template.md`, `import-wizard-ux.template.md`

### Option B: Medium / Relational Data

**Description:** Data has parent-child relationships or foreign key dependencies between 3-8 entity types. Examples: projects with tasks and assignees, e-commerce orders with line items and customers, CRM with contacts, companies, and deals.

| Pros | Cons |
|------|------|
| Covers most B2B SaaS migration scenarios | Requires multi-pass import with dependency ordering |
| Relationship preservation is a strong differentiator | Column mapping UX becomes complex (multiple entity types) |
| Enables full feature adoption from day one | Validation must check referential integrity across entities |
| | Error handling for partial failures is non-trivial |

**Technical implications:**
- Multi-file or multi-sheet import (one per entity type)
- Topological sort for import ordering (parents before children)
- Foreign key resolution with temporary ID mapping
- Rollback requires cascading deletes in reverse dependency order
- Preview step must show relationship validation results

**Recommended templates:** All CSV and mapping templates, `migration-validation-rollback.template.md`

### Option C: Complex / Nested + Large Scale

**Description:** Data has deep nesting (3+ levels), polymorphic relationships, custom schemas, file attachments, or event histories. Examples: project management tools with nested task hierarchies, custom fields, time tracking, and file attachments; ERP systems; complex CRM with workflow automation rules.

| Pros | Cons |
|------|------|
| Full-fidelity migration is a massive competitive advantage | 8-16 weeks to build properly |
| Locks in enterprise customers who cannot migrate elsewhere | Requires dedicated migration engineering team |
| Justifies premium pricing or white-glove onboarding fees | Self-serve is unreliable — edge cases are too numerous |
| Generates deep competitive intelligence from data structures | Support burden is high — every migration is partly custom |

**Technical implications:**
- API-based extraction preferred over file upload (too many entity types for CSV)
- Custom migration scripts per customer segment
- Attachment/file migration requires separate storage pipeline
- Event history import may require backdated timestamps
- Custom field schemas must be dynamically created in target
- Rollback is complex — may require point-in-time database restore

**Recommended templates:** All templates in this section. `api-migration-tooling.template.md` is critical.

---

## Node 2 — Migration Experience Model

How will customers experience the migration process?

The experience model determines your UX investment, staffing needs, and the level of automation required. It should align with your pricing tier and target customer segment.

### Option A: Self-Serve Wizard

**Description:** Customers complete migration independently using an in-product import wizard. No human assistance unless they contact support.

| Pros | Cons |
|------|------|
| Scales infinitely — no marginal cost per migration | Customers blame your product when their data is messy |
| Available 24/7 across all timezones | Complex migrations have high abandonment rates |
| Fastest time-to-value for customers with clean data | Error messages must be exceptionally clear (no human to explain) |
| Lowest operational cost | No opportunity to build relationship during migration |

**Best for:** SMB customers, simple data structures, products where migration volume is high and deal size is low.

**Prerequisites:**
- Polished import wizard UX (`import-wizard-ux.template.md`)
- Comprehensive validation with actionable error messages
- Extensive help documentation for each import step
- Self-serve troubleshooting for common errors

### Option B: Assisted with Templates

**Description:** Customers complete migration using pre-built templates and formatting guides. Support team is available for questions but does not perform the migration. Template downloads, formatting validators, and video walkthroughs reduce friction.

| Pros | Cons |
|------|------|
| Lower support burden than white-glove | Still requires customer effort |
| Templates reduce data formatting errors by 60-80% | Template maintenance as your schema evolves |
| Scales better than white-glove while improving success rates | Customers may not read/follow template instructions |
| Video walkthroughs handle most common questions | |

**Best for:** Mid-market customers, medium complexity data, products where migration success rate matters for retention.

**Prerequisites:**
- Downloadable CSV/Excel templates with example data and column descriptions
- Format validation that references template column names
- Video walkthrough for each migration step
- Pre-formatted export instructions for top 3 competitors

### Option C: White-Glove Dedicated Team

**Description:** A dedicated migration specialist handles the import on behalf of the customer. Customer provides data access, specialist performs extraction, mapping, transformation, and loading. Customer reviews and approves the result.

| Pros | Cons |
|------|------|
| Highest success rate (95%+) | Does not scale — each migration requires hours/days of specialist time |
| Builds deep customer relationship during onboarding | Expensive — typically requires dedicated migration engineering role |
| Handles edge cases and custom requirements gracefully | Creates dependency — customers expect this level of service ongoing |
| Captures detailed competitive intelligence | Specialist availability becomes a bottleneck for sales |

**Best for:** Enterprise customers, complex data, high-ACV products where migration cost is small relative to deal value.

**Prerequisites:**
- Trained migration specialists (internal or contracted)
- Internal migration tooling and admin dashboards
- Customer data access agreements and security review process
- Migration project plan template with timeline and milestones

### Option D: Automated API-to-API

**Description:** Customer authorizes OAuth access to their existing tool. Your system extracts data directly via the competitor's API, transforms it, and loads it — fully automated, no file upload required.

| Pros | Cons |
|------|------|
| Best possible customer experience — "Connect and Go" | Requires building and maintaining integrations per competitor |
| No data formatting issues — source format is known | Competitors may restrict API access or change APIs without notice |
| Handles relationships and attachments automatically | OAuth token management and refresh adds complexity |
| Incremental sync possible — migrate over time, not all at once | Rate limits on competitor APIs constrain migration speed |

**Best for:** Products with 2-5 well-known competitors that have stable APIs. High investment, high payoff.

**Prerequisites:**
- OAuth integration with each target competitor (`api-migration-tooling.template.md`)
- API rate limit management and retry logic
- Incremental migration support for large datasets
- Fallback to CSV import when API access is unavailable

---

## Node 3 — Data Volume Tier

How much data will a typical migration involve?

Volume determines your architecture: small imports can be synchronous in-request operations; large imports require background job queues, worker pools, and progress tracking.

### Option A: Small (Under 10,000 Records)

**Description:** Most imports complete in under 30 seconds. Typical for early-stage products, SMB customers, or narrow-domain tools.

| Pros | Cons |
|------|------|
| Synchronous processing is acceptable — no queue needed | Architecture may not scale when customer base grows |
| Simple progress indication (spinner, then done) | Customers with more data hit unexpected limits |
| In-memory processing is safe — no streaming required | |
| Fastest to build | |

**Technical implications:**
- Process in the web request (synchronous)
- In-memory CSV parsing is safe (10k rows fits comfortably)
- No job queue required
- Progress tracking is optional (operation completes before user loses patience)

### Option B: Medium (10,000 to 1,000,000 Records)

**Description:** Imports take 1-30 minutes. Requires background processing with progress tracking. Typical for established B2B SaaS products.

| Pros | Cons |
|------|------|
| Covers 90% of B2B SaaS migration scenarios | Requires job queue and background workers |
| Streaming parsers handle memory efficiently | Progress tracking UX is required |
| Background jobs allow customer to continue working | Partial failure handling is more complex |
| | Timeout management needed for long operations |

**Technical implications:**
- Background job queue required (`{{MIGRATION_QUEUE}}`)
- Streaming CSV parser (not in-memory) — process in chunks
- Progress tracking with percentage and ETA (`migration-progress-tracking.template.md`)
- Email/in-app notification on completion
- Chunk-based database writes with batch commits

### Option C: Large (Over 1,000,000 Records)

**Description:** Imports take hours to days. Requires distributed processing, careful memory management, and robust error recovery. Typical for enterprise customers migrating from legacy systems.

| Pros | Cons |
|------|------|
| Demonstrates enterprise-grade capability | Significant engineering investment |
| Handles the largest customer migrations without special-casing | Infrastructure costs scale with import size |
| Competitive moat — few products handle this well | Requires dedicated monitoring and alerting |
| | Customer expectation management is critical (days, not minutes) |

**Technical implications:**
- Distributed worker architecture (`bulk-import-architecture.template.md`)
- Database write strategy must handle bulk inserts without locking
- File upload may need multipart/resumable upload support
- Checkpoint/resume capability for interrupted imports
- Dedicated monitoring dashboard for import health
- Consider pre-import data sampling to estimate completion time

### Option D: Streaming / Continuous Sync

**Description:** Migration is not a one-time event but an ongoing synchronization. Data flows continuously from the source system to {{PROJECT_NAME}} until the customer fully transitions.

| Pros | Cons |
|------|------|
| Eliminates the "big bang" migration risk | Most complex architecture — requires CDC or polling |
| Customer can migrate gradually, validating as they go | Conflict resolution for data modified in both systems |
| Reduces pressure on migration timeline | Ongoing infrastructure cost for sync pipeline |
| Enables parallel running of old and new systems | Harder to define "migration complete" |

**Technical implications:**
- Change data capture (CDC) or periodic polling from source
- Conflict resolution strategy (source wins, target wins, merge)
- Watermark tracking for incremental sync position
- Monitoring for sync lag and data drift
- Clear migration completion criteria and cutover plan

---

## Node 4 — Source Systems

Where is the data coming from?

Source system type determines your extraction strategy, data format handling, and the level of competitor-specific engineering required.

### Option A: Known Competitors with Documented Formats

**Description:** You have identified specific competitors ({{COMPETITOR_IMPORTERS}}) whose data formats you will explicitly support. You have documented their export formats and built purpose-built importers.

| Pros | Cons |
|------|------|
| Best customer experience — "Import from X" is a clear CTA | Must build and maintain one importer per competitor |
| Known format eliminates column mapping guesswork | Competitors change export formats without notice |
| Marketing leverage — "Switch from X in 5 minutes" | Limits migration support to listed competitors |
| Captures competitive intelligence from data structures | |

**Technical implications:**
- Pre-built column mappings per competitor
- Format-specific parsers for each competitor's export
- Competitor export instructions in UI
- Regression tests using sample competitor exports
- Monitoring for competitor format changes (periodic test imports)

### Option B: Generic CSV / Excel / JSON Upload

**Description:** Accept common file formats with user-driven column mapping. No competitor-specific logic — the import wizard helps the customer map their columns to your fields.

| Pros | Cons |
|------|------|
| Works with any source system | Column mapping UX adds friction |
| No competitor-specific maintenance burden | Auto-detection of field types is imperfect |
| Customers can export from any tool and import | Customer must understand both source and target schemas |
| Handles internal spreadsheets and legacy systems | More validation errors due to format inconsistency |

**Technical implications:**
- Robust column mapping UI with auto-detection and manual override
- Type inference engine (detect dates, emails, phones, currencies)
- Multiple delimiter support (comma, semicolon, tab, pipe)
- Encoding detection (UTF-8, ISO-8859-1, Windows-1252)
- Excel-specific handling (multiple sheets, formulas, merged cells)

### Option C: API Access via OAuth

**Description:** Connect directly to the source system's API to extract data. Customer authorizes access via OAuth, your system handles extraction.

| Pros | Cons |
|------|------|
| Best UX — no file download/upload cycle | Requires OAuth integration per source |
| Access to full data model including relationships | Source API rate limits constrain speed |
| Can extract data that is not available in CSV exports | Source may revoke API access for departing customers |
| Enables incremental/continuous migration | OAuth token refresh and error handling complexity |

**Technical implications:**
- OAuth 2.0 flow per source system
- API client with rate limit management, retry, and backoff
- Data extraction pipeline with pagination handling
- Token storage and refresh automation
- Fallback strategy when API access fails

### Option D: Database Dumps

**Description:** Customer provides a database export (SQL dump, MongoDB export, etc.) that is loaded directly into a staging environment for transformation.

| Pros | Cons |
|------|------|
| Full fidelity — all data, all relationships, all history | Requires database expertise from customer |
| Fastest for large data volumes | Security risk — customer shares raw database |
| No API rate limits or export format limitations | Schema mapping is fully custom per source database |
| | Cannot be self-serve — requires specialist involvement |

**Technical implications:**
- Secure upload channel for database dumps (encrypted transfer)
- Staging database environment for loading and inspecting source data
- Custom ETL scripts per source database schema
- Data privacy review before processing (PII identification)
- White-glove experience only — not suitable for self-serve

---

## Node 5 — Historical Data Policy

How much historical data will be migrated?

Historical data policy affects migration duration, storage costs, and customer expectations. More history means longer migrations, more edge cases, and higher storage consumption — but also higher perceived value.

### Option A: Full History

**Description:** Import all historical data available from the source system, regardless of age. Customers keep their complete history in {{PROJECT_NAME}}.

| Pros | Cons |
|------|------|
| Maximum value perception — "nothing is lost" | Migration duration scales linearly with data age |
| Enables historical reporting and trend analysis | Old data may reference entities that no longer exist |
| Strongest switching incentive — no data left behind | Storage costs increase significantly |
| | Old data formats may be inconsistent with current schemas |

**Technical implications:**
- No date filtering during extraction
- Historical schema changes in source must be handled (fields added/removed over time)
- Archived/deleted records policy (import or skip?)
- Storage capacity planning for full history
- Consider cold storage tier for data older than N months

### Option B: Rolling Window

**Description:** Import only data from a defined time period (e.g., last 12 months, last 24 months). Older data is acknowledged but not migrated.

| Pros | Cons |
|------|------|
| Predictable migration duration | Customer may feel data loss anxiety |
| Avoids ancient data format inconsistencies | Window boundary creates artificial data gaps |
| Reasonable storage impact | Reports spanning the boundary show incomplete data |
| Covers most active/relevant data | |

**Technical implications:**
- Date-based filtering during extraction
- Clear communication about what falls outside the window
- Option to extend window for specific customers (enterprise tier)
- Handling of records that reference data outside the window (orphaned foreign keys)

### Option C: Summary Only

**Description:** Import aggregated summaries or snapshots rather than individual records. For example, import total sales per month rather than individual transactions, or import current project status rather than full task history.

| Pros | Cons |
|------|------|
| Fastest migration — minimal data volume | Loss of granularity — cannot drill into historical details |
| Clean starting point without legacy data baggage | Customers may not trust summary accuracy |
| Simplest to implement and validate | Limited value for products where history is the product |
| | |

**Technical implications:**
- Aggregation logic must be validated against source
- Summary format must be documented and agreed with customer
- No rollback to granular data — summarization is lossy
- Best suited for metrics, analytics, or reporting-focused migrations

### Option D: Clean Start

**Description:** No historical data is migrated. Customer starts fresh in {{PROJECT_NAME}} with only their current configuration, settings, and active records.

| Pros | Cons |
|------|------|
| Simplest and fastest migration | Customers lose all historical context |
| No legacy data quality issues | Reporting starts from zero |
| Clean data model from day one | Strong resistance from customers with years of history |
| Lowest migration risk | Only viable when historical data has low ongoing value |

**Technical implications:**
- Configuration-only migration (settings, preferences, templates)
- Active record identification (what counts as "current"?)
- Clear communication that history is not migrated
- Optional: link to source system for historical lookups during transition period

---

## Decision Matrix — Combining Your Selections

After walking through all five nodes, your combination determines your **migration profile**. Common profiles:

| Profile | Complexity | Experience | Volume | Source | History | Typical Product |
|---------|-----------|------------|--------|--------|---------|-----------------|
| **Starter** | Simple | Self-serve | Small | Generic CSV | Clean start | Early-stage SaaS, simple tools |
| **Growth** | Medium | Assisted | Medium | Known competitors | Rolling window | Mid-market B2B SaaS |
| **Enterprise** | Complex | White-glove | Large | API + Database | Full history | Enterprise platforms, ERP |
| **PLG Disruptor** | Medium | API-to-API | Medium | Known competitors | Full history | Product-led growth, competitive displacement |
| **Data Platform** | Complex | Self-serve + API | Large | All source types | Full history | Analytics, CRM, data-heavy products |

Record your selected options in the placeholder registry:
- `{{MIGRATION_STRATEGY}}` — from Node 2 (self-serve, assisted, white-glove)
- `{{IMPORT_FORMATS}}` — from Node 4 (csv, xlsx, json, api)
- `{{MAX_IMPORT_SIZE}}` — from Node 3 volume tier
- `{{IMPORT_RECORD_LIMIT}}` — from Node 3 volume tier
- `{{HISTORICAL_DATA_POLICY}}` — from Node 5 (full, rolling-12-months, summary-only)
- `{{COMPETITOR_IMPORTERS}}` — from Node 4 Option A (list of competitors)

These values are referenced by every template in this section. Setting them correctly here prevents rework downstream.
