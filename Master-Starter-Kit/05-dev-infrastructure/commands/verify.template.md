# /verify

8-step quality gate. ALL steps must pass before marking any feature or task as complete.

## Steps

### Step 1: Pre-Flight Checklist
Run `/feature-checklist` for the current feature/task first. If any layer is missing artifacts, stop and scaffold them before continuing.

### Step 2: TypeScript
```bash
pnpm typecheck 2>&1
```
**Requirement**: Zero errors. Warnings are acceptable.
**If fails**: Fix all type errors before proceeding. Common fixes:
- Missing `!` assertion (noUncheckedIndexedAccess)
- Missing `as const` on enum arrays
- Missing `import type` for type-only imports

### Step 3: Unit Tests
```bash
pnpm test -- --reporter=verbose 2>&1
```
**Requirement**: All tests pass. Zero failures, zero errors.
**If fails**: Fix failing tests. Do not skip or `.todo()` tests to make them pass.

### Step 4: Lint
```bash
pnpm lint 2>&1
```
**Requirement**: Clean output. Zero errors. Warnings are acceptable but should be reviewed.
**If fails**: Run `pnpm lint:fix` first, then fix remaining manual issues.

### Step 5: Build
```bash
pnpm build 2>&1
```
**Requirement**: Build succeeds with exit code 0.
**If fails**: Check for:
- Missing environment variables (NEXT_PUBLIC_* needed at build time)
- Import errors (circular dependencies, missing exports)
- Next.js page/layout errors

### Step 6: Design Check
Run `/design-verify` (the fast 7-point code inspection).
**Requirement**: No critical violations.
**Critical violations that fail this step**:
- Hardcoded hex colors (#xxx) instead of design tokens
- Missing loading/error/empty states
- Icon-only buttons without aria-label
- Touch targets smaller than 44px

### Step 7: Visual Verification
Use the Playwright MCP server to visually verify the feature:
1. Navigate to the feature's primary page
2. Take a screenshot at **1440px** width (desktop)
3. Take a screenshot at **375px** width (mobile)
4. Click through interactive elements: buttons, links, form submissions
5. Submit a form (if applicable) and verify success feedback
6. Check the browser console for errors:
   ```
   browser_console_messages
   ```
**Requirement**: No console errors. UI renders correctly at both breakpoints. Interactions work.
**If console errors exist**: Fix them. Console errors in production are bugs.

### Step 8: State Verification
Verify all 4 required states exist and display correctly:
1. **Loading state**: Navigate to the page -- a skeleton or spinner should show while data loads
2. **Error state**: Simulate an error (e.g., disconnect network) -- an error message should display with a retry option
3. **Empty state**: View the page with no data -- an empty state message with a call-to-action should show
4. **Data state**: View the page with seed data -- all data should render correctly

**Requirement**: All 4 states are present in the code and render appropriately.

## Output

```
VERIFICATION REPORT
====================
Feature: {feature name}

Step 1 - Pre-Flight:  {PASS/FAIL}
Step 2 - TypeScript:   {PASS/FAIL} ({error count} errors)
Step 3 - Unit Tests:   {PASS/FAIL} ({pass}/{total} tests)
Step 4 - Lint:         {PASS/FAIL} ({warning count} warnings)
Step 5 - Build:        {PASS/FAIL}
Step 6 - Design:       {PASS/FAIL} ({violation count} violations)
Step 7 - Visual:       {PASS/FAIL} (screenshots attached)
Step 8 - States:       {PASS/FAIL} (loading/error/empty/data)

Overall: {PASS/FAIL}
{If PASS}: Ready to mark complete in STATUS.md.
{If FAIL}: Fix {N} failing steps before marking complete.
```

## Rules

- Do NOT mark a feature complete in STATUS.md unless ALL 8 steps pass.
- Do NOT skip steps. Each step catches a different category of bugs.
- If a step fails, fix the issue and re-run that step (and any downstream steps).
- Steps 7 and 8 require the dev server running. Start it with `pnpm dev` if not already running.
- Save screenshots from Step 7 for the session record.
