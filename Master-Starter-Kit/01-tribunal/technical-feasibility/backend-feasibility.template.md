# Backend Feasibility Assessment

> **Date:** [YYYY-MM-DD]
> **Assessed By:** Backend Developer Agent
> **Runtime:** [e.g., Node.js 22 / Next.js API routes]
> **ORM:** [e.g., Drizzle ORM]
> **Database:** [e.g., PostgreSQL 16 (Supabase)]
> **API Layer:** [e.g., tRPC v11]
> **Features Assessed:** [N]

---

## Assessment Summary

| # | Feature | Complexity | Days | Risk Level | Recommendation |
|---|---------|-----------|------|-----------|----------------|
| 1 | [Feature] | [S/M/L/XL] | [N] | [Low/Med/High] | [Build V1 / Defer / Simplify / Prototype] |
| 2 | [Feature] | [S/M/L/XL] | [N] | [Low/Med/High] | [Recommendation] |
| 3 | [Feature] | [S/M/L/XL] | [N] | [Low/Med/High] | [Recommendation] |
| 4 | [Feature] | [S/M/L/XL] | [N] | [Low/Med/High] | [Recommendation] |
| 5 | [Feature] | [S/M/L/XL] | [N] | [Low/Med/High] | [Recommendation] |
| 6 | [Feature] | [S/M/L/XL] | [N] | [Low/Med/High] | [Recommendation] |
| 7 | [Feature] | [S/M/L/XL] | [N] | [Low/Med/High] | [Recommendation] |
| 8 | [Feature] | [S/M/L/XL] | [N] | [Low/Med/High] | [Recommendation] |

**Total estimated backend effort:** [N developer-days]

---

## Feature Assessments

### Feature 1: [NAME]

**Complexity:** [S/M/L/XL]
**Estimated Days:** [N days] (includes API + data model + testing + error handling + migration)
**Risk Level:** [Low / Medium / High]

**DB Tables Needed:**

| Table | Purpose | Key Columns | Relationships | Estimated Rows (Year 1) |
|-------|---------|-------------|--------------|------------------------|
| [e.g., trips] | [Store trip records] | [id, status, pickup_address, dropoff_address, scheduled_at, driver_id, patient_id, fare_amount] | [belongs_to drivers, belongs_to patients, has_many trip_status_history] | [10,000-50,000] |
| [e.g., trip_status_history] | [Audit trail for status changes] | [id, trip_id, old_status, new_status, changed_by, changed_at, reason] | [belongs_to trips, belongs_to users] | [50,000-200,000] |
| [Table] | [Purpose] | [Key columns] | [Relationships] | [Row estimate] |

**Indexes Needed:**

| Table | Index | Type | Reason |
|-------|-------|------|--------|
| [trips] | [status, scheduled_at] | [Composite B-tree] | [Dispatch board queries filter by status and sort by time] |
| [trips] | [driver_id, scheduled_at] | [Composite B-tree] | [Driver schedule lookup: "what trips does driver X have today?"] |
| [trips] | [pickup_address] | [GiST (if spatial)] | [Proximity search for auto-assignment] |
| [Table] | [Columns] | [Type] | [Reason] |

**API Procedures:**

| Procedure | Type | Complexity | Input | Output | Notes |
|-----------|------|-----------|-------|--------|-------|
| [e.g., trips.list] | [Query] | [M] | [Filters: status, date range, driver, patient] | [Paginated trip list with driver/patient names] | [Needs JOINs for display names; pagination with cursor or offset] |
| [e.g., trips.create] | [Mutation] | [M] | [Trip form data with address validation] | [Created trip with geocoded addresses] | [Calls geocoding API; validates driver availability; creates status history entry] |
| [e.g., trips.updateStatus] | [Mutation] | [M] | [trip_id, new_status, reason] | [Updated trip + emitted SSE event] | [Validates status transition (can't go from Completed back to Assigned); records history; emits real-time event] |
| [e.g., trips.assign] | [Mutation] | [L] | [trip_id, driver_id] | [Assigned trip + driver notification] | [Validates driver availability, vehicle capacity, certifications; sends SMS via Twilio; updates dispatch board via SSE] |
| [Procedure] | [Type] | [Complexity] | [Input] | [Output] | [Notes] |

**Procedure count:** [N queries + N mutations = N total]

**External Services Required:**

| Service | Purpose | API Type | Cost | Rate Limit | Failure Strategy |
|---------|---------|----------|------|-----------|-----------------|
| [e.g., Google Maps Geocoding] | [Address → lat/lng conversion] | [REST] | [$5/1,000 requests] | [50 requests/sec] | [Cache results; fallback to manual lat/lng entry; queue and retry on 429] |
| [e.g., Twilio] | [SMS notifications to drivers] | [REST] | [$0.0079/SMS] | [Effectively unlimited] | [Queue messages; retry failed sends; fallback to in-app notification only] |
| [e.g., Stripe] | [Payment processing] | [REST + Webhooks] | [2.9% + $0.30/transaction] | [25 requests/sec] | [Idempotent requests; webhook signature verification; manual payment fallback] |
| [Service] | [Purpose] | [Type] | [Cost] | [Limits] | [Strategy] |

**Data Migration Needs:**

| Migration | Type | Complexity | Downtime? | Rollback Plan |
|-----------|------|-----------|-----------|---------------|
| [e.g., Create trips table + indexes] | [Schema creation] | [S] | [No — additive only] | [Drop table] |
| [e.g., Migrate trip data from V1 schema] | [Data migration] | [L] | [Maybe — depends on data volume] | [Keep V1 data intact; run migration in new schema (V3)] |
| [e.g., Add spatial column for pickup location] | [Schema alteration] | [M] | [No — additive] | [Drop column] |
| [Migration] | [Type] | [Complexity] | [Downtime?] | [Rollback] |

**Gotchas:**

1. **[Gotcha 1]:** [Known issue with the approach. Example: "PostgreSQL enum types can't have values removed after creation. If trip statuses change, we need a new migration to add values. Consider using a text column with application-level validation instead of a DB enum."]

2. **[Gotcha 2]:** [Example: "Supabase connection pooler (PgBouncer in transaction mode) doesn't support prepared statements. Drizzle ORM's default query mode uses prepared statements. Must configure Drizzle with `prepare: false` or use direct connections for queries that need preparation."]

3. **[Gotcha 3]:** [Example: "tRPC mutations are not automatically idempotent. If a user double-clicks 'Assign Driver,' two assignment records could be created. Need idempotency keys or optimistic locking on the trip record."]

**Complexity Breakdown:**

| Component | Effort | Notes |
|-----------|--------|-------|
| Schema design + migration | [N days] | [Table creation, indexes, constraints, seed data] |
| API procedures | [N days] | [N procedures at S/M/L complexity each] |
| Business logic | [N days] | [Validation rules, status machines, assignment algorithm] |
| External integrations | [N days] | [API client, error handling, retry logic, response caching] |
| Testing | [N days] | [Unit tests for business logic, integration tests for API, seed data] |
| **Total** | **[N days]** | |

**Recommendation:**

[1-2 sentences. Example: "Build in V1 (Phase 2). The data model is straightforward but the status machine and geocoding integration add complexity. Recommend building the basic CRUD first (S), then adding geocoding (M), then the assignment algorithm (L) incrementally within the same phase."]

---

### Feature 2: [NAME]

**Complexity:** [S/M/L/XL]
**Estimated Days:** [N days]
**Risk Level:** [Low / Medium / High]

**DB Tables Needed:**

| Table | Purpose | Key Columns | Relationships | Est. Rows |
|-------|---------|-------------|--------------|-----------|
| [Table] | [Purpose] | [Columns] | [Relationships] | [Rows] |

**API Procedures:**

| Procedure | Type | Complexity | Notes |
|-----------|------|-----------|-------|
| [Procedure] | [Query/Mutation] | [S/M/L] | [Notes] |

**External Services Required:**

| Service | Purpose | Cost | Failure Strategy |
|---------|---------|------|-----------------|
| [Service] | [Purpose] | [Cost] | [Strategy] |

**Gotchas:**
1. [Gotcha]
2. [Gotcha]

**Recommendation:**
[Recommendation]

---

[Repeat for each P0/P1 feature...]

---

## Cross-Feature Concerns

### Database Design

| Concern | Affected Features | Recommendation |
|---------|------------------|----------------|
| [e.g., Schema isolation] | [All] | [Use pgSchema("v3") to isolate from V1/V2 data in shared database] |
| [e.g., Soft deletes] | [All entity types] | [Add deleted_at column to all major tables; filter out deleted records by default] |
| [e.g., Audit logging] | [All mutations] | [Create generic audit_log table; trigger-based or application-level logging] |
| [e.g., Multi-tenancy] | [All] | [Add organization_id to all tables if multi-tenant; RLS policies on Supabase] |

### API Architecture

| Concern | Recommendation |
|---------|----------------|
| [Authentication] | [Better Auth with session-based auth; middleware validates session on every request] |
| [Authorization] | [Role-based access control (RBAC); check permissions in tRPC middleware] |
| [Rate limiting] | [Per-user rate limiting on mutations; higher limits for read-only queries] |
| [Error handling] | [Structured error codes (not just HTTP status); client can display specific error messages] |
| [Pagination] | [Cursor-based for infinite scroll; offset-based for page numbers; standardize across all list endpoints] |

### Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| [API response time (p50)] | [< 100ms] | [Database indexes, query optimization, connection pooling] |
| [API response time (p99)] | [< 500ms] | [Identify slow queries; add caching where appropriate] |
| [Database connections] | [< 20 concurrent] | [Connection pooler (Supabase PgBouncer); max 10 connections per serverless function] |
| [Real-time event latency] | [< 200ms from mutation to SSE delivery] | [In-process event emission; avoid message queue for V1] |

### Compliance & Security

| Requirement | Implementation | Effort |
|------------|---------------|--------|
| [e.g., HIPAA — PHI encryption at rest] | [Supabase encrypts at rest by default; verify column-level encryption for sensitive fields] | [S — configuration only] |
| [e.g., HIPAA — access audit logging] | [Log every read/write of PHI fields with user ID, timestamp, and action] | [M — custom middleware] |
| [e.g., Data retention] | [Soft delete with configurable retention period; hard delete after retention expires] | [M — background job + configuration] |
| [e.g., Backup/recovery] | [Supabase daily backups; test restore procedure quarterly] | [S — already provided by Supabase] |

---

## Shared Infrastructure Needed

Backend infrastructure that multiple features depend on:

| Infrastructure | Used By | Build In | Effort |
|---------------|---------|----------|--------|
| [e.g., Auth + RBAC middleware] | [All features] | [Phase 0] | [M — 5 days] |
| [e.g., SSE event system] | [Dispatch, notifications, dashboard] | [Phase 1] | [M — 3 days] |
| [e.g., Background job system] | [Email, SMS, reports, data cleanup] | [Phase 2] | [M — 4 days] |
| [e.g., File upload + storage] | [Documents, driver photos, vehicle inspections] | [Phase 3] | [S — 2 days] |
| [e.g., Geocoding service wrapper] | [Trips, facilities, route optimization] | [Phase 1] | [S — 2 days] |

---

*This assessment feeds into proceedings/round-2-feasibility.template.md*
