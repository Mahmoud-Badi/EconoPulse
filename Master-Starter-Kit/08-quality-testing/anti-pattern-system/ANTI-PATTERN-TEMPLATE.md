# Anti-Pattern: {{PATTERN_ID}} — {{PATTERN_NAME}}

## Summary

| Field | Value |
|-------|-------|
| **ID** | AP-{{PATTERN_ID}} |
| **Name** | {{PATTERN_NAME}} |
| **Frequency** | How often this occurs: RARE / OCCASIONAL / COMMON / EPIDEMIC |
| **Severity** | Impact when it occurs: LOW / MEDIUM / HIGH / CRITICAL |
| **Category** | API / UI / Data / Security / State / Testing / Documentation |
| **First Seen** | {{DATE}} |
| **Last Seen** | {{DATE}} |
| **Occurrences** | {{COUNT}} |

---

## Symptom

_What does the developer or user see when this anti-pattern is present?_

---

## Root Cause

_Why does this happen? What leads developers to make this mistake?_

---

## Wrong Code

```typescript
// BAD — This is the anti-pattern
```

---

## Correct Code

```typescript
// GOOD — This is the correct approach
```

---

## Prevention Rule

_One sentence rule that prevents this anti-pattern:_

> **RULE:** _[e.g., "Always unwrap the API envelope before accessing data"]_

---

## Detection

How to detect this anti-pattern in the codebase:

```bash
# Command to find occurrences
grep -r "pattern" --include="*.ts" --include="*.tsx"
```

---

## Reinforcement Layers

This anti-pattern is reinforced through:

- [ ] Anti-pattern documentation (this file)
- [ ] Prevention checklist (PREVENTION-CHECKLIST.md)
- [ ] Session kickoff reminder
- [ ] Quality gate check
- [ ] Tribunal audit item
- [ ] CLAUDE.md / AGENTS.md rule
- [ ] Code review gate
