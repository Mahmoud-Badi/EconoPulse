# Go-Live Checklist

The definitive checklist for launching to production. Do not skip steps. Do not reorder steps. Each step exists because someone skipped it once and paid the price.

---

## Phase 1: Pre-Deploy Verification

### Code Quality

- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm test` passes with zero failures
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm build` succeeds locally
- [ ] No `console.log` statements in production code (use structured logger instead)
- [ ] No `@ts-ignore` or `eslint-disable` without justifying comments
- [ ] No hardcoded localhost URLs in production code paths

### Database

- [ ] All migrations generated and applied to production database
- [ ] Seed data loaded (or initial data entry completed)
- [ ] Database connection tested from production environment
- [ ] Connection pooling configured (do not use direct connection for app traffic)
- [ ] SSL configured for database connections
- [ ] Backup strategy in place (Supabase: automatic daily backups on Pro plan)

### Authentication

- [ ] `BETTER_AUTH_URL` matches production domain exactly (with https://)
- [ ] `BETTER_AUTH_SECRET` is strong, random, and unique to production
- [ ] Login flow works end-to-end on production URL
- [ ] Registration flow works (if applicable)
- [ ] Password reset flow works (email delivery configured)
- [ ] Session persistence works across page refreshes
- [ ] Role-based access enforced (admin, dispatcher, driver, etc.)
- [ ] Logout clears session and redirects to login

### Environment Variables

- [ ] All env vars documented in `.env.example`
- [ ] All env vars set in Vercel Dashboard for Production environment
- [ ] Values verified via `vercel env pull` (no trailing newlines or corruption)
- [ ] No secrets in `NEXT_PUBLIC_*` variables
- [ ] Different secrets for Production vs Preview environments

### Domain & SSL

- [ ] Custom domain configured in Vercel
- [ ] DNS records pointing to Vercel (CNAME or A record)
- [ ] SSL certificate active (Vercel auto-provisions via Let's Encrypt)
- [ ] HTTP redirects to HTTPS (Vercel handles automatically)
- [ ] `NEXT_PUBLIC_APP_URL` matches custom domain

### Monitoring

- [ ] Error tracking configured (Sentry with source maps)
- [ ] Analytics configured (Vercel Analytics or PostHog)
- [ ] Uptime monitoring configured (BetterStack or UptimeRobot)
- [ ] Health endpoint exists and returns 200 (`/api/health`)
- [ ] Alert notifications configured (email, Slack, or Discord)

---

## Phase 2: Deployment

### Deploy

- [ ] Merge all pending PRs to main
- [ ] Push to main (triggers auto-deploy)
- [ ] Monitor Vercel build logs for errors
- [ ] Build completes successfully
- [ ] Deployment URL is accessible

### Verify Build Output

- [ ] No warnings about large bundle size (check Vercel build output)
- [ ] No warnings about missing environment variables
- [ ] Build time is reasonable (< 5 minutes for most projects)
- [ ] Function regions are correct (if using edge functions)

---

## Phase 3: Post-Deploy Smoke Test

Perform every check on the PRODUCTION URL (custom domain, not Vercel auto-domain).

### Authentication Smoke Test

- [ ] Can access login page at `/login`
- [ ] Can log in as admin (`{ADMIN_EMAIL}` / `{SEED_PASSWORD}` or real credentials)
- [ ] Dashboard loads after login
- [ ] Can log in as each role (dispatcher, driver, billing — if applicable)
- [ ] Unauthorized pages redirect to login
- [ ] Role-restricted pages block unauthorized roles

### Core Feature Smoke Test

- [ ] Dashboard: KPI cards show data (not zeros, not errors)
- [ ] Dashboard: Charts render with data
- [ ] Primary list page: table renders with rows
- [ ] Primary list page: pagination works (if enough data)
- [ ] Primary list page: search/filter works
- [ ] Detail page: clicking a row navigates to detail
- [ ] Detail page: all sections render
- [ ] Create form: can create a new record
- [ ] Edit form: can edit an existing record
- [ ] Delete: can delete a record (with confirmation)

### Navigation Smoke Test

- [ ] All sidebar links navigate to correct pages
- [ ] Breadcrumbs show correct path
- [ ] Back button / browser back works
- [ ] No 404 pages for expected routes
- [ ] Mobile: hamburger menu opens and all links work

### Technical Smoke Test

- [ ] Browser console: zero errors (open DevTools > Console)
- [ ] Network tab: no failed API requests (open DevTools > Network, filter by red)
- [ ] Page load time: < 3 seconds on fast connection
- [ ] API responses: return data, not empty arrays or nulls
- [ ] Real-time features: SSE/WebSocket connections establish (if applicable)

### Responsive Smoke Test

- [ ] Desktop (1440px): layout correct, sidebar visible
- [ ] Tablet (768px): layout adapts, content readable
- [ ] Mobile (375px): layout stacked, hamburger menu, no horizontal overflow
- [ ] Forms usable on mobile (inputs reachable, keyboard does not hide content)

---

## Phase 4: Rollback Plan

Before going live, verify your rollback capability:

### Vercel Rollback

- [ ] Previous deployment exists in Vercel Dashboard > Deployments
- [ ] Verified: can click "Promote to Production" on previous deployment
- [ ] Know the URL of the previous known-good deployment

### Database Rollback

- [ ] Migration down scripts exist (or know how to manually reverse)
- [ ] Database backup taken before deploy (or automatic backups enabled)
- [ ] Know the procedure: "If database schema change breaks something, run rollback migration"

### DNS Rollback (If Changing Domains)

- [ ] Previous DNS records documented
- [ ] Know how to revert DNS if new domain does not work
- [ ] DNS TTL set low (300 seconds) before the switch

---

## Phase 5: Post-Launch (First 24-48 Hours)

### Monitoring

- [ ] Check Sentry for new errors every 2-4 hours
- [ ] Check uptime monitor — no downtime events
- [ ] Check analytics — users are accessing the application
- [ ] Check server logs for unusual patterns

### Performance

- [ ] Run Lighthouse audit on key pages (target: 90+ Performance score)
- [ ] Check Web Vitals in Vercel Analytics (target: all "Good")
- [ ] Monitor API response times (target: p95 < 500ms)

### User Feedback

- [ ] Ask first users to report any issues
- [ ] Check support channels for bug reports
- [ ] Verify that the #1 most common user action works flawlessly

---

## Emergency Contacts

Document these before go-live:

| Resource | Contact/URL |
|----------|-------------|
| Vercel Dashboard | `https://vercel.com/team/project` |
| Supabase Dashboard | `https://supabase.com/dashboard/project/...` |
| Sentry Dashboard | `https://sentry.io/organizations/.../` |
| DNS Provider | (your DNS management URL) |
| Uptime Monitor | (your monitoring dashboard URL) |
| Team Lead | (phone/email) |

---

## Post-Launch Cleanup

After stable for 48+ hours:

- [ ] Remove or rotate any temporary credentials used during setup
- [ ] Increase DNS TTL back to normal (3600+ seconds)
- [ ] Archive pre-launch documentation
- [ ] Write post-launch retrospective (what went well, what to improve)
- [ ] Celebrate. Launching is hard. You did it.
