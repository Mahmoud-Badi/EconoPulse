# Admin & Super Admin Patterns

> Two-level admin architecture for {{PROJECT_NAME}}. Super admins (your team) manage all tenants — viewing health, impersonating users, toggling features, and handling escalations. Tenant admins (customers) manage their own organization — users, billing, settings, and usage. Both require audit logging. The admin panel is always more complex than you expect.

---

## Two-Level Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│ SUPER ADMIN (Your Operations Team)                   │
│                                                       │
│ ┌─────────────────────────────────────────────────┐  │
│ │ Tenant A (Tenant Admin)                          │  │
│ │   ├── Users (invite, roles, deactivate)         │  │
│ │   ├── Billing (plan, payment, invoices)         │  │
│ │   ├── Settings (branding, notifications)        │  │
│ │   └── Usage dashboard                           │  │
│ ├─────────────────────────────────────────────────┤  │
│ │ Tenant B (Tenant Admin)                          │  │
│ │   ├── Users                                     │  │
│ │   ├── Billing                                   │  │
│ │   └── ...                                       │  │
│ ├─────────────────────────────────────────────────┤  │
│ │ Tenant C, D, E, ...                              │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ Super Admin Can:                                      │
│   ├── View/search all tenants                        │
│   ├── Impersonate any tenant admin (audit-logged)    │
│   ├── Override feature flags per tenant              │
│   ├── Create/suspend/reactivate/delete tenants       │
│   ├── View system-wide metrics                       │
│   └── Send announcements to all tenants              │
└─────────────────────────────────────────────────────┘
```

---

## 1. Database Schema

### Tenants Table (Extended)

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,

  -- Plan & billing
  plan VARCHAR(50) NOT NULL DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  billing_email VARCHAR(255),

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  -- active | trial | suspended | churned | pending_deletion
  suspended_at TIMESTAMP,
  suspension_reason TEXT,
  deletion_requested_at TIMESTAMP,
  deletion_scheduled_at TIMESTAMP,

  -- Branding
  branding JSONB NOT NULL DEFAULT '{}',
  custom_domain VARCHAR(255),

  -- Limits & overrides
  feature_overrides JSONB NOT NULL DEFAULT '{}',
  -- { "beta_feature_x": true, "custom_rate_limit": 5000 }
  custom_limits JSONB NOT NULL DEFAULT '{}',

  -- Metadata
  settings JSONB NOT NULL DEFAULT '{}',
  owner_user_id UUID,
  trial_ends_at TIMESTAMP,
  onboarding_completed_at TIMESTAMP,
  last_active_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_plan ON tenants(plan);
CREATE INDEX idx_tenants_created ON tenants(created_at DESC);
CREATE INDEX idx_tenants_last_active ON tenants(last_active_at DESC);
```

### Super Admin Users

```sql
-- Super admins are stored separately from tenant users
-- They are NOT in any tenant — they operate across all tenants
CREATE TABLE super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  -- admin | viewer | support
  password_hash VARCHAR(255) NOT NULL,
  totp_secret VARCHAR(255),    -- 2FA is REQUIRED for super admins
  totp_enabled BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Audit Log

```sql
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Who performed the action
  actor_type VARCHAR(20) NOT NULL,  -- 'super_admin' | 'tenant_admin' | 'system'
  actor_id UUID NOT NULL,
  actor_email VARCHAR(255),

  -- What was done
  action VARCHAR(100) NOT NULL,
  -- 'tenant.created', 'tenant.suspended', 'user.impersonated',
  -- 'feature_flag.overridden', 'subscription.changed', etc.
  resource_type VARCHAR(50),  -- 'tenant', 'user', 'subscription'
  resource_id UUID,

  -- Context
  tenant_id UUID REFERENCES tenants(id),
  impersonating_tenant_id UUID REFERENCES tenants(id),

  -- Details
  metadata JSONB DEFAULT '{}',
  -- { "before": {...}, "after": {...}, "reason": "..." }
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON admin_audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_tenant ON admin_audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_action ON admin_audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_created ON admin_audit_logs(created_at DESC);

-- Retention: keep audit logs for at least 2 years (compliance)
```

---

## 2. Super Admin Features

### Tenant List with Search & Filter

```typescript
// src/admin/routes/tenants.ts

// GET /admin/api/tenants?search=acme&status=active&plan=pro&sort=created_at&order=desc&page=1&limit=25
export async function listTenants(req: Request, res: Response) {
  requireSuperAdmin(req);

  const { search, status, plan, sort = "created_at", order = "desc", page = 1, limit = 25 } = req.query;

  let query = db.select({
    id: tenants.id,
    name: tenants.name,
    slug: tenants.slug,
    plan: tenants.plan,
    status: tenants.status,
    createdAt: tenants.createdAt,
    lastActiveAt: tenants.lastActiveAt,
    userCount: sql<number>`(SELECT COUNT(*) FROM users WHERE users.tenant_id = tenants.id)`,
    mrr: sql<number>`(SELECT COALESCE(price_monthly_cents, 0) FROM subscriptions
                       WHERE subscriptions.tenant_id = tenants.id
                       AND subscriptions.status = 'active' LIMIT 1)`,
  }).from(tenants);

  // Filters
  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(tenants.name, `%${search}%`),
        ilike(tenants.slug, `%${search}%`),
        ilike(tenants.billingEmail, `%${search}%`)
      )
    );
  }
  if (status) conditions.push(eq(tenants.status, status as string));
  if (plan) conditions.push(eq(tenants.plan, plan as string));

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  // Sorting
  const sortColumn = sort === "last_active_at" ? tenants.lastActiveAt
    : sort === "name" ? tenants.name
    : tenants.createdAt;
  query = query.orderBy(order === "asc" ? asc(sortColumn) : desc(sortColumn));

  // Pagination
  const offset = (Number(page) - 1) * Number(limit);
  query = query.limit(Number(limit)).offset(offset);

  const results = await query;
  const total = await db.select({ count: sql<number>`COUNT(*)` }).from(tenants);

  res.json({
    tenants: results,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: total[0].count,
      totalPages: Math.ceil(total[0].count / Number(limit)),
    },
  });
}
```

### Tenant Detail View

```typescript
// GET /admin/api/tenants/:tenantId
export async function getTenantDetail(req: Request, res: Response) {
  requireSuperAdmin(req);
  const { tenantId } = req.params;

  const [tenant, subscription, users, usage, recentActivity] = await Promise.all([
    getTenantById(tenantId),
    getActiveSubscription(tenantId),
    db.select().from(usersTable).where(eq(usersTable.tenantId, tenantId)),
    getUsageSummary(tenantId),
    getRecentAuditLogs(tenantId, 20),
  ]);

  res.json({
    tenant,
    subscription,
    users: {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      list: users,
    },
    usage,
    recentActivity,
    health: computeTenantHealth(tenant, subscription, usage),
  });
}

function computeTenantHealth(tenant: any, subscription: any, usage: any) {
  const signals: string[] = [];
  let score = 100;

  if (subscription?.status === "past_due") { signals.push("Payment past due"); score -= 30; }
  if (!tenant.lastActiveAt || daysSince(tenant.lastActiveAt) > 14) { signals.push("Inactive 14+ days"); score -= 20; }
  if (!tenant.onboardingCompletedAt) { signals.push("Onboarding incomplete"); score -= 15; }
  if (usage.api_calls.current === 0) { signals.push("Zero API usage this period"); score -= 25; }

  return {
    score: Math.max(0, score),
    level: score >= 80 ? "healthy" : score >= 50 ? "at_risk" : "critical",
    signals,
  };
}
```

### Tenant CRUD Operations

```typescript
// POST /admin/api/tenants — Create tenant (assisted onboarding)
export async function createTenant(req: Request, res: Response) {
  requireSuperAdmin(req);
  const { name, slug, plan, adminEmail, adminName } = req.body;

  const tenant = await db.transaction(async (tx) => {
    const [newTenant] = await tx.insert(tenants).values({
      name,
      slug,
      plan: plan || "free",
      status: "active",
    }).returning();

    // Create first admin user
    const [adminUser] = await tx.insert(usersTable).values({
      tenantId: newTenant.id,
      email: adminEmail,
      name: adminName,
      role: "admin",
    }).returning();

    await tx.update(tenants)
      .set({ ownerUserId: adminUser.id })
      .where(eq(tenants.id, newTenant.id));

    return newTenant;
  });

  await auditLog(req, "tenant.created", "tenant", tenant.id, { name, slug, plan });
  await sendInvitationEmail(req.body.adminEmail, tenant);

  res.json(tenant);
}

// POST /admin/api/tenants/:tenantId/suspend
export async function suspendTenant(req: Request, res: Response) {
  requireSuperAdmin(req);
  const { tenantId } = req.params;
  const { reason } = req.body;

  await db.update(tenants).set({
    status: "suspended",
    suspendedAt: new Date(),
    suspensionReason: reason,
  }).where(eq(tenants.id, tenantId));

  await auditLog(req, "tenant.suspended", "tenant", tenantId, { reason });

  // Notify tenant admin
  const admin = await getTenantAdminEmail(tenantId);
  await sendEmail({ to: admin, template: "tenant-suspended", data: { reason } });

  res.json({ success: true });
}

// POST /admin/api/tenants/:tenantId/reactivate
export async function reactivateTenant(req: Request, res: Response) {
  requireSuperAdmin(req);
  const { tenantId } = req.params;

  await db.update(tenants).set({
    status: "active",
    suspendedAt: null,
    suspensionReason: null,
  }).where(eq(tenants.id, tenantId));

  await auditLog(req, "tenant.reactivated", "tenant", tenantId);
  res.json({ success: true });
}

// DELETE /admin/api/tenants/:tenantId — Schedule deletion (GDPR)
export async function scheduleTenantDeletion(req: Request, res: Response) {
  requireSuperAdmin(req);
  const { tenantId } = req.params;

  const deletionDate = addDays(new Date(), 30); // 30-day grace period

  await db.update(tenants).set({
    status: "pending_deletion",
    deletionRequestedAt: new Date(),
    deletionScheduledAt: deletionDate,
  }).where(eq(tenants.id, tenantId));

  await auditLog(req, "tenant.deletion_scheduled", "tenant", tenantId, {
    scheduledFor: deletionDate.toISOString(),
  });

  res.json({ deletionScheduledAt: deletionDate });
}
```

### Impersonation ("Act As" a Tenant)

Impersonation allows super admins to see exactly what a tenant admin sees. This is essential for debugging, support, and onboarding assistance. **Every impersonated action MUST be audit logged.**

```typescript
// POST /admin/api/impersonate/:tenantId
export async function startImpersonation(req: Request, res: Response) {
  requireSuperAdmin(req);
  const superAdminId = req.superAdmin.id;
  const { tenantId } = req.params;

  const tenant = await getTenantById(tenantId);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  // Create impersonation session
  const impersonationToken = await createImpersonationToken({
    superAdminId,
    superAdminEmail: req.superAdmin.email,
    tenantId: tenant.id,
    tenantName: tenant.name,
    expiresAt: addHours(new Date(), 1), // 1-hour max
  });

  await auditLog(req, "tenant.impersonation_started", "tenant", tenantId, {
    superAdminEmail: req.superAdmin.email,
  });

  res.json({
    impersonationToken,
    tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
    expiresIn: 3600,
  });
}

// POST /admin/api/impersonate/stop
export async function stopImpersonation(req: Request, res: Response) {
  const { superAdminId, tenantId } = req.impersonation;

  await auditLog(req, "tenant.impersonation_stopped", "tenant", tenantId, {
    superAdminId,
  });

  // Invalidate impersonation token
  await invalidateImpersonationToken(req.impersonationTokenId);

  res.json({ success: true });
}
```

### Impersonation Middleware

```typescript
// src/middleware/impersonation.ts
export async function impersonationMiddleware(req: Request, res: Response, next: NextFunction) {
  const impersonationHeader = req.headers["x-impersonation-token"];

  if (!impersonationHeader) return next();

  const session = await verifyImpersonationToken(impersonationHeader as string);

  if (!session) {
    return res.status(401).json({ error: "Invalid or expired impersonation token" });
  }

  // Set impersonation context
  req.impersonation = {
    active: true,
    superAdminId: session.superAdminId,
    superAdminEmail: session.superAdminEmail,
    tenantId: session.tenantId,
  };

  // Override tenant context to the impersonated tenant
  req.tenantId = session.tenantId;

  // CRITICAL: Log every action during impersonation
  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    // Fire-and-forget audit log
    auditLog(req, "impersonation.action", "api", undefined, {
      superAdminId: session.superAdminId,
      tenantId: session.tenantId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
    }).catch(console.error);

    return originalEnd.apply(this, args);
  };

  next();
}
```

### Feature Flag Overrides per Tenant

```typescript
// PATCH /admin/api/tenants/:tenantId/features
export async function setFeatureOverrides(req: Request, res: Response) {
  requireSuperAdmin(req);
  const { tenantId } = req.params;
  const { features } = req.body;
  // features: { "beta_ai_assistant": true, "export_csv": true }

  const before = await getTenantFeatureOverrides(tenantId);

  await db.update(tenants)
    .set({
      featureOverrides: sql`feature_overrides || ${JSON.stringify(features)}::jsonb`,
    })
    .where(eq(tenants.id, tenantId));

  await auditLog(req, "tenant.feature_overrides_updated", "tenant", tenantId, {
    before,
    after: features,
  });

  // Invalidate feature flag cache for this tenant
  await invalidateFeatureFlagCache(tenantId);

  res.json({ success: true });
}

// Check feature flag (respects overrides)
export async function isFeatureEnabled(tenantId: string, featureName: string): Promise<boolean> {
  const tenant = await getCachedTenant(tenantId);

  // Tenant-specific override takes priority
  if (tenant.featureOverrides[featureName] !== undefined) {
    return tenant.featureOverrides[featureName];
  }

  // Fall back to global feature flag
  return getGlobalFeatureFlag(featureName);
}
```

### System-Wide Metrics Dashboard

```typescript
// GET /admin/api/metrics
export async function getSystemMetrics(req: Request, res: Response) {
  requireSuperAdmin(req);

  const [tenantMetrics, revenueMetrics, usageMetrics] = await Promise.all([
    db.execute(sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'active') as active_tenants,
        COUNT(*) FILTER (WHERE status = 'trial') as trial_tenants,
        COUNT(*) FILTER (WHERE status = 'churned') as churned_tenants,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_this_week,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_this_month
      FROM tenants
    `),
    db.execute(sql`
      SELECT
        SUM(CASE WHEN billing_interval = 'monthly' THEN price_cents ELSE price_cents / 12 END) as mrr,
        COUNT(*) as paying_customers
      FROM subscriptions
      WHERE status = 'active' AND plan_id != (SELECT id FROM plans WHERE slug = 'free')
    `),
    db.execute(sql`
      SELECT
        metric_type,
        SUM(quantity) as total,
        COUNT(DISTINCT tenant_id) as tenants_using
      FROM usage_records
      WHERE period_start > NOW() - INTERVAL '24 hours'
      GROUP BY metric_type
    `),
  ]);

  res.json({
    tenants: tenantMetrics.rows[0],
    revenue: revenueMetrics.rows[0],
    usage: usageMetrics.rows,
    generatedAt: new Date(),
  });
}
```

---

## 3. Tenant Admin Features

### User Management

```typescript
// POST /api/settings/users/invite
export async function inviteUser(req: Request, res: Response) {
  requireTenantAdmin(req);
  const tenantId = getCurrentTenantId();
  const { email, role, name } = req.body;

  // Check seat limit
  const tenant = await getCachedTenant(tenantId);
  const limits = getPlanLimits(tenant.plan);
  const currentSeats = await getActiveSeatCount(tenantId);

  if (currentSeats >= limits.seats) {
    return res.status(402).json({
      error: "Seat limit reached",
      message: `Your ${tenant.plan} plan allows ${limits.seats} seats. Please upgrade to add more users.`,
      upgradeUrl: "/settings/billing",
    });
  }

  // Create invitation
  const invitation = await createInvitation({ tenantId, email, role, name, invitedBy: req.user.id });
  await sendInvitationEmail(email, tenant, invitation);

  await tenantAuditLog(tenantId, req.user.id, "user.invited", { email, role });
  res.json({ invitation });
}

// PATCH /api/settings/users/:userId/role
export async function updateUserRole(req: Request, res: Response) {
  requireTenantAdmin(req);
  const tenantId = getCurrentTenantId();
  const { userId } = req.params;
  const { role } = req.body;

  // Cannot demote the last admin
  if (role !== "admin") {
    const adminCount = await db.select({ count: sql<number>`COUNT(*)` })
      .from(usersTable)
      .where(and(eq(usersTable.tenantId, tenantId), eq(usersTable.role, "admin")))
      .then((r) => r[0].count);

    if (adminCount <= 1) {
      return res.status(400).json({ error: "Cannot remove the last admin" });
    }
  }

  await db.update(usersTable).set({ role }).where(
    and(eq(usersTable.id, userId), eq(usersTable.tenantId, tenantId))
  );

  await tenantAuditLog(tenantId, req.user.id, "user.role_changed", { userId, role });
  res.json({ success: true });
}

// DELETE /api/settings/users/:userId
export async function deactivateUser(req: Request, res: Response) {
  requireTenantAdmin(req);
  const tenantId = getCurrentTenantId();
  const { userId } = req.params;

  // Cannot deactivate yourself
  if (userId === req.user.id) {
    return res.status(400).json({ error: "Cannot deactivate yourself" });
  }

  await db.update(usersTable).set({ status: "deactivated", deactivatedAt: new Date() }).where(
    and(eq(usersTable.id, userId), eq(usersTable.tenantId, tenantId))
  );

  // Revoke all sessions for this user
  await revokeUserSessions(userId);

  await tenantAuditLog(tenantId, req.user.id, "user.deactivated", { userId });
  res.json({ success: true });
}
```

### Tenant Settings

```typescript
// GET /api/settings
export async function getTenantSettings(req: Request, res: Response) {
  requireTenantAdmin(req);
  const tenantId = getCurrentTenantId();
  const tenant = await getTenantById(tenantId);

  res.json({
    name: tenant.name,
    slug: tenant.slug,
    branding: tenant.branding,
    customDomain: tenant.customDomain,
    plan: tenant.plan,
    settings: {
      notifications: tenant.settings.notifications ?? {},
      timezone: tenant.settings.timezone ?? "UTC",
      dateFormat: tenant.settings.dateFormat ?? "YYYY-MM-DD",
      language: tenant.settings.language ?? "en",
    },
  });
}

// PATCH /api/settings
export async function updateTenantSettings(req: Request, res: Response) {
  requireTenantAdmin(req);
  const tenantId = getCurrentTenantId();
  const updates = req.body;

  // Validate and sanitize
  const allowed = ["name", "branding", "settings"];
  const sanitized = pick(updates, allowed);

  await db.update(tenants).set(sanitized).where(eq(tenants.id, tenantId));
  await invalidateTenantCache(tenantId);

  await tenantAuditLog(tenantId, req.user.id, "settings.updated", sanitized);
  res.json({ success: true });
}
```

### Tenant Audit Log Viewer

```typescript
// GET /api/settings/audit-log?page=1&limit=50
export async function getTenantAuditLog(req: Request, res: Response) {
  const tenantId = getCurrentTenantId();
  requireTenantAdmin(req);

  // Tenant admins can only see audit logs for their own tenant
  // Impersonation actions are visible (transparency)
  const logs = await db.select()
    .from(adminAuditLogs)
    .where(eq(adminAuditLogs.tenantId, tenantId))
    .orderBy(desc(adminAuditLogs.createdAt))
    .limit(Number(req.query.limit) || 50)
    .offset(((Number(req.query.page) || 1) - 1) * (Number(req.query.limit) || 50));

  res.json({ logs });
}
```

---

## 4. Authorization Middleware

```typescript
// src/middleware/admin-auth.ts

// Super admin routes — completely separate auth from tenant auth
export function requireSuperAdmin(req: Request) {
  if (!req.superAdmin) {
    throw new ForbiddenError("Super admin access required");
  }
  if (!req.superAdmin.totpEnabled) {
    throw new ForbiddenError("2FA must be enabled for super admin access");
  }
}

// Tenant admin routes — must be authenticated + admin role in their tenant
export function requireTenantAdmin(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }
  if (req.user.role !== "admin") {
    throw new ForbiddenError("Tenant admin access required");
  }
}

// Route setup — super admin routes on a separate path prefix
const adminRouter = express.Router();
adminRouter.use(superAdminAuth); // Separate JWT/session validation
adminRouter.use(requireSuperAdmin);
adminRouter.get("/tenants", listTenants);
adminRouter.get("/tenants/:tenantId", getTenantDetail);
adminRouter.post("/tenants", createTenant);
adminRouter.post("/impersonate/:tenantId", startImpersonation);
// ... etc

app.use("/admin/api", adminRouter);

// Tenant routes — standard auth
const tenantRouter = express.Router();
tenantRouter.use(tenantAuth);
tenantRouter.use(tenantMiddleware);
tenantRouter.get("/settings", getTenantSettings);
tenantRouter.get("/settings/users", listTenantUsers);
// ... etc

app.use("/api", tenantRouter);
```

---

## 5. Announcement Broadcasting

```typescript
// POST /admin/api/announcements
export async function createAnnouncement(req: Request, res: Response) {
  requireSuperAdmin(req);
  const { title, message, type, targetPlans, targetTenantIds } = req.body;
  // type: 'info' | 'warning' | 'maintenance' | 'feature'

  const announcement = await db.insert(announcements).values({
    title,
    message,
    type,
    targetPlans: targetPlans ?? null,        // null = all plans
    targetTenantIds: targetTenantIds ?? null, // null = all tenants
    createdBy: req.superAdmin.id,
    expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
  }).returning();

  await auditLog(req, "announcement.created", "announcement", announcement[0].id, { title, type });
  res.json(announcement[0]);
}
```

---

## 6. Checklist

- [ ] Super admin authentication is separate from tenant auth
- [ ] 2FA is required for all super admin accounts
- [ ] Tenant list with search, filter, sort, and pagination
- [ ] Tenant detail view with health score, subscription, users, usage
- [ ] Tenant CRUD: create, suspend, reactivate, schedule deletion
- [ ] Impersonation with 1-hour expiry and full audit logging
- [ ] Feature flag overrides per tenant with cache invalidation
- [ ] System-wide metrics dashboard (MRR, active tenants, usage)
- [ ] Tenant admin: user invite/role/deactivate with seat limits
- [ ] Tenant admin: settings, branding, billing management
- [ ] Tenant admin: audit log viewer (their own tenant only)
- [ ] Every admin action (super and tenant) audit logged
- [ ] Audit logs retained for 2+ years
- [ ] Super admin routes on separate path prefix with separate auth
- [ ] Announcement/notification broadcasting to tenants
