# Component Contract: {{COMPONENT_NAME}}

> **Purpose:** Implementation-ready specification for complex components that appear in multiple screens or have significant internal state. Prose descriptions produce inconsistent implementations — TypeScript interfaces eliminate ambiguity.
>
> **Generate for:** The 10-15 most complex NEW components (3+ screens, 8+ props, internal state, or multi-panel layouts).
> **Save to:** `dev_docs/components/contracts/{{component-name}}.md`
> **Collective file:** Also compile all contracts into `dev_docs/specs/ui/component-contracts.md`

---

## Component Overview

| Field | Value |
|-------|-------|
| **Component Name** | `{{COMPONENT_NAME}}` (e.g., `ScheduleGrid`, `DispatchConsole`, `VitalsEntry`) |
| **Source Screens** | {{SCREEN_LIST}} (screens where this component appears) |
| **Complexity Tier** | {{TIER}} (Simple / Intermediate / Complex / Real-Time) |
| **Estimated Props** | {{PROP_COUNT}} |
| **Has Internal State** | {{YES_NO}} |
| **Has Real-Time Updates** | {{YES_NO}} |
| **Has Drag/Drop** | {{YES_NO}} |

---

## Props Interface

```typescript
export interface {{ComponentName}}Props {
  // --- Required Props ---
  /** {{DESCRIPTION}} */
  {{propName}}: {{Type}};

  // --- Optional Props ---
  /** {{DESCRIPTION}}. @default {{DEFAULT_VALUE}} */
  {{propName}}?: {{Type}};

  // --- Callback Props ---
  /** Fired when {{EVENT_DESCRIPTION}} */
  on{{EventName}}?: ({{params}}: {{ParamType}}) => void;

  // --- Render Props / Slots ---
  /** Custom renderer for {{SLOT_DESCRIPTION}} */
  render{{SlotName}}?: ({{params}}: {{ParamType}}) => React.ReactNode;

  // --- Style / Layout Props ---
  /** Additional CSS class names */
  className?: string;
}
```

> **Rule:** Every prop must have a JSDoc comment explaining its purpose. Optional props must specify their default value.

---

## Internal State

```typescript
// Internal state managed by the component (not exposed via props)
interface {{ComponentName}}InternalState {
  /** {{DESCRIPTION}} */
  {{stateName}}: {{Type}};
}
```

| State | Type | Initial Value | Changed By | Effect |
|-------|------|--------------|------------|--------|
| {{STATE_NAME}} | {{TYPE}} | {{INITIAL}} | {{TRIGGER}} (e.g., "user clicks row", "WebSocket message") | {{WHAT_CHANGES}} (e.g., "highlights selected row, enables action buttons") |

---

## Events / Callbacks

| Event | Signature | Trigger | Payload |
|-------|-----------|---------|---------|
| `on{{EventName}}` | `({{params}}) => void` | {{WHEN_FIRED}} | {{WHAT_DATA}} |
<!-- List EVERY event the component can emit. Include events for: selection, status changes, errors, form submission, drag/drop completion. -->

---

## Slot / Children Contract

| Slot | Purpose | Default | Constraints |
|------|---------|---------|-------------|
| `children` | {{PURPOSE}} | {{DEFAULT_CONTENT}} | {{CONSTRAINTS}} (e.g., "must be `<TabPanel>` elements") |
| `render{{SlotName}}` | {{PURPOSE}} | {{DEFAULT_RENDERER}} | {{CONSTRAINTS}} |

---

## Variant Configuration

| Variant | Prop Value | Visual Difference | Behavior Difference |
|---------|-----------|-------------------|---------------------|
| {{VARIANT_NAME}} | `variant="{{value}}"` | {{VISUAL}} | {{BEHAVIOR}} |

---

## Layout Description

```
┌─────────────────────────────────────────────┐
│ {{COMPONENT_NAME}}                           │
│ ┌──────────┐ ┌────────────────────────────┐ │
│ │ {{PANEL}} │ │ {{PANEL}}                  │ │
│ │ ({{W}}%)  │ │ ({{W}}%)                   │ │
│ │           │ │                            │ │
│ │           │ │                            │ │
│ └──────────┘ └────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ {{PANEL}} ({{H}}px fixed)                │ │
│ └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

| Panel | Width/Height | Min Width | Content | Scrollable |
|-------|-------------|-----------|---------|------------|
| {{PANEL}} | {{DIMENSION}} | {{MIN}} | {{CONTENT}} | {{YES_NO}} |

---

## Responsive Behavior

| Breakpoint | Layout Change |
|-----------|---------------|
| **Desktop** (≥1440px) | {{LAYOUT}} (e.g., "All panels visible, side-by-side") |
| **Tablet** (768-1439px) | {{LAYOUT}} (e.g., "Side panel collapses to drawer, main panel full width") |
| **Mobile** (<768px) | {{LAYOUT}} (e.g., "Panels stack vertically, bottom panel becomes tab navigation") |

### Breakpoint-Specific Prop Changes

| Breakpoint | Prop | Desktop Value | Tablet Value | Mobile Value |
|-----------|------|--------------|-------------|-------------|
| {{BREAKPOINT}} | {{PROP}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |

---

## Accessibility Contract

| Requirement | Implementation |
|------------|----------------|
| **ARIA Role** | `role="{{ROLE}}"` (e.g., `grid`, `treegrid`, `tabpanel`) |
| **ARIA Label** | `aria-label="{{LABEL}}"` |
| **Keyboard Navigation** | {{KEYS}} (e.g., "Arrow keys navigate cells, Enter activates, Escape exits edit mode") |
| **Focus Management** | {{FOCUS}} (e.g., "Focus trapped in modal, returns to trigger on close") |
| **Screen Reader** | {{ANNOUNCEMENTS}} (e.g., "Announce row count on load, announce selection changes") |
| **Color Contrast** | Minimum {{RATIO}} (e.g., 4.5:1 for text, 3:1 for large text/icons) |

---

## Real-Time Behavior (if applicable)

| Setting | Value |
|---------|-------|
| **Data Source** | {{SOURCE}} (e.g., "WebSocket subscription to `dispatch.updates`") |
| **Update Strategy** | {{STRATEGY}} (e.g., "Merge incoming updates into local state, highlight changed rows for 3s") |
| **Stale Data Indicator** | {{INDICATOR}} (e.g., "Yellow dot next to timestamp if data >30s old") |
| **Reconnection** | {{BEHAVIOR}} (e.g., "Show 'Reconnecting...' banner, auto-retry every 5s, full refresh on reconnect") |
| **Optimistic Updates** | {{OPT_UPDATES}} (e.g., "Status changes applied immediately, reverted on server rejection") |

---

## Usage Examples

### Basic Usage
```tsx
<{{ComponentName}}
  {{requiredProp}}={{{value}}}
  on{{Event}}={({{params}}) => {
    // {{HANDLER_DESCRIPTION}}
  }}
/>
```

### With All Options
```tsx
<{{ComponentName}}
  {{requiredProp}}={{{value}}}
  {{optionalProp}}={{{value}}}
  on{{Event}}={({{params}}) => { /* ... */ }}
  render{{Slot}}={({{params}}) => (
    <CustomRenderer {{...params}} />
  )}
  className="{{CUSTOM_CLASSES}}"
/>
```

---

## Completeness Checklist

- [ ] Props interface is complete TypeScript (not abbreviated)
- [ ] Every prop has a JSDoc comment
- [ ] Every optional prop has a documented default value
- [ ] All events/callbacks are listed with signatures
- [ ] Layout diagram shows all panels with dimensions
- [ ] Responsive behavior covers 3 breakpoints (desktop, tablet, mobile)
- [ ] Accessibility requirements include ARIA roles, keyboard nav, and screen reader behavior
- [ ] Real-time behavior specified (if applicable)
- [ ] At least 2 usage examples (basic and full)
- [ ] Component registered in component-catalog.md
