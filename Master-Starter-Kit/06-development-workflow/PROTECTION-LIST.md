# Protection List

## Purpose

The protection list prevents accidental modification of high-quality, approved pages and components. When a screen scores 8/10 or higher and has been reviewed/approved, it goes on this list. Any modification requires explicit review.

**Ultra TMS proof:** 3 protected pages (Load Planner, Truck Types, Login) survived 5 months of development without regression because they were on the protection list.

---

## Protected Items

| # | Item | Path | Score | Protected Since | Reason |
|---|------|------|-------|----------------|--------|
| | _None yet — add items as they reach protection threshold_ | | | | |

---

## Protection Criteria

A page/component earns protection when:

1. **Score ≥ 8/10** on the 6-dimension scoring rubric
2. **User/stakeholder approved** — explicitly reviewed and accepted
3. **No known bugs** — zero P0/P1 issues
4. **Tests exist** — at least E2E test covering the critical path
5. **Design compliant** — matches approved design spec

---

## What Protection Means

### DO NOT (without review):
- Refactor the component's internal structure
- Change its styling or layout
- Modify its API calls or data flow
- Add/remove features
- Upgrade its dependencies independently
- Let an AI agent modify it during bulk operations

### ALLOWED without review:
- Reading the code for reference
- Using it as a pattern example for other components
- Bug fixes for actual bugs (not "improvements")
- Security patches (SEV-1/SEV-2 only)

---

## Requesting Modification

To modify a protected item:

1. **Create a task file** explaining what needs to change and why
2. **Get user approval** before making any changes
3. **Take a snapshot** (screenshot + git commit hash) before modifying
4. **Make the change** in a feature branch
5. **Run the full quality gate** (all 8 gates) on the modified item
6. **Compare before/after** screenshots
7. **Re-score** using the 6-dimension rubric — must maintain ≥ 8/10
8. **Get user re-approval**
9. **Update this list** with the new date and any score changes

---

## Adding to the Protection List

When a page/component reaches protection threshold:

1. Score it using the rubric in `08-quality-testing/quality-gates.md`
2. If score ≥ 8/10, add it to the table above
3. Add a comment in the code: `// PROTECTED — see PROTECTION-LIST.md`
4. Add to CLAUDE.md: `## PROTECT LIST` section
5. Add to AGENTS.md: ensure all AI agents know not to modify

---

## AI Agent Integration

Add to your CLAUDE.md and AGENTS.md:

```markdown
## PROTECT LIST (do NOT touch)

- {Page Name} (`/route/path`) — {score}/10, {reason}
- {Component Name} (`/component/path`) — {score}/10, {reason}
```

This ensures AI agents skip these files during bulk refactors, code cleanup, or automated modifications.
