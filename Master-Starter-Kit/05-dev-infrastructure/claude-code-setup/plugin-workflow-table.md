# Plugin Workflow Table

When to use each plugin during the development lifecycle, from planning through maintenance.

---

## Lifecycle Stage Map

| Stage | Plugin | How to Use | When to Trigger |
|-------|--------|-----------|-----------------|
| **Plan** | superpowers | `/brainstorming` — explore approaches, generate ideas, weigh trade-offs before writing any code | Before every new feature or significant change |
| **Plan** | superpowers | `/writing-plans` — create structured implementation plans with milestones | After brainstorming converges on an approach |
| **Research** | context7 | Automatic — Claude queries library docs when you mention a framework, library, or API | Always active; no manual trigger needed |
| **Research** | gemini (MCP) | Ask Claude to "use Gemini for deep research on [topic]" | Complex topics needing multi-source synthesis |
| **Research** | sequential-thinking (MCP) | Ask Claude to "use sequential thinking to analyze [decision]" | Architecture decisions, trade-off analysis |
| **Build** | feature-dev | `/feature-dev [description]` — 7-phase guided development from plan to commit | Every new feature or significant enhancement |
| **Build** | typescript-lsp | Automatic — provides type checking and diagnostics during code editing | Always active for TypeScript/JavaScript projects |
| **Design** | frontend-design | `/frontend-design` — generates production-grade UI components | New pages, components, or UI overhauls |
| **Design** | magic/magicui (MCP) | Ask Claude to "show MagicUI [component type] options" | When you need animated or polished UI elements |
| **Test** | playwright | Ask Claude to "navigate to [URL] and verify [behavior]" | After implementing UI changes; for E2E flows |
| **Test** | superpowers | `/debugging` — structured debugging when tests fail | When you hit a bug you cannot quickly resolve |
| **Security** | security-guidance | Ask Claude to "review [file/feature] for security issues" | Before shipping auth, payments, or data handling |
| **Review** | code-review | `/code-review` — quick review of a file or code section | After completing a unit of work, before committing |
| **Review** | pr-review-toolkit | `/review-pr [PR number]` — multi-agent analysis of a pull request | Before merging any PR |
| **Commit** | commit-commands | `/commit` — analyze changes, draft message, stage, and commit | After code review passes |
| **Commit** | commit-commands | `/commit-push-pr` — commit + push + create pull request in one flow | When ready to submit work for team review |
| **Maintain** | claude-md-management | `/revise-claude-md` — update CLAUDE.md with new conventions or rules | After major refactors or when conventions change |
| **Maintain** | github | Ask Claude to "list open issues" or "check PR status" | Daily standup, triage, or status checks |

---

## Recommended Workflow Sequences

### Starting a New Feature

```
1. /brainstorming          (superpowers)     — explore the problem space
2. /writing-plans          (superpowers)     — create an implementation plan
3. /feature-dev [desc]     (feature-dev)     — execute the plan in 7 phases
4. /code-review            (code-review)     — self-review before committing
5. /commit                 (commit-commands) — commit with a clean message
```

### Building a New UI Page

```
1. /brainstorming          (superpowers)     — decide layout, components, data flow
2. /frontend-design        (frontend-design) — generate the initial component tree
3. [iterate on code]                         — refine with Claude's help
4. "Take a screenshot"     (playwright)      — verify visual output
5. /code-review            (code-review)     — check for issues
6. /commit                 (commit-commands) — commit clean code
```

### Debugging a Complex Issue

```
1. /debugging              (superpowers)     — structured diagnosis
2. "Use sequential thinking to analyze..."   — multi-perspective reasoning
3. "Check the latest docs for [library]"     — Context7 fetches current API
4. [apply fix]
5. "Navigate to [URL] and verify"            — Playwright confirms the fix
6. /commit                 (commit-commands) — commit the fix
```

### Submitting Work for Review

```
1. /code-review            (code-review)     — self-review all changes
2. "Review for security"   (security-guidance) — catch vulnerabilities
3. /commit-push-pr         (commit-commands) — commit, push, create PR
4. /review-pr [number]     (pr-review-toolkit) — get multi-agent PR feedback
```

### Research Before Implementation

```
1. "Search for [topic]"    (WebSearch)        — get current information
2. "Use Gemini deep research on [topic]"      — comprehensive analysis
3. "Check the [library] docs for [feature]"   — Context7 latest API
4. /brainstorming          (superpowers)      — synthesize findings into a plan
```

---

## Plugin Priority: What to Use First

If you are new to the plugin ecosystem, adopt them in this order:

### Tier 1: Use From Day One
| Plugin | Why |
|--------|-----|
| **context7** | Zero effort — automatically ensures you get correct, up-to-date API info |
| **commit-commands** | Saves time on every commit; produces consistent messages |
| **code-review** | Quick quality check before every commit |
| **typescript-lsp** | Catches type errors that Claude might miss from reading code alone |

### Tier 2: Use for Every Feature
| Plugin | Why |
|--------|-----|
| **superpowers** | Brainstorming and planning prevent wasted implementation effort |
| **feature-dev** | Structured 7-phase workflow keeps features on track |
| **playwright** | Visual verification catches UI bugs that code review misses |

### Tier 3: Use for Specific Situations
| Plugin | When |
|--------|------|
| **frontend-design** | New pages or major UI components |
| **pr-review-toolkit** | PRs being merged into main branches |
| **security-guidance** | Auth, payments, data handling, API endpoints |
| **github** | Issue triage, PR management, release workflows |
| **claude-md-management** | After refactors or when team conventions evolve |

---

## Tips and Best Practices

### 1. Always brainstorm before building
The `/brainstorming` command takes 30 seconds and can save hours of rework. Use it before any feature that touches more than 2 files.

### 2. Let Context7 handle docs
Never paste documentation into chat. Context7 fetches the latest version automatically. Just mention the library by name: "How does Prisma handle transactions?" and it will query the docs.

### 3. Use Playwright for visual verification
After every UI change, ask Claude to take a screenshot. This catches layout issues, missing styles, and broken responsive behavior before you even open a browser.

### 4. Stack code-review with security-guidance
For any code that handles user input, authentication, or data storage, run both:
- `/code-review` for general quality
- Security guidance for vulnerability detection

### 5. Do not skip the commit flow
Using `/commit` instead of manual `git commit` ensures:
- Consistent commit message format
- All changes are reviewed before staging
- No accidental commits of sensitive files

### 6. Use feature-dev for anything non-trivial
If a task will take more than 15 minutes, `/feature-dev` is worth it. The structured phases (plan, scaffold, implement, test, review, commit, document) prevent the common mistake of diving into code without a plan.

### 7. Combine Gemini + Sequential Thinking for hard decisions
For architectural choices (monorepo vs polyrepo, SQL vs NoSQL, SSR vs CSR), use both:
- Gemini for broad research across multiple sources
- Sequential Thinking for structured trade-off analysis

### 8. Keep CLAUDE.md current
Run `/revise-claude-md` after any session that changes project conventions, adds new directories, or modifies the tech stack. Stale instructions cause more bugs than missing instructions.

---

## Quick Reference Card

```
PLAN:     /brainstorming  ->  /writing-plans
BUILD:    /feature-dev    ->  /frontend-design (if UI)
TEST:     playwright screenshot  ->  /debugging (if broken)
REVIEW:   /code-review    ->  /review-pr (if PR)
SHIP:     /commit         ->  /commit-push-pr (if ready)
MAINTAIN: /revise-claude-md
```
