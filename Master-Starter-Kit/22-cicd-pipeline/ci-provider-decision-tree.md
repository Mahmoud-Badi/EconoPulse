# CI/CD Provider Decision Tree

> Use GitHub Actions unless you have a specific reason not to. If you do have a specific reason, this guide will help you choose the right alternative.

---

## The Decision Tree

```
Is your code on GitHub?
├── YES → Do you need complex pipeline orchestration (fan-out, matrix, conditional DAGs)?
│         ├── NO → GitHub Actions (stop here)
│         └── YES → Do you need >5 concurrent jobs regularly?
│                   ├── NO → GitHub Actions (stop here)
│                   └── YES → Is budget a primary concern?
│                             ├── YES → GitHub Actions with self-hosted runners
│                             └── NO → CircleCI or GitHub Actions (either works)
│
├── Is your code on GitLab?
│   └── YES → GitLab CI (built-in, no reason to add another tool)
│
├── Do you require 100% self-hosted / air-gapped?
│   └── YES → Jenkins or GitLab CI (self-managed)
│
└── Other / special requirements → See comparison table below
```

---

## Provider Comparison

### GitHub Actions

| Attribute | Details |
|-----------|---------|
| **Best for** | Teams already on GitHub (which is most teams) |
| **Pricing** | Free: 2,000 min/month. Team: 3,000 min/month. Enterprise: 50,000 min/month |
| **Runner options** | GitHub-hosted (Ubuntu, macOS, Windows) + self-hosted |
| **Configuration** | YAML in `.github/workflows/` |
| **Marketplace** | 20,000+ pre-built actions |
| **Container registry** | GHCR (GitHub Container Registry) included |
| **Secrets management** | Built-in, per-repo and per-org, environment-scoped |
| **Matrix builds** | Native support for matrix strategies |
| **Caching** | Built-in `actions/cache`, 10 GB per repo |
| **Concurrency** | 20 concurrent jobs (free), 60 (team), 180 (enterprise) |
| **Artifacts** | Built-in upload/download, configurable retention |

**Pros:**
- Zero setup if you are already on GitHub
- Massive ecosystem of community actions
- Generous free tier for open source (unlimited minutes)
- Tight integration with GitHub PRs, issues, releases, packages
- Environment protection rules and deployment approvals built-in
- Built-in dependency graph and security scanning (Dependabot)

**Cons:**
- YAML-only configuration (can get verbose for complex pipelines)
- macOS runners are 10x the cost of Linux runners
- GitHub-hosted runners have limited customization (no GPU, limited memory)
- No built-in pipeline visualization (DAG view)
- Debugging failed workflows can be painful (no SSH into runners without third-party actions)

**Best ecosystem fit:** Vercel, Netlify, AWS, GCP, Azure, Cloudflare, Railway, Fly.io -- essentially everything.

---

### GitLab CI

| Attribute | Details |
|-----------|---------|
| **Best for** | Teams on GitLab, or those wanting an all-in-one platform |
| **Pricing** | Free: 400 min/month. Premium: 10,000 min/month. Ultimate: 50,000 min/month |
| **Runner options** | Shared runners + self-hosted (GitLab Runner) |
| **Configuration** | YAML in `.gitlab-ci.yml` |
| **Container registry** | Built-in, per-project |
| **Secrets management** | CI/CD variables, per-project and per-group |
| **Visualization** | Built-in pipeline DAG visualization |
| **Environments** | Built-in environment tracking and deployment history |
| **Review apps** | Native support for dynamic review environments |

**Pros:**
- All-in-one platform (code, CI, registry, packages, security, monitoring)
- Best-in-class pipeline visualization
- Built-in review apps (auto-deploy per branch)
- More expressive YAML with `extends`, `include`, `rules`
- Built-in SAST, DAST, dependency scanning, container scanning (Ultimate tier)
- Parent-child pipelines for complex orchestration
- Self-hosted option (GitLab CE/EE) for air-gapped environments

**Cons:**
- Less generous free tier than GitHub Actions (400 vs 2,000 minutes)
- Smaller marketplace/ecosystem compared to GitHub Actions
- Self-hosted GitLab requires significant infrastructure and maintenance
- Can feel heavyweight for small projects
- Premium/Ultimate features (where the best security features live) are expensive

**Best ecosystem fit:** Kubernetes, AWS, GCP -- strong cloud-native integrations. Less native support for Vercel/Netlify style platforms.

---

### CircleCI

| Attribute | Details |
|-----------|---------|
| **Best for** | Teams needing fast, complex pipelines with advanced caching |
| **Pricing** | Free: 6,000 min/month. Performance: from $15/month. Scale: custom |
| **Runner options** | Cloud (Linux, macOS, Windows, ARM) + self-hosted |
| **Configuration** | YAML in `.circleci/config.yml` |
| **Docker support** | First-class Docker support, Docker Layer Caching (DLC) |
| **Orbs** | Reusable config packages (like GitHub Actions marketplace) |
| **SSH debugging** | Built-in SSH into failed jobs for debugging |
| **Caching** | Advanced caching with partial key matching |
| **Insights** | Built-in analytics dashboard (build times, flaky tests, credits) |

**Pros:**
- Industry-leading caching system (fastest cache restores)
- SSH debugging into failed builds (huge time-saver)
- Docker Layer Caching significantly speeds up Docker builds
- Excellent build insights and analytics
- Orbs ecosystem for reusable configurations
- Resource classes let you pick exact CPU/RAM per job
- Test splitting across parallel containers (built-in)

**Cons:**
- More expensive than GitHub Actions at scale
- Separate platform to manage (another login, another dashboard)
- Config syntax is different from GitHub Actions (team learning curve)
- Tighter credit model can surprise teams with unexpected bills
- Less native GitHub integration than GitHub Actions

**Best ecosystem fit:** Docker-heavy workflows, teams that need SSH debugging, organizations that prioritize pipeline speed above all else.

---

### Jenkins

| Attribute | Details |
|-----------|---------|
| **Best for** | Enterprise teams needing full control, self-hosted requirement |
| **Pricing** | Free (open source) -- but you pay for infrastructure and maintenance |
| **Runner options** | Self-hosted only (agents on any machine) |
| **Configuration** | Jenkinsfile (Groovy DSL) or Freestyle (UI-based) |
| **Plugins** | 1,800+ plugins for almost anything |
| **Flexibility** | Unlimited -- you can do literally anything |
| **Maintenance** | High -- you manage everything (updates, security, scaling) |

**Pros:**
- Free and open source
- Most flexible CI/CD platform in existence
- Run on any infrastructure (on-prem, cloud, hybrid)
- Massive plugin ecosystem for every tool and service
- Pipeline as code via Jenkinsfile
- Supports any language, any platform, any workflow
- Battle-tested at massive scale (used by the largest enterprises)

**Cons:**
- You are responsible for all infrastructure, scaling, and security
- Groovy DSL has a steep learning curve
- UI feels dated compared to modern alternatives
- Plugin compatibility issues are common (Plugin X breaks Plugin Y)
- No built-in secrets management (need a plugin or external service)
- Scaling requires managing agent pools, which is operational overhead
- Security vulnerabilities in Jenkins itself require prompt patching

**Best ecosystem fit:** Enterprise, on-premises, air-gapped environments, complex multi-language polyglot projects.

---

## Cost Comparison

### Monthly Cost by Team Size

| Provider | Solo Dev | Small Team (3-5) | Medium Team (8-15) | Large Team (20+) |
|----------|----------|-------------------|---------------------|-------------------|
| **GitHub Actions** | $0 | $0-4/user | $4-21/user | $21/user + runners |
| **GitLab CI** | $0 | $29/user (Premium) | $29/user | $99/user (Ultimate) |
| **CircleCI** | $0 | $15-50/month | $50-200/month | Custom pricing |
| **Jenkins** | $0 (infra cost) | $50-200/month (infra) | $200-1,000/month | $1,000+/month |

*GitHub Actions and CircleCI pricing is usage-based (minutes). GitLab pricing is per-user. Jenkins cost is pure infrastructure.*

### Cost per CI Minute

| Provider | Linux | macOS | Windows | Self-Hosted |
|----------|-------|-------|---------|-------------|
| **GitHub Actions** | $0.008/min | $0.08/min | $0.016/min | Free (your infra) |
| **GitLab CI** | $0.005/min (shared) | N/A (self-hosted) | N/A | Free (your infra) |
| **CircleCI** | $0.006/min (medium) | $0.08/min | $0.012/min | Free (your infra) |
| **Jenkins** | Your infra cost | Your infra cost | Your infra cost | Your infra cost |

### Break-Even: Self-Hosted vs Cloud Runners

For GitHub Actions, self-hosted runners become cost-effective when:
- **Solo / small team:** Almost never (free tier covers it)
- **Medium team:** ~15,000 minutes/month (~$120/month saved)
- **Large team:** ~30,000+ minutes/month (significant savings, but adds ops burden)

Rule of thumb: If your monthly CI bill exceeds $500 and your team has ops capacity, consider self-hosted runners.

---

## Feature Comparison Matrix

| Feature | GitHub Actions | GitLab CI | CircleCI | Jenkins |
|---------|---------------|-----------|----------|---------|
| **Setup effort** | Trivial | Trivial (GitLab) / Medium (self-hosted) | Low | High |
| **Learning curve** | Low | Low-Medium | Medium | High |
| **YAML config** | Yes | Yes | Yes | Groovy (Jenkinsfile) |
| **Pipeline visualization** | Basic | Excellent | Good | Good (Blue Ocean) |
| **Built-in container registry** | Yes (GHCR) | Yes | No | No |
| **Built-in security scanning** | Dependabot + CodeQL | SAST/DAST (Ultimate) | No (use orbs) | Plugins |
| **SSH debugging** | Third-party | No | Built-in | Via agents |
| **Matrix builds** | Native | Native | Native | Plugin |
| **Caching** | Good | Good | Excellent | Plugin |
| **Monorepo support** | Path filters | Rules + changes | Path filtering | Plugin |
| **Self-hosted option** | Yes | Yes | Yes | Only option |
| **Air-gapped support** | No | Yes (self-managed) | No | Yes |
| **Deployment approvals** | Environments | Environments | Workflows | Stages |
| **API** | Excellent | Excellent | Good | Extensive |
| **Mobile CI (iOS/Android)** | macOS runners | Self-hosted | macOS runners | Self-hosted |

---

## Decision by Use Case

### "I am building a web app on GitHub"
**Use GitHub Actions.** Zero setup, great ecosystem, free tier covers most small-medium projects.

### "I am building mobile apps (iOS + Android)"
**Use GitHub Actions or CircleCI.** Both offer macOS runners for iOS builds. CircleCI has better caching for large Gradle/Xcode builds.

### "My company uses GitLab"
**Use GitLab CI.** It is built-in, and using an external CI with GitLab adds unnecessary complexity.

### "I need the absolute fastest pipelines"
**Use CircleCI.** Docker Layer Caching, advanced caching, and resource classes give you the most control over speed.

### "I need full control over infrastructure"
**Use Jenkins.** If you need air-gapped, on-prem, or have extremely custom requirements, Jenkins is the only option.

### "I need built-in security scanning"
**Use GitLab CI (Ultimate) or GitHub Actions (Advanced Security).** Both offer integrated SAST, DAST, dependency scanning. GitLab's is more comprehensive out-of-the-box.

### "I have a monorepo"
**Any of them work**, but GitHub Actions with `dorny/paths-filter` or GitLab CI with `rules: changes` are the most straightforward. CircleCI has built-in path filtering. For very large monorepos, consider Nx Cloud or Turborepo with any provider.

### "Budget is my top priority"
**GitHub Actions** (generous free tier) or **Jenkins** (free software, pay for infra). If you have spare machines, Jenkins is the cheapest. If you do not, GitHub Actions' free tier is hard to beat.

---

## Migration Paths

### From Jenkins to GitHub Actions
1. Map Jenkinsfile stages to GitHub Actions jobs
2. Replace Jenkins plugins with GitHub Actions marketplace equivalents
3. Move secrets from Jenkins Credentials to GitHub Secrets
4. Replace Groovy scripting with shell scripts + action steps
5. Expect 2-4 weeks for a medium-complexity pipeline migration

### From CircleCI to GitHub Actions
1. Map `.circleci/config.yml` to `.github/workflows/`
2. Replace orbs with GitHub Actions
3. Update caching syntax (similar but different keys)
4. Move environment variables from CircleCI settings to GitHub Secrets
5. Expect 1-2 weeks for migration (configs are similar)

### From GitLab CI to GitHub Actions
1. Map `.gitlab-ci.yml` stages to GitHub Actions workflows
2. Replace `include` with reusable workflows / composite actions
3. Replace GitLab Container Registry with GHCR
4. Move CI/CD variables to GitHub Secrets
5. Expect 1-2 weeks for migration

---

## Final Recommendation

For 90% of projects:

> **Use GitHub Actions.** It is good enough for everything from a solo side project to a mid-size company. The ecosystem is the largest, the free tier is the most generous, and it requires zero additional infrastructure.

Switch to something else only when:
- You are already on GitLab (use GitLab CI)
- You need air-gapped/self-hosted (use Jenkins or GitLab self-managed)
- You need sub-5-minute pipelines at scale and are willing to pay for it (consider CircleCI)
- You have 50+ developers with complex orchestration needs (evaluate all options)
