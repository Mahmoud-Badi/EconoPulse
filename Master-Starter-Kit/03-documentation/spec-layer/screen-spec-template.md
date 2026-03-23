# [SCREEN_NAME] — Screen Specification

> Copy this template for each frontend screen. Fill in every section.
> Delete this instruction block when done.

---

## 1. Overview
**Screen:** [Screen Name]
**Route:** [/path/to/screen]
**Task ID:** [TASK-XXX]
**Status:** [Draft | In Progress | Complete]
**Owner:** [Developer/Agent]

Brief description of what this screen does and its primary user action.

## 2. Screen Type
- [ ] List / Table view
- [ ] Detail / Show view
- [ ] Form / Create-Edit view
- [ ] Dashboard / Summary view
- [ ] Modal / Dialog
- [ ] Wizard / Multi-step

## 3. ASCII Wireframe
```
┌─────────────────────────────────────────┐
│ [Header / Breadcrumb]                   │
├─────────────────────────────────────────┤
│ [Filters / Actions Bar]                 │
├─────────────────────────────────────────┤
│                                         │
│ [Main Content Area]                     │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ [Pagination / Footer]                   │
└─────────────────────────────────────────┘
```

## 4. Data Fields
| Field | Type | Source | Display | Sortable | Filterable |
|---|---|---|---|---|---|
| [field] | [type] | [API field] | [format] | Y/N | Y/N |
| [field] | [type] | [API field] | [format] | Y/N | Y/N |

## 5. Component Inventory
| Component | Source | Props | Notes |
|---|---|---|---|
| [ComponentName] | [library/custom] | [key props] | [notes] |
| [ComponentName] | [library/custom] | [key props] | [notes] |

## 6. Status States
| Status Value | Badge Color | Label | Description |
|---|---|---|---|
| [status] | [color] | [label] | [description] |

## 7. Role Access Matrix
| Role | Can View | Can Create | Can Edit | Can Delete | Special |
|---|---|---|---|---|---|
| Super Admin | X | X | X | X | |
| Admin | X | X | X | X | |
| Manager | X | X | X | | |
| User | X | | | | Own only |

## 8. API Endpoints
| Action | Method | Endpoint | Request | Response |
|---|---|---|---|---|
| List | GET | /api/[resource] | query params | paginated list |
| Detail | GET | /api/[resource]/:id | - | single item |
| Create | POST | /api/[resource] | body | created item |
| Update | PATCH | /api/[resource]/:id | body | updated item |
| Delete | DELETE | /api/[resource]/:id | - | success |

## 9. WebSocket Events
| Event | Direction | Payload | Trigger |
|---|---|---|---|
| [event.name] | Server -> Client | [payload shape] | [when emitted] |

> If no real-time features: "None for MVP"

## 10. Loading / Error / Empty States

### Loading State
- Skeleton layout matching the wireframe above
- Animate: pulse shimmer on data areas

### Error State
- Icon + message: "Failed to load [resource]. Please try again."
- Retry button

### Empty State
- Illustration or icon
- Message: "No [resource] found"
- CTA: "Create your first [resource]" (if user has permission)

### Data State
- Populated wireframe as described in section 3

## 11. Mobile Behavior
- **Breakpoint:** Responsive below [breakpoint]px
- **Table:** Converts to card list on mobile
- **Actions:** Move to bottom sheet or dropdown
- **Navigation:** [describe mobile nav changes]

## 12. Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- [ ] All interactive elements are keyboard-accessible (Tab, Enter, Space, Escape)
- [ ] Focus order follows visual order (left-to-right, top-to-bottom)
- [ ] Focus is visible on all interactive elements (focus ring)
- [ ] Focus is trapped inside modals/dialogs when open
- [ ] Focus returns to trigger element when modal/dialog closes
- [ ] No keyboard traps (user can always Tab out of any component)

### Screen Reader Support
- [ ] All images have descriptive `alt` text (or `alt=""` for decorative)
- [ ] ARIA labels on icon-only buttons (e.g., `aria-label="Close"`)
- [ ] Dynamic content changes announced with `aria-live` regions
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages are linked to inputs via `aria-describedby`
- [ ] Table headers use `<th>` with `scope` attributes
- [ ] Page has a descriptive `<title>` and single `<h1>`

### Visual
- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text/UI)
- [ ] Information is NOT conveyed by color alone (use icons, text, or patterns too)
- [ ] Text resizes to 200% without loss of content or functionality
- [ ] Touch targets are at least 44x44px on mobile

### Interaction Patterns
- [ ] Custom widgets follow WAI-ARIA Authoring Practices (e.g., combobox, tabs, accordion)
- [ ] Loading states are announced to screen readers (`aria-busy="true"`)
- [ ] Toast/notification dismissal is accessible (auto-dismiss + close button)

### Screen-Specific Accessibility Notes
- [Document any accessibility considerations unique to this screen]
- [e.g., "Data table needs `role="grid"` with arrow key navigation"]
- [e.g., "Drag-and-drop must have keyboard alternative"]

## 13. Stitch Prompt
> Prompt for AI design tools to generate this screen's visual design.

"Design a [screen type] for [description]. It should include [key elements].
Use [design system] styling with [specific requirements].
The layout is [describe layout from wireframe]."

## 14. Design Notes
- [Any specific design decisions or constraints]
- [Color or spacing overrides from the standard]
- [Animation or transition requirements]

## 15. Dependencies
- **Blocks:** [screens/features that depend on this]
- **Blocked by:** [screens/features this depends on]
- **Shared components:** [components used by other screens too]
- **Backend:** [service spec reference]
- **Contract:** [contract file reference]
