# /status — Project Build Status Dashboard

Scan the entire project and produce a progress dashboard showing completeness across all layers.

## Configuration
- **Project root:** `{{PROJECT_ROOT}}`
- **Backend source:** `{{BACKEND_SRC}}`
- **Frontend source:** `{{FRONTEND_SRC}}`
- **Schema file:** `{{SCHEMA_FILE}}`
- **Contract registry:** `{{CONTRACT_REGISTRY_PATH}}`
- **Task tracker:** `{{TASK_TRACKER_PATH}}`

## Steps

### Step 1 — Scan Backend Modules
Search `{{BACKEND_SRC}}` for backend modules/resources.
For each module found, check for the presence of:
<!-- IF {{BACKEND_FRAMEWORK}} == "nestjs" -->
- Controller file (`.controller.ts`)
- Service file (`.service.ts`)
- Module file (`.module.ts`)
- DTO files (`.dto.ts`)
- Test file (`.spec.ts`)
<!-- ENDIF -->
<!-- IF {{BACKEND_FRAMEWORK}} == "express" -->
- Router file
- Controller/handler file
- Validation/middleware file
- Test file
<!-- ENDIF -->
<!-- IF {{BACKEND_FRAMEWORK}} == "django" -->
- Views file (`views.py`)
- Serializers file (`serializers.py`)
- URLs file (`urls.py`)
- Test file (`tests.py`)
<!-- ENDIF -->
Rate each module: COMPLETE (all files) / PARTIAL (missing some) / STUB (minimal code).

### Step 2 — Scan Frontend Pages
Search `{{FRONTEND_SRC}}` for page/route components.
<!-- IF {{FRONTEND_FRAMEWORK}} == "next" -->
Scan `app/` directory for `page.tsx` files. Check each for real content vs placeholder.
<!-- ENDIF -->
<!-- IF {{FRONTEND_FRAMEWORK}} == "react" -->
Scan routes configuration and page components. Check each for real content vs placeholder.
<!-- ENDIF -->
<!-- IF {{FRONTEND_FRAMEWORK}} == "vue" -->
Scan `views/` or `pages/` directory. Check each for real content vs placeholder.
<!-- ENDIF -->
Rate each page: COMPLETE / PARTIAL / STUB / MISSING.

### Step 3 — Count Database Models
Read `{{SCHEMA_FILE}}` and extract all model/entity definitions.
For each model, note: field count, relation count, whether it has indexes, whether it has enums.
Count total models, total fields, total relations.

### Step 4 — Cross-Reference with Contracts
Read `{{CONTRACT_REGISTRY_PATH}}` (if it exists).
For each entry, verify the status columns match actual code state.
Flag any discrepancies: "Contract says DONE but code is STUB."

### Step 5 — Task Progress (if available)
Read `{{TASK_TRACKER_PATH}}` (if it exists).
Count tasks by status: done, in-progress, pending, blocked.
Calculate completion percentage.

### Step 6 — Generate Dashboard

```markdown
# Project Status Dashboard
Generated: [current date and time]

## Overview
| Metric              | Count  | Status    |
|---------------------|--------|-----------|
| Backend Modules     | N/M    | X% ready  |
| Frontend Pages      | N/M    | X% ready  |
| Database Models     | N      | —         |
| Contract Coverage   | N/M    | X% mapped |
| Tasks Complete      | N/M    | X% done   |

## Backend Modules
| Module       | Controller | Service | DTOs | Tests | Status   |
|--------------|------------|---------|------|-------|----------|
| module-name  | Y/N        | Y/N     | Y/N  | Y/N   | COMPLETE |

## Frontend Pages
| Page         | Route      | State Handling | Hooks | Tests | Status   |
|--------------|------------|----------------|-------|-------|----------|
| page-name    | /path      | Y/N            | Y/N   | Y/N   | PARTIAL  |

## Database Schema
- Models: N total, M with relations, K with indexes
- Fields: N total across all models

## Contract Discrepancies
- [List any mismatches between contract status and actual code]

## Recommendations
1. [Highest priority item to work on next]
2. [Second priority]
3. [Third priority]

## Risk Areas
- [Modules with no tests]
- [Pages that are stubs]
- [Contract entries with stale status]
```

### Step 7 — Multi-Level Health Aggregation

Aggregate status from module level up to project level:

```markdown
## Project Health

### Phase Progress
| Phase | Sprints | Services | Status | Gate |
|-------|---------|----------|--------|------|
| Phase 1: MVP | MP-01 to MP-06 | 11 P0 services | IN PROGRESS | G1 pending |
| Phase 2: Core | MP-07 to MP-12 | +3 P1 services | NOT STARTED | G2 pending |

### Sprint Progress (Current)
| Sprint | Tasks Total | Done | In Progress | Blocked | % Complete |
|--------|------------|------|-------------|---------|------------|
| MP-01 | N | N | N | N | N% |

### Service Health Summary
| Tier | Services | Avg Score | Lowest | Highest | Tribunal Status |
|------|----------|-----------|--------|---------|----------------|
| P0 MVP | N | N/10 | N/10 | N/10 | N/N audited |

### Quantitative Metrics
| Metric | Count | Delta Since Last |
|--------|-------|-----------------|
| Frontend Routes | N | +N |
| Components | N | +N |
| Backend Modules | N | +N |
| Database Models | N | +N |
| Tests | N | +N |
| Test Coverage | N% | +N% |

### Health Indicators
| Indicator | Status | Details |
|-----------|--------|---------|
| Build | PASS/FAIL | Last checked: date |
| Tests | PASS/FAIL | N passing, N failing |
| Security Findings | N open | N STOP-SHIP, N P0 |
| Anti-Patterns | N active | N occurrences this sprint |
```

## Notes
- This command is read-only — it never modifies code
- Module rating: COMPLETE = all expected files present with real logic, PARTIAL = some files, STUB = files exist but empty/placeholder
- Page rating follows the same scheme
- Run this at the start of sessions to orient yourself
- If contract registry does not exist, skip Step 4 and note it in the dashboard
- Step 7 provides multi-level project health aggregation with bidirectional links to source files
