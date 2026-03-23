# Stack Health Audit Report

> Comprehensive health assessment of the current technology stack. Complete this template at every audit cycle to maintain a historical record of stack health over time.

---

## Audit Metadata

| Field | Value |
|-------|-------|
| **Audit Date** | {{AUDIT_DATE}} |
| **Audit Depth** | {{AUDIT_DEPTH}} |
| **Auditor** | {{AUDITOR_NAME}} |
| **Previous Audit** | {{LAST_AUDIT_DATE}} |
| **Trigger** | {{AUDIT_TRIGGER}} |
| **Project** | {{PROJECT_NAME}} |
| **Active Users** | {{ACTIVE_USERS}} |

---

## 1. Version Currency

Compare current versions against latest stable releases. Flag anything more than one major version behind or within 6 months of EOL.

| Dependency | Category | Current Version | Latest Stable | Versions Behind | EOL Date | Status |
|-----------|----------|----------------|---------------|-----------------|----------|--------|
| {{FRONTEND_FRAMEWORK}} | Framework | {{FRONTEND_VERSION}} | | | | |
| {{BACKEND_FRAMEWORK}} | Framework | {{BACKEND_VERSION}} | | | | |
| {{DATABASE}} | Database | {{DATABASE_VERSION}} | | | | |
| {{CSS_FRAMEWORK}} | Styling | | | | | |
| {{AUTH_PROVIDER}} | Auth | | | | | |
| Node.js | Runtime | | | | | |
| | ORM | | | | | |
| | Package Manager | | | | | |

**Status key:** CURRENT (latest or latest-1 minor) / BEHIND (1+ minor behind) / OUTDATED (1+ major behind) / EOL (end of life or within 6 months of EOL)

**Version currency summary:**
- Total dependencies audited: ____
- CURRENT: ____
- BEHIND: ____
- OUTDATED: ____
- EOL: ____

---

## 2. Security

Dependency-level vulnerabilities in the current stack. This is NOT a full application security audit (see Section 14). This covers known CVEs in your dependency tree.

| Check | Result | Details |
|-------|--------|---------|
| `npm audit` / `pip audit` / equivalent | | Critical: __ High: __ Moderate: __ Low: __ |
| Known CVEs in direct dependencies | | List any CVEs with CVSS >= 7.0 |
| Supply chain risks | | Any deps with compromised maintainer accounts, typosquat alerts |
| Last dependency update | | Date of last `package.json` / equivalent update |
| Lock file freshness | | Date of last lock file regeneration |
| Deprecated packages in use | | Count and list |

**Critical CVEs requiring immediate action:**

| CVE ID | Package | Severity | Exploitable in Our Context? | Remediation |
|--------|---------|----------|----------------------------|-------------|
| | | | | |

**Security verdict:** CLEAN / ACCEPTABLE / NEEDS-ACTION / CRITICAL

---

## 3. Performance

Are any dependencies creating performance problems at current scale? Will they at projected scale?

| Dependency | Current Performance | Issue at 2x Scale? | Issue at 10x Scale? | Notes |
|-----------|-------------------|--------------------|--------------------|-------|
| {{DATABASE}} | | | | Query patterns, indexing, connection pooling |
| {{FRONTEND_FRAMEWORK}} | | | | Bundle size, hydration time, core web vitals |
| {{HOSTING_PROVIDER}} | | | | Cold starts, bandwidth, compute limits |
| ORM / Query Builder | | | | N+1 queries, memory usage, connection overhead |
| State Management | | | | Client-side memory, re-render performance |

**Bundle size audit:**
- Total JS bundle (gzipped): ____ KB
- Largest dependency contribution: ____ (____KB)
- Tree-shaking effectiveness: ____

**Performance verdict:** HEALTHY / MONITOR / DEGRADING / CRITICAL

---

## 4. Cost

Current monthly cost per service and projected costs at scale. Feed results into `25-financial-modeling/infrastructure-cost-model.template.md`.

| Service | Provider | Current Monthly | Projected 2x Users | Projected 10x Users | Pricing Model |
|---------|----------|----------------|--------------------|--------------------|---------------|
| Hosting / Compute | {{HOSTING_PROVIDER}} | | | | |
| Database | | | | | |
| Authentication | {{AUTH_PROVIDER}} | | | | |
| File Storage / CDN | | | | | |
| Email / Notifications | | | | | |
| Monitoring / Logging | | | | | |
| CI/CD | | | | | |
| Domain / DNS | | | | | |
| **Total** | | **{{MONTHLY_INFRA_COST}}** | | | |

**Cost scaling pattern:** LINEAR / SUBLINEAR / SUPERLINEAR — Superlinear cost scaling is a red flag requiring immediate attention.

**Cost anomalies:** Note any services where cost has increased disproportionately to usage growth.

**Cost verdict:** EFFICIENT / ACCEPTABLE / EXPENSIVE / UNSUSTAINABLE

---

## 5. Community Health

For each major dependency, assess the health of its open-source community. A dependency with a declining community is a future migration risk.

| Dependency | GitHub Stars | Star Trend (6mo) | Monthly Commits | Open Issues | Maintainer Count | Last Release | Corporate Backing |
|-----------|-------------|-------------------|-----------------|-------------|------------------|-------------|-------------------|
| {{FRONTEND_FRAMEWORK}} | | | | | | | |
| {{BACKEND_FRAMEWORK}} | | | | | | | |
| {{CSS_FRAMEWORK}} | | | | | | | |
| ORM | | | | | | | |

**Community health flags:**
- [ ] Any dependency with < 5 commits in last 6 months?
- [ ] Any dependency with sole maintainer (bus factor = 1)?
- [ ] Any dependency where corporate sponsor has withdrawn?
- [ ] Any dependency with unanswered security issues > 30 days?

**Community verdict:** THRIVING / STABLE / DECLINING / ABANDONED

---

## 6. Migration Risk

For any dependency flagged as OUTDATED, EOL, CRITICAL, or ABANDONED, estimate migration effort.

| Dependency | Recommended Action | Estimated Effort | Breaking Changes | Migration Guide Available? | Blocking Issues |
|-----------|-------------------|-----------------|-----------------|---------------------------|-----------------|
| | | | | | |

**Effort key:** TRIVIAL (< 1 day) / MINOR (1-3 days) / MODERATE (1-2 weeks) / MAJOR (1+ month) / REWRITE (fundamental architecture change)

---

## 7. Per-Dependency Recommendation

Final verdict for each major dependency in the stack.

| Dependency | Version Status | Security | Performance | Cost | Community | **Verdict** | Justification |
|-----------|---------------|----------|-------------|------|-----------|-------------|---------------|
| {{FRONTEND_FRAMEWORK}} | | | | | | | |
| {{BACKEND_FRAMEWORK}} | | | | | | | |
| {{DATABASE}} | | | | | | | |
| {{CSS_FRAMEWORK}} | | | | | | | |
| {{AUTH_PROVIDER}} | | | | | | | |
| {{HOSTING_PROVIDER}} | | | | | | | |

**Verdict key:**
- **KEEP** — No action required. Dependency is healthy across all dimensions.
- **UPGRADE** — Current version has issues. Upgrade to latest within current major version or next major.
- **PIVOT** — Fundamental problems (EOL, abandoned, license change, cost). Evaluate alternatives.
- **MONITOR** — No action now, but watch closely. Re-evaluate at next audit.

---

## Overall Stack Health Score

| Dimension | Score (1-5) | Weight | Weighted Score |
|-----------|------------|--------|----------------|
| Version Currency | | 0.15 | |
| Security | | 0.25 | |
| Performance | | 0.20 | |
| Cost | | 0.15 | |
| Community Health | | 0.10 | |
| Migration Risk | | 0.15 | |
| **Total** | | **1.00** | **/5.0** |

**Interpretation:** >= 4.0 Healthy / 3.0-3.9 Monitor / 2.0-2.9 Action Required / < 2.0 Critical

---

## Action Items

| Priority | Action | Owner | Deadline | Linked Assessment |
|----------|--------|-------|----------|-------------------|
| P0 (Critical) | | | | |
| P1 (High) | | | | |
| P2 (Medium) | | | | |
| P3 (Low) | | | | |

**Next audit scheduled:** {{NEXT_AUDIT_DATE}}
