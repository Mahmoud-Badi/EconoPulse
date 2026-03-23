# Screen Spec: Projects List — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in screen specification for
# a fictional TaskFlow project. Your screen specs will be generated
# during ORCHESTRATOR Step 6 (Screen Specs & Catalog).
# ============================================================

> **Service:** Projects | **Route:** `/projects` | **Phase:** 1
> **Status:** Built | **Task ID:** PROJ-001

---

## 1. Purpose

The primary landing page for project management. Users see all projects in their workspace, filter by status, search by name, and navigate to project details. This is the most-visited page after the dashboard and serves as the central hub for project managers who typically revisit it 20+ times per day to triage work, check progress, and reassign priorities.

For power users managing large portfolios, the Projects List must feel instant — keyboard-navigable, bulk-actionable, and efficient on the 100th visit, not just the first. For new team members, it must be self-explanatory with clear calls to action and zero-configuration defaults that surface relevant projects immediately.

## 2. URL & Navigation

- **Route:** `/projects`
- **Sidebar:** Projects (icon: FolderKanban)
- **Breadcrumb:** Home > Projects
- **Deep links:** `/projects?status=active`, `/projects?search=acme`, `/projects?sort=dueDate&order=asc`
- **Query params preserved on navigation:** status, search, page, sort, order — all round-trip through the URL so users can bookmark filtered views or share links with teammates

## 3. Data Dependencies

| Data | Source | Caching |
|------|--------|---------|
| Project list (paginated) | `project.list` procedure | TanStack Query, 30s stale time |
| Project counts by status | `project.countByStatus` procedure | TanStack Query, 60s stale time |
| Current user role | Auth context | Session-level |
| Workspace members (for PM display) | `workspace.members` procedure | TanStack Query, 5m stale time |

## 4. Layout

```
┌──────────────────────────────────────────────────────┐
│  Projects                              [+ New Project] │
│                                                        │
│  [All: 24] [Active: 18] [On Hold: 3] [Completed: 3]  │
│                                                        │
│  🔍 Search projects...          [Sort: Updated ▼]     │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ☐ 🟢 Acme Corp Rebrand        PM: Sarah    │→│  │
│  │      8/12 tasks · 64h logged · Due Apr 15       │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ ☐ 🟢 Widget Co App Design     PM: Mike     │→│  │
│  │      3/20 tasks · 12h logged · Due May 01       │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ ☐ 🟡 Internal Tooling         PM: Sarah    │→│  │
│  │      0/5 tasks · 0h logged · No due date        │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  Showing 1-20 of 24               [← 1  2 →]         │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │  [Bulk Action Bar — appears when items selected] │  │
│  │  "3 selected"  [Archive] [Export] [Delete]       │  │
│  └─────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## 5. Component Breakdown

| Component | File | Props |
|-----------|------|-------|
| ProjectsPage | `app/(dashboard)/projects/page.tsx` | — (server component) |
| ProjectListClient | `components/projects/project-list-client.tsx` | `initialData` |
| ProjectCard | `components/projects/project-card.tsx` | `project, isSelected, onSelect, onStatusChange` |
| StatusFilterTabs | `components/projects/status-filter-tabs.tsx` | `counts, activeStatus, onChange` |
| ProjectSearchBar | `components/projects/project-search-bar.tsx` | `value, onChange` |
| NewProjectButton | `components/projects/new-project-button.tsx` | — |
| Pagination | `packages/ui/src/components/pagination.tsx` | `page, totalPages, onChange` |
| BulkActionBar | `components/projects/bulk-action-bar.tsx` | `selectedCount, onArchive, onExport, onDelete` |
| ProjectCardSkeleton | `components/projects/project-card-skeleton.tsx` | `count` |
| EmptyProjectsState | `components/projects/empty-projects-state.tsx` | `isFiltered, onClearFilters, onCreateProject` |
| InlineStatusEditor | `components/projects/inline-status-editor.tsx` | `currentStatus, projectId, onUpdate` |

## 6. States

| State | Trigger | Display |
|-------|---------|---------|
| Loading | Initial fetch or hard navigation | Skeleton cards (8 rows with pulsing column placeholders matching the card layout — project name bar, status dot, metadata line). No spinner. Skeleton layout matches the populated state so the transition feels seamless. |
| Empty (first-time user) | No projects exist in workspace | Centered illustration (empty folder graphic) with headline "Create your first project" and a prominent blue CTA button. Below the button, three bullet points: "Track tasks and deadlines across your team," "See progress at a glance with status filters," and "Collaborate with real-time updates." Also includes a secondary link: "Or start from a template" which opens the template picker with 5 starter project templates (Marketing Campaign, Product Launch, Sprint, Client Onboarding, Event Planning). On the user's very first visit, an onboarding tooltip points to the New Project button in the header: "Start here — create a project to organize your team's work." |
| Empty filtered | Search or filter returns 0 results | "No projects match your filters" message with active filter chips displayed below (e.g., "Status: Active", "Search: acme") plus a "Clear all filters" link. The search text is preserved in the input so users can modify rather than retype. |
| Error | API failure (500, timeout, network error) | Error banner at the top of the content area with the specific message ("Failed to load projects — our servers are having trouble") plus a "Retry" button. Previously loaded data remains visible below the banner rather than being replaced — users can still see stale data while the system recovers. |
| Loaded | Data successfully returned | Project cards rendered with pagination controls. Each card shows: status dot, project name, PM name, task progress fraction, hours logged, and due date. Cards have a subtle hover state (shadow lift + right chevron highlight). |
| Searching | User types in search input (debounced 300ms) | A shimmer overlay appears on the card list area while the debounced search request is in flight. The search input retains focus and shows a small spinner indicator at the right edge. Scroll position is preserved. When results return, matching text in project names is highlighted with a yellow background span. If the user clears the search, the original unfiltered list is restored from the TanStack Query cache instantly without a new network request. |
| Bulk selection | User checks one or more project checkboxes | A floating action bar slides up from the bottom of the viewport (sticky positioned, z-index above content). The bar shows the count ("3 selected") and action buttons: Archive, Export (CSV), Delete. Clicking outside the bar or pressing Escape deselects all and dismisses the bar. A "Select all on this page" checkbox appears in the list header. The action bar uses a subtle entrance animation (slide up + fade in, 200ms ease-out). |
| Network offline | Browser loses connectivity (detected via `navigator.onLine` and `online`/`offline` events) | A yellow warning banner appears at the top of the page: "You're offline — changes will sync when reconnected." All project cards remain visible (read-only from cache), but action buttons (New Project, Archive, Delete, status changes) are visually disabled with `aria-disabled="true"` and show a tooltip "Unavailable offline" on hover. When connectivity resumes, the banner auto-dismisses with a brief green "Back online" flash, and stale data is automatically refetched. |
| Session expired | Auth token expires or returns 401 | A modal overlay appears centered on the page: "Your session has expired" with a "Sign in to continue" button. The modal is non-dismissible (no close button, no click-outside-to-close). The current page state (scroll position, active filters, search text, selected items) is serialized to sessionStorage before the redirect, so it can be restored after re-authentication. The background is dimmed but the project list remains partially visible behind the overlay. |

## 7. Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| Click project card | Card click (not on checkbox or status badge) | Navigate to `/projects/[id]`. Navigation uses Next.js Link with prefetch for instant transition. The clicked card gets a brief press animation (scale 0.98) before navigation. |
| Click "New Project" | Button click | Navigate to `/projects/new`. Button only rendered for Admin and PM roles. |
| Type in search | Input change (debounced 300ms) | Filter list via API call with search param, update URL params. Stale requests are cancelled via AbortController when new keystrokes arrive. Result count updates in real-time with `aria-live="polite"` announcement. |
| Click status tab | Tab click | Filter list by status, update URL params, reset to page 1. Tab shows active state (underline + bold). Count badges update after the filtered results return. |
| Change sort | Dropdown change | Re-sort list via API, update URL params. Sort preference is persisted to sessionStorage so it survives navigation away and back. Available sorts: Updated (default), Name A-Z, Name Z-A, Due Date (ascending), Created (newest first). |
| Click pagination | Page button | Fetch page, smooth scroll to top of list (not page top — the filter bar stays visible). Current page is reflected in URL. |
| Toggle project checkbox | Checkbox click | Add/remove project from selection set. Shift+click selects a range (from last selected to current). Updates the bulk action bar count. |
| Click bulk action | Action bar button click | Archive: optimistic update, move cards out with fade animation, show undo toast for 5s. Export: triggers CSV download of selected projects with all metadata. Delete: shows confirmation dialog "Delete 3 projects? This will also delete all tasks and time entries. This cannot be undone." with red Delete and gray Cancel buttons. |
| Inline status edit | Click status badge on a project card (hover reveals pencil icon) | Opens a small dropdown anchored to the badge showing all statuses (Active, On Hold, Completed, Archived). Selecting a status performs an optimistic update — the badge color changes immediately. If the API call fails, the badge reverts to its previous color and a toast shows "Failed to update status — please try again." |
| Keyboard shortcut: N | Press `N` key (when no input is focused) | Opens `/projects/new` (same as clicking New Project button). Only works for Admin and PM roles. |
| Keyboard shortcut: / | Press `/` key (when no input is focused) | Focuses the search input with cursor at end of any existing text. |
| Keyboard shortcut: J/K | Press `J` (next) or `K` (previous) when focus is in the list area | Moves visual focus highlight between project cards. Pressing Enter on a focused card navigates to it. This follows Vim-style navigation familiar to power users. |

## 8. Permissions

| Action | Admin | Project Manager | Team Member |
|--------|-------|----------------|-------------|
| View project list | Yes | Yes | Yes (assigned only) |
| Create project | Yes | Yes | No |
| Filter/search | Yes | Yes | Yes |
| Bulk archive | Yes | Yes | No |
| Bulk delete | Yes | No | No |
| Bulk export | Yes | Yes | Yes (assigned only) |
| Inline status edit | Yes | Yes (own projects) | No |

## 9. Responsive Behavior

- **Desktop (>1024px):** Full card layout with all fields visible — status, name, PM, task count, hours, due date, checkbox. Hover actions (status edit pencil, chevron) visible on mouse over. Bulk action bar spans full width at bottom.
- **Tablet (768-1024px):** Cards stack vertically, project manager name abbreviated to initials. Search bar and sort dropdown stack vertically below the status tabs. Bulk action bar remains at bottom with condensed button labels (icons only on smaller tablets).
- **Mobile (<768px):** Compact card showing name, status dot, and due date only. Hours and task count hidden. Tap card to navigate (no hover interactions). Checkboxes hidden — bulk actions unavailable on mobile. Search input is collapsed to a magnifying glass icon that expands on tap. Pagination switches to "Load more" infinite scroll pattern. Sort accessible via a bottom sheet triggered by a sort icon.

## 10. Edge Cases

| Edge Case | Scenario | Handling |
|-----------|----------|----------|
| Extremely large project count | User has 1,000+ projects across many statuses | The project list uses cursor-based pagination (not offset-based) to avoid performance degradation at high page numbers. The count-by-status query runs as a separate lightweight query so the status tabs render quickly even when the full list is still loading. If the total count exceeds 500, the status tab counts display "500+" rather than exact numbers to avoid slow COUNT queries. Virtual scrolling is considered for future enhancement but deferred in favor of pagination for v1. |
| Session expires during filter operation | User applies a filter, but their auth token has expired since last action | The 401 response triggers the session-expired modal. Before redirecting to login, the current filter state (status tab, search text, sort preference, page number) is serialized to sessionStorage under the key `taskflow:projects:savedState`. On successful re-auth, the projects page reads this key and restores the exact filter state, then clears the key. The user returns to exactly where they left off. |
| Real-time teammate creation | A teammate creates a new project while the current user is viewing the list | TanStack Query's 30-second stale time means the list will refresh within 30 seconds. Additionally, the app listens for WebSocket events on the `project:created` channel. When received, a subtle toast appears at the top: "Sarah created a new project — Refresh to see it" with a "Refresh" link that invalidates the query cache. The list does not auto-refresh to avoid disrupting the user's current scroll position or selection state. |
| Sorting with missing due dates | User sorts by due date, but some projects have no due date set | Projects without a due date are sorted to the end of the ascending list (treated as "infinity") and to the beginning of the descending list. The sort dropdown label changes to "Due Date (soonest)" / "Due Date (latest)" to clarify the direction. In the card, projects without a due date display "No due date" in gray italic text rather than leaving the field blank. |
| Rapid filter changes | User clicks multiple status tabs in quick succession or types rapidly in search | Each new request cancels the previous in-flight request using AbortController. A request ID is tracked so that if a slow early request completes after a fast later request, the stale response is discarded. The UI shows the shimmer overlay as long as any request is in flight, and only commits results from the most recent request. The search input uses a 300ms debounce to avoid firing on every keystroke, and the debounce timer resets on each new keystroke. |
| Permission boundary on view | Team member navigates to `/projects` but has no project assignments yet | Instead of showing the generic empty state, the system detects the user's role and shows a role-specific message: "You'll see projects here once a project manager adds you to a team. In the meantime, check out your Tasks." with a link to `/tasks`. This avoids confusion where a team member thinks the workspace has no projects. |
| Browser back/forward navigation | User navigates to a project detail page and then clicks the browser back button | The projects list restores from the TanStack Query cache (no loading flash), and the scroll position is restored via Next.js scroll restoration. The previously active filters, search text, and sort order are all restored from the URL query params. |

## 11. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Keyboard navigation | All project cards are focusable via Tab key. Enter opens the focused project. Escape deselects all selected projects and dismisses the bulk action bar. Arrow keys navigate within the status filter tabs. The entire page is navigable without a mouse. |
| ARIA labels and roles | The project list container has `role="list"` and each card has `role="listitem"`. Status filter tabs use `role="tablist"` with each tab having `role="tab"` and `aria-selected`. The search input has `aria-label="Search projects"`. The result count element ("Showing 1-20 of 24") has `aria-live="polite"` so screen readers announce count changes when filters are applied. The bulk action bar has `aria-label="Bulk actions for selected projects"`. |
| Focus management | Visible focus rings on all interactive elements (2px blue outline with 2px offset for contrast). A skip-to-content link is the first focusable element on the page, jumping past the sidebar to the project list. After a dialog closes (delete confirmation, template picker), focus returns to the element that triggered the dialog. After bulk deletion, focus moves to the first remaining project card. |
| Color contrast | Status colors meet WCAG AA contrast requirements (4.5:1 minimum ratio against the card background): Active green (#16a34a on white = 4.6:1), On Hold amber (#d97706 on white = 4.7:1), Completed blue (#2563eb on white = 4.6:1). Status is never conveyed by color alone — each status also has a text label and distinct icon shape (circle for active, pause for on hold, checkmark for completed). |
| Screen reader announcements | When a filter is applied, the result count is announced: "18 active projects." When a bulk action completes, the result is announced: "3 projects archived." When inline status is changed, the change is announced: "Acme Corp Rebrand status changed to On Hold." Loading states announce "Loading projects" and completion announces "Projects loaded, showing 20 results." |

## 12. What Makes This Screen Delightful

This section captures the details that elevate the Projects List from functional to a pleasure to use daily.

- **Instant search with text highlighting:** Search results appear as the user types (after a 300ms debounce), and matching characters in project names are highlighted with a soft yellow background. This gives immediate visual confirmation that the right results are showing, and makes it trivially fast to find a project in a long list.
- **Smooth card hover animations:** Project cards lift with a subtle box-shadow transition (150ms ease) on hover, and the right-arrow chevron slides 4px right. This micro-interaction communicates clickability without being distracting.
- **Optimistic status updates:** When a user clicks a status badge and selects a new status, the badge color and label update immediately without waiting for the server response. If the server request fails, the badge smoothly reverts to its previous state and a toast explains the error. This makes the interface feel responsive even on slow connections.
- **Smart sort persistence:** The user's last-selected sort option is stored in sessionStorage per browser tab. Navigating away to a project detail page and back restores the exact sort, so power users do not have to re-apply their preferred sort order on every visit.
- **Satisfying bulk operations:** Selecting multiple projects and archiving them triggers a staggered card fade-out animation (each card fades out 50ms after the previous), followed by the remaining cards sliding up to fill the gaps. An undo toast appears for 5 seconds, making the action feel safe and reversible.
- **Quick keyboard access:** Power users can press `/` to jump to search, `N` to create a new project, and `J`/`K` to navigate up and down the list — all without touching the mouse. These shortcuts are discoverable via a small "?" shortcut help tooltip in the page footer.

## 13. Daily Use Patterns

Different user personas interact with this screen in distinct patterns, and the design accommodates each:

- **Power user (PM with 50+ projects):** This user visits the Projects List 20-30 times per day. They rely on keyboard shortcuts (`/` to search, `J`/`K` to navigate, `N` to create) and rarely touch the mouse. They use the status tabs as a quick dashboard — glancing at the counts to see how many projects are Active vs. On Hold. They frequently use bulk selection to archive completed projects at the end of each week. Smart sort persistence means their preferred "Due Date (soonest)" sort is always pre-applied. The 300ms search debounce is fast enough to feel instant but slow enough to avoid wasted API calls during rapid typing.
- **Manager (executive or team lead):** This user checks the Projects List 2-3 times per day as a status overview. They primarily use the status filter tabs to scan Active projects, then click into specific projects for detail. They value the count badges on each tab as a high-level health indicator — if the "On Hold" count spikes, something needs attention. They occasionally use bulk export to pull a CSV of all active projects for their weekly status report. They rarely create projects directly, delegating that to PMs.
- **New team member:** This user lands on the Projects List for the first time and sees only the projects they have been assigned to (filtered by their Team Member role). If they have no assignments yet, they see the role-specific empty state with a link to their Tasks page. If they have assignments, the default "Updated" sort surfaces the most recently active projects at the top, giving them an immediate sense of what is currently in motion. The onboarding tooltip on first visit points them to the search bar and status tabs, reducing the learning curve.

## 14. Acceptance Criteria

- [ ] `/projects` renders the project list with cursor-based pagination (20 per page)
- [ ] Status filter tabs show correct counts and filter the list
- [ ] Search filters by project name (debounced 300ms) with text highlighting on matches
- [ ] Sort by: Updated (default), Name A-Z, Name Z-A, Due Date (soonest/latest), Created (newest)
- [ ] Sort preference persists in sessionStorage and restores on return navigation
- [ ] "New Project" button visible only for Admin and PM roles
- [ ] Team Members see only projects they are assigned to
- [ ] All 9 states implemented: loading (skeleton), empty (first-time), empty (filtered), error, loaded, searching, bulk selection, network offline, session expired
- [ ] Bulk selection: checkboxes on cards, shift+click range select, floating action bar with Archive, Export, Delete
- [ ] Inline status editing: click status badge to change, optimistic update with revert on failure
- [ ] Keyboard shortcuts: `/` to focus search, `N` for new project, `J`/`K` to navigate cards, Enter to open, Escape to deselect
- [ ] URL reflects current filters (`?status=active&search=acme&page=2&sort=dueDate&order=asc`)
- [ ] Accessibility: `role="list"` on project list, `aria-live="polite"` on result count, visible focus rings, skip-to-content link
- [ ] Color contrast meets WCAG AA (4.5:1 ratio) for all status colors
- [ ] Responsive: desktop full layout, tablet stacked with initials, mobile compact with load-more scroll
- [ ] Edge cases handled: 1000+ projects, missing due dates in sort, rapid filter cancellation, teammate real-time creation toast, session expiry state preservation
- [ ] TypeScript compiles, lint passes, no console errors
