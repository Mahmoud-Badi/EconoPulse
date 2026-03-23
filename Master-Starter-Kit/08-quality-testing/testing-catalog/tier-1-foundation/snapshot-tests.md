# Snapshot Tests

## What It Is

Snapshot testing captures the serialized output of a piece of code — a rendered component tree, a computed data structure, a configuration object — and stores it in a file. On subsequent test runs, the current output is compared against the stored snapshot. If they differ, the test fails. The developer then decides whether the change was intentional (update the snapshot) or a regression (fix the code). Snapshots are a low-effort way to detect unintended changes to complex output that would be tedious to assert property-by-property. But they are also the most abused test type in the JavaScript ecosystem — used carelessly, they devolve into rubber-stamp approvals that catch nothing.

## What It Catches

- **Unintended structural changes to rendered output** — A refactor that accidentally removes a wrapping `<section>` element, breaking CSS selectors and layout
- **Data serialization regressions** — A function that generates a JSON config for an API client changes the key order or adds an unexpected default, breaking consumers
- **CSS class name drift** — A Tailwind class refactor that changes `px-4 py-2` to `p-4` on a critical button, altering its appearance in ways that a pure logic test would not catch
- **Default prop regressions** — A component that used to render with `aria-expanded="false"` now renders without the attribute because a default value was removed during refactoring
- **Error message changes** — A validation library that returns user-facing error messages — the message text changes from "Email is required" to "email is required" (casing), breaking UI tests that assert on the exact string
- **Generated code drift** — A code generator's output changes between versions, and the snapshot shows you exactly what changed so you can verify it is intentional

## When It's Required

Snapshots are the **right tool** in these specific cases:

| Scenario | Why Snapshots Work Here |
|----------|------------------------|
| Complex serialized data structures | A function returns a 50-property config object — asserting every property individually is unmaintainable; a snapshot catches any drift |
| Error message catalogs | A validation system with 30+ error messages — snapshots catch accidental changes to user-facing text |
| Generated output (code generators, email templates) | The output is deterministic and complex; snapshots provide a readable diff |
| Component render output where structure matters | A design system component with specific DOM structure that downstream consumers depend on |

Snapshots are the **wrong tool** in these cases:

| Scenario | Why Snapshots Fail Here |
|----------|------------------------|
| Simple components with 1-2 elements | A snapshot of `<button>Click me</button>` adds test maintenance with zero value — use a targeted assertion instead |
| Components with frequently changing content | A dashboard component that shows the current date — the snapshot breaks on every run |
| Components with random IDs or timestamps | The snapshot changes every time, so developers blindly update it |
| Anything where you would not review the diff | If you would just run `--updateSnapshot` without reading what changed, the snapshot is providing zero value |

**Rule of thumb:** If the snapshot is longer than 30 lines, it is probably too big to review meaningfully. Break it into smaller, focused snapshots or switch to targeted assertions.

## Setup Guide

### Vitest (built-in)

Snapshot support is included in Vitest — no additional packages needed.

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    // Snapshots are stored in __snapshots__/ next to the test file by default
    // To use a custom location:
    resolveSnapshotPath: (testPath, snapExtension) =>
      testPath.replace('/src/', '/__snapshots__/') + snapExtension,
  },
});
```

### Jest (built-in)

No additional setup required. Snapshots are stored in `__snapshots__/` directories.

### Updating snapshots

```bash
# Vitest
vitest run --update

# Jest
jest --updateSnapshot

# Or press 'u' in watch mode when a snapshot fails
```

### Package.json scripts

```json
{
  "scripts": {
    "test:update-snapshots": "vitest run --update"
  }
}
```

## Template

### Inline snapshot (preferred for small outputs)

```ts
// src/lib/formatCurrency.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.5, 'USD')).toMatchInlineSnapshot('"$1,234.50"');
  });

  it('formats EUR correctly', () => {
    expect(formatCurrency(1234.5, 'EUR')).toMatchInlineSnapshot('"€1,234.50"');
  });

  it('handles zero', () => {
    expect(formatCurrency(0, 'USD')).toMatchInlineSnapshot('"$0.00"');
  });

  it('handles negative amounts', () => {
    expect(formatCurrency(-50, 'USD')).toMatchInlineSnapshot('"-$50.00"');
  });
});
```

Inline snapshots are written directly into the test file by the test runner. Run the test once without the value, and the runner fills it in. This keeps the expected output next to the assertion, making code review straightforward.

### File snapshot for complex data structures

```ts
// src/lib/generateConfig.test.ts
import { describe, it, expect } from 'vitest';
import { generateDeployConfig } from './generateConfig';

describe('generateDeployConfig', () => {
  it('produces correct config for production', () => {
    const config = generateDeployConfig({
      environment: 'production',
      region: 'us-east-1',
      replicas: 3,
      features: ['cdn', 'waf', 'logging'],
    });

    // File snapshot — stored in __snapshots__/generateConfig.test.ts.snap
    expect(config).toMatchSnapshot();
  });

  it('produces correct config for staging', () => {
    const config = generateDeployConfig({
      environment: 'staging',
      region: 'us-east-1',
      replicas: 1,
      features: ['logging'],
    });

    expect(config).toMatchSnapshot();
  });
});
```

### Component snapshot (use sparingly)

```tsx
// src/components/ErrorBanner.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ErrorBanner } from './ErrorBanner';

describe('ErrorBanner', () => {
  // GOOD: focused snapshot on the structural output of a design system component
  it('renders the correct DOM structure for different severity levels', () => {
    const { container: warning } = render(
      <ErrorBanner severity="warning" message="Check your input" />
    );
    expect(warning.firstChild).toMatchSnapshot('warning severity');

    const { container: critical } = render(
      <ErrorBanner severity="critical" message="Payment failed" />
    );
    expect(critical.firstChild).toMatchSnapshot('critical severity');
  });

  // BAD: snapshotting an entire page — too large, too fragile
  // it('renders the full dashboard', () => {
  //   const { container } = render(<Dashboard />);
  //   expect(container).toMatchSnapshot(); // 500+ lines, never reviewed
  // });
});
```

### Snapshot for error message catalogs

```ts
// src/lib/validationMessages.test.ts
import { describe, it, expect } from 'vitest';
import { getValidationMessages } from './validationMessages';

describe('validation message catalog', () => {
  it('matches the expected messages for user registration', () => {
    const messages = getValidationMessages('userRegistration');

    // This catches accidental changes to user-facing text
    expect(messages).toMatchInlineSnapshot(`
      {
        "email.invalid": "Please enter a valid email address",
        "email.required": "Email is required",
        "name.maxLength": "Name must be 100 characters or fewer",
        "name.required": "Name is required",
        "password.minLength": "Password must be at least 8 characters",
        "password.required": "Password is required",
        "password.weak": "Password must include uppercase, lowercase, and a number",
      }
    `);
  });
});
```

## Common Pitfalls

### 1. Snapshot fatigue — blindly updating without reviewing

This is the single biggest failure mode. A developer runs `--updateSnapshot`, all tests pass, they commit. Nobody reads the diff. The snapshot has become a checkbox, not a test. Combat this by:

- **Keeping snapshots small** (under 30 lines) so the diff is reviewable
- **Using inline snapshots** wherever possible — they show up in the PR diff naturally
- **Code review rule:** Every snapshot update in a PR must be explicitly reviewed and approved. Add a PR template checkbox: "I reviewed all snapshot changes and verified they are intentional."

### 2. Snapshots that include non-deterministic data

If your snapshot includes timestamps, random IDs, or auto-generated keys, it will be different on every run. Either:

- **Mock the non-deterministic source:** `vi.setSystemTime(new Date('2024-01-01'))` for dates, seed random generators
- **Use property matchers:** `expect(result).toMatchSnapshot({ id: expect.any(String), createdAt: expect.any(Date) })`
- **Strip the dynamic parts** before snapshotting

### 3. Massive snapshots that nobody reads

A 400-line snapshot file is not a test — it is an insurance policy that nobody will collect on because nobody will read the diff when it changes. If your snapshot is more than 30 lines, ask yourself: "Would I actually review this diff in a PR?" If the answer is no, switch to targeted assertions on the properties that matter.

### 4. Using snapshots as a substitute for behavioral tests

A snapshot tells you the output changed. It does not tell you whether the output was correct in the first place. If the first snapshot commit captured a buggy render, every subsequent test run validates the bug. Always verify the initial snapshot is correct before committing it. Snapshots complement behavioral tests; they do not replace them.

### 5. Committing snapshot updates in a separate commit from the code change

When a code change and its snapshot update are in different commits, `git bisect` becomes unreliable — the snapshot commit passes tests but the code commit does not. Always commit code changes and their corresponding snapshot updates together.

### 6. Not cleaning up obsolete snapshots

When you delete or rename a test, the old snapshot entry stays in the `.snap` file. Over time, the snapshot file accumulates dead entries. Run `vitest run --update` or `jest --ci --forceExit` periodically to remove obsolete snapshots. Some teams add `--ci` flag in CI which fails if there are obsolete snapshots.

## Proof Artifact

The enforcement system accepts the following as evidence that snapshot tests ran and passed:

| Artifact | How to Generate | What It Shows |
|----------|----------------|---------------|
| **Test results** | `vitest run --reporter=json > test-results.json` | All snapshot tests passed |
| **No obsolete snapshots** | `vitest run --reporter=verbose 2>&1` (check for "obsolete" warnings) | Snapshot files are clean |
| **Snapshot diff in PR** | Git diff of `__snapshots__/` files | Reviewer can verify changes are intentional |

**Minimum passing criteria:**

- All snapshot tests pass (no unexpected changes)
- No obsolete snapshot entries (cleaned up after test renames/deletions)
- Every snapshot update in a PR is accompanied by a code change that explains why the output changed
- Inline snapshots are preferred over file snapshots where the output is under 15 lines
- No snapshot file exceeds 200 lines (indicates over-reliance on snapshot testing; refactor into smaller, focused tests or switch to targeted assertions)
