# DR Verification Gate

> **Project:** `{{PROJECT_NAME}}`
> **Verified by:** `{{VERIFIER_NAME}}`
> **Date:** `{{VERIFICATION_DATE}}`
> **Verdict:** {{PASS_OR_FAIL}}

---

> If you can't recover from a database backup in under {{RTO_TARGET}}, your DR plan is fiction.

Store completed verification in: `dev_docs/enforcement-proofs/dr/dr-verification-{{VERIFICATION_DATE}}.md`

---

## 1. Playbook Existence

All 7 DR scenarios must have dedicated playbooks with step-by-step commands (not strategy documents).

| # | DR Scenario | Playbook Exists | Playbook Path | Has Step-by-Step Commands | Pass/Fail |
|---|-------------|----------------|---------------|--------------------------|-----------|
| 1 | Database corruption | | | | |
| 2 | Hosting provider outage | | | | |
| 3 | Ransomware attack | | | | |
| 4 | Region/availability zone loss | | | | |
| 5 | Key person unavailability | | | | |
| 6 | Vendor/service discontinuation | | | | |
| 7 | Data breach | | | | |

**Rule:** "Contact support" is not a step. "Run `pg_restore --dbname={{DB_NAME}} --file=backup.sql` and verify row counts against last known snapshot" is a step. Every playbook must have commands copy-pasteable at 3 AM by someone who is stressed and under-caffeinated.

---

## 2. Backup Verification

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| Backup system is configured and running | | |
| Backup schedule documented (frequency: `{{BACKUP_FREQUENCY}}`) | | |
| Most recent backup timestamp: `{{LAST_BACKUP_TIMESTAMP}}` | | |
| Restore test performed | | |
| Restore test date: `{{RESTORE_TEST_DATE}}` | | |
| Restore log attached (showing successful restore + duration) | | |
| Data integrity verified post-restore (row counts, checksums) | | |
| Restore completed within RTO: `{{RTO_TARGET}}` | | |

**Rule:** An untested backup is not a backup — it is a hope. Restore must be tested within the last 30 days. If the restore test is older than 30 days, consider the backup unverified.

---

## 3. RPO / RTO Documentation

| Metric | Target | Achievable with Current Infrastructure | Tested | Pass/Fail |
|--------|--------|----------------------------------------|--------|-----------|
| RPO (Recovery Point Objective) | `{{RPO_TARGET}}` | | | |
| RTO (Recovery Time Objective) | `{{RTO_TARGET}}` | | | |

**RPO detail:** Maximum acceptable data loss = `{{RPO_TARGET}}`. Backup frequency supports this: {{YES_OR_NO}}.

**RTO detail:** Maximum acceptable downtime = `{{RTO_TARGET}}`. Tested restore time: `{{ACTUAL_RESTORE_TIME}}`. Buffer: `{{RTO_BUFFER}}`.

**Rule:** If RPO is 1 hour but backups run every 24 hours, your RPO is fiction. If RTO is 30 minutes but your restore takes 2 hours, your RTO is fiction.

---

## 4. On-Call & Escalation

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| On-call rotation defined | | |
| On-call schedule covers all hours (24/7 or defined business hours) | | |
| Escalation timeline set: Acknowledge within 5 min | | |
| Escalation timeline set: Assess within 15 min | | |
| Escalation timeline set: Act within 30 min | | |
| Contact info current (phone numbers, email, Slack handles verified) | | |
| Backup on-call person designated for each rotation | | |

**On-call rotation:**

| Period | Primary | Secondary | Contact Method |
|--------|---------|-----------|----------------|
| {{ROTATION_PERIOD_1}} | `{{PRIMARY_1}}` | `{{SECONDARY_1}}` | `{{CONTACT_METHOD}}` |
| {{ROTATION_PERIOD_2}} | `{{PRIMARY_2}}` | `{{SECONDARY_2}}` | `{{CONTACT_METHOD}}` |

---

## 5. Communication Plan

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| Incident communication plan document exists | | |
| Template messages drafted for each severity level | | |
| Stakeholder notification list current | | |
| Customer communication channel identified | | |
| Status page configured (if applicable) | | |
| Post-incident review template exists | | |

---

## 6. Runbook Quality

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| Each runbook has step-by-step commands (not strategy paragraphs) | | |
| Commands are copy-pasteable (no pseudo-code, no "run the appropriate command") | | |
| At least one runbook tested by someone who did NOT write it | | |
| Tester name: `{{RUNBOOK_TESTER}}` | | |
| Tester feedback incorporated | | |
| Environment-specific variables clearly marked | | |

**Rule:** A runbook that requires tribal knowledge to execute is not a runbook — it is a set of hints. The standard: a competent engineer who has never seen the system should be able to execute the runbook and recover the service.

---

## Summary

| Section | Checks | Passed | Failed |
|---------|--------|--------|--------|
| Playbook Existence | 7 | | |
| Backup Verification | 8 | | |
| RPO / RTO | 2 | | |
| On-Call & Escalation | 7 | | |
| Communication Plan | 6 | | |
| Runbook Quality | 6 | | |
| **Total** | **36** | | |

**Gate 9 Verdict:** {{PASS_OR_FAIL}}

**Gate 9 Rule:** ALL sections must pass. Any failure in Playbook Existence, Backup Verification, or RPO/RTO blocks production launch with no exceptions. Failures in On-Call, Communication, or Runbook Quality must be resolved within 48 hours of launch.
