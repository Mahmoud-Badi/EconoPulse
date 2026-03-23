# Stack Cost Mapping Reference

> A reference document mapping 20+ common SaaS infrastructure services to cost ranges at four scale tiers. This is not a template — it is a living reference that feeds into infrastructure-cost-model.template.md. Prices reflect publicly available pricing as of early 2025; verify current pricing before using in financial models.

---

## Service Cost Matrix

### Hosting & Compute

| Service | Free Tier | Starter ($10-$50/mo) | Growth ($50-$500/mo) | Scale ($500+/mo) | Pricing Model | Free Tier Limit |
|---------|-----------|---------------------|---------------------|------------------|---------------|-----------------|
| **Vercel** | Hobby (personal) | Pro: $20/mo/member | Pro + usage: $100-$400 | Enterprise: custom | Per-seat + usage (bandwidth, functions) | 100GB bandwidth, 100K function invocations |
| **Railway** | $5 trial credit | $5-$20/mo | $20-$200/mo | $200-$2,000/mo | Per-resource-hour + memory | $5 one-time credit, then usage-based |
| **Fly.io** | 3 shared VMs free | $5-$30/mo | $50-$300/mo | $500-$5,000/mo | Per-VM + bandwidth | 3 shared-cpu-1x VMs, 160GB bandwidth |
| **Render** | Static sites free | $7-$25/mo per service | $25-$250/mo | $500-$2,000/mo | Per-service (fixed instances) | Static sites only; background workers limited |
| **AWS (Lambda + ECS)** | Lambda free tier | $10-$50/mo | $100-$1,000/mo | $1,000-$50,000/mo | Per-request + compute-second | 1M Lambda requests/mo, 400K GB-seconds |

### Databases

| Service | Free Tier | Starter | Growth | Scale | Pricing Model | Free Tier Limit |
|---------|-----------|---------|--------|-------|---------------|-----------------|
| **Neon Postgres** | Yes | $19/mo (Launch) | $69/mo (Scale) | $700+/mo (Business) | Compute-hours + storage | 0.5GB storage, 191 compute-hours/mo |
| **Supabase** | Yes | $25/mo (Pro) | $25 + usage | $599/mo (Team) | Per-project + usage | 500MB DB, 2GB storage, 50K MAU auth |
| **PlanetScale** | Deprecated | $29/mo (Scaler) | $29 + usage | $599/mo (Scaler Pro) | Per-row-read/write + storage | Was 5GB; free tier removed 2024 |
| **Turso (libSQL)** | Yes | $8/mo (Scaler) | $50-$200/mo | Custom | Per-row-read + storage | 500 databases, 9GB storage, 500M rows read |
| **AWS RDS** | 12-month free | $15-$50/mo | $100-$500/mo | $500-$10,000/mo | Per-instance-hour + storage + IOPS | db.t3.micro for 12 months |

### Authentication

| Service | Free Tier | Starter | Growth | Scale | Pricing Model | Free Tier Limit |
|---------|-----------|---------|--------|-------|---------------|-----------------|
| **Clerk** | Yes | $25/mo (Pro) | $25 + $0.02/MAU over 10K | Custom (Enterprise) | Per-MAU | 10,000 MAU |
| **Auth0** | Yes | $23/mo (Essentials) | $240/mo (Professional) | Custom | Per-MAU + features | 25,000 MAU (limited features) |
| **Supabase Auth** | Included | Included in Supabase Pro | Included | Included | Part of Supabase pricing | 50,000 MAU on free, unlimited on paid |
| **Firebase Auth** | Yes | Pay-as-you-go | Pay-as-you-go | Pay-as-you-go | Per-MAU above free tier | 50,000 MAU (phone auth: 10K/mo) |

### Payments

| Service | Free Tier | Transaction Fee | Per-Transaction | Notes |
|---------|-----------|----------------|-----------------|-------|
| **Stripe** | No monthly fee | 2.9% + $0.30 (US) | Variable | +1% international, +1.5% currency conversion |
| **Stripe (Invoicing)** | First 25 free | 0.4% per invoice (paid) | Variable | On top of card processing fees |
| **Paddle** | No monthly fee | 5% + $0.50 | Variable | Merchant of Record — handles tax, compliance |
| **LemonSqueezy** | No monthly fee | 5% + $0.50 | Variable | Merchant of Record — simpler than Paddle |

### AI / LLM Providers

| Service | Free Tier | Starter | Growth | Scale | Pricing Model |
|---------|-----------|---------|--------|-------|---------------|
| **OpenAI API** | $5 credit (new accounts) | $10-$50/mo | $100-$2,000/mo | $5,000-$100,000+/mo | Per-token (model-dependent) |
| **Anthropic API** | $5 credit (new accounts) | $10-$50/mo | $100-$2,000/mo | $5,000-$100,000+/mo | Per-token (model-dependent) |
| **Google Cloud AI (Gemini)** | Free tier available | $10-$50/mo | $100-$1,000/mo | $1,000-$50,000+/mo | Per-token + per-request |

**AI cost note:** AI API costs are the most variable line item. A single power user can cost 100x an average user. Always model per-request costs and set usage limits per user tier.

### Email & Notifications

| Service | Free Tier | Starter | Growth | Scale | Pricing Model | Free Tier Limit |
|---------|-----------|---------|--------|-------|---------------|-----------------|
| **Resend** | Yes | $20/mo | $80/mo | $400+/mo | Per-email | 3,000 emails/mo, 1 domain |
| **Postmark** | 25-day trial | $15/mo (10K) | $65/mo (50K) | $400+/mo (300K+) | Per-email (tiered) | 100 emails in trial |
| **SendGrid** | Yes | $20/mo (40K) | $90/mo (100K) | $400+/mo (custom) | Per-email (tiered) | 100 emails/day |
| **AWS SES** | 62K free (from EC2) | $0.10/1K emails | $0.10/1K emails | $0.10/1K emails | Per-email (flat) | 62,000/mo if sending from EC2 |

### Cache & Key-Value Store

| Service | Free Tier | Starter | Growth | Scale | Pricing Model | Free Tier Limit |
|---------|-----------|---------|--------|-------|---------------|-----------------|
| **Upstash Redis** | Yes | $10/mo | $100-$300/mo | $500+/mo | Per-request + storage | 10K commands/day, 256MB |
| **Vercel KV** | Yes (with Pro) | Included in Pro | $30-$300/mo usage | Custom | Per-request + storage | 3,000 requests/day on Hobby |

### File Storage & CDN

| Service | Free Tier | Starter | Growth | Scale | Pricing Model | Free Tier Limit |
|---------|-----------|---------|--------|-------|---------------|-----------------|
| **Vercel Blob** | Yes (with Pro) | Included | $20-$100/mo usage | Custom | Per-GB storage + per-request | 1,000 uploads, 500MB free |
| **Cloudinary** | Yes | $89/mo (Plus) | $224/mo (Advanced) | Custom | Credits (storage + transforms + bandwidth) | 25GB storage, 25K transformations |
| **AWS S3** | 12-month free | $2-$10/mo | $20-$100/mo | $100-$5,000+/mo | Per-GB + per-request | 5GB for 12 months |
| **Uploadthing** | Yes | $10/mo | $50/mo | Custom | Per-GB storage | 2GB storage |

### Monitoring, Logging & Analytics

| Service | Free Tier | Starter | Growth | Scale | Pricing Model | Free Tier Limit |
|---------|-----------|---------|--------|-------|---------------|-----------------|
| **Sentry** | Yes | $26/mo (Team) | $80/mo (Business) | $320+/mo | Per-event + per-replay | 5K errors, 1K replays/mo |
| **PostHog** | Yes | $0 + usage | $0 + usage | $2,000+/mo at volume | Per-event | 1M events/mo (analytics), 15K replays |
| **Mixpanel** | Yes | $20/mo | $100-$500/mo | Custom | Per-tracked-user (MTU) | 20M events/mo (but 1K MTU limit) |
| **DataDog** | Yes | $15/host/mo (Infra) | $75-$500/mo | $5,000-$20,000+/mo | Per-host + per-metric + per-log-GB | 5 hosts, 1-day retention |
| **BetterStack** | Yes | $25/mo | $85/mo | $250+/mo | Per-source + retention | 1 source, 3 days retention |

### Search

| Service | Free Tier | Starter | Growth | Scale | Pricing Model | Free Tier Limit |
|---------|-----------|---------|--------|-------|---------------|-----------------|
| **Algolia** | Yes | $0 + usage | $100-$500/mo | $1,000+/mo | Per-search-request + per-record | 10K searches/mo, 10K records |
| **Meilisearch (Cloud)** | Yes | $30/mo | $100-$300/mo | Custom | Per-document + instance size | 100K documents |
| **Typesense (Cloud)** | No | $30/mo | $100-$300/mo | Custom | Per-instance | No free tier |

---

## Free Tier Limits That Frequently Surprise Startups

These are the limits that silently break your product or trigger unexpected bills.

| Service | Surprising Limit | What Happens When You Hit It | When You Typically Hit It |
|---------|-----------------|-----------------------------|--------------------------|
| **Vercel** (Hobby) | 100K function invocations/mo | Functions return 429 errors | ~500-1,000 daily active users |
| **Supabase** (Free) | 500MB database | Writes fail silently or return errors | ~50K rows with rich data |
| **Clerk** (Free) | 10,000 MAU | Auth stops working for new users | Product Hunt launch day |
| **Neon** (Free) | Compute auto-suspends after 5 min idle | Cold start of 1-3 seconds on first query | Immediately noticeable by users |
| **Upstash** (Free) | 10K commands/day | Requests rejected; app breaks if no fallback | 100 users x 100 Redis calls each |
| **PostHog** (Free) | 1M events/mo | Events silently dropped | ~3,000 daily active users with 10 events each |
| **SendGrid** (Free) | 100 emails/day | Emails queued, not sent | 100 signups in a day (welcome emails) |
| **Vercel Blob** (Free) | 500MB total storage | Upload fails | ~500 user avatars + 50 file uploads |
| **Algolia** (Free) | 10K search requests/mo | Search returns errors | ~300 daily users searching 1x each |
| **Sentry** (Free) | 5K errors/mo | Errors silently dropped | One bad deploy with a loop error |
| **Auth0** (Free) | Limited social connections (2) | Can't add Google + GitHub + Apple login | Immediately, if you want 3+ providers |

---

## Hidden Costs Section

Costs that don't appear on the pricing page but show up on your bill.

### Egress / Bandwidth Fees

| Provider | Egress Cost | Where It Hides | Mitigation |
|----------|------------|---------------|------------|
| AWS | $0.09/GB (first 10TB) | EC2, S3, RDS, all services | Use CloudFront (cheaper egress), or Cloudflare R2 ($0 egress) |
| GCP | $0.12/GB (first 1TB) | Compute Engine, Cloud Storage | Same — use CDN or Cloudflare |
| Vercel | Included in Pro (1TB) | Only if you exceed 1TB/mo | Optimize image sizes, use external CDN for large assets |
| Supabase | 250GB included (Pro) | Large file downloads, real-time connections | Offload large files to dedicated storage |

### Overage Charges

| Service | Base Plan | Overage Rate | Surprise Factor |
|---------|-----------|-------------|-----------------|
| Vercel Pro | 1TB bandwidth | $40/100GB | A viral blog post can cost $200+ in a day |
| Clerk Pro | 10K MAU included | $0.02/additional MAU | Scales linearly — 100K MAU = $1,825/mo |
| Supabase Pro | 8GB DB, 250GB bandwidth | $0.125/GB DB, $0.09/GB BW | Database growth sneaks up |
| PostHog | 1M events free | $0.00031/event | 10M events = $2,790/mo (feels expensive) |
| DataDog | Per-host base | $0.10/custom metric, $0.10/ingested GB | Custom metrics multiply fast; logs are expensive |
| OpenAI | No base fee | Per-token | One prompt engineering mistake can cost $500 in an hour |

### Minimum Commitments & Annual Lock-In

| Service | Monthly Price | Annual Price | Lock-In Savings | Penalty for Leaving Early |
|---------|-------------|-------------|-----------------|--------------------------|
| AWS (Reserved Instances) | $100/mo | $75/mo (1yr) or $50/mo (3yr) | 25-50% | Remaining term is paid regardless |
| DataDog (Pro) | $23/host/mo | $15/host/mo | 35% | Annual commitment, billed upfront |
| Auth0 (Professional) | $240/mo | $192/mo | 20% | Annual commitment |
| Algolia (Standard) | Variable | 10-20% discount | Varies | Annual commitment |

**Rule of thumb:** Only commit annually when: (1) you have used the service for 3+ months, (2) usage is stable or growing, (3) the savings exceed 20%, and (4) you have >12 months of runway.

---

## Cost Estimation Quick Reference

For a typical SaaS product at each stage:

| Stage | MAU | Total Monthly Infra | Largest Cost Driver | % of Revenue |
|-------|-----|--------------------|--------------------|-------------|
| **MVP** | 100-500 | $0-$50 | Usually $0 (all free tiers) | N/A (pre-revenue) |
| **Beta** | 500-2,000 | $50-$200 | Database or auth (first paid tier) | 50-100% of revenue |
| **Launch** | 2K-10K | $200-$800 | Hosting + database + monitoring | 15-40% of revenue |
| **Growth** | 10K-50K | $800-$3,000 | AI APIs (if applicable) or database | 8-20% of revenue |
| **Scale** | 50K-200K | $3,000-$15,000 | AI APIs or monitoring/logging | 5-15% of revenue |
| **Enterprise** | 200K-1M+ | $15,000-$100,000+ | Compute + AI + monitoring | 3-10% of revenue |

**Add AI costs separately:** If your product uses LLM APIs, add 30-60% on top of the above estimates. AI-heavy products (chatbots, content generation) can have AI costs exceeding all other infrastructure combined.

---

*This reference feeds into: infrastructure-cost-model.template.md (per-component costs), pnl-cash-flow-statement.template.md (COGS lines), runway-burn-rate.template.md (burn calculation)*
