# Dead UI Detection Checklist

> **Screen:** `{{SCREEN_NAME}}`
> **Feature:** `{{FEATURE_NAME}}`
> **Auditor:** `{{AUDITOR_NAME}}`
> **Date:** `{{AUDIT_DATE}}`
> **Verdict:** {{PASS_OR_FAIL}}

---

> Dead UI is worse than missing UI — it promises something and delivers nothing.

Store completed checklists in: `dev_docs/enforcement-proofs/dead-ui/{{SCREEN_NAME}}-dead-ui.md`

---

## Category 1: Interactive Element Audit

List EVERY interactive element on the screen. Then verify each one works.

| # | Element | Type (button/link/toggle/dropdown/tab) | Has Working Handler | Action Produces Result | Pass/Fail |
|---|---------|----------------------------------------|--------------------|-----------------------|-----------|
| 1 | {{ELEMENT_1}} | | | | |
| 2 | {{ELEMENT_2}} | | | | |
| 3 | {{ELEMENT_3}} | | | | |
| 4 | {{ELEMENT_4}} | | | | |
| 5 | {{ELEMENT_5}} | | | | |

**Rule:** If you can click it, it must do something real. Every interactive element on this screen must be cataloged in this table. Missing an element from this audit is itself a failure.

---

## Category 2: Navigation Audit

Click every navigation item reachable from this screen.

| Nav Item | Destination | Loads Real Page | Page Has Content | No 404 | No Blank Page | Pass/Fail |
|----------|-------------|----------------|-----------------|--------|---------------|-----------|
| {{NAV_1}} | | | | | | |
| {{NAV_2}} | | | | | | |
| {{NAV_3}} | | | | | | |

**"Coming Soon" check:**

| "Coming Soon" / "Under Construction" Text Found | Has Roadmap Entry | Has Target Date | Pass/Fail |
|-------------------------------------------------|-------------------|----------------|-----------|
| {{COMING_SOON_1}} | | | |

**Rule:** "Coming Soon" without a roadmap entry and target date = dead UI. Either implement it, add it to the roadmap with a real date, or remove it from navigation entirely.

---

## Category 3: Data Audit

| Check | Found? | Location | Pass/Fail |
|-------|--------|----------|-----------|
| Lorem ipsum text in visible UI | | | |
| "John Doe" / "Jane Doe" test data | | | |
| Placeholder images (gray boxes, stock photos marked as placeholder) | | | |
| Hardcoded dates that are in the past | | | |
| Phone numbers or emails that are obviously fake (555-0000, test@test.com) | | | |
| Currency amounts that are clearly test values ($0.00, $999,999.99) | | | |

**Scan command:**
```bash
grep -rni 'lorem ipsum\|john doe\|jane doe\|placeholder\|test@test\|555-\|sample data' --include='*.tsx' --include='*.jsx' --include='*.html'
```

**Rule:** Production screens must show real data patterns. If real data is not available yet, use realistic seed data — not obvious test placeholders.

---

## Category 4: State Audit

| Element | State Changes Persist | Refreshing Retains State (if applicable) | Produces Visible Feedback | Pass/Fail |
|---------|----------------------|------------------------------------------|--------------------------|-----------|
| {{TOGGLE_1}} | | | | |
| {{DROPDOWN_1}} | | | | |
| {{SEARCH_1}} | | | | |
| {{FILTER_1}} | | | | |

**Rule:** A toggle that flips visually but doesn't persist = dead UI. A search bar that accepts input but returns nothing = dead UI. A dropdown with zero options = dead UI.

---

## Category 5: Permission Audit

| Screen Element | Visible to Admin | Visible to Regular User | Correct? | Pass/Fail |
|---------------|-----------------|------------------------|----------|-----------|
| {{ADMIN_CONTROL_1}} | | | | |
| {{ADMIN_CONTROL_2}} | | | | |
| {{USER_ELEMENT_1}} | | | | |

**Rule:** Admin controls visible to regular users (even if disabled) = dead UI for that user. Screens must respect `{{ROLE_PERMISSION_SYSTEM}}` — show only what the user's role can act on.

---

## Summary

| Category | Items Checked | Dead UI Found | Pass/Fail |
|----------|---------------|---------------|-----------|
| Interactive Elements | | | |
| Navigation | | | |
| Data | | | |
| State | | | |
| Permissions | | | |
| **Total** | | | |

**Gate 5 Verdict:** {{PASS_OR_FAIL}}

**Resolution for dead UI items:**
1. **Implement it** — make the element functional
2. **Remove it** — if it's not needed yet, take it out of the UI entirely
3. **Never leave it** — dead UI erodes user trust with every click that does nothing
