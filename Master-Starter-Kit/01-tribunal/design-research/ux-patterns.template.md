# UX Patterns by Screen Type

> **Date:** [YYYY-MM-DD]
> **Products Analyzed:** [List of reference products]
> **Screen Types Covered:** [N]

---

## Purpose

This catalog documents the UX pattern chosen for each screen type in the application. Instead of making ad-hoc decisions during development ("should this list page have pagination or infinite scroll?"), every screen type has a pre-decided pattern with rationale.

During development, a developer building a new list page should be able to look up "List View" in this document and immediately know the expected layout, interaction model, and mobile adaptation.

---

## List View (Data Table)

**Used for:** Trips list, invoices list, drivers list, vehicles list, facilities list, users list

| Aspect | Pattern | Reference Product | Rationale |
|--------|---------|------------------|-----------|
| **Layout** | [Full-width table with sticky header] | [Airtable] | [Maximizes row visibility for power users who scan 100+ items] |
| **Columns** | [Configurable — user can show/hide and reorder columns] | [Notion] | [Different users need different columns; dispatcher needs status + driver, billing needs amount + due date] |
| **Sorting** | [Click column header to sort; Shift+click for multi-sort] | [Airtable] | [Single-sort covers 90% of cases; multi-sort for power users] |
| **Filtering** | [Filter bar above table with faceted filters (status, date range, assignee)] | [Linear] | [Quick access to common filters without opening a panel] |
| **Search** | [Global text search across all visible columns] | [Notion] | [Fast discovery when user knows what they're looking for] |
| **Selection** | [Checkbox on each row, select-all in header, bulk action bar appears when selected] | [Gmail] | [Bulk operations (assign, update status, delete) are essential for operational efficiency] |
| **Row Actions** | [Primary action (view/edit) on row click; secondary actions via "..." overflow menu] | [Linear] | [Click to view is natural; "..." for rare actions (duplicate, archive, delete)] |
| **Pagination** | [Page-based with page size selector (25/50/100) and total count] | [Stripe] | [Predictable navigation; user knows exactly where they are in the dataset] |
| **Empty State** | [Illustration + "No [items] found" + CTA button ("Create your first trip")] | [Stripe] | [Guide the user; don't leave them staring at a blank table] |
| **Loading State** | [Skeleton rows (5 rows of gray shimmer) matching table layout] | [Linear] | [Preserves layout stability; feels faster than a centered spinner] |

### Mobile Adaptation

| Approach | When Screen Width < 640px |
|----------|--------------------------|
| [Card layout replacing table rows] | [Each row becomes a card with key fields (title, status, date) and tap to expand/view detail] |
| [Horizontal scroll (alternative)] | [Show first 3 columns, allow horizontal scroll for rest — less elegant but preserves data density] |

---

## Detail View (Single Record)

**Used for:** Trip detail, driver profile, vehicle detail, invoice detail, facility detail

| Aspect | Pattern | Reference Product | Rationale |
|--------|---------|------------------|-----------|
| **Layout** | [Two-column: main content (left 60%) + sidebar (right 40%)] | [GitHub issue detail] | [Main content shows entity details; sidebar shows metadata, actions, related items] |
| **Header** | [Breadcrumb + title + status badge + primary action buttons] | [Linear] | [User always knows where they are and can act immediately] |
| **Sections** | [Collapsible sections with clear headings (Details, Activity, Related Items)] | [Stripe] | [Progressive disclosure — show key info first, expand for more] |
| **Activity Log** | [Chronological timeline with status changes, notes, and actions] | [GitHub] | [Full audit trail; who did what, when] |
| **Actions** | [Primary CTA in header (e.g., "Assign Driver"); secondary actions in sidebar or overflow] | [Vercel] | [Most important action is always visible; secondary actions are accessible but not distracting] |
| **Edit Mode** | [Inline editing for simple fields; slide-over panel for complex edits] | [Notion] | [Click a field to edit it in-place; avoid full page form for minor changes] |
| **Related Records** | [Compact list in sidebar with links (e.g., "Related Invoices", "Assigned Driver")] | [Stripe] | [Quick navigation between related entities without leaving context] |
| **Loading State** | [Skeleton matching the two-column layout] | [Vercel] | [Content-specific skeleton prevents layout shift] |

### Mobile Adaptation

| Approach | When Screen Width < 640px |
|----------|--------------------------|
| [Single column, sidebar content moves below main content] | [Header + details + activity + sidebar content stacked vertically; sticky action bar at bottom for primary CTA] |

---

## Form View (Create / Edit)

**Used for:** Create trip, edit driver, create invoice, settings forms

| Aspect | Pattern | Reference Product | Rationale |
|--------|---------|------------------|-----------|
| **Layout** | [Centered card (max-width 680px) with clear sections] | [Stripe] | [Constrained width improves readability; prevents labels from being too far from inputs on wide screens] |
| **Sections** | [Group related fields with section headings and optional description] | [Vercel settings] | [Chunking reduces cognitive load; user processes one section at a time] |
| **Labels** | [Above input (not beside, not floating)] | [Tailwind UI] | [Above-input labels are most accessible, work on all screen sizes, and are fastest to scan] |
| **Validation** | [On blur for individual fields; on submit for cross-field validation] | [Typeform] | [Immediate feedback without interrupting typing; final check catches complex rules] |
| **Error Display** | [Inline below field in red with specific message ("Email must include @")] | [Stripe] | [Errors next to the problem field; specific enough to fix without guessing] |
| **Required Fields** | [Mark optional fields as "(optional)" — all others are assumed required] | [Luke Wroblewski research] | [Most fields are required; marking the minority (optional) is cleaner] |
| **Progressive Disclosure** | [Advanced options collapsed by default with "Show advanced" toggle] | [GitHub] | [Keep the form short for typical cases; power users expand when needed] |
| **Submission** | [Primary button at bottom ("Create Trip"); disabled during submission with loading state] | [Standard] | [Clear CTA; prevents double-submission] |
| **Cancel** | [Secondary button next to submit; or "X" in panel header if slide-over] | [Standard] | [Always provide an escape route; unsaved changes prompt if form is dirty] |

### Mobile Adaptation

| Approach | When Screen Width < 640px |
|----------|--------------------------|
| [Full-width form, sticky submit button at bottom] | [Form fills screen width; submit button is always reachable; sections scroll naturally] |

---

## Dashboard View

**Used for:** Main dashboard, operational overview, financial summary

| Aspect | Pattern | Reference Product | Rationale |
|--------|---------|------------------|-----------|
| **Layout** | [KPI cards at top (4-6 cards in a row) + charts below (2-column grid) + activity feed at bottom] | [Stripe Dashboard] | [KPIs give instant health check; charts show trends; activity shows recent events] |
| **KPI Cards** | [Metric name, large number, trend indicator (arrow + percentage), sparkline (optional)] | [Datadog] | [At-a-glance operational health. Trend shows whether things are getting better or worse.] |
| **Charts** | [2-3 charts max per view; line chart for trends, bar chart for comparisons, donut for composition] | [Stripe] | [More than 3 charts causes "dashboard fatigue." Each chart must answer a specific question.] |
| **Time Range** | [Global time range selector (Today / 7d / 30d / 90d / Custom)] | [Vercel Analytics] | [All dashboard data respects the same time range for consistency] |
| **Refresh** | [Auto-refresh for operational dashboards (30s-60s); manual refresh for reporting dashboards] | [Datadog] | [Operational users need real-time; reporting users need stable data to analyze] |
| **Drill-down** | [Click KPI card or chart to navigate to filtered list view] | [Stripe] | [Dashboard is the entry point; details are one click away] |
| **Empty State** | [Show KPI cards with 0 values and "Start by creating..." guidance] | [Stripe] | [Don't hide the dashboard when empty — show the structure with guidance] |
| **Loading State** | [Skeleton cards and skeleton charts matching final layout] | [Vercel] | [User sees the dashboard shape immediately; data fills in progressively] |

### Mobile Adaptation

| Approach | When Screen Width < 640px |
|----------|--------------------------|
| [KPI cards stack 2-per-row; charts full-width; activity feed as scrollable list] | [Prioritize KPIs at top; charts may be hidden behind "View Charts" toggle if space is tight] |

---

## Kanban Board View

**Used for:** Dispatch board, task management, pipeline views

| Aspect | Pattern | Reference Product | Rationale |
|--------|---------|------------------|-----------|
| **Layout** | [Horizontal columns, each representing a status/stage, scrollable horizontally] | [Trello, Linear] | [Visual workflow mapping — items move left to right through stages] |
| **Columns** | [One per status (e.g., Unassigned / Assigned / En Route / Completed)] | [Linear] | [Match the data model's status field to visual columns] |
| **Cards** | [Compact card with key info (title, assignee avatar, time, status badge)] | [Linear] | [Scannable at a glance; enough info to identify without opening detail] |
| **Drag & Drop** | [Drag card between columns to change status; drag within column to reorder] | [Trello] | [Direct manipulation is faster than dropdown menus for status changes] |
| **Card Limit** | [Show count per column; warn if column exceeds WIP limit] | [Jira] | [Prevent bottlenecks; make overloaded stages visible] |
| **Quick Actions** | [Hover card for quick action buttons (assign, priority, open detail)] | [Linear] | [Reduce clicks for common actions] |
| **Filtering** | [Filter by assignee, priority, or date above the board] | [Linear] | [Dispatchers need to focus on specific drivers or time windows] |
| **Loading State** | [Skeleton columns with placeholder cards] | [Trello] | [Show board structure immediately] |

### Mobile Adaptation

| Approach | When Screen Width < 640px |
|----------|--------------------------|
| [Single column with status tabs at top; swipe between columns] | [Mobile screens can't show multiple columns side-by-side; tabs let user focus on one status at a time] |

---

## Calendar View

**Used for:** Schedule overview, recurring trip calendar, maintenance scheduling

| Aspect | Pattern | Reference Product | Rationale |
|--------|---------|------------------|-----------|
| **Layout** | [Month view default with day/week toggle] | [Google Calendar] | [Month gives overview; day/week for detailed scheduling] |
| **Events** | [Color-coded blocks with title; click to expand detail] | [Cal.com] | [Color = category/status; compact enough to show multiple events per day] |
| **Navigation** | [Today button + prev/next arrows + month/year selector] | [Google Calendar] | [Standard calendar navigation users expect] |
| **Creation** | [Click empty time slot to create; drag to set duration] | [Google Calendar] | [Direct manipulation reduces form filling] |
| **Conflict Detection** | [Highlight overlapping events with warning color] | [Calendly] | [Scheduling conflicts are the #1 calendar-related error to prevent] |

### Mobile Adaptation

| Approach | When Screen Width < 640px |
|----------|--------------------------|
| [List view by default on mobile (today's events); calendar icon to toggle month view] | [Calendar grids are too small on mobile; list of today's items is more usable] |

---

## Settings View

**Used for:** Account settings, organization settings, notification preferences, integrations

| Aspect | Pattern | Reference Product | Rationale |
|--------|---------|------------------|-----------|
| **Layout** | [Left sidebar tabs + right content area] | [Vercel Settings, GitHub Settings] | [Settings have many sections; sidebar provides clear navigation] |
| **Sections** | [Each tab shows a card-based form with section headings] | [Stripe] | [Group related settings; each section is independently saveable] |
| **Save Behavior** | [Per-section save button (not global save)] | [Vercel] | [User knows exactly which changes are being saved] |
| **Dangerous Actions** | [Separated at bottom with red border; require confirmation] | [GitHub] | ["Delete organization" should never be one click away from "Update name"] |
| **Reset** | [Cancel button or "Reset to defaults" where applicable] | [Standard] | [Undo support for settings changes] |

### Mobile Adaptation

| Approach | When Screen Width < 640px |
|----------|--------------------------|
| [Sidebar becomes top tabs or a dropdown selector; content fills full width] | [Nested navigation on mobile uses standard patterns like top tabs] |

---

## Chat / Messaging View

**Used for:** Driver communication, internal messaging, support chat

| Aspect | Pattern | Reference Product | Rationale |
|--------|---------|------------------|-----------|
| **Layout** | [Three-pane: conversation list (left) + message thread (center) + detail panel (right, optional)] | [Slack] | [Quick conversation switching; full thread visibility; context in detail panel] |
| **Messages** | [Bubble layout with avatar, name, timestamp, content] | [Slack, iMessage] | [Universal messaging pattern users understand] |
| **Input** | [Bottom-anchored input with rich text support (optional) and file attachment] | [Slack] | [Standard chat input position] |
| **Notifications** | [Unread count badge on conversation list items] | [Standard] | [Clear indication of what needs attention] |

### Mobile Adaptation

| Approach | When Screen Width < 640px |
|----------|--------------------------|
| [Conversation list is full-screen; tapping opens thread full-screen; back button to return] | [Standard mobile messaging pattern (iMessage, WhatsApp)] |

---

## Auth Views (Login / Register / Reset)

**Used for:** Login, registration, password reset, invite acceptance

| Aspect | Pattern | Reference Product | Rationale |
|--------|---------|------------------|-----------|
| **Layout** | [Centered card on subtle background; logo at top; form below] | [Clerk, Vercel] | [Focus entirely on the auth action; no distracting navigation] |
| **Form Width** | [Max 400px] | [Stripe] | [Narrow form is easier to scan and complete] |
| **Social Auth** | [Social buttons above form with "OR" divider] | [Clerk] | [Fastest path first; email/password as fallback] |
| **Errors** | [Inline below fields + general error alert at top for server errors] | [Auth0] | [Specific errors help users self-correct] |
| **Password** | [Show/hide toggle; strength indicator on registration] | [1Password] | [Reduce password entry frustration; encourage strong passwords] |
| **Loading** | [Button shows spinner and disables during submission] | [Standard] | [Prevent double-submission; indicate progress] |

### Mobile Adaptation

| Approach | When Screen Width < 640px |
|----------|--------------------------|
| [Full-screen form, no sidebar/decoration; auto-focus first input; large touch targets] | [Auth is often the first mobile interaction; must be flawless] |

---

## Pattern Decision Log

Record any debates or trade-offs about patterns that came up during design research:

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| [e.g., Table pagination style] | [Infinite scroll vs. page numbers vs. load-more] | [Page numbers] | [Power users need to jump to specific pages; infinite scroll loses position on navigation back] |
| [Decision] | [Options] | [Chosen] | [Why] |
| [Decision] | [Options] | [Chosen] | [Why] |
| [Decision] | [Options] | [Chosen] | [Why] |

---

*This catalog feeds into proceedings/round-3-design.template.md and 07-ui-design-system/*
