# Audit: Documentation & Ops

> **App:** EconoPulse
> **Dimension:** E1-F
> **Date:** 2026-03-23
> **Rounds completed:** 3/3

---

## Score: 4/10 — Critical

---

## Round 1 Findings (Surface Scan)

**1. README quality:**
`README.md` exists (50 LOC). It covers:
- ✓ Project name and one-line description
- ✓ Live URL
- ✓ Tech stack table
- ✓ Data sources table with provider links
- ✓ Local development setup (backend + frontend)
- ✓ Environment variables list

Missing from README:
- No architecture overview (why two packages? what is `api/index.js`?)
- No contribution guide
- No testing instructions (`npm test` doesn't exist yet)
- No deployment guide (how does Vercel deploy this?)
- No feature list or screenshots
- No badge row (build status, license, coverage)

Assessment: **Partial** — sufficient for a personal project, insufficient for a portfolio/team context.

**2. API reference:** None. No OpenAPI spec, no Swagger, no documented endpoint list in the README. The only way to discover the API shape is to read `backend/routes/*.js` and `frontend/src/api/client.ts`. For a job application context, this is a notable absence.

**3. Deployment guide:** The README mentions `npm run dev` for local development but provides no explanation of how Vercel deploys the app. The `vercel.json` configuration (which routes `/api/*` to `api/index.js` → `backend/server.js`) is undocumented. A new developer looking at the repo would not understand how the SPA + serverless backend work together on Vercel.

**4. Environment variables documented:** `.env.example` exists with all 4 required keys — ✓. However:
- The file contains real API keys (P0 security issue — see E1-D audit).
- No description of what each key is for or where to obtain it.

**5. CHANGELOG / release history:** No `CHANGELOG.md`. Git commit history serves as the only change record:
```
8783e8d Update README with live URL, tech stack, and setup instructions
1d8791b Add Vercel Analytics
75de165 Remove import.meta.env, use /api directly since frontend and backend share same domain
7909731 Add vite/client types to tsconfig to fix import.meta.env TS error
fa31eba Use Node 20.x via engines field in package.json
```
Recent commits are meaningful and well-described. Good git hygiene.

---

## Round 2 Findings (Deep Dive)

**6. Monitoring / observability:**
- No error tracking: No Sentry, no Datadog, no Rollbar. Runtime errors in production are invisible.
- No uptime monitoring: No Vercel monitoring config, no UptimeRobot, no Pingdom.
- No application metrics: No request counts, no latency tracking, no error rate dashboard.
- Logging: Only `console.error('Unhandled error:', err.message)` in the global error handler. No structured logging (no Winston, no Pino). Vercel captures console output but it's not queryable or alertable.

**7. Error logging quality:**
The global error handler at `backend/server.js:28–33`:
```js
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});
```
This logs only the error message — no stack trace, no request ID, no request URL, no user context. Debugging a production error requires guessing which request triggered it.

**8. On-call / incident response plan:** None. No runbook, no escalation path, no severity definitions. For a personal project this is expected — but worth noting that this needs to exist before any team or employer hands this app to production.

**9. Database schema documentation:** No database — not applicable. When a database is added (Postgres for auth/watchlists), schema documentation must be created.

**10. Developer onboarding time:** Based on the README, a new developer could likely get the app running locally in ~20 minutes — the setup instructions are clear. However, understanding the architecture (why `api/index.js`? what's the caching strategy? how does the frontend talk to the backend in production vs. dev?) would require reading the code directly — estimated 2–3 hours.

**11. Architecture decisions documented:** No ADR directory, no decision log. The `vercel.json` routing strategy (SPA + serverless API on the same domain) is a non-obvious architectural choice that is currently undocumented.

---

## Recommendations

Ordered by priority:

1. **[P0]** Fix `.env.example` to use placeholder values — `backend/.env.example` — (Covered in E1-D — cross-reference. This is the only docs-dimension P0.)

2. **[P1]** Add Sentry error tracking to both frontend and backend — `frontend/src/main.tsx`, `backend/server.js` — Sentry free tier is sufficient. The 3-line integration in each entry point gives full stack traces, request context, and alerts for production errors. This is a visible signal of operational maturity on a resume.

3. **[P1]** Document the API endpoints in README or a `docs/api.md` file — All 7 route domains, all endpoints, request/response shapes. This can be auto-generated with `swagger-jsdoc` or written manually in Markdown. For a portfolio project, a clean API reference is impressive.

4. **[P1]** Add architecture section to README explaining the Vercel deployment model — `README.md` — Explain: frontend SPA served as static files, backend as a Vercel serverless function, `api/index.js` as the entry point shim, `vercel.json` routing rules. Add a simple ASCII or Mermaid architecture diagram.

5. **[P2]** Add structured logging with Pino — `backend/server.js` — Replace `console.error` with `pino` logger. Adds JSON-structured log lines with timestamp, level, request method/URL, and error context. Vercel log viewer can filter by level.

6. **[P2]** Create `docs/decisions/` directory with an ADR for the Vercel deployment architecture and one for the upcoming auth approach — `dev_docs/decisions/` — Architecture Decision Records are a standard engineering practice and a differentiator in a portfolio context.

7. **[P3]** Add README badges: build status (GitHub Actions), live URL, license — `README.md` — Visual quality signals. Once CI is set up, the build status badge is one line to add.

---

## Protect List (this dimension)

| File | Score | Reason |
|------|-------|--------|
| `README.md` | 6/10 | Good coverage of setup steps and data sources. Extend with architecture and API docs sections. |

---

## Summary

Documentation is minimal but functional for a personal project — the README is usable, git commit history is clean, and the project can be run from scratch in 20 minutes. The critical gaps for a resume/portfolio context are: no API documentation, no architecture explanation for the Vercel deployment model, no error tracking (Sentry), and the `.env.example` with real credentials (P0, shared with Security audit). Adding Sentry (15 minutes of work) and an API reference (1–2 hours) would visibly elevate the documentation quality to a professional standard.
