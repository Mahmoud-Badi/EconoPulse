# {{PROJECT_NAME}} — Cloud Functions Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **Platform:** {{CLOUD_FUNCTIONS_PROVIDER}} (Lambda / Workers / Cloud Functions / Edge Functions)
> **Last Updated:** {{DATE}}

---

## 1. Platform Selection

| Factor | AWS Lambda | Cloudflare Workers | Vercel Functions | Google Cloud Functions | Supabase Edge Functions |
|--------|-----------|-------------------|-----------------|----------------------|------------------------|
| **Runtime** | Node, Python, Go, Java, .NET | V8 isolates (JS/TS/Wasm) | Node.js (Serverless) | Node, Python, Go, Java | Deno (TypeScript) |
| **Cold start** | 100ms–2s | ~0ms (no cold start) | ~250ms | 100ms–1s | ~100ms |
| **Execution limit** | 15 min | 30s (free), 15 min (paid) | 10s (Hobby), 60s (Pro) | 9 min (HTTP), 60 min (event) | 150s |
| **Memory** | 128 MB – 10 GB | 128 MB | 1 GB (Hobby), 3 GB (Pro) | 128 MB – 32 GB | 150 MB |
| **Free tier** | 1M requests/month | 100K requests/day | 100K invocations/month | 2M invocations/month | 500K invocations/month |
| **Pricing** | $0.20/1M requests | $0.50/1M requests | Included in plan | $0.40/1M requests | Included in plan |
| **Best for** | Complex processing, AWS ecosystem | Edge logic, low latency, global | Next.js API routes | GCP ecosystem | Supabase projects |

**Decision:** {{CLOUD_FUNCTIONS_PROVIDER}}
**Rationale:** {{CLOUD_FUNCTIONS_RATIONALE}}

---

## 2. Use Cases for Cloud Functions in Integrations

| Use Case | Function Type | Trigger | Duration |
|----------|--------------|---------|----------|
| Webhook processing | HTTP | Incoming webhook POST | 1–30s |
| Image resize after upload | Event | S3/R2 upload event | 5–60s |
| Scheduled data sync | Cron | Timer (every N minutes) | 10s–5min |
| Email sending | Queue | SQS/queue message | 1–10s |
| PDF generation | HTTP | API request | 5–30s |
| Data transformation | Event | Database change stream | 1–10s |
| Auth token verification | HTTP (middleware) | Every API request | < 50ms |

---

## 3. Cold Start Mitigation

### The Problem

Serverless functions that haven't been invoked recently must initialize their runtime environment (load code, connect to databases, etc.) before handling the request. This "cold start" adds latency.

### Mitigation Strategies

| Strategy | Description | Provider Support |
|----------|-------------|-----------------|
| **Provisioned concurrency** | Keep N instances warm | Lambda ($$), GCF (min instances) |
| **Cron ping** | Invoke function every 5 minutes | All (hacky but works) |
| **Edge runtime** | V8 isolates, no cold starts | Workers, Vercel Edge |
| **Smaller bundles** | Less code = faster cold start | All |
| **Lazy initialization** | Initialize DB connections outside handler | All |

### Cold Start Impact by Language

| Language | Cold Start (typical) | Notes |
|----------|---------------------|-------|
| Node.js | 100–500ms | Good for most use cases |
| Python | 200–800ms | Acceptable |
| Go | 50–200ms | Fast compiled binary |
| Java | 1–5s | Slow, use GraalVM or avoid for latency-sensitive |
| Deno | 50–200ms | Fast, similar to Go |
| V8 isolates (Workers) | ~0ms | No cold start |

---

## 4. Function Architecture Patterns

### Single Responsibility

Each function does one thing:

```
functions/
  ├─ process-stripe-webhook.ts    ← Stripe webhook handler
  ├─ process-shopify-webhook.ts   ← Shopify webhook handler
  ├─ resize-image.ts              ← Image processing
  ├─ send-email.ts                ← Email sending
  └─ sync-crm.ts                  ← CRM data sync
```

### Shared Code

| Approach | Pros | Cons |
|----------|------|------|
| **Lambda layers** | Shared across functions, versioned | AWS-specific, deployment complexity |
| **Monorepo packages** | Standard npm packages | Bundled into each function |
| **Shared utilities** | Simple imports | Increases bundle size |

### Function Configuration

| Function | Memory | Timeout | Concurrency | Environment |
|----------|--------|---------|-------------|-------------|
| `process-stripe-webhook` | 256 MB | 30s | 100 | `STRIPE_WEBHOOK_SECRET` |
| `resize-image` | 1024 MB | 60s | 50 | `STORAGE_BUCKET` |
| `send-email` | 256 MB | 10s | 25 | `SENDGRID_API_KEY` |
| `sync-crm` | 512 MB | 300s | 10 | `CRM_ACCESS_TOKEN` |

---

## 5. Deployment

### Deployment Strategies

| Strategy | Description | Rollback |
|----------|-------------|----------|
| **Direct deploy** | Upload new code, immediate switch | Redeploy previous version |
| **Alias/traffic shifting** | Gradually shift traffic (10% → 50% → 100%) | Shift traffic back |
| **Blue/green** | Deploy to new version, switch alias | Switch alias back |
| **Canary** | Send small % of traffic to new version | Remove canary |

### Infrastructure as Code

| Tool | Provider | Description |
|------|----------|-------------|
| **Serverless Framework** | Multi-cloud | YAML-based, plugin ecosystem |
| **SST (Serverless Stack)** | AWS | TypeScript-first, great DX |
| **Terraform** | Multi-cloud | Industry standard IaC |
| **Pulumi** | Multi-cloud | Programming language IaC |
| **Wrangler** | Cloudflare | Workers-specific CLI |
| **Vercel CLI** | Vercel | Built into Vercel deployment |

---

## 6. Monitoring & Observability

### Key Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|----------------|
| Invocations | Total function calls | Unexpected spikes/drops |
| Duration (P50, P95, P99) | Execution time | P95 > timeout × 0.8 |
| Errors | Failed invocations | > 1% error rate |
| Cold starts | % of invocations with cold start | > 20% |
| Concurrent executions | Active instances | > 80% of limit |
| Throttles | Requests rejected due to concurrency limit | > 0 |
| Cost | Daily/monthly function costs | > budget threshold |

### Logging

```
Structured log entry:
{
  "level": "info",
  "function": "process-stripe-webhook",
  "requestId": "abc-123",
  "event": "webhook.processed",
  "provider": "stripe",
  "eventType": "payment_intent.succeeded",
  "duration_ms": 234,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 7. Security

- [ ] Function permissions follow least privilege (only access needed resources)
- [ ] Secrets stored in environment variables (not in code)
- [ ] API Gateway or equivalent authenticates incoming requests
- [ ] VPC configuration if functions need database access (adds cold start latency)
- [ ] Function URLs protected (not publicly accessible unless intentional)
- [ ] Dependency scanning for vulnerabilities (npm audit, Snyk)
- [ ] Execution role cannot be assumed by external entities
