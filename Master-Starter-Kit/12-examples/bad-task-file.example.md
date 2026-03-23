# Anti-Example: Bad Task File

> This is a deliberately vague task file with annotations explaining why each element fails. Use this to understand what makes a task unworkable — and what a developer actually needs to start coding confidently.

**Depth Score: 2/10**

---

## Task: Implement User Dashboard

**Status:** To Do
**Assigned to:** Developer
**Estimated time:** A few hours
**Priority:** High

---

**ANNOTATION — WHY THE HEADER FAILS:**

- **"Assigned to: Developer"** — Which developer? On a team of 5, this is assigned to nobody. Use a name or handle.
- **"Estimated time: A few hours"** — This is not an estimate, it's a wish. "A few" could be 2 or 8. Without a real estimate, sprint planning is impossible. A task that says "a few hours" routinely takes 2-3 days because scope wasn't understood.
- **No task ID or reference number.** Can't link this to a PR, a sprint board, or a conversation.
- **No creation date or due date.** When was this written? When must it be done?
- **Score: 2/10**

**WHAT GOOD LOOKS LIKE:**
```
Task ID: TASK-142
Title: Implement User Dashboard — task card grid with status filtering
Status: To Do
Assigned to: @sarah
Created: 2024-01-10
Due: 2024-01-17 (Sprint 14)
Estimated: 13 story points (~3 days development + 1 day testing)
Priority: High (blocks TASK-155: dashboard analytics)
```

---

### Description

> Build the user dashboard page. It should show the user's tasks and look nice.

---

**ANNOTATION — WHY THIS FAILS:**

- **"Show the user's tasks"** — Which tasks? All tasks ever? Only active ones? Only assigned to the current user? Sorted how? Paginated? This single ambiguity could mean the difference between a 2-hour and a 2-day task.
- **"Look nice"** — This is not a design specification. "Nice" is subjective. Without a design mockup, component specs, or at minimum a reference to the design system, the developer will build whatever they personally think looks nice — and then rebuild it when design review rejects it.
- **No link to the screen spec, design file, or requirements document.** The developer has to hunt for context or build on assumptions.
- **Score: 1/10**

**WHAT GOOD LOOKS LIKE:**
```
Description:
  Build the User Dashboard screen per the screen spec in docs/screens/dashboard.md

  The dashboard displays the authenticated user's active and in-progress tasks
  in a responsive card grid (3-col desktop, 2-col tablet, 1-col mobile).

  Design: Figma link — figma.com/file/xxx/Dashboard (approved by design on Jan 8)
  Screen spec: docs/screens/dashboard.md
  API spec: docs/api/tasks.md (endpoints: GET /tasks, PATCH /tasks/:id)
```

---

### Acceptance Criteria

> - Feature works correctly
> - Code is clean
> - No bugs

---

**ANNOTATION — WHY THIS FAILS:**

- **"Feature works correctly"** — This is the most meaningless acceptance criterion possible. Every developer believes their code works correctly. Without specific, testable criteria, "works correctly" is in the eye of the beholder. QA can't test against this. Product can't verify against this.
- **"Code is clean"** — Subjective. Clean by whose standard? Does this mean no linting errors? Follows the team's style guide? Has comments? No comments? This criterion guarantees a code review argument.
- **"No bugs"** — This is aspirational, not a criterion. All software has bugs. Acceptance criteria should define specific behaviors that can be verified, not the absence of all problems.
- **Not a single criterion is testable.** A QA engineer receiving this has zero test cases to write.
- **Score: 0/10**

**WHAT GOOD LOOKS LIKE:**
```
Acceptance Criteria:

  Layout & Responsiveness:
    - [ ] Dashboard renders at 375px (mobile), 768px (tablet), 1280px (desktop) without overflow
    - [ ] Card grid reflows: 1 column on mobile, 2 on tablet, 3 on desktop
    - [ ] Header shows user avatar (48px), full name, and role

  Data & Loading:
    - [ ] Tasks load from GET /api/v1/workspaces/{id}/tasks?assignee=me&status=active,in_progress
    - [ ] Loading state shows 6 skeleton cards (pulse animation)
    - [ ] Empty state shows illustration + "No tasks yet" + "Create Task" CTA
    - [ ] Error state shows "Couldn't load tasks" banner with "Try Again" button
    - [ ] Pagination: loads next 20 tasks on scroll to bottom

  Interactions:
    - [ ] Clicking a task card navigates to /tasks/{id}
    - [ ] Back button returns to dashboard with scroll position preserved
    - [ ] Status checkbox toggles complete/incomplete with optimistic update
    - [ ] "New Task" button opens creation modal

  Accessibility:
    - [ ] All cards keyboard-navigable with visible focus ring
    - [ ] Screen reader announces card content (title, status, due date)
    - [ ] Color contrast meets WCAG AA (4.5:1)

  Performance:
    - [ ] Initial render < 500ms (measured with React Profiler)
    - [ ] Skeleton shown for minimum 300ms (prevent flash)
```

---

### File Paths

*(Section not included)*

---

**ANNOTATION — WHY THIS FAILS:**

- **No file paths at all.** The developer doesn't know where to create the component. Should it be `src/pages/Dashboard.tsx`? `src/screens/Dashboard/index.tsx`? `app/(dashboard)/page.tsx`?
- **Without file paths, developers create files in inconsistent locations.** One developer puts screens in `pages/`, another in `views/`, another in `screens/`. The codebase becomes a maze.
- **No mention of existing files to modify.** Does the router need updating? Does the sidebar navigation need a new link? Are there shared components to import?
- **Score: 0/10**

**WHAT GOOD LOOKS LIKE:**
```
File Paths:

  New files to create:
    - src/screens/Dashboard/DashboardScreen.tsx (main screen component)
    - src/screens/Dashboard/DashboardScreen.test.tsx (unit tests)
    - src/screens/Dashboard/DashboardHeader.tsx (header sub-component)
    - src/components/TaskCard/TaskCard.tsx (shared component — used here and in ProjectScreen)
    - src/components/TaskCard/TaskCard.test.tsx
    - src/components/TaskCard/TaskCardSkeleton.tsx
    - src/hooks/useTasks.ts (data fetching hook)
    - src/hooks/useTasks.test.ts

  Existing files to modify:
    - src/router/routes.ts — add /dashboard route
    - src/components/Sidebar/Sidebar.tsx — add Dashboard nav link
    - src/types/task.ts — add TaskCardProps interface (if not already defined)
```

---

### Edge Case Tests

*(Section not included)*

---

**ANNOTATION — WHY THIS FAILS:**

- **No edge case tests listed.** This means edge cases won't be tested. They'll be discovered by users in production.
- **Edge cases are where most bugs live.** The happy path usually works. It's the empty states, error paths, boundary conditions, and concurrent operations that break.
- **Score: 0/10**

**WHAT GOOD LOOKS LIKE:**
```
Edge Case Tests:

  Data Edge Cases:
    - [ ] User has 0 tasks → empty state renders with CTA
    - [ ] User has 1 task → single card renders, grid doesn't look broken
    - [ ] User has 500 tasks → pagination works, no performance degradation
    - [ ] Task title is 500 characters → text truncates with ellipsis, no overflow
    - [ ] Task title contains emoji/unicode → renders correctly
    - [ ] Task has no due date → "No due date" label shown (not "Invalid Date")
    - [ ] Task due date is today → "Due today" shown in warning color
    - [ ] Task due date is past → "Overdue" shown in error color
    - [ ] Task assignee has no avatar → fallback initials shown

  Error Edge Cases:
    - [ ] API returns 500 → error state shown, retry works
    - [ ] API returns 401 → redirect to login
    - [ ] API times out (>10s) → timeout error shown
    - [ ] Network disconnects mid-page-load → partial data with error banner
    - [ ] Optimistic status update fails on server → status reverts with toast notification

  Interaction Edge Cases:
    - [ ] Rapid-click on status checkbox → debounced, only one API call
    - [ ] Click card while navigating away → no error
    - [ ] Scroll position preserved after back navigation
    - [ ] Browser resize from desktop to mobile → layout reflows without page reload
```

---

### Dependencies & Blocked-By

*(Section not included)*

---

**ANNOTATION — WHY THIS FAILS:**

- **No dependencies listed.** The developer starts work, discovers the API endpoint doesn't exist yet, and is blocked. Or they build the card component without knowing the design system already has one, creating duplicate work.
- **No "blocked by" references.** If this task depends on TASK-139 (API endpoint) being complete, and TASK-139 is still in progress, the developer will sit idle or build against mock data that turns out to be wrong.
- **Score: 0/10**

**WHAT GOOD LOOKS LIKE:**
```
Dependencies:

  Blocked by (must be complete before starting):
    - TASK-139: GET /tasks endpoint with filtering and pagination (backend, @james)
      Status: In Review — expected merge Jan 12
    - TASK-128: Design system TaskCard component approved in Figma
      Status: Complete ✓

  Depends on (needed but can work in parallel with mocks):
    - TASK-140: WebSocket task update events (real-time card updates)
      Status: In Progress — can use polling as temporary fallback

  Blocks (other tasks waiting on this):
    - TASK-155: Dashboard analytics widgets (needs dashboard layout complete)
    - TASK-160: Dashboard notification badges (needs TaskCard component)

  Shared components to reuse (don't rebuild):
    - UserAvatar: src/components/UserAvatar.tsx
    - ErrorBanner: src/components/ErrorBanner.tsx
    - SkeletonLoader: src/components/SkeletonLoader.tsx
    - Badge: src/components/Badge.tsx
```

---

## Depth Score Breakdown: 2/10

| Element | Score | Weight | Weighted |
|---------|-------|--------|----------|
| Task header (ID, estimate, assignment) | 2/10 | 10% | 0.2 |
| Description | 1/10 | 15% | 0.15 |
| Acceptance criteria | 0/10 | 25% | 0.0 |
| File paths | 0/10 | 15% | 0.0 |
| Edge case tests | 0/10 | 15% | 0.0 |
| Dependencies / blocked-by | 0/10 | 10% | 0.0 |
| Estimate accuracy | 1/10 | 10% | 0.1 |
| **Total** | | | **0.45/10 → 2/10 (generous rounding)** |

### The Cost of Vague Tasks

A developer receiving this task file will spend their time on:

| Activity | % of Time | Notes |
|----------|-----------|-------|
| Reading and understanding the task | 5% | Because there's nothing to read |
| Hunting for requirements | 25% | Asking product, checking Figma, reading Slack history |
| Making assumptions | 15% | Each assumption is a potential rework |
| Actual development | 30% | The only productive time |
| Rework after review | 20% | "That's not what I meant" |
| Fixing edge cases in QA | 5% | Because edge cases weren't specified |

Compare to a well-specified task:

| Activity | % of Time |
|----------|-----------|
| Reading and understanding the task | 10% |
| Actual development | 70% |
| Testing against acceptance criteria | 15% |
| Minor review adjustments | 5% |

**A vague task takes 2-3x longer than a well-specified one.** The "few hours" estimate becomes a week.

### The Root Cause

The person who wrote this task file was thinking at the feature level ("we need a dashboard") instead of the implementation level ("a developer needs to create these files, call these APIs, handle these states, and pass these tests"). Good task files are written from the developer's perspective: "What would I need to know to build this without asking anyone a single question?"
