# Migration and Upgrade Guide

> Standard procedures for upgrading frameworks, dependencies, and migrating between patterns. Follow these workflows to reduce upgrade risk and avoid breaking production.

---

## Framework Upgrade Checklist

### Pre-Upgrade
- [ ] Read the full changelog and migration guide for the target version
- [ ] Check GitHub issues for known upgrade problems
- [ ] List every breaking change that affects your codebase
- [ ] Create a migration branch: `git checkout -b upgrade/{{FRAMEWORK}}-v{{VERSION}}`
- [ ] Ensure all tests pass on the current version before touching anything
- [ ] Take a snapshot: note current `package.json` versions and commit the lockfile

### During Upgrade
- [ ] Update the core package: `npm install {{FRAMEWORK}}@{{VERSION}}`
- [ ] Update peer dependencies and companion packages
- [ ] Run any official codemods (see Codemods section below)
- [ ] Fix all TypeScript/build errors before running the app
- [ ] Fix all remaining lint errors introduced by the upgrade
- [ ] Run the dev server and manually test core flows

### Post-Upgrade
- [ ] Run the full test suite: `npm test`
- [ ] Run the build: `npm run build`
- [ ] Test in a preview/staging environment before merging to main
- [ ] Run visual regression tests if available
- [ ] Update documentation to reflect any changed patterns
- [ ] Remove any temporary workarounds added during migration

### Rollback (if needed)
- [ ] `git checkout main -- package.json package-lock.json`
- [ ] `npm install` to restore previous lockfile state
- [ ] Verify the app runs correctly on the previous version
- [ ] Document what went wrong for the next attempt

---

## Dependency Update Strategy

### Recommended: Renovate Configuration

Create `renovate.json` in the project root:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true,
      "automergeType": "pr"
    },
    {
      "matchUpdateTypes": ["minor"],
      "automerge": true,
      "groupName": "minor dependencies"
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["major-upgrade"],
      "groupName": "major dependencies"
    },
    {
      "matchPackageNames": ["typescript", "next", "react", "react-dom"],
      "groupName": "core framework",
      "automerge": false
    }
  ],
  "schedule": ["before 7am on Monday"]
}
```

### Alternative: Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    groups:
      minor-and-patch:
        update-types: ["minor", "patch"]
```

---

## Breaking Change Assessment Workflow

1. **Read the changelog** — Focus on sections titled "Breaking Changes" or "BREAKING"
2. **Search your codebase** for each deprecated or removed API:
   ```bash
   grep -rn "deprecatedFunction" src/
   ```
3. **Create a migration task list** with one item per breaking change
4. **Estimate effort** per change (use T-shirt sizes from the tech debt registry)
5. **Decide: migrate now or defer** — If a breaking change affects 50+ files, consider an incremental approach

---

## Codemods and Automated Migration Tools

| Framework | Command | What It Does |
|-----------|---------|--------------|
| Next.js | `npx @next/codemod@latest <transform> <path>` | Automates Next.js version migrations |
| React | `npx react-codemod <transform> <path>` | Converts class components, updates APIs |
| ESLint | `npx @eslint/migrate-config .eslintrc.json` | Migrates to flat config format |
| TypeScript | Check release notes for `--strict` flag additions | Manual review required |
| Tailwind CSS | `npx @tailwindcss/upgrade@next` | Migrates config and class names |

Always run codemods on a clean branch. Review the diff before committing.

---

## Version Pinning Strategy

| Dependency Type | Pin Strategy | Example | Reason |
|----------------|-------------|---------|--------|
| Core framework (Next, React) | Pin exact major.minor | `"next": "~15.1.0"` | Test major/minor upgrades manually |
| Type definitions | Pin to match library | `"@types/react": "^19.0.0"` | Must match the library version |
| Dev tools (ESLint, Prettier) | Allow minor | `"eslint": "^9.0.0"` | Low risk, auto-merge safe |
| Utility libraries (lodash, date-fns) | Allow minor | `"date-fns": "^4.0.0"` | Stable APIs, low risk |
| CSS frameworks (Tailwind) | Pin exact major.minor | `"tailwindcss": "~4.0.0"` | Config changes between minors |

---

## Migration Testing Plan

1. **Automated tests** — Run full suite (`npm test`). Zero failures required before proceeding.
2. **Build verification** — `npm run build` must succeed with no new warnings.
3. **Visual regression** — If using Chromatic, Percy, or Playwright screenshots, compare before/after.
4. **Manual smoke test** — Walk through these critical paths:
   - [ ] Home page loads
   - [ ] Authentication flow (sign up, sign in, sign out)
   - [ ] Primary CRUD operations
   - [ ] Navigation between all major sections
   - [ ] Mobile responsive layout
5. **Performance check** — Run Lighthouse on key pages, compare scores to baseline.

---

## Common Migration Patterns

| From | To | Approach |
|------|----|----------|
| React class components | Function components + hooks | Migrate one component at a time, start with leaf components |
| Next.js Pages Router | App Router | Coexist during migration, move one route at a time |
| CommonJS (`require`) | ES Modules (`import`) | Add `"type": "module"` to package.json, rename `.js` to `.mjs` if needed |
| JavaScript | TypeScript | Add `tsconfig.json`, rename files one directory at a time, start with `strict: false` |
| CSS Modules | Tailwind CSS | Convert one component at a time, keep both systems running during migration |
| REST API | tRPC or GraphQL | Build new endpoints in parallel, migrate consumers incrementally |

---

## When to Upgrade vs When to Wait

| Scenario | Action | Reason |
|----------|--------|--------|
| Security patch (CVE) | Upgrade immediately | Vulnerability exposure risk |
| Bug fix for issue you are hitting | Upgrade promptly | Direct productivity impact |
| Minor version with useful features | Upgrade within 2 weeks | Low risk, useful benefits |
| Major version (.0 release) | Wait for .1 or .2 | Let early adopters find the bugs |
| Major version, 3+ months old | Plan the upgrade | Falling too far behind increases future migration pain |
| Dependency you do not directly use (transitive) | Let lockfile handle it | Only act if `npm audit` flags it |
