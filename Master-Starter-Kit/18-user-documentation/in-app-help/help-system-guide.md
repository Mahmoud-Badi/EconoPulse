# In-App Help System Architecture

How to build and maintain contextual help within the {{PROJECT_NAME}} application.

---

## Overview

The in-app help system provides contextual assistance without leaving the application. It consists of four components:

1. **Tooltips** — Short descriptions on form fields and UI elements
2. **Contextual Help Panels** — Slide-out panels with detailed help for the current page
3. **Onboarding Wizard** — First-time user guided tour
4. **Error-to-Help Mapping** — Links error messages to troubleshooting articles

---

## Content Storage

Help content is stored as JSON files in `{{USER_DOCS_PATH}}/in-app/`, one file per screen:

```json
{
  "screen": "invoices-list",
  "title": "Invoice Management",
  "description": "View, create, and manage your invoices.",
  "help_url": "{{DOCS_SITE_URL}}/guides/invoice-management",
  "tooltips": [
    {
      "element_id": "filter-status",
      "text": "Filter invoices by their current status (Draft, Sent, Paid, Overdue).",
      "learn_more": "{{DOCS_SITE_URL}}/guides/invoice-management#filtering"
    }
  ],
  "contextual_help": {
    "sections": [
      {
        "title": "Creating an Invoice",
        "content": "To create a new invoice, click the 'New Invoice' button...",
        "screenshot": "screenshots/web/invoices/create-form.png"
      }
    ]
  }
}
```

<!-- IF {{HAS_MOBILE}} == "true" -->
Mobile help content is stored separately in `{{USER_DOCS_PATH}}/in-app/mobile/` with a different structure optimized for mobile patterns (see `mobile-help-patterns.md`).
<!-- ENDIF -->

---

## Component Integration

### Help Button

Every page should include a help button (usually a `?` icon in the top-right corner) that opens the contextual help panel:

```text
┌─────────────────────────────────┐
│  Page Title              [?] [⚙]│
│                                 │
│  Page content...                │
│                                 │
└─────────────────────────────────┘
```

When clicked, the help panel slides in from the right.

### Loading Help Content

The application loads help content for the current screen on page mount:

1. Determine the current screen slug from the route (e.g., `/dashboard/invoices` → `invoices-list`)
2. Fetch the corresponding JSON file
3. Render tooltips on matching elements
4. Make the contextual help panel available via the help button

### Feedback Collection

Each help panel includes a "Was this helpful?" prompt:
- Thumbs up / Thumbs down
- Optional free-text feedback
- Data sent to analytics for documentation improvement

---

## Keeping Content in Sync

The `/document-feature` skill updates in-app help JSON files whenever a feature's UI changes. The content in these JSON files should match the corresponding feature guide in `user_docs/guides/`.

**Sync rule:** The in-app help is a _summary_ of the full guide. If the guide changes, the in-app content should change too. The `/doc-quality-gate` checks for this.

---

## Implementation Notes

- Help content is loaded lazily (only when the user clicks the help button)
- Tooltips can be loaded eagerly for key onboarding screens
- All help content is plain text or simple markdown — no HTML injection
- Help content is versioned with the application code
