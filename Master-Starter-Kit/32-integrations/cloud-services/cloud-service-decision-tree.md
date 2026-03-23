# Cloud Service Decision Tree

> AWS, GCP, Azure, Cloudflare, Vercel — each excels in different areas. This decision tree helps you choose the right provider for each concern rather than going all-in on one ecosystem.

---

## The Multi-Cloud Reality

Most modern applications use multiple cloud providers. Your hosting might be Vercel, storage on S3, CDN on Cloudflare, and email via SES. This is normal and often optimal.

**Rule of thumb:** Choose the best tool for each job, but limit to 3 cloud providers maximum to keep operational complexity manageable.

---

## Per-Concern Decision Matrix

### Hosting / Compute

| Use Case | Best Choice | Why | Runner Up |
|----------|------------|-----|-----------|
| Next.js / React app | **Vercel** | Built for it, zero-config, preview deploys | Netlify, Cloudflare Pages |
| Static site | **Cloudflare Pages** | Free, fast, global CDN built-in | Vercel, Netlify |
| Docker containers | **Fly.io** or **Railway** | Simple deployment, global regions | AWS ECS, GCP Cloud Run |
| Long-running server | **Railway** or **Render** | Simple, affordable, managed | AWS EC2, DigitalOcean |
| Kubernetes | **GKE** (Google) | Best managed K8s, autopilot mode | EKS (AWS), AKS (Azure) |
| Edge compute | **Cloudflare Workers** | Zero cold start, 300+ locations | Vercel Edge, Deno Deploy |
| Background jobs | **Railway** or **Render** | Persistent workers | AWS Lambda, Inngest |

### Storage

| Use Case | Best Choice | Why | Runner Up |
|----------|------------|-----|-----------|
| General file storage | **Cloudflare R2** | S3-compatible, zero egress fees | AWS S3, Backblaze B2 |
| Heavy egress (serving files to users) | **Cloudflare R2** | $0 egress vs $0.09/GB (S3) | Backblaze B2 + Cloudflare |
| AWS ecosystem integration | **AWS S3** | Native integration with Lambda, CloudFront | R2 |
| Image optimization | **Cloudinary** or **Cloudflare Images** | On-demand transforms | imgix, Vercel Image |

### Database

| Use Case | Best Choice | Why | Runner Up |
|----------|------------|-----|-----------|
| PostgreSQL (managed) | **Supabase** or **Neon** | Free tier, serverless-friendly | AWS RDS, PlanetScale (MySQL) |
| Global low-latency reads | **PlanetScale** or **Turso** | Edge-replicated databases | CockroachDB, Neon |
| Redis / caching | **Upstash** | Serverless Redis, per-request pricing | AWS ElastiCache, Redis Cloud |
| Vector database (AI) | **Pinecone** or **Weaviate** | Purpose-built for embeddings | pgvector, Qdrant |

### CDN

| Use Case | Best Choice | Why | Runner Up |
|----------|------------|-----|-----------|
| General CDN | **Cloudflare** | Free plan, global, DDoS protection | CloudFront, Fastly |
| Media streaming | **CloudFront** or **Mux** | Optimized for video | Cloudflare Stream |
| API caching | **Cloudflare** | Workers for edge logic | Fastly Compute |

### Email

| Use Case | Best Choice | Why | Runner Up |
|----------|------------|-----|-----------|
| Transactional email | **Resend** or **Postmark** | Developer DX, reliable delivery | SendGrid, SES |
| Bulk email (marketing) | **SendGrid** or **Mailchimp** | Built for volume, list management | SES, Postmark |
| Cheapest at scale | **AWS SES** | $0.10 per 1000 emails | SendGrid (free tier: 100/day) |

### DNS

| Use Case | Best Choice | Why |
|----------|------------|-----|
| General DNS | **Cloudflare DNS** | Free, fast, proxy/CDN built-in |
| AWS ecosystem | **Route 53** | Integrates with ALB, CloudFront |
| DNS + monitoring | **Cloudflare** | Built-in analytics and DDoS protection |

---

## Decision by Project Type

### SaaS Application (Most Common)

```
Hosting:  Vercel (frontend) + Railway (backend API)
Database: Supabase (PostgreSQL) + Upstash (Redis)
Storage:  Cloudflare R2
CDN:      Cloudflare (free plan)
Email:    Resend (transactional) + SendGrid (marketing)
DNS:      Cloudflare
Auth:     Clerk or Supabase Auth
```

### High-Traffic Media Site

```
Hosting:  Cloudflare Pages + Workers
Database: PlanetScale (global reads)
Storage:  Cloudflare R2 + Cloudflare Images
CDN:      Cloudflare (Pro plan)
Video:    Mux or Cloudflare Stream
DNS:      Cloudflare
```

### Enterprise / Compliance-Heavy

```
Hosting:  AWS (ECS or EKS) — SOC 2, HIPAA, FedRAMP
Database: AWS RDS (PostgreSQL) — encryption, VPC, audit logs
Storage:  AWS S3 — encryption, versioning, lifecycle policies
CDN:      CloudFront — WAF integration
Email:    AWS SES — stays within AWS for data residency
DNS:      Route 53
```

---

## Cost Comparison (Monthly, Approximate)

### Small Project (< 10K users)

| Service | AWS | Cloudflare + Vercel | Notes |
|---------|-----|-------------------|-------|
| Compute | $50–100 (EC2/ECS) | $0–20 (Vercel free/Pro) | Vercel free for hobby |
| Database | $15–50 (RDS) | $0–25 (Supabase/Neon free) | Free tiers generous |
| Storage | $5 (S3) | $2 (R2) | R2 saves on egress |
| CDN | $5–20 (CloudFront) | $0 (Cloudflare free) | Cloudflare free is excellent |
| **Total** | **$75–175** | **$2–47** | |

### Medium Project (10K–100K users)

| Service | AWS | Multi-Cloud | Notes |
|---------|-----|------------|-------|
| Compute | $200–500 | $20–100 (Vercel Pro + Railway) | Serverless cheaper at this scale |
| Database | $100–300 | $25–100 (Supabase/Neon Pro) | Managed services often cheaper |
| Storage | $20–50 | $10–30 (R2) | R2 egress savings significant |
| CDN | $50–200 | $20 (Cloudflare Pro) | Cloudflare Pro is $20/month |
| **Total** | **$370–1050** | **$75–250** | |

---

## Vendor Lock-In Assessment

| Provider | Lock-In Risk | Mitigation |
|----------|-------------|------------|
| **AWS** | Medium-High | Use standard interfaces (S3 API, PostgreSQL), avoid proprietary services (DynamoDB, SQS) |
| **Vercel** | Low | Standard Next.js, deployable anywhere with Node.js |
| **Cloudflare** | Low-Medium | R2 is S3-compatible, Workers use standard Web APIs |
| **Supabase** | Low | Standard PostgreSQL, can self-host or migrate to any Postgres |
| **Firebase** | High | Proprietary database (Firestore), auth, hosting — hard to migrate |
| **Azure** | Medium-High | Similar to AWS — use standard services when possible |

**Minimize lock-in by:**
1. Using standard protocols (PostgreSQL not DynamoDB, S3 API not proprietary)
2. Abstracting provider-specific code behind interfaces
3. Avoiding provider-specific features unless the value clearly outweighs the lock-in risk
4. Storing infrastructure as code (Terraform/Pulumi) so you can recreate on another provider
