# Container Strategy Decision Tree

> Do not start with Kubernetes. Start with the simplest deployment model that meets your requirements, and only add complexity when you outgrow it.

---

## The Decision Tree

```
Do you need containers at all?
│
├── Is your app a static site or JAMstack?
│   └── NO containers. Deploy to Vercel, Netlify, or Cloudflare Pages.
│
├── Is your app a single web service (API + frontend)?
│   └── Probably NO containers. Deploy to Railway, Render, Fly.io, or Vercel.
│       (Unless you need a specific runtime or system dependency.)
│
├── Do you need reproducible builds across environments?
│   └── YES → Docker. Even if you deploy to a PaaS, build with Docker for consistency.
│
└── How many services do you run?

    1-2 services
    └── Serverless (Vercel, Railway, Render, AWS Lambda)
        or single Docker container (Fly.io, Cloud Run)
        Simplest option. No orchestration needed.

    3-10 services
    └── Docker Compose (local dev) + managed container service (production)
        Options: AWS ECS/Fargate, Google Cloud Run, Azure Container Apps
        You need multi-container orchestration but not Kubernetes complexity.

    10+ services with auto-scaling, service mesh, complex networking
    └── Kubernetes (EKS, GKE, AKS) or managed K8s alternative
        You need full orchestration. But be honest — do you really have 10+ services?
        Most teams overestimate their service count.
```

---

## Option 1: Serverless / PaaS (No Containers)

### When to Use

- Static sites, JAMstack, server-rendered apps (Next.js, Remix, Astro)
- Single API services
- Event-driven workloads (webhooks, cron jobs, queue consumers)
- Teams that want to focus on application code, not infrastructure
- Projects where cost efficiency at low scale matters most

### Platform Comparison

| Platform | Best For | Free Tier | Scaling | Docker Support |
|----------|----------|-----------|---------|----------------|
| **Vercel** | Next.js, frontend-focused | Generous | Automatic | No (serverless) |
| **Netlify** | Static sites, JAMstack | Generous | Automatic | No (serverless) |
| **Railway** | Full-stack apps, APIs | $5 credit/month | Automatic | Yes |
| **Render** | Full-stack, background workers | Static sites free | Manual + auto | Yes (native) |
| **Fly.io** | Global edge, low-latency APIs | Limited free VMs | Automatic | Yes (required) |
| **AWS Lambda** | Event-driven, microservices | 1M requests/month | Automatic | Yes (container image) |
| **Cloudflare Workers** | Edge compute, low latency | 100K requests/day | Automatic | No (V8 isolates) |

### Pros

- Zero infrastructure management
- Automatic scaling (including scale to zero)
- Built-in SSL, CDN, and edge routing
- Fastest path from code to production
- Pay only for what you use (often free for small projects)

### Cons

- Limited runtime customization (cannot install system packages)
- Cold starts on serverless platforms (Lambda, Workers)
- Vendor lock-in (migrating from Vercel to self-hosted is non-trivial)
- Execution time limits (Lambda: 15 min, Workers: 30 sec CPU)
- Harder to run background jobs, WebSockets, or long-running processes
- Cost can spike unpredictably at high scale

---

## Option 2: Docker (Containerized Applications)

### When to Use

- You need specific system dependencies (FFmpeg, ImageMagick, etc.)
- You need reproducible builds across dev, staging, and production
- You have 3-10 services that need to communicate
- You want environment parity (same container runs everywhere)
- You need long-running processes, WebSockets, or background workers

### Docker Best Practices

**1. Use Multi-Stage Builds**

Multi-stage builds dramatically reduce image size by separating the build environment from the runtime environment.

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Stage 2: Build application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER appuser

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**2. Write a Proper .dockerignore**

```
node_modules
.next
dist
.git
.github
*.md
.env*
.DS_Store
coverage
.turbo
```

**3. Pin Base Image Versions**

```dockerfile
# Bad: floating tag, can break at any time
FROM node:latest

# Bad: major version only, minor updates can break
FROM node:20

# Good: specific minor version with slim base
FROM node:20.11-alpine

# Best: digest pin for reproducibility (get with `docker pull node:20.11-alpine && docker inspect --format='{{index .RepoDigests 0}}' node:20.11-alpine`)
FROM node:20.11-alpine@sha256:abc123...
```

**4. Order Layers for Cache Efficiency**

```dockerfile
# Dependencies change less often than source code.
# Copy dependency files first, install, THEN copy source.

COPY package.json pnpm-lock.yaml ./    # Changes rarely
RUN pnpm install --frozen-lockfile      # Cached unless lockfile changes

COPY . .                                # Changes often
RUN pnpm build                          # Rebuilds only when source changes
```

**5. Scan Images for Vulnerabilities**

```bash
# Using Trivy (recommended)
trivy image my-app:latest

# Using Docker Scout
docker scout cves my-app:latest

# Using Grype
grype my-app:latest
```

### Docker Compose for Local Development

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: deps  # Use the deps stage for development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules  # Prevent overwriting node_modules
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

### Container Registry Selection

| Registry | Best For | Free Tier | Private Repos | Integrated With |
|----------|----------|-----------|---------------|-----------------|
| **GHCR** (GitHub Container Registry) | GitHub users | 500 MB storage, 1 GB bandwidth | Yes (GitHub plan) | GitHub Actions |
| **Docker Hub** | Public images, OSS | 1 private repo | Paid plans | Everything |
| **AWS ECR** | AWS deployments | 500 MB (12 months) | Yes | ECS, EKS, Lambda |
| **Google Artifact Registry** | GCP deployments | 500 MB | Yes | Cloud Run, GKE |
| **Azure ACR** | Azure deployments | None (Basic: $5/mo) | Yes | AKS, App Service |

**Recommendation:** Use GHCR if you are on GitHub (free, integrated with Actions). Use ECR/GAR/ACR if you deploy to the matching cloud provider.

---

## Option 3: Kubernetes (Container Orchestration)

### When to Use

Kubernetes is the right choice when ALL of these are true:

- You have 10+ services that need orchestration
- You need automatic scaling based on metrics (CPU, memory, custom)
- You need service discovery and internal networking between services
- You need rolling updates with health-check-based rollback
- You have dedicated DevOps/SRE capacity to manage the cluster
- Your team has Kubernetes experience (or budget to acquire it)

### When NOT to Use

Kubernetes is the wrong choice when ANY of these are true:

- You have fewer than 10 services (use Docker Compose + managed container service)
- Your team has no Kubernetes experience and no budget to learn
- You are a startup or small team (Kubernetes operational overhead will slow you down)
- You can deploy to a managed PaaS instead (Railway, Render, Cloud Run)
- You are running a monolith (Kubernetes is designed for microservices)

### Managed Kubernetes Options

| Provider | Service | Pricing | Control Plane Cost | Best For |
|----------|---------|---------|--------------------|---------|
| **AWS** | EKS | Per-node + $0.10/hr control plane | $73/month | AWS-heavy organizations |
| **Google Cloud** | GKE | Per-node, free Autopilot control plane | Free (Autopilot) | GCP users, Autopilot mode |
| **Azure** | AKS | Per-node, free control plane | Free | Azure organizations |
| **DigitalOcean** | DOKS | Per-node, free control plane | Free | Budget-conscious teams |

### Kubernetes Alternatives (Simpler Orchestration)

If you need more than PaaS but less than Kubernetes:

| Solution | Complexity | Best For |
|----------|------------|----------|
| **AWS ECS/Fargate** | Medium | Container orchestration without managing servers |
| **Google Cloud Run** | Low | Stateless containers with automatic scaling |
| **Azure Container Apps** | Low | Event-driven containerized microservices |
| **Docker Swarm** | Low-Medium | Simple orchestration for small clusters |
| **Nomad** (HashiCorp) | Medium | Multi-workload orchestration (containers + VMs + binaries) |

Most teams that think they need Kubernetes actually need **ECS/Fargate or Cloud Run.** These provide 80% of the benefits with 20% of the operational burden.

---

## Decision Summary Table

| Factor | Serverless/PaaS | Docker + Managed Service | Kubernetes |
|--------|-----------------|--------------------------|------------|
| **Service count** | 1-2 | 3-10 | 10+ |
| **Team size** | Any | 2+ | 5+ (with DevOps) |
| **Setup time** | Minutes | Hours | Days-Weeks |
| **Operational burden** | None | Low-Medium | High |
| **Scaling** | Automatic | Semi-auto | Fully configurable |
| **Cost at low scale** | Free-$20/mo | $20-100/mo | $150+/mo |
| **Cost at high scale** | Can spike | Predictable | Most efficient |
| **Customization** | Limited | High | Unlimited |
| **Local dev** | Platform CLI | Docker Compose | Minikube/Kind |
| **Vendor lock-in** | High | Low (Docker is portable) | Low (K8s is standard) |

---

## Docker Image Size Targets

| Application Type | Target Size | Strategy |
|-----------------|-------------|----------|
| **Node.js API** | < 150 MB | Alpine base, multi-stage, no devDeps |
| **Next.js app** | < 200 MB | Standalone output, Alpine base |
| **Python API** | < 200 MB | Slim base, multi-stage, no dev deps |
| **Go API** | < 20 MB | Scratch/distroless base, static binary |
| **Static site** | < 50 MB | Nginx Alpine base, build artifacts only |

### Reducing Image Size

```bash
# Check image size
docker images my-app

# Analyze image layers (what is taking up space)
docker history my-app:latest
# Or use dive for interactive exploration:
dive my-app:latest
```

Common size reductions:
1. **Switch to Alpine base:** 100 MB to 5 MB (base image alone)
2. **Multi-stage build:** Remove build tools, compilers, dev dependencies
3. **Prune unnecessary files:** `.git`, `tests/`, `docs/`, `*.md`
4. **Use .dockerignore:** Prevent copying unnecessary files into context
5. **Combine RUN layers:** Each `RUN` creates a layer; combine related commands

---

## Security Checklist for Containers

- [ ] Never run containers as root (use `USER` in Dockerfile)
- [ ] Pin base image versions (never use `:latest` in production)
- [ ] Scan images for vulnerabilities before deploy (Trivy, Grype)
- [ ] Do not store secrets in images (use environment variables or secret managers)
- [ ] Use read-only file systems where possible (`--read-only` flag)
- [ ] Limit container resources (CPU, memory limits)
- [ ] Keep base images updated (automated rebuild on base image update)
- [ ] Use distroless or scratch images for production where possible
- [ ] Sign your images (Docker Content Trust, cosign)
- [ ] Generate and store SBOMs (Software Bill of Materials) for every image

---

## Recommended Path for Most Projects

```
Day 1:   Deploy to Vercel/Railway (zero infrastructure)
         └── Focus on building the product, not the infrastructure

Month 3: Add Docker for local development (environment parity)
         └── docker-compose.yml for local, PaaS for production

Month 6: Containerize for production (if needed)
         └── Docker + Cloud Run / ECS Fargate
         └── Only if PaaS limitations are blocking you

Year 1+: Evaluate Kubernetes (if needed)
         └── Only if you have 10+ services AND DevOps capacity
         └── Most projects never reach this stage, and that is fine
```
