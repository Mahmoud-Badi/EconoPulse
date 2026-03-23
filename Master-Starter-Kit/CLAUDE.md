# Master Starter Kit — AI Agent Instructions

## What This Is

A 50-section, 550+ template project planning framework with a 90+ step autopilot engine across 7 phases (setup & intake, research, architecture & design, core planning, quality & infrastructure, operations & marketing, hardening — including 17 hardening rounds). You generate a fully-planned, ready-to-code project by following the ORCHESTRATOR. Stakeholder communications and Mermaid diagrams are generated at every major gate checkpoint starting from Step 1.

## Entry Point

**Read `ORCHESTRATOR.md` first.** It contains the complete step-by-step flow, state management, and all instructions. Do not skip it.

## Kit Structure

```
00-discovery/        → Project brief, intake questions
01-tribunal/         → 10-round adversarial research (60-100 files)
02-architecture/     → DB, API, migrations, state management
03-documentation/    → Specs, design docs, state files, contracts
04-phase-planning/   → Phase and task templates
05-dev-infrastructure/ → Docker, turbo, eslint, husky, CI/CD
06-development-workflow/ → Session rituals, dev onboarding
07-ui-design-system/ → Design tokens, components, anti-slop rules
08-quality-testing/  → Jest, Playwright, performance configs
09-deployment-operations/ → Env vars, monitoring, environments
10-generators/       → Auto-generation prompts (20 generators + depth requirements)
11-new-capabilities/ → Feature flags, caching, i18n, analytics
12-examples/         → 49 filled-in examples (reference, don't copy)
13-lessons-gotchas/  → Production battle scars
14-17 mobile/        → Mobile platform, UI, native features, deployment
18-user-documentation/ → Help center, onboarding flows, release notes
19-marketing/        → SEO, content, email, social, launch planning
20-post-launch/      → Post-launch lifecycle, roadmap, feedback loops
21-incident-response/ → Severity levels, runbooks, postmortems, on-call
22-cicd-pipeline/    → Pipeline architecture, deployment patterns, IaC
23-customer-support/ → Support platform, KB, SLAs, escalation workflows
24-ai-ml-integration/ → LLM patterns, RAG, vector DBs, AI safety
25-financial-modeling/ → Revenue projections, unit economics, runway
26-multi-tenant-saas/ → Tenant isolation, billing, rate limiting
27-team-communication/ → Sprints, standups, retros, ceremonies
28-competitive-intelligence/ → Battle cards, feature parity, monitoring
29-legal-documents/  → Privacy policy, ToS, DPA, EULA, cookie policy
30-billing-payments/ → Billing architecture, dunning, tax, usage metering
31-stakeholder-communications/ → Phase-gated comms, 42 Mermaid diagram templates, recurring reports, generator
32-integrations/     → Integration strategy, webhooks, resilience, health monitoring, category patterns
33-customer-experience-ops/ → AI chatbots, self-service, omnichannel routing, CX team operations
34-hardening/        → Audit checklists, enhancement categories, depth protocol, expansion templates
35-business-intelligence/ → Data warehouse, ETL pipelines, executive reporting, unified metrics registry
36-seo/              → SEO strategy, technical SEO, on-page, off-page, content SEO, specialized verticals, AI search, measurement, testing, incidents, migrations, audits
37-enhance/          → Enhance path for existing applications (deep audit, quality scorecard, gap analysis)
38-repurpose/        → Repurpose path for pivoting/forking existing apps to new verticals
39-review-system/    → Design review portal (gallery, full-screen reviewer, thumbnail gen, AI analysis)
40-investor-fundraising/ → Pitch deck, cap table, due diligence, term sheets, board decks, valuation
41-team-hiring-ops/  → Org chart, hiring playbook, compensation, interviews, onboarding, culture
42-data-privacy-engineering/ → GDPR Article 30, consent management, DSR workflows, data flow mapping, retention
43-partner-channel-strategy/ → White-label, reseller portal, revenue sharing, affiliates, co-marketing
44-product-led-growth/ → Growth loops, PQL scoring, activation experiments, viral mechanics, analytics
45-customer-migration-import/ → Import wizard, CSV/API migration, competitor switch, bulk processing, validation
46-marketplace-plugin-ecosystem/ → Plugin architecture, app store UX, developer portal, SDK, security model
47-kit-feedback/     → Kit learning loop: capture project improvements, sanitize, export for harvest
48-ai-agent-personas/ → AI agent identity system: archetypes, consultant roles, phase profiles, persona generation
49-tech-stack-health/ → Ongoing tech stack health monitoring, version currency, cost tracking, upgrade assessments
50-security-lifecycle/ → Living security posture management: recurring audits, vulnerability tracking, compliance dashboard
```

## Key Paths (Unified dev_docs Folder)

All project documentation goes into a single `dev_docs/` folder:

```text
dev_docs/
  specs/           → Service specs, screen specs, contracts, database docs
  services/        → Service hub files (one per service, single source of truth)
  services/modules/ → Module-level hub files (8-15 per service)
  tracker/         → Master tracker (subtasks, dependencies, timeline, milestones)
  templates/       → Stack-specific code templates (router, schema, component, test)
  mocks/           → API mock server for parallel frontend/mobile development
  tasks/           → Task files organized by phase
  foundations/     → Design system, quality gates, session protocol, design-direction.md, design-review-summary.md
  components/      → Component catalog
  audit/           → Codebase audit reports
  completeness/    → Service matrix, screen matrix, phase coverage, depth dashboard
  hardening/       → Audit findings, enhancement logs, depth verification, deep dive, expansion
  cx-operations/   → CX operations plans (chatbot, self-service, health scoring, team ops)
  bi/              → Business intelligence (warehouse, ETL, metrics registry, executive reports)
  privacy/         → Data privacy engineering (data flows, consent, DSR workflows, retention, classification)
  migration/       → Customer migration & data import (import wizard, CSV, API, competitor switch)
  team-ops/        → Team & hiring ops (org chart, hiring, compensation, reviews, culture)
  plg/             → Product-led growth (growth loops, PQL, experiments, analytics, funnels)
  marketplace/     → Marketplace & plugin ecosystem (architecture, UX, developer portal, SDK)
  partner-channel/ → Partner & channel strategy (tiers, revenue sharing, affiliates, white-label)
  fundraising/     → Investor & fundraising (pitch deck, cap table, timeline, board decks)
  sprints/         → Sprint plan documents
  decisions/       → Decision log
  comms/           → Stakeholder communications (generated at gate checkpoints)
  diagrams/        → Excalidraw diagrams (.excalidraw + rendered .png) for architecture, flows, stakeholder visuals
  client-log/      → Weekly client-facing work logs with developer attribution
  kit-feedback/    → Kit improvement candidates (pending, exported) for /kit-harvest
  STATUS.md        → Task dashboard
  CHANGELOG.md     → Work log
```

## Rules

1. **Follow ORCHESTRATOR step order.** Do not skip steps or reorder them.
2. **Stop at every GATE checkpoint.** Wait for user approval before proceeding.
3. **Use templates, don't invent structure.** Every template uses `{{PLACEHOLDER}}` syntax — fill them in, don't redesign them.
4. **Check PLACEHOLDER-REGISTRY.md** when unsure what a variable means or what fills it.
5. **Read LESSONS-LEARNED.md** before making architecture decisions — it contains hard-won production patterns.
6. **Respect the PROTECT-LIST.** Once a file is on the protect list, do not modify it without explicit user permission.
7. **Maintain state files.** Update STATUS.md, handoff.md, and DEVLOG.md as you work. These bridge context between sessions.
8. **Examples are reference only.** Files in `12-examples/` show the expected output format. Do not copy them into the project — generate fresh content.
9. **Count after each step.** The ORCHESTRATOR requires progress counts (files generated, tasks created, etc.) after every step.
10. **Technology-agnostic until Step 1.** Templates have conditional sections (`<!-- IF FRAMEWORK -->`). Do not assume a stack until intake is complete.
11. **Completeness enforcement.** Steps 4.5, 6.5, and 8.5 cross-reference services, screens, and tasks to catch gaps. Do not skip these verification steps.
12. **Depth enforcement.** Service specs must score ≥9/10 quantitative AND ≥2/2 qualitative, screen specs ≥8/10 AND ≥2/2 qualitative, and features need ≥7/8 task layers. Steps 13-28 have per-step minimum file counts and word counts. See `10-generators/DEPTH-REQUIREMENTS.md`.
13. **Hardening enforcement.** Steps 29-33 are mandatory for all paths (Express, Lite, Standard, Full, Migration, Library/CLI, Guided). Each step uses multi-round protocol with early exit on zero findings. Do not skip or defer hardening steps.
14. **Think-Then-Generate is mandatory.** Before generating any service spec, screen spec, or task file, complete the TTG reasoning protocol in the conversation. Answer ALL questions. Do not skip or abbreviate (except in auto gate mode where abbreviated TTG is allowed). The user must see your reasoning before you write the spec.
15. **Session boundaries are real.** At Steps 2, 5, 8.5, 16.5, 18.8, and 28.5, persist all context to `dev_docs/session-context.md` and announce that the user can safely start a new conversation. On resume, always read `session-context.md` and `handoff.md` before doing any work.
16. **Depth over speed.** Meeting minimum thresholds is the floor, not the goal. Specs should describe something you'd actually want to use as a real user. If a service spec reads like generic documentation, it's too shallow — it should read like a product manager's detailed brief that makes you excited to build the feature.
17. **Show Me rule (testing enforcement).** When claiming tests pass, features work, or quality gates are met — include the actual proof artifact (console output, screenshots, reports). "All tests pass" without evidence is not acceptable. See `08-quality-testing/enforcement/` for the full enforcement system, proof artifact definitions, and verification gate checklists.
18. **Live version verification is mandatory.** Never assume technology versions from training data. Step 1.5 requires live lookup of all versions using MCP tools (Context7, Firecrawl, WebSearch) before they are locked into CONFIG. Version numbers in kit files (decision tree, examples, lessons) reflect the Delta TMS V3 build and may be outdated — they are reference points, not current recommendations.
19. **No empty directories.** Every directory created during setup must be populated by a subsequent step. Step 16.7 enforces this at the end of the quality phase. An empty directory at completion is a kit failure.
20. **No batching Steps 13-28.** Do not batch Steps 13-28 into fewer than 6 agent calls. Each call may cover at most 3 adjacent steps. This prevents shallow output across planning areas.
21. **Enforcement gates are mandatory.** Every verification gate in `08-quality-testing/enforcement/ENFORCEMENT-GATES.md` must pass before its associated step can be marked complete. The 16 gates cover: AI context integrity, design consistency, responsive verification (enhanced with responsive design spec), shell detection, dead UI prevention, workflow completeness, screen user-completeness, user journey verification, DR verification, infrastructure sizing (enhanced with compliance cost overlay), persona-screen completeness, cross-document consistency, phantom table check, dead UI sweep (existing codebases), regulatory completeness (conditional on compliance requirements), and client log consistency. Missing proof artifacts = step INCOMPLETE.
22. **Post-Task Protocol is non-negotiable.** After completing ANY task or subtask during development, update: STATUS.md (toggle checkbox), handoff.md (what was done + what's next), DEVLOG.md (append entry), master-tracker.md (subtask status), and CLIENT-LOG (client-facing entry with developer attribution). This takes 2-4 minutes and IS part of the task. Use `/project:update-state {task_id} {outcome}` for quick updates. Four hooks enforce this: `post-task-protocol` (reminds on Stop), `commit-state-check` (blocks stale commits), `context-anchor` (survives compaction), `session-completion-hook` (verifies state file freshness at session end). See `03-documentation/state-files/POST-TASK-PROTOCOL.md`.
23. **Invoke skills and plugins proactively.** Do not wait for the user to tell you to use available tools. At every step, check if a plugin, skill, command, or MCP server would produce better output. Key invocations: `/brainstorming` before creative work, `/frontend-design` before UI, `context7` for library docs, `playwright` for screenshot verification, `/code-review` before commits, `quality-gate` skill at feature completion, `tribunal-runner` skill for architecture decisions. See the Skill Invocation Guide in ORCHESTRATOR.md for per-step recommendations.
24. **Optimize for earliest usable value.** When sequencing phases, after respecting data dependencies, order by which phase lets the user start performing real daily workflows soonest. The user should be able to start using parts of the system in production while the rest is still being built. Every feature phase must declare its Usability Milestone (what the user can now do), what it Replaces (manual process or external tool), and whether it is Standalone Usable. Step 8.55 enforces this with a Time-to-First-Use Timeline that the user approves. See `04-phase-planning/phase-planning-guide.md` Rule 6.
25. **Session Completion Checklist is mandatory.** At every session boundary and before ending any conversation, complete the 6-step Session Completion Checklist from `03-documentation/state-files/session-completion-checklist.template.md`: (1) Update STATUS.md, (2) Update handoff.md, (3) Append to DEVLOG.md, (4) Sync master tracker, (5) Persist session context, (6) Echo the Golden Rule. Run `node scripts/check-tracker.js` to verify STATE file consistency. This takes 2-3 minutes. Skipping it costs 30+ minutes next session. Always complete it.
26. **Plan Change Protocol is non-negotiable.** After ANY plan modification (adding features, phases, tasks; deferring or removing scope; changing sprint assignments), update: STATUS.md (add/remove tasks, update counts), master-tracker.md (subtask rows), dependency-map.md (dependency edges), timeline.md (week assignments), handoff.md (note plan change), and DEVLOG.md (plan change entry). This takes 5-8 minutes and IS part of the plan change. The `plan-change-detector` hook auto-propagates these updates on every Stop event. Use `/plan-changed` for manual invocation. Run `node scripts/propagate-plan-change.js` to validate consistency. See `03-documentation/state-files/PLAN-CHANGE-PROTOCOL.md`.
27. **Client Work Log is auto-generated.** After every task completion, Post-Task Protocol Step 6 appends a client-facing entry to the current week's client log (`dev_docs/client-log/week-NN_YYYY-MM-DD.md`). Entries are translated from DEVLOG into client-friendly language — no file paths, no internal jargon, focus on deliverables. Each entry includes developer attribution (from `git config user.name`). The weekly header shows milestone progress and schedule status. See `03-documentation/state-files/CLIENT-LOG.template.md`.
28. **Architecture Anchor is the system's memory.** `dev_docs/ARCH-ANCHOR.md` is a living snapshot of system understanding — tech stack, services, data model, constraints, rejected alternatives, and anti-hallucination anchors. Update it (overwrite, don't append) after any task that changes architecture, data model, service boundaries, API contracts, auth flow, or infrastructure. Do NOT update after pure UI tweaks, bug fixes, or test additions. Maximum 3000 words. See `03-documentation/state-files/ARCH-ANCHOR.template.md`.
29. **Verify context after every compaction or session start.** After any context loss (compaction, new session, long pause), read ARCH-ANCHOR.md → handoff.md → STATUS.md → DEVLOG.md (last 3 entries) BEFORE doing any work. Answer: What project? What stack? What phase? What's next? What are 3 constraints? If any answer contradicts ARCH-ANCHOR, re-read the relevant spec. If the user provides an answer to a previous question, first read handoff.md Blockers, acknowledge the question, confirm resolution, update handoff.md, THEN continue. Use `/verify-context` for structured verification.
30. **Sprint-scoped execution for all builds.** GSD uses sprint-scoped execution — one sprint (20-40 tasks) per session with protocol updates, pattern tracking, and retry-with-escalation. For projects with 40+ tasks, GSD auto-generates sprints grouped by service prefix with dependency ordering. Each sprint ends with a handoff for the next session. Sprint boundaries replace the old window checkpoints. Run `/gsd` to start the next sprint, `/gsd sprint-NNN` to target a specific one, `/gsd-status` to check progress. See `PHASE-CONTEXT.md` for per-phase context loading profiles.
31. **Phase context profiles control what you load.** Different phases need different files in context. `dev_docs/PHASE-CONTEXT.md` defines Tier 1 (always load), Tier 2 (load per task), Tier 3 (load on demand), and Tier 4 (never load for this phase). Following the profile prevents wasting context budget on irrelevant files. Regenerate PHASE-CONTEXT.md at every phase transition.
32. **Run validators at every gate.** The `tools/validators/` directory contains automated validation scripts (depth, cross-refs, anti-patterns, state files, feature gates). Run `tools/validators/gate-checker.sh {step}` at every gate checkpoint. Gate definitions are in `tools/validators/gate-definitions.json`. Validators MUST pass before advancing to the next step. Use `tools/validators/collect-proofs.sh` to archive proof artifacts. CI templates in `tools/ci/` can enforce these in GitHub Actions.
33. **Generators have dependencies.** Before running any generator, check `10-generators/GENERATOR-DAG.md` for required inputs. If dependencies are missing, the generator will produce incomplete output. Use `10-generators/INCREMENTAL-VALIDATION.md` to validate output after each generation step — don't wait until hardening to find problems. If a spec fails depth audit, use `10-generators/REGENERATOR.md` to expand only the failing sections (max 3 attempts before escalating).
34. **Gotchas have severity tiers.** When adding to `13-lessons-gotchas/`, tag each entry with severity (CRITICAL / HIGH / MEDIUM / LOW) and include detection patterns (grep commands, lint rules) where possible. See `13-lessons-gotchas/README.md` for the format.
35. **Structured interaction is mandatory.** Always use `AskUserQuestion` for user input — never ask questions as plain text expecting a typed reply. Every time you need user input (confirmations, choices, preferences, approvals, gate checkpoints, intake questions, architecture decisions), use `AskUserQuestion` with selectable options (single or multi-select), a free-form "Other" option, and clear concise labels. The only exception is free-form discussion the user explicitly initiates.
36. **Kit feedback loop is automatic.** Whenever you perform ANY of these actions, you MUST ALSO write a feedback candidate to `dev_docs/kit-feedback/pending/` using the template from `47-kit-feedback/kit-feedback-candidate.template.md`:
    - Add a lesson to `dev_docs/lessons-register.md` that could apply to other projects (not just this one)
    - Discover a technology-specific gotcha during development (version bugs, config surprises, undocumented behavior)
    - Add a new anti-pattern to `dev_docs/anti-patterns/`
    - Improve a `*.template.md` file beyond just filling placeholders (add sections, fix instructions, improve structure)
    - Note a process gap in the orchestrator or session workflow ("the kit should..." or "missing step...")
    - Manually create a `{{PLACEHOLDER}}` that isn't in the kit's PLACEHOLDER-REGISTRY.md
    This is NOT optional and does NOT require the user to ask. When you write the lesson/gotcha/anti-pattern, write the feedback candidate in the same action. Apply sanitization rules from `47-kit-feedback/SANITIZATION-RULES.md` inline: strip project names, client names, URLs, keys, business terms — keep only technology names, error messages, and the generalizable pattern. The Stop hook will auto-export and auto-commit pending candidates on session end — no manual export step needed.
