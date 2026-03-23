# Capture Rules

Rules for what triggers automatic feedback capture in projects. The `/kit-feedback` skill uses these rules to scan for improvement-worthy artifacts.

## Signal Types

### 1. Cross-Project Lessons

**Source:** `dev_docs/lessons-register.md`
**Trigger:** Entry contains `scope: cross-project` or `applicability: all-projects` in its metadata
**Severity mapping:**
- Caused data loss or security issue → `critical`
- Caused significant debugging time (>2 hours) → `high`
- Caused minor confusion or friction → `medium`
- Nice-to-know optimization → `low`
**Kit target:** `13-lessons-gotchas/{technology}.md`

### 2. Template Improvements

**Source:** Any `*.template.md` file in `dev_docs/` that has been modified from the kit original
**Trigger:** Diff between project's template and kit's template shows structural additions (not just placeholder fills)
**Detection:** Compare against kit originals using `.kit-meta.json` version reference
**What qualifies:**
- Added sections that provide useful structure
- Improved instructions or examples
- Better placeholder defaults
- Fixed ambiguities in the original template
**What does NOT qualify:**
- Project-specific placeholder fills (these are expected)
- Deletions of optional sections (project choice, not improvement)
- Formatting-only changes
**Severity:** Usually `medium` unless the original template had a bug (`high`)
**Kit target:** The original template file path

### 3. Anti-Pattern Discoveries

**Source:** `dev_docs/anti-patterns/` or anti-pattern entries in quality gate docs
**Trigger:** New anti-pattern entry that isn't already in the kit's `08-quality-testing/anti-pattern-system/`
**What qualifies:**
- Pattern that caused real bugs or quality issues in the project
- Pattern with clear prevention steps
- Pattern that would apply to other projects using the same tech stack
**Severity mapping:**
- Caused production incident → `critical`
- Caused test failures or rework → `high`
- Code smell that made maintenance harder → `medium`
**Kit target:** `08-quality-testing/anti-pattern-system/`

### 4. Process & Workflow Discoveries

**Source:** Session notes, `handoff.md`, `DEVLOG.md`, retrospective outputs
**Trigger:** Explicit note like "the orchestrator should..." or "the kit's session flow doesn't account for..."
**What qualifies:**
- Discovered that a kit workflow step is missing or misordered
- Found a better way to handle session boundaries
- Identified a gate that should exist but doesn't
- Discovered that a step's instructions are ambiguous
**Severity:** Usually `high` (process gaps affect every project)
**Kit target:** `ORCHESTRATOR.md` or relevant workflow doc in `06-development-workflow/`

### 5. Generator Refinements

**Source:** `10-generators/` equivalent outputs where manual edits significantly improved quality
**Trigger:** Depth scores improved after manual intervention, suggesting the generator prompt could be better
**What qualifies:**
- Generator prompt that consistently produces shallow output in a specific area
- Missing thinking prompt questions that would improve generation quality
- Better scoring criteria discovered through project experience
**Severity:** `medium` (generators work, just could be better)
**Kit target:** `10-generators/{generator-name}.md`

### 6. New Placeholders

**Source:** Any file where a `{{PLACEHOLDER}}` was manually created because the kit didn't provide one
**Trigger:** Placeholder pattern `{{UPPERCASE_WITH_UNDERSCORES}}` appears in project files but not in `PLACEHOLDER-REGISTRY.md`
**What qualifies:**
- Placeholder that would be useful across multiple projects
- Placeholder with a clear resolution rule (auto-detect, intake question, or default)
**Severity:** `low` (missing placeholder = minor inconvenience)
**Kit target:** `PLACEHOLDER-REGISTRY.md`

## Auto-Capture vs Manual Capture

### Auto-Capture (skill detects automatically)

The `/kit-feedback` skill auto-detects signals 1, 2, 3, and 6 by scanning project files. These are presented to the user for review before writing candidate files.

### Manual Capture (user flags explicitly)

Signals 4 and 5 (process discoveries and generator refinements) are harder to auto-detect. Users flag these by:
- Adding `<!-- KIT-FEEDBACK: description -->` comments in any doc
- Running `/kit-feedback add` and describing the improvement interactively

## Candidate Review

All auto-captured candidates are presented to the user before being written. The user can:
- **Approve** -- write the candidate to `dev_docs/kit-feedback/pending/`
- **Edit** -- modify the candidate before writing
- **Skip** -- ignore this signal (not a real improvement)
- **Defer** -- save for later review

No candidate is ever written without user approval.
