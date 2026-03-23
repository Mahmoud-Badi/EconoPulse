---
name: verify-context
description: |
  Anti-hallucination gate. Run after every context compaction, at every session start, or whenever
  you suspect context has degraded. Reads ARCH-ANCHOR.md, handoff.md, and STATUS.md, then forces
  Claude to prove it understands the system before doing any work.

  Use when:
  - Session starts (first thing after /session-kickoff or manual resume)
  - Context compacted (after any compaction event)
  - User says "verify context", "check your understanding", "what do you know about this project"
  - User says "you seem confused", "that's wrong", "you're hallucinating"
  - User provides an answer to a previous question from a different session
  - User types /verify-context

  This skill BLOCKS all work until verification passes. If any answer contradicts ARCH-ANCHOR,
  re-read the relevant spec before proceeding.
---

# Verify Context — Anti-Hallucination Gate

## Purpose

After context compaction or session restart, Claude fills gaps in understanding with
plausible-sounding but WRONG information. This skill forces an explicit verification step
that catches drift BEFORE it becomes code.

**Rule:** Do NOT write any code, modify any file, or make any recommendation until this
verification passes. If you can't answer a question, say "I don't know — let me read the file"
and go read it. Guessing is the entire problem this skill exists to prevent.

---

## Step 1: Read Core Files

Read these files in this exact order. Do not skip any.

1. `dev_docs/ARCH-ANCHOR.md` — System understanding (if exists)
2. `dev_docs/handoff.md` — What was done, what's next
3. `dev_docs/STATUS.md` — Progress dashboard
4. `dev_docs/DEVLOG.md` — Last 5 entries only (use offset/limit)

If `ARCH-ANCHOR.md` does not exist, read instead:
- `dev_docs/session-context.md` (if exists)
- `CLAUDE.md` at project root

If neither ARCH-ANCHOR.md nor session-context.md exist, announce:
```
No architecture anchor found. I have limited system understanding.
I can see handoff.md and STATUS.md for task-level context, but I cannot
verify architectural understanding. Recommend running /kit-upgrade uplift
to generate ARCH-ANCHOR.md, or describe the system architecture to me.
```

---

## Step 2: Answer Verification Questions

After reading the files, answer ALL of these questions out loud in the conversation.
Do NOT skip any. Do NOT guess — if the answer isn't in the files you read, say "not found."

### System Identity
1. **What is this project?** (one sentence: what it does, who it's for)
2. **What tech stack?** (framework, backend, database, ORM, auth, UI library)
3. **What phase are we in?** (current phase name and step number)

### Architecture Facts
4. **What database and where is the schema?** (engine + provider + file path)
5. **What auth system and strategy?** (library + JWT/sessions/etc + config path)
6. **How many services and what are they?** (list names and statuses)
7. **What API style?** (REST/tRPC/GraphQL + router count)

### Current State
8. **What was the last completed task?** (from handoff.md or DEVLOG)
9. **What is the next task?** (from handoff.md "Next Exact Action")
10. **Are there any active blockers?** (from handoff.md "Blockers")

### Constraints
11. **Name 3 constraints I must not violate.** (from ARCH-ANCHOR "Active Constraints" or CLAUDE.md rules)
12. **Name 1 rejected alternative and why.** (from ARCH-ANCHOR "Rejected Alternatives" or session-context.md)

---

## Step 3: Cross-Check

After answering, verify your answers against ARCH-ANCHOR.md "Anti-Hallucination Anchors" section.

For each anchor fact:
- If your answer MATCHES the anchor → PASS (silent)
- If your answer CONTRADICTS the anchor → FLAG:
  ```
  CONTRADICTION DETECTED:
  My answer: [what I said]
  ARCH-ANCHOR says: [what the file says]
  Resolution: Trusting ARCH-ANCHOR. Reading [relevant spec file] to refresh understanding.
  ```
  Then read the relevant spec/hub file before proceeding.
- If the anchor has info you didn't mention → NOTE:
  ```
  MISSING FROM MY UNDERSTANDING: [fact from anchor]
  Adding to active context.
  ```

---

## Step 4: Handle "Coming Back With an Answer"

If the user's message contains an answer to a question from a previous session:

1. Read handoff.md "Blockers" or "Open Questions" section
2. Find the specific question that was asked
3. Announce: "In the previous session, the question was: [exact question]. Your answer: [user's answer]."
4. Update handoff.md: remove the blocker, add resolution note
5. Update DEVLOG.md: append entry "Blocker resolved: [question] → [answer]"
6. THEN continue with normal work

Do NOT skip steps 3-5. The resolution must be documented before work continues.

---

## Step 5: Announce Readiness

After all checks pass:

```
Context verified.

Project: [name]
Phase: [phase] | Step: [step]
Last completed: [task]
Next task: [task from handoff]
Active blockers: [list or "none"]
Constraints verified: [N]/[N] anchors match

Ready to proceed. [Describe the first action you'll take.]
```

If ANY contradiction was found, add:
```
NOTE: [N] contradiction(s) were found and resolved by re-reading source files.
The corrected understanding is reflected above.
```

---

## When to Run This Skill

### Automatic triggers (should be invoked by hooks or session start)
- After every context compaction (context-anchor hook should reference this skill)
- At every session start (session-kickoff skill should invoke this)
- When user provides an answer to a previous session's question

### Manual triggers
- User says "verify context" or "check your understanding"
- User says "you're wrong about X" or "that's not how this project works"
- You feel uncertain about the project architecture (self-awareness check)

### When NOT to run
- Mid-task (you're already verified and working)
- After reading a single file (this is for full context recovery, not incremental reads)
- When the user is asking a simple question that doesn't require system understanding

---

## Integration with Other Skills

- **/session-kickoff** should invoke `/verify-context` after reading state files
- **/gsd** window mode should invoke `/verify-context` at the start of each window
- **context-anchor hook** should tell post-compact Claude to run `/verify-context`
- **/kit-upgrade** Phase 6 should audit whether verify-context is in the session-kickoff flow
