# Quality Gates

<!--
  GENERATOR INSTRUCTIONS:
  This block defines what "done" means. It's the contract between the AI and
  the developer. Without it, "done" means "I stopped working on it" — which
  is not the same as "it's ready."

  The code change protocol is universal — it applies to every code change
  regardless of project type. The verification requirements, output format
  sync, and project-specific standards are customized per project.

  This block should make the AI slightly uncomfortable. If following these
  gates doesn't slow the AI down at all, the gates aren't rigorous enough.
  The point is not to prevent all bugs — it's to prevent the CATEGORY of
  bugs that AI-assisted development is most prone to: shallow fixes, missed
  side effects, and unverified assumptions.

  Source from: archetype quality standards + project-specific testing
  requirements + compliance needs from intake.
-->

## Code Change Protocol

Every code change — from a one-line fix to a multi-file refactor — follows this sequence. No step is optional.

### Step 1: Understand

Read the relevant code. Not just the file you plan to change — the callers, the consumers, the tests, the types. Understand what the code does NOW, not what you think it should do.

**Gate:** Can you explain in one sentence what this code does and why it exists? If not, keep reading.

### Step 2: Impact Analysis

Identify everything that could be affected by your change. Search for all references to the function, component, type, constant, or API you're modifying. Check for:
- Direct callers and importers
- Indirect consumers (event listeners, webhook handlers, scheduled jobs)
- Shared state (caches, stores, global variables, environment variables)
- Configuration files that reference this code
- Tests that assert on this behavior

**Gate:** Can you list at least 3 potential impact areas? If you can only think of 1, your analysis is incomplete — search harder.

### Step 3: Plan

Before writing any code, state your plan. What files will you modify? What will each modification do? What is the expected behavior after the change? What could go wrong?

**Gate:** Does your plan address all impact areas from Step 2? If not, revise.

### Step 4: Implement

Write the code. Follow all prime directives and anti-patterns. Do not take shortcuts because "it's a small change." Small changes cause the majority of production incidents precisely because people skip the protocol for them.

**Gate:** Does the implementation match the plan from Step 3? If you deviated, go back and update the plan to reflect what you actually did and re-evaluate impact.

### Step 5: Verify

Run the code. Not just the happy path — the error paths, the edge cases, the concurrent access scenarios. Check:

<!--
  Fill {{VERIFICATION_CHECKLIST}} with project-specific verification steps.
  These should be concrete and actionable, not vague.

  Format as a checklist:
  - [ ] [Specific verification step]

  Examples:
  - [ ] Run the affected test suite and confirm all tests pass
  - [ ] Manually test the UI flow from start to completion
  - [ ] Check the browser console for new warnings or errors
  - [ ] Verify the API response matches the TypeScript interface
  - [ ] Confirm the database migration runs and rolls back cleanly
  - [ ] Test with authentication in both logged-in and logged-out states
  - [ ] Verify mobile responsiveness on viewport widths 320px, 768px, 1024px
  - [ ] Check that rate limiting still works after the change
  - [ ] Verify webhook payloads haven't changed shape

  Include 5-10 items relevant to this project's stack and domain.
-->

{{VERIFICATION_CHECKLIST}}

**Gate:** Do you have evidence (not assumptions) that the change works correctly? Screenshots, test output, console logs, API responses. If your only evidence is "the code looks right," go back and actually run it.

### Step 6: Report

Summarize what you changed, why, what you verified, and any risks or follow-up items. This is not optional — it's how the developer builds trust in your work and catches anything you missed.

**Report format:**
```
**Changed:** [files modified and what each change does]
**Why:** [the problem this solves or feature this implements]
**Verified:** [what you tested and the results]
**Risks:** [anything that could go wrong that you haven't fully mitigated]
**Follow-up:** [anything that should be done next but wasn't part of this change]
```

---

## Verification Requirements by Change Type

Not all changes need the same depth of verification. But all changes need SOME verification.

| Change Type | Minimum Verification | Why This Level |
|---|---|---|
| **Logic change** (conditionals, calculations, data transforms) | Unit test passes + manual trace of at least 2 code paths (happy + error) | Logic bugs are invisible to compilers and linters. The only way to catch them is to run the logic. |
| **UI change** (components, layouts, styles) | Visual check at 3 viewport widths + interaction test (click, submit, navigate) | UI bugs are visual — you cannot verify them without looking at them. Responsive breakpoints are where 80% of UI bugs hide. |
| **Data flow change** (API contracts, database queries, state management) | End-to-end trace from input to storage to retrieval to display | Data corruption is the most expensive category of bug. A malformed write today becomes a crash on every read tomorrow. |
| **Configuration change** (env vars, build config, deployment settings) | Verify the config is picked up at runtime, not just syntactically valid | A typo in a config value will not throw a syntax error. It will silently use a default or fail at runtime in a way that looks unrelated. |
| **Dependency change** (adding, removing, or updating packages) | Build succeeds + existing test suite passes + bundle size check | Dependency changes have the widest blast radius and the most deferred consequences. A breaking change in a transitive dependency won't surface until production. |
| **Delete/remove** (removing code, files, features) | Search for all references. Confirm nothing imports, calls, or links to the deleted code | Removing code feels safe but is the most common source of runtime errors that compile just fine. |

---

## Output Format Sync

<!--
  Fill {{OUTPUT_FORMATS}} with the project's rendering contexts. These are
  all the places where the same data might be displayed or consumed.

  Example for a SaaS app:
  - Web app (React)
  - Email notifications (HTML email templates)
  - API responses (JSON)
  - Webhook payloads (JSON)
  - PDF exports
  - Mobile push notifications (plain text, 100 char limit)

  Example for a content platform:
  - Web reader view
  - RSS feed (XML)
  - Email digest
  - Social media preview (Open Graph)
  - Print stylesheet
  - AMP version

  The rule: if you change how data is formatted or displayed in ONE context,
  check ALL other contexts for consistency. A price displayed as "$10.00" in
  the web app but "10" in the email is a bug.
-->

When any data format or display change is made, verify consistency across ALL output contexts:

{{OUTPUT_FORMATS}}

**Rule:** A change to any output format must be checked against every other output format. Users do not experience "the API" or "the email template" — they experience the product. Inconsistency between contexts feels broken even when each context is individually "correct."

---

## Project-Specific Quality Standards

<!--
  Fill {{QUALITY_STANDARDS}} with standards specific to this project's
  domain and requirements. These go beyond generic code quality.

  Format each as:
  **Standard:** [The requirement]
  **Measurement:** [How to verify compliance]
  **Consequence of violation:** [What happens if this standard is not met]

  Examples:

  **Standard:** All API responses must complete within 200ms at p95.
  **Measurement:** Check response times in dev tools or load test results.
  **Consequence of violation:** Users perceive the app as slow. Mobile users
  on poor connections experience timeouts. Conversion rate drops.

  **Standard:** All user-facing text must be externalized in the i18n system.
  **Measurement:** Search for hardcoded strings in component files.
  **Consequence of violation:** The text cannot be translated. When
  localization is eventually needed, every hardcoded string becomes a bug.

  **Standard:** No database query may execute without an index on the
  filtered/sorted columns.
  **Measurement:** Run EXPLAIN on all new queries.
  **Consequence of violation:** Query performance degrades linearly with
  data growth. A query that works fine with 1,000 rows will lock the
  database at 1,000,000 rows.

  Include 3-6 standards relevant to this project.
-->

{{QUALITY_STANDARDS}}

---

## The Meta-Gate

After completing all gates for a change, ask yourself one final question:

**"If this change causes a production incident at 2 AM, will the on-call engineer be able to understand what changed, why, and how to roll it back — from my commit message and code comments alone?"**

If the answer is no, your change is not ready to ship. Add the context that's missing. Future-you (or the poor person who inherits this codebase) will thank present-you.

<!--
  QUALITY CHECK before finalizing this block:
  1. Would following this protocol on every change take noticeably longer
     than just making the change? Good. That's the point. The protocol
     prevents the bugs that cost 10x more to fix after shipping.
  2. Are the verification requirements specific enough that the AI can't
     weasel out of them? "Test it" is not specific. "Run the test suite
     and paste the output" is specific.
  3. Do the project-specific quality standards reflect what the team
     actually cares about? Performance budgets, accessibility requirements,
     security standards — whatever would cause a PR to be rejected in
     code review should be a quality standard here.
-->
