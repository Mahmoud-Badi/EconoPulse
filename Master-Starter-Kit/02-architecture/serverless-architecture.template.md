# Serverless & Edge Architecture — {{PROJECT_NAME}}

## Architecture Decision

<!-- Fill based on intake answers -->

| Factor | Your Project | Recommendation |
|--------|-------------|----------------|
| Cold start tolerance | {{COLD_START_TOLERANCE}} | |
| Database connections | {{DB_CONNECTION_PATTERN}} | |
| Response time target | {{RESPONSE_TIME_TARGET}} | |
| Compute duration | {{AVG_FUNCTION_DURATION}} | |
| Deployment target | {{HOSTING_PROVIDER}} | |

### Decision Tree

```
Is your compute < 30 seconds per request?
├─ YES → Are you on Vercel, Netlify, or Cloudflare?
│   ├─ YES → Serverless-first architecture ✓
│   │   └─ Do you need WebSockets or long-polling?
│   │       ├─ YES → Hybrid: serverless + edge + dedicated WebSocket service
│   │       └─ NO → Pure serverless
│   └─ NO → Container-based (Docker/K8s)
└─ NO → Container-based (Docker/K8s)
```

## Serverless Patterns

### API Routes

<!-- IF {{FRONTEND_FRAMEWORK}} == "Next.js" -->
```
app/
  api/
    {service}/
      route.ts          → Serverless function per route file
      [id]/route.ts     → Dynamic routes
```

**Key constraints:**
- Max execution time: 10s (Hobby) / 60s (Pro) on Vercel
- Max payload: 4.5MB request / 4.5MB response
- No persistent connections (WebSocket, SSE need Edge Runtime or separate service)
<!-- ENDIF -->

### Database Connection Pooling

Serverless functions create new database connections on every cold start. Without pooling, this exhausts the connection limit fast.

| Solution | When to Use | Setup |
|----------|-------------|-------|
| **Neon Serverless Driver** | PostgreSQL on Neon | `@neondatabase/serverless` — uses HTTP, no TCP connection |
| **PlanetScale Serverless** | MySQL on PlanetScale | `@planetscale/database` — HTTP-based driver |
| **Supabase Pooler** | PostgreSQL on Supabase | Use `?pgbouncer=true` connection string |
| **PgBouncer** | Self-hosted PostgreSQL | Deploy PgBouncer as sidecar or managed service |
| **Prisma Accelerate** | Any database with Prisma | Managed connection pooling proxy |

**Recommended pattern:**
```typescript
// Use connection pooling in serverless, direct in development
const connectionString = process.env.NODE_ENV === 'production'
  ? process.env.DATABASE_URL_POOLED  // Pooled connection
  : process.env.DATABASE_URL;         // Direct connection
```

### Cold Start Mitigation

| Strategy | Effort | Impact |
|----------|--------|--------|
| Keep functions small (< 50KB) | Low | High — faster initialization |
| Avoid heavy imports at top level | Low | Medium — tree-shake aggressively |
| Use edge runtime for lightweight routes | Low | High — near-zero cold start |
| Provisioned concurrency (AWS) | Medium | High — eliminates cold starts |
| Cron pinger (keep warm) | Low | Low — only helps one instance |

### Edge Functions vs Serverless Functions

| | Edge Functions | Serverless Functions |
|---|---|---|
| **Cold start** | < 5ms | 50-500ms |
| **Runtime** | V8 isolates (limited Node.js APIs) | Full Node.js |
| **Max duration** | 30s | 10-300s |
| **Database** | HTTP-only drivers | TCP + HTTP drivers |
| **Use cases** | Auth, redirects, A/B tests, headers | Business logic, CRUD, heavy computation |

### Caching Strategy

```
Request → Edge Cache (CDN) → Serverless Function → Database
         ↑ Cache HIT         ↑ Only on MISS
         (< 10ms)            (50-200ms)
```

| Cache Layer | Tool | TTL | Invalidation |
|-------------|------|-----|-------------|
| CDN/Edge | Vercel Edge Cache, Cloudflare Cache | 60-3600s | `revalidateTag()` or `revalidatePath()` |
| Application | Upstash Redis | 30-300s | On mutation |
| Database | Query-level caching | 10-60s | On write |

## Infrastructure Template

### Environment Variables

```env
# Serverless-specific
DATABASE_URL_POOLED={{DATABASE_URL_POOLED}}
EDGE_CONFIG={{EDGE_CONFIG_URL}}
SERVERLESS_TIMEOUT={{SERVERLESS_TIMEOUT_MS}}

# Feature flags for serverless optimization
USE_EDGE_RUNTIME={{USE_EDGE_RUNTIME}}
ENABLE_ISR={{ENABLE_ISR}}
ISR_REVALIDATE_SECONDS={{ISR_REVALIDATE_SECONDS}}
```

### Function Size Budget

| Function | Max Size | Reason |
|----------|----------|--------|
| API routes | 50KB | Fast cold start |
| Auth middleware | 20KB | Runs on every request |
| Webhooks | 100KB | May need heavy parsing |
| Cron jobs | 250KB | Run on schedule, cold start less critical |

## When NOT to Use Serverless

- **WebSocket-heavy apps** (chat, multiplayer games) → Use a dedicated server
- **Long-running jobs** (> 5 min) → Use a queue + worker (BullMQ, Inngest)
- **High-throughput internal APIs** → Container-to-container is cheaper
- **GPU compute** (ML inference) → Use dedicated GPU instances
- **Stateful services** (in-memory cache, connection pools) → Containers
