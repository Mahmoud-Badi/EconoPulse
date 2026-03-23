# Pre-Commit Quality Gates — Husky + lint-staged Setup

> **Purpose:** Configures pre-commit hooks to enforce quality before code reaches the repository.
> **Step:** 11.6 (CI/CD Pipeline Design)
> **Prerequisite:** Package manager installed, ESLint + Prettier configured

---

## Setup Instructions

<!-- IF {{PKG_MANAGER}} == "pnpm" -->
### pnpm Setup

```bash
# Install Husky and lint-staged
pnpm add -D husky lint-staged

# Initialize Husky
pnpm exec husky init

# Create pre-commit hook
echo 'pnpm exec lint-staged' > .husky/pre-commit
```
<!-- ENDIF -->

<!-- IF {{PKG_MANAGER}} == "npm" -->
### npm Setup

```bash
# Install Husky and lint-staged
npm install -D husky lint-staged

# Initialize Husky
npx husky init

# Create pre-commit hook
echo 'npx lint-staged' > .husky/pre-commit
```
<!-- ENDIF -->

<!-- IF {{PKG_MANAGER}} == "yarn" -->
### yarn Setup

```bash
# Install Husky and lint-staged
yarn add -D husky lint-staged

# Initialize Husky
yarn husky init

# Create pre-commit hook
echo 'yarn lint-staged' > .husky/pre-commit
```
<!-- ENDIF -->

---

## lint-staged Configuration

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix --max-warnings 0",
      "prettier --write"
    ],
    "*.{js,jsx}": [
      "eslint --fix --max-warnings 0",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ],
    "*.css": [
      "prettier --write"
    ]
  }
}
```

<!-- IF {{FRONTEND_FRAMEWORK}} == "nextjs" -->
### Next.js-Specific Configuration

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix --max-warnings 0",
      "prettier --write",
      "bash -c 'pnpm exec tsc --noEmit'"
    ]
  }
}
```

> **Note:** The `bash -c` wrapper is needed because `tsc --noEmit` checks the entire project, not just staged files. This is intentional — a type error anywhere should block the commit.
<!-- ENDIF -->

---

## Additional Pre-Commit Checks (Optional)

### Commit Message Validation

```bash
# Create commit-msg hook
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env bash
# Enforce conventional commits
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,100}'
if ! grep -qE "$commit_regex" "$1"; then
  echo "ERROR: Commit message does not follow conventional commits format."
  echo "  Format: type(scope): description"
  echo "  Example: feat(auth): add password reset flow"
  exit 1
fi
EOF
```

### State File Freshness Check

```bash
# Add to .husky/pre-commit (after lint-staged)
if [ -f "./scripts/session-completion-hook.template.sh" ]; then
  bash ./scripts/session-completion-hook.template.sh || true
fi
```

---

## Monorepo Considerations

<!-- IF {{MONOREPO}} == "true" -->
For monorepo setups (Turborepo, Nx):

1. Install Husky at the root only
2. Configure lint-staged per package or at root with glob patterns:

```json
{
  "lint-staged": {
    "apps/web/**/*.{ts,tsx}": ["eslint --fix --max-warnings 0"],
    "packages/api/**/*.{ts,tsx}": ["eslint --fix --max-warnings 0"],
    "packages/shared/**/*.{ts,tsx}": ["eslint --fix --max-warnings 0"]
  }
}
```
<!-- ENDIF -->

---

## Non-JavaScript Projects

For projects not using JavaScript/TypeScript:

| Stack | Pre-commit Tool | Lint Command | Format Command |
|-------|----------------|-------------|----------------|
| Python | pre-commit (pip) | `ruff check --fix` | `ruff format` |
| Go | pre-commit (pip) | `golangci-lint run` | `gofmt -w` |
| Rust | pre-commit (pip) | `cargo clippy` | `cargo fmt` |
| Ruby | Overcommit (gem) | `rubocop -a` | `rubocop -a` |

Install with:
```bash
pip install pre-commit
pre-commit install
```

Create `.pre-commit-config.yaml` with the appropriate hooks for your stack.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Husky hooks not running | Run `pnpm exec husky install` again |
| lint-staged hangs on large repos | Add `--concurrent false` flag |
| Type checking too slow | Use `tsc --noEmit --incremental` |
| Windows line ending issues | Add `.gitattributes` with `* text=auto eol=lf` |
| CI skipping hooks | Hooks don't run in CI by default — that's correct. CI has its own checks. |
