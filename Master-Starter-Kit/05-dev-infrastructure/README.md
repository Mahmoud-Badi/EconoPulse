# 05 — Dev Infrastructure

> Setup guides, Claude Code configuration, and reusable slash commands for your project.

## Purpose

This section provides everything needed to configure the development environment. Rather than raw config files (which vary per project), these are **guides** that Claude reads and uses to generate project-specific configurations.

## Contents

### [configs/](configs/)
Setup guides for the core toolchain:

| Guide | Covers |
|-------|--------|
| [turborepo-guide.md](configs/turborepo-guide.md) | Turbo.json pipeline config, task dependencies, caching |
| [biome-guide.md](configs/biome-guide.md) | Linting + formatting setup (Biome, ESLint alternatives) |
| [typescript-guide.md](configs/typescript-guide.md) | tsconfig patterns for monorepos, strict mode flags |
| [vitest-guide.md](configs/vitest-guide.md) | Unit test configuration, workspace setup, coverage |
| [playwright-guide.md](configs/playwright-guide.md) | E2E test configuration, webServer, CI setup |
| [deployment-configs.md](configs/deployment-configs.md) | Vercel, AWS, Docker deployment config guides |
| [env-vars.template.md](configs/env-vars.template.md) | .env.example template with categories |

### [claude-code-setup/](claude-code-setup/)
Configure Claude Code for maximum productivity:

| Guide | Covers |
|-------|--------|
| [README.md](claude-code-setup/README.md) | Overview of Claude Code configuration |
| [plugins-guide.md](claude-code-setup/plugins-guide.md) | All 13 recommended plugins with install commands |
| [mcp-servers-guide.md](claude-code-setup/mcp-servers-guide.md) | 9+ MCP servers with setup, config, and troubleshooting |
| [hooks-guide.md](claude-code-setup/hooks-guide.md) | PostToolUse hooks for auto-typecheck, lint, and test |
| [skills-manifest.template.md](claude-code-setup/skills-manifest.template.md) | .claude/skills.md template listing all commands |

### [commands/](commands/)
21 reusable slash commands organized by category:

| Category | Commands |
|----------|----------|
| **Session Management** | session-start, session-end, phase-check, verify |
| **DB + API Scaffolding** | scaffold-schema, scaffold-seed, scaffold-router, scaffold-migration |
| **UI Scaffolding** | scaffold-form, scaffold-component, scaffold-page |
| **Testing** | scaffold-e2e, feature-checklist |
| **Real-time** | wire-sse |
| **Domain** | domain-rules |
| **Design Pipeline** | design-verify, design-review, design-research, design-generate, generate-asset, scrape-reference |

See [commands/README.md](commands/README.md) for the full command reference.

## How AUTOPILOT.md Uses This Section

During **Step 5: Infrastructure Generation**, the autopilot:

1. Reads the tech stack decisions from `ARCHITECTURE/`
2. Uses `configs/` guides to generate project-specific config files
3. Uses `claude-code-setup/` to configure Claude Code (plugins, MCP servers, hooks)
4. Uses `commands/` templates to generate all 21 `.claude/commands/*.md` files
5. Generates `.claude/skills.md` from the skills manifest template

## Adapting for Your Stack

These guides cover multiple options. Claude will:
- Read the tech stack decision tree results
- Select the relevant guide sections
- Generate configs tailored to your chosen stack

For example:
- Chose **Vitest**? → Generate from `vitest-guide.md`
- Chose **Jest** instead? → The vitest guide includes Jest migration notes
- Chose **ESLint + Prettier**? → The biome guide includes ESLint alternative configs

## File Count

| Subfolder | Files |
|-----------|-------|
| configs/ | 7 |
| claude-code-setup/ | 5 |
| commands/ | 22 |
| **Total** | **34** |
