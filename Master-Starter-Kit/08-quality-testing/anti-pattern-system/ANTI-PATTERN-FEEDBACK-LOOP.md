# Anti-Pattern Feedback Loop

## How Anti-Patterns Feed Into Other Systems

Anti-patterns aren't just documentation — they're enforced through 7 layers of the development process. This creates a feedback loop that makes the same mistake progressively harder to repeat.

---

## The 7 Reinforcement Layers

```
Layer 1: DOCUMENTATION        Anti-pattern file documents the pattern
    ↓
Layer 2: PREVENTION CHECKLIST  16-item pre-commit checklist includes checks
    ↓
Layer 3: SESSION KICKOFF       Session start reminds developer of active patterns
    ↓
Layer 4: QUALITY GATES         Automated checks catch violations
    ↓
Layer 5: CODE REVIEW           Human or AI review checks against known patterns
    ↓
Layer 6: TRIBUNAL AUDIT        PST Phase 2 explicitly checks for anti-patterns
    ↓
Layer 7: AI CONFIG             CLAUDE.md / AGENTS.md rules prevent AI from generating bad patterns
    ↓
    (Back to Layer 1 — new patterns discovered feed back into documentation)
```

---

## How Each Layer Works

### Layer 1: Documentation (ANTI-PATTERN-STARTER.md)
- Each pattern has: symptom, root cause, wrong code, correct code, prevention rule
- Updated whenever a new occurrence is found
- Occurrence count tracks frequency over time

### Layer 2: Prevention Checklist (PREVENTION-CHECKLIST.md)
- 16-item checklist run before every commit
- Each item maps to specific anti-patterns
- Includes grep commands for automated detection

### Layer 3: Session Kickoff
- Session start protocol includes: "Read active anti-patterns relevant to today's service"
- AI agent reads anti-pattern list before starting work
- High-frequency patterns flagged as "watch for this today"

### Layer 4: Quality Gates
- Gate 2 (TypeScript): Catches AP-009 (missing types)
- Gate 3 (Tests): Catches AP-004 (mock data), AP-010 (unverified endpoints)
- Gate 4 (Lint): Catches AP-003 (unstable deps), AP-009 (any types)
- Gate 8 (State): Catches AP-008 (missing UI states)

### Layer 5: Code Review
- Reviewer checks PR against PREVENTION-CHECKLIST.md
- Known anti-patterns are explicitly called out in review comments
- New violations must be fixed before merge

### Layer 6: Tribunal Audit
- PST Phase 2D specifically checks hook quality (AP-001, AP-003)
- PST Phase 2A checks security patterns (AP-011)
- Tribunal findings that match known anti-patterns increase severity
- New tribunal findings may create new anti-pattern entries

### Layer 7: AI Config
- CLAUDE.md includes: "Never use `any` type", "Always unwrap API envelope"
- AGENTS.md includes prevention rules for all 11 anti-patterns
- AI tools are configured to check against anti-patterns before generating code

---

## Adding a New Anti-Pattern

When a new pattern is discovered (from a bug, tribunal, or code review):

1. **Document** — Create entry using ANTI-PATTERN-TEMPLATE.md
2. **Add to checklist** — Add corresponding check to PREVENTION-CHECKLIST.md
3. **Update session kickoff** — Add to the "watch for" list if high-frequency
4. **Update quality gates** — Add automated check if possible
5. **Update AI config** — Add prevention rule to CLAUDE.md / AGENTS.md
6. **Track** — Set occurrence count to 1, monitor frequency

---

## Retiring an Anti-Pattern

When a pattern hasn't been seen in 3+ sprints:

1. Move from "Active" to "Historical" in ANTI-PATTERN-STARTER.md
2. Keep in PREVENTION-CHECKLIST.md (prevention is cheaper than cure)
3. Remove from session kickoff "watch for" list
4. Keep in AI config (costs nothing, prevents regression)
