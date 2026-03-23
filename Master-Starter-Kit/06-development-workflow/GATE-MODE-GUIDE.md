# Gate Mode Guide

## What Are Gates?

Gates are approval checkpoints in the ORCHESTRATOR where Claude pauses execution and asks for your review. There are 21 gates across the full 28-step workflow. They prevent bad decisions from cascading through the project plan.

## Choosing Your Gate Mode

Set `GATE_MODE` in the ORCHESTRATOR STATE BLOCK during Step 1 intake, or change it at any time by telling Claude: "Set GATE_MODE to semi-auto."

### Manual Mode (Default)

```
GATE_MODE: "manual"
```

**All 21 gates pause for your approval.** Claude shows what it generated and waits for you to say "looks good" or request changes.

**Best for:**
- First time using the kit
- Complex projects (15+ services, multi-tenant, mobile + web)
- Teams where multiple stakeholders need to review
- When you want to learn what the kit does at each step

**Time impact:** +1-2 hours of active review (total ~6-8 hours)

### Semi-Auto Mode

```
GATE_MODE: "semi-auto"
```

**Only 5 structural gates pause.** The remaining 16 informational gates auto-pass with a summary logged to `dev_docs/completeness/gate-log.md`.

**Structural gates that still pause:**

| Gate | Step | Why It Pauses |
|------|------|---------------|
| Intake confirmation | Step 1 | Must verify Claude understood your project |
| Tribunal verdict | Step 3 | Must approve feature priorities before specs |
| Service specs | Step 5 | Architecture decisions are expensive to change |
| Task coverage | Step 8 | Sprint plan drives all development work |
| Pre-handoff | Step 16 | Final quality check before coding begins |

**Best for:**
- Experienced users who've run the kit before
- Medium-complexity projects (5-15 services)
- Solo developers who trust the process
- When you want faster execution but still control key decisions

**Time impact:** ~30 min of active review (total ~4-5 hours)

### Auto Mode

```
GATE_MODE: "auto"
```

**All gates auto-pass.** Claude runs the entire ORCHESTRATOR without stopping. A complete gate log and completeness dashboard are generated at the end for review.

**Best for:**
- Re-running the kit on a project you've already planned once
- Rapid prototyping where speed matters more than perfection
- Overnight execution (start it, come back to results)
- Experienced users on simple projects (< 5 services)

**Time impact:** ~0 min active review during run (total ~3-4 hours), but plan 30-60 min to review the dashboard afterward

**Caution:** Auto mode still generates high-quality output, but if Claude misunderstands something in Step 1, the error propagates through all subsequent steps. Review the completeness dashboard carefully.

## Gate Log

Regardless of mode, every gate decision is logged to:

```
dev_docs/completeness/gate-log.md
```

Format:
```markdown
## Gate Log

| Step | Gate | Mode | Decision | Timestamp | Notes |
|------|------|------|----------|-----------|-------|
| 1 | Intake confirmation | manual | approved | 2026-03-11T10:23 | User confirmed 8 services |
| 3 | Tribunal verdict | semi-auto | approved | 2026-03-11T11:45 | Adjusted: moved analytics to Phase 2 |
| 5 | Service specs | auto | auto-passed | 2026-03-11T12:30 | 8/8 specs generated, avg depth 8.4/10 |
```

## Changing Mode Mid-Run

You can change the gate mode at any time:

- **"Set GATE_MODE to auto"** — remaining gates will auto-pass
- **"Set GATE_MODE to manual"** — remaining gates will pause for approval
- **"Pause at the next gate"** — one-time manual gate, then return to current mode

Claude updates `GATE_MODE` in the STATE BLOCK when you change it.

## Completeness Dashboard (Auto Mode)

When running in auto mode, Claude generates a comprehensive dashboard at the end:

```
dev_docs/completeness/auto-mode-dashboard.md
```

This includes:
- Summary of all gate decisions
- Service matrix completeness
- Screen matrix completeness
- Task coverage percentage
- Depth scores per spec (with any below-threshold flagged)
- Cross-reference validation results
- Recommended manual review points

**Review this dashboard before starting to code.** It's your replacement for the 21 individual gate approvals.

## Recommended Progression

1. **First project:** Use `manual` to learn the kit
2. **Second project:** Use `semi-auto` now that you trust the process
3. **Third+ project:** Use `auto` for speed, review dashboard at end
4. **Re-runs:** Always use `auto` — you've already approved the architecture
