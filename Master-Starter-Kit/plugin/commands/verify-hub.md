---
name: verify-hub
description: Run three-way verification on a service hub file (Hub vs PST vs Code)
args: module_name
allowed_tools:
  - Agent
  - Read
  - Glob
---

# /verify-hub — Three-Way Hub Verification

Verify a service hub file's accuracy by comparing it against tribunal findings and actual source code.

## Usage

```
/verify-hub <module-name>
```

## Steps

1. Locate the module's hub file, PST report (if exists), and source code
2. Launch the `hub-corrector` agent
3. Agent compares all three sources and fixes discrepancies
4. Hub file is updated with corrections and verification timestamp

## Execution

1. Find relevant files:
   - Hub file: search service hub directory for `*{module_name}*`
   - PST file: search tribunal output for `PST-*{module_name}*`
   - Code: backend `modules/{module_name}/`, frontend `app/{module_name}/`

2. Launch the `hub-corrector` agent:
   ```
   Agent: hub-corrector
   Prompt: "Correct the hub file for '{module_name}'.
   Hub: {hub_path}
   PST: {pst_path or 'none'}
   Backend: {backend_path}
   Frontend: {frontend_path}
   Follow the checklist at: ${CLAUDE_PLUGIN_ROOT}/../01-tribunal/hub-corrections/CORRECTION-CHECKLIST.md
   Use three-way verification from: ${CLAUDE_PLUGIN_ROOT}/../01-tribunal/hub-corrections/THREE-WAY-VERIFICATION.md"
   ```

3. Display correction summary showing what changed.
