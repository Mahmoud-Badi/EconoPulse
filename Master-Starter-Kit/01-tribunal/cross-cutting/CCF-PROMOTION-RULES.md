# Cross-Cutting Finding Promotion Rules

## What is a Cross-Cutting Finding (CCF)?

A CCF is a problem, pattern, or anti-pattern discovered during Per-Service Tribunals that affects multiple services. Instead of fixing the same issue N times independently, CCFs are tracked centrally and fixed systematically.

---

## Promotion Criteria

### When to Promote (Local → Systemic)

A finding gets promoted to CCF when:

| Trigger | Threshold | Example |
|---------|-----------|---------|
| **Service count** | Found in ≥ 3 services | Missing tenant isolation in 4+ modules |
| **Severity escalation** | P0/STOP-SHIP in ANY service | SQL injection in even one service |
| **Pattern match** | Same root cause across services | All hooks missing envelope unwrap |
| **Architectural scope** | Affects shared infrastructure | Auth guard misconfiguration |

### When NOT to Promote

- Finding is unique to one service's domain logic
- Finding is already tracked as a known issue in that service's hub
- Finding is a cosmetic/style issue (P2 or lower) in only 1-2 services

---

## Promotion Process

### Step 1: Identify Candidate

During PST Phase 5E (Cross-Service Findings), the auditor flags findings that may affect other services:

```markdown
| Finding | Affected Services | Severity | CCF Candidate? |
|---------|------------------|----------|---------------|
| Missing tenantId filter | Auth, CRM, Sales | HIGH | YES — check remaining services |
```

### Step 2: Verify Across Services

After each batch of PSTs:
1. Collect all CCF candidates from that batch
2. Check if previous batches had the same finding
3. Count confirmed affected services

### Step 3: Promote if Threshold Met

If ≥ 3 services confirmed:
1. Create `CCF-XXX.md` from CCF-TEMPLATE.md
2. Add to `CCF-TRACKER-TEMPLATE.md`
3. Update all affected PST files to reference the CCF

### Step 4: Update Count as More Services Audited

As subsequent batches find the same issue in more services:
1. Update the CCF's "Affected Services" list
2. Update the "Affected Count"
3. Re-assess severity (more services affected = higher priority)

---

## Severity Escalation Rules

| Affected Count | Minimum Severity |
|---------------|-----------------|
| 3-5 services | MEDIUM (at minimum) |
| 6-10 services | HIGH (at minimum) |
| 11+ services | CRITICAL (at minimum) |
| All services | CRITICAL + STOP-SHIP candidate |

---

## Deduplication Rules

Before creating a new CCF, check:

1. **Exact duplicate:** Same finding already exists as CCF → Add new service to existing CCF
2. **Subset:** New finding is a specific case of an existing broader CCF → Add as sub-finding
3. **Related but distinct:** Same area but different root cause → Create new CCF, cross-reference
4. **Truly new:** No existing CCF covers this → Create new CCF

---

## Resolution Priority

CCFs are fixed in this order:

1. **CRITICAL + Security:** Fix immediately, dedicated sprint if needed
2. **CRITICAL + Data Integrity:** Fix in current sprint
3. **HIGH:** Fix in next sprint
4. **MEDIUM:** Add to backlog with target sprint
5. **LOW:** Track but deprioritize

---

## Relationship to Other Systems

| System | How CCFs Interact |
|--------|------------------|
| **Sprint Planning** | CCFs generate sprint tasks (one task per CCF, applied to all affected services) |
| **Anti-Pattern System** | Recurring CCFs become documented anti-patterns with prevention rules |
| **Hub Corrections** | CCF resolution triggers hub updates across all affected services |
| **ADR System** | Architectural CCFs may require new ADRs to prevent recurrence |
| **Quality Gates** | CCF checks added to quality gate checklists |
