# Anti-Patterns

<!--
  GENERATOR INSTRUCTIONS:
  Anti-patterns are the inverse of best practices — they're specific behaviors
  the AI must NEVER do, with explanations of the harm they cause and what to
  do instead.

  The universal anti-patterns (1-4) apply to every project. They address the
  most dangerous failure modes of AI-assisted development: hallucination,
  symptom-fixing, unverified shipping, and scope creep.

  The project-specific anti-patterns (5-12) come from the archetype and
  project risk profile. A fintech project gets anti-patterns about financial
  data handling. A healthcare project gets anti-patterns about PII exposure.
  A consumer app gets anti-patterns about performance regression.

  Every anti-pattern must have three parts:
  1. "Never..." — the behavior to avoid
  2. "Harm:" — what happens when you do it anyway
  3. "Instead:" — the correct alternative

  An anti-pattern without an "Instead" is just a prohibition. Prohibitions
  without alternatives lead to paralysis, not improvement.
-->

> The fastest way to destroy trust in an AI-assisted workflow is to make the same category of mistake twice. These anti-patterns exist because each one has caused real damage in real projects. Learn from the scar tissue.

---

## Universal Anti-Patterns

### Anti-Pattern 1: Never Reason From Memory When You Can Reason From Code

**Never** answer questions about the codebase based on what you "remember" from earlier in the conversation or from your training data. File contents change. Functions get refactored. Configs get updated. Your memory of what a file contains is always stale.

**Harm:** You confidently state that a function works a certain way, the developer trusts you, builds on that assumption, and ships a bug. Debugging takes hours because everyone assumed the foundation was solid.

**Instead:** Read the file. Every time. Even if you read it 10 minutes ago. `Read` is cheap. Production bugs are expensive. If you find yourself saying "based on what I saw earlier" — stop and re-read the file.

---

### Anti-Pattern 2: Never Fix Only the Symptom

**Never** apply a fix that makes the error message go away without understanding why the error occurred. Suppressing errors, adding null checks around undefined values, catching and swallowing exceptions — these are symptom fixes that bury the real bug deeper.

**Harm:** The root cause remains. It manifests again later in a different form, harder to trace because the original symptom is now masked. Symptom fixes compound — three layers of null checks hiding a broken data pipeline that should have been fixed at the source.

**Instead:** Trace the error to its origin. Why is this value null? Where should it have been set? What upstream change caused it to stop being set? Fix the cause. Then verify the symptom is also gone.

---

### Anti-Pattern 3: Never Ship Without Verification

**Never** declare a task complete based solely on the fact that the code compiles, the linter passes, or "it looks right." Compilation checks syntax, not behavior. Linters check style, not correctness.

**Harm:** The feature "works" in the happy path but fails on the first edge case a real user encounters. The developer moves on to the next task. The bug report comes in 3 days later when context is lost.

**Instead:** Run the code. Click through the flow. Submit the form with bad data. Hit the API with a malformed request. Open the page on mobile. Check the console for warnings. Evidence or it didn't happen.

---

### Anti-Pattern 4: Never Add a Feature Without Business Justification

**Never** add functionality just because it would be "nice to have," "cool," or "a common pattern." Every feature has ongoing maintenance cost. Every feature increases the attack surface. Every feature adds cognitive load for users.

**Harm:** Feature creep. The product becomes bloated, harder to maintain, and confusing to users. The "nice to have" feature introduces a security vulnerability. The "common pattern" implementation conflicts with a domain-specific requirement.

**Instead:** Before building, state who specifically asked for this, what problem it solves, and why that problem is worth the maintenance cost. If you can't answer all three, don't build it.

---

## Project-Specific Anti-Patterns

<!--
  Fill {{CUSTOM_ANTIPATTERN_1}} through {{CUSTOM_ANTIPATTERN_8}} from the
  archetype's default anti-patterns + project-specific risks.

  Each must follow this exact format:

  ### Anti-Pattern N: Never [do X]

  **Never** [specific behavior description].

  **Harm:** [specific, domain-relevant consequence]

  **Instead:** [the correct alternative behavior]

  Examples of good project-specific anti-patterns:

  - Fintech: "Never log financial amounts with user identifiers. A leaked log
    file becomes a targeted phishing goldmine."
  - Healthcare: "Never return patient data in error messages. A stack trace
    containing a patient name in a 500 response is a HIPAA violation."
  - Multi-tenant SaaS: "Never use a single database connection without tenant
    context. One missing WHERE clause = data leak across tenants."
  - E-commerce: "Never cache personalized content at the CDN layer. One user
    seeing another user's cart or recommendations destroys trust instantly."
  - Real-time: "Never use unbounded arrays for event streams. A spike in events
    will OOM the process and take down every connected client."
  - Consumer mobile: "Never add a synchronous network call to the app launch
    path. Users on 3G in rural areas will see a frozen splash screen and
    uninstall within 8 seconds."
  - API platform: "Never make a breaking change to a published endpoint without
    versioning. Your customers' production systems depend on your contract."
  - Content platform: "Never render user-submitted HTML without sanitization.
    XSS in a content platform means one user can hijack every reader's session."

  Delete unused anti-pattern slots. 4 strong domain-specific anti-patterns
  beat 8 generic ones.
-->

### Anti-Pattern 5: {{CUSTOM_ANTIPATTERN_1}}

### Anti-Pattern 6: {{CUSTOM_ANTIPATTERN_2}}

### Anti-Pattern 7: {{CUSTOM_ANTIPATTERN_3}}

### Anti-Pattern 8: {{CUSTOM_ANTIPATTERN_4}}

### Anti-Pattern 9: {{CUSTOM_ANTIPATTERN_5}}

### Anti-Pattern 10: {{CUSTOM_ANTIPATTERN_6}}

### Anti-Pattern 11: {{CUSTOM_ANTIPATTERN_7}}

### Anti-Pattern 12: {{CUSTOM_ANTIPATTERN_8}}

<!-- Delete any unused anti-pattern slots above. -->

---

## When You Catch Yourself

If you recognize that you're about to commit an anti-pattern — good. That recognition is the value of this list. State which anti-pattern you nearly hit, why the situation tempted you, and what you're doing instead. This is not performative — it builds the habit of catching these patterns before they cause damage.

If you commit an anti-pattern and realize it after the fact: say so immediately. Do not try to quietly fix it and hope nobody notices. The cover-up is always worse than the mistake.

<!--
  QUALITY CHECK before finalizing this block:
  1. Are the project-specific anti-patterns things that could actually happen
     in this project? If an anti-pattern would never realistically occur given
     the tech stack and domain, remove it.
  2. Does every "Instead" give clear, actionable guidance? "Be more careful"
     is not actionable. "Run the tenant isolation test suite" is actionable.
  3. Would a developer who has been burned by one of these anti-patterns
     read the description and say "yes, that's exactly what happened to me"?
     If the descriptions are too abstract, they won't trigger recognition.
-->
