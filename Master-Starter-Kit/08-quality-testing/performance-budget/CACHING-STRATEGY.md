# Caching Strategy

## Overview

Caching operates at multiple layers. Each layer serves a different purpose and has different invalidation characteristics.

---

## Cache Layers

```
User's Browser
    ↓ (HTTP Cache Headers)
CDN / Edge Cache
    ↓ (Cache-Control, stale-while-revalidate)
Application Cache (React Query / SWR)
    ↓ (staleTime, gcTime, invalidation)
Server Cache (Redis / In-Memory)
    ↓ (TTL, key-based invalidation)
Database (Query Cache, Connection Pool)
```

---

## Layer 1: Client-Side Cache (React Query / SWR)

### Configuration

| Setting | Recommended Value | Purpose |
|---------|------------------|---------|
| **staleTime** | 30s-5min (varies by data) | How long data is considered fresh |
| **gcTime** | 10-30min | How long inactive data stays in memory |
| **refetchOnWindowFocus** | true | Refresh when user returns to tab |
| **refetchOnReconnect** | true | Refresh after network recovery |
| **retry** | 3 | Retry failed requests |

### Cache Time by Data Type

| Data Type | staleTime | gcTime | Rationale |
|-----------|-----------|--------|-----------|
| User session/profile | 5min | 30min | Rarely changes, important to cache |
| List views (tables) | 30s | 10min | Users expect fresh data in lists |
| Detail views | 1min | 15min | Single record, moderate staleness OK |
| Dashboard metrics | 1min | 10min | Numbers should feel current |
| Static reference data | 30min | 60min | Lookup tables, enums, rarely change |
| Search results | 0 (always fresh) | 5min | Search should always reflect current data |

### Invalidation Strategy

```typescript
// After mutation, invalidate related queries:
const mutation = useMutation({
  mutationFn: createItem,
  onSuccess: () => {
    // Invalidate the list (triggers refetch)
    queryClient.invalidateQueries({ queryKey: ["items"] });
    // Optionally invalidate related queries
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  },
});
```

**Rules:**
- Every mutation MUST invalidate affected queries
- Prefer `invalidateQueries` over manual cache updates (safer)
- Use optimistic updates only for frequently-updated UI (like toggles)

---

## Layer 2: Server Cache (Redis)

### Cache Key Convention

```
{tenant}:{resource}:{identifier}:{variant}
```

Examples:
- `tenant-123:users:list:page-1` — Paginated user list
- `tenant-123:dashboard:metrics:daily` — Dashboard metrics
- `global:config:feature-flags` — Feature flags (not tenant-specific)

### TTL Guidelines

| Data Type | TTL | Purpose |
|-----------|-----|---------|
| Session data | 30 min | User sessions |
| API response cache | 60s | Reduce DB load |
| Computed aggregations | 5min | Dashboard metrics |
| Reference data | 1hr | Lookup tables |
| Feature flags | 5min | Config changes |
| Rate limit counters | Matches rate window | Rate limiting |

### Invalidation

| Strategy | When to Use |
|----------|------------|
| **TTL expiry** | Default — data naturally expires |
| **Explicit delete** | After write operations — `await redis.del(key)` |
| **Pattern delete** | After bulk changes — `await redis.del("tenant-123:items:*")` |
| **Pub/Sub** | Multi-instance — broadcast invalidation to all servers |

---

## Layer 3: HTTP Cache Headers

### Static Assets (JS, CSS, Images, Fonts)

```
Cache-Control: public, max-age=31536000, immutable
```
- Cached for 1 year (hash in filename handles versioning)

### API Responses (Dynamic Data)

```
Cache-Control: private, no-cache, must-revalidate
```
- Not cached by CDN, browser must revalidate

### API Responses (Semi-Static)

```
Cache-Control: public, max-age=60, stale-while-revalidate=300
```
- CDN caches for 60s, serves stale for 5min while revalidating

---

## Multi-Tenant Cache Isolation

**Critical:** Tenant data must NEVER leak between tenants via cache.

| Rule | Implementation |
|------|---------------|
| Tenant ID in cache key | Always prefix with tenant ID |
| No shared data cache | Even "common" data gets tenant-scoped keys |
| Cache clear on tenant switch | If user switches tenant context, clear client cache |
| Audit cache keys | Regular grep for cache keys without tenant prefix |

---

## Cache Warming

For data that's expensive to compute and accessed frequently:

| Strategy | Implementation |
|----------|---------------|
| **On deploy** | Warm critical caches after deployment |
| **On login** | Pre-fetch user's dashboard data |
| **On schedule** | Cron job refreshes aggregation caches every 5min |
| **On demand** | First request triggers cache population |
