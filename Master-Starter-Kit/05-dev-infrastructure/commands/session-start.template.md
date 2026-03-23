# /session-start

Begin a new work session by reading project state and reporting current status.

> **How this differs from /kickoff:** This command is read-only — it reports project state and health without taking any action. Use `/session-start` when you want to assess the project before deciding what to work on. Use `/kickoff` when you are ready to immediately start coding the next task.

## Steps

1. **Read STATUS.md** at the project root.
   - Extract: current phase name, phase number, active task (if any)
   - Count: total tasks checked `[x]` vs total tasks `[ ]` in the current phase
   - Calculate: overall progress percentage across all phases

2. **Read .claude/handoff.md** at the project root.
   - Extract: "Last Session" summary (what was done)
   - Extract: "Next Action" (the exact next thing to do, with file paths)
   - Extract: any blockers or notes from the previous session

3. **Run git log** to see recent history:
   ```bash
   git log --oneline -10
   ```
   - Report the last 10 commits
   - Note if there are uncommitted changes: `git status --short`

4. **Check for failing tests or type errors**:
   ```bash
   pnpm typecheck 2>&1 | tail -5
   ```
   - Report: PASS (zero errors) or FAIL (with error count)

5. **Query context7** for library docs relevant to the next task (if the next task involves a specific library).

6. **Output Session Start Report**:

   ```
   SESSION START REPORT
   ====================
   Phase: {phase_number} - {phase_name}
   Progress: {checked}/{total} tasks ({percentage}%)
   Overall: {total_checked}/{grand_total} tasks across all phases

   Last Session: {summary from handoff.md}

   Health:
   - TypeScript: {PASS/FAIL}
   - Uncommitted changes: {yes/no}

   Recent Commits:
   {last 5 commits}

   Ready to continue? The next task is:
   → {exact next action from handoff.md}
   ```

## Notes

- If STATUS.md or handoff.md doesn't exist, report that and ask the user to create them.
- If there are uncommitted changes, mention them but don't commit automatically.
- If typecheck fails, report the errors but proceed -- the user may want to fix them as part of the session.
