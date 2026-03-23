# Screen Catalog Generator

**Purpose:** Create a master catalog of all screens in the application by reading
service specs and hub files, then consolidating into a single navigable document
with summary statistics.

**Output:** `dev_docs/specs/screen-catalog.md`

---

## When to Run

Run this generator:

- After service hub files are created (by SERVICE-HUB-GENERATOR)
- After adding new screens to the application
- At sprint planning to identify which screens remain to be built

---

## Inputs Required

| Input | Location | What it provides |
| ----- | -------- | ---------------- |
| Service hub files | `dev_docs/specs/services/*.md` | Screens table per service |
| Service specs | `dev_docs/specs/services/*.md` | Screens identified in specs |
| Frontend routes | `apps/web/app/` directory structure | Screens already built |
| Tribunal research | `01-tribunal/` | Screens identified during research |
| Task files | `dev_docs/tasks/` | Task IDs assigned to screens |

---

## Screen Classification

For each screen, determine:

| Field | Values | Description |
| ----- | ------ | ----------- |
| **Name** | Descriptive name | e.g., "Load List", "Carrier Detail" |
| **Route** | URL path | e.g., `/loads`, `/carriers/[id]` |
| **Service** | Parent service | e.g., "Load Management", "CRM" |
| **Type** | See type table | Page archetype |
| **Complexity** | S, M, L, XL | Implementation effort |
| **Status** | See status table | Current build state |
| **Real-time** | Yes / No | Needs WebSocket connection |
| **Task ID** | Task reference | e.g., LOAD-101 |

### Screen Types

| Type | Description | Typical Components |
| ---- | ----------- | ------------------ |
| **List** | Tabular data with filters, search, pagination | DataTable, SearchInput, FilterBar, Pagination |
| **Detail** | Single entity view, often tabbed | Tabs, KPICards, Timeline, StatusBadge |
| **Form (Create)** | Multi-section input form for new entities | FormFields, Selects, DatePickers, validation |
| **Form (Edit)** | Same as create but pre-populated with existing data | Same as Create + data loading |
| **Dashboard** | KPI cards, charts, activity feeds, at-a-glance metrics | KPICard, Chart, ActivityList, StatGrid |
| **Settings** | Configuration panels, toggles, preference forms | FormFields, Toggles, Sections |
| **Wizard** | Multi-step guided workflow | StepIndicator, Form per step, navigation |
| **Public** | Unauthenticated pages (login, register, landing) | Branding, Forms, Links |

### Screen Status

| Status | Meaning |
| ------ | ------- |
| **Done** | Fully functional, renders real data, handles all states |
| **WIP** | Partially built, some functionality works |
| **Stub** | Route exists, minimal or placeholder content |
| **Not Built** | Identified in specs but no code exists |
| **Protected** | Done + on the protect list (do not modify) |

### Complexity Guide

| Complexity | Hours | Characteristics |
| ---------- | ----- | --------------- |
| S | 1-2h | Simple layout, few fields, no complex state |
| M | 2-4h | Standard CRUD screen, moderate state, form validation |
| L | 4-8h | Multi-tab, complex filters, real-time updates, multi-step |
| XL | 8-16h | Dashboard with charts, drag-and-drop, complex workflows |

---

## Generation Algorithm

1. **Read all service hub files.** Extract the Screens table from each.

2. **Scan the frontend route directory** (`apps/web/app/`). For each route:
   - Determine the service it belongs to (by route prefix)
   - Check if a `page.tsx` file exists (screen is at least a stub)
   - Check if the screen renders real data or placeholder content

3. **Cross-reference with specs.** For screens in specs but not in hub files:
   - Add them with status "Not Built"
   - Assign them to the correct service

4. **Assign task IDs.** For screens without task IDs:
   - Check `dev_docs/tasks/` for matching tasks
   - If no task exists, flag it as "Needs Task"

5. **Calculate statistics** per service and overall.

6. **Write the catalog** in the format below.

---

## Catalog Output Format

Write to `dev_docs/specs/screen-catalog.md`:

```markdown
# Screen Catalog

> **Total Screens:** {N}
> **Done:** {n} | **WIP:** {n} | **Stub:** {n} | **Not Built:** {n} | **Protected:** {n}
> **Last Updated:** {date}

---

## Summary by Service

| Service | Total | Done | WIP | Stub | Not Built | Protected |
| ------- | ----- | ---- | --- | ---- | --------- | --------- |
| Auth & Admin | {n} | {n} | {n} | {n} | {n} | {n} |
| Load Management | {n} | {n} | {n} | {n} | {n} | {n} |
| Carrier Management | {n} | {n} | {n} | {n} | {n} | {n} |
| ... | | | | | | |
| **Total** | **{N}** | **{n}** | **{n}** | **{n}** | **{n}** | **{n}** |

---

## Summary by Type

| Type | Count | Notes |
| ---- | ----- | ----- |
| List | {n} | Standard data table with filters |
| Detail | {n} | Tabbed view with sidebar info |
| Form (Create) | {n} | Multi-section creation form |
| Form (Edit) | {n} | Pre-populated edit form |
| Dashboard | {n} | KPI cards + charts + activity |
| Settings | {n} | Configuration panels |
| Wizard | {n} | Multi-step guided flow |
| Public | {n} | Unauthenticated pages |

---

## Full Screen List

### Auth & Admin

| # | Screen | Route | Type | Complexity | Status | Real-time | Task ID | Notes |
| - | ------ | ----- | ---- | ---------- | ------ | --------- | ------- | ----- |
| 1 | Login | /login | Public | S | Protected | No | -- | Do not modify |
| 2 | Dashboard | /dashboard | Dashboard | XL | WIP | Yes | AUTH-101 | |

### Load Management

| # | Screen | Route | Type | Complexity | Status | Real-time | Task ID | Notes |
| - | ------ | ----- | ---- | ---------- | ------ | --------- | ------- | ----- |
| 1 | Load List | /loads | List | M | Not Built | No | LOAD-101 | |
| 2 | Load Detail | /loads/[id] | Detail | L | Not Built | Yes | LOAD-102 | |

### Carrier Management

| # | Screen | Route | Type | Complexity | Status | Real-time | Task ID | Notes |
| - | ------ | ----- | ---- | ---------- | ------ | --------- | ------- | ----- |

{... repeat for all services ...}

---

## Screens Needing Tasks

Screens identified in specs but with no assigned task:

| Screen | Route | Service | Action Needed |
| ------ | ----- | ------- | ------------- |
| {name} | {route} | {service} | Create task in Phase {N} |

---

## Screen-to-API Mapping

For each screen, list the API endpoints it needs:

| Screen | Endpoints Used | All Endpoints Exist? |
| ------ | -------------- | -------------------- |
| Load List | GET /api/loads, GET /api/loads/stats | Yes |
| Load Create | POST /api/loads, GET /api/customers, GET /api/carriers | No -- POST /api/loads is a stub |

---

## Screen Spec Checklist

For screens that have detailed design specs:

| Screen | Spec File | Fields Defined | Components Listed | API Mapped |
| ------ | --------- | -------------- | ----------------- | ---------- |
| Load List | dev_docs/specs/load-list.md | Yes | Yes | Yes |
| Load Detail | dev_docs/specs/load-detail.md | Yes | Partial | No |
```

---

## Validation Checklist

After generation, verify:

- [ ] Every route in `apps/web/app/` has a corresponding catalog entry
- [ ] Every screen in every service hub file appears in the catalog
- [ ] Status values are accurate (check actual files, not just guesses)
- [ ] Summary totals match the detailed tables
- [ ] Every screen has a task ID (or is flagged in "Screens Needing Tasks")
- [ ] Screen-to-API mapping identifies missing or stub endpoints
- [ ] Protected screens are correctly identified and noted as "do not modify"
