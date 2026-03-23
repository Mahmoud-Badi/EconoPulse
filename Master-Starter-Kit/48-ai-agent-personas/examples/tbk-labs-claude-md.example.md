# TBK Labs — Claude Code Operating Rules (Reference Example)

> **This is a READ-ONLY reference.** It demonstrates how a real production project uses role prompting to transform the AI agent from a generic assistant into a domain-expert co-founder. Study the patterns, adapt the depth, but never copy domain-specific content.

> **Source:** TBK Labs — an automotive datalog analysis platform used by car owners and professional tuners to assess engine health, diagnose problems, and plan modifications.

---

## What Makes This Example Exceptional

### 1. Identity Is Specific and Consequential

The identity block doesn't say "you are an AI assistant that helps with code." It says:

> "You are not a code assistant. You are the **technical co-founder and lead engineer** of TBK Labs."

And immediately follows with real consequences:
- "A false CRITICAL finding causes someone to waste $2,000 on parts they don't need"
- "A missed CRITICAL finding lets someone blow an engine on a highway pull"
- "A confusing UI makes a tuner look incompetent in front of their client"

**Pattern to replicate:** Consequences are dollar amounts, physical harm, professional embarrassment, lost sales — not abstract "quality" or "user experience."

### 2. Domain Knowledge Is Deeply Technical

The domain knowledge section doesn't explain what a database is. It explains:

> "BM3 logs expose three distinct boost signals. Using the wrong one produces misleading analysis."
> "Boost pressure (Target) — this is a flat ECU reference value (~22.3 psi, never changes). It is NOT the dynamic RAM target."

**Pattern to replicate:** Include the kind of knowledge that takes months of production experience to learn. Not textbook definitions — field-tested gotchas.

### 3. Perspective Checks Create Real Tension

Two perspectives that genuinely conflict:

> **Car Owner:** "Does it scare me unnecessarily? Does it miss something that should scare me?"
> **Tuner:** "Does it match what I'd conclude from reading the raw data myself? Does it make me look competent?"

The car owner wants reassurance. The tuner wants precision. These create real design tension.

**Pattern to replicate:** Choose perspectives that pull in different directions, forcing the AI to find the right balance.

### 4. Anti-Patterns Are Born from Real Failures

> "Never Reason From Memory — you have repeatedly written fixes from memory rather than from the actual code, producing changes that conflict with the current state."

This wasn't written as a general principle. It was written because the AI actually made this mistake, repeatedly, and it cost real debugging time.

**Pattern to replicate:** Anti-patterns should reference real failures, not hypothetical risks.

### 5. Prime Directives Have "Why" Rationale

Every directive explains WHY it exists:

> "Domino Effect Analysis Is Mandatory — This is not optional. This is not overhead. This is how you avoid the pattern where a 'simple fix' breaks three other things that you don't notice until I deploy."

**Pattern to replicate:** A directive without a "why" is a suggestion. A directive with a "why" is a rule.

### 6. Quality Gates Are Specific, Not Vague

Instead of "test your code," TBK Labs specifies:

> "For logic changes: Run the test suite. If no test exists, WRITE ONE FIRST. Trace one concrete example through the pipeline manually."
> "For UI changes: State exactly what the user will see before and after. Check dark theme compatibility (TBK is dark-theme only)."

**Pattern to replicate:** Quality gates must be specific enough that compliance is verifiable, not subjective.

---

## Key Design Patterns to Extract

| Pattern | Example from TBK Labs | How to Generalize |
|---|---|---|
| Role elevation | "You are the technical co-founder" | Elevate from assistant to co-founder/lead |
| Concrete stakes | "$2,000 wasted on unnecessary parts" | Use real dollar amounts, real consequences |
| Domain gotchas | "BM3's dual lambda channels both track the wideband" | Include knowledge that takes months to learn |
| Dual perspective | Car Owner vs Tuner | Choose stakeholders with genuinely different needs |
| Failure-driven anti-patterns | "You have repeatedly written fixes from memory" | Reference actual AI failures, not hypotheticals |
| Directive + Why | "Domino Effect Analysis is mandatory — this is how you avoid..." | Every rule needs its motivating failure |
| Verifiable quality gates | "State exactly what the user will see before and after" | Gates must be checkable, not subjective |
| Explicit scope | "Evaluators read canonical keys" | State what is NOT allowed, not just what is |
| Universal-first | "Every change is universal until proven otherwise" | Default to broad application, justify exceptions |
| Final rule | "When in doubt, do more work" | End with the tiebreaker principle |

---

## Adaptation Checklist

When creating a persona for a new project, verify:

- [ ] Identity states a specific role, not "AI assistant"
- [ ] 3-5 consequences are concrete (dollars, users affected, physical harm, reputation)
- [ ] Domain knowledge includes at least 5 field-tested gotchas
- [ ] Perspective checks represent genuinely conflicting stakeholder needs
- [ ] Anti-patterns reference real failure modes, not hypothetical risks
- [ ] Every prime directive has a "Why" rationale
- [ ] Quality gates are specific enough to verify compliance
- [ ] Communication style matches the project's audience
- [ ] Final rule provides a clear tiebreaker principle
