# PST Verdict Categories

## The Four Verdicts

Every Per-Service Tribunal concludes with one of four binding verdicts. The verdict determines what happens next for the service.

---

### AFFIRM

**Meaning:** The service hub is accurate AND the service implementation is healthy.

**Criteria:**
- Hub Score ≥ 8/10
- Verified Score ≥ 8/10
- Delta between -1 and +1
- No P0 or STOP-SHIP findings
- No false claims in hub (phantom endpoints, fake test counts, etc.)

**What happens next:**
- Hub file is marked as "Tribunal Verified" with date
- Service enters maintenance mode
- No immediate action items required
- Re-audit only at next phase gate or if major changes occur

**Expected frequency:** ~5-15% of services (most services need at least minor corrections)

---

### MODIFY

**Meaning:** The hub needs corrections AND/OR the service needs additional work.

**Criteria (any of these triggers MODIFY):**
- Hub Score < 8 (documentation inaccurate)
- Verified Score < 8 (implementation incomplete)
- Delta outside -1 to +1 (hub doesn't reflect reality)
- P1 or P2 findings exist
- Hub has phantom entries (lists things that don't exist in code)
- Hub is missing entries (real code not documented)

**What happens next:**
- Hub corrections applied per CORRECTION-CHECKLIST.md
- Action items added to sprint backlog with priorities (P0/P1/P2)
- New tasks generated for implementation gaps
- Re-audit at next sprint if P0 items existed

**Expected frequency:** ~70-85% of services (the most common verdict)

**Sub-categories:**
- **MODIFY-MINOR:** 1-5 corrections, no P0 items, delta ≤ ±2
- **MODIFY-MAJOR:** 6+ corrections, P0 items exist, delta > ±3
- **MODIFY-REWRITE:** Hub needs complete rewrite (but service code is fine)

---

### REVERSE

**Meaning:** The hub is fundamentally misleading and the service has critical problems.

**Criteria (any of these triggers REVERSE):**
- Hub Score ≤ 3/10 (hub is mostly fabricated)
- Verified Score ≤ 3/10 (service barely exists)
- Delta ≤ -5 (hub claims far exceed reality)
- STOP-SHIP security vulnerabilities found
- Service is a complete stub masquerading as implemented

**What happens next:**
- Hub file is deleted and rewritten from scratch via code inspection
- Service is flagged for emergency sprint attention
- All dependent services are notified of reliability concerns
- STOP-SHIP items escalated immediately

**Expected frequency:** ~0-5% of services (rare, indicates systemic documentation failure)

---

### DEFER

**Meaning:** The service cannot be fully assessed right now.

**Criteria:**
- External dependency is blocking assessment (API not deployed, third-party service unavailable)
- Service is in active development and assessment would be stale within days
- Requires runtime verification that cannot be done in current environment
- Blocked by another service's unresolved issues

**What happens next:**
- Document what WAS assessed and what's blocked
- Schedule re-audit for specific date or milestone
- Partial findings still recorded (don't waste the work done)
- Blocking dependency tracked in project status

**Expected frequency:** ~5-10% of services

---

## Verdict Decision Tree

```
START
  │
  ├── Can the service be fully assessed?
  │     NO → DEFER
  │     YES ↓
  │
  ├── Hub Score ≤ 3 OR Verified Score ≤ 3 OR Delta ≤ -5?
  │     YES → REVERSE
  │     NO ↓
  │
  ├── Hub Score ≥ 8 AND Verified Score ≥ 8 AND |Delta| ≤ 1 AND no P0 findings?
  │     YES → AFFIRM
  │     NO ↓
  │
  └── MODIFY (with sub-category based on severity)
```

---

## Recording Verdicts

In the PST file, Phase 4 Round 5:

```markdown
### Round 5: Binding Verdict

**VERDICT:** MODIFY

**Hub Score (before audit):** 5.5/10
**Verified Score (after audit):** 7.0/10
**Delta:** +1.5

**Rationale:** Hub understated endpoint count (12 missing from listing),
had 3 phantom components, and claimed "no tests" when 7 test suites exist.
Service code is healthier than hub suggests. Hub needs correction,
2 P1 security items need attention.

**Action Groups:**
1. Hub corrections (16 items) — apply per CORRECTION-CHECKLIST
2. Security hardening (2 P1 items) — add to next sprint
3. Test coverage (add integration tests) — backlog
```
