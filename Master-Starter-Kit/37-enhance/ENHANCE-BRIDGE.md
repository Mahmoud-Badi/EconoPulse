# Enhance Bridge

**Purpose:** A compressed version of the Enhance path that creates the minimum `dev_docs/` scaffolding needed for kit-upgrade and master-kit-upgrade to operate on non-kit projects. This is NOT the full Enhance path — it's a fast bridge (~15-30 minutes) that produces enough artifacts for the upgrade engines to start working.

**Invoked by:**
- kit-upgrade Step 2 (when `dev_docs/` is absent and maturity >= MID_BUILD)
- master-kit-upgrade Phase 0.5 (same conditions)
- Directly via `/kit-upgrade bridge`

**Output:** A populated `dev_docs/` directory with audit artifacts, quality scorecard, gap analysis, enhancement backlog, `.kit-meta.json`, and STATUS.md.

---

## When This Runs

This bridge activates when ALL of the following are true:

1. The user invoked `/kit-upgrade` or `/master-kit-upgrade`
2. `PROJECT_PATH/dev_docs/` does NOT exist
3. The Project Maturity Detector classified the project as `MID_BUILD` or `MATURE` (score >= 26)

If the project is `GREENFIELD` or `EARLY_BUILD` without kit artifacts, the upgrade skill should direct the user to run `/kit` first instead of running this bridge.

---

## Bridge Sequence

Execute these steps in order. Each step references an existing Enhance path protocol file but runs it in a compressed mode.

### Bridge Step 1 — Auto-Intake (from ENHANCE-INTAKE.md)

Run **Phase 1 only** (auto-scan) from `37-enhance/ENHANCE-INTAKE.md`:

1. Scan all Priority 1-4 file categories listed in ENHANCE-INTAKE.md
2. Build the pre-fill table (application name, language, framework, database, etc.)
3. Present the detected stack to the user for confirmation
4. **Do NOT run Phase 2** (the 12 targeted questions) — this is a bridge, not a full intake

**Output:** `dev_docs/intake/enhance-intake.md`

Content of the intake file:
```markdown
# Enhance Bridge Intake

**Generated:** {{DATE}}
**Mode:** Enhance Bridge (auto-scan only, no interview)
**Source:** PROJECT-MATURITY-DETECTOR → ENHANCE-BRIDGE

## Detected Stack

| Field | Value | Confidence |
|-------|-------|------------|
| Application name | {{detected}} | {{High/Medium/Low}} |
| Primary language | {{detected}} | {{confidence}} |
| Framework(s) | {{detected}} | {{confidence}} |
| Database | {{detected}} | {{confidence}} |
| Test framework | {{detected}} | {{confidence}} |
| CI/CD | {{detected}} | {{confidence}} |
| Deployment | {{detected}} | {{confidence}} |

## Project Metrics

- Source files: {{N}}
- Test files: {{N}}
- Git commits: {{N}} total, {{N}} in last 30 days
- Existing docs: {{list of doc locations found}}
- Existing task tracking: {{description of any tracker found}}

## Full Enhance Intake Pending

This intake was generated in bridge mode (auto-scan only).
For a complete intake with targeted questions about pain points, goals, and constraints,
run the full Enhance path: read `37-enhance/ENHANCE-INTAKE.md` and execute Phase 2.
```

---

### Bridge Step 2 — Rapid Audit (from DEEP-AUDIT-GENERATOR.md)

Run `37-enhance/DEEP-AUDIT-GENERATOR.md` in **single-round mode**:

- Execute **Round 1 (Surface Scan) only** for each of the 6 dimensions
- Skip Round 2 (Deep Dive) and Round 3 (Recommendations) — those require the full Enhance path
- Each dimension produces an abbreviated audit report

**Dimensions to scan (all 6):**
1. **Architecture** — service boundaries, patterns, coupling, code organization
2. **UX** — user flows, accessibility, responsive design, error handling
3. **Performance** — bundle size, load times, caching, database queries
4. **Security** — auth patterns, input validation, dependency vulnerabilities, secrets handling
5. **Testing** — coverage gaps, test quality, missing test types (unit/integration/E2E)
6. **Documentation** — inline docs, README quality, API docs, architecture docs

**Output:** One file per dimension at `dev_docs/audit/enhance-audit-{dimension}.md`

Each file follows this abbreviated format:
```markdown
# Enhance Bridge Audit — {{Dimension}}

**Mode:** Surface scan (Round 1 only)
**Date:** {{DATE}}
**Full audit pending:** Yes — run full Enhance path for Rounds 2-3

## Findings

### Critical (must fix)
- {{finding with file path and line reference}}

### High (should fix)
- {{finding}}

### Medium (consider fixing)
- {{finding}}

## Score: {{N}}/10

## Summary
{{2-3 sentence summary of this dimension's health}}
```

---

### Bridge Step 3 — Quality Scorecard (from QUALITY-SCORECARD.md)

Run `37-enhance/QUALITY-SCORECARD.md` using the 6 dimension scores from Bridge Step 2.

**Weights:**
- Architecture: 25%
- Security: 25%
- Testing: 20%
- UX: 15%
- Performance: 10%
- Documentation: 5%

**Output:** `dev_docs/audit/quality-scorecard.md`

Include the composite score and the tier classification:
- Composite >= 7: **Targeted Hardening** (mostly additive work)
- Composite 5-6: **Comprehensive Enhancement** (significant improvement needed)
- Composite <= 4: **Full Rebuild Considerations** (major structural issues)

Also identify the **Top 3 Blockers** — the highest-severity findings that should be addressed first.

---

### Bridge Step 4 — Gap Analysis (from GAP-ANALYZER.md)

Run `37-enhance/GAP-ANALYZER.md` using the audit findings from Bridge Step 2.

Compare the existing project against kit standards across 6 dimensions:
1. **Services** — are services properly bounded, documented, and specified?
2. **Screens** — are screens cataloged with specs, states, and responsive behavior?
3. **Tasks/Backlog** — is work tracked with proper task files?
4. **Infrastructure/DevOps** — CI/CD, Docker, monitoring, environment management?
5. **Testing** — unit, integration, E2E coverage with proper infrastructure?
6. **Documentation** — architecture docs, API docs, design system docs?

Distinguish between:
- **Exists but poor** (audit finding — needs improvement)
- **Entirely missing** (gap — needs creation)

**Output:** `dev_docs/audit/gap-analysis.md`

---

### Bridge Step 5 — Enhancement Backlog (from ENHANCEMENT-BACKLOG.md)

Run `37-enhance/ENHANCEMENT-BACKLOG.md` using the audit + gap analysis outputs.

Convert all findings into a 3-tier prioritized backlog:

- **Tier 1 — Blockers & Quick Wins** (<=1 week each): Critical security issues, broken tests, missing error handling, easy config fixes
- **Tier 2 — Core Enhancements** (1-4 weeks each): Architecture improvements, missing test coverage, performance optimization, accessibility
- **Tier 3 — Depth & Polish** (4+ weeks each): Design system overhaul, comprehensive docs, advanced monitoring, expansion features

Each backlog item includes:
- Description of what needs to change
- Which audit finding or gap it addresses
- Acceptance criteria
- Effort estimate (T-shirt size: S/M/L/XL)
- Dependencies on other items

**Output:** `dev_docs/enhancement-backlog.md`

---

### Bridge Step 6 — Scaffold Kit Artifacts

Create the minimum kit artifacts that the upgrade engines need:

#### 6a — Create `.kit-meta.json`

**Output:** `dev_docs/.kit-meta.json`

```json
{
  "kit_version": "1.2.0",
  "path": "enhance-bridge",
  "project_name": "{{detected from package.json or README}}",
  "stack": {
    "language": "{{detected}}",
    "framework": "{{detected}}",
    "database": "{{detected}}",
    "test_framework": "{{detected}}"
  },
  "steps_completed": ["0.5-maturity", "E1-rapid", "E2-scorecard", "E3-gaps", "E4-backlog"],
  "bridge_source": "{{kit-upgrade | master-kit-upgrade}}",
  "bridge_date": "{{ISO_TIMESTAMP}}",
  "maturity_score": "{{N}}",
  "maturity_class": "{{classification}}",
  "full_enhance_audit_pending": true,
  "full_enhance_intake_pending": true
}
```

#### 6b — Create `STATUS.md`

**Output:** `dev_docs/STATUS.md`

Bootstrap from the Enhancement Backlog tiers. Convert each Tier 1 and Tier 2 item into a task checkbox:

```markdown
# Project Status — {{Project Name}}

**Generated:** {{DATE}} via Enhance Bridge
**Maturity Score:** {{N}}/100 ({{classification}})
**Quality Composite:** {{N}}/10 ({{tier name}})

---

## Enhancement Tasks

### Tier 1 — Blockers & Quick Wins
- [ ] {{backlog item 1}}
- [ ] {{backlog item 2}}
- ...

### Tier 2 — Core Enhancements
- [ ] {{backlog item 1}}
- [ ] {{backlog item 2}}
- ...

### Tier 3 — Depth & Polish (deferred)
> These items are tracked in `dev_docs/enhancement-backlog.md` and will be
> converted to tasks after Tier 1 and Tier 2 are addressed.

---

## Pending Actions
- [ ] Run full Enhance Intake (Phase 2 of ENHANCE-INTAKE.md) for targeted questions
- [ ] Run full Deep Audit (Rounds 2-3 of DEEP-AUDIT-GENERATOR.md) for comprehensive findings
```

#### 6c — Create directory structure

Ensure these directories exist (create if missing):
- `dev_docs/intake/`
- `dev_docs/audit/`
- `dev_docs/specs/` (empty — will be populated by upgrade or enhance)
- `dev_docs/tasks/` (empty — will be populated by Wave 6 / Phase 10.11)

---

### Bridge Step 7 — Handoff to Upgrade Engine

After all artifacts are created, display a bridge completion summary:

```
ENHANCE BRIDGE COMPLETE
========================
Created dev_docs/ with:
  - intake/enhance-intake.md (auto-scanned stack profile)
  - audit/enhance-audit-{6 dimensions}.md (surface-level findings)
  - audit/quality-scorecard.md (composite: {{N}}/10 — {{tier}})
  - audit/gap-analysis.md ({{N}} gaps identified)
  - enhancement-backlog.md ({{N}} items across 3 tiers)
  - .kit-meta.json (bridge metadata)
  - STATUS.md ({{N}} enhancement tasks)

Quality Composite: {{N}}/10
Top 3 Blockers:
  1. {{blocker}}
  2. {{blocker}}
  3. {{blocker}}

Resuming {{kit-upgrade | master-kit-upgrade}} with these artifacts...
```

Then return control to the calling skill (kit-upgrade or master-kit-upgrade) to continue with its normal flow.

---

## What Comes After the Bridge

The bridge creates a **foundation**, not a final state. Two follow-up actions are flagged in `.kit-meta.json`:

1. **`full_enhance_intake_pending: true`** — The bridge only ran auto-scan (Phase 1). The full Enhance Intake (Phase 2) with 12 targeted questions about pain points, goals, and constraints can be run later for deeper understanding.

2. **`full_enhance_audit_pending: true`** — The bridge only ran Round 1 (surface scan) of the 6-dimension audit. Rounds 2-3 (deep dive + recommendations) can be triggered by:
   - Running `/kit-upgrade` again (it checks this flag and offers to run the full audit)
   - Running the full Enhance path manually

These pending flags ensure no depth is permanently lost — the bridge trades initial speed for eventual completeness.

---

## Preserving Existing Project Artifacts

The bridge MUST respect existing project artifacts:

- **Existing docs (e.g., `docs/`):** Referenced in the intake and audit, never overwritten or moved
- **Existing task tracking (e.g., `docs/MASTER-TRACKER.md`):** Noted in intake, not duplicated. STATUS.md tracks enhancement tasks only, not existing project tasks
- **Existing tests:** Audited for quality and coverage, never deleted or modified
- **Existing CI/CD:** Audited, not reconfigured
- **Git history:** Read-only (used for activity signals)

The bridge adds `dev_docs/` alongside whatever the project already has. It never modifies existing project files.
