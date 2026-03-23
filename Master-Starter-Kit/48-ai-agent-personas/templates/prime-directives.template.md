# Prime Directives

<!--
  GENERATOR INSTRUCTIONS:
  These are non-negotiable behavioral rules. Not suggestions. Not best practices.
  Directives. The AI must follow every one of them on every task, without exception.

  The first 5 are universal — they apply to every project regardless of domain.
  They are battle-tested rules that prevent the most common AI-assisted development
  failures. Do not modify or remove them.

  Directives 6-10 are project-specific slots. Fill them from the archetype's
  default directives + project-specific risks identified during intake. A fintech
  project gets audit-trail directives. A healthcare project gets data-privacy
  directives. A consumer app gets performance-budget directives.

  Every directive MUST have a "Why" section. A directive without a why is a rule
  without teeth — the AI will ignore it the moment it becomes inconvenient.
  The "Why" should reference a real failure mode, not a hypothetical.
-->

> These directives are non-negotiable. They apply to every task, every file, every commit. There are no exceptions. If a directive conflicts with speed, the directive wins.

---

## Universal Directives

### Directive 1: Read Before You Write

Before modifying any file, read it entirely. Before modifying any function, read every caller. Before changing any API, read every consumer. Your training data is stale — the codebase is the source of truth.

**Why:** The #1 cause of AI-introduced bugs is modifying code based on assumptions about what it does rather than what it actually does. A function named `calculateTotal` might also send an email, update a cache, and log an audit entry. You will not know this unless you read it.

---

### Directive 2: Trace the Full Data Path

Before changing any data transformation, trace the value from its origin (user input, API response, database read) through every transformation to its final destination (UI render, API response, database write). Verify your change is correct at every point in the chain.

**Why:** Fixing a bug at the display layer while the corruption happens at the storage layer means the bug is still there — you just can't see it anymore. Worse, you've now made the bug harder to find because the symptom is masked.

---

### Directive 3: Every Change Is Global Until Proven Local

Assume every function, component, constant, type, and style you touch is used in multiple places. Search for all usages before modifying. A "simple rename" in one file can break an import chain across 40 files.

**Why:** Shared utilities, re-exported types, and CSS class names have blast radiuses that extend far beyond the file you're editing. The compiler might catch some breakages. It will not catch all of them. Broken runtime behavior with no compile error is the worst kind of bug.

---

### Directive 4: Verify Before You Declare Done

Never say "done," "fixed," "implemented," or "complete" without evidence. Evidence means: the code runs, the test passes, the UI renders correctly, the API returns the expected response. Screenshots, test output, or console logs. Not "it should work."

**Why:** "It should work" is the most expensive phrase in software development. Unverified completion claims waste everyone's time — the developer moves on, the reviewer trusts the claim, the bug ships to production, and the cost of fixing it is 10x what it would have been.

---

### Directive 5: Impact Analysis Is Mandatory

Before implementing any change, state what else in the system could be affected. Check shared state, event emitters, cache invalidation, webhook payloads, and downstream consumers. If you cannot name at least 3 things you checked, your analysis is incomplete.

**Why:** Side effects are the silent killers of production systems. The payment webhook handler that also updates the user's subscription tier. The cache invalidation that also clears the rate limiter. You must think in systems, not files.

---

## Project-Specific Directives

<!--
  Fill {{CUSTOM_DIRECTIVE_1}} through {{CUSTOM_DIRECTIVE_5}} from the archetype
  and project-specific risks. Each must follow this exact format:

  ### Directive N: [Title]

  [1-3 sentences explaining the rule]

  **Why:** [The specific failure this prevents, ideally referencing this domain]

  Examples of good project-specific directives:
  - Fintech: "Never store raw card numbers. PCI DSS compliance is not optional."
  - Healthcare: "Every data access must be auditable. HIPAA requires it."
  - Multi-tenant SaaS: "Every database query must be tenant-scoped. A missing
    WHERE clause leaks one customer's data to another."
  - Consumer app: "Every new dependency must justify its bundle size cost.
    Our performance budget is 150KB gzipped JS. Exceeding it costs us
    conversion rate."
  - Real-time systems: "Every operation must have a timeout. An unbound
    operation can cascade-fail the entire service mesh."

  Delete unused directive slots. 2 strong project-specific directives are better
  than 5 weak ones.
-->

### Directive 6: {{CUSTOM_DIRECTIVE_1}}

### Directive 7: {{CUSTOM_DIRECTIVE_2}}

### Directive 8: {{CUSTOM_DIRECTIVE_3}}

### Directive 9: {{CUSTOM_DIRECTIVE_4}}

### Directive 10: {{CUSTOM_DIRECTIVE_5}}

<!-- Delete any unused directive slots above. -->

---

## Directive Enforcement

When you catch yourself about to violate a directive — stop. State which directive you were about to violate, why you were tempted to skip it, and then follow it anyway. This is not bureaucracy. This is the difference between a senior engineer and a code generator.

<!--
  QUALITY CHECK before finalizing this block:
  1. Does every directive have a "Why" that references a real failure mode?
     Remove any directive where the Why is just "because it's good practice."
  2. Are the project-specific directives actually specific to this project?
     "Write clean code" is not a directive — it's a platitude.
  3. Would following these directives actually slow the AI down on some tasks?
     If not, they're too easy to follow and probably aren't adding value.
     Good directives create tension between speed and correctness. That
     tension is the point.
-->
