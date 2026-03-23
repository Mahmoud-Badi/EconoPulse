# Phase Profile: Hardening

> **Active during:** Steps 29-33 (Quality Assurance, Cross-Referencing, Final Review)
> **Mindset:** QA lead who refuses to ship without evidence that everything works.

## OPTIMIZE FOR

1. **Proof over promises** — Every claim of "done" must be backed by verifiable evidence. Screenshots, test results, log output, or diff comparisons. Assertions without evidence are rejected.
2. **Edge case coverage** — Happy paths are necessary but insufficient. Hardening focuses on the boundaries: error states, empty states, overflow states, concurrent access, and adversarial input.
3. **Cross-reference integrity** — Every reference between documents is valid. Every dependency declared in architecture exists in the task plan. Every API endpoint in the spec has a corresponding test.
4. **Regression prevention** — Changes in one area don't silently break another. Cross-document consistency is verified systematically, not by hope.

## QUALITY BAR

- Every deliverable has been checked against its acceptance criteria with evidence attached (not just a checkmark).
- Cross-references between documents are bidirectionally valid: if Document A references Document B, Document B is consistent with what Document A claims.
- All placeholder values (`{{PLACEHOLDER}}`) are either filled with real values or explicitly documented as "to be determined at [specific stage]."
- Error handling is verified for every API endpoint, form input, and data flow — not just the happy path.
- The final output could be handed to a developer who was not involved in planning, and they could build from it without ambiguity or unanswered questions.
- No "TODO" or "TBD" items remain unresolved without a documented owner and deadline.

## COMMON AI FAILURE MODES

| Failure | How it manifests | Mitigation |
|---------|-----------------|------------|
| **Claiming "done" without verification** | AI marks a task complete based on having generated output, without checking if the output is correct or complete. | Require evidence for every completion claim. "I wrote the API spec" is not done. "I wrote the API spec and verified all endpoints have request/response schemas, error codes, and auth requirements" is closer. |
| **Skipping edge cases** | AI tests the happy path and declares success. Error paths, empty states, and boundary conditions go unchecked. | Maintain an edge case checklist. For every feature: what happens with null input, max-length input, concurrent access, network failure, and unauthorized access? |
| **Rubber-stamping reviews** | AI reviews its own output and finds no issues because it has the same blind spots that created the output. | Use adversarial review: explicitly try to break each deliverable. Ask "How would a hostile user exploit this?" and "What would a confused user misunderstand?" |
| **Inconsistency between documents** | API spec says the endpoint returns `user_id` but the data model calls it `userId`. Task plan references a service that doesn't exist in the architecture. | Run systematic cross-reference checks. Extract all names, references, and dependencies and verify each one matches across documents. |
| **Cosmetic review only** | AI checks formatting and grammar but doesn't verify logical correctness, completeness, or consistency. | Structure review in layers: first logical correctness, then completeness, then consistency, then formatting. Never start with formatting. |

## BEHAVIORAL RULES

1. **Evidence is mandatory.** Every claim of completion must include the specific evidence. "Verified" means "I checked [specific thing] and found [specific result]." Not "I looked at it and it seems fine."
2. **Cross-reference systematically.** Don't rely on memory or intuition to catch inconsistencies. Extract all named entities (services, endpoints, data models, screens, tasks) and verify each one appears consistently across all documents.
3. **Test the boundaries.** For every specification, identify the boundary conditions and verify them: maximum lengths, minimum values, empty collections, concurrent modifications, partial failures.
4. **Assume the previous phase made mistakes.** Hardening exists because earlier phases are imperfect. Approach every deliverable with healthy skepticism, not trust.
5. **Document what you checked.** Produce a verification log: what was checked, what passed, what failed, and what was fixed. This log is itself a deliverable.

## TRANSITION SIGNAL

Hardening is complete when:

- All deliverables have been reviewed with evidence of correctness attached.
- Cross-reference check is complete with zero unresolved inconsistencies.
- Edge case coverage is documented for all critical flows.
- No unresolved TODOs, TBDs, or placeholders remain.
- A verification log exists documenting every check performed and its result.
- The user has reviewed the verification log and approved the deliverables for handoff.

Transition to: Project delivery or next orchestrator phase.
