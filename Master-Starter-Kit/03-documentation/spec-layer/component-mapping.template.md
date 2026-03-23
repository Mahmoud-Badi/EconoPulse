# Component Mapping — {{PROJECT_NAME}}

> **Purpose:** Full cross-reference mapping every domain component to its service, screen(s), UI primitive(s), and implementation status.
> **Generated at:** Step 8.1 (Component Catalog)
> **Cross-references:** Component primitive mapping (Step 6/13), screen specs (Step 6), service specs (Step 5)
> **Single source of truth for:** "Where is this component used and how is it built?"

---

## Component Registry

| # | Domain Component | Service | Screen(s) | UI Primitive(s) | Props/Variants | Status |
|---|-----------------|---------|-----------|-----------------|----------------|--------|
| 1 | {{component_name}} | {{service}} | {{screen_1, screen_2}} | {{Card + Badge}} | {{variant: compact, size: sm}} | ☐ Spec'd / ☐ Built / ☐ Tested |
| 2 | {{component_name}} | {{service}} | {{screen_1}} | {{Dialog / Sheet}} | {{responsive: Dialog→Sheet at T1}} | ☐ Spec'd / ☐ Built / ☐ Tested |
| 3 | {{component_name}} | {{service}} | {{screen_1, screen_3}} | {{Table + Pagination}} | {{sortable, filterable}} | ☐ Spec'd / ☐ Built / ☐ Tested |

---

## Components by Service

### {{SERVICE_NAME}}

| Component | Screens Used In | Complexity | Priority |
|-----------|----------------|------------|----------|
| {{component}} | {{screens}} | {{Low/Medium/High}} | {{P1/P2/P3}} |

---

## Components by Screen

### {{SCREEN_NAME}}

| Component | Role on Screen | Props Needed | Data Source |
|-----------|---------------|-------------|------------|
| {{component}} | {{primary action / sidebar / header / list item}} | {{props}} | {{API endpoint or local state}} |

---

## Shared Components (Used in 3+ Screens)

| Component | Screen Count | Screens | Reusable? | Notes |
|-----------|-------------|---------|-----------|-------|
| {{component}} | {{N}} | {{list}} | ☐ Yes — extract to shared | |

> Components used in 3+ screens SHOULD be extracted to a shared component library.

---

## Component Dependency Graph

```
{{SCREEN_NAME}}
├── {{ComponentA}}
│   ├── {{SubComponentA1}} (shared)
│   └── {{SubComponentA2}}
├── {{ComponentB}}
│   └── {{SubComponentB1}} (shared)
└── {{ComponentC}} (shared)
```

---

## Implementation Progress

| Status | Count | Percentage |
|--------|-------|------------|
| Spec'd (not yet built) | {{N}} | {{%}} |
| Built (not yet tested) | {{N}} | {{%}} |
| Tested (ready for use) | {{N}} | {{%}} |
| **Total** | **{{N}}** | **100%** |

---

## Unmapped Components (Action Required)

> Components discovered during development that aren't in this registry.

| Component | Discovered In | Proposed Service | Proposed Primitive | Status |
|-----------|--------------|-----------------|-------------------|--------|
| | | | | ☐ Pending mapping |

**Rule:** Do not implement a component that isn't in this registry. Map it first, then implement.
