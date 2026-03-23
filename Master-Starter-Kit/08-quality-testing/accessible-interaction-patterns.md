# Accessible Interaction Patterns

> Implementation patterns for common UI components that require specific accessibility handling. Reference these when building components that go beyond basic buttons and links.

---

## 1. Data Tables

Standard HTML tables with sortable columns, row selection, and pagination.

```tsx
<table role="grid" aria-label="Projects list">
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending">
        <button onClick={() => sort('name')}>
          Name
          <SortIcon direction="asc" />
        </button>
      </th>
      <th scope="col" aria-sort="none">
        <button onClick={() => sort('status')}>Status</button>
      </th>
    </tr>
  </thead>
  <tbody>
    {rows.map(row => (
      <tr key={row.id} aria-selected={selected.includes(row.id)}>
        <td>{row.name}</td>
        <td>
          {/* Don't rely on color alone for status */}
          <StatusBadge status={row.status} />
          {/* Badge includes both color AND text label */}
        </td>
      </tr>
    ))}
  </tbody>
</table>

{/* Announce sort changes */}
<div aria-live="polite" className="sr-only">
  Sorted by {sortColumn}, {sortDirection}
</div>

{/* Announce page changes */}
<div aria-live="polite" className="sr-only">
  Showing {start} to {end} of {total} results
</div>
```

### Key Rules

- Use semantic `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`
- Add `scope="col"` or `scope="row"` to headers
- Use `aria-sort` on sortable columns
- Announce sort and page changes with `aria-live`
- Don't use `<div>` tables — screen readers can't navigate them

---

## 2. Modal / Dialog

```tsx
<dialog
  ref={dialogRef}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  aria-modal="true"
  onClose={handleClose}
>
  <h2 id="dialog-title">Delete Project</h2>
  <p id="dialog-description">
    Are you sure you want to delete "My Project"? This action cannot be undone.
  </p>
  <div className="flex gap-2">
    <button onClick={handleClose}>Cancel</button>
    <button onClick={handleDelete} autoFocus>
      Delete
    </button>
  </div>
</dialog>
```

### Key Rules

- Use native `<dialog>` element (handles focus trapping and backdrop)
- Set `aria-labelledby` to the dialog title
- Set `aria-modal="true"`
- Auto-focus the first interactive element (or the most logical one)
- Return focus to the trigger element on close
- Close on `Escape` key press
- Prevent body scroll while open

---

## 3. Dropdown Menu

```tsx
<div className="relative">
  <button
    aria-expanded={isOpen}
    aria-haspopup="menu"
    aria-controls="actions-menu"
    onClick={toggle}
  >
    Actions
  </button>

  {isOpen && (
    <ul
      id="actions-menu"
      role="menu"
      aria-label="Project actions"
    >
      <li role="menuitem" tabIndex={0} onClick={handleEdit}>
        Edit
      </li>
      <li role="menuitem" tabIndex={-1} onClick={handleDuplicate}>
        Duplicate
      </li>
      <li role="separator" />
      <li role="menuitem" tabIndex={-1} onClick={handleDelete}>
        Delete
      </li>
    </ul>
  )}
</div>
```

### Key Rules

- `aria-expanded` on trigger button reflects open state
- `aria-haspopup="menu"` tells screen readers a menu will appear
- `role="menu"` and `role="menuitem"` on the dropdown
- Arrow keys navigate between items
- `Escape` closes the menu and returns focus to trigger
- `Home`/`End` jump to first/last item
- Typing a letter jumps to the first item starting with that letter

---

## 4. Tabs

```tsx
<div>
  <div role="tablist" aria-label="Project sections">
    {tabs.map((tab, index) => (
      <button
        key={tab.id}
        role="tab"
        id={`tab-${tab.id}`}
        aria-selected={activeTab === tab.id}
        aria-controls={`panel-${tab.id}`}
        tabIndex={activeTab === tab.id ? 0 : -1}
        onClick={() => setActiveTab(tab.id)}
        onKeyDown={(e) => handleTabKeyDown(e, index)}
      >
        {tab.label}
      </button>
    ))}
  </div>

  {tabs.map(tab => (
    <div
      key={tab.id}
      role="tabpanel"
      id={`panel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      hidden={activeTab !== tab.id}
      tabIndex={0}
    >
      {tab.content}
    </div>
  ))}
</div>
```

### Key Rules

- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected` on the active tab
- `aria-controls` links tab to its panel
- Arrow keys move between tabs
- Only the active tab is in the tab order (`tabIndex={0}`), others are `tabIndex={-1}`
- Panel has `tabIndex={0}` so it can receive focus

---

## 5. Toast / Notification

```tsx
{/* Toast container with aria-live for announcements */}
<div
  aria-live="polite"
  aria-atomic="true"
  className="fixed bottom-4 right-4"
>
  {toasts.map(toast => (
    <div
      key={toast.id}
      role="alert"
      className="toast"
    >
      <span>{toast.message}</span>
      <button
        aria-label="Dismiss notification"
        onClick={() => dismissToast(toast.id)}
      >
        <XIcon aria-hidden="true" />
      </button>
    </div>
  ))}
</div>
```

### Key Rules

- `aria-live="polite"` on the container (screen reader announces new toasts)
- Use `aria-live="assertive"` only for urgent messages (errors)
- `role="alert"` on individual toast messages
- Include a close button (don't rely only on auto-dismiss)
- Auto-dismiss should be at least 5 seconds (enough time to read)
- Don't auto-dismiss error toasts

---

## 6. Combobox / Autocomplete

```tsx
<div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
  <input
    type="text"
    aria-autocomplete="list"
    aria-controls="suggestions"
    aria-activedescendant={highlightedId}
    value={query}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
  />

  {isOpen && (
    <ul id="suggestions" role="listbox">
      {suggestions.map(item => (
        <li
          key={item.id}
          id={`option-${item.id}`}
          role="option"
          aria-selected={highlightedId === `option-${item.id}`}
          onClick={() => selectItem(item)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )}

  {/* Announce results count */}
  <div aria-live="polite" className="sr-only">
    {suggestions.length} results available
  </div>
</div>
```

### Key Rules

- `role="combobox"` on the wrapper
- `aria-activedescendant` tracks the highlighted option
- Arrow keys navigate options, Enter selects
- Announce result count changes via `aria-live`

---

## 7. Drag and Drop

Drag and drop MUST have a keyboard alternative:

```tsx
{/* Keyboard-accessible reorder */}
<ul role="listbox" aria-label="Reorder tasks">
  {items.map((item, index) => (
    <li
      key={item.id}
      role="option"
      aria-grabbed={draggedId === item.id}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault();
          toggleGrab(item.id);
        }
        if (e.key === 'ArrowUp' && draggedId === item.id) {
          e.preventDefault();
          moveItem(item.id, index - 1);
        }
        if (e.key === 'ArrowDown' && draggedId === item.id) {
          e.preventDefault();
          moveItem(item.id, index + 1);
        }
      }}
    >
      <GripIcon aria-hidden="true" />
      <span>{item.name}</span>
      <span className="sr-only">
        Position {index + 1} of {items.length}.
        Press Space to grab, then Arrow keys to move.
      </span>
    </li>
  ))}
</ul>

<div aria-live="assertive" className="sr-only">
  {announcement} {/* "Task moved to position 3 of 5" */}
</div>
```

### Key Rules

- Space to grab/release an item
- Arrow keys to move the grabbed item
- Announce position changes via `aria-live`
- Provide instructions via `sr-only` text

---

## CSS Utilities

```css
/* Screen-reader only — visible to assistive tech, hidden visually */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Visible focus ring (don't use outline: none without replacement) */
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

---

## Reference

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — Official patterns for all widget types
- [axe-core Rules](https://dequeuniversity.com/rules/axe/) — What the automated scanner checks
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — Verify color contrast ratios
