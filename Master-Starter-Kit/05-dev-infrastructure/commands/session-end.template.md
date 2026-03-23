# /session-end

Close the current work session by updating all state files, running quality checks, and committing.

## Steps

1. **Update STATUS.md**:
   - Check off `[x]` all tasks completed during this session
   - Update task counts for the current phase
   - If a phase is fully complete, add a completion note with today's date
   - Update any "Active Task" indicator to reflect what's next

2. **Update .claude/handoff.md**:
   Write exactly this structure:
   ```markdown
   # Handoff

   ## Last Session ({today's date})
   - {bullet point for each thing completed}
   - {include specific file paths and feature names}

   ## Not Done
   - {anything started but not finished}
   - {any known issues discovered}

   ## Next Action
   {One specific sentence describing the exact next thing to do}
   {Include the file path or command to start with}

   ## Notes
   - {any gotchas, learnings, or context for the next session}
   ```

3. **Append to DEVLOG.md**:
   Add a new entry at the top of the log:
   ```markdown
   ## {today's date} - {phase name}

   ### Completed
   - {bullet points of what was done}

   ### Stats
   - Tasks completed: {count}
   - Phase progress: {checked}/{total} ({percentage}%)
   - Overall progress: {total_checked}/{grand_total}

   ### Next
   - {next action from handoff.md}
   ```

4. **Run quality checks**:
   ```bash
   pnpm test 2>&1 | tail -20
   ```
   ```bash
   pnpm typecheck 2>&1 | tail -20
   ```
   Report PASS or FAIL for each.

5. **Stage and commit all changes**:
   ```bash
   git add -A
   git status
   ```
   Review what's being committed. Then:
   ```bash
   git commit -m "session({phase}): {brief summary of session work}"
   ```
   Use conventional commit format with session scope.

6. **Output Session End Report**:
   ```
   SESSION END REPORT
   ==================
   Duration: {approximate time if known}
   Tasks Completed: {count}
   Phase Progress: {checked}/{total} ({percentage}%)

   Quality:
   - Tests: {PASS/FAIL}
   - TypeScript: {PASS/FAIL}
   - Commit: {hash}

   Files Updated:
   - STATUS.md ✓
   - .claude/handoff.md ✓
   - DEVLOG.md ✓

   Next Session:
   → {exact next action}
   ```

## Notes

- If tests or typecheck fail, still commit the state files but note the failures in handoff.md under "Notes."
- If there are no changes to commit, skip the commit step and note that no code changes were made.
- Always update all three state files (STATUS.md, handoff.md, DEVLOG.md) regardless of how much work was done.
- The DEVLOG.md entry should be prepended (newest first), not appended.
