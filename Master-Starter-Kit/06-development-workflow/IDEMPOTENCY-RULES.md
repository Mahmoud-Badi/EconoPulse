# Idempotency Rules

## Purpose

When a step is re-run (due to error recovery, quality issues, or user request), these rules define what happens to existing files. This prevents duplicate content, lost manual edits, and orphaned references.

## Three Behaviors

| Behavior | Symbol | Meaning |
|----------|--------|---------|
| **Overwrite** | `⟳` | Delete existing and regenerate from scratch |
| **Merge** | `⊕` | Keep existing content, add missing items only |
| **Skip** | `⊘` | Do not touch if the file already exists |

## Rules by Step

### Step 0: Ecosystem Setup
| Artifact | Behavior | Reason |
|----------|----------|--------|
| `.claude/settings.json` | `⊕ Merge` | User may have added custom settings |
| `.claude/commands/` | `⟳ Overwrite` | Commands should match kit version |
| `.claude/skills/` | `⟳ Overwrite` | Skills should match kit version |
| Plugin configs | `⊘ Skip` | Plugin installation is idempotent |

### Step 1: Discovery & Intake
| Artifact | Behavior | Reason |
|----------|----------|--------|
| Project brief | `⟳ Overwrite` | Re-intake means new answers |
| Feature list | `⟳ Overwrite` | Re-intake means new priorities |
| CONFIG object | `⟳ Overwrite` | New answers = new config |

### Step 2: AI Config Generation
| Artifact | Behavior | Reason |
|----------|----------|--------|
| CLAUDE.md | `⟳ Overwrite` | Must reflect current config |
| AGENTS.md | `⟳ Overwrite` | Must reflect current config |

### Step 3: Tribunal
| Artifact | Behavior | Reason |
|----------|----------|--------|
| Research files | `⟳ Overwrite` | Research should be fresh |
| Verdict | `⟳ Overwrite` | New research = new verdict |

### Steps 4-6: Specs & Architecture
| Artifact | Behavior | Reason |
|----------|----------|--------|
| Service specs (generated) | `⟳ Overwrite` | Regenerate from current verdict |
| Service specs (manually edited) | `⊘ Skip` | Preserve manual work — check git diff |
| Service hubs | `⟳ Overwrite` | Generated from specs |
| Screen specs | `⟳ Overwrite` | Regenerate from current services |
| API contracts | `⟳ Overwrite` | Regenerate from current specs |

### Step 7: Codebase Audit
| Artifact | Behavior | Reason |
|----------|----------|--------|
| Audit reports | `⟳ Overwrite` | Code may have changed |

### Steps 8-9: Tasks & Dashboard
| Artifact | Behavior | Reason |
|----------|----------|--------|
| Task files | `⊕ Merge` | Keep completed tasks, regenerate pending |
| STATUS.md | `⊕ Merge` | Update counts, preserve progress |
| Sprint plan | `⟳ Overwrite` | Regenerate from current tasks |

### Steps 10-16: Infrastructure, Design, Quality
| Artifact | Behavior | Reason |
|----------|----------|--------|
| Design tokens | `⊕ Merge` | User may have customized |
| CI/CD workflows | `⟳ Overwrite` | Must match current config |
| Test configs | `⟳ Overwrite` | Must match current config |
| Quality gates | `⟳ Overwrite` | Must match current standards |
| Security framework | `⟳ Overwrite` | Must reflect current architecture |

### Steps 17+: Marketing, Legal, Financial
| Artifact | Behavior | Reason |
|----------|----------|--------|
| All generated docs | `⟳ Overwrite` | Regenerate from current project state |
| Manually edited docs | `⊘ Skip` | Preserve manual work |

## How to Detect Manual Edits

Before overwriting, check:

1. **Git status:** `git diff --name-only dev_docs/` — if a file has uncommitted changes, it's been manually edited
2. **Git log:** `git log --oneline -1 dev_docs/{file}` — if the last commit message doesn't start with "orchestrator:", it was manually edited
3. **PROTECT-LIST:** Check `dev_docs/foundations/PROTECT-LIST.md` — listed files are never overwritten

## Merge Strategy

When merging (`⊕`):

1. Read the existing file
2. Generate the new content
3. Compare section by section
4. Keep sections that exist in both (prefer existing if manually edited)
5. Add sections that exist only in new content
6. Flag sections that exist only in existing content (may be orphaned)

## Override

To force overwrite a file that would normally be skipped or merged:

> "Regenerate {file path} from scratch"

This explicitly tells Claude to ignore the idempotency rule for that specific file.
