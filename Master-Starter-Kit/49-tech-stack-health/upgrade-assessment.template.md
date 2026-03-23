# Upgrade Assessment

> Complete this template before executing any stack upgrade, pivot, or major dependency addition. This is the decision framework that turns audit findings into GO/NO-GO decisions with documented rationale.

---

## Assessment Metadata

| Field | Value |
|-------|-------|
| **Assessment Date** | {{ASSESSMENT_DATE}} |
| **Assessor** | {{ASSESSOR_NAME}} |
| **Triggering Audit** | {{AUDIT_DATE}} — {{AUDIT_TRIGGER}} |
| **Project** | {{PROJECT_NAME}} |
| **Decision Deadline** | {{DECISION_DEADLINE}} |

---

## 1. Current State Summary

**Dependency under review:** {{DEPENDENCY_NAME}}

| Field | Value |
|-------|-------|
| Current version | |
| Latest stable version | |
| Versions behind | |
| In production since | |
| Used by (services/components) | |
| Direct dependents in codebase | __ files, __ imports |
| Why it was originally chosen | |

**Current problems (from audit):**

1. <!-- e.g., "2 major versions behind, current version EOL in 6 months" -->
2. <!-- e.g., "3 known CVEs with CVSS >= 7.0" -->
3. <!-- e.g., "Performance degrades above 50k concurrent connections" -->

---

## 2. Proposed Change

| Field | Value |
|-------|-------|
| **Change type** | UPGRADE / PIVOT / ADD / REMOVE |
| **Target** | <!-- e.g., "Upgrade from Next.js 13 to Next.js 15" or "Pivot from Express to Fastify" --> |
| **Target version** | |
| **Rationale** | |

**What this change accomplishes:**
- [ ] Resolves version currency issue
- [ ] Patches known CVEs
- [ ] Improves performance at scale
- [ ] Reduces infrastructure cost
- [ ] Addresses community health concerns (EOL, abandoned, license change)
- [ ] Other: ____

---

## 3. Effort Estimate

| Task | Estimated Developer-Days | Confidence |
|------|------------------------|------------|
| Code changes (API migrations, breaking changes) | | High / Medium / Low |
| Configuration updates (build, deploy, env) | | |
| Test updates (unit, integration, e2e) | | |
| Data migration (if applicable) | | |
| Documentation updates | | |
| QA and regression testing | | |
| Staging validation | | |
| Production rollout (gradual, canary, or big-bang) | | |
| **Total** | **____ developer-days** | |

**Effort classification:** TRIVIAL (< 1 day) / MINOR (1-3 days) / MODERATE (1-2 weeks) / MAJOR (1+ month) / REWRITE

**Confidence notes:** Explain any Low confidence estimates — what unknowns could blow up the timeline?

---

## 4. Risk Assessment

### What Could Break

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking API changes not caught by types | | | |
| Third-party plugin/library incompatibility | | | |
| Performance regression in new version | | | |
| Build/deploy pipeline failure | | | |
| Data format or schema incompatibility | | | |
| Browser compatibility regression | | | |
| Runtime behavior changes (subtle bugs) | | | |

**Likelihood:** HIGH / MEDIUM / LOW
**Impact:** CRITICAL (data loss, downtime) / HIGH (degraded functionality) / MEDIUM (cosmetic, workaround exists) / LOW (negligible)

### Dependency Chain Impact

Will this change force upgrades in other dependencies?

| Dependency | Required Change | Additional Effort |
|-----------|----------------|-------------------|
| | | |

**Total cascading effort:** ____ additional developer-days

---

## 5. Financial Impact

| Cost Category | Current (Monthly) | After Change (Monthly) | Delta |
|--------------|-------------------|----------------------|-------|
| Hosting / Compute | | | |
| Licensing fees | | | |
| Third-party service costs | | | |
| **Ongoing total** | | | **+/- $____/mo** |

| One-Time Cost | Estimate |
|--------------|----------|
| Developer time (effort estimate x day rate) | |
| Migration tooling or services | |
| Downtime cost (if applicable) | |
| **One-time total** | **$____** |

**Break-even timeline:** ____ months (one-time cost / monthly savings)

**Cross-reference:** Complete `cost-impact-analysis.template.md` for changes with monthly delta > $500 or one-time cost > $5,000.

---

## 6. Migration Path

Step-by-step plan for executing the change. Each step should be independently deployable where possible.

| Step | Description | Prerequisite | Estimated Duration | Rollback? |
|------|------------|-------------|-------------------|-----------|
| 1 | | | | Yes / No |
| 2 | | | | Yes / No |
| 3 | | | | Yes / No |
| 4 | | | | Yes / No |
| 5 | | | | Yes / No |

**Migration strategy:** BIG-BANG (all at once) / INCREMENTAL (step by step) / STRANGLER (run both, migrate gradually) / PARALLEL (run both, compare, then cut over)

**Recommended strategy and why:**

---

## 7. Rollback Plan

If the migration fails or introduces critical issues in production, how do you reverse it?

| Field | Value |
|-------|-------|
| **Rollback possible?** | YES / PARTIAL / NO |
| **Rollback method** | <!-- e.g., "Revert PR, redeploy previous version" or "Restore database from pre-migration backup" --> |
| **Rollback time estimate** | |
| **Data loss on rollback?** | YES (describe) / NO |
| **Rollback tested?** | YES / NO — must be YES before GO decision |

**Rollback steps:**

1. <!-- Step-by-step rollback procedure -->
2.
3.

**Point of no return:** Is there a step after which rollback becomes impossible or extremely costly? If yes, identify it and ensure extra validation before that step.

---

## 8. Decision

| Criterion | Assessment |
|-----------|-----------|
| Does the change resolve the identified problem? | YES / PARTIALLY / NO |
| Is the effort proportional to the benefit? | YES / NO |
| Is the risk acceptable? | YES / NO |
| Is a rollback plan tested and viable? | YES / NO |
| Is the financial impact acceptable? | YES / NO |
| Does the team have capacity to execute? | YES / NO |
| Is this the right time? (no competing priorities) | YES / NO |

### Decision: GO / NO-GO / DEFER

**Justification:**

<!-- 2-3 sentences explaining the decision. Reference specific data points from the assessment. -->

**If DEFER:**
- Defer until: ____
- Re-evaluate trigger: ____
- Risks of deferring: ____

---

## Approvals

| Role | Name | Decision | Date |
|------|------|----------|------|
| Tech Lead | | | |
| Product Owner | | | |
| Engineering Manager | | | |

---

## Post-Migration Validation

Complete after migration is executed.

- [ ] All automated tests passing
- [ ] Manual QA regression complete
- [ ] Performance benchmarks match or exceed pre-migration baseline
- [ ] No new security vulnerabilities introduced
- [ ] Monitoring confirms stable operation for 48+ hours
- [ ] Stack health audit template updated with new versions
- [ ] Documentation updated to reflect changes
