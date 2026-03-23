# Anti-Pattern Scan

## What It Is

A systematic scan of all generated planning documents for known bad patterns — recurring quality failures that appear in specs, task lists, and planning artifacts when depth is insufficient or the author (human or AI) takes shortcuts. The anti-pattern scan is not about style or formatting; it is about detecting specific, named failure patterns that predict downstream implementation problems. Each anti-pattern has been observed in real project planning output and has a documented cost: wasted development time, rework, or bugs that reach production.

---

## What It Catches

- **Generic business rules** that provide zero implementation guidance
- **Copy-paste specs** where two services have suspiciously identical content
- **Placeholder text** that was never replaced with real content
- **Missing error scenarios** in specs that describe only the happy path
- **Features described without user context** — what, but not who or why
- **Untestable requirements** — language like "should be fast" or "must be secure" without measurable criteria
- **Inconsistent naming** — the same entity called different names across different specs
- **Assumed knowledge** — specs that omit critical details because the author "knows what they mean"
- **Over-abstraction** — specs that describe patterns and architectures instead of concrete features
- **Scope creep markers** — requirements that subtly expand the project beyond the original scope

---

## When It's Required

The anti-pattern scan runs after the Spec Completeness Audit and Depth Scoring have passed. A spec can be complete and deep but still contain anti-patterns.

| Checkpoint | When | Scan Scope |
|------------|------|-----------|
| Post-service specs | After Step 4 depth scoring passes | All service specs |
| Post-screen specs | After Step 6 depth scoring passes | All screen specs |
| Post-task generation | After Step 8 coverage validation | All task descriptions |
| Baseline establishment | Step 16.1 (if applicable) | Full planning artifact set, establishing the anti-pattern baseline for the project |

---

## How To Run

### Step 1: Load the anti-pattern catalog

Scan every document against each pattern in the catalog below. For each pattern, the scan is pass/fail per spec.

### Step 2: Scan each document systematically

For each spec or task document:
1. Read the full document
2. Check against each anti-pattern (see catalog below)
3. Record every match with the specific text that triggered the match
4. Categorize severity: **CRITICAL** (must fix before proceeding), **WARNING** (should fix, may proceed with documented risk), **INFO** (noted but acceptable)

### Step 3: Generate the scan report

```markdown
## Anti-Pattern Scan Report
**Date:** YYYY-MM-DD
**Documents scanned:** X
**Anti-patterns found:** X total (Y critical, Z warning)

### Critical Findings (must fix)
| Document | Anti-Pattern | Matched Text | Fix Required |
|----------|-------------|-------------|-------------|
| trip-service spec | AP-01: Generic Rules | "Validate all input fields" | Replace with per-field validation rules |

### Warning Findings (should fix)
| Document | Anti-Pattern | Matched Text | Risk If Unfixed |
|----------|-------------|-------------|----------------|
| driver-list-screen | AP-07: Missing Context | No user story section | Developer may build wrong UX |

### Status: PASS (0 critical) / FAIL (N critical findings)
```

---

## Anti-Pattern Catalog

### AP-01: Generic Business Rules
**Severity:** CRITICAL
**Detection:** Business rules section contains any of these phrases:
- "Validate input" / "Validate all fields" / "Validate user data"
- "Handle errors appropriately" / "Show appropriate error messages"
- "Ensure data integrity" / "Maintain consistency"
- "Follow best practices" / "Use standard patterns"
- "As needed" / "As appropriate" / "As required"

**What it should look like instead:** Per-field validation rules with exact constraints, named error conditions with specific error codes and messages, explicit data integrity rules referencing specific fields and relationships.

**Why it matters:** A developer who reads "validate input" will either (a) make up their own rules, which may not match business requirements, or (b) skip validation and add it "later" — which is never.

---

### AP-02: Copy-Paste Specs
**Severity:** CRITICAL
**Detection:** Two or more specs share >60% identical structure and phrasing with only entity names swapped. Specific signals:
- Identical business rules sections with only nouns changed
- Same number of error scenarios with same descriptions
- Identical edge cases across different services
- Same API endpoint structure down to field names

**Why it matters:** Every service has unique business logic. If `trip-service` and `load-service` have identical business rules, at least one is wrong. The copy-paste spec gives a false sense of completeness while providing zero domain-specific guidance.

---

### AP-03: Placeholder Remnants
**Severity:** CRITICAL
**Detection:** Document contains any of:
- `{{ANYTHING}}` — unresolved template placeholders
- `[TBD]`, `[TODO]`, `[PLACEHOLDER]`, `[INSERT HERE]`
- `Lorem ipsum` or other filler text
- `example.com` in non-example contexts
- `FIXME`, `HACK`, `XXX` comments
- Sections that contain only a heading with no content below it

**Why it matters:** A placeholder means the author acknowledged the field exists but did not fill it. Every placeholder is a gap that a developer will discover during implementation and have to resolve themselves — or worse, ship without resolving.

---

### AP-04: Happy Path Only
**Severity:** CRITICAL
**Detection:** The spec describes what happens when everything goes right but contains:
- Zero or one error scenarios
- No mention of network failures, timeouts, or service unavailability
- No mention of invalid input, missing data, or constraint violations
- No mention of concurrent access, race conditions, or conflicts
- No mention of authorization failures or permission denied cases

**Why it matters:** Users do not stay on the happy path. Cards get declined, networks drop, sessions expire, two people edit the same record. The happy-path-only spec guarantees that error handling will be invented during implementation with no consistent pattern across features.

---

### AP-05: The Database-Schema-as-Spec
**Severity:** WARNING
**Detection:** The service spec is predominantly a list of entity fields and types, with:
- Business rules that are just database constraints restated in prose ("name is required," "status must be one of [active, inactive]")
- No behavioral rules (what happens when X changes, what triggers Y)
- No workflow or lifecycle documentation
- No user interaction context

**Why it matters:** A database schema describes structure. A spec describes behavior. Knowing that a `trip` has a `status` field of type enum is structural. Knowing that status transitions follow the lifecycle `draft → dispatched → in-transit → delivered → invoiced` and that each transition has specific preconditions and side effects — that is behavioral specification.

---

### AP-06: Untestable Requirements
**Severity:** WARNING
**Detection:** Requirements containing vague qualitative language:
- "Should be fast" / "Must be performant" / "Quick response times"
- "Must be secure" / "Follow security best practices"
- "User-friendly" / "Intuitive" / "Easy to use"
- "Scalable" / "Robust" / "Reliable"
- "High quality" / "Production-ready"

**Testable replacement examples:**
- "API response < 200ms at p95 for list endpoints under 1,000 records"
- "All user input sanitized against OWASP Top 10; SQL injection test suite passes"
- "New user completes first task within 60 seconds without help text"
- "System handles 500 concurrent users with < 1% error rate"

---

### AP-07: Feature Without User Context
**Severity:** WARNING
**Detection:** A spec that describes what the system does without explaining:
- Who uses this feature (which user role)
- Why they need it (what problem it solves)
- When they use it (what triggers the workflow)
- What they do with the output (next step after using the feature)

**Why it matters:** A "trip list" feature built for dispatchers (who need to assign drivers quickly, see 50+ trips at once, and filter by status) looks completely different from the same "trip list" built for drivers (who need to see only their own trips, with navigation links and delivery confirmation buttons). Without user context, the developer builds the wrong thing.

---

### AP-08: Inconsistent Naming
**Severity:** WARNING
**Detection:** The same concept is called different names across different specs:
- `trip` in one spec, `shipment` in another, `load` in a third — all referring to the same entity
- `user` vs. `account` vs. `profile` for the same entity
- `invoice` vs. `bill` vs. `payment record`
- Field name discrepancies: `createdAt` in one spec, `created_at` in another, `dateCreated` in a third

**Why it matters:** Naming inconsistency creates implementation inconsistency. One developer builds a `TripService`, another builds a `ShipmentRouter`, a third builds a `load-list` page. The codebase becomes impossible to navigate, and API consumers never know which term to use.

---

### AP-09: Over-Abstraction
**Severity:** WARNING
**Detection:** The spec describes patterns, architectures, and frameworks instead of concrete features:
- "We will use the repository pattern for data access"
- "The service layer will implement CQRS"
- "All components will follow the compound component pattern"
- Extended discussion of technical approach with minimal discussion of actual features

**Why it matters:** Architecture decisions belong in architecture docs, not in feature specs. A feature spec should describe what the feature does from the user's perspective, with enough technical detail for implementation. When the spec is 70% architecture and 30% features, the features get insufficient attention.

---

### AP-10: Scope Creep Markers
**Severity:** INFO
**Detection:** Requirements that subtly expand beyond the original project scope:
- "In the future, we could also..." / "This could be extended to..."
- "Nice to have:" sections that are as long as the core requirements
- Features mentioned in one spec that are not in the project overview
- Requirements that depend on systems or integrations not in the current scope

**Why it matters:** Scope creep in specs becomes scope creep in implementation. If a spec mentions "AI-powered route optimization" as a future enhancement, some developer will spend a day researching it instead of building the current feature. Scope boundaries must be explicit: "This service handles X. It does NOT handle Y (that is a separate service / future phase)."

---

### AP-11: Assumed Knowledge
**Severity:** WARNING
**Detection:** The spec omits critical details that the author clearly understands but did not write down:
- Abbreviations used without definition (especially domain-specific ones)
- References to "the standard flow" or "the usual process" without defining it
- Business rules that reference industry standards without citing them
- Specs that make sense only if you already know the domain

**Why it matters:** The spec will be read by developers who may not know the domain. It may also be read by AI agents with no prior context. Every piece of assumed knowledge is a point of failure where the implementer will guess — and potentially guess wrong.

---

### AP-12: Metric-Free Success Criteria
**Severity:** WARNING
**Detection:** Success criteria or acceptance criteria that cannot be objectively verified:
- "The feature works correctly"
- "Users can complete the workflow"
- "The page loads quickly"
- "Data is displayed properly"

**Testable replacement examples:**
- "All 5 E2E test scenarios pass on Chromium and Firefox"
- "User can create, view, edit, and delete a trip in under 30 seconds each"
- "Page achieves Lighthouse Performance score ≥ 90"
- "All list views support pagination, sorting by 3+ columns, and filtering by status"

---

## Checklist

### Per-Document Scan
- [ ] Scanned against all 12 anti-patterns (AP-01 through AP-12)
- [ ] Every match recorded with specific text that triggered the detection
- [ ] Severity assigned (CRITICAL / WARNING / INFO)
- [ ] Fix documented for every CRITICAL finding
- [ ] Risk documented for every WARNING finding left unfixed

### Batch-Level Scan
- [ ] All specs in scope scanned
- [ ] Zero CRITICAL findings remaining (all fixed)
- [ ] WARNING findings either fixed or documented with accepted risk
- [ ] Anti-pattern scan report generated
- [ ] If this is Step 16.1: baseline anti-pattern inventory established for the project

---

## Common Failures

### 1. The "First Spec Is Great, Rest Are Rushed" Pattern
The first service spec in the batch scores clean — zero anti-patterns. Specs 2-8 progressively accumulate more AP-01 (generic rules), AP-04 (happy path only), and AP-07 (missing context) findings. This is author fatigue. The fix: if spec quality degrades across a batch, stop and reschedule. Better to produce 4 excellent specs today and 4 tomorrow than 8 specs where half are riddled with anti-patterns.

### 2. AI-Generated Copy-Paste (AP-02 + AP-06 Combo)
An AI agent generates 6 service specs in one session. The first 2 are unique and deep. Specs 3-6 are structural clones with entity names swapped and generic qualitative language ("robust error handling," "scalable architecture") filling the depth gaps. This is the most common anti-pattern failure mode when using AI for bulk spec generation. The fix: generate specs one at a time with fresh context, and run the anti-pattern scan after each one.

### 3. The Placeholder That Looks Like Content (AP-03 Variant)
Instead of `{{PLACEHOLDER}}`, the spec contains content that reads like it was meant to be replaced: "The system will handle [describe the specific business rule here]" or "Error handling: [list specific error scenarios]." These are instructions to the author, not content for the reader. They pass a naive placeholder scan but fail the anti-pattern scan.

### 4. Scope Creep Buried in Edge Cases
The edge cases section for a basic CRUD feature includes: "If the system needs to handle 10,000 concurrent users with real-time updates..." The original scope calls for 50 users. This is scope creep disguised as edge case analysis. It will lead to over-engineering.

---

## Proof Artifact

| Artifact | What It Proves |
|----------|---------------|
| **Anti-pattern scan report** | Every document was scanned against all 12 patterns |
| **Per-finding detail with matched text** | Detections are based on specific content, not subjective impression |
| **Zero CRITICAL findings in final scan** | All critical anti-patterns were resolved before proceeding |
| **WARNING disposition log** | Warnings were either fixed or explicitly accepted with documented risk |
| **Baseline inventory (if Step 16.1)** | The project's anti-pattern baseline is established for future regression checks |

The scan report with per-finding detail is the proof artifact. A report that says "scanned 8 specs, found 0 anti-patterns" without showing which patterns were checked against which specs is insufficient — it does not prove thoroughness.
