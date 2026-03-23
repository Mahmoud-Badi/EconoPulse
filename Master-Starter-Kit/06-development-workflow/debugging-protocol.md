# Debugging Protocol

## The Cardinal Rule

**NEVER guess-and-fix.** Find the root cause BEFORE attempting any fix.

Guess-and-fix is the single biggest time waster in AI-assisted development. Claude is excellent at generating plausible-looking fixes. But a plausible fix applied to a wrong diagnosis creates a new bug that's harder to find than the original. One layer of wrong fixes becomes two, then three, and soon you're rewriting the feature.

Use `superpowers:systematic-debugging` for structured investigation.

---

## The 9-Step Protocol

### Step 1: Reproduce

Confirm the bug exists. Get the exact error.

```
What I did: [exact steps]
What I expected: [expected behavior]
What happened: [actual behavior]
Error message: [exact error text]
```

**If you can't reproduce it, you can't fix it.** Ask: does it happen every time? Only on certain data? Only in production? Only on certain browsers?

### Step 2: Isolate

Which layer is the bug in?

| Symptom | Likely Layer |
|---------|-------------|
| Page shows error boundary | Frontend component crash |
| API returns 500 | Backend router error |
| API returns 401/403 | Auth/permission issue |
| Data looks wrong | Database query or seed issue |
| Page loads but data is missing | API call not reaching server, or query returning empty |
| Build fails | TypeScript error, import issue |
| Works locally, fails deployed | Environment variable or build config issue |

**Quick isolation technique:** Open browser DevTools Network tab. Is the API call being made? What does it return? If the API returns correct data but the page shows wrong data, the bug is in the frontend. If the API returns wrong data, the bug is in the backend.

### Step 3: Read the Error

Actually read the stack trace. Don't skim it.

```
Error: Cannot read properties of undefined (reading 'name')
    at TripCard (trip-card.tsx:15:42)
    at renderWithHooks (react-dom.js:...)
    at ...
```

This tells you:
- **What:** Trying to read `.name` on `undefined`
- **Where:** `trip-card.tsx`, line 15, column 42
- **When:** During render of `TripCard` component

Now you know exactly where to look.

### Step 4: Check Recent Changes

```bash
git diff          # unstaged changes
git diff --staged # staged changes
git log --oneline -5  # recent commits
```

**Question:** What changed since this last worked?

The bug is almost always in the recent changes. If the feature worked yesterday and doesn't today, the cause is in today's changes, not in code that's been stable for weeks.

### Step 5: Hypothesize

Based on steps 1-4, form a specific hypothesis:

- "The `trip.passenger` relation isn't being included in the query, so `trip.passenger.name` throws"
- "The auth middleware is at the wrong level, so the session is null when it reaches the procedure"
- "The environment variable has a trailing newline from Windows echo"

**Be specific.** "Something is wrong with the data" is not a hypothesis. "The `trips.findMany` query is missing the `with: { passenger: true }` clause" is a hypothesis.

### Step 6: Verify Hypothesis

Don't fix yet. Verify that your hypothesis is correct.

**For data issues:**
```typescript
console.log("trips query result:", JSON.stringify(result, null, 2));
```

**For auth issues:**
```typescript
console.log("session:", ctx.session);
console.log("user role:", ctx.session?.user?.role);
```

**For environment issues:**
```bash
echo "DATABASE_URL length: ${#DATABASE_URL}"
node -e "console.log(JSON.stringify(process.env.DATABASE_URL))"
```

**For type issues:**
```typescript
// Temporarily add to see the actual type
const _debug: never = suspectVariable; // Error message shows actual type
```

If your hypothesis is wrong, go back to step 5. Do NOT proceed to fixing with a wrong hypothesis.

### Step 7: Fix

Make the **smallest change** that fixes the bug.

Not a refactor. Not an improvement. Not "while I'm here." The smallest change.

```typescript
// BAD: "Fix" that also refactors
- const trips = await db.query.trips.findMany();
+ const trips = await db.query.trips.findMany({
+   with: { passenger: true, driver: true, vehicle: true },
+   orderBy: [desc(trips.createdAt)],
+   limit: 100,
+ });

// GOOD: Minimal fix
- const trips = await db.query.trips.findMany();
+ const trips = await db.query.trips.findMany({
+   with: { passenger: true },
+ });
```

Why minimal? Because if the fix doesn't work, you need to know exactly what you changed. If you changed 5 things and it still doesn't work, you don't know which of the 5 things was wrong.

### Step 8: Test

```bash
# Run the specific failing test
pnpm test -- path/to/failing.test.ts

# Run all tests (check for regressions)
pnpm test

# Run typecheck
pnpm typecheck

# Run build
pnpm build
```

**All four must pass.** If you fixed the bug but broke something else, you didn't fix it -- you moved it.

### Step 9: Document

If this bug reveals a gotcha or pattern that others might hit:

```markdown
<!-- In LESSONS-LEARNED.md or CLAUDE.md -->
- Drizzle `findMany` doesn't include relations by default --
  always specify `with: { relation: true }` for any relation you access in UI
```

**When to document:**
- The bug took more than 15 minutes to find
- The bug was caused by a framework/library surprise
- The bug could easily happen again in a different feature
- The fix was counterintuitive

---

## Common Bug Patterns

### Pattern: "Module Not Found"

```
Error: Cannot find module '@delta/validators/trip'
```

**Check:**
1. Does the file exist at the expected path?
2. Is it exported from the package's `package.json` exports map?
3. Is the tsconfig `paths` mapping correct?
4. Did you run `pnpm install` after adding the package?

### Pattern: "UNAUTHORIZED" on Protected Routes

```
TRPCClientError: UNAUTHORIZED
```

**Check:**
1. Is the auth middleware applied at the correct level? (`protectedProcedure` vs `publicProcedure`)
2. Is the session cookie being sent? (Check DevTools > Application > Cookies)
3. Is the `BETTER_AUTH_URL` matching the current domain?
4. Is the session expired?

### Pattern: "Relation Not Found" in Drizzle

```
Error: Relation "passenger" not found on table "trips"
```

**Check:**
1. Is the relation defined in the schema's `relations` export?
2. Is the relations file imported in the barrel export?
3. Did you run the migration after adding the relation?

### Pattern: "Type Error on Insert"

```
Type 'string' is not assignable to type '"scheduled" | "in_progress" | "completed"'
```

**Check:**
1. Enum values need `as const` assertion
2. Check if the field is nullable (add `.nullable()` to schema if needed)
3. Check if the type is inferred correctly from the schema

### Pattern: "Connection Refused" to Database

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Check:**
1. Is `DATABASE_URL` set correctly in `.env`?
2. Does the connection string include `ssl=require` for remote databases?
3. Is the database server actually running?
4. For Supabase pooler: use port 6543, not 5432

### Pattern: "Works Locally, Fails in Production"

**Check:**
1. Environment variables: are all required vars set in Vercel/hosting?
2. `vercel env pull` -- do the values match local `.env`?
3. Windows: did `echo` add trailing `\n` to env vars?
4. Build: does `pnpm build` succeed locally with production env vars?
5. CORS: does `BETTER_AUTH_URL` match the production domain?

---

## Debugging Tools

| Tool | When to Use |
|------|------------|
| Browser DevTools Network tab | API calls, response codes, payloads |
| Browser DevTools Console | Frontend errors, console.log output |
| `console.log` / `console.error` | Quick value inspection (remove before commit) |
| `pnpm typecheck` | Type errors without running the app |
| `git diff` | What changed since it last worked |
| `git bisect` | Find exact commit that introduced the bug |
| Drizzle Studio (`pnpm db:studio`) | Inspect database state directly |
| Playwright trace viewer | E2E test failures with screenshots + timeline |

---

## Time Limits

| Investigation Time | Action |
|-------------------|--------|
| < 5 minutes | Keep going, you're close |
| 5-15 minutes | Step back, re-read the error, try a different hypothesis |
| 15-30 minutes | Take a break, explain the problem to someone (rubber duck) |
| 30+ minutes | Stop. Document everything. Ask for help or move to a different task |

Spending 2 hours on a bug that a fresh pair of eyes fixes in 5 minutes is not productive. Know when to stop.
