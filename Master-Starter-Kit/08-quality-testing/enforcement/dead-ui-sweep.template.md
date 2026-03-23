# Dead UI Sweep — Gate 14 Proof Artifact

> **Purpose:** Full-codebase scan for non-functional UI elements: ghost routes, stub buttons, "Coming Soon" features, and dead feature domains.
> **Gate:** 14 (Dead UI Sweep)
> **Trigger:** After Step 7 (Codebase Audit) for existing apps / repurpose / enhance projects
> **Script:** `bash scripts/dead-ui-sweep.sh [project_root]`

---

## Category 1: Ghost Routes

Routes that are defined in navigation/routing but have no implemented page or render empty content.

| Route Path | Has page.tsx? | Has Content? | Navigation Link Exists? | Action |
|-----------|--------------|-------------|------------------------|--------|
| {{route}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Remove / ☐ Implement / ☐ Redirect |

- [ ] **Zero ghost routes** — every route has an implemented page with real content

---

## Category 2: Stub Buttons & Actions

Interactive elements (buttons, links, menu items) that exist in the UI but do nothing when clicked.

| Element | Location (Screen) | Current Behavior | Action |
|---------|------------------|-----------------|--------|
| {{button/link}} | {{screen name}} | ☐ Empty handler / ☐ Console.log / ☐ Alert("TODO") / ☐ Disabled | ☐ Remove / ☐ Implement |

- [ ] **Zero stub buttons** — every interactive element has a working handler

---

## Category 3: "Coming Soon" / Placeholder Content

Features or sections that display placeholder text instead of functionality.

| Element | Text Displayed | Location | In Scope for MVP? | Action |
|---------|---------------|----------|-------------------|--------|
| {{element}} | {{text}} | {{screen}} | ☐ Yes / ☐ No | ☐ Remove / ☐ Implement / ☐ Hide |

Common patterns to search for:
- "Coming Soon"
- "Under Construction"
- "Coming in a future update"
- "This feature is not yet available"
- "Placeholder"
- "Lorem ipsum"

- [ ] **Zero visible placeholders** — either implement the feature or remove the UI element entirely

---

## Category 4: Dead Feature Domains

Entire feature areas that exist in the codebase but are non-functional, deprecated, or irrelevant to the current product.

| Feature Domain | Files/Directories | Why It's Dead | Action |
|---------------|-------------------|---------------|--------|
| {{feature}} | {{paths}} | ☐ Deprecated / ☐ Wrong vertical / ☐ Abandoned / ☐ Never implemented | ☐ Remove / ☐ Revive / ☐ Archive |

- [ ] **Zero dead feature domains** — remove or implement all feature code

---

## Category 5: Commented-Out Features

Significant blocks of commented-out code that suggest abandoned features.

| File | Lines | What Was Commented Out | Action |
|------|-------|----------------------|--------|
| {{file}} | {{line range}} | {{description}} | ☐ Remove / ☐ Uncomment + fix / ☐ Convert to issue |

- [ ] **No commented-out feature blocks** (individual lines are acceptable, entire features are not)

---

## Summary

| Category | Items Found | Items Resolved | Remaining |
|----------|------------|----------------|-----------|
| Ghost Routes | {{N}} | {{N}} | {{N}} |
| Stub Buttons | {{N}} | {{N}} | {{N}} |
| Placeholders | {{N}} | {{N}} | {{N}} |
| Dead Domains | {{N}} | {{N}} | {{N}} |
| Commented Features | {{N}} | {{N}} | {{N}} |
| **Total** | **{{N}}** | **{{N}}** | **{{N}}** |

## Pass Criteria

- [ ] Zero unresolved items across all 5 categories
- [ ] Every "Remove" action has been executed
- [ ] Every "Implement" action has a task file created
- [ ] `scripts/dead-ui-sweep.sh` outputs zero findings

**If any unresolved items remain:** Do not proceed past the codebase audit step.
