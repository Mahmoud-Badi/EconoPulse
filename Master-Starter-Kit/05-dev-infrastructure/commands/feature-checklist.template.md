# /feature-checklist $ARGUMENT

5-layer pre-flight verification for a feature. Checks that all artifacts exist across every layer of the stack.

## Steps

### Layer 1: Database

Check that the database layer is complete:

```bash
# Schema file exists
ls packages/db/src/schema/$ARGUMENT.ts 2>/dev/null && echo "FOUND" || echo "MISSING"

# Schema is exported in barrel
grep -l "$ARGUMENT" packages/db/src/schema/index.ts 2>/dev/null && echo "EXPORTED" || echo "NOT EXPORTED"

# Seed file exists
ls packages/db/src/seed/$ARGUMENT.ts 2>/dev/null && echo "FOUND" || echo "MISSING"

# Seed is registered in orchestrator
grep -l "$ARGUMENT" packages/db/src/seed/index.ts 2>/dev/null && echo "REGISTERED" || echo "NOT REGISTERED"
```

Report:
```
Layer 1 - Database:
  Schema file:    {FOUND/MISSING} → packages/db/src/schema/$ARGUMENT.ts
  Schema export:  {EXPORTED/NOT EXPORTED} → packages/db/src/schema/index.ts
  Seed file:      {FOUND/MISSING} → packages/db/src/seed/$ARGUMENT.ts
  Seed registered: {REGISTERED/NOT REGISTERED} → packages/db/src/seed/index.ts
```

If MISSING, suggest: `Run /scaffold-schema $ARGUMENT` or `Run /scaffold-seed $ARGUMENT`

### Layer 2: API

Check that the API layer is complete:

```bash
# Router file exists
ls packages/api/src/routers/$ARGUMENT.ts 2>/dev/null && echo "FOUND" || echo "MISSING"

# Router is registered in root
grep -l "$ARGUMENT" packages/api/src/root.ts 2>/dev/null && echo "REGISTERED" || echo "NOT REGISTERED"

# Validators exist
ls packages/validators/src/$ARGUMENT.ts 2>/dev/null && echo "FOUND" || echo "MISSING"

# Count procedures in router
grep -c "protectedProcedure\|publicProcedure\|adminProcedure" packages/api/src/routers/$ARGUMENT.ts 2>/dev/null || echo "0"

# Tests exist
ls packages/api/src/routers/__tests__/$ARGUMENT.test.ts 2>/dev/null && echo "FOUND" || echo "MISSING"
```

Compare procedure count against the router spec:
```
{DOCS_PATH}/api/routers/$ARGUMENT.md
```

Report:
```
Layer 2 - API:
  Router file:     {FOUND/MISSING}
  Router registered: {REGISTERED/NOT REGISTERED}
  Validators:      {FOUND/MISSING}
  Procedures:      {actual}/{expected from spec}
  Tests:           {FOUND/MISSING}
```

If MISSING, suggest: `Run /scaffold-router $ARGUMENT`

### Layer 3: UI

Check that the UI layer is complete:

```bash
# Form component (if entity has create/edit)
ls apps/web/src/components/$ARGUMENT/*Form* 2>/dev/null && echo "FOUND" || echo "MISSING"

# Display components
ls apps/web/src/components/$ARGUMENT/ 2>/dev/null || echo "NO COMPONENTS DIR"

# Pages exist
ls apps/web/src/app/\(dashboard\)/$ARGUMENT/page.tsx 2>/dev/null && echo "FOUND" || echo "MISSING"

# Loading file exists
ls apps/web/src/app/\(dashboard\)/$ARGUMENT/loading.tsx 2>/dev/null && echo "FOUND" || echo "MISSING"

# Error file exists
ls apps/web/src/app/\(dashboard\)/$ARGUMENT/error.tsx 2>/dev/null && echo "FOUND" || echo "MISSING"
```

Verify 4 states in page/component code:
```bash
# Loading state (skeleton or spinner)
grep -r "Skeleton\|Loading\|Spinner" apps/web/src/components/$ARGUMENT/ 2>/dev/null && echo "HAS LOADING" || echo "NO LOADING STATE"

# Error state
grep -r "error\|Error\|Alert" apps/web/src/components/$ARGUMENT/ 2>/dev/null && echo "HAS ERROR" || echo "NO ERROR STATE"

# Empty state
grep -r "empty\|Empty\|no.*found\|No.*found" apps/web/src/components/$ARGUMENT/ 2>/dev/null && echo "HAS EMPTY" || echo "NO EMPTY STATE"
```

Report:
```
Layer 3 - UI:
  Form component:  {FOUND/MISSING/N/A}
  Display components: {count} files in components/$ARGUMENT/
  Page file:       {FOUND/MISSING}
  Loading file:    {FOUND/MISSING}
  Error file:      {FOUND/MISSING}
  Loading state:   {HAS/NO}
  Error state:     {HAS/NO}
  Empty state:     {HAS/NO}
  Data state:      {implied by page existing}
```

If MISSING, suggest appropriate scaffold commands.

### Layer 4: Testing

Check that testing artifacts exist:

```bash
# Unit tests
ls packages/api/src/routers/__tests__/$ARGUMENT.test.ts 2>/dev/null && echo "FOUND" || echo "MISSING"

# E2E tests
ls apps/web/e2e/$ARGUMENT.spec.ts 2>/dev/null && echo "FOUND" || echo "MISSING"

# Run unit tests
pnpm test --filter @{project}/api 2>&1 | tail -5

# Run E2E tests (if they exist)
cd apps/web && npx playwright test e2e/$ARGUMENT.spec.ts --project=chromium 2>&1 | tail -10
```

Report:
```
Layer 4 - Testing:
  Unit tests:    {FOUND/MISSING} → {PASS/FAIL if found}
  E2E tests:     {FOUND/MISSING} → {PASS/FAIL if found}
```

If MISSING, suggest: `Run /scaffold-e2e $ARGUMENT`

### Layer 5: Quality

Run project-wide quality checks:

```bash
pnpm typecheck 2>&1 | tail -5
pnpm lint 2>&1 | tail -5
pnpm build 2>&1 | tail -5
```

Report:
```
Layer 5 - Quality:
  TypeScript:  {PASS/FAIL} ({error count})
  Lint:        {PASS/FAIL} ({warning count})
  Build:       {PASS/FAIL}
```

## Final Output

```
FEATURE CHECKLIST: $ARGUMENT
==============================

Layer 1 - Database:    {COMPLETE/INCOMPLETE}  {details}
Layer 2 - API:         {COMPLETE/INCOMPLETE}  {details}
Layer 3 - UI:          {COMPLETE/INCOMPLETE}  {details}
Layer 4 - Testing:     {COMPLETE/INCOMPLETE}  {details}
Layer 5 - Quality:     {COMPLETE/INCOMPLETE}  {details}

Overall: {ALL COMPLETE / N layers incomplete}

{If incomplete, list exact commands to run:}
Missing Artifacts - Run These Commands:
1. /scaffold-schema $ARGUMENT    (Layer 1 - missing schema)
2. /scaffold-e2e $ARGUMENT       (Layer 4 - missing E2E test)
...
```
