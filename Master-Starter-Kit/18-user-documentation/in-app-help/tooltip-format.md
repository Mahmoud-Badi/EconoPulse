# Tooltip Content Format

Standards for writing tooltip text that appears on form fields and UI elements.

---

## Format

Each tooltip entry in the in-app help JSON follows this structure:

```json
{
  "element_id": "field-due-date",
  "text": "The date payment is expected. Overdue invoices appear in red after this date.",
  "learn_more": "{{DOCS_SITE_URL}}/guides/invoice-management#due-dates"
}
```

---

## Writing Rules

| Rule | Example |
|------|---------|
| Max 80 characters for the main text | "Filter invoices by status: Draft, Sent, Paid, or Overdue." |
| Start with what the field/element does | "Sets the date..." not "This field is for..." |
| Use the user's language, not system terms | "customer" not "tenant", "payment" not "transaction" |
| Include the consequence of the action | "Overdue invoices appear in red after this date" |
| No developer jargon | "required" not "non-nullable", "choose" not "select from enum" |
| Optional "Learn more" link to the full guide | Only if there's meaningful additional detail |

---

## When to Add Tooltips

Add tooltips for:

- [ ] Form fields that aren't self-explanatory
- [ ] Status indicators (what each status means)
- [ ] Action buttons with non-obvious consequences (e.g., "Archive" vs "Delete")
- [ ] Settings or configuration options
- [ ] Filters and sort controls

Do NOT add tooltips for:

- Self-explanatory fields (Name, Email, Phone)
- Standard actions (Save, Cancel, Back)
- Navigation elements

---

## Element ID Convention

Use the HTML element's `id` or `data-help` attribute:

```text
field-{field-name}         → form fields
action-{action-name}       → buttons and actions
filter-{filter-name}       → filter controls
status-{status-name}       → status indicators
setting-{setting-name}     → settings/config options
```
