# Tenant Onboarding Flows

> Onboarding is the most important product experience — it determines whether a new tenant becomes an active customer or churns within 7 days. For {{PROJECT_NAME}}, this file defines three onboarding paths: self-service signup, sales-assisted, and enterprise. Each path has a defined checklist, seed data strategy, and time-to-value optimization.

---

## Three Onboarding Paths

| Path | Trigger | Typical Plan | Time to First Value | Human Involvement |
|------|---------|-------------|--------------------|--------------------|
| **Self-Service** | User signs up on website | Free / Pro | < 5 minutes | None |
| **Assisted** | Sales-qualified lead | Business | < 1 day | Sales + CSM |
| **Enterprise** | Contract signed | Enterprise | 1-4 weeks | Dedicated team |

---

## 1. Self-Service Signup

The majority of tenants will follow this path. Every step must be automated. No human in the loop.

### Flow

```
Step 1: Sign up form
  │  → name, email, password, organization name
  │  → OR: OAuth (Google, GitHub, Microsoft)
  │
Step 2: Create tenant + first admin user (atomic transaction)
  │  → Generate tenant slug from org name
  │  → Create tenant record (status: 'trial' or 'active')
  │  → Create admin user linked to tenant
  │  → Create default roles
  │
Step 3: Email verification
  │  → Send verification email with magic link
  │  → Allow limited access while unverified (24-hour grace)
  │
Step 4: Workspace configuration wizard
  │  → "What will you use {{PROJECT_NAME}} for?" (3-5 use case options)
  │  → Team size (just me / 2-5 / 6-25 / 25+)
  │  → Optional: import from existing tool
  │
Step 5: Seed initial data
  │  → Create sample project/workspace based on use case
  │  → Create default notification settings
  │  → Set default timezone from browser
  │
Step 6: Guided product tour → aha moment
     → Interactive walkthrough highlighting 3-5 key features
     → Complete one core action (the "aha moment")
     → Show success celebration
```

### Implementation

```typescript
// src/onboarding/self-service.ts

interface SignupData {
  name: string;
  email: string;
  password: string;
  orgName: string;
}

export async function selfServiceSignup(data: SignupData) {
  // 1. Validate
  await validateSignupData(data);
  await checkEmailNotTaken(data.email);

  // 2. Create tenant + user atomically
  const result = await db.transaction(async (tx) => {
    // Create tenant
    const slug = await generateUniqueSlug(data.orgName);
    const [tenant] = await tx.insert(tenants).values({
      name: data.orgName,
      slug,
      plan: "free",
      status: "trial",
      trialEndsAt: addDays(new Date(), 14),
    }).returning();

    // Create admin user
    const passwordHash = await hashPassword(data.password);
    const [user] = await tx.insert(users).values({
      tenantId: tenant.id,
      email: data.email,
      name: data.name,
      passwordHash,
      role: "admin",
      emailVerified: false,
    }).returning();

    // Set owner
    await tx.update(tenants)
      .set({ ownerUserId: user.id })
      .where(eq(tenants.id, tenant.id));

    // Create default roles
    await seedDefaultRoles(tx, tenant.id);

    // Create default notification settings
    await seedDefaultNotifications(tx, tenant.id, user.id);

    return { tenant, user };
  });

  // 3. Send verification email (async, don't block signup)
  await sendVerificationEmail(result.user.email, result.user.id);

  // 4. Create billing customer (async)
  await createBillingCustomer(result.tenant.id);

  // 5. Track signup event
  await trackEvent("tenant.signup", {
    tenantId: result.tenant.id,
    source: "self-service",
    plan: "free",
  });

  // 6. Generate auth token
  const token = await createSession(result.user.id, result.tenant.id);

  return {
    token,
    tenant: result.tenant,
    user: result.user,
    redirectTo: "/onboarding/welcome",
  };
}
```

### Seed Data

```typescript
// src/onboarding/seed-data.ts

export async function seedDefaultRoles(tx: Transaction, tenantId: string) {
  const defaultRoles = [
    { name: "Admin", slug: "admin", permissions: ["*"], description: "Full access to all features" },
    { name: "Member", slug: "member", permissions: ["read", "write", "comment"], description: "Standard team member" },
    { name: "Viewer", slug: "viewer", permissions: ["read", "comment"], description: "Read-only access" },
  ];

  await tx.insert(roles).values(
    defaultRoles.map((role) => ({
      tenantId,
      ...role,
      isDefault: true,
    }))
  );
}

export async function seedSampleContent(
  tx: Transaction,
  tenantId: string,
  userId: string,
  useCase: string
) {
  const templates: Record<string, () => Promise<void>> = {
    "project-management": async () => {
      const [project] = await tx.insert(projects).values({
        tenantId,
        name: "Getting Started",
        description: "Your first project. Explore the features!",
        createdBy: userId,
      }).returning();

      await tx.insert(tasks).values([
        { tenantId, projectId: project.id, title: "Invite your team", status: "todo", order: 1, createdBy: userId },
        { tenantId, projectId: project.id, title: "Create your first task", status: "done", order: 2, createdBy: userId },
        { tenantId, projectId: project.id, title: "Set up integrations", status: "todo", order: 3, createdBy: userId },
      ]);
    },

    "crm": async () => {
      await tx.insert(contacts).values([
        { tenantId, name: "Sample Lead", email: "lead@example.com", stage: "lead", createdBy: userId },
        { tenantId, name: "Sample Customer", email: "customer@example.com", stage: "customer", createdBy: userId },
      ]);
    },

    "content-management": async () => {
      await tx.insert(pages).values({
        tenantId,
        title: "Welcome to Your Workspace",
        content: "Start creating content here. This is a sample page you can edit or delete.",
        status: "draft",
        createdBy: userId,
      });
    },
  };

  const seeder = templates[useCase] || templates["project-management"];
  await seeder();
}
```

### Onboarding Wizard API

```typescript
// POST /api/onboarding/configure
export async function configureWorkspace(req: Request, res: Response) {
  const tenantId = getCurrentTenantId();
  const userId = req.user.id;
  const { useCase, teamSize, timezone } = req.body;

  await db.transaction(async (tx) => {
    // Store preferences
    await tx.update(tenants).set({
      settings: sql`settings || ${JSON.stringify({ useCase, teamSize, timezone })}::jsonb`,
    }).where(eq(tenants.id, tenantId));

    // Seed sample content based on use case
    await seedSampleContent(tx, tenantId, userId, useCase);
  });

  res.json({ redirectTo: "/onboarding/tour" });
}

// POST /api/onboarding/complete
export async function completeOnboarding(req: Request, res: Response) {
  const tenantId = getCurrentTenantId();

  await db.update(tenants).set({
    onboardingCompletedAt: new Date(),
  }).where(eq(tenants.id, tenantId));

  await trackEvent("onboarding.completed", {
    tenantId,
    durationMinutes: minutesSince(await getTenantCreatedAt(tenantId)),
  });

  res.json({ redirectTo: "/dashboard" });
}
```

### Onboarding Progress Tracking

```typescript
// GET /api/onboarding/progress
export async function getOnboardingProgress(req: Request, res: Response) {
  const tenantId = getCurrentTenantId();

  const steps = [
    {
      id: "verify_email",
      label: "Verify your email",
      completed: req.user.emailVerified,
    },
    {
      id: "configure_workspace",
      label: "Configure your workspace",
      completed: !!(await getTenantSetting(tenantId, "useCase")),
    },
    {
      id: "invite_team",
      label: "Invite a team member",
      completed: (await getActiveSeatCount(tenantId)) > 1,
    },
    {
      id: "create_first_item",
      label: "Create your first project",
      completed: (await getProjectCount(tenantId)) > 1, // >1 because seed creates 1
    },
    {
      id: "explore_integrations",
      label: "Connect an integration",
      completed: (await getIntegrationCount(tenantId)) > 0,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;

  res.json({
    steps,
    completedCount,
    totalSteps: steps.length,
    percentComplete: Math.round((completedCount / steps.length) * 100),
    allComplete: completedCount === steps.length,
  });
}
```

---

## 2. Assisted Onboarding (Sales-Qualified)

For mid-market customers coming through sales. More hands-on, higher conversion expectations.

### Flow

```
Step 1: Sales creates tenant via admin panel
  │  → Sets plan based on deal
  │  → Configures initial feature flags
  │  → Notes special requirements
  │
Step 2: Admin invitation sent
  │  → Branded invitation email
  │  → Tenant pre-configured (no wizard needed)
  │  → Custom domain already set up (if applicable)
  │
Step 3: Data migration assistance
  │  → CSV import tool for existing data
  │  → API-based migration scripts
  │  → Manual assistance for complex migrations
  │
Step 4: Training session
  │  → 30-minute live walkthrough via video call
  │  → Recorded for async viewing
  │  → Custom to their use case
  │
Step 5: Go-live checklist
  │  → Verify all users invited
  │  → Confirm billing details
  │  → Verify integrations connected
  │  → First week check-in scheduled
```

### Assisted Onboarding Checklist (Tenant-Level)

```sql
CREATE TABLE onboarding_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  onboarding_type VARCHAR(20) NOT NULL, -- 'self_service', 'assisted', 'enterprise'
  assigned_csm VARCHAR(255),            -- Customer success manager email
  steps JSONB NOT NULL DEFAULT '[]',
  -- [
  --   { "id": "invite_users", "label": "Invite users", "completedAt": null, "completedBy": null },
  --   { "id": "data_migration", "label": "Import data", "completedAt": "2026-01-15", "completedBy": "csm@company.com" },
  -- ]
  notes TEXT,
  go_live_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

```typescript
// src/onboarding/assisted.ts

const ASSISTED_CHECKLIST_STEPS = [
  { id: "admin_invited", label: "Admin user invited and activated" },
  { id: "team_invited", label: "Team members invited" },
  { id: "branding_configured", label: "Logo and branding set up" },
  { id: "data_imported", label: "Existing data imported" },
  { id: "integrations_connected", label: "Key integrations connected" },
  { id: "training_completed", label: "Training session completed" },
  { id: "billing_confirmed", label: "Billing details confirmed" },
  { id: "go_live_approved", label: "Go-live approved by customer" },
];

export async function createAssistedOnboarding(
  tenantId: string,
  csmEmail: string,
  goLiveDate: Date
) {
  await db.insert(onboardingChecklists).values({
    tenantId,
    onboardingType: "assisted",
    assignedCsm: csmEmail,
    steps: JSON.stringify(ASSISTED_CHECKLIST_STEPS.map((s) => ({
      ...s,
      completedAt: null,
      completedBy: null,
    }))),
    goLiveDate,
  });
}
```

---

## 3. Enterprise Onboarding

The most complex path. Multiple stakeholders, compliance requirements, and a longer timeline.

### Flow

```
Step 1: SSO / SAML configuration
  │  → Exchange SAML metadata
  │  → Configure identity provider (Okta, Azure AD, OneLogin)
  │  → Test SSO login flow
  │
Step 2: SCIM user provisioning
  │  → Enable SCIM endpoint for automatic user sync
  │  → Map IdP groups to tenant roles
  │  → Test user creation/deactivation sync
  │
Step 3: Custom integration setup
  │  → API key provisioning
  │  → Webhook configuration
  │  → Custom middleware or connectors
  │  → Data sync verification
  │
Step 4: Dedicated CSM assignment
  │  → Named customer success manager
  │  → Slack/Teams shared channel
  │  → Regular check-in cadence (weekly → biweekly → monthly)
  │
Step 5: Security review / compliance
  │  → SOC2 report sharing
  │  → Data processing agreement (DPA) signed
  │  → Penetration test results shared
  │  → Security questionnaire completed
  │  → Backup and disaster recovery plan reviewed
  │
Step 6: Pilot → Rollout
  │  → Limited pilot with 5-10 users (2 weeks)
  │  → Feedback collection
  │  → Adjustments and fixes
  │  → Phased rollout plan (department by department)
  │  → Full go-live
```

### Enterprise Onboarding Checklist

```typescript
const ENTERPRISE_CHECKLIST_STEPS = [
  // Technical setup
  { id: "sso_configured", label: "SSO/SAML configured and tested", category: "technical" },
  { id: "scim_enabled", label: "SCIM provisioning enabled", category: "technical" },
  { id: "custom_domain", label: "Custom domain configured", category: "technical" },
  { id: "api_keys", label: "API keys provisioned", category: "technical" },
  { id: "integrations", label: "Custom integrations configured", category: "technical" },
  { id: "data_migration", label: "Historical data migrated", category: "technical" },

  // Security & compliance
  { id: "dpa_signed", label: "Data Processing Agreement signed", category: "compliance" },
  { id: "soc2_shared", label: "SOC2 report shared", category: "compliance" },
  { id: "security_review", label: "Security questionnaire completed", category: "compliance" },
  { id: "backup_plan", label: "Backup/DR plan reviewed", category: "compliance" },

  // People & process
  { id: "csm_assigned", label: "Dedicated CSM assigned", category: "people" },
  { id: "slack_channel", label: "Shared Slack/Teams channel created", category: "people" },
  { id: "admin_training", label: "Admin training completed", category: "people" },
  { id: "user_training", label: "End-user training completed", category: "people" },

  // Rollout
  { id: "pilot_started", label: "Pilot group active", category: "rollout" },
  { id: "pilot_feedback", label: "Pilot feedback collected and addressed", category: "rollout" },
  { id: "rollout_plan", label: "Phased rollout plan approved", category: "rollout" },
  { id: "go_live", label: "Full go-live complete", category: "rollout" },
];
```

---

## 4. Trial Management

### Trial Configuration

```typescript
// src/onboarding/trial.ts

const TRIAL_CONFIG = {
  durationDays: 14,
  extensionDays: 7,       // Support can extend once
  maxExtensions: 1,
  warningDaysBeforeEnd: 3, // Send reminder email
  gracePeriodDays: 3,      // After trial ends, before restricting
};

export async function checkTrialStatus(tenantId: string) {
  const tenant = await getCachedTenant(tenantId);

  if (tenant.status !== "trial" || !tenant.trialEndsAt) {
    return { inTrial: false };
  }

  const now = new Date();
  const trialEnd = new Date(tenant.trialEndsAt);
  const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    inTrial: true,
    daysRemaining: Math.max(0, daysRemaining),
    trialEndsAt: trialEnd,
    expired: now > trialEnd,
    inGracePeriod: now > trialEnd && now < addDays(trialEnd, TRIAL_CONFIG.gracePeriodDays),
  };
}
```

### Trial Expiration Cron

```typescript
// src/cron/trial-management.ts
// Runs daily

export async function processTrials() {
  // 1. Send warning emails (3 days before expiry)
  const warningDate = addDays(new Date(), TRIAL_CONFIG.warningDaysBeforeEnd);
  const expiringTrials = await db.select().from(tenants).where(
    and(
      eq(tenants.status, "trial"),
      lte(tenants.trialEndsAt, warningDate),
      gt(tenants.trialEndsAt, new Date()),
    )
  );

  for (const tenant of expiringTrials) {
    const alreadySent = await redis.get(`trial_warning:${tenant.id}`);
    if (!alreadySent) {
      await sendEmail({
        to: await getTenantAdminEmail(tenant.id),
        template: "trial-expiring",
        data: {
          tenantName: tenant.name,
          trialEndsAt: tenant.trialEndsAt,
          upgradeUrl: `https://${tenant.slug}.yourapp.com/settings/billing`,
        },
      });
      await redis.set(`trial_warning:${tenant.id}`, "1", "EX", 86400 * 7);
    }
  }

  // 2. Expire trials past grace period
  const expiredDate = subDays(new Date(), TRIAL_CONFIG.gracePeriodDays);
  await db.update(tenants).set({
    status: "active", // Move to free tier
    plan: "free",
  }).where(
    and(
      eq(tenants.status, "trial"),
      lte(tenants.trialEndsAt, expiredDate),
    )
  );

  // 3. Send "trial ended" email with upgrade CTA
  const justExpired = await db.select().from(tenants).where(
    and(
      eq(tenants.plan, "free"),
      gte(tenants.trialEndsAt, subDays(new Date(), TRIAL_CONFIG.gracePeriodDays + 1)),
      lte(tenants.trialEndsAt, expiredDate),
    )
  );

  for (const tenant of justExpired) {
    await sendEmail({
      to: await getTenantAdminEmail(tenant.id),
      template: "trial-ended",
      data: {
        tenantName: tenant.name,
        upgradeUrl: `https://${tenant.slug}.yourapp.com/settings/billing`,
      },
    });
  }
}
```

### Trial Extension

```typescript
// POST /admin/api/tenants/:tenantId/extend-trial
export async function extendTrial(req: Request, res: Response) {
  requireSuperAdmin(req);
  const { tenantId } = req.params;
  const { days } = req.body;

  const tenant = await getTenantById(tenantId);
  if (tenant.status !== "trial") {
    return res.status(400).json({ error: "Tenant is not in trial" });
  }

  const newEndDate = addDays(new Date(tenant.trialEndsAt), days || TRIAL_CONFIG.extensionDays);

  await db.update(tenants).set({
    trialEndsAt: newEndDate,
  }).where(eq(tenants.id, tenantId));

  await auditLog(req, "trial.extended", "tenant", tenantId, {
    previousEnd: tenant.trialEndsAt,
    newEnd: newEndDate,
    days,
  });

  res.json({ trialEndsAt: newEndDate });
}
```

---

## 5. Upgrade Prompts

Show contextual upgrade prompts when tenants hit plan limits.

```typescript
// src/onboarding/upgrade-prompts.ts

interface UpgradePrompt {
  trigger: string;
  title: string;
  message: string;
  cta: string;
  ctaUrl: string;
}

export function getUpgradePrompt(trigger: string, currentPlan: string): UpgradePrompt | null {
  const prompts: Record<string, UpgradePrompt> = {
    seat_limit: {
      trigger: "seat_limit",
      title: "Need more seats?",
      message: `Your ${currentPlan} plan includes a limited number of seats. Upgrade to add more team members.`,
      cta: "View Plans",
      ctaUrl: "/settings/billing",
    },
    rate_limit: {
      trigger: "rate_limit",
      title: "API limit reached",
      message: "You have hit your hourly API request limit. Upgrade for higher limits.",
      cta: "Upgrade Now",
      ctaUrl: "/settings/billing",
    },
    storage_limit: {
      trigger: "storage_limit",
      title: "Storage full",
      message: "You have used all available storage. Upgrade to get more space.",
      cta: "Get More Storage",
      ctaUrl: "/settings/billing",
    },
    feature_locked: {
      trigger: "feature_locked",
      title: "Premium feature",
      message: "This feature is available on Pro and above. Upgrade to unlock it.",
      cta: "See What You Get",
      ctaUrl: "/settings/billing",
    },
    trial_ending: {
      trigger: "trial_ending",
      title: "Trial ending soon",
      message: "Your trial ends in a few days. Subscribe to keep your data and settings.",
      cta: "Choose a Plan",
      ctaUrl: "/settings/billing",
    },
  };

  return prompts[trigger] ?? null;
}
```

---

## 6. Time-to-Value Optimization

The goal: every new tenant must experience the core value of the product within 5 minutes of signup.

### Minimum Viable Onboarding

| Step | Must Complete | Can Skip | Time Budget |
|------|--------------|----------|-------------|
| Signup form | Yes | - | 30 seconds |
| Email verification | No (grace period) | Yes (24h grace) | 0 seconds (async) |
| Use case selection | Yes (1 click) | - | 10 seconds |
| Workspace configuration | No | Yes (smart defaults) | 0 seconds |
| Seed sample data | Automatic | - | 0 seconds |
| Guided tour | Yes (but skippable) | Yes | 2-3 minutes |
| **Total** | | | **< 5 minutes** |

### Anti-Patterns

- Requiring email verification before any access (kills conversion)
- Multi-page wizard before seeing the product (information overload)
- Empty state after signup (user does not know what to do)
- No sample data (user cannot evaluate the product)
- Requiring billing info for free tier or trial (unnecessary friction)
- Asking for team size, industry, company size before showing the product (ask later, in-app)

---

## 7. Checklist

- [ ] Self-service signup creates tenant + user in < 2 seconds
- [ ] Email verification has 24-hour grace period (do not block access)
- [ ] Default roles seeded on tenant creation (Admin, Member, Viewer)
- [ ] Sample content seeded based on use case selection
- [ ] Onboarding progress tracked and displayed in UI
- [ ] Guided tour highlights core value in < 5 minutes
- [ ] Assisted onboarding checklist available in admin panel
- [ ] Enterprise onboarding checklist with compliance steps
- [ ] Trial countdown visible in UI with upgrade CTA
- [ ] Trial expiration emails at -3 days, 0 days, +3 days
- [ ] Trial extension available via super admin panel
- [ ] Upgrade prompts shown contextually (at point of limit hit)
- [ ] No empty states — every new tenant sees meaningful content
- [ ] Onboarding completion tracked for analytics (time-to-first-value)
