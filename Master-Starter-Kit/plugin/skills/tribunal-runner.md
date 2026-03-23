---
name: tribunal-runner
description: Run a full 5-round adversarial tribunal debate on a topic (service quality, architecture decision, feature design). Produces structured verdicts with evidence.
---

# Tribunal Runner

Run a structured 5-round adversarial tribunal debate to rigorously evaluate a claim, decision, or service quality assessment.

## Protocol

### Setup

Identify:
- **Subject:** What is being evaluated (service, decision, design, claim)
- **Evidence:** Relevant code, documentation, metrics, and test results
- **Stakeholders:** What perspectives need to be represented

### Round 1 — Charge Sheet

Present formal charges (issues, concerns, or claims to evaluate):

```markdown
## Charge Sheet

### Charge 1: {Title}
**Claim:** {What is being claimed or challenged}
**Evidence:** {Code reference, metric, or document}
**Severity:** {CRITICAL / HIGH / MEDIUM / LOW}

### Charge 2: ...
```

List all charges before proceeding. Be comprehensive — it's easier to dismiss weak charges than to add missed ones later.

### Round 2 — Prosecution

For each charge, argue why it's serious:

- Present code evidence with file paths and line numbers
- Show impact (what breaks, what's at risk, who's affected)
- Reference standards (security framework, quality gates, anti-pattern registry)
- Quantify where possible (N endpoints unguarded, N% test coverage missing)

### Round 3 — Defense

For each charge, argue mitigating factors:

- Is this an acceptable trade-off for MVP stage?
- Is the "correct" fix actually more risky than the current state?
- Are there compensating controls?
- Is this charge based on incomplete evidence?
- Is the severity overstated?

### Round 4 — Cross-Examination

Challenge weak arguments from BOTH sides:

- Prosecution: "You claimed X is critical, but the actual risk is Y because..."
- Defense: "You claimed this is acceptable for MVP, but similar issues caused Z in production..."
- Request additional evidence where arguments are unsupported
- Identify logical fallacies or emotional reasoning

### Round 5 — Verdict

Issue final verdict:

```markdown
## Verdict: {AFFIRM | MODIFY | REVERSE | DEFER}

### Summary
{One paragraph summarizing the tribunal's conclusion}

### Scores
| Dimension | Score | Notes |
|-----------|-------|-------|
| Hub Accuracy | N/10 | {notes} |
| Code Quality | N/10 | {notes} |
| Security | N/10 | {notes} |
| Test Coverage | N/10 | {notes} |
| **Overall** | **N/10** | |

### Charges Resolved
| Charge | Verdict | Action Required |
|--------|---------|----------------|
| 1: {title} | SUSTAINED / DISMISSED / PARTIALLY SUSTAINED | {specific action} |

### Action Items
1. {Specific, actionable item with file path}
2. ...

### Cross-Cutting Findings
- {Findings that likely affect other services too}

### ADR Candidates
- {Decisions that should be formalized as Architecture Decision Records}
```

## Verdict Definitions

- **AFFIRM:** Hub is accurate, code quality is acceptable. Score ≥ 8/10 on all dimensions.
- **MODIFY:** Corrections needed but fundamentally sound. Specific fixes listed.
- **REVERSE:** Hub is fundamentally inaccurate or code has critical issues. Major rework needed.
- **DEFER:** Cannot be evaluated now due to blockers or missing information.

## Rules

- **Every claim needs evidence** — no "I think" or "probably"
- **Both sides get equal treatment** — don't pre-judge the outcome
- **Be specific** — "auth is weak" is not a charge; "GET /api/users has no auth guard (users.controller.ts:45)" is
- **Cross-examination is mandatory** — skip it and the verdict is just the prosecution's opinion
- **Action items are specific** — file path, what to change, and why
