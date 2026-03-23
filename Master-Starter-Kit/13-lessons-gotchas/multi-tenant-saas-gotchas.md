# Multi-Tenant SaaS Gotchas

Multi-tenant bugs are the most dangerous category in SaaS development. A single missing `WHERE tenantId = ?` clause can expose one customer's data to another. These gotchas are drawn from real production incidents across TMS, CRM, and ERP systems using NestJS, Prisma, and PostgreSQL.

---

## 1. Missing tenantId in WHERE Clauses

**Problem:** Queries that forget to filter by `tenantId` return data from all tenants. A single missing filter means Customer A sees Customer B's loads, invoices, or driver records.

**Data Risk Level:** CRITICAL — direct cross-tenant data leakage

**Wrong Pattern:**

```typescript
// DANGEROUS — returns loads from ALL tenants
async findAll(filters: LoadFilters) {
  return this.prisma.load.findMany({
    where: {
      status: filters.status,
      // tenantId is missing — every tenant's loads come back
    },
  });
}
```

**Right Pattern:**

```typescript
// SAFE — Prisma Client Extension enforces tenant isolation automatically
// prisma/extensions/tenant-isolation.ts
import { Prisma } from '@prisma/client';

export function withTenantIsolation(tenantId: string) {
  return Prisma.defineExtension({
    query: {
      $allOperations({ args, query, operation, model }) {
        // Skip models that are genuinely global (e.g., TenantConfig)
        const GLOBAL_MODELS = ['Tenant', 'TenantConfig', 'Migration'];
        if (GLOBAL_MODELS.includes(model)) return query(args);

        // Inject tenantId into every read/write automatically
        if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate'].includes(operation)) {
          args.where = { ...args.where, tenantId };
        }
        if (['create', 'createMany'].includes(operation)) {
          if (Array.isArray(args.data)) {
            args.data = args.data.map(d => ({ ...d, tenantId }));
          } else {
            args.data = { ...args.data, tenantId };
          }
        }
        if (['update', 'updateMany', 'delete', 'deleteMany'].includes(operation)) {
          args.where = { ...args.where, tenantId };
        }
        return query(args);
      },
    },
  });
}

// Usage in NestJS service
@Injectable()
export class LoadService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, filters: LoadFilters) {
    const tenantPrisma = this.prisma.$extends(withTenantIsolation(tenantId));
    // tenantId is now injected automatically — impossible to forget
    return tenantPrisma.load.findMany({
      where: { status: filters.status },
    });
  }
}
```

**Detection Method:**
- Static analysis: grep for `findMany`, `findFirst`, `update`, `delete` calls that lack `tenantId` in the `where` clause
- Integration tests: create data under Tenant A, query as Tenant B, assert zero results
- Prisma middleware logging: log every query and flag any missing `tenantId`

```bash
# Quick scan for missing tenant filters
grep -rn "findMany\|findFirst\|updateMany\|deleteMany" apps/api/src/modules/ \
  | grep -v "tenantId" | grep -v ".spec.ts" | grep -v ".bak"
```

---

## 2. Unique Constraints Not Scoped to Tenant

**Problem:** A `@@unique([email])` constraint means no two tenants can have a customer with the same email. Tenant B gets a database error when adding `john@example.com` because Tenant A already has that email.

**Data Risk Level:** HIGH — breaks tenant independence, leaks existence of data

**Wrong Pattern:**

```prisma
// WRONG — email is globally unique across all tenants
model Customer {
  id       String @id @default(uuid())
  email    String @unique  // Tenant B cannot use same email as Tenant A
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])
}
```

**Right Pattern:**

```prisma
// RIGHT — email is unique WITHIN a tenant, not globally
model Customer {
  id       String @id @default(uuid())
  email    String
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, email])  // Same email allowed across different tenants
}

model Driver {
  id            String @id @default(uuid())
  licenseNumber String
  tenantId      String
  tenant        Tenant @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, licenseNumber])  // License unique per tenant
}

model TruckType {
  id       String @id @default(uuid())
  code     String
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, code])  // Type code unique per tenant
}
```

**Detection Method:**

```bash
# Find all @unique and @@unique in schema.prisma that don't include tenantId
grep -n "@unique\|@@unique" prisma/schema.prisma | grep -v "tenantId"
```

- Review every `@unique` and `@@unique` constraint in the schema
- Any model with a `tenantId` field should have compound unique constraints, not single-field ones
- Exception: the `Tenant` model itself and truly global lookup tables

---

## 3. Seed Data Without Tenant Context

**Problem:** Seed scripts create test data without assigning a `tenantId`. This data is either invisible (filtered out by tenant queries) or worse, visible to ALL tenants if queries lack tenant filtering.

**Data Risk Level:** HIGH — test data leaks to production tenants, or ghost data pollutes queries

**Wrong Pattern:**

```typescript
// WRONG — seed data has no tenant, becomes a ghost or leaks everywhere
async function seed() {
  await prisma.load.createMany({
    data: [
      { origin: 'Chicago', destination: 'Dallas', status: 'AVAILABLE' },
      { origin: 'Atlanta', destination: 'Miami', status: 'AVAILABLE' },
      // No tenantId — these loads belong to nobody (or everybody)
    ],
  });
}
```

**Right Pattern:**

```typescript
// RIGHT — every seed record belongs to an explicit tenant
async function seed() {
  // Create demo tenants first
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo-logistics' },
    update: {},
    create: {
      id: 'tenant-demo-001',
      name: 'Demo Logistics Co',
      slug: 'demo-logistics',
      plan: 'TRIAL',
    },
  });

  // All seed data scoped to the demo tenant
  await prisma.load.createMany({
    data: [
      {
        origin: 'Chicago',
        destination: 'Dallas',
        status: 'AVAILABLE',
        tenantId: demoTenant.id,  // Explicitly scoped
      },
      {
        origin: 'Atlanta',
        destination: 'Miami',
        status: 'AVAILABLE',
        tenantId: demoTenant.id,
      },
    ],
  });

  console.log(`Seeded ${2} loads for tenant: ${demoTenant.slug}`);
}

// ALSO: validate no orphaned records exist
async function validateSeeds() {
  const orphans = await prisma.$queryRaw`
    SELECT table_name, count(*) as orphan_count
    FROM information_schema.columns c
    WHERE column_name = 'tenant_id'
    AND EXISTS (
      SELECT 1 FROM ${Prisma.raw(c.table_name)}
      WHERE tenant_id IS NULL
    )
  `;
  if (orphans.length > 0) {
    throw new Error(`Found orphaned records without tenantId: ${JSON.stringify(orphans)}`);
  }
}
```

**Detection Method:**
- Run `SELECT * FROM loads WHERE tenant_id IS NULL` against every tenant-scoped table
- Add a CI check that runs after seeding and asserts zero NULL `tenant_id` rows
- Make `tenantId` non-nullable in Prisma schema (`String` not `String?`)

---

## 4. Admin Endpoints Exposing Cross-Tenant Data

**Problem:** Super-admin or internal endpoints that list "all loads" or "all users" are built without RBAC checks. A regular tenant user hits the admin route and sees everyone's data.

**Data Risk Level:** CRITICAL — full cross-tenant data exposure

**Wrong Pattern:**

```typescript
// WRONG — no role check, no tenant filter, anyone can hit this
@Controller('admin')
export class AdminController {
  @Get('loads')
  async getAllLoads() {
    // Returns EVERY load across ALL tenants
    return this.prisma.load.findMany({
      include: { carrier: true, customer: true },
    });
  }

  @Get('users')
  async getAllUsers() {
    // Returns EVERY user across ALL tenants
    return this.prisma.user.findMany();
  }
}
```

**Right Pattern:**

```typescript
// RIGHT — layered protection: guard + decorator + explicit scope
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('loads')
  @Roles('SUPER_ADMIN')  // Only platform-level admins
  async getAllLoads(@Query() query: AdminLoadQueryDto) {
    return this.prisma.load.findMany({
      where: {
        // Even super admins must specify a tenant to view
        tenantId: query.tenantId,
      },
      take: Math.min(query.limit || 50, 200),  // Pagination cap
      include: { carrier: true },
    });
  }

  @Get('tenant-loads')
  @Roles('TENANT_ADMIN')  // Tenant-scoped admin
  async getTenantLoads(@CurrentTenant() tenantId: string) {
    return this.prisma.load.findMany({
      where: { tenantId },  // Automatically scoped
    });
  }
}

// Guard implementation
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // CRITICAL: even with the right role, tenant admins
    // cannot access other tenants' data
    if (user.role === 'TENANT_ADMIN' && request.query.tenantId !== user.tenantId) {
      throw new ForbiddenException('Cannot access other tenant data');
    }

    return requiredRoles.includes(user.role);
  }
}
```

**Detection Method:**
- Audit every route under `/admin`, `/internal`, `/system` for missing guards
- Grep for `findMany` calls without `tenantId` in admin controllers
- Penetration test: authenticate as Tenant A user, hit admin endpoints, verify 403

```bash
# Find admin controllers missing guards
grep -rn "@Controller.*admin\|@Controller.*internal" apps/api/src/ \
  | xargs -I {} grep -L "UseGuards" {}
```

---

## 5. File Uploads Not Tenant-Scoped

**Problem:** Files uploaded to S3/cloud storage use flat paths like `/uploads/invoice-123.pdf`. Tenant A can guess Tenant B's file paths and download their documents.

**Data Risk Level:** CRITICAL — direct access to other tenants' documents (BOLs, invoices, contracts)

**Wrong Pattern:**

```typescript
// WRONG — flat path, no tenant isolation, guessable filenames
@Injectable()
export class FileUploadService {
  async uploadFile(file: Express.Multer.File, entityId: string) {
    const key = `uploads/${entityId}/${file.originalname}`;
    //          ^^^^^^^^ no tenant prefix — all files in one bucket namespace

    await this.s3.putObject({
      Bucket: 'my-tms-bucket',
      Key: key,
      Body: file.buffer,
    });

    return { url: `https://my-tms-bucket.s3.amazonaws.com/${key}` };
    //       ^^^ direct S3 URL — anyone with the link can download
  }
}
```

**Right Pattern:**

```typescript
// RIGHT — tenant-prefixed paths + signed URLs
@Injectable()
export class FileUploadService {
  async uploadFile(
    tenantId: string,
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
  ) {
    const fileId = randomUUID();
    const ext = path.extname(file.originalname);
    // Tenant-scoped path: tenants/{id}/loads/{loadId}/{uuid}.pdf
    const key = `tenants/${tenantId}/${entityType}/${entityId}/${fileId}${ext}`;

    await this.s3.putObject({
      Bucket: this.configService.get('S3_BUCKET'),
      Key: key,
      Body: file.buffer,
      // Prevent direct URL access — force signed URLs
      ACL: 'private',
      Metadata: {
        tenantId,
        uploadedBy: 'system',
        entityType,
        entityId,
      },
    });

    // Store file reference in DB with tenant scope
    return this.prisma.document.create({
      data: {
        id: fileId,
        tenantId,
        s3Key: key,
        fileName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        entityType,
        entityId,
      },
    });
  }

  async getSignedUrl(tenantId: string, documentId: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id: documentId, tenantId },  // Tenant check on download too
    });
    if (!doc) throw new NotFoundException('Document not found');

    return this.s3.getSignedUrl('getObject', {
      Bucket: this.configService.get('S3_BUCKET'),
      Key: doc.s3Key,
      Expires: 300,  // 5-minute expiry
    });
  }
}
```

**Detection Method:**
- Grep for S3 `putObject` / `upload` calls and check if the Key includes `tenantId`
- Check S3 bucket policy — objects should be private, never public-read
- Verify all download endpoints validate tenant ownership before generating signed URLs
- Run `aws s3 ls s3://bucket/ --recursive` and check for files outside tenant prefixes

---

## 6. Cache Keys Not Tenant-Scoped

**Problem:** Redis cache keys like `loads:dashboard` are shared across tenants. Tenant A's dashboard data gets served to Tenant B from the cache.

**Data Risk Level:** CRITICAL — cached data from one tenant served to another

**Wrong Pattern:**

```typescript
// WRONG — cache key has no tenant scope
@Injectable()
export class DashboardService {
  async getDashboardStats(filters: DashboardFilters) {
    const cacheKey = `dashboard:stats:${filters.period}`;
    //               ^^^^^^^^ same key for ALL tenants

    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);  // Returns Tenant A data to Tenant B

    const stats = await this.computeStats(filters);
    await this.redis.set(cacheKey, JSON.stringify(stats), 'EX', 300);
    return stats;
  }

  async invalidateCache() {
    // Nuclear option — blows away everyone's cache
    await this.redis.flushdb();
  }
}
```

**Right Pattern:**

```typescript
// RIGHT — every cache key prefixed with tenantId
@Injectable()
export class DashboardService {
  private cacheKey(tenantId: string, ...parts: string[]): string {
    return `t:${tenantId}:${parts.join(':')}`;
    //      ^^^^^^^^^^^^^^ tenant prefix on EVERY key
  }

  async getDashboardStats(tenantId: string, filters: DashboardFilters) {
    const key = this.cacheKey(tenantId, 'dashboard', 'stats', filters.period);

    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    const stats = await this.computeStats(tenantId, filters);
    await this.redis.set(key, JSON.stringify(stats), 'EX', 300);
    return stats;
  }

  async invalidateTenantCache(tenantId: string) {
    // Only invalidate THIS tenant's cache, not everyone's
    const keys = await this.redis.keys(`t:${tenantId}:*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Even better — use a centralized cache utility
export class TenantCache {
  constructor(private redis: Redis) {}

  key(tenantId: string, namespace: string, id?: string): string {
    if (!tenantId) throw new Error('tenantId required for cache key');
    return id ? `t:${tenantId}:${namespace}:${id}` : `t:${tenantId}:${namespace}`;
  }

  async get<T>(tenantId: string, namespace: string, id?: string): Promise<T | null> {
    const raw = await this.redis.get(this.key(tenantId, namespace, id));
    return raw ? JSON.parse(raw) : null;
  }

  async set(tenantId: string, namespace: string, data: unknown, ttlSeconds = 300, id?: string) {
    await this.redis.set(this.key(tenantId, namespace, id), JSON.stringify(data), 'EX', ttlSeconds);
  }
}
```

**Detection Method:**
- Grep for `redis.get`, `redis.set`, `cache.get`, `cache.set` and verify every key includes `tenantId`
- Add a Redis key audit script that lists all keys and flags any without the `t:{uuid}:` prefix
- Integration test: cache data as Tenant A, read as Tenant B, assert cache miss

---

## 7. Background Jobs Losing Tenant Context

**Problem:** A request triggers a background job (email, report generation, invoice PDF). The job runs in a worker process that has no access to the original request's tenant context. The job either fails or runs without tenant scoping.

**Data Risk Level:** CRITICAL — job processes wrong tenant's data or leaks data across tenants

**Wrong Pattern:**

```typescript
// WRONG — job payload doesn't include tenantId
@Injectable()
export class InvoiceService {
  async generateMonthlyInvoices() {
    const customers = await this.prisma.customer.findMany({
      where: { billingCycle: 'MONTHLY' },
      // Missing tenantId — generates invoices for ALL tenants
    });

    for (const customer of customers) {
      await this.queue.add('generate-invoice', {
        customerId: customer.id,
        // tenantId not passed — worker won't know which tenant
      });
    }
  }
}

// Worker processor
@Processor('generate-invoice')
export class InvoiceProcessor {
  @Process()
  async handle(job: Job<{ customerId: string }>) {
    // Which tenant? No idea. Query runs unscoped.
    const customer = await this.prisma.customer.findUnique({
      where: { id: job.data.customerId },
    });
    await this.generatePdf(customer);  // May pull wrong tenant's data
  }
}
```

**Right Pattern:**

```typescript
// RIGHT — tenantId is ALWAYS in the job payload
@Injectable()
export class InvoiceService {
  async generateMonthlyInvoices(tenantId: string) {
    const customers = await this.prisma.customer.findMany({
      where: { tenantId, billingCycle: 'MONTHLY' },
    });

    for (const customer of customers) {
      await this.queue.add('generate-invoice', {
        tenantId,  // ALWAYS include tenant context
        customerId: customer.id,
        triggeredBy: 'monthly-cron',
        triggeredAt: new Date().toISOString(),
      });
    }
  }
}

// Type-safe job payload
interface InvoiceJobPayload {
  tenantId: string;  // Required, not optional
  customerId: string;
  triggeredBy: string;
  triggeredAt: string;
}

@Processor('generate-invoice')
export class InvoiceProcessor {
  @Process()
  async handle(job: Job<InvoiceJobPayload>) {
    const { tenantId, customerId } = job.data;

    if (!tenantId) {
      throw new Error(`Job ${job.id} missing tenantId — refusing to process`);
    }

    // Use tenant-scoped Prisma client
    const tenantPrisma = this.prisma.$extends(withTenantIsolation(tenantId));
    const customer = await tenantPrisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      this.logger.warn(`Customer ${customerId} not found for tenant ${tenantId}`);
      return;
    }

    await this.generatePdf(customer);
  }
}

// For cron jobs that run across all tenants
@Injectable()
export class MonthlyInvoiceCron {
  @Cron('0 2 1 * *')  // 2 AM on 1st of each month
  async run() {
    const tenants = await this.prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
    });

    // Process each tenant independently
    for (const tenant of tenants) {
      await this.invoiceService.generateMonthlyInvoices(tenant.id);
    }
  }
}
```

**Detection Method:**
- Grep for `queue.add` / `this.queue.add` and verify every job payload includes `tenantId`
- Type-check: make `tenantId` a required field in all job payload interfaces
- Add a BullMQ global listener that rejects jobs without `tenantId`

---

## 8. Webhook Handlers Not Validating Tenant Ownership

**Problem:** An incoming webhook (Stripe payment, carrier status update, ELD data) is processed without verifying it belongs to the tenant whose data is being updated. An attacker crafts a fake webhook to modify another tenant's records.

**Data Risk Level:** CRITICAL — external input modifies wrong tenant's data

**Wrong Pattern:**

```typescript
// WRONG — trusts incoming webhook data blindly
@Controller('webhooks')
export class WebhookController {
  @Post('carrier-status')
  async handleCarrierUpdate(@Body() payload: CarrierWebhookPayload) {
    // Trusts the carrierId from the webhook — no tenant validation
    await this.prisma.carrier.update({
      where: { id: payload.carrierId },
      data: { status: payload.newStatus },
    });

    return { received: true };
  }

  @Post('stripe')
  async handleStripeWebhook(@Body() payload: any) {
    // No signature verification, no tenant mapping
    const customerId = payload.data.object.customer;
    await this.billingService.updateSubscription(customerId, payload);
  }
}
```

**Right Pattern:**

```typescript
// RIGHT — verify signature, validate tenant ownership, scope all updates
@Controller('webhooks')
export class WebhookController {
  @Post('carrier-status')
  async handleCarrierUpdate(
    @Body() payload: CarrierWebhookPayload,
    @Headers('x-webhook-signature') signature: string,
    @Headers('x-webhook-timestamp') timestamp: string,
  ) {
    // Step 1: Verify the webhook signature
    const isValid = this.webhookService.verifySignature(
      payload, signature, timestamp, this.configService.get('CARRIER_WEBHOOK_SECRET'),
    );
    if (!isValid) throw new UnauthorizedException('Invalid webhook signature');

    // Step 2: Replay protection
    const isDuplicate = await this.redis.get(`webhook:carrier:${payload.eventId}`);
    if (isDuplicate) return { received: true, duplicate: true };

    // Step 3: Resolve tenant from the webhook's API key or mapping
    const integration = await this.prisma.carrierIntegration.findFirst({
      where: { externalCarrierId: payload.carrierId },
      include: { carrier: true },
    });
    if (!integration) throw new NotFoundException('Unknown carrier integration');

    const tenantId = integration.carrier.tenantId;

    // Step 4: Update with tenant scope
    await this.prisma.carrier.update({
      where: {
        id: integration.carrierId,
        tenantId,  // Tenant-scoped update
      },
      data: { status: payload.newStatus },
    });

    // Step 5: Mark as processed (idempotency)
    await this.redis.set(`webhook:carrier:${payload.eventId}`, '1', 'EX', 86400);

    return { received: true };
  }

  @Post('stripe')
  async handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    // Step 1: Verify Stripe signature using raw body
    const event = this.stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'],
      this.configService.get('STRIPE_WEBHOOK_SECRET'),
    );

    // Step 2: Map Stripe customer to tenant
    const tenantBilling = await this.prisma.tenantBilling.findFirst({
      where: { stripeCustomerId: event.data.object.customer },
    });
    if (!tenantBilling) {
      this.logger.warn(`Stripe webhook for unknown customer: ${event.data.object.customer}`);
      return { received: true };
    }

    // Step 3: Process with tenant context
    await this.billingService.handleEvent(tenantBilling.tenantId, event);
    return { received: true };
  }
}
```

**Detection Method:**
- Audit all routes under `/webhooks`, `/callbacks`, `/hooks` for signature verification
- Verify every webhook handler resolves a `tenantId` before performing any database mutation
- Check for idempotency keys to prevent replay attacks
- Penetration test: send a forged webhook with a different tenant's entity IDs

---

## 9. Search Indexes Mixing Tenant Data

**Problem:** Full-text search indexes (Elasticsearch, Algolia, PostgreSQL `tsvector`) contain records from all tenants. A search query returns results from other tenants if the search layer does not enforce tenant filtering.

**Data Risk Level:** CRITICAL — search results leak other tenants' load details, customer names, addresses

**Wrong Pattern:**

```typescript
// WRONG — search index has no tenant filtering
@Injectable()
export class SearchService {
  async indexLoad(load: Load) {
    await this.elasticsearch.index({
      index: 'loads',  // Single index for ALL tenants
      id: load.id,
      body: {
        origin: load.origin,
        destination: load.destination,
        customerName: load.customer.name,
        // tenantId not included in the document
      },
    });
  }

  async search(query: string) {
    const result = await this.elasticsearch.search({
      index: 'loads',
      body: {
        query: { match: { _all: query } },
        // No tenant filter — returns ALL tenants' loads
      },
    });
    return result.hits.hits;
  }
}
```

**Right Pattern:**

```typescript
// RIGHT — tenant field indexed and filtered on every query
@Injectable()
export class SearchService {
  async indexLoad(tenantId: string, load: Load) {
    await this.elasticsearch.index({
      index: 'loads',
      id: load.id,
      body: {
        tenantId,  // ALWAYS include tenantId in the document
        origin: load.origin,
        destination: load.destination,
        customerName: load.customer.name,
        status: load.status,
      },
      // For high-scale: use routing to co-locate tenant docs on same shard
      routing: tenantId,
    });
  }

  async search(tenantId: string, query: string) {
    const result = await this.elasticsearch.search({
      index: 'loads',
      routing: tenantId,  // Shard routing for performance
      body: {
        query: {
          bool: {
            must: [
              { match: { origin: query } },
            ],
            filter: [
              { term: { tenantId } },  // MANDATORY tenant filter
            ],
          },
        },
      },
    });
    return result.hits.hits;
  }
}

// For PostgreSQL full-text search (no external service needed)
@Injectable()
export class PgSearchService {
  async search(tenantId: string, query: string) {
    return this.prisma.$queryRaw`
      SELECT id, origin, destination,
             ts_rank(search_vector, plainto_tsquery(${query})) as rank
      FROM loads
      WHERE tenant_id = ${tenantId}  -- Tenant filter FIRST (uses index)
        AND search_vector @@ plainto_tsquery(${query})
      ORDER BY rank DESC
      LIMIT 20
    `;
    // Ensure composite index: CREATE INDEX idx_loads_tenant_search
    //   ON loads (tenant_id) INCLUDE (search_vector);
  }
}
```

**Detection Method:**
- Verify every Elasticsearch index mapping includes a `tenantId` field
- Check every search query for a `term` filter on `tenantId` in the `bool.filter` clause
- Integration test: index documents for Tenant A and Tenant B, search as Tenant A, assert only Tenant A results
- Audit Elasticsearch index mappings: `GET /loads/_mapping` should show `tenantId` as a keyword field

---

## 10. Rate Limits Applied Globally Instead of Per-Tenant

**Problem:** Rate limiting is applied globally (e.g., 1000 req/min total) or per-IP. A single high-traffic tenant exhausts the limit, blocking all other tenants. Alternatively, tenants behind a shared NAT/proxy share the same IP-based limit.

**Data Risk Level:** MEDIUM — denial of service to other tenants, not data leakage

**Wrong Pattern:**

```typescript
// WRONG — global rate limit, one tenant can starve others
@Controller('loads')
@UseGuards(ThrottlerGuard)
@Throttle(1000, 60)  // 1000 requests per 60 seconds — shared across ALL tenants
export class LoadController {
  @Get()
  async findAll() { /* ... */ }
}

// ALSO WRONG — IP-based limiting misses tenant context
// app.module.ts
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 100,  // 100 req/min per IP — tenants behind same proxy share limit
}),
```

**Right Pattern:**

```typescript
// RIGHT — per-tenant rate limiting with different tiers
@Injectable()
export class TenantThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    // Use tenantId as the rate limit key, not IP
    const user = req.user as JwtPayload;
    return user?.tenantId || req.ip;  // Fall back to IP for unauthenticated
  }

  protected async getLimit(req: Request): Promise<number> {
    const user = req.user as JwtPayload;
    if (!user?.tenantId) return 20;  // Low limit for unauthenticated

    // Different limits per plan
    const tenant = await this.tenantService.findById(user.tenantId);
    const limits: Record<string, number> = {
      TRIAL: 100,
      STARTER: 500,
      PROFESSIONAL: 2000,
      ENTERPRISE: 10000,
    };
    return limits[tenant.plan] || 100;
  }
}

// Redis-based rate limiter for finer control
@Injectable()
export class TenantRateLimiter {
  async check(tenantId: string, action: string, limit: number, windowSec: number): Promise<boolean> {
    const key = `ratelimit:${tenantId}:${action}`;
    const current = await this.redis.incr(key);

    if (current === 1) {
      await this.redis.expire(key, windowSec);
    }

    if (current > limit) {
      this.logger.warn(`Rate limit exceeded: tenant=${tenantId} action=${action} count=${current}`);
      return false;
    }

    return true;
  }
}

// Usage in controller
@Get('loads')
async findAll(@CurrentTenant() tenantId: string) {
  const allowed = await this.rateLimiter.check(tenantId, 'loads:list', 200, 60);
  if (!allowed) throw new HttpException('Rate limit exceeded', 429);
  return this.loadService.findAll(tenantId);
}
```

**Detection Method:**
- Check `ThrottlerModule` configuration for per-tenant vs per-IP vs global limiting
- Load test: simulate two tenants, have one send 10x normal traffic, verify the other is unaffected
- Monitor Redis rate limit keys to ensure they contain tenant identifiers
- Review 429 responses in logs — if they correlate across unrelated tenants, limiting is global

---

## 11. Audit Logs Missing Tenant Context

**Problem:** Audit logs record actions (user changed a load status, deleted a carrier) without recording which tenant the action belongs to. During incident investigation, you cannot filter logs by tenant. Compliance reports cannot prove tenant data isolation.

**Data Risk Level:** HIGH — compliance failure, inability to investigate tenant-specific incidents

**Wrong Pattern:**

```typescript
// WRONG — audit log has no tenant context
@Injectable()
export class AuditService {
  async log(action: string, userId: string, details: Record<string, any>) {
    await this.prisma.auditLog.create({
      data: {
        action,       // 'LOAD_STATUS_CHANGED'
        userId,       // Who did it
        details,      // What changed
        // tenantId missing — cannot filter by tenant
        // cannot prove data isolation to auditors
      },
    });
  }
}

// Usage — caller also forgets tenant
await this.auditService.log('LOAD_DELETED', user.id, { loadId: load.id });
```

**Right Pattern:**

```typescript
// RIGHT — tenant context is mandatory in every audit entry
interface AuditEntry {
  tenantId: string;      // REQUIRED — which tenant
  action: string;        // What happened
  userId: string;        // Who did it
  entityType: string;    // What entity (Load, Carrier, Invoice)
  entityId: string;      // Which specific record
  changes?: {            // Before/after for mutations
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  metadata?: Record<string, unknown>;  // IP, user agent, etc.
}

@Injectable()
export class AuditService {
  async log(entry: AuditEntry) {
    if (!entry.tenantId) {
      throw new Error('Audit log requires tenantId — refusing to log without tenant context');
    }

    await this.prisma.auditLog.create({
      data: {
        tenantId: entry.tenantId,
        action: entry.action,
        userId: entry.userId,
        entityType: entry.entityType,
        entityId: entry.entityId,
        changes: entry.changes ? JSON.stringify(entry.changes) : null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        ipAddress: entry.metadata?.ip as string,
        createdAt: new Date(),
      },
    });
  }

  // Tenant-scoped query for compliance reports
  async getAuditTrail(tenantId: string, filters: AuditFilters) {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId,  // ALWAYS scoped
        action: filters.action,
        createdAt: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 100,
    });
  }
}

// Prisma middleware approach — automatic audit logging
this.prisma.$use(async (params, next) => {
  const result = await next(params);

  if (['create', 'update', 'delete'].includes(params.action)) {
    const tenantId = params.args.data?.tenantId || params.args.where?.tenantId;
    if (tenantId) {
      await this.auditService.log({
        tenantId,
        action: `${params.model}.${params.action}`,
        userId: this.cls.get('userId'),  // From AsyncLocalStorage
        entityType: params.model,
        entityId: result?.id || params.args.where?.id,
      });
    }
  }

  return result;
});
```

**Detection Method:**
- Query: `SELECT COUNT(*) FROM audit_logs WHERE tenant_id IS NULL` — should be zero
- Make `tenantId` non-nullable in the `AuditLog` model
- Compliance check: for any given tenant, verify their audit trail only shows their own actions
- Review AuditService callers to ensure they pass `tenantId`

---

## 12. Database Migrations Affecting All Tenants Simultaneously

**Problem:** A schema migration runs against the shared database and locks tables that all tenants use. A long-running `ALTER TABLE loads ADD COLUMN ...` locks the table for minutes, causing downtime for every tenant at once. Or worse, a data migration corrupts data for tenants that were not ready for the change.

**Data Risk Level:** HIGH — service disruption for all tenants, potential data corruption

**Wrong Pattern:**

```typescript
// WRONG — blocking migration on a massive shared table
// prisma/migrations/20260310_add_load_priority/migration.sql

-- This locks the entire loads table while it runs
ALTER TABLE loads ADD COLUMN priority INTEGER NOT NULL DEFAULT 0;
-- With 10M rows across 500 tenants, this takes 5+ minutes
-- ALL tenants experience timeouts during this window

-- ALSO WRONG — data migration without tenant batching
UPDATE loads SET priority = CASE
  WHEN rate > 5000 THEN 1
  WHEN rate > 2000 THEN 2
  ELSE 3
END;
-- Processes ALL tenants at once, massive lock contention
```

**Right Pattern:**

```sql
-- RIGHT — non-blocking migration using PostgreSQL concurrent operations

-- Step 1: Add column as nullable (instant, no lock)
ALTER TABLE loads ADD COLUMN priority INTEGER;

-- Step 2: Backfill in small tenant-scoped batches (no lock)
-- Run this from application code, NOT from migration file

-- Step 3: Add default for new rows (instant on PG 11+)
ALTER TABLE loads ALTER COLUMN priority SET DEFAULT 0;

-- Step 4: Add NOT NULL constraint with validation (PG 12+ can skip full scan)
ALTER TABLE loads ADD CONSTRAINT loads_priority_not_null
  CHECK (priority IS NOT NULL) NOT VALID;
ALTER TABLE loads VALIDATE CONSTRAINT loads_priority_not_null;

-- Step 5: Create index concurrently (non-blocking)
CREATE INDEX CONCURRENTLY idx_loads_tenant_priority
  ON loads (tenant_id, priority);
```

```typescript
// Application-level data backfill — tenant by tenant
@Injectable()
export class MigrationService {
  async backfillLoadPriority() {
    const tenants = await this.prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
    });

    for (const tenant of tenants) {
      this.logger.log(`Backfilling priority for tenant: ${tenant.id}`);

      // Process in batches of 1000 within each tenant
      let processed = 0;
      while (true) {
        const batch = await this.prisma.$executeRaw`
          UPDATE loads
          SET priority = CASE
            WHEN rate > 5000 THEN 1
            WHEN rate > 2000 THEN 2
            ELSE 3
          END
          WHERE tenant_id = ${tenant.id}
            AND priority IS NULL
          LIMIT 1000
        `;

        processed += batch;
        if (batch === 0) break;

        // Small delay to reduce DB load
        await new Promise(r => setTimeout(r, 100));
      }

      this.logger.log(`Tenant ${tenant.id}: backfilled ${processed} loads`);
    }
  }
}
```

**Detection Method:**
- Review all migration files for `ALTER TABLE ... ADD COLUMN ... NOT NULL` on large tables (should be nullable first)
- Check for `UPDATE` statements without `WHERE tenant_id = ?` in migrations
- Monitor `pg_stat_activity` during migrations for long-running queries and lock waits
- Test migrations against a production-sized dataset in staging before deploying
- Use `pg_locks` to detect table-level locks during migration windows

---

## 13. JWT Tokens Without Tenant Claim Validation

**Problem:** JWT tokens contain a `tenantId` claim, but the server never validates that the user actually belongs to that tenant. An attacker modifies the JWT payload (or uses a token from Tenant A's session) to access Tenant B's resources.

**Data Risk Level:** CRITICAL — complete tenant impersonation

**Wrong Pattern:**

```typescript
// WRONG — trusts tenantId from JWT without server-side validation
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  validate(payload: JwtPayload) {
    // Blindly trusts whatever tenantId is in the token
    return {
      userId: payload.sub,
      tenantId: payload.tenantId,  // Never verified against DB
      role: payload.role,
    };
  }
}

// ALSO WRONG — user can pass any tenantId as a query param
@Get('loads')
async findAll(@Query('tenantId') tenantId: string) {
  return this.loadService.findAll(tenantId);  // User controls tenantId
}
```

**Right Pattern:**

```typescript
// RIGHT — validate tenant membership on every request
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({ /* jwt config */ });
  }

  async validate(payload: JwtPayload) {
    // Verify user still exists and belongs to claimed tenant
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
        tenantId: payload.tenantId,
        status: 'ACTIVE',  // Deactivated users rejected
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token or tenant membership');
    }

    return {
      userId: user.id,
      tenantId: user.tenantId,  // From DB, not from JWT
      role: user.role,
    };
  }
}

// Custom decorator — extracts tenantId from validated user, never from query
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.user?.tenantId;
    if (!tenantId) throw new UnauthorizedException('No tenant context');
    return tenantId;
  },
);

// Usage — tenantId comes from auth, not from user input
@Get('loads')
async findAll(@CurrentTenant() tenantId: string) {
  return this.loadService.findAll(tenantId);
}
```

**Detection Method:**
- Check `JwtStrategy.validate()` — does it query the database or blindly trust the token?
- Grep for `@Query('tenantId')` or `req.query.tenantId` — these are red flags
- Penetration test: modify JWT `tenantId` claim, verify server rejects it
- Ensure a `CurrentTenant` decorator is used everywhere instead of reading tenant from request body/query

---

## 14. Soft Deletes Leaking Across Tenants

**Problem:** Soft-deleted records (where `deletedAt IS NOT NULL`) are excluded from normal queries but still exist in the database. If a cross-tenant query bug exists, soft-deleted records from other tenants can resurface in search results, reports, or exports.

**Data Risk Level:** HIGH — "deleted" data from other tenants becomes visible

**Wrong Pattern:**

```typescript
// WRONG — soft delete filter but no tenant filter
@Injectable()
export class CarrierService {
  async findAll() {
    return this.prisma.carrier.findMany({
      where: {
        deletedAt: null,  // Only "active" records
        // Missing tenantId — returns all tenants' carriers
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.carrier.update({
      where: { id },  // No tenant check — can delete any tenant's carrier
      data: { deletedAt: new Date() },
    });
  }

  // DANGEROUS — admin "restore" that ignores tenant
  async restore(id: string) {
    return this.prisma.carrier.update({
      where: { id },
      data: { deletedAt: null },  // No tenant validation
    });
  }
}
```

**Right Pattern:**

```typescript
// RIGHT — Prisma middleware handles both soft delete AND tenant scope
// prisma/middleware/soft-delete.middleware.ts
export function softDeleteMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const SOFT_DELETE_MODELS = ['Carrier', 'Customer', 'Load', 'Driver'];

    if (!SOFT_DELETE_MODELS.includes(params.model)) return next(params);

    // Intercept deletes → convert to soft delete
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      params.args.data = { deletedAt: new Date() };
    }

    // Intercept reads → add deletedAt: null filter
    if (['findMany', 'findFirst', 'count'].includes(params.action)) {
      params.args.where = {
        ...params.args.where,
        deletedAt: null,  // Exclude soft-deleted
      };
    }

    return next(params);
  };
}

// Service layer — ALWAYS pairs soft delete filter with tenant filter
@Injectable()
export class CarrierService {
  async findAll(tenantId: string) {
    return this.prisma.carrier.findMany({
      where: {
        tenantId,          // Tenant isolation
        deletedAt: null,   // Soft delete filter (or handled by middleware)
      },
    });
  }

  async softDelete(tenantId: string, id: string) {
    // Verify ownership BEFORE deleting
    const carrier = await this.prisma.carrier.findFirst({
      where: { id, tenantId },
    });
    if (!carrier) throw new NotFoundException('Carrier not found');

    return this.prisma.carrier.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: this.cls.get('userId') },
    });
  }
}
```

**Detection Method:**
- Query: `SELECT tenant_id, COUNT(*) FROM carriers WHERE deleted_at IS NOT NULL GROUP BY tenant_id` — verify soft-deleted records are properly scoped
- Integration test: soft-delete a record as Tenant A, verify Tenant B cannot see or restore it
- Grep for `.findMany` calls on soft-deletable models and verify both `deletedAt` and `tenantId` filters are present

---

## Quick Reference Matrix

| # | Gotcha | Risk Level | Layer | Fix Complexity |
|---|--------|-----------|-------|----------------|
| 1 | Missing tenantId in WHERE | CRITICAL | Database | Medium (Prisma Extension) |
| 2 | Unique constraints not tenant-scoped | HIGH | Schema | Low (migration) |
| 3 | Seed data without tenant context | HIGH | DevOps | Low (seed scripts) |
| 4 | Admin endpoints cross-tenant | CRITICAL | API | Medium (guards) |
| 5 | File uploads not tenant-scoped | CRITICAL | Storage | Medium (S3 paths) |
| 6 | Cache keys not tenant-scoped | CRITICAL | Cache | Low (key prefix) |
| 7 | Background jobs losing context | CRITICAL | Queue | Medium (payload) |
| 8 | Webhook tenant validation | CRITICAL | API | High (signatures) |
| 9 | Search indexes mixing tenants | CRITICAL | Search | Medium (filters) |
| 10 | Global rate limits | MEDIUM | API | Medium (per-tenant) |
| 11 | Audit logs missing tenant | HIGH | Logging | Low (schema) |
| 12 | Migrations affecting all tenants | HIGH | Database | High (batching) |
| 13 | JWT tenant claim not validated | CRITICAL | Auth | Medium (strategy) |
| 14 | Soft deletes leaking cross-tenant | HIGH | Database | Medium (middleware) |

## Prevention Checklist

Before shipping any multi-tenant feature, verify:

- [ ] Every database query includes `tenantId` in the WHERE clause (or uses Prisma Extension)
- [ ] Every unique constraint is compound with `tenantId`
- [ ] Every S3 key starts with `tenants/{tenantId}/`
- [ ] Every Redis key starts with `t:{tenantId}:`
- [ ] Every background job payload includes `tenantId`
- [ ] Every webhook handler verifies signature and resolves tenant
- [ ] Every search query filters by `tenantId`
- [ ] Rate limits are per-tenant, not global or per-IP
- [ ] Audit logs include `tenantId` as a non-nullable field
- [ ] Migrations use non-blocking patterns and batch by tenant
- [ ] JWT validation queries the database, not just decodes the token
- [ ] Admin endpoints have role guards AND tenant scope checks
- [ ] Integration tests create data for Tenant A and assert Tenant B sees nothing
