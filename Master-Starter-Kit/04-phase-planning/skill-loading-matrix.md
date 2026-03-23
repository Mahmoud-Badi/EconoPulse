# Dynamic Skill Loading Matrix

> **Purpose:** Enforce a 3-4 skill maximum per task and step. Prevents context bloat from loading all
>              available skills at once. Load only what this step and task type actually require.
>
> **Relationship to ORCHESTRATOR Skill Invocation Guide:**
> The ORCHESTRATOR guide lists WHAT skills are appropriate per step. This matrix enforces HOW MANY
> and WHEN. If they appear to conflict: the guide is canonical for skill selection; this matrix is
> canonical for budget enforcement. Both must be satisfied simultaneously.
>
> **How to use:**
> 1. Find your CURRENT_STEP range in Section 1
> 2. Load all skills in "Always Load" column first (≤ 2 skills)
> 3. Evaluate "Conditional Load" — load only if the CONFIG condition matches your project
> 4. Never load any skill in the "Do Not Load" column for this step range
> 5. Check your context budget level (Section 3) — if tight or critical, override to fewer skills
>
> **Override rule (GATE_MODE: auto):** Load only "Always Load" skills. Skip all conditional skills.
> This keeps autonomous runs lean and prevents skill cascade overhead.

---

## Section 1 — Master Loading Matrix

### Phase 1: Intake (Steps 0-2)

| Step | Step Name | Always Load (≤ 2) | Conditional Load | Do Not Load |
|------|-----------|-------------------|-----------------|-------------|
| Step 0 | Ecosystem Setup | none | `update-config` if configuring settings | All design, code, and generator skills |
| Step 1 | Discovery & Intake | `kickoff` | none | Generator skills, design skills, all code skills |
| Step 1.5 | Version Verification | `context7` | `firecrawl` if library not in Context7 | All design, planning, and code skills |
| Step 1.7 | Stakeholder Communication Setup | none | none | All technical skills |
| Step 1.9 | Creative Expansion Brainstorm | `brainstorming` | none | All implementation skills, all code skills |
| Step 2 | AI Config & Command Setup | none | none | All skills (config generation is template-based) |

### Phase 2: Research (Step 3)

| Step | Step Name | Always Load (≤ 2) | Conditional Load | Do Not Load |
|------|-----------|-------------------|-----------------|-------------|
| Step 3 | Tribunal (10 rounds) | `brainstorming`, `firecrawl` | `context7` for technical feasibility rounds | `frontend-design`, `code-review`, all mobile skills, all generator skills |

**Tribunal note:** The tribunal generates 60-100 files through adversarial research. Loading more than 2-3 skills per round causes context waste. Rotate skills per round if needed rather than loading all at once.

### Phase 3: Architecture & Design (Steps 4-7)

| Step | Step Name | Always Load (≤ 2) | Conditional Load | Do Not Load |
|------|-----------|-------------------|-----------------|-------------|
| Step 4 | Foundation Documents | `brainstorming` | none | `frontend-design`, `code-review`, all mobile skills |
| Step 4.5 | Mobile Foundation | `brainstorming` | mobile platform skill | All web-specific skills |
| Step 5 | Service Specs | `brainstorming` | `context7` if library docs needed for feasibility | `frontend-design`, `code-review`, all DB-schema skills, all mobile skills |
| Step 5.5 | Mobile Service Specs | `brainstorming` | mobile platform skill | All web-specific skills |
| Step 6 | Screen Specs | `brainstorming`, `frontend-design` | `playwright` for screenshot verification of existing patterns | `tribunal-runner`, `code-review`, all DB skills, all backend router skills |
| Step 6.5 | Mobile Screen Specs | `brainstorming`, `frontend-design` | mobile platform skill | All web-specific screen skills |
| Step 7 | API Contracts | none (template-based) | `context7` if referencing external API spec | All design, mobile, and marketing skills |

### Phase 4: Planning & Tasks (Steps 8-16)

| Step | Step Name | Always Load (≤ 2) | Conditional Load | Do Not Load |
|------|-----------|-------------------|-----------------|-------------|
| Step 8 | Task Generation | `generate-task` | `generate-sprint` if sprint planning in same step | All research skills, all design skills |
| Step 8.5 | Mobile Task Generation | `generate-task` | mobile task patterns | All web-specific task skills |
| Step 8.6 | Sprint Planning | `generate-sprint` | none | All research and design skills |
| Step 9 | Service Hub Generation | none (hub format is template-based) | none | All skills (reading lists sufficient) |
| Step 10 | Component Cataloging | none | `context7` for component library versions | All research, marketing, and mobile skills |
| Step 11 | Seed Data Generation | none | none | All skills (seed data is data-entry work) |
| Step 11.5 | Mobile Native Features | none | mobile platform skill | All web-specific skills |
| Step 12 | Design System Coding | `frontend-design` | `shadcn` if using shadcn/ui | All backend, DB, and research skills |
| Step 13 | Security Hardening | none | `context7` for auth library docs | All design and marketing skills |
| Step 14 | Error Handling & Observability | none | none | All design, research, and marketing skills |
| Step 15 | Diagram Generation | none | `mermaid` if generating architecture diagrams | All code and design skills |
| Step 16 | Pre-Handoff Verification | `verify-hub`, `quality-gate` | `anti-pattern-check` | All generative skills, all research skills |
| Step 16.5 | Cross-Reference Validation | none (validator is a generator, not a skill) | none | All skills |
| Step 16.7 | Directory Population Check | none | none | All skills |

### Phase 5: Advanced Capabilities (Steps 17-18.8)

| Step | Step Name | Always Load (≤ 2) | Conditional Load | Do Not Load |
|------|-----------|-------------------|-----------------|-------------|
| Step 17 | Advanced Features (config only) | none | `feature-flags` if CONFIG.FEATURE_FLAGS; `i18n` if CONFIG.I18N_ENABLED; `caching-strategy` if CONFIG.CACHE | All code, design, and research skills |
| Step 17.5 | Financial Modeling | none | none | All technical skills |
| Step 17.6 | Multi-Tenant Architecture | none | `context7` for multi-tenant framework docs | All design and marketing skills |
| Step 18 | Operations Planning | none | none | All design and research skills |
| Step 18.5 | Team Ceremonies | none | none | All technical skills |
| Step 18.8 | Handoff Preparation | none | none | All skills (handoff is state-file updates) |

### Phase 6: Extended Planning (Steps 19-28.8)

| Step | Step Name | Always Load (≤ 2) | Conditional Load | Do Not Load |
|------|-----------|-------------------|-----------------|-------------|
| Step 19 | Marketing Planning | none | `firecrawl` for competitor research | All technical skills |
| Steps 20-22 | Legal, Financial, Post-Launch | none | none | All technical skills |
| Steps 23-28 | CI/CD, Customer Support, BI, SEO, Competitive, Mobile | none | domain-specific skill only | All cross-domain skills |
| Step 28.8 | Extended Planning Summary | none | none | All skills |

### Phase 7: Hardening (Steps 29-33)

| Step | Step Name | Always Load (≤ 2) | Conditional Load | Do Not Load |
|------|-----------|-------------------|-----------------|-------------|
| Step 29 | Post-Completion Audit | `quality-gate` | none | All generative skills |
| Step 30 | Enhancement Round 1 | `enhancement-round` | none | All research skills |
| Step 31 | Enhancement Round 2 + Depth | `enhancement-round`, `depth-check` | none | All research and design skills |
| Step 32 | Enhancement Round 3 + Mechanical Depth | `depth-check` | none | All other skills |
| Step 33 | Expansion Plan + Ready-to-Code Gate | `quality-gate` | `expansion-planner` | All research and design skills |

### Development Phase (Post SB-4 — feature implementation)

| Task Context | Always Load (≤ 2) | Conditional Load | Do Not Load |
|-------------|-------------------|-----------------|-------------|
| Starting any new feature | `feature-dev` | none | All research, marketing, and planning skills |
| Before writing code | `code-review` | none | All planning skills |
| At PR / commit time | `commit`, `code-review` | `commit-push-pr` if ready for PR | All planning and design skills |
| UI verification needed | `playwright` | none | All planning skills |
| Quality gate check | `quality-gate` | none | All generative skills |

---

## Section 2 — Task-Type Loading Map

Uses the same task-type taxonomy as `04-phase-planning/pre-task-reading-lists.md`. The reading list defines WHAT files to read; this table defines WHICH skills to load alongside those files.

| Task Type | Reading List Category | Required Skills | Conditional Skills |
|----------|----------------------|----------------|--------------------|
| **Backend task** | Backend reading list | `code-review` (at completion) | `anti-pattern-check` if pre-commit review |
| **Frontend task** | Frontend reading list | `frontend-design` if task creates a new screen or component | `playwright` if visual verification needed |
| **Database task** | Database reading list | none (reading list is sufficient for DB work) | `context7` if ORM or query builder docs needed |
| **Integration task** | Integration reading list | `context7` (for live API docs), `firecrawl` (for non-npm tools) | none |
| **E2E test task** | E2E test reading list | `playwright` | none |
| **Mobile task** | Mobile reading list | `frontend-design` for mobile UI work | Mobile platform skill if native API needed |
| **Audit / verification task** | Universal + specific | `quality-gate` | `anti-pattern-check`, `depth-check` |
| **Documentation task** | Universal reading list | none (documentation is writing, not skill-assisted) | none |

### Task-Type Detection Rules

If the task file contains these keywords in its **Objective** line, use the corresponding task type:

| Keywords in Objective | Task Type |
|-----------------------|-----------|
| router, service, repository, validator, procedure | backend |
| page, component, hook, layout, view | frontend |
| schema, migration, seed, index, foreign key | database |
| integration, webhook, API client, third-party | integration |
| E2E test, Playwright test, end-to-end | E2E test |
| React Native, Flutter, iOS, Android, mobile | mobile |
| audit, review, verify, check, validate | audit / verification |
| documentation, guide, help center, release notes | documentation |

---

## Section 3 — Context Budget Enforcement

Context budget determines how many skills you can load, regardless of what the matrix permits.

| Budget Level | Context Used | Skill Loading Rule |
|-------------|-------------|-------------------|
| **Healthy** | < 40% of context window | Load up to 4 skills (Always Load + Conditional) |
| **Moderate** | 40-60% of context window | Load Always Load skills only (max 2) |
| **Tight** | 60-80% of context window | Load 0 skills — reading lists only; no skills |
| **Critical** | > 80% of context window | Stop work immediately; write current state to output file; signal session boundary |

### Estimating Context Level

Claude Sonnet 4.x context window ≈ 150,000 tokens ≈ 4,000 lines of conversation output.

Quick estimate:
- Count approximate lines in the current conversation
- Divide by 4,000
- Result × 100 = approximate % context used

If above 60%, reduce skill loading immediately. If above 80%, follow Critical protocol:
1. Write progress checkpoint to the current output file (even if incomplete)
2. Update handoff.md with exact stopping point and next action
3. Stop work
4. Let the next session start fresh with the skill-loading-matrix.md consulted first

### Context Budget Override

Even if a step range permits conditional skills, the context budget rule takes precedence:

```
If budget == Moderate: skip all conditional skills regardless of step matrix
If budget == Tight: skip all skills regardless of step matrix
If budget == Critical: do not load any skills; stop and save state
```

---

## Section 4 — Skill Combinations to Avoid

These combinations cause redundancy, conflicting context, or wasted tokens. Never load them together.

| Combination | Why to Avoid | Preferred Alternative |
|-------------|-------------|----------------------|
| `brainstorming` + `tribunal-runner` in the same step | Both generate divergent creative options — you get volume without convergence | Use `brainstorming` for open creative expansion; use `tribunal-runner` for structured adversarial debate. Run one at a time, output first, then the other. |
| `frontend-design` + `brainstorming` simultaneously | Brainstorm generates possibilities; frontend-design implements a specific approach. Doing both at once creates schizophrenic output. | Run `brainstorming` first → get user approval or pick a direction → then run `frontend-design` to execute that direction. |
| `firecrawl` + `context7` for the same technology | Both fetch external documentation. Loading both for the same tech doubles token cost with marginal benefit. | Use `context7` for npm/PyPI packages (it handles package registries well). Use `firecrawl` for non-npm tools, proprietary platforms, or when Context7 doesn't index the library. |
| `code-review` + `feature-dev` at the same time | `feature-dev` is for implementation; `code-review` is for verification. Mixing them creates an evaluation/generation conflict. | Run `feature-dev` to completion first → then run `code-review` as a separate step. |
| Any design skill during a backend-only or database-only task | Wrong domain context pollutes the generation. A DB schema task loaded with `frontend-design` context produces DB schemas influenced by UI concerns. | Respect domain separation. Load only skills appropriate to the task type per Section 2. |
| More than 2 skills during hardening phases (Steps 29-33) | Hardening is auditing + enhancement, not generation. High skill load during hardening causes over-generation instead of focused improvement. | One quality skill max during hardening (quality-gate, depth-check, or enhancement-round). |

---

## Section 5 — Integration with Pattern 6 (Dynamic Skill Loading)

This file is the reference implementation of Pattern 6 from `11-new-capabilities/advanced-agent-orchestration.md` Section 7.

### How Pattern 6 Uses This File

During Step 17 activation (when `AGENT_ORCHESTRATION.SKILL_LOADING == "dynamic"`):

1. This file is **copied** to `dev_docs/orchestration/skill-loading-matrix.md` — a project-specific version
2. The project copy can be extended: add project-specific skills to "Conditional Load" cells
3. All spawned agents MUST read their project copy before loading any skills (not this source file — the copy)
4. The agent notes the matrix version in its step-counter file for auditability

### Override Rules (Priority Order)

1. **Context budget** (Section 3) — highest priority, always checked first
2. **Do Not Load column** (Section 1) — skills listed here are never loaded for this step, regardless of other rules
3. **Conditional Load column** — load only if CONFIG condition is true AND budget permits
4. **Always Load column** — load these if budget level is Healthy or Moderate
5. **ORCHESTRATOR Skill Invocation Guide** — consulted for skill selection; this matrix consulted for count enforcement

If the ORCHESTRATOR guide lists a skill not in this matrix's Always Load or Conditional Load columns for the current step: check the Do Not Load column. If it's not there either, treat it as Conditional (load only if budget permits beyond the Always Load allotment).

### Extending the Matrix for Your Project

Projects with custom skills (project-specific validators, domain-specific tools) can extend the project copy:

```
| Step 8 | Task Generation | generate-task | [project-validator] if CONFIG.PROJECT_VALIDATOR | ... |
```

Never extend by adding more items to Always Load beyond 2. Always Load is capped at 2 to preserve context budget headroom.

---

## Cross-References

- `11-new-capabilities/advanced-agent-orchestration.md` — Section 7 (Pattern 6 overview and routing logic)
- `04-phase-planning/pre-task-reading-lists.md` — task-type taxonomy this matrix extends with skill assignments
- `ORCHESTRATOR.md` (Skill Invocation Guide table) — canonical source for WHAT skills exist per step
- `10-generators/AGENT-POLICY-SCHEMA.md` — policy schema that complements skill loading with tool allowlists
