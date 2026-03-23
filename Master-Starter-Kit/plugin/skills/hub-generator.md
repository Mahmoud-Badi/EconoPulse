---
name: hub-generator
description: Generate a 15-section service hub file by scanning actual source code. Produces accurate documentation from code analysis, not from specs.
---

# Hub Generator

Generate a service hub documentation file from actual source code analysis.

## Protocol

### 1. Identify the Module

Determine the module name and locate its source code:
- Backend: `modules/{name}/` or `src/{name}/`
- Frontend: `app/{name}/` or `pages/{name}/` or `(dashboard)/{name}/`
- Schema: Search for related model definitions

### 2. Scan Backend

For each backend file found:
- **Controllers:** Extract route definitions (method, path, guards, decorators)
- **Services:** Extract public methods and their signatures
- **DTOs:** Extract validation schemas and field definitions
- **Tests:** Count test cases and extract describe blocks

### 3. Scan Frontend

For each frontend file found:
- **Pages:** List page routes and their component structure
- **Components:** List domain-specific components with props
- **Hooks:** List custom hooks for this module
- **State:** Identify state management patterns (React Query, Zustand, etc.)

### 4. Scan Data Models

From the database schema:
- Extract model definitions with all fields
- Map relations (belongsTo, hasMany, etc.)
- Note indexes and unique constraints
- List enums used by this module

### 5. Generate the Hub

Write a hub file with these 15 sections, populated from actual code:

**Section 1 — Overview:** Module purpose, one-paragraph summary
**Section 2 — Status:** Completion assessment based on what exists
**Section 3 — Endpoints:** Table of all endpoints with method, path, auth, description
**Section 4 — Frontend Pages:** Table of routes with component and status
**Section 5 — Components:** List of UI components with file paths
**Section 6 — Data Models:** Models with field counts and relations
**Section 7 — Business Rules:** Extracted from service logic and validation
**Section 8 — Validation:** DTO/schema rules summarized
**Section 9 — Error Handling:** How errors are caught and returned
**Section 10 — Security:** Auth guards, tenant isolation, input validation status
**Section 11 — Testing:** Test count, coverage areas, gaps
**Section 12 — Dependencies:** Cross-service imports and external packages
**Section 13 — Configuration:** Environment variables and config needed
**Section 14 — Known Issues:** Any TODOs, FIXMEs, or incomplete implementations found in code
**Section 15 — Audit Trail:** Generated date, verification status

### 6. Verify Accuracy

Before writing the file:
- Confirm every listed endpoint has a matching route in code
- Confirm every listed component exists as a file
- Confirm test counts match actual `.spec.ts` or `.test.ts` files
- Mark anything unverified as `[UNVERIFIED]`

## Rules

- **Code is the source of truth** — never copy from specs without verifying against code
- **No placeholder content** — if a section has nothing to report, write "None found in code"
- **Include file paths** — every endpoint, component, and test should reference its source file
- **Be honest about gaps** — if there are no tests, say "0 tests" not "tests pending"
