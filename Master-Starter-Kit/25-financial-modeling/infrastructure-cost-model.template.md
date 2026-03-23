# Infrastructure Cost Model — {{PROJECT_NAME}}

> Hosting, API, storage, and operational infrastructure costs projected across four scale tiers. This model ties your tech stack decisions to financial outcomes and identifies the "infrastructure cliffs" where costs jump non-linearly. Cross-references CONFIG.STACK values when available.

---

## Stack Configuration

| Component | Choice | Provider | Pricing Model |
|-----------|--------|----------|--------------|
| Hosting / compute | {{HOSTING_PROVIDER}} | ___ | Per-request / per-instance / per-seat |
| Database | {{DATABASE}} | ___ | Per-row / per-connection / per-GB |
| AI / LLM provider | {{AI_PROVIDER}} | ___ | Per-token |
| AI model | {{AI_MODEL}} | ___ | Per-1K input tokens + per-1K output tokens |
| Auth provider | ___ | ___ | Per-MAU |
| File storage | ___ | ___ | Per-GB + per-request |
| Email service | ___ | ___ | Per-email |
| Cache / KV store | ___ | ___ | Per-request / per-GB |
| CDN / edge | ___ | ___ | Per-GB bandwidth |
| Monitoring | ___ | ___ | Per-event / per-host |
| Search | ___ | ___ | Per-record / per-search |

**Scale parameters:**
- Monthly active users (MAU): {{MONTHLY_ACTIVE_USERS}}
- Requests per user per month: {{REQUESTS_PER_USER_PER_MONTH}}
- Total monthly requests: MAU x requests/user = ___

---

## Cost by Component at Four Scale Tiers

### Tier Definitions

| Tier | MAU | Monthly Requests | Typical Stage | Monthly Revenue |
|------|-----|-----------------|---------------|----------------|
| **MVP** | 100-1,000 | 10K-100K | Pre-revenue / beta | $0-$2K |
| **Growth** | 1K-10K | 100K-1M | Post-launch | $2K-$30K |
| **Scale** | 10K-100K | 1M-50M | Growth stage | $30K-$300K |
| **Enterprise** | 100K-1M | 50M-500M | Series B+ | $300K+ |

### Hosting / Compute

| Provider | MVP (1K MAU) | Growth (10K MAU) | Scale (100K MAU) | Enterprise (1M MAU) | Pricing Model |
|----------|-------------|-----------------|-----------------|--------------------|----|
| Vercel (Pro) | $20/mo | $20 + ~$50 usage | $20 + ~$500 usage | $500+ (Enterprise) | Per-request + bandwidth |
| Railway | $5/mo | $20-$50/mo | $100-$400/mo | $500-$2,000/mo | Per-vCPU-hour + memory |
| Fly.io | $0 (free tier) | $15-$40/mo | $100-$500/mo | $1,000-$5,000/mo | Per-VM + bandwidth |
| AWS (ECS/Lambda) | $5-$15/mo | $50-$150/mo | $500-$3,000/mo | $3,000-$20,000/mo | Per-compute-second + memory |

<!-- IF {{HOSTING_PROVIDER}} == "vercel" -->
**Vercel cost drivers:** Function invocations (free tier: 100K/mo, Pro: 1M included), bandwidth (100GB included on Pro), edge middleware invocations, ISR regenerations. The cliff hits at ~500K-1M function invocations/month.
<!-- ENDIF -->

### Database

| Provider | MVP | Growth | Scale | Enterprise | Cliff Point |
|----------|-----|--------|-------|-----------|------------|
| Neon Postgres | $0 (free) | $19/mo | $69-$200/mo | $700+/mo | 3GB storage; compute hours on free |
| Supabase | $0 (free) | $25/mo | $25 + $100-$500 usage | $599+/mo | 500MB DB, 50K MAU auth on free |
| PlanetScale | $0 (free, deprecated) | $29/mo | $29 + usage | $599+/mo | 1B row reads/mo on Scaler |
| AWS RDS (Postgres) | $15-$30/mo | $50-$150/mo | $300-$1,500/mo | $2,000-$10,000/mo | Connection limits, IOPS |

### AI / LLM API Costs

This is often the largest variable cost for AI-powered products.

| Provider / Model | Input (per 1M tokens) | Output (per 1M tokens) | Cost per Avg Request (500 in / 200 out) | 10K Requests/day | 100K Requests/day |
|-----------------|----------------------|----------------------|----------------------------------------|-----------------|-------------------|
| OpenAI GPT-4o | $2.50 | $10.00 | $0.0033 | $33/day ($990/mo) | $330/day ($9,900/mo) |
| OpenAI GPT-4o-mini | $0.15 | $0.60 | $0.0002 | $2/day ($60/mo) | $20/day ($600/mo) |
| Anthropic Claude Sonnet 4 | $3.00 | $15.00 | $0.0045 | $45/day ($1,350/mo) | $450/day ($13,500/mo) |
| Anthropic Claude Haiku 3.5 | $0.80 | $4.00 | $0.0012 | $12/day ($360/mo) | $120/day ($3,600/mo) |
| Google Gemini 2.5 Flash | $0.15 | $0.60 | $0.0002 | $2/day ($72/mo) | $24/day ($720/mo) |

<!-- IF {{AI_PROVIDER}} == "openai" -->
**OpenAI cost optimization:** Use GPT-4o-mini for classification, routing, and simple tasks. Reserve GPT-4o for complex generation. A smart routing layer can cut AI costs 60-80%. Batch API offers 50% discount for non-real-time workloads.
<!-- ENDIF -->

<!-- IF {{AI_PROVIDER}} == "anthropic" -->
**Anthropic cost optimization:** Use Haiku for high-volume, low-complexity tasks (summarization, classification). Use Sonnet for complex reasoning. Prompt caching reduces input token costs by up to 90% for repeated system prompts. Batch API offers 50% discount.
<!-- ENDIF -->

### Email / Notifications

| Provider | MVP (1K emails/mo) | Growth (10K/mo) | Scale (100K/mo) | Enterprise (1M/mo) |
|----------|-------------------|-----------------|-----------------|-------------------|
| Resend | $0 (free: 3K/mo) | $20/mo | $80/mo | $400+/mo |
| Postmark | $15/mo (10K) | $15/mo | $115/mo | $695+/mo |
| SendGrid | $0 (free: 100/day) | $20/mo | $90/mo | $400+/mo |
| AWS SES | $0.10/1K emails | $1/mo | $10/mo | $100/mo |

### CDN / Bandwidth / Storage

| Service | MVP | Growth | Scale | Enterprise |
|---------|-----|--------|-------|-----------|
| Vercel Blob | $0 (included) | $0-$20/mo | $20-$100/mo | $100-$500/mo |
| Cloudinary | $0 (free: 25GB) | $89/mo | $224/mo | Custom |
| AWS S3 + CloudFront | $1-$5/mo | $10-$50/mo | $100-$500/mo | $500-$5,000/mo |
| Uploadthing | $0 (free: 2GB) | $10/mo | $50/mo | Custom |

### Monitoring / Logging / Analytics

| Service | MVP | Growth | Scale | Enterprise |
|---------|-----|--------|-------|-----------|
| Sentry | $0 (free: 5K errors) | $26/mo | $80/mo | $320+/mo |
| PostHog | $0 (free: 1M events) | $0-$50/mo | $450/mo | $2,000+/mo |
| DataDog | $0 (free: 1 host) | $75/mo | $500-$2,000/mo | $5,000-$20,000/mo |
| Vercel Analytics | $0 (included Pro) | $0 | $0 | $0 (included) |
| BetterStack | $0 (free) | $25/mo | $85/mo | $250+/mo |

### Cache / KV Store

| Service | MVP | Growth | Scale | Enterprise |
|---------|-----|--------|-------|-----------|
| Upstash Redis | $0 (free: 10K/day) | $10/mo | $100-$300/mo | $500+/mo |
| Vercel KV | $0 (free: 3K/day) | $3-$30/mo | $30-$300/mo | $300+/mo |
| AWS ElastiCache | $15-$30/mo | $50-$150/mo | $300-$1,000/mo | $1,000-$5,000/mo |

---

## Infrastructure Cliff Analysis

At what user count does each service require a tier upgrade or architectural change?

| Component | Current Tier | Cliff Point | What Happens | Next Tier Cost | Action Required |
|-----------|-------------|------------|-------------|---------------|----------------|
| {{HOSTING_PROVIDER}} | ___ | ___ MAU | ___ | $___ /mo | ___ |
| {{DATABASE}} | ___ | ___ rows / ___ connections | ___ | $___ /mo | ___ |
| {{AI_PROVIDER}} | ___ | ___ requests/day | Rate limits hit | $___ /mo | Request limit increase; add caching |
| Auth | ___ | ___ MAU | ___ | $___ /mo | ___ |
| Email | ___ | ___ emails/mo | ___ | $___ /mo | ___ |
| Monitoring | ___ | ___ events/mo | ___ | $___ /mo | ___ |

**Critical cliffs to watch:**
- **Database connections:** Most managed Postgres services cap at 50-100 connections on starter tiers. Serverless functions can exhaust this at ~5K MAU. Solution: connection pooling (PgBouncer, Neon pooler).
- **AI rate limits:** OpenAI Tier 1 allows 500 RPM. At 10 requests/user/session, you hit this at 50 concurrent users. Solution: request queuing, caching, model routing.
- **Serverless cold starts:** At >100 functions, cold start frequency increases. Users notice 1-3 second delays. Solution: edge functions, persistent compute, or warm-keeping strategies.

---

## Total Monthly Infrastructure Burn

| Component | MVP (1K MAU) | Growth (10K MAU) | Scale (100K MAU) | Enterprise (1M MAU) |
|-----------|-------------|-----------------|-----------------|-------------------|
| Hosting | $___ | $___ | $___ | $___ |
| Database | $___ | $___ | $___ | $___ |
| AI / LLM | $___ | $___ | $___ | $___ |
| Auth | $___ | $___ | $___ | $___ |
| Email | $___ | $___ | $___ | $___ |
| Storage / CDN | $___ | $___ | $___ | $___ |
| Monitoring | $___ | $___ | $___ | $___ |
| Cache | $___ | $___ | $___ | $___ |
| Search | $___ | $___ | $___ | $___ |
| **Total Infra** | **$___** | **$___** | **$___** | **$___** |
| **Infra as % of Revenue** | **___% of $___** | **___% of $___** | **___% of $___** | **___% of $___** |

**Target:** Infrastructure should be 5-15% of revenue at scale. If it exceeds 20%, you are running a hosting company, not a software company.

---

## Self-Hosted vs. Managed Comparison

For scale and enterprise tiers, self-hosting can reduce costs 50-80% but increases operational burden.

| Component | Managed Cost (100K MAU) | Self-Hosted Cost (100K MAU) | Savings | Ops Burden | Recommended Switch Point |
|-----------|------------------------|---------------------------|---------|-----------|------------------------|
| Database | $200/mo (Neon) | $50/mo (RDS self-managed) | 75% | High — backups, upgrades, monitoring | >$500/mo managed cost |
| Cache | $300/mo (Upstash) | $30/mo (Redis on EC2) | 90% | Medium — failover, memory management | >$200/mo managed cost |
| Search | $250/mo (Algolia) | $40/mo (Meilisearch on VM) | 84% | Medium — indexing, scaling | >$200/mo managed cost |
| Monitoring | $2,000/mo (DataDog) | $100/mo (Grafana + Prometheus) | 95% | High — alerting, dashboards, retention | >$500/mo managed cost |
| Email | $80/mo (Resend) | $10/mo (AWS SES) | 88% | Low — deliverability monitoring | >$50/mo managed cost |

**Rule of thumb:** Stay managed until a single service exceeds $500/mo and you have a dedicated ops engineer. The cost of an outage from misconfigured self-hosting far exceeds the monthly savings.

---

## Gotchas: Infrastructure Cost Mistakes

1. **Ignoring egress fees.** AWS, GCP, and Azure charge $0.09/GB for data leaving their network. A 1MB API response served 1M times = 1TB = $90/month just in egress. Vercel and Cloudflare absorb egress into their pricing.

2. **AI costs are your new COGS.** If your product uses LLMs, AI API costs will be 30-60% of COGS. Model them per-request, not as a flat monthly cost. A power user making 100 requests/day costs 50x more than an average user.

3. **Free tiers expire or change.** Heroku killed its free tier. PlanetScale killed its free tier. Railway reduced its free tier. Never build a financial model assuming a free tier persists beyond 12 months.

4. **Monitoring costs scale superlinearly.** DataDog charges per host, per metric, per log line, per trace. At 100K MAU with verbose logging, DataDog alone can cost $5K-$20K/month. Use sampling and log levels aggressively.

5. **Database connection pooling is not optional.** Serverless architectures (Vercel, Netlify) create a new database connection per function invocation. Without pooling, you will exhaust connection limits at surprisingly low traffic.

6. **Annual commitments save 20-40% but destroy flexibility.** Only commit annually on services where usage is predictable and growing. Committing to a $500/mo database tier when you might pivot is $6,000 wasted.

---

*Cross-references: stack-cost-mapping.md (per-service cost reference), pnl-cash-flow-statement.template.md (COGS hosting line), runway-burn-rate.template.md (burn rate calculation)*
