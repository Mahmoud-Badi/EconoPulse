# Phase 45: Customer Migration & Data Import

> Switching costs are the moat your competitors built. This section tears it down — designing import wizards, migration tooling, and competitor-switch playbooks that make leaving a competitor as painless as signing up for your product.

---

## Why This Exists

Every SaaS product lives or dies by its ability to absorb new customers from existing solutions. The dirty secret of enterprise software is that most products do not win because they are better — they win because switching away is so painful that customers stay out of inertia. Your competitors know this. They design export formats that lose metadata, omit relationships, and silently truncate fields. They throttle API access for users who have canceled. They make "Download Your Data" buttons produce ZIP files full of proprietary formats that no other system can parse.

This section is the antidote. It provides the architecture, UX patterns, and operational playbooks to make migration from any competitor a structured, predictable, and delightful experience. When a customer decides to switch to {{PROJECT_NAME}}, the migration experience should reinforce their decision — not make them regret it. A smooth import that preserves their data, respects their history, and gets them productive within hours is the most powerful sales tool you will ever build. A botched import that loses records, mangles formatting, or takes three weeks of back-and-forth with your support team is the most effective churn accelerator you will ever create.

Migration is also where your product's data model gets stress-tested in ways that synthetic test data never achieves. Real customer data has inconsistencies, edge cases, and creative uses of fields that your schema was never designed for. A phone number field that contains "call after 3pm." An email column with semicolon-separated lists of five addresses. A date formatted as "Q3 2024" instead of an ISO timestamp. The templates in this section prepare you for this reality by building validation, transformation, and error-handling pipelines that gracefully handle the chaos of production data.

The migration experience is also a critical onboarding moment. Section 27 covers general onboarding and retention, but migration-specific onboarding has unique requirements. A customer migrating from a competitor arrives with expectations shaped by the old product. They have muscle memory, mental models, and workflows built around the competitor's UI. Migration is not just moving data — it is translating the customer's understanding of their work from one system to another. The templates here address both the technical data transfer and the human experience of switching systems.

Finally, migration is a competitive intelligence goldmine. Every import tells you what data structures competitors use, what features their customers actually use (based on which fields have data), and where the gaps are. The competitor switch playbook template in this section systematically captures these insights and feeds them back into your product roadmap.

<!-- IF {{MIGRATION_SUPPORT}} == "false" -->
> **Skip condition met.** `CONFIG.MIGRATION_SUPPORT` is set to `"false"`. This section can be skipped. Revisit if your go-to-market strategy requires displacing competitors or if customer acquisition research reveals switching friction as a barrier.
<!-- ENDIF -->

---

## How It Integrates with the Orchestrator

This section is triggered at **Step 18.75** in the Orchestrator, positioned after CX Operations (Step 18.7.5 / Section 33) and before Post-Launch Operations (Step 18.8 / Section 20). This placement is intentional: migration tooling depends on your customer support infrastructure being defined (so migration failures route correctly), your CX operations being planned (so migration-specific support workflows exist), and your database schema being stable (so target schemas are finalized).

**Relationship with Section 02 (Architecture & Database Schema):** Your database schema is the target of every migration. The data mapping templates in this section reference your Section 02 schema definitions directly. If your schema changes after migration tooling is built, migration mappings must be updated. Section 02's entity-relationship diagrams are the source of truth for target field definitions, data types, constraints, and relationships. The bulk import architecture template also depends on Section 02's database technology choices — bulk insert strategies differ significantly between PostgreSQL, MySQL, MongoDB, and DynamoDB.

**Relationship with Section 23 (Customer Support Infrastructure):** Migration failures generate support tickets. The migration support runbook in this section integrates with your Section 23 ticketing system, escalation tiers, and SLA definitions. Migration-specific ticket categories, auto-routing rules, and canned responses should be configured in your support platform as part of migration launch readiness. High-touch migrations (white-glove) require dedicated support agent allocation planned in coordination with Section 23's staffing model.

**Relationship with Section 33 (Customer Experience Operations):** Migration is a CX-critical moment. The import wizard UX patterns in this section follow the design system established in Section 07 and the CX principles from Section 33. Migration progress notifications integrate with Section 33's omnichannel communication strategy. Post-migration satisfaction surveys should be configured using Section 33's NPS/CSAT automation templates. Migration health metrics feed into Section 33's customer health scoring model — a failed or incomplete migration is a strong churn signal.

**Relationship with Section 27 (Onboarding & Retention):** Migration is the first step of onboarding for switching customers. The import wizard flow should connect directly to your Section 27 onboarding sequence. When a migration completes, the customer should land in the appropriate onboarding path — not a generic welcome flow, but one that acknowledges they are migrating and guides them through differences from their previous tool. Retention metrics for migrated customers should be tracked separately from organic signups.

**Relationship with Section 28 (Competitive Intelligence):** The competitor switch playbooks in this section are the operational expression of Section 28's competitive analysis. Feature mapping matrices, data format differences, and migration landing page copy all draw from competitive intelligence research. Migration telemetry (which competitors customers are switching from, which features they used, where mapping gaps exist) feeds back into Section 28's competitive tracking dashboard.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Section overview, reading order, and integration map | 18.75 |
| `migration-strategy-decision-tree.md` | Guide | 5-node decision tree for migration approach selection | 18.75 |
| `import-wizard-ux.template.md` | Template | Data import wizard UI patterns and component architecture | 18.75 |
| `csv-import-architecture.template.md` | Template | CSV/file upload parsing pipeline and validation | 18.75 |
| `api-migration-tooling.template.md` | Template | API-based migration from competitor platforms | 18.75 |
| `competitor-switch-playbook.template.md` | Template | Per-competitor migration guides and feature mapping | 18.75 |
| `data-mapping-transformation.template.md` | Template | Schema mapping rules and field transformation logic | 18.75 |
| `migration-validation-rollback.template.md` | Template | Pre/post-migration validation and rollback procedures | 18.75 |
| `bulk-import-architecture.template.md` | Template | Large-scale import queue/worker architecture | 18.75 |
| `migration-progress-tracking.template.md` | Template | Progress UI, real-time updates, and notification strategy | 18.75 |
| `data-cleansing-rules.template.md` | Template | Data normalization, deduplication, and format standardization | 18.75 |
| `migration-support-runbook.template.md` | Template | Support team procedures for migration issues | 18.75 |
| `migration-gotchas.md` | Guide | 18 production lessons across severity tiers | 18.75 |

---

## Reading Order

1. **`migration-strategy-decision-tree.md`** — Start here. Walk through the five decision nodes to determine your migration complexity, experience model, data volume tier, source system types, and historical data policy. Every subsequent file assumes these decisions are made.
2. **`import-wizard-ux.template.md`** — Design the user-facing import experience. This is what customers see and interact with, so get it right before building the backend.
3. **`csv-import-architecture.template.md`** — Build the file parsing pipeline that powers the import wizard. This handles the most common migration path (CSV/Excel upload) and establishes patterns reused by other importers.
4. **`api-migration-tooling.template.md`** — Design the API-based migration system for direct competitor-to-product data transfer. This is higher effort but dramatically better UX for customers migrating from known competitors.
5. **`competitor-switch-playbook.template.md`** — Create per-competitor migration guides. These combine technical data mapping with marketing copy and support procedures for each competitor you target.
6. **`data-mapping-transformation.template.md`** — Define the schema mapping and field transformation rules that convert source data into your data model. This is the core logic that all importers share.
7. **`migration-validation-rollback.template.md`** — Build the safety net. Validation catches errors before they corrupt your database. Rollback procedures recover from errors that slip through.
8. **`bulk-import-architecture.template.md`** — Scale your import pipeline for large datasets. Queue-based architecture, worker configuration, and backpressure management for imports that exceed in-request processing limits.
9. **`migration-progress-tracking.template.md`** — Design the progress tracking UI and notification system. Long-running imports need real-time feedback to prevent customers from assuming the import failed.
10. **`data-cleansing-rules.template.md`** — Define normalization and deduplication rules. Real-world data is messy — this file defines how aggressively you clean it and what you report back to the customer.
11. **`migration-support-runbook.template.md`** — Equip your support team to handle migration issues. Common problems, diagnosis steps, escalation paths, and customer communication templates.
12. **`migration-gotchas.md`** — Read last. These production lessons will resonate more after you understand the full migration architecture. Revisit before launch.

---

## Quick Start Checklist

- [ ] Walk through the migration strategy decision tree and record decisions in placeholder registry
- [ ] Set `{{MIGRATION_SUPPORT}}` to `true` in configuration
- [ ] Define `{{MIGRATION_STRATEGY}}` — self-serve, assisted, or white-glove
- [ ] Determine `{{IMPORT_FORMATS}}` supported (csv, xlsx, json)
- [ ] Set `{{MAX_IMPORT_SIZE}}` and `{{IMPORT_RECORD_LIMIT}}` based on infrastructure capacity
- [ ] Identify `{{COMPETITOR_IMPORTERS}}` — which competitors get dedicated import paths
- [ ] Design import wizard UX flow and validate with customer interviews
- [ ] Build CSV parsing pipeline with validation and error reporting
- [ ] Create at least one competitor-specific import path for your primary competitor
- [ ] Implement data mapping and transformation rules for your schema
- [ ] Build validation and rollback procedures — test rollback before you need it
- [ ] Configure migration job queue (`{{MIGRATION_QUEUE}}`) and workers
- [ ] Implement progress tracking with real-time updates
- [ ] Train support team using the migration support runbook
- [ ] Run a migration beta with 5-10 real customers before general availability
- [ ] Review migration gotchas and confirm mitigations are in place

---

## Key Principles

1. **Migration is a product feature, not a one-time project.** Treat your import system with the same rigor as any customer-facing feature — design reviews, automated testing, monitoring, and iteration based on usage data.

2. **Never lose customer data.** If a migration fails partway through, the customer should be able to retry without duplicates, rollback to pre-migration state, or download a detailed error report. Data loss during migration is an extinction-level trust event.

3. **Show progress or show failure — never show nothing.** Long-running imports with no feedback create anxiety. Customers will refresh, re-upload, and contact support. Real-time progress tracking with ETA is not optional for imports over 30 seconds.

4. **Validate early, validate often.** Catch problems at upload time, not after processing 100,000 records. Column mapping validation, type checking, and constraint verification should happen in the preview step — before the customer clicks "Import."

5. **Design for the messy middle.** Perfect data imports perfectly. The challenge is partial success — 9,800 of 10,000 records imported, 200 failed. Your UX for this scenario (error report, retry mechanism, manual fix workflow) is more important than the happy path.

6. **Competitor migration is a sales tool.** Your competitor switch playbooks should be co-owned by product and marketing. A migration landing page that says "Switch from X in under 10 minutes" is a conversion weapon — but only if it is true.

7. **Measure migration as a funnel.** Track: started migration / completed upload / passed validation / completed import / active 7 days post-migration. Drop-offs at each stage reveal different problems — UX friction, data quality issues, or post-migration confusion.

---

## Placeholder Variables Used in This Section

| Placeholder | Description | Example Values |
|---|---|---|
| `{{MIGRATION_SUPPORT}}` | Whether migration features are enabled | `true`, `false` |
| `{{MIGRATION_STRATEGY}}` | Primary migration approach | `self-serve`, `assisted`, `white-glove` |
| `{{IMPORT_FORMATS}}` | Supported file formats for upload | `csv`, `csv,xlsx,json` |
| `{{MAX_IMPORT_SIZE}}` | Maximum file size for upload | `10mb`, `100mb`, `1gb` |
| `{{IMPORT_RECORD_LIMIT}}` | Maximum records per import | `10000`, `100000`, `unlimited` |
| `{{COMPETITOR_IMPORTERS}}` | Competitors with dedicated import paths | `competitor-a, competitor-b` |
| `{{MIGRATION_QUEUE}}` | Job queue technology for background imports | `bull`, `rabbitmq`, `sqs` |
| `{{MIGRATION_WORKER_COUNT}}` | Number of concurrent import workers | `2`, `4`, `8` |
| `{{HISTORICAL_DATA_POLICY}}` | How much historical data to import | `full`, `rolling-12-months`, `summary-only` |
| `{{ROLLBACK_WINDOW_HOURS}}` | Hours after import during which rollback is available | `24`, `48`, `168` |
| `{{IMPORT_NOTIFICATION_CHANNEL}}` | How customers are notified of import progress | `email`, `in-app`, `both` |
| `{{DATA_CLEANSING_LEVEL}}` | How aggressively data is normalized during import | `minimal`, `moderate`, `aggressive` |
