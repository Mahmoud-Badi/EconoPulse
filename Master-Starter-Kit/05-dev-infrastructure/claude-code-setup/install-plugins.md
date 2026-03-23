# Claude Code Plugin Installation Checklist

Install these plugins to unlock the full Claude Code ecosystem. Plugins add slash commands, MCP servers, and specialized workflows.

> **Note:** Plugin package IDs (e.g., `superpowers@claude-plugins-official`) reflect the naming convention at the time this kit was created. If an install fails, check `claude plugins search <name>` for the current package ID, or browse the Claude Code plugin registry for alternatives.

---

## Installation Command

```bash
claude plugins install <package-id>
```

To verify all installed plugins:

```bash
claude plugins list
```

---

## Required Plugins (Install All)

### 1. Superpowers

| Field | Value |
|-------|-------|
| **Name** | superpowers |
| **Package ID** | `superpowers@claude-plugins-official` |
| **Purpose** | Brainstorming, planning, debugging, code review, writing — the Swiss Army knife plugin |
| **Required** | Yes |
| **Provides** | `/brainstorming`, `/writing-plans`, `/debugging`, `/code-review` (extended) |

```bash
claude plugins install superpowers@claude-plugins-official
```

**Verify:** Start a session and type `/brainstorming` — it should launch the brainstorming skill.

---

### 2. Frontend Design

| Field | Value |
|-------|-------|
| **Name** | frontend-design |
| **Package ID** | `frontend-design@claude-plugins-official` |
| **Purpose** | Production-grade UI component generation with design system awareness |
| **Required** | Yes (for frontend projects) |
| **Provides** | `/frontend-design` skill |

```bash
claude plugins install frontend-design@claude-plugins-official
```

**Verify:** Type `/frontend-design` in a session — it should prompt for component details.

---

### 3. Context7

| Field | Value |
|-------|-------|
| **Name** | context7 |
| **Package ID** | `context7@claude-plugins-official` |
| **Purpose** | Automatically fetches latest library documentation (React, Next.js, Tailwind, etc.) |
| **Required** | Yes |
| **Provides** | MCP server (auto-configured), library doc queries |

```bash
claude plugins install context7@claude-plugins-official
```

**Verify:** Ask Claude about a specific library API (e.g., "What props does the Next.js Image component accept?") — it should fetch live docs rather than relying on training data.

---

### 4. Feature Dev

| Field | Value |
|-------|-------|
| **Name** | feature-dev |
| **Package ID** | `feature-dev@claude-plugins-official` |
| **Purpose** | 7-phase guided feature development (plan, scaffold, implement, test, review, commit, document) |
| **Required** | Yes |
| **Provides** | `/feature-dev` skill |

```bash
claude plugins install feature-dev@claude-plugins-official
```

**Verify:** Type `/feature-dev add user avatar upload` — it should begin the planning phase.

---

### 5. Code Review

| Field | Value |
|-------|-------|
| **Name** | code-review |
| **Package ID** | `code-review@claude-plugins-official` |
| **Purpose** | Quick standalone code review for a file or selection |
| **Required** | Yes |
| **Provides** | `/code-review` skill |

```bash
claude plugins install code-review@claude-plugins-official
```

**Verify:** Type `/code-review` — it should prompt for a file or scope to review.

---

### 6. PR Review Toolkit

| Field | Value |
|-------|-------|
| **Name** | pr-review-toolkit |
| **Package ID** | `pr-review-toolkit@claude-plugins-official` |
| **Purpose** | Multi-agent PR review — analyzes diffs, checks for issues, suggests improvements |
| **Required** | Yes |
| **Provides** | `/review-pr` skill |

```bash
claude plugins install pr-review-toolkit@claude-plugins-official
```

**Verify:** Type `/review-pr` with an open PR — it should analyze the diff and provide structured feedback.

---

### 7. Commit Commands

| Field | Value |
|-------|-------|
| **Name** | commit-commands |
| **Package ID** | `commit-commands@claude-plugins-official` |
| **Purpose** | Smart commit workflows — analyzes changes, writes commit messages, optionally pushes and creates PRs |
| **Required** | Yes |
| **Provides** | `/commit`, `/commit-push-pr` skills |

```bash
claude plugins install commit-commands@claude-plugins-official
```

**Verify:** Make a small change, then type `/commit` — it should stage changes and draft a commit message.

---

### 8. Playwright

| Field | Value |
|-------|-------|
| **Name** | playwright |
| **Package ID** | `playwright@claude-plugins-official` |
| **Purpose** | Browser automation for E2E testing, screenshots, and interactive debugging |
| **Required** | Yes |
| **Provides** | MCP server (auto-configured), browser control tools |

```bash
claude plugins install playwright@claude-plugins-official
```

**Verify:** Ask Claude to "navigate to https://example.com and take a screenshot" — it should open a browser and capture the page.

**Note:** You may need to install Playwright browsers first:

```bash
npx playwright install
```

---

### 9. Claude.md Management

| Field | Value |
|-------|-------|
| **Name** | claude-md-management |
| **Package ID** | `claude-md-management@claude-plugins-official` |
| **Purpose** | Manages and revises CLAUDE.md files — keeps project instructions up to date |
| **Required** | Yes |
| **Provides** | `/revise-claude-md` skill |

```bash
claude plugins install claude-md-management@claude-plugins-official
```

**Verify:** Type `/revise-claude-md` — it should read your current CLAUDE.md and suggest improvements.

---

### 10. TypeScript LSP

| Field | Value |
|-------|-------|
| **Name** | typescript-lsp |
| **Package ID** | `typescript-lsp@claude-plugins-official` |
| **Purpose** | TypeScript/JavaScript language server — provides type checking, go-to-definition, and diagnostics |
| **Required** | Yes (for JS/TS projects) |
| **Provides** | LSP integration for type-aware code analysis |

```bash
claude plugins install typescript-lsp@claude-plugins-official
```

**Verify:** Ask Claude to check for type errors in a `.ts` file — it should use the LSP for accurate diagnostics rather than guessing.

---

### 11. GitHub

| Field | Value |
|-------|-------|
| **Name** | github |
| **Package ID** | `github@claude-plugins-official` |
| **Purpose** | GitHub integration — issues, PRs, repos, actions directly from Claude Code |
| **Required** | Yes |
| **Provides** | GitHub API tools |

```bash
claude plugins install github@claude-plugins-official
```

**Verify:** Ask Claude to "list open issues in this repo" — it should query GitHub and return results.

---

### 12. Security Guidance

| Field | Value |
|-------|-------|
| **Name** | security-guidance |
| **Package ID** | `security-guidance@claude-plugins-official` |
| **Purpose** | Security best practices — checks for vulnerabilities, suggests secure patterns |
| **Required** | Yes |
| **Provides** | Security analysis tools and guidance |

```bash
claude plugins install security-guidance@claude-plugins-official
```

**Verify:** Ask Claude to review a file for security issues — it should apply security-specific analysis.

---

## Optional Plugins (Install If Needed)

### 13. Supabase

| Field | Value |
|-------|-------|
| **Name** | supabase |
| **Package ID** | `supabase@claude-plugins-official` |
| **Purpose** | Supabase integration — database, auth, storage, edge functions |
| **Required** | Optional (only if using Supabase) |
| **Provides** | Supabase management tools |

```bash
claude plugins install supabase@claude-plugins-official
```

**Verify:** Ask Claude to "list Supabase tables" — it should connect to your Supabase project.

**Skip if:** Your project uses a different backend (NestJS + PostgreSQL, Django, etc.).

---

### 14. Serena

| Field | Value |
|-------|-------|
| **Name** | serena |
| **Package ID** | `serena@claude-plugins-official` |
| **Purpose** | Advanced code navigation — symbol search, call hierarchy, reference finding |
| **Required** | Optional |
| **Provides** | Code navigation and analysis tools |

```bash
claude plugins install serena@claude-plugins-official
```

**Verify:** Ask Claude to "find all references to function X" — it should use Serena for accurate cross-file navigation.

**Skip if:** The built-in Grep/Glob tools are sufficient for your codebase size.

---

## Bulk Installation Script

To install all required plugins at once:

```bash
claude plugins install superpowers@claude-plugins-official
claude plugins install frontend-design@claude-plugins-official
claude plugins install context7@claude-plugins-official
claude plugins install feature-dev@claude-plugins-official
claude plugins install code-review@claude-plugins-official
claude plugins install pr-review-toolkit@claude-plugins-official
claude plugins install commit-commands@claude-plugins-official
claude plugins install playwright@claude-plugins-official
claude plugins install claude-md-management@claude-plugins-official
claude plugins install typescript-lsp@claude-plugins-official
claude plugins install github@claude-plugins-official
claude plugins install security-guidance@claude-plugins-official
```

Add optional plugins if needed:

```bash
claude plugins install supabase@claude-plugins-official
claude plugins install serena@claude-plugins-official
```

---

## Verification Summary

After installation, run `claude plugins list` and confirm you see:

```
Required (12):
  [x] superpowers
  [x] frontend-design
  [x] context7
  [x] feature-dev
  [x] code-review
  [x] pr-review-toolkit
  [x] commit-commands
  [x] playwright
  [x] claude-md-management
  [x] typescript-lsp
  [x] github
  [x] security-guidance

Optional (0-2):
  [ ] supabase
  [ ] serena
```

If any plugin fails to install, check:
1. Network connectivity
2. Claude Code is up to date (`claude update`)
3. The package ID is spelled correctly (copy-paste from this guide)

---

## Plugin Updates

Plugins auto-update by default. To manually update all plugins:

```bash
claude plugins update
```

To update a specific plugin:

```bash
claude plugins update superpowers@claude-plugins-official
```
