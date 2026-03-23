# Depth Scoring

## What It Is

A quantitative and qualitative scoring system that measures whether specs produced by the kit meet the minimum depth thresholds required for reliable implementation. Depth scoring goes beyond field presence (that is the Spec Completeness Audit's job) and evaluates field quality — the difference between a spec that technically has an "error scenarios" section containing one sentence versus a spec where that section enumerates 8 specific failure modes with error codes, user-facing messages, and recovery actions. The scoring system produces a numeric score (0-10 per spec) and a set of qualitative flags that determine whether the spec can proceed or must be reworked.

---

## What It Catches

- **Specs that pass the completeness audit but lack real depth** — All 14 fields are "filled" but most contain a single sentence where a paragraph is needed
- **Padding versus substance** — A spec with 2,000 words that says less than a well-written 500-word spec. Word count is not depth.
- **Missing specificity gradient** — Business rules described at the category level ("validate dates") instead of the instance level ("departure date must be today or future, arrival date must be after departure date, date range cannot exceed 365 days")
- **Untestable requirements** — "The system should be fast" (untestable) versus "API response time < 200ms at p95 for list endpoints with up to 1,000 records" (testable)
- **Inconsistent depth across specs** — 3 specs at 9/10 and 5 specs at 4/10, indicating the author got fatigued or rushed through later specs

---

## When It's Required

Depth scoring runs immediately after the Spec Completeness Audit passes. A spec can be field-complete but depth-deficient.

| Orchestrator Step | Scoring Target | Minimum Passing Score |
|-------------------|---------------|----------------------|
| After Step 4 | Service specs | ≥ 8/10 quantitative, ≥ 1/2 qualitative |
| After Step 6 | Screen specs | ≥ 7/10 quantitative, ≥ 1/2 qualitative |
| After Step 8 | Any spec reworked during task generation | Original threshold still met |

The threshold difference (8 vs. 7) reflects that service specs are the foundation — every downstream artifact depends on their precision. Screen specs have more room for developer interpretation on visual details.

---

## How To Run

### Step 1: Quantitative Scoring (0-10 per spec)

Score each spec dimension on a 0-10 scale, then compute the weighted total:

#### Service Spec Scoring Rubric

| Dimension | Weight | 9-10 | 7-8 | 5-6 | 3-4 | 0-2 |
|-----------|--------|------|-----|-----|-----|-----|
| **Business Rules** | 25% | 8+ specific, testable rules with exact values and boundaries | 5-7 rules, mostly specific, 1-2 vague | 3-4 rules present, mix of specific and generic | 1-2 rules, mostly generic ("validate input") | No rules or only platitudes |
| **Error Scenarios** | 20% | 8+ enumerated errors with codes, messages, and recovery actions | 5-7 errors, most have codes and messages | 3-4 errors, some missing codes or messages | 1-2 errors, generic descriptions | No error scenarios |
| **Entity Detail** | 20% | Every field: type, constraints, required/optional, default, example value | Every field has type and constraints, some missing examples | Fields listed with types, constraints sparse | Field names only, no types or constraints | No entity definitions |
| **API Completeness** | 15% | All endpoints: method, path, full request/response schema, auth, errors | All endpoints with method and path, schemas mostly complete | Endpoints listed but schemas incomplete | Endpoint names only | No API definition |
| **Edge Cases** | 10% | 5+ edge cases with expected behavior, covering timing, concurrency, boundaries | 3-4 edge cases with behavior described | 1-2 edge cases mentioned | Edge cases mentioned generically ("handle edge cases") | No edge cases |
| **Dependencies & Context** | 10% | All dependencies named with interaction pattern; business context is clear and specific | Dependencies listed, context present but could be more specific | Some dependencies noted, context is generic | Minimal dependency info, no context | No dependencies or context |

**Calculation:**
```
Score = (BusinessRules × 0.25) + (ErrorScenarios × 0.20) + (EntityDetail × 0.20)
      + (APICompleteness × 0.15) + (EdgeCases × 0.10) + (Dependencies × 0.10)
```

#### Screen Spec Scoring Rubric

| Dimension | Weight | 9-10 | 7-8 | 5-6 | 3-4 | 0-2 |
|-----------|--------|------|-----|-----|-----|-----|
| **UI States** | 25% | All 4 states (loading, error, empty, data) with specific content descriptions, exact copy, and visual behavior | All 4 states present with reasonable detail | 2-3 states described | Only data state described | No state definitions |
| **Interactions** | 20% | Every clickable element documented: trigger, action, feedback, error case | Most interactions documented, some missing error cases | Key interactions listed, detail sparse | A few interactions mentioned | No interaction definitions |
| **Data Mapping** | 20% | Every UI element mapped to a specific API field/endpoint with transformation logic | Most elements mapped to APIs, some transformations missing | General API references, no field-level mapping | API mentioned in passing | No data mapping |
| **Form Behavior** | 15% | Per-field validation rules, submission flow, loading/success/error states, optimistic updates | Validation rules per field, submission flow described | General validation mentioned, submission flow vague | "Form validates input" | No form behavior (if applicable: N/A) |
| **Responsiveness** | 10% | Per-breakpoint layout changes documented: what moves, what hides, what stacks | Key breakpoint changes noted | "Responsive" mentioned with 1-2 specifics | "Mobile-friendly" | No responsive detail |
| **Accessibility** | 10% | Keyboard flow documented, ARIA requirements per component, focus management | Some ARIA and keyboard notes | "Accessible" mentioned | Nothing specific | No accessibility detail |

### Step 2: Qualitative Scoring (pass/fail on 2 criteria)

In addition to the quantitative score, each spec must pass at least 1 of 2 qualitative criteria:

**Criterion Q1: The "Cold Read" Test**
Give the spec to someone unfamiliar with the project. Can they describe what the feature does, who uses it, and how it behaves in edge cases — without asking any questions? If yes, Q1 passes. If they need to ask even one clarifying question about behavior (not implementation), Q1 fails.

**Criterion Q2: The "Test Generation" Test**
Can you generate meaningful test case descriptions directly from the spec's business rules and error scenarios? If each business rule maps to at least one test assertion, Q2 passes. If you read a rule and cannot formulate a test for it ("validate input" — test what exactly?), Q2 fails.

Minimum requirement: ≥ 1/2 qualitative criteria must pass.

### Step 3: Score each spec and record results

```markdown
## Depth Scoring Report

| Spec Name | Type | Quant. Score | Q1 (Cold Read) | Q2 (Test Gen) | Status |
|-----------|------|-------------|-----------------|---------------|--------|
| auth-service | Service | 8.4 | PASS | PASS | PASS |
| trip-service | Service | 6.2 | FAIL | FAIL | FAIL — rework |
| login-screen | Screen | 7.8 | PASS | PASS | PASS |
| trip-list-screen | Screen | 5.5 | FAIL | PASS | FAIL — rework |
```

### Step 4: Improve failing specs

For each spec below threshold, identify exactly which dimensions drag the score down and what specific content must be added.

**Example improvement path (5/10 → 8/10 for a service spec):**

| Dimension | Before (5/10) | After (8/10) | What Changed |
|-----------|--------------|-------------|-------------|
| Business Rules | "Validate trip dates" and "Check driver availability" | 7 specific rules: "Departure date ≥ today; arrival > departure; range ≤ 365 days; driver must have status=active; driver must not have overlapping trip in same time window (±30 min buffer); load weight ≤ vehicle capacity; route distance ≤ driver's max range setting" | Generic → specific with exact values |
| Error Scenarios | "Show error if trip creation fails" | 6 enumerated: invalid dates (422, specific message), driver unavailable (409, message + suggested alternatives), weight exceeded (422, show limit vs. actual), duplicate trip (409, link to existing), driver on break (409, show next available time), rate limit exceeded (429, retry-after header) | One generic error → 6 specific with codes and UX |
| Edge Cases | None | Timezone boundary (trip crosses DST), midnight booking (date boundary), driver at exactly max capacity (boundary), simultaneous booking by two dispatchers (concurrency) | Zero → 4 real edge cases with expected behavior |

---

## Checklist

### Per-Spec Scoring Checklist
- [ ] Quantitative score calculated using the appropriate rubric (service or screen)
- [ ] Each dimension scored individually with justification notes
- [ ] Qualitative Criterion Q1 (Cold Read) evaluated
- [ ] Qualitative Criterion Q2 (Test Generation) evaluated
- [ ] Spec meets minimum threshold (service ≥ 8/10, screen ≥ 7/10)
- [ ] Spec passes ≥ 1/2 qualitative criteria
- [ ] If failing: specific improvement actions documented per dimension
- [ ] If reworked: re-scored and confirmed meeting threshold

### Batch-Level Checklist
- [ ] All specs in scope have been scored
- [ ] No spec is more than 2 points below the average (consistency check)
- [ ] Failing specs have remediation plans with specific content additions
- [ ] Re-scored specs after rework all meet thresholds
- [ ] Scoring report is complete and archived

---

## Common Failures

### 1. The Consistently Mediocre Batch
All 8 service specs score between 5.5 and 6.5. None are terrible, none are good. This happens when the author (human or AI) hits a rhythm of "good enough" without ever pushing to genuine depth. The fix: identify the highest-scoring spec, use it as the benchmark, and require all others to match its quality per dimension.

### 2. The Front-Loaded Spec
The first 3 dimensions (business rules, error scenarios, entity detail) are excellent — 9/10 each. The last 3 dimensions (API, edge cases, dependencies) are 3/10 each. The author ran out of energy or context window. Total score: 6.8, just below threshold. The fix is targeted — only the weak dimensions need rework, not the entire spec.

### 3. The Word-Count Illusion
A spec has 3,000 words but scores 5/10. How? Every dimension has lengthy prose that restates the same information in multiple ways without adding specificity. The business rules section is 500 words but only contains 2 actual rules surrounded by context-setting paragraphs. Depth is measured by specific, testable assertions per dimension — not by word count.

### 4. The Missing Qualitative Despite Passing Quantitative
A spec scores 8.2/10 quantitatively but fails both qualitative criteria. This happens when the content is specific but poorly organized — a developer cannot find what they need without reading the entire spec multiple times. The fix is structural: better headings, tables instead of prose for rules, and a summary section at the top.

### 5. The Threshold Gaming Spec
A spec scores exactly 8.0/10 by having every dimension at exactly 8 — no highs, no lows. This suggests the author wrote to the rubric minimum rather than writing what the feature actually needs. Some features require 10/10 error scenarios (payment processing) and can tolerate 6/10 edge cases. Uniform scores across all dimensions are a smell.

---

## Proof Artifact

| Artifact | What It Proves |
|----------|---------------|
| **Per-spec scoring breakdown** | Every dimension was individually evaluated, not just an overall impression |
| **Qualitative test results** | Both the Cold Read and Test Generation criteria were explicitly evaluated |
| **Improvement path documentation** | Failing specs received specific, actionable feedback (not "needs more depth") |
| **Before/after scores for reworked specs** | Rework actually improved the score, not just added filler |
| **Final scoring report with all specs ≥ threshold** | Every spec meets the minimum before proceeding |

The scoring report is the proof. It must show per-dimension scores, qualitative pass/fail, and for any reworked spec, the before and after comparison. A report that only shows final scores without the dimension breakdown is insufficient — it does not prove the scoring was rigorous.
