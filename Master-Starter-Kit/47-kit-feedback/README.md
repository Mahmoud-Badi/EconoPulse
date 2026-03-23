# 47 - Kit Feedback Loop

## Purpose

Close the feedback loop between projects and the Master Starter Kit. When projects discover gotchas, improve templates, refine processes, or surface new anti-patterns, those improvements should flow back to the kit so every future project benefits.

## Architecture

```
PROJECT ──► /kit-feedback ──► dev_docs/kit-feedback/pending/ ──► /kit-feedback export ──► .kit-feedback.json
                (capture)         (staged candidates)               (sanitize + bundle)       (submit)
                                                                                                  │
MASTER KIT ◄── /kit-harvest ◄── feedback-inbox/ ◄────────────────────────────────────────────────┘
                (deduplicate,     (landing zone)
                 rank, apply)
```

## Two Skills, Two Sides

| Skill | Where it runs | What it does |
|-------|--------------|--------------|
| `/kit-feedback` | In a project directory | Captures improvement candidates, sanitizes, exports |
| `/kit-harvest` | In the Master Kit directory | Ingests, deduplicates, ranks, applies approved improvements |

## What Gets Captured

| Signal Type | Source | Kit Target |
|------------|--------|------------|
| Gotcha / lesson | `dev_docs/lessons-register.md` (cross-project flag) | `13-lessons-gotchas/` |
| Template improvement | Modified `*.template.md` files | Original template file |
| Anti-pattern | `dev_docs/anti-patterns/` | `08-quality-testing/anti-pattern-system/` |
| Process discovery | Session notes, handoff.md | `ORCHESTRATOR.md` or workflow docs |
| Generator refinement | Improved depth scores after manual edits | `10-generators/` |
| New placeholder | Manually resolved `{{MISSING}}` values | `PLACEHOLDER-REGISTRY.md` |

## Privacy & Sanitization

All feedback is auto-sanitized before leaving the project. See [SANITIZATION-RULES.md](SANITIZATION-RULES.md) for the full ruleset. In short: technology names and generalizable patterns are kept; project names, client details, URLs, keys, and business logic are stripped.

## For Contributors

If you received the kit from someone else and want to contribute improvements back, see [CONTRIBUTOR-GUIDE.md](CONTRIBUTOR-GUIDE.md).

## Related Files

- [CAPTURE-RULES.md](CAPTURE-RULES.md) -- What triggers auto-capture
- [SANITIZATION-RULES.md](SANITIZATION-RULES.md) -- What gets stripped
- [CONTRIBUTOR-GUIDE.md](CONTRIBUTOR-GUIDE.md) -- How to submit feedback
- [kit-feedback-candidate.template.md](kit-feedback-candidate.template.md) -- Candidate file format
- `tools/skills/kit-feedback/SKILL.md` -- The capture/export skill
- `tools/skills/kit-harvest/SKILL.md` -- The harvest/apply skill
- `HARVEST-LOG.md` -- Record of all applied improvements
- `feedback-inbox/` -- Landing zone for submitted feedback
