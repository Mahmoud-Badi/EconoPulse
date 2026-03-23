---
name: kit-harvest
description: |
  Kit-side harvest engine for the Master Starter Kit learning loop. Ingests feedback
  from projects (via submitted .kit-feedback.json files or direct local project scanning),
  deduplicates across all submissions, detects cross-project patterns, ranks by
  frequency and severity, and presents an interactive approval menu with exact diffs
  before applying improvements to the kit.

  This skill runs in the MASTER KIT directory, not in project directories.
  Use /kit-feedback in projects to capture and export feedback.

  Modes:
  - (no argument) or "harvest"  → Full harvest: ingest + dedup + rank + present + apply + propagate
  - "scan"                      → Ingest + dedup + rank + present (read-only, no apply)
  - "status"                    → Show inbox status and pending submission counts
  - "propagate"                 → Re-generate "What's New" summary from recent HARVEST-LOG entries

  Use when:
  - User types /kit-harvest
  - User says "harvest feedback", "process feedback", "apply project improvements"
  - User says "what did projects report", "check feedback inbox"
  - User says "update the kit from projects", "learn from projects"
  - User drops .kit-feedback.json files into feedback-inbox/

  Examples:
  - "/kit-harvest"
  - "/kit-harvest scan"
  - "/kit-harvest status"
  - "/kit-harvest propagate"
---

# Kit Harvest — Kit-Side Feedback Processing Engine

## What You Are

You are the kit-side harvest engine. You process feedback submitted from projects that use the Master Starter Kit, deduplicate it, detect cross-project patterns, rank improvements by impact, and apply approved changes to the kit. You are the mechanism by which the kit learns from its ecosystem.

You run in the **Master Kit directory**. You modify kit files only after explicit user approval.

**Critical constraint:** You must NEVER be dispatched as a subagent. You only run in the main conversation.

---

## Directory Layout

```
Master-Starter-Kit/
  feedback-inbox/                    → Landing zone for submissions
    project-registry.json            → Optional local project paths
    processed/                       → Archive of processed files
    *.kit-feedback.json              → Pending submissions
  HARVEST-LOG.md                     → Record of all applied improvements
  tools/VERSION                      → Kit version (incremented on apply)
  47-kit-feedback/                   → Module docs and templates
```

---

## Mode: Harvest (default)

### Step 0: AUTO-FETCH REMOTES

Before ingesting, automatically pull feedback from all registered sources:

#### 0a. Remote Repos (fully automatic)
- Run `bash tools/scripts/fetch-remote-feedback.sh` to fetch `.kit-feedback.json` from all remote repos in `feedback-inbox/project-registry.json`
- The script tries GitHub API (via `gh` CLI), then `git archive`, then shallow clone
- Fetched files land in `feedback-inbox/` with repo-name prefixes
- No action needed from contributors — their hooks auto-commit feedback to their repos

#### 0b. Local Projects (fully automatic)
- Read `feedback-inbox/project-registry.json` for `local_projects` entries (skip `_example` entries)
- For each local project path, check for `.kit-feedback.json` in the project root
- Copy any found files to `feedback-inbox/` with project-name prefixes
- Also scan `dev_docs/kit-feedback/pending/` for unfiled candidate `.md` files

### Step 1: INGEST

Collect candidates from all sources (inbox now populated by Step 0):

#### 1a. Inbox Files
- Scan `feedback-inbox/` for `*.kit-feedback.json` files (includes auto-fetched remote + local)
- Parse each file and extract candidates array
- Track source file for each candidate (for archival later)

#### 1b. Direct Local Scan (supplement)
- For local projects with pending `.md` candidates but no exported `.kit-feedback.json`, parse the candidate files directly
- This catches feedback that hasn't been auto-exported yet (e.g., session still active)

#### 1c. Validation
- Reject candidates with missing required fields (id, category, severity, summary, improvement)
- Reject candidates where `sanitized: false` or sanitized field is missing
- Report: "Ingested N candidates from X sources (Y from remote repos, Z from local projects, W from inbox)"

If zero candidates found, report "No feedback to process" and exit.

### Step 2: DEDUPLICATE

Group similar candidates:

1. **Exact match** — same category + same tech_stack + summary similarity >90% (normalized lowercase comparison)
2. **Fuzzy match** — same category + overlapping tech_stack + improvement content similarity >70%
3. For each group, assign:
   - `frequency`: number of distinct sources (projects) that reported it
   - `representative`: the most detailed candidate in the group (longest improvement section)
   - `contributor_ids`: all candidate IDs in the group

Report: "Deduplicated N candidates into M unique improvements (K reported by multiple projects)"

### Step 3: CLASSIFY & RANK

For each unique improvement:

#### Classification
Map to target kit location:
| Category | Target Pattern |
|----------|---------------|
| gotcha | `13-lessons-gotchas/{primary_tech}-gotchas.md` |
| template | The original template file path (from `kit_target` field) |
| process | `ORCHESTRATOR.md` or `06-development-workflow/` docs |
| generator | `10-generators/{generator-name}.md` |
| anti-pattern | `08-quality-testing/anti-pattern-system/` |
| placeholder | `PLACEHOLDER-REGISTRY.md` |

Verify the target file exists. If not, flag for manual review.

#### Conflict Detection
- Read the target kit file
- Check if the improvement contradicts existing content
- Check if similar content already exists (would be a duplicate, not an improvement)
- Flag conflicts with reason: `conflict: "Contradicts existing entry at line N"` or `duplicate: "Similar content already exists"`

#### Ranking
Score each improvement: `score = frequency × severity_weight × breadth`

Severity weights:
- critical: 4
- high: 3
- medium: 2
- low: 1

Breadth = number of distinct tech stacks affected (from all candidates in the group).

Sort by score descending.

### Step 4: PRESENT

Use `AskUserQuestion` to present the ranked improvements interactively.

#### Summary View First
Show a summary table:
```
# Harvest Summary: M improvements from N candidates

| # | Score | Freq | Sev    | Category      | Summary                          | Target                    |
|---|-------|------|--------|---------------|----------------------------------|---------------------------|
| 1 | 12    | 3    | critical | gotcha      | Drizzle pgSchema enum bug        | 13-lessons-gotchas/drizzle |
| 2 | 9     | 3    | high   | anti-pattern  | Unbounded query in list endpoints | 08-quality-testing/...    |
| 3 | 6     | 2    | high   | template      | Improved session boundary docs   | 03-documentation/...      |
```

#### Batch Options
Ask first: "How would you like to process these?"
- **Review each one** — go through them individually
- **Apply all critical+high** — auto-apply high-impact, review the rest
- **Apply all** — trust the harvest, apply everything
- **Scan only** — just show me, don't apply anything

#### Per-Improvement Review (if reviewing individually)
For each improvement, show:
- Full sanitized content
- Exact diff preview (what would change in the kit file)
- Frequency badge: "Reported by N projects"
- Conflict warnings if any

Options:
- **Apply** — apply this change to the kit
- **Edit first** — modify the content before applying
- **Skip** — don't apply this one
- **Defer** — save for next harvest cycle

### Step 5: APPLY

For each approved improvement:

#### 5a. Apply Change
- Read the target kit file
- Apply the improvement:
  - For gotchas: append to the appropriate section in the gotchas file
  - For templates: apply the diff to the template file
  - For anti-patterns: add the new anti-pattern entry
  - For process: insert at the appropriate location in the workflow doc
  - For generators: update the generator prompt/criteria
  - For placeholders: add to PLACEHOLDER-REGISTRY.md
- Write the updated file

#### 5b. Log
Prepend an entry to `HARVEST-LOG.md`:
```markdown
### [DATE] - GROUP-ID | Category | Severity

**Score:** N (frequency: X, severity: Y, breadth: Z)
**Source:** X project(s)
**Applied to:** `path/to/kit/file.md`
**Summary:** What was added or changed
**Candidate IDs:** KF-PROJ1-001, KF-PROJ2-003
**Improvement applied:**
> The actual content that was added to the kit
```

#### 5c. Version
- Read `tools/VERSION`
- Increment patch version (e.g., 2.1.0 → 2.1.1)
- Write updated version

#### 5d. Archive
- Move processed `.kit-feedback.json` files to `feedback-inbox/processed/` with date prefix
  - Example: `2026-03-20_contributor-alias.kit-feedback.json`
- For local project candidates: update candidate files to `status: applied-upstream`

### Step 6: PROPAGATE

Generate artifacts that help the broader ecosystem:

#### 6a. What's New Summary
Create or update `feedback-inbox/WHATS-NEW.md`:
```markdown
# What's New in Kit vX.Y.Z

## Applied from Harvest [DATE]

### Gotchas
- **[Drizzle]** pgSchema enum bug workaround (reported by 3 projects)

### Template Improvements
- **[Session docs]** Improved boundary documentation

### Anti-Patterns
- **[API]** Unbounded query detection pattern
```

#### 6b. Upgrade Awareness
- Check if `/kit-upgrade` and `/master-kit-upgrade` skills have version detection
- The new version number and HARVEST-LOG entries allow these skills to detect that the kit has been updated and offer the improvements to existing projects during their next upgrade cycle

Report: "Harvest complete. Applied N improvements to the kit. Kit version: vX.Y.Z"

---

## Mode: Scan

Run Steps 1-4 only (Ingest, Deduplicate, Classify & Rank, Present). Do NOT apply any changes. This is a read-only preview of what would be harvested.

Report: "Scan complete. N improvements ready to harvest. Run /kit-harvest to apply."

---

## Mode: Status

Quick inbox overview:

1. Count `.kit-feedback.json` files in `feedback-inbox/`
2. Count files in `feedback-inbox/processed/`
3. Read `HARVEST-LOG.md` for recent entries
4. Read `tools/VERSION` for current version

Report:
```
Kit Harvest Status:
  Inbox:         N submissions pending
  Processed:     N submissions archived
  Last harvest:  DATE (N improvements applied)
  Kit version:   vX.Y.Z
  Total improvements applied: N (from HARVEST-LOG.md)
```

---

## Mode: Propagate

Re-generate the "What's New" summary from recent HARVEST-LOG.md entries. Useful if you applied improvements manually and want to update the summary.

Read HARVEST-LOG.md, extract entries since the last "What's New" generation, and regenerate `feedback-inbox/WHATS-NEW.md`.

---

## Subagent Usage

For large harvests (>10 candidates), dispatch parallel subagents for Step 2 (deduplication) and Step 3 (classification):

- **Dedup agent**: Groups candidates by similarity, returns grouped structure
- **Classify agent**: Reads kit files, checks for conflicts/duplicates, assigns targets

Use `model: "opus"` for subagents to ensure high-quality conflict detection.

Both agents are read-only — they return analysis, never modify files. All modifications happen in the main conversation after user approval.
