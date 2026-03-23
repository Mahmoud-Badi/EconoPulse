# Component Primitive Mapping — {{PROJECT_NAME}}

> **Purpose:** Maps every domain-specific component to its UI library primitives. Prevents each AI session from independently guessing component implementations.
> **Generated at:** Step 6 (screen specs) + Step 13 (design system)
> **Single source of truth for:** "What UI primitive implements this domain concept?"

---

## How to Use This Document

1. When writing screen specs (Step 6): reference this mapping for the "Component Implementation" column
2. When building components (development): follow these mappings exactly — do not invent alternatives
3. When reviewing code: verify that implementations match these mappings

---

<!-- IF {{DESIGN_SYSTEM_LIBRARY}} == "shadcn/ui" -->
## UI Library: shadcn/ui

### Core Primitives Available

| Primitive | When to Use | Variants |
|-----------|------------|----------|
| Button | Actions, CTAs, toggles | default, destructive, outline, secondary, ghost, link |
| Card | Content containers, list items | default (customize with CardHeader, CardContent, CardFooter) |
| Badge | Status indicators, counts, tags | default, secondary, destructive, outline |
| Dialog | Confirmations, forms, detail views | default (use Sheet on mobile) |
| Sheet | Side panels, mobile modals | side: left, right, top, bottom |
| DropdownMenu | Action menus, context menus | default |
| Select | Single option selection | default |
| Combobox | Searchable selection | default (uses Popover + Command) |
| Table | Structured data display | default (use with @tanstack/react-table) |
| Tabs | Section switching | default |
| Toast | Notifications, feedback | default (use Sonner) |
| Form | Data entry (uses react-hook-form + zod) | default |
| Input | Text entry | default |
| Textarea | Multi-line text | default |
| Checkbox | Boolean selection | default |
| Switch | On/off toggles | default |
| Avatar | User/entity images | default |
| Skeleton | Loading states | default |
| Alert | Inline messages | default, destructive |
| Tooltip | Hover info | default |
| Popover | Floating content | default |
| Command | Search/command palette | default |
| Calendar | Date selection | default |
| DataTable | Full-featured table | custom (Table + column defs + sorting + filtering) |
<!-- ENDIF -->

<!-- IF {{DESIGN_SYSTEM_LIBRARY}} == "mui" -->
## UI Library: Material UI (MUI)

### Core Primitives Available

| Primitive | When to Use | Variants |
|-----------|------------|----------|
| Button | Actions, CTAs | contained, outlined, text |
| Card | Content containers | default, outlined, elevation |
| Chip | Status, tags, filters | default, outlined |
| Dialog | Modals, confirmations | default, fullScreen |
| Drawer | Side panels, mobile nav | permanent, persistent, temporary |
| Menu | Action menus | default |
| Select | Option selection | default, native |
| Autocomplete | Searchable selection | default |
| DataGrid | Data tables | default (@mui/x-data-grid) |
| Tabs | Section switching | default, scrollable |
| Snackbar | Notifications | default |
| TextField | Text input | outlined, filled, standard |
| Checkbox / Switch | Boolean | default |
| Avatar | User images | default |
| Skeleton | Loading | text, circular, rectangular |
| Alert | Messages | success, info, warning, error |
| Tooltip | Hover info | default |
<!-- ENDIF -->

---

## Domain Component → Primitive Mapping

> Fill in for EVERY domain component in your project.

| Domain Component | Description | UI Primitive(s) | Variant/Config | Used In Screens |
|-----------------|-------------|-----------------|----------------|-----------------|
| {{e.g., CallQueueItem}} | {{short description}} | {{e.g., Card + Badge + Button}} | {{e.g., compact card, destructive badge}} | {{screen list}} |
| {{e.g., PriorityBadge}} | {{short description}} | {{e.g., Badge}} | {{destructive for P1, warning for P2, default for P3}} | {{screen list}} |
| {{e.g., PatientCard}} | {{short description}} | {{e.g., Card + Avatar + Badge}} | {{with CardHeader containing Avatar}} | {{screen list}} |
| {{e.g., AssignmentModal}} | {{short description}} | {{e.g., Dialog (desktop) / Sheet (mobile)}} | {{responsive: Dialog → Sheet at T1}} | {{screen list}} |
| {{e.g., FilterPanel}} | {{short description}} | {{e.g., Sheet (mobile) / aside (desktop)}} | {{responsive: Sheet → sidebar}} | {{screen list}} |
| {{e.g., StatusIndicator}} | {{short description}} | {{e.g., Badge + dot}} | {{color-coded per status enum}} | {{screen list}} |
| {{e.g., DataGrid}} | {{short description}} | {{e.g., Table + column headers + pagination}} | {{sortable, filterable}} | {{screen list}} |
| {{e.g., QuickActionBar}} | {{short description}} | {{e.g., Card + Button group}} | {{sticky bottom on mobile}} | {{screen list}} |

---

## Primitive Usage Rules

1. **One domain concept = one mapping.** Do not use `Card` for a list item in one screen and `div` in another.
2. **Responsive mappings are explicit.** If a component changes primitive at a breakpoint, document it (e.g., `Dialog (T3+) → Sheet (T1-T2)`).
3. **Customization is scoped.** Custom styling goes in the domain component wrapper, NOT by modifying the primitive's base styles.
4. **Variants are pre-defined.** If you need a new variant, add it here first — don't create inline ad-hoc variants.
5. **Composition over creation.** Prefer composing existing primitives over creating new ones from scratch.

---

## Unmapped Components (Action Required)

> Any domain component discovered during development that isn't mapped above must be added here immediately. Do not implement unmapped components.

| Domain Component | Discovery Context | Proposed Mapping | Status |
|-----------------|-------------------|------------------|--------|
| | | | ☐ Pending review |
