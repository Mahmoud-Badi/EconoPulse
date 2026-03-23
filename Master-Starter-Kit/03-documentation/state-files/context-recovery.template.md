# Context Recovery — {{PROJECT_NAME}}

<!-- FAST-LOAD FILE. Keep under 2000 words. An AI agent should read ONLY this file to start working immediately. -->
<!-- This supplements session-context.md (comprehensive) — this file is the speed-optimized version. -->
<!-- Regenerate at the end of EVERY session using the instructions at the bottom. -->

**Last Updated:** YYYY-MM-DD HH:MM
**Updated By:** [human / agent-session-N]

---

## Current State

- **Phase:** {{PROJECT_STAGE}} <!-- planning / development / testing / deployment -->
- **Sprint:** {{CURRENT_SPRINT}}
- **Active Task:** <!-- e.g., "Implementing user invitation flow — backend endpoint done, frontend form in progress" -->
- **Blocked Items:** <!-- e.g., "Stripe webhook testing — waiting for ngrok setup" or "None" -->
- **Branch:** <!-- e.g., "feat/user-invitations" -->

## Recent Changes (Last 3 Completed Tasks)

1. <!-- e.g., "Auth flow complete — login, register, password reset all working with tests" -->
2. <!-- e.g., "Database schema for organizations and memberships migrated and seeded" -->
3. <!-- e.g., "CI pipeline configured — lint, type-check, test on every PR" -->

## Active Risks

| Risk | Status | Mitigation |
|------|--------|------------|
| <!-- e.g., "Stripe API rate limits during bulk imports" --> | <!-- monitoring / mitigated / escalated --> | <!-- e.g., "Added queue with 100ms delay between calls" --> |
| | | |
| | | |

## Key Decisions (Last 2 Sessions)

<!-- Only decisions that affect what you build next. For full history, see decision-journal.md. -->

- <!-- e.g., "Switched from tRPC to REST — mobile team needs OpenAPI spec (decision-journal #12)" -->
- <!-- e.g., "Deferred PDF export to Phase 2 — not blocking any MVP user flow" -->
- <!-- e.g., "Using Resend for transactional email — Postmark was overkill for our volume" -->

## Modified Files (Last Session)

<!-- List files changed in the most recent session so the agent knows what's hot. -->

```
<!-- e.g.,
src/app/api/invitations/route.ts       — NEW, invitation API endpoint
src/components/InviteForm.tsx          — NEW, form component
src/lib/db/schema.ts                   — MODIFIED, added invitations table
prisma/migrations/20260312_invitations — NEW, migration
src/app/(dashboard)/team/page.tsx      — MODIFIED, added invite button
-->
```

## Next Actions

<!-- Exactly what the agent should do first. Be specific enough to start without asking questions. -->

1. <!-- e.g., "Build the frontend for accepting invitations: page at /invite/[token], calls GET /api/invitations/[token] to validate, then POST /api/invitations/[token]/accept" -->
2. <!-- e.g., "After that, add E2E test for the full invite flow (send, receive, accept, verify team membership)" -->

---

## Project Coordinates (Stable Reference)

- **Stack:** {{FRONTEND_FRAMEWORK}} + {{BACKEND_FRAMEWORK}} + {{DATABASE}} + {{ORM}}
- **Repo:** {{REPO_URL}}
- **Local Path:** {{PROJECT_LOCAL_PATH}}
- **Key Files:** `STATUS.md` (progress), `session-context.md` (full context), `decision-journal.md` (decisions)
- **Architecture:** {{EXPECTED_SERVICE_COUNT}} services, {{MVP_SCREENS}} screens
- **Deploy Target:** {{HOSTING_PROVIDER}}

---

## Auto-Update Instructions

**When:** End of every AI session, or when a human finishes a significant work block.

**How to regenerate this file:**

1. Review `git log --oneline -10` and `git diff --stat HEAD~5` for recent changes
2. Check `STATUS.md` for current sprint and active tasks
3. Check `session-context.md` for decisions and open questions
4. Fill in each section above with **current** information (not stale data)
5. Delete any placeholder comments and replace with real content
6. Verify the file is under 2000 words (`wc -w context-recovery.md`)
7. Update the "Last Updated" timestamp at the top

**Agent session-end prompt:**
```
Read STATUS.md, session-context.md, and the last 10 git commits.
Regenerate context-recovery.md with current state. Keep it under 2000 words.
Every field must reflect reality — no placeholders, no stale data.
```

**If this file is stale:** Check `session-context.md` for the full picture, then regenerate this file before starting work.
