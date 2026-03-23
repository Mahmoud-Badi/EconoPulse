# Multi-Tenant Isolation Audit — {{PROJECT_NAME}}

> **Purpose:** In a multi-tenant application, a single missing `WHERE organization_id = ?` clause is a data breach. This checklist helps you systematically verify that tenant data can never leak across boundaries.

**Tenancy Model:** {{TENANCY_MODEL}}
<!-- shared-database | schema-per-tenant | database-per-tenant -->

**Tenant ID Field:** {{TENANT_ID_FIELD}} (e.g., `organization_id`, `tenant_id`, `workspace_id`)
**Last Audit Date:** {{LAST_AUDIT_DATE}}
**Audit Owner:** {{AUDIT_OWNER}}

---

## 1. Isolation Level Decision Guide

Choose your tenancy model based on your constraints. Most B2B SaaS starts with shared database and migrates only if forced.

| Model | Data Isolation | Cost | Complexity | When to Use |
|-------|---------------|------|-----------|-------------|
| **Shared Database, Shared Schema** | Row-level (`WHERE org_id = ?`) | Lowest | Lowest | Default choice. Works for 95% of B2B SaaS. |
| **Shared Database, Schema-per-Tenant** | Schema-level (`SET search_path = tenant_123`) | Medium | Medium | Regulated industries where auditors want stronger isolation proof. |
| **Database-per-Tenant** | Full database isolation | Highest | Highest | Healthcare/finance with contractual isolation requirements. Or when tenants have wildly different data volumes. |

### Decision Flowchart

```
Do your customers contractually require dedicated infrastructure?
├── YES → Database-per-tenant
└── NO
    ├── Do regulations require provable data separation?
    │   ├── YES → Schema-per-tenant (or shared DB with strong audit trail)
    │   └── NO
    │       └── Are tenant data volumes wildly unequal (100x difference)?
    │           ├── YES → Schema-per-tenant (prevents noisy neighbor)
    │           └── NO → Shared database with row-level isolation ✓
```

> **Gotcha:** Teams sometimes choose database-per-tenant for "better security" without realizing the operational cost. Every migration runs N times. Every backup runs N times. Connection pooling is per-database. Schema-per-tenant has the same problem at smaller scale. Choose shared database unless you have a concrete requirement for stronger isolation.

---

## 2. Data Isolation Verification

### 2.1 Database Query Audit

Every query that touches tenant-scoped data MUST include a tenant filter. No exceptions.

#### Automated Detection: Missing Tenant Filters

Run these checks regularly (ideally in CI):

```bash
# Pattern 1: Find raw SQL queries missing the tenant ID field
# Adapt the field name to match your project (organization_id, tenant_id, etc.)

grep -rn "SELECT.*FROM" src/ \
  --include="*.ts" --include="*.js" \
  | grep -v "{{TENANT_ID_FIELD}}" \
  | grep -v "migrations/" \
  | grep -v "node_modules/" \
  | grep -v "\.test\." \
  | grep -v "\.spec\."

# Pattern 2: Find ORM queries on tenant-scoped tables without tenant filter
# For Drizzle ORM:
grep -rn "db\.select\(\)" src/ --include="*.ts" \
  | grep -v "{{TENANT_ID_FIELD}}" \
  | grep -v "\.test\."

# For Prisma:
grep -rn "prisma\.\w\+\.findMany\|prisma\.\w\+\.findFirst\|prisma\.\w\+\.findUnique" src/ --include="*.ts" \
  | grep -v "{{TENANT_ID_FIELD}}" \
  | grep -v "\.test\."

# Pattern 3: Find DELETE/UPDATE without tenant filter (extremely dangerous)
grep -rn "DELETE FROM\|\.delete(\|\.update(" src/ --include="*.ts" \
  | grep -v "{{TENANT_ID_FIELD}}" \
  | grep -v "migrations/" \
  | grep -v "\.test\."
```

> **Gotcha:** Automated grep has false positives (global tables like `users`, `plans`, `feature_flags` legitimately don't have a tenant filter) and false negatives (the tenant filter might come from a middleware the grep doesn't see). Use automated detection as a first pass, then manually verify flagged queries.

#### Tables That MUST Have Tenant Filters

| Table | Tenant FK | Verified? | Notes |
|-------|-----------|-----------|-------|
| {{TABLE_1}} | {{TENANT_ID_FIELD}} | [ ] | |
| {{TABLE_2}} | {{TENANT_ID_FIELD}} | [ ] | |
| {{TABLE_3}} | {{TENANT_ID_FIELD}} | [ ] | |
| {{TABLE_4}} | {{TENANT_ID_FIELD}} | [ ] | |

#### Tables That Are Intentionally Global

| Table | Justification | Reviewed? |
|-------|--------------|-----------|
| `users` | Users can belong to multiple orgs (junction table handles the relationship) | [ ] |
| `plans` | Subscription plans are global, not tenant-specific | [ ] |
| `feature_flags` | Flags are system-wide, evaluated per tenant at runtime | [ ] |
| {{GLOBAL_TABLE}} | {{JUSTIFICATION}} | [ ] |

### 2.2 ORM/Middleware-Level Enforcement

The most reliable way to prevent missing tenant filters is to enforce them at the ORM or middleware level, not by hoping every developer remembers.

```typescript
// Example: Drizzle ORM wrapper that enforces tenant filtering

// BAD: Raw query without tenant filter — developer must remember
const projects = await db.select().from(projects).where(eq(projects.status, 'active'));

// GOOD: Tenant-scoped query helper that ALWAYS injects the filter
function tenantQuery<T>(table: T, tenantId: string) {
  return db.select().from(table).where(eq(table.organizationId, tenantId));
}
const projects = await tenantQuery(projects, ctx.organizationId)
  .where(eq(projects.status, 'active'));

// BEST: Middleware that sets tenant context at the request level
// In tRPC middleware:
const tenantProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const orgId = ctx.user.organizationId;
  if (!orgId) throw new TRPCError({ code: 'FORBIDDEN' });
  return next({
    ctx: {
      ...ctx,
      db: createTenantScopedDb(db, orgId), // All queries auto-filtered
    },
  });
});
```

> **Common mistake:** Adding tenant filters in the API controller but not in background jobs, webhooks, or admin tools. Every code path that touches tenant data needs the filter — not just the API layer.

---

## 3. Cross-Tenant Access Test Scenarios

These tests MUST all fail (return 403 or empty results, never another tenant's data).

### Test Matrix

| # | Test Scenario | Method | Expected Result | Passed? |
|---|--------------|--------|----------------|---------|
| 3.1 | User from Org A requests Org B's project by ID | `GET /api/projects/:orgB_projectId` | 403 Forbidden or 404 Not Found | [ ] |
| 3.2 | User from Org A lists projects (should see only their own) | `GET /api/projects` | Returns only Org A projects, zero Org B projects | [ ] |
| 3.3 | User from Org A updates Org B's resource | `PATCH /api/projects/:orgB_projectId` | 403 Forbidden or 404 Not Found | [ ] |
| 3.4 | User from Org A deletes Org B's resource | `DELETE /api/projects/:orgB_projectId` | 403 Forbidden or 404 Not Found | [ ] |
| 3.5 | User from Org A accesses Org B's file upload | `GET /api/files/:orgB_fileId` | 403 Forbidden or 404 Not Found | [ ] |
| 3.6 | User from Org A searches and finds Org B's data | `GET /api/search?q=orgB_unique_term` | Empty results | [ ] |
| 3.7 | User from Org A receives Org B's notifications | `GET /api/notifications` | Returns only Org A notifications | [ ] |
| 3.8 | User from Org A accesses Org B's analytics/reports | `GET /api/reports/dashboard` | Shows only Org A data | [ ] |
| 3.9 | User from Org A manipulates URL to access Org B's pages | Direct URL with Org B's IDs | Redirect to own org or 403 | [ ] |
| 3.10 | User from Org A uses IDOR to enumerate resources | Sequential ID guessing | 403/404 (use ULIDs/UUIDs, not sequential IDs) | [ ] |

### Automated Cross-Tenant Test Example

```typescript
describe('Tenant Isolation', () => {
  let orgA: Organization;
  let orgB: Organization;
  let userA: User;  // belongs to orgA
  let userB: User;  // belongs to orgB
  let projectB: Project;  // belongs to orgB

  beforeAll(async () => {
    orgA = await createTestOrg('Org A');
    orgB = await createTestOrg('Org B');
    userA = await createTestUser(orgA.id);
    userB = await createTestUser(orgB.id);
    projectB = await createTestProject(orgB.id, { name: 'Secret Project' });
  });

  it('should NOT allow User A to read Org B project by ID', async () => {
    const response = await apiAs(userA).get(`/api/projects/${projectB.id}`);
    expect(response.status).toBe(404); // 404, not 403 (don't confirm existence)
  });

  it('should NOT include Org B projects in User A list', async () => {
    const response = await apiAs(userA).get('/api/projects');
    const projectIds = response.body.map((p: Project) => p.id);
    expect(projectIds).not.toContain(projectB.id);
  });

  it('should NOT allow User A to update Org B project', async () => {
    const response = await apiAs(userA).patch(`/api/projects/${projectB.id}`, {
      name: 'Hacked',
    });
    expect(response.status).toBe(404);
    // Verify the project was NOT actually modified
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectB.id),
    });
    expect(project?.name).toBe('Secret Project');
  });

  it('should NOT return Org B data in search results for User A', async () => {
    const response = await apiAs(userA).get('/api/search?q=Secret+Project');
    expect(response.body.results).toHaveLength(0);
  });
});
```

> **Gotcha:** Return 404 (not 403) when a user tries to access another tenant's resource. Returning 403 confirms the resource exists, which is an information leak. From Org A's perspective, Org B's resources simply don't exist.

---

## 4. Storage Isolation Checks

Data lives in more places than your database. Audit all of them.

### 4.1 File Uploads

| Check | Implementation | Verified? |
|-------|---------------|-----------|
| File paths include tenant ID | `uploads/{org_id}/{file_id}.ext` — never `uploads/{file_id}.ext` | [ ] |
| Signed URLs are tenant-scoped | Pre-signed URLs only generated for the requesting tenant's files | [ ] |
| Directory listing disabled | Users cannot list another tenant's upload directory | [ ] |
| File metadata stored with tenant ID | Database record links file to tenant for access control | [ ] |

### 4.2 Caches

| Check | Implementation | Verified? |
|-------|---------------|-----------|
| Cache keys include tenant ID | `cache:org:{org_id}:projects:list` not `cache:projects:list` | [ ] |
| Cache invalidation is tenant-scoped | Clearing Org A's cache doesn't affect Org B | [ ] |
| No shared cache entries with tenant data | Global caches (feature flags, config) never contain tenant-specific data | [ ] |

```
# BAD: Cache key without tenant scope
HSET project:123 name "Secret Project"  # Any tenant can read this

# GOOD: Cache key with tenant scope
HSET org:orgB:project:123 name "Secret Project"  # Scoped to orgB
```

### 4.3 Background Jobs & Queues

| Check | Implementation | Verified? |
|-------|---------------|-----------|
| Job payloads include tenant ID | Every queued job carries `organizationId` | [ ] |
| Job processors set tenant context | Worker sets tenant scope before processing | [ ] |
| Failed job data doesn't leak across tenants | Dead letter queue inspection shows tenant-scoped data only | [ ] |
| Job scheduling is tenant-isolated | One tenant's bulk operation doesn't starve another's jobs | [ ] |

### 4.4 Logs and Monitoring

| Check | Implementation | Verified? |
|-------|---------------|-----------|
| Logs include tenant ID for filtering | Every log entry has `organizationId` field | [ ] |
| Log access is tenant-scoped (if exposed to customers) | Tenant admin sees only their org's logs | [ ] |
| Error tracking groups by tenant | Sentry/Datadog tags include `organization_id` | [ ] |
| Monitoring dashboards don't expose cross-tenant data | Admin dashboards aggregate, don't enumerate tenant names/data | [ ] |

---

## 5. API Rate Limiting per Tenant

Without per-tenant rate limiting, one tenant's traffic spike takes down everyone.

### Rate Limit Configuration

| Endpoint Category | Per-Tenant Limit | Global Limit | Burst Allowed? |
|------------------|-----------------|-------------|----------------|
| Read (GET) | {{READ_RATE}}/min | {{GLOBAL_READ}}/min | Yes, 2x for 10s |
| Write (POST/PATCH/DELETE) | {{WRITE_RATE}}/min | {{GLOBAL_WRITE}}/min | No |
| Search | {{SEARCH_RATE}}/min | {{GLOBAL_SEARCH}}/min | No |
| File upload | {{UPLOAD_RATE}}/min | {{GLOBAL_UPLOAD}}/min | No |
| Export/Report | {{EXPORT_RATE}}/hour | {{GLOBAL_EXPORT}}/hour | No |

### Implementation

```typescript
// Per-tenant rate limiting middleware (using a sliding window)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  prefix: 'ratelimit',
});

async function rateLimitMiddleware(req: Request, orgId: string) {
  // Key includes org ID so limits are per-tenant
  const { success, remaining, reset } = await ratelimit.limit(`org:${orgId}`);

  if (!success) {
    return new Response('Rate limit exceeded', {
      status: 429,
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    });
  }
}
```

> **Common mistake:** Rate limiting by IP address instead of tenant ID. Behind a corporate proxy, an entire company shares one IP. Rate limiting by IP punishes all their users. Rate limit by authenticated tenant ID, with IP-based limits only as a fallback for unauthenticated endpoints.

---

## 6. Tenant Data Export & Deletion

Required for GDPR right of access and right to erasure, and for customer offboarding.

### Data Export Procedure

```markdown
## Tenant Data Export Checklist

Tenant: {{TENANT_NAME}} (ID: {{TENANT_ID}})
Requested by: {{REQUESTER}}
Request date: {{REQUEST_DATE}}
Due date: {{DUE_DATE}} (30 days for GDPR, 45 days for CCPA)

### Data Sources to Export
- [ ] Database: All rows where {{TENANT_ID_FIELD}} = {{TENANT_ID}}
  - [ ] {{TABLE_1}}
  - [ ] {{TABLE_2}}
  - [ ] {{TABLE_3}}
- [ ] File storage: All files under `uploads/{{TENANT_ID}}/`
- [ ] Cache: N/A (ephemeral, not exported)
- [ ] Logs: Filtered by {{TENANT_ID_FIELD}} (if retention period hasn't expired)
- [ ] Third-party services:
  - [ ] {{SERVICE_1}}: Export via API
  - [ ] {{SERVICE_2}}: Export via admin dashboard

### Export Format
- Database records: JSON or CSV
- Files: Original format in ZIP archive
- Delivered to: {{DELIVERY_METHOD}} (secure download link, encrypted email)

### Verification
- [ ] Spot-check: Export contains expected data (check a known record)
- [ ] Completeness: Row counts match database counts for the tenant
- [ ] No cross-tenant data: Export contains ONLY the requesting tenant's data
```

### Data Deletion Procedure

```markdown
## Tenant Data Deletion Checklist

Tenant: {{TENANT_NAME}} (ID: {{TENANT_ID}})
Requested by: {{REQUESTER}}
Request date: {{REQUEST_DATE}}
Retention period expires: {{RETENTION_EXPIRY}} (if applicable)

### Pre-Deletion
- [ ] Confirm deletion request is authorized (account owner or legal requirement)
- [ ] Export data first (offer to customer, keep internal backup for {{BACKUP_RETENTION}} days)
- [ ] Notify tenant of deletion timeline

### Deletion Steps (order matters — delete children before parents)
- [ ] Cancel active subscriptions (Stripe, etc.)
- [ ] Delete file uploads: `uploads/{{TENANT_ID}}/`
- [ ] Delete cache entries: `DEL org:{{TENANT_ID}}:*`
- [ ] Delete background jobs: Remove queued jobs for tenant
- [ ] Delete database records (in dependency order):
  - [ ] {{CHILD_TABLE_1}} WHERE {{TENANT_ID_FIELD}} = {{TENANT_ID}}
  - [ ] {{CHILD_TABLE_2}} WHERE {{TENANT_ID_FIELD}} = {{TENANT_ID}}
  - [ ] {{PARENT_TABLE}} WHERE id = {{TENANT_ID}}
- [ ] Delete from third-party services:
  - [ ] {{SERVICE_1}}: Delete via API
  - [ ] {{SERVICE_2}}: Delete via admin dashboard
- [ ] Purge from backups (if required by regulation — document decision)

### Post-Deletion Verification
- [ ] Query all tenant-scoped tables for {{TENANT_ID}} — should return 0 rows
- [ ] Attempt to access `uploads/{{TENANT_ID}}/` — should return 404
- [ ] Attempt to login as a user from the deleted tenant — should fail
- [ ] Search index cleared of tenant data
```

> **Gotcha:** Database backups still contain the deleted tenant's data. For most regulations, it's acceptable to let backups expire naturally (document your backup retention period). For some HIPAA scenarios, you may need to purge backups. This is extremely painful — design your backup strategy with deletion in mind.

---

## 7. Audit Summary Template

```markdown
## Tenant Isolation Audit Report — {{AUDIT_DATE}}

### Scope
- Application: {{PROJECT_NAME}}
- Tenancy model: {{TENANCY_MODEL}}
- Tables audited: {{TABLE_COUNT}}
- API endpoints audited: {{ENDPOINT_COUNT}}
- Storage systems audited: {{STORAGE_SYSTEMS}}

### Findings Summary
| Category | Total Checks | Passed | Failed | N/A |
|----------|-------------|--------|--------|-----|
| Database queries | | | | |
| API endpoints | | | | |
| File storage | | | | |
| Cache isolation | | | | |
| Background jobs | | | | |
| Rate limiting | | | | |
| Cross-tenant tests | | | | |

### Critical Findings (Must Fix)
| # | Finding | Location | Risk | Remediation | Owner | Due Date |
|---|---------|----------|------|-------------|-------|----------|
| 1 | {{FINDING}} | {{FILE:LINE}} | {{HIGH/CRITICAL}} | {{FIX}} | {{OWNER}} | {{DATE}} |

### Recommendations
1. {{RECOMMENDATION_1}}
2. {{RECOMMENDATION_2}}
3. {{RECOMMENDATION_3}}

### Next Audit: {{NEXT_AUDIT_DATE}}
```
