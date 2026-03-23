# Responsive Verification Proof

> **Screen:** `{{SCREEN_NAME}}`
> **Feature:** `{{FEATURE_NAME}}`
> **Verified by:** `{{VERIFIER_NAME}}`
> **Date:** `{{VERIFICATION_DATE}}`
> **Verdict:** {{PASS_OR_FAIL}}

---

## Instructions

This document proves a screen is responsive. Every breakpoint section requires a screenshot AND a completed checklist. "It looked fine" is not proof. If ANY breakpoint fails, the screen is NOT responsive and the feature gate blocks.

Store completed proofs in: `dev_docs/enforcement-proofs/responsive/{{SCREEN_NAME}}-responsive.md`

---

## Breakpoint 1: Mobile — 375px

**Screenshot:** `{{SCREENSHOT_PATH_375}}`

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| No horizontal scroll | | |
| Touch targets ≥44x44px | | |
| Text readable without zoom (≥14px) | | |
| Navigation accessible (hamburger/drawer works) | | |
| Forms usable with mobile keyboard (inputs not obscured) | | |
| Images not cropped or overflowing | | |
| Modals/dialogs fit within viewport | | |
| Primary CTA visible without scrolling | | |
| No overlapping elements | | |

**Mobile breakpoint verdict:** {{PASS_OR_FAIL}}

---

## Breakpoint 2: Tablet — 768px

**Screenshot:** `{{SCREENSHOT_PATH_768}}`

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| No horizontal scroll | | |
| Touch targets ≥44x44px | | |
| Text readable without zoom | | |
| Navigation accessible (adapts to tablet layout) | | |
| Forms usable with on-screen keyboard | | |
| Images not cropped or overflowing | | |
| Modals/dialogs fit within viewport | | |
| Grid layout adapts (not just shrunken desktop) | | |
| No overlapping elements | | |

**Tablet breakpoint verdict:** {{PASS_OR_FAIL}}

---

## Breakpoint 3: Laptop — 1024px

**Screenshot:** `{{SCREENSHOT_PATH_1024}}`

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| No horizontal scroll | | |
| Text readable without zoom | | |
| Navigation fully accessible | | |
| Forms usable with keyboard | | |
| Images properly sized | | |
| Modals/dialogs fit within viewport | | |
| Content width appropriate (not stretched edge-to-edge) | | |
| No overlapping elements | | |

**Laptop breakpoint verdict:** {{PASS_OR_FAIL}}

---

## Breakpoint 4: Desktop — 1440px

**Screenshot:** `{{SCREENSHOT_PATH_1440}}`

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| No horizontal scroll | | |
| Text readable without zoom | | |
| Navigation fully accessible | | |
| Forms usable with keyboard | | |
| Images properly sized | | |
| Modals/dialogs fit within viewport | | |
| Content width constrained (max-width applied, not infinitely wide) | | |
| Line length readable (≤75 characters for body text) | | |
| No overlapping elements | | |

**Desktop breakpoint verdict:** {{PASS_OR_FAIL}}

---

## Summary

| Breakpoint | Width | Verdict |
|------------|-------|---------|
| Mobile | 375px | {{PASS_OR_FAIL}} |
| Tablet | 768px | {{PASS_OR_FAIL}} |
| Laptop | 1024px | {{PASS_OR_FAIL}} |
| Desktop | 1440px | {{PASS_OR_FAIL}} |

**Gate 3 Rule:** ALL four breakpoints must pass. ANY single breakpoint failure = screen is NOT responsive. Feature gate blocks until all breakpoints pass.

**Common failure patterns:**
- Tables that overflow on mobile — use horizontal scroll wrapper or card layout
- Fixed-width elements that break small viewports — use relative units
- Modals that exceed viewport height — add internal scroll
- Navigation that disappears on tablet — test the in-between breakpoints
- Forms where the submit button is hidden behind the mobile keyboard — ensure scroll-into-view behavior
