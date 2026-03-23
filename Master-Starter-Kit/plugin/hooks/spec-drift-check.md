---
name: spec-drift-check
description: Detect when specs are older than their corresponding code files, flagging stale documentation.
event: SessionStart
---

# Spec Drift Detection

On session start, compare spec file modification dates against code file modification dates. Flag any specs that may be outdated.

## Check Protocol

1. **Scan for service hubs** in `dev_docs/services/*.hub.md`
2. For each hub, identify the corresponding code directory (e.g., `src/services/{name}/` or `apps/{name}/`)
3. Compare last-modified dates:
   - If code files are newer than the hub by more than 1 day → flag as potentially stale
   - If spec files in `dev_docs/specs/services/` are older than code → flag

4. **Report** (only if drifted specs found):

```
SPEC DRIFT WARNING
==================
The following specs may be outdated (code modified after spec):

  - auth.hub.md (spec: Mar 5, code: Mar 9) — 4 days behind
  - billing-spec.md (spec: Mar 1, code: Mar 8) — 7 days behind

Run /add-service or manually update these specs to match the code.
```

5. If no drift detected, say nothing (don't add noise to every session).

## Rules

- **Only report if drift > 1 day** — same-day edits are normal
- **Only check services that have corresponding code directories** — skip services not yet implemented
- **Never auto-modify specs** — just report, let the user decide
- **Limit to 5 warnings** — don't overwhelm with a long list
