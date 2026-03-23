# Output Ownership Model

> **Purpose:** Map every output file type to its owning generator, define which generators may also modify it, and establish lock semantics to prevent conflicting writes. If two generators both want to write the same file, this document settles who owns it and how conflicts are prevented.

---

## Ownership Rules

1. **Every output file has exactly ONE owning generator.** The owner is the generator that creates the file and is responsible for its structure.
2. **Secondary generators may modify files they do not own**, but only within their designated scope (specific sections, append-only, or metadata updates).
3. **Conflicting writes are resolved by ownership** — the owner's version wins. Secondary generators must not overwrite owner-written sections.
4. **Lock semantics define HOW a file can be modified** — full-rewrite means the owner regenerates the entire file; append-only means content is added but never removed; section-scoped means only specific sections may be updated.

---

## Ownership Table

### Service & Feature Specs

| Output File Pattern | Owning Generator | Also Modifies | Lock Semantics | Notes |
|---------------------|-----------------|---------------|----------------|-------|
| `dev_docs/specs/services/{service}.md` | SERVICE-HUB-GENERATOR | REGENERATOR (failing sections only) | **Section-scoped** — owner rewrites full file; REGENERATOR splices individual sections | Hub file = single source of truth per service |
| `dev_docs/specs/screens/{screen}.md` | Orchestrator Step 6 (screen spec generation) | REGENERATOR (failing sections only) | **Section-scoped** | Screen specs are generated during orchestration, not by a standalone generator |
| `dev_docs/specs/database/schema-documentation.md` | DATABASE-DOC-GENERATOR | STALE-DOC-DETECTOR (flags only, no writes) | **Full-rewrite** — regenerate entirely from schema | Owner regenerates on every schema change |
| `dev_docs/specs/contracts/api-catalog.md` | API-CATALOG-GENERATOR | SERVICE-HUB-GENERATOR (cross-links only) | **Full-rewrite** | Rebuilt from code scan each time |

### Task & Planning Files

| Output File Pattern | Owning Generator | Also Modifies | Lock Semantics | Notes |
|---------------------|-----------------|---------------|----------------|-------|
| `dev_docs/tasks/**/*.md` | PHASE-GENERATOR | REGENERATOR (failing sections), SPRINT-PLAN-GENERATOR (status field only) | **Section-scoped** — PHASE-GENERATOR creates; others update metadata | Task content is owned by PHASE-GENERATOR; status updates come from sprint tracking |
| `dev_docs/STATUS.md` | PHASE-GENERATOR | DEPENDENCY-GRAPHER (appends dependency analysis section), SPRINT-PLAN-GENERATOR (updates status columns) | **Append + field update** — PHASE-GENERATOR owns structure; others add sections or update fields | Multiple writers but clearly scoped |
| `dev_docs/sprints/sprint-{N}.md` | SPRINT-PLAN-GENERATOR | None | **Full-rewrite** — each sprint is generated fresh | Immutable after sprint ends |
| `dev_docs/phase-index.md` | PHASE-GENERATOR | None | **Full-rewrite** | Regenerated when phases change |

### Catalogs & Indexes

| Output File Pattern | Owning Generator | Also Modifies | Lock Semantics | Notes |
|---------------------|-----------------|---------------|----------------|-------|
| `dev_docs/specs/screen-catalog.md` | SCREEN-CATALOG-GENERATOR | SERVICE-HUB-GENERATOR (adds screen entries from hub), USER-DOC-GENERATOR (reads only) | **Full-rewrite** — SCREEN-CATALOG-GENERATOR regenerates from all hubs | Canonical screen list |
| `dev_docs/components/_index.md` | COMPONENT-CATALOGER | None | **Full-rewrite** — rebuilt from code scan | Canonical component list |
| `dev_docs/services/_index.md` | SERVICE-HUB-GENERATOR | None | **Full-rewrite** | Master service index |
| `dev_docs/api-catalog.md` | API-CATALOG-GENERATOR | None | **Full-rewrite** | Canonical endpoint list |
| `openapi.yaml` | OPENAPI-GENERATOR | None | **Full-rewrite** | Generated from API contracts |
| `dev_docs/mocks/**` | MOCK-SERVER-GENERATOR | None | **Full-rewrite** | Regenerated from API catalog |

### Audit & Completeness Reports

| Output File Pattern | Owning Generator | Also Modifies | Lock Semantics | Notes |
|---------------------|-----------------|---------------|----------------|-------|
| `dev_docs/completeness/depth-audit.md` | DEPTH-AUDITOR | None | **Full-rewrite** — regenerated on each audit run | Snapshot of audit state |
| `dev_docs/completeness/mechanical-depth-report.md` | MECHANICAL-DEPTH-CHECKER | None | **Full-rewrite** | Snapshot of mechanical counts |
| `dev_docs/completeness/consistency-audit.md` | CROSS-REFERENCE-VALIDATOR | None | **Full-rewrite** | Snapshot of cross-reference state |
| `dev_docs/completeness/regeneration-log.md` | REGENERATOR | None | **Append-only** — new entries added, old entries never modified | Running history of all regeneration attempts |
| `dev_docs/completeness/workflow-e2e-traces.md` | WORKFLOW-E2E-TRACE-GENERATOR | None | **Full-rewrite** | Regenerated from specs |
| `dev_docs/completeness/workflow-coverage-matrix.md` | WORKFLOW-COVERAGE-MATRIX | None | **Full-rewrite** | Regenerated from traces + tasks |
| `dev_docs/completeness/journey-coverage-matrix.md` | JOURNEY-COVERAGE-MATRIX | None | **Full-rewrite** | Regenerated from screen catalog + personas |
| `dev_docs/completeness/ui-state-matrix.md` | UI-STATE-MATRIX-GENERATOR | None | **Full-rewrite** | Regenerated from screen specs |

### Audit Reports (Per-Service)

| Output File Pattern | Owning Generator | Also Modifies | Lock Semantics | Notes |
|---------------------|-----------------|---------------|----------------|-------|
| `dev_docs/audit/{area-name}.md` | AUDIT-GENERATOR | None | **Full-rewrite** — regenerated per audit run | Each audit is a fresh assessment |

### Hardening & Expansion

| Output File Pattern | Owning Generator | Also Modifies | Lock Semantics | Notes |
|---------------------|-----------------|---------------|----------------|-------|
| `dev_docs/hardening/audit/**` | POST-COMPLETION-AUDITOR | None | **Full-rewrite** | Post-completion findings |
| `dev_docs/hardening/enhancement/**` | ENHANCEMENT-ROUND-GENERATOR | None | **Full-rewrite** per round | Each round produces new files |
| `dev_docs/hardening/expansion/**` | EXPANSION-PLANNER | None | **Full-rewrite** | Final expansion plan |

### Code Scaffolds

| Output File Pattern | Owning Generator | Also Modifies | Lock Semantics | Notes |
|---------------------|-----------------|---------------|----------------|-------|
| `src/**` (scaffolded files) | CODE-SCAFFOLD-GENERATOR | Developers (manual edits after scaffolding) | **One-time write** — scaffold creates, then developers own | After scaffolding, the generator never touches these files again |

### User Documentation

| Output File Pattern | Owning Generator | Also Modifies | Lock Semantics | Notes |
|---------------------|-----------------|---------------|----------------|-------|
| `user_docs/**` | USER-DOC-GENERATOR | None | **Full-rewrite** of skeleton; manual edits preserved in marked sections | Generated skeleton, then human-edited |

---

## Lock Semantics Reference

| Semantics | Meaning | When to Use |
|-----------|---------|-------------|
| **Full-rewrite** | Owner regenerates the entire file from scratch on every run. Previous content is discarded. | Catalogs, indexes, audit reports — anything derived entirely from other sources |
| **Section-scoped** | Owner writes specific sections; other generators may write other clearly-delimited sections. | Hub files, task files — multiple generators contribute to different parts |
| **Append-only** | New entries are added to the end. Existing entries are never modified or deleted. | Logs, history files — regeneration-log.md |
| **Field-update** | Specific fields (e.g., status, assignee) may be updated by secondary generators. Structure and content are untouched. | STATUS.md status columns, task metadata fields |
| **One-time write** | File is created once and never regenerated. Subsequent modifications are manual. | Code scaffolds — developers take ownership after initial generation |

---

## Conflict Prevention Rules

### Rule 1: Check Ownership Before Writing
Before any generator writes to a file, check this table. If the generator is not the owner AND not listed in "Also Modifies," it must NOT write to that file.

### Rule 2: Section Boundaries for Shared Files
When multiple generators write to the same file, each must write ONLY within its designated section. Sections are delimited by markdown headers that include the generator name:

```markdown
<!-- GENERATED BY: PHASE-GENERATOR — do not edit below this line -->
## Tasks
...
<!-- END: PHASE-GENERATOR -->

<!-- GENERATED BY: DEPENDENCY-GRAPHER — do not edit below this line -->
## Dependency Analysis
...
<!-- END: DEPENDENCY-GRAPHER -->
```

### Rule 3: Timestamp-Based Conflict Detection
Every generated file must include a `Last generated by: {{GENERATOR_NAME}} at {{TIMESTAMP}}` line. If a generator attempts to write a file that was last modified by a different generator more recently than its own inputs changed, it must warn:

```
WARNING: {{FILE_PATH}} was last modified by {{OTHER_GENERATOR}} at {{TIMESTAMP}}.
Your inputs have not changed since then. Skipping to avoid overwriting fresh data.
```

### Rule 4: REGENERATOR Has Surgical Write Privileges
The REGENERATOR is special — it may modify sections of files owned by other generators, but ONLY sections that failed audit. It must:
- Read the entire file
- Replace ONLY the failing sections
- Preserve all passing sections byte-for-byte
- Add a comment noting the regeneration: `<!-- Regenerated by REGENERATOR: attempt {{N}}, {{DATE}} -->`

### Rule 5: No Generator Deletes Another Generator's Output
Generators create and update files. They never delete files created by other generators. Only manual human action or the orchestrator's explicit cleanup steps may delete generated files.
