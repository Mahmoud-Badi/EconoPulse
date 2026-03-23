---
name: generate-hub
description: Generate a new 15-section service hub file for a module
args: module_name
allowed_tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
---

# /generate-hub — Service Hub Generator

Create a comprehensive service hub documentation file for a new or undocumented module.

## Usage

```
/generate-hub <module-name>
```

## Steps

### Step 1: Scan the Module

Locate and scan the module's source code:
- Backend: Look for `modules/{module_name}/` — find controllers, services, DTOs, tests
- Frontend: Look for `app/{module_name}/` or `(dashboard)/{module_name}/` — find pages, components
- Schema: Search database schema for related models

### Step 2: Extract Information

From the code, extract:
- **Endpoints:** All route definitions with HTTP method, path, auth guards
- **Components:** All React/Vue/Svelte components with their purpose
- **Data models:** All database models with field counts and relations
- **Tests:** All test files with test counts
- **Dependencies:** Imports from other modules

### Step 3: Generate Hub File

Use the hub generator template from `${CLAUDE_PLUGIN_ROOT}/../10-generators/` (if available) or generate a hub with these 15 sections:

```markdown
# {Module Name} — Service Hub

## 1. Overview
## 2. Status
## 3. Endpoints / Routes
## 4. Frontend Pages
## 5. Components
## 6. Data Models
## 7. Business Rules
## 8. Validation Rules
## 9. Error Handling
## 10. Security
## 11. Testing
## 12. Dependencies
## 13. Configuration
## 14. Known Issues
## 15. Audit Trail
```

### Step 4: Write and Verify

Write the hub file to the project's service hub directory. Then verify:
- All listed endpoints exist in code
- All listed components exist as files
- Test counts match actual test files
- No placeholder or stub content remains

### Step 5: Present Summary

Show the user what was generated with key metrics:
- Endpoint count
- Component count
- Model count
- Test count
- Completion assessment
