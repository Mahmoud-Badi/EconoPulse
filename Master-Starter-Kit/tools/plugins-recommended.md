# Recommended Claude Code Plugins

Install these plugins for the full Master Starter Kit experience.

## Install Command

In Claude Code, run `/plugin install <name>@claude-plugins-official` for each plugin below, or enable them via Claude Code settings.

## Core (Required)

| Plugin | Purpose |
|--------|---------|
| `superpowers` | Brainstorming, plan writing, plan execution, debugging, code review, TDD, git worktrees |
| `frontend-design` | Production-grade UI generation — used by recreate skill and GSD |
| `feature-dev` | Codebase exploration + architecture agents |
| `context7` | Live library documentation lookups (version verification) |
| `playwright` | Browser automation + screenshots for GSD UI verification |

## Development Workflow

| Plugin | Purpose |
|--------|---------|
| `commit-commands` | `/commit`, `/commit-push-pr`, `/clean-gone` |
| `code-review` | Automated PR code review |
| `pr-review-toolkit` | Multi-agent PR review with specialized reviewers |
| `code-simplifier` | Post-implementation code cleanup |
| `hookify` | Custom behavioral enforcement rules |
| `claude-md-management` | Keep CLAUDE.md files current |

## Quality & Security

| Plugin | Purpose |
|--------|---------|
| `security-guidance` | Security hardening recommendations |
| `semgrep` | Static analysis and anti-pattern detection |
| `coderabbit` | AI-powered code review via CodeRabbit |

## Language Support (install what you need)

| Plugin | Purpose |
|--------|---------|
| `typescript-lsp` | TypeScript language server |
| `pyright-lsp` | Python type checking |
| `swift-lsp` | Swift language server |
| `kotlin-lsp` | Kotlin language server |

## Infrastructure & Deployment

| Plugin | Purpose |
|--------|---------|
| `vercel` | Deploy to Vercel (`/deploy`, `/logs`) |
| `supabase` | Supabase database tools |
| `github` | GitHub integration (issues, PRs, branches) |

## AI & Productivity

| Plugin | Purpose |
|--------|---------|
| `claude-code-setup` | Automation recommender for new projects |
| `agent-sdk-dev` | Claude Agent SDK development tools |
| `skill-creator` | Create and improve custom skills |
| `plugin-dev` | Build custom plugins |
| `playground` | Interactive HTML explorers |
| `firecrawl` | Web research and documentation scraping |

## Optional / Situational

| Plugin | Purpose |
|--------|---------|
| `greptile` | Deep codebase Q&A across large repos |
| `qodo-skills` | Org-level coding rules + PR resolution |
| `circleback` | Meeting notes integration |

## Third-Party Marketplaces

These require adding the marketplace first in Claude Code settings.

### buildatscale-claude-code
```json
"extraKnownMarketplaces": {
  "buildatscale-claude-code": {
    "source": {
      "source": "git",
      "url": "https://github.com/buildatscale-tv/claude-code-plugins.git"
    }
  }
}
```

| Plugin | Marketplace | Purpose |
|--------|------------|---------|
| `nano-banana-pro` | buildatscale-claude-code | AI image generation (Gemini) |
| `promo-video` | buildatscale-claude-code | Promotional video creation with Remotion |

## External MCP Servers (Optional)

The `recreate` skill requires these external MCP servers if you use screenshot-to-code:

- **Gemini MCP** — for pixel-accurate extraction and visual comparison
- **Super Design MCP** — for design token extraction

Configure these in your `~/.claude/mcp.json`.
