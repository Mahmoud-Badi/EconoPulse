# Claude Code Plugins Guide

## Overview

Plugins extend Claude Code's capabilities with specialized workflows, quality checks, and integrations. They're enabled in `~/.claude/settings.json` under the `enabledPlugins` key.

## Configuration File

**~/.claude/settings.json:**

```json
{
  "permissions": {
    "allow": [],
    "deny": []
  },
  "enabledPlugins": {
    "superpowers@claude-plugins-official": true,
    "typescript-lsp@claude-plugins-official": true,
    "frontend-design@claude-plugins-official": true,
    "code-review@claude-plugins-official": true,
    "pr-review-toolkit@claude-plugins-official": true,
    "security-guidance@claude-plugins-official": true,
    "commit-commands@claude-plugins-official": true,
    "claude-md-management@claude-plugins-official": true,
    "feature-dev@claude-plugins-official": true,
    "context7@claude-plugins-official": true,
    "playwright@claude-plugins-official": true,
    "github@claude-plugins-official": true,
    "supabase@claude-plugins-official": true
  }
}
```

## Plugin Details

### Core Workflow (Auto-Trigger)

#### superpowers
**What it does**: The foundational workflow plugin. Adds TDD methodology, systematic debugging, planning phases, code review requests, parallel agent orchestration, verification before completion, and git worktree management.

**When it triggers**: Automatically on many actions -- debugging sessions, feature implementation, code review, git operations.

**Key capabilities**:
- Systematic debugging: isolate, hypothesize, test, verify
- TDD: write test first, implement, refactor
- Planning: break complex tasks into phases
- Parallel agents: spin up multiple Claude instances for independent tasks
- Verification: always verify before marking done

#### typescript-lsp
**What it does**: Integrates TypeScript Language Server Protocol for real-time type checking, hover information, go-to-definition, and diagnostics.

**When it triggers**: Automatically when working with `.ts` and `.tsx` files.

**Key capabilities**:
- Type error detection without running `tsc`
- Symbol resolution and navigation
- Auto-import suggestions

### Frontend

#### frontend-design
**What it does**: Production-grade UI generation following design system tokens, accessibility standards, and responsive patterns.

**Slash command**: `/frontend-design`

**When to use**: When building new UI components or pages. Generates code that uses your design tokens, includes ARIA attributes, handles all states (loading, error, empty, data).

### Quality

#### code-review
**What it does**: Multi-agent code review that checks architecture, security, performance, and style independently, then synthesizes findings.

**Slash command**: `/code-review`

**When to use**: Before merging significant changes. Runs 4 specialized review agents in parallel.

#### pr-review-toolkit
**What it does**: Comprehensive pull request review with diff analysis, test coverage check, breaking change detection, and review comment generation.

**Slash command**: `/review-pr`

**When to use**: When reviewing PRs from team members or before creating your own PR.

#### security-guidance
**What it does**: Security-focused review for authentication flows, data protection (PHI/PII), authorization checks, input validation, and secret management.

**When it triggers**: Automatically when working with auth code, database queries with user data, or API endpoints handling sensitive information.

**When to use**: Explicitly for auth implementations, HIPAA-related features, or any code handling personal data.

### Git

#### commit-commands
**What it does**: Automated git workflows for committing, pushing, and creating PRs with conventional commit messages.

**Slash commands**:
- `/commit` -- Stage and commit with a conventional commit message
- `/commit-push-pr` -- Commit, push, and create a GitHub PR in one step
- `/clean_gone` -- Clean up local branches whose remote tracking branch is gone

**When to use**: After completing a feature or fix. Generates descriptive commit messages from the diff.

### Documentation

#### claude-md-management
**What it does**: Maintains and improves your CLAUDE.md and other AI context files.

**Slash commands**:
- `/revise-claude-md` -- Update CLAUDE.md with new learnings from the current session
- `/claude-md-improver` -- Analyze and suggest improvements to CLAUDE.md structure and content

**When to use**: At the end of a session when you've learned new patterns or encountered gotchas worth recording.

### Feature Development

#### feature-dev
**What it does**: Guided 7-phase feature development workflow: plan, schema, API, UI, test, verify, document.

**Slash command**: `/feature-dev`

**When to use**: When starting a new feature from scratch. Walks through every layer systematically so nothing gets missed.

### External Integrations

#### context7
**What it does**: Queries live documentation for libraries and frameworks (React, Next.js, Drizzle, tRPC, etc.) to get current API details.

**When it triggers**: Automatically when Claude needs to reference library APIs. Also manages the Context7 MCP server.

**Key capabilities**:
- Resolve library IDs
- Query specific documentation sections
- Get code examples for current API versions

#### playwright
**What it does**: Browser automation for E2E testing and visual verification. Manages the Playwright MCP server.

**When it triggers**: When running E2E tests or visual design reviews.

**Key capabilities**:
- Navigate to pages, click elements, fill forms
- Take screenshots at different viewport sizes
- Access console messages and network requests

#### github
**What it does**: GitHub API integration for issues, PRs, releases, and repository management.

**When it triggers**: When working with GitHub-related tasks.

#### supabase (optional)
**What it does**: Supabase integration for database management, auth, and storage.

**When to use**: Only if your project uses Supabase directly (not needed if you use Drizzle ORM with a Supabase-hosted PostgreSQL).

## Recommended Plugin Sets by Project Type

### Full-Stack Web App (All 13)
Enable all plugins for maximum capability.

### API-Only Backend (8)
```
superpowers, typescript-lsp, code-review, pr-review-toolkit,
security-guidance, commit-commands, feature-dev, context7
```

### Frontend-Only (9)
```
superpowers, typescript-lsp, frontend-design, code-review,
pr-review-toolkit, commit-commands, playwright, context7, github
```

### Minimal Setup (4)
```
superpowers, typescript-lsp, commit-commands, context7
```

## Plugin Interaction Patterns

Plugins work together in natural sequences:

1. **Feature development flow**: `feature-dev` guides phases, `context7` provides API docs, `frontend-design` generates UI, `superpowers` handles TDD
2. **Quality flow**: `code-review` reviews code, `security-guidance` checks auth/data, `pr-review-toolkit` reviews the PR
3. **Session flow**: `superpowers` manages session structure, `claude-md-management` captures learnings, `commit-commands` handles git

## Troubleshooting

- **Plugin not triggering**: Check that it's listed in `enabledPlugins` with `true` value. The key format is `{plugin-name}@claude-plugins-official`.
- **Plugin conflict**: Plugins don't conflict with each other. They activate independently based on context.
- **Missing slash command**: Ensure the plugin is enabled. Restart Claude Code if recently added.
