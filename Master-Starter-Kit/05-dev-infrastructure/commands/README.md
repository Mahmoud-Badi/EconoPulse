# Slash Command Templates

## Overview

These are reusable templates for Claude Code slash commands. Each `.md` file becomes a command that Claude reads when the user types the corresponding slash command (e.g., `/session-start`).

## Setup

1. Create a `.claude/commands/` directory in your project root
2. Copy the relevant `.template.md` files into `.claude/commands/`
3. Rename each file by removing the `.template` suffix (e.g., `session-start.template.md` becomes `session-start.md`)
4. Replace all `{PLACEHOLDERS}` with your project-specific paths and values

## Placeholders to Replace

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{DOCS_PATH}` | `docs/` | Path to your documentation folder |
| `{PROJECT_ROOT}` | `.` or absolute path | Monorepo root |
| `{DOMAIN}` | `NEMT` | Your business domain name |
| `{TOPIC_LIST}` | `trips, billing, dispatch, drivers` | Domain topics for `/domain-rules` |
| `@{project}` | `@delta` | Your package scope name |

## Categories (6)

### Session Management (4 commands)
Commands for starting/ending work sessions and tracking progress.

| File | Command | Purpose |
|------|---------|---------|
| `session-start.template.md` | `/session-start` | Read state files, report status, suggest next action |
| `session-end.template.md` | `/session-end` | Update state files, run checks, commit, report summary |
| `phase-check.template.md` | `/phase-check` | Count progress, run health checks, suggest advancement |
| `verify.template.md` | `/verify` | 8-step quality gate before marking work complete |

### Scaffolding (8 commands)
Commands that generate boilerplate code from documentation specs.

| File | Command | Purpose |
|------|---------|---------|
| `scaffold-schema.template.md` | `/scaffold-schema {table}` | Drizzle schema with relations and indexes |
| `scaffold-seed.template.md` | `/scaffold-seed {table}` | Reproducible seed data with faker |
| `scaffold-router.template.md` | `/scaffold-router {entity}` | tRPC router + validators + tests |
| `scaffold-form.template.md` | `/scaffold-form {entity}` | react-hook-form with zodResolver |
| `scaffold-component.template.md` | `/scaffold-component {name}` | Accessible component with design tokens |
| `scaffold-page.template.md` | `/scaffold-page {path}` | Next.js page + loading + error files |
| `scaffold-e2e.template.md` | `/scaffold-e2e {feature}` | Playwright E2E test spec |
| `scaffold-migration.template.md` | `/scaffold-migration {name}` | Drizzle SQL migration |

### Quality (3 commands)
Commands for verification and domain knowledge lookup.

| File | Command | Purpose |
|------|---------|---------|
| `feature-checklist.template.md` | `/feature-checklist {feature}` | 5-layer artifact verification |
| `domain-rules.template.md` | `/domain-rules {topic}` | Business rule lookup |
| `wire-sse.template.md` | `/wire-sse {feature}` | Generate SSE real-time infrastructure |

### Mobile (6 commands)
Commands for mobile development, building, and deployment.

| File | Command | Purpose |
|------|---------|---------|
| `scaffold-mobile-screen.template.md` | `/scaffold-mobile-screen {name}` | Mobile screen with navigation, loading/error/empty states |
| `scaffold-mobile-component.template.md` | `/scaffold-mobile-component {name}` | Mobile component with platform variants, accessibility |
| `scaffold-native-module.template.md` | `/scaffold-native-module {name}` | Native module bridge / platform channel |
| `mobile-verify.template.md` | `/mobile-verify` | 10-step mobile quality gate |
| `mobile-build.template.md` | `/mobile-build {profile}` | Trigger build (development/preview/production) |
| `mobile-deploy.template.md` | `/mobile-deploy {target}` | Submit to TestFlight / Play Store / Firebase |

### Design Pipeline (6 commands)
Commands for design research, generation, and verification.

| File | Command | Purpose |
|------|---------|---------|
| `design-verify.template.md` | `/design-verify` | Fast 7-point code inspection |
| `design-review.template.md` | `/design-review` | Deep Playwright visual audit |
| `design-research.template.md` | `/design-research {screen}` | UX pattern research |
| `design-generate.template.md` | `/design-generate {screen}` | Multi-AI design pipeline |
| `generate-asset.template.md` | `/generate-asset {type}` | Image generation with Gemini |
| `scrape-reference.template.md` | `/scrape-reference {url}` | Web design reference scraping |

## How Commands Work

When a user types `/session-start` in Claude Code:

1. Claude reads `.claude/commands/session-start.md`
2. The file contains step-by-step instructions
3. Claude executes each step using its available tools
4. The `$ARGUMENT` placeholder is replaced with whatever the user types after the command name

## Command Design Principles

1. **Exact steps, not vague goals**: Each command lists specific file reads, shell commands, and output formats.
2. **Self-contained**: Commands include all the context Claude needs. They reference doc paths, not abstract concepts.
3. **Fail-safe**: Commands check for prerequisites before generating code. Missing docs or schemas produce helpful error messages, not broken code.
4. **Report results**: Every command ends with a summary of what was done (file count, test results, error count).
