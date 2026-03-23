# Feature Map for {{PROJECT_NAME}}

> **Map every product feature to a demo step. Decide what to show, what to skip, and in what order.**
> This document bridges your architecture output and the demo script.

---

## Table of Contents

1. [Feature Inventory](#feature-inventory)
2. [Priority Ranking](#priority-ranking)
3. [Tour Order & Flow Logic](#tour-order--flow-logic)
4. [Interactive vs View-Only Classification](#interactive-vs-view-only-classification)
5. [Feature-to-Persona Mapping](#feature-to-persona-mapping)
6. [Time Allocation per Step](#time-allocation-per-step)
7. [Feature Dependencies](#feature-dependencies)
8. [Sandbox Requirements per Feature](#sandbox-requirements-per-feature)
9. [Feature Grouping](#feature-grouping)
10. [Checklist](#checklist)

---

## Feature Inventory

### Complete Feature List

<!-- Pull this from your architecture output (Step 4) — every screen, service, and user-facing capability. -->

| # | Feature / Screen | Category | User Role(s) | Source Document | In Demo? |
|---|-----------------|----------|-------------|----------------|----------|
| 1 | {{FEATURE_NAME, e.g., "Dashboard overview"}} | {{CATEGORY, e.g., "Core Workflow"}} | {{ROLES, e.g., "All users"}} | {{SOURCE, e.g., "architecture/screens.md"}} | {{YES/NO/PARTIAL}} |
| 2 | {{FEATURE_NAME}} | {{CATEGORY}} | {{ROLES}} | {{SOURCE}} | {{IN_DEMO}} |
| 3 | {{FEATURE_NAME}} | {{CATEGORY}} | {{ROLES}} | {{SOURCE}} | {{IN_DEMO}} |
| 4 | {{FEATURE_NAME}} | {{CATEGORY}} | {{ROLES}} | {{SOURCE}} | {{IN_DEMO}} |
| 5 | {{FEATURE_NAME}} | {{CATEGORY}} | {{ROLES}} | {{SOURCE}} | {{IN_DEMO}} |
| 6 | {{FEATURE_NAME}} | {{CATEGORY}} | {{ROLES}} | {{SOURCE}} | {{IN_DEMO}} |
| 7 | {{FEATURE_NAME}} | {{CATEGORY}} | {{ROLES}} | {{SOURCE}} | {{IN_DEMO}} |
| 8 | {{FEATURE_NAME}} | {{CATEGORY}} | {{ROLES}} | {{SOURCE}} | {{IN_DEMO}} |
| 9 | {{FEATURE_NAME}} | {{CATEGORY}} | {{ROLES}} | {{SOURCE}} | {{IN_DEMO}} |
| 10 | {{FEATURE_NAME}} | {{CATEGORY}} | {{ROLES}} | {{SOURCE}} | {{IN_DEMO}} |

### Feature Coverage Summary

| Metric | Count |
|--------|-------|
| Total product features | {{TOTAL_FEATURES}} |
| Features included in demo | {{INCLUDED_COUNT}} |
| Features partially shown | {{PARTIAL_COUNT}} |
| Features excluded | {{EXCLUDED_COUNT}} |
| **Coverage percentage** | {{COVERAGE_PERCENT}}% |

---

## Priority Ranking

### Must-Show Features

<!-- These are non-negotiable. If the demo does not include these, it fails its objective. -->

| Rank | Feature | Why It's Must-Show | Maps to Value Prop | Demo Impact |
|------|---------|-------------------|-------------------|------------|
| 1 | {{FEATURE}} | {{REASON, e.g., "This is the core differentiator"}} | {{VALUE_PROP_REF}} | {{IMPACT, e.g., "Aha moment"}} |
| 2 | {{FEATURE}} | {{REASON}} | {{VALUE_PROP_REF}} | {{IMPACT}} |
| 3 | {{FEATURE}} | {{REASON}} | {{VALUE_PROP_REF}} | {{IMPACT}} |
| 4 | {{FEATURE}} | {{REASON}} | {{VALUE_PROP_REF}} | {{IMPACT}} |
| 5 | {{FEATURE}} | {{REASON}} | {{VALUE_PROP_REF}} | {{IMPACT}} |

### Nice-to-Have Features

<!-- Include if time allows. Can be shown in free-explore mode only. -->

| Rank | Feature | Why It's Nice-to-Have | Include in Guided? | Free-Explore Only? |
|------|---------|----------------------|-------------------|--------------------|
| 1 | {{FEATURE}} | {{REASON}} | {{YES/NO}} | {{YES/NO}} |
| 2 | {{FEATURE}} | {{REASON}} | {{YES/NO}} | {{YES/NO}} |
| 3 | {{FEATURE}} | {{REASON}} | {{YES/NO}} | {{YES/NO}} |
| 4 | {{FEATURE}} | {{REASON}} | {{YES/NO}} | {{YES/NO}} |

### Skip Features

<!-- Explicitly excluded. Document why so the decision is traceable. -->

| Feature | Reason for Exclusion | Reconsider Trigger |
|---------|---------------------|-------------------|
| {{FEATURE}} | {{REASON, e.g., "Admin-only, not relevant to buyer persona"}} | {{TRIGGER, e.g., "If admin persona becomes a target"}} |
| {{FEATURE}} | {{REASON}} | {{TRIGGER}} |
| {{FEATURE}} | {{REASON}} | {{TRIGGER}} |

---

## Tour Order & Flow Logic

### Guided Tour Step Sequence

<!-- The ordered sequence of steps in guided mode. This is the "happy path" through the product. -->

```
{{FLOW_DIAGRAM, e.g.:
Welcome → Dashboard Overview → Create New [Entity]
  → Configure Settings → View Results → Share/Export
  → End Screen + CTA
}}
```

| Step # | Feature / Screen | Transition From | Transition To | Transition Type | Estimated Duration |
|--------|-----------------|----------------|--------------|----------------|-------------------|
| 1 | {{WELCOME_SCREEN}} | Entry gate | Step 2 | Auto-advance after {{SECONDS}}s | {{SECONDS}}s |
| 2 | {{FEATURE}} | Step 1 | Step 3 | {{TYPE, e.g., "Click target"}} | {{SECONDS}}s |
| 3 | {{FEATURE}} | Step 2 | Step 4 | {{TYPE}} | {{SECONDS}}s |
| 4 | {{FEATURE}} | Step 3 | Step 5 | {{TYPE}} | {{SECONDS}}s |
| 5 | {{FEATURE}} | Step 4 | Step 6 | {{TYPE}} | {{SECONDS}}s |
| 6 | {{FEATURE}} | Step 5 | Step 7 | {{TYPE}} | {{SECONDS}}s |
| 7 | {{FEATURE}} | Step 6 | Step 8 | {{TYPE}} | {{SECONDS}}s |
| 8 | {{FEATURE}} | Step 7 | End screen | {{TYPE}} | {{SECONDS}}s |

### Branching Logic

<!-- IF {{BRANCHING_ENABLED}} -->
| Decision Point | Condition | Branch A (Path) | Branch B (Path) | Default |
|---------------|-----------|-----------------|-----------------|---------|
| {{DECISION_POINT, e.g., "After Step 3"}} | {{CONDITION, e.g., "User clicks 'Analytics'"}} | {{BRANCH_A, e.g., "Steps 4a-4c (Analytics deep-dive)"}} | {{BRANCH_B, e.g., "Step 5 (skip analytics)"}} | {{DEFAULT}} |
| {{DECISION_POINT}} | {{CONDITION}} | {{BRANCH_A}} | {{BRANCH_B}} | {{DEFAULT}} |
<!-- ENDIF -->

### Skip Logic

| Step | Can Be Skipped? | Skip Condition | Skip Destination |
|------|----------------|---------------|-----------------|
| {{STEP_NUMBER}} | {{YES/NO}} | {{CONDITION, e.g., "User clicks 'Skip'"}} | {{DESTINATION, e.g., "Next step"}} |
| {{STEP_NUMBER}} | {{YES/NO}} | {{CONDITION}} | {{DESTINATION}} |

---

## Interactive vs View-Only Classification

### Interaction Types

| Type | Description | User Action | Example |
|------|-----------|-------------|---------|
| **Interactive — Click** | User clicks a real UI element | Click button, link, or menu item | "Click 'Create New Project'" |
| **Interactive — Input** | User types into a field (pre-filled on focus) | Click field, see auto-fill | "Click the search bar to see results" |
| **Interactive — Drag** | User performs a drag action | Drag-and-drop element | "Drag a widget onto the dashboard" |
| **View-Only — Spotlight** | UI area is highlighted, no interaction | Read tooltip, click "Next" | "This panel shows real-time analytics" |
| **View-Only — Animation** | Automated animation plays | Watch, then proceed | "Watch the report auto-generate" |
| **View-Only — Scroll** | Page auto-scrolls to reveal content | Watch scroll, read tooltip | "Scroll reveals the integration options" |

### Per-Step Classification

| Step # | Feature | Interaction Type | User Action Required | Fallback if No Action |
|--------|---------|-----------------|---------------------|----------------------|
| 1 | {{FEATURE}} | {{TYPE}} | {{ACTION}} | {{FALLBACK, e.g., "Auto-advance after 5s"}} |
| 2 | {{FEATURE}} | {{TYPE}} | {{ACTION}} | {{FALLBACK}} |
| 3 | {{FEATURE}} | {{TYPE}} | {{ACTION}} | {{FALLBACK}} |
| 4 | {{FEATURE}} | {{TYPE}} | {{ACTION}} | {{FALLBACK}} |
| 5 | {{FEATURE}} | {{TYPE}} | {{ACTION}} | {{FALLBACK}} |
| 6 | {{FEATURE}} | {{TYPE}} | {{ACTION}} | {{FALLBACK}} |
| 7 | {{FEATURE}} | {{TYPE}} | {{ACTION}} | {{FALLBACK}} |
| 8 | {{FEATURE}} | {{TYPE}} | {{ACTION}} | {{FALLBACK}} |

### Interaction Complexity Budget

| Complexity Level | Max Per Tour | Current Count | Status |
|-----------------|-------------|---------------|--------|
| Interactive — Click | {{MAX, e.g., 8}} | {{CURRENT}} | {{OK/OVER}} |
| Interactive — Input | {{MAX, e.g., 3}} | {{CURRENT}} | {{OK/OVER}} |
| Interactive — Drag | {{MAX, e.g., 1}} | {{CURRENT}} | {{OK/OVER}} |
| View-Only (all types) | {{MAX, e.g., unlimited}} | {{CURRENT}} | OK |

---

## Feature-to-Persona Mapping

### Which Persona Cares About Which Feature

| Feature | {{PERSONA_1}} | {{PERSONA_2}} | {{PERSONA_3}} | Primary Audience |
|---------|--------------|--------------|--------------|-----------------|
| {{FEATURE_1}} | {{HIGH/MEDIUM/LOW/NONE}} | {{INTEREST}} | {{INTEREST}} | {{PRIMARY_PERSONA}} |
| {{FEATURE_2}} | {{INTEREST}} | {{INTEREST}} | {{INTEREST}} | {{PRIMARY_PERSONA}} |
| {{FEATURE_3}} | {{INTEREST}} | {{INTEREST}} | {{INTEREST}} | {{PRIMARY_PERSONA}} |
| {{FEATURE_4}} | {{INTEREST}} | {{INTEREST}} | {{INTEREST}} | {{PRIMARY_PERSONA}} |
| {{FEATURE_5}} | {{INTEREST}} | {{INTEREST}} | {{INTEREST}} | {{PRIMARY_PERSONA}} |
| {{FEATURE_6}} | {{INTEREST}} | {{INTEREST}} | {{INTEREST}} | {{PRIMARY_PERSONA}} |
| {{FEATURE_7}} | {{INTEREST}} | {{INTEREST}} | {{INTEREST}} | {{PRIMARY_PERSONA}} |
| {{FEATURE_8}} | {{INTEREST}} | {{INTEREST}} | {{INTEREST}} | {{PRIMARY_PERSONA}} |

### Persona-Specific Tour Variants

<!-- IF {{PERSONA_SPECIFIC_TOURS}} -->
| Persona | Tour Name | Steps Included | Steps Excluded | Estimated Duration |
|---------|----------|---------------|----------------|-------------------|
| {{PERSONA_1}} | {{TOUR_NAME}} | {{STEPS}} | {{EXCLUDED}} | {{MINUTES}} min |
| {{PERSONA_2}} | {{TOUR_NAME}} | {{STEPS}} | {{EXCLUDED}} | {{MINUTES}} min |
<!-- ENDIF -->

---

## Time Allocation per Step

### Time Budget

| Constraint | Value |
|-----------|-------|
| **Total guided tour target** | {{TOTAL_MINUTES, e.g., 5}} minutes |
| **Maximum steps** | {{MAX_STEPS, e.g., 10}} |
| **Average time per step** | {{AVG_SECONDS, e.g., 30}} seconds |
| **Welcome screen** | {{WELCOME_SECONDS, e.g., 10}} seconds |
| **End screen** | {{END_SECONDS, e.g., 15}} seconds |

### Per-Step Time Allocation

| Step # | Feature | Allocated Time | Tooltip Word Count | Read Time (est.) | Interactive Time | Buffer |
|--------|---------|---------------|-------------------|-----------------|-----------------|--------|
| 1 | {{FEATURE}} | {{SECONDS}}s | {{WORDS}} | {{READ_SECONDS}}s | {{INTERACT_SECONDS}}s | {{BUFFER}}s |
| 2 | {{FEATURE}} | {{SECONDS}}s | {{WORDS}} | {{READ_SECONDS}}s | {{INTERACT_SECONDS}}s | {{BUFFER}}s |
| 3 | {{FEATURE}} | {{SECONDS}}s | {{WORDS}} | {{READ_SECONDS}}s | {{INTERACT_SECONDS}}s | {{BUFFER}}s |
| 4 | {{FEATURE}} | {{SECONDS}}s | {{WORDS}} | {{READ_SECONDS}}s | {{INTERACT_SECONDS}}s | {{BUFFER}}s |
| 5 | {{FEATURE}} | {{SECONDS}}s | {{WORDS}} | {{READ_SECONDS}}s | {{INTERACT_SECONDS}}s | {{BUFFER}}s |
| 6 | {{FEATURE}} | {{SECONDS}}s | {{WORDS}} | {{READ_SECONDS}}s | {{INTERACT_SECONDS}}s | {{BUFFER}}s |
| 7 | {{FEATURE}} | {{SECONDS}}s | {{WORDS}} | {{READ_SECONDS}}s | {{INTERACT_SECONDS}}s | {{BUFFER}}s |
| 8 | {{FEATURE}} | {{SECONDS}}s | {{WORDS}} | {{READ_SECONDS}}s | {{INTERACT_SECONDS}}s | {{BUFFER}}s |
| **Total** | | **{{TOTAL_SECONDS}}s** | **{{TOTAL_WORDS}}** | | | |

### Time Validation

- [ ] Total guided tour duration is within {{TARGET_MINUTES}} minutes
- [ ] No single step exceeds {{MAX_STEP_SECONDS}} seconds
- [ ] Tooltip text averages {{AVG_WORDS}} words or fewer per step
- [ ] Interactive steps have adequate buffer time for slower users

---

## Feature Dependencies

### Dependency Matrix

<!-- What needs to be shown before what. If Feature B references something created in Feature A, Feature A must come first. -->

| Feature | Depends On | Dependency Type | Notes |
|---------|-----------|----------------|-------|
| {{FEATURE_A}} | None | — | Can appear anywhere |
| {{FEATURE_B}} | {{FEATURE_A}} | {{TYPE, e.g., "Data created in A shown in B"}} | {{NOTES}} |
| {{FEATURE_C}} | {{FEATURE_A}}, {{FEATURE_B}} | {{TYPE}} | {{NOTES}} |
| {{FEATURE_D}} | None | — | Can appear anywhere |
| {{FEATURE_E}} | {{FEATURE_C}} | {{TYPE}} | {{NOTES}} |

### Dependency Graph

```
{{DEPENDENCY_GRAPH, e.g.:
[Dashboard] ← independent
[Create Project] → [View Project] → [Share Project]
[Settings] ← independent
[Analytics] → depends on [Create Project] (needs data)
}}
```

### Circular Dependency Check

- [ ] No circular dependencies exist in the step order
- [ ] Every "depends on" feature appears earlier in the tour sequence
- [ ] Free-explore hotspots handle missing context gracefully (tooltip explains what would normally be shown)

---

## Sandbox Requirements per Feature

### Per-Feature Sandbox Needs

| Feature | Seed Data Needed | Mock API Endpoints | UI State Required | Asset Requirements |
|---------|-----------------|-------------------|------------------|--------------------|
| {{FEATURE_1}} | {{SEED_DATA, e.g., "5 sample projects"}} | {{ENDPOINTS, e.g., "GET /projects"}} | {{STATE, e.g., "Logged-in as admin"}} | {{ASSETS, e.g., "Dashboard screenshot"}} |
| {{FEATURE_2}} | {{SEED_DATA}} | {{ENDPOINTS}} | {{STATE}} | {{ASSETS}} |
| {{FEATURE_3}} | {{SEED_DATA}} | {{ENDPOINTS}} | {{STATE}} | {{ASSETS}} |
| {{FEATURE_4}} | {{SEED_DATA}} | {{ENDPOINTS}} | {{STATE}} | {{ASSETS}} |
| {{FEATURE_5}} | {{SEED_DATA}} | {{ENDPOINTS}} | {{STATE}} | {{ASSETS}} |
| {{FEATURE_6}} | {{SEED_DATA}} | {{ENDPOINTS}} | {{STATE}} | {{ASSETS}} |
| {{FEATURE_7}} | {{SEED_DATA}} | {{ENDPOINTS}} | {{STATE}} | {{ASSETS}} |
| {{FEATURE_8}} | {{SEED_DATA}} | {{ENDPOINTS}} | {{STATE}} | {{ASSETS}} |

### Consolidated Sandbox Checklist

- [ ] All seed data entities defined and cross-referenced
- [ ] All mock API endpoints listed (hand off to `sandbox-config.template.md`)
- [ ] All UI states documented (which screens, which user, which data visible)
- [ ] All visual assets identified (screenshots, icons, avatars)
- [ ] No feature requires live backend connectivity

---

## Feature Grouping

### Logical Groups for Free-Explore Mode

<!-- In free-explore mode, features are grouped by category with hotspot beacons. -->

| Group Name | Features Included | Hotspot Count | Group Description (for UI label) |
|-----------|-------------------|---------------|--------------------------------|
| {{GROUP_1, e.g., "Getting Started"}} | {{FEATURES}} | {{COUNT}} | {{DESCRIPTION}} |
| {{GROUP_2, e.g., "Power Features"}} | {{FEATURES}} | {{COUNT}} | {{DESCRIPTION}} |
| {{GROUP_3, e.g., "Collaboration"}} | {{FEATURES}} | {{COUNT}} | {{DESCRIPTION}} |
| {{GROUP_4, e.g., "Analytics & Reporting"}} | {{FEATURES}} | {{COUNT}} | {{DESCRIPTION}} |

---

## Checklist

- [ ] All product features inventoried from architecture documents
- [ ] Every feature classified as Must-Show, Nice-to-Have, or Skip
- [ ] Tour step order defined with transitions
- [ ] Every step classified as Interactive or View-Only
- [ ] Feature-to-persona mapping complete
- [ ] Time budget allocated and validated
- [ ] Feature dependencies mapped — no circular dependencies
- [ ] Sandbox requirements documented per feature
- [ ] Feature groups defined for free-explore mode
- [ ] Total tour duration within target range

---

*This template is part of the Master Starter Kit walkthrough demo system. See `WALKTHROUGH-DEMO-GENERATOR.md` for the generation prompt.*
