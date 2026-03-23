# Contextual Help Panel — Component Spec

Specification for the slide-out help panel that provides context-aware assistance on every page.

---

## Behavior

- **Trigger:** Click the `?` help icon in the page header
- **Animation:** Slides in from the right edge, 400px wide (desktop), full-width (mobile)
- **Overlay:** Semi-transparent backdrop on mobile, no backdrop on desktop (panel is alongside content)
- **Dismiss:** Click outside, press Escape, or click the X button
- **Persistence:** Panel state is not persisted — closes on navigation

---

## Layout

```text
┌──────────────────────────────────────┐
│  ✕  Help: {{Page Title}}            │
├──────────────────────────────────────┤
│                                      │
│  {{Page description from JSON}}      │
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  ▸ Section 1: {{Title}}             │
│    {{Content preview...}}            │
│                                      │
│  ▸ Section 2: {{Title}}             │
│    {{Content preview...}}            │
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  📖 View full guide →               │
│     (links to docs site)             │
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  Was this helpful?  👍  👎          │
│  [Send feedback]                     │
│                                      │
└──────────────────────────────────────┘
```

---

## Content Source

The panel reads from `{{USER_DOCS_PATH}}/in-app/{screen-slug}.json`:

```json
{
  "screen": "invoices-list",
  "title": "Invoice Management",
  "description": "View, create, and manage all your invoices in one place.",
  "help_url": "{{DOCS_SITE_URL}}/guides/invoice-management",
  "contextual_help": {
    "sections": [
      {
        "title": "Creating an Invoice",
        "content": "Click 'New Invoice' to start. Fill in the customer, line items, and due date. The system calculates totals automatically.",
        "screenshot": "screenshots/web/invoices/create-form.png"
      },
      {
        "title": "Filtering Invoices",
        "content": "Use the status filter to show only Draft, Sent, Paid, or Overdue invoices. Combine with date range for more specific results."
      }
    ]
  }
}
```

---

## Sections

Each section is collapsible (accordion). The first section starts expanded. Content is plain text or simple markdown (bold, links, lists). Screenshots are optional — they display inline if present.

---

## "View Full Guide" Link

Always present at the bottom. Links to `help_url` from the JSON — this opens the full feature guide on the external docs site. Opens in a new tab.

---

## Feedback

The "Was this helpful?" prompt at the bottom collects:
- Binary feedback (thumbs up/down)
- Optional text input (shown after thumbs down)
- Screen slug (for analytics — which pages have poor help content)

This data helps prioritize documentation improvements.

---

## Implementation Notes

- Component should be a shared layout component, not per-page
- Content is fetched lazily on help button click, not on page load
- If no JSON exists for the current screen, show a generic "No help available for this page yet" message with a link to the main docs site
- Accessible: focus trap when open, aria-label on the panel, Escape to close
