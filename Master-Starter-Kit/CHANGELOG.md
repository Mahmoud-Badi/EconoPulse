# Changelog

All notable changes to the Master Starter Kit will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project uses [Semantic Versioning](https://semver.org/).

---

## [1.1.0] - 2026-03-19

### Added

- `04-phase-planning/pre-task-reading-lists.md` — universal reading list (4 global paths) + type-specific lists (backend/frontend/database/integration/E2E/mobile/domain); every task context header must include ≥8 explicit file paths
- `03-documentation/spec-layer/catalogs/business-rule-reference.template.md` — per-domain business rule catalog template for Step 8.4
- `03-documentation/spec-layer/contracts/component-contract.template.md` — component-level contract template for Step 8.1
- `10-generators/MECHANICAL-DEPTH-CHECKER.md` — mechanical-level depth verification tool referenced in Step 31
- `10-generators/UI-STATE-MATRIX-GENERATOR.md` — UI state matrix generator referenced in Step 8.45
- `11-new-capabilities/parallel-subagent-orchestration.md` — 10 production-proven multi-agent patterns (orchestrator-worker, evaluator-optimizer, MCD knowledge graph, PAL isolation, etc.)
- `32-integrations/integration-failure-spec.template.md` — per-integration failure spec template for Step 14.9
- `tools/skills/website-builder/` — website builder skill with full orchestrator and sub-skills
- ORCHESTRATOR.md Autopilot Principle #15 — parallel-subagent-orchestration.md wiring; agents now consult this file when a step benefits from parallelism
- ORCHESTRATOR.md Step 8 — pre-task-reading-lists.md wired as step 2a; task verify requirement raised to ≥8 specific file paths per context header
- PLACEHOLDER-REGISTRY.md Template-Instance Placeholders section — documents per-instance placeholders for the three new templates (resolved at generation time, not at project intake)

### Fixed

- `plugin/plugin.json` — added 3 missing hooks that were on disk but not registered: `post-task-protocol.md`, `commit-state-check.md`, `context-anchor.md`; CLAUDE.md Rule 22 referenced all four hooks but only one was registered

---

## [1.0.0] - 2026-02-20

### Added

- 45+ step orchestrator engine (21 build planning + 5 quality + 2 advanced + 10 marketing + 2 BI/SEO + 5 hardening + sub-steps)
- 39 section directories (00-38) covering discovery through SEO, enhance, and repurpose paths
- 375+ markdown templates with `{{PLACEHOLDER}}` syntax and conditional sections
- Placeholder registry with ~390 unique variables, all documented
- Tribunal system with 10-round adversarial deep research process
- 21 generators for auto-generating project-specific documents
- 49 filled-in example files (TaskFlow SaaS, TaskFlow Mobile, DataPulse Python, marketing, BI, integrations)
- Mobile platform support for React Native (Expo), Flutter, and Native (Swift + Kotlin)
- User documentation infrastructure with doc enforcement hooks
- Marketing planning pipeline (10 steps) covering research, brand, launch, growth, and retention
- Developer onboarding template for team projects
- Data migration strategy template with stack-conditional sections
- State management decision tree for architecture planning
- Multi-environment configuration guide
- Performance testing configuration templates (Lighthouse CI, k6)
- Self-validation script for kit integrity checking
- Lessons learned from Delta TMS and Ultra TMS production projects (320 lines)
- 15 technology-specific gotcha guides (auth, DB, deploy, testing, mobile, etc.)
- 48 Claude Code command templates for scaffolding, design, and workflow
- 4 Claude Code skill implementations (kickoff, log, document-feature, capture-screenshots)
- 7 AI config templates (CLAUDE.md, AGENTS.md, GEMINI.md, Copilot, WORKFLOWS.md, LEARNINGS.md, MEMORY.md)
- Kit versioning with VERSION file and this CHANGELOG

### Notes

- Merged from Delta TMS V3 and Ultra TMS starter kits
- Technology-agnostic: supports JavaScript/TypeScript, Python, Ruby, and Go stacks
- Designed for AI-assisted development with Claude Code, but works with any workflow
