# /preflight — Pre-Feature Verification Checklist

Verify all prerequisites are in place before starting work on a feature.
Feature name: **$ARGUMENTS**

## Configuration
- **Project root:** `{{PROJECT_ROOT}}`
- **Contract registry:** `{{CONTRACT_REGISTRY_PATH}}`
- **Design specs:** `{{DESIGN_SPECS_PATH}}`
- **Backend source:** `{{BACKEND_SRC}}`
- **Frontend source:** `{{FRONTEND_SRC}}`
- **Schema file:** `{{SCHEMA_FILE}}`

## Steps

### Step 1 — Search Contract Registry
Read the contract registry at `{{CONTRACT_REGISTRY_PATH}}`.
Search for entries matching "$ARGUMENTS" (case-insensitive, partial match).
If found, extract: screen name, API endpoints, status columns (DB/API/FE/INT/VER).
If NOT found, flag as WARNING: "No contract entry for this feature."

### Step 2 — Check Design Spec
Search for design spec files in `{{DESIGN_SPECS_PATH}}` matching "$ARGUMENTS".
Look for naming patterns: `$ARGUMENTS.md`, `$ARGUMENTS-spec.md`, `$ARGUMENTS-design.md`.
If found, read and extract: data fields, component list, status states, role matrix.
Rate spec quality: DETAILED (has fields + components + states) / PARTIAL / STUB / MISSING.

### Step 3 — Verify API Endpoints
From the contract registry or design spec, identify required API endpoints.
For each endpoint:
- Search `{{BACKEND_SRC}}` for a matching controller route decorator
- Check if the corresponding service method exists
- Check if DTOs are defined
- Mark each endpoint as: EXISTS / PARTIAL (controller only) / MISSING

### Step 4 — Check Database Schema
Read `{{SCHEMA_FILE}}` (or scan `{{BACKEND_SRC}}` for entity/model files).
For each data model referenced in the design spec or contract:
- Check if the model exists in the schema
- Check if required fields are present
- Check for missing relations
- Mark each model as: READY / PARTIAL / MISSING

### Step 5 — Check Existing Code
Scan for existing implementations:
- **Backend:** controllers, services, modules in `{{BACKEND_SRC}}`
- **Frontend:** pages, components, hooks in `{{FRONTEND_SRC}}`
- **Types:** shared type definitions, API response types
- **Tests:** existing test files for the feature
Report what already exists and its completeness.

### Step 6 — Generate GO / NO-GO Report

```
## Preflight Report: $ARGUMENTS

| Check           | Status  | Details                    |
|-----------------|---------|----------------------------|
| Contract        | OK/WARN | Found/Not found            |
| Design Spec     | OK/WARN | Quality: DETAILED/PARTIAL  |
| API Endpoints   | OK/WARN | N/M endpoints ready        |
| Database Schema | OK/WARN | N/M models ready           |
| Existing Code   | INFO    | Summary of what exists     |

### Verdict: GO / NO-GO / CONDITIONAL GO

### Blockers (if NO-GO):
- [ ] List specific missing items

### Prerequisites (if CONDITIONAL GO):
- [ ] List items to build first

### Recommended Build Order:
1. Database changes (if needed)
2. Backend endpoints (if needed)
3. Frontend implementation
4. Integration and verification
```

## Notes
- A feature is GO if: contract exists, spec is at least PARTIAL, all API endpoints exist
- A feature is CONDITIONAL GO if: some endpoints missing but can be built during the task
- A feature is NO-GO if: no spec AND no contract AND no existing code
- Always show the recommended build order even for GO features
