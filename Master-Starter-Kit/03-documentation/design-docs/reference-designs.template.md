# Reference Designs — {{PROJECT_NAME}}

> **Visual targets per screen type.** Instead of designing from scratch, study the best existing products and adapt their patterns. This document defines what to emulate, what to avoid, and the density preference for every screen type.

---

## How to Use This Document

1. Before building any page, find its screen type below
2. Study the reference products (open them in a browser)
3. Note the specific patterns listed under "What to emulate"
4. Check "What to avoid" for common pitfalls
5. Match the density preference to your layout decisions

---

## Dashboard

### Reference Products
- **Vercel** (vercel.com/dashboard) — Clean KPI cards, deployment timeline
- **Linear** (linear.app) — Compact, information-dense, dark sidebar
- **Stripe** (dashboard.stripe.com) — Revenue charts, activity feed
- **Plausible** (plausible.io) — Simple analytics dashboard

### What to Emulate
| Pattern | From | Description |
|---------|------|-------------|
| KPI cards with trend indicators | Stripe | Number + percentage change + sparkline |
| Activity timeline | Vercel | Compact list with timestamps, most recent first |
| Quick actions section | Linear | 2-3 primary actions front and center |
| Date range selector | Plausible | Global date filter affects all widgets |
| Card-based layout | Vercel | Each section is a card with clear boundaries |

### What to Avoid
- Cramming too many charts on one screen (max 3-4 visible without scrolling)
- Generic "Welcome back!" greeting wasting prime space
- Charts with no data having no explanation
- Auto-playing animations or marquee tickers
- Decorative elements that add no information

### Density Preference
**Medium.** Enough whitespace to breathe, but data-forward. No wasted vertical space.

---

## List / Table Page

### Reference Products
- **Stripe** (stripe.com/dashboard/payments) — Filterable payment list
- **Linear** (linear.app/issues) — Issue list with inline status
- **GitHub** (github.com/pulls) — Pull request list with badges
- **Airtable** (airtable.com) — Spreadsheet-like density option

### What to Emulate
| Pattern | From | Description |
|---------|------|-------------|
| Inline filter bar | Stripe | Filter chips above table, persistent |
| Bulk actions | Linear | Select multiple → bulk action toolbar appears |
| Row hover reveal actions | GitHub | Actions appear on row hover (with tap fallback) |
| Status badges with color coding | Linear | Small colored dot + text for each status |
| Sortable column headers | Stripe | Click to sort, arrow indicator for direction |
| Compact row height | Linear | 36-40px rows for maximum visible data |

### What to Avoid
- Full-width tables on wide screens (max-width 1280px)
- Pagination showing "1-20 of 20" (hide when all fit on one page)
- Column headers with acronyms or internal jargon
- Zebra striping with high-contrast alternating colors
- Sticky headers that take up too much vertical space

### Density Preference
**High.** Tables should be compact. Users scan many rows — minimize row height.

---

## Detail / Show Page

### Reference Products
- **Linear** (issue detail) — Header with breadcrumb, sidebar with metadata
- **Stripe** (payment detail) — Clean layout, expandable sections
- **Notion** (page) — Content-focused, minimal chrome
- **GitHub** (PR detail) — Activity timeline, status checks

### What to Emulate
| Pattern | From | Description |
|---------|------|-------------|
| Header with breadcrumb + actions | Linear | `Section > Entity > Name` with action buttons right-aligned |
| Two-column layout | Stripe | Main content left (70%), metadata sidebar right (30%) |
| Timeline/activity feed | GitHub | Chronological events with icons and timestamps |
| Expandable sections | Stripe | Collapse secondary info, expand on demand |
| Status badge prominent | Linear | Large status indicator near the title |

### What to Avoid
- Showing all information at once with no visual hierarchy
- Tabs for content that fits on one scrollable page
- Modal for "edit" when an edit page works better
- Empty sidebar sections (hide if no content)
- Generic "Details" section header (use specific: "Trip Information", "Billing Details")

### Density Preference
**Medium-low.** Detail pages should be scannable with clear sections.

---

## Form Page

### Reference Products
- **Stripe** (create payment) — Simple, focused form
- **Linear** (create issue) — Minimal fields, smart defaults
- **Cal.com** (event type setup) — Multi-section form with clear groups
- **Clerk** (user setup) — Clean auth forms

### What to Emulate
| Pattern | From | Description |
|---------|------|-------------|
| Single-column form | Stripe | Max 600px width, centered or left-aligned |
| Grouped sections | Cal.com | Related fields grouped with section headers |
| Inline validation | Stripe | Errors appear below field on blur, not just on submit |
| Smart defaults | Linear | Pre-fill what you can (today's date, user's company) |
| Sticky submit bar | Stripe | Submit button visible at all times for long forms |

### What to Avoid
- Two-column form layouts (confusing tab order)
- Required field indicators on EVERY field (only mark optional ones)
- Long forms without section breaks
- Dropdowns for < 5 options (use radio buttons instead)
- "Reset form" button (nobody uses it, it causes accidental data loss)

### Density Preference
**Low.** Forms need breathing room. 20px gap between fields minimum.

---

## Kanban / Board

### Reference Products
- **Linear** (board view) — Clean kanban with WIP limits
- **Trello** (board) — Classic drag-drop kanban
- **GitHub Projects** (board view) — Column-based with cards
- **Jira** (board) — Sprint board with swim lanes

### What to Emulate
| Pattern | From | Description |
|---------|------|-------------|
| Column headers with count | Linear | "In Progress (3)" — shows items per column |
| Compact cards | Linear | Title + 1-2 metadata lines, no card bloat |
| Drag indicators | Trello | Visual feedback during drag (shadow, opacity change) |
| Column scroll independence | Linear | Each column scrolls independently |
| Quick-add at column top/bottom | Trello | "+" button to add card without leaving board |

### What to Avoid
- Cards with too much information (3+ lines of text)
- Columns that overflow with no scroll
- Drag-drop that doesn't work on mobile (provide alternatives)
- Fixed column widths that cause horizontal scroll
- No visual feedback during drag operations

### Density Preference
**Medium-high.** Cards should be compact to see more in each column.

---

## Calendar / Schedule

### Reference Products
- **Cal.com** — Clean booking calendar
- **Google Calendar** — Day/week/month views
- **Calendly** — Time slot picker
- **Fantastical** — Natural language event creation

### What to Emulate
| Pattern | From | Description |
|---------|------|-------------|
| View switcher (day/week/month) | Google Calendar | Toggle between views without page reload |
| Drag to create events | Google Calendar | Click and drag on time slots |
| Color-coded event types | Google Calendar | Different colors per category |
| Today indicator | Cal.com | Clear visual indicator for current day/time |

### What to Avoid
- Custom calendar implementations when a library exists
- Month view without ability to see event details
- Fixed time slots that don't match business hours
- No timezone indication

### Density Preference
**Medium.** Depends on view. Month view = high density. Day view = low density.

---

## Settings Page

### Reference Products
- **GitHub** (github.com/settings) — Left sidebar + content area
- **Linear** (settings) — Grouped sections
- **Vercel** (project settings) — Tab-based sections
- **Stripe** (settings) — Clean form groups

### What to Emulate
| Pattern | From | Description |
|---------|------|-------------|
| Settings sidebar/tabs | GitHub | Categories on left, content on right |
| Save per section | Vercel | Each section saves independently |
| Danger zone | GitHub | Destructive settings at bottom, red-bordered |
| Toggle descriptions | Linear | Each setting has a short description |

### What to Avoid
- One giant form for all settings (overwhelming)
- Settings that require page reload to take effect
- Destructive settings mixed with benign ones
- No confirmation for irreversible settings changes

### Density Preference
**Low-medium.** Settings are configured rarely — clarity > density.

---

## Auth Pages (Login / Register)

### Reference Products
- **Clerk** (clerk.com) — Clean, branded auth forms
- **Linear** — Minimal login page
- **Vercel** — Simple, professional
- **Supabase** — Clean auth with social providers

### What to Emulate
| Pattern | From | Description |
|---------|------|-------------|
| Centered card on simple background | Clerk | Logo + form card, no distractions |
| Password visibility toggle | Clerk | Eye icon to show/hide password |
| Error messages inline | Vercel | Below the field, not in a banner |
| Social login buttons (if applicable) | Supabase | Consistent button style for providers |

### What to Avoid
- Split-screen layouts with marketing content (distracting for B2B)
- CAPTCHA unless you have a bot problem
- Password strength meters that are too aggressive
- Registration forms with more than 4 fields

### Density Preference
**Low.** Auth is a one-time action. Make it welcoming and simple.

---

## Chat / Messaging (if applicable)

### Reference Products
- **Slack** — Channel-based messaging
- **Intercom** — Support chat widget
- **Linear** (comments) — Thread-based comments on issues

### What to Emulate
| Pattern | From | Description |
|---------|------|-------------|
| Message grouping by sender | Slack | Consecutive messages from same sender grouped |
| Timestamp on hover | Slack | Compact view, full timestamp on hover |
| Rich text input | Slack | Markdown preview, file attachment |
| Thread replies | Linear | Reply in thread, not inline |

### What to Avoid
- Auto-playing sounds/notifications
- Message bubbles (they're for consumer apps, not B2B)
- No indication of read/unread
- No loading state for message history

### Density Preference
**High.** Messages should be compact with minimal padding.

---

## Summary Table

| Screen Type | Primary Reference | Density | Key Pattern |
|------------|------------------|---------|-------------|
| Dashboard | Vercel + Stripe | Medium | KPI cards + charts + activity |
| List/Table | Stripe + Linear | High | Filters + compact rows + actions |
| Detail | Linear + Stripe | Medium-low | Breadcrumb + two-column + timeline |
| Form | Stripe + Linear | Low | Single column + grouped + inline validation |
| Kanban | Linear + Trello | Medium-high | Compact cards + drag-drop |
| Calendar | Cal.com + Google Calendar | Medium | View switcher + drag-create |
| Settings | GitHub + Linear | Low-medium | Sidebar categories + per-section save |
| Auth | Clerk + Linear | Low | Centered card + minimal fields |
| Chat | Slack + Linear | High | Grouped messages + threads |
