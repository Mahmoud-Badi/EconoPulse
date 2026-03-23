# Multi-Tenant Testing Strategy — TaskFlow (Example)

> **READ ONLY — reference example.** This shows what a comprehensive multi-tenant testing setup looks like for a SaaS application with strict tenant isolation.

---

## Seed Data: Two Workspaces

Every test suite starts with deterministic seed data for at least two completely isolated workspaces. This is the foundation of all tenant isolation tests.

```typescript
// test/seed/tenants.ts

export const TENANT_A = {
  id: 'ws_acme_001',
  name: 'Acme Logistics',
  slug: 'acme-logistics',
  plan: 'pro',
  createdAt: new Date('2025-01-01'),
};

export const TENANT_B = {
  id: 'ws_beta_002',
  name: 'Beta Transport',
  slug: 'beta-transport',
  plan: 'enterprise',
  createdAt: new Date('2025-02-01'),
};

export const USER_ACME_ADMIN = {
  id: 'user_acme_admin',
  email: 'admin@acmelogistics.com',
  name: 'Alice Admin',
  role: 'admin',
  workspaceId: TENANT_A.id,
};

export const USER_ACME_DISPATCHER = {
  id: 'user_acme_dispatcher',
  email: 'dispatcher@acmelogistics.com',
  name: 'Dave Dispatcher',
  role: 'dispatcher',
  workspaceId: TENANT_A.id,
};

export const USER_BETA_ADMIN = {
  id: 'user_beta_admin',
  email: 'admin@betatransport.com',
  name: 'Bob Beta',
  role: 'admin',
  workspaceId: TENANT_B.id,
};

export const USER_BETA_DRIVER = {
  id: 'user_beta_driver',
  email: 'driver@betatransport.com',
  name: 'Diana Driver',
  role: 'driver',
  workspaceId: TENANT_B.id,
};

// Orders scoped to each tenant
export const ORDER_ACME_001 = {
  id: 'order_acme_001',
  referenceNumber: 'ACM-2025-0001',
  workspaceId: TENANT_A.id,
  status: 'dispatched',
  totalAmount: 250000, // $2,500.00 in cents
  createdBy: USER_ACME_ADMIN.id,
};

export const ORDER_BETA_001 = {
  id: 'order_beta_001',
  referenceNumber: 'BET-2025-0001',
  workspaceId: TENANT_B.id,
  status: 'pending',
  totalAmount: 180000, // $1,800.00 in cents
  createdBy: USER_BETA_ADMIN.id,
};

export const INVOICE_ACME_001 = {
  id: 'inv_acme_001',
  invoiceNumber: 'INV-ACM-0001',
  workspaceId: TENANT_A.id,
  orderId: ORDER_ACME_001.id,
  totalCents: 250000,
  status: 'sent',
};

export const INVOICE_BETA_001 = {
  id: 'inv_beta_001',
  invoiceNumber: 'INV-BET-0001',
  workspaceId: TENANT_B.id,
  orderId: ORDER_BETA_001.id,
  totalCents: 180000,
  status: 'draft',
};

export const CARRIER_ACME_001 = {
  id: 'carrier_acme_001',
  name: 'FastFreight LLC',
  mcNumber: 'MC-111111',
  workspaceId: TENANT_A.id,
};

export const CARRIER_BETA_001 = {
  id: 'carrier_beta_001',
  name: 'SpeedHaul Inc',
  mcNumber: 'MC-222222',
  workspaceId: TENANT_B.id,
};
```

### Seed Runner

```typescript
// test/seed/run-seed.ts

import { PrismaClient } from '@prisma/client';
import * as tenants from './tenants';

export async function seedTestDatabase(prisma: PrismaClient) {
  // Clean in reverse dependency order
  await prisma.invoice.deleteMany();
  await prisma.order.deleteMany();
  await prisma.carrier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  // Seed in dependency order
  await prisma.workspace.createMany({
    data: [tenants.TENANT_A, tenants.TENANT_B],
  });
  await prisma.user.createMany({
    data: [
      tenants.USER_ACME_ADMIN,
      tenants.USER_ACME_DISPATCHER,
      tenants.USER_BETA_ADMIN,
      tenants.USER_BETA_DRIVER,
    ],
  });
  await prisma.carrier.createMany({
    data: [tenants.CARRIER_ACME_001, tenants.CARRIER_BETA_001],
  });
  await prisma.order.createMany({
    data: [tenants.ORDER_ACME_001, tenants.ORDER_BETA_001],
  });
  await prisma.invoice.createMany({
    data: [tenants.INVOICE_ACME_001, tenants.INVOICE_BETA_001],
  });
}
```

---

## Prisma Client Extension for Auto-TenantId Injection

This extension automatically injects `workspaceId` filters into every query, making it impossible to accidentally query across tenants.

```typescript
// src/lib/prisma-tenant.extension.ts

import { Prisma, PrismaClient } from '@prisma/client';

// Models that require tenant scoping
const TENANT_SCOPED_MODELS = [
  'order',
  'invoice',
  'carrier',
  'load',
  'driver',
  'truck',
  'settlement',
  'commission',
  'contact',
  'document',
] as const;

type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number];

function isTenantScoped(model: string): model is TenantScopedModel {
  return TENANT_SCOPED_MODELS.includes(model as TenantScopedModel);
}

/**
 * Creates a Prisma client that automatically scopes all queries to a workspace.
 *
 * WHY: Without this, every single query must manually include workspaceId.
 * A single missing filter = cross-tenant data leak. This extension makes
 * tenant isolation the DEFAULT, not something developers remember to add.
 */
export function createTenantPrisma(workspaceId: string) {
  const prisma = new PrismaClient();

  return prisma.$extends({
    name: 'tenant-isolation',

    query: {
      $allOperations({ model, operation, args, query }) {
        if (!model || !isTenantScoped(model)) {
          return query(args);
        }

        // READ operations: inject where filter
        if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate'].includes(operation)) {
          args.where = { ...args.where, workspaceId };
          return query(args);
        }

        // WRITE operations: inject workspaceId into data
        if (['create', 'createMany'].includes(operation)) {
          if (operation === 'createMany') {
            const records = Array.isArray(args.data) ? args.data : [args.data];
            args.data = records.map((record: any) => ({
              ...record,
              workspaceId,
            }));
          } else {
            args.data = { ...args.data, workspaceId };
          }
          return query(args);
        }

        // UPDATE/DELETE operations: scope the where clause
        if (['update', 'updateMany', 'delete', 'deleteMany'].includes(operation)) {
          args.where = { ...args.where, workspaceId };
          return query(args);
        }

        return query(args);
      },
    },
  });
}
```

### NestJS Integration

```typescript
// src/common/providers/tenant-prisma.provider.ts

import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { createTenantPrisma } from '@/lib/prisma-tenant.extension';

/**
 * Request-scoped Prisma client that automatically picks up the
 * workspaceId from the authenticated request.
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaService {
  public readonly client: ReturnType<typeof createTenantPrisma>;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    const workspaceId = (request as any).user?.workspaceId;
    if (!workspaceId) {
      throw new Error('TENANT_CONTEXT_MISSING: No workspaceId on request');
    }
    this.client = createTenantPrisma(workspaceId);
  }
}
```

---

## Tenant Isolation Test Patterns

### Pattern 1: Cross-Tenant Read Isolation

The most critical test. Tenant A must NEVER see Tenant B's data.

```typescript
// test/integration/tenant-isolation/orders.isolation.spec.ts

import { describe, it, expect, beforeAll } from '@jest/globals';
import { TestApp } from '@test/test-app';
import { TENANT_A, TENANT_B, ORDER_ACME_001, ORDER_BETA_001 } from '@test/seed/tenants';

describe('Order Tenant Isolation', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await TestApp.create();
    await app.seed();
  });

  afterAll(async () => {
    await app.cleanup();
  });

  // ─── Cross-Tenant Read ──────────────────────────────────────────

  it('Tenant A cannot list Tenant B orders', async () => {
    const response = await app
      .asUser('user_acme_admin') // Logged in as Acme admin
      .get('/api/v1/orders');

    expect(response.status).toBe(200);

    const orderIds = response.body.data.map((o: any) => o.id);
    // MUST contain Acme's order
    expect(orderIds).toContain(ORDER_ACME_001.id);
    // MUST NOT contain Beta's order
    expect(orderIds).not.toContain(ORDER_BETA_001.id);
  });

  it('Tenant A cannot fetch Tenant B order by ID', async () => {
    // Even if Acme somehow knows Beta's order ID, they get 404 (not 403)
    // WHY 404 not 403: returning 403 confirms the resource EXISTS,
    // which is an information leak. 404 reveals nothing.
    const response = await app
      .asUser('user_acme_admin')
      .get(`/api/v1/orders/${ORDER_BETA_001.id}`);

    expect(response.status).toBe(404);
  });

  // ─── Cross-Tenant Write ─────────────────────────────────────────

  it('Tenant A cannot update Tenant B order', async () => {
    const response = await app
      .asUser('user_acme_admin')
      .patch(`/api/v1/orders/${ORDER_BETA_001.id}`, {
        status: 'cancelled',
      });

    expect(response.status).toBe(404);

    // Verify Beta's order is unchanged
    const betaOrder = await app
      .asUser('user_beta_admin')
      .get(`/api/v1/orders/${ORDER_BETA_001.id}`);

    expect(betaOrder.body.data.status).toBe('pending'); // Original status
  });

  it('Tenant A cannot delete Tenant B order', async () => {
    const response = await app
      .asUser('user_acme_admin')
      .delete(`/api/v1/orders/${ORDER_BETA_001.id}`);

    expect(response.status).toBe(404);

    // Verify Beta's order still exists
    const betaOrder = await app
      .asUser('user_beta_admin')
      .get(`/api/v1/orders/${ORDER_BETA_001.id}`);

    expect(betaOrder.status).toBe(200);
  });
});
```

### Pattern 2: Invoice Cross-Tenant Isolation

```typescript
// test/integration/tenant-isolation/invoices.isolation.spec.ts

describe('Invoice Tenant Isolation', () => {
  it('Tenant B cannot access Tenant A invoices', async () => {
    const response = await app
      .asUser('user_beta_admin')
      .get('/api/v1/invoices');

    const invoiceIds = response.body.data.map((i: any) => i.id);
    expect(invoiceIds).not.toContain('inv_acme_001');
    expect(invoiceIds).toContain('inv_beta_001');
  });

  it('invoice search does not leak cross-tenant results', async () => {
    // WHY: Search endpoints often bypass normal query scoping.
    // This test catches the case where a search index wasn't
    // properly scoped by workspaceId.
    const response = await app
      .asUser('user_beta_admin')
      .get('/api/v1/invoices/search?q=INV-ACM');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0); // Acme invoices invisible
  });

  it('invoice PDF download is tenant-scoped', async () => {
    const response = await app
      .asUser('user_beta_admin')
      .get(`/api/v1/invoices/${INVOICE_ACME_001.id}/pdf`);

    // Must not serve Acme's invoice PDF to Beta
    expect(response.status).toBe(404);
  });
});
```

### Pattern 3: Carrier Cross-Tenant Isolation

```typescript
// test/integration/tenant-isolation/carriers.isolation.spec.ts

describe('Carrier Tenant Isolation', () => {
  it('Tenant A carriers list excludes Tenant B carriers', async () => {
    const response = await app
      .asUser('user_acme_admin')
      .get('/api/v1/carriers');

    const names = response.body.data.map((c: any) => c.name);
    expect(names).toContain('FastFreight LLC');
    expect(names).not.toContain('SpeedHaul Inc');
  });

  it('cannot assign Tenant B carrier to Tenant A load', async () => {
    // WHY: If carrier assignment doesn't check tenant scope,
    // a user could manually craft a request with a cross-tenant carrier ID.
    const response = await app
      .asUser('user_acme_admin')
      .post('/api/v1/loads/load_acme_001/assign', {
        carrierId: CARRIER_BETA_001.id, // Beta's carrier
      });

    expect(response.status).toBe(404); // Carrier not found in Acme's scope
  });

  it('carrier scorecard is tenant-isolated', async () => {
    const response = await app
      .asUser('user_acme_admin')
      .get(`/api/v1/carriers/${CARRIER_BETA_001.id}/scorecard`);

    expect(response.status).toBe(404);
  });
});
```

---

## NestJS Guard Testing

### TenantGuard Tests

```typescript
// test/unit/guards/tenant.guard.spec.ts

import { TenantGuard } from '@/common/guards/tenant.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { createMockExecutionContext } from '@test/helpers/mock-context';

describe('TenantGuard', () => {
  let guard: TenantGuard;

  beforeEach(() => {
    guard = new TenantGuard();
  });

  it('allows request when user workspaceId matches route param', () => {
    const context = createMockExecutionContext({
      user: { id: 'user_1', workspaceId: 'ws_acme_001' },
      params: { workspaceId: 'ws_acme_001' },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects request when user workspaceId differs from route param', () => {
    const context = createMockExecutionContext({
      user: { id: 'user_1', workspaceId: 'ws_acme_001' },
      params: { workspaceId: 'ws_beta_002' }, // Different tenant!
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('rejects request when user has no workspaceId', () => {
    const context = createMockExecutionContext({
      user: { id: 'user_1' }, // No workspaceId
      params: { workspaceId: 'ws_acme_001' },
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('allows super-admin to access any workspace', () => {
    // WHY: Super-admins (platform ops) need cross-tenant access for support.
    // This is the ONLY exception to tenant isolation.
    const context = createMockExecutionContext({
      user: { id: 'user_superadmin', workspaceId: 'ws_platform', role: 'super_admin' },
      params: { workspaceId: 'ws_acme_001' },
    });

    expect(guard.canActivate(context)).toBe(true);
  });
});
```

### RolesGuard Tests

```typescript
// test/unit/guards/roles.guard.spec.ts

import { RolesGuard } from '@/common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { createMockExecutionContext } from '@test/helpers/mock-context';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows admin to access admin-only endpoint', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const context = createMockExecutionContext({
      user: { role: 'admin', workspaceId: 'ws_acme_001' },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('blocks dispatcher from admin-only endpoint', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const context = createMockExecutionContext({
      user: { role: 'dispatcher', workspaceId: 'ws_acme_001' },
    });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('allows access when no roles are specified (public endpoint)', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = createMockExecutionContext({
      user: { role: 'driver', workspaceId: 'ws_acme_001' },
    });

    // WHY: If @Roles() decorator is absent, the endpoint is open
    // to any authenticated user.
    expect(guard.canActivate(context)).toBe(true);
  });

  it('supports multiple allowed roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin', 'dispatcher']);

    const context = createMockExecutionContext({
      user: { role: 'dispatcher', workspaceId: 'ws_acme_001' },
    });

    expect(guard.canActivate(context)).toBe(true);
  });
});
```

### Mock Context Helper

```typescript
// test/helpers/mock-context.ts

import { ExecutionContext } from '@nestjs/common';

interface MockContextOptions {
  user?: Record<string, any>;
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: Record<string, any>;
}

export function createMockExecutionContext(options: MockContextOptions): ExecutionContext {
  const request = {
    user: options.user || {},
    params: options.params || {},
    query: options.query || {},
    body: options.body || {},
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() }),
    }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext;
}
```

---

## CI Lint Gate: Prevent Raw Prisma Without Tenant Scope

Add this ESLint rule (or custom script) to CI to catch unscoped database queries.

### Option A: Custom ESLint Rule

```typescript
// eslint-rules/no-raw-prisma.ts

/**
 * WHY: Developers sometimes bypass the TenantPrisma extension and use the
 * raw PrismaClient directly. This creates tenant isolation vulnerabilities.
 * This lint rule catches it at CI time.
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct PrismaClient usage in service files',
    },
    messages: {
      noRawPrisma:
        'Do not use PrismaClient directly. Use TenantPrismaService to ensure tenant isolation. ' +
        'If this is intentional (e.g., a migration script), add // eslint-disable-next-line no-raw-prisma',
    },
  },

  create(context) {
    const filename = context.getFilename();

    // Only enforce in service/controller/resolver files
    if (!/\.(service|controller|resolver)\.(ts|js)$/.test(filename)) {
      return {};
    }

    return {
      // Catch: import { PrismaClient } from '@prisma/client'
      ImportDeclaration(node) {
        if (
          node.source.value === '@prisma/client' &&
          node.specifiers.some((s) => s.imported?.name === 'PrismaClient')
        ) {
          context.report({ node, messageId: 'noRawPrisma' });
        }
      },

      // Catch: new PrismaClient()
      NewExpression(node) {
        if (node.callee.name === 'PrismaClient') {
          context.report({ node, messageId: 'noRawPrisma' });
        }
      },

      // Catch: prisma.$queryRaw (raw SQL bypasses all extensions)
      MemberExpression(node) {
        if (
          node.property.name === '$queryRaw' ||
          node.property.name === '$executeRaw' ||
          node.property.name === '$queryRawUnsafe' ||
          node.property.name === '$executeRawUnsafe'
        ) {
          context.report({ node, messageId: 'noRawPrisma' });
        }
      },
    };
  },
};
```

### Option B: CI Script (Simpler)

```bash
#!/bin/bash
# ci/check-tenant-scope.sh
# Fails CI if any service file imports PrismaClient directly

echo "Checking for raw PrismaClient usage in service files..."

VIOLATIONS=$(grep -rn "new PrismaClient\|import.*PrismaClient.*from.*@prisma/client" \
  src/modules/**/*.service.ts \
  src/modules/**/*.controller.ts \
  --include="*.ts" \
  | grep -v "prisma-tenant.extension.ts" \
  | grep -v "eslint-disable")

if [ -n "$VIOLATIONS" ]; then
  echo "TENANT ISOLATION VIOLATION: Raw PrismaClient found in service files!"
  echo ""
  echo "$VIOLATIONS"
  echo ""
  echo "Use TenantPrismaService instead of PrismaClient."
  echo "If this is intentional, add // eslint-disable-next-line no-raw-prisma"
  exit 1
fi

echo "No raw PrismaClient violations found."
```

### GitHub Actions Integration

```yaml
# .github/workflows/ci.yml (partial)
jobs:
  tenant-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check tenant isolation
        run: bash ci/check-tenant-scope.sh
```

---

## Integration Test Setup Helper

```typescript
// test/test-app.ts

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { seedTestDatabase } from '@test/seed/run-seed';
import { generateTestJwt } from '@test/helpers/jwt';

export class TestApp {
  private constructor(
    private app: INestApplication,
    private prisma: PrismaClient,
  ) {}

  static async create(): Promise<TestApp> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    const prisma = new PrismaClient({
      datasources: { db: { url: process.env.TEST_DATABASE_URL } },
    });

    return new TestApp(app, prisma);
  }

  async seed() {
    await seedTestDatabase(this.prisma);
  }

  async cleanup() {
    await this.prisma.$disconnect();
    await this.app.close();
  }

  /**
   * Returns a request agent authenticated as the given user.
   * WHY: Every test must explicitly declare which user is making the request.
   * This makes tenant context obvious in every test case.
   */
  asUser(userId: string) {
    const token = generateTestJwt(userId);
    const agent = request(this.app.getHttpServer());

    return {
      get: (url: string) => agent.get(url).set('Authorization', `Bearer ${token}`),
      post: (url: string, body?: any) =>
        agent.post(url).set('Authorization', `Bearer ${token}`).send(body),
      patch: (url: string, body?: any) =>
        agent.patch(url).set('Authorization', `Bearer ${token}`).send(body),
      delete: (url: string) => agent.delete(url).set('Authorization', `Bearer ${token}`),
    };
  }
}
```

---

## Test Checklist

Every tenant-scoped resource must have these tests. No exceptions.

| Test Category | What to Assert | Severity |
| --- | --- | --- |
| **List endpoint** | Returns only records for the authenticated tenant | P0 |
| **Get by ID** | Returns 404 (not 403) for cross-tenant IDs | P0 |
| **Create** | New record has correct workspaceId | P0 |
| **Update** | Cannot update cross-tenant record | P0 |
| **Delete** | Cannot delete cross-tenant record | P0 |
| **Search** | Search results are tenant-scoped | P0 |
| **Aggregate** | Count/sum/avg only includes tenant data | P1 |
| **Export** | CSV/PDF export only includes tenant data | P1 |
| **File access** | Documents/attachments are tenant-scoped | P0 |
| **WebSocket** | Events only broadcast to same-tenant users | P0 |
| **Cache** | Cache keys include workspaceId to prevent cross-tenant cache hits | P1 |

---

## Common Pitfalls

1. **Forgetting search endpoints.** Elasticsearch/Algolia indices must be filtered by `workspaceId`. The Prisma extension won't help if queries go to a search engine.

2. **Aggregate queries.** `SELECT SUM(amount) FROM invoices` without a tenant filter sums ALL tenants. Always test dashboard KPI queries.

3. **File storage paths.** S3 keys must include the workspace ID: `s3://{bucket}/{workspaceId}/{resourceType}/{fileId}`. Without this, a guessed URL serves another tenant's file.

4. **Background jobs.** Queued jobs (email, PDF generation, reports) must carry the `workspaceId` in their payload and re-establish tenant context when processing.

5. **WebSocket rooms.** Subscribe to `workspace:{workspaceId}:*` channels, not global channels. A missing workspace prefix broadcasts events to all tenants.

6. **Cache key collisions.** `cache:orders:page1` is shared across tenants. Use `cache:{workspaceId}:orders:page1`.

7. **Returning 403 vs 404.** Always return 404 for cross-tenant access attempts. A 403 confirms the resource exists, which is an information leak.
