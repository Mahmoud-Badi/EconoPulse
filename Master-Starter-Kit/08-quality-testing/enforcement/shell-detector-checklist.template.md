# Shell Detector Checklist

> **Feature:** `{{FEATURE_NAME}}`
> **Screen(s):** `{{SCREEN_NAMES}}`
> **Auditor:** `{{AUDITOR_NAME}}`
> **Date:** `{{AUDIT_DATE}}`
> **Verdict:** {{PASS_OR_FAIL}}

---

## Instructions

A "shell" is UI that looks complete but does nothing real. Shells are the most dangerous form of incomplete work because they create the illusion of progress. This checklist detects shells.

**If ANY check fails, the feature is a shell. Do not mark as done.**

Store completed checklists in: `dev_docs/enforcement-proofs/shell-detection/{{FEATURE_NAME}}-shell-check.md`

---

## Category 1: Buttons & Links

| Element | Has Real Handler (not console.log/TODO) | Action Performs Real Work | Pass/Fail | Evidence (file:line) |
|---------|----------------------------------------|--------------------------|-----------|----------------------|
| {{BUTTON_1}} | | | | |
| {{BUTTON_2}} | | | | |
| {{LINK_1}} | | | | |

**Quick check:** Grep for suspicious button handlers:
```bash
grep -rn 'console\.log\|// TODO\|// FIXME\|onClick={() => {}}' --include='*.tsx' --include='*.jsx'
```

**Rule:** Every button must trigger a real action — API call, navigation, state mutation, modal open. `console.log('clicked')` is not a handler.

---

## Category 2: Forms

| Form | Submits to Real Endpoint | Validation on All Fields | Success State Renders | Error State Renders | Pass/Fail |
|------|--------------------------|--------------------------|----------------------|--------------------|-----------|
| {{FORM_1}} | | | | | |
| {{FORM_2}} | | | | | |

**Quick check:** Grep for form submission:
```bash
grep -rn 'onSubmit\|handleSubmit' --include='*.tsx' --include='*.jsx' | grep -v 'test\|spec\|mock'
```

**Rule:** Every form must submit to a real API endpoint. `event.preventDefault()` with no follow-up API call = shell. Validation must cover required fields, format checks, and edge cases. Both success AND error responses must render visible feedback.

---

## Category 3: Data Display

| Component | Loads from API (not hardcoded) | Empty State Renders | Loading State Renders | Error State Renders | Pass/Fail |
|-----------|-------------------------------|--------------------|-----------------------|--------------------|-----------|
| {{TABLE_1}} | | | | | |
| {{LIST_1}} | | | | | |
| {{CARD_GRID_1}} | | | | | |

**Quick check:** Grep for hardcoded data:
```bash
grep -rn 'const.*=.*\[{' --include='*.tsx' --include='*.jsx' | grep -v 'type\|interface\|enum\|test\|spec\|mock'
```

**Rule:** Data must come from an API, not a `const mockData = [...]` at the top of the file. All three states (empty, loading, error) must be implemented and visually verified.

---

## Category 4: Navigation

| Nav Item | Leads to Real Page | Page Has Content (not blank) | Breadcrumbs Work | Back Button Works | Pass/Fail |
|----------|-------------------|------------------------------|-----------------|-------------------|-----------|
| {{NAV_ITEM_1}} | | | | | |
| {{NAV_ITEM_2}} | | | | | |
| {{NAV_ITEM_3}} | | | | | |

**Rule:** Every navigation item must lead to a real, implemented page with real content. A page that loads but shows nothing is dead UI — not an implemented page.

---

## Category 5: State Management

| Element | State Persists on Navigation | State Persists on Refresh | Filter/Sort Retained | Pass/Fail |
|---------|-----------------------------|--------------------------|-----------------------|-----------|
| {{TOGGLE_1}} | | | | |
| {{FILTER_1}} | | | | |
| {{PAGINATION_1}} | | | | |

**Rule:** Toggles must persist their value. Filters must survive navigation (user goes to detail page and comes back — filters still applied). Pagination must work with real data counts.

---

## Category 6: Code Quality Scan

| Search Pattern | Files Found | Count | All Resolved? | Pass/Fail |
|----------------|-------------|-------|---------------|-----------|
| `TODO` | | | | |
| `FIXME` | | | | |
| `console.log` (non-debug) | | | | |
| `placeholder` (in logic, not UI labels) | | | | |
| Hardcoded mock data arrays | | | | |
| `// hack` or `// workaround` | | | | |

**Scan commands:**
```bash
grep -rn 'TODO\|FIXME' --include='*.ts' --include='*.tsx' --include='*.jsx'
grep -rn 'console\.log' --include='*.ts' --include='*.tsx' --include='*.jsx' | grep -v 'logger\|debug'
grep -rn 'mock\|Mock\|MOCK' --include='*.ts' --include='*.tsx' | grep -v 'test\|spec\|__mocks__'
```

**Rule:** Shipped feature code must have ZERO `TODO`/`FIXME` items. `console.log` is for debugging, not production. Mock data belongs in test files, not component files.

---

## Summary

| Category | Items Checked | Passed | Failed | Shell Indicators |
|----------|---------------|--------|--------|-----------------|
| Buttons & Links | | | | |
| Forms | | | | |
| Data Display | | | | |
| Navigation | | | | |
| State Management | | | | |
| Code Quality | | | | |
| **Total** | | | | |

**Gate 4 Verdict:** {{PASS_OR_FAIL}}

**If ANY category has a failure, the feature is a shell.** Shells return to development for real implementation — not for "quick fixes." The gap between a shell and a real implementation is usually larger than it appears.
