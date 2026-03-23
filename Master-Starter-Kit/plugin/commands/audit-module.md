---
name: audit-module
description: Run a Per-Service Tribunal (PST) audit on a specific module
args: module_name
allowed_tools:
  - Agent
  - Read
  - Glob
---

# /audit-module — Per-Service Tribunal Audit

Run a full 5-phase audit + 5-round adversarial tribunal on a specific module/service.

## Usage

```
/audit-module <module-name>
```

## Steps

1. Locate the module's hub file and source code
2. Launch the `per-service-auditor` agent
3. Agent performs hub verification, code quality, security, and tribunal
4. Output is written to the tribunal output directory

## Execution

1. Search for the module's hub file:
   - Look in the project's service hub directory for `*{module_name}*`
   - Look for backend code in `modules/{module_name}/` or `src/{module_name}/`
   - Look for frontend code in `app/{module_name}/` or `pages/{module_name}/`

2. Launch the `per-service-auditor` agent:
   ```
   Agent: per-service-auditor
   Prompt: "Audit the '{module_name}' service.
   Hub file: {hub_path}
   Backend code: {backend_path}
   Frontend code: {frontend_path}
   Write PST report to: {tribunal_output_path}/PST-{module_name}.md
   Use templates from: ${CLAUDE_PLUGIN_ROOT}/../01-tribunal/per-service-tribunal/"
   ```

3. After completion, display the verdict summary to the user.
