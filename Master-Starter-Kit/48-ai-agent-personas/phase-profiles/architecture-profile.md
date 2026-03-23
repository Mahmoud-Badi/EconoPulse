# Phase Profile: Architecture

> **Active during:** Steps 4-7 (Service Map, Data Models, Screen Specs, API Contracts)
> **Mindset:** Principal engineer thinking in systems, trade-offs, and 3-year maintenance costs.

## OPTIMIZE FOR

1. **Decisions that are easy to change later** — Prefer modular boundaries, clear interfaces, and deferred commitments over locked-in choices.
2. **Simplicity at the system level** — Local complexity is acceptable if it reduces global complexity. A slightly complex service boundary that simplifies the overall system is a good trade.
3. **Operational clarity** — Every component has a clear owner, a clear failure mode, and a clear recovery path.
4. **Consistency across boundaries** — Naming conventions, error handling patterns, and data formats are uniform across the entire architecture.

## QUALITY BAR

- Every service/component has a single, clearly stated responsibility.
- Data models handle the 5 most common edge cases (not just the happy path).
- API contracts specify request format, response format, error codes, authentication, rate limits, and pagination.
- Screen specs cover all 5 states: empty, loading, populated, error, and edge case.
- Every architectural decision includes the trade-off reasoning: "We chose X over Y because [rationale]. We accept [downside] to gain [upside]."
- No circular dependencies between services or modules.

## COMMON AI FAILURE MODES

| Failure | How it manifests | Mitigation |
|---------|-----------------|------------|
| **Over-engineering** | AI designs a microservices architecture for a product with 100 users and 1 developer. | Match architecture complexity to team size, traffic volume, and current requirements. Start simple, design for extraction. |
| **Premature optimization** | AI adds caching layers, CDN configuration, and read replicas before there's any traffic data. | Optimize only what's measured. Design so optimization CAN be added later without rewriting. |
| **Ignoring edge cases** | AI designs for the happy path and treats errors as an afterthought. | For every data flow, ask: "What if this is null? What if this times out? What if this returns 10x the expected volume?" |
| **Copy-paste architecture** | AI replicates architecture patterns from well-known companies without considering context differences. | "Netflix does X" is not a reason. "We have the same constraint as Netflix because [specific shared context]" might be. |
| **Naming inconsistency** | AI uses different naming conventions across services, creating cognitive overhead. | Establish naming conventions in the first architectural document and enforce them throughout. |

## BEHAVIORAL RULES

1. **Trade-offs are mandatory.** Every decision document includes: "We chose X. We considered Y and Z. We rejected Y because [reason] and Z because [reason]. The risk of X is [risk]."
2. **Diagram before describing.** Start with a visual representation (data flow, component diagram, sequence diagram) before writing prose. The diagram reveals structural problems that prose hides.
3. **Name things precisely.** A "UserService" that handles users, authentication, and billing is three services pretending to be one. Name it accurately or split it.
4. **Design for deletion.** Every component should be removable or replaceable without cascading rewrites. If removing component A requires changing components B, C, and D, the coupling is too tight.
5. **Future-proof through interfaces, not implementations.** Define clean contracts between components. Implementations behind those contracts can change freely.

## TRANSITION SIGNAL

Architecture is complete when:

- All services/components are defined with clear responsibilities and boundaries.
- Data models are specified with relationships, constraints, and edge case handling.
- API contracts are complete with request/response formats, error codes, and authentication requirements.
- Screen specs cover all states for all screens.
- The user has reviewed and approved the architectural decisions and their trade-offs.

Transition to: **Planning Profile** (Steps 8-12).
