# Project Maturity Detector

**Purpose:** Scan a project and classify its maturity level to automatically route it to the correct kit path. This protocol is callable from Step 0.5 of the ORCHESTRATOR, kit-upgrade, and master-kit-upgrade.

**Output:** A structured maturity assessment with score, classification, flags, and recommended path.

**Used by:**
- ORCHESTRATOR Step 0.5 (automatic before intake)
- kit-upgrade Step 2 (when `dev_docs/` is absent)
- master-kit-upgrade Phase 0.5 (when `dev_docs/` is absent)

---

## When to Run

Run this protocol whenever the kit system needs to determine what kind of project it's working with:

- Before Step 1 intake (to choose the right path)
- When `/kit-upgrade` or `/master-kit-upgrade` encounters a project without `dev_docs/`
- When the user invokes `/kit` on a directory that already has code

---

## Detection Protocol

### Step 1 — Scan Signals

Scan the following signal groups in order. Each signal contributes points to a cumulative maturity score (0-100).

#### Signal Group A — Codebase Signals (0-40 points)

| Signal | How to Detect | Points |
|--------|--------------|--------|
| Source files exist | Glob `src/**/*.{ts,tsx,js,jsx,py,rb,go,rs,java,cs,php,swift,kt}` and `app/**/*.{ts,tsx,js,jsx,py,rb}` | 5 if >0 files, 10 if >50, 15 if >200 |
| Package manager lock file | Glob `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `poetry.lock`, `Gemfile.lock`, `go.sum`, `Cargo.lock` | 3 if any found |
| Database schema exists | Glob `prisma/schema.prisma`, `**/migrations/**/*.{sql,py,rb}`, `schema.sql`, `**/models/*.py`, `drizzle/**` | 5 if any found |
| Test files exist | Glob `**/*.test.*`, `**/*.spec.*`, `**/tests/**/*.{ts,js,py,rb}`, `**/__tests__/**/*` | 3 if >0, 8 if >50, 12 if >200 |
| CI/CD config exists | Glob `.github/workflows/*.{yml,yaml}`, `.gitlab-ci.yml`, `.circleci/**`, `Jenkinsfile`, `azure-pipelines.yml` | 3 if any found |
| Docker config exists | Glob `Dockerfile`, `docker-compose.yml`, `docker-compose.yaml`, `.dockerignore` | 2 if any found |

#### Signal Group B — Documentation Signals (0-30 points)

| Signal | How to Detect | Points |
|--------|--------------|--------|
| `dev_docs/` directory exists | Directory check | 10 |
| `.kit-meta.json` exists | File check at `dev_docs/.kit-meta.json` | 5 (strong indicator of prior kit run) |
| `STATUS.md` with task checkboxes | Read `dev_docs/STATUS.md`, count `[x]` and `[ ]` patterns | 5 if exists, +3 if >50% complete |
| Service/screen specs exist | Glob `dev_docs/specs/services/*`, `dev_docs/specs/screens/*`, `dev_docs/specs/*-service*` | 5 if any found |
| Non-kit documentation exists | Glob `docs/**/*.md`, `ARCHITECTURE.md`, `ADR/**/*.md`, `documentation/**/*.md` | 2 if any found |

#### Signal Group C — Activity Signals (0-30 points)

| Signal | How to Detect | Points |
|--------|--------------|--------|
| Git history depth | `git rev-list --count HEAD` | 3 if >50, 8 if >500, 15 if >2000 |
| Recent activity | `git log --oneline -1 --format=%ci` — check if within last 30 days | 5 if active within 30 days |
| Task tracking exists | Glob `dev_docs/tasks/**/*.md` and count; also check for non-kit tracking: `.github/ISSUE_TEMPLATE`, `TODO.md`, `TASKS.md` | 3 if >0 task files, 5 if >20, 10 if >100 |

---

### Step 2 — Calculate Score and Classify

Sum all points from Signal Groups A, B, and C.

#### Maturity Classifications

| Score | Classification | Description |
|-------|---------------|-------------|
| 0-8 | `GREENFIELD` | No meaningful code, no docs, starting fresh |
| 9-25 | `EARLY_BUILD` | Some scaffolding or early code, minimal documentation |
| 26-50 | `MID_BUILD` | Substantial codebase with some structure, possible partial kit run |
| 51-75 | `MATURE` | Production-quality codebase, significant test coverage, active development |
| 76-100 | `MATURE_KIT` | Mature codebase with kit artifacts (`dev_docs/`, `.kit-meta.json`, STATUS.md) |

#### Boolean Flags

After scoring, set these flags:

| Flag | Condition |
|------|-----------|
| `HAS_KIT_ARTIFACTS` | `dev_docs/.kit-meta.json` exists OR (`dev_docs/STATUS.md` exists with `[x]`/`[ ]` checkboxes AND `dev_docs/specs/` has files) |
| `HAS_EXISTING_TESTS` | Test file count > 10 |
| `HAS_EXISTING_SPECS` | `dev_docs/specs/` has service or screen spec files |
| `HAS_TASK_TRACKING` | `dev_docs/tasks/` has >5 task files, OR project has its own tracking system (e.g., `docs/MASTER-TRACKER.md`, `.github/ISSUE_TEMPLATE`) |
| `IS_ACTIVE_DEV` | Git commits exist within the last 14 days |
| `NEEDS_ENHANCE_NOT_GREENFIELD` | Score >= 26 AND `HAS_KIT_ARTIFACTS` is false |

---

### Step 3 — Determine Recommended Path

Use this routing table:

| Classification | `HAS_KIT_ARTIFACTS` | Recommended Path | Rationale |
|---------------|--------------------|--------------------|-----------|
| `GREENFIELD` | false | **Standard ORCHESTRATOR** (Step 1 intake) | Nothing exists yet — build from scratch |
| `GREENFIELD` | true | **Standard ORCHESTRATOR** (resume) | Kit was started but no code written yet — check session-context.md |
| `EARLY_BUILD` | false | **ORCHESTRATOR** with Step 7 mandatory | Some code exists — run standard planning but audit what's there |
| `EARLY_BUILD` | true | **`/kit-upgrade resume`** | Kit was started, some work done — continue where you left off |
| `MID_BUILD` | false | **Enhance Path** (37-enhance) | Substantial existing code — must audit before planning |
| `MID_BUILD` | true | **`/kit-upgrade`** | Kit-built project at mid-point — needs quality uplift |
| `MATURE` | false | **Enhance Path** (37-enhance) | Mature non-kit project — full audit-first approach required |
| `MATURE` | true | **`/kit-upgrade`** full | Kit-built, mature — ready for full uplift waves |
| `MATURE_KIT` | true | **`/kit-upgrade`** full | Full kit project — standard uplift |

**Special case — Existing non-kit task tracking:**
If `NEEDS_ENHANCE_NOT_GREENFIELD` is true AND `HAS_TASK_TRACKING` is true (with a non-kit tracker like `docs/MASTER-TRACKER.md`), note in the assessment:
> "This project has its own task tracking system with [N] tasks ([N]% complete). The Enhance path will audit and document the existing codebase without duplicating your task structure. Your existing tracker will be preserved."

---

### Step 4 — Present Assessment

Output the following structured assessment and wait for user approval:

```
PROJECT MATURITY ASSESSMENT
===========================
Score: [N]/100
Classification: [GREENFIELD | EARLY_BUILD | MID_BUILD | MATURE | MATURE_KIT]

Signals Detected:
  Source files:      [N] files across [languages]
  Test files:        [N] files ([N] test suites)
  Git commits:       [N] total, [N] in last 30 days
  Kit artifacts:     [present — .kit-meta.json found | absent]
  dev_docs/:         [present (N specs, N tasks) | absent]
  Database schema:   [detected at {path} | not found]
  CI/CD:             [detected ({type}) | not found]
  Documentation:     [N] doc files in [locations]

Flags:
  HAS_KIT_ARTIFACTS:          [true/false]
  HAS_EXISTING_TESTS:         [true/false] ([N] test files)
  HAS_EXISTING_SPECS:         [true/false]
  HAS_TASK_TRACKING:          [true/false] ([N] tasks, [N]% complete)
  IS_ACTIVE_DEV:              [true/false]
  NEEDS_ENHANCE_NOT_GREENFIELD: [true/false]

─────────────────────────────────────────────────────
RECOMMENDED PATH: [path name]
REASON: [1-2 sentences explaining why this path fits this specific project]
─────────────────────────────────────────────────────

Proceed with this recommendation? (Y to accept, or specify a different path)
```

---

## GATE: User Approval

Wait for the user to approve the recommended path or override it.

**If user approves:** Set `ACTIVE_PATH` and proceed with the recommended routing.

**If user overrides:** Accept the override, but if the user chooses a path that conflicts with the maturity score (e.g., choosing greenfield Standard path for a MATURE project), display a warning:

```
⚠️ WARNING: This project scored [N]/100 ([classification]) with [N] source files
and [N] tests. Running the [chosen path] may:
- Generate documentation that duplicates existing work
- Produce specs that conflict with your working codebase
- Miss the opportunity to audit and improve what you already have

The Enhance path is specifically designed for this situation.
Continue with [chosen path] anyway? (Y/N)
```

---

## Integration Points

### From ORCHESTRATOR Step 0.5

After Step 0 (Ecosystem Setup) completes, Step 0.5 invokes this protocol. The result determines:
- Which Step 1 variant runs (standard intake vs. Enhance Intake)
- Whether Step 7 (Codebase Audit) is mandatory or skipped
- Whether to redirect to `/kit-upgrade` entirely (for kit-built projects)

Store the result in the STATE BLOCK as:
```
MATURITY: {
  score: [N],
  classification: "[class]",
  flags: { HAS_KIT_ARTIFACTS: [bool], HAS_EXISTING_TESTS: [bool], ... },
  recommended_path: "[path]",
  user_approved_path: "[path]"
}
```

And in CONFIG:
```
MATURITY_SCORE: [N],
MATURITY_CLASS: "[class]",
ACTIVE_PATH: "[greenfield|enhance|kit-upgrade|resume]",
HAS_KIT_ARTIFACTS: [bool],
EXISTING_TEST_COUNT: [N],
EXISTING_TASK_COUNT: [N],
EXISTING_TASK_COMPLETION_PCT: [N],
```

### From kit-upgrade / master-kit-upgrade

When these skills detect `dev_docs/` is absent, they invoke this protocol to determine whether to:
- Reject the project ("Run /kit first")
- Run the Enhance Bridge to create `dev_docs/` scaffolding, then continue with upgrade

See `37-enhance/ENHANCE-BRIDGE.md` for the bridging sequence.
