---
name: performance-check
description: Check the project against performance budget targets
allowed_tools:
  - Read
  - Glob
  - Grep
  - Bash
  - TodoWrite
---

# /performance-check — Performance Budget Check

Check the project against defined performance targets for API latency, Web Vitals, and bundle size.

## Usage

```
/performance-check
```

## Steps

### Step 1: Load Performance Targets

Read targets from `${CLAUDE_PLUGIN_ROOT}/../08-quality-testing/performance-budget/PERFORMANCE-TARGETS.md`.

### Step 2: Check Bundle Size

```bash
# For Next.js / Webpack / Vite projects
# Check .next/analyze or build output for bundle sizes
ls -la .next/static/chunks/*.js 2>/dev/null | awk '{total += $5} END {print total/1024 "KB"}'

# Or use the build output
{pkg_manager} build 2>&1 | grep -i "size\|chunk\|bundle"
```

Compare against budget:
- Total JS bundle vs `PERFORMANCE_BUNDLE_LIMIT`
- Individual chunks vs per-route budgets
- CSS total vs CSS budget

### Step 3: Check for Performance Anti-Patterns

Scan code for common performance issues:

```bash
# Large imports (importing entire libraries)
grep -rn "import .* from 'lodash'" --include="*.ts" --include="*.tsx"

# Missing image optimization
grep -rn "<img " --include="*.tsx" | grep -v "Image\|next/image"

# Unoptimized re-renders
grep -rn "useEffect.*\[\]" --include="*.tsx" | head -20

# Missing pagination
grep -rn "findMany\|find()" --include="*.ts" | grep -v "take\|limit\|skip"

# N+1 query patterns
grep -rn "for.*await\|\.map.*await\|forEach.*await" --include="*.ts"
```

### Step 4: Check Rate Limiting

Verify rate limiting is configured per `${CLAUDE_PLUGIN_ROOT}/../08-quality-testing/performance-budget/RATE-LIMITING-TIERS.md`:

```bash
# Check for rate limiting middleware/decorators
grep -rn "throttle\|rateLimit\|rate-limit\|Throttle\|RateLimit" --include="*.ts"
```

### Step 5: Check Caching

Verify caching strategy per `${CLAUDE_PLUGIN_ROOT}/../08-quality-testing/performance-budget/CACHING-STRATEGY.md`:

```bash
# Check for cache headers or cache middleware
grep -rn "cache\|Cache\|staleTime\|cacheTime\|redis\|Redis" --include="*.ts" --include="*.tsx"
```

### Step 6: Generate Report

```markdown
# Performance Budget Report
Generated: {date}

## Bundle Size
| Asset | Size | Budget | Status |
|-------|------|--------|--------|
| Total JS | {size} | {budget} | PASS/FAIL |
| Total CSS | {size} | {budget} | PASS/FAIL |

## Performance Anti-Patterns
| Pattern | Occurrences | Severity |
|---------|-------------|----------|
| Unoptimized images | N | MEDIUM |
| Missing pagination | N | HIGH |

## Rate Limiting
| Scope | Configured | Target | Status |
|-------|-----------|--------|--------|
| Auth endpoints | Y/N | 10/min | PASS/FAIL |

## Caching
| Layer | Configured | Status |
|-------|-----------|--------|
| Client (React Query) | Y/N | — |
| Server (Redis) | Y/N | — |

## Recommendations
1. {Highest priority fix}
2. {Second priority}
```

Display summary with PASS/FAIL per category.
