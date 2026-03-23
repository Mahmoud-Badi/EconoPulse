# Ready to Code — Pre-Coding Readiness Checklist

> Generated at the end of Step 33 (Expansion Planning)
> **Project:** {{PROJECT_NAME}}
> **Date:** {{DATE}}
> **Path used:** {{PATH_NAME}}

---

## Planning Completeness

| Category | Count | Status |
|----------|-------|--------|
| Services specified | {{SERVICE_COUNT}} | PASS / FAIL |
| Screen specs written | {{SCREEN_COUNT}} | PASS / FAIL |
| Task files generated | {{PHASE_COUNT}} phases, {{TASK_COUNT}} tasks | PASS / FAIL |
| API contracts defined | {{ENDPOINT_COUNT}} endpoints | PASS / FAIL |
| Database entities modeled | {{ENTITY_COUNT}} | PASS / FAIL |
| State machines documented | {{STATE_MACHINE_COUNT}} | PASS / FAIL |

## Hardening Results

| Step | Findings | Resolved | Remaining |
|------|----------|----------|-----------|
| 29 — Audit | {{HARDENING_AUDIT_FINDINGS}} | {{HARDENING_AUDIT_RESOLVED}} | {{AUDIT_REMAINING}} |
| 30 — Enhancement | {{HARDENING_ENHANCE_TOTAL}} | {{ENHANCE_RESOLVED}} | {{ENHANCE_REMAINING}} |
| 31 — Depth Verification | {{DEPTH_FINDINGS}} | {{DEPTH_RESOLVED}} | {{DEPTH_REMAINING}} |
| 32 — Deep Dive | {{DEEPDIVE_FINDINGS}} | {{DEEPDIVE_RESOLVED}} | {{DEEPDIVE_REMAINING}} |
| 33 — Expansion | N/A (planning) | N/A | N/A |

**All critical findings resolved.** No blockers remain.

## Quality Gates

- [ ] Anti-pattern baseline created (Step 16.1)
- [ ] Security severity framework defined (Step 16.2)
- [ ] Performance SLOs set (Step 16.3)
- [ ] Memory system initialized (Step 16.4)
- [ ] Protection list initialized (Step 16.5)
- [ ] All service specs score ≥9/10 depth (Step 31)
- [ ] All screen specs score ≥8/10 depth (Step 31)
- [ ] All tasks have ≥7/8 layers (Step 31)
- [ ] Cross-references verified bidirectionally (Step 31)
- [ ] No unresolved placeholders in dev_docs/

## State Files Ready

- [ ] `dev_docs/STATUS.md` — Task dashboard populated
- [ ] `dev_docs/CHANGELOG.md` — Work log initialized
- [ ] `CLAUDE.md` — AI instructions generated
- [ ] `dev_docs/completeness/service-matrix.md` — All services tracked
- [ ] `dev_docs/completeness/screen-matrix.md` — All screens tracked
- [ ] `dev_docs/decisions/decision-log.md` — All decisions recorded
- [ ] `.env.example` — All environment variables documented

## First Day Actions

1. Read `CLAUDE.md` — understand AI agent rules for this project
2. Read `dev_docs/STATUS.md` — find your first task
3. Run `/kickoff` to start your first coding session
4. Verify dev environment:
   - [ ] `docker-compose up` starts without errors
   - [ ] `{{DEV_COMMAND}}` starts dev server
   - [ ] Database connection verified
   - [ ] Environment variables set from `.env.example`

## Key Files to Read First

| Purpose | File |
|---------|------|
| What to build first | `dev_docs/tasks/phase-1-foundation.md` |
| Database schema | `dev_docs/specs/database-schema.md` |
| API contracts | `dev_docs/specs/contracts/api-registry.md` |
| Design system | `dev_docs/foundations/design-tokens.md` |
| Session workflow | `dev_docs/foundations/session-kickoff.md` |

## Project Summary

```
{{PROJECT_NAME}} — {{PROJECT_DESCRIPTION}}

Services: {{SERVICE_COUNT}} ({{SERVICE_LIST}})
Screens: {{SCREEN_COUNT}} across {{USER_ROLE_COUNT}} user roles ({{USER_ROLE_LIST}})
Phases: {{PHASE_COUNT}} ({{PHASE_LIST}})
Total tasks: {{TASK_COUNT}}

Hardening: {{HARDENING_TOTAL_IMPROVEMENTS}} improvements applied across Steps 29-33
Expansion: {{HARDENING_EXPANSION_FEATURES}} post-MVP features planned across {{HARDENING_EXPANSION_QUARTERS}} quarters
```
