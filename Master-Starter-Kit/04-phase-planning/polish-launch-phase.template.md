# Phase {N}: Polish + Launch

> **This phase comes after all feature phases are complete.** It is the final quality gate before production. No new features are added here — only hardening, optimization, and verification.

**Goal:** Production-ready application that is fully tested, performant, accessible, secure, and deployed with monitoring.

**Estimated Tasks:** 15-20
**Estimated Duration:** 1-1.5 weeks
**Prerequisites:** All feature phases (Phase 0 through Phase {N-1}) complete; all Must Have features functional

**Acceptance Criteria:**
- [ ] Test coverage: >80% statement coverage, >88% function coverage
- [ ] All E2E specs pass on at least 2 browsers (Chromium + Firefox)
- [ ] Lighthouse performance score >90 on all major pages
- [ ] Zero axe-core accessibility violations on all pages
- [ ] Security review complete with zero critical/high findings
- [ ] Production deployment live with monitoring active
- [ ] Smoke test passing with every user role on production URL
- [ ] `pnpm build` succeeds with zero errors and zero warnings
- [ ] `pnpm test` passes with zero failures and zero skipped tests

---

## Step {N}.1: Test Suite Completion (5 tasks)

- [ ] Audit test coverage: run coverage report, identify untested files
  - Verify: coverage report generated; gaps identified by file
- [ ] Write missing unit tests to achieve >80% statement coverage
  - Priority: validators, utilities, business logic functions
  - Verify: `pnpm test:unit --coverage` shows >80% statements
- [ ] Write missing unit tests to achieve >88% function coverage
  - Priority: router procedures, helper functions, formatters
  - Verify: `pnpm test:unit --coverage` shows >88% functions
- [ ] Run all E2E specs on Chromium, Firefox, and optionally WebKit and mobile viewport
  - Fix any browser-specific failures
  - Verify: `pnpm test:e2e` passes on all configured browsers
- [ ] Fix all failing or skipped tests — no test is allowed to be `test.skip()` at launch
  - Verify: `pnpm test` shows 0 failures, 0 skipped

### Counts After Step {N}.1
- Pages: {cumulative} (+0)
- API procedures: {cumulative} (+0)
- Tests: {cumulative} (+{delta}: coverage gap tests)
- Components: {cumulative} (+0)
- Build: pass
- Coverage: {statement}% statements, {function}% functions

---

## Step {N}.2: Performance Optimization (4 tasks)

- [ ] Run Lighthouse audit on all major pages (dashboard, list pages, detail pages, forms)
  - Record scores: Performance, Accessibility, Best Practices, SEO
  - Target: Performance >90 on every page
  - Verify: Lighthouse CI report or manual audit shows >90 performance on all pages
- [ ] Analyze bundle size: identify oversized imports, unused dependencies, missing code splitting
  - Use `@next/bundle-analyzer` or equivalent
  - Split any route that loads >200KB JS
  - Verify: no single route loads >200KB JS; largest bundle documented
- [ ] Optimize database queries: identify N+1 queries, missing indexes, slow queries (>100ms)
  - Add eager loading where N+1 detected
  - Add database indexes for frequent filter/sort columns
  - Verify: no query takes >100ms on seed data; no N+1 patterns in server logs
- [ ] Optimize images and assets: verify all images use framework image component (next/image or equivalent), lazy loading enabled, appropriate sizes
  - Verify: no `<img>` tags without optimization; largest image <200KB

### Counts After Step {N}.2
- Pages: {cumulative} (+0)
- API procedures: {cumulative} (+0)
- Tests: {cumulative} (+0)
- Components: {cumulative} (+0)
- Build: pass
- Lighthouse: {min score}/{max score} across all pages

---

## Step {N}.3: Accessibility Audit (5 tasks)

- [ ] Run axe-core automated audit on every page
  - Use `@axe-core/playwright` in E2E tests or browser extension
  - Document all violations by severity: critical, serious, moderate, minor
  - Verify: zero critical violations; zero serious violations
- [ ] Keyboard navigation test on all pages
  - Tab through every interactive element; verify focus order is logical
  - Verify all actions achievable without mouse: navigation, forms, modals, dropdowns
  - Verify: every interactive element reachable and operable via keyboard
- [ ] Screen reader test on key flows (login, main list page, create form, detail page)
  - Use NVDA (Windows), VoiceOver (Mac), or axe Narrator
  - Verify: all content announced correctly; form labels read; errors announced
- [ ] Color contrast verification
  - All text meets WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text
  - Non-text elements (icons, borders, focus rings) meet 3:1
  - Verify: contrast checker shows all elements pass AA
- [ ] Touch target verification
  - All interactive elements have minimum 44x44px touch target (mobile)
  - Verify: no interactive element smaller than 44x44px at mobile breakpoint

### Counts After Step {N}.3
- Pages: {cumulative} (+0)
- API procedures: {cumulative} (+0)
- Tests: {cumulative} (+{delta}: accessibility E2E assertions if added)
- Components: {cumulative} (+0)
- Build: pass
- Accessibility: {violations remaining} (target: 0)

---

## Step {N}.4: Security Review (5 tasks)

- [ ] Auth flow review
  - Session management: sessions expire, refresh tokens rotate, logout invalidates
  - CSRF protection: state-changing requests protected
  - Password policy: minimum length, bcrypt/scrypt hashing verified
  - Verify: manual test of session expiry, CSRF on mutation, weak password rejection
- [ ] Input validation review
  - Every user input passes through Zod validation before database
  - No raw SQL queries (all through ORM)
  - XSS: all rendered content escaped (no `dangerouslySetInnerHTML` without sanitization)
  - Verify: attempt SQL injection and XSS on every form; all rejected
- [ ] Role-based access verification
  - Every API procedure checks user role
  - Every page route checks user role
  - No privilege escalation: lower role cannot access higher role resources
  - Verify: test each procedure and page with wrong role; all return 403 or redirect
- [ ] Environment variable audit
  - No secrets in client-side code (check `NEXT_PUBLIC_` prefix usage)
  - No secrets in git history (check `.gitignore` covers `.env*`)
  - All sensitive values in deployment environment variables (not hardcoded)
  - Verify: grep for API keys, secrets, passwords in source; none found
- [ ] Configure security headers
  - Content-Security-Policy (CSP)
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY (or SAMEORIGIN if needed)
  - Strict-Transport-Security (HSTS)
  - Rate limiting on auth endpoints (login, register, forgot-password)
  - Verify: security headers present in response; rate limit triggers on rapid requests

### Counts After Step {N}.4
- Pages: {cumulative} (+0)
- API procedures: {cumulative} (+0)
- Tests: {cumulative} (+0)
- Components: {cumulative} (+0)
- Build: pass
- Security findings: {critical}/{high}/{medium}/{low} (target: 0/0/{N}/{N})

---

## Step {N}.5: Production Deploy + Go-Live (4 tasks)

- [ ] Set production environment variables
  - DATABASE_URL (production database, NOT staging)
  - AUTH_SECRET (unique per environment, NOT reused from staging)
  - All third-party API keys (production keys, NOT test keys)
  - Verify: `env pull` or equivalent shows all variables set; no staging values
- [ ] Run production database migration and seed (if applicable)
  - Verify: production tables match schema; seed data present if needed
- [ ] Configure production domain
  - SSL/TLS certificate active
  - Custom domain DNS configured
  - CORS/auth configured for production domain (NOT staging domain)
  - Monitoring: error tracking (Sentry or equivalent), analytics, uptime monitoring
  - Verify: production URL loads over HTTPS; error tracking receives test event
- [ ] Go-live smoke test with every user role
  - For each role: login, navigate to all authorized pages, perform key action, logout
  - Verify: all roles complete smoke test on production; no errors in monitoring

### Counts After Step {N}.5 (Phase {N} Complete)
- Pages: {cumulative}
- API procedures: {cumulative}
- Tests: {cumulative}
- Components: {cumulative}
- Build: pass
- Deploy: production live at {{PRODUCTION_URL}}
- Monitoring: active

---

## Phase {N} Completion Checklist (Go-Live Gate)

**This checklist must be 100% complete before announcing launch.**

### Code Quality
- [ ] `pnpm build` succeeds — zero errors, zero warnings
- [ ] `pnpm typecheck` passes — zero errors
- [ ] `pnpm test` passes — zero failures, zero skipped
- [ ] Test coverage: >{80}% statements, >{88}% functions
- [ ] No `TODO`, `FIXME`, `HACK`, or `XXX` comments in production code

### Performance
- [ ] Lighthouse Performance >90 on all major pages
- [ ] No route loads >200KB JavaScript
- [ ] No database query >100ms on realistic data
- [ ] Images optimized, lazy loaded, properly sized

### Accessibility
- [ ] Zero axe-core critical or serious violations
- [ ] Full keyboard navigation working
- [ ] Screen reader tested on key flows
- [ ] Color contrast AA compliant
- [ ] 44px minimum touch targets on mobile

### Security
- [ ] Auth flow hardened (session expiry, CSRF, password policy)
- [ ] All inputs validated (no raw user input reaches database)
- [ ] RBAC enforced on every route and procedure
- [ ] No secrets in client code or git history
- [ ] Security headers configured, rate limiting active

### Production
- [ ] Production environment variables set (all unique, not staging)
- [ ] Production database migrated
- [ ] Custom domain with SSL active
- [ ] Monitoring active (errors, analytics, uptime)
- [ ] Smoke test passing with every user role

### Documentation
- [ ] STATUS.md updated: all phases marked complete
- [ ] DEVLOG.md updated: launch entry with date
- [ ] handoff.md updated: "Production launched, next: post-launch features"
- [ ] CLAUDE.md up to date with current architecture
