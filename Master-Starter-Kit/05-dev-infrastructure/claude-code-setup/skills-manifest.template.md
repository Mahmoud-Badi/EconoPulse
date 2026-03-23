# Skills Manifest Template

Place this file at `{project}/.claude/skills.md`. It tells Claude what slash commands are available and what each one does. Update it whenever you add or remove commands.

---

```markdown
# Skills Manifest

## Available Commands

### Session Management
| Command | Description |
|---------|-------------|
| `/session-start` | Read STATUS.md + handoff.md, report current state, suggest next action |
| `/session-end` | Update STATUS.md + handoff.md + DEVLOG.md, run tests, commit |
| `/phase-check` | Count completed vs remaining tasks, report health status |
| `/verify` | 8-step quality gate: typecheck, test, lint, build, design, visual, states |

### Scaffolding
| Command | Description |
|---------|-------------|
| `/scaffold-schema {table}` | Generate Drizzle schema + relations + indexes from doc spec |
| `/scaffold-seed {table}` | Generate reproducible seed data from SEED-DATA.md spec |
| `/scaffold-router {entity}` | Generate tRPC router + Zod validators + test scaffold |
| `/scaffold-form {entity}` | Generate react-hook-form + zodResolver form component |
| `/scaffold-component {name}` | Generate accessible component with design tokens + cva variants |
| `/scaffold-page {path}` | Generate page + loading.tsx + error.tsx with all 4 states |
| `/scaffold-e2e {feature}` | Generate Playwright E2E test from scenario spec |
| `/scaffold-migration {name}` | Generate Drizzle SQL migration from schema diff |

### Quality
| Command | Description |
|---------|-------------|
| `/feature-checklist {feature}` | 5-layer verification: DB, API, UI, testing, quality |
| `/domain-rules {topic}` | Look up business rules for a specific domain topic |
| `/wire-sse {feature}` | Generate 4-file SSE real-time setup (types, endpoint, hook, barrel) |

### Design Pipeline
| Command | Description |
|---------|-------------|
| `/design-verify` | Fast 7-point code inspection (no browser, <30 seconds) |
| `/design-review` | Deep 10-step Playwright visual audit at 3 breakpoints |
| `/design-research {screen}` | Research UX patterns from reference apps + Gemini deep research |
| `/design-generate {screen}` | Full multi-AI pipeline: research, concept, review, components, assets |
| `/generate-asset {type}` | Generate image with Gemini 3 Pro (empty-state, auth-bg, icon, etc.) |
| `/scrape-reference {url}` | Scrape website for design reference data |

### Diagrams & Visual Communication
| Command | Description |
|---------|-------------|
| `/diagram {description}` | Generate Excalidraw diagram from natural language (architecture, flows, competitive, stakeholder comms). Renders to PNG via Playwright for visual validation. Customize colors in `.claude/skills/excalidraw-diagram/references/color-palette.md` |

### External Plugin Commands
| Command | Source | Description |
|---------|--------|-------------|
| `/frontend-design` | frontend-design plugin | Production UI generation |
| `/feature-dev` | feature-dev plugin | 7-phase guided feature development |
| `/code-review` | code-review plugin | Multi-agent code review |
| `/review-pr` | pr-review-toolkit plugin | Comprehensive PR review |
| `/commit` | commit-commands plugin | Stage and commit with conventional message |
| `/commit-push-pr` | commit-commands plugin | Commit, push, and create PR |
| `/revise-claude-md` | claude-md-management plugin | Update CLAUDE.md with session learnings |
| `/claude-md-improver` | claude-md-management plugin | Analyze and improve CLAUDE.md |
| `/diagram {description}` | excalidraw-diagram skill | Generate visual Excalidraw diagrams with render validation |

### Auto-Triggered (No Slash Command)
| Plugin | Triggers On |
|--------|-------------|
| superpowers | Debugging, TDD, planning, verification, git operations |
| typescript-lsp | Any .ts/.tsx file work |
| security-guidance | Auth code, sensitive data, API endpoints |

## Typical Workflow Sequence

1. **Session start**: `/session-start`
2. **Plan feature**: Use superpowers planning or `/feature-dev`
3. **Research UI**: `/design-research {screen-type}` (if building UI)
4. **Scaffold**: `/scaffold-schema` -> `/scaffold-router` -> `/scaffold-page`
5. **Implement**: Write code with context7 + frontend-design
6. **Generate assets**: `/generate-asset {type}` or `/design-generate {screen}`
6b. **Generate diagrams**: `/diagram {description}` (architecture, flows, stakeholder visuals)
7. **Verify quality**: `/feature-checklist {feature}` -> `/design-verify`
8. **Visual review**: `/design-review` (deep Playwright audit)
9. **Full verify**: `/verify` (8-step gate)
10. **Commit**: `/commit` or `/commit-push-pr`
11. **Session end**: `/session-end`

## Project-Specific Paths

Update these placeholders in command templates:
- `{DOCS_PATH}` = path to your docs/ folder (e.g., `docs/`)
- `{PROJECT_ROOT}` = monorepo root
- `{DOMAIN}` = your business domain (e.g., "NEMT", "e-commerce", "SaaS")
- `{TOPIC_LIST}` = comma-separated domain topics for `/domain-rules`
```

---

## Customization Notes

1. **Remove unused commands**: If your project doesn't need SSE, remove `/wire-sse`. If no design pipeline, remove the Design Pipeline section entirely.

2. **Add project-specific commands**: Create new `.md` files in `.claude/commands/` for workflows unique to your project (e.g., `/deploy-staging`, `/run-migration`, `/sync-data`).

3. **Update the workflow sequence**: The "Typical Workflow Sequence" should match your actual development flow. Remove steps you don't use, add custom ones.

4. **Keep it current**: Update this manifest whenever you add, remove, or rename a command. Claude reads this file to understand what's available.
