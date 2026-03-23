# Screen User-Completeness Verification

> **Screen:** `{{SCREEN_NAME}}`
> **Primary Persona:** `{{PERSONA_NAME}}`
> **Primary Goal:** `{{SCREEN_PRIMARY_GOAL}}`
> **Auditor:** `{{AUDITOR_NAME}}`
> **Date:** `{{AUDIT_DATE}}`
> **Verdict:** {{PASS_OR_FAIL}}

---

> A screen that shows data but doesn't help the user ACT on it is incomplete.

Store completed checklists in: `dev_docs/enforcement-proofs/screen-completeness/{{SCREEN_NAME}}-completeness.md`

---

## 1. Goal Achievement

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| User can accomplish their primary goal without leaving this screen | | |
| Primary CTA is visually prominent and clearly labeled | | |
| Goal completion path requires ≤3 clicks from screen entry | | |
| Success state is clearly communicated after goal completion | | |

**Question to answer:** If a user lands on this screen knowing what they want to do, can they do it here? If they have to navigate elsewhere to complete the action, the screen is incomplete.

---

## 2. Information Sufficiency

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| All data needed for decision-making is visible (not hidden behind clicks) | | |
| Data labels are clear (no jargon, no abbreviations without tooltips) | | |
| Numeric data has context (units, comparisons, trends — not just raw numbers) | | |
| Related data is grouped logically | | |
| No critical information requires scrolling past the fold | | |

**Question to answer:** Does the user have everything they need to make a decision, or are they guessing because half the context is on another screen?

---

## 3. Error Recovery

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| Destructive actions have confirmation dialogs | | |
| Undo is available for reversible actions | | |
| Error messages explain WHAT went wrong | | |
| Error messages explain HOW to fix it | | |
| Form validation shows errors inline (not just a banner) | | |
| Network errors show retry option | | |

**Question to answer:** When something goes wrong, does the user know what happened and what to do next? "Error occurred" is not an error message — it is an abdication of responsibility.

---

## 4. Discoverability

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| Screen reachable from main navigation | | |
| Screen reachable from related screens (contextual links) | | |
| Breadcrumbs show location in app hierarchy | | |
| Page title/heading clearly describes screen purpose | | |

**Question to answer:** Can the user find this screen without being given a direct link? Can they find it again after their first visit?

---

## 5. Empty State

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| Empty state has a clear message (not just "No data") | | |
| Empty state explains WHY there's no data | | |
| Empty state has a CTA guiding user to create/add first item | | |
| Empty state illustration/icon provides visual context | | |

**Question to answer:** A first-time user arrives at this screen with no data. Do they know what this screen is for and what to do first? "No records found" teaches them nothing.

---

## 6. Progressive Disclosure

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| Primary features visible by default | | |
| Advanced features accessible but not overwhelming (expandable sections, "Advanced" link) | | |
| Settings/configuration separated from daily-use workflows | | |
| Help text available for complex features (tooltips, inline help) | | |

**Question to answer:** Does a new user feel overwhelmed? Does a power user feel limited? Progressive disclosure serves both.

---

## 7. Feedback

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| Every action gives visible feedback (toast, indicator, state change) | | |
| Loading states show during async operations (skeleton, spinner, progress bar) | | |
| Success confirmations appear after form submissions | | |
| Optimistic updates revert on failure with explanation | | |
| Long operations show progress (not just a spinner for 30 seconds) | | |

**Question to answer:** After the user clicks a button, do they know something happened? Silence after action = anxiety.

---

## 8. Keyboard Navigation

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| All interactive elements reachable via Tab key | | |
| Tab order follows logical reading order (left→right, top→bottom) | | |
| Focus indicators visible on all interactive elements | | |
| Escape key closes modals/dropdowns | | |
| Enter key activates focused buttons/links | | |
| No keyboard traps (focus stuck in a component) | | |

---

## 9. Accessibility

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| Page has landmark regions (nav, main, aside, footer) | | |
| Headings follow hierarchical order (h1 → h2 → h3, no skips) | | |
| Images have descriptive alt text | | |
| Form inputs have associated labels | | |
| ARIA labels on icon-only buttons | | |
| Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text) | | |
| Dynamic content changes announced to screen readers (aria-live regions) | | |

---

## Summary

| Section | Checks | Passed | Failed | Severity of Failures |
|---------|--------|--------|--------|---------------------|
| Goal Achievement | 4 | | | |
| Information Sufficiency | 5 | | | |
| Error Recovery | 6 | | | |
| Discoverability | 4 | | | |
| Empty State | 4 | | | |
| Progressive Disclosure | 4 | | | |
| Feedback | 5 | | | |
| Keyboard Navigation | 6 | | | |
| Accessibility | 7 | | | |
| **Total** | **45** | | | |

**Gate 7 Severity Scale:**
- **Critical:** User cannot accomplish primary goal — blocks implementation
- **Major:** User can accomplish goal but with significant friction — must fix before feature gate
- **Minor:** Polish issue that doesn't block workflows — fix before launch

**Gate 7 Verdict:** {{PASS_OR_FAIL}}
