# Troubleshooting Guide

> Things went wrong? Here's how to fix them.

---

## Quick Fixes

| Problem | Fix |
|---------|-----|
| Claude stopped mid-step | Say: "Read ORCHESTRATOR.md and resume from where we left off" |
| Context window ran out | Start a new conversation and say the same thing above |
| Claude forgot what we were doing | The STATE BLOCK at the top of ORCHESTRATOR.md tracks progress |
| I don't understand what Claude is asking | Say: "Explain that in simple terms" |
| I don't know the answer to a question | Say: "You decide — pick a smart default" |
| I want to skip a step | Say: "Skip step [number] and move to step [next number]" |

---

## Common Problems & Solutions

### "Context reset — Claude forgot everything"

**What happened:** Claude's conversation memory has limits. After a long session, it may lose earlier context.

**How to fix it:**
1. Start a new conversation
2. Say: "Read ORCHESTRATOR.md and resume from the STATE BLOCK"
3. Claude reads the STATE BLOCK (which it updated after each completed step) and picks up where it left off

**Prevention:** The kit was designed for this. The STATE BLOCK, STATUS.md, HANDOFF.md, and DEVLOG.md all exist specifically to survive context resets. Your progress is never lost.

---

### "Claude misunderstood my project"

**What happened:** The intake conversation (Step 1) went in the wrong direction. Claude is now generating specs for a product you didn't describe.

**How to fix it:**
1. Say: "Stop. Let's redo Step 1. The project is actually [describe it clearly]."
2. Claude will re-run the intake, overwriting the incorrect PROJECT-BRIEF.md
3. If Claude already generated later steps (services, screens), say: "Re-run steps 5 and 6 with the corrected brief"

**Prevention:** Take your time during Step 1. The intake has 10 mandatory stop gates for a reason — they catch misunderstandings early.

---

### "The gate checkpoint output looks wrong"

**What happened:** Claude finished a step, showed you the results at a gate checkpoint, and something doesn't look right.

**How to fix it:**
1. Say: "This isn't right. [Explain what's wrong specifically]."
2. Claude will re-do the step with your feedback
3. You can be specific: "The user roles are wrong — we have 3 roles, not 5" or "This service spec is missing the billing integration"

**This is exactly what gates are for.** You're not slowing things down by rejecting — you're preventing bad specs from cascading into bad tasks.

---

### "I want to redo a specific step"

**How to fix it:**
Say: "Re-run step [number]. Here's what I want changed: [your feedback]."

Claude will:
1. Re-read the ORCHESTRATOR instructions for that step
2. Re-generate the output files
3. Show you the results for approval

**Important:** If you redo an early step (like Step 1 or Step 3), later steps that depend on it may need re-running too. Claude will tell you which ones.

---

### "Claude is referencing files that don't exist"

**What happened:** Claude is naming file paths that aren't in your project.

**How to fix it:**
1. Say: "That file doesn't exist. Check the ORCHESTRATOR for the correct file paths."
2. If Claude is generating new files in the wrong location, say: "Put all generated files in dev_docs/ as described in the ORCHESTRATOR"

**Why this happens:** Sometimes Claude invents plausible-sounding paths instead of reading the actual template paths from the ORCHESTRATOR. Asking it to re-read the step instructions usually fixes this.

---

### "MCP servers aren't working"

**What happened:** Firecrawl, Gemini, or other MCP servers aren't responding during the Tribunal or research steps.

**How to fix it:**
1. The kit has built-in fallbacks. Say: "MCP servers aren't available. Use WebSearch and WebFetch fallbacks instead."
2. Every research step in the ORCHESTRATOR includes fallback instructions for when MCP servers are unavailable
3. Results may be less detailed but the process still works

**How to check:** Say: "Test the Firecrawl MCP server by scraping example.com"

---

### "Too many files were generated — I'm overwhelmed"

**What happened:** The Tribunal generated 80+ files, there are dozens of service specs and screen specs, and you don't know where to start.

**What to focus on (in order):**

| Priority | File | Why |
|----------|------|-----|
| 1 | `dev_docs/STATUS.md` | Your sprint dashboard — shows exactly what to do today |
| 2 | `dev_docs/HANDOFF.md` | Day-1 checklist — your starting instructions |
| 3 | `CLAUDE.md` | Project context — Claude reads this at the start of every session |
| 4 | First task file | Whatever STATUS.md says is task #1 |

**Everything else is reference material.** You don't need to read all 80 research files. They exist so that when you're building the billing service, you can check `service-hub-billing.md` for the spec. You look up what you need, when you need it.

---

### "I changed my mind about a feature"

**What happened:** You're mid-build and realized a feature should be added, removed, or changed.

**How to fix it:**

**To add a feature:**
Say: "I want to add [feature]. Run a mini-Tribunal — create a persona vote, check feasibility, and update the verdict."

**To remove a feature:**
Say: "Remove [feature] from the MVP. Move it to the Won't-Have list. Update STATUS.md, the relevant service spec, and remove related task files."

**To change a feature:**
Say: "Change [feature] from [old behavior] to [new behavior]. Update the service spec, screen spec, and related task files."

The kit's modular structure means changes cascade cleanly — update the spec, and the task files follow.

---

### "The session is taking too long"

**What happened:** You've been running the kit for hours and it's still going.

**Options:**

1. **Save and quit:** Say: "Update the STATE BLOCK and HANDOFF.md. I'll continue in a new session."
2. **Skip to essentials:** Say: "Skip to Step 8 (tasks) — I just want task files so I can start coding."
3. **Switch to Lite Path:** Say: "Switch to the Lite Path. Run only steps 0, 1, 2, 5, 6, 8." (See [PATHS.md](PATHS.md))

---

### "I'm getting errors when Claude tries to write files"

**What happened:** Permission errors, path errors, or file system issues.

**Common fixes:**
- Make sure your project directory is writable
- Make sure `dev_docs/` directory exists (Claude should create it, but sometimes can't)
- If using a monorepo, make sure you're in the right package directory
- Say: "Create the dev_docs directory first, then re-run this step"

---

### "The design tokens don't match my brand"

**How to fix it:**
Say: "Update the design tokens. My brand colors are [hex codes]. My font is [font name]. My style is [describe: minimal, bold, playful, corporate, etc.]."

Claude will regenerate DESIGN-TOKENS.md with your specific brand values.

---

## Still Stuck?

If none of the above helps:

1. **Describe the exact problem:** "Claude did X, I expected Y, what happened was Z"
2. **Check the ORCHESTRATOR:** Read the step Claude is on — the instructions might clarify what should happen
3. **Check LESSONS-LEARNED.md:** Your problem might be a known gotcha
4. **Start fresh:** If the session is too broken, start a new conversation and resume from the STATE BLOCK. Your progress is preserved.
