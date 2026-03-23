# Three-Way Verification

## The Problem

Single-source documentation drifts from reality. You can't trust a hub file just because it exists. You can't trust audit findings just because an AI wrote them. You need three independent sources to agree.

**Ultra TMS proof:** When hubs were written from specs, 97% had errors. When verified against code, accuracy jumped to ~95%. Adding PST cross-check caught the remaining 5%.

---

## The Three Sources

```
         HUB FILE                    PST FINDINGS                  ACTUAL CODE
    (what docs claim)           (what audit found)             (what actually runs)
           │                           │                              │
           └───────────┬───────────────┘                              │
                       │                                              │
                  Do hub and PST agree?                               │
                       │                                              │
                  Compare against code ─────────────────────────────────
                       │
                  All three agree?
                       │
                 YES: Hub is verified
                 NO: Fix the source that's wrong
```

### Source 1: Hub File
- The service's single-source-of-truth documentation
- Contains: endpoints, screens, components, data model, business rules
- **Risk:** Written from specs or memory, may be outdated

### Source 2: PST Findings
- Output from the Per-Service Tribunal audit
- Contains: verified counts, actual code paths, security findings
- **Risk:** AI may hallucinate findings or miss things

### Source 3: Actual Code
- The real implementation (backend controllers, frontend pages, schema files)
- Contains: what actually runs in production
- **Risk:** None — code is ground truth (but may have bugs)

---

## Verification Process

### Step 1: Compare Hub vs PST

| Section | Hub Says | PST Found | Match? | Action |
|---------|---------|-----------|--------|--------|
| Endpoint count | | | | |
| Screen count | | | | |
| Component count | | | | |
| Test count | | | | |
| Data model fields | | | | |
| Business rules | | | | |

For each mismatch:
- If PST found MORE than hub claims → Hub is understating, update hub
- If PST found LESS than hub claims → Hub may have phantom entries, verify against code

### Step 2: Verify Against Code

For every mismatch from Step 1, run code verification:

| Check | Command | Expected |
|-------|---------|----------|
| Endpoint count | `grep -r "@Get\|@Post\|@Put\|@Delete\|@Patch" src/modules/{service}/` | Matches PST finding |
| Screen count | `find app/{service} -name "page.tsx"` | Matches PST finding |
| Component count | `find components/{service} -name "*.tsx" \| wc -l` | Matches PST finding |
| Test count | `find . -path "*{service}*" -name "*.test.*" -o -name "*.spec.*"` | Matches PST finding |
| Model fields | Read schema file, count fields per model | Matches PST finding |

### Step 3: Resolve Discrepancies

| Scenario | Resolution |
|----------|-----------|
| Hub wrong, PST right, Code confirms PST | Fix hub |
| Hub right, PST wrong (hallucination) | Note PST error, keep hub |
| Both hub and PST wrong, code differs | Fix both hub and PST note |
| Hub wrong, PST wrong, code is ground truth | Fix hub, note PST limitation |

---

## When to Run Three-Way Verification

| Trigger | Scope |
|---------|-------|
| After every PST audit | The audited service's hub |
| After hub correction | Verify corrections are accurate |
| After major code changes | Any hub affected by the changes |
| Before phase gate | All P0 service hubs |
| Before release | All service hubs |

---

## Confidence Levels

After verification, assign a confidence level to the hub:

| Level | Meaning | Criteria |
|-------|---------|----------|
| **VERIFIED** | Three-way verified, all sources agree | Hub, PST, and code all match |
| **CORRECTED** | Hub was wrong, now fixed per code | Hub corrected, needs re-verification next sprint |
| **PARTIAL** | Some sections verified, others pending | At least header + endpoints verified |
| **UNVERIFIED** | Hub has not been through three-way check | Default state for new hubs |
| **STALE** | Hub was verified but code changed since | Last verified > 2 sprints ago |
