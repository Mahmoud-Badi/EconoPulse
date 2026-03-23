# {{PROJECT_NAME}} — Job Queue Architecture

> **Owner:** {{LEAD_DEVELOPER}}
> **Queue Provider:** {{QUEUE_PROVIDER}}
> **Redis URL:** {{QUEUE_REDIS_URL}}
> **Worker Concurrency:** {{QUEUE_CONCURRENCY}}
> **Dashboard Enabled:** {{QUEUE_DASHBOARD_ENABLED}}
> **Last Updated:** {{DATE}}

---

## 1. When to Use Job Queues for Integrations

Move integration work to a job queue when:
- The API call is slow (> 2 seconds) and the user shouldn't wait
- The operation can be retried independently (email sending, webhook processing)
- You need rate limiting (process at the provider's allowed rate)
- The operation is part of a batch (sync 1000 CRM records)
- Failure shouldn't fail the user's request (analytics, logging, notifications)

**Do not use a queue when:**
- The user needs the result immediately (auth verification, payment authorization)
- The operation is fast and unlikely to fail (< 200ms, < 1% error rate)
- You're adding complexity for no measurable benefit

---

## 2. Queue Provider Selection

| Provider | Language | Redis Required | Features | Best For |
|----------|----------|---------------|----------|----------|
| **BullMQ** | Node.js/TS | Yes | Priority, rate limiting, delayed jobs, sandboxed workers | Most Node.js projects |
| **Bull** | Node.js | Yes | Mature, widely used, predecessor to BullMQ | Legacy Node.js |
| **AWS SQS** | Any | No | Managed, highly scalable, FIFO support | AWS-native, serverless |
| **RabbitMQ** | Any | No | Routing, exchanges, dead letter, management UI | Complex routing needs |
| **Celery** | Python | Redis or RabbitMQ | Task scheduling, canvas workflows | Python projects |
| **Sidekiq** | Ruby | Yes | Battle-tested, commercial pro version | Ruby/Rails |
| **Inngest** | Any (serverless) | No | Managed, step functions, fan-out | Serverless architectures |
| **Trigger.dev** | Node.js/TS | No | Managed, long-running, integrations built-in | Complex integration workflows |

### Decision: {{QUEUE_PROVIDER}}

**Rationale:** {{QUEUE_PROVIDER_RATIONALE}}

---

## 3. Queue Architecture

### Queue Topology

```
┌─────────────────────────────────────────────────┐
│ Application Server                                │
│                                                   │
│  User Request → API Handler → Enqueue Job ──────────┐
│                     │                               │
│                     └─ Return 202 Accepted          │
└─────────────────────────────────────────────────┘  │
                                                      │
┌─────────────────────────────────────────────────┐  │
│ Redis / Message Broker                            │←─┘
│                                                   │
│  Queue: integration-email     [■■■■□□□□□□]       │
│  Queue: integration-webhook   [■■□□□□□□□□]       │
│  Queue: integration-sync      [■■■■■■■□□□]       │
│  Queue: integration-low       [■□□□□□□□□□]       │
│  DLQ:   dead-letter           [■□□□□□□□□□]       │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│ Worker Processes                                  │
│                                                   │
│  Worker 1: email     (concurrency: 5)            │
│  Worker 2: webhook   (concurrency: 10)           │
│  Worker 3: sync      (concurrency: 3)            │
│  Worker 4: low       (concurrency: 2)            │
└─────────────────────────────────────────────────┘
```

### Queue Design Decisions

**Single queue vs. multiple queues:**
- Use **separate queues** when different job types have different priorities, concurrency needs, or retry policies
- Use a **single queue** only for simple applications with uniform job characteristics

**Shared workers vs. dedicated workers:**
- **Dedicated workers** per queue: better isolation, easier to scale independently
- **Shared workers** processing multiple queues: simpler deployment, fewer processes

---

## 4. Job Type Registry

| Job Name | Queue | Handler | Priority | Timeout | Max Retries | Backoff | Rate Limit |
|----------|-------|---------|----------|---------|-------------|---------|------------|
| `send-email` | `integration-email` | `handleSendEmail` | High | 30s | 3 | Exponential | 10/s |
| `process-webhook` | `integration-webhook` | `handleWebhookEvent` | High | 60s | 5 | Exponential | — |
| `sync-crm-contact` | `integration-sync` | `handleCrmSync` | Medium | 120s | 3 | Exponential | 2/s |
| `generate-report` | `integration-low` | `handleReportGen` | Low | 300s | 2 | Fixed (60s) | 1/s |
| `send-analytics` | `integration-low` | `handleAnalytics` | Low | 10s | 1 | — | 50/s |

### Job Payload Schema

Each job type should have a documented payload schema:

```
Job: send-email
Payload: {
  to: string (email address)
  subject: string
  templateId: string
  templateData: Record<string, any>
  replyTo?: string
  attachments?: Array<{ filename, content, type }>
  idempotencyKey: string (UUID — prevents duplicate sends)
}
```

---

## 5. Retry & Error Handling

### Retry Strategy per Job Type

| Job Type | Retryable Errors | Non-Retryable Errors | Max Retries | Final Action |
|----------|-----------------|---------------------|-------------|-------------|
| `send-email` | Timeout, 429, 500-503 | 400 (bad address), 401 | 3 | DLQ + alert |
| `process-webhook` | Timeout, handler error | Signature invalid | 5 | DLQ + alert |
| `sync-crm-contact` | Timeout, 429, 500 | 404 (contact deleted), 401 | 3 | DLQ |
| `generate-report` | Timeout | Any non-transient | 2 | DLQ + notify user |

### Dead Letter Queue

Jobs that exhaust all retries move to the DLQ:

```
DLQ Entry:
  - Original job payload
  - Queue name
  - Job type
  - All attempt timestamps and errors
  - Total attempts
  - Final error message and stack trace
```

### DLQ Processing

| Action | Trigger | Description |
|--------|---------|-------------|
| **Alert** | Any DLQ entry | Notify team via {{HEALTH_ALERT_CHANNEL}} |
| **Manual review** | Daily | Review DLQ entries, categorize failures |
| **Retry** | After root cause fixed | Move job back to original queue |
| **Discard** | Stale or irrelevant | Delete from DLQ with reason logged |
| **Purge** | Older than {{WEBHOOK_DLQ_RETENTION_DAYS}} days | Auto-delete expired entries |

---

## 6. Rate-Limited Queue Processing

When the downstream integration has rate limits, configure the queue to drain at the provider's allowed rate:

### BullMQ Rate Limiter

```
Configuration:
  limiter:
    max: 10        (max jobs per duration)
    duration: 1000 (milliseconds)

  → Processes max 10 jobs per second, regardless of worker count
```

### Per-Provider Rate Limits

| Provider | Allowed Rate | Queue Rate Limit | Buffer |
|----------|-------------|-----------------|--------|
| SendGrid | 100 req/s | 80 req/s | 20% safety margin |
| Stripe | 100 req/s | 80 req/s | 20% safety margin |
| Shopify | 2 req/s | 1.5 req/s | 25% safety margin |
| Slack | 1 req/s (per method) | 0.8 req/s | 20% safety margin |

**Always set queue drain rate below the provider's limit** — leave a buffer for non-queued requests (health checks, real-time operations).

---

## 7. Job Scheduling

### Delayed Jobs

Schedule jobs to run at a specific time:

| Use Case | Delay | Example |
|----------|-------|---------|
| Retry after rate limit | `Retry-After` header value | 30s–300s |
| Send scheduled email | Fixed future time | "Send at 9am user's timezone" |
| Sync after cooldown | Fixed delay | "Wait 5 minutes after webhook, then sync" |
| Reminder notification | Calculated delay | "Send reminder 24h before event" |

### Recurring Jobs (Cron)

| Job | Schedule | Purpose |
|-----|----------|---------|
| `sync-crm-full` | `0 2 * * *` (2am daily) | Full CRM data sync |
| `check-api-health` | `*/5 * * * *` (every 5 min) | Active health probes |
| `rotate-api-metrics` | `0 0 * * 0` (weekly) | Aggregate and archive metrics |
| `verify-webhook-subscriptions` | `0 0 1 * *` (monthly) | Ensure webhooks still registered |

---

## 8. Observability

### Dashboard (Bull Board / Arena)

If `{{QUEUE_DASHBOARD_ENABLED}}` is true, deploy a queue management UI:

| Tool | Provider | Features |
|------|----------|----------|
| **Bull Board** | BullMQ/Bull | Queue stats, job inspection, retry/remove jobs |
| **Arena** | Bull | Similar to Bull Board, different UI |
| **Flower** | Celery | Real-time monitoring, task history |
| **Sidekiq Web** | Sidekiq | Dashboard, retry, scheduled jobs |

**Security:** Queue dashboards expose job payloads (which may contain PII). Protect with authentication and restrict to internal networks.

### Metrics to Monitor

| Metric | Description | Alert Threshold |
|--------|-------------|----------------|
| Queue depth | Jobs waiting to be processed | > 1000 (processing falling behind) |
| Processing time (P95) | Time from enqueue to completion | > 2x expected |
| Failure rate | % of jobs that fail | > 5% |
| DLQ depth | Jobs in dead letter queue | > 0 (always investigate) |
| Worker utilization | % of concurrency slots in use | > 90% (need more workers) |
| Job age | Time oldest job has been waiting | > 5 minutes (backlog) |
| Throughput | Jobs processed per minute | Below expected range |

### Logging

Each job should log:
- Job ID, type, queue name (on start)
- Key payload fields (not full payload — may contain PII)
- Duration (on completion)
- Error message and attempt number (on failure)
- DLQ reason (on final failure)

---

## 9. Scaling

### Horizontal Scaling

```
Scale workers independently from application servers:

Application Servers (handle HTTP):    2-4 instances
Worker Processes (process jobs):      Variable per queue

Queue          | Min Workers | Max Workers | Scale Trigger
email          | 1           | 5           | Queue depth > 100
webhook        | 2           | 10          | Queue depth > 50
sync           | 1           | 3           | Queue depth > 500
low-priority   | 1           | 2           | Queue depth > 1000
```

### Auto-Scaling Triggers

| Metric | Scale Up | Scale Down |
|--------|----------|-----------|
| Queue depth | > threshold for 2 min | < 10% threshold for 5 min |
| Processing latency | P95 > 2x target | P95 < target for 10 min |
| Worker CPU | > 80% for 3 min | < 30% for 10 min |

---

## 10. Implementation Checklist

- [ ] Queue provider ({{QUEUE_PROVIDER}}) installed and configured
- [ ] Redis (or message broker) provisioned for all environments
- [ ] Queue topology defined (queues, priorities, concurrency)
- [ ] Job types registered with retry policies and rate limits
- [ ] DLQ configured with retention and alerting
- [ ] Worker processes deployable independently from application
- [ ] Dashboard deployed and secured (if enabled)
- [ ] Metrics exported to monitoring system
- [ ] Alerts configured for queue depth, failure rate, DLQ
- [ ] Graceful shutdown implemented (finish current job, don't accept new)
- [ ] Job payload schemas documented
- [ ] Rate limiters configured per provider
- [ ] Idempotency keys used for all jobs that modify external state
