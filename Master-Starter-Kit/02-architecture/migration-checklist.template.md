# Database Migration Checklist

> Use this checklist before merging any PR that includes database migrations.
> Extracted from the migration strategy guide for quick, daily-use reference.

---

## Pre-Migration

- [ ] Migration has a descriptive name: `YYYYMMDD_HHMMSS_description`
- [ ] Migration is reversible (has a rollback/down function)
- [ ] Migration has been tested locally against a copy of production data
- [ ] No data loss — existing rows are preserved or explicitly migrated
- [ ] Default values are set for new NOT NULL columns on existing tables
- [ ] Large table migrations use batching (not a single ALTER on millions of rows)

## SQL Review

- [ ] No raw `DROP TABLE` or `DROP COLUMN` without data backup plan
- [ ] Indexes are added for new foreign keys and frequently queried columns
- [ ] Enum changes are additive (new values only — never remove or rename)
- [ ] Column type changes are compatible (e.g., `varchar(50)` to `varchar(255)`, not the reverse)
- [ ] Multi-step migrations are ordered correctly (create table before adding FK reference)

## Rollback Plan

- [ ] Rollback script exists and has been tested
- [ ] Rollback does not lose data created after the migration ran
- [ ] If rollback is impossible (destructive migration), this is documented and approved
- [ ] Estimated rollback time: {{ESTIMATED_ROLLBACK_TIME}}

## Post-Migration Verification

- [ ] All application queries still work (run full test suite)
- [ ] ORM schema/types are regenerated (`pnpm db:generate` or equivalent)
- [ ] Seed data script still runs cleanly
- [ ] Application starts without database errors
- [ ] Staging deployment tested before production

## Production Deployment

- [ ] Migration runs during low-traffic window (if table locks are involved)
- [ ] Monitoring is active during migration (watch for slow queries, locks, errors)
- [ ] Team is notified before production migration begins
- [ ] Post-migration smoke test: verify critical user flows work

---

*Paste this checklist into your PR template for any migration-containing PRs.*
