# Parallel Operation Guide — When Source App Continues Post-Repurpose

> **When to use:** Your source application continues to serve customers while the repurposed version is being built and launched. Both codebases must coexist.

---

## Decision: Shared Codebase vs. Fork

### Shared Codebase (Feature Flags / Multi-Tenant)

**Use when:**
- Reuse is >75% (shallow pivot)
- Both verticals share the same data model with minor extensions
- Same team maintains both
- You want one deployment pipeline

**How it works:**
```
Source Code (single repo)
├── shared/              ← Common code (auth, DB, utils)
├── vertical-a/          ← Source vertical customizations
├── vertical-b/          ← Target vertical customizations
└── config/
    ├── vertical-a.json  ← Feature flags, terminology, integrations
    └── vertical-b.json
```

**Risks:**
- Feature flags accumulate and create maintenance burden
- "Shared" code starts acquiring vertical-specific conditionals
- Testing matrix doubles (every feature × every vertical)
- One vertical's urgency holds back the other

### Fork (Separate Repos)

**Use when:**
- Reuse is <75% (medium or deep pivot)
- Data models diverge significantly
- Different teams will maintain each
- Different compliance/regulatory requirements
- Different release cadences

**How it works:**
```
repo-source/             ← Original application
repo-target/             ← Forked at point-in-time
shared-packages/         ← Extracted shared libraries (versioned)
```

**Risks:**
- Security patches must be applied to both
- Shared libraries need careful versioning
- Teams lose context on each other's decisions
- Drift is permanent after ~6 months

---

## Shared Infrastructure Matrix

| Component | Share? | Rationale | Sync Strategy |
|-----------|--------|-----------|---------------|
| **Authentication** | YES | Same auth provider, different roles | Shared library, versioned |
| **Database** | DEPENDS | Same DB if shared model; separate if compliance requires isolation | Shared: same cluster, different schemas. Separate: different clusters |
| **File Storage** | YES | Same S3/Blob service, different buckets | Separate buckets, shared upload logic |
| **Email/Notifications** | YES | Same sending infrastructure, different templates | Shared service, template directory per vertical |
| **Monitoring** | YES | Same platform (Datadog/Grafana), different dashboards | Shared platform, separate alert rules |
| **CI/CD** | DEPENDS | Same pipeline template, may need different environments | Shared pipeline config, separate deployment targets |
| **CDN** | YES | Same CDN provider, different domains | Shared account, separate origin configs |
| **Search** | DEPENDS | Same engine if similar data; separate index per vertical | Shared cluster, separate indexes |
| **Background Jobs** | YES | Same queue infrastructure, different job types | Shared queue service, separate job handlers |
| **API Gateway** | DEPENDS | Same gateway if both are public API; separate if different auth models | Shared if possible, separate routes |

---

## Divergence Timeline

### Months 1-3: High Synchronization
- Cherry-picking security fixes: **easy** (codebases are similar)
- Shared library updates: **straightforward**
- Knowledge transfer between teams: **natural** (everyone remembers the source)
- Risk: temptation to keep sharing too much, creating fragile dependencies

### Months 3-6: Growing Divergence
- Cherry-picking: **requires adaptation** (surrounding code has changed)
- Shared libraries: **need version pinning** (breaking changes emerging)
- Knowledge transfer: **requires intentional effort** (teams are specializing)
- Risk: "we'll sync later" debt accumulating

### Months 6-12: Practical Independence
- Cherry-picking: **usually not worth the effort** (too much context has changed)
- Shared libraries: **frozen or independently versioned**
- Knowledge transfer: **documentation-based** (not verbal)
- Risk: duplicating effort unknowingly

### Month 12+: Full Independence
- Treat as completely separate products
- Shared libraries are stable packages, versioned independently
- Teams have no expectation of code sharing
- Communication is about business strategy, not code

---

## Cherry-Pick Protocol

When a fix in the source app should be applied to the fork:

### Step 1: Evaluate Applicability
```
Does this fix apply to the fork?
├── Security fix → Almost always YES
├── Bug fix → Check if the code path exists in the fork
├── Feature → Almost always NO (features diverge)
├── Dependency update → YES if shared dependency
└── Infrastructure → DEPENDS on shared infra
```

### Step 2: Cherry-Pick (Not Merge)
```bash
# In the fork repo:
git cherry-pick <commit-hash>
# If conflicts, resolve manually
# NEVER: git merge source/main (brings unwanted changes)
```

### Step 3: Adapt Context
- Check that the fix makes sense in the fork's context
- Variable names, table names, and function signatures may have diverged
- Run the fork's test suite — don't assume source tests apply

### Step 4: Document
```markdown
## Cherry-Pick Log

| Date | Source Commit | Description | Adapted? | Fork Commit |
|------|-------------|-------------|----------|-------------|
| 2024-03-15 | abc123 | XSS fix in input sanitizer | No changes needed | def456 |
| 2024-03-20 | ghi789 | Rate limiter bypass fix | Adapted for different middleware stack | jkl012 |
```

---

## Communication Protocol Between Teams

### Weekly Sync (15 min)
- Security fixes applied this week
- Shared library changes
- Infrastructure changes that affect both
- Upcoming changes that might create conflicts

### Monthly Review (30 min)
- Divergence assessment: are we still sharing what we should?
- Shared library health check: are versions current?
- Cost review: is shared infrastructure still cost-effective?
- Decision: should any shared component be split?

### Escalation Triggers
- Security vulnerability in shared code → immediate cross-team notification
- Shared library breaking change → 2-week notice minimum
- Infrastructure migration → joint planning session
- One team needs to fork a shared library → decision meeting

---

## Cost Management

### Shared Cost Allocation

| Resource | Allocation Method | Example |
|----------|------------------|---------|
| Infrastructure (shared services) | 50/50 or by usage | Monitoring: 50/50. CDN: by bandwidth |
| Shared library maintenance | Alternating sprints | Team A maintains in Q1, Team B in Q2 |
| Security audits | Split by scope | Shared components: 50/50. Vertical-specific: own team |
| On-call | Separate rotations | Each team owns their vertical's on-call |

### When to Stop Sharing

Stop sharing a component when:
1. **More time is spent coordinating than the sharing saves** — meetings about the shared component exceed the development time it saves
2. **One vertical's requirements are blocking the other** — the shared component can't evolve to serve both
3. **Compliance requires isolation** — regulatory changes force separation
4. **Team sizes diverge significantly** — a 2-person team sharing with a 20-person team creates friction

---

## Pitfalls

1. **"We'll keep them in sync" is a lie after 6 months.** Plan for independence from day one. Shared components should be extracted as versioned libraries immediately, not "when we have time."

2. **Don't share the database schema.** Even for shallow pivots, give each vertical its own schema (or database). Shared schemas create coupling that's nearly impossible to break later.

3. **Security fixes are the one thing worth cherry-picking forever.** Everything else can drift. Security cannot.

4. **Feature parity is not a goal.** The whole point of the repurpose is that the verticals serve different needs. Don't let one vertical's feature list drive the other's roadmap.

5. **Assign a "bridge" person for the first 3 months.** One person who understands both codebases and can identify when a fix should cross over. After 3 months, this role naturally fades as the codebases diverge.
