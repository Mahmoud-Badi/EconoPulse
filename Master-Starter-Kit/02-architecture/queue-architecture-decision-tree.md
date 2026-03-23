# Queue & Background Jobs Architecture

## How to Use This Document

Walk through each decision node to design your async processing layer. Every service spec should identify its background job needs. Record decisions in `decisions-log.template.md`.

---

## Node 1 — Do You Need Background Jobs?

**Question:** Does your application do any of the following?

```
Does your app do any of these?
  ├── Send email (transactional or marketing)          → YES, you need a queue
  ├── Process payments / handle webhooks               → YES, you need a queue
  ├── Generate reports or PDFs                         → YES, you need a queue
  ├── Process file uploads (resize images, transcode)  → YES, you need a queue
  ├── Sync data with third-party APIs                  → YES, you need a queue
  ├── Run scheduled tasks (daily cleanup, reminders)   → YES, you need a queue
  ├── Send push notifications                          → YES, you need a queue
  └── None of the above                               → You might not need one (rare)
```

**Verdict:** If you do any of the above in your request/response cycle, you're blocking the user's request. Move it to a background job.

---

## Node 2 — Queue Provider

**Question:** What background job system should you use?

### Option A: Inngest — RECOMMENDED for Serverless

**Description:** Event-driven background jobs with built-in retry, scheduling, and step functions. Runs on serverless (Vercel, Netlify, etc.).

| Pros | Cons |
|------|------|
| Works on serverless (no Redis needed) | Vendor dependency |
| Built-in retry, throttling, scheduling | Less control over execution environment |
| Step functions for multi-step workflows | Pricing at scale |
| Great DX — define functions in your codebase | Newer, smaller community |
| Dashboard for monitoring jobs | |

**Best for:** Next.js on Vercel, serverless-first architectures, teams that want managed infrastructure.

```typescript
// Example: Inngest function
import { inngest } from './client';

export const sendWelcomeEmail = inngest.createFunction(
  { id: 'send-welcome-email', retries: 3 },
  { event: 'user/created' },
  async ({ event, step }) => {
    await step.run('send-email', async () => {
      await resend.emails.send({
        to: event.data.email,
        subject: 'Welcome to {{PROJECT_NAME}}',
        template: 'welcome',
      });
    });

    // Wait 24 hours, then send onboarding email
    await step.sleep('wait-for-onboarding', '24h');

    await step.run('send-onboarding', async () => {
      await resend.emails.send({
        to: event.data.email,
        subject: 'Getting started with {{PROJECT_NAME}}',
        template: 'onboarding',
      });
    });
  }
);
```

### Option B: BullMQ (Redis) — RECOMMENDED for Self-Hosted

**Description:** High-performance Redis-based queue with priorities, rate limiting, and repeatable jobs.

| Pros | Cons |
|------|------|
| Battle-tested, large community | Requires Redis infrastructure |
| Fine-grained control over everything | More setup and configuration |
| Priority queues, rate limiting built-in | Need to manage workers separately |
| Dashboard (Bull Board) | Not ideal for serverless (workers need long-running process) |
| Free and open source | |

**Best for:** Docker/VPS deployments, high-throughput applications, when you already have Redis.

```typescript
// Example: BullMQ
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL);

// Define queue
const emailQueue = new Queue('email', { connection });

// Add job
await emailQueue.add('welcome', {
  to: user.email,
  template: 'welcome',
  data: { name: user.name },
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
});

// Process jobs
const worker = new Worker('email', async (job) => {
  await resend.emails.send({
    to: job.data.to,
    subject: getSubject(job.data.template),
    html: renderTemplate(job.data.template, job.data.data),
  });
}, { connection, concurrency: 5 });
```

### Option C: Trigger.dev

**Description:** Background jobs built for Next.js/TypeScript. Similar to Inngest but with more control.

| Pros | Cons |
|------|------|
| TypeScript-first DX | Newer, evolving rapidly |
| Long-running jobs (up to hours) | Self-hosted option more complex |
| Built-in integrations (OpenAI, Stripe, etc.) | Smaller community than BullMQ |
| Cloud and self-hosted options | |

### Option D: pg-boss (PostgreSQL)

**Description:** Job queue built on PostgreSQL — no Redis needed.

| Pros | Cons |
|------|------|
| Uses your existing PostgreSQL database | Lower throughput than Redis-based queues |
| No additional infrastructure | Not suitable for high-volume jobs |
| Transactional consistency (job + data in same DB) | Less feature-rich than BullMQ |
| Good enough for low-medium volume | |

**Best for:** Simple applications with low job volume that want to avoid Redis.

### Recommendation

| Your Stack | Recommendation |
|-----------|----------------|
| Vercel / Serverless | **Inngest** |
| Docker / VPS with Redis | **BullMQ** |
| Simple app, avoid Redis | **pg-boss** |
| Need long-running jobs | **Trigger.dev** |

---

## Node 3 — Job Categories

Classify your background jobs:

### Fire-and-Forget Jobs

Jobs triggered by an event, processed once. Most common type.

```
Examples:
- Send transactional email
- Process webhook event
- Generate audit log entry
- Send push notification
```

**Retry strategy:** 3 attempts with exponential backoff (1s, 10s, 100s).

### Scheduled / Recurring Jobs (Cron)

Jobs that run on a schedule.

```
Examples:
- Daily: Cleanup expired sessions, generate daily reports
- Hourly: Sync data with external APIs
- Weekly: Send digest emails, backup database
- Monthly: Generate invoices, update analytics aggregates
```

**Important considerations:**
- **Overlap prevention:** If a job takes longer than the interval, skip or queue (don't run in parallel)
- **Timezone:** Schedule in UTC, convert for display
- **Idempotency:** Job may run twice if a deployment happens during execution

### Multi-Step Workflows (Sagas)

Jobs that involve multiple steps with compensation logic.

```
Example: Process new order
  Step 1: Validate inventory     → If fail: reject order
  Step 2: Charge payment         → If fail: release inventory
  Step 3: Create shipment        → If fail: refund payment, release inventory
  Step 4: Send confirmation      → If fail: log error (non-critical)
```

---

## Node 4 — Error Handling

### Dead Letter Queue (DLQ)

Jobs that fail after all retry attempts go to a DLQ for investigation:

```typescript
// BullMQ: failed jobs automatically move to a failed state
worker.on('failed', async (job, error) => {
  if (job.attemptsMade >= job.opts.attempts) {
    // All retries exhausted — alert the team
    await alertOps({
      job: job.name,
      id: job.id,
      error: error.message,
      data: job.data,
      attempts: job.attemptsMade,
    });
  }
});
```

### Retry Strategies

| Strategy | Use Case |
|----------|----------|
| **Fixed delay** (e.g., 30s) | External API temporary failures |
| **Exponential backoff** (1s, 10s, 100s) | Rate-limited APIs, intermittent failures |
| **Exponential with jitter** | High-concurrency to avoid thundering herd |
| **No retry** | Jobs where duplicate processing is harmful |

---

## Node 5 — Webhook Processing

Inbound webhooks (from Stripe, GitHub, etc.) require special handling:

### Webhook Processing Pattern

```typescript
// 1. Receive webhook — respond 200 FAST
app.post('/api/webhooks/stripe', async (req, res) => {
  // Verify signature
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET
  );

  // Queue for processing (don't process inline!)
  await webhookQueue.add(event.type, {
    eventId: event.id,
    type: event.type,
    data: event.data,
  }, {
    jobId: event.id, // Idempotency: same event ID = same job
  });

  // Respond immediately
  res.status(200).json({ received: true });
});

// 2. Process webhook in background
const webhookWorker = new Worker('webhooks', async (job) => {
  const { type, data, eventId } = job.data;

  // Check if already processed (idempotency)
  const existing = await db.query.processedEvents.findFirst({
    where: eq(processedEvents.eventId, eventId),
  });
  if (existing) return; // Already processed

  // Process based on event type
  switch (type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(data);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(data);
      break;
    // ... more handlers
  }

  // Mark as processed
  await db.insert(processedEvents).values({ eventId, processedAt: new Date() });
});
```

### Webhook Processing Rules

1. **Respond 200 immediately** — Don't process inline. Webhook senders retry on timeout.
2. **Verify signatures** — Always verify the webhook is legitimate before processing.
3. **Idempotency** — Use the event ID to prevent duplicate processing.
4. **Out-of-order handling** — Events may arrive out of order. Check current state before applying changes.
5. **Separate queue** — Use a dedicated queue for webhooks with higher priority.

---

## Decision Summary

```markdown
## Background Jobs Architecture for {{PROJECT_NAME}}

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Queue provider | {Inngest/BullMQ/Trigger.dev/pg-boss} | {why} |
| Retry strategy | {exponential backoff / fixed / none} | {why} |
| Max retries | {3/5/10} | {why} |
| Dead letter queue | {yes/no} | {why} |
| Webhook processing | {inline/queued} | {why} |
| Scheduled jobs | {list of cron jobs} | {why} |
```

---

## Checklist

- [ ] Queue provider chosen and configured
- [ ] All background jobs identified from service specs
- [ ] Retry strategies defined per job type
- [ ] Dead letter queue configured with alerting
- [ ] Webhook processing follows the async pattern
- [ ] Scheduled jobs registered with overlap prevention
- [ ] Job monitoring dashboard set up (Bull Board / Inngest Dashboard)
- [ ] Job failure alerting configured
