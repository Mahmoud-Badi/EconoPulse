# /document-feature

Generate user-facing documentation for the feature you just completed.

## Instructions

Read and follow the `document-feature` skill at `.claude/skills/document-feature/SKILL.md`.

This command should be run **immediately after completing a feature task**, before committing. It captures documentation while you still have full context of what was built.

## Quick Reference

1. Read the task file, feature spec, screen spec, and code you just wrote
2. Generate/update the feature guide at `user_docs/guides/{feature-slug}.md`
3. Generate FAQ entries (minimum 3)
4. Generate troubleshooting entries
5. Append changelog entry
6. Update in-app help JSON
7. Insert screenshot placeholders
8. Update DOC-INDEX.md

Then continue with the standard post-task workflow (STATUS.md → typecheck → commit → log).
