# Responsive Design Spec Checklist — Gate 3 Proof Artifact

> **Purpose:** Verifies that the responsive design specification exists, is complete, and covers all screens.
> **Gate:** 3 (Responsive Verification) — Enhanced
> **Trigger:** Feature gates + Step 6.7 completion

---

## Part A: Specification Completeness

- [ ] `dev_docs/foundations/responsive-design-spec.md` exists
- [ ] All 4 breakpoint tiers defined with exact pixel values
- [ ] Component Behavior Matrix filled for ALL component types in the design system
- [ ] At least 5 complex screens have screen-specific responsive breakdowns
- [ ] Industry-specific considerations documented (if applicable)
- [ ] Testing matrix includes ALL screens from the screen catalog

## Part B: Screen Coverage

| Screen Name | Has Responsive Breakdown? | All 4 States Responsive? | Testing Matrix Row? |
|------------|--------------------------|-------------------------|---------------------|
| {{screen_1}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No |
| {{screen_2}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No |

> Add a row for EVERY screen in the screen catalog.

## Part C: Component Pattern Verification

- [ ] Every component in the component catalog has a declared responsive pattern
- [ ] No component defaults to "just shrink it" — every component has an intentional mobile behavior
- [ ] Navigation responsive behavior is documented
- [ ] Data table responsive behavior is documented (overflow, card list, or simplified)
- [ ] Modal/dialog → bottom sheet behavior is documented
- [ ] Form layout changes are documented per breakpoint

## Part D: Screenshot Proof (at Implementation)

> During development, capture screenshots at all 4 breakpoints for each implemented screen.

| Screen | Phone (375px) | Tablet (768px) | Desktop (1280px) | Ultra (1440px) |
|--------|--------------|----------------|------------------|----------------|
| {{screen_1}} | [screenshot] | [screenshot] | [screenshot] | [screenshot] |

---

## Pass Criteria

- ALL Part A checkboxes checked
- ALL screens in Part B have "Yes" for all 3 columns
- ALL Part C checkboxes checked
- Part D: filled during implementation (not during planning)

**If any check fails:** Return to Step 6.7 and fill the gaps before proceeding.
