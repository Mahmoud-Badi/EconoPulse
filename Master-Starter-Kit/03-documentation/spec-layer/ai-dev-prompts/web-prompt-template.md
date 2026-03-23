# Frontend Development Prompt Template

> Copy and fill this template when delegating frontend work to an AI agent.
> The more context you provide, the better the output.

---

## Task: [TASK-ID] -- [Title]

### Context

- **Service:** [service name -- e.g., Carrier Management, CRM]
- **Route:** [page route -- e.g., /carriers, /carriers/[id]/edit]
- **Components:** [reusable components to use -- e.g., DataTable, StatusBadge, PageHeader]
- **Contract:** [path to contract file -- e.g., contracts/carriers-list.md]

### Objective

[What to build -- describe the screen, feature, or interaction in 2-5 sentences.
Be specific about what the user sees and does.]

### Constraints

- **4-state rendering:** Every data-driven area must handle loading, error, empty, and success states
- **Design tokens:** Never hardcode colors, spacing, or typography -- use CSS variables / Tailwind tokens
- **Responsive:** Mobile-first breakpoints (sm -> md -> lg -> xl)
- **Accessibility:** Keyboard navigation, proper ARIA labels, screen reader support
- **Unwrap API envelope:** Response data is in `response.data.data` -- always unwrap in hooks
- **No `any` types:** Use proper TypeScript types from shared type definitions
- **No inline styles:** Use Tailwind classes or design token CSS variables only

### API Endpoints to Call

| Action | Method | Endpoint | Notes |
|---|---|---|---|
| [action] | [METHOD] | `/api/v1/[resource]` | [notes] |
| [action] | [METHOD] | `/api/v1/[resource]/:id` | [notes] |

### Component Inventory

| Component | Source | Already Exists? | Notes |
|---|---|---|---|
| [ComponentName] | [shadcn/ui / custom] | Yes / No | [notes] |
| [ComponentName] | [shadcn/ui / custom] | Yes / No | [notes] |

### 4 States to Handle

Every data-driven area of this screen MUST handle:

1. **Loading:** Skeleton UI matching the final layout. Use shimmer animation.
2. **Error:** Error icon + descriptive message + "Try again" button that retries the fetch.
3. **Empty:** Illustration or icon + "No [resource] found" message + CTA button (if user has create permission).
4. **Success:** The fully populated UI as described in the design spec.

### Acceptance Criteria

[Copy from task file]

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] All 4 states render correctly
- [ ] Responsive at all breakpoints
- [ ] Keyboard navigation works
- [ ] Tests pass

### Do NOT

- Do not use `any` types
- Do not hardcode API URLs (use the API client / environment config)
- Do not skip any of the 4 states
- Do not leave `console.log` statements
- Do not use inline styles (use Tailwind classes or design tokens)
- Do not create new API client functions if they already exist
- Do not ignore the response envelope (always unwrap `data.data`)
- Do not create components that duplicate existing ones in the catalog
