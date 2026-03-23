# Mobile Component Catalog Generator

**Purpose:** Create a catalog of all mobile UI components needed for the application by
analyzing mobile screen specs, identifying reusable patterns, and classifying components
by sharing potential, platform behavior, and complexity.

**Output:** `dev_docs/mobile-component-catalog.md`

---

## When to Run

Run this generator:

- After the mobile screen catalog is created (by MOBILE-SCREEN-GENERATOR)
- After building new mobile screens to catalog newly created components
- During design system setup (Step 13) to identify shared components

---

## Inputs Required

| Input | Location | What it provides |
| ----- | -------- | ---------------- |
| Mobile screen catalog | `dev_docs/mobile-screen-catalog.md` | All screens and their component needs |
| Mobile screen specs | `dev_docs/specs/screens/mobile-*.md` | Detailed component requirements per screen |
| Web component catalog | `dev_docs/components/_index.md` | Existing web components to evaluate for sharing |
| Mobile design tokens | `15-mobile-ui-design/mobile-design-tokens.md` | Token system for consistency |
| Mobile architecture | `dev_docs/mobile-architecture.md` | Framework, shared code strategy |

---

## Component Classification

For each component, determine:

| Field | Values | Description |
| ----- | ------ | ----------- |
| **Name** | PascalCase name | e.g., "TripCard", "StatusBadge" |
| **Category** | See category table | Component archetype |
| **Scope** | Shared / Mobile-only / Platform-specific | Where can this component live |
| **Platform behavior** | Identical / Adapted / Native-different | How it differs across platforms |
| **Complexity** | S, M, L | Implementation effort |
| **Animations** | None / Simple / Complex | Animation requirements |
| **Native APIs** | List or None | e.g., "Haptics", "Camera" |
| **Accessibility** | Standard / Enhanced | VoiceOver/TalkBack needs |
| **Status** | Done / WIP / Not Built | Current state |

### Component Categories

| Category | Description | Examples |
| -------- | ----------- | -------- |
| **Primitives** | Low-level building blocks | Button, Text, Icon, Spacer, Divider |
| **Layout** | Structural containers | Card, Section, Row, Column, SafeAreaView |
| **Data Display** | Read-only content presentation | Badge, Avatar, KPICard, Timeline, Tag |
| **Forms** | User input components | TextInput, Select, DatePicker, Switch, Checkbox, Slider |
| **Feedback** | Status and loading indicators | Toast, Alert, Skeleton, ProgressBar, Spinner |
| **Navigation** | Navigation-related components | TabBar, Header, BackButton, BottomSheet, ActionSheet |
| **Lists** | List and collection patterns | ListItem, SwipeableRow, SectionHeader, EmptyState |
| **Maps** | Location and map components | MapView, Marker, RouteOverlay, LocationPin |
| **Domain** | Business-specific components | {{PROJECT}}-specific components |

### Scope Classification

| Scope | Definition | File Location |
| ----- | ---------- | ------------- |
| **Shared** | Logic can be shared with web via shared package | `packages/shared/` (types only) |
| **Mobile-shared** | Used across mobile screens, not on web | `apps/mobile/components/ui/` |
| **Feature-specific** | Used only within one feature/service | `apps/mobile/components/{{feature}}/` |
| **Platform-specific** | Different implementation per platform | `apps/mobile/components/platform/` |

---

## Generation Algorithm

1. **Read the mobile screen catalog.** For each screen type, identify the typical components:
   - List screens → FlatList, SearchBar, FilterChips, ListItem, PullToRefresh
   - Detail screens → ScrollView, Tabs, ActionButtons, StatusBadge, KPICard
   - Form screens → TextInput, Select, DatePicker, validation UI, SubmitButton
   - Dashboard screens → KPICard, Chart, ActivityList, StatGrid
   - Map screens → MapView, Markers, UserLocation, RouteOverlay

2. **Read mobile screen specs.** Extract:
   - Explicitly named components from each spec
   - Interaction patterns (swipe actions, long press, haptics)
   - Platform-specific differences noted in specs

3. **Cross-reference with web component catalog.** For each web component:
   - Can the component logic be shared? (validation, data formatting — yes)
   - Can the UI be shared? (almost never — web uses CSS/Tailwind, mobile uses native)
   - Is there a mobile equivalent needed? (Button → yes, DataTable → FlatList instead)

4. **Classify platform behavior:**
   - **Identical:** Same component renders same UI on both platforms (most custom components)
   - **Adapted:** Same component, platform-specific tweaks (press feedback: opacity vs ripple)
   - **Native-different:** Completely different native implementation (DatePicker, ActionSheet)

5. **Calculate statistics** per category and overall.

6. **Write the catalog** in the format below.

---

## Catalog Output Format

Write to `dev_docs/mobile-component-catalog.md`:

```markdown
# Mobile Component Catalog

> **Framework:** {{MOBILE_FRAMEWORK}}
> **Total Components:** {N}
> **Done:** {n} | **WIP:** {n} | **Not Built:** {n}
> **Last Updated:** {date}

---

## Summary by Category

| Category | Total | Done | WIP | Not Built | Notes |
| -------- | ----- | ---- | --- | --------- | ----- |
| Primitives | {n} | {n} | {n} | {n} | |
| Layout | {n} | {n} | {n} | {n} | |
| Data Display | {n} | {n} | {n} | {n} | |
| Forms | {n} | {n} | {n} | {n} | |
| Feedback | {n} | {n} | {n} | {n} | |
| Navigation | {n} | {n} | {n} | {n} | |
| Lists | {n} | {n} | {n} | {n} | |
| Domain | {n} | {n} | {n} | {n} | |
| **Total** | **{N}** | | | | |

---

## Full Component List

### Primitives

| # | Component | Scope | Platform | Complexity | Animations | A11y | Status | Used By |
| - | --------- | ----- | -------- | ---------- | ---------- | ---- | ------ | ------- |
| 1 | Button | Mobile-shared | Adapted | S | Press scale | Standard | Not Built | All screens |

### Forms

| # | Component | Scope | Platform | Complexity | Native API | A11y | Status | Used By |
| - | --------- | ----- | -------- | ---------- | ---------- | ---- | ------ | ------- |
| 1 | TextInput | Mobile-shared | Adapted | M | Keyboard | Enhanced | Not Built | All forms |

{... repeat for all categories ...}

---

## Web ↔ Mobile Component Mapping

| Web Component | Mobile Equivalent | Shared Logic | Notes |
| ------------- | ----------------- | ------------ | ----- |
| DataTable | FlatList + ListItem | Sort/filter logic | Mobile uses infinite scroll |
| Button | Button | Variant types | Different press feedback |
| Modal | BottomSheet | None | Different interaction pattern |
| Select | ActionSheet / Picker | Option types | Platform-native picker |
| DatePicker | DatePicker | Date formatting | Platform-native picker |

---

## Build Priority

Components ordered by dependency (build these first):

| Priority | Component | Reason |
| -------- | --------- | ------ |
| 1 | Button | Used by every screen |
| 2 | TextInput | Used by all forms |
| 3 | ListItem | Used by all list screens |
| 4 | Card | Used by dashboards and detail views |
| 5 | Toast | Used for feedback on all actions |
```

---

## Validation Checklist

After generation, verify:

- [ ] Every component referenced in mobile screen specs appears in the catalog
- [ ] Scope classification is accurate (no UI components marked as "Shared")
- [ ] Platform behavior is documented for each component
- [ ] Accessibility rating reflects actual requirements
- [ ] Build priority reflects actual dependency order
- [ ] Web ↔ Mobile mapping is complete for all web components that have mobile equivalents
- [ ] Summary totals match detailed tables
