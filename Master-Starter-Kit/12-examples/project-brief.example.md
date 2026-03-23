# Project Brief — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in project brief for a fictional
# project management SaaS. Your project brief will be generated
# during ORCHESTRATOR Step 1 (Discovery & Intake).
# ============================================================

## Product Overview

**Name:** TaskFlow
**Tagline:** Project management for small agencies that actually gets used.
**Description:** A multi-tenant SaaS platform for small creative and digital agencies (5-30 people) to manage projects, track time, coordinate teams, and generate client-facing reports. Replaces the spreadsheet + Slack + email chaos that small agencies default to.

**Core Loop:** A project manager creates a project, breaks it into tasks, assigns team members, tracks time against tasks, and generates a weekly status report for the client.

---

## Business Model

**Revenue:** Monthly SaaS subscription per workspace.
**Pricing tiers:** Free (3 projects, 5 users), Pro ($12/user/mo, unlimited), Agency ($25/user/mo, white-label reports + client portal).
**Who pays:** Agency owner or operations manager.

---

## User Roles

| Role | Description | Core Action | Count |
|------|------------|-------------|-------|
| Admin | Agency owner, billing, team management | Manage workspace settings, view reports | 1-2 per workspace |
| Project Manager | Runs projects, assigns tasks, reports to clients | Create projects, assign tasks, generate reports | 2-5 per workspace |
| Team Member | Executes tasks, logs time | Update task status, log time entries | 5-25 per workspace |

---

## Competitor Analysis

| Competitor | Strength | Weakness | Our Angle |
|-----------|----------|----------|-----------|
| Asana | Feature-rich, enterprise-ready | Overwhelming for small teams, expensive | Simplicity-first |
| Monday.com | Visual, flexible | Complex pricing, slow for large boards | Performance + clarity |
| Basecamp | Simple, opinionated | No time tracking, limited reporting | Built-in time tracking + reports |
| Teamwork | Agency-focused, time tracking | Dated UI, steep learning curve | Modern UI, fast onboarding |

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js 16 | SSR for SEO pages, app router for dashboard |
| API | tRPC | Type-safe, monorepo-friendly, no code generation |
| Database | PostgreSQL 16 | Reliable, JSON support, full-text search |
| ORM | Drizzle | Lightweight, SQL-first, great TypeScript types |
| Auth | Better Auth | Self-hosted, customizable, multi-tenant support |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development, customizable |
| Monorepo | Turborepo + pnpm | Fast builds, workspace isolation |
| Hosting | Vercel (web) + Supabase (DB) | Easy deployment, managed database |

---

## MVP Scope

- **Services:** 7 (Projects, Tasks, Time Tracking, Team, Notifications, Reports, Auth)
- **Screens:** 22 (dashboard, project list/detail, task board, time log, team, settings, reports, auth)
- **Timeline:** 12 weeks
- **Team:** 1 developer + AI assistance
- **Capacity:** ~36 features at 3 features/week

---

## Compliance

- GDPR: Yes (EU customers expected) — need data deletion, export, consent
- SOC 2: Deferred to post-MVP
- HIPAA: Not applicable
- PCI DSS: Not applicable (Stripe handles card data)

---

## Open Questions

1. Client portal (Agency tier) — build in Phase 1 or defer to Phase 3?
2. Mobile app — defer entirely or build responsive web first?
3. Import from Asana/Monday — MVP or post-launch?
