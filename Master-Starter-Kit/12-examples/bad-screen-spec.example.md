# Anti-Example: Bad Screen Spec

> This is a deliberately incomplete screen specification with annotations explaining why each section fails. Use this to understand what depth is missing — and what a real screen spec requires.

**Depth Score: 2/10**

---

## Screen: User Dashboard

### Layout

> The dashboard displays the user's information and recent activity. It has a header with the user's name and a main content area with cards showing their recent tasks.

```
┌─────────────────────────────────────────┐
│  Header: User Name                       │
├─────────────────────────────────────────┤
│                                          │
│   [Task Card]  [Task Card]  [Task Card] │
│                                          │
│   [Task Card]  [Task Card]  [Task Card] │
│                                          │
└─────────────────────────────────────────┘
```

---

**ANNOTATION — WHY THIS FAILS:**

- **Desktop only.** No mobile layout. No tablet layout. No consideration of breakpoints. What happens at 375px wide (iPhone SE)? What happens at 1920px wide? Do the cards reflow? Become a single column? Stack vertically?
- **No dimensions or spacing.** How wide are the cards? What's the gap between them? What's the padding? Without these numbers, every developer will implement different spacing.
- **No typography.** What font size is the user name? What weight? What color? H1 or custom styling?
- **No visual hierarchy.** What's the most important thing on this screen? Where should the user's eye go first? What's the information architecture?
- **No navigation context.** Where is this screen in the app? What's in the sidebar/navbar? How does the user get here? Where can they go from here?
- **Score: 2/10**

**WHAT GOOD LOOKS LIKE:**
```
Layout: Responsive grid
  Desktop (>1024px): 3-column card grid, 24px gap, max-width 1200px centered
  Tablet (768-1024px): 2-column card grid, 16px gap
  Mobile (<768px): single column, full width with 16px horizontal padding

Header Section:
  - Avatar (48px circle, left-aligned)
  - User full name (H1, 24px/32px, font-weight 600, color: gray-900)
  - User role/team (body, 14px/20px, color: gray-500)
  - "Edit Profile" link (right-aligned on desktop, below name on mobile)

Card Grid:
  - Each card: white background, 1px border gray-200, 8px border-radius, 16px padding
  - Card min-height: 120px
  - Card contains: task title (16px, semibold, 2-line clamp), status badge, due date, assignee avatar
  - Cards are tappable — entire card is the click target (not just the title)
```

---

### States

> The dashboard shows the user's tasks.

---

**ANNOTATION — WHY THIS FAILS:**

- **No loading state.** What does the user see while data is fetching? A blank screen? A spinner? Skeleton cards? If there's no loading state defined, users will see a flash of empty content or a layout shift when data arrives.
- **No empty state.** New user with zero tasks — what do they see? An empty grid? A helpful message? An onboarding prompt? Empty states are where you win or lose new users.
- **No error state.** API call fails — what happens? Red banner? Error page? Retry button? "Something went wrong" with no action is hostile UX.
- **No partial state.** What if the user data loads but the tasks fail? Show the header with an error in the card area? Or block the whole screen?
- **No permission state.** What if the user doesn't have access to this dashboard? 403 with redirect? Disabled cards?
- **Score: 0/10** (this section is effectively absent)

**WHAT GOOD LOOKS LIKE:**

```
States:

  1. Loading (first visit, no cache):
     - Header: skeleton rectangle for name (200px × 24px), skeleton circle for avatar
     - Cards: 6 skeleton cards (pulse animation), matching card dimensions
     - Duration: show skeleton for minimum 300ms (prevent flash)

  2. Loaded (happy path):
     - Header: populated with user data
     - Cards: populated with tasks, sorted by due date ascending
     - Transition: skeleton → content with 200ms fade

  3. Empty (no tasks):
     - Header: populated with user data
     - Card area replaced with centered illustration + text:
       Illustration: empty-tasks.svg (200×150px)
       Heading: "No tasks yet"
       Body: "Create your first task to get started"
       CTA: [Create Task] button (primary, medium size)

  4. Error (API failure):
     - Header: show cached user data if available, skeleton if not
     - Card area: error banner
       Icon: warning triangle
       Text: "Couldn't load your tasks"
       Action: [Try Again] button
     - Do NOT navigate away or show a full-page error

  5. Partial error (user loaded, tasks failed):
     - Header: populated (user data succeeded)
     - Card area: error state (as above)
     - This is the most common error state — handle it explicitly

  6. Offline:
     - Show cached data with "Offline — showing cached data" banner
     - Last sync timestamp visible
     - [Refresh when online] indicator
```

---

### Accessibility

*(Section not included in original spec)*

---

**ANNOTATION — WHY THIS FAILS:**

- **No accessibility section at all.** This isn't optional. ~15% of users have some form of disability. Legal requirements (ADA, WCAG) apply.
- **Without a11y annotations, developers won't implement them.** Screen readers won't be able to navigate the dashboard. Keyboard users can't interact with cards. Low-vision users can't read low-contrast text.
- **Score: 0/10**

**WHAT GOOD LOOKS LIKE:**

```
Accessibility:

  Landmarks:
    - Header: role="banner", contains user info
    - Card grid: role="main", aria-label="Your tasks"
    - Each card: role="article", aria-label="{task title}"

  Keyboard Navigation:
    - Tab order: header actions → first card → second card → ...
    - Cards focusable with visible focus ring (2px solid blue-500, 2px offset)
    - Enter/Space on focused card: navigate to task detail
    - Arrow keys within grid: move between cards

  Screen Reader:
    - Card announces: "{task title}, status: {status}, due: {due date}"
    - Empty state announces: "No tasks. Create your first task to get started."
    - Loading state announces: "Loading your tasks" (aria-live="polite")
    - Error state announces: "Error loading tasks. Try again button available." (aria-live="assertive")

  Color & Contrast:
    - All text meets WCAG AA contrast ratio (4.5:1 for body, 3:1 for large text)
    - Status badges: don't rely on color alone — include icon or text label
    - Focus indicators visible on all interactive elements

  Motion:
    - Skeleton pulse animation respects prefers-reduced-motion
    - Card hover effects respect prefers-reduced-motion
```

---

### Interactions

> User clicks a task card and sees the task details. User can also create new tasks.

---

**ANNOTATION — WHY THIS FAILS:**

- **"Clicks and sees" describes nothing.** What does "sees" mean? A modal? A new page? A slide-in panel? Where does the detail appear relative to the dashboard?
- **No interaction details.** Is there a hover state on the cards? A pressed/active state? Do cards have context menus (right-click)?
- **No transition/animation.** How does the task detail appear? Instant? Slide in? Fade? Transitions affect perceived performance.
- **No "create new task" details.** Where is the button? What does it look like? Does it open a modal or navigate to a new page? What are the form fields?
- **No micro-interactions.** Pull to refresh? Drag to reorder? Swipe to complete? Long-press for quick actions?
- **Score: 1/10**

**WHAT GOOD LOOKS LIKE:**

```
Interactions:

  Card Tap/Click:
    - Hover state: slight elevation increase (shadow-md → shadow-lg), 150ms ease
    - Active/pressed: scale(0.98), 100ms ease
    - Action: navigate to /tasks/{task_id} (full page navigation, not modal)
    - Back navigation: browser back returns to dashboard, scroll position preserved

  Create Task:
    - Button location: top-right of card grid area, below header
    - Button style: primary, medium, icon (plus) + text "New Task"
    - Action: opens modal with form (title, description, assignee, due date, priority)
    - Modal: centered, 480px wide, overlay behind, escape to close
    - On submit: modal closes, new card appears at top of grid with subtle highlight animation
    - On cancel: modal closes, no changes

  Card Context Menu (desktop right-click, mobile long-press):
    - Edit task
    - Change status → submenu with status options
    - Assign to → submenu with team members
    - Delete → confirmation dialog

  Pull to Refresh (mobile):
    - Pull down gesture on task list
    - Show refresh indicator
    - Reload tasks from API
    - Minimum 500ms visible (prevent flash)

  Card Status Quick-Toggle:
    - Checkbox on left side of card
    - Tap checkbox: toggle complete/incomplete
    - Optimistic update: immediate visual feedback
    - Completed card: strike-through title, move to bottom of list after 2s delay
```

---

### Data Requirements

*(Section not included in original spec)*

---

**ANNOTATION — WHY THIS FAILS:**

- **No data requirements section.** Developers don't know what API calls to make, what data shape to expect, or how to handle the data lifecycle.
- **Without this, frontend and backend developers work in isolation** and discover integration mismatches at the last minute.
- **Score: 0/10**

**WHAT GOOD LOOKS LIKE:**

```
Data Requirements:

  On Screen Mount:
    1. GET /api/v1/users/me → user profile (name, avatar, role)
       - Cache: 5 minutes, refresh in background
       - Fallback: show cached data if offline

    2. GET /api/v1/workspaces/{id}/tasks?assignee=me&status=active,in_progress&sort=due_date&per_page=20
       - Cache: 1 minute
       - Pagination: infinite scroll, load next page on scroll to bottom
       - Refresh: pull-to-refresh reloads from page 1

  Data Shape (what the card needs):
    {
      id: string,
      title: string (display: 2-line clamp),
      status: "active" | "in_progress" | "review" | "complete",
      priority: "urgent" | "high" | "medium" | "low",
      due_date: ISO 8601 | null (display: "Due Mar 15" or "No due date"),
      assignee: { id, name, avatar_url } | null
    }

  Real-time Updates:
    - Subscribe to WebSocket channel: workspace:{id}:tasks
    - On task_updated event: update card in-place (no full reload)
    - On task_created event: add card to top of list if matches current filters
    - On task_deleted event: remove card with fade-out animation

  Optimistic Updates:
    - Status toggle: update immediately, revert on API failure
    - Task creation: add card immediately with temporary ID, replace with server ID on success
```

---

### Component Breakdown

*(Section not included in original spec)*

---

**ANNOTATION — WHY THIS FAILS:**

- **No component breakdown.** Developers will either build the entire screen as one monolithic component (unmaintainable) or split it differently from each other (inconsistent, duplicate work).
- **Shared components won't be identified.** The task card is probably used on other screens too. Without a component spec, it'll be built differently in each location.
- **Score: 0/10**

**WHAT GOOD LOOKS LIKE:**

```
Component Hierarchy:

  DashboardScreen
  ├── DashboardHeader
  │   ├── UserAvatar (shared component from design system)
  │   ├── UserInfo (name + role)
  │   └── EditProfileLink
  ├── TaskGridToolbar
  │   ├── FilterDropdown (status filter)
  │   ├── SortDropdown (date, priority)
  │   └── CreateTaskButton
  ├── TaskCardGrid
  │   ├── TaskCard (repeated) — SHARED COMPONENT (also used on Project screen)
  │   │   ├── StatusCheckbox
  │   │   ├── TaskTitle
  │   │   ├── TaskMeta (due date + priority badge)
  │   │   └── AssigneeAvatar
  │   ├── TaskCardSkeleton (loading state)
  │   └── EmptyTaskState
  └── ErrorBanner (shared component)

  Shared Components (already in design system):
    - UserAvatar, ErrorBanner, FilterDropdown, SortDropdown, Badge

  New Components (need to be built):
    - TaskCard, TaskCardGrid, DashboardHeader, EmptyTaskState, TaskCardSkeleton
```

---

## Depth Score Breakdown: 2/10

| Section | Score | Weight | Weighted |
|---------|-------|--------|----------|
| Layout | 2/10 | 20% | 0.4 |
| States (loading/empty/error) | 0/10 | 20% | 0.0 |
| Accessibility | 0/10 | 15% | 0.0 |
| Interactions | 1/10 | 15% | 0.15 |
| Data Requirements | 0/10 | 15% | 0.0 |
| Component Breakdown | 0/10 | 15% | 0.0 |
| **Total** | | | **0.55/10 → 2/10 (generous rounding)** |

### Why This Spec Will Cause Problems

A developer receiving this spec will need to:
1. Invent the loading experience (likely: bare spinner → layout shift)
2. Guess what happens on error (likely: nothing, app crashes or shows blank)
3. Skip accessibility entirely (likely: no keyboard support, no screen reader)
4. Assume the navigation pattern (likely: inconsistent with rest of app)
5. Build API integration with assumptions (likely: rework after backend review)
6. Build monolithic component (likely: can't reuse card on other screens)

**Estimated rework from this spec: 40-60% of development time** spent on rework, clarification, and bug fixes that a complete spec would have prevented.

### The Fundamental Error

This spec describes what the screen looks like in the one happy-path scenario where everything works perfectly. Real screens have 5-10 states, dozens of interactions, accessibility requirements, data lifecycle concerns, and responsive layouts. A spec that only covers the happy path covers roughly 20% of what needs to be built.
