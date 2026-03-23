# Screenshot Automation System

Two-pass system for capturing screenshots in user documentation. Text content is written first (during build), screenshots are captured later (after design phase).

---

## The Two-Pass System

### Pass 1: Placeholders (During Build)

When the `/document-feature` skill writes documentation, it inserts screenshot placeholders:

```markdown
![Screenshot: Invoice list page showing filter controls and data table](screenshots/web/invoices/list-filtered.png)
<!-- SCREENSHOT_PENDING: Navigate to /dashboard/invoices, apply status filter "Overdue", wait for table to load with seed data, capture full page at 1280x720 -->
```

The placeholder includes:
- **Alt text** — describes what the screenshot shows
- **Image path** — where the screenshot will be saved (following naming convention)
- **Capture instructions** — exact steps to reproduce the screenshot

### Pass 2: Capture (After Design Phase)

The `/capture-screenshots` skill reads all `<!-- SCREENSHOT_PENDING -->` markers and:

1. Reads the screenshot manifest for all pending entries
2. Launches the appropriate capture tool (Playwright for web, simulator commands for mobile)
3. Navigates to each screen, captures the screenshot
4. Saves to the designated path
5. Removes the `SCREENSHOT_PENDING` marker from the doc file
6. Updates the manifest (pending → captured)

---

## Screenshot Placeholder Format

Every placeholder MUST include these fields:

```markdown
<!-- SCREENSHOT_PENDING:
  platform: web|ios|android|both
  url: /dashboard/invoices (web) or screen_name (mobile)
  setup: "Apply status filter 'Overdue', ensure 5+ rows of seed data visible"
  wait_for: "[data-testid='invoice-table']" (web) or "Invoice list loaded" (mobile)
  viewport: 1280x720 (web), 390x844 (mobile)
  filename: invoices-list-filtered.png
  description: Invoice list page with Overdue filter applied showing colored status badges
-->
```

---

## Naming Convention

Screenshots follow this naming pattern:

```text
{feature-slug}-{descriptor}.png
```

Examples:
- `invoices-list-default.png` — default state of the invoice list
- `invoices-list-filtered.png` — invoice list with a filter applied
- `invoices-create-form.png` — the create invoice form
- `invoices-create-validation.png` — form showing validation errors
- `invoices-detail-paid.png` — invoice detail page in "Paid" status

---

## File Organization

```text
user_docs/screenshots/
├── web/
│   ├── invoices/
│   │   ├── list-default.png
│   │   ├── list-filtered.png
│   │   └── create-form.png
│   ├── onboarding/
│   │   ├── signup.png
│   │   └── first-workflow.png
│   └── tutorials/
│       └── first-invoice/
│           ├── step-1-1.png
│           └── completed.png
├── ios/                          # (if HAS_MOBILE)
│   └── invoices/
│       └── list-default.png
├── android/                      # (if HAS_MOBILE)
│   └── invoices/
│       └── list-default.png
└── store/                        # (if HAS_MOBILE)
    ├── ios/
    └── android/
```

---

## Web Capture (Playwright)

The `/capture-screenshots` skill uses the Playwright MCP tools:

1. `browser_navigate` to the target URL
2. `browser_wait_for` the specified selector
3. `browser_resize` to the target viewport
4. `browser_take_screenshot` to capture

If Playwright MCP is not available, the skill generates a manual checklist instead (see Fallback section).

<!-- IF {{HAS_MOBILE}} == "true" -->

---

## Mobile Capture

See `mobile-screenshot-guide.md` for full details on simulator/emulator capture commands and App Store screenshot requirements.
<!-- ENDIF -->

---

## Fallback: Manual Screenshot Checklist

If automation tools are unavailable, the `/capture-screenshots` skill generates `user_docs/SCREENSHOT-CHECKLIST.md`:

```markdown
# Screenshot Capture Checklist

Screenshots that need to be captured manually.

## Instructions
1. Start the dev server: `{{DEV_CMD}}`
2. Open the browser/simulator
3. For each entry: navigate to the screen, set up the state, take a screenshot, save to the specified path

## Pending Screenshots

- [ ] `invoices-list-default.png`
  - Navigate to: /dashboard/invoices
  - State: Default, no filters, 10+ rows of seed data
  - Save to: user_docs/screenshots/web/invoices/list-default.png
  - Viewport: 1280x720

- [ ] `invoices-list-filtered.png`
  - Navigate to: /dashboard/invoices
  - State: Apply "Overdue" status filter
  - Save to: user_docs/screenshots/web/invoices/list-filtered.png
  - Viewport: 1280x720
```

---

## Quality Standards for Screenshots

- **Resolution:** Minimum 2x retina (2560x1440 for desktop captures) — prevents blurriness in docs
- **Seed data:** Always use realistic seed data, not "test123" or "Lorem ipsum"
- **Consistency:** Same browser, same zoom level, same theme (light or dark) across all screenshots
- **Annotations:** Do NOT add annotations (arrows, highlights) in screenshots. If annotations are needed, they go in a separate annotated version. Raw screenshots should be clean
- **PII:** Never capture real user data, emails, or credentials
- **Currency/dates:** Use neutral formats or the project's configured locale
