# Linting

## What It Is

Linting is automated static analysis that enforces code quality rules, catches common bugs, and maintains consistency across your entire codebase — without running any code. ESLint analyzes your JavaScript and TypeScript for logical errors, anti-patterns, and style violations. Prettier handles all formatting decisions (indentation, line length, semicolons, quotes) so developers never argue about style. Together, they form a zero-tolerance gate: code that violates any rule does not merge. This is not about aesthetics — a significant percentage of the rules catch actual bugs (unused variables hiding typos, missing hook dependencies causing stale closures, floating promises swallowing errors).

## What It Catches

- **Stale closure bugs in React** — `useEffect` references `count` but does not include it in the dependency array, so the effect always sees the initial value of `count` instead of the current one (`react-hooks/exhaustive-deps`)
- **Swallowed async errors** — An `async` function is called without `await`, so its rejection is silently ignored and the error never surfaces (`@typescript-eslint/no-floating-promises`)
- **Dead code masking typos** — A variable `userName` is declared but never used because the actual usage references `username` (lowercase) — a typo that would otherwise go unnoticed (`@typescript-eslint/no-unused-vars`)
- **Accessibility failures** — An `<img>` tag without an `alt` attribute, a `<div>` with an `onClick` but no `role` or keyboard handler, a form input without a label (`jsx-a11y/*`)
- **Import ordering chaos** — Random import order makes it hard to scan what a file depends on and leads to merge conflicts when two developers add imports to the same location (`import/order`)
- **Inconsistent code style** — Tabs vs spaces, single vs double quotes, trailing commas — Prettier eliminates all of these debates permanently
- **Unreachable code** — A `return` statement followed by more code that can never execute (`no-unreachable`)
- **Accidental global variable creation** — Assigning to an undeclared variable creates a global, which leaks between tests and modules (`no-undef`, caught by `strict` in TypeScript but not in JS)
- **Unsafe regex patterns** — A regex with exponential backtracking that can freeze the event loop on adversarial input (`no-unsafe-regex` via plugin)

## When It's Required

Linting is required for **every project that has a `package.json`**. There are no exceptions, no "we'll add it later." It runs:

- **On every file save** — Via IDE integration (ESLint + Prettier plugins auto-fix on save)
- **On every commit** — Via `lint-staged` in a pre-commit hook (only lints changed files for speed)
- **On every PR** — Via CI, blocking merge if there are any errors
- **Zero warnings policy** — Warnings are treated as errors in CI. If a rule is not worth enforcing, turn it off. If it is worth enforcing, make it an error. Warnings are noise that trains developers to ignore linter output.

## Setup Guide

### ESLint 9+ (flat config)

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-import-x prettier eslint-config-prettier
```

Create `eslint.config.mjs` at project root:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importX from 'eslint-plugin-import-x';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  { ignores: ['dist/', '.next/', 'node_modules/', 'coverage/', 'src/generated/'] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // React hooks
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // Accessibility
  jsxA11y.flatConfigs.recommended,

  // Import ordering
  {
    plugins: { 'import-x': importX },
    rules: {
      'import-x/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      'import-x/no-duplicates': 'error',
    },
  },

  // Bug-catching rules
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // Prettier must be last — disables formatting rules that conflict
  prettier,
);
```

### Prettier

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Create `.prettierignore`:

```
dist/
.next/
node_modules/
coverage/
pnpm-lock.yaml
src/generated/
```

### Pre-commit hook

```bash
pnpm add -D husky lint-staged
pnpm exec husky init
```

`.lintstagedrc.json`:

```json
{
  "*.{ts,tsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml,css}": [
    "prettier --write"
  ]
}
```

`.husky/pre-commit`:

```bash
pnpm exec lint-staged
```

### Package.json scripts

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "lint:fix": "eslint . --fix --max-warnings=0",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### IDE setup (VS Code)

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["typescript", "typescriptreact"],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Template

### Complete `eslint.config.mjs` for a Next.js App Router project

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importX from 'eslint-plugin-import-x';
import nextPlugin from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/', '.next/', 'node_modules/', 'coverage/', 'src/generated/'] },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Next.js specific rules
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // React hooks
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // Accessibility
  jsxA11y.flatConfigs.recommended,

  // Imports
  {
    plugins: { 'import-x': importX },
    rules: {
      'import-x/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          { pattern: '@/**', group: 'internal', position: 'before' },
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      'import-x/no-duplicates': 'error',
      'import-x/no-cycle': ['error', { maxDepth: 3 }],
    },
  },

  // Project rules
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', {
        checksVoidReturn: { attributes: false },
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // Test file overrides — relaxed rules where strictness hurts readability
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  prettier,
);
```

### CI workflow

```yaml
# .github/workflows/lint.yml
name: Lint & Format
on: [pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm format:check
```

## Common Pitfalls

### 1. Disabling rules inline instead of fixing the code

A codebase littered with `// eslint-disable-next-line` comments is worse than no linting at all — it gives a false sense of coverage while allowing the exact bugs the rules were designed to catch. Every disable comment must include a justification and a linked ticket. Audit disable comments regularly; most of them are laziness, not necessity.

### 2. Running ESLint without `--max-warnings=0`

By default, warnings do not cause ESLint to exit with a non-zero code. This means CI passes even with 200 warnings. Always use `--max-warnings=0` in CI and in your `lint` script. If a rule produces too many warnings to fix at once, keep it at `warn` temporarily but create a ticket to fix and promote to `error` within one sprint.

### 3. Prettier and ESLint fighting over formatting

If you see ESLint auto-fix changing quotes to single, then Prettier changing them back to double (or vice versa), your configs conflict. The solution is `eslint-config-prettier` as the **last** config in your ESLint chain — it disables all ESLint rules that Prettier handles. Let ESLint do logic checks, let Prettier do formatting. Never use ESLint formatting rules alongside Prettier.

### 4. Not configuring `checksVoidReturn` for React event handlers

`@typescript-eslint/no-misused-promises` will flag `<button onClick={async () => { ... }}>` because the handler returns a Promise but the attribute expects `void`. Fix this by setting `checksVoidReturn: { attributes: false }` — React intentionally ignores the return value of event handlers, so this is a false positive.

### 5. Skipping lint on pre-existing code during adoption

When adding ESLint to an existing project, do not put the entire `src/` directory in the ignore list. Instead, fix the errors in batches. Use `eslint --fix` for auto-fixable rules (import order, formatting, consistent types), then address manual-fix rules module by module. Track progress with `eslint . 2>&1 | grep -c "error"` — the count should decrease every week.

### 6. Not running lint-staged correctly with TypeScript

`lint-staged` passes individual file paths to ESLint, but some TypeScript ESLint rules require project-wide type information. If you get "You have used a rule which requires type information, but don't have parserOptions.project set," you may need to configure lint-staged to run `tsc --noEmit` separately (see [type-checking.md](./type-checking.md)) and only run file-scoped ESLint rules on staged files.

## Proof Artifact

The enforcement system accepts the following as evidence that linting passed:

| Artifact | How to Generate | What It Shows |
|----------|----------------|---------------|
| **Zero-error CLI output** | `pnpm lint 2>&1` | No lint errors or warnings |
| **Prettier check** | `pnpm format:check 2>&1` | All files match Prettier formatting |
| **CI status check** | GitHub Actions lint job | Green checkmark = all passed |

**Minimum passing criteria:**

- Zero errors from `pnpm lint` (exit code 0)
- Zero warnings (enforced by `--max-warnings=0`)
- Zero formatting differences from `pnpm format:check` (exit code 0)
- No new `eslint-disable` comments without a linked issue in the comment
- All auto-fixable rules should be auto-fixed by the pre-commit hook — manual lint errors in a PR indicate the developer bypassed the hook with `--no-verify`
