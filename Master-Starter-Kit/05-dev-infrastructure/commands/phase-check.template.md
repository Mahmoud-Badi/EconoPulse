# /phase-check

Check progress on the current phase and determine if it's ready to advance.

## Steps

1. **Read STATUS.md** and identify the current active phase.

2. **Count tasks** in the current phase:
   - Count lines matching `- [x]` (completed)
   - Count lines matching `- [ ]` (remaining)
   - Calculate percentage: `completed / (completed + remaining) * 100`

3. **List remaining tasks** explicitly:
   ```
   Remaining Tasks:
   - [ ] {task 1}
   - [ ] {task 2}
   ...
   ```

4. **Run health checks**:
   ```bash
   pnpm typecheck 2>&1 | tail -10
   ```
   ```bash
   pnpm test 2>&1 | tail -10
   ```
   ```bash
   pnpm lint 2>&1 | tail -10
   ```

5. **Output Phase Check Report**:
   ```
   PHASE CHECK REPORT
   ===================
   Phase: {number} - {name}
   Progress: {completed}/{total} ({percentage}%)

   Remaining:
   {numbered list of unchecked tasks}

   Health:
   - TypeScript: {PASS/FAIL (error count)}
   - Tests: {PASS/FAIL (pass/fail count)}
   - Lint: {PASS/FAIL (warning/error count)}

   Status: {one of the following}
   ```

6. **Determine status**:
   - **READY TO ADVANCE**: All tasks complete AND all health checks pass. Suggest: "All tasks complete and health checks pass. Ready to advance to Phase {N+1}."
   - **ALMOST DONE**: 90%+ tasks complete, health checks pass. Suggest: "{N} tasks remaining. Finish these to advance."
   - **IN PROGRESS**: 50-90% complete. Report remaining tasks and any health issues.
   - **BLOCKED**: Health checks failing. Report: "Fix {N} type errors / {N} test failures before continuing."
   - **EARLY**: <50% complete. Report progress and suggest focusing on the next unchecked task.

## Notes

- Only one phase should be "active" at a time. If STATUS.md has multiple phases marked active, flag this as an issue.
- Health checks failing doesn't block task completion, but it does block phase advancement.
- If the current phase is the last phase, suggest running `/verify` for a final quality gate instead of advancing.
