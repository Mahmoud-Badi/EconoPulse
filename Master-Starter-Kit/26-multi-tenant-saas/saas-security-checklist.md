# SaaS Security Checklist

> A cross-tenant data leak is the single worst security incident for a SaaS company. It destroys customer trust instantly and may trigger regulatory penalties. This checklist covers every surface area where tenant isolation can fail — database, API, files, search, jobs, email, caching, and admin operations. Run through this checklist before every major release.

---

## How to Use This Checklist

1. **Before launch:** Complete every item. No exceptions.
2. **Before major releases:** Re-verify items in sections that changed.
3. **Quarterly:** Full audit of all items.
4. **After incidents:** Review related items and add new ones based on findings.

Mark items as:
- `[x]` Verified and passing
- `[ ]` Not yet verified
- `[N/A]` Not applicable to this project

---

## 1. Database Isolation

- [ ] Every tenant-scoped table has `tenant_id` NOT NULL column
- [ ] Foreign key constraint on `tenant_id` references `tenants(id)`
- [ ] PostgreSQL RLS enabled on every tenant-scoped table
- [ ] PostgreSQL RLS forced (FORCE ROW LEVEL SECURITY) on every tenant-scoped table
- [ ] RLS policies created for SELECT, INSERT, UPDATE, DELETE
- [ ] RLS policy uses `current_setting('app.current_tenant_id', true)` (with fallback)
- [ ] Application database user is NOT a superuser (superusers bypass RLS)
- [ ] `SET LOCAL` used (not `SET`) to prevent cross-connection leakage
- [ ] Connection pooler configured in `transaction` mode (not `session`)
- [ ] No raw SQL queries bypass the tenant filter
- [ ] Composite indexes include `tenant_id` as the first column
- [ ] Unique constraints are per-tenant (e.g., `UNIQUE(tenant_id, email)`)
- [ ] CI script validates all tenant-scoped tables have RLS enabled

---

## 2. API Endpoint Security

- [ ] Every API endpoint verified for cross-tenant access
- [ ] Tenant ID derived from JWT or session — never from URL parameters or request body
- [ ] `tenant_id` validated on every data mutation (create, update, delete)
- [ ] GET endpoints filter by tenant (cannot fetch another tenant's record by ID)
- [ ] Batch operations validate all IDs belong to the requesting tenant
- [ ] Pagination does not leak total counts from other tenants
- [ ] Error messages do not reveal existence of resources in other tenants
  - Bad: "Project abc-123 belongs to another organization"
  - Good: "Project not found"
- [ ] API responses do not include `tenant_id` from other tenants in any field
- [ ] GraphQL queries (if applicable) enforce tenant filtering at resolver level
- [ ] Public API endpoints (webhooks, health checks) do not expose tenant data

### Test Pattern

```typescript
// Every API endpoint should have this test:
describe("GET /api/projects/:id", () => {
  it("returns 404 when accessing another tenant's project", async () => {
    const response = await request(app)
      .get(`/api/projects/${tenantB.projectId}`)
      .set("Authorization", `Bearer ${tenantA.token}`);

    expect(response.status).toBe(404); // NOT 403 — don't reveal existence
    expect(response.body.error).toBe("Project not found");
  });
});
```

---

## 3. Authentication & Authorization

- [ ] JWT includes `tenant_id` claim, set at login and verified on every request
- [ ] JWT `tenant_id` claim cannot be modified by the client
- [ ] Session tokens are scoped to a single tenant
- [ ] Users cannot switch tenants without re-authenticating (if multi-org support exists)
- [ ] API keys are tenant-scoped — each key belongs to one tenant
- [ ] API key permissions are a subset of tenant permissions (no privilege escalation)
- [ ] OAuth tokens store the tenant context
- [ ] Password reset tokens cannot be used cross-tenant
- [ ] Magic links include and validate tenant context
- [ ] SSO/SAML assertions are mapped to the correct tenant
- [ ] Invitation tokens are tenant-scoped (cannot accept invite to wrong tenant)

---

## 4. File Storage & Uploads

- [ ] File uploads scoped to tenant path (`tenants/{tenant_id}/uploads/...`)
- [ ] Uploaded file paths validated against path traversal (`../` attacks)
- [ ] Pre-signed URLs include tenant validation before generation
- [ ] File download endpoints verify the requesting user's tenant matches the file's tenant
- [ ] Directory listings (if any) scoped to tenant prefix
- [ ] Temporary files and exports scoped to tenant
- [ ] File deletion verified against tenant ownership
- [ ] No shared file storage paths between tenants
- [ ] CDN cache keys include tenant ID (prevent cache poisoning)

### Test Pattern

```typescript
it("cannot download another tenant's file", async () => {
  const response = await request(app)
    .get(`/api/files/${tenantB.fileId}/download`)
    .set("Authorization", `Bearer ${tenantA.token}`);

  expect(response.status).toBe(404);
});
```

---

## 5. Search & Full-Text Queries

- [ ] Search results filtered by tenant (Elasticsearch, Typesense, Meilisearch, pg_trgm)
- [ ] Search indexes are tenant-scoped (either per-tenant index or filtered queries)
- [ ] Autocomplete/typeahead results scoped to tenant
- [ ] Search aggregations (facets, counts) scoped to tenant
- [ ] No cross-tenant data in search suggestions
- [ ] Search API validates tenant context before querying

---

## 6. Background Jobs & Queues

- [ ] Every background job includes `tenant_id` in the payload
- [ ] Job handlers set tenant context before processing
- [ ] Job failure notifications scoped to the correct tenant
- [ ] Dead letter queue inspection does not expose cross-tenant data
- [ ] Queue names or routing keys include tenant context (if per-tenant queues)
- [ ] Job retries maintain the original tenant context

```typescript
// CORRECT: Job includes tenant context
await queue.add("process-report", {
  tenantId: getCurrentTenantId(),
  reportId: report.id,
  requestedBy: user.id,
});

// Job handler sets context
async function processReport(job: Job) {
  const { tenantId, reportId, requestedBy } = job.data;
  await runWithTenant(tenantId, async () => {
    // All queries within this scope are tenant-filtered
    const report = await getReportById(reportId);
    // ...
  });
}
```

---

## 7. Cron Jobs & Scheduled Tasks

- [ ] Every cron job is tenant-aware (iterates over tenants or runs per-tenant)
- [ ] Cron job errors are scoped to the affected tenant (one tenant's failure does not block others)
- [ ] Cron job results stored with tenant context
- [ ] No global cron jobs that process tenant data without tenant_id filtering

```typescript
// CORRECT: Tenant-aware cron job
async function dailyReport() {
  const activeTenants = await getActiveTenants();

  for (const tenant of activeTenants) {
    try {
      await runWithTenant(tenant.id, async () => {
        await generateDailyReport(tenant.id);
      });
    } catch (err) {
      // Log error with tenant context — don't stop processing other tenants
      console.error(`Daily report failed for tenant ${tenant.id}:`, err);
      await alertOps("cron.daily_report.failed", { tenantId: tenant.id, error: err.message });
    }
  }
}
```

---

## 8. Email & Notifications

- [ ] Email sending scoped to tenant (no cross-tenant recipient leaks)
- [ ] Email templates do not include data from other tenants
- [ ] Notification preferences are per-tenant per-user
- [ ] Push notification tokens associated with correct tenant
- [ ] Webhook payloads do not leak cross-tenant data
- [ ] Webhook delivery logs scoped to tenant
- [ ] Unsubscribe links include tenant context (cannot unsubscribe from another tenant)
- [ ] Email recipient validation: verify the recipient belongs to the sending tenant

```typescript
// CRITICAL CHECK: Verify recipient belongs to tenant
async function sendNotification(tenantId: string, userId: string, template: string) {
  const user = await getUserById(userId);

  if (user.tenantId !== tenantId) {
    throw new SecurityError(
      `Cross-tenant notification attempt: tenant ${tenantId} tried to notify user ${userId} (tenant ${user.tenantId})`
    );
  }

  await sendEmail({ to: user.email, template, data: { /* ... */ } });
}
```

---

## 9. Caching

- [ ] All cache keys include tenant ID prefix: `cache:${tenantId}:resource:${id}`
- [ ] Cache invalidation is tenant-scoped
- [ ] No shared cache entries contain tenant-specific data
- [ ] Redis database or namespace isolation (if required by compliance)
- [ ] Session cache scoped to tenant
- [ ] CDN cache varies by tenant (Vary header or tenant-specific cache keys)

```typescript
// CORRECT: Tenant-prefixed cache keys
const cacheKey = `tenant:${tenantId}:projects:list:${page}:${sort}`;
const cached = await redis.get(cacheKey);

// WRONG: Global cache key (cross-tenant data leak)
// const cacheKey = `projects:list:${page}:${sort}`;
```

---

## 10. Super Admin Operations

- [ ] Super admin actions audit logged with actor identity
- [ ] Impersonation sessions are time-limited (max 1 hour)
- [ ] Every action during impersonation logged with both super admin ID and tenant ID
- [ ] Super admin accounts require 2FA
- [ ] Super admin auth is separate from tenant auth (different JWT issuer or session type)
- [ ] Super admin cannot accidentally modify data while impersonating (read-only by default)
- [ ] Impersonation visible to tenant admin in audit log (transparency)
- [ ] Super admin API routes on separate path prefix with separate middleware
- [ ] Super admin session cannot be created from tenant login flow

---

## 11. Webhooks (Outgoing)

- [ ] Webhook payloads only contain data from the subscribing tenant
- [ ] Webhook URLs validated and scoped to tenant
- [ ] Webhook signing secrets are per-tenant
- [ ] Webhook retry logic includes tenant context
- [ ] Failed webhook deliveries do not expose data to wrong endpoints
- [ ] Webhook event history scoped to tenant

---

## 12. Third-Party Integrations

- [ ] OAuth tokens for third-party services stored per-tenant
- [ ] Integration callbacks validated for tenant context
- [ ] Shared third-party API keys (if any) rate limited per-tenant
- [ ] Third-party webhook receivers validate source and tenant

---

## 13. Logging & Monitoring

- [ ] Application logs include `tenant_id` in structured log context
- [ ] Log queries can be filtered by tenant for debugging
- [ ] Error tracking (Sentry, etc.) includes tenant context as tag
- [ ] No sensitive tenant data in log messages (PII redaction)
- [ ] Log retention policy compliant with data processing agreements

```typescript
// Structured logging with tenant context
logger.info("Project created", {
  tenantId: getCurrentTenantId(),
  projectId: project.id,
  userId: user.id,
  // Do NOT log: user.email, user.name, project.description (PII)
});
```

---

## 14. Infrastructure

- [ ] Database backups tested for single-tenant restore (if row-level)
- [ ] Database encryption at rest enabled
- [ ] TLS enforced for all database connections
- [ ] Environment variables do not contain tenant-specific secrets (keep those in DB or vault)
- [ ] Container/serverless function does not persist tenant state between invocations

---

## 15. Testing Requirements

- [ ] Integration test suite creates 2+ test tenants
- [ ] Every CRUD endpoint tested for cross-tenant access denial
- [ ] Bulk/batch operations tested with mixed-tenant IDs (all rejected)
- [ ] Search tested for cross-tenant leakage
- [ ] File access tested for cross-tenant leakage
- [ ] Background job output tested for correct tenant scoping
- [ ] RLS policies tested independently (SQL-level tests)
- [ ] Load testing with multiple concurrent tenants (verify no data mixing under load)

### Minimum Test Template

```typescript
describe("Cross-Tenant Isolation", () => {
  let tenantA: TestTenant;
  let tenantB: TestTenant;

  beforeAll(async () => {
    tenantA = await createTestTenant("A");
    tenantB = await createTestTenant("B");
  });

  // Repeat this pattern for EVERY resource type
  describe("Projects", () => {
    it("tenant A cannot list tenant B projects", () => { /* ... */ });
    it("tenant A cannot get tenant B project by ID", () => { /* ... */ });
    it("tenant A cannot update tenant B project", () => { /* ... */ });
    it("tenant A cannot delete tenant B project", () => { /* ... */ });
    it("tenant A cannot create project in tenant B", () => { /* ... */ });
    it("search results do not include tenant B data", () => { /* ... */ });
  });
});
```

---

## 16. Incident Response: Cross-Tenant Data Leak

If a tenant data leak is discovered:

### Immediate (First 30 Minutes)

1. **Confirm the leak** — verify cross-tenant data was actually exposed
2. **Contain** — disable the affected endpoint/feature immediately
3. **Scope** — determine which tenants were affected and what data was exposed
4. **Preserve evidence** — capture logs, request traces, database state

### Short-Term (24 Hours)

5. **Fix the root cause** — patch the code, add the missing filter, fix the policy
6. **Verify the fix** — run the full cross-tenant test suite
7. **Notify affected tenants** — be transparent about what happened and what you did
8. **Notify legal/compliance** — GDPR requires notification within 72 hours for personal data breaches

### Post-Incident (1 Week)

9. **Root cause analysis** — write a blameless post-mortem
10. **Add regression tests** — specific tests for the discovered vulnerability
11. **Review similar code paths** — the same bug pattern likely exists elsewhere
12. **Update this checklist** — add the missed surface area

### OWASP A01: Broken Access Control in Multi-Tenant Context

The OWASP Top 10 #1 vulnerability (Broken Access Control) is amplified in multi-tenant systems. Every access control failure is a potential cross-tenant data leak. The attack surface includes:

- **IDOR (Insecure Direct Object Reference):** Changing a resource ID in the URL to access another tenant's resource
- **Missing function-level access control:** Admin endpoints accessible to non-admin users in other tenants
- **Metadata manipulation:** Modifying JWT or session data to switch tenant context
- **CORS misconfiguration:** Allowing cross-origin requests that bypass tenant validation
- **Force browsing:** Accessing admin or super-admin URLs without proper authorization

---

## Summary Score

Count your checked items:

| Score | Rating | Action |
|-------|--------|--------|
| 95-100% | Production ready | Ship it. Monitor continuously. |
| 85-94% | Almost ready | Fix remaining items before launch. |
| 70-84% | Significant gaps | Do not launch until above 90%. |
| < 70% | Critical risk | Stop development. Fix isolation first. |
