# SaaS Gotchas & Production Lessons

> Every lesson here was learned the hard way — in production, under pressure, with customers affected. Read this file before launch. Then read it again after your first 100 tenants. These are the mistakes that every SaaS team makes, and the patterns that prevent them.

---

## Gotcha 1: Forgot `tenant_id` on One Table

**What happened:** A developer created a new `comments` table but forgot to add the `tenant_id` column. The ORM middleware that auto-injects tenant filters could not filter a column that did not exist. Every tenant could see every comment.

**How long it took to find:** 3 weeks. A customer reported seeing comments from a company they did not recognize.

**Impact:** Cross-tenant data leak. Incident report required. Customer trust damaged.

**Fix:**
```typescript
// CI check: every non-global table must have tenant_id
const GLOBAL_TABLES = ["tenants", "plans", "permissions", "countries", "super_admins", "schema_migrations"];

const tablesWithoutTenantId = await db.query(`
  SELECT t.table_name
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND t.table_name NOT IN (${GLOBAL_TABLES.map(t => `'${t}'`).join(",")})
    AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns c
      WHERE c.table_name = t.table_name AND c.column_name = 'tenant_id'
    )
`);

if (tablesWithoutTenantId.rows.length > 0) {
  throw new Error(`CRITICAL: Tables missing tenant_id: ${tablesWithoutTenantId.rows.map(r => r.table_name).join(", ")}`);
}
```

**Prevention:** Run this check in CI on every migration. Block deploys if it fails. Add `tenant_id` to your ORM's base column template so developers cannot forget it.

---

## Gotcha 2: Noisy Neighbor — One Tenant's Query Kills Everyone

**What happened:** An enterprise tenant ran a complex report that generated a full table scan on a 50M-row table. The query consumed all database connections for 45 seconds. Every other tenant's API requests timed out.

**Impact:** 45-second outage for all tenants. Hundreds of error alerts.

**Fix:**
```sql
-- Statement timeout per connection (kill queries that take too long)
ALTER ROLE app_user SET statement_timeout = '30s';

-- Or per-transaction
SET LOCAL statement_timeout = '10s';
```

```typescript
// Rate limiting per tenant (not just per user)
const QUERY_TIMEOUT_MS = 10_000; // 10 seconds max per query

// Connection-level timeout
const pool = new Pool({
  connectionString: DATABASE_URL,
  statement_timeout: QUERY_TIMEOUT_MS,
});

// Per-tenant concurrent request limits
async function perTenantConcurrencyLimit(tenantId: string) {
  const key = `concurrent:${tenantId}`;
  const current = await redis.incr(key);
  await redis.expire(key, 60);

  if (current > MAX_CONCURRENT_REQUESTS_PER_TENANT) {
    await redis.decr(key);
    throw new TooManyRequestsError("Too many concurrent requests");
  }
}
```

**Prevention:** Per-tenant rate limiting and query timeouts are not optional. Implement both before launch. Monitor slow queries and alert when any tenant exceeds expected thresholds.

---

## Gotcha 3: Tenant Deletion Is Harder Than Creation

**What happened:** A tenant requested account deletion (GDPR right to erasure). The team discovered that:
- Data existed in 23 tables
- Files were spread across 3 S3 buckets
- Search indexes had tenant data
- Audit logs contained PII
- Background jobs were still queued for the tenant
- Third-party integrations (Stripe, SendGrid) still had references

It took 2 weeks of engineering time to handle one deletion request properly.

**Fix:**
```typescript
// Comprehensive deletion checklist (automated)
async function deleteTenant(tenantId: string) {
  const steps = [
    { name: "Cancel active subscription", fn: () => cancelSubscription(tenantId) },
    { name: "Export data for customer", fn: () => exportTenantData(tenantId) },
    { name: "Delete queued jobs", fn: () => purgeQueuedJobs(tenantId) },
    { name: "Delete search indexes", fn: () => deleteSearchIndex(tenantId) },
    { name: "Delete S3 files", fn: () => deleteS3Prefix(`tenants/${tenantId}/`) },
    { name: "Delete CDN cache", fn: () => purgeCDNCache(tenantId) },
    { name: "Delete Redis cache", fn: () => deleteRedisKeys(`*${tenantId}*`) },
    { name: "Anonymize audit logs", fn: () => anonymizeAuditLogs(tenantId) },
    { name: "Delete database records", fn: () => db.delete(tenants).where(eq(tenants.id, tenantId)) },
    { name: "Delete Stripe customer", fn: () => stripe.customers.del(stripeCustomerId) },
    { name: "Remove from email lists", fn: () => removeFromEmailLists(tenantId) },
  ];

  for (const step of steps) {
    try {
      await step.fn();
      console.log(`Deletion step completed: ${step.name}`);
    } catch (err) {
      console.error(`Deletion step failed: ${step.name}`, err);
      // Continue with other steps, log failure for manual cleanup
      await alertOps("tenant_deletion_step_failed", { tenantId, step: step.name, error: err.message });
    }
  }
}
```

**Prevention:** Plan GDPR right-to-deletion from day 1. Maintain a "where does tenant data live?" registry. Test deletion in staging regularly. Use `ON DELETE CASCADE` on all foreign keys.

---

## Gotcha 4: Shared Cron Jobs Break Multi-Tenancy

**What happened:** A daily email digest cron job queried the `notifications` table without a tenant filter. It sent every tenant's notifications to every user whose email matched — regardless of which tenant the notification belonged to.

**Impact:** Cross-tenant data leak via email. Users received notification digests containing other companies' project updates.

**Fix:**
```typescript
// WRONG: Global cron without tenant context
async function sendDailyDigest() {
  const notifications = await db.select().from(notifications).where(/* no tenant filter */);
  // Sends cross-tenant data
}

// CORRECT: Tenant-aware cron
async function sendDailyDigest() {
  const activeTenants = await getActiveTenants();

  for (const tenant of activeTenants) {
    try {
      await runWithTenant(tenant.id, async () => {
        const users = await getActiveUsers(tenant.id);
        for (const user of users) {
          const notifs = await getUnreadNotifications(user.id); // tenant-filtered via RLS
          if (notifs.length > 0) {
            await sendDigestEmail(user.email, notifs);
          }
        }
      });
    } catch (err) {
      console.error(`Digest failed for tenant ${tenant.id}:`, err);
      // Do not let one tenant's failure stop other tenants
    }
  }
}
```

**Prevention:** Grep your codebase for cron/scheduled job handlers. Every one of them must either: (a) iterate over tenants and set context per-tenant, or (b) be explicitly documented as tenant-independent (e.g., system health checks).

---

## Gotcha 5: Email Sender Reputation Is Shared

**What happened:** One tenant imported 50,000 email addresses and used the platform to send marketing emails. Recipients marked the emails as spam. The shared sender domain (`notifications@yourapp.com`) was flagged by Gmail. Email deliverability dropped to 30% for ALL tenants.

**Impact:** All tenants' transactional emails (password resets, invoices, alerts) went to spam for 2 weeks.

**Fix:**
```typescript
// Rate limit email sending per tenant
const EMAIL_LIMITS: Record<string, number> = {
  free: 50,       // per day
  pro: 500,
  business: 5000,
  enterprise: 50000,
};

async function sendEmail(tenantId: string, params: EmailParams) {
  const dailyCount = await redis.incr(`email_count:${tenantId}:${todayKey()}`);
  await redis.expire(`email_count:${tenantId}:${todayKey()}`, 86400);

  const plan = await getTenantPlan(tenantId);
  const limit = EMAIL_LIMITS[plan] ?? EMAIL_LIMITS.free;

  if (dailyCount > limit) {
    throw new RateLimitError("Daily email limit exceeded");
  }

  // Additional protections
  await validateRecipient(params.to); // Check against suppression list
  await checkBounceRate(tenantId);    // Block if bounce rate > 5%

  await emailProvider.send(params);
}
```

**Prevention:** Rate limit email sending per tenant. Monitor bounce rates and spam complaints per tenant. Implement automatic sending suspension when bounce rate exceeds 5%. For enterprise tenants, encourage dedicated sending domains (SPF/DKIM on their domain).

---

## Gotcha 6: Schema Migrations on Shared Databases

**What happened:** A developer ran `ALTER TABLE projects ADD COLUMN priority VARCHAR(20) NOT NULL` on the shared production database. The `NOT NULL` without a `DEFAULT` value failed because existing rows had no value for the new column. The migration locked the table for 3 minutes while PostgreSQL attempted (and failed) the migration. During those 3 minutes, all API requests involving the `projects` table timed out.

**Impact:** 3-minute partial outage for all tenants. Some data corruption from failed partial writes during the lock.

**Fix:**
```sql
-- WRONG: blocking migration
ALTER TABLE projects ADD COLUMN priority VARCHAR(20) NOT NULL;

-- CORRECT: safe multi-step migration
-- Step 1: Add nullable column (instant, no lock)
ALTER TABLE projects ADD COLUMN priority VARCHAR(20);

-- Step 2: Backfill in batches (no lock)
UPDATE projects SET priority = 'medium' WHERE priority IS NULL AND id IN (
  SELECT id FROM projects WHERE priority IS NULL LIMIT 10000
);
-- Repeat until all rows are filled

-- Step 3: Add constraint after backfill (brief lock)
ALTER TABLE projects ALTER COLUMN priority SET NOT NULL;
ALTER TABLE projects ALTER COLUMN priority SET DEFAULT 'medium';
```

**Prevention:** Never add `NOT NULL` columns without a `DEFAULT` in a single migration. Never `DROP COLUMN` in the same release that removes the code using it. Test all migrations against a production-size database clone first. Use `CREATE INDEX CONCURRENTLY` for indexes.

---

## Gotcha 7: Free Tier Abuse

**What happened:** Bots created 10,000 free-tier accounts in one weekend. They were used for: cryptocurrency mining (via the AI feature), sending spam (via email notifications), scraping data (via the API), and storing pirated content (via file uploads).

**Impact:** $3,000 in unexpected infrastructure costs. AI API provider temporarily suspended our account. Email domain reputation damaged.

**Fix:**
```typescript
// Layer 1: Bot detection at signup
async function signup(data: SignupData) {
  // CAPTCHA (hCaptcha or Turnstile — not reCAPTCHA for privacy)
  const captchaValid = await verifyCaptcha(data.captchaToken);
  if (!captchaValid) throw new Error("Captcha verification failed");

  // Disposable email detection
  if (isDisposableEmail(data.email)) {
    throw new Error("Please use a non-disposable email address");
  }

  // Rate limit signups per IP
  const signupsFromIp = await redis.incr(`signup_ip:${data.ipAddress}`);
  if (signupsFromIp > 3) {
    throw new Error("Too many signup attempts");
  }
}

// Layer 2: Email verification required for resource-intensive features
async function useAIFeature(tenantId: string) {
  const user = await getCurrentUser();
  if (!user.emailVerified) {
    throw new Error("Please verify your email to use AI features");
  }
}

// Layer 3: Usage monitoring and automatic suspension
async function checkForAbuse() {
  // Tenants with abnormally high usage relative to their plan
  const suspicious = await db.execute(sql`
    SELECT t.id, t.name, SUM(ur.quantity) as total_usage
    FROM tenants t
    JOIN usage_records ur ON ur.tenant_id = t.id
    WHERE t.plan = 'free'
      AND ur.period_start > NOW() - INTERVAL '24 hours'
    GROUP BY t.id
    HAVING SUM(ur.quantity) > 1000  -- 10x free tier daily limit
  `);

  for (const tenant of suspicious.rows) {
    await suspendTenant(tenant.id, "Automated: unusual usage pattern");
    await alertOps("suspicious_usage", { tenantId: tenant.id, usage: tenant.total_usage });
  }
}
```

**Prevention:** CAPTCHA on signup. Email verification before resource-intensive features. Disposable email blocking. Per-IP signup rate limiting. Automated abuse detection running hourly. Free tier should have tight limits that make abuse uneconomical.

---

## Gotcha 8: Background Jobs Without Tenant Context

**What happened:** A background job was enqueued to process a file upload. The job payload included the file ID but not the `tenant_id`. The job handler queried the `files` table without a tenant filter (since RLS context was not set for background workers). Occasionally, the job picked up a file from a different tenant that happened to have a conflicting ID.

**Impact:** Cross-tenant data corruption. One tenant's report contained another tenant's data.

**Fix:**
```typescript
// WRONG: Job without tenant context
await queue.add("process-file", { fileId: "abc-123" });

// CORRECT: Job with tenant context
await queue.add("process-file", {
  tenantId: getCurrentTenantId(),
  fileId: "abc-123",
  userId: getCurrentUserId(),
});

// Worker MUST set tenant context
worker.process("process-file", async (job) => {
  const { tenantId, fileId, userId } = job.data;

  if (!tenantId) {
    throw new Error("CRITICAL: Job missing tenantId");
  }

  return runWithTenant(tenantId, async () => {
    // All queries are now tenant-scoped
    const file = await getFileById(fileId);
    await processFile(file);
  });
});
```

**Prevention:** Create a job creation helper that requires `tenantId`:

```typescript
// Helper that enforces tenant context in every job
export async function enqueueJob<T extends { tenantId: string }>(
  queueName: string,
  data: T,
  options?: JobOptions
) {
  if (!data.tenantId) {
    throw new Error(`Job to queue '${queueName}' is missing tenantId`);
  }
  return queue.add(queueName, data, options);
}
```

---

## Gotcha 9: Testing With Only One Tenant

**What happened:** The entire test suite used a single test tenant. All tests passed. In production, cross-tenant data leaks existed in 4 endpoints because the tenant filter was missing — but with only one tenant in tests, there was no data to leak.

**Impact:** 4 cross-tenant data leaks discovered by customers.

**Fix:**
```typescript
// test/setup.ts — ALWAYS create 2 test tenants
let tenantA: TestTenant;
let tenantB: TestTenant;

beforeAll(async () => {
  tenantA = await createTestTenant("A");
  tenantB = await createTestTenant("B");

  // Create data in BOTH tenants
  await createTestData(tenantA);
  await createTestData(tenantB);
});

// test/isolation.test.ts — test EVERY endpoint
const RESOURCE_ENDPOINTS = [
  { method: "GET", path: "/api/projects", description: "List projects" },
  { method: "GET", path: "/api/projects/:id", description: "Get project" },
  { method: "POST", path: "/api/projects", description: "Create project" },
  { method: "PATCH", path: "/api/projects/:id", description: "Update project" },
  { method: "DELETE", path: "/api/projects/:id", description: "Delete project" },
  // ... repeat for EVERY resource type
];

for (const endpoint of RESOURCE_ENDPOINTS) {
  it(`${endpoint.method} ${endpoint.path} - cross-tenant access blocked`, async () => {
    // Try to access Tenant B's data with Tenant A's auth
    const response = await makeRequest(endpoint, {
      auth: tenantA.adminToken,
      resourceId: tenantB.resourceIds[endpoint.path],
    });

    expect(response.status).toBeOneOf([404, 403]);
    expect(response.body).not.toContainTenantBData();
  });
}
```

**Prevention:** Two-tenant testing is the minimum. Every test suite should create at least 2 tenants with data in both. Every CRUD endpoint should have cross-tenant access tests.

---

## Gotcha 10: The Admin Panel Is Always 2x the Estimate

**What happened:** The team estimated 2 weeks for the admin panel. Actual build time: 6 weeks. They underestimated:
- Tenant search with 10+ filter dimensions
- Tenant health scoring and at-risk detection
- Impersonation with full audit logging
- Subscription management and manual overrides
- Feature flag overrides per tenant
- Usage dashboards with historical charts
- Announcement/notification system
- Bulk operations (suspend all trial-expired, export all data)
- Support tools (reset password for tenant user, resend invitation)

**Fix:** There is no shortcut. Budget 2x whatever you estimate for admin tooling.

**Prevention:**
1. Use an admin panel framework (Retool, Tremor, AdminJS, or custom with shadcn/ui) — do not build from scratch
2. Prioritize ruthlessly: launch with tenant list + detail view + impersonation only
3. Add features based on support team requests (they will tell you what they need)
4. Accept that admin tooling is never "done" — plan for ongoing investment

---

## Gotcha 11: Unique Constraints Without Tenant Scope

**What happened:** The `users` table had `UNIQUE(email)`. A user tried to sign up for Tenant B with the same email they used for Tenant A. The database rejected it with "email already exists." The user could not use both workspaces.

**Impact:** Customer confusion and support tickets. Some customers could not join their company's workspace because they already had a personal account.

**Fix:**
```sql
-- WRONG: Globally unique
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- CORRECT: Unique per tenant
ALTER TABLE users ADD CONSTRAINT unique_email_per_tenant UNIQUE (tenant_id, email);
```

**Prevention:** Audit every `UNIQUE` constraint. If the table has `tenant_id`, the constraint must include `tenant_id`. The only exceptions are truly global identifiers (e.g., tenant `slug` is globally unique because it is used in URLs).

---

## Gotcha 12: Webhook Payloads Leak Cross-Tenant Data

**What happened:** The webhook system sent event payloads that included related objects. A `project.updated` event included the project data along with the `organization` object — which contained metadata from all tenants sharing a parent entity.

**Impact:** Tenant B received webhook payloads containing Tenant A's organization metadata.

**Fix:**
```typescript
// Sanitize webhook payloads
function buildWebhookPayload(event: string, resource: any, tenantId: string) {
  // Deep-filter: only include data belonging to this tenant
  const sanitized = filterByTenant(resource, tenantId);

  // Remove internal fields
  delete sanitized.internalNotes;
  delete sanitized.adminMetadata;

  return {
    event,
    timestamp: new Date().toISOString(),
    data: sanitized,
  };
}
```

**Prevention:** Webhook payloads must be built from scratch with only tenant-scoped data, not serialized from database objects. Review every webhook payload format for cross-tenant data leakage. Test by creating 2 tenants and verifying webhook payloads only contain the subscribing tenant's data.

---

## Quick Reference: Prevention Patterns

| Gotcha | Prevention Pattern | Implementation |
|--------|-------------------|----------------|
| Missing tenant_id | CI check for tenant_id on all tables | Schema validation in pipeline |
| Noisy neighbor | Rate limiting + query timeouts | Per-tenant rate limiter + `statement_timeout` |
| Hard deletion | Deletion registry + cascade + cron | Automated cleanup with 30-day grace |
| Cron without tenant | Tenant-aware cron pattern | Iterate tenants in every scheduled job |
| Email reputation | Per-tenant email rate limits | Redis counter per tenant per day |
| Unsafe migrations | Multi-step migration pattern | Nullable first, backfill, then constrain |
| Free tier abuse | CAPTCHA + email verify + monitoring | Automated suspension on anomalies |
| Jobs without context | Job helper requiring tenantId | Type-safe job enqueue function |
| Single-tenant tests | Two-tenant test setup | beforeAll creates 2 tenants with data |
| Admin underestimate | 2x budget + admin framework | Use Retool/AdminJS, iterate on support needs |
| Global unique constraints | Per-tenant unique constraints | `UNIQUE(tenant_id, field)` |
| Webhook data leaks | Tenant-scoped payload builder | Build payloads from scratch, not serialization |

---

## The SaaS Developer's Oath

Before shipping any feature in a multi-tenant system, ask yourself:

1. Does this query include a `tenant_id` filter?
2. If I remove the filter, does it return another tenant's data?
3. Does this background job include `tenantId` in the payload?
4. Does this cache key include the tenant ID?
5. Does this file path include the tenant ID?
6. Does this search query filter by tenant?
7. Does this email only contain the recipient's tenant's data?
8. Does this webhook payload only contain the subscribing tenant's data?
9. Can I test this with 2 tenants and verify isolation?
10. Would I be comfortable if a customer audited this code?

If the answer to any question is "no" or "I'm not sure" — stop and fix it before proceeding.
