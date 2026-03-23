---
name: kit-feedback
description: |
  Project-side feedback capture and export for the Master Starter Kit learning loop.
  Scans a project for improvement-worthy artifacts (gotchas, template improvements,
  anti-patterns, process discoveries, generator refinements, new placeholders),
  auto-sanitizes them to strip project-specific details, and stages them as
  structured candidates in dev_docs/kit-feedback/pending/.

  Also exports staged candidates into a portable .kit-feedback.json file that
  can be submitted back to the kit via GitHub PR or direct file share.

  Modes:
  - (no argument) or "capture"  → Scan project and capture improvement candidates
  - "export"                    → Bundle pending candidates into .kit-feedback.json
  - "status"                    → Show counts of pending, exported, applied-upstream
  - "add"                       → Manually create a feedback candidate interactively

  Use when:
  - User types /kit-feedback
  - User says "send feedback to the kit", "this should be in the kit"
  - User says "capture improvements", "export feedback"
  - User adds <!-- KIT-FEEDBACK: ... --> comment in any doc
  - After discovering a cross-project gotcha or lesson
  - After improving a template beyond placeholder fills

  Examples:
  - "/kit-feedback"
  - "/kit-feedback capture"
  - "/kit-feedback export"
  - "/kit-feedback status"
  - "/kit-feedback add"
---

# Kit Feedback — Project-Side Capture & Export

## What You Are

You are the project-side feedback capture engine. You scan a project that uses the Master Starter Kit for improvement-worthy artifacts, sanitize them, and stage them for submission back to the kit. You help the kit learn from every project that uses it.

You run in the **project directory** (not the kit directory). You never modify kit files.

---

## Kit Home (read-only reference)

The Master Starter Kit lives at:
```
{{KIT_HOME}}
```

Use this path to compare project files against kit originals for template improvement detection.

---

## Mode: Capture (default)

### Step 1: Scaffold Check

Check if `dev_docs/kit-feedback/` exists. If not, create:
```
dev_docs/kit-feedback/
  pending/       → Staged candidates awaiting export
  exported/      → Archive of exported candidates
```

Also check for `.kit-feedback-config.json` in the project root. If missing, create with defaults:
```json
{
  "project_short": "PROJ",
  "contributor_alias": "anonymous",
  "auto_capture": true,
  "kit_home": "{{KIT_HOME}}"
}
```

Ask the user for a short project identifier (3-6 chars, uppercase) to use in candidate IDs.

### Step 2: Scan for Signals

Scan the project for these signal types, in order:

#### 2a. Cross-Project Lessons
- Read `dev_docs/lessons-register.md` (or similar lessons file)
- Look for entries tagged `scope: cross-project`, `applicability: all-projects`, or containing phrases like "any project", "all projects", "kit should"
- Each qualifying entry becomes a `gotcha` category candidate

#### 2b. Template Improvements
- Find all `*.template.md` files in `dev_docs/`
- Compare against kit originals in `{{KIT_HOME}}`
- Detect structural additions (new sections, improved instructions, better examples)
- Ignore: placeholder fills (expected), section deletions (project choice), formatting-only changes
- Each qualifying diff becomes a `template` category candidate

#### 2c. Anti-Pattern Discoveries
- Scan `dev_docs/anti-patterns/` or anti-pattern entries in quality gate docs
- Cross-reference against kit's `08-quality-testing/anti-pattern-system/`
- New patterns not in the kit become `anti-pattern` category candidates

#### 2d. Kit-Feedback Comments
- Grep all `dev_docs/` files for `<!-- KIT-FEEDBACK:` comments
- Each comment becomes a candidate with the category inferred from content
- Category detection: "gotcha" / "lesson" → gotcha, "template" → template, "process" / "workflow" → process, "generator" / "depth" → generator

#### 2e. Process Discoveries
- Scan `handoff.md`, `session-context.md`, `DEVLOG.md` for phrases like:
  - "the kit should", "orchestrator doesn't", "missing step", "better if the kit"
  - "workaround for kit", "kit limitation", "kit gap"
- Each qualifying mention becomes a `process` category candidate
- These require more manual review — flag them as `needs_review: true`

#### 2f. New Placeholders
- Grep for `{{UPPERCASE_PATTERN}}` in project files
- Cross-reference against kit's `PLACEHOLDER-REGISTRY.md`
- Unregistered placeholders that appear useful become `placeholder` category candidates

### Step 3: Sanitize

For each detected signal, run the sanitization pipeline:

1. **Read config** — load `.kit-feedback-config.json` for project name, client name
2. **Strip identifiers** — replace project name, client name, company names with generic terms
3. **Strip URLs/domains** — regex replace domains with `example.com` variants
4. **Strip credentials** — regex for `sk_`, `pk_`, `ghp_`, `Bearer `, connection strings
5. **Strip emails** — standard email regex → `<EMAIL>`
6. **Strip IPs** — IPv4/IPv6 patterns → `<IP_ADDRESS>`
7. **Genericize business terms** — replace project-specific terminology with generic equivalents
8. **Genericize code** — in code snippets, replace project-specific variable/function names
9. **Keep tech context** — preserve technology names, versions, error messages, CLI commands

### Step 4: Present Candidates

Use `AskUserQuestion` to present each candidate to the user:

For each candidate, show:
- Category and severity
- Summary (one line)
- Sanitized content preview
- Suggested kit target location

Options per candidate:
- **Approve** — write to `dev_docs/kit-feedback/pending/`
- **Edit** — let user modify before writing
- **Skip** — not a real improvement, discard
- **Defer** — save for later review

### Step 5: Write Candidates

For each approved candidate:
1. Generate a sequential ID: `KF-{PROJECT_SHORT}-{SEQ}` (SEQ = zero-padded 3 digits)
2. Fill the candidate template from `47-kit-feedback/kit-feedback-candidate.template.md`
3. Write to `dev_docs/kit-feedback/pending/KF-{PROJECT_SHORT}-{SEQ}.md`

Report: "Captured N candidates (X gotchas, Y template improvements, Z anti-patterns, ...)"

---

## Mode: Export

### Step 1: Collect Pending

Read all `.md` files in `dev_docs/kit-feedback/pending/` with `status: pending`.

If none found, report "No pending candidates to export" and exit.

### Step 2: Final Sanitization Pass

Run the sanitization pipeline again on all candidates. Check for:
- Any remaining non-generic domain names
- Any strings matching the project name or client name
- Any patterns that look like credentials

If issues found, present them to the user for manual review before continuing.

### Step 3: Bundle

Create `.kit-feedback.json` in the project root:

```json
{
  "kit_version": "<from .kit-meta.json or 'unknown'>",
  "export_date": "<today's date>",
  "contributor_alias": "<from .kit-feedback-config.json>",
  "candidate_count": N,
  "candidates": [
    {
      "id": "KF-PROJ-001",
      "category": "gotcha",
      "severity": "high",
      "tech_stack": ["next.js", "drizzle"],
      "summary": "...",
      "context": "...",
      "improvement": "...",
      "kit_target": "13-lessons-gotchas/drizzle-gotchas.md",
      "date": "2026-03-20"
    }
  ]
}
```

### Step 4: Mark Exported

Update each candidate file's frontmatter: `status: exported`

Move candidate files to `dev_docs/kit-feedback/exported/`

### Step 5: Submission Instructions

Tell the user:

> Exported N candidates to `.kit-feedback.json`.
>
> **To submit via GitHub:**
> 1. Create a branch from `main` on the kit repo
> 2. Copy `.kit-feedback.json` to `feedback-inbox/`
> 3. Open a PR
>
> **To submit directly:**
> Send the `.kit-feedback.json` file to the kit maintainer.

---

## Mode: Status

Read and count files in:
- `dev_docs/kit-feedback/pending/` → pending count
- `dev_docs/kit-feedback/exported/` → exported count
- Check each exported file for `status: applied-upstream` → applied count

Report:
```
Kit Feedback Status:
  Pending:          N candidates ready to export
  Exported:         N candidates awaiting harvest
  Applied upstream: N candidates incorporated into the kit
```

---

## Mode: Add (manual)

Walk the user through creating a candidate interactively using `AskUserQuestion`:

1. **Category** — gotcha | template | process | generator | placeholder | anti-pattern
2. **Severity** — critical | high | medium | low
3. **Tech stack** — which technologies are involved
4. **Summary** — one-line description
5. **Context** — what happened (remind user to keep it generic)
6. **Improvement** — the actual content for the kit
7. **Kit target** — where it should land

Run sanitization on user's input, then write to `dev_docs/kit-feedback/pending/`.

---

## Sanitization Reference

See `47-kit-feedback/SANITIZATION-RULES.md` for the complete ruleset. Key principle: **keep the generalizable lesson, strip everything project-specific.**
