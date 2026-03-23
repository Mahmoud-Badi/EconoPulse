---
name: arch-anchor-reminder
description: Reminds to update ARCH-ANCHOR.md when architecture-related files are modified. Fires on Stop event.
event: Stop
---

# Architecture Anchor Reminder Hook

Detects when architecture-affecting files are modified without updating ARCH-ANCHOR.md.

## Trigger

Activates on the **Stop** event — after every response.

## Behavior

### Step 1: Detect architecture-affecting modifications

Check for modified files that affect system architecture:

```bash
git diff --name-only HEAD 2>/dev/null | grep -E '(schema|migration|drizzle|prisma|auth|router|trpc|api/|middleware|proxy\.ts|database)'
git diff --cached --name-only 2>/dev/null | grep -E '(schema|migration|drizzle|prisma|auth|router|trpc|api/|middleware|proxy\.ts|database)'
```

If no architecture-affecting files were modified, skip all checks. Respond with just: ok.

### Step 2: Check if ARCH-ANCHOR was also updated

Check if `dev_docs/ARCH-ANCHOR.md` was modified in this turn:

```bash
git diff --name-only HEAD 2>/dev/null | grep 'ARCH-ANCHOR'
git diff --cached --name-only 2>/dev/null | grep 'ARCH-ANCHOR'
```

If ARCH-ANCHOR.md was also modified, skip — it's already being maintained. Respond with: ok.

### Step 3: Output reminder

If architecture files were modified but ARCH-ANCHOR was NOT updated:

```
ARCH-ANCHOR REMINDER: You modified architecture-affecting files but didn't update dev_docs/ARCH-ANCHOR.md.
Modified: [list architecture files]
Update ARCH-ANCHOR.md if any of these changed: services, data model, API contracts, auth flow, constraints, or tech stack.
If this was a minor change (bug fix, refactor with no architectural impact), ignore this reminder.
```

## Rules

- Remind, don't block — architecture changes don't always affect the anchor
- Skip if ARCH-ANCHOR.md doesn't exist (project may not use it yet)
- Skip if dev_docs/ doesn't exist (pre-bootstrap)
- Skip read-only turns
- Fast — runs on every turn
