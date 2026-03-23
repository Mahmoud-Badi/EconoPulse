# Usage Metering & Rate Limiting

> Per-tenant usage tracking and rate limiting for {{PROJECT_NAME}}. Covers Redis-based rate limiting, usage tracking schemas, tier-based limits, overage handling, aggregation strategies, and billing integration. Without rate limiting, one tenant can degrade the service for every other tenant.

---

## Prerequisites

- Project: {{PROJECT_NAME}}
- Free tier rate limit: {{FREE_TIER_RATE_LIMIT}} requests/hour
- Redis available for real-time counters
- Tenants table and subscription/plan infrastructure in place

---

## 1. Rate Limiting Tiers

Define limits per plan tier. These are enforced on every API request.

| Tier | API Requests/Hour | Storage | AI Requests/Day | Seats | Webhooks/Hour | File Upload Size |
|------|-------------------|---------|-----------------|-------|---------------|-----------------|
| **Free** | {{FREE_TIER_RATE_LIMIT}} | 1 GB | 10 | 1 | 10 | 10 MB |
| **Pro** | 1,000 | 10 GB | 100 | 5 | 100 | 100 MB |
| **Business** | 10,000 | 100 GB | 1,000 | 25 | 1,000 | 500 MB |
| **Enterprise** | Custom | Custom | Custom | Custom | Custom | Custom |

```typescript
// src/rate-limiting/plan-limits.ts
export interface PlanRateLimits {
  apiRequestsPerHour: number;
  storageBytes: number;
  aiRequestsPerDay: number;
  seats: number;
  webhooksPerHour: number;
  maxUploadBytes: number;
}

export const PLAN_RATE_LIMITS: Record<string, PlanRateLimits> = {
  free: {
    apiRequestsPerHour: {{FREE_TIER_RATE_LIMIT}},
    storageBytes: 1 * 1024 * 1024 * 1024,       // 1 GB
    aiRequestsPerDay: 10,
    seats: 1,
    webhooksPerHour: 10,
    maxUploadBytes: 10 * 1024 * 1024,            // 10 MB
  },
  pro: {
    apiRequestsPerHour: 1_000,
    storageBytes: 10 * 1024 * 1024 * 1024,       // 10 GB
    aiRequestsPerDay: 100,
    seats: 5,
    webhooksPerHour: 100,
    maxUploadBytes: 100 * 1024 * 1024,           // 100 MB
  },
  business: {
    apiRequestsPerHour: 10_000,
    storageBytes: 100 * 1024 * 1024 * 1024,      // 100 GB
    aiRequestsPerDay: 1_000,
    seats: 25,
    webhooksPerHour: 1_000,
    maxUploadBytes: 500 * 1024 * 1024,           // 500 MB
  },
  enterprise: {
    apiRequestsPerHour: Infinity,
    storageBytes: Infinity,
    aiRequestsPerDay: Infinity,
    seats: Infinity,
    webhooksPerHour: Infinity,
    maxUploadBytes: 5 * 1024 * 1024 * 1024,     // 5 GB
  },
};
```

---

## 2. Redis-Based Rate Limiting

### Sliding Window Rate Limiter

The sliding window approach provides smoother rate limiting than fixed windows (no burst at window boundaries).

```typescript
// src/rate-limiting/rate-limiter.ts
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;         // When the window resets
  retryAfter?: number;   // Seconds until next allowed request
}

/**
 * Fixed-window rate limiter.
 * Simple, fast, good enough for most SaaS use cases.
 */
export async function checkRateLimit(
  tenantId: string,
  metric: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const key = `rate:${tenantId}:${metric}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);
  const windowKey = `${key}:${windowStart}`;

  const pipeline = redis.pipeline();
  pipeline.incr(windowKey);
  pipeline.expire(windowKey, windowSeconds + 1); // TTL slightly longer than window
  const results = await pipeline.exec();

  const current = results![0][1] as number;
  const remaining = Math.max(0, limit - current);
  const resetAt = new Date((windowStart + windowSeconds) * 1000);

  if (current > limit) {
    const retryAfter = windowStart + windowSeconds - now;
    return { allowed: false, remaining: 0, limit, resetAt, retryAfter };
  }

  return { allowed: true, remaining, limit, resetAt };
}

/**
 * Sliding window rate limiter (more precise, slightly more expensive).
 * Uses Redis sorted sets to track individual requests.
 */
export async function checkSlidingWindowRateLimit(
  tenantId: string,
  metric: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const key = `rate:sliding:${tenantId}:${metric}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  const pipeline = redis.pipeline();
  // Remove expired entries
  pipeline.zremrangebyscore(key, 0, windowStart);
  // Count current entries
  pipeline.zcard(key);
  // Add current request
  pipeline.zadd(key, now, `${now}:${Math.random()}`);
  // Set TTL
  pipeline.expire(key, windowSeconds + 1);

  const results = await pipeline.exec();
  const current = results![1][1] as number;

  const remaining = Math.max(0, limit - current);
  const resetAt = new Date(now + windowSeconds * 1000);

  if (current >= limit) {
    // Find the oldest entry to calculate retry-after
    const oldest = await redis.zrange(key, 0, 0, "WITHSCORES");
    const retryAfter = oldest.length >= 2
      ? Math.ceil((parseInt(oldest[1]) + windowSeconds * 1000 - now) / 1000)
      : windowSeconds;

    return { allowed: false, remaining: 0, limit, resetAt, retryAfter };
  }

  return { allowed: true, remaining, limit, resetAt };
}
```

### Rate Limiting Middleware

```typescript
// src/middleware/rate-limit.ts
import { checkRateLimit } from "../rate-limiting/rate-limiter";
import { getPlanRateLimits } from "../rate-limiting/plan-limits";
import { getCurrentTenantId } from "../db/tenant-context";

export function rateLimitMiddleware(metric: string = "api") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = getCurrentTenantId();
    const tenant = await getCachedTenant(tenantId);
    const limits = getPlanRateLimits(tenant.plan);

    let limit: number;
    let windowSeconds: number;

    switch (metric) {
      case "api":
        limit = limits.apiRequestsPerHour;
        windowSeconds = 3600;
        break;
      case "ai":
        limit = limits.aiRequestsPerDay;
        windowSeconds = 86400;
        break;
      case "webhooks":
        limit = limits.webhooksPerHour;
        windowSeconds = 3600;
        break;
      default:
        limit = limits.apiRequestsPerHour;
        windowSeconds = 3600;
    }

    // Enterprise with Infinity limits — skip check
    if (!isFinite(limit)) {
      return next();
    }

    const result = await checkRateLimit(tenantId, metric, limit, windowSeconds);

    // Set standard rate limit headers (RFC 6585 / draft-ietf-httpapi-ratelimit-headers)
    res.setHeader("X-RateLimit-Limit", result.limit);
    res.setHeader("X-RateLimit-Remaining", result.remaining);
    res.setHeader("X-RateLimit-Reset", Math.floor(result.resetAt.getTime() / 1000));

    if (!result.allowed) {
      res.setHeader("Retry-After", result.retryAfter!);
      return res.status(429).json({
        error: "Too many requests",
        message: `Rate limit exceeded. Limit: ${result.limit}/${metric === "ai" ? "day" : "hour"}. Retry after ${result.retryAfter} seconds.`,
        upgradeUrl: "/settings/billing",
        retryAfter: result.retryAfter,
      });
    }

    next();
  };
}

// Usage in routes
app.use("/api", rateLimitMiddleware("api"));
app.use("/api/ai", rateLimitMiddleware("ai"));
app.use("/api/webhooks", rateLimitMiddleware("webhooks"));
```

---

## 3. Usage Tracking Schema

Track usage for billing, analytics, and limit enforcement.

```sql
-- Real-time usage counters (for display and enforcement)
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL,
  -- 'api_calls', 'storage_bytes', 'ai_requests', 'bandwidth_bytes',
  -- 'seats_used', 'webhooks_sent', 'emails_sent'
  quantity BIGINT NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_tenant_metric ON usage_records(tenant_id, metric_type, period_start);
CREATE UNIQUE INDEX idx_usage_unique_period ON usage_records(tenant_id, metric_type, period_start, period_end);

-- Detailed usage events (for audit and detailed billing)
CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL,
  quantity BIGINT NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  -- { "endpoint": "/api/projects", "method": "GET", "user_id": "..." }
  recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Partition by month for efficient querying and archival
CREATE INDEX idx_usage_events_tenant_time ON usage_events(tenant_id, recorded_at DESC);
CREATE INDEX idx_usage_events_metric_time ON usage_events(metric_type, recorded_at DESC);

-- Storage usage tracking (updated asynchronously)
CREATE TABLE storage_usage (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  total_bytes BIGINT NOT NULL DEFAULT 0,
  file_count INTEGER NOT NULL DEFAULT 0,
  last_calculated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 4. Usage Recording

### Real-Time Recording (Redis + Async Persistence)

```typescript
// src/usage/record-usage.ts
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

/**
 * Record a usage event in Redis (real-time) and queue for DB persistence.
 * Redis is the source of truth for rate limiting.
 * PostgreSQL is the source of truth for billing and reporting.
 */
export async function recordUsage(
  tenantId: string,
  metricType: string,
  quantity: number = 1,
  metadata?: Record<string, unknown>
) {
  const now = new Date();
  const hourKey = formatHourKey(now);
  const dayKey = formatDayKey(now);
  const monthKey = formatMonthKey(now);

  // Increment Redis counters (for real-time rate limiting and display)
  const pipeline = redis.pipeline();
  pipeline.hincrby(`usage:${tenantId}:hour:${hourKey}`, metricType, quantity);
  pipeline.expire(`usage:${tenantId}:hour:${hourKey}`, 7200); // 2 hours TTL
  pipeline.hincrby(`usage:${tenantId}:day:${dayKey}`, metricType, quantity);
  pipeline.expire(`usage:${tenantId}:day:${dayKey}`, 172800); // 2 days TTL
  pipeline.hincrby(`usage:${tenantId}:month:${monthKey}`, metricType, quantity);
  pipeline.expire(`usage:${tenantId}:month:${monthKey}`, 5184000); // 60 days TTL
  await pipeline.exec();

  // Queue for async DB persistence (don't block the request)
  await enqueueUsageEvent({
    tenantId,
    metricType,
    quantity,
    metadata,
    recordedAt: now,
  });
}

/**
 * Get current usage count from Redis (fast, for rate limiting and display).
 */
export async function getCurrentUsage(
  tenantId: string,
  metricType: string,
  window: "hour" | "day" | "month"
): Promise<number> {
  const now = new Date();
  let key: string;

  switch (window) {
    case "hour":
      key = `usage:${tenantId}:hour:${formatHourKey(now)}`;
      break;
    case "day":
      key = `usage:${tenantId}:day:${formatDayKey(now)}`;
      break;
    case "month":
      key = `usage:${tenantId}:month:${formatMonthKey(now)}`;
      break;
  }

  const value = await redis.hget(key, metricType);
  return parseInt(value ?? "0", 10);
}

// Helper formatters
function formatHourKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}`;
}
function formatDayKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}
function formatMonthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}
function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
```

### Batch Persistence (Cron Job)

```typescript
// src/usage/persist-usage.ts
// Runs every 5 minutes via cron — flushes Redis counters to PostgreSQL

export async function persistUsageToDB() {
  const tenantIds = await getAllActiveTenantIds();

  for (const tenantId of tenantIds) {
    const now = new Date();
    const hourKey = formatHourKey(now);
    const periodStart = getHourStart(now);
    const periodEnd = getHourEnd(now);

    // Get all metrics for this tenant's current hour
    const metrics = await redis.hgetall(`usage:${tenantId}:hour:${hourKey}`);

    for (const [metricType, quantity] of Object.entries(metrics)) {
      await db.insert(usageRecords)
        .values({
          tenantId,
          metricType,
          quantity: parseInt(quantity, 10),
          periodStart,
          periodEnd,
        })
        .onConflictDoUpdate({
          target: [usageRecords.tenantId, usageRecords.metricType, usageRecords.periodStart, usageRecords.periodEnd],
          set: {
            quantity: parseInt(quantity, 10),
            updatedAt: new Date(),
          },
        });
    }
  }
}
```

---

## 5. Overage Handling Strategies

| Strategy | When to Use | Implementation |
|----------|------------|----------------|
| **Hard Limit (Block)** | Free tier, abuse prevention | Return 429 after limit reached |
| **Soft Limit (Charge)** | Usage-based billing, metered plans | Allow overage, charge on next invoice |
| **Warning (Notify)** | Pro/Business tiers | Allow usage, send email at 80%/90%/100% |
| **Throttle (Slow)** | API-heavy products | Reduce rate limit instead of blocking |

### Hard Limit Implementation

```typescript
// Already covered by rate limiting middleware above
// Returns 429 when limit is reached
```

### Soft Limit (Overage Billing) Implementation

```typescript
// src/usage/overage.ts
export async function checkAndRecordOverage(
  tenantId: string,
  metricType: string,
  quantity: number
) {
  const tenant = await getCachedTenant(tenantId);
  const limits = getPlanRateLimits(tenant.plan);
  const currentUsage = await getCurrentUsage(tenantId, metricType, "month");

  const limit = getMetricLimit(limits, metricType);
  const newTotal = currentUsage + quantity;

  if (newTotal > limit && isFinite(limit)) {
    const overage = newTotal - limit;
    const overageRate = getOverageRate(metricType);

    // Record overage for billing
    await db.insert(overageRecords).values({
      tenantId,
      metricType,
      quantity: overage,
      ratePerUnit: overageRate,
      totalCents: overage * overageRate,
      billingPeriod: getCurrentBillingPeriod(tenantId),
    });

    // Report to Stripe metered billing
    await reportUsageToStripe(tenantId, overage);
  }

  // Always allow the request (soft limit)
  await recordUsage(tenantId, metricType, quantity);
}
```

### Warning Threshold Notifications

```typescript
// src/usage/threshold-alerts.ts
const THRESHOLDS = [0.8, 0.9, 1.0]; // 80%, 90%, 100%

export async function checkUsageThresholds(
  tenantId: string,
  metricType: string
) {
  const tenant = await getCachedTenant(tenantId);
  const limits = getPlanRateLimits(tenant.plan);
  const currentUsage = await getCurrentUsage(tenantId, metricType, "month");
  const limit = getMetricLimit(limits, metricType);

  if (!isFinite(limit)) return; // Enterprise — no limits

  const usagePercent = currentUsage / limit;

  for (const threshold of THRESHOLDS) {
    if (usagePercent >= threshold) {
      // Check if we already notified for this threshold this period
      const alreadyNotified = await redis.get(
        `notified:${tenantId}:${metricType}:${threshold}:${getCurrentPeriodKey()}`
      );

      if (!alreadyNotified) {
        await sendUsageAlert(tenantId, metricType, currentUsage, limit, threshold);
        await redis.set(
          `notified:${tenantId}:${metricType}:${threshold}:${getCurrentPeriodKey()}`,
          "1",
          "EX",
          86400 * 35 // 35 days TTL
        );
      }
    }
  }
}

async function sendUsageAlert(
  tenantId: string,
  metricType: string,
  current: number,
  limit: number,
  threshold: number
) {
  const tenantAdmin = await getTenantAdminEmail(tenantId);
  const percentLabel = `${Math.round(threshold * 100)}%`;

  await sendEmail({
    to: tenantAdmin,
    template: "usage-threshold",
    data: {
      metricType: humanizeMetric(metricType),
      currentUsage: formatNumber(current),
      limit: formatNumber(limit),
      percentUsed: percentLabel,
      upgradeUrl: "/settings/billing",
    },
  });
}
```

---

## 6. Usage Dashboard API

Expose usage data for tenant self-service dashboards.

```typescript
// src/routes/usage.ts

// GET /api/usage/summary
export async function getUsageSummary(req: Request, res: Response) {
  const tenantId = getCurrentTenantId();
  const tenant = await getCachedTenant(tenantId);
  const limits = getPlanRateLimits(tenant.plan);

  const [apiUsage, aiUsage, storageUsage] = await Promise.all([
    getCurrentUsage(tenantId, "api_calls", "month"),
    getCurrentUsage(tenantId, "ai_requests", "month"),
    getStorageUsage(tenantId),
  ]);

  res.json({
    plan: tenant.plan,
    period: getCurrentBillingPeriod(tenantId),
    metrics: {
      api_calls: {
        current: apiUsage,
        limit: limits.apiRequestsPerHour * 24 * 30, // Monthly approximation
        unit: "requests",
      },
      ai_requests: {
        current: aiUsage,
        limit: limits.aiRequestsPerDay * 30,
        unit: "requests",
      },
      storage: {
        current: storageUsage,
        limit: limits.storageBytes,
        unit: "bytes",
      },
      seats: {
        current: await getActiveSeatCount(tenantId),
        limit: limits.seats,
        unit: "users",
      },
    },
  });
}

// GET /api/usage/history?metric=api_calls&days=30
export async function getUsageHistory(req: Request, res: Response) {
  const tenantId = getCurrentTenantId();
  const { metric, days = 30 } = req.query;

  const history = await db.select({
    date: sql`DATE(period_start)`,
    total: sql`SUM(quantity)`,
  })
    .from(usageRecords)
    .where(
      and(
        eq(usageRecords.tenantId, tenantId),
        eq(usageRecords.metricType, metric as string),
        gte(usageRecords.periodStart, subDays(new Date(), Number(days)))
      )
    )
    .groupBy(sql`DATE(period_start)`)
    .orderBy(sql`DATE(period_start)`);

  res.json({ metric, days, history });
}
```

---

## 7. Stripe Metered Billing Integration

For usage-based billing, report aggregated usage to Stripe at the end of each billing period.

```typescript
// src/billing/report-metered-usage.ts
// Runs daily via cron

export async function reportDailyUsageToStripe() {
  const tenants = await getTenantsWithMeteredBilling();

  for (const tenant of tenants) {
    const subscription = await getActiveStripeSubscription(tenant.id);
    if (!subscription) continue;

    const meteredItems = subscription.items.data.filter(
      (item) => item.price.recurring?.usage_type === "metered"
    );

    for (const item of meteredItems) {
      const metricType = getMetricTypeFromPrice(item.price.id);
      const usage = await getCurrentUsage(tenant.id, metricType, "day");

      if (usage > 0) {
        await stripe.subscriptionItems.createUsageRecord(item.id, {
          quantity: usage,
          timestamp: Math.floor(Date.now() / 1000),
          action: "set", // 'set' for absolute, 'increment' for delta
        });
      }
    }
  }
}
```

---

## 8. Storage Usage Tracking

Storage is different from request-based metrics — it is cumulative, not per-period.

```typescript
// src/usage/storage-tracker.ts

export async function trackStorageChange(
  tenantId: string,
  byteDelta: number // positive for upload, negative for delete
) {
  // Atomic update in database
  await db.execute(sql`
    INSERT INTO storage_usage (tenant_id, total_bytes, file_count, last_calculated_at)
    VALUES (${tenantId}, ${Math.max(0, byteDelta)}, ${byteDelta > 0 ? 1 : -1}, NOW())
    ON CONFLICT (tenant_id) DO UPDATE SET
      total_bytes = GREATEST(0, storage_usage.total_bytes + ${byteDelta}),
      file_count = GREATEST(0, storage_usage.file_count + ${byteDelta > 0 ? 1 : -1}),
      last_calculated_at = NOW()
  `);

  // Update Redis for fast reads
  await redis.hincrby(`storage:${tenantId}`, "total_bytes", byteDelta);
}

export async function checkStorageLimit(tenantId: string, uploadBytes: number): Promise<boolean> {
  const tenant = await getCachedTenant(tenantId);
  const limits = getPlanRateLimits(tenant.plan);
  const currentStorage = await getStorageUsage(tenantId);

  return (currentStorage + uploadBytes) <= limits.storageBytes;
}

// Periodic reconciliation cron (weekly)
export async function reconcileStorageUsage() {
  // Recalculate actual storage from file records
  const actuals = await db.execute(sql`
    SELECT tenant_id, SUM(file_size) as total_bytes, COUNT(*) as file_count
    FROM files
    WHERE deleted_at IS NULL
    GROUP BY tenant_id
  `);

  for (const row of actuals.rows) {
    await db.update(storageUsage)
      .set({
        totalBytes: row.total_bytes,
        fileCount: row.file_count,
        lastCalculatedAt: new Date(),
      })
      .where(eq(storageUsage.tenantId, row.tenant_id));
  }
}
```

---

## 9. Checklist

- [ ] Rate limit tiers defined per plan
- [ ] Redis-based rate limiter deployed and tested
- [ ] Rate limit headers returned on every API response
- [ ] 429 responses include `Retry-After` header and upgrade CTA
- [ ] Usage tracking records events in Redis (real-time) and PostgreSQL (persistent)
- [ ] Batch persistence cron running every 5 minutes
- [ ] Overage strategy chosen: hard limit, soft limit, or warning
- [ ] Threshold notifications at 80%, 90%, 100% of limits
- [ ] Usage dashboard API available for tenant self-service
- [ ] Storage usage tracked separately with reconciliation cron
- [ ] Stripe metered billing integration (if usage-based pricing)
- [ ] Enterprise tenants bypass rate limits or have custom limits
- [ ] Rate limiting tested under load with multiple concurrent tenants
- [ ] Usage data retained for billing dispute resolution (90+ days)
