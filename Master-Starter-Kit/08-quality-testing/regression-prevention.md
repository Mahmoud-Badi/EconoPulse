# Regression Prevention

How to ensure that fixing one thing does not break another. Regressions are the most demoralizing bugs — they destroy user trust and developer confidence simultaneously.

---

## Branch Strategy

### Branch Model

```
main (production — always deployable)
  |
  +-- feature/trips-crud
  |     +-- commit: "feat(trips): add list page"
  |     +-- commit: "feat(trips): add detail page"
  |     +-- commit: "feat(trips): add create/edit forms"
  |     +-- PR → main (squash merge)
  |
  +-- feature/driver-assignment
  |     +-- PR → main (squash merge)
  |
  +-- fix/invoice-customer-name
        +-- PR → main (squash merge)
```

### Rules

1. **main = production.** It must always be deployable. If main is broken, everything stops until it is fixed.
2. **Feature branches for all multi-file changes.** A single typo fix can go directly to main. Anything touching more than one file gets a branch.
3. **Never push directly to main** for feature work. Even if "it's a small change." Small changes break things too.
4. **Squash merge PRs.** Keep main history clean — one commit per feature/fix.
5. **Delete branches after merge.** Stale branches accumulate and confuse.

### Branch Naming Convention

```
feature/{domain}-{action}    # feature/trips-crud, feature/billing-export
fix/{domain}-{description}   # fix/invoice-customer-uuid, fix/auth-cookie-prefix
chore/{description}           # chore/update-dependencies, chore/seed-data-refresh
```

---

## CI/CD Pipeline

### Recommended Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      # Gate 2: TypeScript
      - name: Typecheck
        run: pnpm typecheck

      # Gate 3: Unit Tests
      - name: Unit Tests
        run: pnpm test

      # Gate 4: Lint
      - name: Lint
        run: pnpm lint

      # Gate 5: Build
      - name: Build
        run: pnpm build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          # Add other required env vars

  e2e:
    runs-on: ubuntu-latest
    needs: quality  # Only run E2E if quality gates pass
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps chromium

      - name: E2E Tests
        run: pnpm exec playwright test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Pipeline Stages

| Stage | Trigger | Checks | Blocking? |
|-------|---------|--------|-----------|
| Quality | Every push, every PR | typecheck + test + lint + build | Yes — PR cannot merge |
| E2E | PR to main only | Playwright on Chromium | Yes — PR cannot merge |
| Deploy | Merge to main | Vercel auto-deploy | Automatic |
| Smoke | Post-deploy | Production health check | Alert (not blocking) |

---

## Testing Discipline

### Coverage Rules

- **Coverage must never decrease.** If your PR drops coverage from 82% to 78%, the PR is rejected.
- **Target: >80% statement coverage, >88% function coverage.** Below this threshold = tech debt warning.
- **New features require new tests.** No exceptions. The test comes with the code.
- **Bug fixes require regression tests.** Before fixing a bug, write a test that reproduces it. Then fix it. The test prevents the bug from returning.

### The Regression Test Pattern

```typescript
// When you find a bug:

// Step 1: Write a test that FAILS (proves the bug exists)
it("should show facility name not UUID in invoice table", () => {
  const invoice = { customerId: "uuid-123", customerName: "ABC Hospital" };
  render(<InvoiceRow invoice={invoice} />);
  expect(screen.getByText("ABC Hospital")).toBeInTheDocument();
  expect(screen.queryByText("uuid-123")).not.toBeInTheDocument();
});

// Step 2: Run it — it fails (red)
// Step 3: Fix the bug
// Step 4: Run it — it passes (green)
// Step 5: The test now prevents this exact bug from ever returning
```

### What to Test When Existing Tests Pass but Users Report Bugs

The gap is usually one of these:
1. **Missing integration test.** Unit tests pass but the components do not work together.
2. **Missing edge case.** Tests cover the happy path but not the specific data shape that caused the bug.
3. **Missing state test.** Loading/error/empty states were not tested.
4. **Environment difference.** Local works but production has different data, timezone, locale, or permissions.

---

## Git Safety Rules

These rules prevent the most common destructive git operations:

| Command | Rule |
|---------|------|
| `git push --force` to main | NEVER. Under any circumstance. |
| `git push --force` to feature branch | Only if you are the sole contributor to that branch. |
| `git reset --hard` | Only on uncommitted work you want to discard. Never on published commits. |
| `git commit --amend` | Only on the most recent unpushed commit. Never on published commits. |
| `git commit --no-verify` | NEVER. Hooks exist for a reason. If a hook is wrong, fix the hook. |
| `git rebase main` | Use on feature branches before merging. Never on main. |
| `git clean -f` | Dangerous — deletes untracked files permanently. Use `git clean -n` (dry run) first. |

---

## Version Tagging

Tag versions before major milestones. If a deployment goes wrong, tags give you a clean rollback point.

```bash
# Before a major phase/release
git tag -a v1.0.0 -m "Phase 0-5: Foundation + Core Features"
git push origin v1.0.0

# Before a risky change
git tag -a pre-auth-migration -m "Snapshot before auth migration"

# Rollback if needed
git checkout v1.0.0
```

### Tagging Convention

```
v{major}.{minor}.{patch}    # Semantic versioning for releases
pre-{description}            # Snapshots before risky changes
phase-{number}-complete      # Phase completion markers
```

---

## Incident Response

When something breaks in production:

1. **Identify.** What page/feature is broken? What error? What changed recently?
2. **Rollback.** Vercel: instant rollback to previous deployment. Database: run migration rollback script.
3. **Reproduce.** Set up the exact conditions locally. Write a failing test.
4. **Fix.** Fix the bug in a fix/ branch. Verify the failing test now passes. Run full /verify.
5. **Deploy.** Push fix to main. Verify production.
6. **Post-mortem.** Why did the tests not catch this? Add the missing test. Update this document if a new gotcha was discovered.
