# Automated Anti-Pattern Detection Rules

> **Purpose:** Documents every automated detection pattern used by `scripts/detect-anti-patterns.sh`.
> **Step:** 13.5
> **Usage:** Run `bash scripts/detect-anti-patterns.sh [project_root]` to scan for these patterns.

---

## How Detection Works

Each rule has:
- **Pattern:** The regex/grep pattern used for detection
- **File types:** Which files are scanned
- **Severity:** FAIL (must fix) or WARN (should review)
- **False positives:** Common cases where the detection triggers incorrectly
- **Resolution:** How to fix the finding

---

## Universal Rules (All Projects)

### U1: Console.log in Production Code
- **Pattern:** `console\.log(`
- **Files:** `*.ts`, `*.tsx`, `*.js`, `*.jsx`
- **Severity:** WARN
- **False positives:** Test files, development utilities, intentional debug endpoints
- **Resolution:** Replace with structured logger (e.g., `logger.info()`, `logger.debug()`) or remove

### U2: TODO/FIXME in Shipped Code
- **Pattern:** `TODO|FIXME|HACK|XXX`
- **Files:** `*.ts`, `*.tsx`
- **Severity:** WARN
- **False positives:** Comments explaining intentional deferred work with a ticket number
- **Resolution:** Either implement the TODO or create a tracking issue and reference it

### U3: Hardcoded Secrets
- **Pattern:** `password\s*=\s*"[^"]+"`, `api_key\s*=\s*"[^"]+"`, `secret\s*=\s*"[^"]+"`, `token\s*=\s*"[^"]+"`
- **Files:** `*.ts`, `*.tsx`, `*.js`, `*.env.example`
- **Severity:** FAIL
- **False positives:** Test fixtures with dummy values, `.env.example` with placeholder values
- **Resolution:** Move to environment variables. Never commit actual secrets.

### U4: Empty Catch Blocks
- **Pattern:** `catch\s*([^)]*)\s*{\s*}`
- **Files:** `*.ts`, `*.tsx`
- **Severity:** FAIL
- **False positives:** Intentional error swallowing with a comment explaining why
- **Resolution:** At minimum log the error. Prefer: handle the error or re-throw with context.

---

## TypeScript Rules

### TS1: Usage of `any` Type
- **Pattern:** `: any`, `as any`, `<any>`
- **Files:** `*.ts`, `*.tsx`
- **Severity:** WARN
- **False positives:** Third-party library type gaps, complex generic constraints
- **Resolution:** Use `unknown` for truly unknown types. Use specific types where possible. Add `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with justification for intentional cases.

### TS2: Non-null Assertion Operator
- **Pattern:** `!.` (exclamation before dot access)
- **Files:** `*.ts`, `*.tsx`
- **Severity:** WARN
- **False positives:** Some framework patterns (e.g., `ref.current!.focus()` in React)
- **Resolution:** Use optional chaining (`?.`) or proper null guards

### TS3: @ts-ignore Without Explanation
- **Pattern:** `@ts-ignore` or `@ts-expect-error` at end of line (no comment following)
- **Files:** `*.ts`, `*.tsx`
- **Severity:** WARN
- **False positives:** None — always add an explanation
- **Resolution:** Add a comment explaining why the type error is being suppressed

---

## React Rules

### R1: Empty Click Handlers
- **Pattern:** `onClick={() => {}}`
- **Files:** `*.tsx`
- **Severity:** FAIL
- **False positives:** Intentional no-op buttons during development (should be removed before shipping)
- **Resolution:** Implement the handler or remove the onClick entirely. Empty handlers create misleading interactive UI.

### R2: Inline Styles
- **Pattern:** `style={{`
- **Files:** `*.tsx`
- **Severity:** WARN
- **False positives:** Dynamic styles that can't be expressed in CSS classes (e.g., `style={{ width: `${percent}%` }}`)
- **Resolution:** Use className with design system classes. For dynamic values, use CSS custom properties.

---

## Next.js Rules

### N1: Missing Error Boundaries
- **Detection:** Scan route directories for `page.tsx` without sibling `error.tsx`
- **Severity:** FAIL
- **False positives:** Root layout already has a global error boundary (still recommended per-route)
- **Resolution:** Create `error.tsx` in every route directory

### N2: Missing Loading States
- **Detection:** Scan route directories for `page.tsx` without sibling `loading.tsx`
- **Severity:** WARN
- **False positives:** Pages that load instantly (static content)
- **Resolution:** Create `loading.tsx` with skeleton UI matching the page layout

---

## Design System Rules

### D1: Hardcoded Hex Colors
- **Pattern:** `#[0-9a-fA-F]{6}` or `#[0-9a-fA-F]{3}`
- **Files:** `*.tsx`, `*.css`
- **Severity:** WARN
- **False positives:** Design token definitions themselves, SVG fill colors in icon components
- **Resolution:** Replace with Tailwind classes (`text-primary`, `bg-muted`) or CSS variables (`var(--primary)`)

### D2: Hardcoded Pixel Values
- **Pattern:** `w-[...px]`, `h-[...px]`, `p-[...px]`, `m-[...px]`
- **Files:** `*.tsx`
- **Severity:** WARN
- **False positives:** One-off precision layouts, third-party component integration
- **Resolution:** Use Tailwind's built-in spacing scale (`w-4`, `h-8`, `p-2`)

---

## Multi-Tenant Rules

### MT1: Missing Tenant Isolation
- **Pattern:** `findMany`, `findFirst`, `findUnique`, `.where(`
- **Files:** `*.ts`
- **Severity:** WARN (manual verification required)
- **False positives:** Queries that intentionally span tenants (admin, system), queries on non-tenant tables
- **Resolution:** Verify every query includes `organizationId` filter. Use query middleware for automatic filtering.

### MT2: Missing Soft Delete Filter
- **Pattern:** `findMany`, `findFirst`
- **Files:** `*.ts`
- **Severity:** WARN (manual verification required)
- **False positives:** Queries that intentionally include deleted records (admin, audit)
- **Resolution:** Verify every query includes `deletedAt IS NULL` or equivalent. Use query middleware.

---

## Adding Custom Rules

To add project-specific detection patterns:

1. Add the grep pattern to `scripts/detect-anti-patterns.sh` using the `check_pattern` function
2. Document the rule in this file following the format above
3. Choose severity: FAIL for security/correctness issues, WARN for quality issues
4. Document known false positives so developers don't waste time on non-issues
