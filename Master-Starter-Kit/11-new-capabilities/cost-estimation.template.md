# Cost Estimation and Infrastructure Budget

> A living cost model for {{PROJECT_NAME}}. Update whenever you add a service, change tiers, or cross a usage threshold. Review monthly alongside your burn rate.

---

## Infrastructure Cost Table

| Service | Provider | Tier | Monthly Cost | Scaling Trigger | Notes |
|---------|----------|------|-------------|-----------------|-------|
| Hosting | {{HOSTING_PROVIDER}} | {{TIER}} | ${{COST}}/mo | {{SCALING_NOTE}} | |
| Database | {{DB_PROVIDER}} | Free | $0/mo | 500MB storage / 10K rows | Upgrade at ~$25/mo |
| Auth | {{AUTH_PROVIDER}} | Free | $0/mo | 10K MAU | |
| File Storage | {{STORAGE_PROVIDER}} | Free | $0/mo | 10GB storage | |
| Email | {{EMAIL_PROVIDER}} | Free | $0/mo | 100 emails/day | |
| Monitoring | {{MONITORING_PROVIDER}} | Free | $0/mo | 5K errors/mo | |
| AI API | {{AI_PROVIDER}} | Pay-as-you-go | ~${{COST}}/mo | Per-token pricing | |
| CDN | {{CDN_PROVIDER}} | Free | $0/mo | 100GB bandwidth | |
| Domain | {{REGISTRAR}} | — | ${{COST}}/yr | — | Renews annually |

---

## Common Service Costs Reference

### Hosting
| Provider | Free Tier | First Paid Tier | Notes |
|----------|-----------|-----------------|-------|
| Vercel | 100GB bandwidth, 100hrs build/mo | $20/mo Pro | Best for Next.js |
| Netlify | 100GB bandwidth, 300 build min/mo | $19/mo Pro | Good for static + serverless |
| Railway | $5 free credit/mo | $5/mo + usage | Good for full-stack apps |
| AWS Amplify | 12 months free tier | ~$15-30/mo | Scales well but complex pricing |
| Fly.io | 3 shared VMs free | $5/mo per extra VM | Good for containers |

### Database
| Provider | Free Tier | First Paid Tier | Notes |
|----------|-----------|-----------------|-------|
| Supabase | 500MB, 2 projects | $25/mo Pro | Postgres + auth + storage |
| PlanetScale | 1 billion row reads/mo | $39/mo Scaler | MySQL-compatible, branching |
| Neon | 0.5GB storage, 190 compute hrs | $19/mo Launch | Serverless Postgres |
| AWS RDS | 12 months t3.micro | ~$15-30/mo | Self-managed, flexible |

### Auth
| Provider | Free Tier | First Paid Tier | Notes |
|----------|-----------|-----------------|-------|
| Clerk | 10K MAU | $25/mo Pro | Best DX, React-focused |
| Auth0 | 25K MAU | $35/mo | Enterprise-ready |
| Supabase Auth | Included with DB | — | Good if already using Supabase |
| NextAuth/Auth.js | Free (self-hosted) | — | No MAU limits, more DIY |

### AI APIs
| Provider | Free/Trial Credit | Cost Structure | Notes |
|----------|-------------------|----------------|-------|
| OpenAI | $5 trial credit | ~$0.50-15/1M tokens | GPT-4o is best price/performance |
| Anthropic | — | ~$3-15/1M tokens | Claude, strong for code tasks |
| Google AI | $300 trial credit | ~$0.10-5/1M tokens | Gemini, generous free tier |

---

## Cost Projection Template

Assumptions: {{GROWTH_ASSUMPTION, e.g., "100 users Month 1, doubling monthly, 70% MoM retention"}}

| Category | Month 1 | Month 6 | Month 12 | Month 24 |
|----------|---------|---------|----------|----------|
| Hosting | $0 | $20 | $20 | $40 |
| Database | $0 | $0 | $25 | $25 |
| Auth | $0 | $0 | $0 | $25 |
| File Storage | $0 | $5 | $15 | $30 |
| Email | $0 | $0 | $20 | $20 |
| Monitoring | $0 | $0 | $26 | $26 |
| AI API | $5 | $30 | $80 | $200 |
| CDN/Domain | $1 | $1 | $1 | $1 |
| **Total** | **$6** | **$56** | **$187** | **$367** |

---

## Free Tier Inventory

List every free tier you are currently using, with its limits and what triggers an upgrade:

| Service | Free Tier Limit | Current Usage | Headroom | Upgrade Trigger |
|---------|----------------|---------------|----------|-----------------|
| {{SERVICE}} | {{LIMIT}} | {{CURRENT}} | {{REMAINING}} | {{TRIGGER}} |

Review this monthly. When headroom drops below 20%, plan for the upgrade cost.

---

## Cost Optimization Checklist

- [ ] **Right-size compute** — Are you on the smallest instance that handles your load?
- [ ] **Use edge/serverless** — Move static and cacheable work to edge functions
- [ ] **Optimize images** — Use WebP/AVIF, serve responsive sizes, use image CDN (Cloudflare Images, imgix)
- [ ] **Cache aggressively** — Set long Cache-Control headers for static assets, use ISR/SSG where possible
- [ ] **Exhaust free tiers** — Do not pay for a service until you have outgrown its free offering
- [ ] **Bundle API calls** — Batch requests where possible to reduce per-call charges
- [ ] **Set up spend alerts** — Configure alerts at 50%, 80%, and 100% of budget
- [ ] **Review unused resources** — Delete preview deployments, unused databases, orphaned storage buckets
- [ ] **Use reserved/committed pricing** — If on AWS/GCP with steady load, commit for 30-50% savings
- [ ] **Monitor AI token usage** — Log prompt/completion tokens, optimize prompts, cache repeated queries

---

## Burn Rate Tracking

Update monthly:

| Month | Infrastructure | SaaS/Services | AI API | Total Burn | Budget | Over/Under |
|-------|---------------|----------------|--------|------------|--------|------------|
| {{MONTH}} | ${{AMOUNT}} | ${{AMOUNT}} | ${{AMOUNT}} | ${{TOTAL}} | ${{BUDGET}} | {{DIFF}} |

---

## Cost Alerts Setup

**Vercel:** Project Settings > Billing > Spend Management > Set hard limit or email alerts.

**AWS:** AWS Budgets > Create Budget > set monthly threshold, email notification at 80%.

**Supabase:** Organization Settings > Billing > set spend cap (enabled by default on Pro).

**OpenAI:** Settings > Billing > Usage limits > set hard limit and email alert threshold.

**General rule:** Set alerts at 50% (awareness), 80% (plan action), 100% (act now) of your monthly budget.

---

## Break-Even Analysis (If Applicable)

| Metric | Value |
|--------|-------|
| Monthly fixed costs | ${{FIXED_COSTS}} |
| Variable cost per user/month | ${{PER_USER_COST}} |
| Revenue per user/month | ${{PER_USER_REVENUE}} |
| Break-even user count | {{FIXED_COSTS / (PER_USER_REVENUE - PER_USER_COST)}} |
| Current user count | {{CURRENT_USERS}} |
| Months to break-even | {{ESTIMATED_MONTHS}} |
