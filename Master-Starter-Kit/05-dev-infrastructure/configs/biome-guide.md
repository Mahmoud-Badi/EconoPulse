# Biome Linting & Formatting Guide

## Why Biome Over ESLint + Prettier

| Factor | ESLint + Prettier | Biome |
|--------|-------------------|-------|
| Speed | ~10s on large projects | ~0.5s (10-25x faster) |
| Config files | 2-3 (.eslintrc, .prettierrc, conflicts) | 1 (biome.json) |
| Dependencies | 15-30 packages | 1 package |
| Format + Lint | Separate tools, can conflict | Single unified tool |
| Import sorting | Needs plugin | Built-in |

Biome replaces ESLint, Prettier, and import-sort with one tool and one config file.

## Installation

```bash
# At monorepo root
pnpm add -D @biomejs/biome -w

# Or per-package (not recommended — prefer root install)
pnpm add -D @biomejs/biome --filter @project/web
```

## biome.json Configuration

Place at the monorepo root. This is the proven production config:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "organizeImports": {
    "enabled": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false
    }
  },
  "json": {
    "formatter": {
      "trailingCommas": "none"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "warn",
        "noUnusedVariables": "warn",
        "useExhaustiveDependencies": "warn"
      },
      "style": {
        "noNonNullAssertion": "off",
        "useConst": "error",
        "useImportType": "error",
        "noParameterAssign": "off"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noConsole": "warn"
      },
      "complexity": {
        "noForEach": "off",
        "noBannedTypes": "off"
      },
      "a11y": {
        "useButtonType": "warn",
        "noSvgWithoutTitle": "off"
      }
    }
  },
  "files": {
    "ignore": [
      "node_modules",
      ".next",
      "dist",
      "build",
      "coverage",
      ".turbo",
      "*.min.js",
      "*.min.css",
      "drizzle",
      "*.config.js",
      "*.config.mjs",
      "*.config.cjs"
    ]
  }
}
```

## Key Configuration Decisions

### Formatter Settings

- **`indentStyle: "tab"`**: Tabs allow each developer to set their preferred visual width. Use `"space"` if your team prefers spaces.
- **`lineWidth: 100`**: Wider than the 80-char default. 100 is a good balance for modern monitors.
- **`quoteStyle: "double"`**: Matches JSON and JSX conventions. Use `"single"` if you prefer.
- **`semicolons: "always"`**: Prevents ASI edge cases. Use `"asNeeded"` for the no-semicolons style.
- **`trailingCommas: "all"`**: Cleaner git diffs. Every item gets a trailing comma.

### Linter Rules

- **`noNonNullAssertion: "off"`**: Required when using `noUncheckedIndexedAccess` in TypeScript. You need `!` assertions on known-safe property access.
- **`noParameterAssign: "off"`**: Some patterns (Drizzle query builders, reducers) reassign parameters intentionally.
- **`noForEach: "off"`**: `.forEach()` is fine for simple iterations. The "use for...of" suggestion adds verbosity without benefit.
- **`noConsole: "warn"`**: Warns about `console.log` in production code. Use a proper logger instead.
- **`useImportType: "error"`**: Forces `import type { Foo }` for type-only imports, reducing bundle size.

### File Ignores

Always ignore:
- `node_modules` — third-party code
- `.next`, `dist`, `build` — build outputs
- `.turbo` — Turbo cache
- `drizzle` — generated migration SQL files
- Config files (`*.config.js`) — these often use CommonJS or non-standard syntax

## Package Scripts

```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write ."
  }
}
```

The `check` command runs both linting and formatting. Use `--write` to auto-fix.

## Turbo Integration

In root `turbo.json`:

```json
{
  "tasks": {
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

Run across all packages: `pnpm turbo lint`

## Editor Integration

### VS Code

Install the "Biome" extension (`biomejs.biome`). Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

### Disable Conflicting Extensions

If you have ESLint or Prettier extensions installed, disable them for the workspace to avoid conflicts.

## Shared Config via tooling/ Package

For monorepos, you can share Biome config across packages:

**tooling/biome/biome.json** (the shared config):
```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "extends": ["../../biome.json"]
}
```

Or just use a single root `biome.json` and run `biome check .` from the root. This is simpler and works well with Turbo.

## Pre-Commit Hook (Optional)

Using `lefthook` (lighter than husky + lint-staged):

```yaml
# lefthook.yml
pre-commit:
  commands:
    biome:
      glob: "*.{ts,tsx,js,jsx,json}"
      run: npx biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}
      stage_fixed: true
```

## Migration from ESLint + Prettier

```bash
# 1. Install Biome
pnpm add -D @biomejs/biome -w

# 2. Migrate existing config (generates biome.json from your ESLint config)
npx @biomejs/biome migrate eslint

# 3. Format entire codebase
npx biome check --write .

# 4. Remove old tools
pnpm remove eslint prettier eslint-config-* eslint-plugin-* @typescript-eslint/* -w

# 5. Delete old configs
rm .eslintrc* .prettierrc* .eslintignore .prettierignore
```

## Common Gotchas

1. **biome.json location**: Must be at the directory where you run `biome check`. For monorepos, put it at the root.

2. **Import organization changes git blame**: Run `biome check --write .` once as a dedicated commit, then use `git blame --ignore-rev` to skip it.

3. **JSON trailing commas**: Biome's JSON formatter removes trailing commas by default (JSON spec doesn't allow them). This is correct behavior.

4. **Config file linting**: Biome may try to lint `*.config.js` files that use CommonJS. Add them to `files.ignore`.

5. **Suppression comments**: Use `// biome-ignore lint/rule: reason` (not eslint-disable). Always include a reason.
