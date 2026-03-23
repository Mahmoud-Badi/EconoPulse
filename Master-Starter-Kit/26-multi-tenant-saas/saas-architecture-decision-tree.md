# SaaS Architecture Decision Tree

> High-level architecture decisions for your SaaS product. Covers monolith vs microservices, shared vs dedicated compute, cache isolation, single vs multi-region, job processing, and the right architecture at each scale. Start simple. Extract complexity only when a specific bottleneck demands it.

---

## Decision 1: Monolith vs Microservices

**Default answer: Start with a monolith.**

The question is not "should we use microservices?" The question is "do we have a specific, measurable problem that a monolith cannot solve?"

### Decision Matrix

| Signal | Monolith | Microservices |
|--------|----------|---------------|
| Team size < 10 | Yes | No |
| Team size > 50 with distinct service owners | No | Yes |
| Single deployment unit is fine | Yes | - |
| Different services need different scaling | - | Yes |
| Deploy frequency > 10x/day with team conflicts | - | Yes |
| Compliance requires service-level isolation | - | Yes |
| You are pre-product-market-fit | Yes | No |
| You have proven PMF and scaling bottlenecks | Evaluate | Maybe |

### The Monolith Path (Recommended for 90% of SaaS)

```
Year 1: Monolith
  → Single codebase, single deployment, single database
  → Focus on product, not infrastructure
  → Multi-tenancy handled at application layer (RLS, middleware)

Year 2: Modular Monolith
  → Same deployment, but internal modules have clear boundaries
  → /modules/billing, /modules/auth, /modules/notifications
  → Can extract to services later if needed

Year 3+: Service-Oriented (if needed)
  → Extract specific bottlenecks:
     - Billing service (if payment processing is complex)
     - Notification service (if email/push volume is high)
     - Analytics service (if reporting is compute-heavy)
  → Keep the core product as a monolith
```

### Anti-Pattern: Premature Microservices

Symptoms of premature microservices:
- "We have 3 developers and 12 services"
- Service-to-service latency exceeds database query time
- More time spent on infrastructure than features
- Distributed debugging takes longer than fixing the bug
- Team spends more time in Kubernetes YAML than application code

---

## Decision 2: Shared vs Dedicated Compute Per Tenant

### Shared Compute (Default)

All tenants run on the same servers. Tenant isolation is at the application layer (database RLS, middleware).

```
Load Balancer
     │
     ▼
┌─────────────┐
│ App Server 1 │ ← Serves ALL tenants
│ App Server 2 │ ← Serves ALL tenants
│ App Server 3 │ ← Serves ALL tenants
└─────────────┘
     │
     ▼
Shared Database (with RLS)
```

**Best for:** 95% of SaaS products. Cost-effective, simple operations.

### Dedicated Compute (Enterprise Tier)

Enterprise tenants get their own infrastructure — separate app servers, possibly separate databases.

```
Load Balancer
     │
     ├──► Shared Pool (serves standard tenants)
     │    ├─ App Server 1
     │    ├─ App Server 2
     │    └─ Shared Database
     │
     ├──► Tenant ABC (dedicated)
     │    ├─ App Server 4
     │    └─ Database ABC
     │
     └──► Tenant XYZ (dedicated)
          ├─ App Server 5
          └─ Database XYZ
```

**Best for:** Enterprise customers paying $10K+/mo who contractually require dedicated infrastructure, or compliance scenarios (FedRAMP, HIPAA).

### Decision

```
Do you have customers paying >$10K/mo who demand dedicated infra?
  ├── No → Shared compute
  └── Yes → Shared compute (default) + Dedicated compute (enterprise add-on)
```

---

## Decision 3: Cache Isolation

### Key Prefix Pattern (Default)

All tenants share one Redis instance. Cache keys include tenant ID.

```typescript
// Cache key format: {tenant_id}:{resource}:{identifier}
const key = `${tenantId}:projects:list:page1`;
const key = `${tenantId}:user:${userId}:profile`;
const key = `${tenantId}:settings`;

// Global cache (not tenant-scoped)
const key = `global:plans:list`;
const key = `global:feature_flags`;
```

**Best for:** All SaaS products. Simple, cost-effective, sufficient isolation.

### Per-Tenant Redis Database

Redis supports 16 databases (0-15). You can assign one per tenant. **Not recommended** — limits you to 16 tenants and complicates operations.

### Per-Tenant Redis Instance

Each tenant gets their own Redis instance. **Almost never needed.** Only consider for:
- Regulatory requirement for physical isolation
- Tenant generates so much cache traffic it affects others
- Enterprise customer willing to pay for dedicated infrastructure

### Decision

```
Need physical cache isolation for compliance?
  ├── No → Shared Redis with key prefixes (99% of cases)
  └── Yes → Per-tenant Redis instance (enterprise add-on)
```

---

## Decision 4: Single Region vs Multi-Region

### Single Region (Default)

```
Region: us-east-1
  ├── Load Balancer
  ├── App Servers
  ├── Database (primary)
  ├── Redis
  └── Object Storage
```

**Best for:** Most SaaS products until you have meaningful international traffic or contractual data residency requirements.

### Multi-Region Triggers

You need multi-region when:

| Trigger | Example | Architecture Change |
|---------|---------|-------------------|
| Latency | EU users experiencing >200ms API latency | Add EU region with read replicas |
| Data residency | GDPR requires EU data stays in EU | EU-specific database for EU tenants |
| Availability | 99.99% SLA requires no single point of failure | Active-active across 2+ regions |
| Compliance | Government contract requires specific region | Region-specific deployment |

### Multi-Region Architecture

```
DNS (latency-based routing)
     │
     ├──► us-east-1
     │    ├── App Servers
     │    ├── Database (primary for US tenants)
     │    ├── Database (read replica of EU data)
     │    └── Redis
     │
     └──► eu-west-1
          ├── App Servers
          ├── Database (primary for EU tenants)
          ├── Database (read replica of US data)
          └── Redis
```

### Tenant-Region Mapping

```sql
ALTER TABLE tenants ADD COLUMN region VARCHAR(20) DEFAULT 'us-east-1';
-- 'us-east-1', 'eu-west-1', 'ap-southeast-1'
```

```typescript
// Routing middleware
function getTenantRegion(tenantId: string): string {
  const tenant = getCachedTenant(tenantId);
  return tenant.region;
}

function getDatabaseForTenant(tenantId: string) {
  const region = getTenantRegion(tenantId);
  return connectionPools[region]; // Region-specific connection pool
}
```

### Decision

```
Do you have >30% of users outside your primary region?
  ├── No → Single region
  └── Yes
      └── Is it latency concern or data residency?
          ├── Latency only → CDN + read replicas in target region
          └── Data residency → Full multi-region with per-tenant routing
```

---

## Decision 5: Async Job Processing

### Shared Queue with Tenant Routing (Default)

```
Producer (App Server)
     │
     ▼
Shared Queue (Redis/SQS/RabbitMQ)
     │
     ▼
Worker Pool
  → Worker 1 picks job → reads tenantId from payload → sets context → processes
  → Worker 2 picks job → reads tenantId from payload → sets context → processes
```

```typescript
// Job payload always includes tenantId
await queue.add("send-report", {
  tenantId: "abc-123",
  reportId: "report-456",
});

// Worker sets tenant context
worker.process("send-report", async (job) => {
  const { tenantId, reportId } = job.data;
  return runWithTenant(tenantId, () => generateAndSendReport(reportId));
});
```

### Per-Tenant Queues (Rarely Needed)

```
Tenant A Queue → Worker Pool A
Tenant B Queue → Worker Pool B
Tenant C Queue → Worker Pool C
```

**When to consider:**
- One tenant's job volume overwhelms shared workers
- Compliance requires physical job isolation
- Enterprise SLA requires guaranteed job processing time

### Priority Queue Pattern (Recommended Alternative to Per-Tenant Queues)

```typescript
// Instead of per-tenant queues, use priority tiers
await queue.add("send-report", {
  tenantId: "enterprise-tenant",
  reportId: "report-456",
}, {
  priority: getPriorityForPlan("enterprise"), // 1 = highest
});

await queue.add("send-report", {
  tenantId: "free-tenant",
  reportId: "report-789",
}, {
  priority: getPriorityForPlan("free"), // 10 = lowest
});

function getPriorityForPlan(plan: string): number {
  switch (plan) {
    case "enterprise": return 1;
    case "business": return 3;
    case "pro": return 5;
    case "free": return 10;
    default: return 10;
  }
}
```

### Decision

```
Do you have tenants with wildly different job volumes?
  ├── No → Shared queue with tenant routing
  └── Yes
      └── Can priority queues solve the problem?
          ├── Yes → Shared queue with priority tiers
          └── No → Per-tenant queues for specific high-volume tenants
```

---

## Decision 6: API Versioning Strategy

For SaaS products with external APIs consumed by tenants.

| Strategy | How It Works | Best For |
|----------|-------------|---------|
| URL path versioning | `/api/v1/projects`, `/api/v2/projects` | Public APIs, clear versioning |
| Header versioning | `Api-Version: 2024-01-15` | Stripe-style date-based versioning |
| No versioning | Always backward-compatible changes | Internal APIs, early-stage products |

**Recommendation:** Start with URL path versioning (`/api/v1/`). Migrate to header-based date versioning only if you have a large external developer ecosystem.

---

## Quick Reference: Architecture by Scale

| Tenant Count | Architecture | Database | Compute | Cache | Jobs | Region |
|-------------|-------------|----------|---------|-------|------|--------|
| **1-10** | Monolith | Shared, row-level | Shared | Shared Redis, key prefix | Shared queue | Single |
| **10-100** | Monolith | Shared, row-level + RLS | Shared | Shared Redis, key prefix | Shared queue with priority | Single |
| **100-1K** | Modular monolith | Shared, row-level + RLS | Shared + dedicated for enterprise | Shared Redis, key prefix | Shared queue with priority | Single (+ CDN) |
| **1K-10K** | Modular monolith or SOA | Shared + read replicas | Auto-scaling shared pool | Shared Redis cluster | Shared queue with priority tiers | Multi-region |
| **10K+** | Service-oriented | Shared + sharding or partitioning | Auto-scaling, region-aware | Redis cluster, per-region | Per-region queues | Multi-region, active-active |

### Cost Estimates by Scale

| Scale | Monthly Infrastructure Cost (Approximate) |
|-------|--------------------------------------------|
| 1-10 tenants | $50-200 (single VPS or small cloud instances) |
| 10-100 tenants | $200-1,000 (managed database, load balancer) |
| 100-1K tenants | $1,000-5,000 (read replicas, Redis, CDN) |
| 1K-10K tenants | $5,000-25,000 (auto-scaling, multi-AZ) |
| 10K+ tenants | $25,000+ (multi-region, dedicated ops team) |

---

## Decision Checklist

- [ ] Monolith vs microservices decision documented with rationale
- [ ] Shared vs dedicated compute strategy defined per plan tier
- [ ] Cache key convention documented (`{tenantId}:{resource}:{id}`)
- [ ] Single-region deployment confirmed (or multi-region triggers identified)
- [ ] Job processing strategy: shared queue with tenant routing and priority
- [ ] API versioning strategy chosen
- [ ] Architecture documented for current scale
- [ ] Scaling triggers identified (when to upgrade architecture)
- [ ] Cost estimates documented for current and next scale tier
- [ ] All decisions recorded in Architecture Decision Records (ADRs)
