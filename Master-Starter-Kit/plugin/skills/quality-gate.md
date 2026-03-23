---
name: quality-gate
description: Run quality gate checks on a page or component using the 6-dimension weighted scoring rubric. Determines if work meets MVP, production, or protection thresholds.
---

# Quality Gate

Evaluate a page or component against the 6-dimension quality scoring rubric.

## Protocol

### 1. Identify Target

Determine what to evaluate:
- A specific page/route
- A specific component
- A service module

### 2. Read the Code

Read the target file(s) and assess each dimension:

### 3. Score Each Dimension

| Dimension | Weight | What to Check | Score (0-10) |
|-----------|--------|---------------|--------------|
| **Functionality** | 30% | Does it work? All features implemented? Edge cases handled? | |
| **Data Integration** | 20% | Real API data? Proper hooks? Error handling? Pagination? | |
| **UI/UX Quality** | 20% | Responsive? Accessible? Consistent with design system? Loading states? | |
| **State Management** | 15% | All 4 states (loading/empty/error/populated)? No unnecessary re-renders? | |
| **Accessibility** | 10% | Keyboard navigation? ARIA labels? Screen reader compatible? Color contrast? | |
| **Code Quality** | 5% | TypeScript strict? No anti-patterns? Clean imports? No dead code? | |

### 4. Calculate Weighted Score

```
Score = (Func × 0.30) + (Data × 0.20) + (UI × 0.20) + (State × 0.15) + (A11y × 0.10) + (Code × 0.05)
```

### 5. Determine Gate

| Threshold | Score | Meaning |
|-----------|-------|---------|
| **Below MVP** | < 6.0 | Not ready — critical gaps remain |
| **MVP Ready** | ≥ 6.0 | Minimum viable — functional but rough |
| **Production Ready** | ≥ 8.0 | Solid — can ship to real users |
| **Protection Eligible** | ≥ 8.0 + no bugs + tests exist | Add to protection list |

### 6. Report

```markdown
## Quality Gate Report: {target name}

### Scores
| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Functionality | 30% | N/10 | N.NN |
| Data Integration | 20% | N/10 | N.NN |
| UI/UX Quality | 20% | N/10 | N.NN |
| State Management | 15% | N/10 | N.NN |
| Accessibility | 10% | N/10 | N.NN |
| Code Quality | 5% | N/10 | N.NN |
| **TOTAL** | **100%** | | **N.NN / 10** |

### Gate: {MVP READY | PRODUCTION READY | BELOW MVP}

### Strengths
- {What's working well}

### Gaps (what to fix for next gate)
1. {Specific issue with file:line reference}
2. {Specific issue}

### Recommendation
{PROTECT / SHIP / FIX-THEN-SHIP / REWORK}
```

### 7. Definition of Done Checklist

If the score is ≥ 6.0, also run the 10-point Definition of Done:

- [ ] All acceptance criteria from task file met
- [ ] All 4 UI states handled
- [ ] Real API data (no mocks in production code)
- [ ] TypeScript strict — no `any` types
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading and error states tested
- [ ] No console errors or warnings
- [ ] Accessibility basics (keyboard nav, ARIA labels)
- [ ] Tests exist and pass
- [ ] Hub file updated with new endpoints/components

## Rules

- **Evidence-based scoring** — every score must reference specific code
- **Don't inflate scores** — a page with no tests gets 0/10 on Code Quality, not 5/10
- **Be constructive** — gaps section should tell the developer exactly what to fix
- **Protection recommendation** — only if score ≥ 8.0 AND no known bugs AND tests exist
