# Contributor Guide

How feedback flows from your project back to the Master Starter Kit — **automatically, with zero effort from you.**

## The Zero-Effort Version (Default)

**You don't need to do anything.** The kit is set up so feedback flows automatically:

1. **Auto-Capture:** When the AI discovers a cross-project gotcha, improves a template, or adds an anti-pattern during your session, it automatically writes a feedback candidate to `dev_docs/kit-feedback/pending/`. This is built into CLAUDE.md Rule 36 — no command needed.

2. **Auto-Export:** When your session ends, a Stop hook automatically bundles pending candidates into `.kit-feedback.json` and commits it to your git repo. You never run `/kit-feedback export`.

3. **Auto-Collection:** The kit maintainer's harvest engine auto-fetches `.kit-feedback.json` from registered repos (local paths and remote git URLs). You never send anything.

**That's it.** Just use the kit normally. Improvements flow back automatically.

## What Gets Captured Automatically

The AI writes a feedback candidate whenever it:

- Adds a lesson to `lessons-register.md` that applies to all projects (not just yours)
- Discovers a technology-specific gotcha (version bugs, config surprises, undocumented behavior)
- Adds a new anti-pattern to your quality docs
- Improves a template file beyond just filling placeholders
- Notes a process gap in the orchestrator or session workflow
- Creates a placeholder that isn't in the kit's registry

## Manual Options (Optional)

If you want more control, these commands are available but **not required**:

| Command | What it does |
|---------|-------------|
| `/kit-feedback` | Scan and capture candidates interactively |
| `/kit-feedback export` | Manually bundle and export (usually handled by the Stop hook) |
| `/kit-feedback status` | Show counts of pending, exported, and applied candidates |
| `/kit-feedback add` | Manually create a candidate for something the auto-capture missed |

You can also add `<!-- KIT-FEEDBACK: description -->` comments anywhere in your docs. The capture system picks these up.

## How the Kit Maintainer Gets Your Feedback

The kit maintainer registers your repo in `feedback-inbox/project-registry.json`:

```json
{
  "remote_repos": [
    {
      "url": "https://github.com/yourname/your-project",
      "name": "Your Project",
      "branch": "main"
    }
  ]
}
```

When they run `/kit-harvest`, it auto-fetches `.kit-feedback.json` from your repo (via GitHub API, git archive, or shallow clone). No PR, no email, no file sharing needed.

**For local projects on the same machine:** The maintainer adds your project path to `local_projects` in the registry, and the harvest engine scans it directly.

### Private Repos

If your repo is private, you need to add the kit maintainer as a **read-only collaborator** once. That's the only setup:

```bash
# You run this once (replace MAINTAINER with their GitHub username):
gh repo collaborator add YOUR_ORG/YOUR_REPO MAINTAINER --permission read
```

Or do it in GitHub: Settings > Collaborators > Add people > give "Read" access.

After that, the maintainer's `gh` CLI can fetch your `.kit-feedback.json` automatically. No tokens, no secrets, no ongoing maintenance.

## Privacy

All candidates are auto-sanitized **before they leave your project**. Stripped:

- Project and client names
- Domain names, URLs, IP addresses
- API keys, tokens, credentials
- Database connection strings
- Personal names and emails
- Business-specific terminology

Only technology names, error messages, version numbers, and generalizable patterns are kept. See [SANITIZATION-RULES.md](SANITIZATION-RULES.md) for the complete ruleset.

## Tips for Good Feedback

These help the auto-captured candidates be more useful:

1. **Be specific in lessons** — "Drizzle's pgSchema doesn't support X" is better than "database issues"
2. **Include the fix** — Don't just note the problem; document what you did to solve it
3. **Note tech versions** — Gotchas are often version-specific
4. **Flag cross-project scope** — When writing lessons, note if it applies to "any project" — this triggers auto-capture
